---
title: "ABC418-F — We're teapots"
draft: true
authoringUnit: {"problemId":"abc418-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc418-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc418-editorial-13626-7b22a94fd013f7f050961852897a733c49ad51c660ebfcd71d272c56a57fd8b6","source-abc418-f-problem-0dd69620bcc18403d81b76c9df85aa3b6d929eacf105e40fb1bc9060f727e07a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"前端状態s・後端状態tごとの係数は、強制coffeeの隣をteaにして残りへnoadjを適用する。例えばf00=noadj(n-1,r)、n≥3のf11=noadj(n-3,r-1)である。 制約なしsuffixは、直前がteaならfib[m]、coffeeならfib[max(m-1,0)]通り。ここでfib[0]=1,fib[1]=2,fib[m]=fib[m-1]+fib[m-2]である。 a_x変更で変わる区間はx自身と次のactive indexだけ。ordered setで前後制約を求め、二点matrix更新と全積取得をO(log N)で行える。","sourceRevisionIds":["source-abc418-editorial-13626-7b22a94fd013f7f050961852897a733c49ad51c660ebfcd71d272c56a57fd8b6","source-abc418-f-problem-0dd69620bcc18403d81b76c9df85aa3b6d929eacf105e40fb1bc9060f727e07a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

coffee位置は隣接してはならず、長さnにr個を置く方法は間隔を一つずつ圧縮するbijectionから noadj(n,r)=C(n-r+1,r) となる。

prefix coffee数が指定されたindexを順に並べると、隣り合う指定index間ではcoffee個数の差だけが固定される。区間同士の依存は両端がtea/coffeeの二状態だけである。

採用する候補: 各隣接制約間の2×2遷移行列f(n,r)を作り、active constraintの順序積をsegment treeで動的維持する

a_x変更で変わる区間はx自身と次のactive indexだけ。ordered setで前後制約を求め、二点matrix更新と全積取得をO(log N)で行える。

棄却する候補: 各query後に左からposition×coffee数DPをやり直す

一回O(N^2)または少なくともO(N)となりQ=2×10^5に間に合わず、変更で影響する制約区間が局所的なことを使っていない。

前端状態s・後端状態tごとの係数は、強制coffeeの隣をteaにして残りへnoadjを適用する。例えばf00=noadj(n-1,r)、n≥3のf11=noadj(n-3,r-1)である。

制約なしsuffixは、直前がteaならfib[m]、coffeeならfib[max(m-1,0)]通り。ここでfib[0]=1,fib[1]=2,fib[m]=fib[m-1]+fib[m-2]である。

a_0=0をsentinelにactive index setを持つ。active iのF_iを predecessor p に対するf(i-p,a_i-a_p)、inactiveはidentityとして、非可換な左→右積をsegment treeで管理する。更新時はxの削除／挿入に伴いF_xとsuccessorのmatrixだけ再計算し、積Mの第0行とlast active以降のfibを掛けて答えを得る。

## 典型の発動条件

### 境界状態のtransfer matrix

発動条件: 列を区間分割したとき、隣接禁止の依存が左右endpointの有限状態だけに残るとき。

各制約間をtea/coffeeの2×2matrixにし、順序積で全prefixを合成する。

### 動的非可換積segment tree

発動条件: 列中の少数matrixが点更新され、全順序積を毎回求めたいとき。

identityをinactive位置に置き、mergeをleftMatrix×rightMatrixとする。

### ordered setの前後制約

発動条件: active indexの追加削除で隣接区間分割だけが変化するとき。

predecessor/successorを探し、該当二matrixを張り替える。

## 問題固有の要素

prefix count制約を差分区間のexact coffee数へ変え、隣接禁止の跨ぎ情報をendpoint二bitだけに圧縮する。

別の問題へ持ち帰る視点: 動的prefix制約ではactive制約間のtransferを辺とみなし、頂点挿入削除が隣接辺だけを変更する構造を使う。

## 正当性

前端状態s・後端状態tごとの係数は、強制coffeeの隣をteaにして残りへnoadjを適用する。例えばf00=noadj(n-1,r)、n≥3のf11=noadj(n-3,r-1)である。 制約なしsuffixは、直前がteaならfib[m]、coffeeならfib[max(m-1,0)]通り。ここでfib[0]=1,fib[1]=2,fib[m]=fib[m-1]+fib[m-2]である。 a_x変更で変わる区間はx自身と次のactive indexだけ。ordered setで前後制約を求め、二点matrix更新と全積取得をO(log N)で行える。

## 実装上の注意

- noadj(n,r)はr<0やn<0、n-r+1<rなら0とし、n=1,2のf各成分を公式どおり個別処理する。更新前後のsuccessorとlast active、matrix積順を確認する。

## 復習の核

- active制約なし、一点制約、矛盾するcount差、隣接二indexをともにcoffee指定、制約解除で区間が再結合する例を全bit列挙と比較する。

## 計算量と制約

### 時間

前計算O(N)、Q更新O(Q log N)、固定2×2行列。

### 空間

O(N)、階乗・逆階乗・fib・制約木。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq X_j \leq N (1 \leq j \leq Q); -1 \leq Y_j \leq X_j (1 \leq j \leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/editorial/13626) — source-abc418-editorial-13626-7b22a94fd013f7f050961852897a733c49ad51c660ebfcd71d272c56a57fd8b6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/tasks/abc418_f) — source-abc418-f-problem-0dd69620bcc18403d81b76c9df85aa3b6d929eacf105e40fb1bc9060f727e07a
