---
title: "ABC410-F — Balanced Rectangles"
draft: true
authoringUnit: {"problemId":"abc410-f","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc410-f.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc410-editorial-13301-016146bb9813164cf858661316da166afe0eac8834cd42513889d4ff5b36eb3b","source-abc410-f-problem-910d3d1f479c4c06e362230fb26749534039b0116e67c45c39f9305153e904fc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"上端uを固定して下端dを一段ずつ広げれば、各列の#−.の和C_jは新しい一行を足すだけで更新でき、Cを毎回高さ分走査する必要がない。 列区間[l,r]の和が0であることは、その直前と直後のprefix sumが等しいことと同値である。値域が狭いのでhashやsortではなくoffset付き配列で出現回数を即時参照できる。 各上下端に対して列を一度走査するO(H²W)となり、H≤√(HW)とΣHW≤3×10^5を使えば約√(3×10^5)·3×10^5規模に抑えられる。","sourceRevisionIds":["source-abc410-editorial-13301-016146bb9813164cf858661316da166afe0eac8834cd42513889d4ff5b36eb3b","source-abc410-f-problem-910d3d1f479c4c06e362230fb26749534039b0116e67c45c39f9305153e904fc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

この解説で扱わないこと:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

#を+1、.を-1と置けば、長方形がbalancedである条件は領域和が0であることと同値になる。転置してH≤WとするとH≤√(HW)なので、上下端O(H²)通りと横一走査O(W)を組み合わせる余地がある。

採用する候補: 短辺側の上下端を固定し、列和配列の零和連続区間を密なprefix頻度配列で数える

棄却する候補: 四辺をすべて列挙し、二次元累積和で各長方形を判定する

判定をO(1)にしても長方形がΘ(H²W²)個あり、細長くない盤面で間に合わない。

棄却する候補: 上下端ごとにprefix sumをmapまたはsortで数える

一般的な零和区間の解法だがO(H²W log W)となる。prefix値域が[-HW,HW]に限られる本問ではlog因子を除く必要がある。

必要なら盤面を転置してH≤Wにする。各uについて列和Cを0初期化し、d=u..Hで新しい行の±1をCへ加える。Cのprefix sumを左から計算し、同じ値の過去出現回数を答えへ足してから頻度を増やし、全(u,d)の寄与を合計する。

## 典型の発動条件

### 短辺の二乗全探索

発動条件: 二次元領域で面積制約があり、片方の二辺を固定すると残りを線形走査できる。

転置でH≤Wを保証し、上下端O(H²)と列走査O(W)に分解する。

### prefix sumの同値対による零和区間計数

発動条件: 一次元列の総和0となる連続区間数を求めたい。

同じprefix値の既出回数を加算し、値域が狭いことを利用して密配列でO(W)計数する。

## 問題固有の要素

ΣHW制約だけを見ると三重ループを避けたくなるが、短辺は各testの√(HW)以下なので、向きを揃えたO(H²W)は全test合計でも成立する。

別の問題へ持ち帰る視点: 積で与えられた入力制約では、短い次元を二乗する前にmin次元≤√(積)を代入し、全testの面積和まで含めて真の上界を評価する。

## 正当性

上端uを固定して下端dを一段ずつ広げれば、各列の#−.の和C_jは新しい一行を足すだけで更新でき、Cを毎回高さ分走査する必要がない。 列区間[l,r]の和が0であることは、その直前と直後のprefix sumが等しいことと同値である。値域が狭いのでhashやsortではなくoffset付き配列で出現回数を即時参照できる。 各上下端に対して列を一度走査するO(H²W)となり、H≤√(HW)とΣHW≤3×10^5を使えば約√(3×10^5)·3×10^5規模に抑えられる。

## 実装上の注意

- 転置後のH,Wで値域offsetを確保し、prefix=0を走査前に1回登録する。頻度配列を上下端ごとに全消去すると余分な計算量になるため、触れたindexだけ戻すかtimestampを使う。答えは64 bitで持つ。

## 復習の核

- 小盤面の全長方形列挙と照合し、1×W、全て同じ記号、奇数面積、転置が発生する入力、同じprefix値が3回以上現れる場合、複数testで頻度状態が残らないことを確認する。

## 計算量と制約

### 時間

O(min(H,W)²max(H,W))、複数caseはcaseごとの和。

### 空間

O(HW)、盤面と列和、prefix頻度の値域もO(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 25000; 1 \le H,W; The sum of H \times W over all test cases in one input does not exceed 3 \times 10^5.; S_i is a string of length W consisting of # and ..

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc410/editorial/13301) — source-abc410-editorial-13301-016146bb9813164cf858661316da166afe0eac8834cd42513889d4ff5b36eb3b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc410/tasks/abc410_f) — source-abc410-f-problem-910d3d1f479c4c06e362230fb26749534039b0116e67c45c39f9305153e904fc
