---
title: "DSUによる連結成分管理・縮約"
description: "「DSUによる連結成分管理・縮約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 105
---

# DSUによる連結成分管理・縮約

習得対象の目安: **緑色（800–1199）**。代表と成分サイズを管理し、辺追加による連結性をDSUで処理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第25単元。技能の説明を学んでから問題一覧へ進んでください。

前: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/) ／ 次: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)

## 概要

### DSUによる連結成分管理・縮約

辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。

### 習得する技能

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC420 E「Reachability Query」](https://atcoder.jp/contests/abc420/tasks/abc420_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。
2. [ABC304 E「Good Graph」](https://atcoder.jp/contests/abc304/tasks/abc304_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。
3. [ABC372 E「K-th Largest Connected Components」](https://atcoder.jp/contests/abc372/tasks/abc372_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。
4. [ABC276 E「Round Trip」](https://atcoder.jp/contests/abc276/tasks/abc276_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。
5. [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
6. [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
7. [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
8. [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。
9. [ABC238 E「Range Sums」](https://atcoder.jp/contests/abc238/tasks/abc238_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
10. [ABC335 E「Non-Decreasing Colorful Path」](https://atcoder.jp/contests/abc335/tasks/abc335_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
11. [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
12. [ABC279 F「BOX」](https://atcoder.jp/contests/abc279/tasks/abc279_f) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。
13. [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC286 G「Unique Walk」](https://atcoder.jp/contests/abc286/tasks/abc286_g) — 主題: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC302 Ex「Ball Collector」](https://atcoder.jp/contests/abc302/tasks/abc302_h) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC352 E「Clique Connect」](https://atcoder.jp/contests/abc352/tasks/abc352_e) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC355 F「MST Query」](https://atcoder.jp/contests/abc355/tasks/abc355_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC394 G「Dense Buildings」](https://atcoder.jp/contests/abc394/tasks/abc394_g) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g) — 主題: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f) — 主題: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 根拠

- [ABC218 E 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 E 公式解説](https://atcoder.jp/contests/abc218/editorial/2580)
- [ABC226 E 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 E 公式解説](https://atcoder.jp/contests/abc226/editorial/2889)
- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dsu-components`
