<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // String biasa (bukan native enum) -- lihat migrasi rename dusun
        // tegalwungu->blongkeng untuk alasan lengkap kenapa enum native bikin
        // masalah lintas-driver kalau nanti perlu diubah lagi. Nilai valid
        // divalidasi di level aplikasi (lihat App\Models\User::ROLES).
        // Default 'admin_bank_sampah' supaya admin yang sudah ada (seeded
        // sebelum kolom ini ada) tetap bisa akses fitur bank sampah tanpa
        // perlu migrasi data manual.
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('admin_bank_sampah')->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
