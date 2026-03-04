import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Knowledge Graph Studio
 * 
 * Tests auth flow, protected routes, and core functionality.
 * 
 * Usage:
 *   pnpm e2e           # Run all tests
 *   pnpm e2e:ui        # Run with UI
 *   pnpm e2e --grep auth  # Run only auth tests
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm -C apps/web dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
