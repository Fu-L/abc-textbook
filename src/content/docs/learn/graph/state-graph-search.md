---
title: "状態グラフのモデリングと探索"
description: "「状態グラフのモデリングと探索」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 87
---

# 状態グラフのモデリングと探索

習得対象の目安: **緑色（800–1199）**。位置と補助情報を一つの頂点にし、状態数・辺数を見積もってBFSやDFSを使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第19単元。技能の説明を学んでから問題一覧へ進んでください。

前: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/) ／ 次: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)

## 概要

### 状態グラフのモデリングと探索

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。

状態に頂点以外の情報を加えるときは、状態数と遷移数に加えて、遷移に閉路があるかを確認する。ABC244 Fの状態は(mask,v)で、移動先uのbitを反転して(mask XOR (1<<u),u)へ進む。集合は増減するため部分集合の包含順では計算できない。

各vから(1<<v,v)を距離1で多始点BFSし、各maskについて終点vの距離の最小値を取る。空のwalkで実現するmask=0は長さ0。bitmaskは状態表現であり、距離を確定する算法は単位重みのBFSである。

### 習得する技能

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
2. [ABC446 E「Multiple-Free Sequences」](https://atcoder.jp/contests/abc446/tasks/abc446_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
3. [ABC289 E「Swap Places」](https://atcoder.jp/contests/abc289/tasks/abc289_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
4. [ABC302 F「Merge Set」](https://atcoder.jp/contests/abc302/tasks/abc302_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
5. [ABC429 E「Hit and Away」](https://atcoder.jp/contests/abc429/tasks/abc429_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
6. [ABC394 E「Palindromic Shortest Path」](https://atcoder.jp/contests/abc394/tasks/abc394_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
7. [ABC446 F「Reachable Set 2」](https://atcoder.jp/contests/abc446/tasks/abc446_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
8. [ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
9. [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
10. [ABC241 F「Skate」](https://atcoder.jp/contests/abc241/tasks/abc241_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。
11. [ABC414 F「Jump Traveling」](https://atcoder.jp/contests/abc414/tasks/abc414_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC317 E「Avoid Eye Contact」](https://atcoder.jp/contests/abc317/tasks/abc317_e) — 主題: [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 距離等式を満たす親辺を選び、最短路の木または経路を復元できる。
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)。既習技能: 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-state-graph-search`
