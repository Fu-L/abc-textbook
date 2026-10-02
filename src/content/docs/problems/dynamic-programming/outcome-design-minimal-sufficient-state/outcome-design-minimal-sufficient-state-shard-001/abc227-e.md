---
title: "ABC227-E — Swap"
draft: true
authoringUnit: {"problemId":"abc227-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc227-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc227-e-problem-b7746806d6e5e8256f10091efbe52d7fe25dc98cb8ba800e471036eab2cb6346","source-abc227-editorial-2908-358e7d8a2b86537142f6687ab98ecfa660c27ed9ffe5d91d9fbcddbb60c60455"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同じ文字は左から順に対応させるのが最小swapの対応で、交差した同文字の対応を交換しても完成文字列は変わらず費用を減らせる。使用済みの各文字数が決まれば未使用の残列が一意に決まり、次に使う文字を先頭へ移す費用はその残列内順位。完成列prefixを文字数三つと累積費用へ圧縮しても将来遷移は同じだから合流できる。各完成文字列には文字種の選択列が一意に対応し、swap列の重複を数えない。","sourceRevisionIds":["source-abc227-e-problem-b7746806d6e5e8256f10091efbe52d7fe25dc98cb8ba800e471036eab2cb6346","source-abc227-editorial-2908-358e7d8a2b86537142f6687ab98ecfa660c27ed9ffe5d91d9fbcddbb60c60455"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

文字種は K・E・Y の3種類だけだが、長さ30では完成文字列の全列挙は最大で3^30通りになり得る。一方、隣接swap回数は高々30×29/2であり、完成文字列を左から決めたときの使用文字数と累積swap回数は小さい。

たとえば KEY から1回以内なら、先頭へ選ぶ文字を K・E・Y のどれにするかで残りの並びと追加費用を追える。同じ文字を区別して並べる必要はなく、各文字を何個使ったかだけが本質になる。

棄却する候補: K・E・Y の全ての異なる順列を生成し、各完成文字列への最小隣接swap回数を求める。

文字種が3つでも異なる順列数は指数的で、長さ30の制約を処理できない。

採用する候補: 完成文字列を左から作り、使用済みのK・E・Yの個数と累積swap回数を状態にするDPを行う。

次に選ぶ文字の元文字列中の左端未使用位置と、それを現在位置まで運ぶ費用は、3文字の使用個数だけから一意に復元できる。

完成文字列Tを固定したときは、Sを左からTへ合わせ、必要な文字の左端未使用出現を手前へ動かす貪欲法が最小swap回数を与える。より後ろの同文字を先に使っても交差が増えるだけで得をしない。

同じ(K使用数,E使用数,Y使用数)に達した後の未使用文字列は常に同じなので、そこまでの具体的なswap列を保持せず、費用別の個数だけを合流できる。

dp[k][e][y][c]を、各文字をその個数だけ使ったprefixを費用cで作る異なる方法数とする。次の文字種を選び、その文字の左端未使用出現が現在の残列で何番目かを追加費用として遷移し、c≤Kの最終状態を合計する。

## 典型の発動条件

### 固定した目標列への最小隣接swapを左から確定する貪欲法

発動条件: 重複要素を含む列を隣接swapだけで目標順へ変え、最小操作回数を評価したいとき。

目標の次要素と同じ値のうち元列で最も左の未使用要素を選び、飛び越す未使用要素数を費用にする。

### 少数種類の使用個数DP

発動条件: 要素数は大きくても種類数が小さく、同種要素を何個使ったかで残りの状態が決まるとき。

3文字の使用個数とswap費用を状態にし、同じ完成prefixを生成する重複を作らずに全ての異なる結果を数える。

## 問題固有の要素

元文字列の残り方が使用個数だけで一意になるのは、各文字種について出現順を入れ替える必要がないからである。

別の問題へ持ち帰る視点: 重複要素の並べ替えでは個体を区別する前に、同種要素の相対順を固定できる交換論がないか確認する。

## 正当性

同じ文字は左から順に対応させるのが最小swapの対応で、交差した同文字の対応を交換しても完成文字列は変わらず費用を減らせる。使用済みの各文字数が決まれば未使用の残列が一意に決まり、次に使う文字を先頭へ移す費用はその残列内順位。完成列prefixを文字数三つと累積費用へ圧縮しても将来遷移は同じだから合流できる。各完成文字列には文字種の選択列が一意に対応し、swap列の重複を数えない。

## 実装上の注意

- Kは入力上10^9でも必要なswap回数は高々N(N-1)/2なので、費用次元はその最小値までに切り詰める。
- 次の同文字の位置から、既に使用してその手前から消えた文字数を引いて追加費用を求める。

## 復習の核

- まず完成列を固定した小問を解き、左端未使用の同文字を選ぶ貪欲性を説明してから、その過程を数え上げDPへ持ち上げる。
- 状態に元の位置集合まで持ちたくなったら、同種文字の相対順を固定することで使用個数へ圧縮できないかを再確認する。

## 計算量と制約

### 時間

L=|S|、C=min(K,L(L−1)/2)としてO(L³C)。次文字位置・費用は事前計算でO(1)参照する。

### 空間

O(L³C)。rollingで使用総数を省けるが、ここでは全状態を保持。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq |S| \leq 30; 0 \leq K \leq 10^9; S consists of K, E, Y.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/tasks/abc227_e) — source-abc227-e-problem-b7746806d6e5e8256f10091efbe52d7fe25dc98cb8ba800e471036eab2cb6346
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc227/editorial/2908) — source-abc227-editorial-2908-358e7d8a2b86537142f6687ab98ecfa660c27ed9ffe5d91d9fbcddbb60c60455
