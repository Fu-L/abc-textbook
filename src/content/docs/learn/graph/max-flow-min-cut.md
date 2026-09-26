---
title: "最大流・最小カット"
description: "「最大流・最小カット」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 122
---

# 最大流・最小カット

習得対象の目安: **青色（1600–1999）**。残余グラフとcutの意味を理解し、選択・排反を容量networkへ還元する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 最大流・最小カット

選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。

まず各辺の容量、内部頂点の流量保存、sourceからsinkへの流量を定める。残余辺は割当の取り消しと付け替えを表す。増加路がなくなったとき、sourceから残余到達可能な集合が同じ値のcutを与える。整数容量なら整数の割当を得られる。

基本形はsource→item（容量1）→受け手→sink（受け手の上限）であり、全item分の流量が存在するかを判定する。演習はABC318 Gから始め、頂点をin/outへ分けて頂点素経路を表す。ABC239 Gでは頂点費用のcutを作り、source側に残る頂点から削除集合を復元する。

ABC241 Gでは候補選手の未確定試合を全勝へ変えても優勝可能性を失わないことを示す。他選手の最終勝数を候補より1少なくする条件を、残り試合を選手へ割り当てる容量付きflowにする。既決着の勝数を各上限から差し引き、負の残枠を除く。この変換の正当化を、二つの基本的なflow・cut模型の後で学ぶ。

ABC259 G・ABC326 G・ABC225 Gで二値選択や含意制約をcutの容量へ写す。その後のABC437 Gは、頂点・色組の使用回数を容量として静的な色対割当を求めるだけでなく、常に削除できる辺があることを示して操作順まで復元する複合的な構成問題である。ABC332 Gでは巨大なnetworkをcutの式へ圧縮し、ナップサックDPと区分線形関数の走査につなぐ。

ABC347 G・ABC397 Gでは別のcut・flow還元を続け、ABC227 Hではflowによる判定をEuler路構成へ接続する。どの問題でも、cut容量が元の損失と一致する式と、割当を元の操作へ戻す根拠を確かめる。

### 習得する技能

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)、[最小費用流・circulation](/learn/graph/min-cost-flow/)、[平面graph双対・cut/path対応](/learn/graph/planar-duality/)。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、最大流・最小カットの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC225 G「X」](https://atcoder.jp/contests/abc225/tasks/abc225_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC239 G「Builder Takahashi」](https://atcoder.jp/contests/abc239/tasks/abc239_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC241 G「Round Robin」](https://atcoder.jp/contests/abc241/tasks/abc241_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC259 G「Grid Card Game」](https://atcoder.jp/contests/abc259/tasks/abc259_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC318 G「Typical Path Problem」](https://atcoder.jp/contests/abc318/tasks/abc318_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC326 G「Unlock Achievement」](https://atcoder.jp/contests/abc326/tasks/abc326_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC347 G「Grid Coloring 2」](https://atcoder.jp/contests/abc347/tasks/abc347_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。 二部彩色を前提に、頂点・色組の使用回数A_{v,k}を容量へ写す最大流のモデルを学ぶ。流量N−1から各木辺の削除時の色対を固定する。一対一matchingではない。次に、実行可能な辺がないと仮定して葉から根へ条件を伝播させると矛盾することを示す。一辺削除した後も残りの回数制約が保たれるため、この存在証明を帰納的に繰り返して操作列を復元できる。静的な割当の可否と時系列の実行可能性を別々に証明する。
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC285 G「Tatami」](https://atcoder.jp/contests/abc285/tasks/abc285_g) — 主題: [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)（各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC225 G 公式解説](https://atcoder.jp/contests/abc225/editorial/2854)
- [ABC225 G 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_g)
- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC239 G 公式解説](https://atcoder.jp/contests/abc239/editorial/3393)
- [ABC239 G 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-max-flow-min-cut`
