import { test, expect } from '@playwright/test'

test('admin bisa update harga jenis sampah lalu tersimpan', async ({ page }) => {
  await page.goto('/admin/jenis-sampah')
  await expect(page.getByRole('heading', { name: 'Harga Jenis Sampah' })).toBeVisible()

  const row = page.locator('li', { hasText: 'Kabel' })
  await expect(row).toBeVisible()

  const hargaInput = row.locator('input[type="number"]')
  const hargaAsli = await hargaInput.inputValue()
  // Dihitung dari harga saat ini (bukan angka literal tetap) supaya selalu
  // beda dari hargaAsli -- kalau run sebelumnya gagal di tengah jalan dan
  // tidak sempat restore, angka tetap akan kadang collide dengan nilai yang
  // sudah tersimpan dari run gagal itu, membuat form dianggap "tidak dirty".
  const hargaBaru = String(Math.round(parseFloat(hargaAsli)) + 1)

  await hargaInput.fill(hargaBaru)
  const simpanBtn = row.getByRole('button', { name: /simpan/i })
  await expect(simpanBtn).toBeEnabled()
  await simpanBtn.click()

  // Tombol kembali disabled setelah tersimpan (state tidak lagi "dirty").
  await expect(simpanBtn).toBeDisabled()

  await page.reload()
  await expect(row.locator('input[type="number"]')).toHaveValue(`${hargaBaru}.00`)

  // Kembalikan ke harga semula supaya tidak mengubah data dev permanen.
  // Tunggu sampai tombol disabled lagi -- itu baru bukti PUT-nya benar-benar
  // selesai, bukan asal klik lalu test selesai duluan sebelum request kirim.
  await row.locator('input[type="number"]').fill(hargaAsli)
  await row.getByRole('button', { name: /simpan/i }).click()
  await expect(simpanBtn).toBeDisabled()
  await expect(row.locator('input[type="number"]')).toHaveValue(hargaAsli)
})
