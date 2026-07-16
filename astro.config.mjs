import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

import { normalizeBasePath, resolveSite } from './scripts/config/publication.ts';

const base = normalizeBasePath(process.env.BASE_PATH ?? '/');
const site = resolveSite(process.env.SITE_URL ?? 'https://abc-textbook.example');
// Starlight 0.41.3 が `is:inline` で出力する共通script。
// Astroはこれらを自動hash化しないため、依存更新時はE2EのCSP検査と合わせて見直す。
/** @type {import('astro').CspHashEntry[]} */
const starlightInlineScriptHashes = [
  'sha256-VWo5Wp4aqSj6nSgMpeAp9cKieaoIfwFUAunAVugI5gA=',
  'sha256-f/zAUE74ucc3JYp4r4QQvkJofoQdkOIhHYK+jeZ6eko=',
  'sha256-GkZBRnvSuhtx/cvzvukVkX2JJZW+DdPlVr7BX8Tefqo=',
  'sha256-wX2yOADeV+NMngflD5uYi3vl50SHC4sfM1EmylVjlX4=',
  'sha256-7eCV4jtsr4t4knb3c4FCRPeu7GGZeOUGE3XvWix0XOQ=',
];

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    syntaxHighlight: 'prism',
  },
  integrations: [
    react(),
    starlight({
      title: 'ABC上級問題体系化教科書',
      description: 'ABC 212以降の上級問題を典型と前提関係で体系化する日本語教材',
      defaultLocale: 'root',
      locales: {
        root: {
          label: '日本語',
          lang: 'ja',
        },
      },
      customCss: ['./src/styles/global.css'],
      pagefind: true,
      lastUpdated: true,
    }),
  ],
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        // 静的教材から外部scriptや埋め込みコンテンツを読み込ませない。
        "default-src 'self'",
        "base-uri 'self'",
        "connect-src 'self'",
        "font-src 'self' data:",
        "form-action 'self'",
        "img-src 'self' data:",
        "manifest-src 'self'",
        "object-src 'none'",
        "worker-src 'self' blob:",
      ],
      scriptDirective: {
        // Pagefindのworker実行に必要なWebAssemblyだけを同一originで許可する。
        hashes: starlightInlineScriptHashes,
        resources: ["'self'", "'wasm-unsafe-eval'"],
      },
      styleDirective: {
        // Starlightのlayout用style属性だけを許可し、style要素はAstroのhash管理を維持する。
        resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  vite: {
    build: {
      sourcemap: true,
    },
  },
});
