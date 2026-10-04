---
title: "ABC443-G — Another Mod of Linear Problem"
draft: true
authoringUnit: {"problemId":"abc443-g","docPath":"src/content/docs/problems/mathematics/outcome-sum-affine-floors-by-euclid/outcome-sum-affine-floors-by-euclid-shard-001/abc443-g.md","learningOutcomeIds":["outcome-sum-affine-floors-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euclidean-floor-sum"],"sourceRevisionIds":["source-abc443-editorial-15138-3aa9463ceddd2142f504b5b736ccfc887e550c9c69317c0bbca14a01bd6ecfad","source-abc443-g-problem-57b82a295ac386c53ab1317886a8f4ffc40c4bc853f1f6c66fb8dba9f12f4a16"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"r=(Ak+B) modMとすると二floorの差はfloor((Ak+B)/M)−floor((Ak+B−k−1)/M)。k+1≤Mよりこの差は0/1で、r≥k+1なら0、それ以外なら1になる。従ってNから全差を引けばstrict条件k<rの成立数。符号付き正規化は数学的floor値を保つのでA=0やB=0も同式で扱える。","sourceRevisionIds":["source-abc443-editorial-15138-3aa9463ceddd2142f504b5b736ccfc887e550c9c69317c0bbca14a01bd6ecfad","source-abc443-g-problem-57b82a295ac386c53ab1317886a8f4ffc40c4bc853f1f6c66fb8dba9f12f4a16"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [格子点転置によるfloor_sum](src/content/docs/learn/number-theory/euclidean-floor-sum.md)

- Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。

## 考察

条件 k<(Ak+B) mod M は、二つの床関数 floor((Ak+B)/M) と floor(((A-1)k+B-1)/M) の差が0であることへ変形できる。

採用する候補: 条件を満たす個数を N から二つの floor_sum の差の総和を引く形で計算する。

各 k で二つの床の差は0か1に限られ、差1が不成立を示すため、標準 floor_sum を二回呼ぶだけで全範囲を数えられる。

棄却する候補: k=0..N-1 を一つずつ走査し、剰余を計算して比較する。

N は最大10^9で、各 k の判定が定数時間でもtest caseごとの線形走査は不可能である。

整数 k+1≤r を床関数へ移すと、k<(Ak+B) mod M の wrap 回数の差として不成立を表せる。

係数を A から A-1、定数を B から B-1 へずらした二式の差は区間幅が k+1≤M のため0または1に収まる。

S1=Σ_{k=0}^{N-1}floor((Ak+B)/M)、S2=Σfloor(((A-1)k+B-1)/M) を floor_sum の符号・係数正規化込みで求め、N-(S1-S2) を返す。

## 典型の発動条件

### 条件指示関数の floor 差分化

発動条件: 線形剰余と添字の大小を巨大区間で数えたいとき。

wrap 回数を表す二つの床関数の差へ変換する。

### floor_sum

発動条件: 一次式を modulus で割った床の連続和が現れるとき。

各 test case を対数時間で集計する。

## 問題固有の要素

剰余不等式は剰余値を直接追わず、除算で何回 modulus をまたいだかの差として数えられる。

別の問題へ持ち帰る視点: 0/1 しか取らない床関数差を見つけると、それ自体が条件の指示関数になる。

## 正当性

r=(Ak+B) modMとすると二floorの差はfloor((Ak+B)/M)−floor((Ak+B−k−1)/M)。k+1≤Mよりこの差は0/1で、r≥k+1なら0、それ以外なら1になる。従ってNから全差を引けばstrict条件k<rの成立数。符号付き正規化は数学的floor値を保つのでA=0やB=0も同式で扱える。

## 実装上の注意

- A-1 や B-1 が負になる入力を floor_sum 実装の受理範囲へ正規化し、数学的 floor と切捨て除算を混同しない。

## 復習の核

- 一つの k について式変形を逆向きにたどり、床差が0なら成立・1なら不成立となることを境界 k=r でも確認する。

## 計算量と制約

### 時間

各case O(log M)。符号付きfloor_sumを二回行う。

### 空間

O(1)、再帰ならO(log M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 3\times 10^5; 1\le N \le M\le 10^9; 0\le A,B < M; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/editorial/15138) — source-abc443-editorial-15138-3aa9463ceddd2142f504b5b736ccfc887e550c9c69317c0bbca14a01bd6ecfad
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/tasks/abc443_g) — source-abc443-g-problem-57b82a295ac386c53ab1317886a8f4ffc40c4bc853f1f6c66fb8dba9f12f4a16
