---
title: "ABC405-G — Range Shuffle Query"
draft: true
authoringUnit: {"problemId":"abc405-g","docPath":"src/content/docs/problems/data-structures/outcome-schedule-range-query-updates/outcome-schedule-range-query-updates-shard-001/abc405-g.md","learningOutcomeIds":["outcome-schedule-range-query-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dynamic-modular-product","unit-value-bucket-aggregation"],"excludedTopics":["オンラインのpriority queue・multiset、および単調stack・queue。"],"tagIds":["tag-mo-offline-range","tag-combinatorial-coefficients","tag-dynamic-modular-product","tag-value-bucket-aggregation"],"sourceRevisionIds":["source-abc405-editorial-12997-8d1a52b7eec8ba1e235d005c7c0f233f6fc13ee79e5c108af0ad19d9941fac66","source-abc405-g-problem-70703459c6038a4aec1df7c9f35196b5d58ef8eb61d7fd3d35c2140ab07d77a5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"Moの伸縮は現在区間の頻度を正確に保ち、bucketの差分更新もその頻度から決まる和と積を保つ。閾値未満の全bucketと端数は残す値を過不足なく覆うので、その集約を多重集合順列の式へ代入した値が答えになる。","sourceRevisionIds":["source-abc405-editorial-12997-8d1a52b7eec8ba1e235d005c7c0f233f6fc13ee79e5c108af0ad19d9941fac66","source-abc405-g-problem-70703459c6038a4aec1df7c9f35196b5d58ef8eb61d7fd3d35c2140ab07d77a5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Moの順序で区間問い合わせの差分を更新する](src/content/docs/learn/query/mo-offline-range.md)

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [可逆な非零剰余と剰余 0 因子を含む法上の動的積](src/content/docs/learn/number-theory/dynamic-modular-product.md) — 通常の法上演算と逆元の存在条件を前提に、取り得る因子のうち法 m で非零となるものがすべて可逆（典型的には素数法）かを確認する。剰余 0 だけは逆元を持たないため、その個数と可逆な非零剰余因子の積へ状態を分けて因子差し替えを定数時間で処理する。
- [値軸のbucket分割と区間集約](src/content/docs/learn/query/value-bucket-aggregation.md) — 値軸を長さBのblockに分け、完全blockの要約と端数の走査を合成する。点更新とqueryの回数を別々に数え、O(1)更新とO(V/B+B)の値prefix取得を選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- オンラインのpriority queue・multiset、および単調stack・queue。

## 考察

区間内でX未満の値vがf_v個、残る要素数がk=Σ_{v<X}f_vなら、並べ替え後の異なる列は多重集合の順列数 k!÷∏_{v<X}f_v! である。したがってqueryごとに必要なのは値別頻度そのものではなく、X未満の頻度和と逆階乗の積である。

採用する候補: queryをMo順に並べ、値軸を平方根bucketへ分けて頻度和と逆階乗積を管理する

区間端の移動では一つの頻度だけをO(1)で更新でき、各queryはX未満の完全bucketと端数だけをO(√N)で合成できるため、N,Qとも2.5×10^5でも対数因子なしで処理できる。

棄却する候補: Mo’s algorithmとsegment treeで値prefixの頻度和・積を取得する

正しい構成だが、O(N√Q)回の区間伸縮すべてにO(log N)の更新が掛かり、公式解説が示すO((N√Q+Q)log N)では制限時間に対して重い。

棄却する候補: 各queryでA_LからA_Rの頻度を数え直す

同じ区間要素をquery間で再走査するため、長い区間が並ぶとΘ(NQ)になり、入力上限では実行できない。

値vの頻度がfからf±1へ変わると、対応bucketの頻度和とinvFact[f]の積だけを差分更新すればよい。区間位置と値軸を別々に平方根分割することで、Moの移動と閾値queryの双方を軽くできる。

X以上は削除されるので値prefixは[1,X)であり、この範囲のbucket集約から得たkとp=∏invFact[f_v]にfact[k]を掛ければ、多重度を保った答えが復元できる。

factとinvFactを前計算し、queryをMo順に処理する。現在区間へのadd/removeごとに値の頻度と所属bucketの頻度和・逆階乗積をO(1)更新し、各Xについて[1,X)の完全bucketと端数から(k,p)を集約してfact[k]×pを出力する。

## 典型の発動条件

### Mo’s algorithm

発動条件: 静的配列の多数の区間queryが、端を一つ動かすたびに状態を定数時間で更新できる。

query順を並べ替えて区間端の総移動量をO(N√Q)に抑え、値別頻度を維持する。

### 値軸の平方根分割

発動条件: 点更新をO(1)に保ったまま、値prefix上の和と積を多数取得したい。

各bucketに頻度和とinvFact積を持ち、[1,X)をO(√N)要素で合成する。

## 問題固有の要素

segment treeを平方根分割へ替えるとquery単体は遅くなる一方、Moで圧倒的多数発生する更新からlog因子を消せるため、全体では高速になる。

別の問題へ持ち帰る視点: 複合アルゴリズムでは各操作を一律に最速化せず、更新回数とquery回数を別々に数えてデータ構造の非対称な計算量を選ぶ。

## 正当性

Moの伸縮は現在区間の頻度を正確に保ち、bucketの差分更新もその頻度から決まる和と積を保つ。閾値未満の全bucketと端数は残す値を過不足なく覆うので、その集約を多重集合順列の式へ代入した値が答えになる。

## 実装上の注意

- 閾値は厳密にA_i<Xなので値区間を[1,X)とする。頻度fの変更時はinvFact[f]をfact[f]で打ち消してから新しいinvFactを掛け、bucket和・積と個別頻度を同じ順序で更新する。

## 復習の核

- 小さいNでは各queryの対象多重集合から全順列を生成して比較し、X=1、X=N、同じ値だけの区間、空の値prefix、bucket境界直前・直後を重点的に確認する。

## 計算量と制約

### 時間

O(Q log Q+QB+N²/B+Q√V)、B≈N/√Q、Vは値域サイズ。 左端block幅Bでは左端の移動がO(QB)、右端は高々N/B個のblockで各O(N)なのでO(N²/B)。B=max(1,⌊N/√Q⌋)で均衡させる。

### 空間

O(N+Q+V)、fact・freq・値bucket。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2.5 \times 10^5; 1 \le Q \le 2.5 \times 10^5; 1 \le A_i \le N; 1 \le L \le R \le N; 1 \le X \le N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc405/editorial/12997) — source-abc405-editorial-12997-8d1a52b7eec8ba1e235d005c7c0f233f6fc13ee79e5c108af0ad19d9941fac66
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc405/tasks/abc405_g) — source-abc405-g-problem-70703459c6038a4aec1df7c9f35196b5d58ef8eb61d7fd3d35c2140ab07d77a5
