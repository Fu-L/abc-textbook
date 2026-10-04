---
title: "ABC260-E — At Least One"
draft: true
authoringUnit: {"problemId":"abc260-e","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc260-e.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window"],"sourceRevisionIds":["source-abc260-e-problem-328b227f4e99a537b69624783d76fc38e6ead0e01546ee21e17761b6ae77e9db","source-abc260-editorial-4458-d75d5dd71779552ced576f6e2f3bb80a4171a1aa23dc1a95432563e980ab61ac"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"固定 L の最小良区間長を d=R−L＋1 とすると、長さ d から M−L＋1 までへ一つずつ寄与するので、長さ軸の差分配列で一括加算できる。 右端は左端を進めても後退せず、座標を出入りする組だけ更新すれば全区間境界を一走査で得られる。","sourceRevisionIds":["source-abc260-e-problem-328b227f4e99a537b69624783d76fc38e6ead0e01546ee21e17761b6ae77e9db","source-abc260-editorial-4458-d75d5dd71779552ced576f6e2f3bb80a4171a1aa23dc1a95432563e980ab61ac"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

区間が全ての組 (A_i,B_i) と少なくとも一端で交われば、その区間を左右へ広げても条件を失わない。

左端 L を固定すると条件を満たす右端は、最小の R から M までの連続範囲になる。

棄却する候補: 全区間 [L,R] を列挙し、N 個の組それぞれについて端点を含むか検査する。

区間が二乗個あり、各区間の判定まで行うと制約規模を扱えない。

採用する候補: 各組の現在区間内端点数と、一端以上を含む組数を管理しながら二つの端を単調に動かす尺取り法を行う。

包含に関して上向き閉じた区間条件を two pointers で最小右端へ圧縮し、各左端が作る長さ範囲を imos で集計する。

## 典型の発動条件

### 単調区間条件の尺取り法

発動条件: 区間を右へ広げると一度成立した条件が壊れず、左端の進行に対する最小右端も単調なとき。

全組を一つ以上覆うまで R を伸ばし、L を一つ進めるたびに退出要素だけを削除する。

### 答え長への区間加算

発動条件: 一つの状態が連続する複数の長さへ同じ寄与を与えるとき。

最小長から最大長までを差分配列へ加え、最後に累積して f(k) を復元する。

## 問題固有の要素

座標 x ごとに x を端点として持つ組の一覧を用意すれば、x の追加・削除で該当する組の被覆数だけを更新できる。

別の問題へ持ち帰る視点: 多数の集合条件を窓で管理するとき、要素から所属制約への逆引きを作って変更箇所だけ反映する。

## 正当性

固定 L の最小良区間長を d=R−L＋1 とすると、長さ d から M−L＋1 までへ一つずつ寄与するので、長さ軸の差分配列で一括加算できる。 右端は左端を進めても後退せず、座標を出入りする組だけ更新すれば全区間境界を一走査で得られる。

## 実装上の注意

- 組 i の区間内端点数が 0→1、1→0 に変わる瞬間だけ、満たした組の総数を増減する。
- 固定 L の寄与範囲は [R−L＋1,M−L＋1] であり、差分配列の右端の一つ後ろを減算する。

## 復習の核

- 区間を広げたとき保存される条件なら、各左端について成立する最初の右端だけを探せば十分か確認する。
- 区間そのものではなく長さ別の個数が必要な場合、各境界から得る長さの連続範囲を差分加算へ移す。

## 計算量と制約

### 時間

O(N+M)、N pair、座標域1..M、two pointersと長さimos。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 2 \leq M \leq 2 \times 10^5; 1 \leq A_i \lt B_i \leq M; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/tasks/abc260_e) — source-abc260-e-problem-328b227f4e99a537b69624783d76fc38e6ead0e01546ee21e17761b6ae77e9db
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/editorial/4458) — source-abc260-editorial-4458-d75d5dd71779552ced576f6e2f3bb80a4171a1aa23dc1a95432563e980ab61ac
