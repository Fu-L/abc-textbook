---
title: "DSUによる連結成分管理・縮約"
description: "「DSUによる連結成分管理・縮約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 93
---

# DSUによる連結成分管理・縮約

習得対象の目安: **緑色（800–1199）**。代表と成分サイズを管理し、辺追加による連結性をDSUで処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DSUによる連結成分管理・縮約

辺を追加するだけの無向グラフでは、別々の連結成分が一つになることはあっても、一つの成分が分裂することはない。そこで各成分に代表を一つ置き、二頂点が同じ代表を持つかで連結性を判定する。これを管理するデータ構造がDSU（Disjoint Set Union、Union-Findとも呼ぶ）である。

成分の頂点数、辺数、黒い頂点の個数などの付加情報も代表へ集めれば、質問のたびに成分内を探索せずに済む。このように成分へ付ける情報を**成分metadata**と呼ぶ。

### 習得する技能

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。

## 考え方

### 併合する辺と、成分内に増える辺

四頂点に無向辺1–2、2–3、1–3を順に追加する独自例で、成分の頂点数と辺数を追う。頂点4には辺を追加しない。表の最後の列は頂点1の成分についての値である。

| 追加辺 | 成分の頂点集合 | 成分数 | 頂点数・辺数 |
| --- | --- | --- | --- |
| なし | {1}, {2}, {3}, {4} | 4 | 1頂点・0辺 |
| 1–2 | {1, 2}, {3}, {4} | 3 | 2頂点・1辺 |
| 2–3 | {1, 2, 3}, {4} | 2 | 3頂点・2辺 |
| 1–3 | {1, 2, 3}, {4} | 2 | 3頂点・3辺 |

最後の辺は、既に同じ成分にある二頂点を結ぶ。連結性も頂点数も変わらないが、辺数は増える。この区別が、連結性だけでなく成分の属性も管理するときに必要になる。孤立頂点4も、頂点数1・辺数0の成分として残す。

### 代表を探し、代表どうしをつなぐ

各頂点 `v` のDSU内の親を `parent[v]` とする。最初は `parent[v] = v` として、全頂点をそれぞれの根にする。根だけが成分の集約値を持ち、`size[v] = 1`、`edges[v] = 0` で始める。成分数も頂点数で初期化する。

`find(v)` は親をたどって根を返す。その途中の頂点の親を根へ直接付け替える操作が**経路圧縮**である。同じ成分内で親を付け替えるだけなので、所属する成分は変わらない。二頂点 `u, v` が同じ成分に属する条件は `find(u) == find(v)` となる。

辺 `u–v` を追加するときは、まず両端の根 `a = find(u)`、`b = find(v)` を求める。

- **別根なら併合する。** 小さい成分の根を大きい成分の根へ付ける。これを **union by size** と呼ぶ。残す根を `a` とした場合、更新前の両根の値から `size[a] = size[a] + size[b]`、`edges[a] = edges[a] + edges[b] + 1` とし、成分数を1減らす。頂点集合は重ならず、辺は両成分の内部辺と今回の一本だから、この加算でよい。
- **同根なら併合しない。** 成分数と `size[a]` は変えず、`edges[a]` だけ1増やす。同じ集約値を二回足すと、同一成分を二重に数えてしまう。

初めはDSUの各集合とグラフの各成分が一致している。別成分をつなぐ辺を追加すると、その二成分だけが一つになる。同じ成分内に辺を追加しても分割は変わらない。この二場合で上の処理が実グラフの変化と一致するので、以後も代表による連結性判定と集約値の意味が保たれる。

小さい側を大きい側へ付けると、ある頂点の根までの深さが併合で1増えるたび、その頂点を含む成分のサイズは少なくとも倍になる。これが木を深くしすぎない理由であり、経路圧縮も併用すると操作列全体の計算量をさらに抑えられる。

ただし、**DSUの親は元グラフの経路を表さない。** 小例で1–2の追加時に2を1へ付けたとする。次に2–3を追加すると、根は1と3なので、3の親は1になる。この時点では元グラフに辺1–3はない。最後の1–3を追加すると三角形になるが、DSUの親はその三辺も記録しない。経路や距離が必要なら元の辺を別に持つ。併合履歴も経路圧縮で失われるため、必要なら[DSU merge tree](/learn/tree/dsu-merge-tree/)として別途記録する。

### 黒い頂点の存在を、個数で保持する

[ABC420 E](/problems/abc420-e/)では、初めは全頂点が白く、辺の追加、指定頂点の白黒の反転、黒い頂点へ到達できるかの質問が与えられる。無向グラフなので、最後の質問は「自分の成分に黒い頂点があるか」と同じである。0本の辺での到達も認めるため、質問の頂点自身が黒い場合も含む。

存在するかだけなら真偽値で答えられるが、その真偽値だけでは色の反転を更新できない。黒い頂点が一つの成分と二つの成分は、どちらも「存在する」となる。しかし一つを白へ戻した後の答えは違う。そこで各頂点の色を `color[v]` に、各根の成分黒数を `blackCount` に持つ。最初は全て白、黒数は0である。

先ほどと同じ辺の追加に色の反転を挟むと、黒数は次のように変わる。この表も独自例である。右の二列はそれぞれ頂点1・3が属する成分の黒数を表し、辺2–3の追加後は同じ成分の値を参照する。

| 操作 | 1の成分 | 3の成分 |
| --- | --- | --- |
| 初期状態 | 0 | 0 |
| 1と3を黒にする | 1 | 1 |
| 辺1–2を追加 | 1 | 1 |
| 辺2–3を追加 | 2 | 2 |
| 辺1–3を追加 | 2 | 2 |
| 1を白に戻す | 1 | 1 |
| 3を白に戻す | 0 | 0 |

孤立頂点4の成分の黒数は、この間ずっと0である。続けて4を黒にすれば、その成分の黒数だけが1になり、{1, 2, 3} の黒数は0のまま変わらない。

別根を併合するときは、更新前の二根の黒数の和を新しい根へ保存する。同根への辺追加では頂点集合が変わらないので、黒数は加算しない。辺数だけが増える場合と区別する。

色を反転するときは、毎回 `r = find(v)` を求め、白から黒なら `blackCount[r]` を1増やし、黒から白なら1減らして、`color[v]` を反転する。根は併合で変わりうるので、頂点 `v` 自身や以前保存した代表の欄を更新してはいけない。小例では、元は根だった3も併合後は根1の成分に入る。3を白へ戻す際に更新するのは `blackCount[1]` である。吸収された根の古い集約値は以後参照せず、全て現在の根へ読み書きする。

併合は重ならない二集合の和、色の反転は一頂点分の増減なので、「根の黒数はその成分内の黒い頂点の個数」という不変条件が保たれる。従って、質問には `blackCount[find(v)] > 0` で答えられる。孤立頂点にも同じ処理を使える。

### 縮約で残す辺を決める

複数の頂点を一頂点として扱う操作を**縮約**という。併合が済んだ時点で全頂点に `id[v] = find(v)` を付け、残したい元辺の両端をこのIDへ写す。DSUの親を辺として使うのではなく、元の辺を読み直す。代表番号は連番とは限らないので、必要なら異なる代表を列挙して番号を振り直す。

小例の全連結成分を縮約すると、{1, 2, 3} と {4} がそれぞれ一頂点になる。三角形の三辺は全て自己ループへ写り、異なる成分間の辺は一本もない。到達性だけなら三つの自己ループを消せるが、辺数も知りたいなら、縮約前の辺数3を集約値として残すなどの対応が必要である。

一方、同じ三角形で**辺1–2だけを使って先に併合**し、残る辺を調べるなら、{1, 2}、{3}、{4} が縮約後の頂点になる。辺2–3と1–3はともに {1, 2} と {3} を結ぶ多重辺へ写る。全辺の連結成分を縮約する場合と、選んだ一部の辺だけで成分を作る場合を区別しよう。

到達性だけを残すなら、同じ向き・同じ端点間の多重辺は一本にまとめられる。辺の本数や辺の選び方を数えるなら、多重度を消すと答えが変わる。費用を扱う場合も、目的に応じて最小重みなどを保持する必要があり、単に任意の一本を残してよいとは限らない。自己ループや多重辺を消す前に、縮約後に何を保存したいかを決める。

## 成立条件と計算量

頂点数を $$V$$、辺追加・色の反転・質問の操作数を合わせて $$Q$$ とする。union by sizeと経路圧縮を併用すると、初期化を含む全体の時間は $$O((V+Q)\alpha(V))$$、空間は $$O(V)$$ である。$$\alpha$$ は逆Ackermann関数で、実用的な範囲では非常に小さい。一回ごとが最悪定数時間という意味ではなく、操作列全体で評価した償却計算量である。頂点数・辺数・黒数の更新はいずれも定数時間とする。より大きな集合などを成分に持つなら、その併合費用を別に評価する。

縮約グラフも作る場合、元辺の本数を $$E$$ とすると、全頂点の代表を求めて全辺を写すまでの時間は $$O((V+E)\alpha(V))$$、元辺と縮約後の辺を含む空間は $$O(V+E)$$。ここでは自己ループ・多重辺をそのまま保持してよい。辺をソートして多重辺を除くなら、さらに $$O(E\log E)$$ 時間がかかる。

普通のDSUが扱えるのは、集合が併合される変化である。小例で最後の1–3を加える前に2–3を削除すると、{1, 2, 3} は {1, 2} と {3} に分裂するが、DSUにはそれを判断して分け直す情報がない。削除を含む場合は別の工夫が必要になる。[ABC229 Eの解説](/problems/abc229-e/)では、頂点と接続辺を削除する操作が全て先に分かるため、[逆順処理](/learn/modeling/reverse-offline/)によって追加だけの問題へ変換する。

概念上の親: [連結成分を管理し縮約する](/learn/graph/connectivity/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)、[Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)、[potential・weighted DSU](/learn/graph/potential-dsu/)、[cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)、[01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。

辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC420 E「Reachability Query」](https://atcoder.jp/contests/abc420/tasks/abc420_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC304 E「Good Graph」](https://atcoder.jp/contests/abc304/tasks/abc304_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC372 E「K-th Largest Connected Components」](https://atcoder.jp/contests/abc372/tasks/abc372_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC276 E「Round Trip」](https://atcoder.jp/contests/abc276/tasks/abc276_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。）。
- [ABC335 E「Non-Decreasing Colorful Path」](https://atcoder.jp/contests/abc335/tasks/abc335_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。追加で学ぶ技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC238 E「Range Sums」](https://atcoder.jp/contests/abc238/tasks/abc238_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC279 F「BOX」](https://atcoder.jp/contests/abc279/tasks/abc279_f) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。追加で学ぶ技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC286 G「Unique Walk」](https://atcoder.jp/contests/abc286/tasks/abc286_g) — 主題: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（無向graphでは辺を持つ部分の連結性と奇数次数頂点数が0または2であることを調べ、有向graphでは辺を持つ部分の弱連結性と入次数・出次数の差（trailなら始点+1、終点−1、他0、circuitなら全頂点0）を調べ、全辺を一度ずつ使うtrail・circuitの存在を判定できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)（一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。追加で学ぶ技能: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)（成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)（各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（重み閾値以下のグラフの成分数からMST重みを層別和として導き、辺追加時に各閾値の連結性を更新して最適重みを維持できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)（親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)（各queryの未確定区間を保ち、同じroundのmidをbucketして一方向更新できる判定器を共有し、全queryの最小・最大成立境界を求められる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)（上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g) — 主題: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)（埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f) — 主題: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

辺追加・色の反転・黒い頂点への到達判定はABC420 E、削除を逆順の追加へ変える境界はABC229 Eの公式問題・個別公式解説を2026年10月27日に再照合した。四頂点の辺・色の更新と縮約の例、その不変条件の説明は本単元の独自補足である。

- [ABC420 E 公式問題文](https://atcoder.jp/contests/abc420/tasks/abc420_e)
- [ABC420 E 公式解説](https://atcoder.jp/contests/abc420/editorial/13740)
- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)
- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)
- [ABC233 F 公式解説](https://atcoder.jp/contests/abc233/editorial/3164)
- [ABC233 F 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dsu-components`
