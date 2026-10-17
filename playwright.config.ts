import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests',
  testMatch: /.*.spec.ts/,
  timeout: 90000,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4173', headless: true },
  webServer: { command: 'npm run build && npm run preview', url: 'http://localhost:4173', reuseExistingServer: false, timeout: 120000 },
  projects: [
    { name: 'chromium', testIgnore: /proof/, use: { viewport: { width: 1440, height: 900 } } },
    { name: 'proof', testMatch: /proof/, use: { viewport: { width: 1440, height: 900 }, video: { mode: 'on', size: { width: 1280, height: 800 } } } },
  ],
  outputDir: 'proof/videos',
});
