---
title: "関数グラフのcycle・tree分解"
description: "「関数グラフのcycle・tree分解」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
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

各頂点から出る辺がちょうど一本なら、どの頂点から進んでも、有限個の頂点のどれかを再訪する。再訪後は同じ道を繰り返すので、移動は「サイクルへ入るまで」と「サイクル上」に分けられる。サイクルへ流れ込む部分は、辺がサイクルの方を向いた木になる。

以下は公式の入力例とは別の、独自の小例である。頂点を $$1,2,3,4$$ とし、後続を表す写像を $$f=(2,3,2,3)$$、つまり $$f(1)=2,f(2)=3,f(3)=2,f(4)=3$$ とする。

$$
1\longrightarrow 2\rightleftarrows 3\longleftarrow 4
$$

中央の $$2\to3\to2$$ がサイクルで、$$1\to2$$ と $$4\to3$$ がそこへ流れ込む木の辺である。**出発点にいる時点を時刻0**とする。頂点1から進むと、$$K=0,1,2,3$$ 歩後の頂点は順に $$1,2,3,2$$ となる。

### 入次数0を剥がすと何が残るか

全頂点の入次数を数え、入次数0の頂点をキューへ入れる。頂点 $$v$$ を除くたびに後続 $$f(v)$$ の入次数を1減らし、0になったらキューへ追加する。除去した順序を配列 `order` に保存する。小例では頂点1と4を除くと、頂点2と3だけが残る。サイクル上の頂点は、直前の頂点からの辺があるため除去されない。

一般の有向グラフでは、この処理でサイクル以外も残る。例えば $$1\to2\to1$$ に辺 $$2\to3$$ を足すと、どの頂点も入次数0にならず、サイクル外の頂点3も残る。

出次数1の場合は、残る頂点から除去済みの頂点へ向かう辺がない。そのような辺があれば、除去時の入次数が0だったことに矛盾する。従って、残存頂点数を $$R$$ とすると、残存辺数も $$R$$ 本である。一方、処理終了時の各頂点の入次数は1以上で、その総和は辺数と等しい $$R$$ だから、入次数はすべて1になる。出次数も1なので、残るグラフは互いに交わらないサイクルだけである。

### サイクルの入口と距離を分けて持つ

未採番の残存頂点から後続をたどって一周し、サイクルの頂点を進行順に配列へ並べる。各頂点にサイクルID、周上の位置、サイクルまでの距離0を付ける。以後、`cycle[id]` をその配列、`cycleId[v]` を頂点 $$v$$ が到達するサイクルのIDとする。

さらに、`dist[v]` をサイクルへ初めて着くまでの歩数、`entryPos[v]` をその入口の配列内位置とする。サイクル上の頂点では、入口は自分自身である。小例で配列を `cycle[0] = [2, 3]` とすると、属性は次のようになる。

| 頂点 | `cycleId` | `dist` | `entryPos` |
| --- | --- | --- | --- |
| 1 | 0 | 1 | 0 |
| 2 | 0 | 0 | 0 |
| 3 | 0 | 0 | 1 |
| 4 | 0 | 1 | 1 |

頂点1と2は同じ入口を持つが、そこまでの距離は異なる。頂点1と4は距離が同じでも、入口の位置は異なる。この二つの属性を分けることで、木の部分と周上の移動を接続できる。

木の属性は `order` を逆順に読んで埋める。除去した頂点の後続は、サイクル上に残るか、その頂点より後に除去されるので、逆順では後続の属性が既に分かっている。そこで、$$v$$ のサイクルIDと入口の位置を $$f(v)$$ からコピーし、距離を

$$
\mathrm{dist}[v]=\mathrm{dist}[f(v)]+1
$$

とする。

### 歩数から木の部分を引いて周期へつなぐ

$$v$$ から $$K$$ 歩進むとき、$$K\geq\mathrm{dist}[v]$$ なら、最初の $$\mathrm{dist}[v]$$ 歩は入口へ着くために使う。サイクル上で進むのは残りの $$K-\mathrm{dist}[v]$$ 歩なので、サイクル長を $$C$$ として答えの位置は

$$
\bigl(\mathrm{entryPos}[v]+K-\mathrm{dist}[v]\bigr)\bmod C
$$

になる。`cycle[cycleId[v]]` のこの位置にある頂点を返す。頂点1から3歩なら、入口へ1歩、周上で2歩なので、位置は $$(0+3-1)\bmod2=0$$、答えは頂点2である。距離を引かないと、木で使った一歩まで周上の移動として数えてしまう。

$$K<\mathrm{dist}[v]$$ では、まだ木の途中なのでサイクルの式は使えない。小例の頂点1から0歩の答えは頂点1であり、サイクル配列には含まれない。この場合は [doubling・binary lifting](/learn/graph/binary-lifting/) で $$K$$ 回後を求める。$$K=\mathrm{dist}[v]$$ ではちょうど入口、$$K=\mathrm{dist}[v]+C$$ ではそこから一周して同じ入口となる。

## 成立条件と計算量

対象は $$N\geq1$$ 頂点で各頂点の後続が一意に決まる関数グラフである。各頂点を高々一回除去し、各サイクルを一周し、除去順を一回逆に読むので、**分解と属性の構築は $$O(N)$$ 時間・空間**で済む。サイクル到着後の行き先は、属性と配列から一回の質問につき $$O(1)$$ 時間で求まる。

木の途中への質問も扱うなら、索引の追加費用を分解と分けて数える。上の方法では木の移動は $$K<\mathrm{dist}[v]\leq N-1$$ に限るため、ダブリング表は最大 $$N-1$$ 歩を扱えればよい。この表の構築・空間は $$O(N\log(N+1))$$、木部分の質問は $$O(\log(N+1))$$ 時間となる。巨大な $$K$$ のサイクル部分は剰余で処理するため、この索引を $$K$$ の桁数まで増やす必要はない。

自己ループは長さ1のサイクルとして扱える。複数成分があればそれぞれを採番し、木の経路が合流するときも後続の属性を各頂点へ伝播すればよい。$$K=0$$、サイクル直前、入口到着、一周後を区別して確認する。

行き先に加えて途中の累積値も必要なら、[次のダブリング単元](/learn/graph/binary-lifting/)で同じ写像に出発点の寄与を載せ、移動と集約を一緒に合成する。

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

2026-10-28にABC241 Eの公式問題文・個別公式解説を再照合した。同問では、アメの個数の剰余を状態、操作前の剰余で選ぶ追加個数を出発点の寄与とする。公式解説は周期を使う方法とダブリングの両方を示している。本文の4頂点の小例と入次数による分解の論証は、本書の独自の説明である。

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-functional-graph-decomposition`
