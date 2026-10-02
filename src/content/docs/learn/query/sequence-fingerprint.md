---
title: "列・文字列のrolling fingerprint"
description: "「列・文字列のrolling fingerprint」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 54
---

# 列・文字列のrolling fingerprint

習得対象の目安: **水色（1200–1599）**。prefix hashと連結則を実装し、長さ・指数位置・衝突確率を確認する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 列・文字列のrolling fingerprint

順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。

文字を体F_pの異なる元へ写し、基数bに対してh(s)=s_0 b^(n-1)+…+s_(n-1)と定める。h(st)=h(s)b^|t|+h(t)なので、文字の順序と長さを保って連結できる。

各列を(f,r,q)=(順方向hash,逆方向hash,b^長さ)で要約する。SとTの連結は(f_S q_T+f_T, r_S+q_S r_T, q_S q_T)。長さ0は(0,0,1)であり、逆向き側の結合順が反転することを確認する。

静的な列ではH[i]=h(S[0:i])と基数冪を前計算すると、h(S[l:r])=H[r]-H[l]b^(r-l)をO(1)で取り出せる。比較する列の長さと指数位置を揃える。

具体的にはH[0]=0、pow[0]=1から、H[i+1]=bH[i]+s_i、pow[i+1]=b·pow[i]をmod pで更新する。複数列の比較では同じ文字写像・法・基数を使う。空列のhashは0だが、長さは別に保持し、長さの異なる列の値だけを比較しない。

二つのsuffixのLCPは、両方に残る長さの最小値をMとしてprefix一致を二分探索する。lo=0を一致する長さ、hi=M+1を探索用の不一致番兵として、hi−lo>1の間、mid=floor((lo+hi)/2)のprefixを比較し、一致ならlo←mid、他ならhi←mid。衝突がなければ一致する長さは0から真のLCPまでの連続区間なので、最後のloが答えである。番兵M+1の実際の区間は取得しない。一回O(log(M+1))のhash比較であり、hashが衝突すれば二分探索の単調性も失われ得る。

回文なら順方向と逆方向のhashは等しい。例えばabaは常に一致するが、異なる列でも衝突し得る。固定された長さLの異なる二列と一様な非零基数に対し、差の非零多項式の次数は高々L-1なので、衝突確率は高々(L-1)/(p-1)。多数比較ではその総数も含めて評価する。

ABC331 Fではこの要約を順序を保つ区間集約に載せると更新と回文queryを扱える。ここで導出した要約と結合式を、[区間monoid要約の節](/learn/query/range-monoid-aggregation/)で学んだデータ構造へ適用する。

### 習得する技能

- 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

異なる同長の列の差は、文字写像が単射なら非零の多項式になる。順序を残す指数と、区間の切り出しで消す指数を揃えることが核心である。整数列をそのままmod pへ写す場合、異なる整数が同じ体元にならないことも確認する。順序を捨てる多重集合の指紋は[乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)を使う。

## 成立条件と計算量

静的prefixの構築はO(N)、空間O(N)、区間比較O(1)。一点変更でprefix全体を更新するならO(N)であり、上の連結要約をsegment treeへ載せれば更新・区間取得はO(log N)となる。その場合のLCP二分探索はO(log² N)となる。

長さ上界Lの固定された異なる列に、独立一様な非零基数をt個使うと誤りは高々ε^t、ε=min(1,(L−1)/(p−1))。固定されたQ比較の全体はQε^t以下であり、t倍の構築・比較費用も数える。LCPで比較長がhashの結果に依存する場合は、衝突がないときの探索経路を考える。初めて衝突するまで実際の経路も同じなので、誤りはその固定経路上の不一致比較のいずれかで起きる。固定されたLCP query群について、その経路の比較数の総和をQにして評価できる。入力やquery自体が乱数の公開後に選ばれる場合には、この保証をそのまま使えない。

概念上の親: [Rolling fingerprintで列の同値性を比較する](/learn/query/string-hash/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 列・文字列のrolling fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h) — 主題: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)（順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)（順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-sequence-fingerprint`
