---
title: "Kruskal順の閾値DSU sweep"
description: "「Kruskal順の閾値DSU sweep」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 109
---

# Kruskal順の閾値DSU sweep

習得対象の目安: **青色（1600–1999）**。辺とqueryを同じ重み順に処理し、連結する閾値と同重みの扱いを整理する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Kruskal順の閾値DSU sweep

辺とqueryを重み順に並べ、同重みの処理順を明示してDSU成分とmetadataを更新し、二点が初めて連結するminimax閾値で判定・pairing・集計を行う。

### 習得する技能

- 同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。

## 考え方

重みが閾値以下の辺だけを順に追加し、DSUで成分数の減少を追う。一つの成分併合は全域木に一辺を採用することへ対応するため、接続の閾値とMSTの重みを結び付けられる。

### 閾値graphとminimax距離

無向graphの辺を昇順に処理し、各重みwのbatchを全部併合した時点でDSUはG_{≤w}の成分と一致する。二点間のminimax値d(u,v)=min_path
max_edge
weightは、初めて二点が連結する閾値である。実際、d≤wであることと、全辺重み≤wのpathが存在することは同値。非連結な二点には有限値がない。

queryが「w未満だけを使う」なら同重みの辺より先、「w以下」ならbatchの後に判定する。ABC235
Eの追加辺がいずれかのMSTに入れるかは、w未満の辺だけで両端が既に連結しているかを調べる。連結ならcycle内で追加辺が厳密に重く採用不能。非連結なら、そのcutをまたぐ最小辺として追加辺を含むMSTを選べる。同重みのquery辺は独立した追加候補なのでDSUへ併合しない。

サイズa,bの異なる成分が重みwで併合すると、a·b組の頂点対が初めて連結する。minimax値の全unordered
pair和にはw·a·bを加える。同重み内の併合順で個々の積は変わっても、batch前後の連結pair数の差は同じなので合計は不変である。

### 二種類の要素を最小費用でpairにする

非負辺重みで、A要素とB要素を一対一に組み、各pairの費用を上のdとする。同一頂点のpair費用は0とする。各成分に未対応の個数a,bを持ち、初期には同頂点でmin(a,b)組を費用0で消す。併合時に両成分の残数を足し、k=min(a,b)組を今の閾値wで対応させ、答えへkwを加えて双方からkを引く。各成分の残りは片方の種類だけになる。IDのlistも持てば実際のpairを取り出せる。

この局所対応は最適解へ組み込める。H内のA要素uとB要素vがそれぞれ外の相手y,xと対応しているなら、(u,v),(x,y)へ交換する。H内の費用はw以下、外への二費用はw以上であり、pathを連結することからd(x,y)≤max(d(x,v),d(u,y),w)。従って交換後の総費用は元以下。H内を先に最大限対応させる最適解を選べるので、各batchでこの操作を繰り返せる。終了時に未対応が残る成分があれば全要素のpairingは不可能である。[ABC383 E公式解説](https://atcoder.jp/contests/abc383/editorial/11839)へはこの不変量と交換から進む。

## 成立条件と計算量

E辺・Q queryのsortはO((E+Q)
log(E+Q+1))、DSU処理はO((V+E+Q)α(V))。個数metadataは一併合O(1)、pair復元には出力pair数の費用も加える。同じ重みでのqueryは、その重みを含むかどうかに応じて処理時点を決める。非連結graphの最終成分数と、整数閾値を積分・総和する際の境界を確認する。

概念上の親: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。

このUnitを直接前提とする単元: なし。

DSUによる成分管理とMSTのcut・cycle性質を学んだ後、辺重み順のprefixが閾値部分graphと一致する不変条件からminimax連結時刻をquery・集計へ使う。

### このUnitでは扱わないもの

- Kruskal順の閾値DSU sweepの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h) — 主題: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。追加で学ぶ技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h) — 主題: [lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)（DFS木の到達時刻とlowlink値を計算し、橋と関節点の判定条件を説明できる。）。追加で学ぶ技能: [Kruskal順の閾値DSU sweep](/learn/graph/kruskal-threshold-sweep/)（同重みeventの順序を正しく定め、Kruskal順にDSU成分とmetadataを併合してminimax連結閾値でquery・pairing・集計を処理できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

## 根拠

- [ABC235 E 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC235 E 公式解説](https://atcoder.jp/contests/abc235/editorial/3254)
- [ABC250 H 公式解説](https://atcoder.jp/contests/abc250/editorial/3908)
- [ABC250 H 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC301 H 公式解説](https://atcoder.jp/contests/abc301/editorial/6344)
- [ABC301 H 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-kruskal-threshold-sweep`
