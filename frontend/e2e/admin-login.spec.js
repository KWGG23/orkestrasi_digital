import { test, expect } from '@playwright/test'

// Halaman login me-redirect kalau sudah authenticated, jadi test ini butuh
// sesi kosong -- bukan storageState admin dari auth.setup.js.
test.use({ storageState: { cookies: [], origins: [] } })

test('admin bisa login dengan kredensial benar', async ({ page }) => {
  await page.goto('/admin/login')

  await page.getByLabel('Email').fill('admin@desadijital.id')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Masuk' }).click()

  await expect(page).toHaveURL('/admin')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})

test('login ditolak dengan pesan error saat password salah', async ({ page }) => {
  await page.goto('/admin/login')

  await page.getByLabel('Email').fill('admin@desadijital.id')
  await page.getByLabel('Password').fill('password-salah')
  await page.getByRole('button', { name: 'Masuk' }).click()

  await expect(page.getByText(/email atau password salah/i)).toBeVisible()
  // Tetap di halaman login, tidak nyasar ke dashboard.
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('halaman admin redirect ke login kalau belum masuk', async ({ page }) => {
  await page.goto('/admin')

  await expect(page).toHaveURL(/\/admin\/login/)
})
