---
title: "ABC438-G — Sum of Min"
draft: true
authoringUnit: {"problemId":"abc438-g","docPath":"src/content/docs/problems/mathematics/outcome-reduce-integer-structure-by-gcd/outcome-reduce-integer-structure-by-gcd-shard-001/abc438-g.md","learningOutcomeIds":["outcome-reduce-integer-structure-by-gcd"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。"],"tagIds":["tag-gcd-structure","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc438-editorial-14946-dbd19ad9858e6d6249c2d0c86397539779fe662661dead81f99f18c6a8f94176","source-abc438-g-problem-249f9c0c3a7d3782324a2337e5631cd5e7025d1cbd79f3db727ff09d5594012c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i modNとi modMは同じg=gcd(N,M)classを持つので各classを独立に分ける。縮約長が互いに素ならBのNstep巡回は置換になり、A固定の出現列はその円環の連続区間。全周期と余りへ分け、区間のΣmin(x,b)=Σ_{b<x}b+x·#{b≥x}をcount/sum Fenwickで評価すれば各iの寄与を一度足せる。","sourceRevisionIds":["source-abc438-editorial-14946-dbd19ad9858e6d6249c2d0c86397539779fe662661dead81f99f18c6a8f94176","source-abc438-g-problem-249f9c0c3a7d3782324a2337e5631cd5e7025d1cbd79f3db727ff09d5594012c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md)

- gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。

## 考察

添字 i を mod N の剰余 k ごとに分けると、参照する B の添字は k+cN mod M と進む。gcd(N,M)=1 なら掛け算 N による置換で、B を並べ替えた円環上の連続区間になる。

採用する候補: gcd で独立な剰余類へ分け、各クラスで B'_{t}=B_{Nt mod M} を作り、Σ min(x,B') の円環区間質問を値 x の昇順にオフライン処理する。

各 A_k が高々二つの通常区間質問になり、Fenwick 木で小さい B' の個数・和を高速に得られる。

棄却する候補: i=0,…,K-1 を直接走査して min(A_{i mod N},B_{i mod M}) を足す。

K が非常に大きい場合に比例時間を使えない。

g=gcd(N,M) なら i mod N と i mod M は同じ mod g を持つため、問題を g 個の互いに素な長さの組へ分離できる。

区間で Σmin(x,b)=Σ_{b<x}b+x·#{b≥x} なので、x 昇順に b を activate し個数と和を Fenwick 木で管理できる。

長さが周期 M を超える部分は全周期の寄与×周回数へ分け、余り区間は円環の折返しで高々二区間になる。

まず gcd ごとに A,B の対応剰余類を抽出する。互いに素なクラスで B' を N ステップ順に並べる。各 A_k から出現回数と B' 上の開始・長さを計算し、全周回を分離して余りを1〜2区間質問にする。質問を x=A_k 昇順に並べ、B' の値昇順 sweep と二本の Fenwick 木で count/sum を答えて合計する。

## 典型の発動条件

### gcd による周期分解

発動条件: 二つの異なる周期 i mod N,i mod M が同時に現れるとき。

共通剰余 mod gcd で独立クラスへ分け、各クラスの周期を互いに素にする。

### 剰余列の置換

発動条件: step と modulus が互いに素で、k+c·step mod M を走査するとき。

B を step 倍添字順へ並べ替え、算術進行を連続円環区間にする。

### offline Fenwick sweep

発動条件: 区間内の Σmin(x,a_i) を多数の異なる x について求めるとき。

値が x 未満の位置を activate し、区間の個数と値和から答えを復元する。

## 問題固有の要素

二周期の同期列は gcd で分解した後、互いに素な step を添字置換すれば一次元円環区間になる。

別の問題へ持ち帰る視点: min 関数の区間総和は閾値未満の count/sum に分解し、値順オフライン処理できる。

## 正当性

i modNとi modMは同じg=gcd(N,M)classを持つので各classを独立に分ける。縮約長が互いに素ならBのNstep巡回は置換になり、A固定の出現列はその円環の連続区間。全周期と余りへ分け、区間のΣmin(x,b)=Σ_{b<x}b+x·#{b≥x}をcount/sum Fenwickで評価すれば各iの寄与を一度足せる。

## 実装上の注意

- K の各剰余クラスでの要素数は ceil((K-k)/N) を負にならないよう扱う。全周回・余り長、円環 wrap、gcd 分割後の添字写像を確認する。

## 復習の核

- B' の開始添字に N の逆元/割り算が絡む対応を小例で照合し、周期全体と余り区間を重複なく分ける。

## 計算量と制約

### 時間

O((N+M)log(N+M))。gcd classごとの値sweepとFenwick質問。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N,M\le 2\times 10^5; 1\le K\le 10^{18}; 1\le A_i,B_i\le 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/editorial/14946) — source-abc438-editorial-14946-dbd19ad9858e6d6249c2d0c86397539779fe662661dead81f99f18c6a8f94176
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc438/tasks/abc438_g) — source-abc438-g-problem-249f9c0c3a7d3782324a2337e5631cd5e7025d1cbd79f3db727ff09d5594012c
