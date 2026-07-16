<?php

namespace Database\Factories;

use App\Models\Pengumuman;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pengumuman>
 */
class PengumumanFactory extends Factory
{
    protected $model = Pengumuman::class;

    public function definition(): array
    {
        return [
            'judul' => fake()->sentence(4),
            'isi' => fake()->paragraph(),
            'tanggal_publish' => fake()->date(),
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
