---
title: "cycle space・fundamental cycle basis"
description: "「cycle space・fundamental cycle basis」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 112
---

# cycle space・fundamental cycle basis

習得対象の目安: **青色（1600–1999）**。非木辺と基本cycleを対応させ、偶数次数の辺集合をF₂上の基底で表す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第143単元。技能の説明を学んでから問題一覧へ進んでください。

前: [半環行列・min-plus/max-min遷移](/learn/combinatorics-algebra/semiring-matrix-exponentiation/) ／ 次: [有向walkの周期・cycle差分gcd](/learn/graph/directed-walk-periodicity/)

## 概要

### cycle space・fundamental cycle basis

無向graphで全頂点が偶数次数となる辺集合をF_2上のcycle space C(G)として扱い、連結成分数C、spanning forest F、各non-tree edge eが作る唯一のcycleからfundamental cycle basisとdim C(G)=M-N+Cを導く。連結graphではC=1なのでM-N+1となる。

### 習得する技能

- 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

無向graphを探索してspanning forestを構築できることを土台に、偶数次数辺集合をF_2上のcycle spaceとして捉え、fundamental cycle basisとdim C(G)=M-N+C（Cは連結成分数）を導き、path族への単射へ接続する。

### このUnitでは扱わないもの

- ord/lowを用いた橋・関節点の検出、および偶数次数辺集合のcycle-space構造を使わない単なるcycle検出。

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。

## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-cycle-space-basis`
