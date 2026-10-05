---
title: "ABC437-F — Manhattan Christmas Tree 2"
draft: true
authoringUnit: {"problemId":"abc437-f","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-002/abc437-f.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc437-editorial-14891-8e01dd8035d7e76c1dc9842c0d289021678532fec32f01c9901a6228611703a7","source-abc437-f-problem-31ca98501d7cea40b88574c6ad692175c9d92992d30517409358061afde8c90e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Manhattan距離は45度座標のChebyshev距離へ等しい。集合内の|u−U_i|最大はU最小または最大で達成し、vも同様なので四極値以外は不要。segment treeが各区間のmin/maxを合成し更新後も保存するため、四候補の最大が指定区間の正確な最遠距離になる。","sourceRevisionIds":["source-abc437-editorial-14891-8e01dd8035d7e76c1dc9842c0d289021678532fec32f01c9901a6228611703a7","source-abc437-f-problem-31ca98501d7cea40b88574c6ad692175c9d92992d30517409358061afde8c90e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 凸包の境界候補列挙・半平面交差。

## 考察

45度回転座標 U=X+Y,V=X-Y を使うと、マンハッタン距離は max(|u-U|,|v-V|) になる。固定 u から値集合への絶対差最大は集合の最小値か最大値で達成される。

採用する候補: U_i,V_i の各区間 min/max を持つセグメント木を構築し、更新と [L,R] 最遠距離質問を処理する。

各質問は四端点との差の最大だけで決まり、一点更新・区間集約とも O(log N) になる。

棄却する候補: 質問ごとに i=L…R を走査して全マンハッタン距離を計算する。

区間長の総和が大きいと O(NQ) になる。

|x-X_i|+|y-Y_i|=max(|(x+y)-(X_i+Y_i)|,|(x-y)-(X_i-Y_i)|) である。

max_i|u-U_i|=max(u-min U,max U-u) なので内部の値分布は不要である。

各点を (U_i,V_i) に変換し、葉に (minU,maxU,minV,maxV) を持つセグメント木を作る。点更新で四値を差し替える。照会 [L,R],(x,y) では区間四値を取得し、u=x+y,v=x-y との差四候補の最大を返す。

## 典型の発動条件

### マンハッタン距離の45度回転

発動条件: 二次元 L1 距離の最大値を座標ごとの一次元絶対差へ分離したいとき。

X+Y と X-Y に写し、L∞ 距離として扱う。

### 区間 min/max セグメント木

発動条件: 動的配列の区間内で、問い合わせ値から最も遠い要素を求めたいとき。

変換二座標それぞれの最小・最大だけを区間モノイドとして保存する。

## 問題固有の要素

二次元マンハッタン最遠点は回転座標ごとの極値四つだけで決まり、点集合全体を保持する必要がない。

別の問題へ持ち帰る視点: 距離最大化では変換後の凸関数が区間端で最大になるため、極値要約と相性がよい。

## 正当性

Manhattan距離は45度座標のChebyshev距離へ等しい。集合内の|u−U_i|最大はU最小または最大で達成し、vも同様なので四極値以外は不要。segment treeが各区間のmin/maxを合成し更新後も保存するため、四候補の最大が指定区間の正確な最遠距離になる。

## 実装上の注意

- X-Y は負になり得るため符号付きの広い整数型を使う。入力の区間端の inclusive/exclusive 変換と更新後の U,V 再計算を確認する。

## 復習の核

- 45度回転の式と、U/V 各軸で最小・最大の両方との差を比較しているかを確認する。

## 計算量と制約

### 時間

O(N+Q log N)。四extrema segment treeの更新照会。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\le N,Q\le 2\times 10^5; -10^9\le X_i,Y_i\le 10^9; 1\le i\le N; 1\le L\le R\le N; -10^9\le x,y\le 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc437/editorial/14891) — source-abc437-editorial-14891-8e01dd8035d7e76c1dc9842c0d289021678532fec32f01c9901a6228611703a7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc437/tasks/abc437_f) — source-abc437-f-problem-31ca98501d7cea40b88574c6ad692175c9d92992d30517409358061afde8c90e
