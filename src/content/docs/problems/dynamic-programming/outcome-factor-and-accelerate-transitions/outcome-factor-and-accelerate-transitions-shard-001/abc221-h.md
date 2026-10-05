---
title: "ABC221-H — Count Multiset"
draft: true
authoringUnit: {"problemId":"abc221-h","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc221-h.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-grid-table-dp"],"sourceRevisionIds":["source-abc221-editorial-2719-7d0a4f6a911b12cda7b3a1e70f53d64016b01e1a7616f1dace14babf5de7061a","source-abc221-h-problem-007d88780f471378894ba67fde15552d3170f77ca35c3818d479b162d1a50d50"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"正整数の非減少列と反転差分列は一対一で、総和はΣi b_i、最終b_k>0になる。同値がM+1個以上続くことは差分0がM個以上続くことに一致する。正要素の前位置pを直前M位置に限るsliding sum gでその条件を表し、b_x≥1の全候補をf[x][y−x]+g[x][y−x]で重複なく足せる。番兵f[0][0]=1が先頭の0-runも扱うので、f[k][N]は求めるサイズkの多重集合数。","sourceRevisionIds":["source-abc221-editorial-2719-7d0a4f6a911b12cda7b3a1e70f53d64016b01e1a7616f1dace14babf5de7061a","source-abc221-h-problem-007d88780f471378894ba67fde15552d3170f77ca35c3818d479b162d1a50d50"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

先に読む単元:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md) — 状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

サイズ k の多重集合を非減少列 a_1≤…≤a_k として一意に表すと、値の重複は隣接差が0である区間として見える。直接「各値を何個使うか」を持つより差分列の方が上限 M を局所条件にできる。

差分を取り添字を反転した b_1,…,b_k では、Σ i b_i=N、b_k>0 となる。同じ値が M+1 個以上並ぶことは M 個以上の連続する0差分に対応するため、「0が M 個連続しない」が multiplicity 上限になる。

採用する候補: f[x][y] を長さ x、重み和 y、末尾 b_x>0、0の M 連続なしの差分列数とし、直前の正要素位置を M 幅の累積和で集約する。

末尾の正値と一つ前の正値の間隔だけで0-run条件を判定でき、正値 b_x の全候補も同じ行の累積遷移へまとめられる。

棄却する候補: 使用する値、現在の総和、要素数を状態にし、各値を0個から M 個追加する bounded-knapsack DP を行う。

値・総和・要素数の三次元状態と multiplicity 遷移が必要になり、N=5000 で全 k の答えを求めるには大きすぎる。

一つ前の正要素位置 p は max(0,x-M)≤p<x に限られる。g[x][y]=Σ f[p][y] をこの幅 M の sliding sum とすれば、許される0-runを一括で数えられる。

b_x=c≥1 の全候補を足す式 f[x][y]=Σ_{c≥1}g[x][y-cx] は、f[x][y]=f[x][y-x]+g[x][y-x] と同じ行の一段前だけで更新できる。

番兵 f[0][0]=1 を置く。x=1..N について各 y の g[x][y] を直前 M 行の f の sliding sum で保ち、y≥x なら f[x][y]=f[x][y-x]+g[x][y-x] を法 998244353 で計算する。求める k ごとの答えは f[k][N] である。

## 典型の発動条件

### 整数分割の差分列変換

発動条件: 非減少列や多重集合の値・重複条件を同時に数えたいとき。

隣接差へ移して総和を添字付き重み和にし、等値 block を0-runとして表す。

### DP 遷移の sliding sum

発動条件: 遷移元が直前の固定幅の状態集合、または同じ刻みの過去項の総和になるとき。

行方向の幅 M 和と y 方向の x 刻み和をそれぞれ差分更新し、多重 loop を除く。

## 問題固有の要素

「各整数の出現回数≤M」が、反転差分列では「正の要素どうしの index 間隔≤M」という局所的な距離制約へ変わる。

別の問題へ持ち帰る視点: multiplicity 制約は、ソート列の等値 block 長や差分列の連続0数へ写すと有限幅 DP になることがある。

## 正当性

正整数の非減少列と反転差分列は一対一で、総和はΣi b_i、最終b_k>0になる。同値がM+1個以上続くことは差分0がM個以上続くことに一致する。正要素の前位置pを直前M位置に限るsliding sum gでその条件を表し、b_x≥1の全候補をf[x][y−x]+g[x][y−x]で重複なく足せる。番兵f[0][0]=1が先頭の0-runも扱うので、f[k][N]は求めるサイズkの多重集合数。

## 実装上の注意

- p=0 の番兵は y=0 だけ1で、x≤M の先頭0-runを表すため sliding window に含める。y-x<0 は遷移せず、行方向の加減算を法で正規化する。

## 復習の核

- M=2 の {1,1,2} を非減少列、差分、反転差分へ順に写し、二つの同値要素が「0は一個まで」に対応することを確認する。

## 計算量と制約

### 時間

O(N²)。各x,yの遷移と幅Mのsliding sum更新はO(1)。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 5000; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc221/editorial/2719) — source-abc221-editorial-2719-7d0a4f6a911b12cda7b3a1e70f53d64016b01e1a7616f1dace14babf5de7061a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc221/tasks/abc221_h) — source-abc221-h-problem-007d88780f471378894ba67fde15552d3170f77ca35c3818d479b162d1a50d50
