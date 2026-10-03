---
title: "ABC347-F — Non-overlapping Squares"
draft: true
authoringUnit: {"problemId":"abc347-f","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc347-f.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-prefix-aggregate"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-grid-table-dp","tag-prefix-difference"],"sourceRevisionIds":["source-abc347-editorial-9674-b89f6ddb46ab39f5e1366cdd0ad3836f4e803e074f692895f943143278d4db8b","source-abc347-f-problem-e2875573657b924b63f4733c94f662d48472b19786e646e654b93ffcc2389746"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"三つの正方形の各ペアは、行方向または列方向に分離できる。三ペアから分離方向を一つずつ選ぶと、少なくとも二ペアは同じ方向で、共通の正方形がある。その正方形の同じ側に残り二つがあれば、一方と他方二つを切り離せる。反対側にあれば三つの投影区間がその方向に並ぶので、端の一つを切り離せる。従って必ず水平か垂直の線で1対2に分けられる。残る二つも分離すると、平行な二本による横三段・縦三列、または直交する線によるT字の四回転、計6種類で全配置を捕捉する。\n\n各領域へ完全に収まる正方形だけを選ぶため、三つの領域最大の和は常に合法配置で達成できる。任意の最適配置は6種類のいずれかの分割に含まれるので、その分割の領域最大の和は最適値以上である。両方向から答えが一致する。T字は隅方向最大、三段は中央の行・列最大を逐次更新して評価するため、全切断位置をO(N²)で処理できる。","sourceRevisionIds":["source-abc347-editorial-9674-b89f6ddb46ab39f5e1366cdd0ad3836f4e803e074f692895f943143278d4db8b","source-abc347-f-problem-e2875573657b924b63f4733c94f662d48472b19786e646e654b93ffcc2389746"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

三つの正方形の各ペアは、行方向または列方向に分離できる。三ペアから分離方向を一つずつ選ぶと、少なくとも二ペアは同じ方向で、共通の正方形がある。その正方形の同じ側に残り二つがあれば、一方と他方二つを切り離せる。反対側にあれば三つの投影区間がその方向に並ぶので、端の一つを切り離せる。従って必ず水平か垂直の線で1対2に分けられる。残る二つも分離すると、平行な二本による横三段・縦三列、または直交する線によるT字の四回転、計6種類で全配置を捕捉する。

2D累積和から各M×M正方形の和B[r,c]を作る。r,cは元盤面の1-indexの左上座標で、1..N−M+1である。四隅方向の累積最大と、上・下・左・右の全幅領域の最大をO(N²)で前計算する。正方形が一つも収まらない領域は−INFとする。

T字の一方向では元盤面を「行1..aの全幅」「行a+1..N、列1..b」「行a+1..N、列b+1..N」へ分ける。参照する左上座標はそれぞれr≤a−M+1、(r≥a+1,c≤b−M+1)、(r≥a+1,c≥b+1)。全幅最大と二つの隅方向最大を足せば一分割O(1)。他の三方向も回転して同様に求める。

平行三段の中央領域はprefix/suffixではないため、四隅最大だけでは評価できない。rowVal[r]=max_c B[r,c]を作り、上の切断行aを固定して下の切断行b≥a+Mを昇順に動かす。中央へ収まる左上行は[a+1,b−M+1]なので、bを一つ増やすたび新しいrowValを加えて最大値を保つ。上段はr≤a−M+1の全幅最大、下段はr≥b+1の全幅最大を参照する。各aで中央最大を初期化すれば全(a,b)をO(N²)で評価できる。縦三列も列ごとの最大で同様に処理する。

各分割の三領域は交わらず、内部の最大正方形を独立に選べる。6種類の全分割の最大を取ることで、構成可能な最適値を得る。

## 典型の発動条件

### 幾何配置のseparator分類

発動条件: 少数のdisjoint軸平行矩形を、各領域一個になるcut patternへ分けたい。

projection intervalの連結性から水平/垂直separatorを示し、有限個の分割形を列挙する。

### 2D directional maximum前計算

発動条件: 多数のaxis-aligned rectangleについて内部に収まるsquare weight最大が必要で、query形がprefix/suffixに限られる。

top-left weight gridに四方向の累積maxを作り、各分割領域をO(1)評価する。

## 問題固有の要素

squareの非重複判定をpairごとに行う代わりに、三領域が互いにdisjointなpartitionを先に選べば、三つの選択は独立なmaximum queryになる。

別の問題へ持ち帰る視点: packing問題はseparator theoremで有限partitionへ分類できると組合せ依存を消せる。

## 正当性

三つの正方形の各ペアは、行方向または列方向に分離できる。三ペアから分離方向を一つずつ選ぶと、少なくとも二ペアは同じ方向で、共通の正方形がある。その正方形の同じ側に残り二つがあれば、一方と他方二つを切り離せる。反対側にあれば三つの投影区間がその方向に並ぶので、端の一つを切り離せる。従って必ず水平か垂直の線で1対2に分けられる。残る二つも分離すると、平行な二本による横三段・縦三列、または直交する線によるT字の四回転、計6種類で全配置を捕捉する。

各領域へ完全に収まる正方形だけを選ぶため、三つの領域最大の和は常に合法配置で達成できる。任意の最適配置は6種類のいずれかの分割に含まれるので、その分割の領域最大の和は最適値以上である。両方向から答えが一致する。T字は隅方向最大、三段は中央の行・列最大を逐次更新して評価するため、全切断位置をO(N²)で処理できる。

## 実装上の注意

- 領域にM×M squareが収まるcut範囲だけを列挙し、Bのtop-left座標と元grid cell境界を混同しない。weightは最大3M²·10^9なので64bitを使う。

## 復習の核

- 横三段、縦三列、L字型4回転それぞれだけが最適となる小gridを作り、square三重全探索と比較する。

## 計算量と制約

### 時間

O(N²)。正方形和と方向別最大の前計算、四方向のT字切断、二方向の三段切断がいずれもO(N²)。三段の中央最大は各外側切断ごとに伸ばして維持する。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 1000; 1\leq M\leq N/2; 0\leq A _ {i,j}\leq10 ^ 9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/editorial/9674) — source-abc347-editorial-9674-b89f6ddb46ab39f5e1366cdd0ad3836f4e803e074f692895f943143278d4db8b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/tasks/abc347_f) — source-abc347-f-problem-e2875573657b924b63f4733c94f662d48472b19786e646e654b93ffcc2389746
