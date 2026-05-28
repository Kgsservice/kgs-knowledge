# KGS KMS v22 — Deploy Guide

> v22 = v21 ດ້ວຍ UI ໃໝ່. ບໍ່ມີການປ່ຽນ backend.
> ວັນທີ: 27 ພຶດສະພາ 2026

---

## ໄຟລ໌ໃນຊຸດນີ້

```
kgs-v22/
├── knowledge-base-v22.html        ⭐ Frontend ໃໝ່ (UI ປ່ຽນ)
├── service-worker.js              ⭐ ປ່ຽນ cache key (v21 → v22)
├── firebase.json                  ⭐ Point to v22 HTML
├── firebase-security-rules.json   ⚪ ບໍ່ປ່ຽນ (ຄືກັນກັບ v21)
├── DEPLOY-GUIDE-v22.md            📄 ໄຟລ໌ນີ້
├── CHANGELOG-v22.md               📄 ບັນທຶກການປ່ຽນແປງ
└── functions/
    ├── index.js                   ⚪ ບໍ່ປ່ຽນ (6 Cloud Functions)
    └── package.json               ⚪ ບໍ່ປ່ຽນ
```

**⭐ = ປ່ຽນຈາກ v21** · **⚪ = ໃຊ້ຄືກັນກັບ v21 ໄດ້**

---

## ການ Upgrade ຈາກ v21

### Option A — Deploy ໃໝ່ໝົດ (ແນະນຳ)

```bash
# 1. ໃຊ້ Firebase project ເກົ່າ
firebase use kgs-knowledge

# 2. Deploy hosting + service worker
firebase deploy --only hosting

# 3. Hard refresh browser (ສຳຄັນ!)
# - Mac: Cmd + Shift + R
# - Windows: Ctrl + Shift + R
```

### Option B — ປ່ຽນສະເພາະ HTML

ຖ້າເຈົ້າມີໄຟລ໌ v21 ຢູ່ແລ້ວໃນ hosting:

```bash
# Rename ໃຫ້ກົງ
mv knowledge-base-v22.html knowledge-base-v21.html

# Deploy
firebase deploy --only hosting
```

⚠️ ຖ້າໃຊ້ Option B — ບໍ່ຕ້ອງປ່ຽນ service-worker.js (ໃຊ້ຂອງເກົ່າ).

---

## ສິ່ງທີ່ບໍ່ຕ້ອງເຮັດ

ບໍ່ຕ້ອງ:
- ❌ ປ່ຽນ Security Rules — ໃຊ້ຂອງເກົ່າໄດ້ເລີຍ
- ❌ Re-deploy Cloud Functions — 6 functions ຍັງເຮັດວຽກ
- ❌ Migration script — ໂຄງສ້າງ database ບໍ່ປ່ຽນ
- ❌ Backup database — ບໍ່ມີຂໍ້ມູນປ່ຽນ
- ❌ ປ່ຽນ SendGrid / Anthropic API keys

ບໍ່ຈຳເປັນ:
- ❌ Test ທຸກ functionality — ໃຊ້ logic ດຽວກັນກັບ v21
- ❌ User retraining — UI ປ່ຽນ ແຕ່ workflow ດຽວກັນ

---

## ສິ່ງທີ່ຕ້ອງເຮັດ

✅ **Hard refresh** browser ຫຼັງ deploy (ສຳຄັນທີ່ສຸດ)

ເຫດຜົນ: Service Worker ມີ cache key ໃໝ່ (`kgs-kms-v22`). ໂດຍບໍ່ມີ hard refresh:
- Browser ຈະຍັງສະແດງ UI ເກົ່າ
- Service Worker ເກົ່າຍັງເຮັດວຽກ
- Theme toggle ບໍ່ປະກົດ

**ວິທີ Hard refresh:**
| Browser | Mac | Windows |
|---|---|---|
| Chrome / Edge | `⌘ + Shift + R` | `Ctrl + Shift + R` |
| Safari | `⌘ + Option + R` | — |
| Firefox | `⌘ + Shift + R` | `Ctrl + Shift + R` |

ຫຼື ໄປ DevTools → Application → Service Workers → Unregister ກ່ອນ.

---

## Test ຫຼັງ Deploy

ກວດ 3 ສິ່ງນີ້:

### 1. Theme System
- [ ] ເຫັນ 3 ປຸ່ມໃນ top header: ☀️ ◐ 🌙
- [ ] ກົດ 🌙 → background ປ່ຽນເປັນສີດຳ-ນ້ຳເງິນ
- [ ] ກົດ ☀️ → ກັບສີຂາວ
- [ ] Refresh page → theme ຍັງຄ້າງ

### 2. Login Page
- [ ] Logout → ເຫັນ login ແບບ split-screen
- [ ] ດ້ານຊ້າຍ: hero panel ສີ navy
- [ ] ດ້ານຂວາ: form panel
- [ ] Mobile: hero ບໍ່ປະກົດ (ສະເພາະ form)

### 3. Dashboard
- [ ] Login → ເຫັນ stat cards ໃໝ່
- [ ] Cards ມີ icon + trend badge + mini chart
- [ ] Sidebar ສະເໝີສີ navy (ທັງ light ແລະ dark mode)

---

## Troubleshooting

### ❌ "ຍັງເຫັນ UI ເກົ່າ" ຫຼັງ deploy
ສາເຫດ: Service Worker cache ເກົ່າ.
**ແກ້:** DevTools → Application → Storage → Clear site data → Refresh

### ❌ Theme toggle ບໍ່ປະກົດ
ສາເຫດ: ໂຫລດ HTML ເກົ່າ.
**ແກ້:** Hard refresh + ກວດ DevTools → Sources ວ່າເຫັນ `setTheme` function

### ❌ Dark mode ບໍ່ປ່ຽນສີບາງສ່ວນ
ສາເຫດ: Inline styles ໃນ component ບາງສ່ວນ.
**ແກ້:** ບອກຂ້ອຍ component ໃດ — ຂ້ອຍຈະ fix ໂດຍກົງ

### ❌ Cloud Functions ບໍ່ເຮັດວຽກ
ບໍ່ກ່ຽວກັບ v22 ເລີຍ — ໃຊ້ Functions ດຽວກັນ. ກວດ:
```bash
firebase functions:log
```

---

**KGS 2026** · "Strong systems, ready people, standard service, sustainable growth."
