---
title: "ABC253-E — Distance Sequence"
draft: true
authoringUnit: {"problemId":"abc253-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc253-e.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc253-e-problem-0ff7727e69a800ed6aa6bec68cb3e8676c00ec61fe523bf2f16afcc1ec5aa533","source-abc253-editorial-4018-2d52449d4b7b11ea03e570f282c8b0ba4362cd0103953f65a58ce9e3b3b1bc6e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"直前値と現在値の差条件は許可範囲の和で表せる。prefix和で小さい側と大きい側の二範囲を正確に加えるので通常の全直前値DPと同じ。K=0では二範囲が重なるため全体和を一回だけ使う。","sourceRevisionIds":["source-abc253-e-problem-0ff7727e69a800ed6aa6bec68cb3e8676c00ec61fe523bf2f16afcc1ec5aa533","source-abc253-editorial-4018-2d52449d4b7b11ea03e570f282c8b0ba4362cd0103953f65a58ce9e3b3b1bc6e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

隣接値jに対して選べない直前値は[j-K+1,j+K-1]という一つの連続区間であり、許される値はその補集合になる。 dp[i][j]を長さiで末尾jの列数とすると、次状態は前行の全体和からjの周囲K-1以内の区間和を除いた値である。 K=0では禁止区間が空になり、左右区間を別々に足す実装だと全体を二重計数しやすいので専用に全体和を使う。

採用する候補: 直前値DPと累積和

全直前値の総和から禁止区間和を引けば各遷移を定数時間で求められ、N M状態を処理できる。

棄却する候補: 各状態から全ての次値を試す

遷移がM倍となってO(N M^2)かかり、M=5000では過大になる。

dp[i][j]を長さiで末尾jの列数とすると、次状態は前行の全体和からjの周囲K-1以内の区間和を除いた値である。

K=0では禁止区間が空になり、左右区間を別々に足す実装だと全体を二重計数しやすいので専用に全体和を使う。

各長さについて前行dpの累積和を作る。各末尾値jへ、K=0なら全体和、そうでなければ範囲外の[1,j-K]と[j+K,M]の和を加えて遷移し、法998244353で最終行を合計する。

## 典型の発動条件

### 累積和付きDP

発動条件: 前行の連続区間和を多数の次状態から参照する。

直前値方向の累積和を毎行作り、許可区間の和を定数時間で取る。

### 補集合遷移

発動条件: 禁止条件が短い連続区間として表せる。

全候補和から禁止帯の和を引いて遷移を計算する。

## 問題固有の要素

絶対値差の条件は値軸上の連続した禁止帯になるため、遷移先ごとの候補列挙を区間和へ置き換えられる。

別の問題へ持ち帰る視点: 遷移条件が区間または少数区間の和で書けるDPでは、状態軸の累積和を第一候補にする。

## 正当性

直前値と現在値の差条件は許可範囲の和で表せる。prefix和で小さい側と大きい側の二範囲を正確に加えるので通常の全直前値DPと同じ。K=0では二範囲が重なるため全体和を一回だけ使う。

## 実装上の注意

- 区間端を1とMで切り詰め、空区間は0とする。減算は法で正規化し、K=0だけは許可集合が全体であることを明示的に処理する。

## 復習の核

- N,Mが小さい全列挙と比較し、K=0、K>M、jが端1またはM、禁止帯が全範囲を覆う場合を確認する。

## 計算量と制約

### 時間

長さN、値域M。各row prefix和と各末尾更新で O(NM)。

### 空間

rolling dpとprefix O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 1000; 1 \leq M \leq 5000; 0 \leq K \leq M-1; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/tasks/abc253_e) — source-abc253-e-problem-0ff7727e69a800ed6aa6bec68cb3e8676c00ec61fe523bf2f16afcc1ec5aa533
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/editorial/4018) — source-abc253-editorial-4018-2d52449d4b7b11ea03e570f282c8b0ba4362cd0103953f65a58ce9e3b3b1bc6e
