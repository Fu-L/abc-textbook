---
title: "木DP・集約・rerooting"
description: "「木DP・集約・rerooting」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 139
---

# 木DP・集約・rerooting

導入対象の目安: **水色（1200–1599）**。部分木から親へ渡す要約を定め、根の移動やpath上の合成へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

探索で親子関係を作りDP状態を定義できた後、子側の集約と親側への差し替えで木全体の値を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- heap番号で暗黙に表された完全二分木の区間算術、木上パスの連続区間分解、重心による再帰分解、および更新のためのTop Tree cluster化。

## 下位単元

- [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/) — 水色
- [rerooting・全方位木DP](/learn/tree/rerooting/) — 青色
- [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC298 Ex「Sum of Min of Length」](https://atcoder.jp/contests/abc298/tasks/abc298_h) — 主題: [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)（成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC340 G「Leaf Color」](https://atcoder.jp/contests/abc340/tasks/abc340_g) — 主題: [virtual tree・auxiliary tree](/learn/tree/virtual-tree/)（対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC460 G「Vertex Flip Query」](https://atcoder.jp/contests/abc460/tasks/abc460_g) — 主題: [rake・compressで動的木DPを保つ](/learn/tree/static-top-tree/)（境界頂点を持つtree clusterの要約と結合を定義し、局所更新後の木DP値を保てる。）。既習技能: [rerooting・全方位木DP](/learn/tree/rerooting/)（子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。）。

## 根拠

- [ABC220 F 公式解説](https://atcoder.jp/contests/abc220/editorial/2693)
- [ABC220 F 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_f)
- [ABC223 G 公式解説](https://atcoder.jp/contests/abc223/editorial/2775)
- [ABC223 G 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_g)
- [ABC239 E 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_e)
- [ABC239 E 公式解説](https://atcoder.jp/contests/abc239/editorial/3385)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `1d03846ca5c5afa48c210e3527c3d0a048880fc11e6612e8ba16e5387f6de90a` / LearningUnit `unit-tree-aggregation`
