---
title: "ABC471 F — Concat (maximize)"
draft: true
authoringUnit: {"problemId":"abc471-f","docPath":"src/content/docs/problems/updates/abc471-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc471-f-problem-cbcda46a031d8fea3d3fcc425063cf664edda26186042687351e5db5b1b4a357","source-abc471-editorial-23914-8d29d914015637b09c93f8f3c24769fc614eea176d06872d7043983c8a478d52"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同一集合では桁数が一定なので、隣接二文字列の交換による辞書順比較で最適連結順を証明できる。先頭Xが非零なら残りTの桁数を優先し、同桁数では各要素の値順による交換が最適性を保つ。Xの順位がK以内か外かで残りの最適集合が二種類に固定され、外の場合の共通Tに対してXの数値最大化が最適である。","sourceRevisionIds":["source-abc471-f-problem-cbcda46a031d8fea3d3fcc425063cf664edda26186042687351e5db5b1b4a357","source-abc471-editorial-23914-8d29d914015637b09c93f8f3c24769fc614eea176d06872d7043983c8a478d52"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

## 考察

連結順と選択集合を同時に探すと難しいので分ける。固定集合の最適順はABとBAを比べ、大きい方を前に置く順である。INT(A)/(10^{|A|}−1)という有理数順と同値なので比較に推移律があり、隣接交換によってこの順へ直せる。

選択集合は長さ、整数値の順に降順ソートしてS_1,…,S_Nとする。先頭として使う一文字列Xを固定し、その整数値が非零なら、残りの連結Tではまず桁数を最大化し、同じ桁数なら整数値を最大化したい。従ってX以外のK−1文字列はこのキー順の先頭から取れる。Xが先頭K個の中にあれば選択集合は上位K個。Xが外なら残りは上位K−1個に固定され、Xは残りの中で整数値が最大のものを選べばよい。

よって上位K個を選ぶ集合と、上位K−1個+残りの整数値最大の集合の二通りだけを作り、それぞれAB≥BA順に連結する。完成文字列の先頭0を落とし、桁数、辞書順の順に二候補を比較する。全て0の場合は0。先頭が0しか選べない場合も、この場合分けで最大値0が得られる。

選択用の長さ順と連結用のAB順は目的が異なるため、一つのソート順に統合しない。

## 典型の発動条件

選択と配置を分け、先頭の一要素を条件づけて候補集合を縮める。連結比較ABとBAは比率順で推移律を確認できる。

## 問題固有の要素

先頭0があるため最長文字列をK個選ぶだけでは足りず、短くても先頭へ大きい整数値を置く候補が必要。

## 正当性

同一集合では桁数が一定なので、隣接二文字列の交換による辞書順比較で最適連結順を証明できる。先頭Xが非零なら残りTの桁数を優先し、同桁数では各要素の値順による交換が最適性を保つ。Xの順位がK以内か外かで残りの最適集合が二種類に固定され、外の場合の共通Tに対してXの数値最大化が最適である。

## 実装上の注意

INTは10桁までなので64 bit整数。連結比較は文字列で行う。K=1も二候補の式で扱い、全0を空出力にしない。

## 復習の核

『長い方が大きい』は先頭が非零のときだけ。選択基準と配置基準をそれぞれ証明する。

## 計算量と制約

### 時間

最大文字列長をL≤10として O(NL log N+KL log K)。

### 空間

入力 O(NL)、二候補の出力 O(KL)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 10^5; S_i is a string of length between 1 and 10 (inclusive) consisting of digits.; N and K are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc471/tasks/abc471_f)
- [公式解説](https://atcoder.jp/contests/abc471/editorial/23914)
