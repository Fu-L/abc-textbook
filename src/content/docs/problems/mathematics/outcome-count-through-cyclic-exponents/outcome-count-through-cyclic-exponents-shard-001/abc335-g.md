---
title: "ABC335-G — Discrete Logarithm Problems"
draft: true
authoringUnit: {"problemId":"abc335-g","docPath":"src/content/docs/problems/mathematics/outcome-count-through-cyclic-exponents/outcome-count-through-cyclic-exponents-shard-001/abc335-g.md","learningOutcomeIds":["outcome-count-through-cyclic-exponents","outcome-find-period-by-multiplicative-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-divisor-mobius-inversion","unit-modular-arithmetic","unit-multiplicative-order-periods","unit-prime-divisor"],"excludedTopics":["乗法的位数から最小周期だけを求める問題。"],"tagIds":["tag-cyclic-exponent-counting","tag-multiplicative-order","tag-divisor-mobius-inversion","tag-modular-arithmetic","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc335-editorial-9017-e3ef8c4a9693dbb99548ccbcd4ff92ba7339cda1ec9fbc2891082c6d23f2a1e4","source-abc335-g-problem-80a8cbbb0788612c44a20ee53443f692ee15c96b6b90d1bae1a89f10950e3f65"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"素数法の乗法群は巡回で各位数の部分群が一意。A_jがA_iの冪であることはord(A_j)|ord(A_i)と同値。位数削減は候補mに対しA^{m/q}=1のときだけqを除くので真の位数へ到達する。指数vectorのprefix zetaは全約数位数の頻度を足し、各始点頻度を掛ければ順序付きの到達組数になる。","sourceRevisionIds":["source-abc335-editorial-9017-e3ef8c4a9693dbb99548ccbcd4ff92ba7339cda1ec9fbc2891082c6d23f2a1e4","source-abc335-g-problem-80a8cbbb0788612c44a20ee53443f692ee15c96b6b90d1bae1a89f10950e3f65"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [巡回群を指数化して数える](src/content/docs/learn/number-theory/cyclic-group-exponent-counting.md)

- 巡回部分群を指数と約数格子で分類し、重複を補正して対象を数えられる。
- 合同式で表された反復の最小周期を乗法的位数に帰着し、約数から求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [約数格子のzeta・Möbius反転](src/content/docs/learn/combinatorics-algebra/divisor-mobius-inversion.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [乗法的位数から最小周期を求める](src/content/docs/learn/number-theory/multiplicative-order-periods.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 乗法的位数から最小周期だけを求める問題。

## 考察

mod prime Pの非零元は位数P-1の巡回群をなし、A_iの冪で到達できる集合はA_iが生成する部分群である。したがってA_jへ到達可能であることはord(A_j)がord(A_i)を割ることと同値になる。

採用する候補: 各A_iの位数を求め、約数lattice上の頻度zeta変換で整除pairを数える

離散対数そのものを求めず、部分群包含を位数の整除へ落として全pairを約数数に依存する計算へ圧縮できる。

棄却する候補: 各(i,j)についてdiscrete logarithmを解く

N^2 pairがあり、各pairの離散対数も高価で制約に全く合わない。

P-1を素因数分解しM=P-1から、素因数qごとにA_i^(M/q)≡1の間Mをqで割ると最小位数が得られる。ord(A_j)|ord(A_i)なら巡回群の一意な同位数部分群の包含により正の冪kが存在する。

P-1をtrial divisionで素因数分解する。各A_iについてmodular exponentiationで位数を削減し、その素因数指数vectorの頻度を数える。mixed-radix配列上で各軸のprefix zeta変換を行って各dに対するΣ_{e|d}freq[e]を得て、Σ_d freq[d]·divisorCount[d]を出力する。

## 典型の発動条件

### 有限巡回群の位数

発動条件: 冪到達可能性が乗法群内の生成部分群への所属で決まる。

各値を具体的な離散logでなくelement orderへ写し、部分群包含を整除判定にする。

### 約数latticeの高速zeta変換

発動条件: 全orderが一つの整数P-1の約数で、各dについて約数frequency和が欲しい。

素因数指数vectorの各次元で累積し、全divisor下方和をまとめて計算する。

## 問題固有の要素

到達条件にはA_iとA_jの具体値ではなく二つの位数しか残らないため、同じ位数の入力をfrequencyへ完全に集約できる。

別の問題へ持ち帰る視点: 巡回群の冪関係はelement orderで商を取り、約数poset上の集計問題へ変換できる。

## 正当性

素数法の乗法群は巡回で各位数の部分群が一意。A_jがA_iの冪であることはord(A_j)|ord(A_i)と同値。位数削減は候補mに対しA^{m/q}=1のときだけqを除くので真の位数へ到達する。指数vectorのprefix zetaは全約数位数の頻度を足し、各始点頻度を掛ければ順序付きの到達組数になる。

## 実装上の注意

- Pは10^13なので乗算modには128bit相当を用いる。位数削減では各prime factorを割れる限り反復し、(i,j)は順序付きかつi=jも含む。

## 復習の核

- 小さいprimeで全kを周期まで列挙し、A=1、同位数の重複、位数が互いに非整除、P-1がprime power・複数素因数の場合を照合する。

## 計算量と制約

### 時間

O(√P+N·Σ_{q|P−1}v_q(P−1)log P+D·s)。D=τ(P−1)、sは相異なる素因数数。

### 空間

O(N+D)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i < P; 2 \leq P \leq 10^{13}; P is prime.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc335/editorial/9017) — source-abc335-editorial-9017-e3ef8c4a9693dbb99548ccbcd4ff92ba7339cda1ec9fbc2891082c6d23f2a1e4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc335/tasks/abc335_g) — source-abc335-g-problem-80a8cbbb0788612c44a20ee53443f692ee15c96b6b90d1bae1a89f10950e3f65
