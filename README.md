# Recipebox Frontend

Frontend untuk aplikasi Recipebox berbasis Vue 3 + Vite + TypeScript dengan struktur feature-first (per domain/fitur), routing terorganisir, Pinia, dan Tailwind CSS.

## Tech stack

- Vue 3, Vue Router, Pinia
- Vite, TypeScript
- Tailwind CSS (via `@tailwindcss/vite`) + konfigurasi `components.json` (shadcn-vue)
- ESLint + Prettier

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

- `VITE_API_BASE_URL` (contoh: `https://api.example.com`)

Catatan: jika `VITE_API_BASE_URL` tidak di-set, login akan memakai mock response (untuk memudahkan development).

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
│  │  ├─ layouts/
│  │  │  ├─ DefaultLayout.vue
│  │  │  └─ AuthLayout.vue
│  │  ├─ router/
│  │  │  ├─ index.ts               # router instance + guard setup
│  │  │  ├─ routes.ts              # definisi routes
│  │  │  └─ guards.ts              # meta `requiresAuth` / `guestOnly` + title
│  │  ├─ styles/
│  │  │  ├─ main.css
│  │  │  └─ variables.css          # token warna/spacing (CSS variables)
│  │  └─ dev/
│  │     └─ index.ts               # placeholder util dev (opsional)
│  │
│  ├─ features/                    # modul per fitur/domain
│  │  ├─ auth/
│  │  │  ├─ components/LoginForm.vue
│  │  │  ├─ pages/LoginPage.vue
│  │  │  ├─ services/authService.ts
│  │  │  └─ stores/authStore.ts
│  │  ├─ home/pages/HomePage.vue
│  │  └─ misc/pages/NotFoundPage.vue
│  │
│  └─ shared/                      # utilitas lintas fitur
│     ├─ components/
│     │  ├─ common/AppHeader.vue
│     │  └─ ui/                    # komponen UI (shadcn-vue style)
│     │     ├─ Button.vue
│     │     ├─ Input.vue
│     │     ├─ button.ts
│     │     ├─ input.ts
│     │     └─ index.ts
│     ├─ composables/              # hooks reusable (mis. auth, async task)
│     ├─ constants/
│     ├─ lib/                      # helper (utils, validators)
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
- HTTP client: `src/shared/services/httpClient.ts` menggunakan `fetch` dan `VITE_API_BASE_URL`.
- Alias import: `@` mengarah ke `src/` (lihat `vite.config.ts`).

## Troubleshooting

- Error build Rollup `Cannot find module '@rollup/rollup-linux-x64-gnu'`: pastikan `node_modules` di-install pada environment yang sama (mis. WSL/Linux vs Windows). Coba hapus `node_modules` lalu jalankan `pnpm install` ulang.
