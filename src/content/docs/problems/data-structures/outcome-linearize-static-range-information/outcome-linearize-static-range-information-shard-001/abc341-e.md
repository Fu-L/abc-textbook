---
title: "ABC341-E — Alternating String"
draft: true
authoringUnit: {"problemId":"abc341-e","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc341-e.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc341-e-problem-f4e2b13f0ec3f2b9861cae0204dc63ce25ce852d34c9cc224eff6680d4dda972","source-abc341-editorial-9325-a380e12aee45a16b3b4b750da58091f560e37101f4eaf926fc833b5552745def"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"[L,R]を全反転すると、両方反転される内部pair(L≤i<R)の等しい/異なる関係は保存される。片側だけ反転されるA_{L-1}とA_Rのみ0↔1になる。 長いflip queryがAの高々二点更新に縮み、判定も区間和比較でO(log N)になる。","sourceRevisionIds":["source-abc341-e-problem-f4e2b13f0ec3f2b9861cae0204dc63ce25ce852d34c9cc224eff6680d4dda972","source-abc341-editorial-9325-a380e12aee45a16b3b4b750da58091f560e37101f4eaf926fc833b5552745def"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

先に読む単元:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

隣接pairの関係A_i=[S_i≠S_{i+1}]を持つと、substring S[L..R]がalternatingである条件はA_L,…,A_{R-1}が全て1であることになる。区間全体のbit反転は内部pairの等否を変えず、両境界だけを反転する。

採用する候補: 隣接差配列へ変換し、境界point flipとrange sumを処理する

棄却する候補: Sの各文字をlazy segment treeでrange flipしquery時に隣接比較する

実現可能だが、内部の隣接関係が不変という差分表現を使う方が状態と更新が単純になる。

長さN-1のAを構築し、sum segment treeまたはFenwick treeへ入れる。type 1ではL>1ならA_{L-1}、R<NならA_Rをtoggleしてpoint updateする。type 2ではsum(A_L…A_{R-1})=R-LならYes、そうでなければNo。

## 典型の発動条件

### 隣接差分表現

発動条件: 区間内全要素へ同じinvolutionを施し、内部の相対関係が不変である。

元bit列でなく隣接する二bitの異同を状態にし、range updateを境界更新へ変える。

### point update・range sum

発動条件: binary配列の二点toggleと、区間が全1かの判定が必要である。

Fenwick/segment treeで区間和を取り、区間長との一致を調べる。

## 問題固有の要素

alternating判定に実際の0/1値は不要で、隣接が異なるかだけを保てば、range flipの影響はdifference arrayと同じく境界へ集中する。

別の問題へ持ち帰る視点: 一様なrange変換で内部relationが保存されるならrelation列を持つとlazy更新を消せる。

## 正当性

[L,R]を全反転すると、両方反転される内部pair(L≤i<R)の等しい/異なる関係は保存される。片側だけ反転されるA_{L-1}とA_Rのみ0↔1になる。 長いflip queryがAの高々二点更新に縮み、判定も区間和比較でO(log N)になる。

## 実装上の注意

- L=1では左境界、R=Nでは右境界が存在しない。L=Rのqueryは比較区間が空で常にYesとし、N=1の長さ0配列を扱う。

## 復習の核

- N=1、全区間flip、単一点flip、同じ区間の二回flip、L=Rを文字列直接更新と比較する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)、隣接等否配列。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\leq N, Q\leq 5\times 10^5; S is a string of length N consisting of 0 and 1.; 1\leq L\leq R\leq N for queries of types 1 and 2.; There is at least one query of type 2.; N, Q, L, and R are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc341/tasks/abc341_e) — source-abc341-e-problem-f4e2b13f0ec3f2b9861cae0204dc63ce25ce852d34c9cc224eff6680d4dda972
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc341/editorial/9325) — source-abc341-editorial-9325-a380e12aee45a16b3b4b750da58091f560e37101f4eaf926fc833b5552745def
