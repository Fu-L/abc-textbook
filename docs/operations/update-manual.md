# Codexの更新マニュアル

現行方針は[Constitution 4.0.0](../../.specify/memory/constitution.md)。作業開始時に憲章とこの文書を読み、対象の手順を参照する。人間は自然言語で指示し、Codexが執筆・実装・検証・確認を完結させる。手順を変更したらこの文書も更新する。

## 1. 対象と正本を確認する

`git status --short`とGit差分を読み、作業中の変更を保持する。小さな訂正・文章修正は直接作業し、別の仕様書・manifest・承認packetを作らない。設計が必要な変更、またはSpec
Kitを指定された作業だけspec・plan・tasksを使う。

- `src/content/docs/`: 執筆済み本文。再生成で雛形へ戻さない。
- `src/content/`のJSON、`src/lib/domain/schema-parts/`: データとschemaの正本。
- `src/lib/taxonomy/textbook-order.ts`: 教科書の読書順。
- `src/content/policies/problem-placements.json`等: 問題配置と前提。
- `src/content/problem-metrics/atcoder-problems.json`: 補助指標。欠測は`null`を維持する。

タグ・Outcome・Unitの直接前提はそれぞれ独立したDAGとして扱う。問題のhomeはsemantic primary
Outcomeのowner
Unitとし、関連問題の参照と区別する。開催順・difficultyから分類や読書順を再計算しない。変更する問題と、その主配置・関連先・前提・導線をまとめて確認する。

## 2. 教材を追加・修正する

問題固有の公式問題文・制約・公式解説を確認し、本文の出典と対応させる。独自の論証は仮定、境界、反例、必要な検算を確認する。根拠不足は理由を記し保留する。source取得の失敗を推測で埋めない。

完全解説は着想、具体的な状態・操作・手順、正当性、境界条件、全体の時間・空間計算量を説明する。抽象的な典型名だけで終えない。既存の文章と記号を揃え、不要な繰り返しを減らす。独立した例題・演習・評価・解答セクションを一律に作らない。掲載した実行可能コードは環境・入力・手順・期待結果を示して実行する。

問題追加ではID、公式task
identity、主配置、関連先、metrics、索引、導線を整合させる。訂正では変更前後の関連先を確認し、関連から外れた単元にも古い説明を残さない。独自証明や大きな分類変更もCodexが確認し、第三者承認を待たない。

通常の執筆・訂正は、対象確認→正本編集→検証→報告で進める。管理用のmanifest/digestやreview
modeを作らず、独立した演習・評価・解答の節を一律に増やさない。一括執筆・取得CLIを使う場合だけ、その入出力契約と詳細手順を読む。旧初版・release/deployの残る依存は「既存実装からの移行」を参照する。

## 3. 変更に必要な検証を選ぶ

依存の準備が必要なら`.nvmrc`・`package.json`・lockfileを参照して`npm ci`する。既存scriptの意味と引数を確認して使う。`schema:check`は生成schemaとの一致の確認であり、教材データ自体の検証には対象のschema・catalogテストも使う。

| 変更                               | 必要な確認                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| 憲章・運用文書だけ                 | 文書の整合性、ローカルリンク、書式、Git差分                                              |
| 公開教材の文章だけ                 | 公式根拠・解法・用語・参照、build、内部リンク。挙動テストの新設は不要                    |
| 問題追加・配置・前提・構造化データ | 対象schema、ID・参照・DAG・掲載順・索引のテスト、build、内部リンク                       |
| schema・共通処理                   | 型・schemaの整合、利用側のunit/contract/integration、build。影響が広い場合は範囲を広げる |
| UI・検索                           | build、内部リンク、対象ブラウザーテスト、数式・狭い画面・キーボードの表示確認            |
| 学習記録・backup                   | 既存データの読み込み、値と日時、reload保持、export/importの対象テスト                    |
| 依存・公開設定                     | lockfileと対象環境、build、subpathと公開導線、必要な互換性検証                           |

既存コマンドの例（すべてを毎回実行する一覧ではない）:

```sh
npm run schema:check
npm run check
npm test -- tests/contract/schema-parity.test.ts tests/unit/domain-invariants.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/learning-records.spec.ts
```

buildは一度行い、同じ出力へのリンク・E2E確認には`:built`を使う。E2Eの環境・fixtureは`playwright.config.ts`と対象テストに合わせる。変更で検出すべき不具合に合わせてテストを選び、無関係な数学回帰や全件監査を繰り返さない。他ブラウザー固有の挙動、広範囲のschema・共通処理・依存変更では必要な検証を追加する。必須検査が失敗したら原因を修正し、影響する検査を再実行する。

学習記録の絞り込みも単元のcoverageを利用する。`src/lib/learning-records/`の変更では保存・日時・backupに加え、`tests/integration/full-public-projection.test.ts`と`tests/e2e/full-projection.spec.ts`で葉単元・親単元・章の問題一覧と復習一覧を確認する。`filter.ts`単独変更でも`verify:fast`は両方を選ぶ。

`verify:fast`は[分類別の検証表](development.md#変更範囲に応じたci検証)に従い、PRのmerge-baseまたはmain
push前のSHAとの差から必要な検査を選ぶ。複数分類は和集合、renameは削除・追加の両pathを扱う。未知path・取得不能・空差分・非公開文書の削除は広い検査へ進む。通常経路からpreview凍結・全shard再join・毎回の初版監査・release/review照合・一律の数学回帰を外した。既存の正本loaderのschema、ID・参照・3DAG・配置・本文・リンクと対象挙動の検証は残る。

```sh
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run verify:fast -- --base origin/main
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run verify:fast -- --all
```

ローカル`--base REF`はtrackedの作業差分と未追跡ファイルも含める。ActionsではcheckoutしたSHAとのcommit差分を使う。`--all`またはローカル差分未指定は広い検査。未知引数は使用法違反で停止する。失敗はexit
2、使用法違反64、signal/実行不能70で後続を止める。非公開文書だけは書式・リンク・見出し・feature選択を検証し、build・E2E・browser準備を実行しない。

`check`でAstro/各TypeScript環境を検査した同runは`build:checked`でbuildする。単独`build`にはAstro
checkを保持する。build出力は`:built`へ渡して再利用する。通常CIはE2Eを選んだときだけChromiumを準備する。他browserは`test:e2e:install`、Linuxでは`test:e2e:install:all:ci`で準備し、`test:e2e:built -- --project=firefox`等で必要なspecを実行する。

### CI必須設定の切替と復旧

現在の実required checkは`Verify (release baseline)`のみで、`strict: true`とGitHub Actionsのapp
IDを保持して読戻し済み。active main rulesetにstatus
checkの重複指定はない。移行PRのmergeまではmainの旧workflowが旧jobを生成する。再切替は、旧4jobを残したcommitでbaselineの実成功を確認し、次の順で行う。設定例JSONだけの変更を外部反映済みとは扱わない。

1. 実branch protectionと有効rulesetを取得し、required checkと他の保護条件を確認する。
2. baselineの実checkが成功したSHA/runを確認する。旧4jobの旧証跡失効を架空の成功で埋めない。
3. branch protectionのrequired status checksだけをPATCHし、`strict: true`とGitHub Actionsのapp
   IDを保持して`Verify (release baseline)`を残す。rulesetにもstatus
   checksがあれば同じ名前へ揃える。再取得して一致を確認する。
4. `protected-main.json`と`production-deploy.yml`を同名baselineへ揃え、deploy側が失敗・cancel・未完了checkを拒否することを確認する。
5. 実設定とdeploy参照が一致した後に旧通常jobを外す。初版監査・他browser・数学回帰の手動入口は保持する。権限不足なら旧job削除を保留する。

復旧は旧checkを実行するworkflowへ戻してから実required設定を戻す。通常の削除後に旧名だけを先にrequiredへ追加すると、そのcheckが生成されずmergeを止める。

初版監査workflowは`workflow_dispatch`だけで起動する。明示的な監査では3browserと全工程を用意する。旧手動Production
deployの初版事後検査も3browserを使うため、準備scriptを`test:e2e:install:all:ci`に揃えた。数学回帰は既存の`docs/verification/bootstrap/pr65*-mathematical-checks.py`から関係するものを選んで直接実行する。

公開loaderの初版受入台帳依存はPR-04で、通常catalog
CLIのinventory必須はPR-05で外した。旧release/deployの証跡依存とprepared版のsnapshot照合は後続PRまで残る。本文を正本から検証できることと、訂正を通常経路で公開できることは別である。初版監査の明示的な再実行は[既存監査手順](initial-release-verification.md)、旧prepared
catalog/deployの復旧は[公開引継ぎ](deploy-before-catch-up.md)を参照する。監査CLIの全工程は通常runnerから独立して保持し、旧出力をdigestだけ書き換えて通さない。

旧seed agent結果の更新・読込は、現行憲章の「III. Codex-Only Work Guided by a
Manual」を運用方針として認識する。削除済みのIssue
#53限定見出しを復活させない。憲章3.0.0固定の照合は旧human merge-review形式に限定し、seed
agent経路では既存結果に結び付いた現行憲章の方針・bytesを確認する。既存schemaとseedの対象制限、本文・check・監査結果との照合は保ち、人間承認を表す結果は作らない。

## 4. 互換性と見やすさを確認する

既存Problem
IDとURLを維持し、執筆済み本文を削除・再初期化しない。教材の分類変更でも学習記録の値と独立した日時を変更しない。IndexedDBのDB名・version・keyとbackup形式を維持する。保存形式を変える場合は旧データを読み込む移行・復旧手順を先に用意する。他人のブラウザー内データを検証fixtureに使わず、使い捨てcontextを使う。

表示へ影響する変更は、対象ページの数式、読書順、内部導線、狭い画面、必要な操作を確認する。無関係な画面まで総当たりする義務はない。

### 運用移行の前後比較（002 / PR-01以降）

教材の保持は`tests/fixtures/maintenance-compatibility.ts`を使う既存テストで比較する。
`ABC_COMPAT_BASE_REF`へ移行前のGit
SHAを指定すると、そのcommitを一時領域へarchiveし、Problem/Tag/Outcome/UnitのIDとデータ、全Markdownのbytes、問題配置、Tag・Outcome・Unitの各直接前提、実際に旧moduleがexportした読書順を現在の正本と照合する。公開projectionの本文とtaxonomy・配置・前提・順序も照合する。Problemの本文pathは現行metadataに存在しないため、既存本文の`authoringUnit.docPath`から読む。旧受入台帳を新しい比較台帳へ複写しない。

```sh
ABC_COMPAT_BASE_REF="$compat_base_sha" npm test -- tests/integration/full-public-projection.test.ts tests/unit/textbook-order.test.ts
```

SHA未指定時は`HEAD`と作業ツリーを比較する。commit後の`HEAD`同士の成功を移行前との比較に数えず、後続PRでは保存した比較元SHAを明示する。教材保持テストは一致を要求するため、教材追加を伴う別依頼での追加許可の判定には流用しない。凍結manifestや全本文digestをcommitしない。

URL保持は、別々にbuildした旧/new出力の全HTMLと公開データ（JSON/XML等）、HTMLの`id`と旧`a[name]`の集合を比較する。旧集合が新集合に含まれることを要求し、追加は許す。リンク元とリンク先の同時削除、catalog/feed/sitemap/metadataや過去のupdatesページの削除も検出する。内部リンク検査は残ったリンクの到達性を確認するので、この集合比較と併用する。

標準Actions
buildでは`release-metadata.json`を同じ正本・SHA/runから生成する。ローカルcandidateにはmetadataを生成しないため、全配信URLを比較するときはActions入力を明示した使い捨てbuildを用いる。PR-01の教材不変の試験では、確認済みの公開metadataを一時領域で両出力へコピーし、既存metadataのURLとschemaの保持を検証できる。これは過去の公開JSONを使うfixtureであり、新しいSHAの配信や検証成功を示さない。取得できなければmetadataを含む実比較は未実施と報告し、使い捨てHTML/JSONでの欠落検出と区別する。

作業ツリーに変更がある場合の一時コピー例を以下に示す。比較元SHAは変更前に確保し、commit後はそのSHAを指定する。依存は既存のNode/npm・lockfileを使う。`node_modules`のsymlink共有はAstroのcompile
pathを混在させるため、実体をコピーするか各一時領域で`npm ci`する。

```sh
compat_base_sha=$(git rev-parse HEAD)
compat_before=$(mktemp -d)
compat_after=$(mktemp -d)
git archive "$compat_base_sha" | tar -xf - -C "$compat_before"
tar --exclude='./.git' --exclude='./node_modules' --exclude='./dist' --exclude='./.astro' --exclude='./test-results' --exclude='./playwright-report' --exclude='./coverage' -cf - . | tar -xf - -C "$compat_after"
cp -R node_modules "$compat_before/"
cp -R node_modules "$compat_after/"
export SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook
npm --prefix "$compat_before" run build
npm --prefix "$compat_after" run build
# 確認済み公開metadataをfixtureとして含める場合だけ、両出力へ同じ実入力をコピーする。
# cp "$compat_published_metadata" "$compat_before/dist/release-metadata.json"
# cp "$compat_published_metadata" "$compat_after/dist/release-metadata.json"
ABC_COMPAT_BASE_REF="$compat_base_sha" ABC_COMPAT_OLD_DIST="$compat_before/dist" ABC_COMPAT_NEW_DIST="$compat_after/dist" npm test -- tests/integration/full-public-projection.test.ts tests/unit/textbook-order.test.ts tests/integration/internal-links.test.ts
npm test -- tests/unit/learning-record-timestamp.test.ts tests/unit/learning-record-store.test.ts tests/integration/learning-record-backup.test.ts
npm --prefix "$compat_after" run link:check:built
ABC_COMPAT_OLD_DIST="$compat_before/dist" npm --prefix "$compat_after" run test:e2e:built -- --project=chromium tests/e2e/full-projection.spec.ts tests/e2e/learning-records.spec.ts
rm -rf "$compat_before" "$compat_after"
```

buildが失敗したらそこで止め、残った古い出力を比較しない。旧/newは同じorigin/base
pathでbuildする。`ABC_COMPAT_OLD_DIST`未指定時は実build間の集合比較だけskipされ、使い捨てHTMLでの削除検出テストと通常のE2Eは実行される。指定したディレクトリが欠落・不完全なら失敗する。integrationの新版は`ABC_COMPAT_NEW_DIST`（省略時は作業ツリーの`dist`）、E2Eの新版はpreviewが配信する同じ`dist`を使う。E2Eでは旧出力にあった全URLのHTTP応答とanchorも確認する。

学習記録は使い捨てcontextで120件の旧DB version
1とbackup、未知/取消ID、独立日時とoffset、reload、複数タブ、保存失敗、既存値の上書き途中での復元失敗を確認する。値・日時の一致まで検査し、件数だけを成功条件にしない。DB識別とbackup形式・保存実装は変更しない。

比較元SHA、確認した公開metadataのSHA、既存Actionsの正常runと検出対象・時間はPR本文へ一度まとめる。CI時間の比較境界は、必須jobの最初の依存準備（Node
setup）開始から最後の必須検証完了までのwall
timeとする。並列jobの時間を加算せず、queue、checkout、検証後のartifact保存・cleanup、deployを除く。run/job全体の時間は別記する。非公開文書のみで旧検査をskipしたrunと全検証runを比較しない。既存ログの時刻精度や取得不足を明記し、5回の中央値や短縮率を未観測のまま達成済みと扱わない。

## 5. 標準Pagesで公開する

mainへのpushで`CI`の`Verify (release baseline)`が必要な検証を実行する。同runで一度buildした`dist`を`configure-pages`→`upload-pages-artifact`へ渡し、成功したbaselineに`needs`で依存する`Deploy GitHub Pages`が同じartifactを配信する。deploy
jobは配信直前に標準GitHub
APIで現在のmainのSHAを取得し、runのSHAと一致する場合だけ配信する。不一致・取得失敗は停止する。checkout・再検証・再buildは行わない。PRはcandidateの検証だけで、upload/deployしない。

2026-10-09に公式READMEとreleaseの入力を確認し、`configure-pages@v6`、`upload-pages-artifact@v5`、`deploy-pages@v5`を採用した。標準権限と`github-pages`
environment、origin/base pathを維持する。実environmentはprotected
branch限定で、必須reviewer設定はなかった。設定例だけで実設定変更を報告しない。

- [configure-pages](https://github.com/actions/configure-pages)、[upload-pages-artifact](https://github.com/actions/upload-pages-artifact)、[deploy-pages](https://github.com/actions/deploy-pages)

workflowは実runの`created_at`をAPIから取得して`ABC_TEXTBOOK_RUN_CREATED_AT`へ渡す。Actions内では`GITHUB_REPOSITORY`、正整数`GITHUB_RUN_ID`、checkoutと一致する`GITHUB_SHA`も必須。取得失敗・欠落・不正時は停止し、現在日付やローカル版にfallbackしない。版はrun作成日のUTC日付とrun
IDによる`YYYY.MM.DD-r<run_id>`。日を跨ぐ同run再実行でも同版、別run/revertは別版になる。

最後の成功した`github-pages`
deploymentのSHAとの差を、push直前との差へ合流して検査する。同run自身の配信を比較元から外し、再実行の概要を保つ。配信履歴の取得・Git差分が不明なら広い通常検査を行い、metadataの訂正影響範囲も全収録問題へ保守的に広げる。差分不明を教材変更0件や履歴だけの配信として記録しない。非公開文書だけでも未配信の教材変更があれば検査・配信し、実際に非公開文書しか差がなければ配信しない。

履歴indexと非公開運用文書だけの差分は、履歴・metadataの対象テスト、build、リンク確認を行って配信する。教材の追加・訂正・削除・taxonomy差分集合は空、cutoff/収録範囲は不変。その配信自体の履歴追記は要求しない。`/updates/`の公開後に記録した履歴と最新metadataを区別し、candidateをpublished
entry/pageへ登録しない。実indexの追記とwriter切替は後続PR-07b/07cに残る。

通常のローカルbuildはrun入力を要求せず、履歴末尾の版、空indexなら`docs/verification/releases/catalog.json`の`release.version`識別子だけを使う。基準版不足は失敗。正本から`publicationStatus: prepared`のcandidateを作り、旧snapshot/review/check結果を流用せず、metadataを生成・コピーしない。build終了時に古いmetadataも除去する。ローカルcandidateを配信済み版のartifactとしてupload・履歴登録しない。

公開確認ではPages/Actionsの成功と、配信した`/data/catalog.json`・`/release-metadata.json`の版、SHA、run
URLを照合し、代表問題・単元・検索・要復習・設定・過去履歴を開く。metadataの存在だけで成功としない。artifact名にはSHA/run/attemptを含め、検証済みの同一成果物だけを配信する。標準artifactは7日保持し、成功後の同じ作業内で後続履歴用の両JSONを取得する。

## 6. 失敗時に復旧する

| 状態                                                 | 対応                                                                                                                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 配信前のschema・型・テスト・build・リンク失敗/cancel | upload/deployへ進まない。変更箇所を修正して必要な検査を再実行する。                                                                                              |
| 標準Pages配信失敗                                    | Actions/Pagesの失敗を確認し、旧正常版を維持する。公開完了と報告しない。                                                                                          |
| 配信成功後の導線確認失敗                             | 「配信済み・確認未完了」と報告し、修正またはGit revertへ進む。                                                                                                   |
| 同SHA/runの再実行                                    | 現在のmainを対象にする。同じ版の検証済みartifactがあればdeploy jobを再実行し、消失・期限切れならbaselineから同SHA/runで再検証・buildする。新版へ採番し直さない。 |
| 公開後の不具合                                       | 不具合PRをGit revertし、新main SHA・新runの別版を同じCI/Pages経路で配信する。旧版への上書きや履歴削除で成功扱いにしない。                                        |

artifact名はbuildしたattemptごとに付け、baselineのstep/job outputをdeployへ渡す。deploy
jobだけの再実行でも保存した同じ名前を使い、配信直前のmain
SHA確認を再実行する。一致する場合だけ元artifactを配信し、期限切れ等で見つからなければbaselineを含む全jobを再実行する。mainが先へ進んでいたら古いrunの配信を停止し、現在のmainのrunを使う。旧状態へ戻す必要があればGit
revertの新runを使う。API取得失敗は接続を確認して再実行する。upload前の照合成功だけでdeploy単独再実行の配信可否を判断しない。production全体は旧復旧workflowと同じconcurrency
groupで直列化し、進行中の配信を後続pushでcancelしない。

標準経路の初回成功までは`production-deploy.yml`を旧版専用の手動復旧入口として保持する。通常経路から独自API/pollとrelease再検証/rebuildを外し、標準deploy成功後は旧手動入口が使用を拒否する。trigger自体の撤去はPR-07bで行う。復旧でもorigin/base、DB識別・値・独立日時、追加IDの記録を保持する。本番を故意に壊す試験はせず、既存失敗runと使い捨てfixtureで失敗の区別を確認する。

PR-07aのコードとfixture検証、実environmentの読戻しは実施した。依頼がPR作成までのため、新workflowの実main配信・公開確認はmerge後のT037として未実施。fixture成功を実配信成功に数えず、SC-004の実教材訂正/追加公開も未達とする。

## 既存実装からの移行

以下は各移行PRで確認した現行実装と、後続へ残る差である。後続の実装変更はこの欄を出発点にし、変更後の手順へ同時に更新する。新しい承認制度や証跡台帳を移行のために作らない。

### 公開loaderの移行（002 / PR-04）

公開projectionはstructured
rootsの現行JSONと執筆済みMarkdownを読む。Unitはmetadataの`docPath`、Problemは正本の`src/content/docs/problems/`を走査し、本文frontmatterの`authoringUnit.docPath`・Problem
ID・実pathの一致とmetadata全件の対応を確認する。本文やtaxonomyを再生成しない。Unitの`draft: false`とProblemの`draft: true`は既存parserの表現として維持する。

`learning-unit-content.json`、`problem-authoring-units.json`、`us1.json`、`problem-content-projection.json`の必須読込と受理済みbytes・mappingの照合を外した。欠落・重複・未完成の本文、未検証claim・本文とclaimの矛盾、未知source・公式task不一致、出典リンク、主配置・関連先・前提DAG、metrics、教科書順と訂正先の確認は残す。旧previewの例・演習の既知のoptional
locatorだけは、現行本文にも該当blockがない場合に対象外とし、それ以外の欠落は失敗する。

Problem・Unitとも、実行例は既存の`examples`で`verificationStatus: passed`を要求する。実行言語を付けた各fenced
code blockには、同じ`language`の実行例を一件ずつ登録する。Unitの例情報はUnit
metadata、Problemの例情報は本文frontmatterに置く。環境・入力・実行手順・期待結果を記し、コードを実行してから成功を記録する。非実行の擬似コード・図・数式は`pseudo`、`pseudocode`、`text`、`plaintext`、`math`で明示する。未登録・未検証・失敗した実行コードは公開projectionで拒否し、旧digest台帳の再生成で代用しない。

build後の現行projection検査は同じ`dist`を使う。

```sh
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run corpus:verify-full-projections
ABC_COMPAT_NEW_DIST="$PWD/dist" SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm test -- tests/integration/full-public-projection.test.ts
```

`--check`は旧`us4/full-projections.json`を読まず、正本とのcatalog一致、公開route、タグの発動条件・Outcome・問題導線、Contestのタグ配置、sitemap・feed・Pagefindを検査する。検査だけでは報告ファイルを書かない。`ABC_COMPAT_NEW_DIST`指定時は、旧台帳のない一時copyでCLIの成功とstale
catalog・欠落page・発動条件欠落の拒否も確認する。旧監査consumer向けの明示的な`--write`・`--write-evidence`と台帳ファイル自体はまだ保持し、通常更新でその再生成を要求しない。

通常サイトbuildはPR-07aで旧prepared
snapshot/inventory照合を外し、現行正本からcandidateを生成する。旧catalog CLI・release/deploy
consumerが読む入力は保持し、明示した旧照合の失敗を無視しない。一時コピーでの訂正build成功と実訂正公開・SC-004の達成は区別する。

旧seed release
consumerは初版bootstrapの`sourceSetFingerprint`も読むため、その経路内だけで旧受入subjectと現行本文から当時のprojection
digest形式を再構成する。現行digestも受理するが、不明なfingerprintや本文・metadataの変更は引き続き拒否する。公開loaderの台帳読込を復活させず、旧bootstrap・台帳・公開catalogの値を書き換えない。この互換経路は旧consumerの整理まで保持する。

復旧はloaderと検査CLIの変更をrevertする。旧台帳・教材・prepared
catalogは保持しているため、旧経路へ戻せる。

### 執筆skillと本文readerの移行（002 / PR-06）

[`abc-explanation-author`](../../.agents/skills/abc-explanation-author/SKILL.md)は公式根拠と完全解説の品質を確認する。通常入力は`validateAuthoringInput(input)`、未執筆の準備は`prepareExplanationAuthoring(input)`、完成草案は`validateAuthoringOutput(unit, input)`を使う。出力のProblem・学習成果・baseline・前提・Tag・placementとclaim根拠を入力へ照合する。Source
Revisionのschema・fingerprint・task
identity・確認日時は正本の検証を継続し、公式解説indexを問題個別の根拠にしない。

本文frontmatterの`authoringUnit.skill`と入力packetの`skill`は任意。旧欄があればname/version/digestを型検証してそのまま読み、現在のskill
version/digestとの一致を要求しない。旧`ProblemAuthoringDetails.reviewMode`は`self`/`third_party`として読めるが、承認要件を発生させない。既存868本文とsourceを一括変換したり、旧digestを現在の値へ補正したりしない。`prepareAuthoringResults`はskillを省略でき、省略時にはskill
version/digestの結果欄を生成しない。

`examples`/`exercises`は不要なら`[]`。必要な例・反例は本文の該当箇所へ組み込む。コードや演習を置いた場合だけ、既存の環境・入力・手順・期待結果・実行先・学習成果と検証結果の契約を満たす。掲載した実行可能コードは実行し、失敗・未検証の結果を完成草案へ含めない。

full本文の着想、状態・保持する量、初期化・遷移・操作順・答えの取り出し方、証明、境界、前処理を含む全体計算量をCodexが確認する。必須節・時間/空間評価の欠落、空白だけの原稿、本文のない小見出しは対象fieldと理由を持つ診断で保留する。構造検証だけで状態や論証の十分性を保証せず、公式根拠との照合・検算・文章確認を行う。訂正では変更前後の主配置・関連先・前提と現存blockを`enumerateCorrectionImpacts`/`verifyCanonicalCorrectionTargets`で確認し、存在しない演習や新しい証跡の作成を要求しない。

`similar`/`supplement`は参照元が既存の`full`解説であることを公開loaderで確認する。差分には対象問題の検証済みSource
Revisionを持つclaimを置き、そのtextを`sections.differences`へ一致させる。`full`の`correctness`
claimと正当性節の照合は維持する。短縮解説の公開本文の冒頭には`primaryProblemId`から参照元のIDと内部リンクを生成し、共通の成立条件・証明・全体計算量へ戻れるようにする。両短縮形式の変更ではreaderの往復変換に加え、`tests/integration/full-public-projection.test.ts`で公開loader、差分と根拠の不一致・未検証claim・対象外source・参照元の拒否、本番base
path付きHTMLの導線を確認する。形式を変える訂正では本文の訂正先も`full`の`sections.reasoning`から短縮形式の`sections.differences`へ更新し、現存する節に解決することを確認する。本文surfaceのschemaは両節を受理するが、公開loaderは欠落した節を拒否する。分類の可否は学習成果・前提・手法・証明・漸近計算量の比較で判断し、同じTagだけを理由に短縮しない。

初版shardとpreviewの互換readerは、過去manifestに記録されたartifact subjectと当時のsource
packetの内部整合を確認する。現在のskill文書を当時のartifact
digestへ固定せず、868本文の旧subjectを保持する。旧`corpus:author-problem-shards`は初版専用のmanifest/review出力を残すため、通常執筆では使わない。初版の明示的な`corpus:verify-authoring`は旧bundleを再照合する監査専用経路として残るため、当時のGit版で実行する。現行skillの改訂後に、旧証跡のdigestだけを更新して通さない。旧release/deployやprepared版の照合はPR-07以降まで残り、今回の移行だけで実教材訂正の公開完了とは扱わない。

復旧は新形式の利用側の依存順を確認してskillとconsumerをまとめてrevertする。既存本文・source・旧証跡は保持している。

### catalog CLIの移行（002 / PR-05）

通常の生成・検証では`--evidence-inventory`を省略できる。リポジトリrootから、正本と一致するcatalog
JSONを入力する。入力のschema・ID・参照・出典とclaim・配置を検査し、正本loaderで本文・主配置・関連先・Tag/Outcome/Unitの3DAGと読書順を検証したprojectionと照合する。inventory全体のvalidatorをskipする経路ではなく、内容の意味検証と旧release証跡の照合を分離した。

```sh
npm run catalog:validate -- --input docs/verification/releases/catalog.json
mkdir -p build
npm run catalog:build -- --input docs/verification/releases/catalog.json --output build/validated-catalog.json
```

入力catalogはrepository内のstaging以外に置く。訂正を試す場合は、正本の一時コピーをrootとして`loadFullPublicProjection({ usePreparedRelease: false })`の`catalog`をJSONへ保存し、同じrootでCLIを実行する。入力JSONの本文だけ変更すると`CATALOG_CANONICAL_DRIFT`で失敗する。通常経路はGitのprotected
base、新規manifest/review/check結果を要求しない。旧任意欄がある入力は型を検査して値を保持し、`contentSnapshotDigest`があれば内容との一致も検査する。`prepared`も検証可能だが、CLI成功は配信成功を表さない。

未知・重複・値欠落の引数はexit 64、schema・意味・正本不整合はexit 2、読み書き等の実行失敗はexit
70。buildは既存outputを`wx`で拒否し、失敗時も既存bytesを保持する。

旧`--evidence-inventory PATH`は、PR-07の公開consumer移行後、PR-10で旧release/deploy
consumerを整理するまで互換引数として残す。指定時は旧manifest・protected-base差分・inventory全体・check/review・実行例証跡の従来の検証を行う。旧入力を黙って無視せず、不正・欠落・staleを拒否する。旧`buildCatalog`/`validateCatalogSemantics`はrelease
gateを維持し、通常CLIは`buildCanonicalCatalog`の内容検証と正本projection照合を使う。

新しい訂正の影響検査では`enumerateCorrectionImpacts`へ現行`catalog`と変更前の`previousCatalog`、source/claimの変更対象、問題ID、変更前後の前提policyを渡す。`verifyCanonicalCorrectionTargets`の`scope`へ同じ範囲を渡し、変更前後の主配置・関連Unit・Outcome
owner・追加前提Unit・直接前提の隣接Unitと現存block、配置・前提policy・再生成indexの確認漏れを検出する。返値はメモリー上の検査結果であり、証跡登録や別台帳の保存は不要。既存の履歴locatorは従来どおり実対象へ解決し、過去の訂正記録を書き換えない。

旧release/deploy
consumerと台帳は削除していない。通常サイトbuildの旧prepared版照合はPR-07aで外したが、CLI移行だけで実教材訂正の公開・SC-004達成とは扱わない。復旧はCLIとvalidatorの変更をrevertし、保持した旧inputとinventory指定を使う。

002の分析後に、[公開互換契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#新版の採番と再実行)へ採番・再実行・履歴入力を具体化した。PR-03でschemaと履歴readerの互換拡張を実装した。catalog/metadataと`baseReleaseVersion`は旧日付版と`YYYY.MM.DD-r<run_id>`を受理し、backupの`catalogVersionAtExport`は1桁の日など従来の受理値と新版を読める。catalog
`3.0.0`、metadata/backup
`1.0.0`、DB識別、記録値・独立日時は維持する。採番・標準deployはPR-07aで実装した。実main成功の確認とwriter切替・新形式の履歴追記は後続へ残る。

旧catalog・metadata・履歴entryの値は補完・変換せず保持する。review参照、manifest/content
inventory/snapshot
digest、validationSummaryは新規入力で省略でき、存在する場合は従来の型・整合性・初版agent参照の対象制限を検証する。Source
Revisionのfingerprint、registry
digest、metadataの必須fieldはそのまま維持する。省略した証跡を成功件数・digest・時刻や空のreview欄で埋めない。

履歴readerは入力された公開順序を保持し、同SHAの別runを別版として扱う。重複版、既存entryのSHA・範囲・概要・値・順序の書換え、未知Git
commitは拒否する。旧`release:history`は従来どおり当時のGit
catalogを読み、prepared版にはhostの確認を要求する。新版artifactを実配信成功後に追記するwriterは後続PRで移行する。旧catalog/deploy/初版検査のconsumerは引き続き証跡を要求し、今回のschema拡張だけで証跡なしの教材更新・公開が完成したとは扱わない。

新版履歴は実配信した同じbuild
artifactのcatalog/metadataと標準Pages/Actionsの成功から追記する。artifact取得不能時の同版公開JSONの照合と追記保留、履歴だけの変更も検証・配信した後はその配信自体の履歴追記を要求しない条件は[履歴入力契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#配信後の履歴入力と履歴だけの配信)を参照する。各consumerとworkflowを移行するPRで、この設計を確認済みの現行手順へ置き換える。教材内容の変更は禁止したまま一時コピーで経路を検証し、実訂正・1
Contest追加のSC-004受入は別依頼まで未達とする。

002の公開移行はPR-07a（標準配信導入）→PR-07b（履歴writerと旧trigger切替の通常配信）→PR-07c（両先行版の成功確認後、indexと非公開運用文書だけを追記・配信）へ分ける。writer/workflow変更を履歴だけの配信へ混在させない。両版の実入力は標準artifactまたは同じ作業内の一時領域で確保し、取得不能な版の追記は保留する。

PR-07aで[ローカルbuildとActionsの入力契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#ローカルbuildとactionsの入力)を実装した。現在のコマンド、metadata生成、失敗/再実行は上の「標準Pagesで公開する」「失敗時に復旧する」を参照する。旧履歴writerと復旧専用consumerはまだ残る。

| 対象                                                                                                                                  | 移行する内容                                                                                                  | 保持・確認するもの                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`、`initial-release-audit.yml`                                                                               | 通常CIは単一環境の変更選択へ移行済み。初版監査は手動のみ                                                      | 削除する検査の検出範囲、残る回帰検査、Actionsの実行時間比較                                   |
| `.github/workflows/production-deploy.yml`、required checks、`docs/operations/protected-main.json`                                     | check名と実required設定はbaselineへ統一済み。標準Pages配信をPR-07aで実装。実main成功確認と旧trigger撤去は後続 | origin・base path・配信導線、実際のcheck/deploy成功。ローカルJSONだけでGitHub設定済みとしない |
| `scripts/verify-release.ts`、`scripts/review-update.ts`、`scripts/release/`、`src/lib/domain/schema-parts/review-evidence.ts`と利用側 | 人間review・manifest・digest連鎖の依存を減らし、通常更新をCodexで完結させる                                   | 出典・ID・参照・本文品質の検証、既存catalogと公開metadataの互換性                             |
| `docs/work-manifests/`、`docs/reviews/`、`docs/verification/`の既存成果                                                               | 消費する処理を先に移行し、参照不要になった生成物だけ整理する                                                  | 参照済み出典と公開履歴。過去の判断を改変して成功扱いしない                                    |
| `.agents/skills/abc-explanation-author/`、`specs/001-build-abc-textbook/`の設計・契約                                                 | 通常執筆の移行済み契約を維持し、残る初版専用consumerを整理する                                                | 解説の品質・公式根拠・入出力整合。既存契約の検証を黙って迂回しない                            |
| live新規問題追加・catch-up                                                                                                            | 公開済みbaseからの小batch追加手順を実装後に確定する                                                           | 既存本文・配置・記録。初回専用fixtureの成功をlive機能完成に数えない                           |

通常更新のCIは単一の基準環境を基本とし、変更に必要なschema・テスト・buildを残す。追加・維持する検査ごとに検出する不具合と実行時間を評価する。約20分かかる現状からの短縮は、後続変更のActions実測で確認する。憲章と文書の改訂だけでCI短縮やlive更新機能の完成を報告しない。
