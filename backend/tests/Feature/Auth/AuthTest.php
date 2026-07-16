<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_dengan_kredensial_benar_mengembalikan_token(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@desadijital.id',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@desadijital.id',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.email', 'admin@desadijital.id')
            ->assertJsonPath('data.token_type', 'Bearer');

        $this->assertNotEmpty($response->json('data.token'));
        // Password tidak boleh pernah ikut ke response.
        $this->assertArrayNotHasKey('password', $response->json('data.user'));
    }

    public function test_login_dengan_password_salah_ditolak(): void
    {
        User::factory()->create([
            'email' => 'admin@desadijital.id',
            'password' => Hash::make('password'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@desadijital.id',
            'password' => 'password-salah',
        ]);

        $response->assertStatus(401)
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Email atau password salah.');
    }

    public function test_login_dengan_email_tidak_terdaftar_ditolak(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'tidak-ada@desadijital.id',
            'password' => 'password',
        ]);

        $response->assertStatus(401)->assertJsonPath('success', false);
    }

    public function test_login_tanpa_email_atau_password_gagal_validasi(): void
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password'])
            ->assertJsonPath('errors.email.0', 'Email wajib diisi.')
            ->assertJsonPath('errors.password.0', 'Password wajib diisi.');
    }

    public function test_login_ulang_mencabut_token_sesi_sebelumnya(): void
    {
        User::factory()->create([
            'email' => 'admin@desadijital.id',
            'password' => Hash::make('password'),
        ]);

        $tokenLama = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@desadijital.id', 'password' => 'password',
        ])->json('data.token');

        // Login kedua kali -> token lama harus tercabut (satu sesi aktif per admin).
        $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@desadijital.id', 'password' => 'password',
        ]);

        // Auth::once() di controller menyimpan user yang barusan login di guard 'web'
        // untuk request itu saja, tapi TestCase memakai instance guard yang sama untuk
        // seluruh panggilan postJson()/getJson() dalam satu method test — beda dengan
        // request HTTP asli yang selalu independen. forgetGuards() menirukan itu supaya
        // request berikut benar-benar hanya mengandalkan header Authorization yang dikirim.
        $this->app['auth']->forgetGuards();

        $response = $this->withHeader('Authorization', "Bearer {$tokenLama}")
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }

    public function test_me_tanpa_token_ditolak(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }

    public function test_me_dengan_token_valid_mengembalikan_data_user(): void
    {
        $user = User::factory()->create(['name' => 'Admin Desa Digital']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.name', 'Admin Desa Digital');
        $this->assertArrayNotHasKey('password', $response->json('data'));
    }

    public function test_logout_tanpa_token_ditolak(): void
    {
        $response = $this->postJson('/api/v1/auth/logout');

        $response->assertStatus(401);
    }

    public function test_logout_menghapus_token_yang_sedang_dipakai(): void
    {
        User::factory()->create([
            'email' => 'admin@desadijital.id',
            'password' => Hash::make('password'),
        ]);

        $token = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@desadijital.id', 'password' => 'password',
        ])->json('data.token');

        // Lihat catatan forgetGuards() di test login_ulang di atas — perlu di sini juga
        // supaya request logout ini benar-benar dievaluasi lewat Bearer token, bukan
        // sisa state guard sesi dari panggilan login() barusan.
        $this->app['auth']->forgetGuards();

        $logout = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v1/auth/logout');

        $logout->assertStatus(200)->assertJsonPath('success', true);

        // Sanctum RequestGuard juga meng-cache user yang berhasil ia-resolve untuk
        // guard instance itu sendiri (bukan hanya guard sesi 'web') — bersihkan lagi
        // supaya request berikut mengevaluasi token dari nol, bukan dari cache request logout di atas.
        $this->app['auth']->forgetGuards();

        // Token yang baru saja dipakai logout tidak boleh bisa dipakai lagi.
        $reuse = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');

        $reuse->assertStatus(401);
    }
}
