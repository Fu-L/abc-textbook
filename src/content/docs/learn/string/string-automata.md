---
title: "禁止・要求patternを有限状態へ圧縮する"
description: "「禁止・要求patternを有限状態へ圧縮する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 154
---

# 禁止・要求patternを有限状態へ圧縮する

導入対象の目安: **青色（1600–1999）**。未来の受理条件が同じprefixをまとめ、有限状態へ変換する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

未来の禁止・要求pattern到達や複数pattern一致だけを決める進行段階・接尾辞状態を作り、遷移表上のDP・行列計算へ接続する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 数値上限・桁・繰り上がりを状態にする桁DP、および接頭辞一致長だけを求めるKMP・Z法。

## 下位単元

- [有限状態automatonの構成](/learn/string/finite-pattern-automaton/) — 青色
- [Aho–Corasick](/learn/string/aho-corasick/) — 黄色
- [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/) — 黄色

## 問題一覧

基本から応用へ進む目安として、原則としてABCの出題枠順（E→F→G→H/Ex）に並べています。同じ枠では問題ID順とし、導入に適した問題を先に読むべき明確な理由がある場合だけ順序を補正しています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC264 G「String Fair」](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC305 G「Banned Substrings」](https://atcoder.jp/contests/abc305/tasks/abc305_g)
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g)

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC264 G 公式解説](https://atcoder.jp/contests/abc264/editorial/4580)
- [ABC264 G 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_g)
- [ABC301 F 公式解説](https://atcoder.jp/contests/abc301/editorial/6331)
- [ABC301 F 公式問題文](https://atcoder.jp/contests/abc301/tasks/abc301_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-string-automata`
