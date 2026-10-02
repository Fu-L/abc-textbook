---
title: "ABC436-F — Starry Landscape Photo"
draft: true
authoringUnit: {"problemId":"abc436-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-005/abc436-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc436-editorial-14750-acc54c52c47bca169df5838392016e5cf1f4edbaae92e4ed128b61e5e02cc86e","source-abc436-f-problem-da1ce3721b6595927abdc1e76b7d373d4d10200091df978ad88750845d69f5d0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最暗星が i の集合は、左に選ぶ境界候補として j<iかつB_j<B_i の各位置または選ばない一通り、右も同様に選べる。 B_i の昇順に位置を activate すれば、現在 Fenwick 木に入っている位置はすべて B_j<B_i である。 最暗星 i を含む有効集合の左端・右端選択が独立で、全個数を O(N log N) で得られる。","sourceRevisionIds":["source-abc436-editorial-14750-acc54c52c47bca169df5838392016e5cf1f4edbaae92e4ed128b61e5e02cc86e","source-abc436-f-problem-da1ce3721b6595927abdc1e76b7d373d4d10200091df978ad88750845d69f5d0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

写真に写る連続区間を、その中で最も暗い星の位置 i で一意に分類する。B が順列なので最小値位置は一つで、区間の左右端は i より暗い星の候補から選べる。

採用する候補: 各 i について左側・右側にある B_j<B_i の個数を Fenwick 木で求め、(left+1)(right+1) を足す。

最暗星 i を含む有効集合の左端・右端選択が独立で、全個数を O(N log N) で得られる。

棄却する候補: 全 O(N^2) 連続区間を列挙し、最暗星や条件を検査する。

N が大きく二乗時間は許されない。

最暗星が i の集合は、左に選ぶ境界候補として j<iかつB_j<B_i の各位置または選ばない一通り、右も同様に選べる。

B_i の昇順に位置を activate すれば、現在 Fenwick 木に入っている位置はすべて B_j<B_i である。

B_i=1…N の値順に対応位置 i を処理する。Fenwick 木で既処理位置の [1,i) 個数 left と (i,N] 個数 right を求め、(left+1)(right+1) を答えへ加えて位置 i を追加する。

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

最暗星が i の集合は、左に選ぶ境界候補として j<iかつB_j<B_i の各位置または選ばない一通り、右も同様に選べる。 B_i の昇順に位置を activate すれば、現在 Fenwick 木に入っている位置はすべて B_j<B_i である。 最暗星 i を含む有効集合の左端・右端選択が独立で、全個数を O(N log N) で得られる。

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
