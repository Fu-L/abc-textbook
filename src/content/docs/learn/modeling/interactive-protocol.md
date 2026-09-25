---
title: "対話protocolを守って情報を取得する"
description: "「対話protocolを守って情報を取得する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 26
---

# 対話protocolを守って情報を取得する

習得対象の目安: **緑色（800–1199）**。入出力手順・flush・問い合わせ上限を守り、単純な識別手順を実装する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第88単元。技能の説明を学んでから問題一覧へ進んでください。

前: [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/) ／ 次: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)

## 概要

### 対話protocolとquery設計

judgeとの問い合わせ・応答列をprotocolどおり実行し、回数上限内で必要な情報を識別する。

### 習得する技能

- 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

問い合わせ形式・回数上限・応答依存性・flushを明示し、通常のアルゴリズムをjudgeとの対話列として安全に実行する。

### このUnitでは扱わないもの

- 入力を最初からすべて読める通常問題、および問い合わせ上限やflushを持たない模擬入出力。

## 問題一覧

1. [ABC269 E「Last Rook」](https://atcoder.jp/contests/abc269/tasks/abc269_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
2. [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
3. [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
4. [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f) — 主題: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
5. [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
6. [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。
7. [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。 / 対称操作で同値な状態の標準形と不変量を選べる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e) — 主題: [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。

## 根拠

- [ABC269 E 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_e)
- [ABC269 E 公式解説](https://atcoder.jp/contests/abc269/editorial/4840)
- [ABC278 G 公式解説](https://atcoder.jp/contests/abc278/editorial/5237)
- [ABC278 G 公式問題文](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC282 F 公式解説](https://atcoder.jp/contests/abc282/editorial/5403)
- [ABC282 F 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-interactive-protocol`
