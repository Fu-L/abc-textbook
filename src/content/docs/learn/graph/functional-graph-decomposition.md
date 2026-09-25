---
title: "関数グラフのcycle・tree分解"
description: "「関数グラフのcycle・tree分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 102
---

# 関数グラフのcycle・tree分解

習得対象の目安: **水色（1200–1599）**。前周期と周期を分離し、cycleへの流入と巨大回数の移動を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第56単元。技能の説明を学んでから問題一覧へ進んでください。

前: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/) ／ 次: [有向cycle検出・sink/source peeling](/learn/graph/directed-core-peeling/)

## 概要

### 関数グラフのcycle・tree分解

各頂点の後続が一意なgraphをcycleと流入treeへ分解し、前周期・周期を処理する。

### 習得する技能

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、関数グラフのcycle・tree分解の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
2. [ABC241 E「Putting Candies」](https://atcoder.jp/contests/abc241/tasks/abc241_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。
3. [ABC296 E「Transition Game」](https://atcoder.jp/contests/abc296/tasks/abc296_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。
4. [ABC256 E「Takahashi's Anguish」](https://atcoder.jp/contests/abc256/tasks/abc256_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。
5. [ABC357 E「Reachability in Functional Graph」](https://atcoder.jp/contests/abc357/tasks/abc357_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。
6. [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。
7. [ABC377 E「Permute K times 2」](https://atcoder.jp/contests/abc377/tasks/abc377_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。
8. [ABC399 E「Replace」](https://atcoder.jp/contests/abc399/tasks/abc399_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。
9. [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。 / 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 対称操作で同値な状態の標準形と不変量を選べる。
10. [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。 / 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。 / 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g) — 主題: [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)。既習技能: 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

## 根拠

- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC256 E 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_e)
- [ABC256 E 公式解説](https://atcoder.jp/contests/abc256/editorial/4135)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-functional-graph-decomposition`
