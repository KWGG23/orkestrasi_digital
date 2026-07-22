<?php

namespace Database\Seeders;

use App\Models\JenisSampah;
use Illuminate\Database\Seeder;

class JenisSampahSeeder extends Seeder
{
    public function run(): void
    {
        // Data harga beli dari "DAFTAR HARGA BELI BSI DIPA NIRMALA UPDATE JULI
        // 2026" -- nota resmi terbaru dari BSI pusat, menggantikan nota lama
        // yang dipakai seeder ini sebelumnya (nama-nama itemnya beda total).
        // BSI belum punya API harga dinamis, jadi daftar ini dijaga manual di
        // sini dan diupdate ulang tiap kali BSI menerbitkan nota baru.
        $data = [
            // Kertas
            ['nama' => 'Arsip', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 2000],
            ['nama' => 'Buku/Kertas Campur', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 1200],
            ['nama' => 'Buram', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 1000],
            ['nama' => 'Duplex', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 500],
            ['nama' => 'Kardus', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 1600],
            ['nama' => 'Kertas Koran', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 3000],
            ['nama' => 'Sak Semen Merah', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 2500],
            ['nama' => 'Sak Semen Hijau', 'kategori' => 'Kertas', 'satuan' => 'kg', 'harga_per_satuan' => 1500],

            // Plastik
            ['nama' => 'Atom Campur', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 1000],
            ['nama' => 'Bodong Bersih Mix', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 3500],
            ['nama' => 'Bodong Kotor', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 2500],
            ['nama' => 'Bodong Warna', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 1000],
            ['nama' => 'Bohlam', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 300],
            ['nama' => 'Ember Warna (Cething, Kursi Plastik, Ember Selain Hitam)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 1500],
            ['nama' => 'Emberan Hitam', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 700],
            ['nama' => 'Galon', 'kategori' => 'Plastik', 'satuan' => 'pcs', 'harga_per_satuan' => 1000],
            ['nama' => 'Gelas Warna (Monti/Ale-ale)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 1500],
            ['nama' => 'Gelasan Bening (Agel) Kotor', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 2300],
            ['nama' => 'Gelasan Bening Bersih (Hilang Gelang Atas)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 2800],
            ['nama' => 'Gelasan Campur', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 1300],
            ['nama' => 'Karpet (Karpet Plastik Lantai)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 350],
            ['nama' => 'Karung Plastik (Bukan Goni)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 300],
            ['nama' => 'Karung Satuan (Kondisi Baik dan Bersih)', 'kategori' => 'Plastik', 'satuan' => 'pcs', 'harga_per_satuan' => 1000],
            ['nama' => 'Kaset CD', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 400],
            ['nama' => 'Kerasan', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 400],
            ['nama' => 'Mantol', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 500],
            ['nama' => 'Plastik Campur-campur', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 100],
            ['nama' => 'Plastik HD (Kresek Tanpa Foil)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 500],
            ['nama' => 'Plastik Sablon', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 600],
            ['nama' => 'PP (Plastik Bening)', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 800],
            ['nama' => 'Pralon', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 400],
            ['nama' => 'Putihan', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 2500],
            ['nama' => 'Termos Besar', 'kategori' => 'Plastik', 'satuan' => 'pcs', 'harga_per_satuan' => 500],
            ['nama' => 'Toplesan Plastik', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 2000],
            ['nama' => 'Tutup Botol', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 3000],
            ['nama' => 'Yakult', 'kategori' => 'Plastik', 'satuan' => 'kg', 'harga_per_satuan' => 400],

            // Logam
            ['nama' => 'Aki', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 7000],
            ['nama' => 'Aluminium', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 18000],
            ['nama' => 'Besi A', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 3500],
            ['nama' => 'Besi B', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 2500],
            ['nama' => 'Besi C (ex. Kompos Gas)', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 2000],
            ['nama' => 'Kabel', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 1500],
            ['nama' => 'Kaleng', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 2000],
            ['nama' => 'Stainless Steel', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 3000],
            ['nama' => 'Logam Jadel (Teflon/Enamel)', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 3000],
            ['nama' => 'Niumsari Satuan', 'kategori' => 'Logam', 'satuan' => 'pcs', 'harga_per_satuan' => 100],
            ['nama' => 'Niumsari Kiloan', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 15000],
            ['nama' => 'Payung', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 1500],
            ['nama' => 'Seng', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 700],
            ['nama' => 'Tembaga', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 80000],
            ['nama' => 'Metal (Regulator, Kran, Handle Pintu)', 'kategori' => 'Logam', 'satuan' => 'kg', 'harga_per_satuan' => 8000],

            // Beling
            ['nama' => 'Beling Campur (Pecahan Kaca Bukan Keramik, Botol Kaca Kecil Lainnya)', 'kategori' => 'Beling', 'satuan' => 'kg', 'harga_per_satuan' => 100],
            ['nama' => 'Botol AM', 'kategori' => 'Beling', 'satuan' => 'pcs', 'harga_per_satuan' => 300],
            ['nama' => 'Botol Gepeng', 'kategori' => 'Beling', 'satuan' => 'pcs', 'harga_per_satuan' => 150],
            ['nama' => 'Botol Sirup Kaca (Orang Tua/ABC/Marjan)', 'kategori' => 'Beling', 'satuan' => 'pcs', 'harga_per_satuan' => 50],
            ['nama' => 'Botol Kecap', 'kategori' => 'Beling', 'satuan' => 'pcs', 'harga_per_satuan' => 300],

            // Elektronik
            ['nama' => 'AC', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 220000],
            ['nama' => 'Android', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 2500],
            ['nama' => 'HP Jadul (Poliponik)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 2000],
            ['nama' => 'CPU (Lengkap, Jika Tidak Lengkap Masuk Seng/Kerasan)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 40000],
            ['nama' => 'Elektronik Kecil', 'kategori' => 'Elektronik', 'satuan' => 'kg', 'harga_per_satuan' => 2000],
            ['nama' => 'Kulkas 1 Pintu', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 50000],
            ['nama' => 'Kulkas 2 Pintu', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 90000],
            // Nota BSI menulis kisaran Rp30.000-45.000 tergantung kondisi --
            // schema kita cuma nampung satu harga tetap, dipakai titik tengahnya
            // (Rp37.500). Admin perlu sesuaikan manual per transaksi sesuai
            // kondisi laptop yang diterima.
            ['nama' => 'Laptop (Tergantung Kondisi, Rp30.000-45.000)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 37500],
            ['nama' => 'Majicom Besar (Lengkap, Jika Tidak Lengkap -Rp1.000)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 8000],
            ['nama' => 'Majicom Kecil (Lengkap, Jika Tidak Lengkap -Rp1.000)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 5000],
            ['nama' => 'Mesin Cuci (Lengkap, Jika Tidak Lengkap Masuk Kerasan)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 50000],
            ['nama' => 'TV/Monitor LCD/LED (Lengkap, Jika Tidak Lengkap Masuk Kerasan)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 12000],
            ['nama' => 'TV/Monitor Tabung (Lengkap, Jika Tidak Lengkap Masuk Kerasan)', 'kategori' => 'Elektronik', 'satuan' => 'pcs', 'harga_per_satuan' => 8000],

            // Lainnya
            ['nama' => 'Batok', 'kategori' => 'Lainnya', 'satuan' => 'kg', 'harga_per_satuan' => 1000],
            ['nama' => 'Jelantah', 'kategori' => 'Lainnya', 'satuan' => 'kg', 'harga_per_satuan' => 3000],
            ['nama' => 'Sendal Sepatu', 'kategori' => 'Lainnya', 'satuan' => 'kg', 'harga_per_satuan' => 200],
            ['nama' => 'Campur Aduk Belum Terpilah', 'kategori' => 'Lainnya', 'satuan' => 'kg', 'harga_per_satuan' => 200],
        ];

        // updateOrCreate per nama (bukan truncate() + insert ulang) -- jenis
        // sampah direferensikan detail_setorans (data transaksi historis),
        // truncate/insert ulang bikin ID lompat dan berpotensi merusak nota
        // lama. Item lama yang sudah tidak ada di nota terbaru ini dinonaktifkan
        // (bukan dihapus), sama seperti mekanisme "hapus" jenis sampah lain di
        // aplikasi ini (lihat JenisSampahController::update()).
        $namaAktif = [];
        foreach ($data as $item) {
            JenisSampah::updateOrCreate(
                ['nama' => $item['nama']],
                array_merge($item, ['aktif' => true])
            );
            $namaAktif[] = $item['nama'];
        }

        JenisSampah::whereNotIn('nama', $namaAktif)->update(['aktif' => false]);
    }
}
