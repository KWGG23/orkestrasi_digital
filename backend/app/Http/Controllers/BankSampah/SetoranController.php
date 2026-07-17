<?php

namespace App\Http\Controllers\BankSampah;

use App\Http\Controllers\Controller;
use App\Http\Requests\BankSampah\StoreSetoranRequest;
use App\Models\JenisSampah;
use App\Models\Nasabah;
use App\Models\Setoran;
use App\Services\TransaksiTabunganService;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class SetoranController extends Controller
{
    use ApiResponse;

    public function __construct(private TransaksiTabunganService $tabunganService) {}

    public function store(StoreSetoranRequest $request)
    {
        try {
            $setoran = DB::transaction(function () use ($request) {
                $nasabah = Nasabah::findOrFail($request->id_nasabah);

                // Ambil harga semua jenis sampah sekaligus
                $jenisSampahIds = collect($request->items)->pluck('id_jenis_sampah');
                $hargaMap = JenisSampah::whereIn('id', $jenisSampahIds)
                    ->where('aktif', true)
                    ->pluck('harga_per_satuan', 'id');

                // Hitung subtotal per item
                $totalHarga = 0;
                $detailItems = [];
                foreach ($request->items as $item) {
                    $harga = $hargaMap[$item['id_jenis_sampah']]
                        ?? throw new \Exception("Jenis sampah ID {$item['id_jenis_sampah']} tidak aktif.");

                    $subtotal = round($item['berat_kg'] * $harga, 2);
                    $totalHarga += $subtotal;

                    $detailItems[] = [
                        'id_jenis_sampah' => $item['id_jenis_sampah'],
                        'berat_kg' => $item['berat_kg'],
                        'harga_satuan' => $harga,
                        'subtotal' => $subtotal,
                    ];
                }

                $setoran = Setoran::create([
                    'no_nota' => $this->generateNoNota(),
                    'id_nasabah' => $nasabah->id,
                    'tanggal' => $request->tanggal,
                    'total_harga' => $totalHarga,
                    'metode' => $request->metode,
                    'catatan' => $request->catatan,
                ]);

                foreach ($detailItems as $detail) {
                    $setoran->details()->create($detail);
                }

                if ($request->metode === 'tabung') {
                    $this->tabunganService->tambahDariSetoran($nasabah, $setoran);
                }

                return $setoran->load('details.jenisSampah', 'nasabah');
            });

            return $this->success($setoran, 'Setoran berhasil disimpan', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    public function show(string $id)
    {
        $setoran = Setoran::with('details.jenisSampah', 'nasabah')->findOrFail($id);

        return $this->success($setoran);
    }

    public function pdf(string $id)
    {
        $setoran = Setoran::with('details.jenisSampah', 'nasabah')->findOrFail($id);

        $pdf = Pdf::loadView('pdf.nota-setoran', compact('setoran'))->setPaper('a5');

        return $pdf->download("nota-{$setoran->no_nota}.pdf");
    }

    private function generateNoNota(): string
    {
        $prefix = 'NOT-'.now()->format('Ymd').'-';

        $last = Setoran::where('no_nota', 'like', $prefix.'%')
            ->orderBy('no_nota', 'desc')
            ->lockForUpdate()
            ->first();

        $seq = $last ? ((int) substr($last->no_nota, -4)) + 1 : 1;

        return $prefix.str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
