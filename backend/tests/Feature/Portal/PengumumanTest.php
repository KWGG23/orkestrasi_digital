<?php

namespace Tests\Feature\Portal;

use App\Models\Pengumuman;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PengumumanTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_publik_hanya_menampilkan_yang_aktif(): void
    {
        Pengumuman::factory()->create(['judul' => 'Aktif']);
        Pengumuman::factory()->nonaktif()->create(['judul' => 'Nonaktif']);

        $response = $this->getJson('/api/v1/pengumuman');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('Aktif', $response->json('data.0.judul'));
    }

    public function test_list_diurutkan_dari_tanggal_publish_terbaru(): void
    {
        Pengumuman::factory()->create(['judul' => 'Lama', 'tanggal_publish' => '2026-01-01']);
        Pengumuman::factory()->create(['judul' => 'Terbaru', 'tanggal_publish' => '2026-07-16']);
        Pengumuman::factory()->create(['judul' => 'Tengah', 'tanggal_publish' => '2026-04-01']);

        $response = $this->getJson('/api/v1/pengumuman');

        $response->assertStatus(200);
        $urutan = collect($response->json('data'))->pluck('judul')->all();

        $this->assertSame(['Terbaru', 'Tengah', 'Lama'], $urutan);
    }

    public function test_list_kosong_tidak_error(): void
    {
        $response = $this->getJson('/api/v1/pengumuman');

        $response->assertStatus(200)->assertJsonCount(0, 'data');
    }

    public function test_tamu_tanpa_token_tidak_bisa_tambah_pengumuman(): void
    {
        $response = $this->postJson('/api/v1/pengumuman', [
            'judul' => 'Pengumuman Baru',
            'isi' => 'Isi pengumuman',
            'tanggal_publish' => '2026-07-16',
        ]);

        $response->assertStatus(401);
        $this->assertDatabaseCount('pengumumans', 0);
    }

    public function test_admin_bisa_tambah_pengumuman(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/pengumuman', [
            'judul' => 'Kerja Bakti Minggu Ini',
            'isi' => 'Kerja bakti dilaksanakan Minggu pagi di balai dusun.',
            'tanggal_publish' => '2026-07-16',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.judul', 'Kerja Bakti Minggu Ini')
            ->assertJsonPath('data.aktif', true); // default kolom di migration adalah true

        $this->assertDatabaseHas('pengumumans', ['judul' => 'Kerja Bakti Minggu Ini']);
    }

    public function test_tambah_pengumuman_bisa_langsung_dibuat_nonaktif(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/pengumuman', [
            'judul' => 'Draft Pengumuman',
            'isi' => 'Belum siap dipublikasikan.',
            'tanggal_publish' => '2026-07-16',
            'aktif' => false,
        ]);

        $response->assertStatus(201)->assertJsonPath('data.aktif', false);
        $this->getJson('/api/v1/pengumuman')->assertJsonCount(0, 'data');
    }

    public function test_tambah_pengumuman_tanpa_judul_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/pengumuman', [
            'isi' => 'Isi tanpa judul',
            'tanggal_publish' => '2026-07-16',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('judul');
    }

    public function test_tambah_pengumuman_dengan_tanggal_tidak_valid_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/pengumuman', [
            'judul' => 'Judul',
            'isi' => 'Isi',
            'tanggal_publish' => 'bukan-tanggal',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('tanggal_publish');
    }

    public function test_tamu_tanpa_token_tidak_bisa_edit_pengumuman(): void
    {
        $pengumuman = Pengumuman::factory()->create(['judul' => 'Judul Lama']);

        $response = $this->putJson("/api/v1/pengumuman/{$pengumuman->id}", [
            'judul' => 'Judul Baru',
        ]);

        $response->assertStatus(401);
        $this->assertSame('Judul Lama', $pengumuman->fresh()->judul);
    }

    public function test_admin_bisa_edit_sebagian_field_pengumuman(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $pengumuman = Pengumuman::factory()->create([
            'judul' => 'Judul Lama',
            'isi' => 'Isi Lama',
        ]);

        $response = $this->putJson("/api/v1/pengumuman/{$pengumuman->id}", [
            'judul' => 'Judul Baru',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.judul', 'Judul Baru');
        $this->assertSame('Judul Baru', $pengumuman->fresh()->judul);
        // Field yang tidak dikirim (isi) harus tetap sama, tidak ikut ter-null-kan.
        $this->assertSame('Isi Lama', $pengumuman->fresh()->isi);
    }

    public function test_admin_bisa_menonaktifkan_pengumuman_lewat_edit(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $pengumuman = Pengumuman::factory()->create(['aktif' => true]);

        $this->putJson("/api/v1/pengumuman/{$pengumuman->id}", ['aktif' => false])
            ->assertStatus(200);

        $this->assertFalse($pengumuman->fresh()->aktif);
        $this->getJson('/api/v1/pengumuman')->assertJsonCount(0, 'data');
    }

    public function test_edit_pengumuman_yang_tidak_ada_menghasilkan_404(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->putJson('/api/v1/pengumuman/99999', ['judul' => 'X']);

        $response->assertStatus(404);
    }

    public function test_tamu_tanpa_token_tidak_bisa_hapus_pengumuman(): void
    {
        $pengumuman = Pengumuman::factory()->create();

        $response = $this->deleteJson("/api/v1/pengumuman/{$pengumuman->id}");

        $response->assertStatus(401);
        $this->assertDatabaseHas('pengumumans', ['id' => $pengumuman->id]);
    }

    public function test_admin_bisa_hapus_pengumuman(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $pengumuman = Pengumuman::factory()->create();

        $response = $this->deleteJson("/api/v1/pengumuman/{$pengumuman->id}");

        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertDatabaseMissing('pengumumans', ['id' => $pengumuman->id]);
    }

    public function test_hapus_pengumuman_yang_tidak_ada_menghasilkan_404(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->deleteJson('/api/v1/pengumuman/99999');

        $response->assertStatus(404);
    }
}
