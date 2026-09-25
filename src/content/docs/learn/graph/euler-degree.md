---
title: "次数parityからwalkや選択辺集合を判定・構成する"
description: "「次数parityからwalkや選択辺集合を判定・構成する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 116
---

# 次数parityからwalkや選択辺集合を判定・構成する

導入対象の目安: **水色（1200–1599）**。次数と連結性から全辺を使う歩道や選択辺集合の条件を読む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

グラフを探索できることを前提に、全辺walkの成立性や選択辺集合の端点条件を次数parityで特徴付け、葉から判定・構成する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

### このUnitでは扱わないもの

- 容量付きフロー・マッチング・最小カットへの帰着。

## 下位単元

- [Euler trail・circuit](/learn/graph/euler-trail-circuit/) — 水色
- [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/) — 青色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC336 G「16 Integers」](https://atcoder.jp/contests/abc336/tasks/abc336_g) — 主題: [BEST定理によるEuler circuit数え上げ](/learn/combinatorics-algebra/euler-circuit-counting/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 全辺を一度ずつ使うwalkの連結性と入出次数条件を判定し、Hierholzer法でtrail/circuitを構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

## 根拠

- [ABC227 H 公式解説](https://atcoder.jp/contests/abc227/editorial/2915)
- [ABC227 H 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC286 G 公式解説](https://atcoder.jp/contests/abc286/editorial/5573)
- [ABC286 G 公式問題文](https://atcoder.jp/contests/abc286/tasks/abc286_g)
- [ABC336 G 公式解説](https://atcoder.jp/contests/abc336/editorial/9060)
- [ABC336 G 公式問題文](https://atcoder.jp/contests/abc336/tasks/abc336_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-euler-degree`
