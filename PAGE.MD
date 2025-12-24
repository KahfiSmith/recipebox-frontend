Project: Recipe Manager – Frontend Landing Page (Vue 3 + Vite)

Tujuan:
Membuat 1 halaman landing page (route "/") untuk aplikasi Recipe Manager.
Landing ini hanya UI statis dulu (belum perlu integrasi backend), berisi beberapa section yang menjelaskan aplikasi.

Tech:
- Vue 3 (Composition API)
- Vite
- Vue Router (minimal: route "/" untuk landing, "/app" disiapkan untuk nanti)
- Styling bebas (bisa pakai CSS/Tailwind)

Struktur umum:
- /src/pages/LandingPage.vue
- /src/components/landing/*.vue

LandingPage.vue berisi section-section berikut (single page, scroll):

1. Navbar
   - Kiri: logo / text "Recipe Manager"
   - Kanan: menu anchor: "Features", "How it works", "Preview"
   - Tombol "Open App" yang link ke "/app"

2. Hero Section
   - Headline singkat: app untuk mengatur resep, belanja, dan meal plan
   - Subheadline pendek (1–2 kalimat)
   - Tombol utama: "Get Started" / "Open App"
   - Tombol sekunder: "Lihat Fitur"
   - Area ilustrasi/mockup (bisa placeholder) di samping teks (desktop) atau di bawah (mobile)

3. Feature Section
   - 4 fitur utama dalam bentuk card/grid:
     - Save Recipes (simpan resep + bahan + langkah)
     - Search by Ingredients (cari resep dari bahan yang ada)
     - Shopping List Generator (generate daftar belanja dari beberapa resep)
     - Meal Planning Calendar (rencanakan menu mingguan)
   - Tiap card: icon/emoji + judul + deskripsi pendek

4. How It Works Section
   - 3 langkah simple (step 1–3) dalam bentuk card/step:
     1) Tambah dan simpan resep
     2) Pilih bahan yang tersedia untuk cari resep
     3) Generate shopping list dan susun meal plan
   - Layout bisa horizontal di desktop, vertikal di mobile

5. Preview Section
   - 1–2 blok preview UI (boleh hanya kotak placeholder):
     - Preview "Recipe List"
     - Preview "Meal Planner / Shopping List"
   - Di samping/di bawahnya ada teks penjelasan singkat

6. Benefits Section
   - List manfaat/poin (bullet / card), contoh:
     - Tidak bingung "masak apa hari ini"
     - Mengurangi bahan terbuang
     - Belanja lebih terarah dengan daftar belanja
     - Cocok untuk meal prep / diet plan

7. CTA Section (Call to Action)
   - Ajakan singkat untuk mulai pakai app
   - Tombol besar "Open App" (link ke "/app")

8. Footer
   - Nama project (Recipe Manager)
   - Nama developer / link GitHub (placeholder)
   - Tahun

Routing:
- "/"  → LandingPage (single page dengan section-section di atas)
- "/app" → disiapkan sebagai route kosong / placeholder untuk aplikasi utama nanti

Target Codex:
- Buat struktur komponen dasar (LandingPage + komponen section)
- Fokus ke layout dan struktur HTML dasar, konten teks bisa placeholder sesuai deskripsi di atas
- Responsif untuk desktop & mobile (minimal: stack vertikal di mobile)

