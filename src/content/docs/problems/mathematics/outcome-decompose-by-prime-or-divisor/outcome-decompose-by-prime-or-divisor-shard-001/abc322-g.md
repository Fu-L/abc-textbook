---
title: "ABC322-G — Two Kinds of Base"
draft: true
authoringUnit: {"problemId":"abc322-g","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc322-g.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc322-editorial-7306-4ada279b066a1b48f41a168b2c0d27f4ff554367f0a7d9826fcf227968f42582","source-abc322-g-problem-626d58127ceb854ca88e535338f03db474096d9116702ab159162b3a52ad7783"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"差X>0なのでa>bでs=a−bはXの約数。二桁は先頭digit·sだけで末尾は自由。三桁以上はs(2b+s)≤Xが必要なので有限のpair列挙で全候補を覆う。weight D_eが低位digit全和より大きいため高位からのquotientは唯一の可能digitであり、digit上限と最終余りを確認すれば表現の必要十分を判定できる。末尾weight0の自由度だけ最後に掛ける。","sourceRevisionIds":["source-abc322-editorial-7306-4ada279b066a1b48f41a168b2c0d27f4ff554367f0a7d9826fcf227968f42582","source-abc322-g-problem-626d58127ceb854ca88e535338f03db474096d9116702ab159162b3a52ad7783"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

X>0かつdigitが非負なのでa=bでは差0、a<bでは差が負となり、解では必ずa>bである。

k=2では差がS_1(a-b)だけになり、S_1|Xを固定するとs=a-b=X/S_1、bの範囲と自由な末尾digit S_2を直接数えられる。

k≥3では各a^e-b^eがa-bの倍数なのでs=a-bはXの約数で、さらにleading exponentが2以上だからa²-b²=s(2b+s)≤Xが必要になる。

採用する候補: k=2をdivisorごとの閉形式で数え、k≥3はdivisor sと有限なbを列挙してsuperincreasingなweightのgreedy表現を検査する。

Nが10^9でも候補(a,b)をXだけに依存する範囲へ絞り、各pairの有効Sが高々1つという構造を使える。

棄却する候補: a,b≤Nを全組列挙し、長さとdigit列をDPする。

N^2 pairだけで最大10^18となり、Xが小さいという制約を利用していない。

棄却する候補: 通常のbase-a表現とbase-b表現を別々に列挙して一致を探す。

同じdigit列Sを両baseで共有する制約が結合しており、独立な表現の照合では候補が膨らむ。

digit上限d=min(10,b)に対し、weight D_e=a^e-b^eはD_e>(d-1)Σ_{i<e}D_iを満たすため、大きいweightから係数を決めるgreedy表現が一意になる。

固定(a,b)では最大D_e≤Xから降順にquotientをdigitとして引き、各digit<dかつ最終remainder 0ならleadingから定まるS prefixが唯一存在する。

末尾digit S_kはweight a^0-b^0=0で差へ影響せず、valid prefixごとにd通り選べる。

k=2はS_1=1..9かつS_1|Xを走査し、s=X/S_1、b∈[S_1+1,N-s]ごとの末尾digit数min(10,b)を区間和で加える。k≥3は各divisor s of Xについて1≤b≤min(N-s,floor((X/s-s)/2))、a=b+sを列挙する。D_e=a^e-b^eをXでcapしながらe≥2まで作り、最大weightからXをgreedy分解してdigitが0..min(10,b)-1、leading非zero、remainder 0ならmin(10,b)を加える。

## 典型の発動条件

### 差の因数による候補圧縮

発動条件: a^e-b^eの線形結合がXに等しくa,bの上限が巨大なとき。

a-b|Xと二乗差≤Xからsmall parameterを列挙する。

### superincreasing weightのgreedy復号

発動条件: 各weightが小さいweightの最大総寄与を上回るbounded-digit表現。

最大weightからquotientを一意なdigitとして決める。

### 自由な零weight桁の分離

発動条件: 表現の末尾項がparameter差に寄与しないとき。

有効prefixごとに末尾digitの選択数を掛ける。

## 問題固有の要素

同一digit列を2つのbaseで評価した差はD_e=a^e-b^eをweightにした非標準進数表現であり、そのweightがdigit上限に対して十分急増する。

別の問題へ持ち帰る視点: 2種類の評価関数の差を、係数制限付きweight表現として見て一意復号性や因数条件を探す。

## 正当性

差X>0なのでa>bでs=a−bはXの約数。二桁は先頭digit·sだけで末尾は自由。三桁以上はs(2b+s)≤Xが必要なので有限のpair列挙で全候補を覆う。weight D_eが低位digit全和より大きいため高位からのquotientは唯一の可能digitであり、digit上限と最終余りを確認すれば表現の必要十分を判定できる。末尾weight0の自由度だけ最後に掛ける。

## 実装上の注意

- k=2のb範囲和Σmin(10,b)はb≤9とb≥10に分け、N-sが下端未満なら0とする。
- power差の生成はa,bが10^9なので128bitとX+1でのcapを使い、overflow前に停止する。
- k≥3のgreedyでは最大exponentが少なくとも2であることとleading digit>0を確認し、k=2との重複を避ける。

## 復習の核

- k=2で末尾digitが自由になる理由と、k=3以上でD_eが下位digit最大和を上回る不等式を小さいa,bで確かめ、同じSを二重計数しないか確認する。

## 計算量と制約

### 時間

O(√X+Σ_{s|X}(X/s)log X)を上界とする。二桁は9case、長桁は各基数pairをgreedy検査する。

### 空間

O(τ(X)+log X)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10^9; 1 \le X \le 2 \times 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc322/editorial/7306) — source-abc322-editorial-7306-4ada279b066a1b48f41a168b2c0d27f4ff554367f0a7d9826fcf227968f42582
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc322/tasks/abc322_g) — source-abc322-g-problem-626d58127ceb854ca88e535338f03db474096d9116702ab159162b3a52ad7783
