<?php

namespace Database\Factories;

use App\Models\JenisSampah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JenisSampah>
 */
class JenisSampahFactory extends Factory
{
    protected $model = JenisSampah::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->unique()->words(2, true),
            'kategori' => fake()->randomElement(['Kertas', 'Plastik', 'Logam', 'Kaca']),
            'satuan' => 'kg',
            'harga_per_satuan' => fake()->randomFloat(2, 500, 5000),
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
