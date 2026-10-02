---
title: "ABC366-F — Maximum Composition"
draft: true
authoringUnit: {"problemId":"abc366-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc366-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-knapsack-resource"],"sourceRevisionIds":["source-abc366-editorial-10646-cce9c13c291c60591c0bfcc4be2a74401d1d89fdd993fae0b53c42322a8c8912","source-abc366-f-problem-90080f7f8506f8e37f734bfd765355c4ec2df0e9951c637fe2158bfe5590f139"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"比率比較は除算せず(A_i−1)B_jと(A_j−1)B_iの整数cross productで行い、丸め誤差を避ける。 内側から得た現在値xへ外側関数を適用するため、sort方向とDP走査方向を揃えてA_i x+B_iで更新する。 順列探索をpairwise exchangeで消去し、K≤10の部分列選択へ落とせる。","sourceRevisionIds":["source-abc366-editorial-10646-cce9c13c291c60591c0bfcc4be2a74401d1d89fdd993fae0b53c42322a8c8912","source-abc366-f-problem-90080f7f8506f8e37f734bfd765355c4ec2df0e9951c637fe2158bfe5590f139"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"f(x)=2x+1,g(x)=3x+1、初期1、K=2。","procedure":["f→gは1→3→10。","g→fは1→4→9。"],"executionTarget":null,"expectedResult":"最大10。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-dp-subset-resource"],"attainmentCondition":"関数をAだけでsortしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"順序差は(A_i−1)B_j−(A_j−1)B_iで決まる。Bも含むcross productを使い、外側へ高ratioを置く。"},"answer":{"reasoningOrVerification":"順序差は(A_i−1)B_j−(A_j−1)B_iで決まる。Bも含むcross productを使い、外側へ高ratioを置く。","procedure":["具体例の各状態・寄与を再計算する。","順序差は(A_i−1)B_j−(A_j−1)B_iで決まる。Bも含むcross productを使い、外側へ高ratioを置く。"],"expectedResult":"順序差は(A_i−1)B_j−(A_j−1)B_iで決まる。Bも含むcross productを使い、外側へ高ratioを置く。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 対称操作による状態の正規化。

## 考察

二つの一次関数f_i(x)=A_i x+B_iの合成順比較では、f_i(f_j(x))−f_j(f_i(x))の符号がxに依存せず、(A_i−1)/B_iと(A_j−1)/B_jの大小で決まる。

従って選ぶK個が決まれば最適順序は共通の比較keyで一意に整列でき、残る自由度はsorted列からどのK個を選ぶかだけである。

採用する候補: cross multiplicationで関数を最適合成順にsortし、選択個数DPで採用・不採用を決める。

順列探索をpairwise exchangeで消去し、K≤10の部分列選択へ落とせる。

棄却する候補: K個のindex集合とそのK!通りの適用順を探索する。

順序比較が入力値だけで決まる性質を使わず、Nが大きいため集合選択だけでも列挙できない。

比率比較は除算せず(A_i−1)B_jと(A_j−1)B_iの整数cross productで行い、丸め誤差を避ける。

内側から得た現在値xへ外側関数を適用するため、sort方向とDP走査方向を揃えてA_i x+B_iで更新する。

関数を(A−1)/Bの非増加順にsortする。dp[k]をsorted順でk個選んだ合成の最大中間値として、適切な方向に走査し、不採用dp[k]と採用A_i·dp[k−1]+B_iを比較する。初期入力1からK個採用した値を出力する。

## 典型の発動条件

### 隣接交換による最適順序付け

発動条件: 選んだ要素の適用順がpair交換の符号だけで決まるとき。

二要素の順序差を展開し、globalなsort keyを導く。

### 順序固定後の選択DP

発動条件: 最適な相対順が決まり、その列からちょうど少数個を選ぶとき。

採用数だけを状態にして関数適用値を最大化する。

## 問題固有の要素

合成結果は急速に増えるが、順序の優劣が現在値xから独立なので、選択と並べ替えを完全に分離できる。

別の問題へ持ち帰る視点: 関数合成最適化では二関数の交換差を展開し、入力状態が消えるか調べる。

## 正当性

比率比較は除算せず(A_i−1)B_jと(A_j−1)B_iの整数cross productで行い、丸め誤差を避ける。 内側から得た現在値xへ外側関数を適用するため、sort方向とDP走査方向を揃えてA_i x+B_iで更新する。 順列探索をpairwise exchangeで消去し、K≤10の部分列選択へ落とせる。

## 実装上の注意

- 等しい比率ではどちら順でも値が同じだがcomparatorをstrict weak orderingにする。dp未到達値を更新せず、積の上限に合う整数型を使う。

## 復習の核

- 二関数だけで両順序を展開しsort不等号の向きを確定する。DPが外側・内側のどちらから合成しているか例で検査する。

## 計算量と制約

### 時間

O(N log N+NK)、関数順sortとK選択DP。

### 空間

O(N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^{5}; 1 \leq K \leq \text{min}(N,10); 1 \leq A_i, B_i \leq 50 (1 \leq i \leq N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

f(x)=2x+1,g(x)=3x+1、初期1、K=2。

1. f→gは1→3→10。
2. g→fは1→4→9。

期待される結果: 最大10。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

関数をAだけでsortしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

順序差は(A_i−1)B_j−(A_j−1)B_iで決まる。Bも含むcross productを使い、外側へ高ratioを置く。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/editorial/10646) — source-abc366-editorial-10646-cce9c13c291c60591c0bfcc4be2a74401d1d89fdd993fae0b53c42322a8c8912
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc366/tasks/abc366_f) — source-abc366-f-problem-90080f7f8506f8e37f734bfd765355c4ec2df0e9951c637fe2158bfe5590f139
