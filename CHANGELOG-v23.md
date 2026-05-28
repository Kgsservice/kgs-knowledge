# Changelog — v23

> KGS Knowledge Management System
> ສະບັບນີ້ເລີ່ມຕົ້ນຈາກ v22 ແລະ ດຳເນີນການຕາມ Phase 5 Roadmap

---

## v23 — Phase 5A.2b-i (ໃນຕ້ອນນີ້)

**ວັນທີ:** 28 ພຶດສະພາ 2026
**ປະເພດ:** Export — ISO audit handoff (Excel)
**Breaking changes:** ບໍ່ມີ — Frontend-only + 1 audit action ໃໝ່

### ✨ Feature ໃໝ່ — Export Excel ສຳລັບ Master List

ສະຮ້າງປຸ່ມ "Export Excel" ໃນ Master List card header (manager+ ເທົ່ານັ້ນ).

**ສິ່ງທີ່ Export ບັນຈຸ:**

| ສ່ວນ | ລາຍລະອຽດ |
|---|---|
| **Sheet 1 "Master List"** | 15 ຄໍລໍາ (Lao + English headers); ມີ AutoFilter + freeze top row |
| **Sheet 2 "Metadata"** | Audit context — export date, exporter, role, total records, filters ທີ່ໃຊ້, sort, version |
| **File name** | `KGS-MasterList-YYYY-MM-DD-HHMM.xlsx` |

**15 ຄໍລໍາ:**
1. Control No. · 2. Doc Type · 3. ຊື່ເອກະສານ · 4. ISO Standard · 5. Revision
6. ສະຖານະ · 7. Effective Date · 8. Review Date · 9. Days to Review · 10. ຜູ້ອອກ
11. ພະແນກ · 12. ໝວດໝູ່ · 13. Visibility · 14. ຂະໜາດ · 15. ອັບໂຫລດເມື່ອ

**Filter context ຮັກສາ:** Export ໃຊ້ list ທີ່ filter + sort ປະຈຸບັນຂອງ Master List (ບໍ່ແມ່ນທັງໝົດ). ຖ້າຕ້ອງການທັງໝົດ → ກົດ "ລ້າງຕົວກອງ" ກ່ອນ.

### 🔧 ສິ່ງທີ່ປ່ຽນ

**Frontend (`knowledge-base-v23.html`):**
- ➕ CDN: `xlsx.full.min.js@0.18.5` (SheetJS) ຈາກ cdnjs
- ➕ Button "Export Excel" ໃນ Master List card header
- ➕ JS functions: `exportMasterListExcel()` + `getMasterListFiltered()` (refactor ຈາກ `renderMasterList`)
- 🔄 `renderMasterList` ໃຊ້ `getMasterListFiltered()` ສະນັ້ນ logic ບໍ່ duplicate
- ➕ Audit page: ເພີ່ມ label/icon/filter/CSS ສຳລັບ action `export`

**Security Rules (`firebase-security-rules.json`):**
- 🔄 Audit action regex: ເພີ່ມ `export` (action ໃໝ່)

**Service Worker:**
- 🔄 Cache version: `kgs-kms-v23-2026-05-28-5A2a` → `kgs-kms-v23-2026-05-28-5A2b-i`
- ➕ Precache: `xlsx.full.min.js`

**CSP:** ບໍ່ປ່ຽນ (cdnjs.cloudflare.com ມີຢູ່ແລ້ວໃນ script-src)

### ✅ ການກວດສອບ (Smoke test ກ່ອນ deploy)

1. **Library load:** F12 Console → `typeof XLSX` → "object"
2. **Button visibility:** Login manager+ → ໄປ Master List → ເຫັນປຸ່ມ "Export Excel" ໃນ header
3. **Empty filter:** ປ້ອນ search ທີ່ບໍ່ມີ result → ກົດ Export → toast warning "ບໍ່ມີຂໍ້ມູນໃຫ້ Export"
4. **Full export:** ລ້າງຕົວກອງ → Export → ໄຟລ໌ `KGS-MasterList-{stamp}.xlsx` download
5. **File integrity:** ເປີດໃນ Excel/LibreOffice:
   - Sheet 1 "Master List" — headers ຖືກຕ້ອງ, AutoFilter ໃຊ້ໄດ້, freeze row
   - Sheet 2 "Metadata" — ມີ exporter, time, filter context
6. **Filtered export:** ເລືອກ ISO=ISO 9001 → Export → ໄຟລ໌ມີສະເພາະ QMS docs + metadata sheet ບອກ filter
7. **Audit log:** ໄປ Audit Log → filter "Export" → ເຫັນ entries ໃໝ່ດ້ວຍ targetName ເຊັ່ນ "Excel · N records · KGS-MasterList-...xlsx"
8. **Permission:** ໃນ Firebase Console → `audit/{newKey}/action` = `"export"` (ບໍ່ throw rule violation)
9. **Staff role:** Login ດ້ວຍ staff → ບໍ່ເຫັນ Master List → ບໍ່ໄດ້ test ປຸ່ມ

### ⚠️ ສິ່ງທີ່ຍັງບໍ່ໄດ້ເຮັດ (ຮອບຖັດໄປ → 5A.2b-ii)

- Export PDF (jsPDF + autoTable + Lao font embedding)
- KGS letterhead + footer ໃນ PDF
- Distribution List → 5A.2c

---

## v23 — Phase 5A.2a

**ວັນທີ:** 28 ພຶດສະພາ 2026
**ປະເພດ:** Document inventory — ISO audit-ready Master List
**Breaking changes:** ບໍ່ມີ — UI-only feature, ບໍ່ມີ schema ຫຼື rules ປ່ຽນ

### ✨ Feature ໃໝ່ — Master Document List

ໜ້າໃໝ່ Read-only ສຳລັບເບິ່ງເອກະສານທັງໝົດໃນຮູບແບບ flat ISO audit reference. ສິ່ງທີ່ມີ:

**KPI strip (5 ບ່ອນ):**
- ທັງໝົດ · ໃນລະບົບ ISO · Approved · ລໍຖ້າອະນຸມັດ · ໃກ້ໝົດອາຍຸ (≤30 ມື້)

**Filters (5 ຕົວ):**
- ISO Standard (ISO 9001 / 14001 / 45001 / IMS / ບໍ່ໃຊ້ ISO)
- Doc Type (PO / PR / WI / FM / RC)
- Status (Approved / Pending / Draft / Rejected / Expired)
- Department (dynamic ຈາກ `/departments`)
- Text search (ຊື່ / Control No. / Description)

**Sortable columns (9 ຄໍລໍາ):**
- Control No. · Type · ຊື່ · ISO · Rev · ສະຖານະ · Effective · Review · ຜູ້ອອກ
- ກົດ header → asc/desc (toggle); icon ຊີ້ທິດທາງ
- Default sort: Control No. ascending

**Expiry indicator** ໃນຄໍລໍາ Review (expired/critical/warning → badge ສີ)

### 🔧 ສິ່ງທີ່ປ່ຽນ

**Frontend (`knowledge-base-v23.html` ເທົ່ານັ້ນ):**
- ➕ Sidebar item ໃໝ່ "Master List" ໃນ section "ການຈັດການ" (manager+ access via existing `adm-nav-mgr`)
- ➕ Page `page-master` (KPI cards + filter card + table card)
- ➕ JS functions: `renderMasterList()`, `filterMasterList()` (inline ໃນ render), `sortMasterList(col)`, `resetMasterFilters()`, `populateMasterDeptFilter()`, `masterCompare()`, `updateMasterBadge()`
- ➕ CSS: `.ml-kpis`, `.ml-kpi`, `.ml-filters`, `.ml-tbl th.ml-sort`, `.ml-doctype-badge`
- 🔄 `bindRealtimeData`: ເພີ່ມ `updateMasterBadge()` + auto-refresh ໜ້າ master ເມື່ອ docs ປ່ຽນ
- 🔄 `showPage` map: ເພີ່ມ route `master`

**Backend:** ບໍ່ມີການປ່ຽນ (read-only ໃຊ້ `documents/.read` ທີ່ມີຢູ່ແລ້ວ)

**Security rules:** ບໍ່ມີການປ່ຽນ

**Service Worker:** Cache version `kgs-kms-v23-2026-05-28-5A1b` → `kgs-kms-v23-2026-05-28-5A2a`

### ✅ ການກວດສອບ (Smoke test ກ່ອນ deploy)

1. **Sidebar:**
   - Login ດ້ວຍ manager ຫຼື admin → ເຫັນ "Master List" ໃນ sidebar
   - Login ດ້ວຍ staff → **ບໍ່ເຫັນ** Master List (ຍ້ອນ section `adm-nav-mgr` hidden ສຳລັບ staff)
2. **Navigation:** ກົດ "Master List" → ໂຫລດ page-master, breadcrumb ສະແດງ "Master Document List"
3. **KPI strip:** 5 ບ່ອນສະແດງຕົວເລກຖືກຕ້ອງ (ກວດໂດຍ cross-check ກັບ "ເອກະສານທັງໝົດ" page)
4. **Filters:**
   - ເລືອກ ISO = "ISO 9001" → table ສະແດງສະເພາະ QMS docs
   - ເລືອກ ISO = "ບໍ່ໃຊ້ ISO" → table ສະແດງສະເພາະ non-ISO docs
   - ປ້ອນ search "QMS-PR" → filter live
   - ກົດ "ລ້າງຕົວກອງ" → reset ທັງໝົດ
5. **Sort:**
   - ກົດ header "Control No." → icon ປ່ຽນເປັນ `fa-sort-up`
   - ກົດອີກຄັ້ງ → ປ່ຽນເປັນ `fa-sort-down` (toggle)
   - ກົດ header ອື່ນ → reset back to asc
6. **Realtime:** ອັບໂຫລດ doc ໃໝ່ໃນ tab ອື່ນ → Master List update ອັດຕະໂນມັດ
7. **View link:** ກົດ eye icon ໃນ action → navigate ໄປ doc detail page

### ⚠️ ສິ່ງທີ່ຍັງບໍ່ໄດ້ເຮັດ (ຮອບຖັດໄປ → 5A.2b)

- ~~Export Excel ສຳລັບ Master List~~ ✅ ສຳເລັດໃນ 5A.2b-i
- Export PDF ສຳລັບ Master List (ISO audit handoff) → 5A.2b-ii
- (Distribution List → 5A.2c)

---

## v23 — Phase 5A.1b

**ວັນທີ:** 28 ພຶດສະພາ 2026
**ປະເພດ:** Document Control — ISO 9001/14001/45001/IMS compliance feature
**Breaking changes:** ບໍ່ມີ (ເອກະສານເກົ່າທີ່ບໍ່ມີ `docType` ຍັງສະແດງປົກກະຕິ)

### ✨ Feature ໃໝ່ — Document Control Number Generator

ສ້າງເລກຄວບຄຸມເອກະສານ ISO ແບບອັດຕະໂນມັດດ້ວຍ format ມາດຕະຖານ:

| ISO Standard | Prefix | Doc Type | Example |
|---|---|---|---|
| ISO 9001 (Quality) | `QMS` | PO/PR/WI/FM/RC | `QMS-PR-001` |
| ISO 14001 (Environment) | `EMS` | PO/PR/WI/FM/RC | `EMS-WI-014` |
| ISO 45001 (OH&S) | `OHS` | PO/PR/WI/FM/RC | `OHS-FM-007` |
| IMS (Integrated) | `IMS` | PO/PR/WI/FM/RC | `IMS-PO-002` |

**Doc Types:** PO (Policy), PR (Procedure), WI (Work Instruction), FM (Form), RC (Record)

### 🔧 ສິ່ງທີ່ປ່ຽນ

**Frontend (`knowledge-base-v23.html`):**
- Upload form: ເພີ່ມ Doc Type selector (disable ເມື່ອ ISO = "ບໍ່ໃຊ້")
- Control Number ປ່ຽນເປັນ readonly + ປຸ່ມ "ສ້າງເລກອັດຕະໂນມັດ" + ປຸ່ມລ້າງ
- Validation ໃໝ່: ISO selected → Control Number + Doc Type ຕ້ອງມີ
- Helpers ໃໝ່: `onIsoChange()`, `onDocTypeChange()`, `generateControlNumber()`, `clearControlNumber()`, `docTypeLabel()`
- Document view: ສະແດງ `docType` ໃນ ISO metadata box
- Audit page: ເພີ່ມ label/icon/filter ສຳລັບ action `generate_control_number`

**Cloud Functions (`functions/index.js`):**
- ➕ Function ທີ 7: `getNextControlNumber(standard, type)` callable
  - Role check: admin ຫຼື manager ເທົ່ານັ້ນ
  - RTDB transaction ໃນ `/counters/{PREFIX}/{TYPE}` → atomic increment
  - Return: `{ controlNumber, standard, prefix, type, sequence }`
  - Audit log ດ້ວຍ action `generate_control_number`

**Security Rules (`firebase-security-rules.json`):**
- ➕ `/counters/{$standard}/{$type}` — read: manager+, **write: false** (server-only)
- ➕ `documents/$docId/docType` validate slot — regex `^(PO|PR|WI|FM|RC)$`

**Service Worker:**
- Cache version: `kgs-kms-v23-2026-05-28` → `kgs-kms-v23-2026-05-28-5A1b`

### 🗄️ Schema ໃໝ່

```
/counters/{PREFIX}/{TYPE}    — Integer counter (server-write only)
                               PREFIX: QMS | EMS | OHS | IMS
                               TYPE:   PO | PR | WI | FM | RC

/documents/{docId}/docType   — String "PO" | "PR" | "WI" | "FM" | "RC"
                               (optional — null ສຳລັບ non-ISO docs)
```

### ✅ ການກວດສອບ (Smoke test ກ່ອນ deploy)

1. **Form behavior:**
   - ເລືອກ ISO = "ບໍ່ໃຊ້" → Doc Type ຄວນ disabled + Generate button disabled
   - ເລືອກ ISO = "ISO 9001" → Doc Type enable, ບໍ່ໄດ້ເລືອກ type → Generate disabled
   - ເລືອກ ISO + Type → Generate enabled
2. **Generate flow:**
   - Click "ສ້າງເລກອັດຕະໂນມັດ" → ໄດ້ format `QMS-PR-001` (NNN ເລີ່ມຈາກ 001)
   - Click ອີກຄັ້ງ (ດ້ວຍ type ດຽວກັນ) → `QMS-PR-002`
   - ປ່ຽນ type → counter ໃໝ່ (ເຊັ່ນ `QMS-FM-001`)
3. **Validation:**
   - Submit ໂດຍບໍ່ມີ control number ແຕ່ມີ ISO → ຄວນ block
4. **Audit:**
   - ໃນ audit page → filter "Generate Control No." → ມີ entry

### ⚠️ ສິ່ງທີ່ຍັງບໍ່ໄດ້ເຮັດ (ຮອບຖັດໄປ → 5A.2a)

- Master Document List page (read-only ຈາກ documents/)
- Export Excel + PDF ສຳລັບ Master List

---

## v23 — Phase 5A.1a

**ວັນທີ:** 28 ພຶດສະພາ 2026
**ປະເພດ:** Foundation + Security baseline
**Breaking changes:** ບໍ່ມີ (functionality ເກົ່າທຸກສິ່ງຮັກສາໄວ້)

### 🔒 Security
- **CSP (Content Security Policy) meta tag**
  - ກຳນົດ `default-src 'self'`
  - Whitelist: Firebase domains, Google Fonts, cdnjs (Font Awesome / Chart.js / pdf.js), Anthropic API
  - ຍັງອະນຸຍາດ `'unsafe-inline'` + `'unsafe-eval'` ສຳລັບ scripts/styles (ຍ້ອນ inline event handlers ຍັງມີຢູ່ — ຈະ tighten ໃນ Phase 5A.4b)
  - ປ້ອງກັນ: External script injection, framing attacks, mixed content
- **Referrer Policy** ຕັ້ງເປັນ `strict-origin-when-cross-origin`
- **Security Rules — Tamper-resistant Audit** (ບໍ່ມີການປ່ຽນ logic, ບັນທຶກໄວ້ສຳລັບ ISO 27001 auditor):
  - Audit log ມີ `.write: "auth != null && !data.exists()"` ແລ້ວ → ບໍ່ສາມາດ update ຫຼື delete ໂດຍຜ່ານ client ໄດ້ (admin SDK ກໍ່ບໍ່ມີໃຫ້ client)
  - Status: ✅ Tamper-resistant ສຳລັບ client-side (Admin SDK ບໍ່ນັບ — ຈະເສີມ hash chain ໃນ Phase 5A.4c)

### 📝 Schema Extensions (Forward-compatible)
- **Audit action vocabulary ຂະຫຍາຍ** (preparing for future rounds):
  - ເພີ່ມ: `generate_control_number`, `distribute`, `obsolete`, `change_request`, `change_approve`, `change_reject`
- **Document status ຂະຫຍາຍ:** ເພີ່ມ `obsolete` (ສຳລັບ Phase 5A.3c)

### 🔧 Infrastructure
- ປ່ຽນຊື່ໄຟລ໌: `knowledge-base-v22.html` → `knowledge-base-v23.html`
- `firebase.json` rewrite destination ປັບເປັນ v23
- Service Worker cache version: `kgs-kms-v22-2026-05-26` → `kgs-kms-v23-2026-05-28`
- Service Worker precache ເພີ່ມ `firebase-functions-compat.js` (ຫາຍຢູ່ v22)
- `Cache-Control: no-cache, must-revalidate` header ສຳລັບ HTML (ໃຫ້ user ໄດ້ build ໃໝ່ໄວ)

### 📚 Documentation
- ປັບປຸງ version strings ທັງໝົດ: title, sidebar, loader, login, footer ຈາກ "v21" → "v23"
- ສ້າງ `CHANGELOG-v23.md`, `DEPLOY-GUIDE-v23.md`
- ປັບປຸງ `CONTEXT-FOR-NEXT-CHAT.md`, `README.md`, `PHASE-5-ROADMAP.md`

### ⚠️ ສິ່ງທີ່ຍັງບໍ່ໄດ້ເຮັດ (ໃນ Phase 5A.1a)
- ~~Document Control Number Generator → Round 5A.1b~~ ✅ ສຳເລັດໃນ 5A.1b
- ~~Master Document List → Round 5A.2a~~ ✅ ສຳເລັດໃນ 5A.2a
- Export Excel/PDF → Round 5A.2b
- Distribution List → Round 5A.2c
- Change Request Workflow → Round 5A.3
- Obsolete Document Handling → Round 5A.3c
- innerHTML cleanup → Round 5A.4
- Rate limiting → Round 5A.4c
- Hash-chain audit log → Round 5A.4c
- PDF audit export → Round 5A.4d
- Retention policy → Round 5A.4d

---

## ການກວດສອບກ່ອນ Deploy

ໃຊ້ checklist ນີ້ກ່ອນ `firebase deploy`:

| ກວດ | ວິທີກວດ | ຄາດໝາຍ |
|---|---|---|
| CSP ບໍ່ block ໂຫລດ | DevTools → Console ໃນ Chrome | ບໍ່ມີ "Refused to load" errors |
| Login ເຮັດວຽກ | Login ດ້ວຍ test account | ເຂົ້າສຸເລະບົບໄດ້ |
| Upload PDF ເຮັດວຽກ | Upload file ໃໝ່ | File ປາກົດໃນລາຍຊື່ |
| Approval workflow | Submit → Approve | Status ປ່ຽນ |
| Audit log ບໍ່ delete ໄດ້ | Console: `firebase.database().ref('audit').child('XXX').remove()` | ຄວນ throw PERMISSION_DENIED |
| Service Worker update | DevTools → Application → Service Workers | Cache version ໃໝ່ປາກົດ |

---

## Rollback Plan

ຖ້າມີບັນຫາ ໃຫ້ deploy v22 ກັບຄືນ:

```bash
# 1) Extract v22 backup
unzip kgs-kms-v22-complete.zip

# 2) Deploy v22
cd kgs-v22
firebase deploy --only hosting,database,functions
```

Service Worker ຈະ clear cache ໂດຍອັດຕະໂນມັດເມື່ອ version ປ່ຽນ.

---

**KGS 2026** · _"Strong systems, ready people, standard service, sustainable growth."_
