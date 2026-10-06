---
title: "ABC475 G — Has Many Divisors"
draft: true
authoringUnit: {"problemId":"abc475-g","docPath":"src/content/docs/problems/updates/abc475-g.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc475-g-problem-c90a2a62cba5145b3dc48735c8e4dcd6735155e9bbea41e641280632eea9ac93","source-abc475-editorial-25542-e94ba01f77a4d7104c74746c7021a9a897b9b576f6ec5dedc94e14eba310d8ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最小最適解にはDの素数指数が不足するpがある。p以外の指数逆転は小さい素数への交換で約数数と非倍数性を保ったまま数値を下げるので存在しない。pより小さい素数の指数もe_p未満では同じ交換が可能である。この必要な形を全て含む例外一つのDFSに最適解が必ず現れ、候補から制約を満たす最大約数数を選べば正解となる。","sourceRevisionIds":["source-abc475-g-problem-c90a2a62cba5145b3dc48735c8e4dcd6735155e9bbea41e641280632eea9ac93","source-abc475-editorial-25542-e94ba01f77a4d7104c74746c7021a9a897b9b576f6ec5dedc94e14eba310d8ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

## 考察

約数数τ(x)=Π(e_i+1)を最大化する。通常の高度合成数探索は小さい素数ほど指数を大きくするが、Dの倍数禁止があるため単純な非増加指数だけでは不足する。最小の最適解xでは、Dに含まれるある素数pの指数が不足する。そのp以外の素数の指数は非増加にできる。q<r、q,r≠pでe_q<e_rなら指数を交換すれば約数数を保って数値を下げ、p不足も保存できるからである。

pを例外として、素数列に沿う指数列が『高々一箇所を取り除けば非増加』になる整数を前計算する。DFS状態は現在の積x、約数数d、通常指数の上限cap、例外を使用済みか。次の素数rについてr^eを掛け、e≤capなら通常枝へ進め上限をeにする。一度だけ、eを以前の指数以下に選びつつcapを更新せず例外枝へ進める。指数0も例外として必要で、小さい素数を飛ばして次の素数を使う候補を落としてはならない。

pが入力素数列の外にあるなら、通常の非増加列だけでpの指数不足を満たす。素数は例外を一つ飛ばした最小素数積が10^18を超える深さまで用意すれば十分。積の上限は10^18として候補を重複排除し、各テストでx≤Nかつx mod D≠0を満たす最大dを選ぶ。

約数数の最大化は探索候補数Cに依存する。各掛算を x≤10^18/r で制限し、前計算したCを実測・記録する。N全列挙やDの10^18に対する試し割りは不要。

## 典型の発動条件

極値を取る最小代表を選び、指数交換で探索形を制限する。追加禁止条件が一つの素数指数の例外として表せる。

## 問題固有の要素

Dの倍数でないことを一つの不足素数で証明するため、その素数だけ指数順の例外を許す。

## 正当性

最小最適解にはDの素数指数が不足するpがある。p以外の指数逆転は小さい素数への交換で約数数と非倍数性を保ったまま数値を下げるので存在しない。pより小さい素数の指数もe_p未満では同じ交換が可能である。この必要な形を全て含む例外一つのDFSに最適解が必ず現れ、候補から制約を満たす最大約数数を選べば正解となる。

## 実装上の注意

乗算前に除算で上限を判定する。x=1は常に候補。指数0の例外を含める。約数数が同じなら小さいxを残せる。

## 復習の核

高度合成数の指数順を丸暗記せず、禁止条件がその交換論のどこを壊すか調べる。

## 計算量と制約

### 時間

前計算は候補数Cと素数深さBに対し O(CB)。Tテストの走査 O(TC)。

### 空間

候補配列 O(C)、DFS深さ O(B)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10; 2 \leq D \leq N \leq 10^{18}; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc475/tasks/abc475_g)
- [公式解説](https://atcoder.jp/contests/abc475/editorial/25542)
