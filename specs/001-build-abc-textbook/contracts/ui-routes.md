# UI and Route Contract

**Version**: 2.1.0 **Rendering**:
Astro/Starlight の静的出力。本文と主要ナビゲーションは JavaScript なしでも読める。Pagefind 検索と学習記録操作は JavaScript が必要であり、利用不能時は理由を隣接テキストと accessible
name で示す。

Study UX
#107〜#123で採用した読書表示を含む。保守・公開の旧証跡義務は[002の置換規則](../../002-simplify-maintenance/spec.md#conflicts-with-existing-specifications)に従う。

## 1. Routes

| Route                         | Source                                       | Contract                                                                                           |
| ----------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `/`                           | generated                                    | 対象範囲、分野別の教科書目次、コンテスト索引、要復習一覧、release 情報への入口                     |
| `/learn/`                     | LearningUnit graph + textbook editorial data | 分野別の編集上の掲載順、概念上の親リンク、対象色。意味階層は別に保持する                           |
| `/learn/<unit-slug>/`         | LearningUnit + docs                          | 分類、直接前提Unitと直接の依存先、対象色・レーティング帯・理由、概説、Unit内問題一覧と解説への導線 |
| `/problems/`                  | catalog + IndexedDB                          | 全問題一覧と静的属性・学習状態の複合絞り込み                                                       |
| `/problems/<problemId>/`      | Problem + ProblemAuthoringUnit               | 問題情報、公式参照、解説、タグ、学習単位、類題、学習記録                                           |
| `/tags/`                      | TechniqueTag                                 | 深さ可変のタグ木、前提関係、同義語・旧名称検索                                                     |
| `/tags/<tag-slug>/`           | TechniqueTag + ProblemPlacement              | 定義と発動条件、代表問題、主タグ・補助タグの問題、分類・前提への導線                               |
| `/contests/`                  | Contest + AdvancedSlotRegistry               | ABC を行、D より後に確認された問題記号の和集合を列とする表と代替一覧                               |
| `/review/`                    | catalog + IndexedDB                          | 要復習だけを初期表示し、追加条件で絞り込み                                                         |
| `/updates/`                   | Release history                              | 公開版の対象範囲、変更、検証、レビュー、公開日時                                                   |
| `/updates/<version>/`         | Release                                      | 個別 release の履歴、検証要約、証跡参照                                                            |
| `/settings/learning-records/` | IndexedDB                                    | 保存状態、JSON export/import、preview、merge 結果                                                  |
| `/data/catalog.json`          | generated endpoint                           | [catalog.schema.json](./catalog.schema.json) 準拠の公開カタログ                                    |

HTML route は末尾 slash を正規形とし、GitHub Pages の project base path でも同じ相対関係を保つ。

分野別の章目次は編集上の掲載順を平坦な読書案内として表示する。全Unitをちょうど一度含み、所属章を意味階層と一致させるが、親子subtreeの連続性は要求しない。章直下でないUnitには概念上の親をリンクし、親Unitのページでは`parentId`に基づく下位単元を表示する。3つの前提DAGは別のcanonical
policyに保持し、直接の前提・依存Unitリンクとして表示する。後に掲載する前提は「後の節/後の章」と明示し、DAGから全体履修順、前後リンク、順位は生成しない。各Problemのhome
Unitはprimary Outcomeの唯一のownerであり、problem
listでは主題・追加で学ぶ技能・既習技能を区別する。Unit内問題順は受理済みの配列を維持する。全Unitの対象色は色名と数値帯と理由を文字で示し、章・構造Unitは「導入対象の目安」、学習Unitは「習得対象の目安」とする。全問題を解く難易度や公式の履修基準ではないことを読み方に示す。公開loaderは執筆済みの正本を読み、新規生成のdraftは本文・出典・分類の検証を済ませてから公開する。初版のT160までの凍結工程を通常追加の必須条件にはしない。

## 2. Common page contract

- `<html lang="ja">`、一意な `title`、一つの `h1`、main landmark、skip link を持つ。
- パンくず、章ナビ、本文、補助ナビを意味のある landmark と見出しで区切る。
- JavaScript 読込前にも本文、公式リンク、学習単位・タグリンク、contest cell の意味を確認できる。
- 外部公式リンクは contest/problem 名と外部リンクであることをテキストまたは accessible
  name に含める。
- 図、表、数式、コード出力の必須情報には同等のテキスト説明を付ける。装飾画像は空 alt にする。
- 状態やエラーを色、形、配置だけで伝えない。
- 日時は `<time datetime="RFC3339">` とし、表示から日付、時刻、UTC offset、IANA
  timezone を判別できる。
- 学習指示、演習、UI 操作説明は `src/content/glossary/terms.json` の正式名と alias を一貫して使う。
- 共通 layout だけがパンくず、前後移動、主要 section navigation の route
  mapping を所有し、本文は正本 entity の安定 ID だけを参照する。

### 読書表示の原則（Study UX #123）

- 学習本文を先に読み、分類・識別子・執筆情報は必要なときに開ける。成立条件・証明・計算量と本文の出典は読書の流れへ残す。
- 本文・主要リンク・native
  detailsはJSなしでも使え、旧fragmentへの移動で必要な開閉欄も開く。検索・学習記録の操作にJSが必要な理由は該当箇所で示す。
- 日本語を長時間読める文字組み・幅・余白と明暗両配色を共通CSSで定める。色だけに依存せず、狭い画面・200%文字拡大・キーボードでも本文と導線を保つ。具体的なCSS値は本契約へ重複記載しない。
- 長いコードは字下げと改行を保ち、コード・数式・表の横溢れはその枠内で扱う。ページ全体を横スクロールさせず、枠はキーボードでも操作できる。
- 章・単元の目次と前後移動は編集上の読書順に従い、現在位置を示す。本文内目次は表示後の見出しから生成し、補助的な開閉欄を除く。狭い画面で目次が移動先の本文を覆い続けない。
- 問題一覧は問題名から内部解説へ、別の「公式問題」から出題元へ進む。技能・出典の詳細は行ごとに開け、主配置・関連参照・問題順を変えない。表示のために新しい難易度ランクを作らない。

記法・数式parserと共通renderer、各画面の正本、変更に必要なテストは[更新マニュアル](../../../docs/operations/update-manual.md#3-変更に必要な検証を選ぶ)を参照する。新しいProblem/Unitにも同じ表示を適用し、個別ページのHTML/CSS補修を追加手順にしない。

### Release history

`/updates/` と `/updates/<version>/` は、次の値へ同じ画面から到達できるようにする。

- `version`, `releaseKind`, `cutoffAt`, `validatedAt`, `publicationEffectiveAt`
- `manifestDigest`, `contentSnapshotDigest`, `updateIds`
- `firstContestId`, `lastContestId`, `contestCount`, `problemCount`, `slotRecordCount`
- `addedProblemIds`, `changedProblemIds`, `heldProblemIds`, `withdrawnProblemIds`
- taxonomy change の種類、entity ID、要約
- 自動検査の件数・成功数・blocking finding 件数・証跡 digest
- human content review の ID・path・digest と changelog path

0 件の配列は空欄でなく「0件」と表示する。短縮 digest には完全値を確認・copy できる accessible な手段を付ける。Release画面はfull
Git
commitと検証結果URLを表示し、実際のdeploy時刻とrollback履歴は静的hostのdeployment履歴へlinkする。

merge前のfinal validationはRelease、catalog、Pagefind、sitemap、feed、asset
manifestを含む派生物の推移閉包をread-onlyで照合し、production deployはrequired
checksを通過したprotected mainのcommitだけを許可する。

### 単元本文の情報順（Study UX #114）

通常の単元routeは正本Markdownの概念説明・操作・成立条件と計算量を展開し、問題一覧へ接続する。対象色・学習成果・前提・依存先・根拠・内部識別子は本文末尾のnative
detailsへ保持し、関連問題は別のnative
detailsに置く。学習に必要な条件や証明をmetadataと一緒に隠さない。旧節anchorと全リンク、問題の所属・掲載順は保持する。章・単元の目次はPCで本文横、狭い画面で冒頭の開閉欄から使い、冒頭から前提・問題一覧へ移動できる。旧`#unit-contents`も保持する。JSなしでも本文・開閉・fragment移動を利用できる。

`renderLearningUnitDocument`はdraftのMarkdownを生成し、概念の定義を対象色などの編集情報より前に置く。具体的な導入・小例・論証はそのMarkdownの執筆責務であり、分類metadataから自動要約しない。開閉と情報の配置は共通表示処理が担当する。既存・新規Unitとも個別のHTML修正を必要とせず、公開loaderは執筆済み本文を再生成しない。

## 3. Problem detail

表示順は次とする。

1. `ABC NNN <problemLabel> — 問題名`
2. 解説形式、公式問題への外部リンク、学習記録・分類と前提へのページ内リンク
3. 解説本文。fullは「考察」の核心から読み、similar/supplementは参照元fullへのリンクと差分から読む
4. 「分類・前提・執筆情報」のnative
   details。掲載状態、最終確認日時、LearningUnit・Tag・Outcome、元原稿の「学習の位置」、存在する旧skill情報を保持する
5. 学習記録 control、要復習一覧・backupへのリンク
6. 同じ単元の問題

完全解説は自然な考察手順、典型と問題固有要素の分解、正当性、計算量と制約整合、実装上の注意、復習時の助言、出典と確認日を持つ。必要な小例・反例は本文へ組み込み、独立した例題・演習節を全問へ要求しない。公式問題文や公式解説本文は転載しない。

本文は正本Markdownから共通rendererで表示する。「考察」の核心は執筆する内容であり、内部分析や分類から生成・切り詰めしない。外側の節名・全anchor・出典リンクを保ち、表示のための節移動を元原稿へ書き戻さない。新規執筆のfull/similar/supplementの使い分けは[執筆方針](../../../.agents/skills/abc-explanation-author/references/writing-policy.md#placementごとの適用)に従う。

## 4. Learning-record control

全 Problem route は一つの共有 component と action
contract を使い、route 別の保存処理 override を禁止する。validator は公開 Problem 全件について component/action
contract、表示完了 marker、IndexedDB transaction、reload 復元 semantics が同一であることを検査する。

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

- column は `AdvancedSlotRegistry.labels` を公式順で使い、`E,F,G,H`
  の固定 enum や固定4列を持たない。
- registry は対象 Contest の `officialTaskOrder` で D より後にある記号の順序付き和集合であり、将来
  `I`, `Ex` その他の記号が現れても同じ導出規則へ含める。
- `<table>`、説明的 `<caption>`、`<thead>`、ABC 行の `<th scope="row">`、動的問題記号列の
  `<th scope="col">` を使う。
- ABC212からreleaseが宣言した収録上限までの連続行を表示し、`cutoffAt`との一致を確認する。初版はABC466まで・2026-07-12T00:00:00+09:00に固定し、公開日現在の最新回まで収録したと表示しない。
- Contest に当該記号がない cell も `公式問題なし` と理由を明示し、空欄にしない。
- 各 cell は問題識別子・名前、解答状況、要復習、掲載状態を示す。
- 収録済み cell は問題名から問題詳細へ進める。解説 anchor、対応 LearningUnit、主・各補助 TechniqueTag、各類題への区別可能な直接 link は「学習のつながり」のnative
  details内に置く。開閉とリンクはJavaScriptなしでも使える（Study UX #119）。
- 掲載表示は `収録済み`, `未収録`, `作成中`, `公開保留`, `訂正確認中`, `公式問題なし`,
  `公式取り下げ` のいずれかとする。
- 二次元表だけを横 scroll 可能にし、同じ filter 結果の contest 別 list 表示を併設する。list全体をnative
  detailsで開閉してもよい。

## 6. Search and filters

### Full-text search

- Pagefind は公開本文、問題名、TechniqueTag の正式名・同義語・旧名称、全階層の LearningUnit 名、contest 番号を検索対象にする。
- navigation、学習 control、未公開候補、staging、廃止 route、端末状態を index に含めない。
- 結果は entity 種別、公開済み正規 route、該当箇所を示す。0件時は検索語と適用中条件を示す。
- JavaScript が使えないときは control を無効化し、検索に JavaScript が必要であることを表示する。

### Structured filters

`/problems/`, `/contests/`, `/review/` は次を組み合わせられる。

| Query         | Values                                             |
| ------------- | -------------------------------------------------- |
| `contest`     | `abcNNN` または範囲                                |
| `slot`        | `AdvancedSlotRegistry.labels` に存在する問題記号   |
| `tag`         | TechniqueTag ID                                    |
| `unit`        | LearningUnit ID                                    |
| `status`      | `unstarted,attempting,completed`                   |
| `needsReview` | `1`                                                |
| `publication` | 公開、作成中、保留、訂正確認中、公式なし、取り下げ |

- 静的属性は `catalog.json`、個人状態は IndexedDB から Problem ID で join する。
- control は visible label、keyboard 操作可能な `適用` と `すべて解除` を持つ。
- 適用中条件、該当件数、0件理由をテキスト表示する。
- `/review/` は初期状態で `needsReview=1`
  を適用し、表または任意 Problem 画面から2操作以内で到達できる。
- 静的 filter は URL query へ反映し、端末状態の値を外部送信しない。

## 7. Backup and restore

- export は [learning-record.schema.json](./learning-record.schema.json) 準拠 JSON を local
  file として作る。
- import は明示選択した file だけを読み、schema 検証前に DB へ書かない。
- preview は各 input を `new`, `updated`, `same`, `unknown_problem_id`, `invalid_item`
  の排他的な一つへ分類し、合計を input 件数と一致させる。
- conflict policy は `newer-wins`, `backup-wins`, `cancel` を明示選択させる。
- `newer-wins` は `(status, statusUpdatedAt)` と `(needsReview, needsReviewUpdatedAt)`
  を component ごとに独立判定し、null 日時を現在時刻で補わない。
- 同一 instant の値が衝突した場合は local pair を保持して `timestamp_tie_local_kept` を表示する。
- import 全体を一 transaction で適用し、一部失敗時は rollback する。`invalid_item`
  が一件でもあれば適用しない。
- unknown/withdrawn Problem record を削除せず `過去の記録` として報告する。
- export/import に氏名、account、cookie、閲覧履歴を含めない。

## 8. Error and hold states

- 404 は要求された Problem/LearningUnit/TechniqueTag ID と検索・索引への戻り先を示す。
- `on_hold` は安全な公開済み旧 revision を警告付きで維持し、新候補を表示しない。
- 技術的意味が変わる訂正は `訂正確認中` と影響範囲を表示する。
- 外部 source 不能時も公式本文を転載せず、最終確認日時と再確認の必要を示す。
- IndexedDB だけが使えない場合は検索を維持し、学習記録 control だけを理由付きで無効化する。

## 9. E2E acceptance matrix

| Flow                                                         | Expected observable result                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| dynamic fixture に `I` を追加して build                      | `I` が対象、表列、検索、更新、網羅性判定へ入り、固定4枠による欠落0件（SC-020） |
| contest cell から各 destination を選択                       | 問題、解説、LearningUnit、主・補助 TechniqueTag、類題へ各1操作で到達（SC-005） |
| 問題名・タグ alias・全階層 unit 名・contest 番号を検索       | 正しい entity 種別と公開 route が現れ、未公開候補・端末状態の混入0件           |
| status と needsReview を異なる時刻に変更して reload          | 両値を保持し、対応する日時だけが変化（SC-012, SC-016）                         |
| `/review/` へ移動して追加 filter                             | 2操作以内で到達し、要復習でない問題の混入0件（SC-017）                         |
| 新 catalog へ更新                                            | 既存 record は byte-equivalent、新 Problem は既定値・日時なし（SC-013）        |
| table を keyboard と Playwright の accessibility tree で操作 | row/column 見出し、問題、状態、要復習を識別可能                                |
| 320 CSS px の reflow                                         | 本文機能を失わず、長いコード・数式・表は枠内だけ横scroll可能                   |
| 100件以上を export、DB clear、preview、import                | 差分と方針を適用前に確認し、成功時100%一致、失敗注入時の部分反映0件（SC-018）  |
| IndexedDB 拒否                                               | 成功と誤表示せず、元の状態と対処案を示す                                       |

読書表示・新教材追加の回帰は[既存の検査表](../../../docs/operations/study-ux-regressions.md)に従う。既存画面の表示、新規原稿の教育品質、新教材への共通デザイン適用は[更新時の完了条件](../../../docs/operations/update-manual.md#新しい教材を追加するときの共通フロー)として別々に確認する。テスト成功だけから学習効率の向上を主張しない。
