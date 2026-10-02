---
title: "ABC224-H — Security Camera 2"
draft: true
authoringUnit: {"problemId":"abc224-h","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc224-h.md","learningOutcomeIds":["outcome-model-min-cost-flow"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow"],"sourceRevisionIds":["source-abc224-editorial-2812-a963e4de418ac85ab207eb1bf6e27d89df99910c5a60715e73a3e1328ee2127f","source-abc224-h-problem-903a884b4f5f0da73fb92d1839d4c147b319f2e7dbd7febaaba82a38c349fa59"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"元camera LPの各下限へ非負双対係数kを掛けると報酬ΣCkを得る下界。行和≤A、列和≤Bが二部flow容量になり、元/双対の整数性と強双対で最大flow報酬が元camera最小費用に等しい。任意送流量を許し負利益のaugmentationは採らない。","sourceRevisionIds":["source-abc224-editorial-2812-a963e4de418ac85ab207eb1bf6e27d89df99910c5a60715e73a3e1328ee2127f","source-abc224-h-problem-903a884b4f5f0da73fb92d1839d4c147b319f2e7dbd7febaaba82a38c349fa59"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

左頂点のカメラ数l_i、右頂点のカメラ数r_jと置くと、全条件は l_i+r_j≥C_ij、目的はΣA_i l_i+ΣB_j r_jの最小化という線形不等式系になる。 双対変数k_ijの制約はΣ_j k_ij≤A_i、Σ_i k_ij≤B_jであり、左から右へ流す量の行・列容量そのものになる。 二部構造の整数性により実数LPへ緩和しても整数最適解が存在し、双対の整数容量フローから元問題の整数答えが得られる。

採用する候補: 線形計画の双対を取り、行容量A_i、列容量B_j、単位流あたり報酬C_ijの二部ネットワークとして最小費用流で解く。

元の下限制約へ非負係数を掛けた最良の下界が双対となり、その行列は二部フローとして表せて整数最適解も保証される。

棄却する候補: 各頂点に置くカメラ数を0から100まで列挙する多次元DPを行う。

最大200頂点の選択が直積になり、頂点ごとの個数を状態として保持できない。

双対変数k_ijの制約はΣ_j k_ij≤A_i、Σ_i k_ij≤B_jであり、左から右へ流す量の行・列容量そのものになる。

二部構造の整数性により実数LPへ緩和しても整数最適解が存在し、双対の整数容量フローから元問題の整数答えが得られる。

sourceから左iへ容量A_i、左iから右jへ報酬C_ij、右jからsinkへ容量B_jを張り、送流を任意にできる最大費用流、または符号を反転した最小費用流を計算する。

## 典型の発動条件

### 線形計画の双対化

発動条件: 非負変数に対する多数の一次下限制約と線形費用の最小化があり、制約の重み付き和が目的関数の下界を与えるとき。

各l_i+r_j≥C_ijへ双対変数k_ijを置き、頂点費用を行・列の容量制約へ移す。

### 二部ネットワークの最小費用流

発動条件: 非負変数k_ijに行和・列和の上限があり、セルごとの線形報酬を最大化するとき。

行と列を二部頂点にし、容量をsource側・sink側、C_ijを中央辺の負費用として表す。

## 問題固有の要素

元問題ではA_i,B_jがカメラ一個の価格だが、双対ではそのまま左・右頂点から流せる総量の容量になる。

別の問題へ持ち帰る視点: 『変数ごとの価格』と『変数対の下限制約』が交差するLPでは、双対を取って価格を容量、下限値を報酬へ交換する。

## 正当性

元camera LPの各下限へ非負双対係数kを掛けると報酬ΣCkを得る下界。行和≤A、列和≤Bが二部flow容量になり、元/双対の整数性と強双対で最大flow報酬が元camera最小費用に等しい。任意送流量を許し負利益のaugmentationは採らない。

## 実装上の注意

- 報酬C_ijを負費用として扱う場合、負の改善路がなくなれば止めるか、0費用の迂回辺を加えて固定流量を送る。費用総和は64 bitで保持する。

## 復習の核

- 二部の各組に l_i+r_j≥C_ij が並ぶ形を見たら、制約へ掛ける係数を流量とみなす双対を紙上で作る。

## 計算量と制約

### 時間

左N右M、総flow上限F=min(ΣA,ΣB)、V=N+M+2,E=O(NM+N+M)。potential付き任意流量min-cost flow O(F E log V) の整数容量による安全上界。

### 空間

network O(NM+N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le L,R \le 100; 1 \le A_i,B_i \le 10; 0 \le C_{i,j} \le 100

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/editorial/2812) — source-abc224-editorial-2812-a963e4de418ac85ab207eb1bf6e27d89df99910c5a60715e73a3e1328ee2127f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/tasks/abc224_h) — source-abc224-h-problem-903a884b4f5f0da73fb92d1839d4c147b319f2e7dbd7febaaba82a38c349fa59
