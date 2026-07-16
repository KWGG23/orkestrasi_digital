<?php

namespace Tests\Feature\BankSampah;

use App\Models\JenisSampah;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class JenisSampahTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_publik_hanya_menampilkan_yang_aktif(): void
    {
        JenisSampah::factory()->create(['nama' => 'Kardus', 'aktif' => true]);
        JenisSampah::factory()->nonaktif()->create(['nama' => 'Sampah Lama']);

        $response = $this->getJson('/api/v1/jenis-sampah');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nama', 'Kardus');
    }

    public function test_list_diurutkan_berdasarkan_kategori_lalu_nama(): void
    {
        JenisSampah::factory()->create(['nama' => 'Botol Kaca', 'kategori' => 'Kaca']);
        JenisSampah::factory()->create(['nama' => 'Kaleng', 'kategori' => 'Logam']);
        JenisSampah::factory()->create(['nama' => 'Arsip', 'kategori' => 'Kertas']);
        JenisSampah::factory()->create(['nama' => 'Duplek', 'kategori' => 'Kertas']);

        $response = $this->getJson('/api/v1/jenis-sampah');

        $response->assertStatus(200);
        $urutan = collect($response->json('data'))->pluck('nama')->all();

        $this->assertSame(['Botol Kaca', 'Arsip', 'Duplek', 'Kaleng'], $urutan);
    }

    public function test_tamu_tanpa_token_tidak_bisa_update_harga(): void
    {
        $jenis = JenisSampah::factory()->create(['harga_per_satuan' => 1000]);

        $response = $this->putJson("/api/v1/jenis-sampah/{$jenis->id}", [
            'harga_per_satuan' => 1500,
        ]);

        $response->assertStatus(401);
        $this->assertEquals(1000, $jenis->fresh()->harga_per_satuan);
    }

    public function test_admin_bisa_update_harga(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $jenis = JenisSampah::factory()->create(['harga_per_satuan' => 1000, 'aktif' => true]);

        $response = $this->putJson("/api/v1/jenis-sampah/{$jenis->id}", [
            'harga_per_satuan' => 1750,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.harga_per_satuan', '1750.00');

        $this->assertEquals(1750, $jenis->fresh()->harga_per_satuan);
    }

    public function test_admin_bisa_menonaktifkan_jenis_sampah(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $jenis = JenisSampah::factory()->create(['aktif' => true]);

        $response = $this->putJson("/api/v1/jenis-sampah/{$jenis->id}", [
            'harga_per_satuan' => $jenis->harga_per_satuan,
            'aktif' => false,
        ]);

        $response->assertStatus(200);
        $this->assertFalse($jenis->fresh()->aktif);

        // Sekali dinonaktifkan, harus langsung hilang dari list publik.
        $this->getJson('/api/v1/jenis-sampah')->assertJsonCount(0, 'data');
    }

    public function test_update_harga_negatif_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $jenis = JenisSampah::factory()->create(['harga_per_satuan' => 1000]);

        $response = $this->putJson("/api/v1/jenis-sampah/{$jenis->id}", [
            'harga_per_satuan' => -500,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('harga_per_satuan');
        $this->assertEquals(1000, $jenis->fresh()->harga_per_satuan);
    }

    public function test_update_jenis_sampah_yang_tidak_ada_menghasilkan_404(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson('/api/v1/jenis-sampah/99999', [
            'harga_per_satuan' => 1000,
        ]);

        $response->assertStatus(404);
    }
}
