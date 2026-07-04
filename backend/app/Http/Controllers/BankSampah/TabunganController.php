<?php

namespace App\Http\Controllers\BankSampah;

use App\Http\Controllers\Controller;
use App\Http\Requests\BankSampah\TarikTabunganRequest;
use App\Models\Nasabah;
use App\Models\TransaksiTabungan;
use App\Services\TransaksiTabunganService;
use App\Traits\ApiResponse;

class TabunganController extends Controller
{
    use ApiResponse;

    public function __construct(private TransaksiTabunganService $tabunganService) {}

    public function show(string $nasabahId)
    {
        $nasabah = Nasabah::findOrFail($nasabahId);

        $riwayat = TransaksiTabungan::where('id_nasabah', $nasabahId)
            ->with('setoran:id,no_nota,tanggal')
            ->orderBy('tanggal', 'desc')
            ->orderBy('id', 'desc')
            ->paginate(20);

        return $this->success(
            [
                'nasabah'   => $nasabah->only(['id', 'nama', 'no_anggota', 'saldo_tabungan']),
                'transaksi' => $riwayat->items(),
            ],
            'OK',
            200,
            [
                'total'     => $riwayat->total(),
                'page'      => $riwayat->currentPage(),
                'last_page' => $riwayat->lastPage(),
            ]
        );
    }

    public function tarik(TarikTabunganRequest $request)
    {
        try {
            $nasabah = Nasabah::findOrFail($request->id_nasabah);

            $transaksi = $this->tabunganService->tarik(
                $nasabah,
                (float) $request->jumlah,
                $request->keterangan ?? ''
            );

            return $this->success(
                $transaksi->load('nasabah:id,nama,no_anggota,saldo_tabungan'),
                'Penarikan berhasil'
            );
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }
}
