<?php

namespace Database\Factories;

use App\Models\KegiatanKkn;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KegiatanKkn>
 */
class KegiatanKknFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    private static int $tahunCounter = 2020;

    public function definition(): array
    {
        return [
            // Tahun increment tiap panggilan (bukan random) supaya kombinasi
            // (tahun, dusun) tidak gampang tabrakan dengan unique constraint
            // kalau test bikin banyak baris sekaligus.
            'tahun' => self::$tahunCounter++,
            'dusun' => fake()->randomElement(['karangasem', 'blongkeng']),
            'nama_kelompok' => 'KKN '.fake()->words(2, true),
            'judul' => fake()->sentence(4),
            'deskripsi' => fake()->paragraph(),
            'foto' => [],
        ];
    }
}
