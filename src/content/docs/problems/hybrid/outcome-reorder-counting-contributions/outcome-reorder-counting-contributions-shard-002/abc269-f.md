---
title: "ABC269-F — Numbered Checker"
draft: true
authoringUnit: {"problemId":"abc269-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc269-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc269-editorial-4846-ca50d700b0e54577aa1a9ec3da3743af33cf5d02afd035d1be6729315c6ee811","source-abc269-f-problem-2f910c36bdeb03d58b53f7268e5dd5a44bf7c0d463a544ab9903e17b615ab67a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"row parityが決まれば残るcolumn parityも決まり、[C,D]内の個数・最初の列・最後の列から一行分の和を求められる。 同parityの隣接行はrow indexが2増えるので、各selected cellの値は2M増え、一行和の公差は2M×selected-column-countとなる。 各queryをparity二ケースの定数回の四則演算だけで評価できる。","sourceRevisionIds":["source-abc269-editorial-4846-ca50d700b0e54577aa1a9ec3da3743af33cf5d02afd035d1be6729315c6ee811","source-abc269-f-problem-2f910c36bdeb03d58b53f7268e5dd5a44bf7c0d463a544ab9903e17b615ab67a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

rectangle内の各行ではi+jが偶数の列だけが残り、その値 (i−1)M+j は公差2のarithmetic progressionを成す。

同じparityの行を2行おきに見ると、選ばれる列数は一定で、各行の和も一定公差のarithmetic progressionになる。

棄却する候補: 各query rectangleのcellを列挙して、checkerboard上の非零値を加える。

N,Mが10^9でrectangle areaに依存する処理はできない。

採用する候補: rectangleをrow parity別に分け、各parityで列方向と行方向の二段のarithmetic-progression sumを閉形式で求める。

各queryをparity二ケースの定数回の四則演算だけで評価できる。

row parityが決まれば残るcolumn parityも決まり、[C,D]内の個数・最初の列・最後の列から一行分の和を求められる。

同parityの隣接行はrow indexが2増えるので、各selected cellの値は2M増え、一行和の公差は2M×selected-column-countとなる。

checkerboard filterを二つのparity classへ分割し、nested arithmetic progression sumsで巨大rectangle queryをO(1)評価する。

## 典型の発動条件

### parity別の分解

発動条件: 格子点の採否や式が座標和の偶奇だけで切り替わるとき。

odd rowsとeven rowsを別々に扱い、それぞれ対応するcolumn parityだけを数える。

### 等差数列の閉形式

発動条件: 巨大な連続範囲で値またはblock sumが一定差ずつ変化するとき。

まず一行内の公差2の列を合計し、次に2行おきのrow sumsをもう一度合計する。

## 問題固有の要素

rectangleの先頭二行についてrow sumを作れば、それ以降は同じparityごとに公差2Mxで増える。

別の問題へ持ち帰る視点: 二次元のaffine gridに周期maskが掛かるとき、residue classごとに一次元の等差列を入れ子にする。

## 正当性

row parityが決まれば残るcolumn parityも決まり、[C,D]内の個数・最初の列・最後の列から一行分の和を求められる。 同parityの隣接行はrow indexが2増えるので、各selected cellの値は2M増え、一行和の公差は2M×selected-column-countとなる。 各queryをparity二ケースの定数回の四則演算だけで評価できる。

## 実装上の注意

- [C,D]内で必要parityを持つ最初の列と個数をfloor/ceilの規約を固定して求め、個数0も同じ式で処理する。
- 元のcell valueは10^18まで達するため、積をmodulo 998244353へ逐次落とし、2での除算はmodular inverseを使う。

## 復習の核

- 周期mask付き格子和では、まずresidue classを固定して各行の値がどんな数列になるかを見る。
- 一行分を閉形式にした後、そのrow sum自体が行方向の等差数列にならないか確認する。

## 計算量と制約

### 時間

O(Q)、一rectangleの各parity classはO(1)。

### 空間

O(1)補助。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le N,M \le 10^9; 1 \le Q \le 2 \times 10^5; 1 \le A_i \le B_i \le N; 1 \le C_i \le D_i \le M

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/editorial/4846) — source-abc269-editorial-4846-ca50d700b0e54577aa1a9ec3da3743af33cf5d02afd035d1be6729315c6ee811
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc269/tasks/abc269_f) — source-abc269-f-problem-2f910c36bdeb03d58b53f7268e5dd5a44bf7c0d463a544ab9903e17b615ab67a
