---
title: "ABC396-G — Flip Row or Col"
draft: true
authoringUnit: {"problemId":"abc396-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc396-g.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc396-editorial-12375-87460d584617418cae1e2edd3b3cf819cf0df9ab9c7a7be2568e840e8e487b24","source-abc396-g-problem-81eeb298bb974b4bd8017be318c18264a7d11c3550cec032d95ea58895201f54"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"column flip X 固定後、各 row は bit数 c と complement の W−c の小さい方を independently 選べる。距離 DP で j 個の bit を処理した状態は、その bit だけ変更した原 row patterns の距離別頻度。次bitの一致と不一致が disjoint かつ全候補を覆うため分布は帰納的に正しい。全bit後に min(c,W−c) を掛けた和が X の真の最小1数で、全 X 最小化が最適。","sourceRevisionIds":["source-abc396-editorial-12375-87460d584617418cae1e2edd3b3cf819cf0df9ab9c7a7be2568e840e8e487b24","source-abc396-g-problem-81eeb298bb974b4bd8017be318c18264a7d11c3550cec032d95ea58895201f54"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

column flip集合XをW-bit maskとするとrow pattern B_iはB_i xor Xになり、その後rowをflipするかは1数cとW-cの小さい方を選べば独立に決まる。 求めるcostはmask頻度freq[B]とHamming距離だけに依存するXOR convolution型Σ_B freq[B]g(B xor X)だが、W≤18なのでbit DPでも全Xをまとめられる。 column flip後のrow flip最適costはmin(popcount(B xor X),W-popcount(B xor X))である。 j bit目を一致側から取る遷移とX xor 2^j側から不一致として取る遷移で、Hamming距離分布を一bitずつ構築できる。

採用する候補: mask頻度を作り、bitごとにHamming距離countを畳み込むDPで全Xのcostを計算する

dp[X][j][c]を下位j bitの候補中で距離cとなるrow数として更新すればO(HW+2^W W²)で、2^W·H全探索を避けられる。

棄却する候補: 全column mask XごとにH rowsのpopcountを足す

O(H2^W)でH=2×10^5,W=18では大きすぎる。

column flip後のrow flip最適costはmin(popcount(B xor X),W-popcount(B xor X))である。

j bit目を一致側から取る遷移とX xor 2^j側から不一致として取る遷移で、Hamming距離分布を一bitずつ構築できる。

各rowをmask化してfreqを数える。dp[X][0][0]=freq[X]からbit jを増やし、dp[X][j+1][c]+=dp[X][j][c]、dp[X][j+1][c+1]+=dp[X xor 2^j][j][c]とする。全XでΣ_c dp[X][W][c]min(c,W-c)の最小を取る。

## 典型の発動条件

### bitmask化によるrow/column flip分離

発動条件: 一方の次元が小さく、flipがXOR作用になる0/1 matrix最適化。

column集合をmask、各rowをpattern頻度として扱う。

### Hamming distance distribution DP

発動条件: 全query maskに対するpatternとの距離別頻度を求めたいとき。

bitを追加し一致・不一致の二遷移で集約する。

## 問題固有の要素

row操作はcolumn maskを決めた後に完全独立なので、二種類の操作順序を考えずHamming距離の対称costへ消去できる。

別の問題へ持ち帰る視点: 行列flip問題では小さい幅をmask化し、もう一方の操作をmaskごとの最適応答として先に畳み込む。

## 正当性

column flip X 固定後、各 row は bit数 c と complement の W−c の小さい方を independently 選べる。距離 DP で j 個の bit を処理した状態は、その bit だけ変更した原 row patterns の距離別頻度。次bitの一致と不一致が disjoint かつ全候補を覆うため分布は帰納的に正しい。全bit後に min(c,W−c) を掛けた和が X の真の最小1数で、全 X 最小化が最適。

## 実装上の注意

- bit順とrow文字のmask bit対応を統一する。dpをjごとにrollingする場合、同じlayerを上書きしない。count×costは64 bit。

## 復習の核

- H,W≤7で全row/column flip集合を列挙し、complement rowが多いcase、W=1、同pattern集中を比較する。

## 計算量と制約

### 時間

H 行、幅 W≤18。頻度化 O(HW)、Hamming 分布の各 bit×距離×mask 更新 O(W²2^W)。

### 空間

bit 層を rolling して O(W2^W)、入力を保持すれば O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H \leq 2\times 10^5; 1 \leq W \leq 18; H and W are integers.; A_{i,1}A_{i,2}\ldots A_{i,W} is a length-W string consisting of 0 and 1.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc396/editorial/12375) — source-abc396-editorial-12375-87460d584617418cae1e2edd3b3cf819cf0df9ab9c7a7be2568e840e8e487b24
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc396/tasks/abc396_g) — source-abc396-g-problem-81eeb298bb974b4bd8017be318c18264a7d11c3550cec032d95ea58895201f54
