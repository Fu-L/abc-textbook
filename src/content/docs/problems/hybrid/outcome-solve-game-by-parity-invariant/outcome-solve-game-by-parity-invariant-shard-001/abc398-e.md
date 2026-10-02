---
title: "ABC398-E — Tree Game"
draft: true
authoringUnit: {"problemId":"abc398-e","docPath":"src/content/docs/problems/hybrid/outcome-solve-game-by-parity-invariant/outcome-solve-game-by-parity-invariant-shard-001/abc398-e.md","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-interactive-protocol"],"excludedTopics":["後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。"],"tagIds":["tag-bipartite-structure","tag-game-parity-invariant","tag-interactive-protocol"],"sourceRevisionIds":["source-abc398-e-problem-fe97240f5c642513103592213538e2e35c8edadb0e176bd4fe400b8c224f63c0","source-abc398-editorial-12483-05b2bc78571f1d99213f47a5eefb64db5b9b01dffc507af69644633b749c09bb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"connected bipartite graphへcross-part edgeを追加しても同じ二部分彩色が有効なので、別候補の合法性は変化しない。 初期tree edgeN-1は全てcross-partに既に存在するため、残候補数は積からN-1を引く。 ゲームは固定された候補辺を交互に一つ消費するだけなので、残手数がoddなら先手、evenなら後手を選べば任意応答で必勝する。","sourceRevisionIds":["source-abc398-e-problem-fe97240f5c642513103592213538e2e35c8edadb0e176bd4fe400b8c224f63c0","source-abc398-editorial-12483-05b2bc78571f1d99213f47a5eefb64db5b9b01dffc507af69644633b749c09bb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、tree辺12,23。","procedure":["二部分割は{1,3},{2}、積2。","既存辺N−1=2なので未辺候補0。"],"executionTarget":null,"expectedResult":"残り0手で後手を選ぶ。","verificationStatus":"not_applicable","learningUnitIds":["unit-game-parity-invariant"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"prerequisiteIds":["unit-interactive-protocol"],"attainmentCondition":"同partの13を追加できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"triangle奇閉路を作るので違法。合法候補はcross-part未辺だけ。"},"answer":{"reasoningOrVerification":"triangle奇閉路を作るので違法。合法候補はcross-part未辺だけ。","procedure":["具体例の各状態・寄与を再計算する。","triangle奇閉路を作るので違法。合法候補はcross-part未辺だけ。"],"expectedResult":"triangle奇閉路を作るので違法。合法候補はcross-part未辺だけ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [偶奇不変量からゲームの勝敗を決める](src/content/docs/learn/modeling/game-parity-invariant.md)

- 合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。
- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [対話protocolを守って情報を取得する](src/content/docs/learn/modeling/interactive-protocol.md)

対象外:

- 後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。

## 考察

木はconnected bipartiteで、その二部分彩色はswapを除き一意である。odd cycleを作らず追加できるのは異なる色間の未存在edgeだけである。

どの合法edgeを加えても部集合は変わらず、合法手数総数は|L||R|-(N-1)に固定される。

採用する候補: 二部分彩色して残り合法edge数のparityを求め、同じ色分割間の未edgeを応答用setに持つ

ゲームは固定された候補辺を交互に一つ消費するだけなので、残手数がoddなら先手、evenなら後手を選べば任意応答で必勝する。

棄却する候補: 各局面で相手の手に応じたgame DPを行う

合法手同士に相互作用がなく、状態数だけを指数的に増やす過剰な方法である。

connected bipartite graphへcross-part edgeを追加しても同じ二部分彩色が有効なので、別候補の合法性は変化しない。

初期tree edgeN-1は全てcross-partに既に存在するため、残候補数は積からN-1を引く。

DFS/BFSでcolorとpart sizeを求め、未edgecross pairをsetへ列挙する。size parityでFirst/Secondを宣言し、自手番ではsetから一辺を出し、相手入力edgeをsetから削除する。

## 典型の発動条件

### impartial gameの手数parity化

発動条件: 各手が独立な候補を一つ消し、他候補の可否を変えないとき。

残候補数の偶奇だけで勝者を決める。

### bipartite graphの一意彩色

発動条件: connected graphでodd cycle禁止edgeを特徴付けるとき。

二部集合間だけを合法候補とする。

## 問題固有の要素

interactiveな戦略問題でも、全合法手が可換なら相手の選択内容を読む必要はなく、手数parityだけで先後を選べる。

別の問題へ持ち帰る視点: ゲームでは操作が残り選択肢集合へ及ぼす影響を確認し、単なるtoken取りゲームへ退化しないか調べる。

## 正当性

connected bipartite graphへcross-part edgeを追加しても同じ二部分彩色が有効なので、別候補の合法性は変化しない。 初期tree edgeN-1は全てcross-partに既に存在するため、残候補数は積からN-1を引く。 ゲームは固定された候補辺を交互に一つ消費するだけなので、残手数がoddなら先手、evenなら後手を選べば任意応答で必勝する。

## 実装上の注意

- 各出力後にflushし、相手の(-1,-1)で即終了する。既存tree edgeを候補setへ入れず、pair indexを正規化する。

## 復習の核

- path/starのpart sizeから候補を手列挙し、任意順で全候補を消費しても合法性が保たれることと手数parityを確認する。

## 計算量と制約

### 時間

O(N²)、二色塗りと全cross未辺の列挙。

### 空間

O(N²)、未辺set。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 100; 1 \leq U_i < V_i \leq N; The given graph is a tree.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、tree辺12,23。

1. 二部分割は{1,3},{2}、積2。
2. 既存辺N−1=2なので未辺候補0。

期待される結果: 残り0手で後手を選ぶ。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同partの13を追加できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

triangle奇閉路を作るので違法。合法候補はcross-part未辺だけ。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/tasks/abc398_e) — source-abc398-e-problem-fe97240f5c642513103592213538e2e35c8edadb0e176bd4fe400b8c224f63c0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/editorial/12483) — source-abc398-editorial-12483-05b2bc78571f1d99213f47a5eefb64db5b9b01dffc507af69644633b749c09bb
