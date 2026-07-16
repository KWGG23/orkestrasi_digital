<?php

namespace Tests\Feature\BankSampah;

use App\Models\Nasabah;
use App\Models\Setoran;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class LaporanTest extends TestCase
{
    use RefreshDatabase;

    private function buatSetoran(Nasabah $nasabah, string $tanggal, float $total, string $metode = 'tunai'): Setoran
    {
        static $seq = 0;
        $seq++;

        return Setoran::create([
            'no_nota' => 'NOT-'.str_replace('-', '', $tanggal).'-'.str_pad((string) $seq, 4, '0', STR_PAD_LEFT),
            'id_nasabah' => $nasabah->id,
            'tanggal' => $tanggal,
            'total_harga' => $total,
            'metode' => $metode,
        ]);
    }

    // ── Laporan Harian ──────────────────────────────────────────────────

    public function test_tamu_tanpa_token_tidak_bisa_akses_laporan_harian(): void
    {
        $response = $this->getJson('/api/v1/laporan/harian');

        $response->assertStatus(401);
    }

    public function test_laporan_harian_hanya_menghitung_setoran_di_tanggal_diminta(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create();

        $this->buatSetoran($nasabah, '2026-07-16', 5000, 'tunai');
        $this->buatSetoran($nasabah, '2026-07-16', 3000, 'tabung');
        $this->buatSetoran($nasabah, '2026-07-15', 9000, 'tunai'); // hari lain, harus diabaikan

        $response = $this->getJson('/api/v1/laporan/harian?tanggal=2026-07-16');

        $response->assertStatus(200)
            ->assertJsonPath('data.tanggal', '2026-07-16')
            ->assertJsonPath('data.total_nota', 2)
            ->assertJsonPath('data.total_harga', 8000)
            ->assertJsonPath('data.per_metode.tunai.jumlah_nota', 1)
            ->assertJsonPath('data.per_metode.tunai.total_harga', 5000)
            ->assertJsonPath('data.per_metode.tabung.jumlah_nota', 1)
            ->assertJsonPath('data.per_metode.tabung.total_harga', 3000);
    }

    public function test_laporan_harian_tanpa_parameter_tanggal_memakai_hari_ini(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create();
        $this->buatSetoran($nasabah, now()->toDateString(), 4000);

        $response = $this->getJson('/api/v1/laporan/harian');

        $response->assertStatus(200)
            ->assertJsonPath('data.tanggal', now()->toDateString())
            ->assertJsonPath('data.total_nota', 1);
    }

    public function test_laporan_harian_tanpa_data_mengembalikan_nol_bukan_error(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->getJson('/api/v1/laporan/harian?tanggal=2026-01-01');

        $response->assertStatus(200)
            ->assertJsonPath('data.total_nota', 0)
            ->assertJsonPath('data.total_harga', 0);
    }

    // ── Laporan Bulanan ─────────────────────────────────────────────────

    public function test_tamu_tanpa_token_tidak_bisa_akses_laporan_bulanan(): void
    {
        $response = $this->getJson('/api/v1/laporan/bulanan');

        $response->assertStatus(401);
    }

    public function test_laporan_bulanan_hanya_menghitung_setoran_di_bulan_diminta(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create();

        $this->buatSetoran($nasabah, '2026-07-01', 2000);
        $this->buatSetoran($nasabah, '2026-07-15', 3000);
        $this->buatSetoran($nasabah, '2026-06-30', 9000); // bulan lain, harus diabaikan
        $this->buatSetoran($nasabah, '2025-07-15', 9000); // tahun lain, harus diabaikan

        $response = $this->getJson('/api/v1/laporan/bulanan?bulan=2026-07');

        $response->assertStatus(200)
            ->assertJsonPath('data.bulan', '2026-07')
            ->assertJsonPath('data.total_nota', 2)
            ->assertJsonPath('data.total_harga', 5000);
    }

    public function test_laporan_bulanan_per_hari_terurut_berdasarkan_tanggal(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $nasabah = Nasabah::factory()->create();

        $this->buatSetoran($nasabah, '2026-07-20', 1000);
        $this->buatSetoran($nasabah, '2026-07-05', 2000);
        $this->buatSetoran($nasabah, '2026-07-05', 500);

        $response = $this->getJson('/api/v1/laporan/bulanan?bulan=2026-07');

        $response->assertStatus(200);
        $perHari = $response->json('data.per_hari');

        $this->assertSame(['2026-07-05', '2026-07-20'], array_keys($perHari));
        $this->assertSame(2, $perHari['2026-07-05']['jumlah_nota']);
        $this->assertSame(2500, $perHari['2026-07-05']['total_harga']);
        $this->assertSame(1, $perHari['2026-07-20']['jumlah_nota']);
    }

    // ── Export Excel ────────────────────────────────────────────────────

    public function test_tamu_tanpa_token_tidak_bisa_export_laporan(): void
    {
        $response = $this->getJson('/api/v1/laporan/export');

        $response->assertStatus(401);
    }

    public function test_admin_bisa_export_laporan_bulanan_ke_excel(): void
    {
        Excel::fake();
        Sanctum::actingAs(User::factory()->create());

        $nasabah = Nasabah::factory()->create(['no_anggota' => 'KRA-0001', 'nama' => 'Budi Santoso']);
        $this->buatSetoran($nasabah, '2026-07-10', 4500, 'tunai');

        $response = $this->get('/api/v1/laporan/export?bulan=2026-07');

        $response->assertStatus(200);

        Excel::assertDownloaded('laporan-2026-07.xlsx', function ($export) {
            $rows = $export->collection();

            return $rows->count() === 1
                && $rows->first()[2] === 'KRA-0001'
                && $rows->first()[3] === 'Budi Santoso'
                && $rows->first()[4] === 4500.0;
        });
    }

    public function test_export_laporan_bulan_kosong_tetap_menghasilkan_file_tanpa_baris(): void
    {
        Excel::fake();
        Sanctum::actingAs(User::factory()->create());

        $response = $this->get('/api/v1/laporan/export?bulan=2020-01');

        $response->assertStatus(200);

        Excel::assertDownloaded('laporan-2020-01.xlsx', function ($export) {
            return $export->collection()->count() === 0;
        });
    }
}
