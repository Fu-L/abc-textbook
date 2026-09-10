---
title: "列・文字列のrolling fingerprint"
description: "列・文字列のrolling fingerprintの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 147
---

# 列・文字列のrolling fingerprint

## 概要

### 列・文字列のrolling fingerprint

順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。

文字を体F_pの異なる元へ写し、基数bに対してh(s)=s_0 b^(n-1)+…+s_(n-1)と定める。h(st)=h(s)b^|t|+h(t)なので、文字の順序と長さを保って連結できる。

各列を(f,r,q)=(順方向hash,逆方向hash,b^長さ)で要約する。SとTの連結は(f_S q_T+f_T, r_S+q_S r_T, q_S q_T)。長さ0は(0,0,1)であり、逆向き側の結合順が反転することを確認する。

静的な列ではH[i]=h(S[0:i])と基数冪を前計算すると、h(S[l:r])=H[r]-H[l]b^(r-l)をO(1)で取り出せる。比較する列の長さと指数位置を揃える。

回文なら順方向と逆方向のhashは等しい。例えばabaは常に一致するが、異なる列でも衝突し得る。固定された長さLの異なる二列と一様な非零基数に対し、差の非零多項式の次数は高々L-1なので、衝突確率は高々(L-1)/(p-1)。多数比較ではその総数も含めて評価する。

ABC331 Fではこの要約を順序を保つ区間集約に載せると更新と回文queryを扱える。ここでは要約と結合式までを導出し、後続のデータ構造からそのまま再利用する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 列・文字列のrolling fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F「Palindrome Query」](https://atcoder.jp/contests/abc331/tasks/abc331_f)

## 根拠

- [ABC274 H 公式解説](https://atcoder.jp/contests/abc274/editorial/5026)
- [ABC274 H 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC331 F 公式解説](https://atcoder.jp/contests/abc331/editorial/7820)
- [ABC331 F 公式問題文](https://atcoder.jp/contests/abc331/tasks/abc331_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-sequence-fingerprint`
