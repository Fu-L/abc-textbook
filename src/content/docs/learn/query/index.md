---
title: "データ構造と問い合わせ"
description: "「データ構造と問い合わせ」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 28
---

# データ構造と問い合わせ

導入対象の目安: **緑色（800–1199）**。必要な操作と保持する情報を整理し、基本コンテナから区間構造へ進む入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

保持する情報と許す操作からデータ構造を選ぶ。局所的な接続・順序の管理から、累積和、結合的な区間要約、その要約への作用へ進む。静的問い合わせ、窓の移動、疎な座標、過去の版という条件の違いを比較し、最後にbit列とfingerprintによる表現を扱う。DPや木の章では、この章で定めた要約と更新の契約を再利用する。

### 更新可能な最小十分要約

問い合わせの答えを合成でき、更新で保てる十分な統計量を導く。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: なし。

問い合わせに必要な要約と更新規則を見抜く視点を先に学び、目的に合うデータ構造の選択へつなげる。

### このUnitでは扱わないもの

- なし

## 章の構成

- [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/) — 茶色
- [heap・ordered setで全候補の極値を保つ](/learn/query/ordered-set-heap/) — 緑色（導入）
  - [priority queue・best-first列挙](/learn/query/priority-queue-best-first/) — 緑色
  - [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/) — 緑色
  - [ordered interval partition・ODT](/learn/query/ordered-interval-partition/) — 青色
- [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/) — 水色
- [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/) — 青色
- [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/) — 茶色
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/) — 水色
- [結合的要約と列・区間の合成](/learn/query/monoid-segment-tree/) — 水色（導入）
  - [区間monoid要約](/learn/query/range-monoid-aggregation/) — 水色
  - [有限関数・作用の合成](/learn/query/finite-function-composition/) — 水色
  - [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/) — 水色
  - [SWAG・two-stack queue aggregation](/learn/query/swag/) — 青色
  - [Segment Treeのcanonical区間分解](/learn/query/segment-tree-canonical-decomposition/) — 青色
  - [静的sorted range index・Merge Sort Tree](/learn/query/static-sorted-range-index/) — 青色
  - [動的・implicit Segment Tree](/learn/query/dynamic-segment-tree/) — 青色
- [区間更新を要約へ作用させる](/learn/query/range-actions/) — 青色
  - [Segment Tree Beats](/learn/query/segment-tree-beats/) — 橙色
- [値軸のbucket分割と区間集約](/learn/query/value-bucket-aggregation/) — 水色
- [Moの順序で区間問い合わせの差分を更新する](/learn/query/mo-offline-range/) — 青色
- [構造を共有して過去の版を保存・復元する](/learn/query/persistence-rollback/) — 青色（導入）
  - [rollback・DFS入退場の状態復元](/learn/query/rollback/) — 青色
  - [永続data structure・structural sharing](/learn/query/persistence/) — 黄色
- [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/) — 水色
- [bit列をTrieで索引化する](/learn/query/binary-trie/) — 水色
- [上位bitの支配関係によるXOR minimax](/learn/query/bitwise-minimax-partition/) — 青色
- [Rolling fingerprintで列の同値性を比較する](/learn/query/string-hash/) — 水色（導入）
  - [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g)
- [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h)
- [ABC233 G「Strongest Takahashi」](https://atcoder.jp/contests/abc233/tasks/abc233_g)
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g)
- [ABC238 E「Range Sums」](https://atcoder.jp/contests/abc238/tasks/abc238_e)
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h)
- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h)
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e)
- [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f)
- [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g)
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h)
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h)
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h)
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h)
- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h)
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h)
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h)
- [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h)
- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f)
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g)
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h)
- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g)
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e)
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g)
- [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g)
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e)
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f)
- [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g)
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f)
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g)
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f)
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g)
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e)
- [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g)
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f)
- [ABC330 G「Inversion Squared」](https://atcoder.jp/contests/abc330/tasks/abc330_g)
- [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e)
- [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f)
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g)
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e)
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f)
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g)
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f)
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f)
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g)
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f)
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g)
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f)
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g)
- [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g)
- [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f)
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g)
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f)
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f)
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f)
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f)
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g)
- [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e)
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f)
- [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g)
- [ABC423 E「Sum of Subarrays」](https://atcoder.jp/contests/abc423/tasks/abc423_e)
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f)
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e)
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f)
- [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e)
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g)
- [ABC452 E「You WILL Like Sigma Problem」](https://atcoder.jp/contests/abc452/tasks/abc452_e)
- [ABC454 F「Make it Palindrome 2」](https://atcoder.jp/contests/abc454/tasks/abc454_f)
- [ABC455 E「Unbalanced ABC Substrings」](https://atcoder.jp/contests/abc455/tasks/abc455_e)
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g)
- [ABC465 F「Sjeltzer?」](https://atcoder.jp/contests/abc465/tasks/abc465_f)

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `adb11948ece18b2894d071788efcc47cc9e20d0f71d3fcb7a87fdbfb7d2ca8d9` / LearningUnit `unit-chapter-query`
