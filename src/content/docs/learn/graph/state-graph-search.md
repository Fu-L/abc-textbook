---
title: "状態グラフのモデリングと探索"
description: "「状態グラフのモデリングと探索」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 88
---

# 状態グラフのモデリングと探索

習得対象の目安: **緑色（800–1199）**。位置と補助情報を一つの頂点にし、状態数・辺数を見積もってBFSやDFSを使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 状態グラフのモデリングと探索

移動や操作を繰り返す問題では、「今どこにいるか」だけで次の選択肢が決まるとは限らない。鍵の所持、訪問回数の偶奇、向きなど、未来の判断に必要な情報を位置に加え、一組をグラフの頂点にする。合法な1回の操作を辺にすれば、入力には明示されていない状態グラフを探索できる。

[親単元](/learn/graph/graph-search/)で見たDFS・BFSを使う前に、何を同じ状態としてまとめられるかを決める。そのうえで、到達判定ならDFSやBFS、単位費用の最短化ならBFS、経路の列挙なら選択を戻す探索（backtracking）を検討する。

### 習得する技能

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

## 考え方

### 同じ位置から、同じ続きを選べるか

二つの履歴を一つの状態にまとめるには、そこから可能な操作とその費用、操作後の状態、目標を満たすかの判定が、残した情報だけで決まる必要がある。過去の経路そのものを忘れても、同じ続きを選べるかを確かめる。

[ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f)では、各頂点が列に現れた回数の偶奇が条件になる。頂点の重複を許す歩道（walk）を扱い、長さは通った辺数ではなく、列に含まれる頂点数で数える。

二頂点1、2を1本の無向辺で結んだ独自例で、列 $$1\to2\to1$$ を追う。奇数回現れた頂点のビットを1にした整数を $$mask$$、末尾の頂点を $$v$$ とする。頂点1を下位ビット、頂点2をその次のビットに対応させると、状態は次のようになる。

| ここまでのwalk | $$(mask,v)$$ | 長さ |
| --- | --- | --- |
| $$(1)$$ | $$(\mathtt{01},1)$$ | 1 |
| $$(1,2)$$ | $$(\mathtt{11},2)$$ | 2 |
| $$(1,2,1)$$ | $$(\mathtt{10},1)$$ | 3 |

最初と最後はどちらも位置1だが、目標の偶奇が $$\mathtt{10}$$ なら最後だけが条件を満たす。従って位置だけの訪問済み記録では、必要な再訪を消してしまう。一方、末尾と偶奇がともに等しい二つのwalkなら、次に選べる隣接頂点は同じで、同じ続きを付け足した後の偶奇も等しい。最短長だけが目的なら、その状態へは短い方の履歴だけを残せばよい。

### 偶奇の更新を辺にし、距離層で処理する

一般の $$N$$ 頂点でも、頂点 $$v\in\{1,\ldots,N\}$$ に対応するビットを $$B_v=2^{v-1}$$ とする。実装では `1 << (v - 1)` に相当する。末尾 $$v$$ から隣接頂点 $$u$$ を追加すると、$$u$$ の出現回数だけが1増えるので、そのビットを排他的論理和（XOR）で反転する。

$$
(mask,v)\longrightarrow(mask\mathbin{\mathrm{XOR}}B_u,u)
$$

ビットを立てるだけでは、2回目の訪問を数えられない。小例では $$\mathtt{01}\to\mathtt{11}\to\mathtt{10}$$ と、1のビットが消える。さらに頂点2、1へと進めば $$\mathtt{00}\to\mathtt{01}$$ となり、最初の状態へ戻る閉路もできる。ビット集合は増減するため、部分集合の包含順に小さい集合から値を確定するDPにはできない。bitmaskは状態の表現であり、処理順は遷移の性質から別に決める。

この問題では頂点を一つ追加する費用が常に1なので、BFSを使える。$$dist[mask][v]$$ を、その状態を実現する最短のwalk長とし、次のように求める。

1. 全状態を未訪問にする。始点は自由なので、各頂点 $$v$$ の単頂点walk $$(v)$$ に対応する $$dist[B_v][v]=1$$ を登録し、すべてキューへ入れる。
2. キューから $$(mask,v)$$ を取り出し、$$v$$ の各隣接頂点 $$u$$ への遷移を作る。遷移先の**組全体**が未訪問なら距離を1増やして記録し、キューへ追加する。登録した訪問記録は探索中に消さない。
3. 探索後、0でない各 $$mask$$ について $$\min_{1\leq v\leq N}dist[mask][v]$$ を取る。目標は偶奇だけを指定し、末尾を問わないためである。これらを足したものが、全偶奇パターンに対する最短長の総和になる。

これは同じ距離1の始点をすべて先に入れる多始点BFSである。長さ1の全状態、長さ2の全状態、という順に処理されるので、[親単元](/learn/graph/graph-search/)の「キューの距離層が最短性を保証する理由」の論証をそのまま使える。元グラフの頂点を再訪しても、状態の組が違えば探索する。

$$mask=0$$ だけは、空のwalkによる長さ0を答えに採用する。空列には末尾がないため、すべての $$dist[0][v]$$ を0で初期化してはいけない。これは「頂点 $$v$$ にいるのに、一つも頂点を数えていない」という状態を作ってしまう。非空のwalkで $$mask=0$$ に着いた状態も通常どおり探索し、空列の0は答えの集計で別に扱う。

### 訪問記録を探索全体で共有するか、現在の経路だけに置くか

到達判定では、同じ状態から先を何度調べても到達先は増えない。DFS・BFSのどちらでも、探索全体で共有する `visited` を使い、いったん付けた印は消さない。BFSによる最短化も、単位費用かつ正しい初期距離から層順に処理するため、最初の登録だけでよい。DFSで初めて着いた距離には、この最短性はない。

一方、同じ頂点を経路内で二度使わない単純経路を列挙するときは、現在の経路に含まれる頂点だけを `onPath` に記録する。頂点を選んで印を付け、その先を調べ終えて戻るときに印を外す。これがbacktrackingである。

例えば親単元の小グラフで $$s\to a\to c\to t$$ を列挙した後も、$$s\to b\to t$$ を列挙する必要がある。探索全体の `visited` に $$t$$ を残すと後者を失う。また、同じ現在頂点でも経路内にある頂点が違えば、次に進める先が違う。単純経路では、現在頂点だけを「未来が同じ状態」とみなせない。目的が経路の列挙なら、履歴をまとめることで別の出力を失わないかも確認する。

## 成立条件と計算量

状態数を $$S$$、各状態を一度ずつ展開するときに**生成を試す遷移の総数**を $$T$$ とする。状態の更新・合法性判定・訪問判定が1回 $$O(1)$$ なら、到達判定のDFS・BFSは初期化を含めて $$O(S+T)$$ 時間である。合法と分かる辺だけを数えると、棄却する候補を調べる費用を落としてしまう。重複する遷移先への試行も $$T$$ に含める。

ABC244 Fで元の無向グラフが $$N$$ 頂点、$$M$$ 辺なら、$$S=N2^N$$。各状態から末尾の隣接頂点を調べるため、全状態にわたる試行数は $$T=2^N\sum_v\deg(v)=2M2^N$$ となる。距離表の初期化と末尾ごとの最小値の集計も含め、全体で $$O((N+M)2^N)$$ 時間である。辺を状態ごとに保存せず、取り出した状態からその都度生成すれば、距離表・キューに $$O(N2^N)$$、元の隣接リストに $$O(N+M)$$、合計 $$O(N2^N+M)$$ 空間を使う。

一般の暗黙グラフでも、辺を保存しなければ訪問記録と探索中の状態に $$O(S)$$ 空間を使い、これに入力と遷移生成の作業領域が加わる。盤面のコピーや辞書のキー比較などに時間がかかる場合は、その費用も掛ける。単純経路の列挙では同じ頂点を別の経路から何度も展開するため、上の $$O(S+T)$$ を元グラフの頂点数・辺数だけから適用できない。経路の候補数や出力数自体が指数的に増えることもある。

重みが0と1なら0-1 BFS、一般の非負重みならDijkstraなど、[重みに合う最短路算法](/learn/graph/weighted-shortest-path/)を選ぶ。単位費用BFSの「最初に登録したら以後は更新しない」という規則をそのまま移さない。到達不能な状態は未訪問として保持し、始状態に置く費用や空の操作列による答えと区別する。

概念上の親: [状態グラフ探索・到達関係](/learn/graph/graph-search/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [DAGのtopological processing](/learn/graph/dag-topological-processing/)、[関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)、[静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)、[lowlinkで橋・関節点を特定する](/learn/graph/lowlink-critical-structure/)、[最大流・最小カット](/learn/graph/max-flow-min-cut/)、[最短路モデル](/learn/graph/weighted-shortest-path/)。

暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC446 E「Multiple-Free Sequences」](https://atcoder.jp/contests/abc446/tasks/abc446_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC289 E「Swap Places」](https://atcoder.jp/contests/abc289/tasks/abc289_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC429 E「Hit and Away」](https://atcoder.jp/contests/abc429/tasks/abc429_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC302 F「Merge Set」](https://atcoder.jp/contests/abc302/tasks/abc302_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。追加で学ぶ技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC394 E「Palindromic Shortest Path」](https://atcoder.jp/contests/abc394/tasks/abc394_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC446 F「Reachable Set 2」](https://atcoder.jp/contests/abc446/tasks/abc446_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC244 F「Shortest Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC241 F「Skate」](https://atcoder.jp/contests/abc241/tasks/abc241_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。追加で学ぶ技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。既習技能: [最短路を証明する木・経路の復元](/learn/graph/shortest-path-reconstruction/)（距離等式を満たす親辺を選び、最短路の木または経路を復元できる。）。
- [ABC414 F「Jump Traveling」](https://atcoder.jp/contests/abc414/tasks/abc414_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC317 E「Avoid Eye Contact」](https://atcoder.jp/contests/abc317/tasks/abc317_e) — 主題: [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/)（各行・各列でactiveな向きだけを更新し、blockerと通行禁止条件を混同せず、定数方向へ伸びる全効果領域をgrid全体の線形時間で印付けられる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)（終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-state-graph-search`
