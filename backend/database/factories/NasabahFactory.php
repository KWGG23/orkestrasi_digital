<?php

namespace Database\Factories;

use App\Models\Nasabah;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Nasabah>
 */
class NasabahFactory extends Factory
{
    protected $model = Nasabah::class;

    public function definition(): array
    {
        return [
            'nama' => fake()->name(),
            'no_anggota' => 'KRA-'.fake()->unique()->numerify('####'),
            'alamat' => fake()->address(),
            'rt' => fake()->numerify('##'),
            'rw' => fake()->numerify('##'),
            'no_hp' => fake()->numerify('08##########'),
            'saldo_tabungan' => 0,
        ];
    }
}
