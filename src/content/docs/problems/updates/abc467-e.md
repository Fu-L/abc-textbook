---
title: "ABC467 E — Adjacent Sums (hard)"
draft: true
authoringUnit: {"problemId":"abc467-e","docPath":"src/content/docs/problems/updates/abc467-e.md","learningOutcomeIds":["outcome-partition-at-critical-integer-boundaries"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc467-e-problem-a4ab2e28020a416cd5bd9b49a94ab4a81a017d852fd5b7ee71f3bcbb439ff90c","source-abc467-editorial-22785-d9a0b82dbdf41fe1dd2fd217152f7a2f6fc44943068a2f56b0754a50a080d5b7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"合同条件の再帰により任意の実現可能列はsで表せる。各項の最小増分は非負剰余であり、それを各要素へ独立に加えれば合同条件を満たす。Fはイベント間で線形なので、その区間の整数端点のいずれかが最小となる。イベント前後と全域の両端を評価する掃引は全候補を覆う。","sourceRevisionIds":["source-abc467-e-problem-a4ab2e28020a416cd5bd9b49a94ab4a81a017d852fd5b7ee71f3bcbb439ff90c","source-abc467-editorial-22785-d9a0b82dbdf41fe1dd2fd217152f7a2f6fc44943068a2f56b0754a50a080d5b7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- 成立判定が変わり得る整数境界を全て列挙し、隣り合う境界の間で判定が一定であることを示して、代表点判定と区間長で整数解の個数を求められる。

## 考察

最初の値を一つ決めれば、隣接和の合同条件から残りの値の剰余はすべて決まる。C_1=0、C_{i+1}=B_i−C_i とすると、完成列の第i項は C_i+(-1)^{i+1}s (mod M)。増加だけが許されるので、この剰余へ到達する最小操作数は (C_i+(-1)^{i+1}s−A_i) mod M である。従って一変数 s∈[0,M−1] の関数 F(s) の最小化へ縮む。

M≤10^9 なので s の全探索はできない。各項は傾き+1または−1の鋸歯状関数で、剰余が折り返す時だけ差分が変わる。0-basedでD_i=(C_i−A_i) mod M、偶数iの項は (D_i+s) mod M、奇数iの項は (D_i−s) mod M。初期 F(0)=ΣD_i、通常の傾きは偶数iの個数−奇数iの個数。+項は s=M−D_i で−Mの補正（D_i=0なら区間外）、−項は s=D_i+1 で+Mの補正を入れる。

イベントの座標を昇順に掃引する。前イベントの値から傾き×距離だけ進め、補正前の s−1 と補正後の s を評価する。0とM−1も含めれば、各線形区間の両端がすべて候補になる。最小値を与える点を『いずれかの項が0になる点』に絞る証明もあるが、ここではイベント前後の端点を取ることで負の傾きにも同じ実装で対応する。

## 典型の発動条件

合同条件で自由度を一つに落とした後、剰余・床関数の不連続点だけを列挙する。候補値域が巨大でも、式の形が変わる場所が少ないときに使える。

## 問題固有の要素

隣接和の等式が値の符号を交互に反転させる。正の傾きの折返しと負の傾きの折返しでは補正の座標が1ずれる。

## 正当性

合同条件の再帰により任意の実現可能列はsで表せる。各項の最小増分は非負剰余であり、それを各要素へ独立に加えれば合同条件を満たす。Fはイベント間で線形なので、その区間の整数端点のいずれかが最小となる。イベント前後と全域の両端を評価する掃引は全候補を覆う。

## 実装上の注意

剰余を[0,M)へ正規化する。同座標の補正はまとめる。総操作数はN(M−1)まであるので64 bit整数を使う。

## 復習の核

巨大な一変数探索では、値を列挙する前に『差分が変化する座標』を求める。補正前と補正後を混同しない。

## 計算量と制約

### 時間

イベント高々N個のソートと掃引で O(N log N)。

### 空間

C,Dとイベント列に O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 3 \leq M \leq 10^9; 0 \leq A_i \leq M-1; 0 \leq B_i \leq M-1; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc467/tasks/abc467_e)
- [公式解説](https://atcoder.jp/contests/abc467/editorial/22785)
