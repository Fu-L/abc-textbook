---
title: "ABC224-H — Security Camera 2"
draft: true
authoringUnit: {"problemId":"abc224-h","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc224-h.md","learningOutcomeIds":["outcome-model-min-cost-flow"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow"],"sourceRevisionIds":["source-abc224-editorial-2812-a963e4de418ac85ab207eb1bf6e27d89df99910c5a60715e73a3e1328ee2127f","source-abc224-h-problem-903a884b4f5f0da73fb92d1839d4c147b319f2e7dbd7febaaba82a38c349fa59"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各下限制約へ非負係数k_ijを掛けた和は、行和≤A_i、列和≤B_jの下でΣC_ij k_ijという目的値の下界を与える。強双対で実数緩和の最小値と最大下界は一致する。非整数な左右変数を逆向きにずらして一変数ずつ整数へ固定する操作は制約と最適性を保つため、元の整数最小値も同じ。双対の行・列容量は二部フローと一致し、整数容量による整数最適解を得る。完全二部構造とC_ij≥0により任意の流量<Fの解を報酬を減らさずFへ拡張できる。固定Fでは非負費用BIG−C_ijの最小化が報酬最大化と同値で、F BIG−c_minが元の整数最小費用となる。","sourceRevisionIds":["source-abc224-editorial-2812-a963e4de418ac85ab207eb1bf6e27d89df99910c5a60715e73a3e1328ee2127f","source-abc224-h-problem-903a884b4f5f0da73fb92d1839d4c147b319f2e7dbd7febaaba82a38c349fa59"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md) — 状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md) — 基本的な明示グラフ探索を土台に、辺重みに応じた緩和・距離確定順を選び、最短距離と計算量を求める。

## 考察

左のカメラ数l_i、右のカメラ数r_jと置くと、全条件はl_i+r_j≥C_ij、目的はΣA_i l_i+ΣB_j r_jの最小化である。各頂点の個数を全列挙すると最大200変数の直積になる。一方、制約へ非負係数k_ijを掛けて足すと、行和Σ_j k_ij≤A_i、列和Σ_i k_ij≤B_jの下でΣC_ij k_ijが目的値の下界になる。LPの強双対により、この下界の最大値が実数緩和の最小値に一致する。

実数緩和が元の整数問題と一致する理由も確認する。最適解の非整数な左変数へ一斉にδを足し、非整数な右変数からδを引く。両端とも非整数の制約では和が変わらず、一端が整数の制約は非整数端が次の整数へ達するまでは破れない。非負条件も0という整数へ達するまでは保つ。目的の変化はδの一次式なので、増えない方向へ動かして一変数が整数になるまで進める。この操作で整数になった変数を固定し、反復すると全変数が整数の最適解を得る。双対は整数容量の二部フローなので整数最適解がある。

k_ijを左iから右jへの流量とみなす。source→左iの容量A_i、右j→sinkの容量B_jが行・列の上限を表し、中央辺の単位報酬がC_ijになる。ただし費用−C_ijのままでは初期potential 0のDijkstraを使えない。固定流量なら報酬をBIG−C_ijの非負費用へ反転できるが、任意流量の問題を固定してよいかが先に必要である。

F=min(ΣA_i,ΣB_j)とする。全(i,j)に中央辺があり、C_ij≥0なので、流量がF未満なら未使用の行容量と列容量を一つずつ選び、その中央辺へ追加できる。報酬は減らない。従って最大報酬は必ず流量Fでも達成できる。この性質は疎な二部グラフや負の報酬ではそのまま使えない。

BIG=max C_ijとし、source→左iは容量A_i・費用0、全左i→右jは容量F・費用BIG−C_ij、右j→sinkは容量B_j・費用0とする。全元費用は非負。F単位を流した最小費用をc_minとすれば、各経路は中央辺を一つ通るためc_min=F BIG−最大報酬。答えはF BIG−c_minである。初期potential 0から始め、以後の残余逆辺はpotentialの更新で処理でき、Bellman–Ford初期化は不要。

Cが全て0ならBIG=0、固定Fを送っても報酬は0で、元のカメラ数も全て0でよい。双対の流量と元のカメラ数は異なる変数であり、固定FはカメラをF個置くという意味ではない。

## 典型の発動条件

### 線形計画の双対化

発動条件: 非負変数に対する多数の一次下限制約と線形費用の最小化があり、制約の重み付き和が目的関数の下界を与えるとき。

各l_i+r_j≥C_ijへ双対変数k_ijを置き、頂点費用を行・列の容量制約へ移す。

### 二部ネットワークの最小費用流

発動条件: 非負変数k_ijに行和・列和の上限があり、セルごとの線形報酬を最大化するとき。

行と列を二部頂点にし、source側・sink側で容量を制限する。固定流量で中央辺の報酬C_ijを非負費用BIG−C_ijへ移す。

## 問題固有の要素

元問題ではA_i,B_jがカメラ一個の価格だが、双対ではそのまま左・右頂点から流せる総量の容量になる。

別の問題へ持ち帰る視点: 『変数ごとの価格』と『変数対の下限制約』が交差するLPでは、双対を取って価格を容量、下限値を報酬へ交換する。

## 正当性

各下限制約へ非負係数k_ijを掛けた和は、行和≤A_i、列和≤B_jの下でΣC_ij k_ijという目的値の下界を与える。強双対で実数緩和の最小値と最大下界は一致する。非整数な左右変数を逆向きにずらして一変数ずつ整数へ固定する操作は制約と最適性を保つため、元の整数最小値も同じ。双対の行・列容量は二部フローと一致し、整数容量による整数最適解を得る。完全二部構造とC_ij≥0により任意の流量<Fの解を報酬を減らさずFへ拡張できる。固定Fでは非負費用BIG−C_ijの最小化が報酬最大化と同値で、F BIG−c_minが元の整数最小費用となる。

## 実装上の注意

- 流量Fを固定できるのは全(i,j)の辺と非負報酬による。中央辺の容量はFで十分。
- BIG=max C_ijとして全元費用を非負にし、初期potential 0を使う。回答はF BIG−累積費用。
- Cが全て0のときも固定流量の構成を使える。カメラ数と双対の流量を混同しない。
- 回答・累積費用・potentialは整数で保持する。

## 復習の核

- 二部の各組に l_i+r_j≥C_ij が並ぶ形を見たら、制約へ掛ける係数を流量とみなす双対を紙上で作る。

## 計算量と制約

### 時間

左L右R、F=min(ΣA_i,ΣB_j)≤1000、V=L+R+2,E=O(LR+L+R)。初期potential 0で高々F回のDijkstra増加を行いO(LR+F E log(V+1))。負元費用の初期化は不要。

### 空間

network O(NM+N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le L,R \le 100; 1 \le A_i,B_i \le 10; 0 \le C_{i,j} \le 100

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/editorial/2812) — source-abc224-editorial-2812-a963e4de418ac85ab207eb1bf6e27d89df99910c5a60715e73a3e1328ee2127f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc224/tasks/abc224_h) — source-abc224-h-problem-903a884b4f5f0da73fb92d1839d4c147b319f2e7dbd7febaaba82a38c349fa59
