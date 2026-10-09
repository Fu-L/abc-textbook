# Compatibility Contract: 既存の公開・保存・更新入口を維持する

この契約は移行後の条件を定義する。段階ごとの実装状況はtasksと更新マニュアルを参照し、未移行のworkflow等を実装済みとは扱わない。既存schemaの複写や新しいAPIは作らない。

## 公開URLと本文

- origin `https://fu-l.github.io`、base `/abc-textbook`、trailing slashを保持する。
- 既存の全問題・単元・タグ・Contest・検索・要復習・設定・更新履歴URLと本文anchorを解決できる。
- `/data/catalog.json`、`/release-metadata.json`、`/feed.xml`、`/sitemap.xml`の既存URLを維持する。
- `/updates/`と過去の`/updates/{version}/`を残し、当時の公開情報と出典へ到達できる。
- 新版の履歴index反映前は、更新一覧から最新metadataと標準公開履歴へ案内する。事前に未配信版のpublishedページを作らない。

route組立は既存`ui-catalog.ts`、`build-learning-path.ts`、各`src/pages/`を使う。全URLとanchorの保持はPR-01の一時比較で、内部リンク切れは既存validatorで検出する。リンク元とリンク先を一緒に消すと内部リンク検査だけでは検出できないため、移行前後の集合比較も必要。

## 公開JSON・出典

既存catalog/metadata/historyの読込を継続する。教材entityの識別・参照・公開routeは変えない。新規出力に旧review・work
manifest・結果digestの作成を要求しないが、旧入力の欄は意味と値を保持する。公式Source
Revision、fingerprint、task
identity、本文claimの根拠は残す。互換読込のschema変更は同じPRで生成schema・Zod意味検証・利用側・テストへ反映する。日付versionの既存URLは使い回して別公開へ上書きせず、衝突を検出する。

`ReleaseMetadataSchema`の既存必須fieldは維持する:
`schemaVersion`、`version`、`cutoffAt`、`commit`、`validationResultsUrl`、`changeSummary`。
`commit`は対象buildのSHA、run
URLはその検証/buildへ到達するURLとする。実配信の成功はPages/Actionsで確認し、metadataの存在だけで成功と判定しない。

### 新版の採番と再実行

- 旧版の`YYYY.MM.DD`とそのURLは変更しない。移行後の新版は`YYYY.MM.DD-r<run_id>`（例:
  `2026.10.08-r123456789`）とする。日付はActions
  runの`created_at`のUTC日付、接尾辞はそのrunの正整数IDとし、attempt番号や再実行時の現在日付は使わない。
- 同じrun/SHAの再実行は同じ版、別runまたはGit
  revert後の新SHAの配信は新しいrunの別版となる。同日中も衝突せず、旧版へ別SHAを割り当てない。同じ版に異なるSHA・収録範囲・変更概要が指定されたら拒否する。
- catalog、metadata、履歴、`baseReleaseVersion`とrouteの利用側をこの版に対応させる。履歴は版文字列の辞書順で並べ替えず、既存entryの順序を維持して実配信成功順に追記する。同じSHAの別runは別版として扱える。
- backupのfield・`schemaVersion: 1.0.0`・記録の値と日時は変えない。`catalogVersionAtExport`は従来受理した日付文字列（1桁の日を含む）を保ち、新版文字列も受理するようschemaと生成contractだけを拡張する。旧backupの書換えやDB
  migrationは行わない。

`run_id`が再実行で変わらないことは[GitHub公式の変数リファレンス](https://docs.github.com/en/actions/reference/workflows-and-actions/variables)で確認した（2026-10-08）。上の採番はこのプロジェクトの設計判断であり、現行schemaへはまだ実装していない。

### ローカルbuildとActionsの入力

PR-07aで導入するbuildの入力は次のように分ける。現行CLIの新しい引数を、この文書変更だけで利用可能にしたとは扱わない。

- **Actions内のbuild**:
  `GITHUB_REPOSITORY`、`GITHUB_RUN_ID`、`GITHUB_SHA`と、そのrunの`created_at`を必要とする。workflowが実runから取得した作成日時を`ABC_TEXTBOOK_RUN_CREATED_AT`で既存の公開設定へ渡す。日付・正整数ID・checkoutしたSHAとの一致を検証し、catalogとmetadataを同じ入力で作る。PRでも未公開candidateとして同じ採番を使うが、upload/deployと履歴追記の対象にはしない。Actions内で入力が欠落・不正・取得不能ならbuildを失敗させ、ローカル用の値へ切り替えない。
- **Actions外のローカルbuild**:
  `SITE_URL`と`BASE_PATH`だけの既存コマンドで動作する。版は`src/content/indexes/release-history.json`末尾のversionを使い、indexが空なら既存の基準catalog
  `docs/verification/releases/catalog.json`の`release.version`識別子だけを読む。現在日付や架空のrun
  IDから新版を採番しない。基準版も読めなければ不足する入力を示して失敗する。変更した教材から作るcatalogは`publicationStatus: prepared`とし、基準版のsnapshot・旧検証結果をそのまま流用しない。
- ローカル出力には`/release-metadata.json`を生成・コピーしない。build前の古い出力が混ざらないようにし、更新一覧はmetadataがない場合も既存履歴を表示できるようにする。build・内部リンク・検索・記録E2Eはこの出力で行う。ローカルcandidateを同じ版の実配信物として上書き・upload・履歴登録してはならない。
- metadataや履歴writerの単体テストには使い捨ての明示的なrun入力を渡せる。fixtureであることを示し、テスト結果を実Pages/Actions成功の根拠にしない。ローカルで実配信済み版を履歴へ追記するときは、以下の実artifact/公開JSONと実成功確認を使う。

### 配信後の履歴入力と履歴だけの配信

新版の履歴writerは、成功したPages配信のrun/SHAを標準Actions/Pagesで確認してから、**そのrunが実際に配信した同じbuild
artifact**内の`data/catalog.json`と`release-metadata.json`を読む。両schema、版、metadataのSHA/run
URL、収録範囲・変更概要の一致を検証する。新版ではGit内の旧`docs/verification/releases/catalog.json`を代用しない。旧entryは既存indexの値を保持し、旧版を読む場合だけ当時のGit
catalogを利用する。

artifactが取得できなければ、現在配信中の両公開JSONが対象の版/SHA/runと一致し、実配信成功も確認できる場合に限り同じ入力として使える。別版のJSON、現在の正本からの再生成、schema通過だけで過去の成功を補完しない。どちらの入力も取得できなければ履歴追記のみ保留し、配信済みの事実と追記未完了を区別して報告する。標準artifactには保存期限があるため、成功後の同じ作業内で追記する（[GitHub公式のartifact取得手順](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts)、確認日2026-10-08）。専用の永続catalog保管庫や証跡artifactを増やさない。

同版/SHA・範囲・変更概要の確認済みentryが既にあれば追記は差分0とし、当時の値を上書きしない。不一致、未知commit、未配信、失敗候補は拒否する。

初回移行はPR-07a（標準配信導入）→PR-07b（履歴writerと旧trigger切替）→PR-07c（成功済み版のindex追記）の順とする。PR-07bはコード・workflow変更を含む通常配信であり、indexを変更しない。PR-07aとPR-07bの成功済み版の入力を標準artifactから取得できるようにし、必要なら同じ作業内の一時領域へ保存する。PR-07cで両版を実配信成功順に追記し、コード・workflow変更を混在させない。取得不能な版は上記の条件で追記を保留し、履歴移行を完了扱いにしない。

履歴追記は公開出力の変更としてbuild・内部リンク・対象履歴テストを行い、mainから同じ検証済みartifactを配信する。**最後の成功配信SHAとの差が既存履歴indexと非公開運用文書だけ**の場合を「履歴だけの配信」とする。未配信の教材・UI・設定変更を含む場合や判定不能の場合は通常公開として必要な検証を行う。

履歴だけの配信も新しいrunの別版を使い、metadataのSHA/runは実buildを示す。教材の追加・訂正・削除・taxonomyの差分集合は空とし、既存catalogの教材部分とcutoff・収録範囲を保持する。その配信の成功・失敗は標準Pages/Actionsに残し、**その配信自体のindex追記は要求しない**。これにより履歴追記の連鎖を止める。更新一覧ではindexに載る教材・表示等の公開履歴とmetadataが示す最新配信を区別する。履歴以外も変える配信はこの例外に含めない。

## 学習記録とbackup

[data-model.md](../data-model.md#learningrecord--backup変更なし)のDB識別・field・独立日時・backup形式を変えない。記録と公開catalogをProblem
IDでjoinし、unknown/orphanの値と日時を保持する。reload、旧DB読込、100件以上のexport/import、未知ID、取消/競合、複数タブ・保存失敗・原子的復元の既存挙動を維持する。検証は使い捨てcontextとfixtureで行い、実際の私的記録を保存・commitしない。

## ローカルCLI

| 入口                                             | 現行                                        | 目標/移行条件                                                                                                  |
| ------------------------------------------------ | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `catalog:build`                                  | `--input --output`必須、inventory任意       | 同じコマンドでinput/outputを維持し、inventoryは不要へ。移行中は旧指定も検証して受理。出力上書き防止を維持      |
| `catalog:validate`                               | `--input`必須、inventory任意                | 通常inputのschema・意味検証を証跡なしで行える。指定済み旧inputの型検証は維持                                   |
| `verify:fast`                                    | preview/全shard/全テスト/3browserを順次実行 | 既存runnerを通常検証へ縮小し、CIでは差分に応じた対象を選ぶ。未知差分は広い検査。失敗exitを伝播                 |
| `abc:update`                                     | `initial-v1` fixture専用                    | 既存取得/編集で通常小batchを成立させる。専用CLI拡張が必要なら既存入口を改修。fixture専用をlive完成と報告しない |
| `release:history`                                | host metadataと旧update/release情報を要求   | 既存writerを実Pages/Actions成功と既存indexの追記に縮小。過去entryの書換え・duplicate拒否を維持                 |
| `abc:review` / `verify:release` / `abc:deploy`等 | 旧承認・台帳・adapterに依存                 | 全consumer移行後にpackage入口と専用実装を削除。成功のno-opに置換しない                                         |

PR-05でcatalog
CLIの通常経路を移行した。repository内のstaging以外にある、現行正本と一致するJSONを入力する。

```sh
npm run catalog:validate -- --input docs/verification/releases/catalog.json
mkdir -p build
npm run catalog:build -- --input docs/verification/releases/catalog.json --output build/validated-catalog.json
```

schema・ID・参照・出典/claim・配置と本文、Tag/Outcome/Unitの3DAG・読書順の検証を維持する。型違反・重複ID・未知参照・循環・欠落本文・正本との差を拒否し、既存outputのbytesを上書きしない。未知・重複・値欠落の引数は64、意味検証失敗は2、実行失敗は70を維持する。旧欄の値を保持し、存在するsnapshot
digestは照合する。`prepared`の検証成功を公開成功に数えない。

`--evidence-inventory`はPR-07の公開consumer移行後、PR-10の旧consumer整理まで残す。指定時は従来のprotected-base/manifest・inventory全体・check/review・実行例証跡を検証し、不正な旧指定を成功扱いしない。旧release/deploy
consumerと通常buildのprepared版照合はまだ残る。新しい訂正では変更前後のcatalogと前提を`scope`として影響先の完全性を検査し、証跡登録を要求しない。具体的な入力と復旧は[更新マニュアル](../../../docs/operations/update-manual.md#catalog-cliの移行002--pr-05)を参照する。

公開CLIを黙って無視する引数に変えない。互換引数を残す期間と削除はマニュアルに記載する。新しい通常CLI仕様の詳細は、その必要が判明した実装PRで既存契約に追記し、今回新しい汎用CLI群を設計しない。

## CI / Pages

- 単一基準環境、required check名`Verify (release baseline)`を維持する。
- 非公開文書だけでもrequired
  jobが対象検査を実行する。必須検査失敗・cancel・対象不明をsuccessへ置換しない。
- merge条件のGitHub実設定とdeployの依存は同じ検査に揃える。旧名の削除前に実設定を確認・切り替える。
- PRは検証のみ。mainの同run/SHAで検証したbuildをuploadし、成功jobに`needs`で依存する標準deploy
  jobが同artifactを配信する。
- `SITE_URL`、`BASE_PATH`、`github-pages`
  environmentと標準権限を維持する。環境の不要な人間review必須設定があれば実設定を確認して取り除く。
- deployをcancelして公開状態不明を作らないよう、現在のproduction
  concurrencyの考え方を維持する。古いrunを後で再実行して新版を上書きする場合は対象SHAを確認し、復旧はGit
  revertを優先する。
- 正常なmainの検証を失敗後に再実行できる。artifactが消えた場合は同SHAの検証/buildから再実行する。
- 配信失敗では旧公開版を維持。配信後確認失敗は「配信済み・確認未完了」と報告する。

標準Actionの構成は[GitHub公式Pages workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
（確認日2026-10-08）に従う。GitHub環境・required設定の変更と成功確認は後続実装の範囲。

## 復旧

不具合を含むPRをGit
revertして、mainの新しいSHAを同じ検証・Pages経路で公開する。origin/base/DBは変えず、追加Problemの学習記録を削除しない。履歴の過去entryを消して成功扱いにせず、復旧したGitと公開履歴を報告する。移行中だけは現在の旧手動公開手順を利用可能な状態で残し、新経路成功後に無効化・整理する。
