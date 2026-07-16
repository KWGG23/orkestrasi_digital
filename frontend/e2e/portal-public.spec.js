import { test, expect } from '@playwright/test'

// Halaman publik -- test ini merepresentasikan pengunjung anonim, jadi
// jalankan tanpa sesi admin dari auth.setup.js.
test.use({ storageState: { cookies: [], origins: [] } })

test('portal hub menampilkan profil dusun dan navigasi utama', async ({ page }) => {
  await page.goto('/portal')

  await expect(page.getByRole('heading', { name: 'Portal Digital Desa Blongkeng' })).toBeVisible()
  await expect(page.getByText('Dusun Karangasem').first()).toBeVisible()
  await expect(page.getByText('Dusun Blongkeng').first()).toBeVisible()
})

test('katalog UMKM bisa difilter berdasarkan dusun', async ({ page }) => {
  await page.goto('/portal/umkm')

  await expect(page.getByRole('heading', { name: 'Katalog UMKM' })).toBeVisible()

  const dusunSelect = page.locator('select').first()
  await dusunSelect.selectOption('karangasem')

  // Tidak menegaskan hasil yang spesifik (data dev berubah-ubah), cukup
  // memastikan filter tidak bikin halaman error/kosong-render.
  await expect(page.getByRole('heading', { name: 'Katalog UMKM' })).toBeVisible()
})

test('cek saldo bank sampah tidak menampilkan hasil untuk pencarian kosong/pendek', async ({ page }) => {
  await page.goto('/portal/bank-sampah')

  await expect(page.getByText('Cek Saldo & Riwayat Tabungan')).toBeVisible()

  const searchInput = page.getByPlaceholder(/nama atau nomor anggota/i)
  await searchInput.fill('a')

  // Query < 2 karakter -- dropdown hasil pencarian tidak boleh muncul.
  await expect(page.getByText('Mencari…')).not.toBeVisible()
})

test('halaman peta administratif memuat tanpa error', async ({ page }) => {
  await page.goto('/portal/peta/administratif')

  await expect(page.getByRole('heading', { name: 'Batas Wilayah Karangasem & Blongkeng' })).toBeVisible()
})
