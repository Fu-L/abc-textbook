---
title: "ABC245-EX — Product Modulo 2"
draft: true
authoringUnit: {"problemId":"abc245-ex","docPath":"src/content/docs/problems/mathematics/outcome-solve-modular-constraints/outcome-solve-modular-constraints-shard-001/abc245-ex.md","learningOutcomeIds":["outcome-solve-modular-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-diophantine","unit-linear-recurrence","unit-modular-arithmetic","unit-prime-divisor"],"excludedTopics":["可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。"],"tagIds":["tag-modular-congruence-crt","tag-linear-recurrence-matrix","tag-modular-arithmetic","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc245-editorial-3636-3f7a38d575cf227f01f23d0f20e8976c613f17c7fbb521aa36ae3a4a18f09b8d","source-abc245-ex-problem-3b517c29c8eee1451d6726f6e61a6348e7c9e901738ea33597eb869a62aac760"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"CRTにより法Mの各要素は素数冪ごとの剰余の組へ一対一対応する。法p^qで目標の単元部分を別の単元へ変えても、列の一要素をその比で掛ける全単射があるため個数は打切りp進指数だけに依存する。q+1状態の追加遷移をK回合成して目標指数の数を得て、独立なCRT座標の個数を掛ければ元の列数になる。","sourceRevisionIds":["source-abc245-editorial-3636-3f7a38d575cf227f01f23d0f20e8976c613f17c7fbb521aa36ae3a4a18f09b8d","source-abc245-ex-problem-3b517c29c8eee1451d6726f6e61a6348e7c9e901738ea33597eb869a62aac760"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次合同・CRTで解の類を統合する](src/content/docs/learn/number-theory/modular-congruence.md)

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 考察

M≤10^12 は全剰余を状態にできない一方、素因数分解は試し割りで扱える範囲であり、M を互いに素な素数冪へ分解できる。

法 p^q では、積が特定の剰余 N になる列数は N の単元部分そのものではなく、打ち切った p 進指数 min(v_p(N),q) だけで決まる。

採用する候補: M を素数冪 p^q に分け、各法で p 進指数 q+1 状態の線形遷移を作る。K 回分を行列累乗し、各素数冪の答えを掛ける。

中国剰余定理で独立化し、K≤10^9 を小さな行列の二分累乗へ、M≤10^12 を高々対数個の指数状態へ縮約できる。

棄却する候補: 長さごとに全剰余 x mod M の個数を持ち、次の A_i=0,…,M-1 を掛ける DP を K 回行う。

M≤10^12、K≤10^9 の双方に対して状態数・遷移回数が大きすぎる。

互いに素な各 p^q への剰余の組は法 M の剰余と一対一対応するため、各座標で積が N と一致する列数を独立に数えて積を取れる。

p^q ごとに t=min(v_p(n),q) で F(p,q,k,n) を分類すると値は q+1 種類だけで、要素を 1 個追加する操作は固定行列による線形変換になる。

M を ∏p^q に分解する。各素数冪について、目標剰余を打ち切り p 進指数で分類した q+1 次元 vector と 1 要素追加の遷移行列を構成し、K 乗を二分累乗で適用する。N mod p^q の指数に対応する成分を取り、全因子分を 998244353 で掛ける。

## 典型の発動条件

### 中国剰余定理による素数冪分解

発動条件: 法が合成数で、条件が互いに素な素数冪ごとの合同条件へ分離できるとき。

法 M の積合同を各 p^q の合同へ分け、列数を因子ごとに求めて掛け合わせる。

### p 進指数による状態圧縮

発動条件: 素数冪 modulo の乗法で、値そのものより素因数 p の個数が遷移を支配するとき。

非零指数 0,…,q-1 と 0 を表す打ち切り指数 q の q+1 状態へ剰余を集約する。

### 行列累乗

発動条件: 同一の線形遷移を非常に多い K 回繰り返すとき。

素数冪ごとの固定遷移行列を二分累乗し、K≤10^9 回の積選択をまとめる。

## 問題固有の要素

巨大な法 M 上の積 DP は、CRT で素数冪へ分け、さらに各素数冪で目標の p 進指数だけを見ると小次元の反復遷移になる。

別の問題へ持ち帰る視点: 巨大な剰余状態では、法の直積分解と、各局所環で結果を不変にする分類量を二段階で探す。

## 正当性

CRTにより法Mの各要素は素数冪ごとの剰余の組へ一対一対応する。法p^qで目標の単元部分を別の単元へ変えても、列の一要素をその比で掛ける全単射があるため個数は打切りp進指数だけに依存する。q+1状態の追加遷移をK回合成して目標指数の数を得て、独立なCRT座標の個数を掛ければ元の列数になる。

## 実装上の注意

- N≡0 mod p^q は指数 q の専用状態として扱い、通常の v_p を無限に回そうとしない。
- 遷移係数の導出で p や p-1 による除算を使う実装は、それらが 998244353 の倍数だと逆元が存在しない。整数として数えた係数を除算なしで剰余化する形にする。

## 復習の核

- N=0 の素数冪成分と、p または p-1 が答えの法 998244353 で 0 になる場合を分け、遷移係数が不正な modular division に依存していないか確認する。

## 計算量と制約

### 時間

O(√M+Σ_{p^q|M}(q+1)³ log K)。素因数分解後に各指数状態行列を累乗する。

### 空間

O(Σ(q+1)²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq 10^9; 0 \leq N \lt M \leq 10^{12}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/editorial/3636) — source-abc245-editorial-3636-3f7a38d575cf227f01f23d0f20e8976c613f17c7fbb521aa36ae3a4a18f09b8d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/tasks/abc245_h) — source-abc245-ex-problem-3b517c29c8eee1451d6726f6e61a6348e7c9e901738ea33597eb869a62aac760
