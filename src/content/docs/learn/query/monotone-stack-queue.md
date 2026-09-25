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

## 概要

### 単調stack・queueによる支配候補の削除

順序に走査し、新しい要素に支配された候補を二度と必要にならないことを示して一度だけ削除する。

### 習得する技能

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。

候補の支配関係を証明し、不要になった要素を一度だけ捨てて線形処理へ変える。

### このUnitでは扱わないもの

- 全候補から極値を反復取得するheap・ordered set。

## 問題一覧

- [ABC359 E「Water Tank」](https://atcoder.jp/contests/abc359/tasks/abc359_e) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC228 F「Stamp Game」](https://atcoder.jp/contests/abc228/tasks/abc228_f) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。）。
- [ABC379 F「Buildings 2」](https://atcoder.jp/contests/abc379/tasks/abc379_f) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC248 Ex「Beautiful Subsequences」](https://atcoder.jp/contests/abc248/tasks/abc248_h) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)（接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g) — 主題: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)（有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。 配達の直接経路をbaselineにし、補充境界iの追加費用をd_iとする。dp[i]=d_i+min_{i−K≤j<i}dp[j]。窓から出た候補と支配される候補をdequeから除き、O(NK)をO(N)へ落とす。
- [ABC420 F「kirinuki」](https://atcoder.jp/contests/abc420/tasks/abc420_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC228 F 公式解説](https://atcoder.jp/contests/abc228/editorial/2945)
- [ABC228 F 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_f)
- [ABC234 G 公式解説](https://atcoder.jp/contests/abc234/editorial/3227)
- [ABC234 G 公式問題文](https://atcoder.jp/contests/abc234/tasks/abc234_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `2e4490fc41ab38d6e8475da24b59bae4ad3f39622cdd3bbd7b071e451f2c1779` / LearningUnit `unit-monotone-stack-queue`
