---
title: "ABC251-F — Two Spanning Trees"
draft: true
authoringUnit: {"problemId":"abc251-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc251-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc251-editorial-3967-90601373bb0e48091b049de5b708197d859997f1f2faef7f32ed1bfdd64f586d","source-abc251-f-problem-b2dfea0a68dca2ab444448bb5b5a71d3d04bfc7e01ad8f791a84e7a8463e97e4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"無向DFSの非tree辺の両端は祖先子孫関係となるためDFS木は求める第一条件を満たす。既訪問先が常に祖先という意味ではなく、後から子孫への辺を検査する場合もある。BFSでは各元辺の両端depth差≤1。tree上で親子でない祖先子孫ならdepth差≥2なので矛盾し第二条件を満たす。両探索は新規発見辺を一頂点につき一つ採り連結性と無閉路を保つ。","sourceRevisionIds":["source-abc251-editorial-3967-90601373bb0e48091b049de5b708197d859997f1f2faef7f32ed1bfdd64f586d","source-abc251-f-problem-b2dfea0a68dca2ab444448bb5b5a71d3d04bfc7e01ad8f791a84e7a8463e97e4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

DFSとBFSが辺に対して保証する距離/祖先構造を比較する。無向DFSの非tree辺は祖先子孫間に限られる。一方BFSの全元辺はdepth差が高々1で、親子でない祖先子孫間に存在できない。両方の発見辺を出せば異なる要求を持つ二つのspanning treeを構成できる。

## 典型の発動条件

### DFS木の非木辺性質

発動条件: 無向グラフで全ての非木辺を祖先・子孫関係にしたい。

深さ優先探索の発見辺を全域木にする。

### BFS層

発動条件: 元グラフの辺の両端を木上の離れた祖先・子孫にしたくない。

最短距離層を作り、幅優先探索の発見辺を全域木にする。

## 問題固有の要素

問題の二つの相反する祖先条件は、無向グラフにおけるDFS木とBFS木の標準的な構造そのものである。

別の問題へ持ち帰る視点: 全域木の追加条件が非木辺の深さ関係なら、探索順が保証する辺分類や距離層を利用する。

## 正当性

無向DFSの非tree辺の両端は祖先子孫関係となるためDFS木は求める第一条件を満たす。既訪問先が常に祖先という意味ではなく、後から子孫への辺を検査する場合もある。BFSでは各元辺の両端depth差≤1。tree上で親子でない祖先子孫ならdepth差≥2なので矛盾し第二条件を満たす。両探索は新規発見辺を一頂点につき一つ採り連結性と無閉路を保つ。

## 実装上の注意

- N=2×10^5なのでDFSは反復実装も検討し、頂点はキューやスタックへ入れる発見時点で訪問済みにする。各木で必ずN-1辺を出す。

## 復習の核

- 出力木が連結かつN-1辺かを機械的に検査し、全ての元辺について第一木・第二木の祖先条件を小グラフ上で直接確認する。

## 計算量と制約

### 時間

O(N+M)、DFS木とBFS木。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; N-1 \leq M \leq \min\lbrace 2 \times 10^5, N(N-1)/2 \rbrace; 1 \leq u_i, v_i \leq N; All values in input are integers.; The given graph is simple and connected.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/editorial/3967) — source-abc251-editorial-3967-90601373bb0e48091b049de5b708197d859997f1f2faef7f32ed1bfdd64f586d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/tasks/abc251_f) — source-abc251-f-problem-b2dfea0a68dca2ab444448bb5b5a71d3d04bfc7e01ad8f791a84e7a8463e97e4
