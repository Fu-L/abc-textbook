---
title: "接頭辞から更新する有限状態DP"
description: "「接頭辞から更新する有限状態DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 73
---

# 接頭辞から更新する有限状態DP

導入対象の目安: **水色（1200–1599）**。prefixの有限情報だけを持つDPを、桁の上限や文字列の制約へ使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

状態設計を土台に、接頭辞から決まる有限統計を更新するという共通像を作り、数値上限の桁DPと有限automaton DPの境界を比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

### このUnitでは扱わないもの

- 整除鎖・加算式のcarryだけを下位桁から渡すDP、および接頭辞状態を使わない一般の表DP。

## 下位単元

- [上限制約付き桁DP](/learn/dynamic-programming/digit-dp/) — 水色
- [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。
- [ABC458 F「Critical Misread」](https://atcoder.jp/contests/abc458/tasks/abc458_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)。既習技能: 固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。

## 根拠

- [ABC228 G 公式解説](https://atcoder.jp/contests/abc228/editorial/2942)
- [ABC228 G 公式問題文](https://atcoder.jp/contests/abc228/tasks/abc228_g)
- [ABC235 F 公式解説](https://atcoder.jp/contests/abc235/editorial/3247)
- [ABC235 F 公式問題文](https://atcoder.jp/contests/abc235/tasks/abc235_f)
- [ABC288 H 公式解説](https://atcoder.jp/contests/abc288/editorial/5663)
- [ABC288 H 公式問題文](https://atcoder.jp/contests/abc288/tasks/abc288_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-digit-string`
