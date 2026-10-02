---
title: "ABC346-E — Paint"
draft: true
authoringUnit: {"problemId":"abc346-e","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc346-e.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline"],"sourceRevisionIds":["source-abc346-e-problem-ca81f4e33e78560e300d9dbcde26306dd299325b95d112657967a1936cb2a4ec","source-abc346-editorial-9637-e17476c5f04b9dc0792f60a828c84e4e77af5e0aecc3a795d37ad2ce37d383bb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"逆順で未処理row rをcolor xに確定すると、既に後時刻のcolumn操作で確定した列を除くW-fixedCols個だけがxになる。columnも対称にH-fixedRows個を確定する。 各row/columnを高々一度だけ処理し、grid cellを列挙せずO(H+W+M)で最終頻度を得られる。","sourceRevisionIds":["source-abc346-e-problem-ca81f4e33e78560e300d9dbcde26306dd299325b95d112657967a1936cb2a4ec","source-abc346-editorial-9637-e17476c5f04b9dc0792f60a828c84e4e77af5e0aecc3a795d37ad2ce37d383bb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

各cellの最終色は、そのrowまたはcolumnに対して最後に行われたpaintだけで決まる。operationを逆順に見ると、まだ確定していないcellだけを初めて出会うrow/column操作で一括確定できる。

採用する候補: operationを逆走査し、未処理row/column数から色countを加える

各row/columnを高々一度だけ処理し、grid cellを列挙せずO(H+W+M)で最終頻度を得られる。

棄却する候補: operationを順にgridへ直接塗る

一回O(H)またはO(W)で、最大4×10^10 cell更新になる。

逆順で未処理row rをcolor xに確定すると、既に後時刻のcolumn操作で確定した列を除くW-fixedCols個だけがxになる。columnも対称にH-fixedRows個を確定する。

rowUsed・colUsedをfalse、fixedRows=fixedCols=0としてM-1から0へ走査する。未使用rowならcount[X]+=W-fixedColsとしてmark・fixedRows++、未使用columnならcount[X]+=H-fixedRowsとしてmark・fixedCols++する。残る(H-fixedRows)(W-fixedCols)をcolor0へ加え、正countだけ色昇順に出す。

## 典型の発動条件

### last-write-winsの逆走査

発動条件: 上書き更新列の最終結果だけが必要である。

時系列を逆に辿り、各対象への最初の未確定部分だけを確定する。

### 未処理dimension数の積

発動条件: row/column全体操作の交差cellを個別に見ず、新規確定数を数えたい。

既確定の反対軸本数を引き、残る列数または行数を寄与にする。

## 問題固有の要素

同じrowへの古いoperationは、逆走査でrowが既使用なら全cellがより新しいrow/column操作により既に確定しているため完全に無視できる。

別の問題へ持ち帰る視点: 上書き矩形処理は逆順のcovered判定で冗長な過去更新を捨てられる。

## 正当性

逆順で未処理row rをcolor xに確定すると、既に後時刻のcolumn操作で確定した列を除くW-fixedCols個だけがxになる。columnも対称にH-fixedRows個を確定する。 各row/columnを高々一度だけ処理し、grid cellを列挙せずO(H+W+M)で最終頻度を得られる。

## 実装上の注意

- X_i=0のpaintも通常色としてcountへ足し、最後の未確定cellも同じcolor0へ合算する。0個のcolorは出力しない。

## 復習の核

- 同じrowの反復、rowとcolumnの上書き順逆転、全軸が一度も塗られない部分、color0によるpaintを小grid simulationと比較する。

## 計算量と制約

### 時間

O(H+W+M log M)、色countの平衡mapでM更新。配列色域ならO(H+W+M)。

### 空間

O(H+W+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W, M \leq 2 \times 10^5; T_i \in \lbrace 1, 2 \rbrace; 1 \leq A_i \leq H for each i such that T_i = 1,; 1 \leq A_i \leq W for each i such that T_i = 2.; 0 \leq X_i \leq 2 \times 10^5; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc346/tasks/abc346_e) — source-abc346-e-problem-ca81f4e33e78560e300d9dbcde26306dd299325b95d112657967a1936cb2a4ec
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc346/editorial/9637) — source-abc346-editorial-9637-e17476c5f04b9dc0792f60a828c84e4e77af5e0aecc3a795d37ad2ce37d383bb
