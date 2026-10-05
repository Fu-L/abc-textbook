---
title: "二部matching・Hall・Kőnig"
description: "「二部matching・Hall・Kőnig」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 115
---

# 二部matching・Hall・Kőnig

習得対象の目安: **青色（1600–1999）**。増加路を理解し、Hall条件と最小頂点被覆を割当て問題へ使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 二部matching・Hall・Kőnig

左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。

左右の各頂点が高々一つの相手を選ぶ条件から始める。ABC401 Gの人とボタンの一対一対応で、距離の閾値を固定した完全matching判定を学ぶ。ABC274 Gでは横区間と縦区間からなる二部グラフへ還元し、matchingと最小vertex coverの関係を確認する。複数の仕事を同じ受け手へ割り当てる場合は、最大流の容量付き割当へ進む。

ABC215 Hでは品種集合Sの在庫総数をf(S)、許可品種がすべてSに含まれる注文数をg(S)とする。全Sでf(S)≥g(S)がHallの条件である。供給を減らして割当て不能にする最小削除数は、g(S)>0でのf(S)−g(S)+1の最小値。注文0の条件は供給を0まで減らしても破れない。

品種一つ、在庫3、注文1なら空集合の余裕0を最小化へ入れず、非空集合の余裕2から3個を食べる。選び方を数える最小集合族にもg(S)>0を課し、複数の最小集合に含まれる同じ個体選択を重複計数しない。

### 習得する技能

- 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。
- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

二部グラフの左右の頂点集合をL,Rとする。matchingは端点を共有しない辺の集合であり、各頂点の相手をmateとして保存する。最初はすべて未使用とする。一対一割当ては、その条件を満たすmatchingを選ぶ問題になる。

### 増加路の探索と反転

未使用の左頂点から、未選択辺を左→右、選択辺を右→左へたどる。未使用の右頂点へ到達したら、そのpathが増加路である。path上の未選択辺を選び、選択辺を外すと、途中の頂点は依然一つの相手を持ち、両端だけが新たに使用される。matchingの辺数は一つ増える。更新後は訪問状態をリセットして、残る未使用の左頂点から再び探索する。

現在のmatching Mより大きいM'があると仮定する。二つの対称差は、次数が高々2で辺が交互に現れるpathとcycleへ分かれる。cycleでは辺数差が0なので、M'の辺が一本多いpathが存在する。その両端はMでは未使用であり、Mの増加路になる。したがって増加路がないことは最大性の証明になる。

### Hall条件と満たせない集合

左側をすべて割り当てるための必要十分条件は、すべてのA⊆Lについて|N(A)|≥|A|である。N(A)はAの隣接先集合。必要性は一対一割当てから明らかである。

十分性は上の探索から導ける。最大matchingに未使用の左頂点が残ったとし、そのすべてから交互路をたどって到達した集合をZ_L,Z_Rとする。増加路がないので、Z_Rの全頂点は使用済みで、その相手もZ_Lに入る。Z_Lの使用済み頂点の相手はZ_Rへ入り、未使用の左頂点が余分に残るため|Z_L|>|Z_R|となる。さらにN(Z_L)=Z_Rなので、A=Z_LがHall条件に反する。全部分集合を列挙する代わりにmatchingで判定し、不可能ならこの集合を証拠として取り出せる。

容量による見方では、s→L、R→tに容量1、L→Rの許可辺に十分大きい容量を置く。有限cutでsource側の左集合をAとすると、その近傍N(A)もsource側へ置く必要があり、最小のcut容量は|L|−|A|+|N(A)|となる。すべての左頂点分の流量|L|が通る条件がHall条件と一致する。複数在庫・注文の場合も頂点の複製を容量でまとめればよく、注文集合Bの需要総数がその許可供給先N(B)の在庫総数以下であることが容量付きの条件になる。

### Kőnigの定理と最小頂点被覆の復元

頂点被覆（vertex cover）は、すべての辺について少なくとも一方の端点を含む頂点集合である。matchingの辺は端点を共有しないので、どの被覆も|M|個以上の頂点を必要とする。

最大matchingから、先ほどと同じ向きの交互路を未使用の左頂点すべてからたどり、C=(L∖Z_L)∪Z_Rを選ぶ。これが被覆になることを確認する。辺(u,v)が覆われないならu∈Z_L、v∉Z_R。未選択辺ならuからvへ進めるので矛盾する。選択辺なら到達済みの使用左頂点uにはその相手vから入ってきたはずなので、やはり矛盾する。

選択辺の左右端点は両方到達済みか両方未到達であるため、Cはその各辺からちょうど一頂点を選ぶ。また未使用左頂点は全てZ_L、未使用右頂点は全てZ_Rの外にあり、Cに未使用頂点は入らない。よって|C|=|M|。下界と一致し、最大matching数=最小頂点被覆数というKőnigの定理と、その復元手順が得られる。

被覆の補集合は、内部に辺を持たない独立集合である。逆に独立集合の補集合は被覆なので、最大独立集合数は|L|+|R|−|M|となる。割当て・全辺の被覆・互いに衝突しない選択は、同じ二部グラフ上でこのように接続する。

### DAGの頂点素なpath cover

N頂点のDAGを頂点の重複がない有向pathへ分割する場合は、各頂点を左右にコピーし、元の辺u→vごとにu_L→v_Rを置く。matchingで選んだ辺を元へ戻すと各頂点は入出辺を高々一本持ち、DAGなのでcycleを作らずpathへ分かれる。辺を一本つなぐたびpath数が一つ減り、N−|M|本になる。逆にpath分割の各連結辺はmatchingを作るため、最小path数はN−最大matching数である。

元の辺を使う頂点素なpath分割と、到達関係を順序として使うchain分割は異なる。後者は到達可能なすべての頂点対へ辺を置く必要があり、次の半順序単元へつながる。

例えばa→c,b→c,c→d,c→eでは元辺のmatchingは2で頂点素なpathは3本、到達関係のmatchingは3で鎖は2本になる。鎖(a,c,d),(b,e)の後者を元の道b→c→eへ戻すとcを共有する。従って推移閉包で求めた鎖を一般DAGの頂点素なpath分割へ戻すことはできない。walk間の重複が許される場合には、鎖を道へ展開し、逆に各頂点を一つのwalkだけへ割り当てて到達順に抜き出すことで、最小鎖数と最小walk cover数の一致を証明できる。

## 成立条件と計算量

単純なDFS増加法は左頂点ごとに高々O(E)の探索を行いO(VE)、Hopcroft–Karpは最短増加路を段階ごとにまとめてO((V+E)√V)。matching確定後の被覆・独立集合の復元はO(V+E)。左右のサイズが違う場合、左全体の割当てと全頂点を使う完全matchingを区別する。辺数最大化と費用最小化も別であり、重み付き割当ては後続単元で扱う。一般グラフの奇閉路にはこの二部専用の探索と被覆等式を適用しない。

概念上の親: [フロー・マッチング・カットへ帰着する](/learn/graph/flow-matching/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)。

このUnitを直接前提とする単元: [一般グラフの最小重み完全matching](/learn/graph/min-weight-general-perfect-matching/)、[半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)、[重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/)。

二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC445 G「Knight Placement」](https://atcoder.jp/contests/abc445/tasks/abc445_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。） / [gcd不変量・差分構造](/learn/number-theory/gcd-structure/)（gcd不変量によって共通因子・差分・周期成分を分離し、rangeまたは剰余類ごとの問いを処理できる。）。
- [ABC461 G「Graph Problem 2026」](https://atcoder.jp/contests/abc461/tasks/abc461_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [剰余周期と指数法則を利用する](/learn/number-theory/modular-periodicity/)（剰余類上の周期または指数法則を示し、周期状態の前計算や巨大指数の簡約で値を求められる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 周期性による候補時刻の圧縮と単調判定の二分探索を前提に、時間上限Tで各リールが同じ数字を停止できる時刻へ辺を張る。リールと時刻の一対一対応を二部matchingで判定することが主題。
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [推移閉包](/learn/graph/transitive-closure/)（各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。） / [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。
- [ABC317 G「Rearranging」](https://atcoder.jp/contests/abc317/tasks/abc317_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。
- [ABC215 H「Cabbage Master」](https://atcoder.jp/contests/abc215/tasks/abc215_h) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。既習技能: [subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)（Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（成立判定が変わり得る整数境界を全て列挙し、隣り合う境界の間で判定が一定であることを示して、代表点判定と区間長で整数解の個数を求められる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g) — 主題: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。

## 根拠

- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC274 G 公式解説](https://atcoder.jp/contests/abc274/editorial/5024)
- [ABC274 G 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-bipartite-matching`
