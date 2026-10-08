# Implementation Plan: 既存教材の保守・公開を段階的に簡略化する

**Branch**: `main`（Gitの実ブランチを維持） | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**:
`specs/002-simplify-maintenance/spec.md`と今回の移行計画依頼。setup-planの`BRANCH`は`002-simplify-maintenance`（feature識別子）を返したが、Gitのブランチは変更していない。

## Summary

Astroサイト、教材の正本、既存のparser・projection・schema・テストをそのまま使う。旧承認・受入台帳を読む処理を順に外し、単一環境のCIと標準Pages
Actionsへ移行してから、参照不要になった専用処理を削除する。新しいアプリ、汎用更新基盤、証跡管理層は作らない。

この計画のPR-01〜10はそれぞれ到達時点で単独検証・mergeでき、revert方法を持つ。ただし後続PRには明示した前提PRがある。後続が新形式を使用した後のrevertでは、依存PRを先に戻すか互換readerを残す。途中の段階でも既存の公開版を維持し、全段階を一括mergeする必要はない。本文訂正の経路はPR-07、公開済みbaseからのABC追加の経路はPR-09で一時コピーを使って検証する。実教材の訂正・追加・その公開は本実装へ含めず、SC-004の実運用受入は別の教材変更依頼まで未達とする。この計画修正では実装・GitHub設定・公開環境を変更しない。

## Technical Context

**Language/Version**: TypeScript 6.0.3、Node.js 24.18.0、npm
11.16.0を既存`.nvmrc`・lockfileに合わせる。

**Primary Dependencies**: Astro 7.1.0 / Starlight 0.41.3 / React 19.2.7、Zod 4.4.3 / Ajv 8.20.0、idb
8.0.3、Pagefind 1.5.2。新規依存・framework移行・今回に不要なversion更新は行わない。

**Storage**:
`src/content/`のMarkdown/JSON、Git、既存の公開履歴index。学習記録はブラウザー内IndexedDBのみ。DB名`abc-textbook-learning-records`、version
`2`、store `learning-records`、key `problemId`とbackup `1.0.0`を維持する。

**Testing**: Vitest 4.1.10、Playwright
1.61.1、既存schema生成・型検査・build・内部リンク検査。検証範囲と実行例は[quickstart.md](quickstart.md)。不足する互換性・変更選択・失敗時の回帰だけ既存テストへ追加する。

**Target Platform**: GitHub Pages `https://fu-l.github.io/abc-textbook/`。
`SITE_URL=https://fu-l.github.io`、`BASE_PATH=/abc-textbook`、静的出力、末尾slashを維持する。

**Project Type**: 個人用静的教材と既存ローカルCLI。backendやアカウント機能は追加しない。

**Performance Goals**:
SC-005の通常更新5回の中央値10分以下・同条件の移行前比50%以上短縮。約20分はユーザー申告の目安。PR-01でActionsの比較条件を決め、PR-09〜10後の横断確認で実測から判定する。現時点で達成値はない。

**Constraints**: 868問・213タグ・242 Outcome・232
Unitの既存本文、ID、配置、3つの前提DAG、読書順、URL・anchor、旧公開JSONと記録を保持する。公式source
fingerprintと互換性のための既存digestを、作業証跡と一緒に削除しない。

**Scale/Scope**: schema/authoring/catalogの旧証跡consumer、CI・Pages、1 Contestまたは小catch-up
batch、不要になった運用機構。教材の再執筆・再分類・全件再承認は対象外。調査で設計上の不明点を解消した。GitHubの実設定と時間の実測は実装時の確認項目であり、推測で埋めない。

## Constitution Check

| 原則           | 計画時                                   | Phase 1設計後の確認                                                               |
| -------------- | ---------------------------------------- | --------------------------------------------------------------------------------- |
| I 教材品質     | PASS: 再生成せず既存本文・体系を維持     | PR-04/09で本文・主配置・関連先・読書順を比較。表示を変えるPRは対象画面を確認      |
| II 正確性      | PASS: 公式出典と解法の確認を残す         | Source Revision・task identity・claim参照を維持。schema成功を数学の判定としない   |
| III マニュアル | PASS: 憲章と更新マニュアルを読んだ       | 全実装PRで変更した手順と残る制約を同じPRでマニュアルに反映                        |
| IV 検証        | PASS: 必要な自動検証を残す               | 変更選択の失敗は広い検査へ。失敗・cancelを成功扱いしない。build出力を再利用       |
| V 簡素さ       | PASS: 承認・証跡・独自deployの削除を優先 | 既存schemaを拡張・整理。過去欄の読込以外に新しい管理状態・台帳を設けない          |
| VI 互換性      | PASS: origin・base・保存形式を変えない   | 全既存URL/anchor、旧JSON、100件以上の記録、原子的復元を確認。未掲載IDの記録も保持 |

未解決の設計上の不適合はない。旧実装の技術的依存は下記の移行順で解消する。計画のPASSは、後続実装・公開・SC-001〜008の達成を意味しない。

## Project Structure

### Documentation (this feature)

```text
specs/002-simplify-maintenance/
├── spec.md                         # 既存仕様を維持
├── plan.md                         # PR境界・移行順・完了条件
├── research.md                     # 現行consumerと設計判断
├── data-model.md                   # 保持するデータと旧欄の扱い
├── quickstart.md                   # 各段階の検証・公開・復旧
└── contracts/compatibility.md       # 既存URL/CLI/Pagesの継続条件
```

`tasks.md`は生成済みで、実装PRごとのタスクと依存順を定義する。この設計書一式を通常の小更新へ要求しない。

### Source Code (repository root)

```text
src/content/                        # 既存教材・出典・配置・索引
src/lib/domain/schema-parts/         # 既存schemaの移行
src/lib/authoring/                   # 本文parserと検証の再利用
src/lib/catalog/                     # 同じprojectionから台帳依存を除去
src/lib/corpus/                      # 公式取得・parserの再利用
src/lib/learning-records/            # 保存実装は保持
src/lib/deployment/                  # 未使用となった独自adapterを後で削除
src/pages/updates/                   # 既存履歴URLと旧情報の表示を維持
scripts/catalog-build.ts
scripts/catalog-validate.ts
scripts/update-abc/                  # 実入力と小batchの必要部分だけ接続
scripts/verify/                      # 通常検証から初版専用工程を除去
scripts/release/                     # 履歴読込を残し専用accept/transactionを整理
tests/                              # 既存unit/contract/integration/e2eを拡張
.agents/skills/abc-explanation-author/
.github/workflows/
docs/operations/update-manual.md
docs/operations/protected-main.json
```

**Structure
Decision**: 既存ファイルを改修する。新しいservice、repository、adapter、workflow生成器、検証policy
DSLは導入しない。001の`spec.md`を上書きしないが、実装から参照される001配下の生成schemaは正本と同時に更新する。

## Phased Migration / PR Boundaries

既存のreview/初版auditが変更後のconsumerを旧digestへ縛るため、M3の必須経路整理をM2のコード変更より先に行う。必要な不具合検出はPR-01で確認した検査へ引き継ぎ、旧gateを偽の成功で通さない。PR-02〜06の間は現在のPages配信を保持し、新しい内容の公開切替はPR-07で行う。

各PRは変更概要・実行した検証・未解決事項をPR本文へまとめる。手順変更は更新マニュアルへ同時反映する。表のテスト名は`tests/`配下。公開出力に影響するPRでは、本番subpathで一度buildし、同じ`dist`に内部リンク検査を行う。

### PR-01: 保持対象と既存検査の基準を確認する（M1）

- **前提**: なし。作業中の憲章・文書・002仕様の差分を保持する。
- **変更**:
  `integration/full-public-projection.test.ts`、`integration/internal-links.test.ts`、`e2e/full-projection.spec.ts`等に不足する互換性比較だけ追加。既存Git
  commitと一時ディレクトリのbuildからID・本文・taxonomy・URL/anchorを比較できるようにする。
- **再利用/削除**: 既存catalog・リンクvalidator・learning-record
  fixtureを使う。新しい凍結manifestや全本文digest台帳をcommitしない。
- **検証/完了**:
  SC-001〜003の比較方法が再実行可能。既存の100件以上のbackup、未知ID、旧DB読込、独立日時・原子性テストを確認。現行CI各stepの検出対象と時間をPR本文へ一度整理する。
- **戻し方**: テスト・説明のrevert。公開機能・データへの変更はない。

### PR-02: 通常CIと必須チェックを単一環境へ絞る（M3）

- **前提**: PR-01。代わりに残すschema・参照・本文・挙動・リンクの失敗検出手段が成功すること。
- **変更**:
  `scripts/verify/runner.ts`・`fast.ts`、`tests/contract/verify-fast.test.ts`、`ci.yml`、`initial-release-audit.yml`、`production-deploy.yml`のcheck名参照、`protected-main.json`。
- **再利用/削除**: `Verify (release baseline)`の名前を維持。supported range、Release
  validation、Production review、毎回のInitial corpus
  auditを必須経路から外す。初版監査・数学回帰・他ブラウザーは該当変更時の手動検査として既存入口を使う。通常CIは[変更範囲の表](#validation-selection)に従う。
- **設定の順序**: 同名baselineが必要な検査を実行するPR結果を確認し、実際のbranch
  protectionとrulesetから他4名を外す。PR内のdeploy側配列も同じbaselineへ合わせてから旧jobを除く。ローカルJSONだけで設定完了としない。権限不足なら旧jobをまだ消さず、外部切替を未完了として報告する。
- **検証/完了**: 変更選択・失敗伝播のrunnerテスト、PRの実check、GitHub実設定の読戻し。文書だけでもrequired
  jobは必ず起動し、文書検査を行う。必須検査のfailure/cancelでmerge・公開へ進まない。廃止名の待ち状態がない。
- **戻し方**:
  workflowを先に戻して旧checkが発生することを確認し、外部required設定を戻す。設定だけを先に戻して待ち状態を作らない。公開済みサイトを停止する操作はない。

### PR-03: schemaと公開履歴を旧データ対応のまま緩める（M2の準備）

- **前提**: PR-01〜02。
- **変更**:
  `schema-parts/catalog.ts`・`release.ts`・`learning.ts`、`build-release-history.ts`、`scripts/release/build-history.ts`、`src/pages/updates/[version].astro`と生成schema。新規公開のreview必須・初版agent例外依存を外し、旧review/check結果digest/manifest欄は存在するときその型を検証して保持する。version/baseReleaseVersionは旧日付版と新版`YYYY.MM.DD-r<run_id>`を受理し、backupの`catalogVersionAtExport`も従来の受理値を保って新版へ対応させる。field・schemaVersion・DB識別・記録日時は変えない。
- **再利用/削除**: 同じschema・履歴index・routeを使う。承認の代用となる新しいmodeやreceiptを作らない。CLI
  writerや現行deployはこのPRで切り替えない。
- **検証/完了**:
  `contract/schema-parity.test.ts`、`unit/release-history.test.ts`、`integration/learning-record-backup.test.ts`。実際の旧catalog/metadata/historyと1桁の日を含む旧backupが読め、新版のexport/importでも値・日時・未知IDを保持する。旧entryは値と順序を変えず、新規entryはreviewなしで読める。同SHAの別runは別版として受理し、重複版・同版の異なるSHA/範囲/概要・未知commitは拒否する。公開成功の確認はwriterが実Pages/Actionsの結果で行う。
- **戻し方**: 新形式を本番へ書く前なら単独revertできる。新形式の発行はPR-07以降に限定する。

### PR-04: 公開loaderを執筆済み正本から構築する（M2）

- **前提**: PR-01〜03。
- **変更**:
  `full-public-projection.ts`と`verify-full-projections.ts`の利用側からbootstrap受入台帳の必須読込・本文bytes受理照合を除く。既存structured
  rootsとmetadataの`docPath`から既存本文を読む。
- **再利用/削除**:
  `readProblemAuthoringDocument`、`buildProblemContent`、`validateReleaseLearningStructure`、metrics検証、教科書順、UI/search
  projectionを再利用。欠落本文、未完成構造、未知source、配置・前提不整合は引き続き失敗させる。旧台帳ファイルは残す。
- **検証/完了**:
  `integration/full-public-projection.test.ts`、`unit/problem-content-projection.test.ts`、`unit/textbook-order.test.ts`、対象E2E。既存本文・配置・出力の意味とURL/anchorが一致。一時copyで本文を訂正して、受入台帳の書換えなしでprojectionが作れる。欠落・未完成本文は失敗する。
- **注意/戻し方**:
  Problemの既存`draft: true`とUnitの`draft: false`の非対称を一括修正しない。prepared release
  catalogの旧利用はPR-07まで残り、ここで訂正の公開が完成したとは扱わない。既存教材はそのままなのでloaderのrevertで戻せる。

### PR-05: catalog生成・検証から証跡inventoryの必須依存を外す（M2）

- **前提**: PR-02〜04。
- **変更**:
  `build-catalog.ts`の意味検証、`catalog-build.ts`・`catalog-validate.ts`、`evidence-inventory.ts`の呼出側。現行正本のschema/ID/参照/DAG/配置/本文検証とrelease証跡の照合を分離し、通常catalog生成では後者を要求しない。
- **再利用/削除**: 既存validatorをその場で整理する。旧`--evidence-inventory`引数は移行中だけ受理し、指定時の旧入力検証を維持する。引数を削るだけ、validator全体をskipするだけの変更は不可。
- **検証/完了**:
  `integration/catalog-cli.test.ts`、`unit/domain-invariants.test.ts`、`contract/catalog-scope.test.ts`、`integration/canonical-correction.test.ts`。inventoryなしで正本から生成でき、型違反・重複ID・未知参照・各DAG循環・訂正先漏れは拒否する。
- **戻し方**: 旧inputとCLI呼出は残っているためrevertできる。旧release/deploy
  consumerは次段階まで削除しない。

### PR-06: 執筆skillと利用側を現行憲章へ合わせる（M2）

- **前提**: PR-02〜05。
- **変更**:
  `.agents/skills/abc-explanation-author/`、`authoring/explanation-authoring-skill.ts`、`schema-parts/authoring-unit.ts`、`scripts/update-abc/author.ts`と関係する訂正validator。skill
  digest・review mode・毎問の独立演習を新規必須条件から外す。
- **再利用/削除**: 公式Source Revision、task
  identity、claim根拠、着想・手順・証明・境界・全体計算量の確認と実行コード検証を残す。旧本文の`skill`等は読めるままにし、868本文のfrontmatterを書き換えない。
- **検証/完了**:
  `contract/explanation-authoring-skill.test.ts`、`unit/problem-authoring-document.test.ts`、`unit/problem-authoring-details.test.ts`。旧本文と証跡なしの新規出力が読める。未検証claim・公式task不一致・未完成解説は診断できる。
- **戻し方**: 旧本文を維持したままskillとconsumerをrevertする。

### PR-07: 同じ検証済みbuildを標準Pages Actionsで配信する（M4）

- **前提**: PR-02〜06。既存URL・旧履歴を読む互換性検査が成功。
- **変更**: `ci.yml`の既存baseline/buildにuploadと`needs`で依存するdeploy
  jobを接続。`production-deploy.yml`の独自API/poll・`verify:release`再実行・旧prepared
  catalogの必須利用を切り替える。既存release
  metadataと履歴projectionのwriterを必要最小限に改修する。
- **再利用/削除**:
  `actions/configure-pages`、既存`upload-pages-artifact`、`actions/deploy-pages`を使う。mainの同じrun・SHAで一度作った`dist`を、型・対象テスト・リンク・必要なE2E成功後にupload/deployする。PRイベントはdeployしない。文書のみで公開出力に影響しなければdeployしない。
- **公開情報**: `/release-metadata.json`の既存必須fieldを維持し、commit・Actions run
  URL・範囲と変更概要をbuild内へ出す。新版のversionはrunの作成UTC日付とrun
  IDから`YYYY.MM.DD-r<run_id>`を作り、同run再実行で維持、別runやrevert後は別版とする。[採番と互換条件](contracts/compatibility.md#新版の採番と再実行)に従い、既存版の衝突は上書きせず検出する。自前receiptやcheck
  result digest台帳は作らない。
- **ローカルbuild**:
  [build入力契約](contracts/compatibility.md#ローカルbuildとactionsの入力)に従い、Actions外では既存履歴末尾、空の場合は基準catalogの版識別子を使う未公開candidateを作る。既存の`SITE_URL`/`BASE_PATH`だけでbuild・リンク・必要なE2Eを実行でき、metadataは生成しない。Actions内では実runの作成日時を`ABC_TEXTBOOK_RUN_CREATED_AT`で渡し、run
  ID・SHAを含む入力不足/不正を失敗させる。PR
  candidateとローカル出力は実配信・履歴追記へ使わない。metadataなしの更新一覧、基準版不足、Actions入力不足の回帰を既存公開設定テストへ追加する。
- **通常訂正の経路確認**: 一時コピーの本文を小さく訂正し、旧prepared
  catalogとのsnapshot照合なしにbuildする。教材差分はcommit・本番配信しない。実main
  runでは教材内容を維持して標準Pagesの切替を確認する。新規catalogの生成で旧checkの成功件数・digest・時刻を補作しない。実教材訂正の公開とSC-004は別依頼まで未達とする。
- **履歴**: candidateを事前にpublished
  indexへ追加しない。配信後の実際の成功をPages/Actionsで確認し、そのrunが配信した同じartifact内の`data/catalog.json`と`release-metadata.json`から既存`src/content/indexes/release-history.json`へ後続更新で反映する。新版の入力にGit内の旧prepared
  catalogを代用しない。旧entryを当時のcatalog/commitから読めるままにする。artifact取得不能時の公開JSON確認と保留は[履歴入力契約](contracts/compatibility.md#配信後の履歴入力と履歴だけの配信)に従う。履歴反映前は最新metadataとPages履歴へ到達できるよう更新一覧から案内する。
- **履歴だけの配信**: 最後の成功配信SHAとの差が既存履歴indexと非公開運用文書だけなら、対象検査・build・リンクを通して別runの新版で配信する。metadataは実buildのSHA/runを示し、教材差分集合は空、cutoff・収録範囲は不変。その配信自体のindex追記は要求せず、標準Pages/Actionsへ記録して追記の連鎖を止める。他の未配信差分を含む場合・判断不能は通常公開と必要検証へ戻す。
- **検証/完了**: 実deploy成功、metadata
  SHAとrun対象の一致、全既存URL/anchor比較、代表問題・単元・検索・要復習・設定・更新履歴確認。一時コピーの軽微な訂正が新しいmanifest/reviewなしでbuildできることと、教材不変の標準配信成功を確認する。既知の配信失敗・事後確認失敗・Git
  revertでの復旧を対象テストと運用で区別する。一時コピーの訂正経路と教材不変の実配信成功を分け、実本文訂正のSC-004は達成としない。
- **切替/戻し方**: 旧手動workflowは新経路の初回成功まで復旧用に残し、新経路成功後に旧triggerを無効化する。移行中の二重deployは行わない。新経路の失敗では旧公開版を保持し、必要なら切替PRをrevert。以後は不具合PRをGit
  revertし、mainの新SHAを同じ経路で再公開する。任意旧commit配信adapterは作らない。

この段階は次の3PRへ分ける。各PRのmerge・main配信・成功確認を順に行い、後続PRの差分を前の配信へ混在させない。

| PR     | 変更範囲と前提                                                                                                | 配信・完了の判断                                                                                                                    |
| ------ | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| PR-07a | 標準Pages、candidate/metadata生成、更新一覧の案内。PR-02〜06が前提                                            | 教材不変の実配信成功を確認。履歴indexは変更しない                                                                                   |
| PR-07b | PR-07aの成功後に履歴writer・回帰テストと旧手動triggerを切り替える                                             | コード/workflow変更として通常検証・配信を行う。indexは変更せず、PR-07a/07bの成功済み版の入力を標準artifactまたは一時領域で確保する  |
| PR-07c | PR-07bの実配信成功後に、両版の実入力を照合して成功順に追記する。差分を既存履歴indexと非公開運用文書に限定する | 最後の成功配信SHAとの差を確認し、履歴だけの配信としてbuild・リンク・対象履歴テストと実公開確認を行う。その配信自体のindex追記は不要 |

未配信の他差分があれば通常公開へ戻し、その通常公開の履歴反映も別のindex追記で完了させる。writer/triggerを切り替えるPR-07bを履歴だけの配信と判定しない。

### PR-08: 公開済みbaseから公式小batchを取得できるようにする（M5の準備）

- **前提**: PR-04〜06。公開の成立確認はまだPR-07に依存する。
- **変更**:
  `scripts/update-abc/discover.ts`・`acquire.ts`と`src/lib/corpus/`の既存取得・公式parserを使い、初版batch一覧や`initial-v1`に固定しない実入力経路を接続する。
- **再利用/削除**: 既存の終了判定・公式task
  order・source取得・再試行を再利用。Codexが既存取得手段で完了できれば専用live
  CLIの拡張は不要。新しい更新状態機械・queue・packet台帳を作らない。
- **検証/完了**:
  `contract/corpus-metadata.test.ts`、`integration/update-discovery.test.ts`。ABC466を含む公開済みbaseと別の追加対象を使い、公式取得結果からDより後の全対象、Exの公式identity、将来I、ABC316欠番、取得失敗、未終了・D欠落を扱う。fixture
  transportのテストと実入力の確認を区別する。
- **戻し方**: 取得結果は一時作業領域に置き、正本をまだ書き換えない。取得consumerのrevertのみで戻せる。

### PR-09: 小batch追加・再実行・catch-upを正本へ接続する（M5）

- **前提**: PR-07〜08。実装・試験は一時コピーに限定し、実教材の追加PRを混在させない。
- **変更**:
  `scripts/update-abc/index.ts`・`classify.ts`・`stage.ts`・`validate.ts`等の必要部分を改修、または既存コマンドとCodexの正本編集をマニュアルに一本化。初版fixture専用制限から通常更新を外す。
- **再利用/削除**:
  Problem/Source/metrics/配置/関連Unit/索引の追加だけを行い、既存本文を再生成しない。全部完成するまで同じbatchを公開せず、保留理由・再試行条件は短い報告へ。再実行時は既存IDと取得結果を比較し、未変更なら追加しない。
- **検証/完了**:
  `integration/update-prepare.test.ts`、`update-validation.test.ts`、schema/配置テスト、build・リンク・対象E2E。1終了済みContestと複数Contestの小catch-upを実入力経路で確認し、二度目の実行差分0、対象外本文・分類差分0。公開範囲が実収録範囲と一致する。
- **受入の範囲**: 実教材の訂正・数学本文追加・その公開は本実装へ含めず、別の教材変更依頼で行う。実入力を扱う同じ経路のintegrationと実際の執筆・公開を区別し、SC-004の1
  Contest公開が未実施ならM5全体は未完了と報告する。最新回までの一括追加は要求しない。
- **戻し方**: 対象batchをGit
  revertして再公開。追加IDの学習記録は消さず、unknown/orphanとして旧backupに保持する。次回追加で同じIDを再利用する。

### PR-10: 利用されなくなった専用処理を削除する（M6）

- **前提**:
  PR-01〜09。教材不変の標準配信成功と、一時コピーで通常訂正・追加・復旧の新経路を検証できている。実教材のSC-004受入が別依頼まで未達でも、技術的な参照消失を確認した対象は整理できる。未検証の運用依存が残る対象は削除せず、M6未完了として報告する。
- **変更**:
  `scripts/review-update.ts`、`verify-release.ts`、`deploy-release.ts`、`scripts/release/`のaccept/旧transaction、`src/lib/deployment/`の未使用adapter、旧専用validator/schema/test、package
  scriptsと旧workflowを呼出順に整理。
- **再利用/削除**: 通常の出典・本文・ID/DAG・リンク・学習記録テストは残す。旧機構のみを検査するテストはconsumerと同時に削除。歴史資料として読むschemaや履歴関数は残す。量が多ければ「CLI」「adapter」「生成物」の独立した削除PRへさらに分割する。
- **生成物**:
  `rg`でruntime、script、workflow、schema、テスト、文書リンクを確認。参照不要な重複生成物だけ削除し、公式Source
  Revision・参照されるfingerprint・過去の公開事実・既存公開URLの内容を残す。`docs/verification/`等を一括削除しない。
- **検証/完了**: 型・schema、残すunit/contract/integration、build・リンク、公開と記録の互換性。通常入口から旧承認・台帳consumerへの到達が0、実GitHub設定にも廃止名が0。SC-005は同条件5回の実ログで確認する。
- **戻し方**: 削除した処理と生成物をGit revertで復元。教材・学習記録はこのPRで変更しない。

## Validation Selection

判定は既存runnerとCI内の短い条件分岐で行う。独立した分類サービスや選択manifestは作らない。PRではmerge-baseとの差、main
pushでは前回との差を使う。削除・renameも対象にし、差分取得不能・未知path・複数分類は必要範囲の和集合、判断不能は広い検査へ進む。job全体のpath
filterでrequired checkを消さず、job内で実行範囲を選ぶ。

PR-07以降のmain公開対象判定では最後の成功配信SHAとの差も使い、未配信差分に必要な検証を通常の差分分類へ合流させる。履歴だけの配信を非公開文書へ分類せず、build・リンク・対象履歴テストを行う。最後の成功配信や差分を取得できなければ、通常公開の広い検査へ進み、履歴だけの例外を適用しない。

| 変更                                   | 通常の必須検証                                                            | 条件付きで追加                                                            |
| -------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 非公開文書のみ                         | 対象書式・ローカルリンク・整合性                                          | `.agents/skills/`は出力に影響するため該当contract、公開文書は本文変更扱い |
| 公開本文のみ                           | 対象本文・出典・構造、build、全内部リンク                                 | 同じ解法を触った場合の数学回帰、コード掲載時の実行                        |
| 問題追加・配置・構造化データ           | schema一致と実データ検証、ID/参照/3DAG/配置/順/索引、build・リンク        | 追加問題の検索・関連導線のChromium E2E                                    |
| UI/検索/学習記録                       | 型、対象unit/integration、build・リンク、対象Chromium E2E                 | 数式・狭い画面・キーボード確認、保存/backup互換性                         |
| schema/共通処理/依存/公開設定/判定不能 | schema、型、影響する広いunit/contract/integration、build・リンク、関連E2E | 実際に影響する他ブラウザーや数学/性能検査                                 |

Node/npmは単一基準環境。通常の`verify:fast`からpreview凍結、全shard再join、初版受入、証跡生成を外す。
`check`と`build`に含まれる`astro check`も同じrunでは重複させないよう既存scriptを整理する。PRの検証とmerge後のmain検証はSHAが異なるため各1回行う。同じmain
runのdeployでは再buildしない。文書PRのCI時間を本文訂正の短縮値として混ぜず、同種・同規模・同じ計測境界で比較する。

## Completion and Requirement Coverage

| 要求                             | 主な段階         | 完了の判断                                                                 |
| -------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| FR-001〜003、SC-001〜003         | PR-01/04/07/09   | 正本・全URL/anchor・旧catalogと記録の互換性                                |
| FR-004〜006、CQ-001〜004、SC-004 | PR-04〜06/07/09  | 一時コピーで4段階の経路検証。実訂正・1 Contest公開のSC-004は別依頼まで未達 |
| FR-007〜008                      | PR-08〜09        | live base、小batch、再実行差分0、保留と範囲の一致                          |
| FR-009〜014、SC-008              | PR-02〜03/07/10  | Git/Actions/Pagesから実状態へ到達。失敗区別と復旧                          |
| VO-001〜005、SC-005〜007         | PR-01〜02/09〜10 | 必要な失敗を検出。実設定整合と5回中央値                                    |
| VO-006                           | PR-01〜02/07     | 必要な失敗・互換性未確認を完了/公開としない                                |
| VO-007                           | 全PR             | マニュアル・skill・実設定を変更と同時に整合                                |
| VO-008                           | PR-01/09〜10     | queueを除き依存準備を含めた同条件の実測比較                                |

SC-001〜008のすべてを満たすまで機能全体の完了とはしない。権限・接続不足は具体的な未完了として記載する。後続PRのために本計画とマニュアルを参照すればよく、各PR用のspec一式・承認packetを作り直さない。

## Complexity Tracking

| Constraint or migration      | Why needed                                   | Affected paths                                        | Completion check                             |
| ---------------------------- | -------------------------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| 旧schema欄の読込を残す       | 既存本文と公開JSONを一括変換しないため       | `schema-parts/`、履歴projection                       | 旧入力の値を保持して読め、新規証跡が不要     |
| consumer移行まで旧台帳を残す | 現行build/CLIが参照するため                  | bootstrap成果、`evidence-inventory.ts`、旧release CLI | producer/consumer参照がなくなってから削除    |
| GitHub実設定の二段階切替     | 廃止check待ちと検査の空白を防ぐため          | CI、deploy、protected-main、実ruleset                 | 残す同名checkの成功と設定読戻し              |
| 公開履歴indexの後続反映      | 配信前の成功記録とcommit自己参照を避けるため | 既存history indexとwriter/updates                     | 実成功だけ追加。反映前もmetadata/Pagesへ到達 |
| live取得と正本追加の2PR分割  | fixture成功と実追加を区別するため            | `update-abc/`、`src/lib/corpus/`                      | 公開済みbaseで取得・追加・再実行・公開が成立 |
