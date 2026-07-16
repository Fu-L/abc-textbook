import { defineConfig, devices } from '@playwright/test';

function normalizeBasePath(value: string): string {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '/') {
    return '/';
  }

  // Astroのbaseと同じ値を、PlaywrightのURL結合用に末尾スラッシュ付きで返す。
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`;
}

const basePath = normalizeBasePath(process.env.BASE_PATH ?? '/');
const port = Number.parseInt(process.env.PORT ?? '4321', 10);
const origin = `http://127.0.0.1:${String(port)}`;
// 相対URLで遷移するE2Eが、ルート公開とサブパス公開の両方で同じように動くようにする。
const baseURL = new URL(basePath, origin).href;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    contextOptions: {
      reducedMotion: 'reduce',
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  expect: {
    timeout: 5_000,
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
    command: `npm run preview -- --host 127.0.0.1 --port ${String(port)}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      BASE_PATH: basePath,
      SITE_URL: origin,
    },
  },
});
