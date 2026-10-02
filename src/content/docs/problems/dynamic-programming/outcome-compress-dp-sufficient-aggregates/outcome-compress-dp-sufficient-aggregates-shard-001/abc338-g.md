---
title: "ABC338-G — evall"
draft: true
authoringUnit: {"problemId":"abc338-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-compress-dp-sufficient-aggregates/outcome-compress-dp-sufficient-aggregates-shard-001/abc338-g.md","learningOutcomeIds":["outcome-compress-dp-sufficient-aggregates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc338-editorial-9174-882059f710a8b5642f21646998075bd40604d5e3f4d7126ba9d98fc60c7a2892","source-abc338-g-problem-a4019826c94c7dc9ace7c734f2b75a77c98320c82f74f0980e601b9db60fac08"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"数字位置から始まる各有効候補式を、確定済み加算部分preと現在の乗算係数mul、現在数numに分けて保持する。digit連結はnumを10num+dへ、*は現在termを次のmulへ、+は現在termをpreへ確定する。従ってpre,mul,term=mul×numの総和と開始数だけで全候補への同じ写像を適用できる。各digit位置で新開始を一つ加え、その位置で終わる候補のpre+termを足せば、全有効substringを開始・終了位置ごとに一回数える。演算子で終わるものを加算しないので不正な式も入らない。","sourceRevisionIds":["source-abc338-editorial-9174-882059f710a8b5642f21646998075bd40604d5e3f4d7126ba9d98fc60c7a2892","source-abc338-g-problem-a4019826c94c7dc9ace7c734f2b75a77c98320c82f74f0980e601b9db60fac08"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

全substringを個別評価する代わりに、各digit位置を右端とする全有効startの式評価値をまとめて更新する。通常の式を「+で確定済みの和pre」と「現在の乗算項term」に分ければ、digit・+・*ごとの更新が線形になる。

採用する候補: 全開始位置に対する式状態の総和をconstant個の集約変数でstreaming更新する

各文字を一度処理し、数の連結・加算・乗算の優先順位を保ったままO(|S|)で全substring和を得られる。

棄却する候補: 全O(|S|^2) substringを切り出して式評価する

|S|は10^6で、substring数だけで二乗になる。

各active startについてpre、現在数へ掛かる係数mul、現在項term=mul×numを考える。総和だけ持てばdigit dでtermSum←10·termSum+d·mulSum+d、mulSum←mulSum+1となる。+ではpreSum←preSum+termSum,mulSum←startCount、*ではmulSum←termSumとなりtermSumを0へ戻せる。

左から走査し、active start数cnt、Σpre、Σmul、Σtermをmodで保持する。digitでは既存の数を10倍してdを足す更新に加え、その位置から始まる新substring状態(pre=0,mul=1,term=d)を追加し、preSum+termSumを答えへ足す。+と*では上記の状態変換だけを行う。

## 典型の発動条件

### 式評価stateの線形集約

発動条件: 多数の開始位置の式を同じsuffix文字で同時に延長し、必要演算が和と積に分解できる。

個別状態のpre・mul・termの総和を保ち、線形な更新を一括適用する。

### 乗算優先順位の遅延評価

発動条件: 通常の+と*を左から読み、未確定の乗算chainだけを保持したい。

加算済み項preと進行中termを分離し、*ではtermの係数を次factorへ引き継ぐ。

## 問題固有の要素

substring開始はdigit位置ごとに一つ新状態を追加すればよく、終了については各digit時点の全active式評価和を答えへ加えるだけで全(i,j)を一度ずつ数えられる。

別の問題へ持ち帰る視点: 全substring集計は、左端ごとの状態を可換な統計量へ圧縮できればonlineに新規開始と全終了を処理できる。

## 正当性

数字位置から始まる各有効候補式を、確定済み加算部分preと現在の乗算係数mul、現在数numに分けて保持する。digit連結はnumを10num+dへ、*は現在termを次のmulへ、+は現在termをpreへ確定する。従ってpre,mul,term=mul×numの総和と開始数だけで全候補への同じ写像を適用できる。各digit位置で新開始を一つ加え、その位置で終わる候補のpre+termを足せば、全有効substringを開始・終了位置ごとに一回数える。演算子で終わるものを加算しないので不正な式も入らない。

## 実装上の注意

- operator位置ではsubstringを答えへ加えず、digit位置だけを右端とする。*更新でpreは確定せず、+更新でのみtermをpreへ移す。全演算をmod 998244353で行う。

## 復習の核

- 数字だけの12、1+2、2*3、1+2*34、12*3+4を全substring直接評価し、streaming状態と比較する。

## 計算量と制約

### 時間

O(L)、Lは式長、開始位置群の四集約を文字ごとに更新。

### 空間

O(1)補助。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq |S| \leq 10^6; Each character of S is one of 123456789+*.; The first and last characters of S are digits.; There are no adjacent non-digit characters in S.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc338/editorial/9174) — source-abc338-editorial-9174-882059f710a8b5642f21646998075bd40604d5e3f4d7126ba9d98fc60c7a2892
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc338/tasks/abc338_g) — source-abc338-g-problem-a4019826c94c7dc9ace7c734f2b75a77c98320c82f74f0980e601b9db60fac08
