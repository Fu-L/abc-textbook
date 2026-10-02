---
title: "ABC448-E — Simple Division"
draft: true
authoringUnit: {"problemId":"abc448-e","docPath":"src/content/docs/problems/mathematics/outcome-exponentiate-associative-composition/outcome-exponentiate-associative-composition-shard-001/abc448-e.md","learningOutcomeIds":["outcome-exponentiate-associative-composition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["monoid exponentiation・連結演算doublingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-monoid-exponentiation","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc448-e-problem-2e75c00389f73522688e3410de62a0e400eaf627cb19ddf0616c8fa3ae397dfe","source-abc448-editorial-16749-7468a146eb2ed5b942c7fa3c4c47c44239fb8ad100daa5691a838e974f534b21"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"N=QM·10007+rと書けばfloor(N/M)=Q·10007+floor(r/M)。従って法M·10007の剰余だけで商のmod10007を復元できる。blockのpair(10^len,R_len)の結合式はdecimal連結をそのまま表し、二分doublingは巨大blockを展開せず同じ剰余を得る。","sourceRevisionIds":["source-abc448-e-problem-2e75c00389f73522688e3410de62a0e400eaf627cb19ddf0616c8fa3ae397dfe","source-abc448-editorial-16749-7468a146eb2ed5b942c7fa3c4c47c44239fb8ad100daa5691a838e974f534b21"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-exponentiate-associative-composition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"block(数字1,長さ2),(数字2,長さ1)、M=7。","procedure":["連結数は112。","剰余を法7·10007で保持して最後に7で整数除算する。"],"executionTarget":null,"expectedResult":"商16。","verificationStatus":"not_applicable","learningUnitIds":["unit-monoid-exponentiation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-exponentiate-associative-composition"],"prerequisiteIds":["unit-modular-arithmetic"],"attainmentCondition":"M=3,N=30029で剰余法を確認せよ。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"2。"},"answer":{"reasoningOrVerification":"M·10007=30021、剰余8。floor(8/3)=2、真の商10009もmod10007で2。","procedure":["具体例の各状態・寄与を再計算する。","M·10007=30021、剰余8。floor(8/3)=2、真の商10009もmod10007で2。"],"expectedResult":"2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [monoid exponentiation・連結演算doubling](src/content/docs/learn/combinatorics-algebra/monoid-exponentiation.md)

- 反復対象を閉じた結合的要約へ持ち上げ、monoidの二分累乗で巨大な連結・合成を評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- monoid exponentiation・連結演算doublingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

floor(N/M) mod 10007 を知るには N mod (M×10007) だけで十分である。巨大な連結数 N は各 block c_i 個の repunit を桁 shift して足す形に分解できる。

採用する候補: modulus X=M×10007 上で 10^k と repunit R_k を doubling し、各 block を右から shift・加算して N mod X を構成する。

N=qM+r をさらに q mod10007 で見ると N mod(M×10007) から floor(r/M) が得られ、repunit doubling は9の逆元なしで任意長を対数時間に計算できる。

棄却する候補: R_k=(10^k-1)/9 を modulus 上で9の逆元を掛けて求める。

M×10007 と9が互いに素とは限らず逆元が存在しないため、modular division は正当化できない。

R_{a+b}=R_a×10^b+R_b なので、(10^len,R_len) の pair は文字列結合と同じ結合則を持つ。

X=M×10007 に対する剰余 r を得た後、floor(r/M) が元の商を10007で割った余りになる。

2^k 桁について pow10[k] と rep[k] を doubling 前計算する。各 l_i の bit から R_{l_i} と10^{l_i}を組み、現在値を必要桁 shift して c_i R_{l_i} を加える。最終剰余を M で整数除算する。

## 典型の発動条件

### 連結演算の doubling

発動条件: 巨大長の同一桁列や文字列値を composite modulus 上で扱うとき。

長さ2冪の 10乗と repunit を結合則で前計算する。

### 商剰余の modulus 拡張

発動条件: floor(N/M) をさらに K で割った余りだけ欲しいとき。

N mod(MK) を求め、その剰余を M で割る。

## 問題固有の要素

除算結果の剰余は元の数を divisor×modulus で見れば復元できる。

別の問題へ持ち帰る視点: 逆元がない repunit は分数式を避け、桁列結合そのものを associative operation として累乗する。

## 正当性

N=QM·10007+rと書けばfloor(N/M)=Q·10007+floor(r/M)。従って法M·10007の剰余だけで商のmod10007を復元できる。blockのpair(10^len,R_len)の結合式はdecimal連結をそのまま表し、二分doublingは巨大blockを展開せず同じ剰余を得る。

## 実装上の注意

- block の左右順と10^lengthの shift方向を統一する。X≤10^9でも積 c_i×R は64 bitで剰余を取りながら扱う。

## 復習の核

- N=qM+r を mod M×10007 で展開して商復元式を確認し、R_{a+b} の結合順を短い桁列で試す。

## 計算量と制約

### 時間

O(K log Lmax+log Lmax)、Lmax=max l_i≤10^9。各blockをbinary結合する。

### 空間

O(log Lmax)、入力保持ならO(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le M \le 10^4; 1 \le K \le 10^5; c_i is one of the digits 0,1,2,3,4,5,6,7,8,9.; 1 \le l_i \le 10^9; c_1 \neq 0; M,K,l_i are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

block(数字1,長さ2),(数字2,長さ1)、M=7。

1. 連結数は112。
2. 剰余を法7·10007で保持して最後に7で整数除算する。

期待される結果: 商16。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

M=3,N=30029で剰余法を確認せよ。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

M·10007=30021、剰余8。floor(8/3)=2、真の商10009もmod10007で2。

確認結果: 2。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc448/tasks/abc448_e) — source-abc448-e-problem-2e75c00389f73522688e3410de62a0e400eaf627cb19ddf0616c8fa3ae397dfe
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc448/editorial/16749) — source-abc448-editorial-16749-7468a146eb2ed5b942c7fa3c4c47c44239fb8ad100daa5691a838e974f534b21
