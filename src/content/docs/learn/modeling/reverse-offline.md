---
title: "時間を逆向きにして未来依存を消す"
description: "「時間を逆向きにして未来依存を消す」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 14
---

# 時間を逆向きにして未来依存を消す

習得対象の目安: **水色（1200–1599）**。削除を追加に変えるなど、時間を逆に読むことで扱える操作を増やす。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 逆向きのオフライン処理

削除や上書きは、それまで持っていた情報を失わせる。操作をすべて先に読めるなら、最後から読むことで、削除を追加へ変えたり、最後に有効な上書きを先に確定したりできる。順方向の難しさが、逆方向では一度だけの処理にならないかを考える。

### 習得する技能

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

## 考え方

### 成分の分裂を、併合だけの処理に変える

辺を削除するたびに連結成分を知りたいとする。辺が消えても迂回路があれば同じ成分のままだが、なければ分裂する。DSUは成分の併合を得意とする一方、成分の代表から分裂後の構造を復元することはできない。

独自例として、頂点1〜4を辺 $$1-2,2-3,3-4$$ でつなぐ。順に $$2-3,1-2$$ を消すと、成分数は $$1\to2\to3$$ になる。逆に、最後の辺 $$3-4$$ だけの状態から始めれば、$$1-2$$ を追加して成分数2、$$2-3$$ を追加して成分数1、とDSUで処理できる。

一般に、元の操作を $$i$$ 個実行したグラフを $$G_i$$ と置く。全削除後の $$G_Q$$ を先に作り、$$i=Q,Q-1,\ldots,1$$ の順に削除辺を追加すれば、現在状態は $$G_i$$ から $$G_{i-1}$$ へ移る。

| 逆走査の段階 | 保持するグラフ | 例の成分数 |
| --- | --- | --- |
| 初期状態 | $$G_2$$ | 3 |
| 2回目の削除を戻した後 | $$G_1$$ | 2 |
| 1回目の削除を戻した後 | $$G_0$$ | 1 |

元の「削除直後」の答えは、復旧する**前**に現在値を元の操作番号へ保存する。元の「削除直前」が欲しいなら復旧後になる。この時刻の対応を書いてから実装すると、逆向きの添字でも迷いにくい。

辺追加時に根が異なれば二成分が一つになるので成分数を1減らし、同じ根なら変えない。通電する都市数のような問いでは、成分に都市数と発電所有無を持つ。逆順処理は操作を易しくする役割、DSUと成分属性は現在の答えを保つ役割である。

### 上書きは、最後に有効な操作から確定する

逆順の利点は、必ずしも「逆操作を実行できること」だけではない。代入は以前の値を消すので、最後の代入から見れば、同じ場所への古い代入を無視できる。

長さ3の配列が初め `000` で、順に「位置1を5にする」「位置2を7にする」「位置1を9にする」とする。後ろから見ると、位置1は9、位置2は7で確定する。最初の位置1への5は、既に確定済みなので無視する。どの代入で以前の値が何だったかを復元する必要はない。

行・列全体への上書きなら、各マスの最終値を決めるのは、その行または列に対する最後の操作である。逆順で未確定の行・列数を持てば、新たに確定する領域をまとめて数えられる。個別のマスを毎回塗り直す必要がなくなるのが利点であり、詳しい適用例がABC346 Eである。

一方、加算は全操作が寄与する。最後の加算だけで値を確定してはいけない。また最終盤面を数えるだけの上書き処理では、途中の全盤面を復元できたとは限らない。答えに必要な情報を後ろから確定している、と捉える。

### 最終状態を作れるかを先に確認する

削除を復旧する方法では、最後まで残る辺や要素を初期状態へ必ず入れる。元の初期グラフのまま逆操作を足しても、対応する時刻にはならない。頂点削除を逆にするなら、頂点の有効化と、有効な相手への辺追加を組にする。

同じ辺を繰り返し削除できる設定では、削除回数などを管理し、逆向きで実際に有効へ戻る時だけ追加する。追加・削除が混在するなら、逆向きでも両方が残る。単純な逆順で解消しなければ、辺が存在する時間区間を扱う[rollback](/learn/query/rollback/)などを検討する。

## 成立条件と計算量

全操作を事前に読めることと、逆走査で必要な初期状態を構築・表現できることが条件である。入力後すぐ回答し、その答えに依存して次の操作が決まる対話的・オンラインの問題には、そのまま適用できない。

辺削除だけなら、頂点数を $$V$$、初期辺数を $$E$$、削除数を $$Q$$ として、初期化・保存・出力に $$O(V+E+Q)$$、DSUで各辺を一度だけ併合する費用に $$O(E\alpha(V))$$ がかかる。全空間は辺・操作・答え・DSUを含む $$O(V+E+Q)$$ である。逆に読むだけで高速化が保証されるのではなく、各要素や各辺を何回処理するかを数える。

上書きの確定は各場所を一度だけ扱えれば、走査と合わせて $$O(Q+L)$$ となる。ここで $$L$$ は個別に確定する場所の数である。行・列数のような集約を使う場合は、保持する統計と更新回数から改めて評価する。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

削除・上書き・未来依存を含む更新列を逆向きに読み、追加だけ・first-writeだけなどの単調な処理へ変換して元の時刻へ答えを戻す。

### このUnitでは扱わないもの

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 問題一覧

- [ABC229 E「Graph Destruction」](https://atcoder.jp/contests/abc229/tasks/abc229_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC346 E「Paint」](https://atcoder.jp/contests/abc346/tasks/abc346_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC264 E「Blackout 2」](https://atcoder.jp/contests/abc264/tasks/abc264_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。）。
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC264 E 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_e)
- [ABC264 E 公式解説](https://atcoder.jp/contests/abc264/editorial/4583)

- [ABC229 E 公式問題文](https://atcoder.jp/contests/abc229/tasks/abc229_e)
- [ABC229 E 公式解説](https://atcoder.jp/contests/abc229/editorial/2958)
- [ABC238 H 公式解説](https://atcoder.jp/contests/abc238/editorial/3361)
- [ABC238 H 公式問題文](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC249 F 公式解説](https://atcoder.jp/contests/abc249/editorial/3789)
- [ABC249 F 公式問題文](https://atcoder.jp/contests/abc249/tasks/abc249_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-reverse-offline`
