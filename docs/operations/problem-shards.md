# ProblemAuthoringUnit shard の執筆と検証

Issue #47（T065–T071）は、受理済み配置の868問を209の主成果に基づく248
shardへ分け、各問題のfull本文と分野別証跡を作成する。分割は `primaryOutcomeId`
のみを用い、同じ成果の問題を公式contest/task順で最大8問ずつ並べる。追加primaryとsupportingは学習範囲・前提を記録するが、問題の重複配属には使わない。

固定indexは `docs/work-manifests/initial/problem-authoring-units/index.json`。全分野は同じ
`indexDigest`
を参照する。6分野は作業の振り分けであり、読者向け9章、Unitの成果所有、所属、読む順を変更しない。

| 作業分野            | 問題数 |
| ------------------- | -----: |
| graph-search        |    172 |
| dynamic-programming |    174 |
| data-structures     |     94 |
| mathematics         |    147 |
| string-geometry     |     79 |
| hybrid              |    202 |

## 正本と証跡

正本はindexの `documentPaths` にある `src/content/docs/problems/`
以下のMarkdown。各文書にProblem全体の考察、典型の発動条件、固有要素、正当性、実装上の注意、復習の核、計算量の導出・公式制約、Source
Revisionを置く。frontmatterの `authoringUnit`
は同じ文書の型付きmetadataであり、本文のsectionsは複製しない。`correctness`はProblem内のローカルkeyで、独立したClaim・Example・Exercise
entityを作らない。

各shardの作業ディレクトリには以下を置く。

- `manifest.json`：全Problem文書を一つのreview
  unitとする所有範囲、主・追加成果、必要checks、現在のreview policy。
- `dispatch.json`：固定indexとの対応、前提shard、所有パス・problemIds・ローカルlocator、証跡パス。
- `input.json`：受理済み配置と検証済みの公式問題・個別解説revisionから作るskill入力packet。
- `checks.json`：source、structure、example、answer、link、accessibilityの自動検査と未完了reviewの区別。
- `review.json`：問題ごとの数学的点検項目、公式情報との不一致・独立証明のリスク、追加公式照合、技術保留と本人レビューの状態。

私用HTMLと `snapshot.json` は `staging/previews/problem-authoring-unit-shards/`
以下の分野・成果・shardと同じ所有パスにある。snapshotは本文・入力packet・manifestのsubject、checks、review、HTMLのdigestに結び付く。固定indexのmembership・順序・digestは再生成で書き換えない。執筆中に見つかったリスクだけは、当該shardのmanifestとdispatchの現在のpolicyを更新し、subjectに対応する証跡を再生成する。

## 再検査と編集

```bash
npm run corpus:verify-problem-shard-index
npm run corpus:verify-problem-shards
npm run corpus:author-problem-shards -- --check --domain mathematics
npm run corpus:author-problem-shards -- --check --shard outcome-aggregate-rooted-tree-shard-003
npm run verify:fast
```

編集後はそのshardの本文を技術的に点検してから、当該shardの証跡だけを更新する。

本文点検では、以下を考察から回答まで通して確認する。

- DPの状態が一つの対象を数えるのか、同値類全体を数えるのか。初期値、範囲外・空状態、遷移係数、終了状態を明示する。
- 母関数・行列・畳み込みの入力係数と読む次数。オンライン処理では各係数の確定順、寄与を一度だけ送る区間、除算する値の条件を示す。
- 構成法の親と子の所有範囲、接続、基底、縮小。端点が境界にある場合と空ループも確認する。
- 個数・期待値へ戻す最後の式。初期の表裏、追加した0、重複の除外、階乗や順位反転などを省かない。
- 計算量の全処理。状態数と総更新数を分け、走査を省く条件・償却量・コピーの費用を確認する。
- 変形から元の答えへ戻す係数。正規化で割った因子、周期商と端数、共役による中央の重複を明示する。
- 最短路木から閉路を作るときの根・空経路・非木辺。第一枝の比較だけで木辺の往復を閉路にしない。
- 有限状態の周期化が決定的な遷移に基づくこと。逆元がない環では前周期と両端を分け、指数分配列の再出現だけで周期を断定しない。
- 同じ層を参照するDPの確定順。左を確定して矩形遷移を反映し右へ進む手順と、monotone
  minima・SMAWKそれぞれの計算量を区別する。
- Lagrange
  oracleの状態・初期値・tie-break・探索範囲・両出力の復元。費用流なら容量の整数化、流量上界、残余potentialから主解を戻す式まで接続する。

訂正した証明はfrontmatterのcorrectness
Claimへも反映する。本文のrevisionを更新してからdetailsなしで証跡を再生成し、本文・入力・Claim・私用HTMLを同じ内容へ揃える。必要な独立検算は本文の短い追跡と別に検証記録へ置く。PR
#65の回帰用検算はCIで五つのPython scriptを実行する（Python 3.9以上、追加依存なし）。

```bash
npm run corpus:author-problem-shards -- --write --shard outcome-aggregate-rooted-tree-shard-003
npm run corpus:author-problem-shards -- --check --shard outcome-aggregate-rooted-tree-shard-003
```

新規執筆または明示的な原稿差替えには `--write --details FILE`
を使える。入力は選択範囲内のproblemIdをkeyとし、完成した考察全文を必須の `reasoning`、正当性を
`correctness`、全採用手法の時間・空間を `time` / `space` に与える。`reasoning`
は考察全文であり、inventoryの観察・候補・要点を自動で追記しない。例・演習は任意であり、通常のProblem本文では省く。`sectionOverrides`
で既存分析の誤りを当該Problem本文内だけで補正する。検証済み原典、canonical
Unit・Tag・placement、固定indexは変更しない。既存文書への `--details`
付きwriteは指定原稿で本文を置き換えるため、手編集を保存する場合はdetailsを付けない。

独立した具体例・確認問題・確認する観点・解答と理由は生成しない。必要な短い追跡・反例は考察や証明へ入れる。状態・遷移・境界条件・仮定・計算量の導出を省略しない。examples/exercisesの空配列を許容し、不在のexample/answer
checkは`not_applicable`とする。凍結済みinitial-v1
skillとその出典・digestは過去の執筆入力として維持するが、現在の本文構成はこの方針が優先する。

任意に含める手計算例は `illustrative`
であり、架空のプログラム実行結果を記録しない。自動検査は構造・同一subject・リンク・静的テキストのアクセス可能性を確認する。小例の数学的な正しさ、証明の仮定、計算量と最大制約の適合はreview
inventoryで点検する。保守的上界や乱択の期待計算量を、無条件の実行時間保証として扱わない。

## 受入状態

本文は全868問をfullとして執筆する。claimと、含めた場合のanswerの技術確認はCodexによる原典付き執筆の記録であり、運用者本人の承認ではない。全文書は
`draft: true`、private snapshotは `on_hold`
とし、選択されたselfまたはthird-partyの本人レビューを待つ。reviewは `humanApproval: false`
を保持する。

通常はself review、公式との不一致・独立証明・大きな分類変更があるshardはthird-party
reviewを指定する。skill側の `independent_proof` は作業manifest契約の `original_proof`
に対応する。公式解説の記述を補正した場合も原典のrevisionは保持し、補正の理由と再照合を当該reviewへ記録する。

この検査は各shardの独立した執筆確認である。T072–T078のglobal
join・統合受入・coverage承認、T160の公開projectionへの切替は、このIssueに含めない。未実施の本人レビューをpassedにしたり、公開catalogへ未受理本文を投入したりしない。

## 本文を実装まで接続する点検

各問題で最小の合法入力、同一端点・同じ深さ、空の残状態、偶奇と境界を確認する。集計する対象が単一辺、端点から中心への経路、対全体のいずれかを明示し、寄与を一度だけ数える規約を保つ。オンライン積では引数の係数区間・返す積・右へ渡すsliceと、捨てた係数が不要な理由を記す。期待値の少数状態へ圧縮するときは、補助過程の出口と真の終了を区別して接続式を与える。

「全体で線形」「安全な上界」だけで制約適合を済ませず、前計算・全状態更新・配列保持・コピーまで数える。小さな次数上限で打ち切る木DPは、部分木サイズでも次数を制限し、実在する係数だけを掛けることを償却解析の前提にする。巨大合同状態は表現・更新・全更新数を一緒に説明する。

生成CLIの構造検査は原稿の数学的完全性を判定しない。完成した考察原稿を渡すことを必須にした上で、状態から回答までの接続は本文点検、境界や係数は独立モデルとの比較で確かめる。第三回・第四回の補修と点検範囲は
`docs/verification/bootstrap/pr65-review3-corrections.md` と
`docs/verification/bootstrap/pr65-review4-corrections.md` に記録する。

## 問題条件から回答への接続

典型を適用する前に、元の問題の条件をどの集合・位置・状態に課すか確認する。複数の集合でそれぞれ相異なることと、その和集合で全て相異なることは別の条件である。必須の根、固定の始点、非空区間、存在するだけでよい補助変数を、汎用の状態定義に埋もれさせない。

本文点検は、問題固有の条件を使わない既習Unitを読んだ後でも、以下の操作を再現できるかで判断する。

- 再帰の返値と最終回答が異なるなら、回答を保存する時点・式・許される入力の文脈を明記する。更新前後の配列を分け、重さ0でも一回だけ選ぶ。
- 存在条件を局所不等式へ変換するなら、必要性と十分性の両方を説明する。全単射の二つの盤・状態のどちらに条件を課すかも確定する。
- イベントや差分更新では、通常値、変更する要素の集合、変更後の式、問い合わせ対象、復元の順を示す。「変更回数が定数」だけで済ませない。
- 区間要約には合成式・単位元・照会の両端を置く。短い区間で強制位置が重なる場合を別扱いする。
- 数え上げでは0個追加の遷移、同値候補のmultiplicity、最終抽出と除外数を確認する。出力が値・位置・構成列のどれかも公式問題へ戻って確認する。
- 計算量は提示した具体的な評価順から導く。同じ子を二回評価する再帰、比較対象の長さ、状態の表現とコピー、法上の0による分岐を含める。

第五回の補修は
`docs/verification/bootstrap/pr65-review5-corrections.md`、小規模の独立モデルとの比較は
`pr65-review5-mathematical-checks.py`
に記録する。一般的な構造検査を、問題条件の数学的点検の代用にはしない。
