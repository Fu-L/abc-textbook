---
title: "凸性・傾き・限界費用・slope trick"
description: "「凸性・傾き・限界費用・slope trick」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 223
---

# 凸性・傾き・限界費用・slope trick

導入対象の目安: **青色（1600–1999）**。差分の単調性を入口に、凸関数の選択・合成・制約付き最適化を見渡す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

目的関数の凸・凹性と傾き変化を捉え、breakpointや限界費用から最適点を求める。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- 真偽値の単調境界探索と、交換論だけで決まる貪欲順。

## 下位単元

- [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/) — 青色
- [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/) — 青色
- [isotonic regression・PAV](/learn/geometry-optimization/isotonic-regression/) — 橙色
- [slope trick](/learn/geometry-optimization/slope-trick/) — 黄色
- [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/) — 橙色
- [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/) — 橙色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC263 G「Erasing Prime Pairs」](https://atcoder.jp/contests/abc263/tasks/abc263_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC216 E 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 E 公式解説](https://atcoder.jp/contests/abc216/editorial/2469)
- [ABC217 H 公式解説](https://atcoder.jp/contests/abc217/editorial/2581)
- [ABC217 H 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_h)
- [ABC224 G 公式解説](https://atcoder.jp/contests/abc224/editorial/2816)
- [ABC224 G 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `a83767c84a9cb372c1228a1849ba7ad25ea0b926c3443a52e846b4230fa86ee8` / LearningUnit `unit-discrete-convex`
