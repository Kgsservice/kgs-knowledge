# KGS Knowledge Management System v16 — ຄູ່ມືຕັ້ງຄ່າ

> Khammany General Service · Phase 1 Setup Guide
> ສຳລັບ Super Admin / IT ຜູ້ຈັດການລະບົບ

---

## ສາລະບານ

1. [ການກຽມຄວາມພ້ອມ](#1-ການກຽມຄວາມພ້ອມ)
2. [ການເປີດ Blaze Plan + ຕັ້ງເພດານງົບປະມານ](#2-blaze-plan)
3. [ການເປີດ Authentication](#3-authentication)
4. [ການເປີດ Firebase Storage](#4-storage)
5. [ການຕິດຕັ້ງ Database Rules](#5-database-rules)
6. [ການຕິດຕັ້ງ Storage Rules](#6-storage-rules)
7. [ການສ້າງ Super Admin ຄົນທຳອິດ](#7-super-admin)
8. [ການ Deploy ແອັບ](#8-deploy)
9. [ການແກ້ໄຂບັນຫາທົ່ວໄປ](#9-troubleshooting)

---

## 1. ການກຽມຄວາມພ້ອມ

### ສິ່ງທີ່ຈຳເປັນ
- ບັນຊີ Google ທີ່ມີ Firebase project `kgs-knowledge` ຢູ່ແລ້ວ
- ບັດເຄຣດິດ ຫຼື ບັນຊີຊຳລະຂອງ Google (ສຳລັບ Blaze plan)
- ໄຟລ໌ `knowledge-base-v16.html` ແລະ ໄຟລ໌ Rules ທີ່ໄດ້ມາ

### Project ປະຈຸບັນ
```
Project ID:     kgs-knowledge
Database URL:   https://kgs-knowledge-default-rtdb.asia-southeast1.firebasedatabase.app
Auth Domain:    kgs-knowledge.firebaseapp.com
Storage Bucket: kgs-knowledge.firebasestorage.app
```

---

## 2. ການເປີດ Blaze Plan + ຕັ້ງເພດານງົບປະມານ {#2-blaze-plan}

### 2.1 ອັບເກຣດເປັນ Blaze
1. ເຂົ້າ [Firebase Console](https://console.firebase.google.com/project/kgs-knowledge)
2. ໄປທີ່ມຸມຊ້າຍລ່າງ → ກົດ **"Upgrade"** (ສະຖານະປະຈຸບັນ: Spark)
3. ເລືອກ **"Blaze - Pay as you go"**
4. ເຊື່ອມຕໍ່ບັນຊີຊຳລະ (Billing Account) ຂອງ Google Cloud
5. ກົດ **Purchase / Confirm**

### 2.2 ຕັ້ງເພດານງົບປະມານ (ສຳຄັນ!)
ປ້ອງກັນຄ່າໃຊ້ຈ່າຍບານປາຍ:

1. ໃນ Firebase Console → **⚙ Settings** → **Usage and billing** → **Details & settings**
2. ກົດ **"Modify plan"** → **"Set budget"**
3. ກຳນົດເພດານ: ແນະນຳ **$5 USD/ເດືອນ** ສຳລັບເລີ່ມຕົ້ນ
4. ຕັ້ງ alert thresholds:
   - 50% → ສົ່ງ email ເຕືອນ
   - 90% → ສົ່ງ email ເຕືອນ
   - 100% → ສົ່ງ email ເຕືອນ

### 2.3 (ທາງເລືອກ) ຕັ້ງ Hard Limit ໃນ Google Cloud
ຖ້າຕ້ອງການໃຫ້ລະບົບ **ປິດອັດຕະໂນມັດ** ເມື່ອຮອດງົບປະມານ:

1. ເຂົ້າ [Google Cloud Console](https://console.cloud.google.com/billing) → Billing
2. Budgets & alerts → ສ້າງ Budget alert
3. ເຊື່ອມໂຍງກັບ Cloud Function ທີ່ປິດ project ເມື່ອຮອດເພດານ
4. (ບໍ່ບັງຄັບ — ສຳລັບອົງກອນທີ່ຕ້ອງການຄວບຄຸມເຂັ້ມງວດ)

---

## 3. ການເປີດ Authentication {#3-authentication}

### 3.1 ເປີດໂມດູນ Authentication
1. Firebase Console → ເມນູຊ້າຍ → **Build** → **Authentication**
2. ກົດ **"Get started"**

### 3.2 ເປີດໃຊ້ Email/Password
1. ແທັບ **Sign-in method**
2. ກົດ **Email/Password** → **Enable** → **Save**
3. (ບໍ່ຈຳເປັນ) ເປີດ **Email link (passwordless sign-in)** ຖ້າຕ້ອງການ

### 3.3 ກຳນົດ Authorized Domains
1. ແທັບ **Settings** → **Authorized domains**
2. ກວດໃຫ້ມີ:
   - `kgs-knowledge.firebaseapp.com` (default)
   - `localhost` (ສຳລັບ test)
   - Domain ຂອງເຈົ້າເອງ (ຖ້າມີ, ເຊັ່ນ `kms.kgs.la`)

### 3.4 ປັບແຕ່ງ Email Templates (ບໍ່ບັງຄັບ)
1. ແທັບ **Templates**
2. ປ່ຽນ Email reset password ໃຫ້ເປັນພາສາລາວ ຫຼື ໃສ່ logo KGS

---

## 4. ການເປີດ Firebase Storage {#4-storage}

### 4.1 Initialize Storage
1. Firebase Console → ເມນູຊ້າຍ → **Build** → **Storage**
2. ກົດ **"Get started"**
3. ເລືອກ **"Start in production mode"** (ບໍ່ແມ່ນ test mode!)
4. ເລືອກ location: **asia-southeast1 (Singapore)** ← ໃກ້ກັບລາວທີ່ສຸດ
5. ກົດ **Done**

### 4.2 ກວດເບິ່ງ Bucket
- Storage bucket URL ຄວນເປັນ: `kgs-knowledge.firebasestorage.app`
- ຖ້າເຫັນແທນ `kgs-knowledge.appspot.com` ກໍຍັງໃຊ້ໄດ້ປົກກະຕິ

---

## 5. ການຕິດຕັ້ງ Database Rules {#5-database-rules}

### 5.1 ໂຫລດ Rules
1. Firebase Console → **Realtime Database** → ແທັບ **Rules**
2. ລົບເນື້ອຫາທີ່ມີຢູ່ທັງໝົດ
3. ສຳເນົາເນື້ອຫາຈາກໄຟລ໌ `firebase-security-rules.json` ໃສ່ບ່ອນແທນ
4. ກົດ **Publish**

### 5.2 ກວດສອບ
- ຈະເຫັນຂໍ້ຄວາມ "Rules published successfully" ສີຂຽວ
- ຖ້າມີ error: ໃຫ້ກວດການວາງເຄື່ອງໝາຍວົງເລັບ `{}`

---

## 6. ການຕິດຕັ້ງ Storage Rules {#6-storage-rules}

### 6.1 ໂຫລດ Rules
1. Firebase Console → **Storage** → ແທັບ **Rules**
2. ລົບເນື້ອຫາທີ່ມີຢູ່ທັງໝົດ
3. ສຳເນົາເນື້ອຫາຈາກໄຟລ໌ `firebase-storage-rules.txt` ໃສ່ບ່ອນແທນ
4. **ສຳຄັນ**: ປ່ຽນ `getUserRole()` function ໃຫ້ໃຊ້ Realtime DB (ເບິ່ງໝາຍເຫດທ້າຍໄຟລ໌)
5. ກົດ **Publish**

### 6.2 ໝາຍເຫດສຳຄັນ
ເພາະວ່າເຮົາໃຊ້ Realtime Database (ບໍ່ແມ່ນ Firestore), ໃຫ້ປ່ຽນ Helper function:

```js
// ແທນທີ່:
function getUserRole() {
  return firestore.get(...).data.role;
}

// ໃຫ້ໃຊ້ການກວດທີ່ App layer ແທນ ໂດຍລົບ getUserRole() ອອກ
// ແລະ ປ່ຽນ rule ເປັນ: allow create: if request.auth != null
//                                  && request.resource.size < 100 * 1024 * 1024
//                                  && isAllowedContentType(request.resource.contentType);
//
// App ຈະກວດ role ກ່ອນອັບໂຫລດໂດຍໃຊ້ Realtime DB security rules
```

---

## 7. ການສ້າງ Super Admin ຄົນທຳອິດ {#7-super-admin}

ນີ້ແມ່ນຂັ້ນຕອນທີ່ສຳຄັນທີ່ສຸດ! ບໍ່ມີ Admin = ໃຊ້ລະບົບບໍ່ໄດ້

### 7.1 ສ້າງ User ໃນ Firebase Authentication
1. Firebase Console → **Authentication** → ແທັບ **Users**
2. ກົດ **"Add user"**
3. ໃສ່:
   - **Email**: `admin@kgs.la` (ຫຼື email ຂອງເຈົ້າ)
   - **Password**: ສ້າງລະຫັດທີ່ປອດໄພ (ຢ່າງໜ້ອຍ 12 ຕົວ)
4. ກົດ **Add user**
5. **ສຳເນົາ User UID** ທີ່ໄດ້ (ຮູບແບບເຊັ່ນ: `aBc123XyZ456...`)

### 7.2 ສ້າງ User Profile ໃນ Database
1. Firebase Console → **Realtime Database** → ແທັບ **Data**
2. ກົດ **+** ໃສ່ root → ສ້າງ node `users`
3. ໃນ `users`, ກົດ **+** → ໃສ່ UID ທີ່ສຳເນົາມາ
4. ສ້າງ children ດັ່ງນີ້:

```json
{
  "email": "admin@kgs.la",
  "displayName": "Super Admin",
  "role": "admin",
  "department": "IT",
  "active": true,
  "createdAt": 1735000000000
}
```

**ຄຳແນະນຳ**: ໃຊ້ JSON Import:
1. ໃນ Realtime Database → ກົດ **⋮** ມຸມຂວາ → **Import JSON**
2. ສ້າງໄຟລ໌ `init-admin.json`:

```json
{
  "users": {
    "PASTE_UID_HERE": {
      "email": "admin@kgs.la",
      "displayName": "Super Admin",
      "role": "admin",
      "department": "IT",
      "active": true,
      "createdAt": 1735000000000
    }
  },
  "departments": {
    "it":       { "name": "ໄອທີ",                       "nameEn": "IT" },
    "cleaning": { "name": "ບໍລິການຄວາມສະອາດ",       "nameEn": "Cleaning Operations" },
    "garden":   { "name": "ສວນ ແລະ ພູມສະຖາປັດ",   "nameEn": "Gardening & Landscaping" },
    "pest":     { "name": "ກຳຈັດສັດຕູພືດ",                "nameEn": "Pest Control" },
    "hr":       { "name": "ບຸກຄະລາກອນ",                "nameEn": "Human Resources" },
    "qms":      { "name": "ລະບົບຄຸນນະພາບ (IMS)", "nameEn": "Quality Management System" },
    "finance":  { "name": "ການເງິນ",                       "nameEn": "Finance" },
    "ops":      { "name": "ປະຕິບັດງານ",                  "nameEn": "Operations" }
  },
  "categories": {
    "ims":      { "name": "IMS Procedures",      "icon": "fa-certificate",    "color": "#1750A0" },
    "sop":      { "name": "SOP & Work Instr.",   "icon": "fa-list-check",     "color": "#1A7340" },
    "training": { "name": "Training Materials",   "icon": "fa-graduation-cap","color": "#C49A28" },
    "contract": { "name": "Contracts",                "icon": "fa-file-signature","color": "#7E22CE" },
    "policy":   { "name": "Policies",                  "icon": "fa-shield-halved", "color": "#0F766E" },
    "form":     { "name": "Forms & Templates",  "icon": "fa-file-lines",      "color": "#B45309" }
  }
}
```

3. Upload file ນີ້

---

## 8. ການ Deploy ແອັບ {#8-deploy}

### ທາງເລືອກ A: Firebase Hosting (ແນະນຳ)
```bash
# ຕິດຕັ້ງ Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init
cd /path/to/kgs-v16
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### ທາງເລືອກ B: ໃຊ້ Web Server ທີ່ມີຢູ່
1. Upload `knowledge-base-v16.html` ໄປ web server
2. ປ່ຽນຊື່ເປັນ `index.html` ຫາກຕ້ອງການ
3. ເຂົ້າຜ່ານ URL ໂດຍກົງ

### ທາງເລືອກ C: ໃຊ້ Local File
- ເປີດໄຟລ໌ `knowledge-base-v16.html` ໃນ browser ໂດຍກົງ
- ໝາຍເຫດ: ບາງ browser ຈະ block ການເຮັດວຽກບາງຢ່າງ (ໃຊ້ Live Server extension ໃນ VSCode)

---

## 9. ການແກ້ໄຂບັນຫາທົ່ວໄປ {#9-troubleshooting}

### ❌ "Permission denied" ເມື່ອ Login
- **ສາເຫດ**: ບໍ່ມີ user profile ໃນ `/users/{uid}` ໃນ Realtime DB
- **ແກ້ໄຂ**: ໃຫ້ Admin ສ້າງ profile ໃຫ້ user ນັ້ນ (ເບິ່ງຂັ້ນຕອນ 7.2)

### ❌ "User not active" ຫຼື ບໍ່ສາມາດອັບໂຫລດ
- **ສາເຫດ**: `active: false` ໃນ user profile
- **ແກ້ໄຂ**: ປ່ຽນເປັນ `active: true` ໃນ Realtime DB

### ❌ "Quota exceeded" ຫຼື ໂຫລດໄຟລ໌ບໍ່ໄດ້
- **ສາເຫດ**: ຮອດເພດານ Free tier (1 GB download/ມື້)
- **ແກ້ໄຂ**:
  1. ກວດ Usage ໃນ Firebase Console
  2. ຖ້າຮອດເພດານງົບປະມານ ($5) — ໃຫ້ເພີ່ມເພດານ ຫຼື ລໍຖ້າ next billing cycle

### ❌ ໄຟລ໌ອັບໂຫລດເກີນ 100 MB
- **ສາເຫດ**: Rule ບລັອກໄຟລ໌ໃຫຍ່
- **ແກ້ໄຂ**:
  1. ບີບອັດໄຟລ໌ກ່ອນອັບໂຫລດ
  2. ຫຼື ປ່ຽນ rule (ໃນ `firebase-storage-rules.txt`) ເພີ່ມເພດານ

### ❌ ບໍ່ເຫັນເອກະສານທີ່ຄວນເຫັນ
- **ສາເຫດ**: `visibility` ບໍ່ກົງກັບ role ຂອງເຈົ້າ
- **ແກ້ໄຂ**: ກວດ visibility ໃນເອກະສານ vs role ໃນ user profile

### ❌ ບໍ່ສາມາດ deploy ໄດ້
- **ສາເຫດ**: API key ບໍ່ກົງ ຫຼື ບໍ່ໄດ້ເປີດ Authentication
- **ແກ້ໄຂ**: ກວດຄືນຂັ້ນຕອນ 3 ແລະ ກວດ CONFIG ໃນ HTML

---

## 📞 ການຕິດຕໍ່

ສຳລັບການຊ່ວຍເຫຼືອເພີ່ມເຕີມ:
- ກວດສອບ Audit Log ໃນ `/audit` ໃນ Realtime DB
- ກວດ Browser Console (F12) ສຳລັບ error messages
- ກວດ Firebase Console → **Functions logs** (ຖ້າຕັ້ງ Cloud Functions)

---

**KGS 2026 Strategic Direction**:
> "Strong systems, ready people, standard service, sustainable growth."

ລະບົບນີ້ສະໜັບສະໜຸນ:
- **Strong systems** ← IMS document management
- **Ready people** ← Training materials repository
- **Standard service** ← SOP centralization
- **Sustainable growth** ← Scalable cloud architecture
