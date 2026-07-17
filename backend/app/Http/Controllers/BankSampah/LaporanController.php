<?php

namespace App\Http\Controllers\BankSampah;

use App\Exports\LaporanExport;
use App\Http\Controllers\Controller;
use App\Models\Setoran;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class LaporanController extends Controller
{
    use ApiResponse;

    public function harian(Request $request)
    {
        $tanggal = $request->tanggal ?? now()->toDateString();

        $setorans = Setoran::with('nasabah:id,nama,no_anggota', 'details.jenisSampah')
            ->whereDate('tanggal', $tanggal)
            ->orderBy('created_at')
            ->get();

        return $this->success([
            'tanggal' => $tanggal,
            'total_nota' => $setorans->count(),
            'total_harga' => $setorans->sum('total_harga'),
            'per_metode' => $setorans->groupBy('metode')->map(fn ($g) => [
                'jumlah_nota' => $g->count(),
                'total_harga' => $g->sum('total_harga'),
            ]),
            'setorans' => $setorans->values(),
        ]);
    }

    public function bulanan(Request $request)
    {
        $bulan = $request->bulan ?? now()->format('Y-m');
        [$tahun, $bln] = explode('-', $bulan);

        $setorans = Setoran::with('nasabah:id,nama,no_anggota')
            ->whereYear('tanggal', $tahun)
            ->whereMonth('tanggal', $bln)
            ->orderBy('tanggal')
            ->get();

        return $this->success([
            'bulan' => $bulan,
            'total_nota' => $setorans->count(),
            'total_harga' => $setorans->sum('total_harga'),
            'per_metode' => $setorans->groupBy('metode')->map(fn ($g) => [
                'jumlah_nota' => $g->count(),
                'total_harga' => $g->sum('total_harga'),
            ]),
            'per_hari' => $setorans
                ->groupBy(fn ($s) => $s->tanggal->format('Y-m-d'))
                ->map(fn ($g) => [
                    'jumlah_nota' => $g->count(),
                    'total_harga' => $g->sum('total_harga'),
                ])
                ->sortKeys(),
        ]);
    }

    public function export(Request $request)
    {
        $bulan = $request->bulan ?? now()->format('Y-m');

        return Excel::download(new LaporanExport($bulan), "laporan-{$bulan}.xlsx");
    }
}
