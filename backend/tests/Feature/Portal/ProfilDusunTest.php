<?php

namespace Tests\Feature\Portal;

use App\Models\ProfilDusun;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfilDusunTest extends TestCase
{
    use RefreshDatabase;

    public function test_profil_dusun_yang_belum_diisi_mengembalikan_konten_null_bukan_404(): void
    {
        $response = $this->getJson('/api/v1/profil/karangasem');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.dusun', 'karangasem')
            ->assertJsonPath('data.konten', null);
    }

    public function test_profil_dusun_yang_sudah_diisi_mengembalikan_kontennya(): void
    {
        ProfilDusun::create([
            'dusun' => 'blongkeng',
            'konten' => ['sejarah' => 'Dusun Blongkeng terbentuk sejak lama.', 'jumlah_kk' => 80],
        ]);

        $response = $this->getJson('/api/v1/profil/blongkeng');

        $response->assertStatus(200)
            ->assertJsonPath('data.dusun', 'blongkeng')
            ->assertJsonPath('data.konten.jumlah_kk', 80);
    }

    public function test_nama_dusun_tidak_valid_menghasilkan_404(): void
    {
        $response = $this->getJson('/api/v1/profil/tegalwungu');

        $response->assertStatus(404)->assertJsonPath('success', false);
    }

    public function test_tamu_tanpa_token_tidak_bisa_update_profil(): void
    {
        $response = $this->putJson('/api/v1/profil/karangasem', [
            'konten' => ['sejarah' => 'Percobaan tanpa login'],
        ]);

        $response->assertStatus(401);
        $this->assertDatabaseCount('profil_dusuns', 0);
    }

    public function test_admin_bisa_membuat_profil_dusun_baru(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->putJson('/api/v1/profil/karangasem', [
            'konten' => ['sejarah' => 'Dusun Karangasem terbentuk sejak lama.', 'jumlah_kk' => 120],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.dusun', 'karangasem')
            ->assertJsonPath('data.konten.jumlah_kk', 120);

        $this->assertDatabaseHas('profil_dusuns', ['dusun' => 'karangasem']);
    }

    public function test_admin_bisa_memperbarui_profil_dusun_yang_sudah_ada(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));
        ProfilDusun::create(['dusun' => 'karangasem', 'konten' => ['jumlah_kk' => 100]]);

        $response = $this->putJson('/api/v1/profil/karangasem', [
            'konten' => ['jumlah_kk' => 150],
        ]);

        $response->assertStatus(200)->assertJsonPath('data.konten.jumlah_kk', 150);

        // updateOrCreate tidak boleh membuat baris duplikat untuk dusun yang sama.
        $this->assertDatabaseCount('profil_dusuns', 1);
    }

    public function test_update_profil_dengan_nama_dusun_tidak_valid_menghasilkan_404(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->putJson('/api/v1/profil/kaweron', [
            'konten' => ['sejarah' => 'Percobaan nama lama'],
        ]);

        $response->assertStatus(404);
        $this->assertDatabaseCount('profil_dusuns', 0);
    }

    public function test_update_profil_tanpa_konten_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->putJson('/api/v1/profil/karangasem', []);

        $response->assertStatus(422)->assertJsonValidationErrors('konten');
    }

    public function test_update_profil_dengan_konten_bukan_array_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->putJson('/api/v1/profil/karangasem', [
            'konten' => 'ini string, bukan objek/array',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('konten');
    }

    public function test_kedua_dusun_punya_profil_independen(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $this->putJson('/api/v1/profil/karangasem', ['konten' => ['jumlah_kk' => 120]]);
        $this->putJson('/api/v1/profil/blongkeng', ['konten' => ['jumlah_kk' => 80]]);

        $this->getJson('/api/v1/profil/karangasem')->assertJsonPath('data.konten.jumlah_kk', 120);
        $this->getJson('/api/v1/profil/blongkeng')->assertJsonPath('data.konten.jumlah_kk', 80);
    }
}
