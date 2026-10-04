---
title: "ABC256-G — Black and White Stones"
draft: true
authoringUnit: {"problemId":"abc256-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-accelerate-fixed-linear-transition/outcome-accelerate-fixed-linear-transition-shard-001/abc256-g.md","learningOutcomeIds":["outcome-accelerate-fixed-linear-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-state-design"],"excludedTopics":["一般のDP遷移の区間集約・単調最適化。"],"tagIds":["tag-linear-recurrence-matrix","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc256-editorial-4130-c937a3ca3ad9ce902644773130814a2722819fd3dcbf5fa9616c506c5796c96a","source-abc256-g-problem-e2d7ac823f51f5a8e20aba7cec2631acd3bcab48b3e8a5eed6b8a1039de3f27c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一辺で必要な白頂点数kを固定すると、両端の色を固定した内部D−1頂点の塗り方は二項係数で数えられる。これを両端色0/1の2×2行列T_kの成分とする。N辺の積で内部頂点の色を足し合わせると、隣り合う辺の共有頂点の色が必ず一致する。さらにtrace(T_k^N)は始点色と終点色を一致させるので円環の閉条件も満たす。各塗り方が共通kを一意に持つため、全kのtraceを合算して重複はない。","sourceRevisionIds":["source-abc256-editorial-4130-c937a3ca3ad9ce902644773130814a2722819fd3dcbf5fa9616c506c5796c96a","source-abc256-g-problem-e2d7ac823f51f5a8e20aba7cec2631acd3bcab48b3e8a5eed6b8a1039de3f27c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [固定線形遷移を巨大回数進める](src/content/docs/learn/dynamic-programming/linear-recurrence.md)

- 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 一般のDP遷移の区間集約・単調最適化。

## 考察

各辺上の白石数kを固定すると、隣接する二頂点の色だけでその辺内部D-1個の白石数が決まり、辺ごとの選び方が同じ2状態遷移になる。

採用する候補: kごとの2×2転送行列をN乗してtraceを取る

頂点色を状態にすれば一辺の内部配置数を二項係数で表せ、巨大な辺数Nも行列累乗で処理し、始点色と終点色が一致する円環条件をtraceで数えられる。

棄却する候補: 全ND個の石の色を列挙する

配置数が2^(ND)で、Nは最大10^12である。

端点色を白=1、黒=0とすると遷移u→vの重みはC(D-1,k-u-v)で、範囲外の二項係数は0とする。

最初の頂点色を固定して一周した最後の色が同じになる配置の総数は、転送行列M_k^Nの対角成分和である。

二項係数C(D-1,r)を法998244353で前計算する。k=0..D+1ごとに2×2行列M_k[u][v]=C(D-1,k-u-v)を作り、M_k^Nのtraceを答えへ加える。

## 典型の発動条件

### 転送行列DP

発動条件: 局所配置数が隣接する少数状態だけで決まり、同じ遷移を長く反復する。

頂点色2状態の遷移行列を二分累乗する。

### 円環DPのtrace

発動条件: 列の先頭状態と一周後の終端状態を一致させたい。

各始点色から同色へ戻る行列累乗の対角成分を合計する。

### 二項係数による内部配置

発動条件: 区間内部の二色配置が白個数だけで制約される。

必要白数k-u-vをD-1箇所から選ぶ組合せ数を辺の重みにする。

## 問題固有の要素

頂点石は隣接二辺で共有されるが、頂点色を転送状態へ残せば、各辺内部の選択は条件付きで独立になる。

別の問題へ持ち帰る視点: 円環上で辺内部が独立な数え上げは、共有端点を状態にした小行列とtraceへ落とせる。

## 正当性

一辺で必要な白頂点数kを固定すると、両端の色を固定した内部D−1頂点の塗り方は二項係数で数えられる。これを両端色0/1の2×2行列T_kの成分とする。N辺の積で内部頂点の色を足し合わせると、隣り合う辺の共有頂点の色が必ず一致する。さらにtrace(T_k^N)は始点色と終点色を一致させるので円環の閉条件も満たす。各塗り方が共通kを一意に持つため、全kのtraceを合算して重複はない。

## 実装上の注意

- 各辺には両端を含めD+1個の石、独立な内部石はD-1個である。k-u-vが0..D-1外なら0とし、kは0..D+1を全て足す。

## 復習の核

- 小さいN,Dで全2^(ND)配置を列挙し、全黒・全白、頂点だけ白、二項係数添字が負またはD-1超になる遷移を確認する。

## 計算量と制約

### 時間

O(D log N+D)、Dは一辺の分割数、固定2×2累乗。

### 空間

O(D)、二項係数。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 10^{12}; 1 \leq D \leq 10^4; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/editorial/4130) — source-abc256-editorial-4130-c937a3ca3ad9ce902644773130814a2722819fd3dcbf5fa9616c506c5796c96a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/tasks/abc256_g) — source-abc256-g-problem-e2d7ac823f51f5a8e20aba7cec2631acd3bcab48b3e8a5eed6b8a1039de3f27c
