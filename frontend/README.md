# Frontend — Desa Digital Karangasem & Blongkeng

React + Vite frontend untuk proyek KKN Digitalisasi Desa. Baca juga `../CLAUDE.md` di root
repo untuk konteks proyek penuh (skema database, kontrak API, pembagian tanggung jawab).

Dokumen ini fokus ke frontend: apa yang sudah jadi, apa yang belum, dan bagaimana
melanjutkannya.

---

## Ringkasan Proyek

Ada dua sub-sistem, dua dusun (**Karangasem** dan **Blongkeng**, Kelurahan Muntilan,
Kabupaten Magelang):

- **Bank Sampah Digital** — khusus Dusun Karangasem. Pencatatan setoran sampah, tabungan
  warga, laporan.
- **Portal Desa Digital** — Karangasem + Blongkeng. Profil dusun, katalog UMKM, peta
  administratif & kerentanan bencana.

Backend Laravel sudah menyediakan seluruh API (lihat `../backend/routes/api.php` dan bagian
"API Contract" di `../CLAUDE.md`). Tugas frontend adalah mengonsumsi API tersebut.

---

## Tech Stack

| Bagian | Pilihan | Catatan |
|---|---|---|
| Build tool | Vite 8 | — |
| UI | React 19 | Tanpa TypeScript, plain JSX |
| Routing | React Router 7 (`react-router-dom`) | `BrowserRouter` di `src/main.jsx` |
| Data fetching | TanStack Query 5 | Semua hook di `src/hooks/` |
| Styling | Tailwind CSS **v4** | ⚠️ Lihat catatan penting di bawah |
| Peta | Leaflet + react-leaflet 5 | Komponen di `src/components/map/` |
| Ikon | `@phosphor-icons/react` | Jangan pakai emoji sebagai ikon struktural |

### ⚠️ Tailwind v4 — cara setup berbeda dari v3

Proyek ini pakai **Tailwind v4**, yang setupnya beda dari tutorial v3 kebanyakan:

- Tidak ada `tailwind.config.js` atau `postcss.config.js`.
- Plugin di-load langsung di `vite.config.js` lewat `@tailwindcss/vite`.
- Semua design token (warna, font) didefinisikan di `src/index.css` lewat blok `@theme`,
  bukan di file config JS.
- Kalau mau nambah warna/token baru, edit `@theme` di `src/index.css`, lalu langsung
  bisa dipakai sebagai class Tailwind (misal `--color-clay` → class `bg-clay`, `text-clay`).

Jangan install `tailwindcss-cli`/`postcss-cli` manual atau bikin `postcss.config.js` — itu
untuk v3 dan tidak dibutuhkan di sini.

---

## Setup

Butuh Node.js `^20.19.0` atau `>=22.12.0` (syarat Vite 8) dan backend Laravel yang sudah jalan (lihat `../CLAUDE.md` bagian
"Backend — Laravel" untuk setup-nya). Sebagian besar halaman fetch data live dari API;
tanpa backend jalan, halaman masih tampil tapi menunjukkan state kosong/fallback.

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev       # http://localhost:5173
```

Backend biasanya jalan di `http://localhost:8000` lewat `php artisan serve` — cek
`VITE_API_BASE_URL` di `.env.local` kalau port/host berbeda.

### Script yang tersedia

```bash
npm run dev        # dev server dengan HMR
npm run build       # build produksi ke dist/
npm run preview      # preview hasil build
npm run lint        # oxlint
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_MAPS_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

`VITE_MAPS_TILE_URL` dipakai di `src/components/map/GeoMap.jsx`. Default-nya tile OSM
publik — cukup untuk development, tapi kalau traffic tinggi nanti sebaiknya ganti ke
provider tile berbayar (Mapbox/MapTiler) supaya tidak melanggar OSM usage policy.

---

## Struktur Proyek

```
src/
├── App.jsx                 # Definisi <Routes> — semua route didaftarkan di sini
├── main.jsx                 # Entry point: QueryClientProvider + BrowserRouter
├── index.css                 # Tailwind v4 import + @theme (design tokens)
│
├── pages/                   # Satu file per route (lihat tabel routing di bawah)
│
├── components/
│   ├── landing/              # Section-section khusus halaman "/" (marketing)
│   ├── portal/               # Section-section khusus hub "/portal"
│   ├── layout/               # Navbar, Footer, PortalLayout (breadcrumb wrapper)
│   ├── map/                  # GeoMap (Leaflet) + MapPageLayout (dipakai 2 halaman peta)
│   ├── umkm/                 # UmkmCard, dipakai di preview & katalog penuh
│   ├── profil/                # ProfilContent — render defensif JSON `konten` profil dusun
│   └── decorative/            # OrganicBlob (SVG dekorasi biophilic)
│
├── hooks/                    # 1 hook = 1 resource API, semua pakai TanStack Query
│   ├── useLiveStats.js         # Total nasabah/umkm/jenis-sampah untuk hero/metrics
│   ├── useProfilDusun.js       # GET /profil/{dusun}
│   ├── useUmkmList.js          # GET /umkm (filter dusun/kategori/q)
│   ├── useGeoLayer.js          # GET /layers/{admin|bencana|fasilitas}
│   └── useNasabah.js           # GET /nasabah (search) & /nasabah/{id} (detail+riwayat)
│
├── lib/api.js                 # apiGet() helper untuk envelope {success,data,meta}
└── data/wasteTypes.js          # Data statis kategori sampah untuk kalkulator karbon
```

### Peta Routing

| Route | File | Sumber data |
|---|---|---|
| `/` | `pages/LandingPage.jsx` | Marketing/landing eco-sustainability, kalkulator karbon |
| `/portal` | `pages/PortalHubPage.jsx` | Hub — preview semua fitur di bawah ini |
| `/portal/profil/:dusun` | `pages/DusunProfilePage.jsx` | `GET /profil/{karangasem\|blongkeng}` |
| `/portal/umkm` | `pages/UmkmCatalogPage.jsx` | `GET /umkm` |
| `/portal/peta/administratif` | `pages/PetaAdministratifPage.jsx` | `GET /layers/admin` |
| `/portal/peta/bencana` | `pages/PetaBencanaPage.jsx` | `GET /layers/bencana` |
| `/portal/bank-sampah` | `pages/BankSampahPortalPage.jsx` | `GET /nasabah`, `GET /nasabah/{id}` |

---

## Konvensi

- **Data fetching**: jangan `fetch()` langsung di komponen. Tambah hook baru di
  `src/hooks/` yang membungkus `apiGet()` dari `src/lib/api.js` dengan `useQuery`.
  Contoh termudah untuk ditiru: `useProfilDusun.js`.
- **Response envelope**: hampir semua endpoint backend mengembalikan
  `{ success, data, message, meta }` — `apiGet()` sudah menghandle unwrap ini dan
  throw error kalau `success: false`. **Kecuali** `/layers/*` yang mengembalikan
  GeoJSON mentah (`{type, features}`) tanpa envelope — makanya `useGeoLayer.js` fetch
  manual, tidak lewat `apiGet()`.
- **Nama field API**: kolom database apa adanya (snake_case: `total_harga`, `no_nota`,
  `berat_kg`), tapi nama relasi Eloquent ikut nama method PHP-nya (camelCase, misalnya
  `jenisSampah`). Jangan asumsikan semua camelCase.
- **Ikon**: pakai `@phosphor-icons/react`, konsisten `weight="duotone"` untuk ikon
  dekoratif di kartu dan `weight="bold"`/`"fill"` untuk ikon kecil di badge/tombol.
- **Warna & font**: jangan hardcode hex di komponen. Semua token ada di `@theme`
  (`src/index.css`) → dipakai lewat class Tailwind (`bg-primary`, `text-clay`, dst).
  Palet: hijau (`primary`, `primary-dark`, `primary-light`) + earth tone (`accent`,
  `sand`, `clay`, `bark`, `moss`). Font: `Lora` (heading) + `Raleway` (body).
- **State kosong**: kalau data API kosong/belum ada (banyak terjadi karena proyek masih
  fase rintisan), tampilkan pesan jujur ("profil sedang disusun", "data menyusul"),
  **jangan** isi dengan data dummy yang seolah-olah nyata. Lihat `DusunProfilePage.jsx`
  atau `UmkmCatalogPage.jsx` untuk contoh pola empty-state yang sudah dipakai.

---

## Status: Sudah Selesai

- Landing page marketing (`/`) lengkap: hero, live impact metrics, kalkulator estimasi
  nilai + jejak karbon sampah, section program, badge kemitraan, CTA.
- Portal hub (`/portal`) dengan live stats dan kartu ke 5 area fitur.
- Profil dusun, katalog UMKM (dengan filter dusun/kategori/pencarian), 2 halaman peta
  Leaflet, dan portal cek saldo/riwayat bank sampah (read-only, publik, khusus
  Karangasem) — semua sudah terhubung ke API asli, bukan mock data.
- Semua state kosong (belum ada UMKM, profil belum tersedia, geojson belum ada fitur)
  sudah ditangani dengan pesan yang jujur, bukan data fiktif.

## Status: BELUM Selesai / TODO

Ini bagian paling penting buat siapa pun yang lanjutin frontend. Diurutkan dari yang
paling kelihatan gap-nya:

1. **Tidak ada halaman admin/login sama sekali.** Backend punya `POST /auth/login`
   (Sanctum) dan endpoint admin-only (`PUT /jenis-sampah/{id}`, `POST/PUT/DELETE /umkm`,
   `GET /laporan/*`), tapi belum ada satu pun form login, penyimpanan token, atau
   halaman dashboard pengurus di frontend. Ini gap terbesar — bank sampah & portal desa
   saat ini murni read-only dari sisi publik.
2. **Tidak ada form input setoran baru** (`POST /setoran` — ini transaksi utama bank
   sampah: nasabah datang, timbang sampah, catat nota). `BankSampahPortalPage.jsx` yang
   ada sekarang cuma bisa **melihat** saldo/riwayat, bukan **mencatat** setoran baru.
   Kemungkinan ini masuk ke halaman admin/pengurus di atas (perlu login), bukan halaman
   publik.
3. **Tidak ada UI untuk penarikan tabungan** (`POST /tabungan/tarik`).
4. **Tidak ada UI laporan** (`GET /laporan/harian`, `/laporan/bulanan`, `/laporan/export`)
   ataupun tombol unduh nota PDF (`GET /setoran/{id}/pdf`).
5. **Layer `fasilitas` belum dipakai** (`GET /layers/fasilitas` — fasilitas umum). Sudah
   ada di backend, tapi tidak muncul di `GeoMap.jsx`/halaman peta manapun. Bisa
   ditambahkan sebagai layer tambahan yang bisa di-toggle di kedua halaman peta.
6. **Pengumuman desa belum ditampilkan** (`GET /pengumuman`). Tidak ada section/halaman
   yang menampilkan ini di portal maupun landing page.
7. **Belum ada form tambah nasabah** (`POST /nasabah`) — mungkin bagian dari fitur admin
   di poin 1, tapi dicatat terpisah karena ini bisa jadi self-service form publik juga
   (perlu didiskusikan dengan pengurus bank sampah apakah pendaftaran nasabah baru boleh
   mandiri atau harus lewat pengurus).
8. **Data asli belum ada** — ini bukan bug kode, tapi catatan penting: `geojson/`
   (batas administratif, kerentanan bencana) masih file kosong, belum ada UMKM/profil
   dusun ter-seed di database. Semua ini nunggu hasil survei lapangan tim KKN. Kalau
   ini tiba, biasanya cukup isi lewat admin panel (setelah dibangun) — tidak perlu ubah
   kode frontend.
9. **Responsivitas mobile belum divalidasi secara visual.** Class Tailwind mobile-first
   sudah dipasang di semua komponen (breakpoint `sm:`/`md:`), tapi belum pernah dicek di
   device/viewport kecil beneran. Cek terutama: navbar hamburger menu, grid UMKM di layar
   sempit, dan peta Leaflet di viewport kecil.
10. **Belum ada automated test** — tidak ada testing framework (Vitest/RTL) yang
    ter-install maupun file test. Kalau mau nambah, ini proyek kosong dari sisi testing.
11. **`oxlint` belum pernah dijalankan bersih** — jalankan `npm run lint` dan bersihkan
    kalau ada warning sebelum PR besar.

---

## Known Issues / Gotchas

- **Leaflet default marker icon rusak di Vite** kalau tidak di-patch manual — sudah
  di-fix sekali di `GeoMap.jsx` (import icon PNG + `L.Icon.Default.mergeOptions`).
  Jangan bikin `MapContainer` baru dari nol tanpa fix ini, reuse `GeoMap.jsx`.
- **`/layers/*` tidak pakai envelope `{success,data}`** seperti endpoint lain — lihat
  catatan di bagian Konvensi di atas.
- **Backend endpoint bank sampah publik tidak ada auth** (`GET/POST /nasabah`,
  `POST /setoran`, dst semua tanpa `auth:sanctum` di `routes/api.php` backend saat ini)
  kecuali beberapa endpoint tertentu (update harga, laporan, CRUD UMKM). Kalau nanti
  dibuatkan halaman input setoran/nasabah baru, diskusikan dulu ke yang pegang backend
  apakah endpoint itu perlu digeser ke grup `auth:sanctum` supaya tidak publik.
- **Nama dusun di database**: enum `karangasem` / `blongkeng` (huruf kecil, tanpa
  spasi). Kalau nulis query param atau path (`?dusun=karangasem`, `/profil/blongkeng`),
  pastikan pakai slug ini. Nama lama "Kaweron" / "Dusun Mitra" / "Tegalwungu" sudah
  di-rename total dan tidak dipakai lagi di kode manapun — kalau nemu sisa referensi itu
  di suatu tempat, berarti ada yang belum ke-update.
- **`postcss`/`autoprefixer` sudah dihapus dari `package.json`** — tidak dibutuhkan
  karena pakai `@tailwindcss/vite`. Kalau `npm install` tiba-tiba nambahin lagi
  (misal gara-gara dependency lain), itu bukan regresi yang perlu dikhawatirkan.

---

## Kalau Butuh Konteks Lebih

- Kontrak API lengkap (semua endpoint, format request/response): `../CLAUDE.md`.
- Koleksi Postman buat coba-coba endpoint manual: `../docs/Orkestrasi-Digital.postman_collection.json`.
- Kode backend: `../backend/` (Laravel — controller di `app/Http/Controllers/{BankSampah,Portal}/`).
