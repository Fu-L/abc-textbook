# Quickstart: 各PRの検証と移行の確認

本書は[plan.md](plan.md)の検証ガイド。現行と移行後のコマンドを区別する。ここに示す全検査を小更新のたびに実行する一覧ではない。正本・URL・記録の保持条件は[contracts/compatibility.md](contracts/compatibility.md)、データは[data-model.md](data-model.md)を参照する。

## 準備

憲章・更新マニュアル・Git差分を読み、未commitの変更を保持する。 `.nvmrc`のNode
24.18.0とpackageManagerのnpm 11.16.0を使う。必要な場合だけlockfileから準備する。

```sh
node --version
npm --version
npm ci
```

作業コマンドはリポジトリrootで実行する。以下のコマンドは既存script/テストを使う。移行で期待する挙動はまだ未実装であり、plan作成時にこれらが成功したという報告ではない。

## PR-01: 比較基準

移行開始時のGit
SHAと確認済み公開SHAをPR本文へ記す。私的データや新しい凍結台帳は保存しない。移行前のbuildと移行後のbuildは別の一時ディレクトリで作り、検証中の同じ`dist`を上書きしない。既存projection/E2Eへ追加する比較では次を確認する。

- 既存Problem/Tag/Outcome/Unit ID集合と本文bytes、配置、前提、教科書順が一致。
- 全既存HTML/data URLとHTMLの`id`/anchor集合が残る。追加PRでは旧集合が新集合に含まれる。
- 本文とリンク先を同時に消す回帰も集合比較で検出できる。

```sh
npm test -- tests/integration/full-public-projection.test.ts tests/unit/textbook-order.test.ts tests/integration/internal-links.test.ts
npm test -- tests/unit/learning-record-timestamp.test.ts tests/unit/learning-record-store.test.ts tests/integration/learning-record-backup.test.ts
```

既存backup
integrationの100件以上・未知ID・競合・不正入力・原子的復元が成功すること。CI時間は同種変更の正常runを使い、依存準備開始から必須検証完了までのelapsed
timeを移行前後で同じ境界にする。queue待ち・deploy時間は別記し、約20分という申告値を実測値に置き換えたと偽らない。

## PR-02: CIとrequired設定

```sh
npm test -- tests/contract/verify-fast.test.ts
```

既存テストへ文書のみ・本文・追加・UI/記録・共通/未知変更の選択と失敗伝播を追加する。文書のみでbuild/E2Eを起動しないこと、必要な検査失敗・cancelを隠さないことを確認する。
`verify:fast`の意味を変えたらscript契約とマニュアルを同時更新する。

実GitHubでは残す`Verify (release baseline)`が必要な検査を実行して成功することを確認し、branch
protection/rulesetから旧4名を外す。deploy側参照と設定例を同じPRで合わせる。設定読戻し、PR実check、merge可能性、mainの検証を確認する。外部権限がなければ旧job削除へ進まない。失敗を含む必要な検査がmerge/deployを止めることは対象テストと実workflow結果で確認する。

## PR-03〜06: schema / loader / catalog / authoring

schemaを変更したPRでは生成と一致検査、変更した意味検証を行う。

```sh
npm run schema:generate
npm run schema:check
npm run check
npm test -- tests/contract/schema-parity.test.ts tests/unit/domain-invariants.test.ts tests/unit/release-history.test.ts
npm test -- tests/integration/catalog-cli.test.ts tests/integration/full-public-projection.test.ts tests/integration/canonical-correction.test.ts
npm test -- tests/contract/explanation-authoring-skill.test.ts tests/unit/problem-authoring-document.test.ts tests/unit/problem-authoring-details.test.ts
```

各PRに関係するsubsetを選ぶ。旧catalog/metadata/historyと既存本文を実データで読めることを確認する。新規reviewなしの履歴を読むケースと、duplicate/未公開/不一致を拒否するケースを既存テストへ追加する。旧日付版と新版`YYYY.MM.DD-r<run_id>`、同SHAの別runの別版を受理し、旧履歴の順序を保持すること。backupは1桁の日を含む旧入力と新版のexport/importが成功し、field・schemaVersion・値・独立日時・未知IDが変わらないことを確認する。型違反・重複ID・未知source参照・Tag/Outcome/Unit各DAG循環・未完成本文・訂正先漏れが失敗すること。

PR-04では一時copyの既存本文を訂正し、受理台帳を更新せずprojectionを作れることを検証する。PR-05後のCLIは次の形で動くことを確認する（**移行後の期待コマンド。現行はinventory必須**）。

```sh
npm run catalog:validate -- --input /tmp/abc-textbook-candidate/catalog.json
npm run catalog:build -- --input /tmp/abc-textbook-candidate/catalog.json --output /tmp/abc-textbook-candidate/validated-catalog.json
```

candidateは既存正本から作る使い捨て入力。出力がすでに存在する場合の上書き拒否も確認する。旧証跡を指定する既存呼出も移行期間中は型検証して受理する。PR-04だけでは旧prepared
catalog/deploy依存が残るため、訂正公開まで成立したとは扱わない。

## 公開出力に影響するPR: buildとリンク、必要なE2E

本番のbase
pathでbuildする。以後のリンク/E2Eは同じ出力を使う。schema/共通処理PRで`check`も使う間は既存scriptに`astro check`重複がある。PR-02でこれを整理する。

```sh
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
```

PR-07a以降も、このローカルコマンドにActionsのrun情報を補作しない。[build入力契約](contracts/compatibility.md#ローカルbuildとactionsの入力)に従い、既存履歴末尾の版（空indexなら基準catalogの版識別子）で`publicationStatus: prepared`の候補を作る。古いmetadataを出力へ残さず、`/release-metadata.json`を生成・コピーしない。更新一覧の既存履歴と内部リンクを確認し、この出力を実配信や公開履歴追記の入力にしない。基準版も読めない場合は入力不足を報告する。

Actionsのbuildは`GITHUB_REPOSITORY`、`GITHUB_RUN_ID`、`GITHUB_SHA`とworkflowが実runから取得して渡す`ABC_TEXTBOOK_RUN_CREATED_AT`を検証する。欠落・不正・SHA不一致・作成日時取得失敗はbuild失敗とする。PRは新版candidateを検証するだけで配信しない。使い捨てrun入力によるmetadataテストは実配信成功と区別する。これらの期待挙動はPR-07aの公開設定テストへ追加し、実装後に確認する。

必要なbrowserだけ準備し、対象specを指定する。表示・projection・deployの移行では次の確認を使う。

```sh
npx playwright install chromium
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/full-projection.spec.ts tests/e2e/search.spec.ts tests/e2e/learning-records.spec.ts
```

既存URL、数式、検索、主配置と関連先、狭い画面、キーボード操作を影響範囲で確認する。使い捨てbrowser
contextで旧DB/version
1、reload、状態/復習の独立日時、backupを確認する。記録互換性の比較に私的な実データを使わない。

## PR-07a〜07c: Pages切替・履歴追記・失敗/復旧

標準Pages経路を導入する最初の公開では、旧正常版を保持し、mainの成功runから配信する。公開を依頼された実装段階で次を確認し、実GitHubの状態を短い報告へ記す。

1. build SHA、検査対象SHA、artifactのSHA、`release-metadata.json.commit`が一致する。
2. uploadした同じ`dist`をdeployし、deploy jobで再buildしない。PR artifactは配信しない。
3. Actions/Pagesの成功と代表的な公開導線を確認する。schemaやartifact存在だけで公開成功としない。
4. 一時コピーの軽微な本文訂正で「対象確認→正本編集→検証→報告」の経路とmanifest/reviewの新規作成0を確認する。実教材の差分はcommit・配信せず、SC-004の実訂正公開は別依頼まで未達とする。
5. PR-07aの実成功後にPR-07bで履歴writerと旧手動triggerを切り替える。既存indexを変更せず、コード/workflow変更として必要な通常検証・main配信・公開確認を行う。PR-07a/07bの配信済みcatalog/metadataは標準artifactから取得し、必要なら同じ作業内の一時領域へ置く。
6. PR-07bの実成功後に、独立したPR-07cで両版の実入力を照合して既存履歴indexへ成功順に追記する。変更をindexと非公開運用文書に限定し、writer・workflowの変更を混在させない。履歴だけの変更もbuild・リンク・対象履歴検査を通して配信し、その配信自体の追記は要求しない。反映前も最新metadata/Pagesへ到達でき、旧履歴URLが残る。入力取得不足があれば追記未完了と報告する。
7. 各PRの初回失敗なら旧正常公開を維持し、実配信済みの事実を消さずに切替変更を戻す。

[採番・履歴入力契約](contracts/compatibility.md#新版の採番と再実行)に沿って、同日別runとrevert後は別版、日を跨ぐ同run再実行は同版となることを確認する。新版の履歴にはGit内の旧prepared
catalogを代用しない。artifactが取得できなければ、対象版/SHA/runに一致する現在配信中の公開JSONと実成功確認を利用する。どちらも取得不能なら追記のみ保留し、現在の正本から過去の成功を再生成しない。同版/SHA/範囲/概要の再追記は差分0、異なる内容での同版上書きは拒否する。

履歴だけの配信の試験では、最後の成功配信SHAとの差が履歴indexと非公開運用文書だけかを確認する。metadataはその配信の新しい版/SHA/runとなり、教材差分集合は空、cutoff・収録範囲は不変。配信後に追加の履歴追記が必要にならないことと、未配信の教材変更が混ざれば通常公開の必要検証へ戻ることを確認する。

失敗ケースは対象テスト・使い捨て入力・既存失敗runを使う。故意に本番サイトを壊して検証しない。

| ケース                     | 期待結果                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| schema/リンク/対象挙動失敗 | 必須check failure。upload/deployへ進まない                         |
| 配信失敗                   | Actions/Pagesが失敗、旧正常配信を維持。「公開完了」と報告しない    |
| 配信成功後に確認失敗       | 配信済み・確認未完了と区別。修正またはrevertへ進む                 |
| 同run再実行                | 同SHA・同版のartifactを使う。消えていれば同SHA・同版で再検証/build |
| Git revertで復旧           | 新main SHAを新runの別版で再検証・再公開。DBと追加IDの記録を保持    |

deploy経路の失敗伝播・artifact/SHA対応を検査するテストが現行に足りない場合だけ、既存workflow/公開設定のテストへ追加する。専用deploy
adapterをテストのために新設しない。

## PR-08〜09: live小batchと再実行

```sh
npm test -- tests/contract/corpus-metadata.test.ts tests/integration/update-discovery.test.ts tests/integration/update-prepare.test.ts tests/integration/update-validation.test.ts
```

公開済みbaseを持つ一時copyへ、取得済み公式入力を使って対象全件を追加する。現行の`abc:update --preview initial-v1`の成功をこのシナリオの代用にしない。接続後の実コマンドは実装PRで確定し、更新マニュアルへ記す。専用CLIを増やすことは必須ではない。

- 1終了済みContestと小catch-upで、Dより後の全問題・source・配置・metrics・索引が整合する。
- Ex identity/将来I/ABC316欠番と取得失敗を区別し、D欠落・未終了・不完成は保留する。
- 同じ取得/追加を二度実行し、2回目の追加差分・重複が0。
- 対象外の本文・分類は差分0。新しい上限を未収録まで拡大しない。
- 追加/取消後も旧記録の値と日時・未知IDを保持する。

integrationの実入力経路確認と、実Contestの数学本文執筆・公開は別々に報告する。SC-004の実公開が未実施ならM5の完成とはしない。

## PR-10: 削除と全体の完了

```sh
rg -n 'verify:release|abc:review|abc:deploy|evidence-inventory|accept-seed|work-manifests|review-update' package.json scripts src tests .github docs/operations
```

検索結果の存在だけで削除可否を判定せず、現行consumer、履歴読込、文書リンクを区別する。公式source・参照されるdigest・公開履歴を残し、参照不要の専用producer/consumer/テストだけを削除する。削除PRはschema・型・残すテスト・build・リンクと必要なE2Eを再確認する。

同種/同規模の通常更新の正常な必須検証5回から中央値を算出し、移行前の同じ計測境界と比較する。10分以下かつ50%以上短縮の双方を満たさなければSC-005未達として原因を確認する。結果はPR本文または完了報告へ集約し、独立した計測台帳を追加しない。SC-001〜008の未実施・失敗・外部設定未完了を明記する。

## 計画文書だけの確認

今回のplan生成はこの範囲。アプリの全検証・deployを必要としない。

```sh
npx prettier --check --ignore-path /dev/null specs/002-simplify-maintenance/plan.md specs/002-simplify-maintenance/research.md specs/002-simplify-maintenance/data-model.md specs/002-simplify-maintenance/quickstart.md specs/002-simplify-maintenance/contracts/compatibility.md
git diff --check
```

ローカル参照とanchorの実在、仕様/憲章/マニュアルとの整合、実Gitブランチとfeature識別子の区別を確認する。build/CI短縮/live追加/公開成功をこの文書確認の結果として報告しない。
