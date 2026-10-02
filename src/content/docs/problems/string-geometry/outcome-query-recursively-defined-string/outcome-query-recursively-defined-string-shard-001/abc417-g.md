---
title: "ABC417-G — Binary Cat"
draft: true
authoringUnit: {"problemId":"abc417-g","docPath":"src/content/docs/problems/string-geometry/outcome-query-recursively-defined-string/outcome-query-recursively-defined-string-shard-001/abc417-g.md","learningOutcomeIds":["outcome-query-recursively-defined-string"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-binary-lifting"],"excludedTopics":["明示された文字列への接尾辞索引の構築。"],"tagIds":["tag-recursive-compressed-string","tag-amortized-monotone-progress","tag-binary-lifting"],"sourceRevisionIds":["source-abc417-editorial-13580-dac193090d80c330b4061b9f795134aaf3386a8de0774cf8ad055bd69bf67dee","source-abc417-g-problem-d89d2f3572482bf501b1f2d1ef60ea5fe7fa61bf1bccc5e1084ffefa28f92d4a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"query位置≤Cなのでprefix C文字以降を捨てても答えは保存される。親に含まれる長さでheavyを選ぶとlightへ移るたび残長が半減する。heavy descendantの含有区間にqueryが入るときだけjumpするため、その間のoffset減算をdoublingでまとめても元の一辺追跡と同じ位置になる。最後にbase一文字へ到達して正しいbitを得る。","sourceRevisionIds":["source-abc417-editorial-13580-dac193090d80c330b4061b9f795134aaf3386a8de0774cf8ad055bd69bf67dee","source-abc417-g-problem-d89d2f3572482bf501b1f2d1ef60ea5fe7fa61bf1bccc5e1084ffefa28f92d4a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [圧縮・反復・再帰文字列へ問い合わせる](src/content/docs/learn/string/recursive-compressed-string.md)

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

対象外:

- 明示された文字列への接尾辞索引の構築。

## 考察

query位置は10^18以下なので、各S_iは先頭C=10^18文字だけ保持する設定へ変えても全回答は不変で、長さもmin(C,lenL+lenR)へsaturateできる。

concat DAGを一文字まで辿ると深さQになり得る。各nodeで親に含まれる長さが大きいchildをheavy、小さい方をlightとすれば、query追跡中のlight遷移は長さ半減により高々約60回である。

採用する候補: heavy child chainをbinary liftingし、各queryで可能なheavy jumpをまとめ、次のlight edgeへ移る操作をbase文字まで繰り返す

light回数O(log C)、各heavy chain移動O(log Q)なので全体O(Q log Q log C)。jump tableには到達nodeと元文字列内offsetを持つ。

棄却する候補: 各queryでconcat元を一段ずつ辿ってS_0/S_1へ到達する

node indexは減るがchain長はΘ(Q)になり、Q件でO(Q^2)となる。

truncationで右childは一部しか親に含まれないことがあるため、heavy判定はchild本来の長さではなく親内のincluded lengthで行う。

2^k heavy jump後のdescendantと累積offsetをdoublingできる。現在位置Bがそのdescendantの親内区間に入るときだけjumpし、heavyを最大限進めた後は位置がlight側にある。

各新nodeでc_left,c_right、親内offset、saturated length、included lengthからheavy/lightを決め、up[node][k]とoffset[node][k]を作る。回答は(A,B)=(i+1,X_i)から、large k順にBがheavy descendant区間内ならまとめて移り、baseでなければlight childへoffsetを引いて移る。A=0/1の文字を出力する。

## 典型の発動条件

### heavy-light decompositionの考え方

発動条件: root-to-leaf追跡で一方のchild sizeが少なくとも半分になり、長い同系遷移をjumpしたいとき。

大きいchildをheavy、小さいchildへの移動回数を対数に抑える。

### binary lifting

発動条件: functionalなheavy edgeを多数回辿り、位置条件を満たす最深ancestorへ進みたいとき。

2^k先nodeと累積開始offsetをtable化する。

### saturating length

発動条件: 巨大な暗黙文字列でquery位置に上限があるとき。

上限より後ろを捨て、length加算をcapしてoverflowと不要情報を防ぐ。

## 問題固有の要素

通常のsubtree-size HLDではなく、concat後に実際に残るprefix長をsizeとし、文字位置Bも含めたhalving argumentでlight回数を抑える。

別の問題へ持ち帰る視点: 暗黙sequence DAGのrank queryでは、参照可能prefixへtruncateし、included child lengthによるheavy decompositionを使える。

## 正当性

query位置≤Cなのでprefix C文字以降を捨てても答えは保存される。親に含まれる長さでheavyを選ぶとlightへ移るたび残長が半減する。heavy descendantの含有区間にqueryが入るときだけjumpするため、その間のoffset減算をdoublingでまとめても元の一辺追跡と同じ位置になる。最後にbase一文字へ到達して正しいbitを得る。

## 実装上の注意

- length加算とoffsetを10^18でsaturateしつつoverflow前に比較する。右childが0文字しか含まれない場合、equal-length tie、1-index Bと0-index offsetの包含判定を統一する。

## 復習の核

- 常に左だけがcapを占めるchain、左右同長、lightを交互に辿る構造、X=1/Cを小さい実文字列生成と比較する。

## 計算量と制約

### 時間

O(Q log Q·log C)、C=10^18。heavy doublingと高々log Cのlight遷移。

### 空間

O(Q log Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1\leq Q\leq 5\times 10^5; 0\leq L_i,R_i\leq i; 1\leq X_i\leq 10^{18}; X_i is at most the length of S_{i+1}.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc417/editorial/13580) — source-abc417-editorial-13580-dac193090d80c330b4061b9f795134aaf3386a8de0774cf8ad055bd69bf67dee
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc417/tasks/abc417_g) — source-abc417-g-problem-d89d2f3572482bf501b1f2d1ef60ea5fe7fa61bf1bccc5e1084ffefa28f92d4a
