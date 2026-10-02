---
title: "ABC313-G — Redistribution of Piles"
draft: true
authoringUnit: {"problemId":"abc313-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc313-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-euclidean-floor-sum"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-euclidean-floor-sum"],"sourceRevisionIds":["source-abc313-editorial-6896-281370d7d5359959d272cc05c68b3bb1fad37f5755e913964f4e498c2f615c86","source-abc313-g-problem-e9a3b224b799f49226e9c1f76dee5dbf07703407a7352ad343585b355644a5d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"打ち消し合う隣接操作を除けば全Aが全Bより前になる。正規形では少なくとも一つの皿が空になるまではBを禁止する。空の皿がある場合、最終数列の最小値がyであり、max a>xなら最大値がmax a−x+yになるためx,yを一意に復元できる。全皿が空のx=max aでもyが結果を決め、それ以前の正規形とは一致しない。よって列挙した正規形と結果の数列が一対一になる。袋の非負条件がNy≤s(x)と等価であり、各一次区間の床和で全候補を漏れなく数える。","sourceRevisionIds":["source-abc313-editorial-6896-281370d7d5359959d272cc05c68b3bb1fad37f5755e913964f4e498c2f615c86","source-abc313-g-problem-e9a3b224b799f49226e9c1f76dee5dbf07703407a7352ad343585b355644a5d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [格子点転置によるfloor_sum](src/content/docs/learn/number-theory/euclidean-floor-sum.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

皿から袋へ1個ずつ取る操作をA、袋から全皿へ1個ずつ戻す操作をBとする。Bの直後は全皿が非空なので、直後のAと打ち消し合う。さらに全皿を空にした直後のBも、直前のAを取り消す。この無意味な往復を除くと、操作列はAをx回、その後Bをy回という正規形になる。

Aをx回行った時、皿iはmax(a_i−x,0)、袋はs(x)=Σmin(a_i,x)。x≤min aではy=0だけを残す。min a<x≤max aでは0≤y≤⌊s(x)/N⌋なので、結果は⌊s(x)/N⌋+1種類である。x>max aは全皿が既に空で結果が増えない。

aをa_1≤…≤a_NへsortしP_i=Σ_{j≤i}a_jとする。初期のx=0..a_1はa_1+1種類。残るxは重複のない区間a_i<x≤a_{i+1}（i=1..N−1）へ分ける。この区間ではs(x)=P_i+(N−i)xであり、D=a_{i+1}−a_iと置けば寄与は

D+floor_sum(D,N,N−i,P_i+(N−i)(a_i+1))

となる。ここでfloor_sum(n,m,a,b)=Σ_{t=0}^{n−1}⌊(at+b)/m⌋。D=0の区間は飛ばす。最小値以前を一般のy範囲で数えると、AとBの往復で同じ数列を重複するので、初期区間だけを分ける。

## 典型の発動条件

### 操作列の相殺による正規形

発動条件: 可逆・相殺する隣接操作があり、結果状態の重複を数えたいとき。

無意味な隣接対を禁止し、各到達状態と一対一になる標準操作列を作る。

### 区分線形和と floor_sum

発動条件: Σmin(a_i,x) などが break point 間で一次式となり、その整数除算の総和が必要なとき。

値を sort して係数一定区間へ分け、Σfloor((ax+b)/m) を Euclid 型算法で取る。

## 問題固有の要素

状態を直接特徴付ける前に操作列の冗長な相殺を消すと、二整数 (x,y) が到達列を一意に表す。

別の問題へ持ち帰る視点: 到達状態数では同じ結果を生む操作列が障害になるので、まず canonical sequence の存在を探す。

## 正当性

打ち消し合う隣接操作を除けば全Aが全Bより前になる。正規形では少なくとも一つの皿が空になるまではBを禁止する。空の皿がある場合、最終数列の最小値がyであり、max a>xなら最大値がmax a−x+yになるためx,yを一意に復元できる。全皿が空のx=max aでもyが結果を決め、それ以前の正規形とは一致しない。よって列挙した正規形と結果の数列が一対一になる。袋の非負条件がNy≤s(x)と等価であり、各一次区間の床和で全候補を漏れなく数える。

## 実装上の注意

- 区間はa_i<x≤a_{i+1}。floor_sumへ渡す第一項はx=a_i+1であり、a_iから始めない。
- P_iとs(x)は64bit、答えだけを998244353で扱う。床和を法上の除算で計算しない。

## 復習の核

- 二操作の直後関係を実際に相殺して、正規形と状態の一対一を先に確かめる。floor_sum は式の区間端と傾きを紙上で固定してから実装する。

## 計算量と制約

### 時間

O(N log N+N log Amax)、sortと各一次区間のfloor_sum。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq a_i \leq 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/editorial/6896) — source-abc313-editorial-6896-281370d7d5359959d272cc05c68b3bb1fad37f5755e913964f4e498c2f615c86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/tasks/abc313_g) — source-abc313-g-problem-e9a3b224b799f49226e9c1f76dee5dbf07703407a7352ad343585b355644a5d2
