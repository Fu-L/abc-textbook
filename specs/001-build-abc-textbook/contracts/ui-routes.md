# UI and Route Contract

**Version**: 2.0.0
**Rendering**: Astro/Starlight の静的出力。本文と主要ナビゲーションは JavaScript なしでも読める。Pagefind 検索と学習記録操作は JavaScript が必要であり、利用不能時は理由を隣接テキストと accessible name で示す。

## 1. Routes

| Route | Source | Contract |
|---|---|---|
| `/` | generated | 対象範囲、分野別の教科書目次、コンテスト索引、要復習一覧、release 情報への入口 |
| `/learn/` | LearningUnit graph + textbook editorial data | 分野別のchapter/section/subsection階層、目次・sidebarの表示順、対象色 |
| `/learn/<unit-slug>/` | LearningUnit + docs | 分類、直接前提Unitと直接の依存先、対象色・レーティング帯・理由、概説、Unit内問題一覧と解説への導線 |
| `/problems/` | catalog + IndexedDB | 全問題一覧と静的属性・学習状態の複合絞り込み |
| `/problems/<problemId>/` | Problem + Explanation | 問題情報、公式参照、解説、タグ、学習単位、類題、学習記録 |
| `/tags/` | TechniqueTag | 深さ可変のタグ木、前提関係、同義語・旧名称検索 |
| `/tags/<tag-slug>/` | TechniqueTag + ProblemPlacement | 定義、学習成果、親・子・前提、代表・基本・発展問題 |
| `/contests/` | Contest + AdvancedSlotRegistry | ABC を行、D より後に確認された問題記号の和集合を列とする表と代替一覧 |
| `/review/` | catalog + IndexedDB | 要復習だけを初期表示し、追加条件で絞り込み |
| `/updates/` | Release history | 公開版の対象範囲、変更、検証、レビュー、公開日時 |
| `/updates/<version>/` | Release | 個別 release の履歴、検証要約、証跡参照 |
| `/settings/learning-records/` | IndexedDB | 保存状態、JSON export/import、preview、merge 結果 |
| `/data/catalog.json` | generated endpoint | [catalog.schema.json](./catalog.schema.json) 準拠の公開カタログ |

HTML route は末尾 slash を正規形とし、GitHub Pages の project base path でも同じ相対関係を保つ。

分野別目次は意味的な階層と編集上の表示順を表す。3つの前提DAGは別のcanonical policyに保持し、直接の前提・依存Unitリンクとして表示する。全体順、前後リンク、順位は生成しない。各Problemのhome Unitはprimary Outcomeの唯一のownerであり、problem listでは主題・追加で学ぶ技能・既習技能を区別する。全Unitの対象色は色名と数値帯と理由を文字で示し、章・構造Unitは「導入対象の目安」、学習Unitは「習得対象の目安」とする。全問題を解く難易度や公式の履修基準ではないことを読み方に示す。このcanonical表示契約を公開routeへ反映するのはT160であり、それまではcanonical文書をdraftのまま保持する。

## 2. Common page contract

- `<html lang="ja">`、一意な `title`、一つの `h1`、main landmark、skip link を持つ。
- パンくず、章ナビ、本文、補助ナビを意味のある landmark と見出しで区切る。
- JavaScript 読込前にも本文、公式リンク、学習単位・タグリンク、contest cell の意味を確認できる。
- 外部公式リンクは contest/problem 名と外部リンクであることをテキストまたは accessible name に含める。
- 図、表、数式、コード出力の必須情報には同等のテキスト説明を付ける。装飾画像は空 alt にする。
- 状態やエラーを色、形、配置だけで伝えない。
- 日時は `<time datetime="RFC3339">` とし、表示から日付、時刻、UTC offset、IANA timezone を判別できる。
- 学習指示、演習、UI 操作説明は `src/content/glossary/terms.json` の正式名と alias を一貫して使う。
- 共通 layout だけがパンくず、前後移動、主要 section navigation の route mapping を所有し、本文は正本 entity の安定 ID だけを参照する。

### Release history

`/updates/` と `/updates/<version>/` は、次の値へ同じ画面から到達できるようにする。

- `version`, `releaseKind`, `cutoffAt`, `validatedAt`, `publicationEffectiveAt`
- `manifestDigest`, `contentSnapshotDigest`, `updateIds`
- `firstContestId`, `lastContestId`, `contestCount`, `problemCount`, `slotRecordCount`
- `addedProblemIds`, `changedProblemIds`, `heldProblemIds`, `withdrawnProblemIds`
- taxonomy change の種類、entity ID、要約
- 自動検査の件数・成功数・blocking finding 件数・証跡 digest
- human content review の ID・path・digest と changelog path

0 件の配列は空欄でなく「0件」と表示する。短縮 digest には完全値を確認・copy できる accessible な手段を付ける。Release画面はfull Git commitと検証結果URLを表示し、実際のdeploy時刻とrollback履歴は静的hostのdeployment履歴へlinkする。

merge前のfinal validationはRelease、catalog、Pagefind、sitemap、feed、asset manifestを含む派生物の推移閉包をread-onlyで照合し、production deployはrequired checksを通過したprotected mainのcommitだけを許可する。

## 3. Problem detail

表示順は次とする。

1. `ABC NNN <problemLabel> — 問題名` と掲載状態
2. 公式問題への外部リンク、出典、最終確認日時
3. 学習記録 control
4. 前提 LearningUnit、主・補助 TechniqueTag、LearningOutcome
5. 解説本文または公開保留理由
6. 類題・補充問題の場合は主要解説との差分と再利用根拠
7. 関連問題、学習単位、タグ
8. authoring skill 名・版と revision

完全解説は「自然な考察手順」「典型と問題固有要素の分解」「正当性」「計算量と制約整合」「実装上の注意」「例または検証手順」「復習時の助言」「出典と確認日」を持つ。公式問題文や公式解説本文は転載しない。

## 4. Learning-record control

全 Problem route は一つの共有 component と action contract を使い、route 別の保存処理 override を禁止する。validator は公開 Problem 全件について component/action contract、表示完了 marker、IndexedDB transaction、reload 復元 semantics が同一であることを検査する。

### Status

- visible label は `解答状況`、native `<select>` の値は `未着手`, `挑戦中`, `修了` とする。
- 成功時だけ status と `statusUpdatedAt` を同じ transaction で保存する。
- status 操作で `needsReview` とその日時を変更しない。

### Needs review

- visible label に `要復習` を含む checkbox または pressed button とする。
- 成功時だけ `needsReview` と `needsReviewUpdatedAt` を保存する。
- 要復習操作で status とその日時を変更しない。

### Feedback

- 保存中、成功、失敗を `aria-live="polite"` へテキスト通知する。
- IndexedDB 拒否、quota、migration 失敗時に成功表示せず、画面を元の値へ戻す。
- 日時なしは `更新記録なし` と表示する。
- `修了` かつ `要復習` を有効とし、両方の badge を表示する。
- 同じ origin で再読込したとき record を復元する。

## 5. Contest matrix

- column は `AdvancedSlotRegistry.labels` を公式順で使い、`E,F,G,H` の固定 enum や固定4列を持たない。
- registry は対象 Contest の `officialTaskOrder` で D より後にある記号の順序付き和集合であり、将来 `I`, `Ex` その他の記号が現れても同じ導出規則へ含める。
- `<table>`、説明的 `<caption>`、`<thead>`、ABC 行の `<th scope="row">`、動的問題記号列の `<th scope="col">` を使う。
- ABC 212 から release の `cutoffAt` 時点の最新終了済み ABC までの連続行を表示する。
- Contest に当該記号がない cell も `公式問題なし` と理由を明示し、空欄にしない。
- 各 cell は問題識別子・名前、解答状況、要復習、掲載状態を示す。
- 収録済み cell には問題詳細、解説 anchor、対応 LearningUnit、主・各補助 TechniqueTag、各類題への区別可能な直接 link を置き、各 destination へ一回の操作で移動できるようにする。
- 掲載表示は `収録済み`, `未収録`, `作成中`, `公開保留`, `訂正確認中`, `公式問題なし`, `公式取り下げ` のいずれかとする。
- 二次元表だけを横 scroll 可能にし、同じ filter 結果の contest 別 list 表示を併設する。

## 6. Search and filters

### Full-text search

- Pagefind は公開本文、問題名、TechniqueTag の正式名・同義語・旧名称、全階層の LearningUnit 名、contest 番号を検索対象にする。
- navigation、学習 control、未公開候補、staging、廃止 route、端末状態を index に含めない。
- 結果は entity 種別、公開済み正規 route、該当箇所を示す。0件時は検索語と適用中条件を示す。
- JavaScript が使えないときは control を無効化し、検索に JavaScript が必要であることを表示する。

### Structured filters

`/problems/`, `/contests/`, `/review/` は次を組み合わせられる。

| Query | Values |
|---|---|
| `contest` | `abcNNN` または範囲 |
| `slot` | `AdvancedSlotRegistry.labels` に存在する問題記号 |
| `tag` | TechniqueTag ID |
| `unit` | LearningUnit ID |
| `status` | `unstarted,attempting,completed` |
| `needsReview` | `1` |
| `publication` | 公開、作成中、保留、訂正確認中、公式なし、取り下げ |

- 静的属性は `catalog.json`、個人状態は IndexedDB から Problem ID で join する。
- control は visible label、keyboard 操作可能な `適用` と `すべて解除` を持つ。
- 適用中条件、該当件数、0件理由をテキスト表示する。
- `/review/` は初期状態で `needsReview=1` を適用し、表または任意 Problem 画面から2操作以内で到達できる。
- 静的 filter は URL query へ反映し、端末状態の値を外部送信しない。

## 7. Backup and restore

- export は [learning-record.schema.json](./learning-record.schema.json) 準拠 JSON を local file として作る。
- import は明示選択した file だけを読み、schema 検証前に DB へ書かない。
- preview は各 input を `new`, `updated`, `same`, `unknown_problem_id`, `invalid_item` の排他的な一つへ分類し、合計を input 件数と一致させる。
- conflict policy は `newer-wins`, `backup-wins`, `cancel` を明示選択させる。
- `newer-wins` は `(status, statusUpdatedAt)` と `(needsReview, needsReviewUpdatedAt)` を component ごとに独立判定し、null 日時を現在時刻で補わない。
- 同一 instant の値が衝突した場合は local pair を保持して `timestamp_tie_local_kept` を表示する。
- import 全体を一 transaction で適用し、一部失敗時は rollback する。`invalid_item` が一件でもあれば適用しない。
- unknown/withdrawn Problem record を削除せず `過去の記録` として報告する。
- export/import に氏名、account、cookie、閲覧履歴を含めない。

## 8. Error and hold states

- 404 は要求された Problem/LearningUnit/TechniqueTag ID と検索・索引への戻り先を示す。
- `on_hold` は安全な公開済み旧 revision を警告付きで維持し、新候補を表示しない。
- 技術的意味が変わる訂正は `訂正確認中` と影響範囲を表示する。
- 外部 source 不能時も公式本文を転載せず、最終確認日時と再確認の必要を示す。
- IndexedDB だけが使えない場合は検索を維持し、学習記録 control だけを理由付きで無効化する。

## 9. E2E acceptance matrix

| Flow | Expected observable result |
|---|---|
| dynamic fixture に `I` を追加して build | `I` が対象、表列、検索、更新、網羅性判定へ入り、固定4枠による欠落0件（SC-020） |
| contest cell から各 destination を選択 | 問題、解説、LearningUnit、主・補助 TechniqueTag、類題へ各1操作で到達（SC-005） |
| 問題名・タグ alias・全階層 unit 名・contest 番号を検索 | 正しい entity 種別と公開 route が現れ、未公開候補・端末状態の混入0件 |
| status と needsReview を異なる時刻に変更して reload | 両値を保持し、対応する日時だけが変化（SC-012, SC-016） |
| `/review/` へ移動して追加 filter | 2操作以内で到達し、要復習でない問題の混入0件（SC-017） |
| 新 catalog へ更新 | 既存 record は byte-equivalent、新 Problem は既定値・日時なし（SC-013） |
| table を keyboard と Playwright の accessibility tree で操作 | row/column 見出し、問題、状態、要復習を識別可能 |
| 320 CSS px の reflow | 本文機能を失わず、二次元表だけ scroll 可能 |
| 100件以上を export、DB clear、preview、import | 差分と方針を適用前に確認し、成功時100%一致、失敗注入時の部分反映0件（SC-018） |
| IndexedDB 拒否 | 成功と誤表示せず、元の状態と対処案を示す |
