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
        Schema::create('detail_setorans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_setoran')->constrained('setorans')->cascadeOnDelete();
            $table->foreignId('id_jenis_sampah')->constrained('jenis_sampahs')->restrictOnDelete();
            $table->decimal('berat_kg', 8, 3);
            $table->decimal('harga_satuan', 10, 2);
            $table->decimal('subtotal', 12, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_setorans');
    }
};
