<?php

namespace Database\Factories;

use App\Models\Umkm;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Umkm>
 */
class UmkmFactory extends Factory
{
    protected $model = Umkm::class;

    public function definition(): array
    {
        return [
            'nama_usaha' => fake()->company(),
            'nama_pemilik' => fake()->name(),
            'dusun' => fake()->randomElement(['karangasem', 'blongkeng']),
            'kategori' => fake()->randomElement(['kuliner', 'kerajinan', 'pertanian', 'jasa', 'perdagangan']),
            'deskripsi' => fake()->sentence(),
            'produk_utama' => [fake()->word()],
            'kisaran_harga' => 'Rp 10.000 - Rp 50.000',
            'no_wa' => fake()->numerify('08##########'),
            'punya_nib' => false,
            'aktif' => true,
        ];
    }

    public function nonaktif(): static
    {
        return $this->state(fn (array $attributes) => [
            'aktif' => false,
        ]);
    }
}
