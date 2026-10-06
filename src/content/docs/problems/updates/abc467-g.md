---
title: "ABC467 G — Many Sweets Problem"
draft: true
authoringUnit: {"problemId":"abc467-g","docPath":"src/content/docs/problems/updates/abc467-g.md","learningOutcomeIds":["outcome-aggregate-value-prefix-by-buckets"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-value-bucket-aggregation"],"sourceRevisionIds":["source-abc467-g-problem-99f7dad5915fd9876a271f5605313bdae97f2a392297ca0ba5669ec66bd2ac02","source-abc467-editorial-23435-a4c559428e8ea79e8ed1684e0470fb68d6c6e3f872fe971dc1ffd10812a78bcf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"美味しさの小さい要素を大きい未採用要素と交換すれば、個数を変えず総和は減らない。従って最適解は値降順のprefixである。下降はより大きい値の全採用が必要な場合だけその個数と和を確定し、残りの同じ問題を一方の子へ渡す。葉で同じ値の必要最小個数を計算するため、全体の個数も最小になる。","sourceRevisionIds":["source-abc467-g-problem-99f7dad5915fd9876a271f5605313bdae97f2a392297ca0ba5669ec66bd2ac02","source-abc467-editorial-23435-a4c559428e8ea79e8ed1684e0470fb68d6c6e3f872fe971dc1ffd10812a78bcf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[値軸のbucket分割と区間集約](src/content/docs/learn/query/value-bucket-aggregation.md)

- 値軸をblockへ分け、点更新で要約を差分修正し、完全blockと端数からprefixの和・積を取得できる。更新回数とquery回数に応じてblock幅を選べる。

## 考察

正の美味しさで必要個数を最小化するなら、区間内の値を大きい順に食べる。上位m個の和はmについて単調だが、その和を毎回ソートすると遅い。値を閾値として二分探索し、二次元範囲集約で和を調べる方針も外側の二分探索が余分なlogを生む。

全更新を先読みして値を圧縮し、値軸のSegment Treeを作る。各ノードには、その値範囲へ入る可能性のある配列位置を昇順に持ち、位置ごとの個数と総和をFenwick Treeで管理する。値変更では旧値の祖先から−1,−旧値、新値の祖先へ+1,+新値を加える。

問い合わせはまず全値ノードの位置区間[l,r]の総和を確認し、k未満なら−1。そうでなければ根から値が大きい側を先に見る。右子の区間和sが残り目標k以上なら右へ降りる。s<kなら右子をすべて採用し、その区間個数を答えへ加え、kをk−sとして左へ降りる。葉の値vに着いたら追加個数は ceil(k/v)。これで値の二分探索を木の下降そのものに置き換える。

候補として登録する位置は重複を消す。C=N+Qを状態の総数とすると、一つの候補は O(log C) ノードへ入り、位置二分探索とFenwick集約が各深さで O(log C)。

## 典型の発動条件

二次元の区間集約で順序統計を求めるとき、答えの閾値に二分探索を重ねず、値軸の木を和・個数で直接下降する。

## 問題固有の要素

最小個数は上位値の和で決まり、葉ではceil(k/v)まで部分採用できる。正値制約がこの単調性を保証する。

## 正当性

美味しさの小さい要素を大きい未採用要素と交換すれば、個数を変えず総和は減らない。従って最適解は値降順のprefixである。下降はより大きい値の全採用が必要な場合だけその個数と和を確定し、残りの同じ問題を一方の子へ渡す。葉で同じ値の必要最小個数を計算するため、全体の個数も最小になる。

## 実装上の注意

位置区間はlower_bound(l),upper_bound(r)で半開区間にする。総和とkは64 bit整数。将来値の登録漏れを避ける。

## 復習の核

何を木の上位に置くかでlogを一つ減らせる。位置で分割する木と値で分割する木を比較する。

## 計算量と制約

### 時間

候補登録を含め O((N+Q) log²(N+Q))。各更新・問い合わせ O(log²(N+Q))。

### 空間

位置候補とFenwick配列に O((N+Q) log(N+Q))。

### 制約との対応

Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq Q \leq 10^5; 1 \leq A_i \leq 10^9; 1 \leq c \leq N; 1 \leq x \leq 10^9; 1 \leq l \leq r \leq N; 1 \leq k \leq 10^{15}; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc467/tasks/abc467_g)
- [公式解説](https://atcoder.jp/contests/abc467/editorial/23435)
