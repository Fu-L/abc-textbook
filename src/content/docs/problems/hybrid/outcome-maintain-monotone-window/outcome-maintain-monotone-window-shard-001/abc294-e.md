---
title: "ABC294-E — 2xN Grid"
draft: true
authoringUnit: {"problemId":"abc294-e","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc294-e.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window"],"sourceRevisionIds":["source-abc294-e-problem-d40bb560b6160993aa73f42f09a115c61bbbaad510862820393ed2368129667e","source-abc294-editorial-5990-db9e9ebaa6872499fced988dd22b4b7cd0dbed8b036c52ab1e6a3fff8a55d586"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"両列の累積run端点のmergeが、値ペア一定区間の完全な分割になる。 残り長の小さいrun分だけ同時に進め、値が等しい区間長を足せば展開せず線形処理できる。","sourceRevisionIds":["source-abc294-e-problem-d40bb560b6160993aa73f42f09a115c61bbbaad510862820393ed2368129667e","source-abc294-editorial-5990-db9e9ebaa6872499fced988dd22b4b7cd0dbed8b036c52ab1e6a3fff8a55d586"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

二つのRLE列は、どちらかのrun端点に到達するまで値の組が変わらない。

採用する候補: 二列のrunを二ポインタでマージ

棄却する候補: 長さLの列へ展開

Lは10^12で保存できない。

各列の現在run値と残長を持ち、d=min(rem1,rem2)だけ進め、値が等しければdを答えへ加え、残長0の側を次runへ移す。

## 典型の発動条件

### RLEの同期走査

発動条件: 同じ巨大長の圧縮列同士を位置ごとに比較する。

run境界を二ポインタでmergeする。

## 問題固有の要素

必要なのは個々の位置でなく二列の境界和集合が作る区間だけである。

別の問題へ持ち帰る視点: 複数RLE列の位置演算は境界イベントを同期処理する。

## 正当性

両列の累積run端点のmergeが、値ペア一定区間の完全な分割になる。 残り長の小さいrun分だけ同時に進め、値が等しい区間長を足せば展開せず線形処理できる。

## 実装上の注意

- 累積長と答えを64ビットで持ち、片側だけrunが終わる場合に他側残長を保持する。

## 復習の核

- 展開可能な短列と比較し、run境界一致・交互境界・全区間同値を確認する。

## 計算量と制約

### 時間

O(N1+N2)、二列のrun数。

### 空間

O(N1+N2)、入力run。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq L\leq 10 ^ {12}; 1\leq N _ 1,N _ 2\leq 10 ^ 5; 1\leq v _ {i,j}\leq 10 ^ 9\ (i\in\lbrace1,2\rbrace,1\leq j\leq N _ i); 1\leq l _ {i,j}\leq L\ (i\in\lbrace1,2\rbrace,1\leq j\leq N _ i); v _ {i,j}\neq v _ {i,j+1}\ (i\in\lbrace1,2\rbrace,1\leq j\lt N _ i); l _ {i,1}+l _ {i,2}+\cdots+l _ {i,N _ i}=L\ (i\in\lbrace1,2\rbrace); All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/tasks/abc294_e) — source-abc294-e-problem-d40bb560b6160993aa73f42f09a115c61bbbaad510862820393ed2368129667e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc294/editorial/5990) — source-abc294-editorial-5990-db9e9ebaa6872499fced988dd22b4b7cd0dbed8b036c52ab1e6a3fff8a55d586
