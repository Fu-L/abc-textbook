---
title: "ABC339-G — Smaller Sum"
draft: true
authoringUnit: {"problemId":"abc339-g","docPath":"src/content/docs/problems/data-structures/outcome-build-static-sorted-range-index/outcome-build-static-sorted-range-index-shard-001/abc339-g.md","learningOutcomeIds":["outcome-build-static-sorted-range-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-segment-tree-canonical-decomposition"],"excludedTopics":["静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-static-sorted-range-index"],"sourceRevisionIds":["source-abc339-editorial-9207-0ecaf2c06ab209d970c1f20435b591c08ed6278629b7462fd474856dd172a0ad","source-abc339-g-problem-f8be0e50c6270bea26aaed254c37ce3ae3b2dfeab5bf2b112789253cbfe2fac8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"完全被覆nodeではsorted配列にupper_bound(X)を行い、そのindexまでのprefix sumを返せば、値≤Xの要素だけの和になる。segment分解されたnodeはindex集合が互いにdisjointなので和を単純加算できる。 更新がなく、queryごとにO(log N) node×binary searchでO(log^2 N)に処理でき、前回答依存のonline復号にも対応する。","sourceRevisionIds":["source-abc339-editorial-9207-0ecaf2c06ab209d970c1f20435b591c08ed6278629b7462fd474856dd172a0ad","source-abc339-g-problem-f8be0e50c6270bea26aaed254c37ce3ae3b2dfeab5bf2b112789253cbfe2fac8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [静的sorted range index・Merge Sort Tree](src/content/docs/learn/query/static-sorted-range-index.md)

- 各canonical区間へsorted列とprefix aggregateを構築し、値域境界付きのrange count/sumを二分探索で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [Segment Treeのcanonical区間分解](src/content/docs/learn/query/segment-tree-canonical-decomposition.md)

対象外:

- 静的sorted range index・Merge Sort Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

queryはindex区間[L,R]と値上限Xの二次元条件を持つ。index区間をsegment treeのO(log N) nodeへ分解し、各node内で値≤Xの総和を返せればonlineに答えられる。

採用する候補: 各segment nodeにsorted valuesとprefix sumsを持つmerge-sort tree

更新がなく、queryごとにO(log N) node×binary searchでO(log^2 N)に処理でき、前回答依存のonline復号にも対応する。

棄却する候補: queryをX順にoffline sortしてFenwick treeで答える

次queryのL,R,Xが前answerとのXORで初めて判明するため、全queryを事前に並べ替えられない。

完全被覆nodeではsorted配列にupper_bound(X)を行い、そのindexまでのprefix sumを返せば、値≤Xの要素だけの和になる。segment分解されたnodeはindex集合が互いにdisjointなので和を単純加算できる。

segment treeをbottom-upに構築し、各nodeで子のsorted listをmergeして同長のprefix sumを作る。prev=0から各encrypted queryをL=α xor prev等で復号し、[L,R]を被覆するnodeごとにupper_bound(X)とprefix参照を行って合計し、それを出力してprevへ代入する。

## 典型の発動条件

### merge-sort tree

発動条件: 静的配列に対しindex範囲と値thresholdを同時に指定するqueryが多数ある。

segment tree各nodeへ区間要素のsorted列と累積和を保存する。

### online range query

発動条件: 次のquery parameterが直前のanswerに依存する。

事前並べ替えに頼らないdata structureで、入力順に復号・回答する。

## 問題固有の要素

通常のmerge-sort treeのcount queryへprefix sumを併設するだけで、upper_bound位置までの個数ではなく値の総和を返せる。

別の問題へ持ち帰る視点: sorted bucket型range treeは、bucket内prefix aggregateを持つとthreshold以下のsumへ拡張できる。

## 正当性

完全被覆nodeではsorted配列にupper_bound(X)を行い、そのindexまでのprefix sumを返せば、値≤Xの要素だけの和になる。segment分解されたnodeはindex集合が互いにdisjointなので和を単純加算できる。 更新がなく、queryごとにO(log N) node×binary searchでO(log^2 N)に処理でき、前回答依存のonline復号にも対応する。

## 実装上の注意

- 復号と答えは10^18級を扱うため64bit unsigned/signed範囲を確認し、L,Rは1-basedから内部半開区間へ変換する。prefix[0]=0を置く。

## 復習の核

- Xが全要素未満・以上、L=R、重複値、prevが大きくbitを跨ぐqueryをnaive filterと比較する。

## 計算量と制約

### 時間

構築O(N log N)、Q照会O(Q log²N)。

### 空間

O(N log N)、各深さのsorted列とprefix和。

### 制約との対応

公式制約の確認範囲: Time limit: 3.5 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 2 \times 10^5; 0 \le A_i \le 10^9; 1 \le Q \le 2 \times 10^5; For the encrypted inputs, the following holds: 0 \le \alpha_i, \beta_i, \gamma_i \le 10^{18}; 0 \le \alpha_i, \beta_i, \gamma_i \le 10^{18}; For the decrypted queries, the following holds: 1 \le L_i \le R_i \le N 0 \le X_i \le 10^9; 1 \le L_i \le R_i \le N; 0 \le X_i \le 10^9

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc339/editorial/9207) — source-abc339-editorial-9207-0ecaf2c06ab209d970c1f20435b591c08ed6278629b7462fd474856dd172a0ad
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc339/tasks/abc339_g) — source-abc339-g-problem-f8be0e50c6270bea26aaed254c37ce3ae3b2dfeab5bf2b112789253cbfe2fac8
