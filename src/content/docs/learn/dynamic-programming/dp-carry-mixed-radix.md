---
title: "繰り上がり・借り・混合基数を状態にするDP"
description: "「繰り上がり・借り・混合基数を状態にするDP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 75
---

# 繰り上がり・借り・混合基数を状態にするDP

習得対象の目安: **青色（1600–1999）**。繰り上がりや借りだけを次の桁へ渡し、通常の桁DPと異なる走査方向を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 繰り上がり・混合基数DP

整除鎖の丸め、支払いと釣銭、複数項の加算を下位桁から処理し、次の桁へ渡すcarry・borrowだけを状態に保つ。

### 習得する技能

- 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: なし。

状態設計を土台に、整除鎖の丸めや複数項の加算で次の桁へ渡すcarryだけを有限状態として保つ。

### このUnitでは扱わないもの

- 数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。

## 問題一覧

- [ABC231 E「Minimal payments」](https://atcoder.jp/contests/abc231/tasks/abc231_e) — 主題: [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)（整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。）。
- [ABC466 G「Segment Sum Constraints」](https://atcoder.jp/contests/abc466/tasks/abc466_g) — 主題: [繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)（整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。）。追加で学ぶ技能: [potential・weighted DSU](/learn/graph/potential-dsu/)（DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC231 E 公式問題文](https://atcoder.jp/contests/abc231/tasks/abc231_e)
- [ABC231 E 公式解説](https://atcoder.jp/contests/abc231/editorial/3062)
- [ABC466 G 公式解説](https://atcoder.jp/contests/abc466/editorial/22603)
- [ABC466 G 公式問題文](https://atcoder.jp/contests/abc466/tasks/abc466_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `92099379c10b1293bc646a527638868dd1efe0702c16fd1e83cad6f8052521cb` / LearningUnit `unit-dp-carry-mixed-radix`
