# UI and Route Contract

**Version**: 1.0.0

**Rendering**: Astro/Starlight static output。本文と主要ナビゲーションはJavaScriptなしでも読める。

## 1. Routes

| Route | Source | Contract |
|---|---|---|
| `/` | generated | 対象範囲、標準学習経路、コンテスト索引、要復習一覧への入口、release情報 |
| `/learn/` | LearningUnit graph | 全体学習順、前提、順序理由、chapter/section/subsection階層 |
| `/learn/<unit-slug>/` | LearningUnit + docs | 成果、前提、用語、導入、例、問題、到達確認、前後ナビ |
| `/problems/` | public catalog | 全問題一覧と静的属性/学習状態の複合絞り込み |
| `/problems/<problemId>/` | Problem + Explanation | 問題情報、公式参照、解説、タグ、章、類題、学習記録 |
| `/tags/` | TechniqueTag | 深さ可変のタグ木、前提関係、別名検索 |
| `/tags/<tag-slug>/` | TechniqueTag + placements | 定義、成果、親/子/前提、代表・基本・発展問題 |
| `/contests/` | Contest + slots | ABC番号を行、E〜Hを列とする表と同内容の代替一覧 |
| `/review/` | catalog + IndexedDB | 要復習だけを初期表示し、追加条件で絞り込み |
| `/updates/` | Release history | 対象範囲、追加/変更/保留、taxonomy変更、検証日 |
| `/updates/<version>/` | Release | 個別release変更履歴と検証要約 |
| `/settings/learning-records/` | IndexedDB | storage状態、永続化要求、JSON export/import、merge結果 |
| `/data/catalog.json` | generated endpoint | [catalog.schema.json](./catalog.schema.json)準拠の公開カタログ |

すべてのHTML routeは末尾slashを正規形とし、GitHub Pages project base pathでも同じ相対関係を保つ。

## 2. 共通ページ契約

- `<html lang="ja">`、一意な`title`、一つの`h1`、main landmark、skip linkを持つ。
- パンくず、章ナビ、本文、補助ナビを意味のあるランドマークと見出しで区切る。
- JavaScript読込前にも本文、公式リンク、章/タグリンク、contestセルの意味を確認できる。
- 外部公式リンクはリンク目的にcontest/problem名を含め、外部であることをテキストまたはaccessible nameで示す。
- 図、表、数式、コード出力に必要な代替説明を付ける。装飾画像は空altにする。
- 状態やエラーを色、形、配置だけで伝えない。
- 日時は`<time datetime="RFC3339">`とし、画面上で日付、時刻、UTC offset、IANA timezoneを判別できる。
- Starlight/Pagefindの依存版、base path、CSPをrelease検証で固定する。

## 3. 問題詳細

表示順:

1. `ABC NNN E — 問題名`、掲載/保留状態
2. 公式問題への外部リンク、出典、最終確認日時
3. 学習記録control
4. 前提Unit、主/補助Tag、学習成果
5. 解説本文または公開保留理由
6. 主要解説との差分（similar/supplement）
7. 関連問題・章・タグ
8. skill name/version、review状態、revision

full explanationは次の見出しを持つ。

- 自然な考察手順
- 学ぶべきパーツの分解
- 正当性
- 計算量と制約整合
- 実装上の注意
- 例または検証手順
- コーチからのワンポイントアドバイス
- 出典と確認日

公式問題文や公式解説本文は掲載しない。

## 4. 学習記録control

### Status

- visible label: `解答状況`
- native `<select>` values: `未着手`, `挑戦中`, `修了`
- 変更成功時だけstatusと`statusUpdatedAt`を同じIndexedDB transactionで保存する。
- `needsReview`とその日時を読み書きしない。

### Needs review

- visible labelに必ず`要復習`を含むcheckboxまたはpressed button。
- toggle成功時だけ`needsReview`と`needsReviewUpdatedAt`を保存する。
- statusとその日時を読み書きしない。

### Feedback

- 保存中、保存成功、保存失敗を`aria-live="polite"`領域へテキスト通知する。
- IndexedDB拒否、quota、migration失敗時に成功表示しない。状態は画面上で元の値へ戻す。
- 日時なしは`更新記録なし`と表示する。
- `修了`かつ`要復習`は有効で、両方のバッジを表示する。
- ページ再読込時は同じoriginのrecordを復元する。

## 5. コンテスト表

- `<table>`、説明的`<caption>`、`<thead>`、ABC行の`<th scope="row">`、E〜H列の`<th scope="col">`を使う。
- 255行×4列を一つの表として扱い、必要ならページング/絞り込みしても見出し関係を維持する。
- 横幅が不足する画面では意味構造を壊さずtable領域を横scroll可能にする。
- 各problem cellのリンク名は例として`ABC 212 E — Safety Journey`のように単独で目的を判別できる。
- cellは問題名/識別子、教材route、解答状況、要復習テキストを同じproblem IDに結び付ける。
- `収録済み`, `未収録`, `作成中`, `公開保留`, `公式問題なし`, `公式取り下げ`を空欄なしで表示する。
- 表の直前または直後に、同じfilter結果をcontestごとの見出し付きlistとして閲覧できる代替表示を用意する。

## 6. 検索・フィルター

### Full-text search

- Starlight/Pagefindが公開本文、問題名、Tag、Unitを検索する。
- navigation、学習control、端末状態をPagefind indexへ含めない。
- 結果は問題/章/タグ種別と該当箇所を示す。

### Structured filters

`/problems/`, `/contests/`, `/review/`は次を組み合わせられる。

| Query | Values |
|---|---|
| `contest` | `abcNNN`または範囲 |
| `slot` | `E,F,G,H` |
| `tag` | TagId |
| `unit` | UnitId |
| `status` | `unstarted,attempting,completed` |
| `needsReview` | `1` |
| `publication` | 公開/作成中/保留/公式なし等 |

- 静的属性は`catalog.json`、個人状態はIndexedDBからproblem IDでjoinする。
- controlはすべてvisible labelを持ち、`適用`と`すべて解除`をキーボードで実行できる。
- 適用中条件、該当件数、0件理由をテキスト表示する。
- `/review/`は初期状態で`needsReview=1`を適用する。表または任意problem画面から2操作以内で到達できる。
- URL queryへ静的filterを反映する。端末状態の値そのものを外部送信しない。

## 7. 学習記録export/import

- exportは[learning-record.schema.json](./learning-record.schema.json)準拠JSONをBlob downloadとして作る。
- importは利用者が明示選択したlocal fileだけを読む。schema検証前にDBへ書かない。
- previewで新規、更新、同一、未知problem、invalid件数を表示する。
- conflict方針`newer-wins`, `backup-wins`, `cancel`を明示選択させる。
- import全体をtransactionで適用し、一部失敗時はrollbackする。
- 未知/withdrawn problem recordを削除せず、`過去の記録`として報告する。
- originが異なるlocal previewとPagesは自動同期しないことを画面で説明する。
- export/importに氏名、account、cookie、閲覧履歴を含めない。

## 8. エラー・保留表示

- 404は問題/Unit/TagのIDと検索/索引への戻り先を示す。
- `on_hold` problemは公開済み旧revisionが安全なら警告付きで維持し、新候補は表示しない。
- 技術的意味が変わる訂正時は`訂正確認中`と影響範囲を表示する。
- 外部source不能時も公式本文を転載して代替しない。確認日時と再試行/手動確認の必要を示す。
- JavaScript/IndexedDBが使えない場合、教材閲覧・静的検索/ナビは維持し、学習記録機能だけを利用不能理由とともに無効化する。

## 9. E2E acceptance matrix

| Flow | Expected observable result |
|---|---|
| contest表 → problem → Unit/Tag → 戻る | 全参照が正しく、base pathでも404なし |
| status変更 → needsReview変更 → reload | 両値を保持し、各日時は対応操作時だけ変わる |
| `/review/` + 追加filter | 要復習なしproblemの混入0、件数が一致 |
| 新catalogへ更新 | 既存record不変、新problemは既定値/日時なし |
| tableをkeyboard/screen readerで操作 | row/column見出し、問題、状態、要復習を識別可能 |
| 320 CSS px相当のreflow | 本文機能を失わず、二次元表だけ明示scroll可能 |
| export → DB clear → import | 全recordと独立日時を復元 |
| IndexedDB拒否 | 保存成功と誤表示せず、利用者に対処を通知 |
