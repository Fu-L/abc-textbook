---
title: "整数境界と同値区間を正確に分ける"
description: "「整数境界と同値区間を正確に分ける」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 173
---

# 整数境界と同値区間を正確に分ける

習得対象の目安: **水色（1200–1599）**。床関数や整数根が変わる境界を厳密に求め、同じ値の区間をまとめる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第46単元。技能の説明を学んでから問題一覧へ進んでください。

前: [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/) ／ 次: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)

## 概要

### 整数境界・同値区間分割

floor値・整数根・表記桁数・圧縮block内の式が変わる整数境界を正確に分け、区間ごとに処理する。

商q=floor(N/l)が一定の最大区間は[l,floor(N/q)]である。右端の次へ進めば、i≤√Nの部分と商≤√Nの部分を合わせてO(√N)個のblockだけを処理できる。三角数・整数根・桁数の境界も、式が変わる位置を整数演算で求める。

一次式の床和を格子点領域の転置で計算するfloor_sumは別の原理である。商一定区間の列挙と混ぜず、「格子点転置によるfloor_sum」の節で引数の減少と重み付き和への拡張を学ぶ。

### 習得する技能

- 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。
- floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。

### このUnitでは扱わないもの

- 素因数指数による整数条件の分解。

## 問題一覧

1. [ABC230 E「Fraction Floor Sum」](https://atcoder.jp/contests/abc230/tasks/abc230_e) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。
2. [ABC414 E「Count A%B=C」](https://atcoder.jp/contests/abc414/tasks/abc414_e) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。
3. [ABC452 E「You WILL Like Sigma Problem」](https://atcoder.jp/contests/abc452/tasks/abc452_e) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
4. [ABC356 E「Max/Min」](https://atcoder.jp/contests/abc356/tasks/abc356_e) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。
5. [ABC253 G「Swap Many Times」](https://atcoder.jp/contests/abc253/tasks/abc253_g) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。
6. [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
7. [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。
8. [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。 / 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。
- [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。 二段先iを固定して中間状態数を数えるとΣ_{i≤r}(s+1−i²)dp[i]になる（s=⌊√X⌋,r=⌊√s⌋）。P0=Σdp、P2=Σi²dpを持てば(s+1)P0[r]−P2[r]で答えられる。
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC361 F「x = a^b」](https://atcoder.jp/contests/abc361/tasks/abc361_f) — 主題: [約数格子のzeta・Möbius反転](/learn/combinatorics-algebra/divisor-mobius-inversion/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。
- [ABC370 G「Divisible by 3」](https://atcoder.jp/contests/abc370/tasks/abc370_g) — 主題: [Min_25・Lucy DP型の総和篩](/learn/number-theory/min25-sieve/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。
- [ABC429 G「Sum of Pow of Mod of Linear」](https://atcoder.jp/contests/abc429/tasks/abc429_g) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC230 E 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_e)
- [ABC230 E 公式解説](https://atcoder.jp/contests/abc230/editorial/3015)
- [ABC239 H 公式解説](https://atcoder.jp/contests/abc239/editorial/3357)
- [ABC239 H 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-integer-boundary-blocks`
