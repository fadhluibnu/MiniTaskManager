# 🗂️ Mini Task Manager with Audit Log

Take-home assessment project — Full Stack Developer.

Aplikasi manajemen task internal yang memungkinkan pengguna membuat task, mengubah status task, menghapus task, dan menelusuri riwayat perubahan melalui audit log.

---

## ⚡ Quick Start (untuk reviewer)

> Tidak ada database yang perlu diinstall. Cukup Node.js dan dua perintah terminal.

**Buka dua jendela terminal:**

```bash
# Terminal 1 — Backend API (port 5050)
cd backend
cp .env.example .env
npm install
npm run dev

# Terminal 2 — Frontend UI (port 5173)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Kemudian buka browser dan akses: **http://localhost:5173**

---

## 📁 Struktur Proyek

```
MiniTaskManager/
├── backend/        # Node.js + Express + TypeScript API
├── frontend/       # React 19 + Vite + TypeScript UI
├── docs/           # Dokumentasi teknis
│   ├── PRD.md              # Product Requirements Document
│   ├── SYSTEM_DESIGN.md    # Desain sistem dan arsitektur
│   ├── API_DOCUMENTATION.md # Dokumentasi API endpoint
│   ├── BACKEND_RULES.md    # Aturan coding backend
│   └── FRONTEND_RULES.md   # Aturan coding frontend
└── README.md       # File ini
```

---

## 📖 Dokumentasi Per Bagian

| Bagian | README |
|--------|--------|
| **Backend** — cara setup, arsitektur, asumsi, trade-off | [`backend/README.md`](backend/README.md) |
| **Frontend** — cara setup, tech stack, folder structure | [`frontend/README.md`](frontend/README.md) |
| **API Endpoints** — dokumentasi lengkap semua endpoint | [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) |

---

## 🧩 Gambaran Fitur

- ✅ **Task Management** — buat, lihat, dan hapus task
- ✅ **Status Flow** — `to_do → pending → in_progress → done` (satu arah, tidak bisa mundur)
- ✅ **Actor Selection** — pilih identitas pengguna dari dropdown sebelum melakukan aksi
- ✅ **Audit Log per Task** — riwayat perubahan status dan penghapusan per task
- ✅ **Global Audit Trail** — semua event dari semua task, termasuk task yang sudah dihapus
- ✅ **Soft Delete** — task yang dihapus tetap bisa ditelusuri riwayatnya
- ✅ **Idempotent Updates** — update status yang sama tidak membuat audit log duplikat

---

## 🛠️ Tech Stack Ringkas

| Bagian | Teknologi |
|--------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Validasi | Zod (frontend & backend) |
| Persistensi | JSON file (tanpa database eksternal) |
| State Management | TanStack Query + React Hook Form |

---

## 📋 Prasyarat

- **Node.js** versi 18 ke atas — unduh di [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk bersama Node.js)
- Tidak perlu Docker, PostgreSQL, atau database lainnya

---

## 🔮 Yang Akan Diperbaiki

Berikut hal-hal yang akan ditingkatkan jika proyek ini dikembangkan lebih lanjut ke production:

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

> Detail penjelasan tiap poin tersedia di [`backend/README.md → Yang Akan Diperbaiki`](backend/README.md#-yang-akan-diperbaiki).
