---
title: "支配関係から不要な候補を単調stack・queueで削る"
description: "「支配関係から不要な候補を単調stack・queueで削る」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 34
---

# 支配関係から不要な候補を単調stack・queueで削る

習得対象の目安: **水色（1200–1599）**。将来不要な候補を削る支配関係と、一要素一度の償却計算量を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第18単元。技能の説明を学んでから問題一覧へ進んでください。

前: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/) ／ 次: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)

## 概要

### 単調stack・queueによる支配候補の削除

順序に走査し、新しい要素に支配された候補を二度と必要にならないことを示して一度だけ削除する。

### 習得する技能

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

候補の支配関係を証明し、不要になった要素を一度だけ捨てて線形処理へ変える。

### このUnitでは扱わないもの

- 全候補から極値を反復取得するheap・ordered set。

## 問題一覧

1. [ABC359 E「Water Tank」](https://atcoder.jp/contests/abc359/tasks/abc359_e) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。
2. [ABC379 F「Buildings 2」](https://atcoder.jp/contests/abc379/tasks/abc379_f) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。
3. [ABC228 F「Stamp Game」](https://atcoder.jp/contests/abc228/tasks/abc228_f) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。既習技能: 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。
- [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g) — 主題: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。 配達の直接経路をbaselineにし、補充境界iの追加費用をd_iとする。dp[i]=d_i+min_{i−K≤j<i}dp[j]。窓から出た候補と支配される候補をdequeから除き、O(NK)をO(N)へ落とす。
- [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC228 F 公式解説](https://atcoder.jp/contests/abc228/editorial/2945)
- [ABC228 F 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_f)
- [ABC234 G 公式解説](https://atcoder.jp/contests/abc234/editorial/3227)
- [ABC234 G 公式問題文](https://atcoder.jp/contests/abc234/tasks/abc234_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-monotone-stack-queue`
