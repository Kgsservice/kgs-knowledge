# KGS KMS v22 — UI Redesign

> ປ່ຽນສະເພາະ design (UI/UX) ຂອງ v21 ດ້ວຍ KGS design language
> ວັນທີ: 27 ພຶດສະພາ 2026

---

## 🎯 ສິ່ງທີ່ປ່ຽນ

**v22 = v21 ດ້ວຍ design ໃໝ່** — ບໍ່ມີການປ່ຽນ functionality ໃດໆ.

ທຸກຟີເຈີ Phase 1-4 ຍັງເຮັດວຽກຄືເກົ່າທຸກຢ່າງ:
- Auth + RBAC (admin/manager/staff)
- Document upload + Storage
- ISO/IMS metadata
- Approval workflow
- Document versioning + Compare
- Tags + Comments
- Notifications (in-app + email via Cloud Functions)
- Expiry tracking + Auto-archive
- Analytics dashboard
- Full-text PDF search
- AI Summary (Claude API)
- Smart Search (Q&A)
- PWA + Service Worker offline
- Cloud Functions (6 functions)

## ✨ ການປ່ຽນແປງດ້ານ Design

### 1. Theme System ໃໝ່
- **Light mode** (default)
- **Dark mode**
- **Auto mode** (ຕາມ OS preference)
- ບັນທຶກ preference ໃນ localStorage
- Theme toggle ຢູ່ top header + login page

### 2. Login Page ໃໝ່ (Split-screen)
- ດ້ານຊ້າຍ: Hero panel ສີ navy ກັບ branding + features
- ດ້ານຂວາ: Form panel ສະອາດ
- Responsive: ໃນ mobile ສະແດງ form ດ້ານດຽວ

### 3. Sidebar ໃໝ່
- ສະເໝີສີ navy (ທັງ light ແລະ dark mode) — ສະແດງ brand identity
- Logo emblem ກັບ gradient
- User chip ດ້ານລຸ່ມ ກັບ role badge ສີຕ່າງກັນ
- Nav badges (counters) ສຳລັບ pending items

### 4. Topbar ໃໝ່
- Title + breadcrumb-style subtitle
- Search bar ກາງ
- Theme toggle (3 buttons)
- Notification bell ກັບ red dot indicator
- Connection status badge

### 5. Stat Cards (KPI) ໃໝ່
- Icon ກັບ semantic color
- Trend badge (+/- ກັບ percentage)
- ໂຕເລກໃຫຍ່ ໃຊ້ Inter font (tabular numerals)
- Mini bar chart 7 ແທ່ງ (gradient)
- Footer ກັບ comparison

### 6. Components Refresh
- **Buttons**: 4 variants (primary, ghost, danger, special) × 2 sizes
- **Cards**: rounded-lg, subtle shadow, hover lift
- **Forms**: 1.5px border, focus ring 3px ສີ blue pale
- **Tables**: uppercase headers ກັບ tracking-wider
- **Modals**: backdrop blur, spring animation
- **Toasts**: border-left ກັບ color-coded type

### 7. Typography
- **Lao**: Noto Sans Lao
- **English/numbers**: Inter (tabular numerals)
- **Code**: JetBrains Mono
- ໂຕເລກໃຫຍ່ໆໃຊ້ letter-spacing tighter (-0.02em)
- Headers ໃຊ້ tracking-tight

### 8. Color System
- Brand: Navy (#0C1829) + Blue (#1750A0) + Gold (#C49A28)
- Light: bg #F7F8FA, cards #FFFFFF
- Dark: bg #0F172A, cards #1A2942
- Semantic: success/warning/danger/info/purple

---

## 📁 ໄຟລ໌

| ໄຟລ໌ | ໜ້າທີ່ | ຂະໜາດ |
|---|---|---|
| `knowledge-base-v22.html` | ⭐ Frontend (UI ໃໝ່) | 201 KB |
| `service-worker.js` | ບໍ່ປ່ຽນ ໃຊ້ຕົວເກົ່າ v20 ໄດ້ | 3.9 KB |
| `firebase-security-rules.json` | ບໍ່ປ່ຽນ ໃຊ້ຕົວເກົ່າ v20/v21 ໄດ້ | 12 KB |
| `functions/index.js` | ບໍ່ປ່ຽນ ໃຊ້ຕົວເກົ່າ v21 ໄດ້ | 32 KB |
| `functions/package.json` | ບໍ່ປ່ຽນ | 0.7 KB |

---

## 🔄 Deploy

ປ່ຽນຊື່ໄຟລ໌ໃໝ່ (ຫຼື rename ໃຫ້ກົງກັບ Firebase Hosting config):

```bash
# ຖ້າໃຊ້ Firebase Hosting
cp knowledge-base-v22.html knowledge-base-v21.html
firebase deploy --only hosting
```

**ບໍ່ຕ້ອງ:**
- ❌ ປ່ຽນ Security Rules
- ❌ Re-deploy Cloud Functions
- ❌ Migration script
- ❌ Backup database (ບໍ່ມີຂໍ້ມູນປ່ຽນ)

**ຕ້ອງ:**
- ✅ Hard refresh browser (Cmd+Shift+R) — ລ້າງ service worker cache

---

## 🧪 Test Checklist

ກວດການເຮັດວຽກວ່າຍັງປົກກະຕິ:

### Theme
- [ ] ກົດ ☀️ → ປ່ຽນເປັນ light mode
- [ ] ກົດ 🌙 → ປ່ຽນເປັນ dark mode
- [ ] ກົດ ◐ → auto (ຕາມ OS)
- [ ] Refresh ແລ້ວ theme ຍັງຄ້າງ (localStorage)
- [ ] Sidebar ຄົງເປັນ navy ໃນທັງ 2 mode

### Login
- [ ] Login page ສະແດງ split-screen
- [ ] Form ໃຊ້ໄດ້ປົກກະຕິ
- [ ] Login ສຳເລັດ → ໄປ dashboard
- [ ] Mobile: hero panel ບໍ່ສະແດງ

### Dashboard
- [ ] Stat cards 4 ໃບສະແດງ
- [ ] Mini bar charts render
- [ ] Trend badges ສະແດງສີຖືກຕ້ອງ

### Functionality (ບໍ່ປ່ຽນ)
- [ ] Upload document
- [ ] Approval workflow
- [ ] AI Summary
- [ ] Smart Search
- [ ] ທຸກ feature ຂອງ v21 ຍັງເຮັດວຽກ

---

**KGS 2026** · _"Strong systems, ready people, standard service, sustainable growth."_
