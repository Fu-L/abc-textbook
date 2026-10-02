---
title: "ABC325-E — Our clients, please wait a moment"
draft: true
authoringUnit: {"problemId":"abc325-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc325-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc325-e-problem-f837bba1c1ab4c1edc465e11e65ca1b5003adc5e01a14a6dcff9c5b69df9b038","source-abc325-editorial-7478-aa9a97d79b110d7443c3f3f4e3cdfbeb63f731737d117e4a029b7709167ce355"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"合法routeはcar区間とtrain区間を一つのswitch都市で分割できる。固定switchで両区間は独立だから二つの最短距離和が最適。train距離は対称性で終点から求められ、全switchの最小が全合法routeを覆う。","sourceRevisionIds":["source-abc325-e-problem-f837bba1c1ab4c1edc465e11e65ca1b5003adc5e01a14a6dcff9c5b69df9b038","source-abc325-editorial-7478-aa9a97d79b110d7443c3f3f4e3cdfbeb63f731737d117e4a029b7709167ce355"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、D12=4、A=2,B=1,C=1。","procedure":["car費用8、train費用5。","都市1でswitchなら5、都市2でswitchなら8。","小さい方。"],"executionTarget":null,"expectedResult":"5","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"道路が有向なら終点から同じ向きのDijkstraでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。i→Nを求めるにはtrain graphの逆辺でNから探索する。"},"answer":{"reasoningOrVerification":"不可。i→Nを求めるにはtrain graphの逆辺でNから探索する。","procedure":["具体例の各状態・寄与を再計算する。","不可。i→Nを求めるにはtrain graphの逆辺でNから探索する。"],"expectedResult":"不可。i→Nを求めるにはtrain graphの逆辺でNから探索する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

carからtrainへは高々1回だけ切り替え、逆は不可なので、routeは「city 1からswitch city iまでcarのみ」＋「iからcity Nまでtrainのみ」に分かれる。 固定iでの両区間は独立なsingle-mode shortest pathなので、car距離X_iとtrain距離Y_iの和を全iで最小化すればよい。 Dは対称なのでi→Nのtrain shortest distanceはN→iと同じweight graphで求められる。 carのみでNまで行くcaseはswitch i=N、trainのみはi=1に含まれ、特別caseを別計算する必要がない。 complete graphなのでheap版より、未確定最小頂点をarray走査するDijkstraを使えば各modeをO(N^2)で素直に実装できる。

採用する候補: city 1からcar weightのDijkstra、city Nからtrain weightのDijkstraを各1回行い、min_i(X_i+Y_i)を取る。

全switch位置を2本のsingle-source距離arrayで同時評価し、dense graphでもN≤1000の二乗Dijkstraで処理できる。

棄却する候補: 各switch city iごとに前半・後半のshortest pathを別々に解く。

同じmodeの距離計算をN回繰り返し、不要な三次規模になる。

棄却する候補: city 1からi、iからNを直接1 edgeで移動するcostだけ比較する。

Dは三角不等式を保証されず、中間cityを経由した方が短い場合がある。

carのみでNまで行くcaseはswitch i=N、trainのみはi=1に含まれ、特別caseを別計算する必要がない。

complete graphなのでheap版より、未確定最小頂点をarray走査するDijkstraを使えば各modeをO(N^2)で素直に実装できる。

car graphのedge(i,j)=A·D_{i,j}でsource 1からdense DijkstraしXを得る。train graphのedge(i,j)=B·D_{i,j}+Cでsource Nから同様にYを得る。全i=1..NのX_i+Y_iの最小値を64bit整数で出力する。

## 典型の発動条件

### 一方向mode switchの分割

発動条件: mode AからBへ一度だけ切替可能で逆は禁止されるshortest route。

switch頂点前後のsingle-mode距離を足す。

### dense graph Dijkstra

発動条件: Nが約1000で全頂点対edge weightが入力matrixからO(1)取得できるとき。

priority queueなしの最小未確定頂点走査でO(N^2)にする。

### reverse-source shortest path

発動条件: 各頂点から共通sinkへの距離が必要でedge weightが対称またはreverse graphを作れるとき。

sinkをsourceにした1回の探索で全Y_iを得る。

## 問題固有の要素

乗換cityを直接列挙してrouteを解く代わりに、全候補へ共有されるcar prefix距離とtrain suffix距離を別々に一括計算できる。

別の問題へ持ち帰る視点: 経路が1つの境界点で2種類へ分かれる問題は、両側の全点距離arrayを前計算してmin-plusで結合する。

## 正当性

合法routeはcar区間とtrain区間を一つのswitch都市で分割できる。固定switchで両区間は独立だから二つの最短距離和が最適。train距離は対称性で終点から求められ、全switchの最小が全合法routeを覆う。

## 実装上の注意

- edge costとpath totalは32bitを超えるため64bit整数と十分大きいINFを使う。
- trainは移動1回ごとに+Cなので、D_{i,j}B+Cをedge単位で加える。

## 復習の核

- Dがmetricでない3-city例を作り、直接edgeより中継が短くなることと、i=1,Nがsingle-mode routeを含むことを確認する。

## 計算量と制約

### 時間

都市N、dense complete graph。二回dense Dijkstra O(N²)、switch列挙 O(N)。

### 空間

入力距離行列 O(N²)、二距離配列 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 1000; 1 \leq A, B, C \leq 10^6; D_{i,j} \leq 10^6; D_{i,i} = 0; D_{i,j} = D_{j,i} > 0 (i \neq j); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、D12=4、A=2,B=1,C=1。

1. car費用8、train費用5。
2. 都市1でswitchなら5、都市2でswitchなら8。
3. 小さい方。

期待される結果: 5

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

道路が有向なら終点から同じ向きのDijkstraでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。i→Nを求めるにはtrain graphの逆辺でNから探索する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc325/tasks/abc325_e) — source-abc325-e-problem-f837bba1c1ab4c1edc465e11e65ca1b5003adc5e01a14a6dcff9c5b69df9b038
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc325/editorial/7478) — source-abc325-editorial-7478-aa9a97d79b110d7443c3f3f4e3cdfbeb63f731737d117e4a029b7709167ce355
