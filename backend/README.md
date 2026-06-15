# 🗂️ Mini Task Manager — Backend API

REST API untuk Mini Task Manager dengan Audit Log. Dibangun menggunakan **Node.js + Express + TypeScript** dengan persistensi data berbasis file JSON.

---

## 📋 Daftar Isi

- [Cara Menjalankan](#-cara-menjalankan)
- [Struktur Folder](#-struktur-folder)
- [Arsitektur](#-arsitektur)
- [API Endpoints](#-api-endpoints)
- [Format Response](#-format-response)
- [Asumsi yang Diambil](#-asumsi-yang-diambil)
- [Trade-off yang Dibuat](#-trade-off-yang-dibuat)
- [Yang Akan Diperbaiki](#-yang-akan-diperbaiki)
- [Tech Stack](#-tech-stack)

---

## 🚀 Cara Menjalankan

> **Untuk reviewer non-teknis:** ikuti langkah-langkah di bawah ini secara berurutan. Tidak perlu instalasi database atau layanan eksternal lainnya.

### Prasyarat

Pastikan komputer sudah terinstall:

- **Node.js** versi 18 ke atas — unduh di [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk bersama Node.js)

Cek dengan membuka Terminal / Command Prompt dan ketik:

```bash
node -v   # contoh output: v20.11.0
npm -v    # contoh output: 10.2.4
```

---

### Langkah 1 — Masuk ke folder backend

```bash
cd backend
```

### Langkah 2 — Install dependensi

```bash
npm install
```

### Langkah 3 — Buat file konfigurasi environment

Salin file contoh konfigurasi:

```bash
cp .env.example .env
```

Isi default `.env` sudah siap pakai untuk lokal:

```env
NODE_ENV=development
PORT=5050
ALLOWED_ORIGINS=http://localhost:5173
DATA_DIR=src/data
```

> **Catatan:** Tidak perlu mengubah apapun jika dijalankan secara lokal.

### Langkah 4 — Jalankan server

```bash
npm run dev
```

Server akan berjalan di: **http://localhost:5050**

Untuk mengecek apakah server sudah berjalan, buka browser dan kunjungi:

```
http://localhost:5050/api/status
```

Jika berhasil, akan muncul respons:

```json
{
  "success": true,
  "message": "Server is running",
  "data": { "status": "ok" }
}
```

---

### Menjalankan Frontend Bersamaan

Backend harus dijalankan **terlebih dahulu** sebelum frontend. Buka dua jendela terminal secara terpisah:

| Terminal | Perintah | Keterangan |
|----------|----------|------------|
| Terminal 1 | `cd backend && npm run dev` | Menjalankan API server di port 5050 |
| Terminal 2 | `cd frontend && npm run dev` | Menjalankan UI di port 5173 |

Setelah keduanya berjalan, buka browser dan akses: **http://localhost:5173**

---

### Scripts yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan server development (hot-reload aktif) |
| `npm run build` | Compile TypeScript ke JavaScript |
| `npm start` | Jalankan hasil build (production) |
| `npm run lint` | Jalankan ESLint untuk pengecekan kode |
| `npm run format` | Format kode dengan Prettier |
| `npm run typecheck` | Cek tipe TypeScript tanpa compile |

---

## 📂 Struktur Folder

```
backend/
├── src/
│   ├── index.ts                  # Entry point aplikasi
│   ├── app.ts                    # Setup Express (middleware, routes)
│   ├── routes.ts                 # Registrasi semua route
│   ├── config/
│   │   └── env.ts                # Konfigurasi environment variable
│   ├── data/
│   │   ├── actors.json           # Data aktor yang telah ditentukan
│   │   ├── tasks.json            # Data penyimpanan task
│   │   └── audit-logs.json       # Data penyimpanan audit log
│   ├── middlewares/
│   │   ├── error.middleware.ts   # Global error handler
│   │   └── not-found.middleware.ts
│   ├── modules/
│   │   ├── actors/               # Module aktor (list predefined actors)
│   │   ├── tasks/                # Module task (CRUD + status update)
│   │   └── audit-logs/           # Module audit log (global trail)
│   ├── shared/
│   │   ├── constants/            # Konstanta bersama
│   │   ├── lib/
│   │   │   └── json-storage.ts   # Helper baca/tulis JSON
│   │   ├── types/                # Definisi tipe TypeScript
│   │   └── utils/
│   │       ├── api-response.ts   # Helper format response API
│   │       ├── app-error.ts      # Custom error class
│   │       └── async-handler.ts  # Wrapper async untuk controller
│   └── validators/
│       └── validate-request.ts   # Validasi request dengan Zod
├── .env.example
├── package.json
└── tsconfig.json
```

Setiap module mengikuti pola yang konsisten:

```
[module]/
├── controller.ts   # Terima request, kirim response
├── service.ts      # Business logic dan orkestrasi
├── repository.ts   # Akses data (baca/tulis JSON)
├── schema.ts       # Skema validasi Zod
├── type.ts         # Tipe TypeScript spesifik module
└── index.ts        # Export public
```

---

## 🏗️ Arsitektur

### Gambaran Umum

```
Frontend (React + Vite)
        │
        │  HTTP Request (JSON)
        ▼
Backend (Node.js + Express)
        │
        │  Layered Architecture
        ▼
┌────────────────────────────┐
│  Route                     │  Mendefinisikan endpoint URL
│  → Controller              │  Menerima request, mengirim response
│  → Service                 │  Business logic & orkestrasi
│  → Repository              │  Akses data (abstraksi storage)
│  → JSON Storage Helper     │  Baca/tulis file JSON
│  → JSON Files              │  Penyimpanan data akhir
└────────────────────────────┘
```

### Alur Status Task

Task mengikuti alur satu arah yang ketat:

```
to_do → pending → in_progress → done
```

- Tidak bisa melompat status (misalnya `to_do → in_progress`)
- Tidak bisa mundur (misalnya `in_progress → pending`)
- `done` adalah status final — tidak bisa diubah lagi
- Update dengan status yang sama dikembalikan sebagai no-op (`200 OK`) tanpa membuat audit log baru

### Konsistensi Data

Karena JSON tidak mendukung transaksi nyata, konsistensi dijaga dengan cara:
- Setiap perubahan task dan pembuatan audit log dilakukan dalam satu service flow yang sama
- Repository hanya mengekspos operasi baca dan tulis
- Controller tidak pernah mengakses file JSON secara langsung

---

## 🔌 API Endpoints

Base URL: `http://localhost:5050/api`

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/status` | Health check server |
| `GET` | `/api/actors` | Daftar aktor yang tersedia |
| `GET` | `/api/tasks` | Semua task aktif (opsional: `?search=keyword`) |
| `POST` | `/api/tasks` | Buat task baru |
| `GET` | `/api/tasks/:taskId/detail` | Detail task aktif |
| `PATCH` | `/api/tasks/:taskId/status` | Update status task |
| `DELETE` | `/api/tasks/:taskId/delete` | Hapus task (soft delete) |
| `GET` | `/api/tasks/:taskId/audit-logs` | Audit log per task |
| `GET` | `/api/tasks/deleted` | Semua task yang sudah dihapus |
| `GET` | `/api/tasks/deleted/:taskId/detail` | Detail task yang sudah dihapus |
| `GET` | `/api/audit-logs` | Global audit trail |

Dokumentasi API lengkap tersedia di [`docs/API_DOCUMENTATION.md`](../docs/API_DOCUMENTATION.md).

---

## 📦 Format Response

Semua endpoint menggunakan format JSON yang konsisten:

**Success:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Actor not found",
  "data": null,
  "error": {
    "code": "ACTOR_NOT_FOUND"
  }
}
```

---

## 🧠 Asumsi yang Diambil

1. **Tidak ada autentikasi.** Identitas pengguna direpresentasikan oleh aktor yang dipilih dari dropdown. Ini adalah keputusan sadar karena autentikasi berada di luar scope take-home task ini.

2. **Aktor bersifat statis.** Data aktor disimpan di `src/data/actors.json` dan tidak dapat dibuat atau dihapus melalui API. Backend memvalidasi bahwa `actorId` yang dikirim ada di daftar ini.

3. **Task selalu dimulai dari `to_do`.** Status awal sudah dikunci di server — tidak ada cara untuk membuat task dengan status selain `to_do`.

4. **Tidak ada audit log untuk pembuatan task.** Informasi siapa yang membuat task sudah disimpan di field `createdByActorId` dan `createdByActorName` pada task itu sendiri, sehingga audit log dianggap redundan untuk event pembuatan.

5. **Penghapusan adalah soft delete.** Task yang dihapus tidak benar-benar dihapus dari file JSON — field `deletedAt` diisi dengan timestamp penghapusan. Ini memungkinkan audit log dari task yang dihapus tetap bisa ditelusuri.

6. **Konsistensi data dijaga di level service.** Karena JSON tidak memiliki transaksi, mutasi task dan penulisan audit log dilakukan dalam satu service flow untuk meminimalkan risiko inkonsistensi.

7. **Aplikasi ini bukan untuk production.** Ini dirancang khusus untuk assessment — mudah dijalankan secara lokal tanpa dependensi eksternal.

---

## ⚖️ Trade-off yang Dibuat

### 1. JSON File vs Database Sesungguhnya

**Dipilih:** JSON file persistence

**Alasan:** Reviewer tidak perlu menginstall PostgreSQL, MySQL, atau menjalankan Docker hanya untuk menilai project ini. Cukup `npm install` dan langsung bisa jalan.

**Konsekuensi:** Tidak ada transaction support yang sesungguhnya. Jika server crash tepat setelah task diupdate tapi sebelum audit log ditulis, data bisa inkonsisten. Pada production, ini harus diganti dengan database dan transaksi nyata.

---

### 2. Aktor Statis (Hardcoded) vs Manajemen Aktor Dinamis

**Dipilih:** Aktor didefinisikan di `actors.json` dan tidak bisa diubah melalui API.

**Alasan:** Autentikasi berada di luar scope. Pendekatan ini cukup untuk mendemonstrasikan validasi identitas tanpa memerlukan sistem login.

**Konsekuensi:** Tidak bisa menambah atau menghapus aktor tanpa mengedit file JSON secara manual.

---

### 3. No-op untuk Same-Status Update

**Dipilih:** Update status dengan nilai yang sama mengembalikan `200 OK` tanpa membuat audit log baru.

**Alasan:** Perilaku idempotent lebih aman dan tidak menghasilkan audit log yang duplikat dan menyesatkan.

**Konsekuensi:** Klien perlu membaca field `changed: false` untuk mengetahui bahwa tidak ada perubahan yang terjadi.

---

### 4. Denormalized Snapshots di Audit Log

**Dipilih:** Audit log menyimpan `taskTitle` dan `actorName` sebagai snapshot pada saat event terjadi.

**Alasan:** Jika nama aktor atau judul task berubah di masa depan, audit log tetap dapat dipahami karena sudah menyimpan nilainya saat itu.

**Konsekuensi:** Terdapat duplikasi data antara audit log dan task, tetapi ini adalah trade-off yang disengaja untuk keterbacaan.

---

### 5. Action-Suffix URL Convention

**Dipilih:** Endpoint menggunakan suffix aksi, misalnya `DELETE /api/tasks/:taskId/delete` bukan `DELETE /api/tasks/:taskId`.

**Alasan:** URL menjadi self-describing dan lebih mudah di-debug di network log. Ini juga menghindari ambiguitas saat route conflict dengan endpoint lain seperti `GET /api/tasks/deleted`.

---

## 🔮 Yang Akan Diperbaiki

Jika proyek ini dikembangkan lebih lanjut ke production, berikut yang akan ditingkatkan:

| # | Area | Ringkasan |
|---|------|-----------|
| 1 | **Database** | Ganti JSON file dengan PostgreSQL/MySQL + transaksi nyata |
| 2 | **Autentikasi** | Ganti actor dropdown dengan JWT / session-based auth |
| 3 | **Pagination & Filtering** | Tambahkan pagination dan filter berdasarkan status, aktor, waktu |
| 4 | **Security** | Rate limiting per IP + validasi content-type ketat |
| 5 | **Testing** | Unit & integration test untuk validasi status, audit log, actor |
| 6 | **Soft Delete** | Tambahkan fitur restore task beserta audit log-nya |
| 7 | **Konkurensi** | Optimistic locking / row-level lock untuk cegah race condition |
| 8 | **Realtime** | WebSocket / SSE agar perubahan langsung terlihat di semua browser |

Detail masing-masing poin:

1. **Ganti JSON dengan Database Sesungguhnya**
   Migrasi ke PostgreSQL atau MySQL dengan ORM seperti Prisma atau Drizzle. Mutasi task dan pembuatan audit log dibungkus dalam satu transaksi database untuk konsistensi yang sesungguhnya.

2. **Tambahkan Autentikasi**
   Implementasi JWT atau session-based auth sehingga identitas pengguna tidak lagi dipilih manual dari dropdown, melainkan diverifikasi oleh sistem.

3. **Pagination dan Filtering**
   Untuk task list dan audit log yang besar, tambahkan pagination (cursor-based atau offset-based) dan filtering berdasarkan status, aktor, atau rentang waktu.

4. **Rate Limiting dan Security Hardening**
   Tambahkan rate limiting per IP, sanitasi input yang lebih ketat, dan validasi content-type pada semua endpoint mutasi.

5. **Unit dan Integration Tests**
   Tambahkan test coverage menggunakan Vitest atau Jest, khususnya untuk:
   - Status transition validation
   - Audit log creation logic
   - Actor validation

6. **Soft Delete yang Lebih Lengkap**
   Tambahkan fitur restore task yang sudah dihapus, beserta audit log untuk event restore.

7. **Locking Mekanisme untuk Konkurensi**
   Implementasi optimistic locking atau row-level lock untuk mencegah race condition saat beberapa request mengubah task yang sama secara bersamaan.

8. **Realtime Updates**
   Gunakan WebSocket atau Server-Sent Events (SSE) agar perubahan task dan audit log langsung terlihat di semua browser yang membuka aplikasi yang sama.

---

## 🛠️ Tech Stack

| Area | Teknologi | Versi |
|------|-----------|-------|
| Runtime | Node.js | ≥ 18 |
| Framework | Express | ^5.1.0 |
| Bahasa | TypeScript | ^5.8.0 |
| Validasi | Zod | ^4.1.12 |
| ID Generator | CUID | ^3.0.0 |
| Security Headers | Helmet | ^8.1.0 |
| CORS | cors | ^2.8.5 |
| Logger | Morgan | ^1.10.1 |
| Dev Runner | tsx (watch mode) | ^4.19.0 |
| Formatter | Prettier | ^3.6.2 |
| Linter | ESLint | ^9.39.1 |
