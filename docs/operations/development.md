# Local development

現行の更新方針と検証範囲は[Codexの更新マニュアル](update-manual.md)と
[Constitution 4.0.0](../../.specify/memory/constitution.md)を参照する。以下は既存環境・実装の説明であり、全コマンド・全ブラウザーの実行を通常更新の必須条件としない。CIの簡素化は別の実装変更で行う。

## Toolchain policy

依存パッケージは`package-lock.json`で完全版を固定します。Node.jsとnpmは、通常開発で利用できる対応範囲と、リリース検証で再現する基準版を分けて管理します。

| Tool       | Supported development range  | Release baseline |
| ---------- | ---------------------------- | ---------------- |
| Node.js    | `>=24.18.0 <25.0.0` (24 LTS) | `24.18.0`        |
| npm        | `>=11.16.0 <12.0.0`          | `11.16.0`        |
| TypeScript | lockfile exact               | `6.0.3`          |
| Astro      | lockfile exact               | `7.1.0`          |
| Starlight  | lockfile exact               | `0.41.3`         |
| Zod        | lockfile exact               | `4.4.3`          |
| Vitest     | lockfile exact               | `4.1.10`         |
| Playwright | lockfile exact               | `1.61.1`         |
| ESLint     | lockfile exact               | `10.7.0`         |
| Prettier   | lockfile exact               | `3.9.5`          |
| Pagefind   | lockfile exact               | `1.5.2`          |

`.nvmrc`と`packageManager`はそれぞれリリース基準のNode.js/npmを示します。対応範囲内のpatch更新は通常開発で許可され、`devEngines`は範囲外の場合だけ警告します。依存版を変更するときは、通常どおりmanifestと`package-lock.json`を同じ変更で更新します。

## Local-only setup

```bash
nvm install
nvm use
node --version
npm --version
npm ci
npm run test:e2e:install
```

リリース再現を行う場合は、Node.jsが `v24.18.0`、npmが `11.16.0`
と表示されることを確認します。通常開発では上表の対応範囲内であればpatchが異なっていても実行できます。対応範囲外のNode.js/npmでの動作は保証せず、`engine-strict=true`により依存インストールを停止します。Playwrightのbrowser
binaryはローカルcacheへ保存され、repositoryへcommitしません。

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
- `SITE_URL=https://example.invalid`
  はcredential、path、query、fragmentを含まないoriginだけを受理し、canonical
  URL生成以外の外部通信を発生させません。
- `link:check` は同じ実行内でbuildした `dist` の内部linkだけを検査します。
- `verify:fast` は内部link検査とChromium/Firefox/WebKitの主要E2Eまで実行します。
- GitHub
  Actionsの[CI workflow](../../.github/workflows/ci.yml)は、リリース基準版と対応範囲のローリング版をそれぞれ`npm ci`および`verify:fast`で検証します。
- `check` は`src/client/`のbrowser source、Astro frontmatter/build、Node.js
  CLI/config、Vitest、Playwrightの型環境を分離して検査します。
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
