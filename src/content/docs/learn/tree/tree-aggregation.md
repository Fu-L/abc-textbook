---
title: "木DP・集約・rerooting"
description: "「木DP・集約・rerooting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 138
---

# 木DP・集約・rerooting

導入対象の目安: **水色（1200–1599）**。部分木から親へ渡す要約を定め、根の移動やpath上の合成へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

探索で親子関係を作りDP状態を定義できた後、子側の集約と親側への差し替えで木全体の値を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

### このUnitでは扱わないもの

- heap番号で暗黙に表された完全二分木の区間算術、木上パスの連続区間分解、重心による再帰分解、および更新のためのTop Tree cluster化。

## 下位単元

- [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/) — 水色
- [rerooting・全方位木DP](/learn/tree/rerooting/) — 青色
- [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h) — 主題: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
- [ABC311 Ex「Many Illumination Plans」](https://atcoder.jp/contests/abc311/tasks/abc311_h) — 主題: [資源DPを引数で渡すHLRecDP](/learn/tree/heavy-light-recursive-dp/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。 / 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC329 G「Delivery on Tree」](https://atcoder.jp/contests/abc329/tasks/abc329_g) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。既習技能: binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。
- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g) — 主題: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)。既習技能: 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

## 根拠

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC239 E 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_e)
- [ABC239 E 公式解説](https://atcoder.jp/contests/abc239/editorial/3385)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-tree-aggregation`
