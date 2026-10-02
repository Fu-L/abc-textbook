---
title: "ABC254-F — Rectangle GCD"
draft: true
authoringUnit: {"problemId":"abc254-f","docPath":"src/content/docs/problems/mathematics/outcome-reduce-integer-structure-by-gcd/outcome-reduce-integer-structure-by-gcd-shard-001/abc254-f.md","learningOutcomeIds":["outcome-reduce-integer-structure-by-gcd"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。"],"tagIds":["tag-gcd-structure","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc254-editorial-4067-c931ee6e07f8d7b7e2f38c2ceb2193c131f8f11b66f6200318c5a3ce39a2cf54","source-abc254-f-problem-fb9b12af78f2c27e67cf3fdf37ca5b98e81bbb6ccf253f0e8602d3235e2f53d0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長方形の値の公約数は同列同士の差から全dA、同行同士の差から全dBを割る。逆に基準値とその差分を割る数は、基準から差を加減して得る任意のA_i+B_jを割る。両方向の整除からgcdが一致し、二つの差分区間gcdと基準値だけで答えられる。","sourceRevisionIds":["source-abc254-editorial-4067-c931ee6e07f8d7b7e2f38c2ceb2193c131f8f11b66f6200318c5a3ce39a2cf54","source-abc254-f-problem-fb9b12af78f2c27e67cf3fdf37ca5b98e81bbb6ccf253f0e8602d3235e2f53d0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md)

- gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- Bézout係数を求めて一次不定方程式の具体解・一般解を構成する手順は「gcdと整数解の成立条件」で扱う。gcdによる必要条件や剰余類への分解と、解を実際に構成する技能を区別する。

## 考察

長方形内の全A_i+B_jのgcdは、基準値A_h1+B_w1と、行方向の隣接差A_i-A_(i-1)、列方向の隣接差B_j-B_(j-1)のgcdに等しい。

採用する候補: 差分列の区間gcdと基準一点

gcdが差を取っても不変な性質により、二次元長方形を二つの一次元差分区間と一値へ分解できる。

棄却する候補: 長方形内の全要素を列挙

一問い合わせで最大N^2個の値があり、Q=2×10^5では処理できない。

同じ列の値同士を引けばAの隣接差が、同じ行の値同士を引けばBの隣接差が得られる。

逆に基準値と全隣接差から長方形内の任意のA_i+B_jを加減算で復元できるため、二つのgcdは一致する。

差分配列dA[i]=A_i-A_(i-1)、dB[j]=B_j-B_(j-1)を区間gcd可能な構造へ載せる。各質問でgcd(A_h1+B_w1, gcd(dA[h1+1..h2]), gcd(dB[w1+1..w2]))を返す。

## 典型の発動条件

### gcdの差分不変性

発動条件: 多数の和で作る集合のgcdを少数の基準値と差へ変えたい。

一つの基準値から他値を引き、行・列の隣接差へ分離する。

### 静的区間gcd

発動条件: 変更のない差分列へ多数の区間gcd質問が来る。

セグメント木やsparse tableで二つの差分区間のgcdを得る。

## 問題固有の要素

加法分離された行列A_i+B_jでは、全長方形の情報が左上の一値と二方向の一次元差分だけに縮約される。

別の問題へ持ち帰る視点: gcd集合へ共通基準を含め、他要素との差の生成系を探すと、高次元質問を低次元へ分解できる。

## 正当性

長方形の値の公約数は同列同士の差から全dA、同行同士の差から全dBを割る。逆に基準値とその差分を割る数は、基準から差を加減して得る任意のA_i+B_jを割る。両方向の整除からgcdが一致し、二つの差分区間gcdと基準値だけで答えられる。

## 実装上の注意

- 差分は負になり得るので絶対値または符号に依存しないgcdを使う。h1=h2やw1=w2の空差分区間はgcdの単位元0として扱う。

## 復習の核

- 小さい配列で長方形を全列挙したgcdと比較し、1×1、1行、1列、負の差分、全要素が同じ場合を確認する。

## 計算量と制約

### 時間

O(N+Q log N)のgcd segment tree。各gcd演算の算術費用は値域Vに対してO(log V)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,Q \le 2 \times 10^5; 1 \le A_i,B_i \le 10^9; 1 \le h_1 \le h_2 \le N; 1 \le w_1 \le w_2 \le N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/editorial/4067) — source-abc254-editorial-4067-c931ee6e07f8d7b7e2f38c2ceb2193c131f8f11b66f6200318c5a3ce39a2cf54
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/tasks/abc254_f) — source-abc254-f-problem-fb9b12af78f2c27e67cf3fdf37ca5b98e81bbb6ccf253f0e8602d3235e2f53d0
