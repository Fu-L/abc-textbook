# Local development

## Fixed toolchain

Phase 1で固定した必須toolchainは次のとおりです。

| Tool       |     Version |
| ---------- | ----------: |
| Node.js    | 24.18.0 LTS |
| npm        |     11.16.0 |
| TypeScript |       6.0.3 |
| Astro      |       7.1.0 |
| Starlight  |      0.41.3 |
| Zod        |       4.4.3 |
| Vitest     |      4.1.10 |
| Playwright |      1.61.1 |
| ESLint     |      10.7.0 |
| Prettier   |       3.9.5 |
| Pagefind   |       1.5.2 |

`.nvmrc`、`packageManager`、`engines`、`devEngines`、exact
dependency、`package-lock.json`を同時に更新しない限り、個別の版だけを変更してはいけません。

## Local-only setup

```bash
nvm install
nvm use
node --version
npm --version
npm ci
npm run test:e2e:install
```

Node.jsは `v24.18.0`、npmは `11.16.0` と表示されなければ作業を止めます。Playwrightのbrowser
binaryはローカルcacheへ保存され、repositoryへcommitしません。`devEngines`
により、指定外のNode.jsまたはnpmでは `npm run` も実行前に失敗します。

## Command conventions

repository rootから実行し、scriptへ渡す引数は `--` の後ろに置きます。

```bash
npm run dev
npm run build
npm run lint
npm run format:check
npm run check
npm run test
npm run test:unit -- domain-invariants
npm run test:e2e -- --project=chromium
npm run verify:fast
```

- 成功はexit code `0`、検証失敗は `2`、使用法違反は `64` をCLI共通規約とします。
- test/build/updateの既定入力は `tests/fixtures/` のoffline dataです。
- `BASE_PATH=/abc-textbook` でproject subpath buildを再現できます。
- `SITE_URL=https://example.invalid` はcanonical URL生成だけに使い、外部通信を発生させません。
- `link:check` は同じ実行内でbuildした `dist` の内部linkだけを検査します。
- `verify:fast` は内部link検査とChromium/Firefox/WebKitの主要E2Eまで実行します。
- live source確認はoffline suite成功後に明示的なdry-runとして実行します。

## Zero-cost boundary

必須経路は既存PC、Git、Node.js、npm package、Playwright browser、静的file
serverだけで完結します。account、credential、常時backend、有料API、有料hosting、remote
database、telemetry、同期serviceは必須にしません。

dependency
installと任意の公式source確認には通常のinternet接続を使いますが、継続課金を要求しません。静的outputは任意のlocal
HTTP serverまたは無料で利用可能な静的配信先へ置けます。hosting固有設定はcanonical
sourceに含めません。

## Reproducibility notes

- `npm ci` はlockfileとmanifestの不一致を失敗にします。
- test clockの既定instantは `2026-07-14T12:00:00+09:00`、process timezoneはUTCです。
- E2EはPlaywrightが固定するChromium、Firefox、WebKit projectをすべて実行します。
- Pagefindは静的build後に生成され、CSPはStarlightの既知inline script
  hash、layout用style属性、WebAssembly、同一origin workerだけを許可します。
- `.env*`、browser report、coverage、build outputはGitへ追加しません。
