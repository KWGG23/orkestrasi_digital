<?php

namespace Tests\Feature\Portal;

use App\Models\KegiatanKkn;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class KegiatanKknTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_publik_menampilkan_semua_dusun(): void
    {
        KegiatanKkn::factory()->create(['tahun' => 2026, 'dusun' => 'karangasem']);
        KegiatanKkn::factory()->create(['tahun' => 2026, 'dusun' => 'blongkeng']);

        $response = $this->getJson('/api/v1/kegiatan-kkn');

        $response->assertStatus(200)->assertJsonCount(2, 'data');
    }

    public function test_detail_publik_berdasarkan_tahun_dan_dusun(): void
    {
        KegiatanKkn::factory()->create([
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'judul' => 'Dokumentasi Karangasem',
        ]);
        KegiatanKkn::factory()->create([
            'tahun' => 2026,
            'dusun' => 'blongkeng',
            'judul' => 'Dokumentasi Blongkeng',
        ]);

        $response = $this->getJson('/api/v1/kegiatan-kkn/2026/karangasem');

        $response->assertStatus(200)->assertJsonPath('data.judul', 'Dokumentasi Karangasem');
    }

    public function test_detail_yang_tidak_ada_menghasilkan_404(): void
    {
        $response = $this->getJson('/api/v1/kegiatan-kkn/2099/karangasem');

        $response->assertStatus(404);
    }

    public function test_tamu_tanpa_token_tidak_bisa_tambah_dokumentasi(): void
    {
        $response = $this->postJson('/api/v1/kegiatan-kkn', [
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'nama_kelompok' => 'KKN Kelompok 1',
            'judul' => 'Dokumentasi 2026',
        ]);

        $response->assertStatus(401);
        $this->assertDatabaseCount('kegiatan_kkns', 0);
    }

    public function test_admin_desa_bisa_tambah_dokumentasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->postJson('/api/v1/kegiatan-kkn', [
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'nama_kelompok' => 'KKN Digitalisasi Desa - Karangasem',
            'judul' => 'Dokumentasi KKN 2026',
            'deskripsi' => 'Kegiatan pengembangan bank sampah digital.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.dusun', 'karangasem')
            ->assertJsonPath('data.nama_kelompok', 'KKN Digitalisasi Desa - Karangasem');

        $this->assertDatabaseHas('kegiatan_kkns', [
            'tahun' => 2026,
            'dusun' => 'karangasem',
        ]);
    }

    public function test_admin_bank_sampah_ditolak_tambah_dokumentasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_BANK_SAMPAH]));

        $response = $this->postJson('/api/v1/kegiatan-kkn', [
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'nama_kelompok' => 'KKN Kelompok 1',
            'judul' => 'Dokumentasi 2026',
        ]);

        $response->assertStatus(403);
    }

    public function test_tambah_dokumentasi_dengan_dusun_tidak_valid_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->postJson('/api/v1/kegiatan-kkn', [
            'tahun' => 2026,
            'dusun' => 'tegalwungu',
            'nama_kelompok' => 'KKN Kelompok 1',
            'judul' => 'Dokumentasi 2026',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('dusun');
    }

    public function test_tambah_dokumentasi_duplikat_tahun_dan_dusun_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));
        KegiatanKkn::factory()->create(['tahun' => 2026, 'dusun' => 'karangasem']);

        $response = $this->postJson('/api/v1/kegiatan-kkn', [
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'nama_kelompok' => 'KKN Kelompok Lain',
            'judul' => 'Dokumentasi Duplikat',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('dusun');
    }

    public function test_admin_desa_bisa_edit_dokumentasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));
        $kegiatan = KegiatanKkn::factory()->create([
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'judul' => 'Judul Lama',
        ]);

        $response = $this->putJson("/api/v1/kegiatan-kkn/{$kegiatan->id}", [
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'nama_kelompok' => $kegiatan->nama_kelompok,
            'judul' => 'Judul Baru',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.judul', 'Judul Baru');
        $this->assertSame('Judul Baru', $kegiatan->fresh()->judul);
    }

    public function test_admin_desa_bisa_hapus_dokumentasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));
        $kegiatan = KegiatanKkn::factory()->create();

        $response = $this->deleteJson("/api/v1/kegiatan-kkn/{$kegiatan->id}");

        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertDatabaseMissing('kegiatan_kkns', ['id' => $kegiatan->id]);
    }

    public function test_upload_foto_dokumentasi_diresize_dan_terhapus_saat_dihapus(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $file = UploadedFile::fake()->image('dokumentasi.jpg', 2000, 1500);

        $response = $this->post('/api/v1/kegiatan-kkn', [
            'tahun' => 2026,
            'dusun' => 'karangasem',
            'nama_kelompok' => 'KKN Kelompok 1',
            'judul' => 'Dokumentasi Berfoto',
            'foto' => [$file],
        ]);

        $response->assertStatus(201);
        $this->assertStringContainsString('http', $response->json('data.foto.0'));

        $kegiatanId = $response->json('data.id');
        $path = KegiatanKkn::find($kegiatanId)->foto[0];

        $this->assertNotNull($path);
        $this->assertTrue(Storage::disk('public')->exists($path));

        [$width] = getimagesize(Storage::disk('public')->path($path));
        $this->assertLessThanOrEqual(1200, $width);

        $this->deleteJson("/api/v1/kegiatan-kkn/{$kegiatanId}")->assertStatus(200);

        $this->assertFalse(Storage::disk('public')->exists($path));
    }
}
