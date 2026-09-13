---
title: "Heavy-Light Decomposition"
description: "Heavy-Light Decompositionの概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 112
---

# Heavy-Light Decomposition

## 概要

### Heavy-Light Decomposition

木上pathをO(log N)本の連続区間へ分解し、配列data structure上のqueryへ変換する。

Heavy-Light Decomposition（HLD）は、根付き木の各頂点で部分木サイズ最大の子への辺をheavy、それ以外をlightとして分ける。heavy辺が連なるpathを連続した配列区間へ写し、木のpathを区間列として扱う。

light辺を子へ降りると部分木サイズは半分未満になるため、根へのpathが通るlight辺はO(log N)本。任意の二頂点間のpathもO(log N)個のheavy path区間に分かれる。分解の前処理はO(N)、各区間をsegment treeでO(log N)処理するならpath queryはO(log² N)。

和や最大値なら区間の向きを無視できるが、行列積や文字列の連結では結合順を保つ必要がある。両端からLCAへ向かう区間を分け、逆向き集約も用意する。辺に値を置くときはLCA自身の頂点位置を除外する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: ancestor query・LCA、Euler順による部分木区間化。

ancestor query・LCA・Euler順による部分木区間化で得た考え方と実装を再利用し、Heavy-Light Decompositionの発動条件・正当化・境界を重複なく学ぶ。

- Heavy-Light Decompositionの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC351 G「Hash on Tree」](https://atcoder.jp/contests/abc351/tasks/abc351_g)

## 根拠

- [ABC351 G 公式解説](https://atcoder.jp/contests/abc351/editorial/9868)
- [ABC351 G 公式問題文](https://atcoder.jp/contests/abc351/tasks/abc351_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5f45276dcadc4174611f653bed4434f2b20e1a8cf497394e82a64b26e6323c9a` / LearningUnit `unit-heavy-light-decomposition`
