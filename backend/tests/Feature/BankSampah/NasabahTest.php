<?php

namespace Tests\Feature\BankSampah;

use App\Models\Nasabah;
use App\Models\Setoran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NasabahTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_nasabah_bisa_diakses_tanpa_login(): void
    {
        Nasabah::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/nasabah');

        $response->assertStatus(200)->assertJsonCount(3, 'data');
    }

    public function test_list_diurutkan_berdasarkan_no_anggota(): void
    {
        Nasabah::factory()->create(['no_anggota' => 'KRA-0003']);
        Nasabah::factory()->create(['no_anggota' => 'KRA-0001']);
        Nasabah::factory()->create(['no_anggota' => 'KRA-0002']);

        $response = $this->getJson('/api/v1/nasabah');

        $urutan = collect($response->json('data'))->pluck('no_anggota')->all();
        $this->assertSame(['KRA-0001', 'KRA-0002', 'KRA-0003'], $urutan);
    }

    public function test_list_bisa_dicari_berdasarkan_nama(): void
    {
        Nasabah::factory()->create(['nama' => 'Siti Aminah']);
        Nasabah::factory()->create(['nama' => 'Joko Susilo']);

        $response = $this->getJson('/api/v1/nasabah?q=siti');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('Siti Aminah', $response->json('data.0.nama'));
    }

    public function test_list_bisa_dicari_berdasarkan_no_anggota(): void
    {
        Nasabah::factory()->create(['no_anggota' => 'KRA-0099']);
        Nasabah::factory()->create(['no_anggota' => 'KRA-0001']);

        $response = $this->getJson('/api/v1/nasabah?q=0099');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('KRA-0099', $response->json('data.0.no_anggota'));
    }

    public function test_list_menyertakan_meta_pagination(): void
    {
        Nasabah::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/nasabah');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.page', 1)
            ->assertJsonPath('meta.per_page', 20);
    }

    public function test_detail_nasabah_bisa_diakses_tanpa_login(): void
    {
        $nasabah = Nasabah::factory()->create();

        $response = $this->getJson("/api/v1/nasabah/{$nasabah->id}");

        $response->assertStatus(200)->assertJsonPath('data.id', $nasabah->id);
    }

    public function test_detail_nasabah_menyertakan_10_setoran_terakhir(): void
    {
        $nasabah = Nasabah::factory()->create();

        foreach (range(1, 12) as $i) {
            Setoran::create([
                'no_nota' => 'NOT-2026071'.str_pad((string) $i, 2, '0', STR_PAD_LEFT).'-0001',
                'id_nasabah' => $nasabah->id,
                'tanggal' => now()->subDays($i)->toDateString(),
                'total_harga' => 1000 * $i,
                'metode' => 'tunai',
            ]);
        }

        $response = $this->getJson("/api/v1/nasabah/{$nasabah->id}");

        $response->assertStatus(200)->assertJsonCount(10, 'data.setorans');
    }

    public function test_detail_nasabah_yang_tidak_ada_menghasilkan_404(): void
    {
        $response = $this->getJson('/api/v1/nasabah/99999');

        $response->assertStatus(404);
    }

    public function test_tamu_tanpa_token_tidak_bisa_tambah_nasabah(): void
    {
        $response = $this->postJson('/api/v1/nasabah', [
            'nama' => 'Nasabah Baru',
            'no_anggota' => 'KRA-0100',
        ]);

        $response->assertStatus(401);
        $this->assertDatabaseCount('nasabah', 0);
    }

    public function test_admin_bisa_tambah_nasabah(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/nasabah', [
            'nama' => 'Nasabah Baru',
            'no_anggota' => 'KRA-0100',
            'alamat' => 'Jl. Contoh No. 1',
            'no_hp' => '081234567890',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nama', 'Nasabah Baru')
            ->assertJsonPath('data.saldo_tabungan', '0.00'); // default kolom

        $this->assertDatabaseHas('nasabah', ['no_anggota' => 'KRA-0100']);
    }

    public function test_tambah_nasabah_dengan_no_anggota_duplikat_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());
        Nasabah::factory()->create(['no_anggota' => 'KRA-0001']);

        $response = $this->postJson('/api/v1/nasabah', [
            'nama' => 'Nasabah Lain',
            'no_anggota' => 'KRA-0001',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('no_anggota')
            ->assertJsonPath('errors.no_anggota.0', 'No anggota sudah terdaftar.');

        $this->assertDatabaseCount('nasabah', 1);
    }

    public function test_tambah_nasabah_tanpa_nama_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/nasabah', [
            'no_anggota' => 'KRA-0100',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('nama');
    }
}
