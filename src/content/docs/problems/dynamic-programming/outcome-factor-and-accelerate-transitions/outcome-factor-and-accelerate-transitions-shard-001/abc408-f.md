---
title: "ABC408-F — Athletic"
draft: true
authoringUnit: {"problemId":"abc408-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc408-f.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-event-sweep","unit-range-monoid-aggregation"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-event-sweep","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc408-editorial-13171-873a19e6cbc121a328bdb5d460e7ca35f392791b3ab13c7c5d38ea73c79b1bc0","source-abc408-f-problem-e9d9d4e80f8f317e1ca2bca68e178e015b8b622e132f810fdde4adc52b11ff3a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"高さが D 以上下がるため移動 graph は DAG。高さ hの処理時にtreeへ h−Dを挿入すると、treeは高さ≤h−Dの確定済み値をちょうど持つ。位置範囲±R内の最大 dpへ1を足すのは全合法一歩の列挙と等価。遷移なしの0が基底となり、高さ帰納法で各足場からの最長移動回数を求める。","sourceRevisionIds":["source-abc408-editorial-13171-873a19e6cbc121a328bdb5d460e7ca35f392791b3ab13c7c5d38ea73c79b1bc0","source-abc408-f-problem-e9d9d4e80f8f317e1ca2bca68e178e015b8b622e132f810fdde4adc52b11ff3a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

移動するたび高さは少なくとも D 下がるため DAG 的であり、低い足場の dp を先に確定して高さ順に計算できる。 高さは1..Nの permutation なので逆置換 p_h を使えば、高さ h の足場位置を O(1) で得られる。遷移元は高さ≤h-Dかつ位置が p_h±R の範囲にある足場である。 h を一つ進めるごとに新たに遷移元となるのは高さ h-D の足場一個だけなので、二条件のうち高さ条件を incremental な点追加にできる。 segment tree の添字を高さではなく位置にすることで、残る |i-j|≤R を一つの区間最大 query として処理できる。

採用する候補: 高さ h を昇順に走査し、利用可能になった高さ h-D の dp を位置添字 segment tree へ点更新して、現在位置周辺の区間最大を取る

segment tree にはちょうど高さ≤h-Dの状態だけが入り、各 dp を O(log N) で計算して全体 O(N log N) になる。

棄却する候補: 各足場から距離 R 以内の全位置、または高さ差 D 以上の全足場を列挙する

R,D とも N まであり、条件の片方だけで候補を絞っても最悪 O(N^2) の pair を調べる。

h を一つ進めるごとに新たに遷移元となるのは高さ h-D の足場一個だけなので、二条件のうち高さ条件を incremental な点追加にできる。

segment tree の添字を高さではなく位置にすることで、残る |i-j|≤R を一つの区間最大 query として処理できる。

p_{H_i}=i を作り、segment tree を -INF で初期化する。h=1..N で h>D なら位置 p_{h-D} に確定済み dp を挿入し、[max(1,p_h-R),min(N,p_h+R)] の最大値 best から、存在すれば dp[p_h]=best+1、なければ0とする。全 dp の最大を出力する。

## 典型の発動条件

### DAG 順 DP

発動条件: 遷移で評価量が必ず狭義減少し、その順序で状態を並べられるとき。

高さ昇順に、より低い遷移先の最大移動回数から現在値を作る。

### sweep と eligible 集合

発動条件: 二条件の一方が走査変数に対する閾値で単調に増えるとき。

高さ h-D に達した状態を一個ずつ data structure へ有効化する。

### segment tree の区間最大

発動条件: 動的な点集合から位置区間内の最大 DP 値を得たいとき。

有効な低い足場の dp を位置に置き、p_h±R を range maximum query する。

## 問題固有の要素

高さ条件を segment tree の値判定に入れず、sweep 時刻で満たす要素だけを挿入すると、木は位置距離条件だけを担当すればよい。

別の問題へ持ち帰る視点: 二軸条件の遷移では、一軸を offline sweep で有効化し、もう一軸を range data structure に任せる。

## 正当性

高さが D 以上下がるため移動 graph は DAG。高さ hの処理時にtreeへ h−Dを挿入すると、treeは高さ≤h−Dの確定済み値をちょうど持つ。位置範囲±R内の最大 dpへ1を足すのは全合法一歩の列挙と等価。遷移なしの0が基底となり、高さ帰納法で各足場からの最長移動回数を求める。

## 実装上の注意

- 遷移元がない -INF の場合は dp=0 とする。h-D を挿入してから h を query し、位置区間端を1..Nへ clamp する。

## 復習の核

- D>Nの実質遷移なし、R=N、単調な位置配置、高さ h-D が区間端にある場合を O(N^2) DP と比較する。

## 計算量と制約

### 時間

足場 N。逆置換 O(N)、各高さで一挿入・一範囲最大を行い O(N log N)。

### 空間

逆置換、dp、treeで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 1 \leq D,R \leq N; H is a permutation of (1,2,\ldots,N).; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/editorial/13171) — source-abc408-editorial-13171-873a19e6cbc121a328bdb5d460e7ca35f392791b3ab13c7c5d38ea73c79b1bc0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/tasks/abc408_f) — source-abc408-f-problem-e9d9d4e80f8f317e1ca2bca68e178e015b8b622e132f810fdde4adc52b11ff3a
