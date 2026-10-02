---
title: "ABC425-E — Count Sequences 2"
draft: true
authoringUnit: {"problemId":"abc425-e","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc425-e.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc425-e-problem-4eec5e025cece4165e13228782e7988bf88fbd0458c8206360239346b64b7ac5","source-abc425-editorial-13919-962140edb30e387f4fda6f723c717fe99d3199f26ad1ada60841811a4092ac9c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同値要素C_i個を既置s個へ追加する完成位置の選択はC(s+C_i,C_i)で、削除すれば元配置へ一意に戻る。全種類の積が多項係数を整数のまま分解する。Pascalの加算則は任意の法で成立するので、合成数Mで逆元がなくても正確にmod計算できる。","sourceRevisionIds":["source-abc425-e-problem-4eec5e025cece4165e13228782e7988bf88fbd0458c8206360239346b64b7ac5","source-abc425-editorial-13919-962140edb30e387f4fda6f723c717fe99d3199f26ad1ada60841811a4092ac9c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

各値 i をちょうど C_i 回含む列は、総数 S=ΣC_i 個の位置へ同じ値を配置する多項係数で数えられる。法 M は素数とは限らないため、逆元を前提にしてはいけない。

採用する候補: パスカルの漸化式で 0≤k≤n≤5000 の二項係数を法 M で前計算し、累積個数へ C_i 個を挿入する二項係数を順に掛ける。

加減算と乗算だけなので合成数法でも成立し、ΣC_i≤5000 の制約に収まる。

棄却する候補: 階乗と逆階乗から多項係数を直接計算する。

M が素数とは限らず、階乗が M と互いに素でない場合に剰余逆元が存在しない。

多項係数 S!/(C_1!…C_N!) は、前に置いた個数 s に新しい C_i 個の位置を選ぶ積 ∏ binom(s+C_i,C_i) に分解できる。

パスカルの漸化式 binom(n,k)=binom(n-1,k-1)+binom(n-1,k) は任意の法で保たれる。

最大 S まで二項係数表をパスカルの三角形で構築する。s=0 から各 C_i を走査し、答えへ binom(s+C_i,C_i) を掛けて s+=C_i とする。

## 典型の発動条件

### 多項係数の逐次分解

発動条件: 同種要素の個数が複数与えられ、異なる並べ方を数えるとき。

既配置 s 個と新しい C_i 個を混ぜる位置の選び方へ分解し、二項係数の積にする。

### パスカルの三角形

発動条件: 法が合成数で、階乗の除算を安全に使えない一方、添字上限が小さいとき。

加算だけで全二項係数を前計算し、各テストケースの積を O(N) で求める。

## 問題固有の要素

法 M の性質を問わない形へ式を変形することが核心であり、組合せ数そのものは除算なしの漸化式で計算できる。

別の問題へ持ち帰る視点: 剰余下の割り算が危険なら、整数として同値な積分解や加法漸化式へ移す。

## 正当性

同値要素C_i個を既置s個へ追加する完成位置の選択はC(s+C_i,C_i)で、削除すれば元配置へ一意に戻る。全種類の積が多項係数を整数のまま分解する。Pascalの加算則は任意の法で成立するので、合成数Mで逆元がなくても正確にmod計算できる。

## 実装上の注意

- 二項係数表は ΣC_i の最大値まで用意し、k=0 と k=n を 1 で初期化する。積と加算の各段階で M を取る。

## 復習の核

- 階乗の除算を紛れ込ませていないか、積の各因子が『既存 s 個と新規 C_i 個の混ぜ方』を正しく表すかを確認する。

## 計算量と制約

### 時間

各case O(S²+N)、S=ΣC_i≤5000。Pascal表をcaseの法Mで作る。

### 空間

O(S²)。必要なrowだけ保持すればO(S)にできる。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 10^5; 2\leq M\leq 10^9; 1\leq N; 1\leq C_i; \sum_{i=1}^N C_i\leq 5000; The sum of N over all test cases is at most 3\times 10^5.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc425/tasks/abc425_e) — source-abc425-e-problem-4eec5e025cece4165e13228782e7988bf88fbd0458c8206360239346b64b7ac5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc425/editorial/13919) — source-abc425-editorial-13919-962140edb30e387f4fda6f723c717fe99d3199f26ad1ada60841811a4092ac9c
