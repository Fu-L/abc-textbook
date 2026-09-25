---
title: "グリッド・多次元表の局所DPを設計する"
description: "「グリッド・多次元表の局所DPを設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 60
---

# グリッド・多次元表の局所DPを設計する

習得対象の目安: **緑色（800–1199）**。二次元以上の添字と依存順を定め、隣接状態から表を埋める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第8単元。技能の説明を学んでから問題一覧へ進んでください。

前: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/) ／ 次: [同値な状態を正規化する](/learn/modeling/normalization/)

## 概要

### グリッド・多次元表の局所DP

グリッド経路や多次元表の依存関係をDAG順に並べ、隣接する小さな状態集合から各セル・各添字を更新する。

### 習得する技能

- グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。

### このUnitでは扱わないもの

- 一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。

## 問題一覧

1. [ABC311 E「Defect-free Squares」](https://atcoder.jp/contests/abc311/tasks/abc311_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。
2. [ABC415 E「Hungry Takahashi」](https://atcoder.jp/contests/abc415/tasks/abc415_e) — 主題: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)。
3. [ABC443 E「Climbing Silver」](https://atcoder.jp/contests/abc443/tasks/abc443_e) — 主題: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC221 H「Count Multiset」](https://atcoder.jp/contests/abc221/tasks/abc221_h) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 f[x][y]=f[x][y−x]+Σ_{直前M行k}f[k][y−x]。列ごとに行方向のsliding sumを保持してM項走査を消す。入る行を足し、出る行を引く順序を固定する。
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC358 G「AtCoder Tour」](https://atcoder.jp/contests/abc358/tasks/abc358_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 K歩DPを直接展開するとKに比例する。walkの余分な周回を訪問済み最大報酬の頂点での滞在へ移せるので、t≤HWだけDPし、dp[t][v]+(K−t)A_vを最大化する。巨大時間を短いprefixと線形tailへ分ける証明が核心。
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。

## 根拠

- [ABC221 H 公式解説](https://atcoder.jp/contests/abc221/editorial/2719)
- [ABC221 H 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_h)
- [ABC227 F 公式解説](https://atcoder.jp/contests/abc227/editorial/2914)
- [ABC227 F 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_f)
- [ABC311 E 公式問題文](https://atcoder.jp/contests/abc311/tasks/abc311_e)
- [ABC311 E 公式解説](https://atcoder.jp/contests/abc311/editorial/6819)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-grid-table`
