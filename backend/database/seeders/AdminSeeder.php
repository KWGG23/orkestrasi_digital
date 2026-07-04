<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@desadijital.id'],
            [
                'name' => 'Admin Desa Digital',
                'password' => Hash::make('password'),
            ]
        );
    }
}
