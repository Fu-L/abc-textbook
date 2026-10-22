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

### 新しい教材を追加するときの共通フロー

Study UX
#123で確定した追加の入口は次のとおり。本文・分類の正本を編集し、既存の共通表示へ通す。生成済みHTMLやページごとのCSSを補修して追加を完了させない。

| 追加対象         | 準備・執筆する正本                                                                                                   | 生成・表示の入口                                                                                                                                    |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ContestとProblem | 公開済みbaseから公式metadata・Source Revisionとmetricsを取得し、candidateで解説・分析・主配置・関連先・問題順を編集  | 下のPR-08取得→PR-09の`abc:update --mode prepare`→執筆→`--mode validate`。問題本文は`renderProblemAuthoringDocument`で生成                           |
| Problemの本文    | `abc-explanation-author`の`SKILL.md`・執筆方針・full/similar/supplementテンプレートを読み、公式根拠から執筆          | `prepareExplanationAuthoring`が方針とtemplateのpathを返す。`validateAuthoringInput`・`validateAuthoringOutput`とreaderの往復で入出力を確認          |
| Unit             | taxonomyの所属・前提・問題集合と明示的な読書順・対象色を整合させ、概念・小例・操作・成立条件・計算量をMarkdownへ執筆 | `canonical-taxonomy-materialization.ts`の`renderLearningUnitDocument`でdraftを生成。`textbook-order.ts`・`unit-learning-targets.ts`も必要分だけ編集 |

小batch
CLIは既存taxonomyへの問題追加を扱い、新Unitの設計・登録や本文執筆を自動では行わない。新しい典型が必要なときは既存のTag/Outcome/Unitのschemaと3DAG・owner・関連先を確認して編集する。既存232単元・868問を表示のために一括再生成しない。

公開は`src/lib/catalog/full-public-projection.ts`の`loadFullPublicProjection`、`render-public-document.ts`、`TextbookLayout.astro`を共用する。問題は`ProblemExplanation.astro`、単元は`unit-reading.ts`、本文目次は`DocumentReading.astro`を通り、文字組みと横幅は`global.css`・`accessibility.css`を使う。数式は下の[記法](#数式とコードの記法)に従い、共通parserから静的MathMLへ変換する。分類や内部分析を冒頭文へ自動転用せず、表示上の節移動を元原稿へ書き戻さない。

追加・修正の完了では次の3点を別々に確認し、変更概要・検証結果・未解決事項をPRへ短くまとめる。別の台帳や人間承認は増やさない。

| 完了条件                     | 確認すること                                                                                                                         | 既存の検証・確認方法                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 既存本文の表示               | 対象ページの本文・数式・出典・旧anchor/リンク・問題順と必要な開閉・導線が保たれる                                                    | buildと内部リンク、対象の表示E2E。共通UI変更は`study-ux-documents.test.ts`・`study-readability.spec.ts`等を選び、代表画面と本文も読む                                          |
| 新規原稿の教育品質           | 核心→観察→次の一手の理由→手順を追え、成立条件・正当性・境界・全体計算量・復習の核が揃う                                              | Codexが公式根拠と本文を照合・検算し、schemaとauthoringの入出力・往復を確認。方針・テンプレート変更には#120の`explanation-writing.test.ts`・`explanation-writing.spec.ts`を使う |
| 新規原稿への共通デザイン適用 | 新Unit/Problemも通常の生成・執筆→公開投影→静的ページへ通り、本文・数式・コード・出典・学習位置・内部リンク・学習記録への移動を使える | #122の`new-material.spec.ts`。隔離fixtureをPCとJS無効のスマホで確認し、実際の追加ページも対象E2E・表示確認で確かめる                                                           |

自動テストは論証や文章の良さ、学習効率の向上を保証しない。新教材fixtureの成功を実公式取得・実教材の完成・公開成功に数えず、未改稿の既存本文まで執筆方針へ適合済みとしない。

最小検証は下の「変更に必要な検証を選ぶ」と[CIの分類表](development.md#変更範囲に応じたci検証)に従う。`verify:fast -- --base origin/main`は本文・データ・UI・執筆skillの変更で新教材E2Eを選び、skill変更では#120の執筆contractも選ぶ。方針・テンプレート変更時の`explanation-writing.spec.ts`は手動で追加する。UI変更時の拡大・配色検査、記録の保存形式を変えた場合のbackup検査などは該当変更だけに加える。同じ本番subpathのbuildをリンク・E2Eで再利用し、非公開文書だけの変更ではbuild/E2Eを要求しない。

問題解説の新規執筆では[`abc-explanation-author`](../../.agents/skills/abc-explanation-author/SKILL.md)の執筆方針と形式別テンプレートを毎回読む。`prepareExplanationAuthoring`も`writingPolicyPath`と`templatePath`を返す。冒頭の核心から、観察→次の一手の理由→必要な定義→手順と進み、正当性・全体計算量・典型の発動条件・復習の核を残す。既存の外側の節名は維持し、その内側へ定型の小見出しを一律に増やさない。完成unitを検証して`renderProblemAuthoringDocument`で生成し、readerで往復を確認する。[執筆例の比較](explanation-writing.md)と未公開fixtureは全問再生成の指示ではない。

方針・テンプレートの変更では`tests/contract/explanation-writing.test.ts`で新規のfull・差分解説を準備・生成し、schema・往復・共通rendererの数式と導線を検証する。`tests/e2e/explanation-writing.spec.ts`で同じ原稿を現行レイアウトへ置き、狭い画面・明暗・JS無効・参照元への移動を確認する。fixtureは教材・公開catalog・検索indexへ追加しない。通常buildと内部リンク確認には本番subpathを使う。

既存教材の文章改善は[読みにくさと最初の修正](content-readability.md)の症状・未修正箇所から小batchを選ぶ。未区切りTeXの候補数だけで優先順位を決めず、条件・状態・式を読めるか、着想から手順へつながるかを本文で確認する。生成器起因ならその正本を先に直し、執筆済み本文は一括再生成しない。正当性節を改稿するときは同居するclaimも一致させ、旧anchor・学習の位置・出典リンクを保持する。別の棚卸し台帳は作らず、修正前後・検証と未修正をPRまたは既存の比較文書へ短く残す。

### 数式とコードの記法

数式は本文中で `$$1\leq N\leq 2\times 10^5$$` のように明示する。独立した式は、 `$$`
だけの行で前後を囲む。独立した式の閉じ忘れ、明示した式中の未対応コマンド、`\\leq`
のような二重エスケープはbuildエラーになる。Markdown正本ではバックスラッシュを一つにする。JSON文字列のエスケープと混同しない。

| 意味                      | 記法                                               |
| ------------------------- | -------------------------------------------------- |
| 乗算・添字・冪            | `$$A_i\times B_j$$`、`$$u_{k-1}$$`、`$$2^{e(S)}$$` |
| DPの配列添字              | `$$dp[S][v]$$`                                     |
| 集合差・係数抽出          | `$$S\setminus\{v\}$$`、`$$[x^k](F(x))$$`           |
| C++・識別子・記号そのもの | インラインコード、または言語付きcode fence         |

単独の `$` はダミー文字や通貨にも使うため数式として解釈しない。数式内の日本語は `\text{…}`
で囲む。長い式は独立させ、必要なら `aligned`
で関係を揃える。幅を超える式はインライン・独立形式とも局所スクロールでき、Tabで移動して矢印キーでも読める。長い式は独立させる方を優先する。

コード・擬似コードの枠は原稿の改行と字下げを保ち、長い行を枠内で横スクロールする。Tab文字の表示幅は4文字分で、原稿のTabを空白へ置換しない。文章中のインラインコードは狭い画面で折り返す。表は日本語のセルを自然に折り返し、識別子などを含んで幅が必要なら表の枠内でスクロールする。表とコード枠もTab・矢印キーで操作できる。比較画面とトレードオフは[コード・数式・表の横幅](content-widths.md)を参照する。

従来の未区切りの
`*`、`_`、集合差、係数抽出式は文字として保持する。意味・式の範囲を確かめず、一括で区切りを付けたりバックスラッシュを削ったりしない。修正は公式出典と照合した少数の正本へ行う。原稿生成器は明示した数式内の係数抽出をMarkdownリンク用にエスケープしない。

`npm run notation:report -- path/to/document.md`
は行・列付きで未区切りTeX、曖昧なドル記号、不正な明示数式を報告する。引数なしでは全原稿を調べる。未区切りの候補は要確認として残し、不正な明示数式がある場合だけexit
1になる。自動修正や新しい台帳の保存は行わない。

公開rendererとAstro
Markdownは同じ数式parser・KaTeXの静的MathML出力を使う。ブラウザー用JS、数式用フォント、外部配信やCSPの緩和は追加しない。見た目はブラウザーのMathMLとOSの数式フォントに依存するため、依存更新時は
`tests/unit/document-notation.test.ts`、既存の記号保護テスト、 `tests/e2e/document-math.spec.ts`
で添字・分数・集合演算と狭い画面を確認する。

### Unit内の問題の挿入順

本教科書はABCの過去問を通じて典型知識を網羅的に身につけ、ARC・AGC・CF Div.
1・UCUPなどの難関コンテストへ挑むための教材である。Unit内の問題は**総合的な難易度の易しい順**に置く。分類先の選択と、選んだUnit内での挿入位置の判断はそれぞれ行う。

1. 新問と配置先Unitの既存問題・同時追加問題について、**配点、difficulty、出題位置（E/F/G/Ex等）、解法概要のすべて**を確認する。配点・difficultyは正本snapshotとその確認日、出題位置は公式task順、解法は検証済み分析・解説を読む。difficultyの`null`は不明であって易しさ0ではなく、実験値や開催時期による配点・出題位置の違いも考慮する。
2. 解法を未知問で発見するための観察、状態・式の導出、正当性の証明、必要な前提と複合手法、計算量の評価、実装・境界処理の負担を具体的に比較する。Unit全体の流れと挿入候補の前後を読み、より基本的な問題から応用・複合問題へ無理なく進める位置を各問について決める。指標が食い違う場合は解法のどこが難しいかまで確認する。
3. **単一指標、重み付き合計、辞書式キー等の1次元的な比較関数へ圧縮したソートは禁止**する。開催順、slot順、difficulty順、技能数順、常に末尾へ追加する処理で判断を代用しない。末尾が適切な場合も、既存問題との総合比較をした上で明示的に選ぶ。新問同士も取得順に置かない。
4. 小batchではcandidateの`src/content/learning-units/<Unit ID>.json`の`directProblemIds`へ主配置問題、`relatedProblemIds`へ関連問題の挿入位置を直接記す。新問を除くと元の配列と完全に一致するようにし、既存問題の相対順・所属を保つ。配置の理由と比較した前後の問題をPR本文または完了報告へ短く記す。別の証跡台帳は不要。

`abc:update --mode validate`はこの配列を編集結果として使う。主配置・関連先で必要な新問が未挿入なら`UNIT_PROBLEM_ORDER_REQUIRED`、重複・過不足・既存順や所属の変更ならschemaエラーまたは`UNIT_PROBLEM_ORDER_CONFLICT`として保留し、末尾へ補完しない。`problemIds`はhomeと子孫のcoverage集合であり、読書順の入力ではない。通常は編集不要でCLIが必要分だけ追加する。既に編集した場合も集合と既存相対順を検査する。

本文の「問題一覧」「関連問題」には、配列の順で新規リンクを挿入する。既存項目・説明・その他の本文はそのまま保持し、最初の主配置問題を追加する場合だけ定型の「この単元に直接配置する問題はありません」という案内を外す。candidateのUnit本文は元のままにするか、CLIが生成する挿入結果と一致させる。JSONと本文が異なる順序、既存文の編集、対象外のmetadata変更は`UNIT_CONTENT_CONFLICT`等で保留する。修復は元の本文へ戻して配列の新問位置を直し、同じ入力で再実行する。自動検証は順序の指定・整合性・互換性を確認するものであり、難易度判断はCodexが上の手順で行う。

### 公開済みbaseからの公式小batch取得（002 / PR-08）

既存の`corpus:acquire-metadata`に、公開済みcatalog/metadataと指定範囲を渡す。取得だけの入口であり、分類・本文・正本追加・公開は行わない。`abc:update --preview initial-v1`の成功をlive追加の確認に使わない。取得後の小batch編集・再実行は下のPR-09手順へ進む。

1. 公開先の`data/catalog.json`と`release-metadata.json`、または成功した同じPages
   artifactの両JSONを一時領域に取得し、metadataのSHA/runが実成功した配信を指すことを確認する。CLIは両schema、版・cutoff・変更概要、収録範囲と件数を照合する。配信artifactは公開後も`prepared`を保持するため、この欄だけで公開済みか判定しない。ローカルcandidateや旧Git
   catalogを公開baseの代用にしない。
2. 取得する開始・終了番号を明示する。baseの末尾以前は除き、残った連続範囲を一つのbatchとする。全範囲が収録済みなら`unchanged`で取得・出力を行わない。指定終了番号を最新回へ自動拡大しない。
3. 公式のrobots・利用規約・生成AI方針をCodexが確認する。既存policy入力が現行fingerprintと一致すれば再利用できる。不一致なら公式本文とリンク先の方針を読み、既存`corpus:policy-fingerprints`で一時入力を作る。人間承認は要求しない。正本の旧policyを今回の取得のために書き換えない。
4. checkout外の一時領域へ取得する。終了時刻、Dの位置、公式task
   orderとbaseのregistryとの整合を確認し、Dより後の全taskについて問題文・公式解説のSource
   Revisionを取得する。Exは表示記号から`_ex`を推測せず、公式リンクのtask
   IDを保持する。将来のI等も同じ規則で扱う。

ABC466までを収録する公開baseからABC467だけを取得する例（小batchなら`--last-contest 468`）。各コマンドが失敗したらそこで止め、古い一時入力で続行しない。

```sh
acquisition_dir=$(mktemp -d)
curl --fail --silent --show-error https://fu-l.github.io/abc-textbook/data/catalog.json -o "$acquisition_dir/catalog.json"
curl --fail --silent --show-error https://fu-l.github.io/abc-textbook/release-metadata.json -o "$acquisition_dir/metadata.json"
# 公式方針を確認してから、一時policy入力を作る。
npm run corpus:policy-fingerprints -- --generative-ai-url https://atcoder.jp/posts/1567 --user-agent 'abc-textbook/0.1.0 (contact: https://github.com/Fu-L/abc-textbook)' --output "$acquisition_dir/policy.json"
acquisition_checked_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
npm run corpus:acquire-metadata -- --base-catalog "$acquisition_dir/catalog.json" --base-metadata "$acquisition_dir/metadata.json" --first-contest 467 --last-contest 467 --policy-approval "$acquisition_dir/policy.json" --output-dir "$acquisition_dir/metadata" --cache-dir "$acquisition_dir/responses" --user-agent 'abc-textbook/0.1.0 (contact: https://github.com/Fu-L/abc-textbook)' --checked-at "$acquisition_checked_at"
```

完成した範囲だけを`abc467-abc467.json`等へ書き、失敗時は部分batchを出力しない。`checkedAt`、`termsCheckedAt`、公式task、source
ID/fingerprintは既存契約を維持する。raw
HTMLは明示した一時cacheだけに置き、取得JSONや本文を`src/content/`へcommitしない。専用live
CLIやqueueは追加せず、既存の直列取得・timeout・HTTP再試行を使う。

問題配置を検討する補助指標も、正本追加前に取得できる。既存の`corpus:acquire-atcoder-problems-metrics`へ完成したmetadata
batchを渡すと、その問題だけを公式task
IDで照合し、配点（`point`）・推定difficulty（`difficulty`）・実験段階の推定かどうか（`difficultyExperimental`）を既存snapshot形式で保存する。Exもmetadataの公式task
IDを使い、表示記号から推測しない。

```sh
metrics_checked_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
npm run corpus:acquire-atcoder-problems-metrics -- --metadata-batch "$acquisition_dir/metadata/abc467-abc467.json" --checked-at "$metrics_checked_at" --output "$acquisition_dir/metrics/abc467-abc467.json"
npm run corpus:verify-atcoder-problems-metrics -- --metadata-batch "$acquisition_dir/metadata/abc467-abc467.json" --snapshot "$acquisition_dir/metrics/abc467-abc467.json"
```

配点の取得元はAtCoder
Problemsの`merged-problems.json`、difficultyの取得元は`problem-models.json`であり、出典URLと指標の`checkedAt`も保存する。difficultyは公式配点とは別の推定値で、取得時の値を変換せず保持する。配点・difficultyだけで分類や読書順を自動決定せず、学習成果と前提を踏まえるための材料として使う。提供元の[API文書](https://github.com/kenkoooo/AtCoderProblems/blob/master/doc/api.md)に従い、直列のアクセス間に1秒より長い間隔を置く。

metadata
batchのschema・公式task対応を既存検証で確認し、応答にない値は`null`、値が0なら0を保持する。HTTP・接続・JSON・schemaの失敗はexit
2で止め、欠測扱いの成功snapshotを作らない。両応答の検証が終わってから一時snapshotを置換するため、失敗時には既存snapshotを保持する。指標は変化するので、再取得は新しい`checkedAt`で同じ一時出力を更新できる。これは公式metadataの上書きしない再実行とは異なる。

`--metadata-batch`を使う取得ではcheckout外の`--output`を必須とし、`src/content/`への書込みを防ぐ。引数を省略した従来の取得・検証は収録済みProblem全体を対象とする。小batchの指標を全体の正本snapshotに置換しない。取得済み指標はPR-09の準備で対象問題分だけ正本snapshotへ併合する。

| 保留                                      | 再試行                                                                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `CONTEST_NOT_ENDED`                       | 公式終了時刻を過ぎてから、新しい確認日時・一時領域で取得する。未終了を対象から黙って落とさない。                   |
| `D_TASK_NOT_FOUND`・`TASK_ORDER_CONFLICT` | 公式一覧と公開registryを照合し、parser/inputの矛盾を直して新しい一時領域で取得する。順序を推測して補完しない。     |
| `OFFICIAL_REQUEST_FAILED/REJECTED`等      | 報告されたURL/HTTP・接続を確認し、同じ範囲で再試行する。408/429/5xx等は既存client内でも既定2回まで再試行する。     |
| `POLICY_FINGERPRINT_CHANGED`              | 現行の公式方針をCodexが確認し、一時policy入力と確認日時を更新して再試行する。旧fingerprintを成功扱いで流用しない。 |

保留は`on_hold`・理由・再試行条件とexit
2で報告する。ABC316は既知の公式根拠（[ABC350 A](https://atcoder.jp/contests/abc350/tasks/abc350_a)）をその取得時に確認して欠番を記録する。404・timeout・根拠本文の欠落だけで公式欠番を作らない。欠番の根拠取得失敗もbatch全体を保留する。

同じbase・範囲・`checkedAt`・policyで再実行すると、既存の完成artifactをschema/意味検証し、`verified_existing`としてbytesを保持する。cacheは確認日時とpolicyに結び付き、policy確認はcacheを迂回する。未終了・parser/方針変更・内容の再確認では日時と作業領域を新しくする。同じ出力pathの異なる日時・不正artifactは拒否し、上書きしない。旧`--batch all|abc212-abc263`等の初版入口は保持し、live範囲引数との混在はexit
64で拒否する。

検証ではfixture
transportによるEx/将来I/公式欠番・失敗の網羅と、実公式ネットワークで取得した範囲を分けて報告する。取得成功は本文執筆・正本追加・公開の成功ではなく、SC-004/M5の実運用受入は別の教材変更依頼まで未達とする。復旧は取得consumerをrevertし、今回の一時領域だけを破棄する。

### 小batchの編集と再実行（002 / PR-09）

通常更新は次の4段階で進める。本文だけの訂正は既存正本を直接編集し、追加用CLIを使う必要はない。

1. **対象確認**: 訂正する問題と関連先を確認する。ABC追加では上記PR-08で公開済みbaseと終了済みの1
   Contestまたは連続する小範囲を取得し、同batchのmetricsも取得する。公開catalogと一致するcheckoutをbaseとし、最新回までの追加を要求しない。
2. **正本編集**:
   checkout外の一時コピーへmetadataを準備し、Codexが全対象の解説Markdown、分析JSON、配置を執筆する。主題は未知問で再利用する能力からsemantic
   primary Outcomeを選び、そのowner
   Unitへ置く。[Unit内の問題の挿入順](#unit内の問題の挿入順)に従い、主配置・関連先の問題配列へ新問の位置を明示する。共通手法だけで短縮解説にせず、成立条件・証明・全体計算量を比較する。
3. **必要検証**: 同じ入力で`--mode validate`を実行する。対象全件の本文・source/claim・分析・配置・前提と3DAGを確認し、主配置・関連Unit・親Unitの必要差分とtaxonomy
   indexを作る。既存本文・分類・読書順を保持し、候補をbuildして内部リンク・対象検索/関連導線・記録のテストを行う。
4. **報告／必要なら公開**: 一時コピーの`src/content/`差分を確認して対象batchだけcheckoutへ取り込む。検証結果・変更概要・未解決事項をPRへまとめ、公開を依頼された場合だけ標準Pagesの公開手順へ進む。fixture成功を数学本文の執筆や実公開の成功に数えない。

base
checkoutから次を実行する。`acquisition_dir`は上記取得時の一時領域で、`metadata/abc467-abc467.json`と`metrics.json`はそれぞれ完成したmetadata
batch・同batchだけのmetrics
snapshotである。小catch-upは取得時の上限とbatchファイルを同じ範囲へ変える。

```sh
candidate_dir=$(mktemp -d)
mkdir -p "$candidate_dir/src"
cp -R src/content "$candidate_dir/src/content"
npm run abc:update -- --mode prepare --candidate-root "$candidate_dir" --base-catalog "$acquisition_dir/catalog.json" --base-metadata "$acquisition_dir/metadata.json" --metadata-batch "$acquisition_dir/metadata/abc467-abc467.json" --metrics "$acquisition_dir/metrics.json"
# Codexがcandidateの解説・分析・配置policyと、対象UnitのdirectProblemIds / relatedProblemIdsを編集する。
npm run abc:update -- --mode validate --candidate-root "$candidate_dir" --base-catalog "$acquisition_dir/catalog.json" --base-metadata "$acquisition_dir/metadata.json" --metadata-batch "$acquisition_dir/metadata/abc467-abc467.json" --metrics "$acquisition_dir/metrics.json"
```

`prepare`は問題・Contest・slot・Sourceとmetricsを必要分だけ追加する。完了本文を自動生成せず、`AUTHORING_REQUIRED`の`on_hold`・exit
2を返す。この診断だけを執筆開始として扱い、その他の保留は理由を解消してから進む。`validate`は完成した解説のfrontmatter、分析の出典・解法・学習成果、既存taxonomyの配置を読み、生成差分を内部の一時コピーで検証してからcandidateへ反映する。配置policyの`placementDigest`は編集したplacementsから既存`canonicalDigest`で再計算する。旧sourceBuildや過去の訂正・判断は書き換えない。新しいmanifest/reviewや承認は不要。主・追加主Outcomeとprimary
Tag、補助Outcomeとsupporting
Tagは各役割内で双方向の対応を検査する。分析の全typicalTechniques・prerequisiteCandidatesには既習・同一Tag・主・補助・問題固有の分類判断を残し、各判断をanalysisEvidenceRefsに含める。重複判断や既習／問題固有とTag付き役割の矛盾を拒否し、problemSpecificInsightsの洞察と再利用可能な見方はadHocElementsへ保持する。これらは初版分類と小batchで共通の内容検証を使う。

新規本文は既存parserの`draft: true`表現を維持し、未検証claimを`verified`へ機械的に昇格させない。分析はCodexによる内容確認を済ませ、既存の`reviewStatus: reviewed`・未解決指摘0として入力する。これは人間承認の記録ではない。Unitの必要な問題集合・導線とtaxonomy
indexはCLIが更新するため、通常追加で既存Unit本文を再生成しない。既存の解説・Unit文章も訂正したい場合は別の訂正差分として検証する。

`validate`はbaseと内部の一時candidateをそれぞれ読み、candidateの全正本検証後はtaxonomy
indexだけを書き込む。その実ファイルの非空・JSON構文・正本から導いた値との一致を公開loaderと共通の関数で確認してから、candidateへ生成差分を適用する。索引確認のための全教材再読込は行わない。全量再読込が担っていたschema・ID/参照、本文/claim・出典、配置・3DAG・問題順、訂正対象・履歴の検証は書込み前の公開loaderと小batch検証に残す。通常の公開loaderは実索引の照合を既定で行う。

この再利用は同じCLI呼出しの同じ一時candidateで、検証後に正本を変更しない区間だけに限る。base・別root・次のCLI呼出しへ検証結果をcacheしない。次の実行では編集後の正本を読み直す。索引不一致・不正JSONは保留、欠落などのIO失敗は実行失敗として停止し、どちらも適用前のcandidateのbytesを保持する。

同じ公開base・取得入力・執筆済みcandidateで`validate`を二度実行すると`writtenPaths: []`となる。既存の取得metadataと異なる入力、対象外の本文/分類/指標変更、未知の追加は保留する。metricsは対象分だけ併合し、欠測`null`と0値、対象外の値・旧snapshotの確認日時を保持する。対象の新しい確認日時はProblemの`difficultyEvidence`へ記す。新記号の公式欠席slotは公式順から公開projectionで導出し、旧Contestのファイルを書き換えない。cutoffは初版cutoffと実収録Contestの終了時刻の最大値で、後続未着手Contestへ拡大しない。

未完成・取得不整合・source/claim不一致・配置/前提不整合は`on_hold`・理由・再試行条件・exit
2を返し、`validate`の生成差分をcandidateへ適用しない。全対象が完成するまで同batchを部分公開しない。使用法違反は64、読み書き等の実行失敗は70。候補への適用中にIO失敗が起きた場合はコピーを作り直して同じ取得入力から再実行する。候補の失敗は公開済み版を変えない。

通常追加のbuildでは、同じGit版の一時worktreeへ検証済みcandidateの`src/content/`をコピーし、既存のNode/npm依存を準備して、本番base
pathでbuildする。出力をリンク・E2Eで再利用する。`ABC_BATCH_TEST_PROBLEM=abc467-e`を指定した検索・学習記録E2Eは使い捨て追加fixture用であり、実教材の受入結果ではない。

batch取消は追加PRだけを`git revert <batch_commit>`し、必要な検証と標準Pagesで新SHAを公開する。後続の本文訂正や別batchをまとめて巻き戻さず、競合は対象IDと関連先で解決する。IndexedDBを削除・初期化しない。取消IDの学習記録はunknown/orphanとして値と各独立日時を保持し、再追加時に同じIDへ再接続する。

PR-09は実装と一時コピーの試験に限定する。実教材の訂正・1
Contest追加・公開は別依頼まで未実施で、SC-004とM5全体の実運用受入は未達である。

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

非公開の比較画像は、`docs/operations/`の次の既存ディレクトリ直下にある`.png`だけを文書assetとして扱う。
`content-readability`、`content-widths`、`document-contents`、`explanation-writing`、`problem-lists`、`problem-reading`、
`study-entry-points`、`study-indexes`、`study-ux-baseline`、`study-ux-math`、`study-ux-prototype`、`textbook-navigation`、`typography`、`unit-reading`。判定は`.github/actions/nonpublic-docs/paths.mjs`をrunnerと文書checkerで共用する。別の配置・拡張子は未知pathとして広い検査へ戻す。

これらの画像と既知の非公開文書の追加・修正だけなら、文書checkerで完了し、build・E2E・配信を選ばない。PNGは存在する通常ファイルかを確認し、Prettierには本文・JSONだけを渡す。変更Markdownのローカルリンク・画像・見出し参照に加え、既知の非公開Markdown全体から比較PNGへの参照も確認する。画像だけの変更や、未変更の文書からの通常リンク・画像記法・参照形式による参照切れも検出する。画像の削除・renameは広い検査を維持し、削除したpathをPrettierへ渡さずに参照検査も行う。画像を移動・削除するときは参照元も同じ変更で直す。教材・データ・UIとの混在は検査の和集合とし、mainでは最後の成功配信以降の未配信差分も合流する。文書画像だけのpushでも未配信の教材変更があれば必要な検証・配信を行う。空差分・差分取得不能・未知pathのfallbackは従来どおり維持する。

既存コマンドの例（すべてを毎回実行する一覧ではない）:

```sh
npm run schema:check
npm run check
npm test -- tests/contract/schema-parity.test.ts tests/unit/domain-invariants.test.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run build
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run link:check:built
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/learning-records.spec.ts
```

小batchテストの準備は`tests/fixtures/small-batch.ts`の`createSmallBatchFixture`をsuiteの`beforeAll`、または新教材buildの1回のlifecycleで作る。現行本文から`usePreparedRelease: false`で読んだbaseと執筆素材をその範囲で再利用し、合成取得は同じContest範囲につき1回とする。凍結済みcatalogやmodule/process全体のcacheへ置き換えない。返すcatalog・metadata・metricsの入れ子は毎回複製し、candidateのファイルも別コピーにする。異常群で既に共有している執筆済み開始点は維持し、`copySmallBatchCandidate`で各ケースへ複製する。コピーは各worker内で順次実行し、`cpSync`でファイル単位の非同期処理を減らす。`COPYFILE_FICLONE`は非対応filesystemでは通常コピーへ戻り、hardlinkで変更可能なbytesを共有しない。CLI/validatorの結果は共有せず、保留理由・bytes不変・正常な再実行差分0を毎回確認する。

準備helperを変えた場合は`small-batch-fixture.test.ts`、`update-prepare.test.ts`、`update-validation.test.ts`と、同じhelperを使うChromiumの`new-material.spec.ts`を検証する。順序依存は異常群の単独実行と`--sequence.shuffle.tests --sequence.seed=147`でも確認する。準備時間の比較は同じ範囲・回数でfactory作成からcandidate複製・執筆までを含め、読込/合成取得/全量コピーの回数と残る負担をPR本文に記す。ファイル別時間やActions全体のwall
timeとは分け、並行度・timeout・検査内容を変更して得た短縮と混ぜない。

buildは一度行い、同じ出力へのリンク・E2E確認には`:built`を使う。E2Eの環境・fixtureは`playwright.config.ts`と対象テストに合わせる。変更で検出すべき不具合に合わせてテストを選び、無関係な数学回帰や全件監査を繰り返さない。他ブラウザー固有の挙動、広範囲のschema・共通処理・依存変更では必要な検証を追加する。必須検査が失敗したら原因を修正し、影響する検査を再実行する。

文字組み・配色の正本は`src/styles/global.css`、配置・狭い画面の指定は`src/styles/accessibility.css`。独自の`TextbookLayout`には`body.textbook`で本文スタイルを適用し、Starlight向けの変数定義だけで表示を確認したことにしない。初期配色はOSの明暗設定にCSSで追従する。変更時は`tests/e2e/accessibility.spec.ts`で文字組み、両配色のコントラスト、JS無効の本文、狭い画面のreflowを確認し、
[代表画面の比較](typography.md)のように本文と見出しを実際に読む。画像の全件更新は不要。

代表ページで情報順・文章を比較するときは[読みやすさの試作](study-ux-prototype.md)を参照する。
`STUDY_UX_PREVIEW=1`はローカルbuildで4ページだけを試作用にする。問題ページの情報順は#113、単元の情報順と代表2単元の文章は#114、問題一覧は#115、ページ内目次は#117で通常buildにも採用済み。試作変数による本文の差し替えは問題の代表原稿に残り、単元の一覧とページ内目次は通常表示と共通である。残る試作原稿を`src/content/docs/`へコピーしたり、公開workflowへ試作変数を追加したりしない。比較には同じ本番subpath・画面条件を使い、`tests/unit/study-preview.test.ts`と
`tests/e2e/study-preview.spec.ts`で対象限定、旧anchor・情報・問題順、導線を確認する。試作を変更したときだけ通常・試作の両モードで対象E2Eを実行し、採用候補と保留点をPRに記す。

問題詳細は`src/components/ProblemExplanation.astro`を共用し、公式問題→問題固有の解法の核心→考察本文を先に置く。[問題ページの情報順](problem-reading.md)を参照する。核心は正本Markdownの「考察」の冒頭に、未定義の記号を使わず、着想と必要な理由を伝える短い段落として執筆する。内部分析の`reasoningPath.algorithmConnection.text`や分類用Outcomeを自動転用・切り詰めして導入にしない。導入を改稿していない問題も、その原稿の考察から読み始める。分類・既習技能・執筆情報と原稿の「学習の位置」は末尾の開閉欄へ保持する。この移動は表示処理で行い、正本本文へ反映しない。fullは完全解説、similarは差分解説、supplementは補足解説として案内し、短縮形式は共通rendererが冒頭へ参照元fullのリンクを出す。新問にも通常の公開フローでこの表示が適用され、個別のHTML/CSSは不要である。

共通問題レイアウトを変えたら`tests/unit/problem-reading.test.ts`と`tests/e2e/problem-reading.spec.ts`で本文・全anchor/リンク・計算量・出典の保持、旧fragmentへの移動、JS無効時の開閉、学習記録への移動を確認する。両テストはUI変更の`verify:fast`に含む。学習記録の見出しはAstro側に置き、JSの初期化前にも冒頭リンクから到達できるようにする。保存処理やIndexedDB・backup形式は別の正本を維持する。

単元ページは正本Markdownの概要・考え方・成立条件と計算量から読み、問題一覧へ進む。共通の`src/components/unit-reading.ts`が対象色・学習成果・前提・出典と内部識別子を末尾の開閉欄へ移し、関連問題も開閉式にする。本文に必要な仮定・証明・計算量は折り畳まない。章目次はPCで本文横、狭い画面では冒頭の開閉欄から使う。冒頭リンクと旧fragmentで前提へ戻れる。表示のために232単元のMarkdownを並べ替えない。

章・単元の目次と前後移動は`TextbookLayout.astro`、`TextbookContents.astro`、`src/components/textbook-navigation.ts`を共用する。`TEXTBOOK_CHAPTERS`の掲載順だけを使い、章をまたぐ前後ページも同じ順にする。パンくずは掲載章と現在単元を示し、概念上の親や前提DAGを変更しない。現在章だけを初期展開し、現在リンクを文字の太さ・下線・背景・線で示す。64rem未満は目次を閉じ、JS無効時は画面幅によらずnative
detailsを手で開く。JSはPCの初期展開・画面幅変更と目次内の現在位置へのスクロールだけを補助し、保存領域を使わない。旧`#unit-contents`は保持する。詳細と比較画像は[章・単元のナビゲーション](textbook-navigation.md)を参照する。

目次を変えたら`tests/unit/textbook-navigation.test.ts`で全232単元の掲載順・章境界・先頭末尾と概念上の親との区別、`tests/e2e/textbook-navigation.spec.ts`で現在位置、長い章のスクロール、JS無効、キーボード、狭い画面と前後移動を確認する。両方をUI変更の`verify:fast`に含める。既存の単元・アクセシビリティ・検索E2Eも同じ本番subpathのbuildで確認し、正本本文や学習記録形式は変更しない。

ホームの3入口と収録情報は`src/pages/index.astro`、分野別目次は`src/pages/learn/index.astro`を編集する。章の短い狙いは既存catalogの`learningRationale`（UIの`outcome`）、単元順と詳しい読書案内は`TEXTBOOK_CHAPTERS`、対象色と理由は`unitLearningTarget`を使う。表示のために本文を再生成しない。詳しい読書案内・対象色の理由・概念上の親は章ごとの開閉欄に残す。`tests/e2e/study-entry-points.spec.ts`をUI変更の`verify:fast`に含め、3入口、保存した要復習問題への導線、全章のanchorと単元順、JS無効での開閉を確認する。[入口画面の比較](study-entry-points.md)に表示上の判断とトレードオフを記す。

本文内の目次は共通の`DocumentReading.astro`が表示後のh2〜h6から作り、分類・前提などの開閉欄を除く。見出しが3個以上のときだけ表示する。80rem以上は本文右、狭い画面では開閉式の一行とし、章と単元の目次とは区別する。JSはPCでの展開と狭い画面での選択後の折り畳みを補助する。狭い画面の固定表示は選択後に閉じる処理の初期化後に有効にし、深い節で開いても選択肢を画面内へ保つ。JS無効時は冒頭の通常配置でnative
detailsとfragmentリンクを使い、開閉で配置を切り替えず、移動先の本文を覆わない。回帰テストでは320・390・720pxの深い節でsummaryを実座標でタップし、リンクを操作する前にメニュー全体がviewport内にあることを検査する。リンクのclickやfocusによる自動スクロールだけで表示確認を済ませない。新しい見出しも原稿の順で反映されるので、手書きの目次を本文へ重ねない。

見出しの節リンクは`render-public-document.ts`で付ける。既存のslug・重複見出しのsuffixは変更せず、通常のfragment遷移・履歴とキーボードfocusを使う。`tests/unit/document-contents.test.ts`と`tests/e2e/document-contents.spec.ts`をUI変更の`verify:fast`に含め、見出し順、旧anchor、直接リンク・戻る/進む、JS無効、狭い画面とキーボードを確認する。本文の見出しを追加・変更したときも目次E2Eを実行し、項目数を固定せず、本文の対象見出しと目次のリンク先が順序も含めて一致することを検査する。比較画像と配置のトレードオフは[本文のページ内目次](document-contents.md)を参照する。

新しい単元も既存のtaxonomy生成と通常の執筆・公開フローを使う。`renderLearningUnitDocument`は概念の定義を先に置くdraftを作り、内容に合う導入・小例・操作・成立条件を正本Markdownへ執筆する。分類用Outcomeや対象色の理由を導入へ自動転用しない。生成器が完全な教材本文を自動執筆するわけではない。表示の開閉・配置は共通処理が担当し、生成物だけのHTML手修正やUnit
IDごとの分岐は不要である。詳細とトレードオフは[単元ページの情報順](unit-reading.md)を参照する。

単元の共通表示や生成器を変えたら`tests/unit/unit-reading.test.ts`、`tests/contract/canonical-taxonomy-materialization.test.ts`、`tests/e2e/unit-reading.spec.ts`で本文・数式・旧anchor/リンク・問題順、生成draftの情報順、章・案内節・未改稿単元、JS無効とキーボードでの開閉を確認する。unit/E2EはUI変更の`verify:fast`に含む。build・リンク確認は本番subpathで行い、同じ出力を再利用する。

単元の「問題一覧」「関連問題」とタグページの問題列は`src/components/problem-list.ts`を使う。問題名は内部解説へ、「公式問題」は出題元へ進む。主配置では他単元との組合せ、関連問題では主題の単元を短く示し、元の主題・追加技能・既習技能・補足は各行の「技能・出典」で開く。掲載順・所属・本文の正本は変えず、`canonical-taxonomy-materialization.ts`や追加CLIの出力を表示用に一括再生成しない。新問も既存のMarkdownリンクと分類から同じ表示になる。タグの代表問題は既存metadataの選択だけを使い、導入タグの代表例を誤って主タグ・補助タグと表示しない。新しい代表・発展ランクは作らない。比較画像とトレードオフは[問題一覧の表示](problem-lists.md)を参照する。上記のUnitテストは全232単元・868問と全タグの問題集合・順序、元の説明・補足・参照の保持を確認し、E2Eは両導線と行単位の開閉も確認する。

単元本文を変更した場合は`tests/integration/full-learning-path.test.ts`も実行する。`verify:fast`は`src/content/docs/learn/`の変更で同テストを選択する。導線検証は「根拠」節の既存出典とtaxonomy識別行の保持を確認し、執筆に必要な出典の追記を許容する。「問題一覧」「関連問題」は各行の先頭リンクのURL列を節ごとに照合し、所属・順序・重複の有無を保持する。役割の説明や補足文は改稿できる。章目次は引き続き受理済みの内容と順序を照合する。改稿のために既存本文を生成draftへ戻したり、過去の証跡を再生成したりしない。

冒頭の対象色の理由を改稿するときは、`src/lib/taxonomy/unit-learning-targets.ts`の該当Unitの理由も同じ文へ更新する。対象色・レーティング帯と理由の一致は`full-learning-path.test.ts`、生成draftへの反映は`tests/contract/canonical-taxonomy-materialization.test.ts`で確認する。

問題検索・タグ・コンテスト索引の表示は`ProblemFilters.tsx`、`src/pages/tags/`、`ContestMatrixView.astro`、`ContestProblemCell.astro`と`study-indexes.css`を編集する。検索の条件・query値・適用と解除の意味は維持し、学習記録の条件は開閉欄に置く。queryで学習状況・要復習を指定した場合は初めから開く。JS無効時はフォームを無効にし、全問題の静的リンクを使う。タグの定義と手掛かりは常時表示し、分類・前提・学習成果はnative
detailsに保持する。コンテスト表は問題名から解説へ進み、各セルの「学習のつながり」で本文anchor・単元・全主タグと補助タグ・類題へ進む。縦の代替表示もnative
detailsで開ける。公式順・欠番・状態・既存anchorを表示都合で再計算しない。

これらを変更したら`tests/e2e/study-indexes.spec.ts`、既存の`contest-matrix.spec.ts`・`search.spec.ts`・`full-projection.spec.ts`で複合条件・URL復元・学習記録・JS無効・狭い画面・Pagefind・表と代替表示を確認する。新しい索引E2EもUI変更の`verify:fast`に含む。定義・問題集合・内部/公式リンクを保持し、正本教材の再生成は行わない。[索引の比較とトレードオフ](study-indexes.md)を参照する。

索引の表示幅検査は配色・幅ごと、axe検査は配色・ページごとの独立したテストにする。複数画面の巡回と全ページのaxe検査を一つの30秒制限へ詰め込まず、検査範囲と各テストの制限を維持する。

コード・数式・表の幅を変えた場合は`tests/unit/public-document.test.ts`と`tests/e2e/document-widths.spec.ts`で原稿の文字保持、狭い画面での局所スクロール、表の構造、Tab・矢印キー、JS無効の表示を確認する。後者はUI変更の`verify:fast`にも含む。テスト用原稿は`tests/fixtures/documents/widths.md`に置き、教材や検索indexへ追加しない。数式の配置変更では既存の`tests/e2e/document-math.spec.ts`も使う。

表示回帰の検査範囲と実行方法は[読書表示の回帰検査](study-ux-regressions.md)を参照する。`tests/unit/study-ux-documents.test.ts`は代表原稿の数式・code
fence・anchorを軽量に検査し、`tests/e2e/study-readability.spec.ts`は代表3ページの200%文字拡大・reflow・両配色のaxe・キーボードを確認する。`tests/e2e/new-material.spec.ts`は隔離した新Unit/Problemを生成・執筆・公開投影・通常の静的ページへ通し、PCとJS無効のスマホで本文・出典・学習位置・内部リンク・学習記録への移動を確認する。教材・データ・UI・執筆skillの変更で新教材E2Eを選び、UI変更では拡大検査も選ぶ。全ページのブラウザー撮影や画像snapshotの一括更新は追加しない。

学習記録の絞り込みも単元のcoverageを利用する。`src/lib/learning-records/`の変更では保存・日時・backupに加え、`tests/integration/full-public-projection.test.ts`と`tests/e2e/full-projection.spec.ts`で葉単元・親単元・章の問題一覧と復習一覧を確認する。`filter.ts`単独変更でも`verify:fast`は両方を選ぶ。

新教材E2EはPlaywrightの`globalSetup`（`tests/fixtures/study-ux/setup.ts`）で、ブラウザーworkerの開始前に隔離buildを一度準備する。同じCLI引数の`--list --reporter=json`でPlaywright自身にテスト選択を解決させ、新教材テストがなければ準備を省略する。この一覧取得ではsetup・server・browserは起動しない。新教材単独・他の選択E2E・Chromium全体とも既存のコマンドを使い、事前の手動準備は不要である。

```sh
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/new-material.spec.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium tests/e2e/unit-reading.spec.ts
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run test:e2e:built -- --project=chromium
```

上記は同runで通常の`build`または`check`→`build:checked`が成功していることが前提。setupは毎run新しい`build/study-ux-*`を作り、prepare・執筆・validate、正本コピー・Unit生成、実Astro
buildを行う。代表2ページのHTMLと同じbuildのassetsだけをブラウザーへ渡し、同runのworker・retry間で共有する。CLIの契約に従いcheckout外のシステム一時領域に作ったcandidateは準備後に削除し、隔離project/distはglobal
teardownで成功・テスト失敗時とも削除する。準備失敗も一時領域を削除して非zeroで停止し、ブラウザー検査へ進まない。古い環境変数のdistや別runの出力は使わず、永続cacheを作らない。強制kill等で残った`build/study-ux-*`は実行中のrunがないことを確認して削除できる。

`New material ... started/finished`は準備全体とprepare/author/validate・copy/generate・Astro
buildの時間・成否、Playwrightのテスト結果は画面検査の時間・成否を示す。setupの診断ログは標準エラーへ出し、`--reporter=json`の標準出力を維持する。画面検査は通常の30秒制限へ戻し、retryは変更しない。準備・一覧取得を含むE2Eコマンド全体と依存準備から必須検証完了までのwall
timeを別に測り、画面検査だけの短縮をCI全体の高速化へ換算しない。選択・準備失敗・worker間共有・成功/失敗後のcleanupは`tests/integration/new-material-setup.test.ts`で検証する。

新教材E2Eの隔離buildは、`src`・`scripts`に加えて、runnerが参照する`.github/actions/nonpublic-docs/paths.mjs`もコピーする。共通モジュールの依存先を追加・移動した場合は`tests/fixtures/study-ux/build.ts`のコピー対象も確認し、`new-material.spec.ts`で実際のbuildと表示を検証する。

`verify:fast`は[分類別の検証表](development.md#変更範囲に応じたci検証)に従い、PRのmerge-baseまたはmain
push前のSHAとの差から必要な検査を選ぶ。複数分類は和集合、renameは削除・追加の両pathを扱う。未知path・取得不能・空差分・非公開文書の削除は広い検査へ進む。通常経路からpreview凍結・全shard再join・毎回の初版監査・release/review照合・一律の数学回帰を外した。既存の正本loaderのschema、ID・参照・3DAG・配置・本文・リンクと対象挙動の検証は残る。

```sh
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run verify:fast -- --base origin/main
SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm run verify:fast -- --all
```

ローカル`--base REF`はtrackedの作業差分と未追跡ファイルも含める。ActionsではcheckoutしたSHAとのcommit差分を使う。`--all`またはローカル差分未指定は広い検査。未知引数は使用法違反で停止する。失敗はexit
2、使用法違反64、signal/実行不能70で後続を止める。非公開文書だけは書式・リンク・見出し・feature選択を検証し、build・E2E・browser準備を実行しない。

既知の本文・読書表示テスト9本の追加・修正は[開発手順の対応表](development.md#既知の本文読書表示テストの対応表)で検査を選ぶ。対象は`content-readability.test.ts`、`problem-reading.test.ts`/`.spec.ts`、`unit-reading.test.ts`/`.spec.ts`、`document-contents.test.ts`/`.spec.ts`、`study-ux-documents.test.ts`、`study-readability.spec.ts`。変更したテスト自身と対応する本文・表示・導線検証を実行する。公開本文の変更ではページ目次E2Eも選び、最終本文の見出しと目次・anchorの一致を確認する。

対応済みテストの削除・rename、共有fixture・setup・Playwright/Vitest設定、未対応テスト、schema・共通処理・依存・workflowを含む場合は広い検査を維持する。複数分類とmainの未配信差分は和集合で扱う。同じrunで型検査した後に一度だけbuildし、その成果物をリンクと対象E2Eへ再利用する。対象一覧と選択契約を変えたら、`tests/contract/verify-fast.test.ts`と上の対応表も更新し、対応する実テストを実行する。

Actionsログには比較元と未配信差分、選択したstepのコマンド・全引数、広い検査へ戻った理由を出す。`Verification planned`は予定、`Verification started/finished`は実際に実行した処理である。終了行の`elapsed_ms`は単調時計による計測で、失敗・signal・実行不能でも記録する。後続の未実行stepを成功として扱わない。

Node.jsの基準版は`.nvmrc`（26.12.1）、npmは`package.json`の`packageManager`（11.16.0）に従う。Node.js更新時は`.nvmrc`、`package.json`の`engines`/`devEngines`、lockfileのroot
`engines`、開発手順を揃える。両workflowは`.nvmrc`を読み、CIのstep名も基準版に合わせる。基準版で`npm ci`と共通変更の広い検査を実行する。過去の検証記録にある実行版は書き換えない。

CI全体の比較は既存Actionsの`Set up Node.js 26.12.1`開始から`Verify changed scope`完了までとし、runner内の時間とは区別する。queue・checkout、検証後のartifact保存・cleanup・deployは除外し、並列テストの時間を合算しない。ログの読み方と計測の限界は[開発手順](development.md#actionsで検証時間を読む)を参照する。実測はPR本文とActionsログへまとめ、計測専用の台帳を作らない。

2026-10-19の[改善後の実測とSC-005](development.md#改善後の実測とsc-0052026-10-19)では、#143〜#148のmain反映と代表Actionsの選択・時刻を確認した。通常本文訂正・問題追加の同条件の前後各5件は揃わず、SC-005は未達・比較母集団不足である。採用改善自身の共通処理runや文書だけの17秒を通常更新の短縮実績へ流用しない。#148最終PRは成功したが、観測時の同mainは進行中であり、配信成功を補作しない。

次の#140の本文改稿、#141の1
Contest追加・小catch-upで自然に発生した成功runを、文書のみ・本文訂正・問題追加・UI・schema/共通処理に分けて確認する。PRと未配信差分を合流するmain、変更規模・選択検査が異なるrunも分ける。runのSHA（PR
headと検証merge refを区別）、分類、選択した検査、依存準備開始/最後の必須検証完了とwall
timeをActionsとPRへ短く記す。新教材のsetup・隔離build・fixture
cleanupは必須検証時間に含める。前後各5件が同条件で揃った場合だけ中央値と短縮率を計算し、10分以下かつ50%以上短縮を判定する。移行前が不足なら短縮率は未判定とする。計測のための教材変更・run再実行は行わず、不足報告で#149を完了できても#142/SC-005/002全体を達成済みにしない。教材改稿・追加は止めず、追加最適化の調査候補は親#142へ残す。

初版の互換回帰は、旧catalogを最後に保存したGit版の入力を`tests/fixtures/legacy-seed.ts`で一時repositoryへ復元し、現在のconsumerで検証する。後から追記した公開履歴を初版のfingerprintへ混ぜず、旧証跡を書き換えたり再生成したりしない。不正fingerprint・本文変更・不正inventoryの拒否は同じfixture内で確認する。現行教材のcompleteness監査は`usePreparedRelease: false`で正本を読み、公開履歴の表示テストは現行indexの順序・URL・件数との一致を確認する。通常CIの検査を除外して失敗を隠さない。

旧bootstrapのfingerprint再構築では、対象色・レーティング帯・理由も復元した当時のUnit本文から読む。現在の`unit-learning-targets.ts`の編集を過去のfingerprintへ混ぜない。`seed-release.test.ts`は現在の対象色定義を差し替えても旧bootstrapを検証でき、不正fingerprintと本文変更を引き続き拒否することを確認する。

`full-public-projection.test.ts`の旧記法エスケープ検査は、現行原稿の該当行をすべて表示と照合し、検査対象が空でないことを確認する。本文改稿で変わる該当文書数・行数は固定しない。記法自体の固定例と集合差のバックスラッシュ保持は`public-document.test.ts`で検証する。

代表問題の冒頭文を改稿したら、`tests/e2e/problem-reading.spec.ts`にある期待文も同期する。該当問題を含む同specで、明暗・PC/スマホ・JS無効時に本文が表示され、導入全体が最初の画面に収まることを確認する。

旧inventory互換経路のprotected-base本文は、`git ls-tree -r -z`で固定commitのpathとblob
IDを列挙し、32件ずつ`git cat-file --batch`で読む。ファイルごとのGit起動を減らし、各ファイルのSHA-256・byte長・Git順序は保持する。作業treeや前回の検証結果を代用せず、欠落object・不正なbatch応答は停止する。この読込を変えた場合は`tests/unit/base-content-inventory.test.ts`、`tests/unit/seed-release.test.ts`、`tests/unit/evidence-inventory.test.ts`、`tests/integration/catalog-cli.test.ts`で、binary・空ファイル・特殊なpath・複数batch・旧正常入力と不正入力拒否を確認する。mainで発生したseed互換テストの120秒timeoutに対する修正であり、timeout・retry・検証範囲は変更しない。

小batchの分類回帰では執筆済みの開始fixtureだけを共有し、各異常ケースは元のpolicy・本文から編集して独立したテストとして実行する。複数回の全量検証を1本の5分制限へ詰め込まず、各ケースの保留理由と候補のbytes不変を確認する。

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
4. `protected-main.json`と`ci.yml`の同名baseline依存を揃え、標準deployが失敗・cancel・未完了checkを拒否することを確認する。
5. 実設定とdeploy参照が一致した後に旧通常jobを外す。初版監査・他browser・数学回帰の手動入口は保持する。権限不足なら旧job削除を保留する。

復旧は旧checkを実行するworkflowへ戻してから実required設定を戻す。通常の削除後に旧名だけを先にrequiredへ追加すると、そのcheckが生成されずmergeを止める。

初版監査workflowは`workflow_dispatch`だけで起動する。明示的な監査では3browserと全工程を用意する。旧手動Production
deployはPR-07bで撤去した。初版監査等で3browserが必要な場合の準備scriptは`test:e2e:install:all:ci`を使う。数学回帰は既存の`docs/verification/bootstrap/pr65*-mathematical-checks.py`から関係するものを選んで直接実行する。

公開loaderの初版受入台帳依存はPR-04で、通常catalog
CLIのinventory必須はPR-05で外した。旧release/deployの証跡依存とprepared版のsnapshot照合は後続PRまで残る。本文を正本から検証できることと、訂正を通常経路で公開できることは別である。初版監査の明示的な再実行は[既存監査手順](initial-release-verification.md)、旧prepared
catalog/deployの復旧は[公開引継ぎ](deploy-before-catch-up.md)を参照する。監査CLIの全工程は通常runnerから独立して保持し、旧出力をdigestだけ書き換えて通さない。

旧seed agent結果の更新・読込は、現行憲章の「III. Codex-Only Work Guided by a
Manual」を運用方針として認識する。削除済みのIssue
#53限定見出しを復活させない。憲章3.0.0固定の照合を持っていた旧human merge-review
validatorはPR-10bで削除した。seed
agent経路では既存結果に結び付いた現行憲章の方針・bytesを確認する。既存schemaとseedの対象制限、本文・check・監査結果との照合は保ち、人間承認を表す結果は作らない。

## 4. 互換性と見やすさを確認する

既存Problem
IDとURLを維持し、執筆済み本文を削除・再初期化しない。教材の分類変更でも学習記録の値と独立した日時を変更しない。IndexedDBのDB名・version・keyとbackup形式を維持する。保存形式を変える場合は旧データを読み込む移行・復旧手順を先に用意する。他人のブラウザー内データを検証fixtureに使わず、使い捨てcontextを使う。

表示へ影響する変更は、対象ページの数式、読書順、内部導線、狭い画面、必要な操作を確認する。無関係な画面まで総当たりする義務はない。

Study
UXの表示改善では、[読書体験の診断と比較基準](study-ux-baseline.md)から対象の代表ページと読み取りタスクを選び、同じviewport・配色・開始位置で変更前後を比較する。数式の表示不具合と発想・証明の説明不足を分け、読者の主観回答や学習効果が未確認なら明記する。変更に関係する比較だけPRへまとめ、全ページの画像や別の管理台帳は作らない。

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
entry/pageへ登録しない。writerはPR-07bで実配信入力の追記へ移行した。実indexは実main配信・公開確認後の独立した履歴PRで更新する。

通常のローカルbuildはrun入力を要求せず、履歴末尾の版、空indexなら`docs/verification/releases/catalog.json`の`release.version`識別子だけを使う。基準版不足は失敗。正本から`publicationStatus: prepared`のcandidateを作り、旧snapshot/review/check結果を流用せず、metadataを生成・コピーしない。build終了時に古いmetadataも除去する。ローカルcandidateを配信済み版のartifactとしてupload・履歴登録しない。

公開確認ではPages/Actionsの成功と、配信した`/data/catalog.json`・`/release-metadata.json`の版、SHA、run
URLを照合し、代表問題・単元・検索・要復習・設定・過去履歴を開く。metadataの存在だけで成功としない。artifact名にはSHA/run/attemptを含め、検証済みの同一成果物だけを配信する。標準artifactは7日保持し、成功後の同じ作業内で後続履歴用の両JSONを取得する。

### 実配信済み版を履歴へ追記する（002 / PR-07b）

`release:history`は標準Pagesの成功済みmain
runを1件指定し、既存indexへ追記する。旧`--releases`、`--updates`、`--hold-output`、`--catalog`、`--host`引数は廃止した。保留試行の管理projectionを通常の履歴追記へ混ぜない。GitHub
CLIの読取権限と、対象SHAを含むGit履歴が必要。

1. 対象runの`CI`・main push・成功、同SHAのbaseline/deploy
   job成功と`github-pages`の成功statusを照合する。statusのrun/job
   URLも一致させる。未知commit・PR・失敗・cancel・未完了は拒否する。
2. 成功したdeploy
   jobの標準ログにあるartifact名を使い、配信した同一artifactから`data/catalog.json`と`release-metadata.json`を一時領域へ取得する。deployだけの再実行でも、run
   attemptからartifact名を作り直さない。
3. 両schema、run作成UTC日付/run IDの版、metadata SHA/run
   URL、catalogのcutoff・収録範囲・変更概要を確認する。Git内の旧prepared
   catalogや現在の正本から新版を再生成しない。
4. ログ・artifactを取得できなければ、現在配信中の両公開JSONを同じ条件で照合する。別版・不一致・取得したJSONの不正は拒否し、取得不能とは区別する。双方取得不能は`deferred`（exit
   2）でindexを変更せず、配信済み・履歴追記保留と報告する。
5. 旧entryの値・順序・URLを保ち、成功順に追記する。既存の同版/SHA/run・cutoff/範囲/概要は`unchanged`でbytes差分0。不一致は拒否する。最後の成功配信との差がindexと非公開文書だけの配信は`history-only`で追加しない。比較不足は通常配信として扱う。

まず既存indexの一時コピーで確認する。実indexの変更は、対象版の実配信成功・公開確認後の独立した履歴PRで行う。

```sh
cp src/content/indexes/release-history.json /tmp/abc-release-history.json
npm run release:history -- --run 37924546170 --public-output /tmp/abc-release-history.json
# 同じ作業内で取得した標準artifactを使う場合（artifact.tarのあるディレクトリ）。
npm run release:history -- --run 37924546170 --public-output /tmp/abc-release-history.json --artifact-dir /tmp/pr07a-pages-artifact
# 独立した履歴PRでのみ、成功順に各runを追記する。
npm run release:history -- --run SUCCESSFUL_MAIN_RUN_ID --public-output src/content/indexes/release-history.json
```

PR-07bはwriter/workflowの通常変更として検証・配信し、実indexを変更せず完了した。PR-07cはPR-07a/07bの両成功後に実入力を照合し、indexと非公開運用文書だけを更新する。両版の入力は標準artifactから取得し、必要なら同じ作業内の一時領域に置く。専用保管庫は作らず、取得不能な版は追記未完了として残す。履歴だけの配信もbuild・リンク・対象検査を通すが、その配信自体の次の追記は要求しない。

**PR-07cの公開結果**:
[PR #100](https://github.com/Fu-L/abc-textbook/pull/100)で両先行版を成功順に追記し、[main run 38111788536](https://github.com/Fu-L/abc-textbook/actions/runs/38111788536)の検証・標準Pages配信と公開確認を2026-10-11に完了した（T041）。最新metadataは別版`2026.10.11-r38111788536`、SHAは`4e53b7d9ccb85fe96c5317653ddec7d7ef123efe`を示す。公開catalog/metadataは同一artifactとbytes一致し、教材14項目・868問・232単元と収録範囲は不変。既存公開URL
1,583件とanchor
20,595件、追記した2版の履歴ページ、代表教材・検索・復習・設定・狭い画面・キーボード操作を確認した。mainの対象113テストと内部リンク4,659件が成功した。この配信はwriterでも`history-only`となり、indexは2件のままbytes差分0である。公開結果の完了記録は非公開文書だけに反映し、履歴の追加追記や新たな配信を要求しない。

GitHub APIのrun/jobとdeployment
status、artifactの取得は[公式run API](https://docs.github.com/en/rest/actions/workflow-runs)、[deployment status API](https://docs.github.com/en/rest/deployments/statuses)、[artifact取得手順](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts)を確認した（2026-10-09）。成功判定の組合せと追記条件は本教科書の運用契約である。

## 6. 失敗時に復旧する

| 状態                                                 | 対応                                                                                                                                                             |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 配信前のschema・型・テスト・build・リンク失敗/cancel | upload/deployへ進まない。変更箇所を修正して必要な検査を再実行する。                                                                                              |
| 標準Pages配信失敗                                    | Actions/Pagesの失敗を確認し、旧正常版を維持する。公開完了と報告しない。                                                                                          |
| 配信成功後の導線確認失敗                             | 「配信済み・確認未完了」と報告し、修正またはGit revertへ進む。                                                                                                   |
| 同SHA/runの再実行                                    | 現在のmainを対象にする。同じ版の検証済みartifactがあればdeploy jobを再実行し、消失・期限切れならbaselineから同SHA/runで再検証・buildする。新版へ採番し直さない。 |
| 公開後の不具合                                       | 不具合PRをGit revertし、新main SHA・新runの別版を同じCI/Pages経路で配信する。旧版への上書きや履歴削除で成功扱いにしない。                                        |

mainでは最後の成功配信以降の未配信差分も検査するため、PRの差分外にある文書の書式違反で停止することがある。失敗ログに挙がった文書を修正し、検査範囲を狭めて回避しない。`specs/`など通常のPrettier対象外の文書も、文書checkerは`--ignore-path /dev/null`で検査する。修正にも同じ指定を使い、文章・リンク・タスクの完了状態が変わっていないことを確認する。

artifact名はbuildしたattemptごとに付け、baselineのstep/job outputをdeployへ渡す。deploy
jobだけの再実行でも保存した同じ名前を使い、配信直前のmain
SHA確認を再実行する。一致する場合だけ元artifactを配信し、期限切れ等で見つからなければbaselineを含む全jobを再実行する。mainが先へ進んでいたら古いrunの配信を停止し、現在のmainのrunを使う。旧状態へ戻す必要があればGit
revertの新runを使う。API取得失敗は接続を確認して再実行する。upload前の照合成功だけでdeploy単独再実行の配信可否を判断しない。production全体は従来のconcurrency
groupで直列化し、進行中の配信を後続pushでcancelしない。

PR-07aの実成功・公開確認後、PR-07bで`production-deploy.yml`を削除し、旧手動triggerと独自API/poll・再buildの入口を撤去した。通常公開と復旧には`ci.yml`の標準Pages経路を使う。復旧でもorigin/base、DB識別・値・独立日時、追加IDの記録を保持する。本番を故意に壊す試験はせず、既存失敗runと使い捨てfixtureで失敗の区別を確認する。

2026-10-09に[標準main run 37924546170](https://github.com/Fu-L/abc-textbook/actions/runs/37924546170)の検証・upload/deployと公開確認を完了した（T037）。配信SHAは`8eb07c12c66efdf7cfe7d890425bc7d0aab7d94c`、版は`2026.10.09-r37924546170`。公開catalog/metadataは同runの標準artifactとbytesが一致し、版・SHA/run・範囲・変更概要も整合した。配信前後の教材部分14項目・868問・232単元と収録範囲は不変。実公開のChromium
17件で旧URL/anchor全件、代表問題/単元、検索、要復習、独立日時、120件backup復元・export、設定と更新履歴を確認した。公開sitemapの旧1,573
URLも保持した。

初回main run
37924000193は未配信文書の書式違反で配信前に停止し、[修正PR #97](https://github.com/Fu-L/abc-textbook/pull/97)で復旧した。旧run
37717648084は配信step成功後の公開確認失敗であり、配信前失敗と区別した。mainでの674テスト・Chromium
80件・内部リンク4,653件が成功し、environmentのprotected branch限定・reviewer必須なしとrequired
baseline/strict/Actions app
IDを読戻した。配信済みの両JSONは取得済み。T037時点では旧trigger撤去・履歴writer/index切替をPR-07b/07cへ残した。SC-004の実教材訂正/追加公開は未達とする。

PR-07bの[PR #99](https://github.com/Fu-L/abc-textbook/pull/99)はmerge済みで、[main run 37936055365](https://github.com/Fu-L/abc-textbook/actions/runs/37936055365)の検証・標準Pages配信が成功した。SHAは`9c20103ec77e91a6d105f79ff44bf401ce0806d3`、版は`2026.10.09-r37936055365`。2026-10-11に公開catalog/metadataと同一artifactのbytes一致、教材14項目・868問・232単元と収録範囲の不変を確認した。代表問題・単元・検索・要復習・設定・更新履歴、狭い画面とキーボード操作も確認した。mainに旧手動workflowはなく、標準Pagesの成功deploymentは同runの1件だけである。required
baseline/strict/Actions app ID、active rulesetのstatus check重複なし、environmentのprotected
branch限定・reviewer必須なしを読戻した。PR-07a/07bの配信済み両JSONは標準artifactから一時領域へ取得済み（T040）。

## 既存実装からの移行

以下は各移行PRで確認した現行実装と、後続へ残る差である。後続の実装変更はこの欄を出発点にし、変更後の手順へ同時に更新する。新しい承認制度や証跡台帳を移行のために作らない。

### 旧review・release CLIの削除（002 / PR-10a）

通常の訂正・追加・検証は本書の正本編集、`abc:update --mode prepare|validate`、`catalog:build` /
`catalog:validate`、`verify:fast`を使う。公開・復旧は標準PagesとGit
revert、履歴追記は`release:history`を使う。

次のpackage入口と専用実装を削除した。旧コマンドは実行できず、成功するno-opや互換aliasは置かない。

- `abc:review`、`verify:release`、`abc:deploy`。
- `release:accept-review`、`release:accept-agent-review`、`release:bootstrap`。
- `scripts/release/`のaccept、prepare-seed、verify-seed-preparation、validate-full-release、commit-snapshot。bootstrapのpreview用staging
  helperだけは`stage.ts`へ移し、既存の`abc:update --fixture initial-v1`を保持した。このfixtureは実追加・公開の成功を表さない。

`build-history.ts`と旧Git履歴reader、旧catalog/metadata/historyのschema・値・URLを保持する。`catalog:build`
/
`catalog:validate`の`--evidence-inventory PATH`も保持し、指定時の旧manifest・check/review・fingerprint・protected-base検証を省略しない。このconsumerがあるため、seed-agent-reviewのvalidatorとその互換テストも残す。

出典・本文・ID/参照・3DAG・配置・読書順は正本loaderとcatalog検証、小batchの保留/再実行はupdate-validation、実配信のartifact/SHA対応と失敗停止は標準Pagesのworkflow回帰、公開履歴はrelease-historyで検出する。旧CLIだけを検査するtransaction・review・simulationのケースと使われなくなったfixtureを削除し、旧Git履歴・残存adapterのテストは残した。

独自deployment
adapterと専用schemaは下記PR-10bで整理した。未使用生成物はPR-10cへ残す。初版監査、数学回帰、他browserの手動入口、参照中の旧証跡や公式Source
Revisionは削除しない。過去runbookの旧コマンドを再現する場合は当時のGit版を参照する。今回の削除の復旧は、専用テスト・package入口と実装をまとめてGit
revertする。

SC-004（実教材の訂正・1 Contest追加・公開）は別依頼まで未実施であり、PR-10aの成功に含めない。

### 未使用deployment adapterと専用schemaの削除（002 / PR-10b）

`src/lib/deployment/`の`git-deployment-adapter.ts`と`cloudflare-pages-target.ts`、両者だけを検査するテストを削除した。配信・復旧は本書の標準PagesとGit
revertを使う。旧Git履歴readerと`release-commit`の履歴読込テストは保持する。標準Pagesのartifact/SHA対応、検証失敗・cancel時の停止は既存workflow回帰で確認する。

初版監査の52週シミュレーションは、独自adapterの任意旧commit配信から、一時Git
repositoryでの`git revert`、新しいHEADの静的出力、revertの取消による再適用へ変更した。120件の記録のbackup・復元も引き続き検査する。これはオフラインfixtureであり、実Pagesの配信・復旧や実教材追加の成功を表さない。監査出力のgeneratorは`zero-cost-year-v2`とし、過去の監査結果を書き換えない。

参照がなくなったmerge承認・利用時間・性能証跡・client bundle証跡・instruction
quality証跡のZod定義、生成contract登録・JSON
Schema、専用validatorとテストを削除した。保存形式や公開URLは変更しない。次の参照中の処理は保持する。

- `evidence-inventory.ts`と`--evidence-inventory PATH`指定時の旧manifest・check/review・protected-base・fingerprint検証。
- `review-evidence.ts`のwork manifest・human content
  review、および初版の学習成果の歴史schema。初版shard・taxonomy監査・旧catalogの互換検証が参照する。通常更新に承認を要求する入口として使わない。
- `verification-evidence.ts`の実行コード証跡と手動の学習記録E2E証跡。公式Source
  Revision、本文claim、実行例のschema・fingerprint・digest、catalog/metadata/history・backupの互換readerと生成contract。

2026-10-16に実branch protectionの必須checkが`Verify (release baseline)`のみ、`strict: true`・GitHub
Actions app ID付きであることと、active rulesetに別のstatus
check指定がないことを読戻した。設定変更は行っていない。未使用生成物・旧workflowの整理とSC-005の時間実測は後続タスクに残し、SC-004の実教材公開も本PRの完了に含めない。復旧は今回のadapter・schema登録・生成contract・専用テストと利用側をまとめてGit
revertする。

### 参照不要のproducerと重複生成物の整理（002 / PR-10c）

通常の入口は本書の4段階、`abc:update --mode prepare|validate`、catalogの正本検証、標準Pages、`release:history`とGit
revertを使う。初版の承認・台帳を通常更新の完了条件へ戻さない。参照検索では次を整理した。

- `corpus:export-inventory-review-packets`と`corpus:final-taxonomy:review`のpackage入口・専用CLIを削除した。前者の利用側は専用テストと001の履歴説明だけで、後者の利用側はCLI引数のテストだけだった。専用テストも整理し、taxonomyの互換reader・残存producerが使うlibraryと意味検証は残す。旧CLIの再現は削除前のGit版を使う。
- `verifyProjectionEvidence`は通常build・検証・初版監査から呼ばれておらず、専用の旧固定証跡比較とテストを削除した。`full-projection-evidence.ts`のdigest関数は`corpus:verify-full-projections`の明示的な旧report
  writerが使うため保持する。通常の`--check`は現行正本とbuildを直接検査する。
- 2026-09-25のtaxonomy統合履歴の同一ディレクトリにあった重複JSONだけを削除した。保持した`taxonomy-integration.json`とbytesが完全一致し、削除した複製へのruntime・schema・テスト・文書リンクはなかった。過去の統合結果は保持側から引き続き読める。

`initial-release-evidence.ts`と手動`initial-release-audit.yml`、corpusの凍結・初版検査は依存が残るため保持する。通常CIからは呼ばない。初版監査の既知の失敗は下記のとおり未解消であり、通常検証の成功で置き換えない。数学の検算・他browserの手動入口も保持する。

`docs/work-manifests/`・`docs/reviews/`はdirectory走査、動的なshard
path、旧catalogの互換引数、初版検査から参照される。個々のliteral
pathが見つからないことだけを理由に削除しない。`docs/verification/`の過去の成功・保留・失敗、公式Source
Revision・fingerprint/digest、公開情報・URLは保持する。旧生成物のdigestを現行実装へ合わせて書き直さない。

削除の復旧は専用CLI・テスト・複製JSONを同じGit revertで戻す。教材・学習記録の移行は不要。

2026-10-16の実設定読戻しではrequiredは`Verify (release baseline)`だけでstrictが有効、active
rulesetの必須承認数は0、Pages
environmentにreviewer要求はなかった。PR-02の[main run 37803347343](https://github.com/Fu-L/abc-textbook/actions/runs/37803347343)も成功しており、T012のmain確認を完了した。設定を変更したという意味ではない。

CI時間のT006基準は[旧run 37723463301](https://github.com/Fu-L/abc-textbook/actions/runs/37723463301)の依存準備開始から最後の必須検証完了まで16分48秒。直近の成功PR
run
5件はPR-09/10a/10bの広範囲な移行実装であり、同種・同規模の通常更新5件ではない。文書だけのrun、queue・deploy待ちを混ぜず、SC-005は比較対象不足で未達とする。実教材の訂正・1
Contest追加公開のSC-004/M5受入も別依頼まで未達。今回の削除・互換性検証の完了を002全体の完成としない。

### 公開loaderの移行（002 / PR-04）

公開projectionはstructured
rootsの現行JSONと執筆済みMarkdownを読む。Unitはmetadataの`docPath`、Problemは正本の`src/content/docs/problems/`を走査し、本文frontmatterの`authoringUnit.docPath`・Problem
ID・実pathの一致とmetadata全件の対応を確認する。本文やtaxonomyを再生成しない。Unitの`draft: false`とProblemの`draft: true`は既存parserの表現として維持する。

`learning-unit-content.json`、`problem-authoring-units.json`、`us1.json`、`problem-content-projection.json`の必須読込と受理済みbytes・mappingの照合を外した。欠落・重複・未完成の本文、未検証claim・本文とclaimの矛盾、未知source・公式task不一致、出典リンク、主配置・関連先・前提DAG、metrics、教科書順と訂正先の確認は残す。旧previewの例・演習の既知のoptional
locatorだけは、現行本文にも該当blockがない場合に対象外とし、それ以外の欠落は失敗する。

Problem・Unitとも、実行例は既存の`examples`で`verificationStatus: passed`を要求する。実行言語を付けた各fenced
code blockには、同じ`language`の実行例を一件ずつ登録する。Unitの例情報はUnit
metadata、Problemの例情報は本文frontmatterに置く。環境・入力・実行手順・期待結果を記し、コードを実行してから成功を記録する。非実行の擬似コード・図・数式は`pseudo`、`pseudocode`、`text`、`plaintext`、`math`で明示する。未登録・未検証・失敗した実行コードは公開projectionで拒否し、旧digest台帳の再生成で代用しない。

現行の公開projectionは通常の`verify:fast`と、本節の本文・分類の互換テストで検証する。build・リンク・Chromiumも同じ`dist`を使う。

PR-10b時点では`corpus:verify-full-projections`と任意のbuilt-projectionテストに旧prepared
catalogのinventory/snapshot照合が残り、標準Pagesの候補catalogで`FULL_PROJECTION_PREPARED_RELEASE_DRIFT`になった。PR-10cでこの検査CLIを現行正本のprojectionへ切り替え、旧prepared
catalogを差し替えずに現在のbuildを検証するよう修正した。catalog本文全体、schema、収録範囲・件数・ID等の意味検証とcutoffの一致を確認する。runの版識別と変更概要の生成は既存のpublicationテストと標準Actions側が担当する。

旧catalogの互換引数と初版監査自体の旧prepared照合は維持する。`verify:initial-release -- --check`は2026-10-16の横断確認でも同じ旧照合で失敗しており、現行build検証の成功を旧監査の成功と報告しない。

```sh
ABC_COMPAT_BASE_REF="$compat_base_sha" SITE_URL=https://fu-l.github.io BASE_PATH=/abc-textbook npm test -- tests/integration/full-public-projection.test.ts
```

`--check`は旧`us4/full-projections.json`を読まず、正本とのcatalog一致、公開route、タグの発動条件・Outcome・問題導線、Contestのタグ配置、sitemap・feed・Pagefindを検査する。検査だけでは報告ファイルを書かない。`ABC_COMPAT_NEW_DIST`指定時は、旧台帳のない一時copyでCLIの成功とstale
catalog・収録範囲/件数・未知の変更Problem
ID・欠落page・発動条件欠落の拒否も確認する。旧監査consumer向けの明示的な`--write`・`--write-evidence`と台帳ファイル自体はまだ保持し、通常更新でその再生成を要求しない。

通常サイトbuildはPR-07aで旧prepared
snapshot/inventory照合を外し、現行正本からcandidateを生成する。catalog
CLIの旧互換引数と初版監査が読む入力は保持し、明示した旧照合の失敗を無視しない。一時コピーでの訂正build成功と実訂正公開・SC-004の達成は区別する。

旧seed release
consumerは初版bootstrapの`sourceSetFingerprint`も読むため、その経路内だけで旧受入subjectと現行本文から当時のprojection
digest形式を再構成する。現行digestも受理するが、不明なfingerprintや本文・metadataの変更は引き続き拒否する。公開loaderの台帳読込を復活させず、旧bootstrap・台帳・公開catalogの値を書き換えない。この互換経路はcatalog
CLIの`--evidence-inventory`指定で引き続き使うため保持する。

旧seedの互換回帰は、`tests/fixtures/legacy-seed.ts`の`LEGACY_SEED_COMMIT`（`b7bc7422538ceb1e9b9997c205c85d487dd72d9a`）から当時の正本・catalogを復元する。一時repositoryを初期化し、元checkoutのローカルpathからこのcommitを明示的に`git fetch`して復元する。cloneの既定refやshared
alternatesに依存せず、外部ネットワークへは接続しない。動的な履歴検索や現在のbranch
tipで初版fixtureを再定義しない。`tests/unit/seed-release.test.ts`は既存のbootstrap・本文改変の拒否と初版の範囲・taxonomy・本文所有の検査に加え、現行本文を読んだ後でも固定した旧版本文を読むことを照合する。公開readerや旧入力を書き換えて互換検査を通さない。

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
digestへ固定せず、868本文の旧subjectを保持する。旧`corpus:author-problem-shards`は初版専用のmanifest/review出力を残すため、通常執筆では使わない。初版の明示的な`corpus:verify-authoring`は旧bundleを再照合する監査専用経路として残るため、当時のGit版で実行する。現行skillの改訂後に、旧証跡のdigestだけを更新して通さない。旧CLIはPR-10aで削除したが、catalogの旧互換引数によるprepared版の照合は保持する。執筆readerの移行だけで実教材訂正の公開完了とは扱わない。

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

旧`--evidence-inventory PATH`は、PR-10aの旧CLI削除後も互換引数として残す。指定時は旧manifest・protected-base差分・inventory全体・check/review・実行例証跡の従来の検証を行う。旧入力を黙って無視せず、不正・欠落・staleを拒否する。旧`buildCatalog`/`validateCatalogSemantics`はrelease
gateを維持し、通常CLIは`buildCanonicalCatalog`の内容検証と正本projection照合を使う。

新しい訂正の影響検査では`enumerateCorrectionImpacts`へ現行`catalog`と変更前の`previousCatalog`、source/claimの変更対象、問題ID、変更前後の前提policyを渡す。`verifyCanonicalCorrectionTargets`の`scope`へ同じ範囲を渡し、変更前後の主配置・関連Unit・Outcome
owner・追加前提Unit・直接前提の隣接Unitと現存block、配置・前提policy・再生成indexの確認漏れを検出する。返値はメモリー上の検査結果であり、証跡登録や別台帳の保存は不要。既存の履歴locatorは従来どおり実対象へ解決し、過去の訂正記録を書き換えない。

旧release/deploy
CLIはPR-10aで削除した。catalogの旧互換引数が読む台帳は保持する。通常サイトbuildの旧prepared版照合はPR-07aで外したが、CLI移行だけで実教材訂正の公開・SC-004達成とは扱わない。復旧はCLIとvalidatorの変更をrevertし、保持した旧inputとinventory指定を使う。

002の分析後に、[公開互換契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#新版の採番と再実行)へ採番・再実行・履歴入力を具体化した。PR-03でschemaと履歴readerの互換拡張を実装した。catalog/metadataと`baseReleaseVersion`は旧日付版と`YYYY.MM.DD-r<run_id>`を受理し、backupの`catalogVersionAtExport`は1桁の日など従来の受理値と新版を読める。catalog
`3.0.0`、metadata/backup
`1.0.0`、DB識別、記録値・独立日時は維持する。採番・標準deployはPR-07aで実装し、T037で実main配信と公開確認も完了した。writerはPR-07bで実配信入力からの追記へ切り替えた。新形式の実index追記はPR-07cへ残る。

旧catalog・metadata・履歴entryの値は補完・変換せず保持する。review参照、manifest/content
inventory/snapshot
digest、validationSummaryは新規入力で省略でき、存在する場合は従来の型・整合性・初版agent参照の対象制限を検証する。Source
Revisionのfingerprint、registry
digest、metadataの必須fieldはそのまま維持する。省略した証跡を成功件数・digest・時刻や空のreview欄で埋めない。

履歴readerは入力された公開順序を保持し、同SHAの別runを別版として扱う。重複版、既存entryのSHA・範囲・概要・値・順序の書換え、未知Git
commitは拒否する。旧版の`loadGitReleaseHistory`は従来どおり当時のGit
catalogを読み、prepared版にはhostの確認を要求する。新版のGit読込は拒否し、`release:history`は「実配信済み版を履歴へ追記する」の入力だけを追記する。catalogの旧互換引数と初版検査のconsumerは引き続き証跡を要求する。通常の教材更新・公開は正本検証と標準Pagesを使う。

新版履歴は実配信した同じbuild
artifactのcatalog/metadataと標準Pages/Actionsの成功から追記する。artifact取得不能時の同版公開JSONの照合と追記保留、履歴だけの変更も検証・配信した後はその配信自体の履歴追記を要求しない条件は[履歴入力契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#配信後の履歴入力と履歴だけの配信)を参照する。PR-07bの現行writerと旧trigger撤去は上記の手順へ反映した。教材内容の変更は禁止したまま一時コピーで経路を検証し、実訂正・1
Contest追加のSC-004受入は別依頼まで未達とする。

002の公開移行はPR-07a（標準配信導入）→PR-07b（履歴writerと旧trigger切替の通常配信）→PR-07c（両先行版の成功確認後、indexと非公開運用文書だけを追記・配信）へ分ける。writer/workflow変更を履歴だけの配信へ混在させない。両版の実入力は標準artifactまたは同じ作業内の一時領域で確保し、取得不能な版の追記は保留する。

PR-07aで[ローカルbuildとActionsの入力契約](../../specs/002-simplify-maintenance/contracts/compatibility.md#ローカルbuildとactionsの入力)を実装した。現在のコマンド、metadata生成、失敗/再実行は上の「標準Pagesで公開する」「失敗時に復旧する」を参照する。旧履歴readerと旧release/deployの歴史資料は残る。旧CLIはPR-10aで削除した。新版writerはPR-07bで移行し、旧手動workflowを撤去した。

| 対象                                                                                         | 移行する内容                                                                                                       | 保持・確認するもの                                                                            |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`、`initial-release-audit.yml`                                      | 通常CIは単一環境の変更選択へ移行済み。初版監査は手動のみ                                                           | 削除する検査の検出範囲、残る回帰検査、Actionsの実行時間比較                                   |
| `.github/workflows/ci.yml`、required checks、`docs/operations/protected-main.json`           | check名と実required設定はbaselineへ統一済み。PR-07aの標準Pages実main配信・公開確認は完了。PR-07bで旧workflowを撤去 | origin・base path・配信導線、実際のcheck/deploy成功。ローカルJSONだけでGitHub設定済みとしない |
| `scripts/release/build-history.ts`、`src/lib/domain/schema-parts/review-evidence.ts`と利用側 | PR-10aで旧review/release CLI、PR-10bで未使用adapter/schema、PR-10cで無参照producerと重複JSONを整理済み             | 出典・ID・参照・本文品質の検証、既存catalogと公開metadataの互換性                             |
| `docs/work-manifests/`、`docs/reviews/`、`docs/verification/`の既存成果                      | 消費する処理を先に移行し、参照不要になった生成物だけ整理する                                                       | 参照済み出典と公開履歴。過去の判断を改変して成功扱いしない                                    |
| `.agents/skills/abc-explanation-author/`、`specs/001-build-abc-textbook/`の設計・契約        | 通常執筆の移行済み契約を維持し、残る初版専用consumerを整理する                                                     | 解説の品質・公式根拠・入出力整合。既存契約の検証を黙って迂回しない                            |
| live新規問題追加・catch-up                                                                   | PR-08で公式小batch取得、PR-09で一時コピーの編集・再実行を接続。実教材受入は別依頼                                  | 既存本文・配置・記録。取得の成功を執筆・公開・M5完成に数えない                                |

通常更新のCIは単一の基準環境を基本とし、変更に必要なschema・テスト・buildを残す。追加・維持する検査ごとに検出する不具合と実行時間を評価する。約20分かかる現状からの短縮は、後続変更のActions実測で確認する。憲章と文書の改訂だけでCI短縮やlive更新機能の完成を報告しない。
