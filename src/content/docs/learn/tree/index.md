---
title: "木構造"
description: "「木構造」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 128
---

# 木構造

導入対象の目安: **水色（1200–1599）**。探索で得る木の距離・祖先・部分木を、集約と分解の共通の土台にする入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

木の一意な経路と部分木への分解を使う。距離・直径から始め、Euler順とLCAで位置関係を表し、path分解と必要頂点だけの圧縮へ進む。次に木DPのまとまりで部分木集約・全方位DP・多項式合成を比較し、重心分解、併合履歴、縮約による最適化へ広げる。軽い子の処理回数、path上の合成、rake・compressがそれぞれ何を高速化するかを区別する。多項式木DPに進むときは代数章の畳み込みを参照する。

### 木モデルと構造

木固有の根・部分木・path・separator構造へ問題を写し、利用する性質を選ぶ。

### 習得する技能

- 木固有の根・部分木・path・separator構造へ問題を写し、利用する性質を選ぶ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

一般グラフから独立させ、根・部分木・一意path・separatorという木固有の不変量を体系的に積み上げる。

### このUnitでは扱わないもの

- なし

## 章の構成

- [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/) — 水色
- [加法的tree metric復元](/learn/tree/additive-tree-metric-reconstruction/) — 橙色
- [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/) — 水色
- [包含木の構築とancestor・path分解](/learn/tree/tree-decomposition/) — 水色（導入）
  - [laminar区間族の包含木構築](/learn/tree/laminar-interval-containment-tree/) — 青色
  - [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/) — 水色
  - [ancestor query・LCA](/learn/tree/tree-ancestor-lca/) — 水色
  - [Heavy-Light Decomposition](/learn/tree/heavy-light-decomposition/) — 青色
  - [virtual tree・auxiliary tree](/learn/tree/virtual-tree/) — 黄色
- [木DP・集約・rerooting](/learn/tree/tree-aggregation/) — 水色（導入）
  - [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/) — 水色
  - [rerooting・全方位木DP](/learn/tree/rerooting/) — 青色
  - [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/) — 橙色
- [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/) — 黄色
- [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/) — 青色
- [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/) — 橙色
- [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/) — 赤色
- [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC460 F「Farthest Pair Query」](https://atcoder.jp/contests/abc460/tasks/abc460_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。 / 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

## 根拠

- [ABC220 E 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC220 E 公式解説](https://atcoder.jp/contests/abc220/editorial/2679)
- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC221 F 公式解説](https://atcoder.jp/contests/abc221/editorial/2723)
- [ABC221 F 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-tree`
