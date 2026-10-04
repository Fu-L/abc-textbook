---
title: "ABC416-G — Concat (1st)"
draft: true
authoringUnit: {"problemId":"abc416-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc416-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc416-editorial-13508-3cc358d000363441e0ec6cd32eabc27e757847b39f72389ef8f6cce98c7f016c","source-abc416-g-problem-9ebb537408e3fffb9e134910629c6205717daff6a09cae6b38632ffe13119338"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"XYとYXを比較する交換法で辞書順を悪化させず文字列を並べ替えられる。最小要素の無限反復より早く小さい文字を出す候補は存在せず、S_minをK回使ったprefixが実現可能。従って最適有限列はこの無限反復のprefixに限られる。同じ無限列のprefix同士では短い方が辞書順で小さい。phaseと使用個数のDPは、入力に存在する一致部分文字列を一つずつつなぐ全分割を網羅し、ちょうどK個で実現できる最短prefixを求める。","sourceRevisionIds":["source-abc416-editorial-13508-3cc358d000363441e0ec6cd32eabc27e757847b39f72389ef8f6cce98c7f016c","source-abc416-g-problem-9ebb537408e3fffb9e134910629c6205717daff6a09cae6b38632ffe13119338"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

特殊順序X≼YをX+Y<Y+X（同値時X≤Y）で定めた最小文字列S_minの無限反復T∞は、選択回数を無限にしたときの辞書順最小列になる。 有限Kの最小連結T_KはT∞のprefixでなければならず、問題は「入力文字列をちょうどK個使って作れるT∞のprefixのうち最短」を求めることへ変わる。 あるphase pから選べるS_iはT∞[p:p+|S_i|]と完全一致するものだけで、それ以外を一度選ぶと生成列はT∞のprefixではなくなる。 同じphase・使用個数へ到達するprefixは長さが短い方だけ残せばよい。次phaseは(p+ℓ) mod |S_min|で決まり、実文字列をDPに保存する必要はない。

採用する候補: T∞のphase pと使用文字列数nを状態に、prefix一致する入力長だけで最短総長を更新するDP

|S_min|≤10、各S_i長≤10なので、phase pごとにどの長さℓのprefix文字列が入力に存在するかを前計算すればO(K|S_min|·10)で解ける。

棄却する候補: 各stepで現在の候補文字列へ全N文字列を連結し、辞書順最小の実文字列を保持する

O(NK)遷移と最大10K文字の比較・copyが必要で、prefix構造と短い文字列長を利用していない。

あるphase pから選べるS_iはT∞[p:p+|S_i|]と完全一致するものだけで、それ以外を一度選ぶと生成列はT∞のprefixではなくなる。

同じphase・使用個数へ到達するprefixは長さが短い方だけ残せばよい。次phaseは(p+ℓ) mod |S_min|で決まり、実文字列をDPに保存する必要はない。

比較X+Y vs Y+XでS_minを求めm=|S_min|とする。各phase p=0..m-1、長さℓ=1..10についてT∞の対応substringと等しい入力文字列があるかavailable[p][ℓ]を作る。dp[0][0]=0からK回、availableなℓでphaseを進め総長を最小化し、min_p dp[K][p]文字のT∞prefixを出力する。

## 典型の発動条件

### concatenation comparator

発動条件: 文字列を反復・連結した辞書順を比較してcanonical最小blockを選ぶとき。

X+YとY+X、同値時のX≤Yで全順序を作り最小Sを選ぶ。

### 周期文字列上のphase DP

発動条件: 目標が短いperiodの無限文字列prefixで、可変長tokenを連結するとき。

現在位置mod periodとtoken数だけを状態にして一致token長を遷移する。

### 候補文字列の長さ別圧縮

発動条件: 文字列長上限が小さく、同じ内容・長さの候補が遷移上同値なとき。

phaseごとに利用可能な長さのbooleanへN文字列を圧縮する。

## 問題固有の要素

辞書順最小列そのものを比較し続けず、無限最適列のprefixであるという強い必要条件から、目的を最短prefix長へ反転する。

別の問題へ持ち帰る視点: 有限最適解がcanonical無限列のprefixになる問題では、lex比較を消してtokenizationの最短長DPへ落とせる。

## 正当性

XYとYXを比較する交換法で辞書順を悪化させず文字列を並べ替えられる。最小要素の無限反復より早く小さい文字を出す候補は存在せず、S_minをK回使ったprefixが実現可能。従って最適有限列はこの無限反復のprefixに限られる。同じ無限列のprefix同士では短い方が辞書順で小さい。phaseと使用個数のDPは、入力に存在する一致部分文字列を一つずつつなぐ全分割を網羅し、ちょうどK個で実現できる最短prefixを求める。

## 実装上の注意

- X+Y=Y+Xのtie-breakまで≼比較に入れる。T∞ substringはmod mで生成し、dpはexactly K個、到達不能を∞、出力長は最大10Kとして構成する。

## 復習の核

- 同じ文字列重複、'a'と'aa'の可換tie、最短prefixに複数tokenizationがある例を小N,Kの全列挙と比較する。

## 計算量と制約

### 時間

文字数上限 L=10、m=|S_min|≤L。最小比較とavailable構築 O(NmL)、回数DP O(KmL)、出力長 Z≤KL で O(Z)。

### 空間

phase×長さ候補 O(mL)、rollingDP O(m)、入力総長 O(NL)、出力 O(Z)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 10^5; 1\leq K \leq 10^5; S_i is a string consisting of lowercase English letters with length at most 10.; N and K are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc416/editorial/13508) — source-abc416-editorial-13508-3cc358d000363441e0ec6cd32eabc27e757847b39f72389ef8f6cce98c7f016c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc416/tasks/abc416_g) — source-abc416-g-problem-9ebb537408e3fffb9e134910629c6205717daff6a09cae6b38632ffe13119338
