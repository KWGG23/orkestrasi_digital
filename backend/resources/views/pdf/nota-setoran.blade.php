<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #222; padding: 16px; }
        .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 12px; }
        .header h2 { font-size: 15px; font-weight: bold; }
        .header p { font-size: 10px; color: #555; }
        .meta { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .meta-block p { line-height: 1.6; }
        .label { color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #f0f0f0; text-align: left; padding: 5px 6px; border: 1px solid #ccc; font-size: 10px; }
        td { padding: 5px 6px; border: 1px solid #ccc; font-size: 10px; }
        .text-right { text-align: right; }
        .total-row td { font-weight: bold; background: #f9f9f9; }
        .footer { margin-top: 20px; display: flex; justify-content: space-between; }
        .ttd { text-align: center; }
        .ttd .space { height: 50px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .badge-tunai { background: #d1fae5; color: #065f46; }
        .badge-tabung { background: #dbeafe; color: #1e40af; }
        .badge-tukar { background: #fef3c7; color: #92400e; }
    </style>
</head>
<body>
    <div class="header">
        <h2>NOTA SETORAN BANK SAMPAH</h2>
        <p>BSI Dusun Karangasem — Muntilan, Magelang</p>
    </div>

    <div class="meta">
        <div class="meta-block">
            <p><span class="label">No Nota &nbsp;:</span> <strong>{{ $setoran->no_nota }}</strong></p>
            <p><span class="label">Tanggal &nbsp;:</span> {{ $setoran->tanggal->format('d/m/Y') }}</p>
            <p><span class="label">Metode &nbsp;&nbsp;:</span>
                <span class="badge badge-{{ $setoran->metode === 'tukar_barang' ? 'tukar' : $setoran->metode }}">
                    {{ strtoupper(str_replace('_', ' ', $setoran->metode)) }}
                </span>
            </p>
        </div>
        <div class="meta-block">
            <p><span class="label">Nasabah &nbsp;&nbsp;:</span> {{ $setoran->nasabah->nama }}</p>
            <p><span class="label">No Anggota:</span> {{ $setoran->nasabah->no_anggota }}</p>
            @if($setoran->nasabah->no_hp)
            <p><span class="label">No HP &nbsp;&nbsp;&nbsp;&nbsp;:</span> {{ $setoran->nasabah->no_hp }}</p>
            @endif
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Jenis Sampah</th>
                <th>Kategori</th>
                <th class="text-right">Berat (kg)</th>
                <th class="text-right">Harga/kg (Rp)</th>
                <th class="text-right">Subtotal (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($setoran->details as $i => $detail)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $detail->jenisSampah->nama }}</td>
                <td>{{ $detail->jenisSampah->kategori }}</td>
                <td class="text-right">{{ number_format($detail->berat_kg, 3) }}</td>
                <td class="text-right">{{ number_format($detail->harga_satuan, 0, ',', '.') }}</td>
                <td class="text-right">{{ number_format($detail->subtotal, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr class="total-row">
                <td colspan="5" class="text-right">TOTAL</td>
                <td class="text-right">Rp {{ number_format($setoran->total_harga, 0, ',', '.') }}</td>
            </tr>
        </tfoot>
    </table>

    @if($setoran->catatan)
    <p style="margin-top:8px; font-size:10px; color:#555;">Catatan: {{ $setoran->catatan }}</p>
    @endif

    <div class="footer">
        <div class="ttd">
            <p>Nasabah,</p>
            <div class="space"></div>
            <p>( {{ $setoran->nasabah->nama }} )</p>
        </div>
        <div class="ttd">
            <p>Petugas BSI,</p>
            <div class="space"></div>
            <p>( ________________________ )</p>
        </div>
    </div>
</body>
</html>
