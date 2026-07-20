<?php

namespace Tests\Feature\Portal;

use App\Models\Umkm;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UmkmTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_publik_hanya_menampilkan_yang_aktif(): void
    {
        Umkm::factory()->create(['nama_usaha' => 'Warung Aktif']);
        Umkm::factory()->nonaktif()->create(['nama_usaha' => 'Warung Tutup']);

        $response = $this->getJson('/api/v1/umkm');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('Warung Aktif', $response->json('data.0.nama_usaha'));
    }

    public function test_list_bisa_difilter_berdasarkan_dusun(): void
    {
        Umkm::factory()->create(['nama_usaha' => 'UMKM Karangasem', 'dusun' => 'karangasem']);
        Umkm::factory()->create(['nama_usaha' => 'UMKM Blongkeng', 'dusun' => 'blongkeng']);

        $response = $this->getJson('/api/v1/umkm?dusun=blongkeng');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('UMKM Blongkeng', $response->json('data.0.nama_usaha'));
    }

    public function test_list_bisa_difilter_berdasarkan_kategori(): void
    {
        Umkm::factory()->create(['nama_usaha' => 'Warung Makan', 'kategori' => 'kuliner']);
        Umkm::factory()->create(['nama_usaha' => 'Toko Kerajinan', 'kategori' => 'kerajinan']);

        $response = $this->getJson('/api/v1/umkm?kategori=kerajinan');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('Toko Kerajinan', $response->json('data.0.nama_usaha'));
    }

    public function test_list_bisa_dicari_lewat_query_q(): void
    {
        Umkm::factory()->create(['nama_usaha' => 'Warung Bu Siti', 'nama_pemilik' => 'Siti Aminah']);
        Umkm::factory()->create(['nama_usaha' => 'Bengkel Pak Joko', 'nama_pemilik' => 'Joko Susilo']);

        $response = $this->getJson('/api/v1/umkm?q=siti');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
        $this->assertSame('Warung Bu Siti', $response->json('data.0.nama_usaha'));
    }

    public function test_list_menyertakan_meta_pagination(): void
    {
        Umkm::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/umkm');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 3)
            ->assertJsonPath('meta.page', 1);
    }

    public function test_detail_umkm_yang_tidak_ada_menghasilkan_404(): void
    {
        $response = $this->getJson('/api/v1/umkm/99999');

        $response->assertStatus(404);
    }

    public function test_tamu_tanpa_token_tidak_bisa_tambah_umkm(): void
    {
        $response = $this->postJson('/api/v1/umkm', [
            'nama_usaha' => 'Warung Baru',
            'nama_pemilik' => 'Budi',
            'dusun' => 'karangasem',
            'kategori' => 'kuliner',
        ]);

        $response->assertStatus(401);
        $this->assertDatabaseCount('umkms', 0);
    }

    public function test_admin_bisa_tambah_umkm(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->postJson('/api/v1/umkm', [
            'nama_usaha' => 'Warung Baru',
            'nama_pemilik' => 'Budi',
            'dusun' => 'blongkeng',
            'kategori' => 'kuliner',
            'produk_utama' => ['Nasi Goreng', 'Es Teh'],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.nama_usaha', 'Warung Baru')
            ->assertJsonPath('data.dusun', 'blongkeng')
            // aktif tidak dikirim di payload -> respons harus tetap merefleksikan
            // default kolom di DB (true), bukan null dari instance in-memory.
            ->assertJsonPath('data.aktif', true)
            ->assertJsonPath('data.punya_nib', false);

        $this->assertDatabaseHas('umkms', [
            'nama_usaha' => 'Warung Baru',
            'dusun' => 'blongkeng',
        ]);
    }

    public function test_tambah_umkm_dengan_dusun_tidak_valid_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->postJson('/api/v1/umkm', [
            'nama_usaha' => 'Warung Baru',
            'nama_pemilik' => 'Budi',
            'dusun' => 'tegalwungu', // nama lama, sudah tidak berlaku
            'kategori' => 'kuliner',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('dusun');
    }

    public function test_tambah_umkm_dengan_kategori_tidak_valid_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        $response = $this->postJson('/api/v1/umkm', [
            'nama_usaha' => 'Warung Baru',
            'nama_pemilik' => 'Budi',
            'dusun' => 'karangasem',
            'kategori' => 'bukan-kategori-valid',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('kategori');
    }

    public function test_tamu_tanpa_token_tidak_bisa_edit_umkm(): void
    {
        $umkm = Umkm::factory()->create(['nama_usaha' => 'Nama Lama']);

        $response = $this->putJson("/api/v1/umkm/{$umkm->id}", [
            'nama_usaha' => 'Nama Baru',
        ]);

        $response->assertStatus(401);
        $this->assertSame('Nama Lama', $umkm->fresh()->nama_usaha);
    }

    public function test_admin_bisa_edit_umkm(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));
        $umkm = Umkm::factory()->create(['nama_usaha' => 'Nama Lama', 'aktif' => true]);

        $response = $this->putJson("/api/v1/umkm/{$umkm->id}", [
            'nama_usaha' => 'Nama Baru',
            'aktif' => false,
        ]);

        $response->assertStatus(200)->assertJsonPath('data.nama_usaha', 'Nama Baru');
        $this->assertSame('Nama Baru', $umkm->fresh()->nama_usaha);
        $this->assertFalse($umkm->fresh()->aktif);
    }

    public function test_tamu_tanpa_token_tidak_bisa_hapus_umkm(): void
    {
        $umkm = Umkm::factory()->create();

        $response = $this->deleteJson("/api/v1/umkm/{$umkm->id}");

        $response->assertStatus(401);
        $this->assertDatabaseHas('umkms', ['id' => $umkm->id]);
    }

    public function test_admin_bisa_hapus_umkm(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));
        $umkm = Umkm::factory()->create();

        $response = $this->deleteJson("/api/v1/umkm/{$umkm->id}");

        $response->assertStatus(200)->assertJsonPath('success', true);
        $this->assertDatabaseMissing('umkms', ['id' => $umkm->id]);
    }

    public function test_upload_foto_usaha_diresize_maksimal_800px_dan_terhapus_saat_umkm_dihapus(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => User::ROLE_DESA]));

        // Gambar sengaja dibuat lebih lebar dari 800px agar logika resize di controller teruji.
        $file = UploadedFile::fake()->image('usaha.jpg', 1600, 1200);

        $response = $this->post('/api/v1/umkm', [
            'nama_usaha' => 'Warung Berfoto',
            'nama_pemilik' => 'Budi',
            'dusun' => 'karangasem',
            'kategori' => 'kuliner',
            'foto_usaha' => $file,
        ]);

        $response->assertStatus(201);
        // data.foto_usaha di response API adalah URL absolut (lihat
        // UmkmController::withFotoUrl) -- path relatif asli yang dipakai
        // Storage::disk() cuma ada di kolom DB, bukan di response.
        $this->assertStringContainsString('http', $response->json('data.foto_usaha'));

        $umkmId = $response->json('data.id');
        $path = Umkm::find($umkmId)->foto_usaha;

        $this->assertNotNull($path);
        $this->assertTrue(Storage::disk('public')->exists($path));

        [$width] = getimagesize(Storage::disk('public')->path($path));
        $this->assertLessThanOrEqual(800, $width);

        $this->deleteJson("/api/v1/umkm/{$umkmId}")->assertStatus(200);

        // hapusFoto() di controller harus benar-benar membuang file dari disk, bukan cuma baris DB.
        $this->assertFalse(Storage::disk('public')->exists($path));
    }
}
