---
title: "構造を共有して過去の版を保存・復元する"
description: "「構造を共有して過去の版を保存・復元する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 55
---

# 構造を共有して過去の版を保存・復元する

導入対象の目安: **青色（1600–1999）**。過去へ戻す操作と過去の版を残す操作の違いを理解する入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

更新で変わる箇所を局所化し、未変更部分の共有または履歴の巻き戻しで過去の版を扱う。

## 考え方

過去の状態を扱う方法には、更新を取り消すrollbackと、更新前の節点を共有して版を残すpersistenceがある。queryの依存関係がstack順か、任意の版へ分岐するかで選ぶ。

## 成立条件と計算量

rollbackは変更記録数、persistenceはコピーする節点数が費用になる。破壊的な変更を取り消す対象と共有してよい対象を明示する。保存したrootやcheckpointが、どの時点の状態かを固定する。

概念上の親: [データ構造と問い合わせ](/learn/query/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 区間更新作用の遅延評価。

## 下位単元

- [rollback・DFS入退場の状態復元](/learn/query/rollback/) — 青色
- [永続data structure・structural sharing](/learn/query/persistence/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC273 E 公式問題文](https://atcoder.jp/contests/abc273/tasks/abc273_e)
- [ABC273 E 公式解説](https://atcoder.jp/contests/abc273/editorial/5023)
- [ABC302 H 公式解説](https://atcoder.jp/contests/abc302/editorial/6409)
- [ABC302 H 公式問題文](https://atcoder.jp/contests/abc302/tasks/abc302_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-persistence-rollback`
