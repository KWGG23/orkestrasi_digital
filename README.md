# Orkestrasi Digitalisasi Desa — KKN

Proyek KKN (Kuliah Kerja Nyata) untuk digitalisasi layanan desa di **Dusun Karangasem**
dan **Dusun Blongkeng**, Kelurahan Muntilan, Kecamatan Muntilan, Kabupaten Magelang.

Terdiri dari dua sub-sistem yang berbagi satu backend:

| Sub-sistem | Fungsi | Cakupan Wilayah |
|---|---|---|
| **Bank Sampah Digital** | Pencatatan setoran sampah, tabungan warga, laporan harian/bulanan | Dusun Karangasem saja (mitra: BSI / Bank Sampah Indonesia — Dipa Nirmala) |
| **Portal Desa Digital** | Peta interaktif, katalog UMKM, profil dusun, pengumuman | Karangasem + Blongkeng |

---

## Struktur Repo

```
/
├── backend/     # Laravel 12 — REST API untuk kedua sub-sistem
├── frontend/    # React 19 + Vite — konsumsi API, peta Leaflet
├── docs/        # Postman collection untuk dokumentasi API
└── CLAUDE.md    # Konteks proyek lengkap: skema DB, kontrak API, konvensi kode
```

Untuk detail skema database, daftar lengkap endpoint API, dan pembagian tanggung jawab
tim, baca **[`CLAUDE.md`](./CLAUDE.md)** — dokumen itu adalah sumber kebenaran (source of
truth) untuk kontrak API antara backend dan frontend.

---

## Tech Stack

**Backend** (`backend/`)
- Laravel 12 (PHP 8.2+), MySQL
- Laravel Sanctum — auth token untuk panel admin (bank sampah & portal)
- `barryvdh/laravel-dompdf` — export nota setoran ke PDF
- `maatwebsite/excel` — export laporan ke Excel
- `intervention/image` — resize foto UMKM

**Frontend** (`frontend/`)
- React 19 + Vite 8 (plain JSX, tanpa TypeScript)
- React Router 7, TanStack Query 5
- Tailwind CSS v4 (config via `@theme` di `src/index.css`, bukan `tailwind.config.js`)
- Leaflet + react-leaflet 5 — peta administratif & kerentanan bencana

---

## Menjalankan Proyek

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve          # http://localhost:8000
```

Seeder penting yang dijalankan lewat `--seed` (lihat `database/seeders/DatabaseSeeder.php`):
master harga jenis sampah (dari nota BSI), user admin default, dan dummy nasabah untuk
development.

Kredensial admin default (development): `admin@desadijital.id` / `password`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev     # http://localhost:5173
```

Frontend butuh backend berjalan di `http://localhost:8000` (lihat `VITE_API_BASE_URL` di
`.env.local`). Tanpa backend aktif, halaman tetap render dengan state kosong/fallback,
bukan data palsu.

Detail lebih lanjut ada di [`frontend/README.md`](./frontend/README.md), termasuk catatan
penting soal setup Tailwind v4.

---

## API

Base URL: `/api/v1/`. Semua response memakai amplop JSON konsisten:

```json
{ "success": true, "data": { ... }, "message": "OK", "meta": { "total": 10, "page": 1 } }
```

Endpoint publik meliputi katalog UMKM, layer GeoJSON (batas administratif, kerentanan
bencana, fasilitas umum), profil dusun, pengumuman, serta lookup saldo/riwayat nasabah bank
sampah. Endpoint yang mengubah data (tambah/edit UMKM, update harga sampah, laporan admin)
dilindungi Sanctum.

Daftar lengkap endpoint ada di [`CLAUDE.md`](./CLAUDE.md#api-contract) dan
`backend/routes/api.php`. Koleksi Postman untuk uji coba manual tersedia di
[`docs/Orkestrasi-Digital.postman_collection.json`](./docs/Orkestrasi-Digital.postman_collection.json).

---

## Catatan

- Jangan commit file `.env` — gunakan `.env.example` sebagai template.
- Data GeoJSON kerentanan bencana masih placeholder kosong; menunggu data survei
  lapangan/BNPB/BIG.
- Harga sampah dari BSI bisa berubah sewaktu-waktu — admin bisa update lewat panel tanpa
  perlu ubah kode.
