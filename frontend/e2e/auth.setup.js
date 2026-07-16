import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/admin.json'

setup('login sebagai admin', async ({ page }) => {
  await page.goto('/admin/login')

  await page.getByLabel('Email').fill('admin@desadijital.id')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: 'Masuk' }).click()

  await expect(page).toHaveURL('/admin')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

  await page.context().storageState({ path: authFile })
})
