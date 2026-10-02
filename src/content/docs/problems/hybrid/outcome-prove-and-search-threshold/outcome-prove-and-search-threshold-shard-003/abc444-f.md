---
title: "ABC444-F — Half and Median"
draft: true
authoringUnit: {"problemId":"abc444-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-003/abc444-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-integer-boundary-blocks"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc444-editorial-15602-c21a6434cb06e4723e4eb545714a5a1a3cba6a985682ebb65a7b726a0d862014","source-abc444-f-problem-b4872450af25b28ec6bd11f0e8c1fdd997ae8032197cd69e0bbec08ae84867d7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"必要性を示す。一回の分割によるgoodの増加は高々一なのでg0+M≥k。増加分割・中立分割はgoodを減らさず、それ未満のgoodを分割するとgoodが消える。仮想終状態は最大good本数を与え、そこにある短いk本の長さ和Sはk本を保存する最小の総長となる。したがってgood不足、またはL−S<F−kなら実現不能。\n\n十分性を示す。中立分割の子はその後の増加分割を生まないため、増加分割を全て先に行い、中立分割を後へ回せる。仮想終状態にk本以上のgoodがあるので、初期に不足していればk−g0回の増加分割で初めてk本へ到達する。(1)によりこの到達はM回以内である。以後、増加・中立分割を進めてもgoodはk本以上のままである。\n\n仮想終状態の短いk本を保存し、それ以外の枝を単位長まで分割する。保存した棒を割らないのでgoodはk本以上を保ち、最終本数はk+(L−S)≥Fとなる。この操作列ではk本に達する時点の本数がF以下で、終点の本数がF以上であり、操作ごとに本数が一つ増える。したがって本数Fで止めれば、ちょうどM回で中央値≥Xとなる。\n\n操作回数の条件を落とすと、A=(100,1,1,1,1), M=2, X=20では仮想状態に長さ25のgoodが4本あり、残り総長も足りるのに誤って可と判定する。実際はg0+M=3<k=4で不可である。公式解説の仮想終状態の説明に加え、この到達回数の条件が必要になる。","sourceRevisionIds":["source-abc444-editorial-15602-c21a6434cb06e4723e4eb545714a5a1a3cba6a985682ebb65a7b726a0d862014","source-abc444-f-problem-b4872450af25b28ec6bd11f0e8c1fdd997ae8032197cd69e0bbec08ae84867d7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

最終本数F=N+Mは奇数であり、中央値≥Xにはgoodな棒（長さ≥X）がk=(F+1)/2本必要になる。初期のgood本数をg0とする。一回の分割でgoodは高々一本しか増えないので、まずg0+M≥kが必要である。

長さ2X以上の棒を半分にするとgoodが一本増える（増加分割）。長さ2X−1では子がXとX−1で、goodは増えないが、保存するgoodを短くできる（中立分割）。2X−1は「両子がgood」の境界ではない。長さ2X−1以上を全て分割した仮想終状態を個数付きで求める。X=1では長さ2以上だけを分割する。

判定条件は三つである。(1) g0+M≥k、(2) 仮想終状態のgood本数がk以上、(3) そのgoodを短い順にk本選んだ長さ和SについてL−S≥F−k。ただしL=ΣA_i。この仮想状態まで実際にM回以内で進める必要はなく、保存できる棒と分割の容量を調べるために使う。

元の棒aから深さdで生じる値は⌊a/2^d⌋とその+1だけなので、個数付きで分割をO(log a)段進める。終状態も定数種類の長さに圧縮できる。全棒の終状態を集めsortし、個数を一括で消費してSを求める。Xを1..max Aの整数二分探索で最大化する。

## 典型の発動条件

### 構成可能性の答え二分探索

発動条件: 最適な中央値など閾値を上げるほど実現が難しくなるとき。

X 以上の要素を必要本数作れるかを判定する。

### 巨大反復の個数圧縮

発動条件: 半分割を極端に多く行うが、値の種類が対数個にしかならないとき。

同長の棒をまとめ、分割木の層ごとの個数を処理する。

## 問題固有の要素

中央値条件をgoodの本数へ変換し、分割回数による増加量の上限、最大good本数、残りを正長の棒へ分ける容量を別々に判定する。

別の問題へ持ち帰る視点: 仮想的に操作を最大限進めた状態から構成可能性を判定するときは、目的の状態へ初めて到達するまでの操作回数も確認する。

## 正当性

必要性を示す。一回の分割によるgoodの増加は高々一なのでg0+M≥k。増加分割・中立分割はgoodを減らさず、それ未満のgoodを分割するとgoodが消える。仮想終状態は最大good本数を与え、そこにある短いk本の長さ和Sはk本を保存する最小の総長となる。したがってgood不足、またはL−S<F−kなら実現不能。

十分性を示す。中立分割の子はその後の増加分割を生まないため、増加分割を全て先に行い、中立分割を後へ回せる。仮想終状態にk本以上のgoodがあるので、初期に不足していればk−g0回の増加分割で初めてk本へ到達する。(1)によりこの到達はM回以内である。以後、増加・中立分割を進めてもgoodはk本以上のままである。

仮想終状態の短いk本を保存し、それ以外の枝を単位長まで分割する。保存した棒を割らないのでgoodはk本以上を保ち、最終本数はk+(L−S)≥Fとなる。この操作列ではk本に達する時点の本数がF以下で、終点の本数がF以上であり、操作ごとに本数が一つ増える。したがって本数Fで止めれば、ちょうどM回で中央値≥Xとなる。

操作回数の条件を落とすと、A=(100,1,1,1,1), M=2, X=20では仮想状態に長さ25のgoodが4本あり、残り総長も足りるのに誤って可と判定する。実際はg0+M=3<k=4で不可である。公式解説の仮想終状態の説明に加え、この到達回数の条件が必要になる。

## 実装上の注意

- 長さ2X−1の分割ではgoodは一つだけ。両片がX以上になるのは2X以上である。
- X=1のとき長さ1を分割しない。長さ・個数・総和は64bit内の制約でも、積を取るときの型を確認する。
- sortするのは終状態の長さと個数。棒を個数分展開しない。

## 復習の核

最大限操作した状態の容量だけでなく、その状態の必要部分へ到達するまでの操作回数も制約に照らす。

## 計算量と制約

### 時間

O(N(log Amax)²+N log N log Amax)。各判定で各棒の個数圧縮O(log Amax)、終状態O(N)種類のsortO(N log N)、二分探索O(log Amax)回。

### 空間

O(N+log Amax)。各棒の圧縮計算を終えてから終状態だけを蓄積する。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; 1 \leq N \leq 10^5; 1 \leq A_i \leq 10^9; 1 \leq M \leq \sum_{i=1}^{N}{A_i} - N; N+M is odd.; The sum of N over all test cases is at most 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc444/editorial/15602) — source-abc444-editorial-15602-c21a6434cb06e4723e4eb545714a5a1a3cba6a985682ebb65a7b726a0d862014
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc444/tasks/abc444_f) — source-abc444-f-problem-b4872450af25b28ec6bd11f0e8c1fdd997ae8032197cd69e0bbec08ae84867d7
