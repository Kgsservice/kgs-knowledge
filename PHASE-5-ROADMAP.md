# Phase 5 Roadmap — Enterprise Hardening

> ການພັດທະນາ KGS KMS ຈາກ v22 → v23 → v24 → ...
> ເປົ້າໝາຍ: ຍົກລະບົບໃຫ້ກາຍເປັນ enterprise grade
> ສະບັບ: 2.0 · ວັນທີປັບປຸງ: 28 ພຶດສະພາ 2026
> **ປ່ຽນແປງສຳຄັນ:** Phase 5A ແບ່ງເປັນ 12 sub-rounds ນ້ອຍກວ່າ (ດີຂຶ້ນສຳລັບການ delivery ສະຖຽນ)

---

## 🎯 ສະຫຼຸບ

**ສະຖານະປະຈຸບັນ:** v23 — Phase 5A.1a ສຳເລັດ (Foundation + Security baseline)

**ເປົ້າໝາຍ Phase 5:** Score 9.5/10 (Enterprise grade, ISO audit ready)

**ການແບ່ງຮອບໃໝ່:** Sub-rounds ນ້ອຍ — ໃຫ້ delivery ZIP ສົມບູນທຸກຮອບໂດຍບໍ່ break

---

## 📊 Phase 5A — ISO Compliance + Security (12 Sub-rounds)

### ✅ 5A.1a — Foundation + Security Baseline (ສຳເລັດ 28/05/2026)
- CSP headers (permissive, ຈະ tighten ໃນ 5A.4b)
- Version bump v22 → v23
- Tamper-resistant audit log (documented; rules already enforced)
- Schema extensions: audit-action vocabulary + `obsolete` status
- Service Worker cache version bump

### ⏳ 5A.1b — Document Control Number Generator (ຖັດໄປ)
**Files:** HTML, functions/index.js, security rules
- UI: Doc Type selector (PO/PR/WI/FM/RC) + Generate button
- Cloud Function: `getNextControlNumber({standard, type})` ໃຊ້ RTDB transaction
- Schema: `/counters/{STD}/{TYPE}` (server-write only)
- Format: `{PREFIX}-{TYPE}-{NNN}` (e.g. `QMS-PR-001`)
- ບໍ່ໃຫ້ user ປ້ອນເລກເອງເມື່ອມີ ISO

### 📋 5A.2a — Master Document List (read-only)
**Files:** HTML (ໜ້າໃໝ່), security rules (ປັບເລັກນ້ອຍ)
- ໜ້າແຍກໃໝ່: `page=master-list`
- ສະແດງເອກະສານທັງໝົດ + filter ໂດຍ standard/category/status
- Sort, search, print-friendly view
- ບໍ່ມີ export ຍັງ → ໄປ 5A.2b

### 📋 5A.2b — Export Excel + PDF
**Files:** HTML (ເພີ່ມ libs)
- ໃຊ້ SheetJS (xlsx) + pdf-lib (vanilla JS)
- Export Master List → .xlsx + .pdf
- PDF ມີ header KGS logo + ວັນທີ + filters applied

### 📋 5A.2c — Distribution List
**Files:** HTML, functions/index.js, security rules
- ຕໍ່ document: ກຳນົດ users/departments/roles ທີ່ຄວນເຫັນ
- Auto-notification ໃນ approval ໃໝ່
- Optional: Acknowledgement tracking

### 📋 5A.3a — Change Request Schema + Form
**Files:** HTML, security rules
- `/changeRequests/{crId}` schema
- ໜ້າໃໝ່: `page=change-requests`
- Form: Document affected, reason, impact, risk, approver, effective date

### 📋 5A.3b — Change Request Workflow
**Files:** HTML, functions/index.js (email notifications)
- CR submit → approver email notification
- Approve/Reject → status change
- Approved → ສາມາດ upload rev ໃໝ່ໄດ້ (link rev → CR)
- ປ່ຽນ document edit flow: ບັງຄັບ link CR

### 📋 5A.3c — Obsolete Document Handling
**Files:** HTML, functions/index.js, security rules
- ເມື່ອ rev ໃໝ່ approved → rev ເກົ່າ status="obsolete"
- ຍ້າຍໄປ `/documents-archive/`
- Watermark "OBSOLETE" ໃນ PDF (pdf-lib)
- ບໍ່ໃຫ້ download ໂດຍກົງ; Manager+ ເຫັນ archive
- Tab "Archive" ໃນ Manage page

### 📋 5A.4a — innerHTML Cleanup (Phase 1)
**Files:** HTML (refactoring)
- 25 ບ່ອນສຳຄັນ: login, doc list, modal, comments
- ປ່ຽນ → textContent + createElement + appendChild
- ໃຊ້ helper `escapeHTML()` ສຳລັບ user content

### 📋 5A.4b — innerHTML Cleanup (Phase 2) + CSP Tightening
**Files:** HTML
- 32 ບ່ອນທີ່ເຫຼືອ
- ຍ້າຍ inline event handlers → addEventListener
- Tighten CSP: ລົບ 'unsafe-inline' ສຳລັບ scripts
- ຍັງ keep 'unsafe-inline' ສຳລັບ styles (Phase 5B refactor)

### 📋 5A.4c — Rate Limiting + Hash-chain Audit
**Files:** functions/index.js
- Rate limits: `aiSummaryClaude` 10/min, `smartSearch` 30/min per user
- Hash chain: `prevHash` field ໃນ audit, SHA256(action+timestamp+userId+prevHash)
- Verification endpoint ໃນ admin page

### 📋 5A.4d — PDF Audit Export + Retention Policy
**Files:** HTML, functions/index.js
- Audit page: ປຸ່ມ "Export to PDF" → ໃຊ້ pdf-lib
- Filter: date range, user, action type
- Scheduled function `monthlyRetentionCleanup`:
  - Audit log: 7 years (warn ກ່ອນ delete)
  - Obsolete docs: 3 years
  - Notifications: 90 days

---

## 🎨 Phase 5B — Accessibility + UX Polish

**ໄລຍະເວລາ:** 3-4 sub-rounds
**ຄວາມສຳຄັນ:** 🟡 Important

- **5B.1:** ARIA labels (64 buttons) + keyboard navigation
- **5B.2:** Focus indicators + screen reader testing + WCAG AA contrast
- **5B.3:** Loading skeletons + empty states + micro-interactions
- **5B.4:** Code splitting + image lazy loading + bundle <150 KB
- **5B.5:** CSS refactoring (133 inline styles → classes)

---

## 📚 Phase 5C — Documentation + Operations

**ໄລຍະເວລາ:** 3 sub-rounds
**ຄວາມສຳຄັນ:** 🟡 Important (ສຳລັບ ISO audit)

- **5C.1:** User Manual (ລາວ + English, PDF + in-app)
- **5C.2:** Admin SOP + Validation Report (IQ/OQ/PQ)
- **5C.3:** Backup/Recovery Procedure + BCP + Monitoring dashboard

---

## 🔌 Phase 5D — Integration (Optional)

**ໄລຍະເວລາ:** 2-3 sub-rounds
**ຄວາມສຳຄັນ:** 🟢 Nice-to-have

- **5D.1:** SSO (Microsoft 365 / Google Workspace)
- **5D.2:** Slack / Teams webhooks
- **5D.3:** Native mobile app (React Native ຫຼື Flutter)

---

## 📊 Effort Estimation (ປັບປຸງໃໝ່)

| Phase | Sub-rounds | Risk | Value |
|---|---|---|---|
| **5A** | 12 sub-rounds | Low (per round) | 🔴 Critical |
| **5B** | 5 sub-rounds | Low | 🟡 High |
| **5C** | 3 sub-rounds | Low | 🟡 High |
| **5D** | 2-3 sub-rounds | High | 🟢 Medium |

### Recommended Order
1. Phase 5A.1b → 5A.4d (ສະຖຽນ ISO ກ່ອນ)
2. Phase 5B ຫຼື 5C ພ້ອມກັນ
3. Phase 5D ສຸດທ້າຍ

---

## 💰 Cost Impact

| Item | v22 | Phase 5 (ປະມານ) |
|---|---|---|
| Cloud Functions | $5-15/month | $10-20/month |
| Firebase Storage | $0-5 | $5-10 |
| SendGrid | $0-20 | $0-20 |
| Anthropic Claude | $5-15 | $10-25 |
| **Total** | **$10-55** | **$25-75** |

---

## ✅ Definition of Done (per round)

ແຕ່ລະ sub-round ຕ້ອງມີ:
- [ ] Functionality ເກົ່າຍັງເຮັດວຽກ (no breaking changes)
- [ ] ZIP ສົມບູນ deliver ໄດ້
- [ ] CHANGELOG ປັບປຸງ
- [ ] CONTEXT-FOR-NEXT-CHAT.md ປ່ຽນ Progress Tracker
- [ ] Code valid (HTML structure, JSON valid)
- [ ] Deploy guide ປັບປຸງຖ້າມີ steps ໃໝ່

---

**KGS 2026** · _"Strong systems, ready people, standard service, sustainable growth."_
