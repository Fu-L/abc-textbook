---
title: "モデル変換とアルゴリズム設計"
description: "モデル変換とアルゴリズム設計の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 0
---

# モデル変換とアルゴリズム設計

## 概要

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

- なし

## 下位単元

- [単調境界を証明して探索する](/learn/modeling/monotone-search/)
- [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)
- [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)
- [event順にactive集合を更新する](/learn/modeling/event-sweep/)
- [同値な状態を正規化する](/learn/modeling/normalization/)
- [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)
- [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)
- [交換論から選択順を導く](/learn/modeling/greedy-exchange/)
- [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)
- [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)
- [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/)
- [軽重分類と償却解析で総仕事量を抑える](/learn/modeling/decomposition-amortization/)
- [基準witnessから変更影響を局所化する](/learn/modeling/change-impact-localization/)
- [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)
- [乱択の成功条件と誤り確率を設計する](/learn/modeling/randomized-algorithms/)
- [bitwise greedyによるmask最適化](/learn/modeling/bitwise-greedy-feasibility/)
- [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)
- [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)
- [情報量下界・query符号設計](/learn/modeling/information-theoretic-query-design/)
- [二進操作の木へのモデル化と祖先マッチング](/learn/modeling/binary-tree-ancestor-matching/)

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC216 E「Amusement Park」](https://atcoder.jp/contests/abc216/tasks/abc216_e)
- [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f)
- [ABC218 E「Destruction」](https://atcoder.jp/contests/abc218/tasks/abc218_e)
- [ABC218 F「Blocked Roads」](https://atcoder.jp/contests/abc218/tasks/abc218_f)
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h)
- [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e)
- [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f)
- [ABC221 G「Jumping sequence」](https://atcoder.jp/contests/abc221/tasks/abc221_g)
- [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e)
- [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 H「Xor Query」](https://atcoder.jp/contests/abc223/tasks/abc223_h)
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e)
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f)
- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h)
- [ABC228 H「Histogram」](https://atcoder.jp/contests/abc228/tasks/abc228_h)
- [ABC230 E「Fraction Floor Sum」](https://atcoder.jp/contests/abc230/tasks/abc230_e)
- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC232 G「Modulo Shortest Path」](https://atcoder.jp/contests/abc232/tasks/abc232_g)
- [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h)
- [ABC235 E「MST + 1」](https://atcoder.jp/contests/abc235/tasks/abc235_e)
- [ABC236 F「Spices」](https://atcoder.jp/contests/abc236/tasks/abc236_f)
- [ABC240 E「Ranges on Tree」](https://atcoder.jp/contests/abc240/tasks/abc240_e)
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC240 F「Sum Sum Max」](https://atcoder.jp/contests/abc240/tasks/abc240_f)
- [ABC242 G「Range Pairing Query」](https://atcoder.jp/contests/abc242/tasks/abc242_g)
- [ABC243 E「Edge Deletion」](https://atcoder.jp/contests/abc243/tasks/abc243_e)
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h)
- [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e)
- [ABC250 Ex「Trespassing Takahashi」](https://atcoder.jp/contests/abc250/tasks/abc250_h)
- [ABC254 G「Elevators」](https://atcoder.jp/contests/abc254/tasks/abc254_g)
- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC257 Ex「Dice Sum 2」](https://atcoder.jp/contests/abc257/tasks/abc257_h)
- [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f)
- [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f)
- [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g)
- [ABC259 F「Select Edges」](https://atcoder.jp/contests/abc259/tasks/abc259_f)
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h)
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h)
- [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h)
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f)
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h)
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h)
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC273 F「Hammer 2」](https://atcoder.jp/contests/abc273/tasks/abc273_f)
- [ABC274 G「Security Camera 3」](https://atcoder.jp/contests/abc274/tasks/abc274_g)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g)
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g)
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g)
- [ABC281 E「Least Elements」](https://atcoder.jp/contests/abc281/tasks/abc281_e)
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h)
- [ABC281 F「Xor Minimization」](https://atcoder.jp/contests/abc281/tasks/abc281_f)
- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)
- [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h)
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g)
- [ABC286 F「Guess The Number 2」](https://atcoder.jp/contests/abc286/tasks/abc286_f)
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC287 G「Balance Update Query」](https://atcoder.jp/contests/abc287/tasks/abc287_g)
- [ABC293 F「Zero or One」](https://atcoder.jp/contests/abc293/tasks/abc293_f)
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g)
- [ABC296 G「Polygon and Points」](https://atcoder.jp/contests/abc296/tasks/abc296_g)
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f)
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
- [ABC301 Ex「Difference of Distance」](https://atcoder.jp/contests/abc301/tasks/abc301_h)
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f)
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g)
- [ABC304 Ex「Constrained Topological Sort」](https://atcoder.jp/contests/abc304/tasks/abc304_h)
- [ABC305 Ex「Shojin」](https://atcoder.jp/contests/abc305/tasks/abc305_h)
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f)
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e)
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f)
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h)
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f)
- [ABC314 G「Amulets」](https://atcoder.jp/contests/abc314/tasks/abc314_g)
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h)
- [ABC318 F「Octopus」](https://atcoder.jp/contests/abc318/tasks/abc318_f)
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC320 G「Slot Strategy 2 (Hard)」](https://atcoder.jp/contests/abc320/tasks/abc320_g)
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g)
- [ABC322 G「Two Kinds of Base」](https://atcoder.jp/contests/abc322/tasks/abc322_g)
- [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e)
- [ABC328 G「Cut and Reorder」](https://atcoder.jp/contests/abc328/tasks/abc328_g)
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e)
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g)
- [ABC332 G「Not Too Many Balls」](https://atcoder.jp/contests/abc332/tasks/abc332_g)
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e)
- [ABC345 F「Many Lamps」](https://atcoder.jp/contests/abc345/tasks/abc345_f)
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g)
- [ABC346 F「SSttrriinngg in StringString」](https://atcoder.jp/contests/abc346/tasks/abc346_f)
- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g)
- [ABC349 G「Palindrome Construction」](https://atcoder.jp/contests/abc349/tasks/abc349_g)
- [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e)
- [ABC351 F「Double Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_f)
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g)
- [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e)
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f)
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
- [ABC355 E「Guess the Sum」](https://atcoder.jp/contests/abc355/tasks/abc355_e)
- [ABC356 F「Distance Component Size Query」](https://atcoder.jp/contests/abc356/tasks/abc356_f)
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g)
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g)
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e)
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
- [ABC361 E「Tree and Hamilton Path 2」](https://atcoder.jp/contests/abc361/tasks/abc361_e)
- [ABC361 G「Go Territory」](https://atcoder.jp/contests/abc361/tasks/abc361_g)
- [ABC366 E「Manhattan Multifocal Ellipse」](https://atcoder.jp/contests/abc366/tasks/abc366_e)
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g)
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e)
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f)
- [ABC369 G「As far as possible」](https://atcoder.jp/contests/abc369/tasks/abc369_g)
- [ABC371 G「Lexicographically Smallest Permutation」](https://atcoder.jp/contests/abc371/tasks/abc371_g)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g)
- [ABC383 E「Sum of Max Matching」](https://atcoder.jp/contests/abc383/tasks/abc383_e)
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g)
- [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e)
- [ABC384 G「Abs Sum」](https://atcoder.jp/contests/abc384/tasks/abc384_g)
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g)
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g)
- [ABC389 E「Square Price」](https://atcoder.jp/contests/abc389/tasks/abc389_e)
- [ABC390 E「Vitamin Balance」](https://atcoder.jp/contests/abc390/tasks/abc390_e)
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g)
- [ABC392 E「Cables and Servers」](https://atcoder.jp/contests/abc392/tasks/abc392_e)
- [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f)
- [ABC396 E「Min of Restricted Sum」](https://atcoder.jp/contests/abc396/tasks/abc396_e)
- [ABC397 G「Maximize Distance」](https://atcoder.jp/contests/abc397/tasks/abc397_g)
- [ABC398 E「Tree Game」](https://atcoder.jp/contests/abc398/tasks/abc398_e)
- [ABC399 G「Colorful Spanning Tree」](https://atcoder.jp/contests/abc399/tasks/abc399_g)
- [ABC401 E「Reachable Set」](https://atcoder.jp/contests/abc401/tasks/abc401_e)
- [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f)
- [ABC401 G「Push Simultaneously」](https://atcoder.jp/contests/abc401/tasks/abc401_g)
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f)
- [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f)
- [ABC405 G「Range Shuffle Query」](https://atcoder.jp/contests/abc405/tasks/abc405_g)
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e)
- [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g)
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f)
- [ABC412 G「Degree Harmony」](https://atcoder.jp/contests/abc412/tasks/abc412_g)
- [ABC415 G「Get Many Cola」](https://atcoder.jp/contests/abc415/tasks/abc415_g)
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g)
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f)
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g)
- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)
- [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e)
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f)
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f)
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g)
- [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f)
- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g)
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f)
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g)
- [ABC431 F「Almost Sorted 2」](https://atcoder.jp/contests/abc431/tasks/abc431_f)
- [ABC431 G「One Time Swap 2」](https://atcoder.jp/contests/abc431/tasks/abc431_g)
- [ABC432 F「Candy Redistribution」](https://atcoder.jp/contests/abc432/tasks/abc432_f)
- [ABC433 F「1122 Subsequence 2」](https://atcoder.jp/contests/abc433/tasks/abc433_f)
- [ABC434 E「Distribute Bunnies」](https://atcoder.jp/contests/abc434/tasks/abc434_e)
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e)
- [ABC436 E「Minimum Swap」](https://atcoder.jp/contests/abc436/tasks/abc436_e)
- [ABC437 G「Colorful Christmas Tree」](https://atcoder.jp/contests/abc437/tasks/abc437_g)
- [ABC438 G「Sum of Min」](https://atcoder.jp/contests/abc438/tasks/abc438_g)
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g)
- [ABC440 F「Egoism」](https://atcoder.jp/contests/abc440/tasks/abc440_f)
- [ABC443 F「Non-Increasing Number」](https://atcoder.jp/contests/abc443/tasks/abc443_f)
- [ABC447 G「Div. 1 & Div. 2」](https://atcoder.jp/contests/abc447/tasks/abc447_g)
- [ABC448 G「Conquest」](https://atcoder.jp/contests/abc448/tasks/abc448_g)
- [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g)
- [ABC451 E「Tree Distance」](https://atcoder.jp/contests/abc451/tasks/abc451_e)
- [ABC451 F「Make Bipartite 3」](https://atcoder.jp/contests/abc451/tasks/abc451_f)
- [ABC454 F「Make it Palindrome 2」](https://atcoder.jp/contests/abc454/tasks/abc454_f)
- [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f)
- [ABC459 E「Select from Subtrees」](https://atcoder.jp/contests/abc459/tasks/abc459_e)
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g)
- [ABC462 G「Completely Wrong」](https://atcoder.jp/contests/abc462/tasks/abc462_g)
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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `9c8c7f6220918d98b6531e55807203930903959b1f90b154aa0b9e92be2958fa` / LearningUnit `unit-chapter-modeling`
