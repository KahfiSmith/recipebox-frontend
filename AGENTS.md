# AGENTS.md

Panduan ini untuk agent/kontributor yang mengerjakan repo `RecipeBox-Frontend`.

## 1. Tujuan Repo

Repo ini adalah frontend aplikasi Recipe Box (Vue 3 + Vite + TypeScript) dengan arsitektur feature-first.
Fokus saat ini:

- Landing page marketing di `/`
- Auth flow dasar (`/auth/*`)
- App shell placeholder di `/app`
- Profile page terproteksi di `/app/profile`

## 2. Tech Stack & Tools

- Framework: Vue 3 (`<script setup lang="ts">`)
- Router: Vue Router 4
- State: Pinia
- Styling: Tailwind CSS v4
- Build tool: Vite
- Lint/Format: ESLint + Prettier
- Package manager utama: `pnpm` (lihat `packageManager` di `package.json`)

## 3. Struktur Kode (Wajib Diikuti)

- `src/app`: bootstrap app, layout, router, styles global
- `src/features`: module per domain/fitur
- `src/shared`: komponen reusable, composables, util, services, types

Aturan penempatan:

- Halaman fitur: `src/features/<feature>/pages`
- Komponen fitur: `src/features/<feature>/components`
- Store fitur: `src/features/<feature>/stores`
- Service fitur: `src/features/<feature>/services`
- Utility lintas fitur: `src/shared/lib`
- HTTP client + endpoint map: `src/shared/services`

## 4. Konvensi Implementasi

- Gunakan alias `@` untuk import dari `src/`.
- Pakai TypeScript secara eksplisit untuk payload/response API.
- Reuse komponen UI dari `src/shared/components/ui` sebelum membuat komponen baru.
- Validasi form sederhana gunakan helper di `src/shared/lib/validators.ts`.
- Untuk route baru:
  - Definisikan di `src/app/router/routes.ts`
  - Atur `meta.title` untuk update `document.title`
  - Gunakan `meta.requiresAuth` atau `meta.guestOnly` bila perlu

## 5. Auth & API Rules

- State auth sumber kebenaran ada di `src/features/auth/stores/authStore.ts`.
- Akses auth di komponen melalui composable `useAuth()` (`src/shared/composables/useAuth.ts`).
- Semua request jaringan gunakan `apiClient` (`src/shared/services/httpClient.ts`).
- Endpoint API didefinisikan terpusat di `src/shared/services/api/index.ts`.
- Saat `VITE_API_BASE_URL` kosong, mode mock login tetap harus berfungsi untuk development.

## 6. Style & UX Rules

- Pertahankan visual style yang sudah ada (warna token `recipe-*`, rounded card, soft shadow).
- Pastikan layout responsif mobile dan desktop.
- Jangan ubah copy/section utama landing secara drastis tanpa alasan produk yang jelas.
- Jika menambah section besar di landing, pastikan anchor nav relevan (`#features`, `#how-it-works`, `#preview`).

## 7. Dokumentasi yang Harus Sinkron

Jika ada perubahan behavior/fitur/routing, update dokumen berikut:

- `README.md` (status fitur & cara jalanin)
- `SUMMARY.MD` (ringkasan kondisi project)

## 8. Checklist Sebelum Selesai

Jalankan (minimal salah satu sesuai environment):

- `pnpm type-check` atau `npm run -s type-check`
- `pnpm lint` (jika tersedia)

Pastikan:

- Tidak ada error TypeScript.
- Route yang disentuh bisa diakses.
- Tidak merusak flow auth guard.
- Dokumen sudah ikut diperbarui bila ada perubahan fungsional.

## 9. Prioritas Roadmap Saat Ini

1. Implement modul Recipes (list/detail/create/edit/delete)
2. Implement Meal Planner mingguan dengan data persisten
3. Implement Shopping List dari resep terpilih
4. Integrasi backend Go secara penuh
5. Persist auth session (mis. localStorage + restore)
