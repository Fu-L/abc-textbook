---
title: "最小費用流・circulation"
description: "「最小費用流・circulation」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 124
---

# 最小費用流・circulation

習得対象の目安: **黄色（2000–2399）**。残余辺の費用とpotentialを理解し、流量別の最小費用へ還元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最小費用流・circulation

流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。

### 習得する技能

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 残余費用と、固定流量の最適性

辺u→vの容量をU、単位費用をc、現在の流量をfとする。残余辺は、追加できるu→vが容量U−f・費用c、取り消せるv→uが容量f・費用−cとなる。逆辺を通ることは、以前の割当を取り消して費用を回収する操作である。

同じ流量の二つの実行可能flowの差は、残余network上のcirculation（各頂点の流入と流出が等しい流れ）で、閉路へ分解できる。したがって「残余容量が正の辺からなる負費用閉路がない」は、その流量での最小費用の必要十分条件になる。負閉路があれば、その閉路へ最小残余容量だけ流して流量を変えずに費用を下げられる。なければ、どの差分circulationも費用を下げられない。

逐次最短路増加法は、この固定流量の最適性を保ちながらs→tの流量を増やす。初期flowを0とする場合、初期network全体に負閉路がないことが出発条件である。費用0のs→t辺とは別の成分に総費用−2・容量1の閉路があるなら、最小費用は流量0でも1でも−2。s→t増加だけではその改善を発見できない。

### potentialによる最短路と逆辺の非負化

各頂点のpotential pを用い、残余辺のreduced costを `c'(u,v)=c(u,v)+p[u]−p[v]` と定義する。全ての正容量残余辺についてc'≥0を保つ。pathではpotentialが相殺され、元費用との差は始終点だけで決まるので、c'での最短路も元費用で最短である。閉路では差が0であり、この非負性は負閉路がないことの証明にもなる。

元辺の費用が全て非負ならp=0で初期化できる。負辺を含むが負閉路がない場合は、全頂点へ費用0の辺を張る仮想始点からBellman–Fordで最短距離を求め、pとする。最短距離の不等式p[v]≤p[u]+c(u,v)からc'≥0となる。全頂点を対象にすることで、sから届かない成分の負閉路も検出する。

一回の増加は次のように行う。

1. 正容量残余辺のc'でsからDijkstraを実行し、距離dと最短路の親辺を持つ。tへ届かなければ増加は終了する。
2. D=d[t]とし、全頂点でq[v]=min(d[v],D)、p_new[v]=p[v]+q[v]とする。到達不能なd[v]=∞もq[v]=Dとし、∞を加算しない。
3. 親辺をtから辿り、path上の最小残余容量と必要な残り流量の小さい方Δを流す。順辺容量をΔ減らし、逆辺容量をΔ増やす。元費用での単位増加費用はλ=D−p[s]+p[t]で、総費用へΔλを加える。ここでpは更新前の値である。

距離の不等式d[v]≤d[u]+c'(u,v)とc'≥0から、打ち切ったqでもq[v]≤q[u]+c'(u,v)が成り立つ。ゆえに更新後も `c'_new=c'+q[u]−q[v]≥0`。選んだ最短路上では距離の不等式が等号で、q=dなのでc'_new=0になる。増加で新たに使える逆辺のreduced costも、その符号反転で0。残余network全体の非負性、したがって各流量での最適性を保存できる。到達した頂点にだけdを足す実装では、到達不能頂点からの辺まで同じ不変量を主張できないため、更新範囲と証明を揃える。

### 流量別最小費用とslope

流量Fの最小費用をC(F)とする。一回の増加中は `C(F+x)=C(F)+λx`（0≤x≤Δ）となる。更新後のpotentialではλ=p_new[t]−p_new[s]であり、次のDijkstra距離は非負なので次の限界費用はλ以上になる。Cは区分線形な凸関数で、整数容量ならC(F+1)−C(F)が非減少となる。同じλの増加をまとめ、傾きが変わる端点(F,C(F))だけを記録したものがslopeである。個数ごとの最良matchingなどは、流量を個数に対応させてこの折れ線から評価できる。

[ACLの公式仕様](https://atcoder.github.io/ac-library/production/document_ja/mincostflow.html)では、追加する元辺の容量・費用は非負で、slopeは(0,0)から流量別最小費用の折れ線を返す。残余逆辺の負費用は[実装のpotential更新](https://github.com/atcoder/ac-library/blob/master/atcoder/mincostflow.hpp)が処理する。負の元費用をそのままadd_edgeへ渡すことはできない。費用に定数を足す帰着を使うなら、任意の流量Fの実行可能flowで追加費用が同じ既知量（例えば常にFK）になることを示し、その分を各点から引く。

### circulationとcycle canceling

各頂点の供給・需要を満たす最小費用circulationでは、まず容量・下限制約を満たすflowを求める。その後、仮想始点からのBellman–Fordで残余負閉路を探し、存在する間は閉路へ最小残余容量を流す。各頂点の収支を保ったまま費用が減り、負閉路がなくなれば上記の差分分解により最適である。Bellman–FordのV回目に更新した頂点から親辺をV回辿れば閉路内へ入り、親辺の閉路を取り出せる。

これは最安s→t増加路を探す処理とは目的が異なる。初期負閉路がある場合、まずこの処理などで現在流量の最適flowを作り、potentialを初期化してから増加する。この場合slopeの開始費用C(0)が0とは限らない。全容量が有限なら負閉路があっても費用改善量は有限であり、無限に流せる負閉路がある場合に費用が下へ非有界となる。

## 成立条件と計算量

V頂点・E辺・増加回数Aに対し、二分heapの最短路増加はO(A(V+E) log(V+E))、残余辺・距離の記憶はO(V+E)。負辺がある場合のBellman–Ford初期化はO(VE)。整数容量なら各増加で少なくとも1流せるのでA≤総増加流量Fだが、Fは入力の桁数に対して大きくなり得る。指定流量まで届いたかも返された流量で判定する。

単純なcycle cancelingは、一回の負閉路検出にO(VE)、取消回数Bに対しO(BVE)。整数費用・有限整数容量なら費用が毎回1以上下がるので停止するが、費用幅に依存し、強多項式時間とはいえない。費用・potential・Δλのoverflowを避ける型を選ぶ。ACLではflowとslopeを合わせて複数回呼ぶ挙動は未定義なので、必要な流量範囲を一回のslopeで取得する。

概念上の親: [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、最小費用流・circulationの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC247 G「Dream Team」](https://atcoder.jp/contests/abc247/tasks/abc247_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC407 G「Domino Covering SUM」](https://atcoder.jp/contests/abc407/tasks/abc407_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC231 H「Minimum Coloring」](https://atcoder.jp/contests/abc231/tasks/abc231_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC224 H「Security Camera 2」](https://atcoder.jp/contests/abc224/tasks/abc224_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。） / [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC224 H 公式解説](https://atcoder.jp/contests/abc224/editorial/2812)
- [ABC224 H 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_h)
- [ABC231 H 公式解説](https://atcoder.jp/contests/abc231/editorial/3060)
- [ABC231 H 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-min-cost-flow`
