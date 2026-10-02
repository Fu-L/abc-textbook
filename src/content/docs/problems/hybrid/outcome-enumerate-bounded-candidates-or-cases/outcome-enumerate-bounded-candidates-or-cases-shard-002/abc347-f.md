---
title: "ABC347-F — Non-overlapping Squares"
draft: true
authoringUnit: {"problemId":"abc347-f","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc347-f.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-prefix-aggregate"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-grid-table-dp","tag-prefix-difference"],"sourceRevisionIds":["source-abc347-editorial-9674-b89f6ddb46ab39f5e1366cdd0ad3836f4e803e074f692895f943143278d4db8b","source-abc347-f-problem-e2875573657b924b63f4733c94f662d48472b19786e646e654b93ffcc2389746"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"分離線で三squareを1対2へ分け、2側も分離すると、横三段・縦三列の2形と、一領域に一つ、反対側を直交方向に二分する4回転が得られる。各領域がdisjointなので、その内部で最大和のsquareを独立に選んだ和がその分割の最適値である。 任意の最適三square配置をいずれかの分割が捕捉し、各領域の独立最大値を足してO(N^2)で評価できる。","sourceRevisionIds":["source-abc347-editorial-9674-b89f6ddb46ab39f5e1366cdd0ad3836f4e803e074f692895f943143278d4db8b","source-abc347-f-problem-e2875573657b924b63f4733c94f662d48472b19786e646e654b93ffcc2389746"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

互いに交わらない三つの軸平行同サイズsquareには、少なくとも一つの水平または垂直分離線があり両側にsquareが存在する。二つある側も再度分離できるため、配置は二本の平行cutによる三stripか、直交cutを組み合わせた形の計6種類へ分類できる。

採用する候補: M-square和と各rectangle内最大を前計算し、6分割形を全探索する

任意の最適三square配置をいずれかの分割が捕捉し、各領域の独立最大値を足してO(N^2)で評価できる。

棄却する候補: 三つのtop-left座標を全探索する

候補squareがO(N^2)個あり三重選択はO(N^6)で不可能である。

分離線で三squareを1対2へ分け、2側も分離すると、横三段・縦三列の2形と、一領域に一つ、反対側を直交方向に二分する4回転が得られる。各領域がdisjointなので、その内部で最大和のsquareを独立に選んだ和がその分割の最適値である。

2D prefix sumで各M×M top-leftのweight BをO(1)計算する。B上で上下左右および四隅方向のprefix/suffix maximum tableをO(N^2)前計算する。二本のcut位置、または一square側の境界と反対側の直交cutを列挙し、対応する三rectangle最大を定数時間で足す。6 orientationの最大を出力する。

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

分離線で三squareを1対2へ分け、2側も分離すると、横三段・縦三列の2形と、一領域に一つ、反対側を直交方向に二分する4回転が得られる。各領域がdisjointなので、その内部で最大和のsquareを独立に選んだ和がその分割の最適値である。 任意の最適三square配置をいずれかの分割が捕捉し、各領域の独立最大値を足してO(N^2)で評価できる。

## 実装上の注意

- 領域にM×M squareが収まるcut範囲だけを列挙し、Bのtop-left座標と元grid cell境界を混同しない。weightは最大3M²·10^9なので64bitを使う。

## 復習の核

- 横三段、縦三列、L字型4回転それぞれだけが最適となる小gridを作り、square三重全探索と比較する。

## 計算量と制約

### 時間

O(N²)、三squareを分離するcutを列挙し方向別最大をO(1)参照。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 1000; 1\leq M\leq N/2; 0\leq A _ {i,j}\leq10 ^ 9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/editorial/9674) — source-abc347-editorial-9674-b89f6ddb46ab39f5e1366cdd0ad3836f4e803e074f692895f943143278d4db8b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/tasks/abc347_f) — source-abc347-f-problem-e2875573657b924b63f4733c94f662d48472b19786e646e654b93ffcc2389746
