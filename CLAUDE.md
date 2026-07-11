# CLAUDE.md — Proyek KKN Digitalisasi Desa

Dokumen ini adalah panduan konteks proyek untuk Claude Code. Baca seluruh file ini sebelum mengerjakan task apapun.

---

## Gambaran Proyek

Proyek KKN digitalisasi yang terdiri dari **dua sub-sistem**:

| Sub-sistem | Scope | Kolaborasi |
|---|---|---|
| **Bank Sampah Digital** | Pencatatan setoran, tabungan, laporan | 1 dusun (Dusun Karangasem) |
| **Portal Desa Digital** | Peta interaktif, katalog UMKM, profil dusun | 2 dusun (Karangasem + Blongkeng) |

**Lokasi:** Dusun Karangasem & Dusun Blongkeng, Kelurahan Muntilan, Kecamatan Muntilan, Kabupaten Magelang  
**Mitra Bank Sampah:** BSI (Bank Sampah Indonesia) — Dipa Nirmala

---

## Struktur Monorepo

```
/
├── backend/          # Laravel — BE (kamu kerjakan)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── BankSampah/
│   │   │   │   │   ├── NasabahController.php
│   │   │   │   │   ├── SetoranController.php
│   │   │   │   │   ├── TabunganController.php
│   │   │   │   │   └── LaporanController.php
│   │   │   │   └── Portal/
│   │   │   │       ├── UmkmController.php
│   │   │   │       ├── ProfilDusunController.php
│   │   │   │       └── LayerController.php
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── storage/
│       └── app/public/   # foto UMKM, GeoJSON
│
├── frontend/         # React — FE (dikerjakan tim mitra)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/   # API calls ke backend
│   └── public/
│
├── geojson/          # Data spasial statis (shared)
│   ├── admin-karangasem.geojson
│   ├── admin-blongkeng.geojson
│   └── bencana.geojson
│
└── CLAUDE.md
```

---

## Backend — Laravel

### Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve          # dev server: http://localhost:8000
```

### Environment Variables Penting (`.env`)

```env
APP_NAME="Desa Digital Karangasem"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=desa_digital
DB_USERNAME=root
DB_PASSWORD=

FILESYSTEM_DISK=public    # untuk upload foto UMKM

# CORS — izinkan FE dev server
FRONTEND_URL=http://localhost:5173
```

### Perintah Artisan yang Sering Dipakai

```bash
php artisan make:model NamaModel -mrc    # model + migration + resource controller
php artisan migrate:fresh --seed         # reset DB dan seed ulang
php artisan route:list --path=api        # cek semua route API
php artisan storage:link                 # symlink public/storage
php artisan test                         # jalankan semua test
```

### Konvensi Kode Laravel

- **Controller:** Resource controller, response pakai `ApiResponse` helper atau `response()->json()`
- **Response format:** selalu bungkus dengan struktur konsisten (lihat bagian API Contract)
- **Route:** semua di `routes/api.php`, prefix `/api/v1/`
- **Auth:** Laravel Sanctum untuk admin panel (bank sampah). Portal publik tidak perlu auth.
- **Upload foto:** simpan ke `storage/app/public/umkm/`, serve via `/storage/umkm/`
- **Validasi:** gunakan Form Request (`php artisan make:request`)
- **Naming:** snake_case untuk kolom DB, camelCase untuk JSON response

---

## Frontend — React

> Dikerjakan oleh tim mitra. Bagian ini sebagai referensi untuk koordinasi.

### Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev     # dev server: http://localhost:5173
npm run build
```

### Environment Variables FE

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_MAPS_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Stack FE

- **React** + Vite
- **Leaflet.js** — peta interaktif
- **React Query (TanStack)** — data fetching & caching
- **Tailwind CSS** — styling
- **React Router** — navigasi

---

## Database Schema

### Bank Sampah

```sql
-- Anggota bank sampah
nasabah
  id, nama, no_anggota (unique), alamat, rt, rw,
  no_hp, saldo_tabungan (decimal), created_at

-- Nota/transaksi setoran
setorans
  id, no_nota (unique), id_nasabah (FK),
  tanggal, total_harga (decimal),
  metode ENUM('tunai','tabung','tukar_barang'),
  catatan, created_at

-- Item dalam satu nota
detail_setorans
  id, id_setoran (FK), id_jenis_sampah (FK),
  berat_kg (decimal), harga_satuan, subtotal

-- Master harga sampah (update dari BSI)
jenis_sampahs
  id, nama, kategori, satuan ENUM('kg','pcs'),
  harga_per_satuan (decimal), aktif (bool), updated_at

-- Buku tabungan digital
transaksi_tabungans
  id, id_nasabah (FK), id_setoran (FK, nullable),
  jenis ENUM('masuk','keluar'),
  jumlah (decimal), saldo_sesudah (decimal),
  keterangan, tanggal
```

### Portal Desa

```sql
-- Katalog UMKM (2 dusun)
umkms
  id, nama_usaha, nama_pemilik, dusun ENUM('karangasem','blongkeng'),
  kategori ENUM('kuliner','kerajinan','pertanian','jasa','perdagangan'),
  deskripsi, produk_utama (JSON), kisaran_harga,
  no_wa, instagram, jam_buka, hari_buka,
  metode_bayar (JSON), platform_online (JSON),
  punya_nib (bool), aktif (bool),
  lat (decimal,10,8), lng (decimal,11,8),
  foto_usaha, foto_produk (JSON),
  created_at, updated_at

-- Profil dusun (statis, bisa diupdate admin)
profil_dusuns
  id, dusun, konten (JSON), updated_at

-- Pengumuman desa
pengumumans
  id, judul, isi, tanggal_publish, aktif
```

---

## API Contract

Semua response JSON menggunakan format:

```json
{
  "success": true,
  "data": { ... },
  "message": "OK",
  "meta": { "total": 10, "page": 1 }   // untuk list
}
```

Error:
```json
{
  "success": false,
  "message": "Pesan error",
  "errors": { "field": ["Validasi gagal"] }
}
```

### Endpoints Bank Sampah

```
GET    /api/v1/nasabah              # list (search by nama/no_anggota)
POST   /api/v1/nasabah              # tambah nasabah baru
GET    /api/v1/nasabah/{id}         # detail + saldo + riwayat

POST   /api/v1/setoran              # buat nota baru (main transaction)
GET    /api/v1/setoran/{id}         # detail nota
GET    /api/v1/setoran/{id}/pdf     # export nota PDF

GET    /api/v1/jenis-sampah         # list master harga (aktif=true)
PUT    /api/v1/jenis-sampah/{id}    # update harga (admin only)

GET    /api/v1/tabungan/{nasabahId} # riwayat tabungan
POST   /api/v1/tabungan/tarik       # penarikan tabungan

GET    /api/v1/laporan/harian       # rekap ?tanggal=2025-09-28
GET    /api/v1/laporan/bulanan      # rekap ?bulan=2025-09
GET    /api/v1/laporan/export       # export Excel
```

### Endpoints Portal Desa

```
GET    /api/v1/umkm                 # list (?dusun=karangasem&kategori=kuliner&q=warung)
GET    /api/v1/umkm/{id}            # detail UMKM
POST   /api/v1/umkm                 # tambah UMKM (admin, multipart/form-data)
PUT    /api/v1/umkm/{id}            # edit UMKM (admin)
DELETE /api/v1/umkm/{id}            # hapus (admin)

GET    /api/v1/layers/admin         # GeoJSON batas dusun
GET    /api/v1/layers/bencana       # GeoJSON kerentanan tanah
GET    /api/v1/layers/fasilitas     # GeoJSON fasilitas umum

GET    /api/v1/profil/{dusun}       # profil dusun (karangasem|blongkeng)
GET    /api/v1/pengumuman           # list pengumuman aktif
```

---

## Pembagian Tanggung Jawab

### Kamu (BE — Laravel)

- Semua logic backend, validasi, kalkulasi
- Database migrations dan seeders
- API endpoints sesuai contract di atas
- Upload & storage foto
- Generate PDF nota (gunakan `barryvdh/laravel-dompdf`)
- Export Excel laporan (gunakan `maatwebsite/excel`)
- Seeding master data jenis sampah dari nota BSI

### Tim Mitra (FE — React)

- Implementasi UI sesuai referensi visual
- Integrasi Leaflet.js + GeoJSON
- Konsumsi semua API endpoint
- Responsif mobile

### Shared / Koordinasi

- GeoJSON files di folder `/geojson/` — dikumpulkan bersama dari survei lapangan
- Perubahan API contract → diskusi dulu, update CLAUDE.md ini
- Gunakan Postman Collection untuk dokumentasi API live (simpan di `/docs/`)

---

## Paket Laravel yang Dipakai

```bash
composer require barryvdh/laravel-dompdf        # PDF nota & laporan
composer require maatwebsite/excel               # export Excel
composer require laravel/sanctum                 # auth token admin
composer require spatie/laravel-cors             # CORS untuk FE

# Dev only
composer require --dev laravel/pint             # code formatter
```

---

## Seeder Prioritas

Jalankan seeder ini pertama kali — data jenis sampah diambil dari nota BSI yang sudah ada:

```bash
php artisan db:seed --class=JenisSampahSeeder   # master harga
php artisan db:seed --class=AdminSeeder          # user admin default
php artisan db:seed --class=DummyNasabahSeeder  # dev only
```

Kredensial admin default (development):
- Email: `admin@desadijital.id`
- Password: `password`

---

## Catatan Penting

- **Jangan push `.env`** ke repo. Gunakan `.env.example` sebagai template.
- **GeoJSON bencana** — sumber data dari BNPB / BIG / data primer lapangan. Belum tersedia, simpan placeholder dulu.
- **Harga sampah BSI** bisa berubah — admin harus bisa update via panel tanpa perlu coding.
- **Saldo tabungan** di tabel `nasabah` adalah denormalisasi untuk performa. Selalu update via `TransaksiTabunganService`, jangan update langsung.
- **Dua dusun di UMKM** — field `dusun` ENUM wajib diisi. Ini kunci filter utama di peta.
- **Foto UMKM** — resize sebelum simpan, maksimal 800px lebar. Gunakan Intervention Image jika perlu.
