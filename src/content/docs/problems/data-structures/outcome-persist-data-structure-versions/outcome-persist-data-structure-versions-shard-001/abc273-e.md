---
title: "ABC273-E — Notebook"
draft: true
authoringUnit: {"problemId":"abc273-e","docPath":"src/content/docs/problems/data-structures/outcome-persist-data-structure-versions/outcome-persist-data-structure-versions-shard-001/abc273-e.md","learningOutcomeIds":["outcome-persist-data-structure-versions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-persistence"],"sourceRevisionIds":["source-abc273-e-problem-fed53a2a982096aeb89f298579a1e809a95058a06ddf4fe75177d79e756a083a","source-abc273-editorial-5023-f05e948a7eca80904f9ead71fc40f2c30993d9c1d91142ec2d2b7b341bb61399"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"DELETEはcurrent=parent[current]、LOADはcurrent=saved[z]であり、sequenceを実際に辿る必要がない。 value −1のsentinel rootをempty sequenceとすれば、emptyでのDELETEと出力−1を条件分岐なしに統一できる。 各queryがnode一個の追加またはpointerの移動・保存だけになり、過去状態を共有できる。","sourceRevisionIds":["source-abc273-e-problem-fed53a2a982096aeb89f298579a1e809a95058a06ddf4fe75177d79e756a083a","source-abc273-editorial-5023-f05e948a7eca80904f9ead71fc40f2c30993d9c1d91142ec2d2b7b341bb61399"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [永続data structure・structural sharing](src/content/docs/learn/query/persistence.md)

- 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

sequence AへのADD/DELETEはstackのpush/popであり、SAVE時に必要なのは全要素のcopyではなくそのversionのtopを指す参照だけである。

各ADDで現在topをparentに持つimmutable nodeを一つ作れば、root-to-current pathがその時点のAを表し、過去versionも壊れない。

棄却する候補: SAVEごとにsequence全体をnotebook pageへcopyし、LOADで復元する。

sequence長とSAVE回数の積が二乗になり、memoryもtimeもQ=50万を扱えない。

採用する候補: parent pointer付きnodeでpersistent stackを作り、page→top-nodeのmapだけを保存する。

各queryがnode一個の追加またはpointerの移動・保存だけになり、過去状態を共有できる。

DELETEはcurrent=parent[current]、LOADはcurrent=saved[z]であり、sequenceを実際に辿る必要がない。

value −1のsentinel rootをempty sequenceとすれば、emptyでのDELETEと出力−1を条件分岐なしに統一できる。

versioned sequence operationsをstructural sharingするpersistent linked stackとして表し、notebook pagesをversion pointersにする。

## 典型の発動条件

### 永続stackとstructural sharing

発動条件: push/popで変化する列の過去versionへ何度も戻りたいとき。

各push nodeへvalueとprevious topを持たせ、version間で共通prefixを共有する。

### 疎なkey状態の連想配列

発動条件: key universeは巨大だが実際に保存・参照されるkey数がquery数以下のとき。

10^9 pagesを配列化せず、SAVEされたpageだけをmapでtop pointerへ対応させる。

## 問題固有の要素

未保存pageには初期empty sequenceが記録されているため、mapにないLOADはsentinel rootを返す。

別の問題へ持ち帰る視点: snapshot保存はdata本体ではなくimmutable representationのroot handleだけを記録する。

## 正当性

DELETEはcurrent=parent[current]、LOADはcurrent=saved[z]であり、sequenceを実際に辿る必要がない。 value −1のsentinel rootをempty sequenceとすれば、emptyでのDELETEと出力−1を条件分岐なしに統一できる。 各queryがnode一個の追加またはpointerの移動・保存だけになり、過去状態を共有できる。

## 実装上の注意

- ADDで作るnode数は高々Qなのでcontiguous arraysにvalue/parentを格納し、pointerの代わりにindexを使える。
- 大量出力をbufferし、各query後にはcurrent nodeのvalueを必ず一つ記録する。

## 復習の核

- 過去状態への復帰があるpush/pop列は、各状態をroot-to-node pathで表してsnapshotをpointer一つにする。
- 巨大なlogical address spaceでも実際に触れるkeysが少なければsparse mapで表す。

## 計算量と制約

### 時間

hash map版は期待O(Q)、平衡木page map版O(Q log Q)。

### 空間

O(Q)、ADD nodeとsaved page。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq Q \leq 5 \times 10^5; 1 \leq x, y, z \leq 10^9; Q, x, y, and z are integers.; Each of the given queries is of one of the four kinds in the Problem Statement.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/tasks/abc273_e) — source-abc273-e-problem-fed53a2a982096aeb89f298579a1e809a95058a06ddf4fe75177d79e756a083a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/editorial/5023) — source-abc273-editorial-5023-f05e948a7eca80904f9ead71fc40f2c30993d9c1d91142ec2d2b7b341bb61399
