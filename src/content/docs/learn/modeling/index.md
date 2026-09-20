---
title: "モデル変換とアルゴリズム設計"
description: "「モデル変換とアルゴリズム設計」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 0
---

# モデル変換とアルゴリズム設計

導入対象の目安: **緑色（800–1199）**。探索・集計・貪欲法を選ぶ前に、保存すべき条件を言葉にする習慣を付ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 本書の読み方

本書は、親Unitに続けてその子Unitをまとめ、同じ対象や原理の基本から発展までを連続して読める構成です。章の目次の字下げは親子関係を表します。各Unitの習得対象と追加前提を確認し、今必要な範囲を選んでください。

「習得対象の目安」は、その色付近の読者がUnitの中心概念を道具として身につける時期を示します。習得とは、標準形の発動条件・不変量・計算量を説明し、実装またはライブラリへの還元ができることです。掲載問題のDifficulty、全問正解に必要なレート、初見で発展解法を発見する難しさは評価に含めません。

色と数値の境界は[AtCoder公式のAlgorithmレーティング区分](https://info.atcoder.jp/overview/contest/rating)に合わせています。各Unitへの割当ては、前提知識の量、標準形の実装・正当化に必要な理解、他分野への応用範囲を共通基準にした本書の編集判断です。AtCoder公式の履修基準ではありません。

| 習得対象 | レーティング | 本書での判断の軸・代表例 |
| --- | --- | --- |
| 茶色 | 400–799 | 基本操作を直接使う。累積和・差分、要素索引と連結リスト。 |
| 緑色 | 800–1199 | 状態・順序・計算量を明示する。基本DP、DSU、最短路、二分探索。 |
| 水色 | 1200–1599 | 標準的な抽象化と不変量を使う。Fenwick Tree、LIS、桁DP、SCC。 |
| 青色 | 1600–1999 | 複数の標準技能をつなぎ、作用や還元を設計する。遅延Segment Tree、2-SAT、HLD。 |
| 黄色 | 2000–2399 | 代数的表現や構造定理を使う。畳み込み、母関数、最小費用流、重心分解。 |
| 橙色 | 2400–2799 | 複雑な合成や償却・双対性まで理解する。FPS、Segment Tree Beats、Aliens trick。 |
| 赤色 | 2800以上 | 専門理論を必要に応じて習得する。一般重み付きmatching、FPS合成、線形matroid交差。 |

章や案内節の「導入対象」は、その見取り図を理解する目安です。子Unitには独立した対象色を付けています。親を読んだ後、高い色の子をいったん飛ばして次のまとまりへ進んで構いません。赤色の専門Unitも、全てを習得することがその色になる条件という意味ではありません。

表示色は先取りを制限するものではありません。自分の色以下でも未習なら優先して補い、高い色でも必要になったUnitから読んでください。親子のまとまりを優先するため、前提が後の節や章にある場合はリンク先を案内します。未習の前提を補ってから戻るか、その子Unitを後回しにしてください。

ARC・AGC・CF Div. 1・UCUPなどの難問へ進む際には、解法を再現した後で、成立条件を一つ外すと何が壊れるか、他の章の表現へ写せるかを考えてください。たとえばDP遷移を区間要約・行列・多項式へ写す、割当てをmatching・flowへ写す、といった接続を自分で導けるようにすることが目標です。

## 全体の構成

1. [モデル変換とアルゴリズム設計](/learn/modeling/)
2. [データ構造と問い合わせ](/learn/query/)
3. [動的計画法](/learn/dynamic-programming/)
4. [グラフアルゴリズム](/learn/graph/)
5. [木構造](/learn/tree/)
6. [文字列アルゴリズム](/learn/string/)
7. [数論](/learn/number-theory/)
8. [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)
9. [幾何・凸最適化](/learn/geometry-optimization/)

## 概要

問題を既知の算法へ写すための共通言語を学ぶ。状態の同一視と寄与の分解から始め、探索空間の分割、交換論による貪欲法、単調性による探索へ進む。後半では処理順と総仕事量を設計し、乱択・対話によって使える情報そのものを考える。以後の各章でも、何を保存する変換なのか、候補を捨ててよい理由は何かをこの章へ戻って確認する。

### モデル変換

問題固有の操作を再利用可能な構造・順序・境界の問題へ変換する。

観察: 球iの行き先は整数x_i∈[L_i,R_i]であり、異なる球に同じ整数を使えない。

候補の比較: 配置順をすべて試す前に、球を単位時間の仕事、整数を時刻、区間を実行可能時間窓へ写す。

不変量: 各球と各仕事、各箱と各時刻が一対一に対応し、同時刻に二仕事を割り当てない条件が箱の重複禁止と一致する。

確認: [1,1]の球が二個なら一枠に二仕事が必要で不可能。[1,2]が二個なら時刻1,2への割当てが配置を与える。変換はO(N)で、値域全体を列挙する必要はない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

問題文の操作を再利用可能な対象・不変量へ言い換え、探索・貪欲・分割手法を選ぶ共通の視点を最初に作る。

### このUnitでは扱わないもの

- なし

## 章の構成

- [同値な状態を正規化する](/learn/modeling/normalization/) — 水色
- [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/) — 緑色
- [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/) — 緑色
- [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/) — 緑色
- [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/) — 緑色
- [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/) — 水色（導入）
  - [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/) — 水色
  - [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/) — 水色
- [交換論から選択順を導く](/learn/modeling/greedy-exchange/) — 水色
- [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/) — 水色
- [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/) — 青色
- [成立証明から構成解を復元する](/learn/modeling/constructive-witness/) — 水色
- [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/) — 青色
- [単調境界を証明して探索する](/learn/modeling/monotone-search/) — 緑色
- [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/) — 緑色
- [event順にactive集合を更新する](/learn/modeling/event-sweep/) — 水色
  - [kinetic sorting・交差event順序更新](/learn/modeling/kinetic-order-maintenance/) — 橙色
- [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/) — 水色
- [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/) — 青色
- [軽重分類と償却解析で総仕事量を抑える](/learn/modeling/decomposition-amortization/) — 水色（導入）
  - [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/) — 水色
  - [small-to-large・DSU on Tree](/learn/modeling/small-to-large/) — 青色
  - [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/) — 青色
- [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/) — 青色
  - [乱択代数fingerprint](/learn/modeling/randomized-algebraic-fingerprint/) — 黄色
- [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/) — 緑色
- [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f)
- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h)
- [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e)
- [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f)
- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e)
- [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC225 E「7」](https://atcoder.jp/contests/abc225/tasks/abc225_e)
- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f)
- [ABC226 E「Just one」](https://atcoder.jp/contests/abc226/tasks/abc226_e)
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f)
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC229 G「Longest Y」](https://atcoder.jp/contests/abc229/tasks/abc229_g)
- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC231 F「Jealous Two」](https://atcoder.jp/contests/abc231/tasks/abc231_f)
- [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g)
- [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h)
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h)
- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC246 G「Game on Tree 3」](https://atcoder.jp/contests/abc246/tasks/abc246_g)
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e)
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC250 F「One Fourth」](https://atcoder.jp/contests/abc250/tasks/abc250_f)
- [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC252 F「Bread」](https://atcoder.jp/contests/abc252/tasks/abc252_f)
- [ABC253 F「Operations on a Matrix」](https://atcoder.jp/contests/abc253/tasks/abc253_f)
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h)
- [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f)
- [ABC258 E「Packing Potatoes」](https://atcoder.jp/contests/abc258/tasks/abc258_e)
- [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f)
- [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g)
- [ABC259 F「Select Edges」](https://atcoder.jp/contests/abc259/tasks/abc259_f)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC261 F「Sorting Color Balls」](https://atcoder.jp/contests/abc261/tasks/abc261_f)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC262 F「Erase and Rotate」](https://atcoder.jp/contests/abc262/tasks/abc262_f)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC266 Ex「Snuke Panic (2D)」](https://atcoder.jp/contests/abc266/tasks/abc266_h)
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e)
- [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f)
- [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e)
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h)
- [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f)
- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h)
- [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h)
- [ABC283 F「Permutation Distance」](https://atcoder.jp/contests/abc283/tasks/abc283_f)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g)
- [ABC290 Ex「Bow Meow Optimization」](https://atcoder.jp/contests/abc290/tasks/abc290_h)
- [ABC293 Ex「Optimal Path Decomposition」](https://atcoder.jp/contests/abc293/tasks/abc293_h)
- [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f)
- [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e)
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)
- [ABC296 F「Simultaneous Swap」](https://atcoder.jp/contests/abc296/tasks/abc296_f)
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f)
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
- [ABC299 G「Minimum Permutation」](https://atcoder.jp/contests/abc299/tasks/abc299_g)
- [ABC300 F「More Holidays」](https://atcoder.jp/contests/abc300/tasks/abc300_f)
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g)
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f)
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
- [ABC309 F「Box in Box」](https://atcoder.jp/contests/abc309/tasks/abc309_f)
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f)
- [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g)
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC322 G「Two Kinds of Base」](https://atcoder.jp/contests/abc322/tasks/abc322_g)
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e)
- [ABC327 F「Apples」](https://atcoder.jp/contests/abc327/tasks/abc327_f)
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e)
- [ABC328 G「Cut and Reorder」](https://atcoder.jp/contests/abc328/tasks/abc328_g)
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e)
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g)
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC346 G「Alone」](https://atcoder.jp/contests/abc346/tasks/abc346_g)
- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g)
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e)
- [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f)
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g)
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f)
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f)
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g)
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g)
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e)
- [ABC360 F「InterSections」](https://atcoder.jp/contests/abc360/tasks/abc360_f)
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
- [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e)
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e)
- [ABC366 F「Maximum Composition」](https://atcoder.jp/contests/abc366/tasks/abc366_f)
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g)
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g)
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e)
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC370 F「Cake Division」](https://atcoder.jp/contests/abc370/tasks/abc370_f)
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f)
- [ABC375 F「Road Blocked」](https://atcoder.jp/contests/abc375/tasks/abc375_f)
- [ABC376 E「Max × Sum」](https://atcoder.jp/contests/abc376/tasks/abc376_e)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC378 E「Mod Sigma Problem」](https://atcoder.jp/contests/abc378/tasks/abc378_e)
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g)
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e)
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g)
- [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e)
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC388 G「Simultaneous Kagamimochi 2」](https://atcoder.jp/contests/abc388/tasks/abc388_g)
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e)
- [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e)
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g)
- [ABC392 F「Insert」](https://atcoder.jp/contests/abc392/tasks/abc392_f)
- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC396 F「Rotated Inversions」](https://atcoder.jp/contests/abc396/tasks/abc396_f)
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g)
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)
- [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f)
- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g)
- [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f)
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)
- [ABC407 E「Most Valuable Parentheses」](https://atcoder.jp/contests/abc407/tasks/abc407_e)
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g)
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)
- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e)
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e)
- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)
- [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e)
- [ABC424 E「Cut in Half」](https://atcoder.jp/contests/abc424/tasks/abc424_e)
- [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f)
- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g)
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f)
- [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g)
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f)
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f)
- [ABC433 F「1122 Subsequence 2」](https://atcoder.jp/contests/abc433/tasks/abc433_f)
- [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e)
- [ABC434 F「Concat (2nd)」](https://atcoder.jp/contests/abc434/tasks/abc434_f)
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e)
- [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e)
- [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f)
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g)
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f)
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f)
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g)
- [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f)
- [ABC444 E「Sparse Range」](https://atcoder.jp/contests/abc444/tasks/abc444_e)
- [ABC444 F「Half and Median」](https://atcoder.jp/contests/abc444/tasks/abc444_f)
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g)
- [ABC447 E「Divide Graph」](https://atcoder.jp/contests/abc447/tasks/abc447_e)
- [ABC447 G「Div. 1 & Div. 2」](https://atcoder.jp/contests/abc447/tasks/abc447_g)
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g)
- [ABC449 E「A += v」](https://atcoder.jp/contests/abc449/tasks/abc449_e)
- [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g)
- [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC452 F「Interval Inversion Count」](https://atcoder.jp/contests/abc452/tasks/abc452_f)
- [ABC453 F「Avoid Division」](https://atcoder.jp/contests/abc453/tasks/abc453_f)
- [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f)
- [ABC458 G「Children Yearn for the Evil Kindergarten」](https://atcoder.jp/contests/abc458/tasks/abc458_g)
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e)
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)
- [ABC463 F「Senshuraku」](https://atcoder.jp/contests/abc463/tasks/abc463_f)
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g)
- [ABC465 G「Sum of Mex of Mod of Linear」](https://atcoder.jp/contests/abc465/tasks/abc465_g)
- [ABC466 E「Range Flip」](https://atcoder.jp/contests/abc466/tasks/abc466_e)

## 根拠

- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC215 F 公式解説](https://atcoder.jp/contests/abc215/editorial/2492)
- [ABC215 F 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-modeling`
