---
title: "拡大有限体の表現と四則演算を構成する"
description: "「拡大有限体の表現と四則演算を構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 180
---

# 拡大有限体の表現と四則演算を構成する

習得対象の目安: **橙色（2400–2799）**。既約多項式や基底座標から有限体を構成し、四則演算の実装を正当化する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 拡大有限体の表現と演算

素体上の多項式剰余または基底座標で有限体の元を表し、標準化された加減乗除を構成する。

### 習得する技能

- 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。

## 考え方

### まず二次拡大で四則演算を作る

奇素数p上で平方非剰余D（どのxにもx²≡D mod pとならない値）を選ぶ。形式的な元θにθ²=Dという関係を与え、全ての元を(a,b)、すなわちa+bθ（a,b∈F_p）で表す。二元の加減は座標ごと、乗算は展開後にθ²をDへ置き換えて

`(a+bθ)(c+eθ)=(ac+Dbe)+(ae+bc)θ`

とする。係数は毎回mod pへ正規化する。多項式X²−DがF_pに根を持たず既約であるため、p²個の座標が一意な元を表す。例えばp=3,D=2ならθ²=2で、θはF_3内には存在しない根になる。

非零元の逆元は共役を掛けて

`(a+bθ)^{-1}=(a−bθ)/(a²−Db²)`

で得る。分母が0でb≠0ならD=(a/b)²となって非剰余性に反する。b=0ならa²=0よりa=0なので元が零だったことになる。従って非零元の分母は必ずF_pの逆元を持ち、直接前提の法上の除算だけで構成できる。除算A/BはAにBの逆元を掛ける。pが奇数ならD候補を `D^((p−1)/2)=−1` で判定できる。p=2ではこの二次式は使わず、例えばX²+X+1を用いる。

### 一般次数の係数配列と剰余化

次数dのmonicな既約多項式 `h(X)=X^d+Σ_{j<d}h_j X^j` を固定する。元Aは次数d未満の係数配列で表し、加減は成分ごとに行う。積の係数C_kを通常の積和で求め、k=2d−2からdへ降順に、係数C_kについて各j<dへ `C_{k−d+j}−=C_k h_j` を加え、C_k=0とする。これはX^d≡−Σ h_j X^jの置換であり、順に高次項を消して一意な次数d未満へ戻せる。

逆元では、非零Aとhに多項式Euclidを適用する。多項式除法は、余りRの最高係数を除数の最高係数で割り、その商係数の単項式倍をRから引く操作を次数が小さくなるまで繰り返す。Euclidの余り列はr0=h,r1=Aから `r_{k+1}=r_{k−1}−q_k r_k`。同時にr_k=s_k h+t_k Aを保ち、初期(s0,t0)=(1,0)、(s1,t1)=(0,1)、更新 `(s_{k+1},t_{k+1})=(s_{k−1},t_{k−1})−q_k(s_k,t_k)` とする。既約hと次数d未満の非零Aのgcdは非零定数gとなるので、最後のtをgで割ってhで剰余化すれば `uA+vh=1`、すなわちuが逆元になる。

別の構成として、体の非零元は位数p^d−1の乗法群を作るので、Aの逆元をA^(p^d−2)で求められる。既約性を証明してから使う性質であり、単に多項式で剰余を取っただけでは体になるとは限らない。

## 成立条件と計算量

係数配列の加減O(d)、素朴な積と剰余化O(d²)。素朴な拡張EuclidはO(d²)回の素体演算、累乗での逆元はO(d² log(p^d))回の素体演算である。素体逆元の計算費用と既約多項式を探す費用は別に数える。二次拡大は定数個の座標積と一回の素体逆元で割れる。既約でないhでは零因子が生じ、非零元にも逆元がない場合がある。

概念上の親: [数論](/learn/number-theory/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)。

このUnitを直接前提とする単元: なし。

素体上の演算を土台に、既約関係で元を標準化し、加減乗除が閉じる拡大体として扱う。

### このUnitでは扱わないもの

- 素数法上の通常の四則演算だけで閉じる計算、および環上で逆元の存在を仮定できない演算。

## 問題一覧

- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。）。 畳み込みと等比点評価を前提に、拡大体で数列の一般項を指数の式へ変換する方法を学ぶ。周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h) — 主題: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)（順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC381 G 公式解説](https://atcoder.jp/contests/abc381/editorial/11378)
- [ABC381 G 公式問題文](https://atcoder.jp/contests/abc381/tasks/abc381_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-finite-field-extension`
