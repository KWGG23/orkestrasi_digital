// Sumber harga: nota master BSI (Bank Sampah Indonesia) — lihat Book1.csv di root proyek.
// Faktor emisi adalah ESTIMASI kasar (kg CO2e dihindari per kg materi didaur ulang),
// diringkas dari rentang yang umum dipakai pada studi daur ulang. Bukan pengukuran presisi.
export const WASTE_CATEGORIES = [
  {
    id: 'kertas',
    label: 'Kertas & Kardus',
    hargaPerKg: 1000,
    co2PerKg: 1.1,
    contoh: ['Kardus', 'Duplek', 'Arsip HVS', 'Koran'],
  },
  {
    id: 'plastik',
    label: 'Plastik (PET/PP)',
    hargaPerKg: 2500,
    co2PerKg: 1.5,
    contoh: ['Botol PET bening', 'Gelas Aqua PP', 'Ember warna'],
  },
  {
    id: 'logam',
    label: 'Logam & Besi',
    hargaPerKg: 2500,
    co2PerKg: 1.8,
    contoh: ['Besi', 'Kaleng', 'Rongsok', 'Seng'],
  },
  {
    id: 'aluminium',
    label: 'Aluminium',
    hargaPerKg: 7500,
    co2PerKg: 9,
    contoh: ['Alma Panci', 'Alma Kaleng'],
  },
  {
    id: 'jelantah',
    label: 'Minyak Jelantah',
    hargaPerKg: 3400,
    co2PerKg: 2.5,
    contoh: ['Minyak jelantah rumah tangga'],
  },
  {
    id: 'kaca',
    label: 'Kaca & Beling',
    hargaPerKg: 150,
    co2PerKg: 0.3,
    contoh: ['Botol kaca', 'Pecahan beling'],
  },
]
