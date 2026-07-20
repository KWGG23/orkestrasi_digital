<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_desa_ditolak_akses_endpoint_bank_sampah(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->postJson('/api/v1/nasabah', [
            'nama' => 'Warga Baru',
            'alamat' => 'Karangasem',
        ]);

        $response->assertStatus(403)->assertJsonPath('success', false);
    }

    public function test_admin_bank_sampah_ditolak_akses_endpoint_portal_desa(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_BANK_SAMPAH]));

        $response = $this->postJson('/api/v1/umkm', [
            'nama_usaha' => 'Warung Coba',
            'nama_pemilik' => 'Budi',
            'dusun' => 'karangasem',
            'kategori' => 'kuliner',
        ]);

        $response->assertStatus(403)->assertJsonPath('success', false);
    }

    public function test_login_mengembalikan_role_user(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_DESA]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.user.role', User::ROLE_DESA);
    }

    public function test_me_mengembalikan_role_user(): void
    {
        Sanctum::actingAs($user = User::factory()->create(['role' => User::ROLE_BANK_SAMPAH]));

        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(200)->assertJsonPath('data.role', User::ROLE_BANK_SAMPAH);
    }
}
