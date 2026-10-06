---
title: "bitwise greedyによるmask最適化"
description: "「bitwise greedyによるmask最適化」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 12
---

# bitwise greedyによるmask最適化

習得対象の目安: **水色（1200–1599）**。上位bitの優先性と単調な可否判定を組み合わせてmaskを決める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### bitwise greedyによるmask最適化

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。

### 習得する技能

- 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

数値を上位bitから確定すると、上位の一桁の改善が全下位bitの変化より大きい。既に決めたprefixを保ったまま次のbitを希望値にできるかを判定し、可能なら確定する。


候補集合が空でないと分かっており、各合法解の非負整数値を最大化したいとする。高位bitからprefixを一つずつ確定し、現在prefixにそのbitを1とした値を持つ合法解が存在するかoracleで判定する。存在すれば1を採用、無ければ0とする。上位bitの差は全下位bitの和より大きいため、成功する1を捨てた解は今後逆転できず、存在する候補集合を保つ帰納法で最大値が得られる。

ORなどで「maskの全bitを満たす」条件をoracleにする場合は、それが求める値のprefix判定と同値か、下位未確定bitを自由にできるかを示す。最小化では0のprefixが実現するかを先に試す。個々のbitの成立が独立だと仮定して全成功bitを足すだけでは、同時に満たす解がない場合を扱えない。

## 成立条件と計算量

bit数B、判定費用TならO(BT)。各段の実現可能集合が空にならない不変量と、判定に渡すmaskの意味を保つ。bitごとの独立最適化とは異なり、過去の決定をすべて制約として残す。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC408 E「Minimum OR Path」](https://atcoder.jp/contests/abc408/tasks/abc408_e) — 主題: [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)（上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC408 E 公式問題文](https://atcoder.jp/contests/abc408/tasks/abc408_e)
- [ABC408 E 公式解説](https://atcoder.jp/contests/abc408/editorial/13159)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-bitwise-greedy-feasibility`
