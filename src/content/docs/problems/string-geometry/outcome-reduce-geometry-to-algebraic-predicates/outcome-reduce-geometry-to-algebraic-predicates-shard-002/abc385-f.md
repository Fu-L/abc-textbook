---
title: "ABC385-F — Visible Buildings"
draft: true
authoringUnit: {"problemId":"abc385-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc385-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc385-editorial-11664-76d5a0bbd1baef5fe071c2d300507fca7164300e970ad633d9c5f17e3591e920","source-abc385-f-problem-75176a21b1f00a0a84ff4c1c5737571a51db5a16d6aefba6f634abe016ff81d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"ビルの頂点が全ての手前の頂点より高い視線の傾きを持てば、その頂点までの線分は全ての手前のビルの上を通る。傾きが隣接位置で増えなければ、その奥のビルのどの点へ向かう線分も手前のビルと共有点を持つ。したがって全ビルが見える条件は隣接傾きの狭義増加と等価であり、各条件をhについて解いた最大境界tで全体の可視性が決まる。hは非負なので、t<0のときだけ不可視な高さが存在せず−1を返す。","sourceRevisionIds":["source-abc385-editorial-11664-76d5a0bbd1baef5fe071c2d300507fca7164300e970ad633d9c5f17e3591e920","source-abc385-f-problem-75176a21b1f00a0a84ff4c1c5737571a51db5a16d6aefba6f634abe016ff81d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

高さhの観測点からビルiの頂点への傾きは(H_i−h)/X_iである。全ビルが見える条件は、この傾きが手前から奥へ狭義増加すること。隣接する全組で比較すれば、推移性によって全ての手前のビルとの比較も満たす。

X_i<X_{i+1}なので条件を整理するとh>t_i、t_i=(H_i X_{i+1}−H_{i+1}X_i)/(X_{i+1}−X_i)。全組の最大値tが、見えない高さの上端になる。等号では視線が手前のビル頂点に接して遮られるため、t=0でも答えは0である。一方t<0なら高さ0で既に全て見えるので、問題の指定通り整数の−1を出力する。N=1も常に見えるので−1。

分子・分母を整数で作り、最大の分数を求めて最後に浮動小数で出力する。答えをmax(t,0)で丸めると、−1を返すべき入力を誤る。

## 典型の発動条件

### 局所制約による全pair制約の支配

発動条件: 順序付き点列の三点性質から遠いpairの制約が隣接pairへ含意されるとき。

隣接N-1条件だけへ削減する。

### 安定な有理式評価

発動条件: 大きく近い浮動小数の差が現れる幾何計算をするとき。

式を整数の単一分子・分母へ整理して最後に割る。

## 問題固有の要素

可視性を各pair制約として眺め、任意の中間点を入れた三点比較をすると、非隣接pairが極値候補から消える。

別の問題へ持ち帰る視点: 全pair幾何最適化では、順序上の中間要素による支配・三角的性質を探し、隣接制約へ落とせないか試す。

## 正当性

ビルの頂点が全ての手前の頂点より高い視線の傾きを持てば、その頂点までの線分は全ての手前のビルの上を通る。傾きが隣接位置で増えなければ、その奥のビルのどの点へ向かう線分も手前のビルと共有点を持つ。したがって全ビルが見える条件は隣接傾きの狭義増加と等価であり、各条件をhについて解いた最大境界tで全体の可視性が決まる。hは非負なので、t<0のときだけ不可視な高さが存在せず−1を返す。

## 実装上の注意

- N=1または全境界が負なら整数表記の−1を出す。境界が0なら0を出す。
- 分子は64bit内でも、分数比較の交差積は128bitを使う。浮動小数への変換を整数積の前に行わない。十分な桁数を出力する。

## 復習の核

- 三点をrandom生成して全pair境界最大と隣接pair最大を高精度有理数で比較し、分子が0付近・巨大値同士の差になるcaseを重点確認する。

## 計算量と制約

### 時間

O(N)。隣接buildingの境界分数を最大化する。

### 空間

O(1)追加領域。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq X_1 < \dots < X_N \leq 10^9; 1 \leq H_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/editorial/11664) — source-abc385-editorial-11664-76d5a0bbd1baef5fe071c2d300507fca7164300e970ad633d9c5f17e3591e920
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/tasks/abc385_f) — source-abc385-f-problem-75176a21b1f00a0a84ff4c1c5737571a51db5a16d6aefba6f634abe016ff81d2
