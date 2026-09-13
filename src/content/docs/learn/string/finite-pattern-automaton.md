---
title: "有限状態automatonの構成"
description: "有限状態automatonの構成の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 65
---

# 有限状態automatonの構成

## 概要

### 有限状態automatonの構成

文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。

ABC301 FはDDoS型の部分列を含まない埋め方を求める。禁止部分列を完成させない状態を足すのが答えである。DD??Sでは二つとも大文字の場合だけ許され、26²=676。全52²から676を引くと禁止される側を数えてしまう。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

文字を一つ加えた後の未来の挙動が等しい履歴を有限状態へ同値化し、pattern suffix・部分列進行・圧縮DP rowなどから全文字の完全遷移表を構築する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

- 有限状態automatonの構成の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)

## 根拠

- [ABC264 G 公式解説](https://atcoder.jp/contests/abc264/editorial/4580)
- [ABC264 G 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G 公式解説](https://atcoder.jp/contests/abc305/editorial/6540)
- [ABC305 G 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-finite-pattern-automaton`
