<?php

namespace App\Services;

use App\Models\Nasabah;
use App\Models\Setoran;
use App\Models\TransaksiTabungan;
use Illuminate\Support\Facades\DB;

class TransaksiTabunganService
{
    /**
     * Catat masuk tabungan dari setoran metode 'tabung'.
     * Selalu panggil ini — jangan update saldo_tabungan langsung.
     */
    public function tambahDariSetoran(Nasabah $nasabah, Setoran $setoran): TransaksiTabungan
    {
        return DB::transaction(function () use ($nasabah, $setoran) {
            $nasabah = Nasabah::lockForUpdate()->find($nasabah->id);
            $saldoBaru = $nasabah->saldo_tabungan + $setoran->total_harga;

            $transaksi = TransaksiTabungan::create([
                'id_nasabah' => $nasabah->id,
                'id_setoran' => $setoran->id,
                'jenis' => 'masuk',
                'jumlah' => $setoran->total_harga,
                'saldo_sesudah' => $saldoBaru,
                'keterangan' => 'Setoran sampah nota '.$setoran->no_nota,
                'tanggal' => $setoran->tanggal,
            ]);

            $nasabah->update(['saldo_tabungan' => $saldoBaru]);

            return $transaksi;
        });
    }

    /**
     * Penarikan tabungan. Throw InvalidArgumentException jika saldo kurang.
     */
    public function tarik(Nasabah $nasabah, float $jumlah, string $keterangan = ''): TransaksiTabungan
    {
        return DB::transaction(function () use ($nasabah, $jumlah, $keterangan) {
            $nasabah = Nasabah::lockForUpdate()->find($nasabah->id);

            if ($nasabah->saldo_tabungan < $jumlah) {
                throw new \InvalidArgumentException('Saldo tabungan tidak mencukupi');
            }

            $saldoBaru = $nasabah->saldo_tabungan - $jumlah;

            $transaksi = TransaksiTabungan::create([
                'id_nasabah' => $nasabah->id,
                'id_setoran' => null,
                'jenis' => 'keluar',
                'jumlah' => $jumlah,
                'saldo_sesudah' => $saldoBaru,
                'keterangan' => $keterangan ?: 'Penarikan tabungan',
                'tanggal' => now()->toDateString(),
            ]);

            $nasabah->update(['saldo_tabungan' => $saldoBaru]);

            return $transaksi;
        });
    }
}
