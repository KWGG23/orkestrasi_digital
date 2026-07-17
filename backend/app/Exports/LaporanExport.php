<?php

namespace App\Exports;

use App\Models\Setoran;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanExport implements FromCollection, WithHeadings, WithStyles, WithTitle
{
    public function __construct(private string $bulan) {}

    public function collection()
    {
        [$tahun, $bln] = explode('-', $this->bulan);

        return Setoran::with('nasabah:id,nama,no_anggota')
            ->whereYear('tanggal', $tahun)
            ->whereMonth('tanggal', $bln)
            ->orderBy('tanggal')
            ->get()
            ->map(fn ($s) => [
                $s->no_nota,
                $s->tanggal->format('d/m/Y'),
                $s->nasabah->no_anggota,
                $s->nasabah->nama,
                (float) $s->total_harga,
                $s->metode,
                $s->catatan ?? '',
            ]);
    }

    public function headings(): array
    {
        return ['No Nota', 'Tanggal', 'No Anggota', 'Nama Nasabah', 'Total (Rp)', 'Metode', 'Catatan'];
    }

    public function title(): string
    {
        return 'Laporan '.$this->bulan;
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
