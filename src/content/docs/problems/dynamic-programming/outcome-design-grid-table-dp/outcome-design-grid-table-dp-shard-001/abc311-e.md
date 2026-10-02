---
title: "ABC311-E — Defect-free Squares"
draft: true
authoringUnit: {"problemId":"abc311-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-grid-table-dp/outcome-design-grid-table-dp-shard-001/abc311-e.md","learningOutcomeIds":["outcome-design-grid-table-dp","outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。"],"tagIds":["tag-dp-state-equivalence","tag-grid-table-dp"],"sourceRevisionIds":["source-abc311-e-problem-e2dd52d35efd358a56006786026e087a80d57d7140105f6bf69af3bc50484648","source-abc311-editorial-6819-e2eeec07acc12c8271d8945a98440cd4d9722e3a541be0e1dfd41afbf103f345"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"右下(i,j)の最大正方形は、穴なら0、空きなら上・左・左上最大長の最小+1。必要十分の領域包含でこの式が成立する。最大長kなら同じ右下の辺長1..kが全て存在し、各正方形は右下一意なのでkを足すと全個数。","sourceRevisionIds":["source-abc311-e-problem-e2dd52d35efd358a56006786026e087a80d57d7140105f6bf69af3bc50484648","source-abc311-editorial-6819-e2eeec07acc12c8271d8945a98440cd4d9722e3a541be0e1dfd41afbf103f345"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-grid-table-dp","outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"2×3全空。","procedure":["第1行dpは1,1,1。","第2行は1,2,2。","総和3+5。"],"executionTarget":null,"expectedResult":"8正方形","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-grid-table"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-grid-table-dp","outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"最大辺長2の右下を一個だけ加算してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。その右下には辺長1と2の二正方形がありdp値2を加える。"},"answer":{"reasoningOrVerification":"不可。その右下には辺長1と2の二正方形がありdp値2を加える。","procedure":["具体例の各状態・寄与を再計算する。","不可。その右下には辺長1と2の二正方形がありdp値2を加える。"],"expectedResult":"不可。その右下には辺長1と2の二正方形がありdp値2を加える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)

- グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。
- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。

## 考察

正方形を左上・右下の二点で列挙すると候補が多いが、右下マスを固定すると、存在する辺長は 1 から最大値まで途切れない。よって最大辺長一つが個数も表す。 右下 (i,j) の正方形を一段拡張するには、上・左・左上を右下とする三つの正方形がすべて必要で、最小の辺長がボトルネックになる。 穴マスでは dp=0、通常マスでは dp=min(dp_up,dp_left,dp_diag)+1 とすれば、新たに加わる下辺・右辺も三小正方形の和で覆われる。 dp[i][j]=k なら同じ右下を持つ辺長 1..k がすべて有効なので、全 dp の総和が重複のない答えになる。

採用する候補: 各マスを右下とする穴なし正方形の最大辺長を、上・左・左上の最小値＋1 で DP する。

各正方形を右下で一意に分類でき、最大辺長 k がその右下からの k 個の正方形をまとめて数えるため O(HW) になる。

棄却する候補: 各左上マスと辺長を列挙し、二次元累積和で穴数を判定する。

一回の判定は O(1) でも候補が Θ(HW min(H,W)) あり、3000×3000 では多すぎる。

穴マスでは dp=0、通常マスでは dp=min(dp_up,dp_left,dp_diag)+1 とすれば、新たに加わる下辺・右辺も三小正方形の和で覆われる。

dp[i][j]=k なら同じ右下を持つ辺長 1..k がすべて有効なので、全 dp の総和が重複のない答えになる。

穴を boolean grid に記録し、上と左に 0 の番兵行列を置く。行優先で、穴なら 0、そうでなければ三近傍の min+1 を計算して 64 bit の答えへ加算する。

## 典型の発動条件

### 最大サイズ DP で全サイズを数える

発動条件: 固定した端点に対する有効サイズが 1..k の prefix をなす図形を数えるとき。

端点ごとの最大サイズを求め、その値自体を個数として足す。

### 最大正方形の三近傍遷移

発動条件: grid 上で全マスが条件を満たす正方形を扱うとき。

右下を固定し、上・左・左上の最大辺長の最小値を使って一段拡張する。

## 問題固有の要素

「最大を求める DP」がそのまま「全部を数える」答えになるのは、辺長に関する下方閉性があるためである。

別の問題へ持ち帰る視点: 数え上げ候補がサイズで入れ子なら、端点ごとの最大有効サイズへ圧縮できないかを見る。

## 正当性

右下(i,j)の最大正方形は、穴なら0、空きなら上・左・左上最大長の最小+1。必要十分の領域包含でこの式が成立する。最大長kなら同じ右下の辺長1..kが全て存在し、各正方形は右下一意なのでkを足すと全個数。

## 実装上の注意

- 答えは最大で HW min(H,W) 級なので 64 bit を使う。穴座標の 1-index/0-index と番兵行・列を揃える。

## 復習の核

- 数えたい対象を一意な端点へ割り当て、サイズ集合が連続かを確かめる。三近傍の min が必要な理由は図に一段拡張を書いて確認する。

## 計算量と制約

### 時間

H×W、穴数N。読込・DP O(HW+N)。

### 空間

盤面穴flag O(HW)、rolling dp作業O(W)、全DP保存ならO(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W \leq 3000; 0 \leq N \leq \min(H \times W, 10^5); 1 \leq a_i \leq H; 1 \leq b_i \leq W; All (a_i, b_i) are pairwise different.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

2×3全空。

1. 第1行dpは1,1,1。
2. 第2行は1,2,2。
3. 総和3+5。

期待される結果: 8正方形

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

最大辺長2の右下を一個だけ加算してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。その右下には辺長1と2の二正方形がありdp値2を加える。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/tasks/abc311_e) — source-abc311-e-problem-e2dd52d35efd358a56006786026e087a80d57d7140105f6bf69af3bc50484648
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/editorial/6819) — source-abc311-editorial-6819-e2eeec07acc12c8271d8945a98440cd4d9722e3a541be0e1dfd41afbf103f345
