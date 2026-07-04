import { useMemo, useState } from 'react'
import { Calculator, Coins, Leaf } from '@phosphor-icons/react'
import { WASTE_CATEGORIES } from '../../data/wasteTypes.js'

const currency = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export default function CarbonCalculator() {
  const [categoryId, setCategoryId] = useState(WASTE_CATEGORIES[0].id)
  const [weight, setWeight] = useState('5')

  const category = WASTE_CATEGORIES.find((c) => c.id === categoryId)
  const weightNum = Number(weight)
  const isValid = Number.isFinite(weightNum) && weightNum > 0

  const result = useMemo(() => {
    if (!isValid) return null
    return {
      rupiah: weightNum * category.hargaPerKg,
      co2: weightNum * category.co2PerKg,
    }
  }, [category, weightNum, isValid])

  return (
    <section id="kalkulator" className="py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 rounded-[2.5rem] border border-border bg-white p-6 shadow-xl shadow-primary/5 sm:p-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <Calculator size={18} weight="bold" />
              Kalkulator Dampak
            </span>
            <h2 className="mt-5 font-heading text-3xl font-semibold text-primary-dark">
              Berapa nilai setoran sampahmu?
            </h2>
            <p className="mt-3 text-bark/75">
              Pilih jenis sampah dan berat setoran untuk melihat perkiraan tabungan yang kamu
              dapat, sekaligus perkiraan emisi karbon yang dihindari dibanding dibuang begitu saja.
            </p>

            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="jenis-sampah" className="block text-sm font-medium text-bark">
                  Jenis sampah
                </label>
                <select
                  id="jenis-sampah"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-2 w-full cursor-pointer rounded-xl border border-border bg-sand/40 px-4 py-3 text-bark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {WASTE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-muted">Contoh: {category.contoh.join(', ')}</p>
              </div>

              <div>
                <label htmlFor="berat" className="block text-sm font-medium text-bark">
                  Berat (kg)
                </label>
                <input
                  id="berat"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border px-4 py-3 text-bark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  aria-invalid={!isValid}
                  aria-describedby="berat-helper"
                />
                <p id="berat-helper" className="mt-1.5 text-xs text-muted">
                  {isValid ? 'Perkiraan diperbarui otomatis.' : 'Masukkan angka lebih besar dari 0.'}
                </p>
              </div>
            </form>
          </div>

          <div className="flex flex-col justify-center gap-4 rounded-3xl bg-primary-dark p-8 text-white">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Coins size={22} weight="duotone" />
              </span>
              <p className="mt-4 text-sm font-medium text-white/70">Estimasi tabungan</p>
              <p className="font-heading text-4xl font-semibold">
                {result ? currency.format(result.rupiah) : '—'}
              </p>
            </div>

            <div className="h-px w-full bg-white/15" />

            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Leaf size={22} weight="duotone" />
              </span>
              <p className="mt-4 text-sm font-medium text-white/70">Estimasi emisi karbon dihindari</p>
              <p className="font-heading text-4xl font-semibold">
                {result ? `${result.co2.toFixed(1)} kg CO₂e` : '—'}
              </p>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Angka emisi adalah estimasi kasar berbasis rentang faktor emisi umum daur ulang,
              bukan pengukuran presisi per material.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
