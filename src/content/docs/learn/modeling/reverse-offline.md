---
title: "時間を逆向きにして未来依存を消す"
description: "「時間を逆向きにして未来依存を消す」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 18
---

# 時間を逆向きにして未来依存を消す

習得対象の目安: **水色（1200–1599）**。削除を追加に変えるなど、時間を逆に読むことで扱える操作を増やす。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第41単元。技能の説明を学んでから問題一覧へ進んでください。

前: [event順にactive集合を更新する](/learn/modeling/event-sweep/) ／ 次: [木距離を基準点・直径・中心から捉える](/learn/tree/tree-metric/)

## 概要

### 逆向きのオフライン処理

時間依存を逆走査・逆操作・last-write時刻で単調または静的な処理へ変換し、元の時点の答えを復元する。

### 習得する技能

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

削除・上書き・未来依存を含む更新列を逆向きに読み、追加だけ・first-writeだけなどの単調な処理へ変換して元の時刻へ答えを戻す。

### このUnitでは扱わないもの

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 問題一覧

1. [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
2. [ABC346 E「Paint」](https://atcoder.jp/contests/abc346/tasks/abc346_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。
3. [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。
4. [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。
5. [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
6. [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。
- [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

## 根拠

- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)
- [ABC238 H 公式解説](https://atcoder.jp/contests/abc238/editorial/3361)
- [ABC238 H 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC249 F 公式解説](https://atcoder.jp/contests/abc249/editorial/3789)
- [ABC249 F 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-reverse-offline`
