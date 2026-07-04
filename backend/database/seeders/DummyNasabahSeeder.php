<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DummyNasabahSeeder extends Seeder
{
    public function run(): void
    {
        $nasabah = [
            ['nama' => 'Siti Rahayu',    'no_anggota' => 'KRA-001', 'rt' => '01', 'rw' => '01', 'no_hp' => '081234567890'],
            ['nama' => 'Budi Santoso',   'no_anggota' => 'KRA-002', 'rt' => '01', 'rw' => '02', 'no_hp' => '081234567891'],
            ['nama' => 'Dewi Lestari',   'no_anggota' => 'KRA-003', 'rt' => '02', 'rw' => '01', 'no_hp' => '081234567892'],
            ['nama' => 'Ahmad Fauzi',    'no_anggota' => 'KRA-004', 'rt' => '02', 'rw' => '02', 'no_hp' => '081234567893'],
            ['nama' => 'Nurul Hidayah',  'no_anggota' => 'KRA-005', 'rt' => '03', 'rw' => '01', 'no_hp' => '081234567894'],
            ['nama' => 'Eko Prasetyo',   'no_anggota' => 'KRA-006', 'rt' => '03', 'rw' => '02', 'no_hp' => '081234567895'],
            ['nama' => 'Sri Wahyuni',    'no_anggota' => 'KRA-007', 'rt' => '04', 'rw' => '01', 'no_hp' => '081234567896'],
            ['nama' => 'Hendra Kusuma',  'no_anggota' => 'KRA-008', 'rt' => '04', 'rw' => '02', 'no_hp' => '081234567897'],
            ['nama' => 'Rina Agustina',  'no_anggota' => 'KRA-009', 'rt' => '01', 'rw' => '03', 'no_hp' => '081234567898'],
            ['nama' => 'Joko Widodo',    'no_anggota' => 'KRA-010', 'rt' => '02', 'rw' => '03', 'no_hp' => '081234567899'],
        ];

        $now = now();
        foreach ($nasabah as $data) {
            DB::table('nasabah')->insertOrIgnore([
                'nama'            => $data['nama'],
                'no_anggota'      => $data['no_anggota'],
                'alamat'          => 'Dusun Karangasem, Muntilan',
                'rt'              => $data['rt'],
                'rw'              => $data['rw'],
                'no_hp'           => $data['no_hp'],
                'saldo_tabungan'  => 0,
                'created_at'      => $now,
                'updated_at'      => $now,
            ]);
        }
    }
}
