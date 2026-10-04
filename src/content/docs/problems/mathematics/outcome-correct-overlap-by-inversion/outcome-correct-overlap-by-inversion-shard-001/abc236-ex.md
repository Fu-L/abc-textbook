---
title: "ABC236-EX — Distinct Multiples"
draft: true
authoringUnit: {"problemId":"abc236-ex","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc236-ex.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-labeled-component-decomposition"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-labeled-component-decomposition"],"sourceRevisionIds":["source-abc236-editorial-3289-453fc6a1e1164ac3bd490c049e191d57eccc96468165dc2d354428f83588477c","source-abc236-ex-problem-b886dc00dd4258aa9b3b3f9aaa78909f30fec53dba20aeb4393a4573e5becc53"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"等値事象への辺包除では、選択辺の連結成分Tごとに共通値の候補数g(T)=floor(M/lcm D_i)が掛かる。同じ頂点分割の辺集合をまとめると、各成分内で連結となる辺集合の符号和h(|T|)が独立に掛かる。h(1)=1であり、n≥2の全グラフの符号和0を頂点1の成分で分けると、補集合が2頂点以上の項は相殺し、0=h(n)+(n−1)h(n−1)。従ってh(n)=(−1)^{n−1}(n−1)!であり、各分割の重みはΠ_T g(T)h(|T|)となる。\n\n空分割の重みは1。非空Sの最小頂点を含む成分Tを一つ選ぶ再帰は、全分割を一度ずつ生成する。T=Sではdp[∅]=1を使うので一成分の項も失わない。よってfull maskのDPは元の辺包除の和そのものであり、等値事象を一つも持たない、すなわち全値相異なる割当てだけが一度残る。","sourceRevisionIds":["source-abc236-editorial-3289-453fc6a1e1164ac3bd490c049e191d57eccc96468165dc2d354428f83588477c","source-abc236-ex-problem-b886dc00dd4258aa9b3b3f9aaa78909f30fec53dba20aeb4393a4573e5becc53"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

先に読む単元:

- [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md) — 生成関数による組合せ構造の符号化で得た考え方と実装を再利用し、label付き連結成分分解・exponential formulaの発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

各iの候補はD_iの倍数だが、M≤10^18なので値を一つずつ列挙して使用済み集合を持つDPは作れない。N≤16の小ささを使い、対(i,j)の等値事象A_i=A_jへの包除を考える。辺集合Eを選ぶと、そのグラフの同じ連結成分内の変数が全て等しくなる。

成分Tの共通値の候補数はg(T)=floor(M/lcm_{i∈T}D_i)。違う成分の値は独立に選ぶ（この段階では同じ値を選ぶことも許す）。従って同じ頂点分割を生む辺集合の符号だけをまとめれば、2^{N(N−1)/2}個の辺集合を直接列挙せずに済む。

h(n)をn頂点上の全連結単純グラフの符号和Σ(−1)^{辺数}とする。h(1)=1。連結を要求しない全グラフの符号和をF(n)と置くと、F(0)=F(1)=1で、n≥2では一つの候補辺の有無を反転して対にできるのでF(n)=0（式では(1−1)^{n(n−1)/2}）。

n≥2の全グラフを頂点1の成分Tで分ける。T内は連結、Tと補集合の辺は不採用、補集合内は任意なので、|T|=kの寄与はC(n−1,k−1)h(k)F(n−k)。補集合が2頂点以上の項はF=0で消える。残るのは全体連結のh(n)と、補集合が一頂点の(n−1)h(n−1)だけ。全和F(n)=0だからh(n)=−(n−1)h(n−1)、従ってh(n)=(−1)^{n−1}(n−1)!。これが辺の相殺を成分サイズだけの係数へ圧縮する理由である。

成分Tの重みをw(T)=g(T)h(|T|)とする。dp[S]をSの全集合分割に対する成分重み積の和とし、空分割の積からdp[∅]=1。S≠∅では最下位bitの頂点uを固定し、u∈T⊆Sの全成分候補Tについて

```text
dp[S] = Σ_{T⊆S, u∈T} w(T) dp[S\T]
```

とする。T=Sも必ず含む。各分割でuの成分は一意なので重複しない。gを全maskへ前計算し、dpをpopcount順（または真部分集合が先になるmask昇順）で計算して、full maskの値を法998244353で答える。

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

等値事象への辺包除では、選択辺の連結成分Tごとに共通値の候補数g(T)=floor(M/lcm D_i)が掛かる。同じ頂点分割の辺集合をまとめると、各成分内で連結となる辺集合の符号和h(|T|)が独立に掛かる。h(1)=1であり、n≥2の全グラフの符号和0を頂点1の成分で分けると、補集合が2頂点以上の項は相殺し、0=h(n)+(n−1)h(n−1)。従ってh(n)=(−1)^{n−1}(n−1)!であり、各分割の重みはΠ_T g(T)h(|T|)となる。

空分割の重みは1。非空Sの最小頂点を含む成分Tを一つ選ぶ再帰は、全分割を一度ずつ生成する。T=Sではdp[∅]=1を使うので一成分の項も失わない。よってfull maskのDPは元の辺包除の和そのものであり、等値事象を一つも持たない、すなわち全値相異なる割当てだけが一度残る。

## 実装上の注意

- maskのlcmをlからDへ更新するときは、q=l/gcd(l,D)を求め、q>M/Dなら掛ける前に番兵M+1へ飽和させる。それ以外だけqDを計算する。前のlが番兵ならそのまま引き継ぐ。M≤10^18でも未検査の積は10^36に達し得るため、約分だけでは64bit overflowを防げない。
- 成分候補 T' は対象 mask の固定最下位 bit を必ず含め、h の交互符号を法 998244353 で正規化する。

## 復習の核

- distinct条件と巨大値域では、衝突する対の等値事象を包除して連結成分にまとめる。
- 符号係数は暗記せず、全グラフの符号和0と「固定頂点の成分」で漸化式へ落とす。
- 集合分割DPでは固定bit付き成分とdp[∅]=1を組にし、全体が一成分の項も含める。

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
