---
title: "方向別grid scanによる長距離効果の前計算"
description: "「方向別grid scanによる長距離効果の前計算」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 90
---

# 方向別grid scanによる長距離効果の前計算

習得対象の目安: **水色（1200–1599）**。方向ごとの走査で長距離の影響を前計算し、探索中の判定を軽くする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 方向別grid scanによる長距離効果の前計算

各行・各列を効果の向きにscanし、最後のblockerまたはactive emitterだけを保って、直線状に続く監視・照射・到達禁止効果を全体線形時間で印付ける。

### 習得する技能

- 各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。

## 考え方

障害物に当たるまで続く光・攻撃・見通しは、各方向に走査して現在有効な影響を伝える。各始点から独立に全rayをたどる代わりに、方向ごとの状態を隣のcellへ渡す。


右向きの監視なら各行を左→右へ走査し、active=falseから始める。壁や全ての監視者など光を止めるcellで一旦active=falseにし、そのcellが右向き監視者ならactive=trueへ切り替える。普通のcellだけにactiveによる禁止印を付ける。禁止になった普通cellは光を止めない。他の三方向は走査順と有効な監視者の向きを反転して同様に行い、四つの禁止印をORする。各cellを各方向で一回見るので、rayごとの重複走査を避けられる。

## 成立条件と計算量

H×W盤面なら固定方向数についてO(HW)。壁で状態を止める条件と、始点のcellを影響に含むかを固定する。斜めなら同じ対角線の順で走査する。方向別情報の合成は求める条件から決める。

概念上の親: [状態グラフ探索・到達関係](/learn/graph/graph-search/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

各行・各列を固定方向に一度ずつscanし、定数方向へ伸びる効果をblockerまで一括伝播する。効果を止める属性と、その後の処理で禁止する属性を分離する。

### このUnitでは扱わないもの

- 方向別grid scanによる長距離効果の前計算の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC317 E「Avoid Eye Contact」](https://atcoder.jp/contests/abc317/tasks/abc317_e) — 主題: [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/)（各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC317 E 公式問題文](https://atcoder.jp/contests/abc317/tasks/abc317_e)
- [ABC317 E 公式解説](https://atcoder.jp/contests/abc317/editorial/7031)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-directional-grid-effect-scan`
