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

既存の一括執筆・取得CLIを使う場合だけ、その入出力契約と詳細手順を読む。旧skillのmanifest/digestやreview
modeは現在の実装依存であり、新しい通常更新への恒久的な承認義務ではない。これらを撤去する実装変更は「既存実装からの移行」に従う。

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

現在の`verify:fast`は名称にかかわらず広範囲の検証であり、3ブラウザーも含む。GitHub
Actionsは、非公開文書だけの追加・修正を除いて旧release/reviewゲートと複数環境をまだ実行する。非公開文書の限定的なCI移行では5つのrequired
check名を維持し、各job内で変更文書の書式・ローカルリンク・見出し参照とfeature選択を確認する。対象はAGENTS、README、Spec
Kitの憲章・テンプレート・feature選択、`docs/operations/`と`specs/`のMarkdown。PRのmerge-baseまたはmain
push前のSHAとの差を使い、削除・rename・未知path・差分取得不能、教材・コード・schema・skill・workflowを含む変更は従来の全検証へ戻す。文書検査の失敗はcheck
failureとして伝播する。詳細は[開発手順](development.md#非公開文書のci検証)を参照する。単一環境化と通常教材更新の旧証跡依存の撤去は未実装であり、ローカルの対象検証だけで現行のCIゲートが解除されたと扱わない。

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

現行の`release-metadata.json`は`production-deploy.yml`がbuild後にコピーする。全配信URLを比較するときはその工程も含む出力を使う。PR-01の教材不変の試験では、確認済みの公開metadataを一時領域で両出力へコピーし、既存metadataのURLとschemaの保持を検証できる。これは過去の公開JSONを使うfixtureであり、新しいSHAの配信や検証成功を示さない。取得できなければmetadataを含む実比較は未実施と報告し、使い捨てHTML/JSONでの欠落検出と区別する。

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

## 5. 結果を記録し、必要なら公開する

変更概要、実行した検証と結果、未解決事項をPR本文または完了報告へまとめる。Git履歴、Actionsのログ・check結果、Pagesの公開履歴を一次記録として使う。通常更新用の別review
evidence、work manifest、digest台帳は追加しない。参照される公式Source
Revisionや既存公開データは、移行前に削除しない。秘密情報や私的な学習記録をcommitしない。

公開を含む依頼では、現行のrequired checksを満たした変更をmergeし、GitHub ActionsとGitHub
Pagesで公開する。別の人間承認は求めない。公開成功の状態と代表ページ・検索・関連導線を確認する。未実行のmerge・deployは報告で区別する。

現在の公開先は`https://fu-l.github.io/abc-textbook/`。
`SITE_URL=https://fu-l.github.io`、`BASE_PATH=/abc-textbook`を維持する。現行workflowの詳細と初版の実績は[初版公開runbook](initial-release-runbook.md)を参照する。独自の証跡依存が残る公開処理を、文書だけで置換済みとは扱わない。人間承認を要求する旧記述は新規作業の方針として無効だが、実際の検証器が通らない場合は具体的な依存を修正する作業として扱う。架空の人間ID・承認やcheck成功を作らない。

## 6. 失敗時に復旧する

build・検証失敗は変更箇所を修正し、必要な検査だけ再実行する。deployが失敗したらActions・Pagesの状態を確認し、同じ検証済みcommitのjobを再実行する。配信成功と事後検査の失敗を区別し、公開済みと推測しない。公開後に不具合があれば、標準のGit
revertと既存Pages手順による再公開を優先する。revertが教材追加や学習記録互換性へ与える影響を確認する。現在のworkflowの旧版再配信には既知の公開commitなどの制約があるため、runbookを読む。originを変更する必要がある場合は旧originでのexportと新originでのimportを先に定める。

## 既存実装からの移行

以下は憲章改訂後も残る実装との差であり、今回の文書変更では撤去しない。後続の実装変更はこの欄を出発点にし、変更後の手順へ同時に更新する。新しい承認制度や証跡台帳を移行のために作らない。

002の分析後に、[公開互換契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#新版の採番と再実行)へ採番・再実行・履歴入力を具体化した。これは未実装の移行設計であり、現行CLI/schemaへ新版を投入する手順ではない。実装時は旧日付版/URLを保持して`YYYY.MM.DD-r<run_id>`を受理し、backupの`catalogVersionAtExport`も旧受理値を残して拡張する。DB識別、backupのfield/schemaVersion、記録値・日時は変えない。

新版履歴は実配信した同じbuild
artifactのcatalog/metadataと標準Pages/Actionsの成功から追記する。artifact取得不能時の同版公開JSONの照合と追記保留、履歴だけの変更も検証・配信した後はその配信自体の履歴追記を要求しない条件は[履歴入力契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#配信後の履歴入力と履歴だけの配信)を参照する。各consumerとworkflowを移行するPRで、この設計を確認済みの現行手順へ置き換える。教材内容の変更は禁止したまま一時コピーで経路を検証し、実訂正・1
Contest追加のSC-004受入は別依頼まで未達とする。

002の公開移行はPR-07a（標準配信導入）→PR-07b（履歴writerと旧trigger切替の通常配信）→PR-07c（両先行版の成功確認後、indexと非公開運用文書だけを追記・配信）へ分ける。writer/workflow変更を履歴だけの配信へ混在させない。両版の実入力は標準artifactまたは同じ作業内の一時領域で確保し、取得不能な版の追記は保留する。

PR-07a以降の[ローカルbuild入力設計](../../specs/002-simplify-maintenance/contracts/compatibility.md#ローカルbuildとactionsの入力)では、Actions外は既存の基準版で未公開candidateをbuildし、metadataを生成しない。Actions内は実runの作成日時・ID・SHAを検証し、入力不足を失敗とする。これも未実装の移行設計であり、現在のbuildやschemaに新版採番や新しい環境変数が対応済みとは扱わない。実装PRで対象回帰を確認して、この欄と現在のコマンド説明を同時に更新する。

| 対象                                                                                                                                  | 移行する内容                                                                         | 保持・確認するもの                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`、`initial-release-audit.yml`                                                                               | 複数環境・重複release/review・毎回の全件監査を整理し、schemaと対象テストを中心にする | 削除する検査の検出範囲、残る回帰検査、Actionsの実行時間比較                                   |
| `.github/workflows/production-deploy.yml`、required checks、`docs/operations/protected-main.json`                                     | check名の依存を揃え、標準Pages build/upload/deployへ寄せる                           | origin・base path・配信導線、実際のcheck/deploy成功。ローカルJSONだけでGitHub設定済みとしない |
| `scripts/verify-release.ts`、`scripts/review-update.ts`、`scripts/release/`、`src/lib/domain/schema-parts/review-evidence.ts`と利用側 | 人間review・manifest・digest連鎖の依存を減らし、通常更新をCodexで完結させる          | 出典・ID・参照・本文品質の検証、既存catalogと公開metadataの互換性                             |
| `docs/work-manifests/`、`docs/reviews/`、`docs/verification/`の既存成果                                                               | 消費する処理を先に移行し、参照不要になった生成物だけ整理する                         | 参照済み出典と公開履歴。過去の判断を改変して成功扱いしない                                    |
| `.agents/skills/abc-explanation-author/`、`specs/001-build-abc-textbook/`の設計・契約                                                 | 旧review modeとskill digest前提を利用側と一緒に見直す                                | 解説の品質・公式根拠・入出力整合。既存契約の検証を黙って迂回しない                            |
| live新規問題追加・catch-up                                                                                                            | 公開済みbaseからの小batch追加手順を実装後に確定する                                  | 既存本文・配置・記録。初回専用fixtureの成功をlive機能完成に数えない                           |

通常更新のCIは単一の基準環境を基本とし、変更に必要なschema・テスト・buildを残す。追加・維持する検査ごとに検出する不具合と実行時間を評価する。約20分かかる現状からの短縮は、後続変更のActions実測で確認する。憲章と文書の改訂だけでCI短縮やlive更新機能の完成を報告しない。
