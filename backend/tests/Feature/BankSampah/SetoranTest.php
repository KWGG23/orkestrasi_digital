<?php

namespace Tests\Feature\BankSampah;

use App\Models\JenisSampah;
use App\Models\Nasabah;
use App\Models\Setoran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SetoranTest extends TestCase
{
    use RefreshDatabase;

    public function test_tamu_tanpa_token_tidak_bisa_input_setoran(): void
    {
        $nasabah = Nasabah::factory()->create();
        $jenis = JenisSampah::factory()->create();

        $response = $this->postJson('/api/v1/setoran', [
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'metode' => 'tunai',
            'items' => [
                ['id_jenis_sampah' => $jenis->id, 'berat_kg' => 2],
            ],
        ]);

        $response->assertStatus(401);
    }

    public function test_admin_input_setoran_tunai_menghitung_total_dari_harga_aktif(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $nasabah = Nasabah::factory()->create();
        $kardus = JenisSampah::factory()->create(['nama' => 'Kardus', 'harga_per_satuan' => 1000]);
        $kaleng = JenisSampah::factory()->create(['nama' => 'Kaleng', 'harga_per_satuan' => 2500]);

        $response = $this->postJson('/api/v1/setoran', [
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'metode' => 'tunai',
            'items' => [
                ['id_jenis_sampah' => $kardus->id, 'berat_kg' => 3],
                ['id_jenis_sampah' => $kaleng->id, 'berat_kg' => 2],
            ],
        ]);

        // 3kg * 1000 + 2kg * 2500 = 3000 + 5000 = 8000
        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.total_harga', '8000.00')
            ->assertJsonPath('data.metode', 'tunai')
            ->assertJsonCount(2, 'data.details');

        $this->assertDatabaseHas('setorans', [
            'id_nasabah' => $nasabah->id,
            'total_harga' => 8000,
            'metode' => 'tunai',
        ]);

        // Metode tunai tidak boleh menyentuh tabungan.
        $this->assertEquals(0, $nasabah->fresh()->saldo_tabungan);
        $this->assertDatabaseCount('transaksi_tabungans', 0);
    }

    public function test_admin_input_setoran_metode_tabung_menambah_saldo_nasabah(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 1000]);
        $jenis = JenisSampah::factory()->create(['harga_per_satuan' => 1500]);

        $response = $this->postJson('/api/v1/setoran', [
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'metode' => 'tabung',
            'items' => [
                ['id_jenis_sampah' => $jenis->id, 'berat_kg' => 4],
            ],
        ]);

        // 4kg * 1500 = 6000, saldo awal 1000 -> 7000
        $response->assertStatus(201);
        $this->assertEquals(7000, $nasabah->fresh()->saldo_tabungan);
        $this->assertDatabaseHas('transaksi_tabungans', [
            'id_nasabah' => $nasabah->id,
            'jenis' => 'masuk',
            'jumlah' => 6000,
            'saldo_sesudah' => 7000,
        ]);
    }

    public function test_setoran_dengan_jenis_sampah_nonaktif_ditolak_dan_tidak_menyimpan_apa_pun(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $nasabah = Nasabah::factory()->create();
        $jenisNonaktif = JenisSampah::factory()->nonaktif()->create();

        $response = $this->postJson('/api/v1/setoran', [
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'metode' => 'tunai',
            'items' => [
                ['id_jenis_sampah' => $jenisNonaktif->id, 'berat_kg' => 1],
            ],
        ]);

        $response->assertStatus(422)->assertJsonPath('success', false);
        $this->assertDatabaseCount('setorans', 0);
    }

    public function test_setoran_tanpa_items_gagal_validasi(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $nasabah = Nasabah::factory()->create();

        $response = $this->postJson('/api/v1/setoran', [
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'metode' => 'tunai',
            'items' => [],
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors('items');
    }

    public function test_no_nota_berurutan_untuk_setoran_di_hari_yang_sama(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $nasabah = Nasabah::factory()->create();
        $jenis = JenisSampah::factory()->create();

        $payload = fn () => [
            'id_nasabah' => $nasabah->id,
            'tanggal' => now()->toDateString(),
            'metode' => 'tunai',
            'items' => [['id_jenis_sampah' => $jenis->id, 'berat_kg' => 1]],
        ];

        $first = $this->postJson('/api/v1/setoran', $payload());
        $second = $this->postJson('/api/v1/setoran', $payload());

        $notaFirst = $first->json('data.no_nota');
        $notaSecond = $second->json('data.no_nota');

        $this->assertNotSame($notaFirst, $notaSecond);
        $this->assertSame(
            ((int) substr($notaFirst, -4)) + 1,
            (int) substr($notaSecond, -4)
        );
    }

    public function test_setoran_publik_bisa_dilihat_tanpa_login(): void
    {
        $nasabah = Nasabah::factory()->create();
        $jenis = JenisSampah::factory()->create(['harga_per_satuan' => 1000]);
        $setoran = Setoran::create([
            'no_nota' => 'NOT-20260716-0099',
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'total_harga' => 1000,
            'metode' => 'tunai',
        ]);
        $setoran->details()->create([
            'id_jenis_sampah' => $jenis->id,
            'berat_kg' => 1,
            'harga_satuan' => 1000,
            'subtotal' => 1000,
        ]);

        // Tidak ada Sanctum::actingAs di test ini -> request memang tidak terautentikasi.
        $response = $this->getJson("/api/v1/setoran/{$setoran->id}");

        $response->assertStatus(200)->assertJsonPath('data.id', $setoran->id);
    }
}
