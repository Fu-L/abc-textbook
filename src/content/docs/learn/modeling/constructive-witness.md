---
title: "成立証明から構成解を復元する"
description: "「成立証明から構成解を復元する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 13
---

# 成立証明から構成解を復元する

習得対象の目安: **水色（1200–1599）**。存在判定の証明に操作列や親情報を対応させ、具体的な解へ戻す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 構成解・witness復元

「条件を満たすものがある」と判定できても、その具体例を出力できるとは限らない。条件を満たす実物や操作列を**構成解**と呼び、それが条件の成立を示す証拠になるという意味で **witness** とも呼ぶ。このUnitでは、存在の証明を、実際に選ぶ辺・並べ方・操作の手順へつなぐ。

まず、次の三つの要求を区別する。

| 要求 | 答えに必要なもの |
| --- | --- |
| 存在判定 | 条件を満たす解があるかどうか |
| 最適値の計算 | 解のうち最小の費用や最大の得点 |
| 構成解の出力 | 条件を満たす具体的な対象、またはそこへ至る操作列 |

最適値だけを求めるDPでは、値が同じ二つの選択を区別せずに済むことがある。構成まで求めるなら、その値を実現する選択を一つ取り出せるようにする。一方、何らかの解を一つ出せばよい問題では、操作回数まで最小化する必要があるかを問題文で確認する。

### 習得する技能

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

## 考え方

### 小さい木で、確定する場所を選ぶ

各頂点に駒が一つずつあり、駒にも頂点と同じ番号が重複なく付いているとする。辺で隣り合う二頂点の駒を交換して、駒を同じ番号の頂点へ置きたい。駒は辺を通ってしか動けないので、**各駒の現在位置と目的地が同じ連結成分にあること**が必要である。これは、解があるなら必ず満たす「必要条件」であり、まだ交換の手順ではない。

連結な成分では、全頂点を結び閉路を持たない辺の集合、すなわち全域木だけを使うことにする。使う辺を減らしても各頂点へ到達できる。ただし、頂点を番号順に完成させるだけでは、後の駒を運ぶ経路が完成済みの頂点を通り、その駒を動かしてしまう。

そこで、木の**葉**、つまり残っている辺が一本だけの頂点から確定する。葉を取り除いても、残った頂点同士はつながっている。この性質が、後の操作で確定済みの駒を動かさずに済む理由になる。

例えば、辺が $$1-2-3-4$$ という道をなし、各頂点の駒が順に $$(2,4,1,3)$$ である場合を考える。葉1へ駒1を運ぶには、駒1の現在位置である頂点3から、頂点2を経由して頂点1まで交換する。

| 操作と確定する頂点 | 頂点1・2・3・4の駒 |
| --- | --- |
| 開始時 | $$(2,4,1,3)$$ |
| 辺 $$2-3$$ で交換 | $$(2,1,4,3)$$ |
| 辺 $$1-2$$ で交換し、葉1を確定 | $$(1,2,4,3)$$ |
| 残った道の葉2は既に正しいので、交換せず確定 | $$(1,2,4,3)$$ |
| 辺 $$3-4$$ で交換し、残りも完成 | $$(1,2,3,4)$$ |

### 未確定部分に何を許し、何を保つか

途中の未確定頂点では、駒の順序が乱れていてもよい。保つべきものは、**確定済みの頂点を使わずに、残る駒をそれぞれの目的地へ運べること**である。

具体的には、各成分の未確定部分が木としてつながり、そこに残る駒の番号の集合が、未確定頂点の番号の集合と一致している状態を保つ。選んだ葉の目的の駒はこの木の中にあるので、木の経路に沿って運べる。その葉に正しい駒を置いてから葉と駒を一つずつ除くと、残りも同じ条件を満たす。頂点が一つになれば、残る駒もその頂点の番号である。

このように、条件を満たす入力に対して必ず次の操作ができ、より小さい同じ形の問題へ進めることを示せば、その条件の**十分性**、つまり「条件を満たせば解がある」ことまで証明できる。各操作の前後で保たれる条件を**不変条件**という。必要条件を列挙した後は、「次の一手で何を確定し、残りのどの条件を保つか」を探す。

同じ葉への着目でも、[ABC239 F「Construct Highway」の解説](/problems/abc239-f/)では辺そのものを作る。目標は、既存辺を残し、指定された各頂点の次数を満たす木を作ることである。既存辺が森であること、各頂点の現在次数が指定次数を超えないこと、指定次数の総和が $$2N-2$$ であることを調べる。ここで $$N$$ は頂点数である。さらに、複数の成分が残るなら、どの成分にも外へ接続する余地が必要になる。

各頂点の不足次数一つを「接続口」一つと考え、既存の連結成分ごとにまとめる。接続口には元の頂点番号を残しておく。既存辺が $$M$$ 本の森なら、成分数は $$c=N-M$$ である。既存辺一本につき両端の次数を一つずつ使っているので、残る口の総数は $$2N-2-2M=2c-2$$ になる。接続口が一つの成分を葉として、二つ以上ある成分へつなぐと、二つの口を使って成分が一つ減る。併合後にも口が一つ以上残り、総数は $$2(c-1)-2$$ となる。

例えば、三成分の口の数が $$(1,2,1)$$ なら、中央の成分へ両側を順に結べる。先に両端の一口同士を結ぶと、その二成分は口を使い切り、中央の成分をつなげなくなる。合計数が正しいだけでは、任意の一手を選んでよいことにはならない。

各成分の口が正で総数が $$2c-2$$ なら、平均が2未満なので一口の成分がある。三成分以上では総数が $$c$$ より大きいため、二口以上の成分もある。従って上の操作を続けられ、最後の二成分は一口ずつなので、それらを結べば完成する。異なる成分だけを結ぶため閉路はできず、各頂点の口をちょうど使い切るため指定次数も満たす。

### 証明した選択を、出力へ戻す

証明が操作を与えている場合は、実際に行った選択をその場で記録する。辺を追加する構成なら元の頂点番号の組、交換する構成なら**入力で指定された辺の番号を実行順に**残す。縮約した成分の番号や、最終配置だけでは、求められた出力へ戻せない場合がある。

DPや探索で値を求めてから復元する場合は、各状態へ至った直前の状態を親情報として、選択とともに保存し、終状態からたどって順序を反転する。あるいは、保存した値と整合する遷移をもう一度調べ、始状態から選び直す。値が等しい候補が複数あれば有効な一つを選べばよいが、状態の段階が一方向へ進むなど、同じ状態へ戻らない規則を決める。更新済みの配列を過去の状態だと思って参照したり、同値の親をたどって循環したりしないよう、必要な段階の情報を保持する。

## 成立条件と計算量

### 成立する範囲と、止まるべき境界

葉からの交換が使えるのは、成分内の木の辺に沿う交換が許され、未確定頂点間で必要な駒を運べる場合である。成分を越えなければ目的地へ届かない駒があれば不可能と判定する。方向付きの移動や、交換ごとの追加制約がある問題へは、そのまま使えない。

辺を作る構成でも、閉路を残したまま木にはできず、接続口がない成分を他の成分へつなぐことはできない。逆に、既に一成分で必要な辺と次数が完成している場合には、追加する辺はない。「全ての段階で接続口が正」という条件は複数成分が残る間のものであり、完成後まで要求しない。

### 全体計算量と出力上限を分ける

構成の計算量には、存在条件の検査、候補や経路の探索、選択の記録、出力までを含める。出力する辺や操作の個数を $$K$$ とすれば、それらを書くだけでも $$\Omega(K)$$ 時間が必要である。答えを全て保存すれば、そのために $$O(K)$$ 空間も使う。局所操作が定数時間でも、操作を何回行うかは別に評価する。

葉へ駒を運ぶ方法では、各段階で駒の位置と木の経路を探索し直しても、一段階は $$O(N)$$ 時間で済む。$$N$$ 頂点・$$M$$ 辺の入力から探索で全域森を作る $$O(N+M)$$ の前処理と、高々 $$N-1$$ 段階の処理を合わせ、全体は $$O(N^2+M)$$ 時間となる。入力グラフ・森・位置情報と全交換列を保存するなら、空間は $$O(N+M+K)$$ である。

さらに、実行時間に収まることとは別に、出力の操作上限も示す。残り $$r$$ 頂点の木で一つの葉へ運ぶ交換は高々 $$r-1$$ 回なので、全体の交換回数は

$$
K\leq (N-1)+(N-2)+\cdots+1=\frac{N(N-1)}{2}
$$

となる。[ABC233 F「Swap and Sort」の解説](/problems/abc233-f/)では $$N\leq 1000$$ なので高々499,500回となり、問題の500,000回以下という上限を満たす。これは交換回数の最小値を求めたという意味ではない。

### 元の出力条件で検査する

構成を終えたら、証明で使った要約量だけでなく、出力を元の入力へ適用した結果を確認する。

- 辺の追加なら、指定本数か、頂点番号が範囲内か、自己ループや既存辺を含む重複がないかを確認する。ABC239 Fでは、追加辺が $$N-M-1$$ 本で、元の辺と合わせて連結になり、各頂点の次数が指定通りになることまで調べる。
- 交換列なら、各番号が入力の辺を指すか、回数が上限以下かを確認する。その順で交換を再現し、全ての頂点に正しい駒が置かれるかを調べる。同じ辺を複数回使うことは許されるので、辺の追加における重複禁止と混同しない。
- グリッドの構成なら、小さい模様の中だけでなく、模様同士の接続部分や外周でも隣接条件を満たすかを調べる。経路を出すなら始点・終点、各移動の隣接性、再訪を許すかどうかも元の条件へ戻す。

小さい例での再現は、必要条件の判定、局所操作の十分性、記録からの復元を別々に確かめる助けになる。全入力での保証には、各段階で残りの条件が保たれる理由と、必ず終了する理由も必要である。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。

### このUnitでは扱わないもの

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 問題一覧

- [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC299 E「Nearest Black Vertex」](https://atcoder.jp/contests/abc299/tasks/abc299_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。
- [ABC251 F「Two Spanning Trees」](https://atcoder.jp/contests/abc251/tasks/abc251_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC454 E「LRUD Moving」](https://atcoder.jp/contests/abc454/tasks/abc454_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。）。
- [ABC448 F「Authentic Traveling Salesman Problem」](https://atcoder.jp/contests/abc448/tasks/abc448_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC255 F「Pre-order and In-order」](https://atcoder.jp/contests/abc255/tasks/abc255_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC363 F「Palindromic Expression」](https://atcoder.jp/contests/abc363/tasks/abc363_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。）。
- [ABC239 F「Construct Highway」](https://atcoder.jp/contests/abc239/tasks/abc239_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC233 F「Swap and Sort」](https://atcoder.jp/contests/abc233/tasks/abc233_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC289 F「Teleporter Takahashi」](https://atcoder.jp/contests/abc289/tasks/abc289_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC358 F「Easiest Maze」](https://atcoder.jp/contests/abc358/tasks/abc358_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC244 G「Construct Good Path」](https://atcoder.jp/contests/abc244/tasks/abc244_g) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC232 H「King's Tour」](https://atcoder.jp/contests/abc232/tasks/abc232_h) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 N=2を別扱いし、元の木の葉に重み1、他に0を置いて一点だけ均衡分離点を選ぶ。各成分の葉数が全葉数の半分以下になることを使い、残数最大の異なるgroupへ色を配る。削除後に生じた葉を数え直したり、各成分を再帰的に重心分解したりしない。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)（Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC326 F「Robot Rotation」](https://atcoder.jp/contests/abc326/tasks/abc326_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f) — 主題: [指定次数parityの部分グラフ構成](/learn/graph/degree-parity-subgraph/)（選択辺集合の奇数次数頂点を指定し、spanning forestの葉から必要辺を確定してT-join型の構成を行う。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g) — 主題: [回文半径と左右対称区間を特定する](/learn/string/palindrome-radius/)（各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC362 F「Perfect Matching on a Tree」](https://atcoder.jp/contests/abc362/tasks/abc362_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e) — 主題: [静的graph等式制約のpotential伝播](/learn/graph/graph-potential-propagation/)（辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [二部彩色と成分構造を扱う](/learn/graph/bipartite-structure/)（各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。 二部彩色を前提に、頂点・色組の使用回数A_{v,k}を容量へ写す最大流のモデルを学ぶ。流量N−1から各木辺の削除時の色対を固定する。一対一matchingではない。次に、実行可能な辺がないと仮定して葉から根へ条件を伝播させると矛盾することを示す。一辺削除した後も残りの回数制約が保たれるため、この存在証明を帰納的に繰り返して操作列を復元できる。静的な割当の可否と時系列の実行可能性を別々に証明する。
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。

## 根拠

葉を確定する交換と、成分の接続口を使う構成は、以下のABC233 F・ABC239 Fの公式問題文と個別公式解説を2026-10-23に再照合した。

- [ABC221 G 公式解説](https://atcoder.jp/contests/abc221/editorial/2724)
- [ABC221 G 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC232 H 公式解説](https://atcoder.jp/contests/abc232/editorial/3140)
- [ABC232 H 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_h)
- [ABC233 F 公式解説](https://atcoder.jp/contests/abc233/editorial/3164)
- [ABC233 F 公式問題文](https://atcoder.jp/contests/abc233/tasks/abc233_f)
- [ABC239 F 公式解説](https://atcoder.jp/contests/abc239/editorial/3388)
- [ABC239 F 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-constructive-witness`
