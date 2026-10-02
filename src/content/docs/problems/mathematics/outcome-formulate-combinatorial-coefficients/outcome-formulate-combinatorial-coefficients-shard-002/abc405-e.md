---
title: "ABC405-E — Fruit Lineup"
draft: true
authoringUnit: {"problemId":"abc405-e","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-002/abc405-e.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc405-e-problem-bba4dda2e02a55bd7bfbef138713d6d7b4e0b0ba9f9972784cc4ad2d93ff2194","source-abc405-editorial-13004-59ade1060f850eefa9ff15714c030d95aee071d0459add6a840ed9d74571108c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最左grapeの前にあるbanana数iは各合法列で一意。左は全apple→i bananaの順序を保ちorangeを挿入するC(A+B+i,B)通り、右は残りbananaとgrapeの自由列の二項係数になる。境界で左右を結べば全制約を満たし、逆に全合法列をこのiへ分解できるので積の和に重複はない。","sourceRevisionIds":["source-abc405-e-problem-bba4dda2e02a55bd7bfbef138713d6d7b4e0b0ba9f9972784cc4ad2d93ff2194","source-abc405-editorial-13004-59ade1060f850eefa9ff15714c030d95aee071d0459add6a840ed9d74571108c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

最左のブドウを境界にすると、その左には全リンゴ A 個、全オレンジ B 個、そして i 個のバナナがあり、右には残り C-i 個のバナナと D-1 個のブドウだけがある。

左側ではリンゴ全体がバナナ全体より先という順序が固定され、オレンジをその列の隙間へ挿入するだけなので C(A+B+i,B) 通りになる。

採用する候補: 最左ブドウより左のバナナ数 i=0..C を全列挙し、左右の組合せ数の積を足す

各 i の寄与は C(A+B+i,B)C(D-1+C-i,D-1)。階乗と逆階乗を前計算すれば全体を果物総数に線形な時間で求められる。

棄却する候補: A,B,C,D を状態とする四次元 DP で左から果物を置く

各個数が 10^6 まであるため状態空間を保持できず、最左ブドウで依存関係が左右に分離する構造を使っていない。

最左ブドウを選んだことで「リンゴはブドウより左」「オレンジはブドウより左」の二条件が自動的に満たされ、残る左側の制約はリンゴがバナナより左だけになる。

i を固定すれば左右の選び方は独立で、果物は種類内で区別しないため二つの二項係数の積になる。

mod 998244353 で 0..A+B+C+D の factorial と inverse factorial を用意する。i=0..C について comb(A+B+i,B)×comb(D-1+C-i,D-1) を加算する。

## 典型の発動条件

### 境界要素による場合分け

発動条件: 複数の順序制約が特定種類の最初／最後の要素で分離できるとき。

最左ブドウと、その左にあるバナナ数を固定して左右の配置を独立にする。

### 二項係数の前計算

発動条件: 大きな同種要素の挿入方法を多数の引数で足し合わせるとき。

階乗・逆階乗から各組合せを O(1) で計算する。

## 問題固有の要素

四種類の部分順序を直接数えず、最左ブドウ一つを separator にすると、左は固定順列へのオレンジ挿入、右は自由な二種類列になる。

別の問題へ持ち帰る視点: 順序制約つき多重集合順列では、制約をまたぐ極値要素で切ったときに左右が独立になるかを調べる。

## 正当性

最左grapeの前にあるbanana数iは各合法列で一意。左は全apple→i bananaの順序を保ちorangeを挿入するC(A+B+i,B)通り、右は残りbananaとgrapeの自由列の二項係数になる。境界で左右を結べば全制約を満たし、逆に全合法列をこのiへ分解できるので積の和に重複はない。

## 実装上の注意

- i の両端 0,C を含め、階乗表を A+B+C+D まで確保する。各積と総和を逐次 mod 998244353 にする。

## 復習の核

- A=B=C=D=1、ある種類だけ個数を増やした小例を全多重集合順列で列挙し、i ごとの分類が重複も漏れもないか確認する。

## 計算量と制約

### 時間

O(A+B+C+D)。階乗表とi=0..Cの和。

### 空間

O(A+B+C+D)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le A \le 10^6; 1 \le B \le 10^6; 1 \le C \le 10^6; 1 \le D \le 10^6; A, B, C, and D are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc405/tasks/abc405_e) — source-abc405-e-problem-bba4dda2e02a55bd7bfbef138713d6d7b4e0b0ba9f9972784cc4ad2d93ff2194
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc405/editorial/13004) — source-abc405-editorial-13004-59ade1060f850eefa9ff15714c030d95aee071d0459add6a840ed9d74571108c
