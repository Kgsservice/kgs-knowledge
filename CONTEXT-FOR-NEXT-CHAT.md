# Context for Next Chat — KGS KMS v23 → v23 (continued) ຫຼື → v24

> ⚠️ **ສຳລັບ Claude ໃນແຊັດໃໝ່**: ກະລຸນາອ່ານໄຟລ໌ນີ້ກ່ອນເລີ່ມເຮັດວຽກ.
> ໄຟລ໌ນີ້ສະຫຼຸບສິ່ງທີ່ເຮັດແລ້ວ ແລະ ສິ່ງທີ່ຕ້ອງເຮັດຕໍ່.

> **ສະຖານະປະຈຸບັນ:** Phase 5A.2b-i ✅ ສຳເລັດ (28/05/2026) → ຮອບຖັດໄປ: 5A.2b-ii (PDF export)

---

## 👤 ກ່ຽວກັບລູກຄ້າ

**ບໍລິສັດ:** Khammany General Service (KGS)
**ທີ່ຕັ້ງ:** ນະຄອນຫຼວງວຽງຈັນ, ສ.ປ.ປ. ລາວ
**ທຸລະກິດ:** Facilities management — Cleaning, Gardening/Landscaping, Pest Control
**ລູກຄ້າເປົ້າໝາຍ:** Commercial, Hospitality, Industrial, Public sector
**Position:** Premium market segment (ບໍ່ໃຊ້ລາຄາຕ່ຳເປັນຈຸດຂາຍ)
**Strategic 2026:** _"Strong systems, ready people, standard service, sustainable growth."_

**ISO Compliance:** ໃຊ້ Integrated Management System (IMS) ຮັບຮອງ ISO 9001, 14001, 45001

---

## 📋 ສິ່ງສຳຄັນທີ່ຕ້ອງຮູ້

### ພາສາ
- **ພາສາຫຼັກ:** ລາວ (ພາສາລາວ)
- ຮັກສາຄຳສັບ English ທີ່ມາດຕະຖານ: ISO, KPI, IMS, RBAC, CSP, ແລະ ອື່ນໆ
- ຕອບເປັນພາສາທີ່ user ໃຊ້

### Style
- ໃຊ້ tables ມີ headers ຊັດເຈນເມື່ອນຳສະເໜີ data
- ຫຼີກລ່ຽງ hedging — ກົງໄປກົງມາ ແບບມືອາຊີບ
- Format ສຳລັບ A4 + Lao-compatible fonts
- ສ້າງ interactive visual ກ່ອນ ແລ້ວຕາມດ້ວຍ Word/Excel files

### ສິ່ງທີ່ຕ້ອງລະວັງ
- **ບໍ່ສ້າງໄຟລ໌ໃໝ່ໂດຍບໍ່ຈຳເປັນ** — User ບໍ່ຊອບເມື່ອຂ້ອຍສ້າງໄຟລ໌ແຍກໂດຍບໍ່ຖາມ
- ຖ້າສົງໄສ → **ຖາມກ່ອນ**
- ສົ່ງ **ZIP ສົມບູນ** ໃນແຕ່ລະຮອບ ບໍ່ສົ່ງສະເພາະບາງໄຟລ໌
- ຮັກສາ functionality ເກົ່າທຸກຄັ້ງ — ບໍ່ໃຫ້ breaking changes
- **ແບ່ງ Round ໃຫ້ນ້ອຍ** — Phase 5A ໄດ້ແບ່ງເປັນ 12 sub-rounds ໃນແຜນຂ້າງລຸ່ມ

---

## 🛠 ສະຖານະປະຈຸບັນ (v23 — Phase 5A.2b-i ສຳເລັດ)

### Tech Stack
- **Frontend:** Single HTML file (vanilla JS, no framework) — `knowledge-base-v23.html`
- **Backend:** Firebase Realtime Database + Storage + Auth
- **Cloud Functions:** Node.js 20 (asia-southeast1), 7 functions
- **Email:** SendGrid
- **AI:** Anthropic Claude (Haiku 4.5)
- **PWA:** Service Worker + manifest

### Architecture
```
Browser (HTML/JS)
    ↕
Firebase Auth + RTDB + Storage
    ↕
Cloud Functions (7 functions)
    ├── sendApprovalEmail     (RTDB trigger)
    ├── sendCommentEmail      (RTDB trigger)
    ├── dailyExpiryCheck      (Scheduled 08:00)
    ├── weeklyKpiReport       (Scheduled Mon 09:00)
    ├── aiSummaryClaude       (Callable → Claude API)
    ├── smartSearch           (Callable → Claude API)
    └── getNextControlNumber  (Callable → RTDB transaction) ← NEW 5A.1b
```

### Database Schema
```
/users/{uid}                   — User profiles + roles
/documents/{docId}             — Document metadata (ມີ docType ໃໝ່)
/docIndex/{docId}              — Full-text search index
/audit/                        — Audit log (push key, tamper-resistant)
/comments/{docId}/{cmtId}      — Comments
/notifications/{uid}           — In-app notifications
/versions/{docId}/{verId}      — Document versions
/departments/{deptId}          — Departments
/categories/{catId}            — Categories
/counters/{PREFIX}/{TYPE}      — ISO doc number counters ← NEW 5A.1b
                                  (server-only write, manager+ read)
/settings                      — System settings

(ກຳລັງເຕັມເພີ່ມໃນ rounds ຖັດໄປ:)
/changeRequests/{crId}         — Change Request Workflow (5A.3)
```

### Roles (3) — ບໍ່ປ່ຽນ
| Role | Permissions |
|---|---|
| **admin** | ສິດເຕັມ + approve docs + manage users + delete (ຍົກເວັ້ນ audit) |
| **manager** | Upload, approve assigned, view confidential |
| **staff** | Upload (with approval), view internal |

### Visibility Levels (5) — ບໍ່ປ່ຽນ
public · internal · restricted · confidential · department

### Departments (9)
HR, Finance, Operations, Sales, Marketing, IT, Legal, Quality (QHSE), Cleaning Services

### Document Categories (11)
QMS, EMS, OHS, IMS, Policy, Procedure, Work Instruction, Form, Record, External Document, Other

---

## 📐 Design System (ບໍ່ປ່ຽນຈາກ v22)

### Colors
```css
--brand-navy:        #0C1829   /* Sidebar always */
--brand-blue:        #1750A0   /* Primary action */
--brand-gold:        #C49A28   /* Highlights */

/* Semantic */
--green: #1A7340   --green-bg: #E6F4EB
--amber: #D97706   --amber-bg: #FEF3C7
--red:   #C53030   --red-bg:   #FEE2E2
--purple: #7E22CE  --purple-bg: #F3E8FF
```

### Typography
- **Lao:** Noto Sans Lao (400, 500, 600, 700)
- **English/Numbers:** Inter (tabular numerals)
- **Code:** JetBrains Mono

### Theme Modes
- `data-theme="light"` (default)
- `data-theme="dark"`
- `data-theme="auto"` (follows OS)
- Saved in localStorage as `kgs-theme`

---

## ✅ Phase 5A — Progress Tracker

ໄດ້ແບ່ງ Phase 5A ເປັນ 12 sub-rounds ນ້ອຍກວ່າ:

| Round | ສິ່ງທີ່ເຮັດ | Status |
|---|---|---|
| **5A.1a** | CSP headers, version bump, security rules baseline | ✅ ສຳເລັດ (28/05/2026) |
| **5A.1b** | Document Control Number Generator (UI + Cloud Function + counters/) | ✅ ສຳເລັດ (28/05/2026) |
| **5A.2a** | Master Document List page (read-only) | ✅ ສຳເລັດ (28/05/2026) |
| **5A.2b-i** | Export Excel ສຳລັບ Master List (SheetJS) | ✅ ສຳເລັດ (28/05/2026) |
| **5A.2b-ii** | Export PDF ສຳລັບ Master List (jsPDF + Lao font) | ⏳ ຖັດໄປ |
| **5A.2c** | Distribution List per document | 📋 ລໍຖ້າ |
| **5A.3a** | Change Request schema + form | 📋 ລໍຖ້າ |
| **5A.3b** | Change Request approval workflow | 📋 ລໍຖ້າ |
| **5A.3c** | Obsolete Document Handling + watermark | 📋 ລໍຖ້າ |
| **5A.4a** | innerHTML cleanup (25 ບ່ອນສຳຄັນ) | 📋 ລໍຖ້າ |
| **5A.4b** | innerHTML cleanup ສ່ວນທີ່ເຫຼືອ + tighten CSP | 📋 ລໍຖ້າ |
| **5A.4c** | Rate limiting + hash-chain audit | 📋 ລໍຖ້າ |
| **5A.4d** | PDF audit export + retention policy | 📋 ລໍຖ້າ |

ຫຼັງຈາກນັ້ນ Phase 5B (UX/a11y), 5C (docs/ops), 5D (integration) — ດັ່ງເດີມ.

---

## 🎯 ສິ່ງທີ່ຕ້ອງເຮັດໃນຮອບຖັດໄປ (5A.2b-ii)

**Export PDF ສຳລັບ Master List (Lao font support):**

1. **CDN ໃໝ່:**
   - `jspdf@2.5.1` (cdnjs) — PDF generation
   - `jspdf-autotable@3.8.0` (cdnjs) — table support
   - Lao font: ໂຫລດ Noto Sans Lao .ttf → convert ເປັນ base64 → embed ໃນ jsPDF
     - ທາງເລືອກ: ໃຊ້ `jsPDF.addFileToVFS()` + `jsPDF.addFont()` ໃນ runtime
     - ໂຫລດ .ttf ຈາກ Google Fonts API ຫຼື bundle ໃນ /assets/

2. **HTML — ປຸ່ມໃໝ່:**
   - ເພີ່ມ "Export PDF" ຂ້າງ "Export Excel" ໃນ Master List header
   - Icon: `fa-file-pdf` (ສີແດງ Adobe)

3. **JS function ໃໝ່:** `exportMasterListPdf()`
   - Landscape A4 (297×210mm)
   - KGS letterhead header: logo + ຊື່ບໍລິສັດ + ທີ່ຢູ່
   - Title: "Master Document List"
   - Sub-header: Generated by · Date · Filter context · Total records
   - AutoTable with 9 cols (ບໍ່ໃຫ້ overcrowded ໃນ A4): Control No., Type, Name, ISO, Rev, Status, Effective, Review, Issuer
   - Footer: page X of Y · KGS confidentiality notice · Document Version
   - File name: `KGS-MasterList-YYYY-MM-DD-HHMM.pdf`
   - `logAudit('export', null, 'PDF · N records · filename')`

4. **CSP/SW:**
   - cdnjs ມີໃນ script-src ແລ້ວ (ບໍ່ປ່ຽນ)
   - SW precache: jspdf + jspdf-autotable + Lao font URL

5. **Style sharing:** ໃຊ້ `getMasterListFiltered()` ທີ່ມີຢູ່ແລ້ວ (refactored ໃນ 5A.2b-i)

**Challenge:** Lao font ໃນ jsPDF — Noto Sans Lao .ttf ~200KB → base64 encode → ~270KB inline. ຄວນ lazy-load (download font when Export PDF is first clicked, cache ໃນ IndexedDB ຫຼື in-memory variable).

ປະມານ 6-9 tool calls ໃນຮອບຖັດໄປ.

---

## 📚 ສິ່ງທີ່ສຳເລັດແລ້ວໃນ 5A.2b-i (ສຳລັບອ້າງອີງ)

**Export Excel for Master List:**

- ✅ CDN: SheetJS xlsx@0.18.5 ຈາກ cdnjs
- ✅ Button "Export Excel" ໃນ Master List card header
- ✅ JS: `exportMasterListExcel()` — 2-sheet workbook (data + audit metadata)
- ✅ JS refactor: `getMasterListFiltered()` shared helper (avoid duplication)
- ✅ 15 columns Lao+English headers, freeze top row, AutoFilter
- ✅ Filename: `KGS-MasterList-YYYY-MM-DD-HHMM.xlsx`
- ✅ Audit action `export` ໃໝ່ ໃນ security rules regex
- ✅ Audit page: label/icon/filter/CSS ສຳລັບ `export`
- ✅ Service Worker: precache xlsx.full.min.js + cache version bump

---

## 📚 ສິ່ງທີ່ສຳເລັດແລ້ວໃນ 5A.2a (ສຳລັບອ້າງອີງ)

**Master Document List page:**

- ✅ ໜ້າໃໝ່ `page-master` — read-only ISO inventory
- ✅ Sidebar item "Master List" ໃນ section "ການຈັດການ" (manager+ access)
- ✅ KPI strip 5 ບ່ອນ (ທັງໝົດ / ISO / Approved / Pending / ໃກ້ໝົດອາຍຸ)
- ✅ Filters 5 ຕົວ: ISO, Doc Type, Status, Department, search
- ✅ Sortable columns 9 ຄໍລໍາ: Control No., Type, Name, ISO, Rev, Status, Effective, Review, Issuer
- ✅ Expiry indicator ໃນຄໍລໍາ Review
- ✅ Auto-refresh ຈາກ realtime data
- ✅ Sidebar badge `nb-master` ສະແດງຈຳນວນ ISO docs

**ບໍ່ມີ backend ປ່ຽນ:** ໃຊ້ `documents/.read` ທີ່ມີຢູ່ + helpers ເກົ່າ (isoLabelOf, wfLabel, docTypeLabel, expiryStatus).

**Functions ໃໝ່ໃນ HTML:**
- `renderMasterList()` — main render + KPI + sort indicators
- `getMasterListFiltered()` — shared filter+sort pipeline (added in 5A.2b-i refactor)
- `sortMasterList(col)` — toggle asc/desc
- `resetMasterFilters()` — reset all 5 filters + default sort
- `masterCompare(a, b, col)` — locale-aware sort (lo)
- `populateMasterDeptFilter()` — dynamic dept dropdown
- `updateMasterBadge()` — sidebar count

---

## 📚 ສິ່ງທີ່ສຳເລັດແລ້ວໃນ 5A.1b (ສຳລັບອ້າງອີງ)

**Document Control Number Generator:**

- ✅ HTML upload form: Doc Type selector + readonly Control Number + ປຸ່ມ generate/clear
- ✅ JS helpers: `onIsoChange()`, `onDocTypeChange()`, `generateControlNumber()`, `clearControlNumber()`, `docTypeLabel()`
- ✅ Validation: ISO selected → Control Number + Doc Type ຕ້ອງມີ
- ✅ Cloud Function ໃໝ່: `getNextControlNumber({ standard, type })` — RTDB transaction, audit log, role check
- ✅ Security rules: `/counters/{$std}/{$type}` (server-only write); `docType` validator (PO|PR|WI|FM|RC)
- ✅ Doc view: ສະແດງ docType ໃນ ISO metadata
- ✅ Audit page: ເພີ່ມ label/icon/filter ສຳລັບ action `generate_control_number`
- ✅ Version bump: SW cache `kgs-kms-v23-2026-05-28-5A2b-i`

---

## 📝 ການເລີ່ມຕົ້ນແຊັດໃໝ່ (ສຳລັບ user)

### Template:

```
ສະບາຍດີ, ສືບຕໍ່ KGS KMS v23 → Round 5A.2b-ii
ນີ້ແມ່ນ context → [ອັບໂຫລດ ZIP ໃໝ່ສຸດ]
ກະລຸນາອ່ານ CONTEXT-FOR-NEXT-CHAT.md ກ່ອນ
ແລ້ວເຮັດ Export PDF ສຳລັບ Master List (jsPDF + Lao font)
```

### ສິ່ງທີ່ Claude ໃໝ່ຄວນເຮັດ:

1. **ອ່ານໄຟລ໌ນີ້** (CONTEXT-FOR-NEXT-CHAT.md)
2. **ກວດ Progress Tracker** ຂ້າງເທິງ — ຮູ້ວ່າຢູ່ Round ໃດ
3. **ເຮັດ 1 round ນ້ອຍ ໃນ 1 ແຊັດ** ບໍ່ໃຫ້ໃຫຍ່ເກີນ → ສົ່ງ ZIP
4. **ບໍ່ສ້າງໄຟລ໌ໃໝ່** ໂດຍບໍ່ຈຳເປັນ
5. **ບໍ່ break functionality ເກົ່າ**

---

## 🔐 ຂໍ້ມູນລັບ (DO NOT COMMIT TO GIT)

### Firebase Service Account
ໄຟລ໌ `service-account.json` ບໍ່ຄວນຢູ່ໃນ ZIP ນີ້.
ດາວໂຫລດຈາກ Firebase Console: Settings → Service accounts.

### API Keys
- **SendGrid:** `SG.xxxxxxxxxxxxx` (ໃນ Firebase config)
- **Anthropic:** `sk-ant-api03-xxxxxxxxxxxxx` (ໃນ Firebase config)
- **Firebase API Key:** `AIzaSyDYdp4WbuJzzXvQ5Y4_vE-QfIFsIOD8920` (ສາມາດເປີດເຜີຍໄດ້ ເພາະຖືກປ້ອງກັນດ້ວຍ Security Rules)

ປ່ຽນ keys ດ້ວຍຕົນເອງ:
```bash
firebase functions:config:set \
  sendgrid.key="YOUR_KEY" \
  anthropic.key="YOUR_KEY"
```

---

## 📞 ຄຳແນະນຳສຳລັບ Claude ໃໝ່

- ຖ້າ user ບອກ "ສືບຕໍ່" → ກວດ Progress Tracker → ເຮັດ round ຖັດໄປເທົ່ານັ້ນ
- ຖ້າ user ບອກ "Phase 5A round X" → ເຮັດ round ນັ້ນເທົ່ານັ້ນ
- ຖ້າສົງໄສ → ຖາມ user ກ່ອນ. ຢ່າເດົາ.

**KGS 2026** · _"Strong systems, ready people, standard service, sustainable growth."_
