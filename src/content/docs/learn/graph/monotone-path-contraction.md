---
title: "単調path contraction・DSU jump"
description: "「単調path contraction・DSU jump」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 120
---

# 単調path contraction・DSU jump

習得対象の目安: **青色（1600–1999）**。確定した区間を次未処理pointerで飛ばし、削除済み部分を再走査しない。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調path contraction・DSU jump

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。

### 習得する技能

- 一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

親方向や既知のpathを進みながら処理済みの辺・頂点を飛ばすjumpを持つ。一度処理した区間が二度必要にならないなら、次の未処理位置へ縮約して長いpathの反復走査を省ける。


根方向の辺を一度ずつ処理する標準形では、next[v]=vとしfind(v)を「vから上へ最初の未処理位置」と定義する。辺(v,parent[v])を処理して消したらnext[v]=find(parent[v])とする。pathの祖先aまで処理するなら、x=find(v)からdepth[x]>depth[a]の間にその辺を処理・消去し、次のfind(x)へ進む。根のnextは根自身で止める。

再処理を省ける理由は、消した辺の寄与を既に確定し、後続操作ではその辺を再び変更・照会する必要がないという元問題の単調性である。whileの全反復は高々N−1回。代表をunion by sizeで自由に選ぶなら、成分ごとに最上位の未処理境界を別属性として持ち、findの結果から読む。単に任意の親linkを付けるだけで通常DSUと同じα(N)上界を主張せず、使う実装のfind費用を加える。

### 元の辺・走査・代表の向きを分ける

「pathを縮約する」と決めたら、元の辺の始点・終点、whileの始点・停止位置、次に参照する親をそれぞれ確定する。木の辺が親→子でも、追加した子孫→祖先の辺が作る閉路を併合するときは子孫側から親へ上る。

ABC295 Gでは、DSU成分に木の最上位頂点topを属性として持つ。更新u→vでvがuの祖先なら、find(u)≠find(v)の間にm=top[find(u)]とparent[m]の成分を併合する。topは両成分のtopのうち浅い方へ更新する。DSUの代表はunion by sizeで選ぶ実装上の番号であり、そのparentを木の次境界にしてはいけない。二頂点1→2に2→1を足す最小例で、走査が2から1へ進むことを確認できる。

## 成立条件と計算量

各対象の消去が一度で、適切なunion/findの不変量を持つ場合は総量を準線形に抑えられる。必要な祖先探索を別に数える。構造の更新で処理済み区間が復活する場合は、同じ償却上界を主張できない。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)（一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC295 G 公式解説](https://atcoder.jp/contests/abc295/editorial/6052)
- [ABC295 G 公式問題文](https://atcoder.jp/contests/abc295/tasks/abc295_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-monotone-path-contraction`
