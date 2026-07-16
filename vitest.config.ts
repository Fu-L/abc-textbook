import { defineConfig } from 'vitest/config';

process.env.TZ = 'UTC';

export default defineConfig({
  test: {
    include: ['tests/{contract,integration,unit}/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'tests/performance/**', 'node_modules/**', 'dist/**'],
    setupFiles: ['./tests/setup/fixed-clock.ts'],
    environment: 'node',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    sequence: {
      hooks: 'list',
      setupFiles: 'list',
    },
    fakeTimers: {
      now: Date.parse('2026-07-14T03:00:00.000Z'),
      shouldClearNativeTimers: true,
    },
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'scripts/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },
  },
});
