<?php

namespace Tests\Feature\BankSampah;

use App\Models\Nasabah;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TabunganTest extends TestCase
{
    use RefreshDatabase;

    public function test_tamu_tanpa_token_tidak_bisa_menarik_tabungan(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 10000]);

        $response = $this->postJson('/api/v1/tabungan/tarik', [
            'id_nasabah' => $nasabah->id,
            'jumlah' => 5000,
        ]);

        $response->assertStatus(401);
        $this->assertEquals(10000, $nasabah->fresh()->saldo_tabungan);
    }

    public function test_admin_bisa_menarik_tabungan_saat_saldo_cukup(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 10000]);

        $response = $this->postJson('/api/v1/tabungan/tarik', [
            'id_nasabah' => $nasabah->id,
            'jumlah' => 4000,
            'keterangan' => 'Ambil untuk kebutuhan sehari-hari',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.jenis', 'keluar')
            ->assertJsonPath('data.saldo_sesudah', '6000.00')
            ->assertJsonPath('data.nasabah.saldo_tabungan', '6000.00');

        $this->assertEquals(6000, $nasabah->fresh()->saldo_tabungan);
    }

    public function test_penarikan_melebihi_saldo_ditolak_dengan_422(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 2000]);

        $response = $this->postJson('/api/v1/tabungan/tarik', [
            'id_nasabah' => $nasabah->id,
            'jumlah' => 3000,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Saldo tabungan tidak mencukupi');

        $this->assertEquals(2000, $nasabah->fresh()->saldo_tabungan);
    }

    public function test_jumlah_penarikan_di_bawah_minimum_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 10000]);

        $response = $this->postJson('/api/v1/tabungan/tarik', [
            'id_nasabah' => $nasabah->id,
            'jumlah' => 500, // di bawah minimum 1000 pada TarikTabunganRequest
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('jumlah');
        $this->assertEquals(10000, $nasabah->fresh()->saldo_tabungan);
    }

    public function test_riwayat_tabungan_bisa_dilihat_tanpa_login(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 7500]);

        $response = $this->getJson("/api/v1/tabungan/{$nasabah->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nasabah.saldo_tabungan', '7500.00');
    }
}
