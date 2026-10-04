---
title: "ABC283-E — Don't Isolate Elements"
draft: true
authoringUnit: {"problemId":"abc283-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc283-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc283-e-problem-2c21d492459ec8f7874377ac680303a0204b699b8e17735499e5767b9d4f6ce9","source-abc283-editorial-5433-8ab24c07cdb4e5b5e837256ab0c6ad1b43e508c1a6c4ef356e10edaad95b1ed2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ある行の孤立判定はその行と上下二行のflipだけに依存する。下行flipが決まった時点で中央行を確定してよい。二直前flipを残すと未来に必要な情報を失わず、最初と最後は存在しない隣行を除いて検査するので全行条件を正しく満たす。","sourceRevisionIds":["source-abc283-e-problem-2c21d492459ec8f7874377ac680303a0204b699b8e17735499e5767b9d4f6ce9","source-abc283-editorial-5433-8ab24c07cdb4e5b5e837256ab0c6ad1b43e508c1a6c4ef356e10edaad95b1ed2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

同じrowを2回反転すると元へ戻り、row反転同士は可換なので、各rowを反転するかのbitだけを決めればよい。 row iのcellが孤立するかはhorizontal neighborとrow i-1,i+1だけに依存し、row i+1の反転bitを決めた時点で確定する。 i+1行目の反転を決めてもi-1行目以前の孤立性は変わらないため、上から確定して捨てられる。 horizontalな同値関係はrow全体反転で変わらず、vertical比較だけが二rowの反転xorに応じて変わる。

採用する候補: 直前2rowの反転bitを状態にし、次rowのbitを試したら中央rowの全cellが非孤立か検査するrow DP。

2^H通りをlocalな3row依存へ圧縮し、各遷移でW cellだけを確認できる。

棄却する候補: 全rowの反転subsetを列挙し、完成matrixを検査する。

H≤1000で2^H候補は不可能である。

i+1行目の反転を決めてもi-1行目以前の孤立性は変わらないため、上から確定して捨てられる。

horizontalな同値関係はrow全体反転で変わらず、vertical比較だけが二rowの反転xorに応じて変わる。

flip1,flip2の4通りでrow1を検証できる初期状態を作る。row i-1,i,i+1のflipを使ってrow iの各cellに同値neighborがあるか調べ、validならcostへflip(i+1)を加えて遷移する。最後にrow Hも下neighborなしで検証し最小値、なければ-1。

## 典型の発動条件

### 幅2の履歴DP

発動条件: 列/行を順に決め、位置iの妥当性がi-1,i,i+1の選択だけに依存するとき。

直前2bitだけを状態にして次bit決定時に中央を確定する。

### 局所制約の遅延検証

発動条件: future隣接要素が1つ決まるまで現在位置の合法性を判定できないとき。

次rowを選んだ直後に1つ前のrowを検査する。

## 問題固有の要素

孤立判定は4近傍だがrow操作なので、未確定の影響は下1rowだけに限られ、3row windowへ閉じる。

別の問題へ持ち帰る視点: 操作単位と制約近傍の交差幅を見て、frontierに必要な過去操作bit数を決める。

## 正当性

ある行の孤立判定はその行と上下二行のflipだけに依存する。下行flipが決まった時点で中央行を確定してよい。二直前flipを残すと未来に必要な情報を失わず、最初と最後は存在しない隣行を除いて検査するので全行条件を正しく満たす。

## 実装上の注意

- 最上rowは上neighborなし、最下rowは下neighborなしとして別途境界検証する。
- cell値はA[i][j] xor flip[i]で比較し、操作costは各rowのflipを一度だけ加える。

## 復習の核

- 3rowだけを書き、3行目のflipを決めるまで2行目のvertical neighbor判定を保留する理由と、1行目/最下行の境界を追う。

## 計算量と制約

### 時間

H 行W列。各行のflip三bit組を検査して O(HW)。

### 空間

二行flipの4状態 O(1)、入力盤面O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H,W \leq 1000; A_{i,j} = 0 or A_{i,j} = 1; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/tasks/abc283_e) — source-abc283-e-problem-2c21d492459ec8f7874377ac680303a0204b699b8e17735499e5767b9d4f6ce9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/editorial/5433) — source-abc283-editorial-5433-8ab24c07cdb4e5b5e837256ab0c6ad1b43e508c1a6c4ef356e10edaad95b1ed2
