---
title: "木の均衡分離点から重心分解へ進む"
description: "「木の均衡分離点から重心分解へ進む」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 142
---

# 木の均衡分離点から重心分解へ進む

習得対象の目安: **黄色（2000–2399）**。重み付きの一点分離と、頂点数を半減させる再帰分解を区別し、分離点を通る寄与を集計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 木の均衡分離点と重心分解

非負重みの各成分を半分以下にする一点を選ぶ。頂点数を重みとし各成分で繰り返すと、対数深さの重心分解を得る。

### 一点の均衡分離点

木の各頂点に非負重みを置き、総和をWとする。ある頂点を除いて重みW/2を超える成分があれば、その方向へ進む。戻る側の重みはW/2未満なので後戻りせず停止し、各成分が半分以下の一点を得る。部分木重みと親側の重みをDFSで求めてもO(N)。ABC453 Fの重みは元の葉の個数であり、通常の頂点数ではない。

### 再帰利用による重心分解

頂点数を重みにして重心を除き、各残存成分で再び重心を選ぶ。成分サイズが半減するため深さO(log N)、各段を線形走査して全体O(N log N)。ABC291 Exで分解木そのものを構成し、ABC359 Gで重心を通るpairだけを集計する。葉数による一点選択だけから頂点数の対数深さを主張してはいけない。

### 習得する技能

- 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。
- 非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。

## 考え方

非負重みの木で、頂点を除いた各成分の重みが総重みの半分以下となる点を選ぶ。頂点数を重みにして再帰的に分ける重心分解は、各段でサイズが半減する。

## 成立条件と計算量

一点の選択はO(N)、頂点数重心による全分解はO(N log N)。葉数など別の重みを使う一点選択から、頂点数の対数深さを主張しない。pathの集約では重心を通るpairだけを重複なく数える。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

部分木重みから一点の均衡分離点を選ぶ基本を学び、頂点数重みで再帰利用すると各成分が半減して深さを抑えられることを示す。

### このUnitでは扱わないもの

- LCA・HLDによる固定木上パスの区間分解。

## 問題一覧

- [ABC291 Ex「Balanced Tree」](https://atcoder.jp/contests/abc291/tasks/abc291_h) — 主題: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。）。
- [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g) — 主題: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC362 F「Perfect Matching on a Tree」](https://atcoder.jp/contests/abc362/tasks/abc362_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 N=2を別扱いし、元の木の葉に重み1、他に0を置いて一点だけ均衡分離点を選ぶ。各成分の葉数が全葉数の半分以下になることを使い、残数最大の異なるgroupへ色を配る。削除後に生じた葉を数え直したり、各成分を再帰的に重心分解したりしない。

## 根拠

- [ABC291 H 公式解説](https://atcoder.jp/contests/abc291/editorial/5840)
- [ABC291 H 公式問題文](https://atcoder.jp/contests/abc291/tasks/abc291_h)
- [ABC359 G 公式解説](https://atcoder.jp/contests/abc359/editorial/10255)
- [ABC359 G 公式問題文](https://atcoder.jp/contests/abc359/tasks/abc359_g)
- [ABC362 F 公式解説](https://atcoder.jp/contests/abc362/editorial/10400)
- [ABC362 F 公式問題文](https://atcoder.jp/contests/abc362/tasks/abc362_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-tree-balanced-separators`
