---
title: "対話protocolを守って情報を取得する"
description: "対話protocolを守って情報を取得するの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 27
---

# 対話protocolを守って情報を取得する

## 概要

### 対話protocolとquery設計

judgeとの問い合わせ・応答列をprotocolどおり実行し、回数上限内で必要な情報を識別する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

問い合わせ形式・回数上限・応答依存性・flushを明示し、通常のアルゴリズムをjudgeとの対話列として安全に実行する。

- 入力を最初からすべて読める通常問題、および問い合わせ上限やflushを持たない模擬入出力。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC269 E「Last Rook」](https://atcoder.jp/contests/abc269/tasks/abc269_e)
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC337 E「Bad Juice」](https://atcoder.jp/contests/abc337/tasks/abc337_e)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)

## 根拠

- [ABC269 E 公式問題文](https://atcoder.jp/contests/abc269/tasks/abc269_e)
- [ABC269 E 公式解説](https://atcoder.jp/contests/abc269/editorial/4840)
- [ABC278 G 公式解説](https://atcoder.jp/contests/abc278/editorial/5237)
- [ABC278 G 公式問題文](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC282 F 公式解説](https://atcoder.jp/contests/abc282/editorial/5403)
- [ABC282 F 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-interactive-protocol`
