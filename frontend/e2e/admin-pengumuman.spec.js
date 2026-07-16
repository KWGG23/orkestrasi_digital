import { test, expect } from '@playwright/test'

test('admin bisa tambah, edit, lalu hapus pengumuman', async ({ page }) => {
  const judul = `Pengumuman Playwright ${Date.now()}`
  const judulBaru = `${judul} (diedit)`

  await page.goto('/admin/pengumuman')
  await expect(page.getByRole('heading', { name: 'Pengumuman' })).toBeVisible()

  // Tambah
  await page.getByRole('button', { name: 'Tambah Pengumuman' }).click()
  await page.getByPlaceholder('Judul').fill(judul)
  await page.getByPlaceholder('Isi pengumuman').fill('Dibuat otomatis oleh Playwright E2E test.')
  await page.getByRole('button', { name: 'Simpan Pengumuman' }).click()

  const row = page.locator('li', { hasText: judul })
  await expect(row).toBeVisible()

  // Edit
  await row.getByRole('button', { name: 'Edit' }).click()
  await page.getByPlaceholder('Judul').fill(judulBaru)
  await page.getByRole('button', { name: 'Simpan Pengumuman' }).click()

  const rowEdited = page.locator('li', { hasText: judulBaru })
  await expect(rowEdited).toBeVisible()

  // Hapus -- rapikan data uji coba biar tidak menumpuk tiap run.
  await rowEdited.getByRole('button', { name: 'Hapus' }).click()
  await expect(page.locator('li', { hasText: judulBaru })).toHaveCount(0)
})

test('form pengumuman menolak submit tanpa judul dan isi', async ({ page }) => {
  await page.goto('/admin/pengumuman')

  await page.getByRole('button', { name: 'Tambah Pengumuman' }).click()
  await page.getByRole('button', { name: 'Simpan Pengumuman' }).click()

  // Validasi HTML5 required -- form tidak boleh ter-submit, tetap terbuka.
  await expect(page.getByPlaceholder('Judul')).toBeVisible()
})
