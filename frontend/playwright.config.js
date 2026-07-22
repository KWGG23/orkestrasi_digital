import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // `php artisan serve` (backend dev server) menangani satu request PHP
  // pada satu waktu — beberapa Playwright worker paralel akan membanjirinya
  // dan menyebabkan request antre/timeout secara acak. Jalankan serial.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  // Backend (php artisan serve --port=8000) harus sudah jalan manual sebelum
  // menjalankan test ini — Playwright cuma bertanggung jawab atas server Vite.
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },
    {
      // Test yang mengandalkan storageState dari auth.setup.js (sesi admin
      // bank sampah, dipakai bersama semua test scope bank sampah).
      name: 'chromium',
      testIgnore: /admin-login\.spec\.js|admin-pengumuman\.spec\.js/,
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/admin.json' },
      dependencies: ['setup'],
    },
    {
      // Role admin_desa terpisah dari admin_bank_sampah (lihat backend
      // routes/api.php, middleware role:...) -- test untuk fitur Portal Desa
      // (Pengumuman, dst) butuh sesi admin desa sendiri, bukan admin.json.
      name: 'chromium-desa',
      testMatch: /admin-pengumuman\.spec\.js/,
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/admin-desa.json' },
      dependencies: ['setup'],
    },
    {
      // admin-login.spec.js melakukan login asli lewat UI, dan backend
      // mencabut semua token lama tiap kali login berhasil ("satu sesi aktif
      // per admin" -- lihat AuthController::login()). Kalau file ini jalan
      // berbarengan/lebih dulu dari test lain, token yang dipakai project
      // 'chromium' di atas jadi invalid duluan. Jalankan project ini PALING
      // TERAKHIR supaya tidak merusak sesi yang masih dipakai test lain.
      name: 'chromium-login-flow',
      testMatch: /admin-login\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['chromium', 'chromium-desa'],
    },
  ],
})
