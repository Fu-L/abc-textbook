---
title: "ABC285-F — Substring of Sorted String"
draft: true
authoringUnit: {"problemId":"abc285-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc285-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc285-editorial-5514-f0cf5ec578f21c4e25e6935f1cfb627c0f33938c92db221be26a2baccff8d67f","source-abc285-f-problem-6d8ce7ff5954705114fc278f73dd10a21f946f8fb7294f88d110aa6306466ab7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間内の各文字数C_a..C_zが分かれば、lからC_a個、次にC_b個という期待blockを置き、各block内の同文字数が長さと等しいかで非減少性を確認できる。 出現する最小・最大文字だけはTのblockを途中から／途中まで使えるが、その間の文字blockは丸ごと含まなければならない。 1点更新と任意区間の文字数をともに対数時間で処理でき、alphabet 26は定数として全条件を検査できる。","sourceRevisionIds":["source-abc285-editorial-5514-f0cf5ec578f21c4e25e6935f1cfb627c0f33938c92db221be26a2baccff8d67f","source-abc285-f-problem-6d8ce7ff5954705114fc278f73dd10a21f946f8fb7294f88d110aa6306466ab7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

S全体を昇順sortしたTは各文字の連続blockからなり、S[l,r]がそのsubstringなら自身も非減少でなければならない。

区間の最小文字cと最大文字dの間にある文字は、T上でblockの途中だけを切り取れないため、S全体にある個数を区間がすべて含む必要がある。

採用する候補: 26文字それぞれの位置数をsegment treeで管理し、区間内個数から非減少性と中間文字の全包含を判定する。

1点更新と任意区間の文字数をともに対数時間で処理でき、alphabet 26は定数として全条件を検査できる。

棄却する候補: 各更新後にS全体をsortし、質問区間が含まれるか文字列検索する。

最大10^5回の更新ごとに線形以上の再構築が必要になる。

棄却する候補: 区間が非減少かだけを確認する。

例えば全体に中間文字が区間外にも残ると、sort後の連続blockと同じsubstringにはならない。

区間内の各文字数C_a..C_zが分かれば、lからC_a個、次にC_b個という期待blockを置き、各block内の同文字数が長さと等しいかで非減少性を確認できる。

出現する最小・最大文字だけはTのblockを途中から／途中まで使えるが、その間の文字blockは丸ごと含まなければならない。

文字ごとに0/1のsegment treeを持つ。更新では旧文字の位置を0、新文字を1にする。質問では26個の区間頻度を取得し、左端から文字順にその頻度長のblockを割り当てて同じ文字が全長を占めるか検査する。さらに最小文字と最大文字の間の各文字について、区間頻度が全体頻度と一致すればYes、どれか崩れればNoとする。

## 典型の発動条件

### 文字種別の動的頻度構造

発動条件: 小さいalphabetの文字列で1点更新と区間頻度queryが混在するとき。

26本のsegment treeで各文字のindicator sumを管理する。

### sorted列のblock条件

発動条件: sort後の列のsubstringになれるかを判定するとき。

端の文字blockだけ部分利用を許し、中間blockの全包含を要求する。

## 問題固有の要素

Tを実際に構築しなくても、文字ごとの全体頻度がblock境界を完全に決めるため、substring条件を頻度と順序の2条件へ分解できる。

別の問題へ持ち帰る視点: 正規形が種類順の連続blockになる問題では、候補の単調性と内部種類の充足を別々に検査する。

## 正当性

区間内の各文字数C_a..C_zが分かれば、lからC_a個、次にC_b個という期待blockを置き、各block内の同文字数が長さと等しいかで非減少性を確認できる。 出現する最小・最大文字だけはTのblockを途中から／途中まで使えるが、その間の文字blockは丸ごと含まなければならない。 1点更新と任意区間の文字数をともに対数時間で処理でき、alphabet 26は定数として全条件を検査できる。

## 実装上の注意

- 更新時はS[x]の旧文字側を必ず減らしてから新文字側を増やし、S本体も更新する。
- 区間に1種類しかない場合は中間文字条件が空になり、block検査だけでYesになり得る。

## 復習の核

- 非減少だが中間文字が区間外に残る例と、最小・最大文字が全体の一部だけ含まれる正例を作り、2条件が独立に必要か確認する。

## 計算量と制約

### 時間

O(26N+26Q log N)、アルファベットサイズ26。

### 空間

O(26N)、文字頻度木。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^5; S is a string of length N consisting of lowercase English letters.; 1 \leq Q \leq 10^5; For each query of the first kind, 1 \leq x \leq N.; For each query of the first kind, c is a lowercase English letter.; For each query of the second kind, 1 \leq l \leq r \leq N.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/editorial/5514) — source-abc285-editorial-5514-f0cf5ec578f21c4e25e6935f1cfb627c0f33938c92db221be26a2baccff8d67f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/tasks/abc285_f) — source-abc285-f-problem-6d8ce7ff5954705114fc278f73dd10a21f946f8fb7294f88d110aa6306466ab7
