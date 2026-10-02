---
title: "ABC236-EX — Distinct Multiples"
draft: true
authoringUnit: {"problemId":"abc236-ex","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc236-ex.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-labeled-component-decomposition"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-labeled-component-decomposition"],"sourceRevisionIds":["source-abc236-editorial-3289-453fc6a1e1164ac3bd490c049e191d57eccc96468165dc2d354428f83588477c","source-abc236-ex-problem-b886dc00dd4258aa9b3b3f9aaa78909f30fec53dba20aeb4393a4573e5becc53"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"等値事象への辺包除では辺集合の各連結成分Tが同じ値を持ち、その候補数はfloor(M/lcm D_i)。成分内部の符号和は(−1)^{|T|−1}(|T|−1)!となる。固定頂点を含む成分を一つ取り除く再帰は集合分割を重複なく列挙するため、衝突しない代表値の割当てだけ包除後に残る。","sourceRevisionIds":["source-abc236-editorial-3289-453fc6a1e1164ac3bd490c049e191d57eccc96468165dc2d354428f83588477c","source-abc236-ex-problem-b886dc00dd4258aa9b3b3f9aaa78909f30fec53dba20aeb4393a4573e5becc53"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

各 i の候補値は D_i の倍数だが、M が 10 の 18 乗なので値を列挙して異なる代表を割り当てる DP は作れない。

相異なる条件は、各対 (i,j) の等値事象 A_i＝A_j を全て避ける条件なので、等値辺集合への包除原理を適用できる。

棄却する候補: 各 i へ D_i の倍数を順に割り当て、使用済み値集合を持つ探索を行う。

一変数だけでも M/D_i 個の候補があり、巨大な値域と使用済み集合を扱えない。

採用する候補: 全等値対への包除を、選択辺グラフの連結成分分割ごとにまとめ、各成分の共通倍数候補数と符号和を subset partition DP で合成する。

同じ連結成分の A_i は全て等しくなり、候補数は D_i の lcm だけで決まるため、辺集合を頂点集合の分割へ圧縮できる。

頂点集合 T が一等値成分になる値の候補数は g(T)=floor(M/lcm_{i∈T}D_i) である。

|T| 頂点上の連結グラフを辺数符号付きで足した値は h(|T|)=(-1)^{|T|−1}(|T|−1)! となり、成分内部の全辺選択を一係数へ畳み込める。

非衝突条件の edge inclusion-exclusion を set partition の重み積へ変換し、固定頂点を含む一成分 T' を選ぶ再帰 dp[T]=Σg(T')h(|T'|)dp[T\T'] で計算する。

## 典型の発動条件

### 等値事象の包除と連結成分圧縮

発動条件: 複数変数を相異ならせたいが各値域が巨大で、対ごとの等値制約だけは数えやすいとき。

等値辺の連結成分ごとに変数を一値へ束ね、辺集合の符号和を成分サイズ係数へ置き換える。

### 部分集合の集合分割 DP

発動条件: ラベル付き要素集合を成分へ分割し、各成分の重みの積を全分割について足すとき。

最小 bit を含む成分だけを列挙して分割の順序重複を避ける。

## 問題固有の要素

等値成分の共通値は全 D_i の公倍数でなければならず、最小公倍数が M を超えた時点で候補数は 0 になる。

別の問題へ持ち帰る視点: 巨大上限下の共通倍数数え上げでは、lcm を上限で飽和させて値域列挙と整数 overflow を同時に避ける。

## 正当性

等値事象への辺包除では辺集合の各連結成分Tが同じ値を持ち、その候補数はfloor(M/lcm D_i)。成分内部の符号和は(−1)^{|T|−1}(|T|−1)!となる。固定頂点を含む成分を一つ取り除く再帰は集合分割を重複なく列挙するため、衝突しない代表値の割当てだけ包除後に残る。

## 実装上の注意

- mask の lcm は gcd で約分してから掛け、M を超える場合は番兵 M＋1 に飽和させる。
- 成分候補 T' は対象 mask の固定最下位 bit を必ず含め、h の交互符号を法 998244353 で正規化する。

## 復習の核

- distinct 条件と巨大値域が組み合わさったら、衝突する対の等値事象を包除して成分単位にまとめる。
- 辺集合包除が大きすぎる場合、選択辺の効果が連結成分だけで決まるなら分割重みへ圧縮する。

## 計算量と制約

### 時間

O(3^N+2^N log M)。subset LCMと固定bit付き成分再帰を計算する。

### 空間

O(2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 16; 1 \leq M \leq 10^{18}; 1 \leq D_i \leq M \, (1 \leq i \leq N); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/editorial/3289) — source-abc236-editorial-3289-453fc6a1e1164ac3bd490c049e191d57eccc96468165dc2d354428f83588477c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc236/tasks/abc236_h) — source-abc236-ex-problem-b886dc00dd4258aa9b3b3f9aaa78909f30fec53dba20aeb4393a4573e5becc53
