<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // ADMIN_DEFAULT_EMAIL/PASSWORD dipertahankan (bukan diganti nama) supaya
        // akun admin yang sudah dipakai di production tidak berubah kredensial
        // begitu kolom role ditambahkan -- akun lama otomatis jadi admin bank
        // sampah lewat default kolom role di migrasi.
        $this->seedAdmin(
            env('ADMIN_DEFAULT_EMAIL', 'admin@desadijital.id'),
            env('ADMIN_DEFAULT_PASSWORD'),
            'ADMIN_DEFAULT_PASSWORD',
            'Admin Bank Sampah',
            User::ROLE_BANK_SAMPAH,
        );

        $this->seedAdmin(
            env('ADMIN_DESA_EMAIL', 'admindesa@desadijital.id'),
            env('ADMIN_DESA_PASSWORD'),
            'ADMIN_DESA_PASSWORD',
            'Admin Desa Digital',
            User::ROLE_DESA,
        );
    }

    private function seedAdmin(string $email, ?string $password, string $envVarName, string $name, string $role): void
    {
        if (! $password) {
            // Password lemah "password" cuma boleh dipakai di dev/test lokal.
            // Di staging/production wajib di-set eksplisit lewat env supaya
            // tidak ada yang lupa ganti dari default sebelum go-live.
            if (! app()->environment('local', 'testing')) {
                throw new \RuntimeException(
                    "{$envVarName} belum di-set di env. Wajib diisi sebelum menjalankan AdminSeeder di luar local/testing."
                );
            }

            $password = 'password';
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'role' => $role,
            ]
        );
    }
}
