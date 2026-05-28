# Deploy Guide — v23 (Phase 5A.2b-i)

## 📋 Pre-deployment Checklist

- [ ] ໄດ້ backup `firebase functions:config:get > config-backup.json`
- [ ] ໄດ້ export RTDB: Firebase Console → Realtime Database → Export JSON
- [ ] ມີ `firebase login` ແລ້ວ ແລະ ເລືອກ project ຖືກຕ້ອງ: `firebase use kgs-knowledge`
- [ ] Local test: ເປີດ `knowledge-base-v23.html` ໃນ Chrome → ບໍ່ມີ CSP errors ໃນ Console

---

## 🚀 Deployment Steps

### Step 1 — Extract ZIP
```bash
unzip kgs-kms-v23-complete.zip
cd kgs-v23
```

### Step 2 — Install Cloud Functions dependencies
```bash
cd functions
npm install
cd ..
```

ບໍ່ມີ packages ໃໝ່ໃນ v23 (5A.2b-i). Dependencies ຄືກັນກັບ v22. ໝາຍເຫດ: SheetJS ໂຫລດຈາກ CDN ໃນ frontend, ບໍ່ແມ່ນ npm package.

### Step 3 — Verify config (ບໍ່ປ່ຽນຈາກ v22)
```bash
firebase functions:config:get
```

ຕ້ອງມີ:
- `sendgrid.key`
- `sendgrid.from`
- `anthropic.key`
- `app.url`
- `app.name`

ຖ້າຫາຍ ໃຫ້ຕັ້ງ:
```bash
firebase functions:config:set \
  sendgrid.key="SG.xxxxx" \
  sendgrid.from="noreply@kgs.la" \
  anthropic.key="sk-ant-xxxxx" \
  app.url="https://kgs-knowledge.web.app" \
  app.name="KGS Knowledge Management"
```

### Step 4 — Deploy Security Rules ກ່ອນ
```bash
firebase deploy --only database
```

**ໝາຍເຫດ:** 5A.2b-i ມີການເພີ່ມ audit action `export` ໃນ rules regex. ຕ້ອງ deploy ກ່ອນ ບໍ່ສະນັ້ນ logAudit('export', ...) ຈະ throw PERMISSION_DENIED.

ຄາດໝາຍ output:
```
✔ Deploy complete!
```

### Step 5 — Deploy Hosting
```bash
firebase deploy --only hosting
```

### Step 6 — Deploy Cloud Functions
```bash
firebase deploy --only functions
```

**ບໍ່ມີ functions ໃໝ່ໃນ 5A.2a** (frontend-only round). Functions ທັງ 7 (ລວມ `getNextControlNumber` ຈາກ 5A.1b) deploy ໂດຍບໍ່ມີຄວາມຫຍຸ້ງຍາກ.

ຖ້າຕ້ອງການ skip functions deploy (ບໍ່ມີ code ປ່ຽນ):
```bash
firebase deploy --only hosting
# (rules + functions ບໍ່ປ່ຽນຈາກ 5A.1b)
```

### Step 7 — Post-deploy verification
1. ເປີດ https://kgs-knowledge.web.app ໃນ Incognito window
2. F12 → Console — ບໍ່ມີ "Refused to load" CSP errors
3. F12 → Application → Service Workers — ຄວນເຫັນ `kgs-kms-v23-2026-05-28-5A2b-i`
4. Login ດ້ວຍ test account (admin ຫຼື manager)
5. Upload ໄຟລ໌ໃໝ່ → ກວດເບິ່ງວ່າປະກົດໃນລາຍຊື່
6. Sidebar ສະແດງ "KGS · KMS v23"
7. Footer ສະແດງ "v23.0"

### Step 8 — Smoke test ສຳລັບ 5A.1b (Document Control Number Generator)
1. ໄປ Upload page → ເລືອກ ISO Standard = "ISO 9001"
2. **ກວດ:** Doc Type selector ຈາກ disabled → enabled
3. ເລືອກ Doc Type = "PR — Procedure"
4. **ກວດ:** ປຸ່ມ "ສ້າງເລກອັດຕະໂນມັດ" ຈາກ disabled → enabled
5. Click ປຸ່ມ → Control Number field ຄວນເຕັມ `QMS-PR-001` (ຫຼື higher ຖ້າມີຄົນສ້າງມາແລ້ວ)
6. Click ອີກຄັ້ງ → ໄດ້ `QMS-PR-002`
7. ປ່ຽນ Doc Type = "FM — Form" → Click → ໄດ້ `QMS-FM-001` (counter ໃໝ່ແຍກ)
8. ປ່ຽນ ISO ກັບໄປ "ບໍ່ໃຊ້" → Doc Type ຄວນ disabled + Control Number ຄວນລ້າງ
9. Submit upload ດ້ວຍ ISO ມີ ແຕ່ບໍ່ມີ Control Number → ຄວນ block ດ້ວຍ toast warning
10. ໄປ Audit page → filter "Generate Control No." → ຄວນເຫັນ entries
11. **Database check:** Firebase Console → RTDB → `/counters/QMS/PR` ຄວນເປັນ number = 2
12. **Security check:** Console:
    ```js
    firebase.database().ref('counters/QMS/PR').set(999)
    ```
    ຄວນ throw `PERMISSION_DENIED` (server-only write)

### Step 9 — Smoke test ສຳລັບ 5A.2a (Master Document List)
1. Login ດ້ວຍ **staff** → sidebar **ບໍ່** ມີ "Master List" (ຍ້ອນ "ການຈັດການ" section hidden)
2. Logout → Login ດ້ວຍ **manager** ຫຼື **admin** → sidebar ມີ "Master List" ດ້ວຍ badge ສະແດງຈຳນວນ ISO docs
3. ກົດ "Master List" → ຫົວເລື່ອງ "Master Document List" + breadcrumb "ບັນຊີລາຍຊື່ເອກະສານ ISO ສຳລັບ Audit"
4. **KPI strip 5 ບ່ອນ:** ກວດຕົວເລກກົງກັບຂໍ້ມູນຈິງ (ທັງໝົດ / ISO / Approved / Pending / ໃກ້ໝົດອາຍຸ)
5. **Filters:**
   - ເລືອກ ISO = "ISO 9001 (QMS)" → table ຄວນສະແດງສະເພາະ QMS docs
   - ເລືອກ Doc Type = "PR" → ສະແດງສະເພາະ Procedures
   - ປ້ອນ search "QMS-PR-001" → live filter
   - ກົດ "ລ້າງຕົວກອງ" → reset ທັງໝົດ
6. **Sort:** ກົດ header "Control No." → icon ປ່ຽນເປັນ ▲ + asc; ກົດອີກຄັ້ງ → ▼ + desc
7. **Empty state:** ປ້ອນ search ທີ່ບໍ່ມີ result → ສະແດງ "ບໍ່ພົບເອກະສານ" empty state
8. **Realtime:** ເປີດ tab ໃໝ່ → upload doc ໃໝ່ → ກັບມາ Master List → ຄວນເຫັນ doc ໃໝ່ໂດຍບໍ່ຕ້ອງ refresh
9. **View link:** ກົດ 👁 icon ໃນ action column → navigate ໄປ doc detail
10. **Read-only:** ບໍ່ມີ delete/edit buttons (ສະເພາະ view) — ກວດສຳເລັດແລ້ວ

### Step 10 — Smoke test ສຳລັບ 5A.2b-i (Export Excel)
1. **Library check:** Login manager+ → F12 Console → `typeof XLSX` ຄວນ return `"object"`
2. **Button visible:** ໄປ Master List → ປຸ່ມ "Export Excel" ສະແດງໃນ card header
3. **Empty guard:** ປ້ອນ search "zzz999notexist" → list ວ່າງ → ກົດ Export → toast warning "ບໍ່ມີຂໍ້ມູນໃຫ້ Export"
4. **Full export:** ກົດ "ລ້າງຕົວກອງ" → ກົດ Export → ໄຟລ໌ `KGS-MasterList-YYYY-MM-DD-HHMM.xlsx` ດາວໂຫລດ
5. **Open in Excel/LibreOffice/Google Sheets:**
   - Tab "Master List" — 15 ຄໍລໍາ, freeze top row, AutoFilter ໃຊ້ໄດ້
   - Tab "Metadata" — ມີ KGS info, export date, user, role, filters context
6. **Filter test:** Master List → ເລືອກ ISO=ISO 9001 + Doc Type=PR → Export
   - Excel ມີສະເພາະ QMS-PR docs
   - Metadata sheet ບອກ "Filters Applied: ISO: ISO 9001 · Doc Type: PR"
7. **Audit:** ໄປ Audit Log → filter "Export" → ເຫັນ entry ໃໝ່ດ້ວຍ green badge + icon
8. **Database check:** Firebase Console → `/audit/{newKey}/action` = `"export"`
9. **Staff role test:** Logout → Login ດ້ວຍ staff → ບໍ່ເຫັນ Master List menu (expected)
10. **Permission denied test (security rules):** Firebase Console → ລອງ push entry ດ້ວຍ `action: "unknown_action"` → ຄວນ throw validation error

---

## 🔍 ສິ່ງທີ່ປ່ຽນຈາກ v22 (Quick reference)

| ສ່ວນ | v22 | v23 (5A.2b-i) |
|---|---|---|
| Main HTML | `knowledge-base-v22.html` | `knowledge-base-v23.html` |
| CSP | ບໍ່ມີ | ✅ ມີ (permissive, ຈະ tighten ໃນ 5A.4) |
| Audit action regex | 13 actions | 20 actions (➕ `export` ໃນ 5A.2b-i) |
| Doc status regex | 5 statuses | 6 (ເພີ່ມ `obsolete`) |
| SW cache key | `kgs-kms-v22-2026-05-26` | `kgs-kms-v23-2026-05-28-5A2b-i` |
| Cloud Functions | 6 functions | 7 functions (`getNextControlNumber` ຈາກ 5A.1b) |
| RTDB schema | — | ➕ `/counters/{prefix}/{type}` (5A.1b) |
| Doc schema | — | ➕ `docType` field (5A.1b) |
| Sidebar items | 9 | 10 (➕ Master List, 5A.2a) |
| Pages | 11 | 12 (➕ page-master, 5A.2a) |
| CDN libs | 6 | 7 (➕ SheetJS xlsx@0.18.5, 5A.2b-i) |

---

## 🆘 Troubleshooting

### ບັນຫາ: CSP block resources
**ສະແດງອອກ:** Console → "Refused to load the script/stylesheet/font"
**ການແກ້:**
1. ກວດ URL ທີ່ block ໃນ error message
2. ເພີ່ມເຂົ້າ CSP ໃນ HTML (line ~22 — meta tag `Content-Security-Policy`)
3. Redeploy hosting: `firebase deploy --only hosting`

### ບັນຫາ: Service Worker ບໍ່ update
**ສະແດງອອກ:** Sidebar ຍັງສະແດງ "v21"
**ການແກ້:**
1. F12 → Application → Service Workers → "Unregister"
2. F12 → Application → Storage → "Clear site data"
3. Reload page (Ctrl+Shift+R)

### ບັນຫາ: Security Rules deploy fail
**ສະແດງອອກ:** "Permission denied" ຫຼື "Invalid rules"
**ການແກ້:**
1. ກວດ JSON syntax: `python3 -c "import json; json.load(open('firebase-security-rules.json'))"`
2. ກວດສິດ Firebase admin role
3. Redeploy: `firebase deploy --only database`

---

## ⏪ Rollback Procedure

ຖ້າຕ້ອງການກັບໄປ v22:

```bash
# 1) Re-extract v22
unzip /path/to/kgs-kms-v22-complete.zip

# 2) Deploy v22
cd kgs-v22
firebase deploy --only hosting,database,functions

# 3) User device ຄວນ refresh hard ເພື່ອລົບ SW cache:
# F12 → Application → Clear storage → Reload
```

ໝາຍເຫດ: ຂໍ້ມູນເອກະສານໃນ DB ບໍ່ປ່ຽນ — `docType` field ເປັນ optional, schema backward-compatible. ຖ້າ rollback ໄປ v22, `/counters/` node ຈະຄ້າງຢູ່ (ບໍ່ມີຜົນເສຍ); doc records ທີ່ມີ `docType` ຈະຍັງມີຢູ່ (v22 ບໍ່ໃຊ້ field ນີ້).

---

**KGS 2026** · _"Strong systems, ready people, standard service, sustainable growth."_
