---
title: "ABC282-G — Similar Permutation"
draft: true
authoringUnit: {"problemId":"abc282-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc282-g.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-prefix-aggregate"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-dp-state-equivalence","tag-prefix-difference"],"sourceRevisionIds":["source-abc282-editorial-5393-c24383a9e3f327d508de882b4e496c8a01d6dc4abc2638636b91f999b91acfa3","source-abc282-g-problem-ec3be7878e90f5627c96f1edd4f6084095dc51431de0e9c63d5a80381c5032b0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"相異なる残値から次の値を選ぶ時、現在値より小さい/大きいという条件は残値rankの連続区間になる。A,Bの両方のrankを状態にすれば、次の増減方向の組合せは四つの長方形領域へ分かれる。similarityを一つ増やすのは両方向が一致する二領域だけである。2D累積和による各長方形の和は、次の値の全選択を個別に足した値と等しい。相対rankを選ぶ列と元のpermutationが一対一なので、長さとsimilarity数のDPは各permutation pairを正しく数える。","sourceRevisionIds":["source-abc282-editorial-5393-c24383a9e3f327d508de882b4e496c8a01d6dc4abc2638636b91f999b91acfa3","source-abc282-g-problem-ec3be7878e90f5627c96f1edd4f6084095dc51431de0e9c63d5a80381c5032b0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

permutationを左から作ると、次の大小方向は現在値より大きい未使用値を選ぶか小さい未使用値を選ぶかだけで決まる。

具体的な未使用集合ではなく、現在A_iより大きい残数kと現在B_iより大きい残数lを持てば、次のrank選択後の状態範囲が連続区間になる。

採用する候補: 長さi、similarity j、A/Bそれぞれのgreater-remaining数k,lの挿入DPを行い、遷移元の4 rectangle和を2D累積和で求める。

next rankの全組を個別に試さず、同方向/逆方向の条件を長方形領域へまとめられる。

棄却する候補: 二つのpermutationを全列挙して隣接増減方向を比較する。

候補が(N!)²でN≤100でも不可能である。

次Aが増加なら新kは0…k-1、減少ならk…remaining-1のどれかに一対一対応し、B側も同様である。

similarityが増えるのはA,Bがともに増加またはともに減少する2 rectangle、増えないのは方向が異なる2 rectangleである。

固定(i,j)のk,l平面に2D prefix sumを作れば、各次状態へのrectangle総和を定数個のcorner差で取れる。

i=1では各初期値pairに対応してdp[1][0][k][l]=1とする。各i,j layerの2D累積和から同方向rectangleをj+1、逆方向rectangleをjへ遷移させる。i=Nでk=l=0かつj=Kの値をP moduloで出力する。

## 典型の発動条件

### rank-based permutation DP

発動条件: permutationを順に構成し、比較が現在値に対する未使用値のrankだけで決まるとき。

greater remaining数を状態にし、次rankを区間として表す。

### DP遷移の2D rectangle sum

発動条件: 遷移元/先が二つの独立rank条件の直積区間になるとき。

各layerに二次元累積和を作りrectangle寄与をO(1)取得する。

## 問題固有の要素

二つの隣接差の積が正という条件は、増増・減減の二rectangleだけでsimilarityを1増やす。

別の問題へ持ち帰る視点: 複数permutationの比較方向一致は、各rank軸のup/down半区間の直積として扱う。

## 正当性

相異なる残値から次の値を選ぶ時、現在値より小さい/大きいという条件は残値rankの連続区間になる。A,Bの両方のrankを状態にすれば、次の増減方向の組合せは四つの長方形領域へ分かれる。similarityを一つ増やすのは両方向が一致する二領域だけである。2D累積和による各長方形の和は、次の値の全選択を個別に足した値と等しい。相対rankを選ぶ列と元のpermutationが一対一なので、長さとsimilarity数のDPは各permutation pairを正しく数える。

## 実装上の注意

- iからi+1でremaining上限が1減るため、k,lのvalid rangeとrectangle端をlayerごとに合わせる。
- 法Pは大きいprimeだが遷移は加減だけで、prefix差の負値をPで正規化する。

## 復習の核

- remaining値を小さい順に並べ、現在値より上を選ぶと新greater数が0…k-1を各1回取ることを小Nで確認する。

## 計算量と制約

### 時間

O(N⁴)、length・similarity数・二残rankの状態を2D prefixで一括遷移。

### 空間

O(N³)、length方向rolling。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 100; 0\leq K \leq N-1; 10^8 \leq P \leq 10^9; P is a prime number.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/editorial/5393) — source-abc282-editorial-5393-c24383a9e3f327d508de882b4e496c8a01d6dc4abc2638636b91f999b91acfa3
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/tasks/abc282_g) — source-abc282-g-problem-ec3be7878e90f5627c96f1edd4f6084095dc51431de0e9c63d5a80381c5032b0
