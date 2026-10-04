---
title: "ABC384-E — Takahashi is Slime 2"
draft: true
authoringUnit: {"problemId":"abc384-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc384-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc384-e-problem-bf8dd0cf62300333fdccb8dc42ae38215ce96de4b03444906f29b0514d33429f","source-abc384-editorial-11601-3047b5bcf8eef85bfdeecf094fd18e1e497b93ecddd3ce83bdc1d58ea4b9f734"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"heapは吸収済み集合に四近傍で接する未吸収cellを、登録一回の規約で全て保持する。Tは吸収で増えるだけなので、最小sに対するX s<Tが偽なら全境界が不能である。\n\n貪欲の終了時に吸収済みの集合をGとする。別の合法な吸収列にGの外のcellがあると仮定し、その最初のcell aを取る。aより前に吸収したcellは全てG内なので、その時の自分の強さは貪欲の終了強さ以下。aはそのprefixのcellに接しているから終了時のGにも接し、他列で吸収可能だったX S_a<Tは終了時にも成立する。しかし終了時のheapには吸収可能な境界が一つもないので矛盾する。従って全合法列の吸収集合はGの部分集合であり、正の強さの総和も貪欲が最大となる。","sourceRevisionIds":["source-abc384-e-problem-bf8dd0cf62300333fdccb8dc42ae38215ce96de4b03444906f29b0514d33429f","source-abc384-editorial-11601-3047b5bcf8eef85bfdeecf094fd18e1e497b93ecddd3ce83bdc1d58ea4b9f734"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

自分の現在強さをT、境界slimeの強さをsとする。吸収可能な条件はs<T/X、整数ではX s<Tという厳密不等号である。一度接したslimeは吸収まで候補に残り、吸収するとTはsだけ増える。今できる吸収を行っても他の候補が消えず、以後の吸収可能性を減らさない。

開始cellを吸収済みとしてT=S[P,Q]とし、その四近傍を強さkeyのmin-heapへ入れる。最小候補sがX s<Tならpopして吸収し、そのcellの未登録四近傍を追加する。最小候補が条件を満たさなければ他の境界候補も全て不能なので、終了してTを答える。

通常BFSで一度不能だったcellを捨てるのは危険である。例えばX=2、開始強さT=10で、強さ4と5の二つの境界があれば、5は最初は等号で不能だが、4を吸収するとT=14になり5も吸収できる。不能候補をheapに残して強化後に再考することが必要である。

最弱から選ぶのは停止判定をheap先頭だけで済ませるためであり、大域最適性はさらに「別の吸収列で最初に貪欲の最終集合から外れるcell」を使って証明する。今の一手が安い・簡単という理由だけで結論しない。

条件の積X sは最大10^21まで達するので、128bit等の広い整数型で評価するか、T>0,X>0を使ってs≤floor((T−1)/X)と比較する。後者は厳密不等号を整数除算へ正確に移した式であり、単にs≤floor(T/X)にすると割り切れる等号を誤って許す。

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

heapは吸収済み集合に四近傍で接する未吸収cellを、登録一回の規約で全て保持する。Tは吸収で増えるだけなので、最小sに対するX s<Tが偽なら全境界が不能である。

貪欲の終了時に吸収済みの集合をGとする。別の合法な吸収列にGの外のcellがあると仮定し、その最初のcell aを取る。aより前に吸収したcellは全てG内なので、その時の自分の強さは貪欲の終了強さ以下。aはそのprefixのcellに接しているから終了時のGにも接し、他列で吸収可能だったX S_a<Tは終了時にも成立する。しかし終了時のheapには吸収可能な境界が一つもないので矛盾する。従って全合法列の吸収集合はGの部分集合であり、正の強さの総和も貪欲が最大となる。

## 実装上の注意

- 登録済みと吸収済みを区別する。visitedはheap投入時に立て重複pushを防ぐが、そのcellの強さをTへ足すのはpopして条件を満たすときだけ。
- 同票に相当するX s=Tでは吸収できない。広い整数でX s<T、または64bitのs≤(T−1)/Xを使う。
- 最終T≤HW×10^12≤2.5×10^17は64bitに収まる。X sの積だけは64bit上限を超え得る。

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
