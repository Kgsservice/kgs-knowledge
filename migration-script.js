/**
 * ========================================================
 * KGS Knowledge Management System
 * Migration Script: v15 (Base64 in RTDB) → v16 (Firebase Storage)
 * ========================================================
 *
 * ການໃຊ້ງານ:
 *   1. ເປີດໜ້າ v15 ຂອງລະບົບ ແລະ Login ເປັນ Admin
 *   2. ເປີດ Browser Console (F12)
 *   3. ສຳເນົາສະຄຣິບທັງໝົດນີ້ໃສ່ console ແລ້ວ Enter
 *   4. ພິມ migrateAllDocuments() ແລ້ວ Enter
 *   5. ລໍຖ້າຈົນສຳເລັດ (ຈະເຫັນ log ໃນ console)
 *
 * ສິ່ງທີ່ສະຄຣິບນີ້ເຮັດ:
 *   - ອ່ານທຸກໄຟລ໌ໃນ /files (Base64) ຈາກ Realtime DB
 *   - Convert Base64 → Blob → ອັບໂຫລດໄປ Firebase Storage
 *   - ອັບເດດ document metadata ໃຫ້ມີ storagePath
 *   - ບໍ່ລົບຂໍ້ມູນເກົ່າ (ປອດໄພ — ສາມາດ rollback ໄດ້)
 *
 * ⚠️ ຄຳເຕືອນ:
 *   - ກະລຸນາ backup Database ກ່ອນ (Firebase Console → Export JSON)
 *   - ຕ້ອງເປີດ Blaze Plan ກ່ອນ (ບໍ່ດັ່ງນັ້ນ Storage ໃຊ້ບໍ່ໄດ້)
 *   - ຄ່າໃຊ້ຈ່າຍ: ສຳລັບ 1000 ໄຟລ໌ ປະມານ $0 (ຢູ່ໃນ free tier)
 */

(function() {
  'use strict';

  // ກວດສອບວ່າຢູ່ໃນລະບົບ v15 ຫຼື ບໍ່
  if (typeof firebase === 'undefined' || typeof db === 'undefined') {
    console.error('❌ ບໍ່ພົບ Firebase. ກະລຸນາເປີດສະຄຣິບນີ້ໃນໜ້າ v15 ທີ່ Login ແລ້ວ');
    return;
  }

  // Init Storage ຖ້າຍັງບໍ່ໄດ້ init
  let storage;
  try {
    storage = firebase.storage();
  } catch (e) {
    console.error('❌ Firebase Storage ບໍ່ໄດ້ເປີດໃຊ້ງານ. ກະລຸນາໄປ Firebase Console ເພື່ອເປີດ.');
    return;
  }

  /**
   * Convert base64 data URL → Blob
   */
  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  }

  /**
   * ສ້າງ Storage path ໃໝ່ຈາກ document metadata
   */
  function buildStoragePath(docId, doc) {
    const dept = (doc.department || 'general').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const ext = (doc.name || '').split('.').pop().toLowerCase() || 'bin';
    return `files/${dept}/${docId}.${ext}`;
  }

  /**
   * ດຶງຂໍ້ມູນ documents ທັງໝົດ
   */
  async function fetchAllDocuments() {
    const snap = await db.ref('documents').once('value');
    return snap.val() || {};
  }

  /**
   * ດຶງ Base64 data ຂອງເອກະສານໃດໜຶ່ງ
   */
  async function fetchFileData(docId) {
    const snap = await db.ref('files/' + docId).once('value');
    return snap.val();
  }

  /**
   * Upload Blob ໄປ Storage
   */
  async function uploadToStorage(path, blob, metadata) {
    const ref = storage.ref(path);
    const snapshot = await ref.put(blob, { customMetadata: metadata });
    return snapshot.ref.toString();
  }

  /**
   * ອັບເດດ document metadata ໃຫ້ມີ storagePath
   */
  async function updateDocumentMetadata(docId, storagePath) {
    await db.ref('documents/' + docId).update({
      storagePath: storagePath,
      migratedAt: Date.now(),
      migratedFrom: 'v15-base64'
    });
  }

  /**
   * Migrate ໄຟລ໌ດຽວ
   */
  async function migrateOne(docId, doc) {
    try {
      // ຂ້າມຖ້າ migrate ແລ້ວ
      if (doc.storagePath && doc.migratedAt) {
        console.log(`⏭  [${docId}] ${doc.name} — ຍ້າຍແລ້ວ, ຂ້າມ`);
        return { status: 'skipped', docId };
      }

      console.log(`📦 [${docId}] ກຳລັງຍ້າຍ ${doc.name}...`);

      // 1. ດຶງ Base64 data
      const dataURL = await fetchFileData(docId);
      if (!dataURL) {
        console.warn(`⚠  [${docId}] ບໍ່ພົບ file data ໃນ /files/${docId}`);
        return { status: 'no_data', docId };
      }

      // 2. Convert ເປັນ Blob
      const blob = dataURLtoBlob(dataURL);
      console.log(`   → ໄຟລ໌ຂະໜາດ ${(blob.size / 1024).toFixed(1)} KB`);

      // 3. ສ້າງ path ໃໝ່
      const path = buildStoragePath(docId, doc);
      console.log(`   → ອັບໂຫລດໄປ ${path}`);

      // 4. Upload
      await uploadToStorage(path, blob, {
        originalName: doc.name,
        category:     doc.category || '',
        uploadedAt:   String(doc.uploadedAt || Date.now())
      });

      // 5. Update metadata
      await updateDocumentMetadata(docId, path);

      console.log(`✓  [${docId}] ສຳເລັດ`);
      return { status: 'success', docId, path };

    } catch (err) {
      console.error(`✗  [${docId}] ຜິດພາດ:`, err.message);
      return { status: 'error', docId, error: err.message };
    }
  }

  /**
   * Migration ຫຼັກ - ຍ້າຍທຸກໄຟລ໌
   */
  window.migrateAllDocuments = async function(opts) {
    opts = opts || {};
    const dryRun = opts.dryRun === true;
    const batchSize = opts.batchSize || 3;

    console.log('═══════════════════════════════════════════════════');
    console.log('  KGS KMS Migration v15 → v16');
    console.log('═══════════════════════════════════════════════════');
    if (dryRun) console.log('🔍 DRY RUN MODE — ບໍ່ມີການແກ້ໄຂຂໍ້ມູນຈິງ');
    console.log('');

    // ດຶງ documents
    console.log('📚 ກຳລັງໂຫລດລາຍຊື່ເອກະສານ...');
    const docs = await fetchAllDocuments();
    const docIds = Object.keys(docs);

    if (docIds.length === 0) {
      console.log('ℹ  ບໍ່ມີເອກະສານໃຫ້ຍ້າຍ');
      return;
    }

    console.log(`📊 ພົບ ${docIds.length} ເອກະສານ\n`);

    if (dryRun) {
      docIds.forEach(id => {
        const d = docs[id];
        console.log(`  - [${id}] ${d.name} (${d.category || 'no-category'})`);
      });
      console.log('\n🔍 ສິ້ນສຸດ DRY RUN. ໃຊ້ migrateAllDocuments() (ບໍ່ມີ args) ເພື່ອຍ້າຍຈິງ.');
      return;
    }

    // Migrate ເປັນ batch ເພື່ອບໍ່ໃຫ້ overload
    const results = { success: 0, skipped: 0, error: 0, no_data: 0 };
    const errors = [];

    for (let i = 0; i < docIds.length; i += batchSize) {
      const batch = docIds.slice(i, i + batchSize);
      console.log(`\n━━━ Batch ${Math.floor(i / batchSize) + 1} (${batch.length} ໄຟລ໌) ━━━`);

      const batchResults = await Promise.all(
        batch.map(id => migrateOne(id, docs[id]))
      );

      batchResults.forEach(r => {
        results[r.status]++;
        if (r.status === 'error') errors.push(r);
      });

      // ຢຸດໜ້ອຍລະຫວ່າງ batches
      if (i + batchSize < docIds.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    }

    // ສະຫຼຸບ
    console.log('\n═══════════════════════════════════════════════════');
    console.log('  ສະຫຼຸບການຍ້າຍຂໍ້ມູນ');
    console.log('═══════════════════════════════════════════════════');
    console.log(`  ✓ ສຳເລັດ:        ${results.success}`);
    console.log(`  ⏭  ຂ້າມ (migrated): ${results.skipped}`);
    console.log(`  ⚠  ບໍ່ມີ data:     ${results.no_data}`);
    console.log(`  ✗ ຜິດພາດ:         ${results.error}`);
    console.log('═══════════════════════════════════════════════════');

    if (errors.length > 0) {
      console.log('\n❌ ລາຍລະອຽດ errors:');
      errors.forEach(e => console.log(`  - [${e.docId}] ${e.error}`));
    }

    console.log('\n✅ ສຳເລັດ! ກວດສອບໃນ Firebase Storage Console.');
    console.log('   ⚠ ໝາຍເຫດ: ຂໍ້ມູນເກົ່າຍັງຢູ່ໃນ /files/* ໃນ Realtime DB.');
    console.log('   ຫຼັງຈາກກວດສອບແລ້ວວ່າທຸກຢ່າງເຮັດວຽກປົກກະຕິ, ສາມາດລົບໄດ້ດ້ວຍ deleteOldBase64Data().');
  };

  /**
   * ລົບ Base64 data ເກົ່າ (ໃຊ້ດ້ວຍຄວາມລະມັດລະວັງ!)
   */
  window.deleteOldBase64Data = async function() {
    const confirm1 = prompt('⚠ ການລົບນີ້ບໍ່ສາມາດກູ້ຄືນໄດ້! ພິມ "DELETE" ເພື່ອຢືນຢັນ:');
    if (confirm1 !== 'DELETE') {
      console.log('❌ ຍົກເລີກ');
      return;
    }

    console.log('🗑  ກຳລັງລົບ /files/* ຈາກ Realtime DB...');
    await db.ref('files').remove();
    console.log('✓ ລົບສຳເລັດ. /files node ຖືກລົບແລ້ວ.');
  };

  /**
   * ກວດສອບສະຖານະ migration
   */
  window.checkMigrationStatus = async function() {
    const docs = await fetchAllDocuments();
    const ids = Object.keys(docs);

    let migrated = 0, pending = 0;
    ids.forEach(id => {
      if (docs[id].storagePath && docs[id].migratedAt) migrated++;
      else pending++;
    });

    console.log('📊 ສະຖານະ Migration:');
    console.log(`   ທັງໝົດ:       ${ids.length}`);
    console.log(`   ຍ້າຍແລ້ວ:    ${migrated}`);
    console.log(`   ຍັງເຫຼືອ:        ${pending}`);

    if (pending > 0) {
      console.log('\n   ໃຊ້ migrateAllDocuments() ເພື່ອຍ້າຍຕໍ່');
    } else {
      console.log('\n   ✅ ສຳເລັດ 100%!');
    }
  };

  // ສະແດງຄຳແນະນຳ
  console.log('═══════════════════════════════════════════════════');
  console.log('  KGS KMS Migration Tool - ໂຫລດແລ້ວ');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('  ຄຳສັ່ງທີ່ໃຊ້ໄດ້:');
  console.log('');
  console.log('  📋 checkMigrationStatus()');
  console.log('     ກວດເບິ່ງສະຖານະ migration');
  console.log('');
  console.log('  🔍 migrateAllDocuments({ dryRun: true })');
  console.log('     ທົດສອບ (ບໍ່ມີຜົນກະທົບກັບຂໍ້ມູນ)');
  console.log('');
  console.log('  🚀 migrateAllDocuments()');
  console.log('     ຍ້າຍຂໍ້ມູນຈິງ');
  console.log('');
  console.log('  🗑  deleteOldBase64Data()');
  console.log('     ລົບ Base64 ເກົ່າ (ໃຊ້ຫຼັງຈາກ verify ສຳເລັດ)');
  console.log('');
  console.log('═══════════════════════════════════════════════════');

})();
