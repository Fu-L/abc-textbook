---
title: "ABC214-G — Three Permutations"
draft: true
authoringUnit: {"problemId":"abc214-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc214-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-generating-functions"],"sourceRevisionIds":["source-abc214-editorial-2442-52077edcf8cf051cc8cfc0cb24240ce0bdc9810984a67e168e3a35a98177dd15","source-abc214-g-problem-1d5f574ef1dcfb070b719ca8bec70d5120694520f60028351f343bdaac164613"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"k個の違反位置で選んだ禁止値は互いに異なる必要があり、禁止二部グラフのk辺matchingと全単射になる。残り位置の埋め方は(N−k)!で、包除により違反なしだけ残る。各成分のmatchingは独立で、cycleの非隣接辺選択は切り口の使用有無による二項係数の和で数えられる。重複禁止マス一つの成分だけ1+xとすれば過剰に数えない。成分多項式の積が正確なR_kを与えるので包除式が答えになる。","sourceRevisionIds":["source-abc214-editorial-2442-52077edcf8cf051cc8cfc0cb24240ce0bdc9810984a67e168e3a35a98177dd15","source-abc214-g-problem-1d5f574ef1dcfb070b719ca8bec70d5120694520f60028351f343bdaac164613"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

全 N! 個の順列を列挙する代わりに、位置 i で r_i=p_i または q_i になる違反を包除する。k位置への相異なる禁止値の割当て数を R_k とすると、残り位置は (N−k)! 通り自由に埋められるため、答えは Σ_{k=0}^N(−1)^k R_k(N−k)!。

R_k は禁止マス (i,p_i),(i,q_i) の集合から、行・列を共有しない k マスを選ぶrook数である。p_i=q_i は同じマスを二度数えない。行と値を左右の頂点とする二部グラフでは、禁止マスは辺、rook集合はmatchingになる。

二つの順列を重ねると、p_i≠q_i の成分は偶数長のcycle。p_i=q_i の成分は重複を除いた一本の辺で、多項式は1+x。それ以外の成分が l 個の行を含むなら辺数2lのcycleであり、k本の互いに非隣接な辺を選ぶ方法は

```text
r_{l,0}=1
r_{l,k} = (2l)/(2l−k) · C(2l−k,k)  (1≤k≤l, l≥2)
```

となる。線形に切った非隣接選択を、切り口の辺を使わない場合 C(2l−k,k) と使う場合 C(2l−k−1,k−1) に分けて足すとこの式になる。l=1 をこの式に入れると一つの禁止マスを二度数えるので必ず分ける。

成分ごとの Σr_{l,k}x^k を順に素朴な畳み込みで掛ければ、係数が全体の R_k になる。法10^9+7で階乗・逆階乗を2Nまで用意し、各cycleの係数を O(l)、全成分の積を合計 O(N²) で求める。分母2l−kは法より小さい正整数なので逆元がある。公式制約は N≤3000 であり、この二次時間が使える。

典型として持ち帰るのは、禁止置換の包除を「禁止位置への部分matching」へ変換し、次数2の成分をrook多項式として独立に合成することである。

## 典型の発動条件

### 順列制約の包除とrook多項式

発動条件: 各位置に少数の禁止値があり、それらを全て避ける順列を数えるとき。

同時に固定できる禁止マスを、行・列を共有しないmatchingとして数える。k個固定後の自由な位置の(N−k)!を掛け、符号(−1)^kで合成する。

### 次数2の二部グラフの成分分解

発動条件: 禁止関係が二つの順列の重ね合わせで、各位置・各値が高々二つの禁止マスを持つとき。

cycleの非隣接辺選択を二項係数で数え、matching数の多項式を成分ごとに掛ける。重複する一つの禁止マスは1+xとして扱う。

## 問題固有の要素

二つの順列が作る禁止二部グラフは、重複マスを除くと一本の辺か偶数長cycleへ分かれる。cycleのmatching数を切り口の使用有無に分ければ、成分内の指数個の選択を二項係数で集約できる。

別の問題へ持ち帰る視点: 包除の禁止事象が同時成立する条件をmatchingへ翻訳できるなら、禁止関係のグラフの次数と成分形を先に調べる。

## 正当性

k個の違反位置で選んだ禁止値は互いに異なる必要があり、禁止二部グラフのk辺matchingと全単射になる。残り位置の埋め方は(N−k)!で、包除により違反なしだけ残る。各成分のmatchingは独立で、cycleの非隣接辺選択は切り口の使用有無による二項係数の和で数えられる。重複禁止マス一つの成分だけ1+xとすれば過剰に数えない。成分多項式の積が正確なR_kを与えるので包除式が答えになる。

## 実装上の注意

- p_i=q_i は二本の禁止辺ではなく一つの禁止マス。cycle長1は多項式1+xとする。
- cycleの l は行側の頂点数、辺数は2l。階乗は2Nまで、最後の自由な埋め方の階乗は(N−k)!。
- 法は10^9+7であり、通常の998244353のNTTをそのまま使わない。この制約では素朴な多項式積のO(N²)でよい。

## 復習の核

- 順列の禁止位置を包除する際は、同時に固定する行と値の衝突を部分matchingとして扱う。
- 二つの順列の重ね合わせは、禁止マスを辺とする二部グラフで次数2になる。
- 同じ禁止マスを二度数えない。cycle長1の例外と、最後の自由な埋め方の階乗を分ける。

## 計算量と制約

### 時間

O(N²)。成分多項式を次数別DPで合成する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3000; 1 \leq p_i, q_i \leq N; p_i \neq p_j \, (i \neq j); q_i \neq q_j \, (i \neq j); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2442) — source-abc214-editorial-2442-52077edcf8cf051cc8cfc0cb24240ce0bdc9810984a67e168e3a35a98177dd15
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_g) — source-abc214-g-problem-1d5f574ef1dcfb070b719ca8bec70d5120694520f60028351f343bdaac164613
