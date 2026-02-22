# Ringkasan Proyek – Recipe Box Frontend

## 1. Gambaran umum

Repo ini adalah frontend aplikasi **Recipe Box / Recipe Manager** berbasis:

- Vue 3 + Vite + TypeScript
- Vue Router + Pinia
- Tailwind CSS

Arsitektur memakai pendekatan **feature-first** agar kode mudah dipisah per domain fitur dan lebih gampang dikembangkan.

## 2. Kondisi implementasi saat ini

### Yang sudah jadi

1. Landing page lengkap di route `/`:
   - Hero
   - Features
   - How it works
   - Preview
   - Benefits
   - CTA
   - Footer

2. Preview section sudah terisi mockup realistis:
   - Ringkasan meal mingguan
   - Recipe list sample
   - Weekly plan sample
   - Shopping list sample

3. Authentication flow (UI + validasi dasar):
   - `/auth/login`
   - `/auth/register`
   - `/auth/forgot-password`
   - `/auth/verify-email`

4. Route guard:
   - `requiresAuth` untuk halaman private
   - `guestOnly` untuk halaman auth
   - Redirect login saat belum autentikasi

5. Halaman profile (protected):
   - Form profile detail
   - Form preferences
   - Form update password
   - Saat ini masih client-side (belum sinkron backend)

6. Infrastruktur API:
   - HTTP client reusable (`fetch` wrapper)
   - Endpoint auth login
   - Fallback mock login bila `VITE_API_BASE_URL` belum diisi

### Yang masih placeholder / belum lengkap

1. Route `/app` masih halaman placeholder.
2. Fitur inti domain belum implement penuh:
   - CRUD resep
   - Search by ingredients
   - Shopping list generator dari resep terpilih
   - Meal planner kalender dengan data persisten
3. Integrasi backend masih minimal (baru auth login).

## 3. Route yang tersedia

- `/` -> landing page
- `/app` -> app shell placeholder
- `/app/profile` -> profile (butuh auth)
- `/auth/login` -> login
- `/auth/register` -> register
- `/auth/forgot-password` -> lupa password
- `/auth/verify-email` -> verifikasi email
- `*` -> 404 page

## 4. Struktur project ringkas

```text
src/
  app/                 # bootstrap app, router, layouts, global styles
  features/            # modul per domain (home, auth, profile, app, misc)
  shared/              # komponen umum, composables, lib, services, types
```

## 5. Fokus pengembangan berikutnya (disarankan)

1. Implement `Recipes` module (list, detail, create/edit/delete).
2. Implement `Meal Planner` mingguan dengan persist data.
3. Implement `Shopping List` dari resep terpilih.
4. Tambah persist auth/session (mis. localStorage + refresh strategy).
5. Integrasi penuh dengan backend Go REST API.
