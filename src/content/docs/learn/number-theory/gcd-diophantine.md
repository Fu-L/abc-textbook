---
title: "gcdと整数解の成立条件"
description: "「gcdと整数解の成立条件」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 164
---

# gcdと整数解の成立条件

習得対象の目安: **水色（1200–1599）**。拡張EuclidとBézoutから一次不定方程式の一解と全解を導く。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第21単元。技能の説明を学んでから問題一覧へ進んでください。

前: [gcd不変量・差分構造](/learn/number-theory/gcd-structure/) ／ 次: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)

## 概要

### Bézout等式・一次不定方程式

整数線形結合がgcdの倍数全体になることを使い、一次不定方程式の可解性と解のparameter表示を得る。

差や周期をgcdでまとめると整数解の必要条件が見える。ここでは一歩進め、Bézoutの等式からその条件が十分であることを示し、具体解と全解を構成する。gcd不変量の抽出とは数論章内の別の技能として学ぶ。

ABC340 Fの整数座標の三角形を例に、一次不定方程式へ帰着する。観察: 原点、(X,Y)、(A,B)の三角形の面積は|XB−YA|/2。面積1にはXB−YA=2または−2が必要で、符号反転で対応するから2を解けばよい。

可解性: g=gcd(|X|,|Y|)はXB−YAを割る。逆にgが2を割れば、拡張EuclidでXu+Yv=gを作り、B=2u/g,A=−2v/gとすれば解になる。ゼロ座標も扱い、両方0なら解なし。

一般解: 一解(A0,B0)からA=A0+(X/g)t、B=B0+(Y/g)t（tは整数）。二解の差の方程式と互いに素なX/g,Y/gから、これが全解だと示す。

確認: 元の外積に代入し、出力上限も確認する。符号付き入力には絶対値で求めた係数へ符号を戻す。EuclidはO(log max(|X|,|Y|))。

### 習得する技能

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

最大公約数とBézout等式で整除性・一次不定方程式の可解条件を扱い、合同算術へ進む基礎を作る。

### このUnitでは扱わないもの

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 問題一覧

1. [ABC340 F「S = 1」](https://atcoder.jp/contests/abc340/tasks/abc340_f) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。
2. [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC315 G「Ai + Bj + Ck = X (1 <= i, j, k <= N)」](https://atcoder.jp/contests/abc315/tasks/abc315_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC460 E「x + y ≡ x + y」](https://atcoder.jp/contests/abc460/tasks/abc460_e) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

## 根拠

- [ABC271 H 公式解説](https://atcoder.jp/contests/abc271/editorial/4932)
- [ABC271 H 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC315 G 公式解説](https://atcoder.jp/contests/abc315/editorial/6994)
- [ABC315 G 公式問題文](https://atcoder.jp/contests/abc315/tasks/abc315_g)
- [ABC340 F 公式解説](https://atcoder.jp/contests/abc340/editorial/9250)
- [ABC340 F 公式問題文](https://atcoder.jp/contests/abc340/tasks/abc340_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-gcd-diophantine`
