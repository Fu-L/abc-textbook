---
title: "ABC290-E — Make it Palindrome"
draft: true
authoringUnit: {"problemId":"abc290-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc290-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-two-pointers-window"],"sourceRevisionIds":["source-abc290-e-problem-f2993e9faf757adb074a9a50baa3693197face16191fcc322009939465586f81","source-abc290-editorial-5757-6c632f8df14a8932c76a1074ca29937312e8c82e561eb79d6c41d5bdd3bf6239"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一つの区間内では対称位置の各不一致pairを一変更で直せ、互いに独立なので最小変更数は不一致pair数。位置l<rが対称となる区間[l−u,r+u]はmin(l,N+1−r)個である。全対称pair総数から同値pairのこの寄与を引けばよい。二点法の左端条件では相手全てのminがP_L、右端条件では相手全てのminがN+1−P_Rになり、確定した端のpairを重複なく除ける。各同値位置列の全pairを一度集計するので、Tから引いた値が全区間の最小変更数総和となる。","sourceRevisionIds":["source-abc290-e-problem-f2993e9faf757adb074a9a50baa3693197face16191fcc322009939465586f81","source-abc290-editorial-5757-6c632f8df14a8932c76a1074ca29937312e8c82e561eb79d6c41d5bdd3bf6239"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md) — 窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

各区間を回文にする最小変更回数は対称位置の不一致数で、中央の一文字は費用0。まず全区間の対称pair総数T=Σ_{len=1}^N (N−len+1)floor(len/2)をO(N)で求め、同値の対称pairの寄与を引く。

元配列の位置l<rを固定すると、それらが対称となる区間は[l−u,r+u]で0≤u≤min(l−1,N−r)。従って寄与はmin(l,N+1−r)個である。同じ値の出現位置列P_0<…<P_{k−1}について、Σ_{i<j}min(P_i,N+1−P_j)を求めればよい。

単なる全pair列挙は同値が多いとO(N²)になるので、各位置列の両端L=0,R=k−1、寄与G=0から次を繰り返す。

```text
while L<R:
  if P_L≤N+1−P_R:
    G += P_L·(R−L)
    L += 1
  else:
    G += (N+1−P_R)·(R−L)
    R -= 1
```

前者では全j∈[L+1,R]にN+1−P_j≥N+1−P_R≥P_Lなので、左端との全pairのminはP_L。後者では全i∈[L,R−1]にP_i≥P_L>N+1−P_Rなので、右端との全pairのminはN+1−P_Rである。確定した端だけを除くため各pairを一度ずつ数え、全位置列の総反復はO(N)。最後にT−ΣGを出力する。

N=3で全て同じ値ならT=3。P=(1,2,3)の左端から2、残る右端から1を引き、答え0となる。全て異なる値ならG=0で、対称pair総数Tがそのまま変更数総和になる。

## 典型の発動条件

### 主客転倒

発動条件: 全区間上の局所寄与の総和を求めたい。

位置対を固定し、それが対称になる区間数min(l,N+1-r)を足す。

### 単調二点法

発動条件: 二変数のminの大小境界が両端の移動に対して単調である。

同値位置列の左端寄与と右端寄与をまとめて確定する。

## 問題固有の要素

回文化費用を変更操作で考えず、対称位置の不一致数へ直すことで、全対−同値対という補集合計数が現れる。

別の問題へ持ち帰る視点: 全区間の対称・距離寄与は位置対を固定して包含区間数を数える。

## 正当性

一つの区間内では対称位置の各不一致pairを一変更で直せ、互いに独立なので最小変更数は不一致pair数。位置l<rが対称となる区間[l−u,r+u]はmin(l,N+1−r)個である。全対称pair総数から同値pairのこの寄与を引けばよい。二点法の左端条件では相手全てのminがP_L、右端条件では相手全てのminがN+1−P_Rになり、確定した端のpairを重複なく除ける。各同値位置列の全pairを一度集計するので、Tから引いた値が全区間の最小変更数総和となる。

## 実装上の注意

- 線の総数の式と良い対の端点は1-indexで統一し、合計は64ビットで持つ。

## 復習の核

- 小さい配列の全区間全比較と照合し、同値が全くない列・全て同値・中央要素を含む奇数長区間を確認する。

## 計算量と制約

### 時間

O(N)、同値位置群のtwo pointers総走査N。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le N \le 2 \times 10^5; 1 \le A_i \le N

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_e) — source-abc290-e-problem-f2993e9faf757adb074a9a50baa3693197face16191fcc322009939465586f81
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5757) — source-abc290-editorial-5757-6c632f8df14a8932c76a1074ca29937312e8c82e561eb79d6c41d5bdd3bf6239
