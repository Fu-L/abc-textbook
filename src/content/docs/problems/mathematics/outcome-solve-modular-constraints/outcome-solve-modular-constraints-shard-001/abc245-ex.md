---
title: "ABC245-EX — Product Modulo 2"
draft: true
authoringUnit: {"problemId":"abc245-ex","docPath":"src/content/docs/problems/mathematics/outcome-solve-modular-constraints/outcome-solve-modular-constraints-shard-001/abc245-ex.md","learningOutcomeIds":["outcome-solve-modular-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-diophantine","unit-linear-recurrence","unit-modular-arithmetic","unit-prime-divisor"],"excludedTopics":["可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。"],"tagIds":["tag-modular-congruence-crt","tag-linear-recurrence-matrix","tag-modular-arithmetic","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc245-editorial-3636-3f7a38d575cf227f01f23d0f20e8976c613f17c7fbb521aa36ae3a4a18f09b8d","source-abc245-ex-problem-3b517c29c8eee1451d6726f6e61a6348e7c9e901738ea33597eb869a62aac760"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"CRT は各要素について剰余の組と法 M の剰余を一対一に対応させるため、各素数冪の列を独立に選んだ積が元の列数となる。k≥1 では一要素へ単元を掛ける全単射により、同じ打切り指数の固定剰余への列数は等しい。前の積の指数 s<q の剰余数と一次合同の解数の積は c=(p−1)p^{q−1}、前の積0から0への解数は p^q。これが記載の行列の各係数を与える。長さ1の全成分1から K−1 回遷移した目標成分は、クラス総数ではなく要求された固定剰余への列数である。","sourceRevisionIds":["source-abc245-editorial-3636-3f7a38d575cf227f01f23d0f20e8976c613f17c7fbb521aa36ae3a4a18f09b8d","source-abc245-ex-problem-3b517c29c8eee1451d6726f6e61a6348e7c9e901738ea33597eb869a62aac760"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次合同・CRTで解の類を統合する](src/content/docs/learn/number-theory/modular-congruence.md)

- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

先に読む単元:

- [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md) — 最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。
- [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md) — 一回分の状態遷移を表せることを前提に、固定線形変換を累乗して巨大回数後へ進める。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

この解説で扱わないこと:

- 可解性判定を要しない通常の法上加減乗除・高速累乗、および剰余周期だけの利用。

## 考察

法 M≤10^12 の全剰余を状態にして K≤10^9 回遷移することはできない。積の合同条件は、M の互いに素な素数冪 p^q ごとの条件へ中国剰余定理で分けられる。各要素の剰余の組に一意な元の要素が対応するので、局所的な列数の積が答えになる。

法 m=p^q で、長さ k≥1 の列の積が「p進指数 t を持つ固定された一つの剰余」になる個数を v_t(k) とする。t=q は剰余0、t<q は min(v_p(n),q)=t の任意の代表 n。単元を一要素に掛ける全単射により、同じ t の代表への個数は等しい。ただし指数クラス全体の個数ではない。例えば m=3,k=1 で v_0=1 だが、非零剰余クラス全体は2個である。

長さ1なら各目標剰余を選ぶ方法は1通りなので v(1)=(1,…,1)。長さ0は積1だけで単元クラス内も一様でないため、この圧縮状態では初期化しない。

追加要素 a を選び、前の積 x に掛けて固定目標 n を作る係数を数える。x の指数が s<q なら x a≡n (mod p^q) の解は、s≤t のとき p^s 個、それ以外は0個。指数 s の x 自体は (p−1)p^{q−s−1} 個なので、掛け合わせると c=(p−1)p^{q−1} が s に依存せず得られる。目標0でも s<q の寄与は同じ c、前の積 x=0 からなら a は m 通り。

よって除算を使わない遷移は

```text
t<q: v'_t = c Σ_{s=0}^t v_s
 t=q: v'_q = c Σ_{s=0}^{q−1}v_s + m v_q
```

行列 T の非零成分は、t<q,s≤t で T[t][s]=c、最終行 s<q で c、T[q][q]=m。他は0である。T^{K−1} を長さ1のベクトルへ作用させ、目標 N mod m の指数 t の成分を読む。K=1 なら累乗は0回で全成分1。M=1 は分解因子のない空積として答え1。

各局所計算を法998244353で行って答えを掛ける。c と m は整数として数えた係数を剰余化するだけなので、p や p−1 が答えの法で0でも逆元を必要としない。

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

CRT は各要素について剰余の組と法 M の剰余を一対一に対応させるため、各素数冪の列を独立に選んだ積が元の列数となる。k≥1 では一要素へ単元を掛ける全単射により、同じ打切り指数の固定剰余への列数は等しい。前の積の指数 s<q の剰余数と一次合同の解数の積は c=(p−1)p^{q−1}、前の積0から0への解数は p^q。これが記載の行列の各係数を与える。長さ1の全成分1から K−1 回遷移した目標成分は、クラス総数ではなく要求された固定剰余への列数である。

## 実装上の注意

- v_t は固定剰余への個数。指数クラスの剰余数を最後にもう一度掛けない。
- 初期ベクトルは長さ1、累乗回数は K−1。K=1、M=1、N=0 をこの規約で処理する。
- 目標0は t=q として扱い、v_p(0) をループで計算しない。
- c=(p−1)p^{q−1},m=p^q を整数の個数から剰余化し、p,p−1 の法逆元を使わない。

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
