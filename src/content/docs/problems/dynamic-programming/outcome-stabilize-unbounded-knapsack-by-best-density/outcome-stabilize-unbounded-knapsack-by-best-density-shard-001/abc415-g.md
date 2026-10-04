---
title: "ABC415-G — Get Many Cola"
draft: true
authoringUnit: {"problemId":"abc415-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-stabilize-unbounded-knapsack-by-best-density/outcome-stabilize-unbounded-knapsack-by-best-density-shard-001/abc415-g.md","learningOutcomeIds":["outcome-stabilize-unbounded-knapsack-by-best-density"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource","unit-greedy-exchange"],"excludedTopics":["大容量unbounded knapsackのeventual linearityの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-eventual-unbounded-knapsack","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc415-editorial-13491-7ff02c91fc89331a46e6a0fde2e67669aaeba522f010beb4e5082f6094228007","source-abc415-g-problem-30342d182a7e8aad786d0e0357570b03b351ad48294fbde0112e5e3197c04006"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全瓶を飲んでから交換・飲酒する形に整理すると、一交換は残瓶をD=A−B減らしB本を追加する。逆向きではx≥Bの条件でxへDを足す。x≥K以降は条件が消える。最良比率B*/D*以外の操作が多数あるなら、最初のK回までの消費prefixをmod D*で見て同剰余二点を得る。その間を同消費の最良種だけへ交換すると価値は減らない。これを反復し、x<K付近の初動を含めた非最良種消費をK(K+1)未満へ抑えられる。小容量DPがこの全初動を網羅し、その後を最良種の最大反復へ置換しても最適を失わない。","sourceRevisionIds":["source-abc415-editorial-13491-7ff02c91fc89331a46e6a0fde2e67669aaeba522f010beb4e5082f6094228007","source-abc415-g-problem-30342d182a7e8aad786d0e0357570b03b351ad48294fbde0112e5e3197c04006"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [大容量unbounded knapsackのeventual linearity](src/content/docs/learn/dynamic-programming/eventual-unbounded-knapsack.md)

- 剰余の鳩の巣原理と密度交換で非基準itemの使用量を界し、有限prefix DPと最大密度itemの反復から巨大capacityの最適値を求められる。

先に読む単元:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md) — 最小十分状態を設計できるようになった後、選択数・容量・費用などの資源軸で遷移を表し、0/1選択と無制限選択の更新方向を区別する。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

## 考察

一本飲んでexchange iを一回行うと最終的な瓶総数をD_i=A_i-B_iだけ消費し、追加でB_i本飲める。逆向きに見ると、容量Nでweight D_i・value B_iのunbounded knapsackに近い。 ただし初期段階にはx≥B_iという実行条件がある。x≥K=max A_iになれば全B_i<Kなので条件は自動的に満たされ、以後は通常のunbounded knapsackになる。 同じA_iならB_i最大のoptionだけがD_iも小さくvalueも大きいので他を削除でき、残る種類数はK以下になる。 非i* itemがK個あればprefix weight和K+1個のmod D_{i*} residueに一致pairがあり、そのblockを同weightのi*複数へ交換できる。best ratioにより価値は減らない。

採用する候補: best ratio B_i/D_i のitem i*以外を使う総weightがK(K+1)未満の最適解を利用し、小容量DP後をi*の反復で埋める

prefix x<K(K+1)だけ全itemでDPし、各到達xから残容量へi*を可能なだけ使う。鳩の巣原理でK個以上の非i* item blockは同weightのi*群へ価値を下げず交換できる。

棄却する候補: 常にB_i/D_i最大のexchangeだけを最初から繰り返す

小さいxではx≥B_iを満たさないことがあり、容量の剰余調整でもratioが劣るitemを有限回使う方が総価値を増やす場合がある。

同じA_iならB_i最大のoptionだけがD_iも小さくvalueも大きいので他を削除でき、残る種類数はK以下になる。

非i* itemがK個あればprefix weight和K+1個のmod D_{i*} residueに一致pairがあり、そのblockを同weightのi*複数へ交換できる。best ratioにより価値は減らない。

同じAを最大Bだけにdeduplicateし、cross multiplicationでi*を選ぶ。limit=K(K+1)付近まで、開始xを自由に選べる基底0と条件x≥B_iを反映したunbounded DPで最大追加drink数を求める。各DP state xからi*をfloor((N-x)/D*)回追加する候補を評価し、初期N本を足す。

## 典型の発動条件

### best density itemによる大容量knapsack

発動条件: capacityが巨大だがitem weightが小さく、best ratio以外の使用量をboundedにできるとき。

有限prefixだけDPし、残りをbest-density itemで埋める。

### 鳩の巣原理による交換

発動条件: 非基準itemが多数並び、prefix weight residueを基準weight moduloで比較できるとき。

同余りの区間を同総weightの基準itemへ置換して非基準総weightを制限する。

### 支配optionの除去

発動条件: 同じ必要量parameterを持つ選択肢で一方が常に多い返却を与えるとき。

同じAでは最大Bだけ残して種類数をK以下へ減らす。

## 問題固有の要素

Nが10^15でも、ratio最良以外が必要なのは実行条件を抜けるprefixとresidue調整だけで、その総weightをK(K+1)未満へ押し込める。

別の問題へ持ち帰る視点: 巨大capacityのunbounded knapsackではbest ratio解との差分をcycle交換でboundedにし、短いprefix DP＋周期的tailへ分ける。

## 正当性

全瓶を飲んでから交換・飲酒する形に整理すると、一交換は残瓶をD=A−B減らしB本を追加する。逆向きではx≥Bの条件でxへDを足す。x≥K以降は条件が消える。最良比率B*/D*以外の操作が多数あるなら、最初のK回までの消費prefixをmod D*で見て同剰余二点を得る。その間を同消費の最良種だけへ交換すると価値は減らない。これを反復し、x<K付近の初動を含めた非最良種消費をK(K+1)未満へ抑えられる。小容量DPがこの全初動を網羅し、その後を最良種の最大反復へ置換しても最適を失わない。

## 実装上の注意

- DP上限をまたぐ遷移とbest-item tailの開始条件x≥B*を正確に扱い、Nがlimit未満ならNまでで止める。answerと回数積は64 bit、ratio比較はcross productにする。

## 復習の核

- 一種類、best ratioが初期に使えない、同A重複、残容量の剰余で別itemが必要な小Nを状態全探索と比較する。

## 計算量と制約

### 時間

K=max A_i≤300、元交換数 M。A同値を最大Bへ統合し高々K種類。O(M+K³)、巨大Nに比例する処理はない。

### 空間

小容量 O(K²) のDPと種類表 O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^{15}; 1\leq M \leq 2\times 10^5; 1\leq B_i < A_i \leq 300; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc415/editorial/13491) — source-abc415-editorial-13491-7ff02c91fc89331a46e6a0fde2e67669aaeba522f010beb4e5082f6094228007
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc415/tasks/abc415_g) — source-abc415-g-problem-30342d182a7e8aad786d0e0357570b03b351ad48294fbde0112e5e3197c04006
