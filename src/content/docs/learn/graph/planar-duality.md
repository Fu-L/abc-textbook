---
title: "平面graph双対・cut/path対応"
description: "「平面graph双対・cut/path対応」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 126
---

# 平面graph双対・cut/path対応

習得対象の目安: **黄色（2000–2399）**。平面埋め込みのfaceを構成し、primalのcutとdualのpath・cycleを対応させる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 平面graph双対・cut/path対応

埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。

### 習得する技能

- 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

### 埋め込みからfaceとdual辺を作る

まず連結な無向平面graphと、各頂点の出辺の反時計回り順が与えられる場合を扱う。一辺を逆向きの二half-edgeに分ける。half-edge u→vの左のfaceをたどるには、vで逆向きv→uの直前のhalf-edge（反時計回り順で一つ前）へ進む。このsuccessorを未訪問half-edgeから一周ずつたどり、巡回ごとにface IDを付ける。外側faceも一つのfaceであり、橋は同じfaceの境界に両向きで現れる。

元辺eの二half-edgeに付いたface f_L,f_Rを結ぶdual辺e*を作り、元辺の非負重みw_eを付ける。橋ならf_L=f_Rのdual loopとなる。多重辺も元辺IDを保って別々に作る。座標だけが入力なら偏角sortで出辺順を先に構築し、辺が交差しない埋め込みであることをモデルの条件として確認する。

### 同じface上のs-t cutをdual最短路へ

異なるs,tが同じfaceの境界上にあるとする。そのface内を通ってs,tを結ぶ仮の辺e0を一本加えると、faceが二つf1,f2へ分かれる。この埋め込みのdualを作り、e0*だけを取り除いてf1→f2の最短pathをDijkstraで求める。通ったdual辺の元辺ID集合がs-t cutになる。

理由は、dual pathへe0*を戻すと一つの閉じた境界を作り、sとtを異なる側へ分けるからである。元のs→t pathはこの境界をどこかで横切る必要があり、仮の辺は元graphにないので選んだcut辺を必ず通る。逆に、最小cutから不要辺を除いた包含極小cutは、s側・t側の双方を連結に取れる。この二領域の境界はdual cycleとなり、e0を一度横切るため、e0*を除いたf1→f2 pathへ対応する。非負重みなら不要な辺を除いて費用は増えず、両方向で同じ重みを保つので最短路値と最小cut値が一致する。

s,tが共通faceにない一般の場合は、二点を分離するdual cycleの最適化へなり、任意の二dual頂点間の最短路では済まない。方向付き容量も向きの対応を追加して導く必要があり、上の無向変換のまま使わない。

## 成立条件と計算量

出辺の巡回順があればhalf-edge走査とdual構築はO(V+E)。座標から順を作るsortはO(E log(E+1))、dual最短路はO((V+E) log(V+E))で、復元はpath長に比例する。外側faceを除外せず、最短路から元辺へ戻すIDを保持する。非連結入力や埋め込みを探す処理の費用は別に扱う。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

このUnitを直接前提とする単元: なし。

最大流・最小カット・最短路モデルで得た考え方と実装を再利用し、平面graph双対・cut/path対応の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC413 G「Big Banned Grid」](https://atcoder.jp/contests/abc413/tasks/abc413_g) — 主題: [平面graph双対・cut/path対応](/learn/graph/planar-duality/)（埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC413 G 公式解説](https://atcoder.jp/contests/abc413/editorial/13403)
- [ABC413 G 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-planar-duality`
