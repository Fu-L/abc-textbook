---
title: "フロー・マッチング・カットへ帰着する"
description: "「フロー・マッチング・カットへ帰着する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 114
---

# フロー・マッチング・カットへ帰着する

導入対象の目安: **青色（1600–1999）**。割当て・容量・cutの制約を読み、matchingとflowへの還元を選ぶ入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

仕事を受け手へ割り当てるとき、空いている相手を順に選ぶだけでは、後の仕事の行き先がなくなることがある。以前の割当を付け替えながら選択を増やす仕組みが、フローの残余グラフである。

この単元では、一つの割当模型から、選択を表すマッチング、使用回数を制限する容量、割当を妨げるカットを読み取る。まず元の選択と流れの対応を作り、その後で「何を判定・最適化したいか」に合う下位単元へ進む。

## 考え方

### 二仕事の割当を流れにする

仕事を $$p,q$$、受け手を $$a,b$$ とする。$$p$$ は $$a,b$$ のどちらにも、$$q$$ は $$a$$ だけに任せられる。各仕事は一人へ任せ、各受け手が担当できる仕事は高々一つとする。

仕事を左側、受け手を右側の頂点とし、許可された組にだけ左から右へ辺を張る。これは二部グラフであり、端点を共有しない辺の集合がマッチングである。選んだ辺がそのまま割当になる。

さらに、仕事を送り出す始点（source）$$s$$ と、受け取った仕事を集める終点（sink）$$t$$ を加え、次の有向辺をすべて容量1で置く。容量は、その辺を通せる流量の上限を表す。

| 辺 | 表す制約 |
| --- | --- |
| $$s\to p$$、$$s\to q$$ | 各仕事を高々一回選ぶ |
| $$p\to a$$、$$p\to b$$、$$q\to a$$ | 許可された相手へだけ割り当てる |
| $$a\to t$$、$$b\to t$$ | 各受け手は高々一仕事を担当する |

各辺に容量以下の非負の流量を置き、$$s,t$$ 以外の頂点では流入量と流出量を等しくする。これが**流量保存**である。この模型では、$$s$$ から出る総流量が割り当てた仕事数になる。例えば $$s\to p\to a\to t$$ に1を流すと、「仕事 $$p$$ を受け手 $$a$$ に任せる」を表せる。

### 逆辺で以前の選択を取り消す

先に $$p$$ を $$a$$ に任せると、$$q$$ の唯一の候補 $$a$$ は使用済みになる。しかし $$p$$ を $$b$$ へ移せば、$$a$$ を $$q$$ に空けられる。この付け替えを表すため、現在の流れに対して**残余グラフ**を作る。

元の辺に容量 $$c$$、現在の流量 $$f$$ があるとき、順方向にはあと $$c-f$$ だけ追加でき、逆方向には $$f$$ だけ取り消せる。正の残余容量を持つ向きをたどって、$$s$$ から $$t$$ へ流量を増やす道を探す。先ほどの流量1の状態では、次の道を使える。

$$
s\to q\to a\to p\to b\to t
$$

道の各辺の残余容量は1なので、1だけ増やす。元の辺への変更として読むと、次の操作になる。

- $$q\to a$$ に1を追加する。
- 残余辺 $$a\to p$$ を使って、元の辺 $$p\to a$$ の流量を1から0へ戻す。
- $$p\to b$$ に1を追加する。

あわせて $$s\to q$$ と $$b\to t$$ に1を追加する。$$s\to p$$ と $$a\to t$$ は1のままで、変更後も各内部頂点の流量保存と容量制約を満たす。元の割当へ戻すと $$p$$ は $$b$$、$$q$$ は $$a$$ を担当先とし、総流量は1から2へ増えた。

**逆辺 $$a\to p$$ は、受け手から仕事へ新たに割り当ててよいという許可ではない。** すでに選んだ $$p\to a$$ を取り消すための辺である。以前の選択を固定せず、取り消しと追加を一つの道の上で組み合わせることが、貪欲な割当から進むための要点になる。

### 割当と整数流を両方向に対応させる

全仕事を割り当てた解があれば、各「仕事→担当先」に対応する $$s\to\text{仕事}\to\text{受け手}\to t$$ に1を流す。仕事の重複も受け手の重複もないため、容量制約と流量保存を満たし、全仕事数の流量を得られる。

逆に、仕事数を $$n$$ とし、総流量 $$n$$ の**整数流**が得られたとする。$$s$$ から各仕事へ出る辺は $$n$$ 本・容量1なので、すべてに1が流れる。各仕事では流量保存により許可辺へ合計1が流れ、各辺の流量が整数だから、ちょうど一本が1になる。その辺を担当先として選べばよい。受け手から $$t$$ への容量1により、二仕事が同じ受け手を使うこともない。

したがって、全仕事を割り当てられることと、流量 $$n$$ の整数流が存在することは同値である。分数の流量では一仕事を複数の相手へ分けてしまうため、この復元には整数性が必要になる。整数容量なら整数の最大流を得られるので、最大流量が $$n$$ かを調べれば判定できる。整数性と最大性の一般的な証明は[最大流・最小カット](/learn/graph/max-flow-min-cut/)へ、割当専用の増加路は[二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)へ進む。

### 割当を妨げる容量をカットで見る

今度は許可辺 $$p\to b$$ を消し、両仕事の候補を $$a$$ だけにする。受け手 $$b$$ が空いていても、そこへ割り当てる許可がなく、$$a\to t$$ の容量1が二仕事の通過を妨げる。

頂点を $$s$$ を含む側と $$t$$ を含む側に分けたものを **$$s$$–$$t$$ カット**と呼ぶ。カット容量は、元のグラフで $$s$$ 側から $$t$$ 側へ向かう辺の容量の和である。この例では $$s$$ 側を $$\{s,p,q,a\}$$、$$t$$ 側を $$\{b,t\}$$ にすれば、横切る辺は $$a\to t$$ だけで、容量は1になる。

どの流れもこの境界を越える必要があり、総流量は1以下である。一仕事なら実際に割り当てられるので、最大流量も最小カット容量も1と分かる。元の三本の許可辺がある例では二仕事を割り当てられ、$$s$$ から出る二辺を切れば容量2になる。カットはこのように、通せる量の上界、ひいては割当不能の理由を示す。一般の最大流と最小カットの一致や、選択問題をカットへ帰着する手順は下位単元で扱う。

ここから先は、求めるものに応じて模型を読む。

- 「全仕事を割り当てられるか」「最大で何仕事を任せられるか」なら、マッチングや最大流を使う。受け手が複数の仕事を担当できるなら、受け手から $$t$$ への容量を担当上限へ変える。
- 「許可されたすべての組について、少なくとも片方の端点を選ぶには何頂点必要か」なら、最小頂点被覆である。両仕事の候補が $$a$$ だけの例では、頂点 $$a$$ 一つで全許可辺を覆える。二部グラフでのマッチング数との一致と復元は[二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)で学ぶ。
- 「同じ仕事数を割り当てる中で、費用を最小にしたい」なら、許可辺に一回の割当の費用を別に持たせる。例えば元の例で $$p\to b$$ だけ費用2、他は0なら、一仕事の最小費用は0、二仕事では2となる。容量は使用回数、費用は選択の評価値であり、[最小費用流・circulation](/learn/graph/min-cost-flow/)で流量ごとの最適値を扱う。

## 成立条件と計算量

この割当模型では、左右の役割が分かれ、選択の可否を許可辺で、使用回数を容量で表せることが前提になる。禁止された組には辺を張らない。容量を大きくすると使用回数の制約が緩むため、禁止条件の代わりに使うことはできない。また、容量1は「高々一回」である。全仕事の割当は総流量が仕事数に達したことから保証した。

「特定の頂点だけは必ず使う」という条件は別に表す必要がある。[ABC285 Gの問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)と[公式解説](https://atcoder.jp/contests/abc285/editorial/5500)では、二マスタイルをマッチングの辺とし、`2` のマスを必ず選んだ辺の端点に含める。辺数だけを最大化しても、指定頂点をすべて使った保証にはならない。この違いは[下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/)へつながる。

費用付き割当の接続先は[ABC247 Gの問題文](https://atcoder.jp/contests/abc247/tasks/abc247_g)と[公式解説](https://atcoder.jp/contests/abc247/editorial/3729)である。大学と得意分野を左右の頂点、人を辺とすれば、同じ大学・同じ得意分野の重複を容量1で防げる。選ぶ人数を流量に、強さの合計の最大化を費用の最適化に対応させる。上の二仕事の例は、この二部割当の仕組みを説明するための独自例である。

計算量は元の入力サイズだけでなく、**構築後の頂点数と辺数**を数えて評価する。最初の例は $$s,t,p,q,a,b$$ の6頂点、元の辺は $$2+3+2=7$$ 本である。残余グラフでは元辺ごとに逆辺も持つので、記憶する辺の枠は14本となる。

一般に仕事が $$n$$ 個、受け手が $$m$$ 人、許可された組が $$k$$ 個なら、頂点数は $$V=n+m+2$$、元の辺数は $$E=n+k+m$$。許可された組の一覧からの構築と、最終流量を見て割当を復元する処理には、それぞれ高々 $$O(V+E)$$ 時間がかかる。

例えば、残余グラフを毎回幅優先探索して一つの増加路を見つける方法なら、一回の探索は $$O(V+E)$$ 時間。この模型では各増加で流量が1増えるため、最大流量を $$F$$ とすると、最後の到達不能の確認も含む全体は $$O((F+1)(V+E))$$ 時間、空間は残余辺・探索用配列・復元した割当を合わせて $$O(V+E)$$ となる。ここで $$F\leq\min(n,m)$$ であり、仕事0個なら流量0で全仕事を割り当てたことになる。候補のない仕事があれば、その仕事を通せず全仕事数には届かない。

この評価を、容量を大きくした一般のフローや費用付きの算法へそのまま使わない。より速い二部マッチング法、一般の最大流、最小費用流では、それぞれの下位単元の上界へ構築後の $$V,E$$ と必要流量を代入し、構築・復元を含めて制約に収まることを確かめる。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- Eulerウォークの次数・偶奇条件。

## 下位単元

- [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/) — 青色
- [最大流・最小カット](/learn/graph/max-flow-min-cut/) — 青色
- [下限制約付きflowの実現可能性](/learn/graph/flow-lower-bounds/) — 黄色
- [最小費用流・circulation](/learn/graph/min-cost-flow/) — 黄色
- [重み付き二部完全matching](/learn/graph/weighted-bipartite-matching/) — 黄色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（成立判定が変わり得る整数境界を全て列挙し、隣り合う境界の間で判定が一定であることを示して、代表点判定と区間長で整数解の個数を求められる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC363 G「Dynamic Scheduling」](https://atcoder.jp/contests/abc363/tasks/abc363_g) — 主題: [rollback・DFS入退場の状態復元](/learn/query/rollback/)（更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/)（区間をO(log N)個のcanonical nodeへ分解してrange object・時間生存区間・range edgeを配置し、point queryではroot-to-leaf path上のobjectを集められる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC393 G「Unevenness」](https://atcoder.jp/contests/abc393/tasks/abc393_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [連分数・Stern–Brocotで有理近似する](/learn/number-theory/rational-approximation/)（Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。） / [最短路モデル](/learn/graph/weighted-shortest-path/)（辺数を制限した反復緩和から負閉路・正閉路の検出を導き、始点到達性と終点への影響を区別できる。） / [最小費用流・circulation](/learn/graph/min-cost-flow/)（流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC424 G「Set list」](https://atcoder.jp/contests/abc424/tasks/abc424_g) — 主題: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。）。

## 根拠

- [ABC247 G 公式解説](https://atcoder.jp/contests/abc247/editorial/3729)
- [ABC247 G 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_g)
- [ABC285 G 公式解説](https://atcoder.jp/contests/abc285/editorial/5500)
- [ABC285 G 公式問題文](https://atcoder.jp/contests/abc285/tasks/abc285_g)
- [ABC214 H 公式解説](https://atcoder.jp/contests/abc214/editorial/2441)
- [ABC214 H 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_h)
- [ABC215 H 公式解説](https://atcoder.jp/contests/abc215/editorial/2505)
- [ABC215 H 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_h)
- [ABC224 H 公式解説](https://atcoder.jp/contests/abc224/editorial/2812)
- [ABC224 H 公式問題文](https://atcoder.jp/contests/abc224/tasks/abc224_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-flow-matching`
