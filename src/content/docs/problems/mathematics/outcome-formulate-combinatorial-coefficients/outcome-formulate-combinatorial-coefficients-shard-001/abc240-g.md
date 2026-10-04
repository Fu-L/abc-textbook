---
title: "ABC240-G — Teleporting Takahashi"
draft: true
authoringUnit: {"problemId":"abc240-g","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc240-g.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc240-editorial-3423-f1ae91f9a88b3ccf4ed145d2a904347e29aa782a320a7510c8ee6f1a870d9c0d","source-abc240-g-problem-0d05122adbbea727dceed2629d2df052e4505a4b6829b2188ad615c73666d1c9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"zへ使うk時刻をC(N,k)で選べばz経路とxy経路は独立に決まる。xyの四方向はu=x+y,v=x−y上の±1の全4組に一対一対応するため、二つの一次元経路数の積になる。各経路はz歩数kが一意なのでその積を全kで足すと全三次元経路を一度数える。","sourceRevisionIds":["source-abc240-editorial-3423-f1ae91f9a88b3ccf4ed145d2a904347e29aa782a320a7510c8ee6f1a870d9c0d","source-abc240-g-problem-0d05122adbbea727dceed2629d2df052e4505a4b6829b2188ad615c73666d1c9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

先に読む単元:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md) — 座標と外積・距離式で向きや交差を代数判定し、凸幾何へ進む前提を作る。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

一次元で n 歩後に座標 x へ着く経路は、到達可能性 n≥|x| と parity が合う場合に正方向歩数を固定でき、二項係数一つで数えられる。

三次元の六方向を直接方向回数へ分けると自由度が多いが、z 軸へ使う k 回を固定すれば、残り N-k 回は独立な二次元格子問題になる。

採用する候補: z 移動回数 k を総和し、z 部分を一次元公式、xy 部分を (x+y,x-y) 変換で二つの一次元公式へ分解して二項係数を掛ける。

各 k の寄与を組合せ公式だけで評価でき、方向回数の二重列挙を一つの和へ減らせる。

棄却する候補: ±x,±y,±z の六方向回数を全て列挙し、多項係数を足す。

終点条件を入れても複数の自由変数が残り、N が10^7のとき二重以上の列挙はできない。

xy 平面で (u,v)=(x+y,x-y) とすると、一回の四方向移動が u,v それぞれ独立な ±1 になり、f_2(n,x,y)=f_1(n,x+y)f_1(n,x-y) と積に分かれる。

k 個の z 手を N 個の時刻から選ぶ binomial(N,k) が、z の経路と xy の経路を元の時系列へ interleave する係数になる。

階乗と逆階乗を N まで前計算し、到達不能なら0を返す一次元関数 f1(n,x)=C(n,(n+|x|)/2) を用意する。k=0..N について C(N,k)f1(k,Z)f1(N-k,X+Y)f1(N-k,X-Y) を加算する。

## 典型の発動条件

### 座標変換による独立化

発動条件: 二次元の一手候補が二つの符号選択の直積へ写せるとき。

(x+y,x-y) 座標で各成分の一次元 walk を独立に数える。

### 操作列の interleave

発動条件: 異なる種類の操作をそれぞれ内部順序付きで選び、全時系列へ混ぜるとき。

種類ごとの回数を固定し、binomial coefficient で配置時刻を選ぶ。

## 問題固有の要素

三次元を一度に解かず、z 手数を固定して「一次元×変換済み二次元」へ段階的に次元を落とす。

別の問題へ持ち帰る視点: 高次元 walk は一軸の使用回数を外側で和にし、残り次元に独立化できる変換がないか探す。

## 正当性

zへ使うk時刻をC(N,k)で選べばz経路とxy経路は独立に決まる。xyの四方向はu=x+y,v=x−y上の±1の全4組に一対一対応するため、二つの一次元経路数の積になる。各経路はz歩数kが一意なのでその積を全kで足すと全三次元経路を一度数える。

## 実装上の注意

- f1 は n<|x| または n-|x| が奇数なら0とする。N<998244353 なので階乗逆元を使え、k の全範囲で負の combination index を参照しない。

## 復習の核

- 一回の x/y 四方向を (u,v) の四符号へ写し、独立選択が元方向へ一意に戻ることを表で確認する。

## 計算量と制約

### 時間

O(N)。階乗表とz方向の歩数kを列挙する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^7; -10^7 \leq X, Y, Z \leq 10^7; N, X, Y, and Z are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/editorial/3423) — source-abc240-editorial-3423-f1ae91f9a88b3ccf4ed145d2a904347e29aa782a320a7510c8ee6f1a870d9c0d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc240/tasks/abc240_g) — source-abc240-g-problem-0d05122adbbea727dceed2629d2df052e4505a4b6829b2188ad615c73666d1c9
