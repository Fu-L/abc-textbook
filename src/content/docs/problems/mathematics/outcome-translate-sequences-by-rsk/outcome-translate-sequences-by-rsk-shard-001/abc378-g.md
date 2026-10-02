---
title: "ABC378-G — Everlasting LIDS"
draft: true
authoringUnit: {"problemId":"abc378-g","docPath":"src/content/docs/problems/mathematics/outcome-translate-sequences-by-rsk/outcome-translate-sequences-by-rsk-shard-001/abc378-g.md","learningOutcomeIds":["outcome-translate-sequences-by-rsk"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rsk-young-tableaux","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc378-editorial-11283-7858d0b5d92f979507e886a044d07ad747c4bfb2964eb529a160bec71d3074db","source-abc378-g-problem-0e527fbbc43a6f3092556fb9d7fbef5243aa30226a3e4c71408157867c152ca0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"RSKは順列と同形標準tableau対の全単射。LIS/LDS制約と長さAB−1は長方形右下欠損形を一意に定める。一方のtableauへ課される追加不等式を守り、小数から外角へ置くDPは行列増加を満たす全tableauを一度生成する。もう一方の任意tableau数を掛ければ対応順列数を回復できる。","sourceRevisionIds":["source-abc378-editorial-11283-7858d0b5d92f979507e886a044d07ad747c4bfb2964eb529a160bec71d3074db","source-abc378-g-problem-0e527fbbc43a6f3092556fb9d7fbef5243aa30226a3e4c71408157867c152ca0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Robinson–Schensted対応・Young tableau](src/content/docs/learn/combinatorics-algebra/rsk-young-tableaux.md)

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

RSK 対応では permutation の LIS と LDS が Young 図形の第一行・第一列長になる。長さ AB-1 で両者が A,B なら、形は A×B 長方形から右下1マスを除いたものに一意に定まる。

採用する候補: 条件を満たす標準 Young tableau を、1..AB-1 を置く順の ideal 状態 DP で数え、末尾追加条件に対応する右端列の不等式も遷移可否へ組み込む。

AB≤120 でも可能な Young 図形 ideal の状態数は制約内で50万程度に抑えられ、RSK の一対一対応から permutation 数を復元できる。

棄却する候補: (AB-1)! 個の permutation を列挙して LIS/LDS と追加後の条件を検査する。

AB は120まであり階乗列挙は不可能で、LIS/LDS だけの DP も追加条件の tableau 情報を失う。

末尾に n+0.5 を加えて長方形へなる挿入過程は、元 tableau で t_{i+1,A-1}<t_{i,A} という追加順序制約に翻訳できる。

小さい数から埋める途中状態は左上に閉じた ideal で、行ごとの充填長という境界 path だけで表せる。

長方形欠損形の各行の充填長を状態にし、標準 tableau の行列増加条件と追加の右端不等式を壊さない外角へ次の数を置く DP を行う。得た tableau 数を RSK のもう一方の tableau 数と組み合わせる。

## 典型の発動条件

### Robinson–Schensted 対応

発動条件: permutation の LIS/LDS を同時に固定して数えたいとき。

LIS/LDS 条件を Young 図形の形へ変換する。

### Young 図形 ideal DP

発動条件: 小さな面積の標準 tableau に追加順序制約があるとき。

埋め済み領域の境界だけを状態として数える。

## 問題固有の要素

長さが長方形面積より1小さいことが、LIS/LDS の上限から tableau 形を完全に固定する。

別の問題へ持ち帰る視点: 追加要素の row insertion を追うと、難しい第三条件が既存セル間の局所不等式になる。

## 正当性

RSKは順列と同形標準tableau対の全単射。LIS/LDS制約と長さAB−1は長方形右下欠損形を一意に定める。一方のtableauへ課される追加不等式を守り、小数から外角へ置くDPは行列増加を満たす全tableauを一度生成する。もう一方の任意tableau数を掛ければ対応順列数を回復できる。

## 実装上の注意

- 欠ける右下セルと row/column の向きを統一し、追加不等式を満たさない外角遷移を除く。法 M は入力の素数で前計算範囲も AB までとする。

## 復習の核

- RSK の P,Q tableau のどちらが何通り寄与するかと、末尾 n+0.5 の bumping path が右端不等式を生む過程を図で復習する。

## 計算量と制約

### 時間

O(S·AB)。Sは右下欠損形のorder ideal状態数。各状態から外角を列挙する。

### 空間

O(S+AB)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 2 \leq A, B; AB \leq 120; 10^8 \leq M \leq 10^9; M is a prime.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/editorial/11283) — source-abc378-editorial-11283-7858d0b5d92f979507e886a044d07ad747c4bfb2964eb529a160bec71d3074db
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc378/tasks/abc378_g) — source-abc378-g-problem-0e527fbbc43a6f3092556fb9d7fbef5243aa30226a3e4c71408157867c152ca0
