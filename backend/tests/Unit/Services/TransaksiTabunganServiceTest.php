<?php

namespace Tests\Unit\Services;

use App\Models\Nasabah;
use App\Models\Setoran;
use App\Models\TransaksiTabungan;
use App\Services\TransaksiTabunganService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransaksiTabunganServiceTest extends TestCase
{
    use RefreshDatabase;

    private TransaksiTabunganService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new TransaksiTabunganService;
    }

    public function test_tambah_dari_setoran_menambah_saldo_dan_mencatat_transaksi(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 10000]);
        $setoran = Setoran::create([
            'no_nota' => 'NOT-20260716-0001',
            'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16',
            'total_harga' => 5000,
            'metode' => 'tabung',
        ]);

        $transaksi = $this->service->tambahDariSetoran($nasabah, $setoran);

        $this->assertSame('masuk', $transaksi->jenis);
        $this->assertEquals(5000, $transaksi->jumlah);
        $this->assertEquals(15000, $transaksi->saldo_sesudah);
        $this->assertSame($setoran->id, $transaksi->id_setoran);
        $this->assertStringContainsString($setoran->no_nota, $transaksi->keterangan);

        $this->assertEquals(15000, $nasabah->fresh()->saldo_tabungan);
        $this->assertDatabaseHas('transaksi_tabungans', [
            'id_nasabah' => $nasabah->id,
            'id_setoran' => $setoran->id,
            'jenis' => 'masuk',
            'saldo_sesudah' => 15000,
        ]);
    }

    public function test_tambah_dari_setoran_berturut_turut_mengakumulasi_saldo(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 0]);

        $setoran1 = Setoran::create([
            'no_nota' => 'NOT-20260716-0001', 'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16', 'total_harga' => 3000, 'metode' => 'tabung',
        ]);
        $setoran2 = Setoran::create([
            'no_nota' => 'NOT-20260716-0002', 'id_nasabah' => $nasabah->id,
            'tanggal' => '2026-07-16', 'total_harga' => 7000, 'metode' => 'tabung',
        ]);

        $this->service->tambahDariSetoran($nasabah, $setoran1);
        $nasabah->refresh();
        $transaksi2 = $this->service->tambahDariSetoran($nasabah, $setoran2);

        $this->assertEquals(10000, $transaksi2->saldo_sesudah);
        $this->assertEquals(10000, $nasabah->fresh()->saldo_tabungan);
        $this->assertSame(2, TransaksiTabungan::where('id_nasabah', $nasabah->id)->count());
    }

    public function test_tarik_mengurangi_saldo_saat_mencukupi(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 20000]);

        $transaksi = $this->service->tarik($nasabah, 8000, 'Penarikan untuk kebutuhan warga');

        $this->assertSame('keluar', $transaksi->jenis);
        $this->assertEquals(8000, $transaksi->jumlah);
        $this->assertEquals(12000, $transaksi->saldo_sesudah);
        $this->assertNull($transaksi->id_setoran);
        $this->assertSame('Penarikan untuk kebutuhan warga', $transaksi->keterangan);
        $this->assertEquals(12000, $nasabah->fresh()->saldo_tabungan);
    }

    public function test_tarik_pas_sebesar_saldo_menyisakan_saldo_nol(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 5000]);

        $transaksi = $this->service->tarik($nasabah, 5000);

        $this->assertEquals(0, $transaksi->saldo_sesudah);
        $this->assertEquals(0, $nasabah->fresh()->saldo_tabungan);
    }

    public function test_tarik_melebihi_saldo_melempar_exception_dan_tidak_mengubah_apa_pun(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 3000]);

        try {
            $this->service->tarik($nasabah, 5000);
            $this->fail('Diharapkan InvalidArgumentException tidak dilempar.');
        } catch (\InvalidArgumentException $e) {
            $this->assertSame('Saldo tabungan tidak mencukupi', $e->getMessage());
        }

        $this->assertEquals(3000, $nasabah->fresh()->saldo_tabungan);
        $this->assertSame(0, TransaksiTabungan::where('id_nasabah', $nasabah->id)->count());
    }

    public function test_tarik_tanpa_keterangan_memakai_keterangan_default(): void
    {
        $nasabah = Nasabah::factory()->create(['saldo_tabungan' => 10000]);

        $transaksi = $this->service->tarik($nasabah, 1000);

        $this->assertSame('Penarikan tabungan', $transaksi->keterangan);
    }
}
