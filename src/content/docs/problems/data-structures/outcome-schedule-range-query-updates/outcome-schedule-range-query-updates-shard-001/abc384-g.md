---
title: "ABC384-G — Abs Sum"
draft: true
authoringUnit: {"problemId":"abc384-g","docPath":"src/content/docs/problems/data-structures/outcome-schedule-range-query-updates/outcome-schedule-range-query-updates-shard-001/abc384-g.md","learningOutcomeIds":["outcome-schedule-range-query-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-weighted-prefix-fenwick"],"excludedTopics":["オンラインのpriority queue・multiset、および単調stack・queue。"],"tagIds":["tag-mo-offline-range","tag-coordinate-compression","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc384-editorial-11548-b15bbcf84e1a645622eedbcb5b6c4df173f974b4e32990f5b3377802a1a6619b","source-abc384-g-problem-e28558fe4f9d3cd66de0fdd5adcab4a395f351abae49033d7107c6661f591286"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"現在の二prefixの全対和を不変量にする。一方の要素を増減したときは、反対prefixとの対だけが増減する。個数と総和による絶対差の計算がその寄与に一致するので、端点をどの順序で動かしても照会時の値は正しい。","sourceRevisionIds":["source-abc384-editorial-11548-b15bbcf84e1a645622eedbcb5b6c4df173f974b4e32990f5b3377802a1a6619b","source-abc384-g-problem-e28558fe4f9d3cd66de0fdd5adcab4a395f351abae49033d7107c6661f591286"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Moの順序で区間問い合わせの差分を更新する](src/content/docs/learn/query/mo-offline-range.md)

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- オンラインのpriority queue・multiset、および単調stack・queue。

## 考察

query(X,Y)はAのprefix XとBのprefix Yの全pair絶対差和で、query順を並べ替えれば片方のprefixを少しずつ増減して答えを差分更新できる。

値aをA側へ一つ加えた寄与Σ_{j≤Y}|a-B_j|は、B prefix内のa未満の個数・総和と全体総和から計算できる。

採用する候補: 二つのprefix長をMo順に動かし、各側の値分布をFenwick treeで管理する

X方向のblock移動とY方向の単調走査を均衡させて総移動O(N√K)とし、各add/removeの絶対差寄与をO(log N)で求められる。

棄却する候補: 各queryでX×Y個のpairを直接足す

N=10^5,K=10^4で最悪Θ(KN^2)となり、prefix間の再利用を捨てている。

座標圧縮した値軸にcount BITとsum BITを持てば、v未満・以上の寄与をv·cnt-sumとsum-v·cntへ分けられる。

二つの集合を同時に変えるため、追加前の反対集合への寄与を加え、削除前の寄与を引くという対称な更新を用意する。

queryをX block、block内Y順（必要なら蛇行順）へsortする。current X,Yと答えを保ち、A/B prefix端を動かすたび反対側BITから絶対差和を計算して加減し、自側BITを更新する。

## 典型の発動条件

### Mo’s algorithm

発動条件: offline queryの状態が端点一つのadd/removeで軽く更新できるとき。

二つのprefix端の総移動をblock順で抑える。

### Fenwick treeによる絶対差和

発動条件: 動的multisetに対するΣ|x-v|を求めたいとき。

値prefixのcountとsumから左右寄与を算出する。

## 問題固有の要素

通常の一区間Moでなく、A側prefixとB側prefixという二軸を長方形の端点として動かせばよい。

別の問題へ持ち帰る視点: 二集合間の全pair量queryでも、片側一要素の追加寄与が反対集合の集約から求まるならMo状態にできる。

## 正当性

現在の二prefixの全対和を不変量にする。一方の要素を増減したときは、反対prefixとの対だけが増減する。個数と総和による絶対差の計算がその寄与に一致するので、端点をどの順序で動かしても照会時の値は正しい。

## 実装上の注意

- AとBを同じ座標集合で圧縮する。削除はBITから消す前の寄与を引き、block幅はN/√K程度を基準に0除算を避ける。

## 復習の核

- 小配列の全(X,Y)を二重loopと比較し、同値が多い場合、X/Y=1,N、add直後removeを含むquery順で符号を検証する。

## 計算量と制約

### 時間

O(K log K+(KB+N²/B)log N)、K照会数、B≈N/√K。各端移動がBIT O(log N)。 左端block幅Bでは左端の移動がO(KB)、右端は高々N/B個のblockで各O(N)なのでO(N²/B)。B=max(1,⌊N/√K⌋)で均衡させる。

### 空間

O(N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 10^5; 0\le A_i,B_j\le 2\times 10^8; 1\le K\le 10^4; 1\le X_k,Y_k\le N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc384/editorial/11548) — source-abc384-editorial-11548-b15bbcf84e1a645622eedbcb5b6c4df173f974b4e32990f5b3377802a1a6619b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc384/tasks/abc384_g) — source-abc384-g-problem-e28558fe4f9d3cd66de0fdd5adcab4a395f351abae49033d7107c6661f591286
