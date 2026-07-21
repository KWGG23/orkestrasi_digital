<?php

namespace Database\Seeders;

use App\Models\KegiatanKkn;
use Illuminate\Database\Seeder;

class KegiatanKknSeeder extends Seeder
{
    public function run(): void
    {
        // Satu baris = satu (tahun, dusun) -- tiap dusun punya kelompok KKN
        // sendiri-sendiri tiap tahun, jadi dokumentasinya dipisah per dusun.
        $data = [
            [
                'tahun' => 2026,
                'dusun' => 'karangasem',
                'nama_kelompok' => 'KKN Digitalisasi Desa - Karangasem',
                'judul' => 'KKN Digitalisasi Desa 2026 - Dusun Karangasem',
                'deskripsi' => 'Pengembangan Bank Sampah Digital di Dusun Karangasem, Kecamatan Ngluwar, Kabupaten Magelang.',
                'foto' => [],
            ],
            [
                'tahun' => 2026,
                'dusun' => 'blongkeng',
                'nama_kelompok' => 'KKN Digitalisasi Desa - Blongkeng',
                'judul' => 'KKN Digitalisasi Desa 2026 - Dusun Blongkeng',
                'deskripsi' => 'Pengembangan Portal Desa Digital di Dusun Blongkeng, Kecamatan Ngluwar, Kabupaten Magelang.',
                'foto' => [],
            ],
        ];

        foreach ($data as $item) {
            KegiatanKkn::updateOrCreate(
                ['tahun' => $item['tahun'], 'dusun' => $item['dusun']],
                $item
            );
        }
    }
}
