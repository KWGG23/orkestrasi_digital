import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/admin-desa.json'

setup('login sebagai admin desa', async ({ page }) => {
  await page.goto('/admin/login')

  await page.getByLabel('Email').fill('admindesa@desadijital.id')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Masuk' }).click()

  await expect(page).toHaveURL('/admin/umkm')
  await expect(page.getByRole('heading', { name: 'UMKM' })).toBeVisible()

  await page.context().storageState({ path: authFile })
})
