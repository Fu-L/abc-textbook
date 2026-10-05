---
title: "乱択の成功条件と誤り確率を設計する"
description: "「乱択の成功条件と誤り確率を設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 25
---

# 乱択の成功条件と誤り確率を設計する

習得対象の目安: **青色（1600–1999）**。一回の成功確率と試行回数を結び付け、乱択が許す誤りを評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 乱択・Monte Carloアルゴリズム

乱数で候補またはfingerprintを選び、成功条件と誤り確率を評価して反復や事後検証を設計する。

### 習得する技能

- 乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。

## 考え方

乱択によって悪い配置を避けるか、軽い検査で答えを推測するかを区別する。常に正しく期待時間を改善するLas Vegasと、時間を抑えて誤り確率を許すMonte Carloでは保証が違う。

候補を一回T時間で生成・検証し、正しい候補が確率s>0で得られるとする。検証は決定的で、試行は独立かつ同じ成功確率を持つなら、成功までの試行数の期待値はΣ_{j≥0}(1−s)^j=1/s、期待時間はT/sである。t回で打ち切ると未発見の確率は(1−s)^t。0<s<1なら目標εに対してt≥ceil(log ε/log(1−s))と選ぶ。s=1なら一回でよい。打切り後の「未発見」を「解なし」の証明と混同しない。

指紋の一致など、一方の答えだけに誤りがある検査では、誤り得る側の答えが独立なt試行全てで出たときだけ採用する。一試行の誤り上界がεならε^tに減る。両側に誤りがある検査では、全試行の一致を要求するだけで正しい答えを保てるとは限らず、多数決などに別の証明が要る。

多項式評価を検査に使う場合は、非零多項式の根が少ないことを使う。体上の一変数・次数dの多項式は根を高々d個持つので、集合Sから一様な評価点を選べば0になる確率は高々d/|S|。多変数でも総次数dで、各変数をSから独立一様に選ぶなら同じ上界になる。最後の変数の最高次数をkとすると、その係数が0になる確率は帰納的に高々(d−k)/|S|、係数が非零なら最後の変数での失敗は高々k/|S|だからである。対象が違うとき差の多項式が非零であることは、利用する側で示す。

## 成立条件と計算量

期待時間や誤り確率は乱数の選び方と入力との独立性を明示して評価する。Q回の検査ではunion boundで全体の失敗を抑える。試行を重ねる場合も独立性が必要で、経験的に通ったことを確率の証明にしない。

各検査の誤りがε_i以下なら、全体の誤りはΣ_i ε_i以下。検査同士の独立性は不要であり、同じ乱数表を共有するQ比較にもQεを使える。乱数によって比較対象が変わるときには、固定入力の一比較の保証を無条件に当てはめず、候補全体や初めて誤るまでの比較列を評価する。法を乱数にする整数検査は、[乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)で扱う素因数の個数の評価を使う。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)、[一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)、[乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/)。

乱数が作る事象と成功条件を分離し、独立試行による誤り確率の減衰や決定的な事後検証まで設計する。

### このUnitでは扱わないもの

- 誤り確率の評価を伴わない固定hash、および入力全体を確定的に列挙できる探索。

## 下位単元

- [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/) — 黄色

## 問題一覧

- [ABC422 E「Colinear」](https://atcoder.jp/contests/abc422/tasks/abc422_e) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC272 G「Yet Another mod M」](https://atcoder.jp/contests/abc272/tasks/abc272_g) — 主題: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g) — 主題: [線形matroid交差の乱択rank判定](/learn/combinatorics-algebra/linear-matroid-intersection/)（二つの線形matroid表現から乱択intersection matrixを構成し、Schwartz–Zippelの誤り上界を示したうえでrankを最大共通独立sizeとして判定できる。）。既習技能: [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)（乱数で選ぶ対象と成功条件を定め、誤り確率を上から評価して必要な反復回数または決定的な事後検証を設計できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC238 G 公式解説](https://atcoder.jp/contests/abc238/editorial/3358)
- [ABC238 G 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_g)
- [ABC272 G 公式解説](https://atcoder.jp/contests/abc272/editorial/4981)
- [ABC272 G 公式問題文](https://atcoder.jp/contests/abc272/tasks/abc272_g)
- [ABC339 F 公式解説](https://atcoder.jp/contests/abc339/editorial/9206)
- [ABC339 F 公式問題文](https://atcoder.jp/contests/abc339/tasks/abc339_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-randomized-algorithms`
