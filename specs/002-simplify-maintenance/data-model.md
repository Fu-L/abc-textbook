# Phase 1 Data Model: 保持する正本と縮小する運用データ

新しいdomain
entity・永続台帳・状態機械は追加しない。既存schemaの定義を参照し、ここでは互換性条件と移行する欄だけを示す。

## 教材・分類・配置

**正本**: `src/content/`、`src/lib/domain/schema-parts/catalog.ts`、
`src/lib/taxonomy/textbook-order.ts`、配置・前提policy。

| Entity                                        | 主な識別・関係                                                                                         | 維持する検証/移行                                                    |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Contest / ContestSlot / 公式欠番              | Contest ID、公式task order、slot label、source参照                                                     | Dより後の公式対象。欠番・unknown・未公開を区別し、E〜H固定にしない   |
| Problem                                       | stable ID、official task identity、`docPath`、source参照                                               | 868既存ID/本文を保持。未知・重複ID、本文欠落、task不一致を拒否       |
| Source Revision                               | `id`、`url`、`sourceKind`、`contestId`、`officialTaskId`、`checkedAt`、`fingerprint`、`termsCheckedAt` | 公式根拠の正本。本文claim・problem・task orderからの参照を残す       |
| TechniqueTag / LearningOutcome / LearningUnit | ID、owner/関連/直接前提、Unitの本文path                                                                | 213/242/232の既存集合を保持。各前提DAGを独立に検証                   |
| Placement / Prerequisites                     | Problem、semantic primary Outcome、そのowner Unit、supporting関係                                      | homeと関連を区別。主配置・関連先・前提・明示読書順をまとめて確認     |
| ProblemAnalysis / AuthoringUnit               | Problem ID、技術的claim/source、解法、本文locator                                                      | 既存parserを使用。skill/review管理欄は旧読込を残して新規必須から除く |
| metrics / derived indexes                     | Problem ID、欠測値、元の正本への参照                                                                   | 欠測`null`を保持。分類/読書順をdifficultyから再生成しない            |

運用PRで教材bytes・taxonomyを変えない。本実装の訂正・追加試験は一時コピーに限定し、実教材の追加PRは別依頼で行う。その追加PRでは指定batchの新規問題と必要な関連先だけを変更する。既存本文の`draft`表現はreader契約を維持し、一括変換しない。

## Catalog / release情報 / 公開履歴

**既存定義**: `schema-parts/catalog.ts`の`CatalogSchema`/`CatalogReleaseSchema`、
`schema-parts/release.ts`の`ReleaseMetadataSchema`、`catalog/build-release-history.ts`。

| 区分           | 保持/変更                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 公開範囲と変更 | version、cutoff、first/last Contest、件数、追加/訂正/保留/withdrawn ID、taxonomy概要を既存正本から求める                           |
| 配信の識別     | Git SHA、Actions run URL、標準Pagesの公開結果。metadataの`commit`は実buildのSHA                                                    |
| 旧承認・台帳欄 | review refs、agent review ref、manifest digest、check結果path/digest等は旧入力に存在すれば保持・型検証。通常更新の必須項目としない |
| 残すdigest     | Source Revision、registry/既存公開formatの参照に必要な内容digest。承認判定や新しいdigest連鎖にしない                               |
| 必要検証       | 必須field/型、ID/参照/各DAG、完成本文、公開範囲と変更概要の一致、version重複拒否、実公開確認                                       |

既存schema内で旧欄をoptionalにし、利用側も欠落を扱う。旧JSONを通すために値を補作しない。旧`validationSummary`の結果path/digestを含む構造も、新規artifactでは必須としない。過去のsummaryは過去の結果として保持し、新しい検証の成功件数・digest・時刻として流用しない。候補catalogを生成しただけではpublishedを付与しない。新しい配信状態はActions/Pagesと配信後の履歴projectionで示す。

`CatalogSchema`の既存`schemaVersion: 3.0.0`とmetadataの`1.0.0`をこの互換読込拡張で変更しない。生成schemaとZod
refinementsを一致させる。将来必須fieldの意味を変える必要が出た場合は、この互換拡張に混ぜず別の移行として扱う。

新版の`version`は`YYYY.MM.DD-r<run_id>`を受理する互換拡張とし、旧日付版はそのまま残す。同runの再実行で同版、別runで別版となり、履歴の識別はversionと配信run/SHAの対応で行う。同じSHAの別runをcommit重複だけで拒否しない。採番・衝突検査・履歴の順序は[互換契約](contracts/compatibility.md#新版の採番と再実行)に従う。

Actions外のローカルcatalogは既存の基準版を使う`publicationStatus: prepared`の候補とし、metadataを生成しない。基準版は既存履歴末尾、空なら基準catalogの識別子から求める。教材部分は変更した正本から作り、基準版のsnapshotや旧検証結果を流用しない。Actionsの実run入力とfixture入力の扱いは[build入力契約](contracts/compatibility.md#ローカルbuildとactionsの入力)に従い、候補を公開履歴へ混ぜない。

`src/content/indexes/release-history.json`は既存の公開用projectionとして残す。旧entryを当時のGitと公開情報から読めるまま維持し、新entryへreviewを要求しない。新しいentryは成功した配信を確認してから後続更新で追記する。失敗・未公開candidateをpublished
entryへ混ぜない。現在の履歴indexと最新の配信metadataは更新時点が異なり得るため、最新状態はPages/Actionsで確認する。

新版entryのcatalogとmetadataは実配信した同じbuild
artifactから取得し、旧entryは既存indexと当時のGit読込を保持する。取得不能時の公開JSONによる確認と保留、および履歴だけの配信ではindex追記を繰り返さない条件は[互換契約](contracts/compatibility.md#配信後の履歴入力と履歴だけの配信)に従う。履歴だけの配信も実buildの新しいversion/SHA/runをmetadataへ出し、教材差分は空、cutoff・収録範囲は不変とする。

初回移行ではPR-07a/07bで標準配信とwriter/trigger切替を順に配信・確認し、PR-07cでその成功済み版だけをindexへ追記する。writer/workflow変更をindex追記のPRへ混在させず、PR-07cは履歴だけの配信条件を満たすことを確認する。

## LearningRecord / Backup（変更なし）

**定義**: `src/lib/domain/schema-parts/learning.ts`、`src/lib/learning-records/database.ts`。

- `problemId`: store key。公開から一時的に外れたProblem IDも消さない。
- `status`: `unstarted | in_progress | completed`。
- `statusUpdatedAt`: 独立したRFC 3339日時または`null`。
- `needsReview`: boolean。
- `needsReviewUpdatedAt`: 独立したRFC 3339日時または`null`。

DB名`abc-textbook-learning-records`、version `2`、store `learning-records`、key
`problemId`を保持する。既存version 1の読込/migration実装を維持する。新しいDB migrationは不要。

backupは`schemaVersion: 1.0.0`、`exportedAt`、`catalogVersionAtExport`、`records`、`orphanedProblemIds`を保持する。重複ID・不正日時・未知fieldなどの既存検証、競合方針、100件以上のexport/import、失敗時に部分反映しない原子性を維持する。private
recordをGitや公開catalogへ含めない。

`catalogVersionAtExport`のstring受理値だけは新版の接尾辞へ対応させる。従来の1桁の日を含むbackupと新版のexport/importを同じschemaVersionで検証し、field構成・record値・日時・保存識別は変更しない。

## 更新の状態（新しい状態管理を作らない）

通常の作業は「対象確認 → 正本編集 → 必要検証 → 報告/必要なら公開」の4段階。既存CLIに必要な再試行処理は再利用するが、この4段階の永続status
entityやreceiptは追加しない。未完成/取得失敗は対象・理由・再試行条件を報告し、完成した小batchだけを公開する。

公開結果は標準Actions/Pagesの状態に従い、検証失敗、配信失敗、配信成功後の確認未完了、確認済みを報告で区別する。Git
revertで問題が一時非掲載になっても学習記録は保持する。
