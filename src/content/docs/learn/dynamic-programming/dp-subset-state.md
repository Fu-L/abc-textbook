---
title: "部分集合・bitmask状態DP"
description: "「部分集合・bitmask状態DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 70
---

# 部分集合・bitmask状態DP

習得対象の目安: **水色（1200–1599）**。使用集合をbitmaskで持ち、集合の増減と遷移順から指数時間DPを設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 部分集合・bitmask状態DP

各bitの意味を固定し、訪問集合・選択集合・frontierなどの部分集合状態間を遷移する。

ABC309 Gは全N個の値の使用集合を持たず、走査位置の近傍2X−1個だけを残す発展例である。bitmaskという表記以上に、未来の禁止辺に接続しない値を忘れられることが状態削減の根拠になる。境界DPの節で、盤面のprofileと帯状matchingの共通原理を学ぶ。

ABC354 Eでは残存集合maskを状態とし、合法なpairを消すと要素数が2減る順序で勝敗を求める。集合状態とゲームの勝敗再帰を組み合わせる練習として扱う。

bitmaskで状態を書けることと、部分集合DPで解けることは別である。選択済み集合が増えるなどの非循環な順序を証明してから更新順を決める。ABC244 Fはbitを反転して閉路を持つ状態グラフになる比較例であり、状態グラフ探索の節を参照する。

### 習得する技能

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

## 考え方

訪問する順番を全て覚えると、候補は階乗個に増える。しかし、同じ集合を訪ねて同じ頂点にいるなら、その先で選べる行動と費用が同じになる場合がある。このときは「訪問済み集合と現在地」ごとに最良の値だけを残せる。少数の対象の集合を整数の各bitへ対応させた表現がbitmaskである。

### 訪問集合と最後の頂点を持つ

頂点を $$0,1,\ldots,N-1$$ とし、頂点 $$i$$ を訪問済みならbit $$i$$ を1にする。bitは右から0,1,2,…と数え、`1 << i` はbit $$i$$ だけが1の整数を表す。以下の `001` などは2進表記であり、3頂点なら `001` は集合 $$\{0\}$$、`011` は $$\{0,1\}$$、`111` は $$\{0,1,2\}$$ を表す。

全頂点をちょうど一度ずつ訪ねる道をHamilton pathという。その最小費用を、始点 $$s$$ を固定して求めよう。`dp[mask][v]` を、始点 $$s$$ から `mask` に含まれる頂点をちょうど一度ずつ訪ね、頂点 $$v$$ で終わる道の最小費用とする。従って、有効な状態では始点 $$s$$ と終点 $$v$$ のbitがともに `mask` に含まれる。集合だけでは次の辺の費用が分からないため、最後の頂点も必要になる。

初期値は `dp[1 << s][s] = 0`、他は到達不能を表す $$\infty$$ とする。到達可能な `dp[mask][v]` から、未訪問の頂点 $$u$$ へ辺があるときだけ進む。辺 $$v\to u$$ の費用を $$w(v,u)$$ とすると、更新は次の擬似コードになる。

```text
next = mask | (1 << u)
dp[next][u] = min(dp[next][u], dp[mask][v] + w(v, u))
```

`|` はbitごとのORであり、未訪問だった頂点 $$u$$ のbitを1にする。始点0、辺 $$0\to1$$ の費用2、辺 $$1\to2$$ の費用3という小例では、次のように経路と状態が対応する。

| 経路 | `mask` | 最後の頂点 | この経路から得る更新候補 |
| --- | --- | --- | --- |
| 0 | `001` | 0 | `dp[001][0]` に0 |
| 0→1 | `011` | 1 | `dp[011][1]` に2 |
| 0→1→2 | `111` | 2 | `dp[111][2]` に5 |

この表の配列添字も2進表記である。別の経路が同じ状態へ来たら、費用の小さい方を残す。例えば `dp[011][2]` は終点2が訪問集合に入っておらず、有効な状態ではない。

一回の遷移で訪問集合の要素数が一つ増えるので、集合サイズの昇順に処理すれば、更新元は先に確定している。逆に、初期状態以外の任意の合法な道から最後の頂点を外すと、必ず一つ小さい集合の状態と最後の辺に分けられる。従って、この遷移で全ての道を漏れなく比較できる。$$\infty$$ の状態からは更新せず、実装では番兵値へ辺の費用を足さない。

### どの集合で終了してよいかを決める

全頂点のbitが1のmaskを `ALL = (1 << N) - 1` とする。Hamilton pathでは全訪問が必要なので、答えは **`ALL` の終点別最小値**、すなわち

$$
\min_{0\leq v<N} dp[\mathrm{ALL}][v]
$$

である。途中のmaskまで含めて最小化すると、訪問を終えていない道を答えにしてしまう。全候補が $$\infty$$ なら、そのような道は存在しない。$$N=1$$ の道は始点だけからなり、初期値0がそのまま答えになる。

全訪問後に始点へ戻る閉路を求めるなら、終点 $$v$$ から始点 $$s$$ への辺がある候補について、$$dp[\mathrm{ALL}][v]+w(v,s)$$ の最小値を取る。戻る辺のない候補は使えない。$$N=1$$ で移動せず終了してよい問題なら、別途0とする。

一方、[ABC274 E「Booster」](/problems/abc274-e/)では、街は全て訪ねるが、宝箱は訪ねなくてもよい。ここでは問題の記号に合わせて街を $$N$$ 個、宝箱を $$M$$ 個とし、街をbit $$0,\ldots,N-1$$、宝箱をbit $$N,\ldots,N+M-1$$ に対応させる。原点はmaskに入れず、出発・帰着地点として別に扱う。必須の街のmaskを `need = (1 << N) - 1` とすると、終了候補は `(mask & need) == need` を満たす全てのmaskである。`&` はbitごとのANDであり、街のbitが全て立っているかを調べている。

例えば街2個・宝箱1個なら、終了できるmaskは `011` と `111`。前者は宝箱を訪ねず、後者は宝箱も訪ねて帰る。取得した宝箱数を $$b(\mathrm{mask})$$ とすると、現在の速度は $$2^{b(\mathrm{mask})}$$ と集合から復元できる。`dp[mask][v]` に最小所要時間を持ち、各点への原点からの距離で単点集合を初期化し、次の未訪問点までの距離を現在の速度で割って遷移する。宝箱へ着くまでの移動には、取得前の速度を使う。

最後は、必須bitを全て含むmaskと、その中の終点 $$v$$ について、原点へ戻る時間を加えた

$$
dp[\mathrm{mask}][v]+\frac{d(v,\text{原点})}{2^{b(\mathrm{mask})}}
$$

を比較する。ここで $$d$$ は2点間の距離である。全点を訪ねる `ALL` だけに限定すると、遠い宝箱を避ける解を取り逃がす。**何を記録するかに加え、どの集合なら目的を達成したかを定める**ことが、任意の訪問対象を含むDPの要点である。この接続は[公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_e)・[個別公式解説](https://atcoder.jp/contests/abc274/editorial/5020)に基づく（2026-10-26確認）。上の3頂点の小例は本単元用の独自例である。

### 集合の一部をまとめて選ぶ

一要素ずつ追加する代わりに、`mask` の部分集合 `submask` を一つのグループとして切り出すDPもある。`mask` の非空部分集合を全て調べるには、次の擬似コードを使う。

```text
submask = mask
while submask != 0:
    submask を処理する
    submask = (submask - 1) & mask
```

`mask = 101` なら、`101 → 100 → 001 → 000` と進み、非空候補は集合 $$\{0,2\},\{2\},\{0\}$$ の3個となる。1を引くと最下位の1が0になり、それより下が1になる。`& mask` で元の集合にないbitを落とすと、元の集合のbitだけを使う次に小さい候補へ進める。この操作は部分集合を大きい順に一つずつたどるので、漏れも重複もない。

空集合も必要なら、ループの後で `submask = 0` を一回だけ処理する。最初から `mask = 0` の場合も、非空候補は0個、空集合込みなら1個である。0からさらに更新すると、通常のbit演算では `(-1) & mask = mask` に戻ってしまうため、0で停止する。

列挙の重複がなくても、分割の数え方には注意する。例えば集合 $$\{0,2\}$$ を二つの非空グループに分けるとき、`submask = 001` と `100` は、切り出す側を交換しただけの同じ分割になる。グループに順序のない計数では、残りの集合の最小要素を含むグループから切り出すなど、一意な分解規則が必要である。最小値を取るDPでは同じ候補を二度比べても値は変わらないが、通り数を足すDPでは重複分だけ答えが増える。

## 成立条件と計算量

$$N$$ 個の対象から作る集合は $$2^N$$ 通りであり、集合だけを状態に持つならこの個数が出発点になる。ただし、状態数だけで実行時間は決まらず、各状態から何を列挙するかも数える。

- 上のHamilton pathの標準形では、最後の頂点を加えて $$O(N2^N)$$ 状態、各状態から次の頂点を最大 $$N$$ 個調べるため、時間 $$O(N^2 2^N)$$、領域 $$O(N2^N)$$ となる。辺の費用を表に持つ場合の $$O(N^2)$$ の前処理・領域も、この全体評価に収まる。ABC274 Eでは対象数を $$N+M$$ に置き換える。
- 全maskについてそのsubmaskを列挙すると、空も含む組の総数は $$3^N$$ になる。各要素は「maskの外」「submaskの中」「maskの中でsubmaskの外」の三択だからである。非空submaskだけなら、各maskの空集合を除いて $$3^N-2^N$$ 組となる。一組を定数時間で評価するDPなら時間 $$O(3^N)$$ だが、各候補の費用計算やグループ数などの追加状態があれば、その分も含める。

適用には、同じ状態へまとめた履歴の未来が等しいことと、依存関係を非循環な順に処理できることの両方が必要になる。一要素追加なら集合サイズ昇順、要素を除いた集合に依存する再帰なら小さい集合から評価する。maskのbitを反転する遷移にはcycleがあり得るため、bitmaskという表記だけでDPを適用しない。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)、[Steiner tree subset DP](/learn/dynamic-programming/steiner-tree-dp/)、[subset zeta・Möbius変換](/learn/combinatorics-algebra/subset-transforms/)。

DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC274 E「Booster」](https://atcoder.jp/contests/abc274/tasks/abc274_e) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC301 E「Pac-Takahashi」](https://atcoder.jp/contests/abc301/tasks/abc301_e) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。 BFSで重要地点間の距離を前計算し、移動の全履歴を距離へ圧縮する。その上でdp[S][v]から未訪問の代表地点へ進む部分集合DPを学び、最後に出口への距離を加えて時間制約を判定する。通過した菓子を全て状態に記録しなくても最適値を失わない理由も確かめる。
- [ABC338 F「Negative Traveling Salesman」](https://atcoder.jp/contests/abc338/tasks/abc338_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。）。 Floyd–Warshallで全点対距離を前計算し、最短路閉包上の訪問順を部分集合DPで学ぶ。maskは代表として訪問順へ追加した頂点集合であり、距離前計算の途中で通る頂点を禁止しない。任意のwalkから初訪問順を取り出す方向と、DP解をwalkへ展開する方向で同値性を示す。
- [ABC381 F「1122 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC232 F「Simple Operations on Sequence」](https://atcoder.jp/contests/abc232/tasks/abc232_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC332 E「Lucky bag」](https://atcoder.jp/contests/abc332/tasks/abc332_e) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC310 F「Make 10 Again」](https://atcoder.jp/contests/abc310/tasks/abc310_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC352 F「Estimate Order」](https://atcoder.jp/contests/abc352/tasks/abc352_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。
- [ABC343 G「Compress Strings」](https://atcoder.jp/contests/abc343/tasks/abc343_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC328 G「Cut and Reorder」](https://atcoder.jp/contests/abc328/tasks/abc328_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC396 G「Flip Row or Col」](https://atcoder.jp/contests/abc396/tasks/abc396_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC213 G「Connectivity 2」](https://atcoder.jp/contests/abc213/tasks/abc213_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC215 E「Chain Contestant」](https://atcoder.jp/contests/abc215/tasks/abc215_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC216 H「Random Robots」](https://atcoder.jp/contests/abc216/tasks/abc216_h) — 主題: [行列式による数え上げ](/learn/combinatorics-algebra/determinant-counting/)（DAG上の経路数行列を作り、交差する経路族の符号反転と端点対応の条件から、LGVで頂点非共有経路族を数えられる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC228 G「Digits on Grid」](https://atcoder.jp/contests/abc228/tasks/abc228_g) — 主題: [非決定性automatonのsubset construction](/learn/string/automaton-subset-construction/)（同時に存在し得るNFA状態集合を一つのDFA状態とし、文字ごとの集合遷移と受理条件を構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC278 F「Shiritori」](https://atcoder.jp/contests/abc278/tasks/abc278_f) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC306 Ex「Balance Scale」](https://atcoder.jp/contests/abc306/tasks/abc306_h) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC354 E「Remove Pairs」](https://atcoder.jp/contests/abc354/tasks/abc354_e) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC400 G「Patisserie ABC 3」](https://atcoder.jp/contests/abc400/tasks/abc400_g) — 主題: [Lagrangian relaxation・Aliens trick](/learn/geometry-optimization/lagrangian-relaxation/)（個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC402 E「Payment Required」](https://atcoder.jp/contests/abc402/tasks/abc402_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC419 F「All Included」](https://atcoder.jp/contests/abc419/tasks/abc419_f) — 主題: [Aho–Corasick](/learn/string/aho-corasick/)（複数patternのTrieへfailure linkと出力情報を加え、Aho–Corasick automaton上で一致状態を更新できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。

## 根拠

- [ABC274 E 公式問題文](https://atcoder.jp/contests/abc274/tasks/abc274_e)
- [ABC274 E 公式解説](https://atcoder.jp/contests/abc274/editorial/5020)
- [ABC213 G 公式解説](https://atcoder.jp/contests/abc213/editorial/2392)
- [ABC213 G 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_g)
- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC216 H 公式解説](https://atcoder.jp/contests/abc216/editorial/2561)
- [ABC216 H 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-subset-state`
