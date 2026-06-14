Saya ingin menambahkan **React Router DOM foundation** ke frontend project **Mini Task Manager with Audit Log**.

Project frontend sudah menggunakan:

- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- TanStack Query
- Axios
- React Hot Toast
- Lucide React

Untuk task ini, tolong **hanya setup React Router DOM**, jangan membuat struktur halaman detail atau route lengkap dulu.

## Tujuan Task

Fokus task ini hanya:

1. Install `react-router-dom`.
2. Siapkan konfigurasi dasar router.
3. Hubungkan router ke aplikasi.
4. Buat satu route awal sederhana.
5. Update dokumentasi frontend rules.
6. Pastikan lint, build, dan format tetap aman.

Jangan implementasikan fitur Mini Task Manager dulu.

---

## Package yang Perlu Ditambahkan

Install:

```bash
npm install react-router-dom
```

Jangan install routing library lain.

---

## Expected Minimal File Changes

Buat file:

```txt
src/app/router.tsx
```

Update file:

```txt
src/app/App.tsx
docs/FRONTEND_RULES.md
package.json
package-lock.json
```

Jangan membuat page structure lengkap dulu.

Jangan membuat file berikut dulu:

```txt
src/pages/actor-selection-page.tsx
src/pages/task-manager-page.tsx
src/pages/task-detail-page.tsx
src/pages/deleted-tasks-page.tsx
src/pages/deleted-task-detail-page.tsx
src/pages/global-audit-trail-page.tsx
```

Struktur route lengkap akan dibuat nanti pada tahap implementasi halaman.

---

## Minimal Router Setup

Di `src/app/router.tsx`, buat router minimal menggunakan `createBrowserRouter`.

Untuk sekarang cukup siapkan route `/` dengan placeholder sederhana.

Contoh arah implementasi:

```tsx
import { createBrowserRouter } from "react-router-dom";

function WelcomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          Mini Task Manager
        </h1>
        <p className="mt-3 text-muted-foreground">
          React Router foundation is ready.
        </p>
      </section>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
]);
```

Catatan:

- Untuk sementara `WelcomePage` boleh berada di file `router.tsx`.
- Jangan membuat folder/page khusus dulu.
- Nanti saat struktur halaman sudah final, `WelcomePage` akan dipindahkan ke `src/pages`.

---

## Update App.tsx

Update `src/app/App.tsx` agar menggunakan `RouterProvider`.

Contoh:

```tsx
import { RouterProvider } from "react-router-dom";

import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

## Provider Rule

Pastikan provider global yang sudah ada tetap berjalan.

Expected flow:

```txt
main.tsx
→ AppProviders
→ App
→ RouterProvider
→ Route element
```

Jangan menghapus:

- `QueryClientProvider`
- `Toaster`
- setup provider lain yang sudah ada

---

## Documentation Update

Update:

```txt
docs/FRONTEND_RULES.md
```

Tambahkan `react-router-dom` ke tabel library:

| Category | Library            | Purpose                        |
| -------- | ------------------ | ------------------------------ |
| Routing  | `react-router-dom` | Client-side routing foundation |

Tambahkan section singkat:

```md
## Routing Rules

- Use `react-router-dom` for client-side routing.
- Define route configuration in `src/app/router.tsx`.
- Keep the initial router setup minimal.
- Page-level files will be created later when page structure is finalized.
- Do not put business logic directly inside route definitions.
- Use route params only for identifiers such as `taskId` when detail pages are implemented later.
```

---

## Important Constraints

- Jangan implementasikan fitur task manager dulu.
- Jangan membuat struktur page lengkap dulu.
- Jangan membuat route `/tasks`, `/audit-logs`, atau `/deleted-tasks` dulu.
- Jangan membuat folder feature detail dulu.
- Jangan menggunakan React Router loader/action dulu.
- Jangan menambahkan library selain `react-router-dom`.
- Jangan menghapus provider global.
- Jangan mengubah struktur shadcn/ui.
- Jangan hardcode backend API URL.

---

## Validation Commands

Setelah selesai, jalankan:

```bash
npm run lint
npm run build
npm run format:check
```

Jika ada error, perbaiki sampai semua command berhasil.

---

## Final Deliverable

Setelah selesai, berikan summary:

1. Package yang ditambahkan.
2. File yang dibuat.
3. File yang diubah.
4. Router minimal yang tersedia.
5. Dokumentasi yang diperbarui.
6. Hasil `npm run lint`.
7. Hasil `npm run build`.
8. Hasil `npm run format:check`.
