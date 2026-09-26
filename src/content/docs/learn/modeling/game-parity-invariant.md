---
title: "偶奇不変量からゲームの勝敗を決める"
description: "「偶奇不変量からゲームの勝敗を決める」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 27
---

# 偶奇不変量からゲームの勝敗を決める

習得対象の目安: **青色（1600–1999）**。局面ごとの勝敗再帰が不要な条件を見つけ、手数・終端量の偶奇から成立する戦略を証明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 偶奇不変量によるゲーム戦略

後続局面をDPで列挙せず、合法手の独立な消費や終端状態の偶奇不変量を証明して、先手・後手の勝敗を決める。

### 習得する技能

- 合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

局面ごとの再帰計算が必要かを先に問い、各手が固定候補を一つ消費する場合や終端量の偶奇が不変量で決まる場合に、全局面を追わない勝敗戦略を証明する。

### このUnitでは扱わないもの

- 後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。

## 問題一覧

- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e) — 主題: [偶奇不変量からゲームの勝敗を決める](/learn/modeling/game-parity-invariant/)（合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。）。追加で学ぶ技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。
- [ABC398 G「Not Only Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_g) — 主題: [偶奇不変量からゲームの勝敗を決める](/learn/modeling/game-parity-invariant/)（合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。）。追加で学ぶ技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC398 E 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC398 G 公式解説](https://atcoder.jp/contests/abc398/editorial/12480)
- [ABC398 E 公式解説](https://atcoder.jp/contests/abc398/editorial/12483)
- [ABC398 G 公式問題文](https://atcoder.jp/contests/abc398/tasks/abc398_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fe591a16d9b08c0422f76dc5b6e297c591f361a20ee3548685e39ff3a0e3444a` / LearningUnit `unit-game-parity-invariant`
