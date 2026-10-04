---
title: "ABC284-G — Only Once"
draft: true
authoringUnit: {"problemId":"abc284-g","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc284-g.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-normalization","unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-state-normalization"],"sourceRevisionIds":["source-abc284-editorial-5468-0fc55757cb97e3e299eab495bb719d3ad048cf14d4177dd2d8ef414fe487605b","source-abc284-g-problem-1539f7f7aca16e6da918cb5ede8914eaa0801ff2016afa105f09e3cccbd0a7ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"頂点1の重複前pathの異頂点数lを固定すると、順序は(N−1)P(l−1)、外側写像はN^(N−l)通り。戻り先pの一回訪問頂点数p−1の和はl(l−1)/2。これら分類は各写像を一意に表す。頂点対称性でN倍すれば全頂点の総和となる。三角数は整数で2除算してから法を取る。","sourceRevisionIds":["source-abc284-editorial-5468-0fc55757cb97e3e299eab495bb719d3ad048cf14d4177dd2d8ef414fe487605b","source-abc284-g-problem-1539f7f7aca16e6da918cb5ede8914eaa0801ff2016afa105f09e3cccbd0a7ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md) — 対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

全頂点は対称なので、全写像Aに対するS_1の総和だけを求め、最後にN倍すれば全頂点分になる。1からfunctional graphを辿り、最初の重複までに異なる頂点がl個、戻り先がpath上のp番目なら、ちょうど1回訪れる頂点数はp-1である。1以外のl-1個のpath頂点の並べ方は(N-1)P(l-1)、path外N-l頂点の遷移は軌道へ影響せず各N通りである。固定lで戻り先p=1..lの寄与を合計すると0+1+…+(l-1)=l(l-1)/2になる。

採用する候補: 軌道の異なる頂点数lと戻り先pで写像を分類し、pathの順列・未使用遷移・寄与p-1を積で数える。

N^N個の写像を直接扱わず、lごとの閉形式へまとめられ、合成数modulusでも整数演算で計算できる。

棄却する候補: すべてのA_1..A_Nを列挙して各functional graphをsimulationする。

写像がN^N個あり、Nが大きい制約では列挙不能である。

棄却する候補: l(l-1)/2をmod Mで2の逆元を掛けて求める。

Mは素数とは限らず、Mが偶数なら2の逆元が存在しない。

l=1..Nを走査し、falling=(N-1)P(l-1)とpow=N^(N-l)をmod Mで管理する。term=falling·pow·l(l-1)/2を加算し、最後に対称性のNを掛ける。三角数はlまたはl-1の偶数側を整数として2で割ってからmod Mへ落とし、modular inverseを使わない。

## 典型の発動条件

### functional graphの軌道分類

発動条件: 各頂点の出次数が1で、開始点から最初のcycleまでの訪問性質を数えるとき。

tailとcycleを、最初の重複までの長さと戻り先で表す。

### 対称性による代表頂点

発動条件: labelled頂点すべてが同じ役割を持つ総和を求めるとき。

頂点1の総寄与を数えてN倍する。

### 合成数modでの整数除算

発動条件: 組合せ式に小さい整数除算があるがmodulusが素数とは限らないとき。

積の中で割り切れる因子をmodを取る前に除く。

## 問題固有の要素

戻り先より前のtailだけが1回訪問され、戻り先以降のcycle頂点は無限回訪問されるため、S_1=p-1へ単純化する。

別の問題へ持ち帰る視点: functional graphの訪問回数条件は、tail・cycle・未到達の三分類へ分けると数えやすい。

## 正当性

頂点1の重複前pathの異頂点数lを固定すると、順序は(N−1)P(l−1)、外側写像はN^(N−l)通り。戻り先pの一回訪問頂点数p−1の和はl(l−1)/2。これら分類は各写像を一意に表す。頂点対称性でN倍すれば全頂点の総和となる。三角数は整数で2除算してから法を取る。

## 実装上の注意

- l=1の三角数は0であり、積の更新順をずらして(N-1)P(l-1)とN^(N-l)を正しく対応させる。
- M=1でも動くよう全加算・乗算をmod Mで行い、逆元に依存しない。

## 復習の核

- l=3の軌道を描き、戻り先p=1,2,3で寄与が0,1,2になること、path外の遷移がN^(N-l)通り自由なこと、偶数Mで逆元を使っていないことを点検する。

## 計算量と制約

### 時間

N 頂点。Nの冪表と falling product を一巡で作り O(N)。

### 空間

冪表 O(N)、総和作業 O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 10^8\leq M \leq 10^9; N and M are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/editorial/5468) — source-abc284-editorial-5468-0fc55757cb97e3e299eab495bb719d3ad048cf14d4177dd2d8ef414fe487605b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc284/tasks/abc284_g) — source-abc284-g-problem-1539f7f7aca16e6da918cb5ede8914eaa0801ff2016afa105f09e3cccbd0a7ad
