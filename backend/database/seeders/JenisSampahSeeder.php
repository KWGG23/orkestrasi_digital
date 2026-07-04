<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JenisSampahSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('jenis_sampahs')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $now = now();

        // Data harga beli (HB) dari nota resmi BSI — Dipa Nirmala
        $data = [
            // Kertas
            ['nama' => 'Kardus',                           'kategori' => 'Kertas',     'satuan' => 'kg',  'harga_per_satuan' => 1000],
            ['nama' => 'Duplek',                           'kategori' => 'Kertas',     'satuan' => 'kg',  'harga_per_satuan' => 400],
            ['nama' => 'Arsip (HVS) Putih',                'kategori' => 'Kertas',     'satuan' => 'kg',  'harga_per_satuan' => 1000],
            ['nama' => 'Buku Cetak Bersih Tanpa Kulit',    'kategori' => 'Kertas',     'satuan' => 'kg',  'harga_per_satuan' => 1000],
            ['nama' => 'Koran',                            'kategori' => 'Kertas',     'satuan' => 'kg',  'harga_per_satuan' => 1800],
            ['nama' => 'Kornis Roll',                      'kategori' => 'Kertas',     'satuan' => 'kg',  'harga_per_satuan' => 200],

            // Logam
            ['nama' => 'Besi',                             'kategori' => 'Logam',      'satuan' => 'kg',  'harga_per_satuan' => 2500],
            ['nama' => 'Rongsok',                          'kategori' => 'Logam',      'satuan' => 'kg',  'harga_per_satuan' => 1500],
            ['nama' => 'Kaleng',                           'kategori' => 'Logam',      'satuan' => 'kg',  'harga_per_satuan' => 1800],
            ['nama' => 'Alma Panci',                       'kategori' => 'Logam',      'satuan' => 'kg',  'harga_per_satuan' => 8000],
            ['nama' => 'Alma Kaleng',                      'kategori' => 'Logam',      'satuan' => 'kg',  'harga_per_satuan' => 7000],
            ['nama' => 'Seng',                             'kategori' => 'Logam',      'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Tabung Gas',                       'kategori' => 'Logam',      'satuan' => 'pcs', 'harga_per_satuan' => 150000],

            // Plastik
            ['nama' => 'Pet Bening Mix +Blues',            'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 2500],
            ['nama' => 'Pet Biru Mix',                     'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Pet Bening',                       'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 3000],
            ['nama' => 'Pet Warna',                        'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Lasegar',                          'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 800],
            ['nama' => 'Ember Warna',                      'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 1200],
            ['nama' => 'Aqua Gelas PP A',                  'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 3400],
            ['nama' => 'Aqua Gelas PP B',                  'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 2400],
            ['nama' => 'Plastik Campur',                   'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Mountea PP / Ale-Ale',             'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 1500],
            ['nama' => 'Multilayer',                       'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 150],
            ['nama' => 'Karung PP',                        'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 400],
            ['nama' => 'Karung Pet',                       'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 150],
            ['nama' => 'Botol Infus LDPE',                 'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 3000],
            ['nama' => 'Jerigen Hemodialisa HDPE',         'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 2000],
            ['nama' => 'Spruit PP',                        'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 800],
            ['nama' => 'Botol Kemasan B3',                 'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 1000],
            ['nama' => 'Tutup Galon',                      'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 2000],
            ['nama' => 'Tali Plastik',                     'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 150],
            ['nama' => 'Plastik Mika',                     'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 150],
            ['nama' => 'PVC & Banner Spanduk',             'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 100],
            ['nama' => 'Sedotan / Pipet Bening',           'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Akrilik',                          'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Micca',                            'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 100],
            ['nama' => 'Kerasan / Hitaman',                'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Pet Mix Kotor',                    'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Gelas PP Mix Kotor',               'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Botol Soya',                       'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 1500],
            ['nama' => 'Botol Milku',                      'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 500],
            ['nama' => 'Sedotan Pipet Warna',              'kategori' => 'Plastik',    'satuan' => 'kg',  'harga_per_satuan' => 400],

            // Kaca
            ['nama' => 'Beling / Kaca',                    'kategori' => 'Kaca',       'satuan' => 'kg',  'harga_per_satuan' => 150],

            // Elektronik
            ['nama' => 'PCB TV',                           'kategori' => 'Elektronik', 'satuan' => 'kg',  'harga_per_satuan' => 3000],
            ['nama' => 'Kabel',                            'kategori' => 'Elektronik', 'satuan' => 'kg',  'harga_per_satuan' => 500],

            // Tekstil & Lainnya
            ['nama' => 'Sepatu Bekas',                     'kategori' => 'Tekstil',    'satuan' => 'pcs', 'harga_per_satuan' => 220],
            ['nama' => 'Sepatu Safety Bekas',              'kategori' => 'Tekstil',    'satuan' => 'pcs', 'harga_per_satuan' => 2500],
            ['nama' => 'Baju Bekas',                       'kategori' => 'Tekstil',    'satuan' => 'kg',  'harga_per_satuan' => 120],
            ['nama' => 'Ban Bekas',                        'kategori' => 'Lainnya',    'satuan' => 'kg',  'harga_per_satuan' => 130],
            ['nama' => 'Mainan',                           'kategori' => 'Lainnya',    'satuan' => 'kg',  'harga_per_satuan' => 750],
            ['nama' => 'Jelantah',                         'kategori' => 'Lainnya',    'satuan' => 'kg',  'harga_per_satuan' => 3400],

            // Jasa
            ['nama' => 'Jasa Pengangkutan & Pengolahan',   'kategori' => 'Jasa',       'satuan' => 'kg',  'harga_per_satuan' => 4500],
            ['nama' => 'Sampah Campur (Jasa Pemilahan)',   'kategori' => 'Jasa',       'satuan' => 'kg',  'harga_per_satuan' => 2500],
        ];

        foreach ($data as $item) {
            DB::table('jenis_sampahs')->insert(array_merge($item, [
                'aktif'      => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]));
        }
    }
}
