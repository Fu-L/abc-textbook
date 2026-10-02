---
title: "ABC384-E — Takahashi is Slime 2"
draft: true
authoringUnit: {"problemId":"abc384-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc384-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc384-e-problem-bf8dd0cf62300333fdccb8dc42ae38215ce96de4b03444906f29b0514d33429f","source-abc384-editorial-11601-3047b5bcf8eef85bfdeecf094fd18e1e497b93ecddd3ce83bdc1d58ea4b9f734"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"heapは現在の吸収済み領域に隣接する未訪問cellを全て保持し、先頭が全候補の最小値という不変条件を保つ。 吸収条件は積を含む厳密不等号なので、除算による丸めを避けて元の整数関係で判定する。 最小候補を選ぶgreedyは強さを単調増加させ、別の実行列で吸収できる最初の未採用slimeも同時点で吸収可能という交換論が成立する。","sourceRevisionIds":["source-abc384-e-problem-bf8dd0cf62300333fdccb8dc42ae38215ce96de4b03444906f29b0514d33429f","source-abc384-editorial-11601-3047b5bcf8eef85bfdeecf094fd18e1e497b93ecddd3ce83bdc1d58ea4b9f734"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一度境界に現れたslimeは吸収するまで候補に残り、自分の強さは吸収で増えるだけである。今吸収可能なものを取って将来不利になることはない。

候補の最小強さが条件を満たさないなら、それ以上の候補も満たさず、新しい候補を開く方法もないのでそこで終了できる。

採用する候補: 到達境界をmin-heapで管理し、吸収可能な最小slimeから広げる

最小候補を選ぶgreedyは強さを単調増加させ、別の実行列で吸収できる最初の未採用slimeも同時点で吸収可能という交換論が成立する。

棄却する候補: gridを通常のBFS順に走査して吸収判定する

大きくて今は吸収不能な境界を先に捨てると、他の小さいslimeで強化した後に再考できず、探索順へ答えが依存する。

heapは現在の吸収済み領域に隣接する未訪問cellを全て保持し、先頭が全候補の最小値という不変条件を保つ。

吸収条件は積を含む厳密不等号なので、除算による丸めを避けて元の整数関係で判定する。

開始cellを吸収済みとして強さへ加え、隣接cellをmin-heapへ入れる。最小候補が現在強さに対する公式条件を満たす間だけpop・吸収し、その未訪問隣接を追加する。

## 典型の発動条件

### best-first search

発動条件: 到達可能frontierからkey最小の要素を繰り返し選び、選択で能力が単調改善するとき。

境界slimeをmin-heapに入れ、最弱から吸収する。

### 単調greedyの停止判定

発動条件: 候補が全順序で並び、最良候補すら実行不能なら他も不能なとき。

heap先頭が条件を満たさない時点で探索を終了する。

## 問題固有の要素

到達可能性と吸収可能性を分け、未吸収でも接しているcellをheapに残すことが、後から強くなった際の再考を自然に実現する。

別の問題へ持ち帰る視点: 能力が増える探索では、現時点で不能な候補を破棄せずfrontierへ保持し、最小要求から処理する。

## 正当性

heapは現在の吸収済み領域に隣接する未訪問cellを全て保持し、先頭が全候補の最小値という不変条件を保つ。 吸収条件は積を含む厳密不等号なので、除算による丸めを避けて元の整数関係で判定する。 最小候補を選ぶgreedyは強さを単調増加させ、別の実行列で吸収できる最初の未採用slimeも同時点で吸収可能という交換論が成立する。

## 実装上の注意

- cellをheapへ入れた時点でvisitedにして重複pushを防ぐ。吸収条件の積はoverflowしない広い整数型で評価し、等号を許すかは問題文どおりにする。

## 復習の核

- 最初の最小候補が等号境界、強化後に以前の候補が吸収可能になるcase、細い通路を含む小gridを手順全探索と比較する。

## 計算量と制約

### 時間

O(HW log(HW))、各cellを一度だけpush。

### 空間

O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq H,W\leq500; 1\leq P\leq H; 1\leq Q\leq W; 1\leq X\leq10^9; 1\leq S _ {i,j}\leq10^{12}; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc384/tasks/abc384_e) — source-abc384-e-problem-bf8dd0cf62300333fdccb8dc42ae38215ce96de4b03444906f29b0514d33429f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc384/editorial/11601) — source-abc384-editorial-11601-3047b5bcf8eef85bfdeecf094fd18e1e497b93ecddd3ce83bdc1d58ea4b9f734
