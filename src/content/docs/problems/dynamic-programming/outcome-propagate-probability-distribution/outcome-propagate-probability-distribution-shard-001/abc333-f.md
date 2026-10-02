---
title: "ABC333-F — Bomb Game 2"
draft: true
authoringUnit: {"problemId":"abc333-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc333-f.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-transition-acceleration","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc333-editorial-7948-878d3c4235c73de09b12d30fc039195e9b1841d59732fe12bea2294109950431","source-abc333-f-problem-5cc10600d7c767aafc3b18bc813406a6568df55bfe456eb9dcd8c41c7789f235"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"人数mの先頭から位置kで最初に除去が起きる確率は、先のk−1人が失敗してk人目が成功する確率を、一周全失敗の幾何級数で正規化したp^k/(1−p^m)である。各最初除去位置の後は人数m−1の同じゲームなので、その生存確率rowを回転して重み付き和を取れば人数mのrowとなる。隣接位置の和はほぼp倍のshiftで、円環を跨ぐ一項だけを補正すればよい。この代数変形は全除去位置の和を保つため、先頭位置だけ全和を計算して残りを定数更新しても同じ確率分布になる。","sourceRevisionIds":["source-abc333-editorial-7948-878d3c4235c73de09b12d30fc039195e9b1841d59732fe12bea2294109950431","source-abc333-f-problem-5cc10600d7c767aafc3b18bc813406a6568df55bfe456eb9dcd8c41c7789f235"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

列にi人いる状態から最初の一人が除かれるまで、除去されず末尾へ回る操作が何周でも続き得る。最初に除かれる位置kの確率は、一周分の確率へ無限等比級数を足すことで閉じた式にできる。

採用する候補: 人数iと先頭からの位置jを状態にする確率DPを、隣接j間の漸化式で高速化する

素朴な除去位置全和を最初のjだけ計算し、残りをO(1)更新して全体O(N^2)にできる。

棄却する候補: 各dp[i][j]から全ての除去位置へ三重loopで遷移する

状態O(N^2)に一遷移O(N)が掛かるO(N^3)となり、N=3000では重い。

除去確率p=1/2とすると、i人中の位置kが最初に除かれる確率はp^k/(1-p^i)である。新しいrowのjとj+1の加重和はほぼp倍のshiftで、wrapする一項だけ補正すればよく、正規化後はnew[j+1]=p·new[j]+p·old[j]となる。

dp[1][0]=1から人数を一人ずつ増やす。m人のnew[0]はdp[m-1]を逆順にpの冪で重み付けしp/(1-p^m)を掛けてO(m)で求める。その後j=0,…,m-2についてnew[j+1]=p(new[j]+dp[m-1][j])でrowを埋め、dp[N]を出力する。

## 典型の発動条件

### 吸収までの無限等比級数

発動条件: 同じ列配置が一周ごとに確率p^iを掛けて再訪される。

一周内で位置kが除かれる確率を1/(1-p^i)で正規化する。

### DP遷移のsliding更新

発動条件: 隣接する出力状態の畳み込み重みが一段shiftし、一項だけ出入りする。

new[0]だけ全和を計算し、new[j+1]をnew[j]とold[j]から定数時間で更新する。

## 問題固有の要素

確率過程を一操作ずつ追わず「現在人数から最初に誰が消えるか」までまとめると、人数が一つ減る有限DPへ変換できる。

別の問題へ持ち帰る視点: 自己loopを含む確率過程は、次に状態が本質的に変化する時点までを幾何級数で吸収するとDAG状DPにできる。

## 正当性

人数mの先頭から位置kで最初に除去が起きる確率は、先のk−1人が失敗してk人目が成功する確率を、一周全失敗の幾何級数で正規化したp^k/(1−p^m)である。各最初除去位置の後は人数m−1の同じゲームなので、その生存確率rowを回転して重み付き和を取れば人数mのrowとなる。隣接位置の和はほぼp倍のshiftで、円環を跨ぐ一項だけを補正すればよい。この代数変形は全除去位置の和を保つため、先頭位置だけ全和を計算して残りを定数更新しても同じ確率分布になる。

## 実装上の注意

- pはmod 998244353で2の逆元として扱い、1-p^mの逆元を用いる。0-index/1-indexと逆順重み、new rowで参照するold rowの人数を混同しない。

## 復習の核

- N=2を手計算の(1/3,2/3)と照合し、各Nで確率総和が1になること、O(N^3)の直接遷移と小Nで一致することを確認する。

## 計算量と制約

### 時間

O(N²)、人数mのrow先頭O(m)、残位置はO(1)shift更新。

### 空間

O(N)、rolling二row。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 3000; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/editorial/7948) — source-abc333-editorial-7948-878d3c4235c73de09b12d30fc039195e9b1841d59732fe12bea2294109950431
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/tasks/abc333_f) — source-abc333-f-problem-5cc10600d7c767aafc3b18bc813406a6568df55bfe456eb9dcd8c41c7789f235
