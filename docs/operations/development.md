# Local development

現行の更新方針と検証範囲は[Codexの更新マニュアル](update-manual.md)と
[Constitution 4.0.0](../../.specify/memory/constitution.md)を参照する。以下は既存環境・実装の説明であり、全コマンド・全ブラウザーの実行を通常更新の必須条件としない。CIの変更選択は以下の分類で確認する。

## 変更範囲に応じたCI検証

`Verify (release baseline)`はNode 24.18.0/npm 11.16.0の単一環境で、PRのmerge-base、main
pushの前回SHAとの差から検査を選ぶ。文書だけでもjobを起動し、書式・ローカルリンク・見出し参照・feature選択を検証する。

| 変更                                                                       | 検査                                                                                                        |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| AGENTS/README、憲章・テンプレート・feature選択、operations/specsのMarkdown | 変更文書の書式・ローカル参照のみ                                                                            |
| 公開本文                                                                   | 本文parser・実projection・内部参照のテスト、build、内部リンク、Chromiumのprojection E2E                     |
| `src/content/`のデータ、教科書順                                           | schema、実データのID/参照/3DAG/配置/順序/metrics/履歴・訂正テスト、build、リンク、projection/search/記録E2E |
| UI/学習記録                                                                | lint・型、対象挙動のテスト、build、リンク、Chromiumの対象E2E                                                |
| 解説執筆skill                                                              | lint・型、skill/本文/実行コードのcontractと利用側テスト                                                     |
| 共通コード・schema・依存・workflow・未知path、差分取得不能                 | schema・lint・型、既存Vitest全体、build、リンク、Chromium全体                                               |

複数分類は検査の和集合を実行する。renameは削除と追加に分解し、両pathを判定する。本文・データの削除も検査対象にする。非公開文書の削除、空差分、不正なGit出力は広い検査へ戻る。検査の失敗・signalは非zeroで後続を止め、cancelを成功へ置き換えない。

CIは常に変更選択のcontractと既存文書checkerのfixtureも確認する。`scripts/verify/runner.ts`が分類を担当し、非公開文書の書式・参照検査は既存`.github/actions/nonpublic-docs/check.mjs --files ...`を再利用する。通常経路にpreview凍結・全shard再join・初版監査・release/review証跡照合・一律の数学回帰は含めない。関係する教材変更ではCodexが公式根拠・証明・境界条件を確認し、既存`docs/verification/bootstrap/pr65*-mathematical-checks.py`の該当回帰を実行する。

切替中は旧4jobも残している。新baselineの実成功後に実branch
protection/rulesetを読んで旧4checkを外し、deploy参照を揃えてから旧jobを手動入口へ移す。実設定の切替状況と復旧順は[更新マニュアル](update-manual.md#ci必須設定の切替と復旧)を参照する。

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
- `verify:fast`
  はActionsの差分から検査を選びます。ローカルは`--base REF`でtrackedの作業差分と未追跡ファイルを含め、`--all`で広い検査を明示できます。引数/差分指定なしのローカルも広い検査です。
- `check`の後は`build:checked`を使い、Astro checkを再実行しません。単独の`build`にはAstro
  checkを残しています。`build:checked`は同じ作業ツリーで`check`が成功したrun専用です。
- `test:e2e:install:ci`はChromiumだけ、`test:e2e:install`と`test:e2e:install:all:ci`は3ブラウザーの手動準備です。`test:e2e:built -- --project=firefox`等の既存入口も保持しています。
- GitHub
  Actionsの[CI workflow](../../.github/workflows/ci.yml)は公開先と同じ`SITE_URL=https://fu-l.github.io`、`BASE_PATH=/abc-textbook`を使います。ローカル再現も両変数を指定します。
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
- 通常CIのE2EはChromiumです。他browser固有の変更では既存Firefox/WebKit projectを選んで実行します。
- Pagefindは静的build後に生成され、CSPはStarlightの既知inline script
  hash、layout用style属性、WebAssembly、同一origin workerだけを許可します。
- `.env*`、browser report、coverage、build outputはGitへ追加しません。
