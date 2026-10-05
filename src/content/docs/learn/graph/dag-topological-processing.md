---
title: "DAGのtopological processing"
description: "「DAGのtopological processing」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 101
---

# DAGのtopological processing

習得対象の目安: **緑色（800–1199）**。入次数による処理順を作り、有向非循環グラフ上の伝播やDPを実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DAGのtopological processing

依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。

### 習得する技能

- 依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

入次数0の頂点から取り除くと、すべての先行頂点が済んだ順を得る。DPや制約伝播では、その時点で必要な入力値が確定していることを不変量にする。


入次数degを全辺から数え、deg=0の全頂点をqueueへ入れる。取り出したuをorderへ追加し、各辺u→vでdeg[v]を1減らして0ならqueueへ入れる。残りのgraph内の入次数だけをdegが表すので、取り出したuには未処理の依存元がない。全V頂点を出せればorderがトポロジカル順、出せなければ残りは必ず有向閉路を含む（入辺を辿り続けると頂点が繰り返す）。DPは始点だけを初期化し、このorderで確定したdp[u]を出辺へ渡す。未到達の番兵からは遷移しない。

## 成立条件と計算量

O(V+E)時間。全頂点を処理できなければcycleがある。異なるtopological orderでも答えが同じになる合成を確認する。掲載順や単なる頂点番号順が、この依存順であるとは限らない。

概念上の親: [SCCで閉路・DAG順・2-SATを処理する](/learn/graph/directed-condensation/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、DAGのtopological processingの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- DAGのtopological processingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC315 E「Prerequisites」](https://atcoder.jp/contests/abc315/tasks/abc315_e) — 主題: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC291 E「Find Permutation」](https://atcoder.jp/contests/abc291/tasks/abc291_e) — 主題: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC277 F「Sorting a Matrix」](https://atcoder.jp/contests/abc277/tasks/abc277_f) — 主題: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。 dp_i=1+max_{a_j>a_i,同じ行または列}dp_j型の遷移を行別・列別最大へ圧縮する。遷移先がなければ0。同値のbatchでは全取得を済ませてから更新し、狭義不等号を保つ。sort後の集約はO(N)。
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC335 E「Non-Decreasing Colorful Path」](https://atcoder.jp/contests/abc335/tasks/abc335_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。追加で学ぶ技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC341 F「Breakdown」](https://atcoder.jp/contests/abc341/tasks/abc341_f) — 主題: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC224 E 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC224 E 公式解説](https://atcoder.jp/contests/abc224/editorial/2814)
- [ABC277 F 公式解説](https://atcoder.jp/contests/abc277/editorial/5205)
- [ABC277 F 公式問題文](https://atcoder.jp/contests/abc277/tasks/abc277_f)
- [ABC291 E 公式問題文](https://atcoder.jp/contests/abc291/tasks/abc291_e)
- [ABC291 E 公式解説](https://atcoder.jp/contests/abc291/editorial/5839)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dag-topological-processing`
