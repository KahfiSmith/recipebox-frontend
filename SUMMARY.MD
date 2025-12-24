# Ringkasan Proyek – Recipe Manager 🍳

## 1. Gambaran Umum

Recipe Manager adalah aplikasi web untuk membantu pengguna:

- Menyimpan dan mengelola resep masakan.
- Mencari resep berdasarkan bahan yang tersedia di rumah.
- Membuat daftar belanja otomatis dari resep yang dipilih.
- Menyusun rencana makan (meal plan) dalam bentuk kalender harian/mingguan.

Proyek ini dibangun dengan arsitektur **frontend–backend terpisah**:

- **Frontend**: Vue.js (repo ini)
- **Backend**: Go (Golang) – direncanakan sebagai REST API terpisah

Fase awal fokus ke **frontend** terlebih dahulu (UI dan struktur aplikasi), kemudian dilanjutkan dengan integrasi ke backend Go.

---

## 2. Tujuan & Arah Pengembangan

### Tujuan utama

1. Menyediakan antarmuka yang sederhana dan nyaman untuk:
   - Menambahkan, melihat, dan mengelola resep.
   - Mencari resep berdasarkan bahan.
   - Mengelola daftar belanja.
   - Menyusun meal plan.

2. Membuat fondasi frontend yang:
   - Jelas strukturnya.
   - Mudah diintegrasikan dengan REST API Go.
   - Mudah dikembangkan dan dipelihara ke depannya.

### Arah pengembangan

Urutan pengembangan yang direncanakan:

1. **v0.1 – Landing Page (FE only)**
   - Route `/` berisi landing page dengan beberapa section:
     - Hero, Features, How It Works, Preview, Benefits, CTA, Footer.
   - Semua masih statis, tanpa backend.

2. **v0.2 – App Shell + Halaman Utama (Mock Data)**
   - Route `/app` sebagai “shell” aplikasi:
     - Navigasi internal ke: resep, shopping list, meal planner.
   - UI dasar untuk:
     - List resep + detail resep (pakai mock/dummy data).
     - Halaman shopping list (dummy).
     - Halaman meal planner (dummy).
   - Belum perlu koneksi ke backend, fokus layout & UX.

3. **v0.3 – Integrasi dengan Backend Go**
   - Mengganti mock data dengan real data dari REST API.
   - Implementasi API untuk:
     - CRUD resep.
     - Pencarian berdasarkan bahan.
     - Generate shopping list.
     - Meal plan (CRUD entry kalender).

4. **v0.4 – Auth & Multi User (opsional)**
   - Login/register.
   - Data per user (resep, shopping list, meal plan personal).

---

## 3. Ruang Lingkup Frontend (Repo Ini)

### Halaman / Route

- `/` – **Landing Page**
  - Menjelaskan apa itu Recipe Manager dan fitur utamanya.
  - Mengajak user untuk masuk ke aplikasi utama.

- `/app` – **Aplikasi Utama (Shell)**
  - Nantinya berisi layout utama + nested routes / tab:
    - `/app/recipes`
    - `/app/shopping-lists`
    - `/app/meal-planner`

### Section Landing Page (Single Page)

1. **Navbar**
   - Logo / nama app (`Recipe Manager`).
   - Menu anchor ke section lain: `Features`, `How it works`, `Preview`.
   - Tombol `Open App` (link ke `/app`).

2. **Hero Section**
   - Headline: aplikasi untuk mengatur resep, belanja, dan meal plan.
   - Subheadline singkat (deskripsi fungsi utama).
   - Tombol: `Get Started / Open App` + `Lihat Fitur`.
   - Area ilustrasi/mockup UI (bisa placeholder).

3. **Feature Section**
   - 4 fitur utama dalam bentuk card:
     - Save Recipes
     - Search by Ingredients
     - Shopping List Generator
     - Meal Planning Calendar

4. **How It Works Section**
   - 3 langkah sederhana:
     1. Tambah & simpan resep.
     2. Pilih bahan yang tersedia untuk cari resep.
     3. Generate shopping list & susun meal plan.

5. **Preview Section**
   - Tampilan preview/mockup:
     - List resep.
     - Meal planner / shopping list.
   - Teks penjelasan singkat.

6. **Benefits Section**
   - Manfaat nyata:
     - Tidak bingung mau masak apa.
     - Mengurangi bahan terbuang.
     - Belanja lebih terarah.
     - Cocok untuk meal prep / diet plan.

7. **CTA Section**
   - Ajakan singkat untuk mulai menggunakan app.
   - Tombol `Open App`.

8. **Footer**
   - Nama project, nama developer, tahun, link GitHub.

---

## 4. Kebutuhan Teknis Frontend

### Tech Stack (rencana)

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **Routing**: Vue Router
- **State Management**: Pinia (untuk state global saat sudah integrasi API)
- **HTTP Client**: Axios / Fetch API
- **Styling**:
  - Bisa pakai Tailwind CSS atau CSS module biasa (menyesuaikan di implementasi).

### Struktur Direktori (rencana)

```text
src/
  main.ts
  App.vue
  router/
    index.ts
  store/
    index.ts        # setup Pinia (nantinya)
  pages/
    LandingPage.vue
    AppShell.vue    # container untuk route /app
    RecipesPage.vue
    RecipeDetailPage.vue
    ShoppingListsPage.vue
    MealPlannerPage.vue
  components/
    landing/
      Navbar.vue
      HeroSection.vue
      FeatureSection.vue
      HowItWorksSection.vue
      PreviewSection.vue
      BenefitsSection.vue
      CTASection.vue
      AppFooter.vue
    recipes/
      RecipeCard.vue
      RecipeList.vue
      RecipeForm.vue
    shopping/
      ShoppingListCard.vue
      ShoppingListItem.vue
    mealplanner/
      MealCalendar.vue
      MealEntryForm.vue
