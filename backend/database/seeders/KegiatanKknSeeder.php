<?php

namespace Database\Seeders;

use App\Models\KegiatanKkn;
use Illuminate\Database\Seeder;

class KegiatanKknSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'tahun' => 2026,
                'judul' => 'KKN Digitalisasi Desa 2026',
                'deskripsi' => 'Pengembangan Bank Sampah Digital dan Portal Desa Digital di Dusun Karangasem dan Dusun Blongkeng, Kecamatan Ngluwar, Kabupaten Magelang.',
                'foto' => [],
            ],
            [
                'tahun' => 2027,
                'judul' => 'KKN Digitalisasi Desa 2027',
                'deskripsi' => 'Coming soon.',
                'foto' => [],
            ],
            [
                'tahun' => 2028,
                'judul' => 'KKN Digitalisasi Desa 2028',
                'deskripsi' => 'Coming soon.',
                'foto' => [],
            ],
        ];

        $tahunAktif = array_column($data, 'tahun');
        KegiatanKkn::whereNotIn('tahun', $tahunAktif)->delete();

        foreach ($data as $item) {
            KegiatanKkn::updateOrCreate(['tahun' => $item['tahun']], $item);
        }
    }
}
