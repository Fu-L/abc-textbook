---
title: "ABC365-G — AtCoder Office"
draft: true
authoringUnit: {"problemId":"abc365-g","docPath":"src/content/docs/problems/hybrid/outcome-balance-heavy-light-threshold/outcome-balance-heavy-light-threshold-shard-001/abc365-g.md","learningOutcomeIds":["outcome-balance-heavy-light-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["平方根・閾値による軽重分類の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-threshold-heavy-light","tag-two-pointers-window"],"sourceRevisionIds":["source-abc365-editorial-10584-a5807169b9966b0e2c2aaffe6dc1028c54cafcfd98b98df716c1673375602dc9","source-abc365-g-problem-037b69f2373e1359ee5535729f241e515b954962a237d897aa4d6233af554a4c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"light同士は区間右端が小さい側を進め、overlap=max(0,min(r1,r2)−max(l1,l2))を足すと両列の長さ和だけで済む。 heavy人物hを固定して時刻順eventを走査し、hの在室flagが立つ区間で他人物の入退室を積算すればhとの全pair値を同時に得られる。 queryごとの短い処理と重い人ごとの一括処理を釣り合わせ、偏った入退室回数にも対応する。","sourceRevisionIds":["source-abc365-editorial-10584-a5807169b9966b0e2c2aaffe6dc1028c54cafcfd98b98df716c1673375602dc9","source-abc365-g-problem-037b69f2373e1359ee5535729f241e515b954962a237d897aa4d6233af554a4c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [平方根・閾値による軽重分類](src/content/docs/learn/modeling/threshold-heavy-light.md)

- 頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md) — 窓の不変条件と左右端の単調性を使い、各要素を高々定数回だけ処理して連続区間を列挙する。

## 考察

各人の入退室記録をpairにすれば、在室時間は互いに素な時間区間列S_iになる。二人が同時にいた時間は二つのsorted区間列のintersection長である。

区間数が少ない二人ならtwo pointersで速い一方、区間数の多い人は少数しかいないので、その人と全員の答えを一括前計算できる。

採用する候補: 区間数thresholdでlight/heavyを分け、light-light queryはmerge、heavyを含むpairは全event走査で前計算する。

queryごとの短い処理と重い人ごとの一括処理を釣り合わせ、偏った入退室回数にも対応する。

棄却する候補: 全ての人pairについて同時在室時間を事前計算する。

人の組数が二次で、実際にqueryされないlight同士まで表を作る空間と時間を払う。

light同士は区間右端が小さい側を進め、overlap=max(0,min(r1,r2)−max(l1,l2))を足すと両列の長さ和だけで済む。

heavy人物hを固定して時刻順eventを走査し、hの在室flagが立つ区間で他人物の入退室を積算すればhとの全pair値を同時に得られる。

記録(T_i,P_i)を人別の在室区間列へ変換する。threshold Cを入力規模とquery数に応じて選び、区間数>Cの人ごとに全eventを走査して全相手との同時時間を保存する。queryでheavyが含まれれば表を返し、両者lightなら二区間列をtwo pointersで交差集計する。

## 典型の発動条件

### sqrt decompositionによるheavy-light分類

発動条件: 要素ごとの出現数が偏り、pair queryを多数処理するとき。

低頻度pairはon demand、高頻度要素は全相手をprecomputeする。

### sorted区間列のintersection

発動条件: 互いに重ならない二つの時間区間集合の共通長を求めるとき。

右端の早い区間を進めるtwo pointersで重なりを一度ずつ数える。

## 問題固有の要素

thresholdは固定の平方根ではなく、light query総作業QCとheavy前計算作業のtrade-offを入力N,M,Qから釣り合わせる。

別の問題へ持ち帰る視点: sqrt decompositionでは二項のcost式を書き、制約の非対称性に合わせて境界を選ぶ。

## 正当性

light同士は区間右端が小さい側を進め、overlap=max(0,min(r1,r2)−max(l1,l2))を足すと両列の長さ和だけで済む。 heavy人物hを固定して時刻順eventを走査し、hの在室flagが立つ区間で他人物の入退室を積算すればhとの全pair値を同時に得られる。 queryごとの短い処理と重い人ごとの一括処理を釣り合わせ、偏った入退室回数にも対応する。

## 実装上の注意

- 各人の記録は入室・退室が交互なので隣接pairを半開区間として作る。queryのA<B順に依存せずheavy側を正しく選び、時間差は64 bitで持つ。

## 復習の核

- heavy数の上界を全区間数から導き、選んだCで二種類の総作業量を見積もる。端点が接するだけの区間は共通時間0として扱う。

## 計算量と制約

### 時間

O(T²/C+QC)、Tは入退室event数、Q質問、heavy人数≤T/C。

### 空間

O(T+Q+NT/C)、heavy×Nの回答表を保存する。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq2\times10^5; 2\leq M\leq2\times10^5; 1\leq T_1\lt T_2\lt\dotsb\lt T_M\leq10^9; 1\leq P_i\leq N\ (1\leq i\leq M); For every 1\leq p\leq N, the number of indices i such that P_i=p is even.; 1\leq Q\leq2\times10^5; 1\leq A_i\lt B_i\leq N\ (1\leq i\leq Q); All inputs are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/editorial/10584) — source-abc365-editorial-10584-a5807169b9966b0e2c2aaffe6dc1028c54cafcfd98b98df716c1673375602dc9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/tasks/abc365_g) — source-abc365-g-problem-037b69f2373e1359ee5535729f241e515b954962a237d897aa4d6233af554a4c
