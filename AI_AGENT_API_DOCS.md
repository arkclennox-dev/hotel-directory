# Panduan Integrasi API untuk AI Agent (Internal Use Only)

Dokumen ini berisi panduan skema HTTP Request untuk AI Agent saat memasukkan data ke Direktori Hotel secara aman. **JANGAN PUBLIKASIKAN FILE INI**.

## Autentikasi (Authorization Header)
Setiap permintaan ke endpoint API tujuan HARUS menyertakan _Header_ autentikasi berjenis `Bearer Token` dengan skema sebagai berikut:

- **Header Name**: `Authorization`
- **Value**: `Bearer <API_KEY>`

> **Default API Key Mode Pengembangan (DEV):** `AI_AGENT_KEY_12345`
> *Jika di tahapan produksi, baca API Key rahasia dari environment variable.*

---

## 1. Menambahkan Postingan Blog Baru
Endpoint ini digunakan untuk memposting atau mereplika salinan *markdown/HTML* yang telah diformulasi oleh LLM menjadi halaman baca untuk pengunjung.

**Request:**
- **URL**: `POST http://localhost:3000/api/blog`
- **Headers**:
  - `Authorization: Bearer AI_AGENT_KEY_12345`
  - `Content-Type: application/json`

**Body (JSONPayload):**
```json
{
  "title": "7 Tips Memilih Hotel Ramah Anak di Malang",
  "excerpt": "Liburan bersama anak memerlukan persiapan khusus, salah satunya memilih...",
  "content_html": "<p>Isi artikel bisa berupa HTML standar dari Agent <strong>disini</strong></p>",
  "featured_image_url": "https://images.unsplash.com/photo-1542314831...",
  "author_name": "AI Editor"
}
```
*Catatan: Parameter `excerpt`, `author_name`, dan `featured_image_url` bersifat opsional (Sistem dapat melakukan fallback/autofill).*

---

## 2. Menambahkan/Ubah Data Direktori Hotel
Digunakan untuk memasukkan data hasil intipan (Scraping/Generation) terkait profil dasar hotel di suatu kota terdekat.

**Request:**
- **URL**: `POST http://localhost:3000/api/hotels`
- **Headers**:
  - `Authorization: Bearer AI_AGENT_KEY_12345`
  - `Content-Type: application/json`

**Body (JSONPayload):**
```json
{
  "name": "Bintang Makmur Hotel",
  "city_id": "city-001", 
  "categories": ["cat-013"],
  "short_description": "Hotel yang asri di kawasan selatan kota.",
  "full_description": "Fasilitas lengkap dengan perabotan kayu yang megah...",
  "address": "Jl. Raya Indah No 14",
  "star_rating": 4,
  "guest_rating": 8.5,
  "price_from": 500000,
  "price_to": 1200000,
  "property_type": "Hotel",
  "phone": "+62-811-1111"
}
```
*Catatan: `city_id` merujuk pada `id` kota tempat hotel berada. Parameter array `categories` dapat diisi spesifikasikan ID ("cat-013" = Ramah Anak, "cat-014" = Ramah Hewan). Sistem akan menerjemahkan variabel `name` menjadi representasi slug.*

---

## 3. Injeksi Tautan/Link Affiliate Spesifik
Bila AI Agent bertugas bertindak sebatas memperbarui referensi atau afiliasi Link travel hotel, tanpa mengubah profil panjang hotel tersebut.

**Request:**
- **URL**: `POST http://localhost:3000/api/affiliate`
- **Headers**:
  - `Authorization: Bearer AI_AGENT_KEY_12345`
  - `Content-Type: application/json`

**Body (JSONPayload):**
```json
{
  "hotel_id": "htl-1776263163949",
  "provider": "traveloka",
  "affiliate_url": "https://www.traveloka.com/hotel/indonesia/bintang-makmur",
  "deeplink_url": "traveloka://hotel/detail?id=123"
}
```
*Catatan: Parameter Provider dapat diubah. Nilai yang disarankan saat ini: `traveloka`, `tiketcom`, `agoda`. Link lama yang bersinggungan di provider yang identik untuk target `hotel_id` tersebut akan otomatis ditimpa (update state) oleh rute ini.*
