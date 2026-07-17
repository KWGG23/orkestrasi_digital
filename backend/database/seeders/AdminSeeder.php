<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_DEFAULT_EMAIL', 'admin@desadijital.id');
        $password = env('ADMIN_DEFAULT_PASSWORD');

        if (! $password) {
            // Password lemah "password" cuma boleh dipakai di dev/test lokal.
            // Di staging/production wajib di-set eksplisit lewat env supaya
            // tidak ada yang lupa ganti dari default sebelum go-live.
            if (! app()->environment('local', 'testing')) {
                throw new \RuntimeException(
                    'ADMIN_DEFAULT_PASSWORD belum di-set di env. Wajib diisi sebelum menjalankan AdminSeeder di luar local/testing.'
                );
            }

            $password = 'password';
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'Admin Desa Digital',
                'password' => Hash::make($password),
            ]
        );
    }
}
