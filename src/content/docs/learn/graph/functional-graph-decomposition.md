---
title: "関数グラフのcycle・tree分解"
description: "「関数グラフのcycle・tree分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 106
---

# 関数グラフのcycle・tree分解

習得対象の目安: **水色（1200–1599）**。前周期と周期を分離し、cycleへの流入と巨大回数の移動を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 関数グラフのcycle・tree分解

各頂点の後続が一意なgraphをcycleと流入treeへ分解し、前周期・周期を処理する。

### 習得する技能

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

## 考え方

入次数0を剥がすとcycleの頂点が残る。cycle ID・周上の位置・cycleまでの距離を持ち、剥がした頂点を逆順に処理して属性を伝播する。


各頂点vの入次数を数え、入次数0をqueueへ入れる。vを除くたび後続f(v)の入次数を減らし、0なら追加する。除去順orderを保存する。残る頂点は全て入次数・出次数1なのでcycleだけになる。未採番の残存頂点から後続を辿って一周し、cycleの配列、ID、位置、距離0を付ける。

orderを逆に読むと後続の属性が既に分かっているので、vのcycle IDと入る周上位置をf(v)からコピーし、dist[v]=dist[f(v)]+1とする。K≥dist[v]ならcycleの `(entryPos[v]+K−dist[v]) mod cycleLength` の位置が答え。K<dist[v]の木部分はbinary liftingでK回進む。これで初期部分と周期部分の境界を数式から処理できる。

## 成立条件と計算量

O(N)時間・空間。K歩後の頂点はcycle前の距離を引いてからcycle長で剰余を取る。木部分の祖先queryには追加索引が必要。自己loop、複数成分、cycleに着く直前の境界を確認する。

概念上の親: [一意な後続・サイクル・ダブリング](/learn/graph/functional-graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。

このUnitを直接前提とする単元: なし。

状態グラフのモデリングと探索で得た考え方と実装を再利用し、関数グラフのcycle・tree分解の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC296 E「Transition Game」](https://atcoder.jp/contests/abc296/tasks/abc296_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC256 E「Takahashi's Anguish」](https://atcoder.jp/contests/abc256/tasks/abc256_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC241 E「Putting Candies」](https://atcoder.jp/contests/abc241/tasks/abc241_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC357 E「Reachability in Functional Graph」](https://atcoder.jp/contests/abc357/tasks/abc357_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC377 E「Permute K times 2」](https://atcoder.jp/contests/abc377/tasks/abc377_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC399 E「Replace」](https://atcoder.jp/contests/abc399/tasks/abc399_e) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e) — 主題: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。追加で学ぶ技能: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。
- [ABC444 G「Kyoen」](https://atcoder.jp/contests/abc444/tasks/abc444_g) — 主題: [Gaussian整数・二平方和](/learn/number-theory/gaussian-integers-two-squares/)（Z[i]での素因数分解と共役を用い、整数の二平方和表現をprime exponentごとに構成・数え上げる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。

## 根拠

- [ABC241 E 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_e)
- [ABC241 E 公式解説](https://atcoder.jp/contests/abc241/editorial/3472)
- [ABC256 E 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_e)
- [ABC256 E 公式解説](https://atcoder.jp/contests/abc256/editorial/4135)
- [ABC258 E 公式問題文](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC258 E 公式解説](https://atcoder.jp/contests/abc258/editorial/4215)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-functional-graph-decomposition`
