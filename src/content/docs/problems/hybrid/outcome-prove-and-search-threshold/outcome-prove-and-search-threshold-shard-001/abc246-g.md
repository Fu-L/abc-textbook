---
title: "ABC246-G — Game on Tree 3"
draft: true
authoringUnit: {"problemId":"abc246-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc246-g.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc246-editorial-3706-58e89afde03176a71e21a35f288b30c21510edef48cd51431090a860e25eba72","source-abc246-g-problem-546e6e0480d942cf33a5e15ed7fdcbf6f3c8721c6409b7bc1dc3aa0f17817362"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dp[v] を、v から開始する前に青木が追加で白くすべき黒頂点の最小数とする。子の必要数の合計から、直後の青木の 1 回分を引ける。 B_v=1 if v is black else 0 とすると dp[v]=max(Σdp[c]-1,0)+B_v である。root は値を持たず白として扱い、dp[1]>0 なら青木の通常の 1 回/turn だけでは防げず高橋が X 以上を保証する。 履歴全体を持たず、青木の削除余力を頂点ごとの最小必要個数へ集約して単調判定できる。","sourceRevisionIds":["source-abc246-editorial-3706-58e89afde03176a71e21a35f288b30c21510edef48cd51431090a860e25eba72","source-abc246-g-problem-546e6e0480d942cf33a5e15ed7fdcbf6f3c8721c6409b7bc1dc3aa0f17817362"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-and-search-threshold"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"白い根に黒い葉が二つあるthreshold状態。","procedure":["各葉dp=1。","根dp=max(1+1−1,0)+0=1。"],"executionTarget":null,"expectedResult":"thresholdを高橋が保証できる。","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-search"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-and-search-threshold"],"prerequisiteIds":["unit-rooted-tree-aggregation"],"attainmentCondition":"黒い葉が一つだけならどうなるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"根dp=max(1−1,0)=0で青木の一回の白化で防げる。"},"answer":{"reasoningOrVerification":"根dp=max(1−1,0)=0で青木の一回の白化で防げる。","procedure":["具体例の各状態・寄与を再計算する。","根dp=max(1−1,0)=0で青木の一回の白化で防げる。"],"expectedResult":"根dp=max(1−1,0)=0で青木の一回の白化で防げる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

得点 X 以上を保証できるかだけを見ると、各非根頂点は A_i≥X の黒と A_i<X の白の 2 値に置き換えられる。判定は X に対して単調なので最大の真を探せる。

青木は各移動の直前に任意の 1 頂点を黒から白へできる。高橋がどの子を選んでも勝てない状態にするには、全子部分木で必要な事前削除数を合算する必要がある。

採用する候補: X を二分探索し、各 X で『青木が事前に何個黒頂点を白くすれば部分木から必勝か』を表す木 DP を行う。

履歴全体を持たず、青木の削除余力を頂点ごとの最小必要個数へ集約して単調判定できる。

棄却する候補: 盤面の黒白配置と現在頂点を状態にして、両者の全選択を minimax 探索する。

各手で任意頂点を 0 にできるため配置状態が指数個あり、N≤2×10^5 では扱えない。

dp[v] を、v から開始する前に青木が追加で白くすべき黒頂点の最小数とする。子の必要数の合計から、直後の青木の 1 回分を引ける。

B_v=1 if v is black else 0 とすると dp[v]=max(Σdp[c]-1,0)+B_v である。root は値を持たず白として扱い、dp[1]>0 なら青木の通常の 1 回/turn だけでは防げず高橋が X 以上を保証する。

候補 X ごとに A_i≥X を黒とし、postorder で dp を計算する。dp[root]>0 を判定の真として、真となる最大 X を値域または A_i の候補列上で二分探索する。

## 典型の発動条件

### 答え二分探索

発動条件: 『答えが X 以上か』が X に関して単調で、各閾値を十分速く判定できるとき。

頂点値を X 以上/未満へ二値化し、木 DP の勝敗判定が真となる最大 X を探す。

### ゲームの資源量を表す木 DP

発動条件: 木上ゲームで全履歴は大きいが、相手が勝つための最小追加操作数が部分木ごとに合成できるとき。

各子の必要白塗り数を合計し、現在 turn にできる 1 回を差し引いて親へ返す。

## 問題固有の要素

任意頂点を毎 turn 1 個消せるという全域操作を、各部分木を無力化するための最小『前借り削除数』に置き換えると局所漸化式になる。

別の問題へ持ち帰る視点: ゲーム DP では勝敗だけで閉じない場合、勝敗を反転させるために必要な最小資源量を状態にすると合成可能になることがある。

## 正当性

dp[v] を、v から開始する前に青木が追加で白くすべき黒頂点の最小数とする。子の必要数の合計から、直後の青木の 1 回分を引ける。 B_v=1 if v is black else 0 とすると dp[v]=max(Σdp[c]-1,0)+B_v である。root は値を持たず白として扱い、dp[1]>0 なら青木の通常の 1 回/turn だけでは防げず高橋が X 以上を保証する。 履歴全体を持たず、青木の削除余力を頂点ごとの最小必要個数へ集約して単調判定できる。

## 実装上の注意

- root には A_1 がないので B_1=0 とし、判定の真偽は dp[1]>0 が高橋勝ち、dp[1]=0 が青木勝ちである。
- 鎖状木で再帰深度が N になり得るため、反復 DFS の親・順序配列から逆順計算する実装も検討する。

## 復習の核

- 葉の黒/白で dp が 1/0 になることから始め、分岐頂点で子 dp の合計からなぜ 1 だけ引けるかをゲームの手順に沿って説明させる。

## 計算量と制約

### 時間

O(N log V)、Vは値域幅または候補値数、判定postorder O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; 1 \leq u_i, v_i \leq N; The given graph is a tree.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

白い根に黒い葉が二つあるthreshold状態。

1. 各葉dp=1。
2. 根dp=max(1+1−1,0)+0=1。

期待される結果: thresholdを高橋が保証できる。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

黒い葉が一つだけならどうなるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

根dp=max(1−1,0)=0で青木の一回の白化で防げる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/editorial/3706) — source-abc246-editorial-3706-58e89afde03176a71e21a35f288b30c21510edef48cd51431090a860e25eba72
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/tasks/abc246_g) — source-abc246-g-problem-546e6e0480d942cf33a5e15ed7fdcbf6f3c8721c6409b7bc1dc3aa0f17817362
