import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration file.
 *
 * This is the configuration for E2E tests of the Next.js app.
 */
export default defineConfig({
  testDir: './',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Each CI shard is one runner; 50% uses its cores without oversubscribing.
  workers: process.env.CI ? '50%' : undefined,
  // blob on CI so sharded runs can be merged into one HTML report.
  reporter: process.env.CI ? 'blob' : 'html',

  use: {
    // 3100: avoids dev servers/ssh tunnels commonly holding :3000
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm run dev-test --port 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
