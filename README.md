# Recipebox Frontend

Frontend untuk aplikasi Recipebox berbasis Vue 3 + Vite + TypeScript dengan struktur feature-first, routing terorganisir, Pinia untuk auth/session, dan TanStack Query untuk state async ke backend.

## Tech stack

- Vue 3, Vue Router, Pinia, TanStack Query
- Vite, TypeScript
- Zod untuk validasi payload/form dan runtime parsing response auth
- Tailwind CSS (via `@tailwindcss/vite`) + konfigurasi `components.json` (shadcn-vue)
- ESLint + Prettier

## Status fitur saat ini

- Landing page `/` sudah berisi section Hero, Features, How it works, Preview, Benefits, CTA, dan Footer.
- Auth flow sudah terhubung ke `authService`: `login`, `register`, `verify-email/request`, `verify-email/confirm`, `password/forgot`, `password/reset`, `refresh`, `logout`, dan `me`.
- Form auth memakai TanStack Query mutation untuk lifecycle request, sementara state session/auth tetap bersumber dari Pinia.
- Saat `VITE_API_BASE_URL` tersedia, session auth mencoba dipulihkan lewat `/auth/refresh` lalu `/auth/me`.
- Saat `VITE_API_BASE_URL` kosong, login memakai mock session aman dan form auth lain mengembalikan mock success response agar flow development tetap usable.
- Route guard aktif untuk `requiresAuth` dan `guestOnly`.
- Workspace `/app` memakai backend untuk overview summary (`GET /dashboard`), recipes (`GET/POST/PUT/DELETE /recipes`), meal plans (`GET/POST/PUT/DELETE /meal-plans`), dan shopping list (`GET/POST/PUT/DELETE /shopping-items`) saat API tersedia.
- Saat `VITE_API_BASE_URL` kosong, meal planner dan shopping list tetap usable lewat fallback state lokal; ingredient dari meal plan tetap bisa dikirim ke shopping list dari UI.
- Halaman `/app/profile` dilindungi auth guard, tetapi penyimpanan profile/preferences/password masih client-side saja.

## Prasyarat

- Node.js: `^20.19.0 || >=22.12.0`
- Package manager: `pnpm` (lihat `package.json#packageManager`)

## Instalasi

```sh
pnpm install
```

## Konfigurasi environment

1. Salin file env:

```sh
cp .env.example .env
```

2. Set variabel berikut:

- `VITE_API_BASE_URL` (contoh local backend: `http://localhost:8080`)

Catatan penting:
- Isi `VITE_API_BASE_URL` dengan base host API saja, jangan full endpoint auth.
- Frontend sudah otomatis menambahkan path seperti `/api/v1/auth/login` dan `/api/v1/auth/register`.
- Dengan backend default lokal, request akan menjadi `http://localhost:8080/api/v1/auth/login`, `http://localhost:8080/api/v1/auth/register`, dan seterusnya.

Catatan: jika `VITE_API_BASE_URL` tidak di-set, login akan memakai mock session dan form auth lain akan memakai mock success response agar flow development tetap bisa diuji.

## Menjalankan

```sh
pnpm dev        # dev server
pnpm build      # type-check + build produksi
pnpm preview    # preview hasil build
pnpm type-check # cek tipe (vue-tsc)
pnpm lint       # eslint (auto-fix + cache)
pnpm format     # prettier untuk src/
```

## Struktur folder

```
.
├─ public/                         # aset statis
├─ src/
│  ├─ app/                         # application shell
│  │  ├─ App.vue
│  │  ├─ main.ts                   # bootstrap Vue + Pinia + Router
│  │  ├─ queryClient.ts            # konfigurasi TanStack Query
│  │  ├─ layouts/
│  │  │  ├─ AppLayout.vue
│  │  │  ├─ DefaultLayout.vue
│  │  │  └─ AuthLayout.vue
│  │  ├─ router/
│  │  │  ├─ index.ts               # router instance + guard setup
│  │  │  ├─ routes.ts              # definisi routes
│  │  │  └─ guards.ts              # meta `requiresAuth` / `guestOnly` + title
│  │  ├─ styles/
│  │  │  ├─ main.css
│  │  │  └─ variables.css          # token warna/spacing (CSS variables)
│  │
│  ├─ features/                    # modul per fitur/domain
│  │  ├─ app/
│  │  │  ├─ components/            # panel overview, recipes, meal planner, shopping list
│  │  │  ├─ layouts/
│  │  │  ├─ services/              # dashboardService, recipeService, mealPlanService, shopping list service
│  │  │  ├─ constants/
│  │  │  ├─ types.ts
│  │  │  └─ pages/AppPage.vue
│  │  ├─ auth/
│  │  │  ├─ components/*Form.vue   # login/register/forgot/verify/reset
│  │  │  ├─ pages/*Page.vue        # halaman auth
│  │  │  ├─ services/authService.ts
│  │  │  └─ stores/authStore.ts
│  │  ├─ home/pages/HomePage.vue
│  │  ├─ profile/pages/ProfilePage.vue
│  │  └─ misc/pages/NotFoundPage.vue
│  │
│  └─ shared/                      # utilitas lintas fitur
│     ├─ components/
│     │  ├─ common/AppHeader.vue
│     │  └─ ui/                    # komponen UI (shadcn-vue style)
│     │     ├─ Button.vue
│     │     ├─ Input.vue
│     │     └─ index.ts
│     ├─ composables/              # hooks reusable (mis. auth)
│     ├─ constants/
│     ├─ lib/                      # helper (utils, validators)
│     ├─ schemas/                  # schema Zod untuk auth/dashboard/recipe/meal plan
│     ├─ services/
│     │  ├─ api/index.ts           # definisi endpoint
│     │  └─ httpClient.ts          # wrapper fetch + query + error handling
│     ├─ stores/                   # store yang bersifat umum
│     └─ types/                    # type bersama (API, dsb.)
│
├─ .env.example
├─ index.html
├─ package.json
├─ pnpm-lock.yaml
├─ tsconfig*.json
└─ vite.config.ts
```

## Catatan arsitektur singkat

- Routing: rute didefinisikan di `src/app/router/routes.ts` dan guard di `src/app/router/guards.ts` (redirect login dan update `document.title`).
- HTTP client: `src/shared/services/httpClient.ts` menggunakan `fetch`, `credentials: include`, dan bearer access token in-memory dari auth store.
- Server-state UI: TanStack Query di-bootstrap dari `src/app/queryClient.ts` dan dipakai untuk query overview/recipes/meal plans serta mutation auth, recipe, dan meal plan yang memanggil backend.
- Auth service: `src/features/auth/services/authService.ts` mengikuti endpoint auth di `docs/api.md`, memvalidasi payload/response auth dengan Zod, dan punya fallback mock untuk development saat API base URL belum di-set.
- Dashboard service: `src/features/app/services/dashboardService.ts` memanggil `GET /api/v1/dashboard` dan memvalidasi shape response summary dengan Zod sebelum dipakai di overview.
- Recipe service: `src/features/app/services/recipeService.ts` memanggil `GET/POST/PUT/DELETE /api/v1/recipes`, memvalidasi payload/response recipe dengan Zod, dan dipakai oleh TanStack Query di panel recipes.
- Meal planner dan shopping list memakai service + TanStack Query saat API tersedia, dengan fallback state lokal saat `VITE_API_BASE_URL` kosong.
- Alias import: `@` mengarah ke `src/` (lihat `vite.config.ts`).

## Troubleshooting

- Error build Rollup `Cannot find module '@rollup/rollup-linux-x64-gnu'`: pastikan `node_modules` di-install pada environment yang sama (mis. WSL/Linux vs Windows). Coba hapus `node_modules` lalu jalankan `pnpm install` ulang.
