---
title: "ABC242-EX — Random Painting"
draft: true
authoringUnit: {"problemId":"abc242-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-solve-stochastic-recurrence/outcome-solve-stochastic-recurrence-shard-001/abc242-ex.md","learningOutcomeIds":["outcome-solve-stochastic-recurrence"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-sequence","unit-dp-state-design","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-combinatorial-coefficients","tag-modular-arithmetic","tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc242-editorial-3523-6c7d7a84d375e87a884786bdb60c66a2e8a6081f3cf44a1686a13d05bbd63915","source-abc242-ex-problem-688c5992478881c0309ca6ee0c8e2e4440242d1747b024058c622e22ee750a4d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"初出区間がk種類に達した時点の集合は全k-subsetに一様であり、次の未出区間までの待ち時間の期待値はM/(M−k)。まだ被覆しない確率を掛け各stageを足せば完了時間の期待値になる。区間を左端順に処理すると、既にprefixを覆う選択集合にgapを作る区間は後の区間ではそのgapを埋められないため棄却してよい。端jと選択数kのDPで全被覆subset数f(k)を得て、Σ(1−f(k)/C(M,k))M/(M−k)を計算すれば正しい。","sourceRevisionIds":["source-abc242-editorial-3523-6c7d7a84d375e87a884786bdb60c66a2e8a6081f3cf44a1686a13d05bbd63915","source-abc242-ex-problem-688c5992478881c0309ca6ee0c8e2e4440242d1747b024058c622e22ee750a4d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

抽選済みの異なる区間集合 S がまだ全盤面を覆わない間、次に S 外の区間が初めて出るまでの待ち時間は成功確率 (M-|S|)/M の幾何分布で、期待値は M/(M-|S|) である。

異なる区間が i 種類集まった時点の集合は全 C(M,i) subset に対称であり、そのうち union が [1,N] でない割合だけ、その stage の待ち時間が完了前に発生する。

採用する候補: 被覆する i-subset 数 f(i) を interval-union DP で数え、各 i<M の非被覆割合 (C(M,i)-f(i))/C(M,i) に stage 待ち時間 M/(M-i) を掛けて足す。

無限回の確率過程を distinct-set size ごとの有限な期待値和へ変え、残る組合せ数を区間構造で計算できる。

棄却する候補: 抽選された ball の列または2^M個の既出集合を状態に期待値 DP を行う。

同じ ball の反復で列は無限、distinct subset も M=400 に対して指数個ある。

区間を (L,R) 昇順に処理すると、選択区間の union が gap なしの prefix [1,j] である状態だけを持てる。新 interval は j<L-1 なら選べず、重なるなら右端を R へ伸ばし、既に含まれるなら j を保つ。

f(i)=dp[N][i] が i 個で全被覆する subset 数となり、期待値は i=0..M-1 の stage 寄与の和である。

interval を L,R 順に sort し、dp[j][k] を選択 union が [1,j]、選択数 k の subset 数として skip/select 遷移する。f(k)=dp[N][k] を得た後、Σ_{k=0}^{M-1}(1-f(k)/C(M,k))·M/(M-k) を法998244353で計算する。

## 典型の発動条件

### coupon stage による期待値分解

発動条件: 復元抽選で異なる種類が増え、ある集合性質を初めて満たすまでの回数を求めるとき。

distinct 集合サイズごとの滞在確率と、次の新種類までの幾何分布期待値を掛けて足す。

### 区間 union の prefix DP

発動条件: 区間を選んだ union が gap なしで始点からどこまで覆うかを数えたいとき。

左端順に処理し、covered right endpoint と選択数を状態にする。

## 問題固有の要素

抽選順を直接追わず、「異なる区間が i 個そろった stage でまだ被覆しているか」へ期待値を分解すると、順序確率と subset 数え上げが分離する。

別の問題へ持ち帰る視点: with-replacement 過程では、distinct set が増える瞬間だけを埋め込んだ過程として観察する。

## 正当性

初出区間がk種類に達した時点の集合は全k-subsetに一様であり、次の未出区間までの待ち時間の期待値はM/(M−k)。まだ被覆しない確率を掛け各stageを足せば完了時間の期待値になる。区間を左端順に処理すると、既にprefixを覆う選択集合にgapを作る区間は後の区間ではそのgapを埋められないため棄却してよい。端jと選択数kのDPで全被覆subset数f(k)を得て、Σ(1−f(k)/C(M,k))M/(M−k)を計算すれば正しい。

## 実装上の注意

- 期待値和は M-k が0になる k=M を含めない。in-place DP なら j の降順などで同じ interval を二度使わないようにし、C(M,k)=0でない範囲の法逆元を使う。

## 復習の核

- i 個の distinct ball が集まった時の subset が一様であることと、次の新 ball まで M/(M-i) 回かかることを別々に導く。

## 計算量と制約

### 時間

O(M²N+M log M)。各区間について被覆端Nと選択数Mを遷移する。

### 空間

O(NM)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,M \leq 400; 1 \leq L_i \leq R_i \leq N; For every square i, there is an integer j such that L_j \leq i \leq R_j.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/editorial/3523) — source-abc242-editorial-3523-6c7d7a84d375e87a884786bdb60c66a2e8a6081f3cf44a1686a13d05bbd63915
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/tasks/abc242_h) — source-abc242-ex-problem-688c5992478881c0309ca6ee0c8e2e4440242d1747b024058c622e22ee750a4d
