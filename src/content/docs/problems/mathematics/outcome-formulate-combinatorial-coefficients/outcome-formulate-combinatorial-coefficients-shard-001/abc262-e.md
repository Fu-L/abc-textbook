---
title: "ABC262-E — Red and Blue Graph"
draft: true
authoringUnit: {"problemId":"abc262-e","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc262-e.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc262-e-problem-bc5fade319bd5ee2194ece46e588a0f5f4424f33bb25366042252c06b9136ed1","source-abc262-editorial-4479-33a3a1a74196fae91ced253beb14e06629da248ae29423536b8006b1eade4133"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"赤頂点次数和は赤赤辺2回、赤青辺1回なので異色辺の偶奇と一致する。赤頂点のうち奇数次数の個数iだけがその偶奇へ寄与する。奇数次数O個から偶数i個、偶数次数E個からK−i個を選ぶ二項係数和は条件を満たす全色分けを一意に数える。","sourceRevisionIds":["source-abc262-e-problem-bc5fade319bd5ee2194ece46e588a0f5f4424f33bb25366042252c06b9136ed1","source-abc262-editorial-4479-33a3a1a74196fae91ced253beb14e06629da248ae29423536b8006b1eade4133"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 重なりを交互加減する包除・Möbius反転。

## 考察

赤頂点の次数和 S では赤赤辺を二回、赤青辺を一回数えるため、異色辺数 D と S の偶奇は一致する。

次数和の偶奇へ寄与するのは奇数次数の赤頂点だけなので、辺の具体的な接続関係は次数parityへ圧縮できる。

棄却する候補: K 個の赤頂点集合を全て列挙し、各辺の両端色を確認する。

赤集合の組合せ数が指数的で、N=20 万では列挙できない。

採用する候補: 奇数次数頂点数 O と偶数次数頂点数 E を数え、偶数個 i の奇数次数頂点と K−i 個の偶数次数頂点を選ぶ組合せを足す。

異色辺数が偶数という条件が i の偶奇だけになり、各 i の選び方は binom(O,i)binom(E,K−i) である。

S=2R+D を modulo 2 で見ると、cut edge の偶奇が選択頂点の次数parityの XOR に等しい。

グラフcutのparity条件を handshaking identity で頂点属性の選択個数へ移し、二種類から固定個数を選ぶ組合せ和として計算する。

## 典型の発動条件

### 次数和による cut parity

発動条件: 選択頂点集合と補集合をまたぐ辺数の偶奇だけが条件になるとき。

選択側の次数和を取り、内部辺の二重寄与を modulo 2 で消す。

### 属性別の固定個数選択

発動条件: 要素が二種類に分かれ、一方から選ぶ個数の偶奇と総選択数だけが制約になるとき。

許される i を列挙して二つの二項係数の積を合計する。

## 問題固有の要素

赤赤辺数 R は未知でも係数2で現れるため、偶奇判定では完全に消えて異色辺だけが残る。

別の問題へ持ち帰る視点: 辺を端点から数え直すと、内部寄与が法で消えて境界寄与だけ抽出できる場合がある。

## 正当性

赤頂点次数和は赤赤辺2回、赤青辺1回なので異色辺の偶奇と一致する。赤頂点のうち奇数次数の個数iだけがその偶奇へ寄与する。奇数次数O個から偶数i個、偶数次数E個からK−i個を選ぶ二項係数和は条件を満たす全色分けを一意に数える。

## 実装上の注意

- i は偶数だけを走査し、0≤i≤O かつ 0≤K−i≤E を満たす項だけ加える。
- 階乗と逆階乗を N まで前計算し、K=0 を含む境界の二項係数を正しく扱う。

## 復習の核

- cutの辺数parityを見たら、片側頂点の次数和で内部辺を二回数える恒等式を試す。
- グラフ構造が必要に見えても、mod 2 では各頂点の次数parityだけに落ちないか確認する。

## 計算量と制約

### 時間

O(N+M)。次数parityと二項係数表を作る。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 0 \leq K \leq N; 1 \leq U_i \lt V_i \leq N \, (1 \leq i \leq M); (U_i, V_i) \neq (U_j, V_j) \, (i \neq j); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/tasks/abc262_e) — source-abc262-e-problem-bc5fade319bd5ee2194ece46e588a0f5f4424f33bb25366042252c06b9136ed1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/editorial/4479) — source-abc262-editorial-4479-33a3a1a74196fae91ced253beb14e06629da248ae29423536b8006b1eade4133
