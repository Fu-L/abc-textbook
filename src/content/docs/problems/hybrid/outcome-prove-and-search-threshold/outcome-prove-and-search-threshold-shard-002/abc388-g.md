---
title: "ABC388-G — Simultaneous Kagamimochi 2"
draft: true
authoringUnit: {"problemId":"abc388-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc388-g.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation","unit-two-pointers-window"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-range-monoid-aggregation","tag-two-pointers-window"],"sourceRevisionIds":["source-abc388-editorial-11904-7ccfe74bfe4066bc92549a5277c1692040a5968156bc780985124dadabf91565","source-abc388-g-problem-551509d02faa601c939450cc44f0a174c48a0f76f0d2f2f622c6d2fdd1f79757"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"以下は1-indexで書く。B_iをA_j≥2A_iとなる最小j、存在しなければN+1とする。Aが正の昇順なのでB_i>iかつB_iは非減少で、two-pointerでO(N)前計算できる。D_i=B_i−iを保存する。\n\n区間[L,R]でK組作れるなら、上段と下段をそれぞれ昇順にして対応させても条件を満たす。対応が交差していれば、大小順に交換しても小さい下段は小さい上段を、大きい下段は大きい上段を支えられるからである。昇順のi番目の上段をL+i−1番目の餅へ、i番目の下段をR−K+i番目の餅へ置き換える（1≤i≤K）。上段は小さく、下段は大きくなるので条件は保たれ、2K≤R−L+1だから両集合も重ならない。従って上段をi=L,…,L+K−1に固定してよい。下段は上段全体より後ろから、b_i=max(B_i,b_{i−1}+1,L+K)と最小可能位置を貪欲に割り当てればよい。この最終位置は、下段開始の制約からL+2K−1、各iの要求とその後の個数からB_i+(L+K−1−i)の最大、すなわち\n\nL+K−1+max(K,max_{i∈[L,L+K)}D_i)\n\nになる。各項はどの配置にも必要な下界で、上の貪欲が同時に達成する。従ってこの値がR以下であることが必要十分である。\n\nセグメント木の要約を(k,d)=(区間長,Dの最大)、合成を(k_1+k_2,max(d_1,d_2))、単位元を(0,0)とする。照会(L,R)ごとにf(k,d)=[L+k−1+max(k,d)≤R]を判定述語にする。空要約では必ずtrue、右へ伸ばすとkもdも減らないのでtrueからfalseへの単調性がある。0-indexのmax_right APIではmax_right(L−1,f)−(L−1)が答えKになる。探索自身が区間長を要約するため、Kの外側二分探索や繰り返しrange-max照会を行わず一回O(log N)で求められる。","sourceRevisionIds":["source-abc388-editorial-11904-7ccfe74bfe4066bc92549a5277c1692040a5968156bc780985124dadabf91565","source-abc388-g-problem-551509d02faa601c939450cc44f0a174c48a0f76f0d2f2f622c6d2fdd1f79757"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md) — 窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

この解説で扱わないこと:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

以下は1-indexで書く。B_iをA_j≥2A_iとなる最小j、存在しなければN+1とする。Aが正の昇順なのでB_i>iかつB_iは非減少で、two-pointerでO(N)前計算できる。D_i=B_i−iを保存する。

区間[L,R]でK組作れるなら、上段と下段をそれぞれ昇順にして対応させても条件を満たす。対応が交差していれば、大小順に交換しても小さい下段は小さい上段を、大きい下段は大きい上段を支えられるからである。昇順のi番目の上段をL+i−1番目の餅へ、i番目の下段をR−K+i番目の餅へ置き換える（1≤i≤K）。上段は小さく、下段は大きくなるので条件は保たれ、2K≤R−L+1だから両集合も重ならない。従って上段をi=L,…,L+K−1に固定してよい。下段は上段全体より後ろから、b_i=max(B_i,b_{i−1}+1,L+K)と最小可能位置を貪欲に割り当てればよい。この最終位置は、下段開始の制約からL+2K−1、各iの要求とその後の個数からB_i+(L+K−1−i)の最大、すなわち

L+K−1+max(K,max_{i∈[L,L+K)}D_i)

になる。各項はどの配置にも必要な下界で、上の貪欲が同時に達成する。従ってこの値がR以下であることが必要十分である。

セグメント木の要約を(k,d)=(区間長,Dの最大)、合成を(k_1+k_2,max(d_1,d_2))、単位元を(0,0)とする。照会(L,R)ごとにf(k,d)=[L+k−1+max(k,d)≤R]を判定述語にする。空要約では必ずtrue、右へ伸ばすとkもdも減らないのでtrueからfalseへの単調性がある。0-indexのmax_right APIではmax_right(L−1,f)−(L−1)が答えKになる。探索自身が区間長を要約するため、Kの外側二分探索や繰り返しrange-max照会を行わず一回O(log N)で求められる。

## 典型の発動条件

### 必要位置のoffset化

発動条件: 各itemの最小partner indexが単調列から求まるとき。

B_i-iを持ち、連続block全体の必要余白をrange maxにする。

### segment tree上の二分探索

発動条件: prefixを伸ばした集約値に単調な可否条件があるとき。

max_rightで最大Kを対数時間に特定する。

## 問題固有の要素

query内のpairingを毎回作らず、上段各位置が要求する下段offsetの最大値一つへ縮約する。

別の問題へ持ち帰る視点: 連続区間から同数pairを作るqueryでは、各要素の最小partnerを前計算し、区間のworst offsetを集約する。

## 正当性

以下は1-indexで書く。B_iをA_j≥2A_iとなる最小j、存在しなければN+1とする。Aが正の昇順なのでB_i>iかつB_iは非減少で、two-pointerでO(N)前計算できる。D_i=B_i−iを保存する。

区間[L,R]でK組作れるなら、上段と下段をそれぞれ昇順にして対応させても条件を満たす。対応が交差していれば、大小順に交換しても小さい下段は小さい上段を、大きい下段は大きい上段を支えられるからである。昇順のi番目の上段をL+i−1番目の餅へ、i番目の下段をR−K+i番目の餅へ置き換える（1≤i≤K）。上段は小さく、下段は大きくなるので条件は保たれ、2K≤R−L+1だから両集合も重ならない。従って上段をi=L,…,L+K−1に固定してよい。下段は上段全体より後ろから、b_i=max(B_i,b_{i−1}+1,L+K)と最小可能位置を貪欲に割り当てればよい。この最終位置は、下段開始の制約からL+2K−1、各iの要求とその後の個数からB_i+(L+K−1−i)の最大、すなわち

L+K−1+max(K,max_{i∈[L,L+K)}D_i)

になる。各項はどの配置にも必要な下界で、上の貪欲が同時に達成する。従ってこの値がR以下であることが必要十分である。

セグメント木の要約を(k,d)=(区間長,Dの最大)、合成を(k_1+k_2,max(d_1,d_2))、単位元を(0,0)とする。照会(L,R)ごとにf(k,d)=[L+k−1+max(k,d)≤R]を判定述語にする。空要約では必ずtrue、右へ伸ばすとkもdも減らないのでtrueからfalseへの単調性がある。0-indexのmax_right APIではmax_right(L−1,f)−(L−1)が答えKになる。探索自身が区間長を要約するため、Kの外側二分探索や繰り返しrange-max照会を行わず一回O(log N)で求められる。

## 実装上の注意

- B_iが存在しない場合はN+1とし、D_i=B_i−iを作る。
- 本文のL,Rは1-index、max_rightの開始位置・返却位置は0-indexである。空要約の述語がtrueになることと、答えが区間長の半分以下になることを確認する。

## 復習の核

- 小区間を全matching列挙し、B_iが範囲外、Kが区間長/2、等号境界のqueryで可否式とsegment-tree searchを比較する。

## 計算量と制約

### 時間

O(N+Q log N)。two-pointerと木の構築がO(N)、一照会は単調述語によるmax_right一回でO(log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9 \ (1 \leq i \leq N); A_i \leq A_{i+1} \ (1 \leq i < N); 1 \leq Q \leq 2 \times 10^5; 1 \leq L_i < R_i \leq N \ (1 \leq i \leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/editorial/11904) — source-abc388-editorial-11904-7ccfe74bfe4066bc92549a5277c1692040a5968156bc780985124dadabf91565
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/tasks/abc388_g) — source-abc388-g-problem-551509d02faa601c939450cc44f0a174c48a0f76f0d2f2f622c6d2fdd1f79757
