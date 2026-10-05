---
title: "ABC428-G — Necklace"
draft: true
authoringUnit: {"problemId":"abc428-g","docPath":"src/content/docs/problems/mathematics/outcome-count-orbits-by-fixed-points/outcome-count-orbits-by-fixed-points-shard-001/abc428-g.md","learningOutcomeIds":["outcome-count-orbits-by-fixed-points"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource","unit-modular-arithmetic","unit-normalization","unit-prime-divisor"],"excludedTopics":["群作用・軌道数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-group-action-orbit-counting","tag-knapsack-resource","tag-modular-arithmetic","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc428-editorial-14241-ca060bb313b0832f3141ca21dd859cb566100282997d6738967a1166139fb941","source-abc428-g-problem-4c9ee096b30b6e265ffac8108560bbf30f1b95277ec6655592c23b0115876ef3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"length Lのrotation iが固定する列はgcd(i,L)のcycleで同じ宝石を置き、全積は代表積のd=L/gcd乗になる。同じdを持つrotation数φ(d)を使い、ordered代表列の数A(L/d)[y]を重み付けすると固定点総和を得る。Lで割るBurnside平均は周期的necklaceも正しいstabilizer倍率で一度数える。","sourceRevisionIds":["source-abc428-editorial-14241-ca060bb313b0832f3141ca21dd859cb566100282997d6738967a1166139fb941","source-abc428-g-problem-4c9ee096b30b6e265ffac8108560bbf30f1b95277ec6655592c23b0115876ef3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [群作用・軌道数え上げ](src/content/docs/learn/combinatorics-algebra/orbit-counting.md)

- 群作用の固定点数を群要素のcycle typeごとに数え、BurnsideまたはPólyaの平均でorbit数を求められる。

先に読む単元:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md) — 対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md) — 初歩的な素因数分解を、指数vectorと約数格子へ条件を分解する道具として発展させる。

## 考察

美しさの総積が U 以下なので、各宝石が 2 以上なら列長は V=⌊log_2 U⌋ 以下である。回転同値な列の個数は、各回転で不変な列を数えて平均する Polya/Burnside の形に合う。

採用する候補: 積ごとの長さ n の列数 A(n)[x] を乗法的 DP で求め、各長さ L の回転の不動点数を約数ごとに集計する。

V が小さく、A(0)…A(V) を O(U log^2 U) で構築すれば Polya の式を全 x≤U に適用できる。

棄却する候補: 全ての宝石列を生成し、最小回転を代表として set で重複除去する。

列数が指数的で、回転同値判定以前に列挙できない。

L 個の位置を d 周期の回転が巡回置換すると、各巡回内は同じ宝石でなければならず、総積 x は各代表値の d 乗になる。

回転量 i の巡回数は gcd(i,L) で、同じ d=L/gcd(i,L) を与える回転数は φ(d) 個である。

A(n)[x] を『長さ n、総積 x の順序付き列数』として、宝石の頻度との積約数 DP で n≤V まで前計算する。各 L≤V、d|L、各完全 d 乗 x=y^d≤U について φ(d)·A(L/d)[y]/L を答え[x]へ加える。

## 典型の発動条件

### Burnside の補題・Polya 数え上げ

発動条件: 有限群の作用で同一視した配置を数え、各操作の不動点を計算できるとき。

巡回回転ごとの不動ネックレス数を gcd と Euler の φ で約数集約する。

### 積を状態にする DP

発動条件: 列の要素を追加したとき状態量が加算でなく乗算され、上限が与えられるとき。

現在積 x と次の美しさ a から xa≤U へ遷移し、長さ別の順序付き列数を作る。

### 約数・完全冪の列挙

発動条件: 巡回構造により同じ値が d 回現れ、総積が d 乗に制約されるとき。

x が y^d の場合だけ対応する A(L/d)[y] を不動点数へ寄与させる。

## 問題固有の要素

回転不変性は位置の巡回ごとの同値制約となり、加法的な色数ではなく積の d 乗条件として現れる。

別の問題へ持ち帰る視点: 群作用と集約量を組み合わせるときは、各巡回へ同じ値を割り当てた結果の集約量を式に落とす。

## 正当性

length Lのrotation iが固定する列はgcd(i,L)のcycleで同じ宝石を置き、全積は代表積のd=L/gcd乗になる。同じdを持つrotation数φ(d)を使い、ordered代表列の数A(L/d)[y]を重み付けすると固定点総和を得る。Lで割るBurnside平均は周期的necklaceも正しいstabilizer倍率で一度数える。

## 実装上の注意

- mod 998244353 上で L の逆元を掛ける。y^d の計算は U を超えた時点で打ち切り、A(0) の空列と長さ範囲を一貫して扱う。

## 復習の核

- 約数 d が回転の巡回長、A の長さが L/d、総積の根が y になる対応を取り違えていないか式で確認する。

## 計算量と制約

### 時間

O(U log U·log U)を積約数DPの上界とする。長さV=⌊log_2U⌋、全積遷移数Σ_nΣ_{xy≤U}1=O(VU log U)。

### 空間

O(UV)、長さ軸をrollingする集計ならO(U)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 2 \leq U \leq 5 \times 10^5; 2 \leq b_i \leq U; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/editorial/14241) — source-abc428-editorial-14241-ca060bb313b0832f3141ca21dd859cb566100282997d6738967a1166139fb941
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc428/tasks/abc428_g) — source-abc428-g-problem-4c9ee096b30b6e265ffac8108560bbf30f1b95277ec6655592c23b0115876ef3
