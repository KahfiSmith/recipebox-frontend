# AGENTS.md

Panduan ini untuk agent/kontributor yang mengerjakan repo `RecipeBox-Frontend`.

## 1. Tujuan Repo

Repo ini adalah frontend aplikasi Recipe Box (Vue 3 + Vite + TypeScript) dengan arsitektur feature-first.
Fokus saat ini:

- Landing page marketing di `/`
- Auth flow dasar di `/auth/*`, dengan login/register/forgot password/verify email/reset password sudah terhubung ke `authService`
- Workspace `/app` berisi panel overview, recipes, meal planner, dan shopping list; overview dan recipes sudah bisa terhubung ke backend, sementara meal planner dan shopping list masih memakai state lokal/in-memory
- Profile page terproteksi di `/app/profile`

## 2. Tech Stack & Tools

- Framework: Vue 3 (`<script setup lang="ts">`)
- Router: Vue Router 4
- State: Pinia
- Server-state / async mutations: TanStack Query
- Styling: Tailwind CSS v4
- Runtime validation: Zod
- UI config: `components.json` (shadcn-vue aliases + styling baseline)
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
- Untuk validasi form kompleks atau parsing payload/response API, gunakan schema Zod di boundary form/service alih-alih pengecekan manual yang tersebar.
- Untuk pola request HTTP baru, ikuti wrapper yang ada di `src/shared/services/httpClient.ts` sebelum memperkenalkan abstraction lain.
- Untuk state request async ke backend, gunakan TanStack Query; auth identity/session tetap sumber kebenaran di Pinia kecuali ada tugas eksplisit yang mengubahnya.
- Untuk route baru:
  - Definisikan di `src/app/router/routes.ts`
  - Atur `meta.title` untuk update `document.title`
  - Gunakan `meta.requiresAuth` atau `meta.guestOnly` bila perlu

## 5. Auth & API Rules

- Acuan utama kontrak API adalah `docs/api.md`.
- `docs/api.md` merujuk artefak generated API (`docs/swagger.yaml` dan `docs/swagger.json`), tetapi file tersebut belum ada di repo ini saat ini; jangan mengasumsikan keduanya tersedia sebelum dicek.
- State auth sumber kebenaran ada di `src/features/auth/stores/authStore.ts`.
- Akses auth di komponen melalui composable `useAuth()` (`src/shared/composables/useAuth.ts`).
- Semua request jaringan gunakan `apiClient` (`src/shared/services/httpClient.ts`).
- Query/mutation untuk request backend gunakan TanStack Query di level komponen/composable; jangan memindahkan source of truth session auth dari Pinia tanpa tugas eksplisit.
- Endpoint API didefinisikan terpusat di `src/shared/services/api/index.ts`.
- Flow auth frontend saat ini sudah mencakup `register`, `login`, `verify-email/request`, `verify-email/confirm`, `password/forgot`, `password/reset`, `refresh`, `logout`, dan `me` pada layer service.
- Saat `VITE_API_BASE_URL` kosong, flow auth development tetap harus usable lewat mock response yang aman untuk login dan mock success message untuk form auth lain.
- Store auth saat ini menyimpan access token di memori Pinia dan mencoba restore session via `/auth/refresh` + `/auth/me` ketika API tersedia; jangan menambah persistence tambahan tanpa tugas yang eksplisit.
- Untuk auth payload/response yang datang dari atau dikirim ke backend, validasi di boundary service dengan Zod sebelum data dipakai lebih jauh.
- Saat mengimplementasikan auth flow baru, gunakan `docs/api.md` sebagai target kontrak backend, tetapi bedakan dengan jelas antara contract target dan status implementasi frontend saat ini.
- Untuk endpoint list (`recipes`, `meal-plans`, `shopping-items`), ikuti contract pagination yang terdokumentasi di `docs/api.md`.

## 6. Style & UX Rules

- Pertahankan visual style yang sudah ada (warna token `recipe-*`, rounded card, soft shadow).
- Pastikan layout responsif mobile dan desktop.
- Jangan ubah copy/section utama landing secara drastis tanpa alasan produk yang jelas.
- Jika menambah section besar di landing, pastikan anchor nav relevan (`#features`, `#how-it-works`, `#preview`).

## 7. Dokumentasi yang Harus Sinkron

Jika ada perubahan behavior/fitur/routing, update dokumen berikut:

- `README.md` (status fitur & cara jalanin)
- `AGENTS.md` jika perubahan tersebut mengubah arsitektur, workflow, source of truth, atau aturan kontribusi repo

Jika ada perubahan kontrak API frontend yang mengubah asumsi integrasi:

- `docs/api.md`
- Referensi generated Swagger yang relevan bila file tersebut memang sudah ada / ikut diperbarui di backend (`docs/swagger.yaml`, `docs/swagger.json`)

## 8. Checklist Sebelum Selesai

Jalankan (minimal salah satu sesuai environment):

- `pnpm type-check` atau `npm run -s type-check`
- `pnpm lint` (jika tersedia)

Pastikan:

- Tidak ada error TypeScript.
- Route yang disentuh bisa diakses.
- Tidak merusak flow auth guard.
- Dokumen sudah ikut diperbarui bila ada perubahan fungsional.
- Jangan biarkan `AGENTS.md` tertinggal dari kondisi repo bila ada perubahan struktur, workflow utama, atau source of truth integrasi.

## 9. Workflow Penambahan Rules, Pattern, dan Workflow

Saat ada permintaan untuk menambah atau mengubah aturan kerja Codex di repo ini, ikuti protokol berikut:

- Klasifikasikan scope dulu: aturan lintas project masuk ke `~/.codex/AGENTS.md`, aturan yang hanya relevan untuk `RecipeBox-Frontend` masuk ke file ini.
- Tulis aturan baru dalam format yang operasional: pemicu/konteks, perilaku yang diwajibkan, batasan penting, dan langkah verifikasi.
- Kaitkan workflow baru dengan sumber kebenaran repo. Untuk API/integrasi, prioritaskan `docs/api.md`; gunakan artefak Swagger hanya jika file generated-nya memang tersedia. Untuk implementasi frontend gunakan `package.json`, struktur `src/app | src/features | src/shared`, route config, auth store, dan service API terpusat.
- Jangan tambahkan aturan yang bertentangan dengan arsitektur feature-first, auth guard, mock login development, atau visual language yang sudah ditetapkan.
- Jika aturan baru mengubah behavior implementasi, routing, ekspektasi dokumentasi, atau asumsi kontrak API, sinkronkan juga `README.md`, `AGENTS.md`, dan `docs/api.md` bila relevan.
- Untuk proposal pattern coding, prioritaskan pattern yang kecil, reversible, dan mudah di-review; hindari guideline yang terlalu abstrak atau memaksa refactor luas.
- Untuk pekerjaan yang menyentuh endpoint auth, dashboard, recipes, meal-plans, atau shopping-items, verifikasi nama path, method, auth behavior, dan pagination ke `docs/api.md` sebelum menulis rule baru.
- Jika `docs/api.md` lebih maju daripada implementasi frontend saat ini, tulis rule dengan jelas apakah rule itu mendeskripsikan kondisi repo saat ini atau target integrasi yang ingin dicapai.

Format rule yang disarankan:

- `Jika <konteks/pemicu>, maka <aksi yang diwajibkan>, dengan batasan <constraint>, lalu verifikasi lewat <check/file/command>.`

Contoh:

- `Jika menambah route baru, maka definisikan route di src/app/router/routes.ts dan isi meta.title, dengan batasan auth memakai meta.requiresAuth atau meta.guestOnly, lalu verifikasi route bisa diakses tanpa merusak guard.`
- `Jika menambah integrasi endpoint recipes, maka samakan path dan method dengan docs/api.md, dengan batasan list endpoint mendukung limit dan offset, lalu verifikasi mapping request/response terhadap artefak Swagger hanya jika file generated tersedia di repo.`

## 10. Snapshot Repo Saat Ini

1. `/` sudah berfungsi sebagai landing page marketing dengan section `#features`, `#how-it-works`, dan `#preview`.
2. `/auth/login` memakai `authService.login()`, guard menunggu `initializeSession()`, dan session mencoba dipulihkan via `/auth/refresh` + `/auth/me` saat API tersedia.
3. `/auth/register`, `/auth/forgot-password`, `/auth/verify-email`, dan `/auth/reset-password` sudah memanggil endpoint auth terkait melalui `authService`.
4. `/app` memakai backend untuk summary overview dan recipes saat API tersedia; meal planner dan shopping list masih berbasis state lokal/in-memory.
5. `/app/profile` dilindungi `requiresAuth` dan saat ini masih berbasis form client-side tanpa persist ke backend.
