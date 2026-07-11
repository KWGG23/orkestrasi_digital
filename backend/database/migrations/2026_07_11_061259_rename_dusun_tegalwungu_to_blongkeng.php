<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('umkms')->where('dusun', 'tegalwungu')->update(['dusun' => 'blongkeng']);
        DB::statement("ALTER TABLE umkms MODIFY dusun ENUM('karangasem', 'blongkeng') NOT NULL");

        DB::table('profil_dusuns')->where('dusun', 'tegalwungu')->update(['dusun' => 'blongkeng']);
        DB::statement("ALTER TABLE profil_dusuns MODIFY dusun ENUM('karangasem', 'blongkeng') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('umkms')->where('dusun', 'blongkeng')->update(['dusun' => 'tegalwungu']);
        DB::statement("ALTER TABLE umkms MODIFY dusun ENUM('karangasem', 'tegalwungu') NOT NULL");

        DB::table('profil_dusuns')->where('dusun', 'blongkeng')->update(['dusun' => 'tegalwungu']);
        DB::statement("ALTER TABLE profil_dusuns MODIFY dusun ENUM('karangasem', 'tegalwungu') NOT NULL");
    }
};
