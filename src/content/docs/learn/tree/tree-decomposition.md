---
title: "木のancestor・部分木・pathを索引化する"
description: "「木のancestor・部分木・pathを索引化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 134
---

# 木のancestor・部分木・pathを索引化する

導入対象の目安: **水色（1200–1599）**。木を区間や祖先関係へ写し、配列上の算法へ接続する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

木の上で繰り返し調べたいものは、ある頂点の子孫全体だろうか、二頂点を結ぶ経路だろうか、それとも少数の指定点を結ぶ枝分かれだろうか。必要な集合や順序を配列・祖先表・小さな木へ写すと、毎回木全体を探索せずに処理できる。何を保存したいかを先に決め、対応する下位単元を選ぶ。包含関係を木に変換する方法は独立した節で学ぶ。

## 考え方

### 部分木の集合を、一つの区間にする

[木の集約](/learn/tree/tree-aggregation/)と同じ、辺が $$r\text{–}a,a\text{–}b,r\text{–}c$$ の4頂点木を使う。各辺の長さは1、根は $$r$$ とする。DFSで $$a$$ 側を先に訪ね、頂点へ**初めて入った順だけ**を並べると $$(r,a,b,c)$$。添字は0始まりとし、入場時に`tin`を記録して時計を1増やし、子孫の探索が終わった時点の時計を`tout`とする。出場時には時計を増やさない。

| 頂点 | `tin` | `tout` | 部分木の半開区間 | 区間に入る頂点 |
| --- | --- | --- | --- | --- |
| $$r$$ | 0 | 4 | $$[0,4)$$ | $$r,a,b,c$$ |
| $$a$$ | 1 | 3 | $$[1,3)$$ | $$a,b$$ |
| $$b$$ | 2 | 3 | $$[2,3)$$ | $$b$$ |
| $$c$$ | 3 | 4 | $$[3,4)$$ | $$c$$ |

半開区間 $$[l,h)$$ は添字 $$l$$ 以上 $$h$$ 未満を表す。DFSは一つの部分木へ入ると、その子孫を訪ね終えるまで外へ出ない。そのため、部分木の頂点はちょうどこの区間に並ぶ。頂点の重みを`tin`の位置へ置けば、$$a$$ 側の重みの和は $$[1,3)$$ の区間和になる。辺 $$r\text{–}a$$ を切った逆側の和も、全体の和から引けば求まる。

「部分木の重みを更新・集計したい」なら、[Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)から配列の区間処理へ進む。どの頂点を含むかは保存されるが、添字の差は木距離にはならない。例えば $$r,c$$ の添字の差は3でも距離は1である。

### 経路の折り返しと、たどる順序を保つ

$$b$$ から $$c$$ への経路（path）は $$b\to a\to r\to c$$、添字では $$2,1,0,3$$ の順になる。この例では経路の頂点集合が偶然木全体と一致するが、区間 $$[0,4)$$ を左から読んだ順序とは異なる。さらに $$r\to c$$ の添字は $$0,3$$ で、集合としても一つの連続区間にならない。任意の経路を、一つの部分木区間として処理することはできない。

経路はどこで上向きから下向きへ折り返すのか。二頂点の共通祖先のうち最も深い頂点を**最小共通祖先（LCA）**といい、ここでは $$\operatorname{LCA}(b,c)=r$$ である。距離が欲しいだけなら、根からの距離を保存し、二頂点の根からの距離の和から、根とLCAの間を二重に数えた分を引けばよい。「何段上の祖先か」「二頂点のLCAや距離は何か」という問いは、[ancestor query・LCA](/learn/tree/tree-ancestor-lca/)へ進む。

一方、経路上の値を更新したり、行列積などを $$b,a,r,c$$ の順で合成したりするには、経路自体を扱いたい。[Heavy-Light Decomposition（HLD）](/learn/tree/heavy-light-decomposition/)は、部分木サイズ最大の子への辺を優先して長い鎖を作り、各鎖を配列区間にする。この木では $$r,a,b$$ を一つの鎖、$$c$$ を別の鎖にでき、$$b\to c$$ は前者を逆向きにたどる区間と、$$c$$ の区間に分かれる。区間内の向きと区間同士の結合順を保てば、経路の順序を復元できる。鎖の外から子へ降りるたび部分木サイズが半分未満になるため、頂点数 $$N$$ の木の経路は $$O(\log N)$$ 個の区間で表せる。

経路の和や距離が根からの累積値とLCAだけで求まる場合は、まずその式を検討する。HLDが必要かどうかは、経路上に残る更新・合成の操作から判断する。

### 指定点を結ぶ枝分かれだけを残す

一照会で指定される頂点が $$\{b,c\}$$ だけなら、二頂点の関係を調べるために全頂点を毎回走査するのはもったいない。しかし $$b,c$$ だけを残すと、どこで枝が合流するかが消えてしまう。そこでLCAの $$r$$ も加え、$$r\to b$$ と $$r\to c$$ の二辺を張る。前者は元の $$r\to a\to b$$ を縮めた長さ2の辺、後者は長さ1の辺である。

[virtual tree・auxiliary tree](/learn/tree/virtual-tree/)は、このように指定点と必要なLCAを残し、残した頂点間を元の祖先経路に対応する辺で結ぶ。指定点をDFS順に並べ、隣り合う指定点のLCAを追加してから、最も近い残存祖先へつなぐ。指定点が $$k\geq1$$ 個なら頂点数は高々 $$2k-1$$ 個となり、枝分かれを保ったまま小さな木で計算できる。隣接LCAで十分な理由と具体的な接続手順は、子単元で確認する。

保存するのは指定点間の祖先関係と、それを結ぶ経路の構造である。省略された $$a$$ の値まで自動的に残るわけではない。距離なら辺長2、経路上の値ならその要約というように、省略部分の寄与を辺へ持たせられるかを確認する。また、追加した $$r$$ は指定点ではないので、「指定された頂点の個数」には数えない。

## 成立条件と計算量

以下では木の形と根を固定し、頂点数を $$N$$、一照会で指定される重複のない頂点数を $$k$$ とする。値の更新は扱えても、辺の接続を変える操作には、そのまま同じ索引を使えない。表の費用は定数時間で合成できる値を扱う場合である。

| 手法 | 前処理の時間・空間 | 一照会の費用 |
| --- | --- | --- |
| Euler順 | $$O(N)$$ | 部分木区間の特定 $$O(1)$$ |
| binary lifting | $$O(N\log N)$$ | 祖先・LCA $$O(\log N)$$ |
| HLD | $$O(N)$$ | 経路を $$O(\log N)$$ 個の区間へ分解 |
| virtual tree | $$O(N\log N)$$ | 構築は下記。小木の走査・追加空間は $$O(k)$$ |

Euler順で区間を特定した後、静的な和は累積和で $$O(1)$$、一点更新・区間和はFenwick Tree等で $$O(\log N)$$。配列側の準備も、累積和やFenwick Treeの線形構築なら時間・空間とも $$O(N)$$ で済む。HLDでは、Segment Treeの構築も時間・空間とも $$O(N)$$、各区間の処理が $$O(\log N)$$ なら経路全体は $$O(\log^2 N)$$ かかる。

virtual treeは、最初にDFSとbinary liftingを前処理し、一照会では指定点とLCAをソート・接続する。構築時間は

$$
O(k\log k+k\log N)
$$

となる。小木上で行うDPや、省略経路の要約を得る費用は別途加える。毎回全 $$N$$ 頂点分の作業配列を初期化すると、小木へ縮めた利点を失う。

葉の部分木は自身を含む長さ1の区間、同じ頂点同士のLCAはその頂点である。自分自身も祖先に含めるが、深さを超えて何段も上の祖先を求める場合は「存在しない」と判定する。virtual treeは指定点0個なら空、1個ならその頂点だけとなる。頂点の値を経路に沿って読む場合は両端を含め、辺の値を読む場合はLCAの親辺を含めない。各表現の端点・順序と、前処理を含む費用を確認してから子単元へ進む。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- LCAという概念で対象を一意分類するだけで、ancestor query・Euler区間化・HLD・virtual treeを実装利用しない数え上げ、および重心による再帰分解。

## 下位単元

- [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/) — 水色
- [ancestor query・LCA](/learn/tree/tree-ancestor-lca/) — 水色
- [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/) — 青色
- [virtual tree・auxiliary tree](/learn/tree/virtual-tree/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC267 F「Exactly K Steps」](https://atcoder.jp/contests/abc267/tasks/abc267_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC329 G「Delivery on Tree」](https://atcoder.jp/contests/abc329/tasks/abc329_g) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/)（heavy childを選んで木をheavy path列へ分け、path range queryまたはbalanced tree-cluster構築へ接続できる。）。
- [ABC405 F「Chord Crossing」](https://atcoder.jp/contests/abc405/tasks/abc405_f) — 主題: [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/)（laminar区間の開閉端点をstackで処理し、直接包含関係と各点の最小包含区間を木として構築して、包含差分を木上pathへ変換できる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [円環順序・chord交差](/learn/geometry-optimization/cyclic-order-crossing/)（円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。）。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。） / [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。

## 根拠

- [ABC406 F 公式問題文](https://atcoder.jp/contests/abc406/tasks/abc406_f)・[公式解説](https://atcoder.jp/contests/abc406/editorial/13045) — DFS入場順で部分木を連続区間に写し、頂点の重みの更新と辺切断後の成分和を扱う方針（2026-10-29再照合）。
- [ABC340 G 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_g)・[公式解説](https://atcoder.jp/contests/abc340/editorial/9249) — 指定点とLCAを残す補助木、隣接LCAによる構築とサイズ・時間の評価（2026-10-29再照合）。4頂点の小例と、集合・経路の順序・枝分かれを比較する説明は本書独自の補完である。
- [ABC240 E 公式問題文](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 E 公式解説](https://atcoder.jp/contests/abc240/editorial/3426)
- [ABC267 F 公式解説](https://atcoder.jp/contests/abc267/editorial/4714)
- [ABC267 F 公式問題文](https://atcoder.jp/contests/abc267/tasks/abc267_f)
- [ABC294 G 公式解説](https://atcoder.jp/contests/abc294/editorial/5997)
- [ABC294 G 公式問題文](https://atcoder.jp/contests/abc294/tasks/abc294_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-tree-decomposition`
