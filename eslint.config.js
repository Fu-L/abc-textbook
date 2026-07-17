import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const sourceFiles = ['src/**/*.{ts,tsx,astro}'];
const browserSourceFiles = ['src/client/**/*.{ts,tsx}'];
const astroBuildFiles = ['src/content.config.ts'];
const nodeFiles = ['scripts/**/*.ts', '*.config.{js,mjs,ts}'];
const vitestFiles = ['tests/{contract,integration,performance,setup,unit}/**/*.ts'];
const playwrightFiles = ['tests/e2e/**/*.ts'];

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.astro/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/blob-report/**',
      '**/*.min.js',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  astro.configs['flat/recommended'],
  {
    files: sourceFiles,
    ignores: ['src/client/**/*', 'src/content.config.ts'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.astro'],
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: browserSourceFiles,
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.client.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: nodeFiles,
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: astroBuildFiles,
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ['./tsconfig.astro.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: vitestFiles,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
      parserOptions: {
        project: ['./tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: playwrightFiles,
    languageOptions: {
      // Playwright test本体はNode.js、page callbackはbrowserで実行される。
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.e2e.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: [
      ...sourceFiles,
      ...browserSourceFiles,
      ...astroBuildFiles,
      ...nodeFiles,
      ...vitestFiles,
      ...playwrightFiles,
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
    },
  },
  {
    files: ['*.config.{mjs,js}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
);
