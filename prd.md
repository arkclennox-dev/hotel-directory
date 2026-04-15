# PRD — Website Directory Hotel Indonesia

## 1. Ringkasan Produk

### Nama sementara

Hotel Directory Indonesia

### Visi produk

Membangun website directory hotel untuk pasar Indonesia yang membantu pengguna menemukan hotel berdasarkan lokasi, kebutuhan, dan kategori tertentu, lalu mengarahkan pengguna ke platform booking partner seperti Traveloka, tiket.com, dan Agoda melalui link affiliate.

### Tujuan bisnis

* Menghasilkan pendapatan affiliate dari klik dan booking hotel.
* Membangun aset SEO jangka panjang dengan ribuan landing page hotel berbasis lokasi dan intent pencarian.
* Menjadi portal discovery hotel Indonesia yang mudah diskalakan dengan bantuan AI untuk coding, konten, dan operasional.

### Tujuan pengguna

* Menemukan hotel sesuai kebutuhan dengan cepat.
* Membandingkan pilihan hotel berdasarkan lokasi, harga, fasilitas, dan tipe perjalanan.
* Masuk ke halaman booking partner resmi melalui tombol CTA yang jelas.

### Target deployment

* Frontend: Next.js di Vercel
* Database: Supabase
* Konten dan data: Supabase + workflow AI-assisted

---

## 2. Latar Belakang dan Peluang

Pasar hotel di Indonesia sangat besar, tetapi banyak website terlalu umum. Peluang terbaik adalah fokus pada halaman-halaman dengan intent tinggi seperti:

* hotel dekat bandara
* hotel dekat stasiun
* hotel dekat tempat wisata
* hotel keluarga
* hotel murah
* villa staycation

Model ini cocok untuk SEO karena:

* keyword sangat spesifik
* mudah dibuat secara programmatic
* bisa menghasilkan banyak halaman evergreen
* cocok untuk affiliate hotel

---

## 3. Ruang Lingkup Produk Versi 1

### In scope

* Directory hotel Indonesia berbasis kota dan kategori
* Halaman listing hotel
* Halaman detail hotel
* Halaman kategori SEO
* Halaman kota SEO
* Search dan filter dasar
* Tombol affiliate ke Traveloka / tiket.com / Agoda
* Admin sederhana berbasis Supabase untuk input dan update data
* Blog / artikel pendukung SEO
* Metadata SEO, sitemap, robots, schema dasar

### Out of scope untuk v1

* User login publik
* UGC / review pengguna langsung di situs
* Pembayaran langsung di situs
* Booking engine internal
* Machine learning recommendation engine
* Panel admin kompleks dengan role bertingkat
* Sinkronisasi API OTA real-time yang kompleks

---

## 4. Persona Pengguna

### Persona 1 — Pencari hotel keluarga

* Usia 28–45
* Mencari hotel untuk keluarga saat liburan
* Prioritas: lokasi, kolam renang, sarapan, kamar luas
* Perilaku: mencari di Google dengan keyword spesifik

### Persona 2 — Pelancong budget

* Usia 18–35
* Mencari hotel murah atau penginapan nyaman
* Prioritas: harga, akses lokasi, rating, foto
* Perilaku: browsing cepat dan klik ke OTA

### Persona 3 — Pebisnis / perjalanan kerja

* Usia 25–50
* Mencari hotel dekat bandara, stasiun, kawasan bisnis, rumah sakit, kampus
* Prioritas: akses, parkir, WiFi, sarapan, check-in fleksibel

### Persona 4 — Pencari staycation

* Usia 20–40
* Mencari hotel aesthetic, villa, resort, private pool
* Prioritas: visual, suasana, fasilitas, lokasi instagramable

---

## 5. Positioning dan Unique Value Proposition

### Positioning

Website directory hotel Indonesia yang fokus pada pencarian hotel berdasarkan lokasi penting dan kebutuhan spesifik, dengan pengalaman cepat, ringkas, dan SEO-friendly.

### UVP

* Fokus Indonesia
* Fokus intent pencarian hotel yang sangat spesifik
* Navigasi sederhana dan cepat
* Bisa membandingkan opsi affiliate partner
* Mudah diskalakan menjadi ribuan halaman SEO

---

## 6. Strategi Informasi dan Struktur Situs

### Pilar utama struktur konten

1. Berdasarkan kota
2. Berdasarkan kategori hotel
3. Berdasarkan landmark / lokasi penting
4. Berdasarkan kebutuhan pengguna
5. Berdasarkan tipe properti

### Struktur informasi utama

* Home
* Kota
* Kategori
* Landmark
* Hotel detail
* Blog
* Tentang
* Kontak
* Privacy Policy
* Terms

### Contoh URL structure

* `/`
* `/kota`
* `/kota/surabaya`
* `/kota/yogyakarta`
* `/kategori/hotel-keluarga`
* `/kategori/hotel-murah`
* `/kategori/hotel-dekat-bandara`
* `/landmark/juanda`
* `/landmark/malioboro`
* `/hotel/vasa-hotel-surabaya`
* `/blog`
* `/blog/hotel-dekat-bandara-juanda`

### Struktur SEO programmatic yang disarankan

* `/[city]/hotel-dekat-[landmark]`
* `/[city]/hotel-[category]`
* `/[city]/[property-type]`
* `/[city]/hotel-murah`
* `/[city]/hotel-keluarga`
* `/[city]/staycation`

---

## 7. Kategori Utama Situs

### Kategori lokasi

* Hotel dekat bandara
* Hotel dekat stasiun
* Hotel dekat terminal
* Hotel dekat pelabuhan
* Hotel dekat mall
* Hotel dekat rumah sakit
* Hotel dekat kampus
* Hotel dekat tempat wisata
* Hotel dekat kawasan industri

### Kategori kebutuhan

* Hotel keluarga
* Hotel bisnis
* Hotel honeymoon
* Hotel untuk rombongan
* Hotel transit
* Hotel budget
* Hotel staycation

### Kategori tipe properti

* Hotel
* Villa
* Resort
* Apartemen harian
* Guest house
* Homestay
* Hotel kapsul
* Glamping

### Kategori fasilitas

* Kolam renang
* Sarapan gratis
* WiFi cepat
* Parkir luas
* Private pool
* View bagus
* Bathtub
* Kids friendly
* Dekat kuliner

---

## 8. Fitur Produk V1

### 8.1 Homepage

#### Tujuan

Menjadi halaman discovery utama dan entry point SEO brand.

#### Komponen

* Hero section dengan search bar
* Dropdown kota
* Dropdown kategori
* Shortcut kategori populer
* Section hotel populer per kota
* Section hotel dekat landmark populer
* Section artikel terbaru
* CTA eksplor kategori
* Footer lengkap

#### Kebutuhan fungsional

* User dapat memilih kota dan kategori lalu diarahkan ke listing page.
* Homepage menampilkan konten yang mudah dirender SSR/ISR.

### 8.2 Halaman listing hotel

#### Tujuan

Menampilkan kumpulan hotel berdasarkan kota, kategori, atau landmark.

#### Komponen

* Judul halaman SEO
* Deskripsi singkat kategori / kota
* Filter bar
* Sort dropdown
* Grid / list card hotel
* Internal links ke kategori terkait
* FAQ SEO

#### Filter minimum v1

* Kota
* Kategori
* Range harga
* Rating
* Tipe properti
* Fasilitas utama

#### Sort minimum v1

* Terpopuler
* Harga termurah
* Rating tertinggi
* Terbaru ditambahkan

### 8.3 Halaman detail hotel

#### Tujuan

Mendorong klik affiliate dengan informasi hotel yang cukup.

#### Komponen

* Nama hotel
* Breadcrumb
* Foto utama dan galeri
* Ringkasan hotel
* Lokasi
* Kategori dan tag
* Fasilitas unggulan
* Kisaran harga
* Rating
* Alamat
* CTA affiliate buttons
* Daftar hotel serupa
* FAQ singkat
* Schema markup

#### CTA affiliate

* Cek di Traveloka
* Cek di tiket.com
* Cek di Agoda

### 8.4 Search

#### Kebutuhan

* Search berdasarkan nama hotel, kota, landmark, kategori
* Search autocomplete sederhana
* Redirect ke halaman listing atau hotel detail bila match tinggi

### 8.5 Blog SEO

#### Tujuan

Mendukung topical authority dan internal linking.

#### Jenis artikel

* hotel dekat landmark
* rekomendasi hotel keluarga
* hotel murah per kota
* staycation terbaik
* itinerary lokal yang mengarah ke hotel category

### 8.6 Admin internal sederhana

#### Tujuan

Memudahkan update data hotel dan konten.

#### Kapabilitas minimum

* Tambah hotel
* Edit hotel
* Tambah kota
* Tambah landmark
* Tambah kategori
* Tambah affiliate links
* Tambah artikel blog
* Ubah status publish

---

## 9. User Flow

### Flow A — User mencari hotel berdasarkan kota

1. User masuk homepage
2. User pilih kota
3. User pilih kategori opsional
4. User masuk listing page
5. User filter hasil
6. User buka detail hotel
7. User klik salah satu tombol affiliate

### Flow B — User datang dari Google ke halaman SEO kategori

1. User search di Google “hotel dekat Juanda”
2. User masuk ke halaman listing kategori
3. User scroll daftar hotel
4. User pilih detail hotel
5. User klik OTA partner

### Flow C — User mencari nama hotel langsung

1. User gunakan search
2. Hasil menampilkan hotel yang relevan
3. User masuk detail hotel
4. User klik OTA partner

---

## 10. Kebutuhan Data

### Entitas utama

* cities
* landmarks
* categories
* hotels
* hotel_facilities
* hotel_images
* affiliate_links
* blog_posts
* seo_pages

### Relasi utama

* Satu kota memiliki banyak hotel
* Satu kota memiliki banyak landmark
* Satu hotel bisa punya banyak kategori
* Satu hotel bisa punya banyak fasilitas
* Satu hotel bisa punya banyak gambar
* Satu hotel bisa punya banyak affiliate link

---

## 11. Spesifikasi Database Supabase

### Table: cities

Kolom:

* id
* name
* slug
* province
* island
* description
* hero_image_url
* latitude
* longitude
* is_featured
* seo_title
* seo_description
* created_at
* updated_at

### Table: landmarks

Kolom:

* id
* city_id
* name
* slug
* type
* description
* address
* latitude
* longitude
* is_featured
* seo_title
* seo_description
* created_at
* updated_at

### Table: categories

Kolom:

* id
* name
* slug
* description
* type
* icon
* is_featured
* seo_title
* seo_description
* created_at
* updated_at

### Table: hotels

Kolom:

* id
* name
* slug
* city_id
* short_description
* full_description
* address
* latitude
* longitude
* star_rating
* guest_rating
* review_count
* price_from
* price_to
* currency
* property_type
* check_in_time
* check_out_time
* phone
* website_url
* hero_image_url
* is_featured
* is_published
* seo_title
* seo_description
* created_at
* updated_at

### Table: hotel_categories

Kolom:

* id
* hotel_id
* category_id
* created_at

### Table: hotel_landmarks

Kolom:

* id
* hotel_id
* landmark_id
* distance_km
* distance_text
* created_at

### Table: facilities

Kolom:

* id
* name
* slug
* icon
* created_at

### Table: hotel_facilities

Kolom:

* id
* hotel_id
* facility_id
* created_at

### Table: hotel_images

Kolom:

* id
* hotel_id
* image_url
* alt_text
* sort_order
* created_at

### Table: affiliate_links

Kolom:

* id
* hotel_id
* provider
* affiliate_url
* deeplink_url
* is_active
* last_checked_at
* created_at
* updated_at

### Table: blog_posts

Kolom:

* id
* title
* slug
* excerpt
* content_html
* featured_image_url
* author_name
* is_published
* published_at
* seo_title
* seo_description
* created_at
* updated_at

### Table: seo_pages

Opsional untuk landing page programmatic.
Kolom:

* id
* page_type
* city_id
* landmark_id
* category_id
* slug
* h1
* intro_content
* faq_json
* seo_title
* seo_description
* is_published
* created_at
* updated_at

---

## 12. Persyaratan Data Konten per Hotel

Setiap hotel minimal memiliki:

* nama hotel
* slug
* kota
* deskripsi singkat
* alamat
* minimal 1 gambar
* minimal 1 kategori
* minimal 1 affiliate link aktif

Sangat disarankan memiliki juga:

* rating
* kisaran harga
* 5–10 fasilitas
* koordinat lokasi
* landmark terdekat
* metadata SEO

---

## 13. Arsitektur Teknologi

### Stack utama

* Next.js App Router
* TypeScript
* Tailwind CSS
* Supabase JS client
* Vercel deployment

### Library yang disarankan

* shadcn/ui untuk komponen UI
* lucide-react untuk icon
* zod untuk validasi schema
* react-hook-form untuk form admin
* next-sitemap untuk sitemap bila diperlukan, atau generate manual route sitemap
* @supabase/supabase-js untuk data access

### Rendering strategy

* Static generation untuk halaman evergreen bila memungkinkan
* ISR untuk listing dan detail hotel
* Server components untuk fetch utama
* Client components hanya untuk search interaktif, filter, dan UI tertentu

---

## 14. Arsitektur Frontend

### Prinsip UI

* Mobile-first
* Bersih dan cepat
* Fokus ke readability dan CTA
* Mudah dikembangkan oleh AI

### Komponen reusable minimum

* Navbar
* Footer
* SearchBar
* CitySelector
* CategorySelector
* HotelCard
* HotelGrid
* FilterPanel
* SortDropdown
* Breadcrumbs
* CTAButtonsAffiliate
* FAQSection
* EmptyState
* Pagination

### Design token sederhana

* Font: Geist
* Primary: gelap / navy atau hitam
* Secondary: putih / abu muda
* Accent CTA: konsisten untuk tombol affiliate
* Radius: medium hingga large
* Shadow: soft

---

## 15. Halaman yang Harus Ada di V1

### Core pages

* Homepage
* Kota index
* Halaman kota detail
* Kategori index
* Halaman kategori detail
* Landmark detail
* Hotel detail
* Search results
* Blog index
* Blog detail

### Legal / trust pages

* About
* Contact
* Privacy Policy
* Terms and Conditions
* Disclaimer Affiliate

### Technical SEO pages

* Sitemap XML
* Robots.txt
* 404 page
* Open Graph defaults

---

## 16. SEO Requirements

### On-page SEO

* Title unik untuk tiap halaman
* Meta description unik
* H1 tunggal
* Internal linking kuat
* Breadcrumb schema
* Hotel / lodging schema saat relevan
* FAQ schema pada listing dan artikel tertentu

### Programmatic SEO

Target utama:

* halaman kota
* halaman kategori
* halaman landmark
* halaman kombinasi kota + kategori

### Contoh template SEO title

* Hotel Dekat {Landmark} di {City} — Pilihan Terbaik untuk Menginap
* Hotel Keluarga di {City} — Rekomendasi Nyaman untuk Liburan
* Hotel Murah di {City} — Pilihan Budget Terbaik

### Contoh template meta description

* Temukan hotel dekat {Landmark} di {City} dengan akses mudah, fasilitas lengkap, dan pilihan link booking partner terpercaya.

### Internal linking strategy

* Dari homepage ke kota unggulan
* Dari kota ke kategori
* Dari kategori ke hotel detail
* Dari hotel detail ke hotel serupa
* Dari blog ke listing dan detail hotel

---

## 17. Affiliate Monetization Requirements

### Partner utama

* Traveloka
* tiket.com
* Agoda

### Prinsip monetisasi

* Setiap hotel detail memiliki 1–3 tombol affiliate
* Bila salah satu provider tidak tersedia, tombol disembunyikan
* Klik tombol affiliate perlu bisa dilacak

### Tracking minimum

* event klik affiliate
* provider
* hotel_id
* source_page
* timestamp

### CTA examples

* Lihat Harga di Traveloka
* Cek Promo di tiket.com
* Booking via Agoda

### Disclosure

* Tambahkan disclosure affiliate yang jelas di footer dan/atau dekat CTA.

---

## 18. Kebutuhan Analytics

### Metric utama

* Organic traffic
* CTR dari listing ke detail hotel
* CTR tombol affiliate
* Top pages
* Top cities
* Top categories
* Bounce / engagement sederhana

### Event tracking minimum

* search_submitted
* filter_used
* hotel_card_clicked
* affiliate_button_clicked
* blog_internal_link_clicked

### Tools yang disarankan

* Google Analytics 4
* Google Search Console
* Vercel Analytics opsional

---

## 19. Kebutuhan Admin dan Operasional

### Admin internal v1

Akses hanya untuk owner / internal team.

### Workflow data

1. Tambah kota
2. Tambah landmark
3. Tambah kategori
4. Tambah hotel
5. Upload gambar / tempel image URL
6. Tambah affiliate links
7. Publish

### Workflow konten blog

1. Generate outline dengan AI
2. Tulis draft dengan AI
3. Review manual
4. Publish
5. Tambahkan internal link ke halaman uang utama

---

## 20. AI-Assisted Development Requirements

Karena coding dibantu AI, produk harus dirancang agar:

* struktur folder jelas
* komponen modular
* naming konsisten
* schema database stabil
* prompt AI mudah dibuat per modul

### Aturan pengembangan dengan AI

* Gunakan TypeScript strict mode
* Pisahkan server logic dan UI logic
* Buat reusable components
* Semua fetch data typed
* Gunakan schema validation untuk form dan input
* Hindari logic besar dalam satu file
* Gunakan util/helper terpisah untuk slug, metadata, formatter, tracking

### Modul coding yang cocok dikerjakan AI secara bertahap

1. setup project dan theme
2. setup Supabase client
3. schema dan types
4. homepage
5. hotel listing page
6. hotel detail page
7. search dan filter
8. admin CRUD sederhana
9. blog
10. SEO routes

---

## 21. Non-Functional Requirements

### Performance

* LCP cepat pada homepage dan landing page utama
* Gambar dioptimalkan dengan Next Image atau CDN source yang stabil
* Hindari query berat di client

### Security

* Supabase RLS aktif untuk tabel sensitif admin
* Environment variables aman di Vercel
* Pisahkan anon key dan service role usage

### Reliability

* URL slug unik
* fallback jika gambar kosong
* fallback jika affiliate link tidak tersedia
* error state dan empty state harus jelas

### Scalability

* Struktur database mendukung ribuan hotel
* Struktur URL mendukung ribuan halaman SEO
* Komponen listing reusable untuk banyak template

### Maintainability

* Kode harus mudah dimodifikasi oleh AI atau developer lain
* Dokumentasi struktur proyek wajib
* Penamaan file dan komponen deskriptif

---

## 22. Kriteria Keberhasilan Produk

### Success metrics fase awal

Dalam 3 bulan setelah launch:

* minimal 100–300 halaman terindeks
* minimal 100 hotel terpublish
* minimal 20 kota aktif
* CTR affiliate mulai terbentuk
* traffic organik awal masuk

### Success metrics fase menengah

Dalam 6–12 bulan:

* 1.000+ halaman SEO
* 500+ hotel
* ranking untuk keyword long-tail hotel
* peningkatan klik affiliate bulanan

---

## 23. MVP Definition

MVP harus sudah memungkinkan:

* user menemukan hotel berdasarkan kota / kategori
* user membaca detail hotel
* user klik ke partner affiliate
* owner dapat menambah dan mengedit hotel
* website dapat diindex Google dengan baik

### MVP pages minimal

* Home
* 1 template kota
* 1 template kategori
* 1 template hotel detail
* Blog
* Legal pages

### MVP data minimal

* 10 kota
* 50–100 hotel
* 8–12 kategori
* 20 artikel blog dasar

---

## 24. Roadmap Fitur Setelah V1

### V1.1

* filter lebih lengkap
* breadcrumbs dinamis lebih baik
* related hotels lebih pintar
* FAQ generator untuk SEO pages

### V1.2

* import data hotel via CSV
* bulk upload affiliate links
* bulk SEO metadata generation

### V1.3

* AI-assisted content generator internal
* halaman per fasilitas utama
* halaman per kombinasi kota + fasilitas

### V2

* comparison view
* saved hotels
* email capture / newsletter
* dynamic recommendation engine

---

## 25. Risiko dan Mitigasi

### Risiko 1 — Data hotel tidak konsisten

Mitigasi:

* schema wajib jelas
* gunakan field wajib minimum
* validasi input admin

### Risiko 2 — Terlalu banyak halaman tipis

Mitigasi:

* tiap halaman kategori harus punya intro unik
* tambahkan FAQ dan internal links
* jangan publish halaman tanpa konten minimum

### Risiko 3 — Affiliate link rusak

Mitigasi:

* simpan status aktif
* punya field last_checked_at
* fallback ke provider lain

### Risiko 4 — Proyek AI-generated berantakan

Mitigasi:

* kerja modular
* satu fitur satu prompt
* review manual tiap modul
* gunakan PRD ini sebagai sumber kebenaran

### Risiko 5 — Build error saat deploy ke Vercel

Mitigasi:

* TypeScript strict
* lint check
* env vars checklist
* hindari edge runtime bila tidak perlu

---

## 26. Checklist Implementasi Teknis Awal

### Setup

* Buat project Next.js App Router + TypeScript
* Install Tailwind
* Setup font Geist
* Hubungkan ke GitHub
* Setup Vercel project
* Setup Supabase project

### Data layer

* Buat schema tabel di Supabase
* Setup RLS
* Buat TypeScript types dari schema
* Setup helper query functions

### Frontend layer

* Buat layout global
* Buat navbar dan footer
* Buat homepage
* Buat hotel listing template
* Buat hotel detail template
* Buat search UI

### SEO layer

* metadata per route
* sitemap
* robots
* schema JSON-LD

### Content layer

* tambah kota awal
* tambah kategori awal
* tambah 50–100 hotel awal
* tambah artikel blog awal

---

## 27. Prompting Guidelines untuk AI Coding Assistant

Agar AI membantu secara efektif, setiap prompt coding harus:

* menyebut stack dengan jelas
* menyebut file yang harus dibuat / diubah
* menyebut output yang diinginkan
* menyebut batasan styling dan type safety
* meminta full code siap pakai

### Format prompt yang disarankan

* Tujuan fitur
* File yang akan dibuat / diubah
* Data shape yang dipakai
* Requirement UI
* Requirement logic
* Requirement error handling
* Requirement SEO

Contoh modul prompt:

* Buat halaman listing hotel SSR dengan filter kota, kategori, dan harga.
* Gunakan Next.js App Router, TypeScript, Tailwind, Supabase.
* Pastikan reusable dan aman untuk deploy Vercel.

---

## 28. Kesimpulan

Produk ini adalah directory hotel Indonesia yang sangat cocok untuk strategi affiliate dan SEO jangka panjang. Fokus utama versi awal adalah membangun pondasi yang kuat: struktur data rapi, template halaman SEO kuat, alur pengguna sederhana, dan implementasi teknis modular agar mudah dikembangkan bersama AI.

PRD ini harus menjadi acuan utama sebelum masuk ke tahap:

1. perancangan database final
2. struktur folder Next.js
3. daftar halaman MVP
4. prompt coding per modul

---

## 29. Lampiran — Prioritas Build Order

### Prioritas 1

* schema database
* setup project
* homepage
* listing page
* hotel detail

### Prioritas 2

* kategori dan kota pages
* blog
* legal pages
* sitemap dan robots

### Prioritas 3

* admin CRUD sederhana
* analytics events
* affiliate click tracking

### Prioritas 4

* bulk content operations
* programmatic SEO landing pages
* advanced filters
