---
title: "SCC・縮約DAG・トポロジカル順序"
description: "「SCC・縮約DAG・トポロジカル順序」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 103
---

# SCC・縮約DAG・トポロジカル順序

習得対象の目安: **水色（1200–1599）**。相互到達性で頂点をまとめ、縮約後がDAGになることを使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### SCC・縮約DAG・トポロジカル順序

強連結成分を一頂点へ縮約し、閉路を除いたDAG上の順序・DP・coverへ変換する。

### 習得する技能

- 有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。

## 考え方

強連結成分（SCC）は、互いに有向pathで到達できる頂点の極大集合である。頂点ごとに所属comp[v]を得たら、元の辺u→vでcomp[u]≠comp[v]のものを成分間辺へ写す。縮約に閉路があれば、閉路上の全成分が相互到達できて同じSCCになるはずなので矛盾する。したがって縮約はDAGである。

### Kosarajuの二回のDFS

元graph Gと全辺を逆にしたG_revを用意する。G上で未訪問の全頂点からDFSし、各頂点を「全隣接先の探索後」にorderへ追加する。次に訪問をリセットし、orderの逆順で未訪問頂点を選び、G_rev上でDFSする。一回の探索で取れた頂点を一つのSCCにし、その全頂点へ同じcompを付ける。

Gの縮約辺A→Bがあれば、Aの最大DFS終了時刻はBの最大終了時刻より大きい。Aが先に探索されればBへ入って先に終了し、Bが先ならBからAへ戻れないのでB全体の終了後にAを探索するからである。従って未処理の最大終了時刻の成分Aは、元の縮約でsourceとなる。逆graphではAから別の未処理成分へ出られず、A内部には全頂点へ到達できるので、第二DFSがちょうどAを取り出す。これを繰り返すとsourceからsinkへの成分順になる。

### 成分リストから元頂点へ戻す

ライブラリを使う場合も、返された成分リストgroupsについて、各groups[c]の頂点vへcomp[v]=cを付ける。[ACLのSCC仕様](https://atcoder.github.io/ac-library/production/document_ja/scc.html)は、成分リストが元の辺に沿うトポロジカル順であることを保証する。成分内の頂点順には意味を持たせない。

成分値を初期化し、元辺から縮約辺を作り、source→sink順でDPを後続へ渡す。逆向きに後続の値を集約するなら逆順で走査する。到達可能性を保つ縮約でも、内部の単純path数や費用はcompだけでは復元できないため、元問題に必要な成分内情報を別に保存する。

## 成立条件と計算量

二回のDFSと逆辺の構築はO(V+E)時間・空間。縮約辺を重複のまま持つ構築もO(V+E)。成分対をsortして重複除去するならO(E log E)を加える。存在判定やmax DPでは重複を無視できても、辺の選び方を数える場合は元の多重辺と重複除去の意味を区別する。

概念上の親: [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DAGのtopological processing](/learn/graph/dag-topological-processing/)。

このUnitを直接前提とする単元: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)、[2-SAT・含意グラフ](/learn/graph/two-sat/)。

DAGのtopological processingで得た考え方と実装を再利用し、SCC・縮約DAG・トポロジカル順序の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- SCC・縮約DAG・トポロジカル順序の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC214 H「Collecting」](https://atcoder.jp/contests/abc214/tasks/abc214_h) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。
- [ABC306 G「Return to 1」](https://atcoder.jp/contests/abc306/tasks/abc306_g) — 主題: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)（往復可能な有向領域のclosed walk長が作る周期gcdを求め、巨大な指定歩数での到達可能性を判定できる。）。既習技能: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [推移閉包](/learn/graph/transitive-closure/)（各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。） / [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。

## 根拠

- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC306 G 公式解説](https://atcoder.jp/contests/abc306/editorial/6602)
- [ABC306 G 公式問題文](https://atcoder.jp/contests/abc306/tasks/abc306_g)
- [ABC374 G 公式解説](https://atcoder.jp/contests/abc374/editorial/11099)
- [ABC374 G 公式問題文](https://atcoder.jp/contests/abc374/tasks/abc374_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-scc-condensation`
