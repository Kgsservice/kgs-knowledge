# KGS Knowledge Management System — v23

**Khammany General Service** · Vientiane, Lao PDR
**Version:** v23 (Phase 5A.2b-i — 28 May 2026)
**Status:** Production-ready (continuing enterprise hardening)

---

## 📂 Files in this package

| File | Purpose |
|---|---|
| `knowledge-base-v23.html` | Frontend SPA (single-file) |
| `service-worker.js` | PWA offline support + caching |
| `firebase.json` | Hosting + Functions + Database config |
| `firebase-security-rules.json` | RTDB Security Rules |
| `functions/index.js` | Cloud Functions (7 functions) |
| `functions/package.json` | Node.js dependencies |
| `CHANGELOG-v22.md` | History up to v22 |
| `CHANGELOG-v23.md` | What changed in v23 (current) |
| `DEPLOY-GUIDE-v22.md` | v22 deployment reference |
| `DEPLOY-GUIDE-v23.md` | v23 deployment guide (use this!) |
| `CONTEXT-FOR-NEXT-CHAT.md` | Context for Claude continuation |
| `PHASE-5-ROADMAP.md` | Enterprise hardening roadmap |
| `README.md` | This file |

---

## 🚀 Quick Start

### Deploy ໃໝ່ (ບໍ່ມີ project ມາກ່ອນ):
ໃຊ້ `DEPLOY-GUIDE-v22.md` Step-by-step setup ກ່ອນ → ກັບມາ `DEPLOY-GUIDE-v23.md` ສຳລັບການ upgrade.

### Upgrade ຈາກ v22:
```bash
unzip kgs-kms-v23-complete.zip
cd kgs-v23
firebase deploy
```

ລາຍລະອຽດໃນ `DEPLOY-GUIDE-v23.md`.

---

## 📊 What's new in v23

ດີຕາມ Phase 5 Roadmap → Enterprise hardening.

**Phase 5A.2b-i (ສະບັບປະຈຸບັນ):**
- ✅ CSP Headers (Content Security Policy) — 5A.1a
- ✅ Tamper-resistant audit log (documented) — 5A.1a
- ✅ Schema extensions ສຳລັບ future rounds — 5A.1a
- ✅ Version bump v22 → v23 — 5A.1a
- ✅ Document Control Number Generator — 5A.1b
- ✅ 7th Cloud Function: `getNextControlNumber` — 5A.1b
- ✅ `/counters/` schema (server-only write) — 5A.1b
- ✅ Master Document List page — 5A.2a
- ✅ New sidebar item "Master List" (manager+) — 5A.2a
- ✅ **Export Excel for Master List (5A.2b-i)** — 2-sheet workbook (data + audit metadata) ດ້ວຍ SheetJS
- ✅ New audit action `export` ໃນ rules + UI

**ກຳລັງເຮັດໃນ rounds ຖັດໄປ (5A.2b-ii → 5A.4d):**
- Export PDF ສຳລັບ Master List (5A.2b-ii — Lao font embedding)
- Distribution List per document (5A.2c)
- Change Request Workflow (5A.3)
- Obsolete Document Handling + watermark (5A.3c)
- innerHTML XSS cleanup (5A.4a/b)
- Rate limiting in Cloud Functions (5A.4c)
- Hash-chain audit log (5A.4c)
- PDF audit export ສຳລັບ external auditor (5A.4d)
- Retention policy automation (5A.4d)

ລາຍລະອຽດເຕັມ → `PHASE-5-ROADMAP.md` ແລະ `CONTEXT-FOR-NEXT-CHAT.md`.

---

## 🔑 Tech Stack (ບໍ່ປ່ຽນຈາກ v22)

- **Frontend:** Single HTML file, vanilla JS, no framework
- **Backend:** Firebase Realtime Database + Storage + Auth
- **Cloud Functions:** Node.js 20 (asia-southeast1)
- **Email:** SendGrid
- **AI:** Anthropic Claude (Haiku 4.5)
- **PWA:** Service Worker + manifest

---

## 👤 Roles & Permissions (ບໍ່ປ່ຽນ)

| Role | Permissions |
|---|---|
| **admin** | ສິດເຕັມ + approve docs + manage users + delete (ຍົກເວັ້ນ audit log) |
| **manager** | Upload, approve assigned, view confidential |
| **staff** | Upload (ຕ້ອງ approval), view internal |

---

## 🎨 Design System (ບໍ່ປ່ຽນ)

- **Colors:** Brand navy `#0C1829`, blue `#1750A0`, gold `#C49A28`
- **Fonts:** Noto Sans Lao + Inter + JetBrains Mono
- **Theme modes:** Light / Dark / Auto (saved in localStorage)

---

## 📞 Support

ສຳລັບການຊ່ວຍເຫຼືອ ກັບ Claude ໃນແຊັດໃໝ່ — ໃຫ້ອັບໂຫລດ ZIP ນີ້ ແລະ ບອກ Claude ໃຫ້ອ່ານ `CONTEXT-FOR-NEXT-CHAT.md` ກ່ອນ.

---

**KGS 2026** · _"Strong systems, ready people, standard service, sustainable growth."_
