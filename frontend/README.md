# 🖥️ Mini Task Manager — Frontend

Antarmuka pengguna untuk Mini Task Manager dengan Audit Log. Dibangun menggunakan **React 19 + TypeScript + Vite** dengan Tailwind CSS dan shadcn/ui.

---

## 📋 Daftar Isi

- [Cara Menjalankan](#-cara-menjalankan)
- [Struktur Folder](#-struktur-folder)
- [Halaman dan Routing](#-halaman-dan-routing)
- [Tech Stack](#-tech-stack)
- [Arsitektur Frontend](#-arsitektur-frontend)
- [Konvensi yang Digunakan](#-konvensi-yang-digunakan)

---

## 🚀 Cara Menjalankan

> **Penting:** Backend harus sudah berjalan terlebih dahulu di port `5050` sebelum menjalankan frontend. Lihat [`backend/README.md`](../backend/README.md) untuk petunjuknya.

### Prasyarat

- **Node.js** versi 18 ke atas — unduh di [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk bersama Node.js)
- Backend sudah berjalan di `http://localhost:5050`

---

### Langkah 1 — Masuk ke folder frontend

```bash
cd frontend
```

### Langkah 2 — Install dependensi

```bash
npm install
```

### Langkah 3 — Buat file konfigurasi environment

```bash
cp .env.example .env
```

Isi `.env`:

```env
VITE_API_BASE_URL=http://localhost:5050/api
```

> **Catatan:** Nilai default ini sudah sesuai jika backend berjalan di port 5050.

### Langkah 4 — Jalankan development server

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

---

### Menjalankan Bersamaan dengan Backend

Buka dua jendela terminal secara terpisah:

| Terminal | Perintah | URL |
|----------|----------|-----|
| Terminal 1 | `cd backend && npm run dev` | http://localhost:5050 |
| Terminal 2 | `cd frontend && npm run dev` | http://localhost:5173 |

Kemudian buka browser dan akses **http://localhost:5173**.

---

### Scripts yang Tersedia

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan development server dengan HMR |
| `npm run build` | Build untuk production (`tsc -b && vite build`) |
| `npm run preview` | Preview hasil production build |
| `npm run lint` | Jalankan ESLint |
| `npm run format` | Format kode dengan Prettier |
| `npm run format:check` | Cek format tanpa mengubah file |

---

## 📂 Struktur Folder

```
frontend/
├── public/                        # Asset statis
├── src/
│   ├── main.tsx                   # Entry point React
│   ├── index.css                  # Global styles (Tailwind)
│   ├── app/
│   │   └── router.tsx             # Konfigurasi React Router DOM
│   ├── config/
│   │   └── http-client.ts         # Instance Axios terkonfigurasi
│   ├── components/                # Komponen UI reusable (shadcn/ui)
│   ├── features/
│   │   ├── actors/                # Fitur pemilihan aktor
│   │   │   ├── hooks/             # useActors, dsb.
│   │   │   └── services/          # HTTP calls ke /api/actors
│   │   ├── tasks/                 # Fitur manajemen task
│   │   │   ├── hooks/             # useTask, useCreateTask, useDeleteTask, dsb.
│   │   │   ├── services/          # HTTP calls ke /api/tasks
│   │   │   └── components/        # TaskCard, TaskForm, TaskStatusBadge, dsb.
│   │   └── audit-logs/            # Fitur audit log
│   │       ├── hooks/             # useAuditLogs, useTaskAuditLogs
│   │       ├── services/          # HTTP calls ke /api/audit-logs
│   │       └── components/        # AuditLogItem, dsb.
│   ├── pages/
│   │   ├── select-actor-page.tsx  # Halaman pemilihan aktor
│   │   ├── task-manager-page.tsx  # Halaman utama (daftar task aktif)
│   │   ├── task-detail-page.tsx   # Detail task aktif + audit log
│   │   ├── deleted-tasks-page.tsx # Daftar task yang dihapus
│   │   ├── deleted-task-detail-page.tsx  # Detail task yang dihapus
│   │   ├── audit-logs-page.tsx    # Global audit trail
│   │   └── not-found-page.tsx     # Halaman 404
│   ├── shared/
│   │   ├── constants/
│   │   │   └── query-keys.ts      # Konstanta TanStack Query keys
│   │   └── lib/
│   │       └── api-helpers.ts     # extractApiData, extractApiError
│   └── lib/
│       └── utils.ts               # Utility (cn, dsb.)
├── .env.example
├── components.json                # Konfigurasi shadcn/ui
├── vite.config.ts
├── tailwind.config (inline di vite)
├── tsconfig.app.json
└── package.json
```

---

## 🗺️ Halaman dan Routing

| Path | Komponen | Deskripsi |
|------|----------|-----------|
| `/` | Redirect ke `/tasks` | Landing page |
| `/select-actor` | `SelectActorPage` | Pilih aktor aktif sebelum menggunakan aplikasi |
| `/tasks` | `TaskManagerPage` | Daftar semua task aktif + form buat task baru |
| `/tasks/:taskId` | `TaskDetailPage` | Detail task aktif beserta audit log-nya |
| `/deleted-tasks` | `DeletedTasksPage` | Daftar task yang sudah dihapus |
| `/deleted-tasks/:taskId` | `DeletedTaskDetailPage` | Detail task yang sudah dihapus beserta audit log-nya |
| `/audit-logs` | `AuditLogsPage` | Global audit trail (semua event dari semua task) |
| `*` | `NotFoundPage` | Halaman 404 |

---

## 🛠️ Tech Stack

| Area | Teknologi | Keterangan |
|------|-----------|------------|
| UI Framework | **React 19** | Library utama untuk membangun UI |
| Bahasa | **TypeScript** | Static typing untuk keamanan tipe |
| Build Tool | **Vite 8** | Dev server super cepat dengan HMR |
| Styling | **Tailwind CSS v4** | Utility-first CSS framework |
| UI Components | **shadcn/ui** | Komponen siap pakai berbasis Radix UI |
| Base UI | **@base-ui/react** | Komponen headless yang aksesibel |
| Server State | **TanStack Query v5** | Cache, fetching, dan sinkronisasi state server |
| HTTP Client | **Axios** | HTTP request ke backend API |
| Routing | **React Router DOM v7** | Client-side routing |
| Form Handling | **React Hook Form** | Manajemen form yang performan |
| Validasi | **Zod** | Schema validation untuk form dan tipe data |
| Notifikasi | **React Hot Toast** | Toast notification untuk feedback aksi |
| Icons | **Lucide React** | Kumpulan ikon SVG yang konsisten |
| Font | **Geist Variable** | Font modern dari Vercel |
| Linter | **ESLint** | Code quality enforcement |
| Formatter | **Prettier** | Code formatting otomatis |

---

## 🏗️ Arsitektur Frontend

### Pola Integrasi API

Setiap fitur mengikuti pola tiga lapis yang konsisten:

```
Page
  └── Hook (useQuery / useMutation)
        └── Service (Axios HTTP call)
              └── Backend API
```

1. **Service** (`features/<fitur>/services/<fitur>-service.ts`)
   - Bertanggung jawab atas raw HTTP call via Axios
   - Menggunakan `extractApiData<T>(response)` untuk membuka envelope API
   - Melempar `ApiError` yang dinormalisasi jika terjadi kegagalan
   - **Tidak pernah** mengembalikan envelope mentah `{ success, message, data, error }`

2. **Hook** (`features/<fitur>/hooks/use-<action>.ts`)
   - Membungkus service dalam `useQuery` atau `useMutation` dari TanStack Query
   - Query key didefinisikan di `shared/constants/query-keys.ts`
   - Mutation otomatis invalidasi cache yang relevan setelah berhasil

3. **Page**
   - Hanya berinteraksi dengan hook, tidak pernah mengimpor service secara langsung
   - Bertanggung jawab atas actor guard dan mengirim input ke mutation

### State Management

| Jenis State | Solusi |
|-------------|--------|
| Server state (data dari API) | TanStack Query |
| UI state (modal open, loading lokal) | React `useState` |
| Navigation / route state | React Router DOM |
| Form state | React Hook Form |

### Error Handling

Error dari API dinormalisasi ke tipe `ApiError` sehingga `onError` handler bisa selalu mengandalkan `error.code`, `error.status`, dan `error.message` — terlepas apakah error berasal dari envelope backend atau dari Axios.

Contoh branching berdasarkan kode error:
- `TASK_NOT_FOUND` (404) → render komponen `TaskNotFound` tanpa menampilkan error state generik
- Error lainnya (500, network) → render `TaskDetailError` dengan tombol Retry

---

## 📐 Konvensi yang Digunakan

1. **Feature-based folder structure** — kode diorganisir berdasarkan fitur (`features/tasks/`, `features/actors/`), bukan berdasarkan jenis file (`hooks/`, `services/`).

2. **Query keys terpusat** — semua TanStack Query key didefinisikan di satu file (`shared/constants/query-keys.ts`) untuk menghindari duplikasi dan memudahkan invalidasi.

3. **`cn()` utility** — penggabungan class Tailwind menggunakan `clsx` + `tailwind-merge` via fungsi `cn()` dari `lib/utils.ts`.

4. **Actor guard** — setiap halaman yang membutuhkan identitas pengguna akan redirect ke `/select-actor` jika belum ada aktor yang dipilih.

5. **Cache invalidation otomatis** — ketika task dihapus, TanStack Query prefix-match key `['tasks']` akan otomatis invalidasi cache task list dan deleted task list sekaligus.
