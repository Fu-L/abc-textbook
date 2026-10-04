---
title: "ABC279-E — Cheating Amidakuji"
draft: true
authoringUnit: {"problemId":"abc279-e","docPath":"src/content/docs/problems/hybrid/outcome-localize-change-impact-by-witness/outcome-localize-change-impact-by-witness-shard-001/abc279-e.md","learningOutcomeIds":["outcome-localize-change-impact-by-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。"],"tagIds":["tag-witness-impact-localization"],"sourceRevisionIds":["source-abc279-e-problem-331a193e2ed100b176928fd48364f433619e490d75fbcffb84e141d17c8fc390","source-abc279-editorial-5289-8faa4f66138e5b0e2e9cde2740f1c56d269463ace6cbcddedfa9a5b7c4dcf65b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"省略版は完全版の最終配列でxとyのlabelだけを交換したものになる。 swap直前にx,yのどちらも1でなければ答えはpos[1]、x=1ならpos[y]、y=1ならpos[x]である。 全queryに共通のsuffix作用を1回の完全simulationへ共有し、各省略を定数時間で処理できる。","sourceRevisionIds":["source-abc279-e-problem-331a193e2ed100b176928fd48364f433619e490d75fbcffb84e141d17c8fc390","source-abc279-editorial-5289-8faa4f66138e5b0e2e9cde2740f1c56d269463ace6cbcddedfa9a5b7c4dcf65b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準witnessから変更影響を局所化する](src/content/docs/learn/modeling/change-impact-localization.md)

- 基準となる解や経路を証拠に、答えが変わり得る変更だけを特定して再計算を局所化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 存在する解を一つ復元するだけで、変更後も同じwitnessが有効かを判定しない問題。

## 考察

query iごとにM-1回のswapをやり直すと二次になるが、完全なswap列との差はi番目の隣接swap1回だけである。

ある時点で隣接位置にいる二つの値x,yは、その後の同じswap列を通しても役割だけが入れ替わり、他の値の最終位置は変わらない。

採用する候補: 全swap後の各値の最終位置posを求め、prefix permutationを進めながら省略swap直前の二値x,yを見て、1の最終位置をposから答える。

棄却する候補: 各iについて初期permutationからA_iだけ飛ばして全M swapをsimulationする。

N,M≤2×10^5に対してM²操作になる。

まずidentityへ全A_k swapを適用してvalue→final positionのposを作る。次にidentityのprefix配列C'を持ち、iを昇順に、A_iの両位置の値x,yから答えを決めた後、そのswapをC'へ適用する。

## 典型の発動条件

### 全操作との差分query

発動条件: 各queryが共通の操作列から1操作だけ除いた結果を問うとき。

完全結果と省略直前の影響対象を使い、suffix作用を共有する。

### permutationのlabel追跡

発動条件: swap列が二つの要素の将来trajectoryを交換する性質を使えるとき。

省略したswapの二labelだけが完全版と入れ替わるとみなす。

## 問題固有の要素

必要なのは配列全体でなくlabel 1の位置だけなので、省略swapが1を含むかと、相方labelの完全版最終位置だけを見ればよい。

別の問題へ持ち帰る視点: single-object queryでは、差分操作が対象objectに触れない場合を切り出し、触れる場合も交換相手の軌道へ置換する。

## 正当性

省略版は完全版の最終配列でxとyのlabelだけを交換したものになる。 swap直前にx,yのどちらも1でなければ答えはpos[1]、x=1ならpos[y]、y=1ならpos[x]である。 全queryに共通のsuffix作用を1回の完全simulationへ共有し、各省略を定数時間で処理できる。

## 実装上の注意

- posはfinal配列のposition→valueではなくvalue→positionとして構築するとcase式を直接引ける。
- 各queryのx,yはそのswapをprefixへ適用する前に読み、その後でC'を更新する。

## 復習の核

- 完全列でx,yの最終位置を色分けし、i番目swapを省くとその二labelだけが交換されることをsuffix swap1個ずつで確認する。

## 計算量と制約

### 時間

O(N+M)、N要素M隣接swap。

### 空間

O(N+M)、最終位置とprefix配列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 1 \leq A_i \leq N-1\ (1\leq i \leq M); All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/tasks/abc279_e) — source-abc279-e-problem-331a193e2ed100b176928fd48364f433619e490d75fbcffb84e141d17c8fc390
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc279/editorial/5289) — source-abc279-editorial-5289-8faa4f66138e5b0e2e9cde2740f1c56d269463ace6cbcddedfa9a5b7c4dcf65b
