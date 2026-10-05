---
title: "ABC436-F — Starry Landscape Photo"
draft: true
authoringUnit: {"problemId":"abc436-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-005/abc436-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc436-editorial-14750-acc54c52c47bca169df5838392016e5cf1f4edbaae92e4ed128b61e5e02cc86e","source-abc436-f-problem-da1ce3721b6595927abdc1e76b7d373d4d10200091df978ad88750845d69f5d0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"写る集合には一意な最暗星iがあり、それはB最大の星である。集合の左端・右端はiを含むフレームの範囲内で、i自身またはB_j<B_iの星に置ける。フレームの内側でiより暗い星を含めないよう閾値を定めると、左右の端の選択は独立である。B_i昇順sweep時のFenwick treeにはちょうどB_j<B_iの位置が入り、左右候補数はleft+1、right+1。よって積を全iで足すと各写る集合を最暗星により一度だけ数える。","sourceRevisionIds":["source-abc436-editorial-14750-acc54c52c47bca169df5838392016e5cf1f4edbaae92e4ed128b61e5e02cc86e","source-abc436-f-problem-da1ce3721b6595927abdc1e76b7d373d4d10200091df978ad88750845d69f5d0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

各写る集合を、その中で最も暗い星iによって分類する。Bは小さいほど明るいのでiは集合中のB最大位置である。フレーム自体は連続区間でも、写る星の集合は連続とは限らない。例えばB=(1,3,2)で閾値2なら、写る位置は{1,3}となる。

最暗星iを固定したとき、写る集合の左端はi自身か、iより左にあるより明るい星 `B_j<B_i` から選べる。右端も対称で、左右は独立。B_iの小さい順に位置をFenwick treeへ追加しておけば、左右の候補数は `(left+1)(right+1)` で数えられる。各側の+1は、その側の端をi自身にする一通り。

採用する候補: 最暗星で分類し、より明るい星から写る集合の左右端を選ぶ。

位置数の二乗列挙を、値順sweepとFenwickの個数queryへ置き換える。

棄却する候補: 全てのフレームと閾値を列挙して写る集合を作る。

候補数が二乗を超え、集合の重複も多い。

## 典型の発動条件

### 一意な最小要素による分類

発動条件: 各区間・集合に最小値位置が一意で、その位置固定後に選択が分離するとき。

写る集合を最暗星 i ごとに数え、重複をなくす。

### 値順 sweep と Fenwick 木

発動条件: 各位置から左右にある自分より小さい値の個数を全点で求めたいとき。

値の小さい位置を順に追加し、位置 prefix sum で左右個数を得る。

## 問題固有の要素

集合条件を最小値で分類すると、残りの自由度が左右の独立な境界選択の積になる。

別の問題へ持ち帰る視点: 値と位置の二次元大小条件は、一方をソートして sweep し、他方を Fenwick 木で数える。

## 正当性

写る集合には一意な最暗星iがあり、それはB最大の星である。集合の左端・右端はiを含むフレームの範囲内で、i自身またはB_j<B_iの星に置ける。フレームの内側でiより暗い星を含めないよう閾値を定めると、左右の端の選択は独立である。B_i昇順sweep時のFenwick treeにはちょうどB_j<B_iの位置が入り、左右候補数はleft+1、right+1。よって積を全iで足すと各写る集合を最暗星により一度だけ数える。

## 実装上の注意

- 現在位置 i は query 後に activate し、厳密不等号 B_j<B_i を保つ。積と総和は十分広い整数型または指定法で計算する。

## 復習の核

- left/right の +1 が境界を選ばない場合を表し、各有効集合が最暗星一つへだけ帰属することを確認する。

## 計算量と制約

### 時間

O(N log N)、輝度値順の位置activate。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le5\times10 ^ 5; 1\le B _ i\le N\ (1\le i\le N); B _ i\ne B _ j\ (1\le i\lt j\le N); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/editorial/14750) — source-abc436-editorial-14750-acc54c52c47bca169df5838392016e5cf1f4edbaae92e4ed128b61e5e02cc86e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc436/tasks/abc436_f) — source-abc436-f-problem-da1ce3721b6595927abdc1e76b7d373d4d10200091df978ad88750845d69f5d0
