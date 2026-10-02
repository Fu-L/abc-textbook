---
title: "文字列周期・primitive word"
description: "「文字列周期・primitive word」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 152
---

# 文字列周期・primitive word

習得対象の目安: **青色（1600–1999）**。prefix一致・border・primitive rootを結び付け、周期の必要十分条件を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 文字列周期・primitive word

prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。

### 習得する技能

- prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

長さN>0の文字列Sについて、1≤p≤Nが周期とは、i+p<NでS[i]=S[i+p]となることである。p<NならZ[p]≥N−pと同値であり、p=Nは比較対象がないので常に周期となる。pを1から昇順に検査し、最初に成功したpが端の欠けを許す最小周期である。

Sがある語の整数回反復になっているかを調べるには、さらにpがNを割ることが必要になる。Nの約数pを昇順に検査し、p=NまたはZ[p]≥N−pを満たす最初のpを選ぶ。このときR=S[0:p]、反復回数k=N/pとしてS=R^kが得られる。Rがさらに短い語の反復なら、その長さもNの約数で先に成功するはずなので、Rはこれ以上反復に分解できないprimitive rootである。

例えばababaは最小周期2を持つが、2は長さ5を割らないためabの整数回反復ではない。primitive rootはababa自身、反復回数は1となる。一方abababのprimitive rootはab、反復回数は3である。同じprimitive rootを持つ文字列は、語そのものと回数を分けて比較できる。

## 成立条件と計算量

Z配列の構築とp=1,…,Nの走査でO(N)時間・空間。整数回反復の判定では、N mod p=0を満たす候補だけ検査すればよく、約数列挙のための別算法は不要である。空文字列にはこの定義で一意なprimitive rootを与えない。border（真のprefixかつsuffix）との対応は、長さN−pのborderが周期pを与えることにある。回転同値まで扱う場合は開始位置の正規化も必要になる。

概念上の親: [文字列アルゴリズム](/learn/string/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)。

このUnitを直接前提とする単元: なし。

Z algorithmによるprefix matchingで得た考え方と実装を再利用し、文字列周期・primitive wordの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 文字列周期・primitive wordの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)（prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC312 H 公式解説](https://atcoder.jp/contests/abc312/editorial/6837)
- [ABC312 H 公式問題文](https://atcoder.jp/contests/abc312/tasks/abc312_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-string-periodicity`
