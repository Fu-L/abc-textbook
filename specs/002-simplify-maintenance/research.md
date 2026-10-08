# Phase 0 Research: 既存実装を再利用する移行

**確認日**:
2026-10-08。リポジトリの作業ツリーを調査した。既存の未commit変更は保持する。GitHubの現行設定・公開状態・CI時間を外部で実測した結果ではない。

## 1. 公開buildの正本と受入台帳

**Decision**:
`full-public-projection.ts`をその場で改修し、既存metadataとMarkdownから公開projectionを作る。既存parser・mapping・教科書順・metrics・意味検証を使い、受入台帳による本文bytesの照合を通常buildから外す。

**Rationale**:
`public-catalog.ts`は同loaderを呼び、loaderはbootstrapの`learning-unit-content.json`、
`problem-authoring-units.json`、`us1.json`、`problem-content-projection.json`を読む。現状は正本の文章だけを直しても受理digestとずれてbuildが止まる。受理digestを外しても、本文の欠落・未完成・source/ID/配置/前提の不整合を検出する既存処理は残せる。Problemのreaderは`draft: true`、Unitの公開判定は`draft: false`を使うため、本文の一括正規化はしない。

**Alternatives considered**: 新catalog
serviceはconsumerを増やすため不採用。旧台帳を毎回再生成する案は通常訂正に証跡更新を残すため不採用。validation全体のskipも不採用。

## 2. release/schema/CLIの証跡依存

**Decision**: 既存schemaの旧欄を読めるままにし、新規通常更新のreview/manifest/check
digestを必須条件から除く。まずschema/履歴reader、次にcatalog意味検証/CLI、最後にdeploy
consumerを移行する。

**Rationale**: `CatalogReleaseSchema`と`build-catalog.ts`が公開reviewを要求し、
`catalog-build.ts`/`catalog-validate.ts`は`--evidence-inventory`を必須とする。
`evidence-inventory.ts`もwork manifestとtrusted
reviewを読むため、CLI引数だけの変更では足りない。初版agent
review例外はABC212〜466・868問・固定cutoff等に限定され、通常更新への流用はできない。生成JSON
SchemaとZodの意味検証を同時に整合させる必要がある。

**Alternatives considered**: 初版例外の一般化、新しいCodex approval
mode、架空reviewの補完はいずれも不採用。旧formatの全面置換も互換性とPR規模の面から不採用。

## 3. 公式出典と執筆品質

**Decision**: Source
Revisionの識別・URL・公式task・確認日・fingerprint・本文claim参照を保持する。skillのmanifest/digest、review
mode、固定演習義務だけを利用側と同期して除く。

**Rationale**:
`authoring-unit.ts`、`authoring/explanation-authoring-skill.ts`、`update-abc/author.ts`とskill文書が連動する。既存frontmatterを一括書き換える必要はない。公式sourceのfingerprintは引用根拠の識別であり、作業承認台帳とは異なる。数学的正しさはCodexが問題固有の公式根拠・論証・境界・計算量で確認する。

**Alternatives considered**: すべてのdigest削除、全本文再生成、schemaだけでの解法受理は不採用。

## 4. CIの重複と変更選択

**Decision**: Node 24.18.0/npm
11.16.0の単一環境を残し、`Verify (release baseline)`を継続する。既存runner/CIの短い条件分岐で必要な検査を選び、未知差分は広い検査へ進む。

**Rationale**: `ci.yml`は2環境、20本の過去数学回帰、全verifyに加えてrelease/reviewを別jobで行う。
`runner.ts`もpreview・全corpus・全shard・全テスト・3ブラウザーをまとめる。
`build`に含まれる`astro check`と`check`も同runで重なる。変更に無関係な初版工程を除き、対象挙動の失敗を検出するテストへ置換する。非公開文書の変更でもrequired
jobを起動し、job内で文書検査を実行する。

**Alternatives considered**: workflow全体のpath skip、新policy
engine、CI時間を理由に必要検査を成功扱いする案は不採用。検出範囲がなくなるテストを一括削除する案も不採用。

## 5. 必須チェックの実設定

**Decision**: 実GitHubのbranch
protection/ruleset、deploy側参照、ローカル設定例を連動させる。残す同名baselineの成功を確認してから、旧4checkを要求から外し、jobを削除する。

**Rationale**:
`protected-main.json`と`production-deploy.yml`は5つのcheck名を持つ。設定例だけを編集するとGitHubが廃止checkを待ち続ける。GitHub公式文書はrequired
checkの状態とbranch保護の関係を説明している。既存検査を実行するbaselineを残す方針はこのリポジトリへの設計判断である。
[GitHub公式: protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
（確認日2026-10-08）。

**Alternatives
considered**: 全保護解除、常にsuccessの互換job、新check名へ無準備で切り替える案は不採用。実設定を変更する権限がなければ旧job削除を保留し、権限不足だけを具体的に報告する。

## 6. 標準Pages公開と復旧

**Decision**: 既存CI
workflow内で検証/build/uploadとdeployを`needs`で結ぶ。mainの同じrunで作ったartifactを標準Pages
Actionで配信し、別workflowによる再buildと独自API pollを除く。復旧は不具合PRのGit revertと新しいmain
SHAの再公開を基本にする。

**Rationale**: 現行`production-deploy.yml`は手動commit入力、check照合、再度のrelease検証/build、Pages
API/poll、初版事後確認を行う。公式文書ではupload/deploy action、`needs`、
`pages: write`・`id-token: write`、`github-pages`
environmentを示している。同workflowでのartifact共有をこのサイトへ適用するのは本計画の設計判断。
[GitHub公式: custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
（確認日2026-10-08）。Actionの適用versionは実装時に公式READMEも確認する。

**Alternatives considered**: 新deploy adapter、任意旧SHAの独自配信機構、cross-workflow
artifact台帳は不採用。PRとmainは異なるSHAなので、それぞれの検証buildは必要であり、同一対象の無用な重複とは扱わない。

**ローカルbuildの設計判断**:
Actions外では既存履歴末尾、空の場合は基準catalogの版識別子を使い、prepared
candidateだけを作る。metadataは生成せず、run入力がなくても既存コマンドでbuild・リンク・必要なE2Eを検証できる。Actions内の実run入力不足は失敗とし、架空のrun
IDや現在日付で補完しない。具体的な入力と回帰確認は[build入力契約](contracts/compatibility.md#ローカルbuildとactionsの入力)に集約する。これは未実装の設計であり、ローカル候補を実配信物と扱う変更ではない。

## 7. 公開履歴とcommit自己参照

**Decision**: 既存index・metadata・routeを使い、旧entryを維持する。新しい公開のcommitとrun
URLはbuild
artifactへ出し、実配信成功後にそのrunが配信した同じartifact内のcatalog/metadataから既存履歴indexへ後続更新で追加する。新版の入力にGit内の旧prepared
catalogを代用しない。artifact取得不能なら同じ版/SHA/runの現在配信中の公開JSONを成功確認後に利用し、双方取得不能なら履歴追記だけ保留する。index反映前も最新metadataと標準Pages履歴へ更新一覧から到達できるようにする。

新版はrunの作成UTC日付とrun
IDで`YYYY.MM.DD-r<run_id>`を採番し、同run再実行では維持、別runやrevert後は別版とする。旧版/URLは保持する。同じSHAの別runは別版として扱い、履歴順序は版文字列の辞書順に依存させない。最後の成功配信SHAとの差が履歴indexと非公開運用文書だけなら履歴だけの配信として扱う。別runの新版/SHA/runをmetadataへ出してbuild・リンク・対象履歴検査後に配信するが、その配信自体のindex追記は要求しない。教材差分集合は空、cutoff・収録範囲は保持し、最新配信は標準Pages/Actionsへ到達させる。

**Rationale**:
`build-release-history.ts`はreview必須、`scripts/release/build-history.ts`は各metadataのcommitからcatalogを読む。
`/updates/[version]/`はそのindexの静的projection。事前に新SHAのpublished履歴をcommitすると、未公開を成功とするか、自己参照commit/digestの連鎖を作る。過去entryの意味と既存URLを変えず、標準の成功記録だけから追記する。

**初回移行のPR境界**:
PR-07aで標準配信、PR-07bでwriter/旧trigger切替を通常検証・配信し、それぞれの実成功を確認する。両版の同一artifact入力を標準artifactまたは同じ作業内の一時領域で確保し、PR-07cでindexと非公開運用文書だけを追記する。コード/workflow変更を含むPR-07bには履歴だけの配信例外を適用しない。PR-07cの配信自体には次のindex追記を要求しない。

**Alternatives considered**: release
DB、承認receipt、事前published記録、毎回の全履歴再生成、専用artifact保管庫は不採用。同日中の公開を翌日まで待つ案、旧日付版へ別SHAを上書きする案、履歴だけの配信にも次の履歴追記を要求する案は、それぞれ復旧の遅延・過去URLの意味変更・追記の連鎖を招くため不採用。履歴反映の遅延は明示し、最新配信を履歴indexだけから推測しない。

`GITHUB_RUN_ID`はrun再実行で変わらず、標準artifactは期限切れになり得る。根拠は[GitHub公式の変数リファレンス](https://docs.github.com/en/actions/reference/workflows-and-actions/variables)と[artifact取得手順](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts)（確認日2026-10-08）。採番と履歴だけの配信条件はこのプロジェクトの設計判断であり、詳細は[互換契約](contracts/compatibility.md#新版の採番と再実行)に集約する。

## 8. 学習記録

**Decision**: 保存識別・record
schema・backupのfield/schemaVersion・UIの状態更新実装は変更しない。`catalogVersionAtExport`の受理値だけを旧入力を保って新版へ拡張する。既存fixture/testを使い、旧backupと新版のexport/import、origin/baseとProblem
IDの保持を確認する。

**Rationale**: `database.ts`はDB名・version 2・store・keyを定義し、version 1からの原子的移行も持つ。
`learning.ts`は独立した状態/復習日時とbackup 1.0.0を定義する。既存backup
integrationには100件以上と未知IDのテストがある。運用簡略化のために新しいrecord
migrationを作る必要はない。

**Alternatives considered**: DB名変更、schema
version更新、origin移転、公開から消えたIDの記録削除は不採用。

## 9. 公開済みbaseからのABC追加

**Decision**: 取得・parser・分類・本文検証を再利用し、取得と正本追加を別PRにする。Codexによる既存コマンドと正本編集で成立すれば専用live
CLIは増やさない。

**Rationale**: `update-abc/index.ts`は`initial-v1`以外を拒否し、fixtureMode/preview
pathに固定する。discover/acquireのテスト成功だけでlive追加完成とはいえない。
`src/lib/corpus/`の取得・公式parserを公開済みbaseと指定小batchへ接続し、Dより後の全対象・Exのtask
identity・将来I・公式欠番・取得失敗を区別する。取得後は既存IDを比較して再実行の差分をなくし、完成した範囲だけを公開する。

**Alternatives considered**: 全taxonomy再生成、最新までの一括追加、多段release
transactionの汎用化は不採用。

## 調査の完了範囲

設計に必要な不明点は解消した。実設定・現行公開の観測・同条件5回の時間測定は後続実装で行う。実教材の訂正・Contestの執筆/公開は本実装に含めず、別の教材変更依頼までSC-004/M5受入を未達とする。一時コピーの経路試験、教材不変の標準配信成功、実教材の受入を区別し、本計画の完成やCI短縮の達成と混同しない。
