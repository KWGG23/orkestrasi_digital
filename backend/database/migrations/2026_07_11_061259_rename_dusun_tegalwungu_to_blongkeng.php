<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('umkms')->where('dusun', 'tegalwungu')->update(['dusun' => 'blongkeng']);
        DB::table('profil_dusuns')->where('dusun', 'tegalwungu')->update(['dusun' => 'blongkeng']);

        if (DB::connection()->getDriverName() === 'mysql') {
            // ALTER ... MODIFY hanya valid di MySQL.
            DB::statement("ALTER TABLE umkms MODIFY dusun ENUM('karangasem', 'blongkeng') NOT NULL");
            DB::statement("ALTER TABLE profil_dusuns MODIFY dusun ENUM('karangasem', 'blongkeng') NOT NULL");
        } else {
            // SQLite (dipakai test suite) menegakkan enum lewat CHECK constraint yang
            // dibuat sekali saat tabel dibuat — masih berisi 'tegalwungu' kalau tidak
            // di-rebuild di sini. ->change() membuat Schema Builder merekonstruksi tabel.
            Schema::table('umkms', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'blongkeng'])->change();
            });
            Schema::table('profil_dusuns', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'blongkeng'])->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('umkms')->where('dusun', 'blongkeng')->update(['dusun' => 'tegalwungu']);
        DB::table('profil_dusuns')->where('dusun', 'blongkeng')->update(['dusun' => 'tegalwungu']);

        if (DB::connection()->getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE umkms MODIFY dusun ENUM('karangasem', 'tegalwungu') NOT NULL");
            DB::statement("ALTER TABLE profil_dusuns MODIFY dusun ENUM('karangasem', 'tegalwungu') NOT NULL");
        } else {
            Schema::table('umkms', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'tegalwungu'])->change();
            });
            Schema::table('profil_dusuns', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'tegalwungu'])->change();
            });
        }
    }
};
