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

### 習得する技能

- 問い合わせに十分で、更新と合成で保てる要約を導ける。

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

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC213 F「Common Prefixes」](https://atcoder.jp/contests/abc213/tasks/abc213_f) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC216 G「01Sequence」](https://atcoder.jp/contests/abc216/tasks/abc216_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。 / 対称操作で同値な状態の標準形と不変量を選べる。
- [ABC233 Ex「Manhattan Christmas Tree」](https://atcoder.jp/contests/abc233/tasks/abc233_h) — 主題: [parallel binary search・多数境界の判定共有](/learn/modeling/parallel-binary-search/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC233 G「Strongest Takahashi」](https://atcoder.jp/contests/abc233/tasks/abc233_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC234 G「Divide a Sequence」](https://atcoder.jp/contests/abc234/tasks/abc234_g) — 主題: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)。既習技能: 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC238 E「Range Sums」](https://atcoder.jp/contests/abc238/tasks/abc238_e) — 主題: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC244 Ex「Linear Maximization」](https://atcoder.jp/contests/abc244/tasks/abc244_h) — 主題: [Convex Hull Trick・直線包絡](/learn/geometry-optimization/line-envelope/)。既習技能: 区間をO(log N)個のcanonical nodeへ分解し、range objectの登録、時間生存区間への配置、またはrange-edge graphの少数辺表現を構築できる。 / 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。
- [ABC245 E「Wrapping Chocolate」](https://atcoder.jp/contests/abc245/tasks/abc245_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC251 Ex「Fill Triangle」](https://atcoder.jp/contests/abc251/tasks/abc251_h) — 主題: [標数pのFrobenius恒等式による反復高速化](/learn/number-theory/finite-field-frobenius/)。既習技能: 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。 / 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC263 Ex「Intersection 2」](https://atcoder.jp/contests/abc263/tasks/abc263_h) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC268 Ex「Taboo」](https://atcoder.jp/contests/abc268/tasks/abc268_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)。既習技能: pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC274 Ex「XOR Sum of Arrays」](https://atcoder.jp/contests/abc274/tasks/abc274_h) — 主題: [列・文字列のrolling fingerprint](/learn/query/sequence-fingerprint/)。
- [ABC275 Ex「Monster」](https://atcoder.jp/contests/abc275/tasks/abc275_h) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)。既習技能: 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC276 Ex「Construct a Matrix」](https://atcoder.jp/contests/abc276/tasks/abc276_h) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC280 Ex「Substring Sort」](https://atcoder.jp/contests/abc280/tasks/abc280_h) — 主題: [接尾辞の順序とLCPを索引化する](/learn/string/suffix-lcp-index/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC282 F「Union of Two Sets」](https://atcoder.jp/contests/abc282/tasks/abc282_f) — 主題: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)。既習技能: 問い合わせ・応答・終了宣言のprotocolを守り、応答依存の探索をquery上限内で実行できる。
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 次の二つのrankの大小関係で遷移元が四つの長方形へ分かれる。new[j][k][l]の全rank対走査を、旧layerの二次元prefix和から定数個の長方形和へ変える。
- [ABC287 Ex「Directed Graph and Query」](https://atcoder.jp/contests/abc287/tasks/abc287_h) — 主題: [推移閉包](/learn/graph/transitive-closure/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC294 G「Distance Queries on a Tree」](https://atcoder.jp/contests/abc294/tasks/abc294_g) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g) — 主題: [minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC307 G「Approximate Equalization」](https://atcoder.jp/contests/abc307/tasks/abc307_g) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC308 F「Vouchers」](https://atcoder.jp/contests/abc308/tasks/abc308_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC311 G「One More Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_g) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC324 G「Generate Arrays」](https://atcoder.jp/contests/abc324/tasks/abc324_g) — 主題: [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC330 F「Minimize Bounding Square」](https://atcoder.jp/contests/abc330/tasks/abc330_f) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC330 G「Inversion Squared」](https://atcoder.jp/contests/abc330/tasks/abc330_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC333 E「Takahashi Quest」](https://atcoder.jp/contests/abc333/tasks/abc333_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。 配達の直接経路をbaselineにし、補充境界iの追加費用をd_iとする。dp[i]=d_i+min_{i−K≤j<i}dp[j]。窓から出た候補と支配される候補をdequeから除き、O(NK)をO(N)へ落とす。
- [ABC337 G「Tree Inversion」](https://atcoder.jp/contests/abc337/tasks/abc337_g) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC339 E「Smooth Subsequence」](https://atcoder.jp/contests/abc339/tasks/abc339_e) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)。既習技能: グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 max_j(dp[j]−C|j−t|)+pを、j≤tのmax(dp[j]+Cj)−Ct+pとj≥tのmax(dp[j]−Cj)+Ct+pへ分ける。二本の区間最大で各イベントO(log N)。
- [ABC354 F「Useless for LIS」](https://atcoder.jp/contests/abc354/tasks/abc354_f) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC360 G「Suitable Edit for LIS」](https://atcoder.jp/contests/abc360/tasks/abc360_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。 / 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)。既習技能: 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC366 G「XOR Neighbors」](https://atcoder.jp/contests/abc366/tasks/abc366_g) — 主題: [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)。既習技能: 集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)。既習技能: 資源軸の上限と更新順を選び、選択の重複を避けられる。 / 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC404 G「Specified Range Sums」](https://atcoder.jp/contests/abc404/tasks/abc404_g) — 主題: [difference constraints・不等式系の最短路化](/learn/graph/difference-constraints/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC406 F「Compare Tree Weights」](https://atcoder.jp/contests/abc406/tasks/abc406_f) — 主題: [Euler順による部分木区間化](/learn/tree/tree-euler-flattening/)。既習技能: 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。
- [ABC406 G「Travelling Salesman Problem」](https://atcoder.jp/contests/abc406/tasks/abc406_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)。既習技能: 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 dp[p_h]=1+max_{|j−p_h|≤R,H_j≤h−D}dp[j]。高さ順にeligibleな点だけを有効化し、残る位置条件を区間最大にする。二条件の全点走査がsortとO(N log N)の更新・取得になる。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。 / 静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)。既習技能: 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- [ABC410 G「Longest Chord Chain」](https://atcoder.jp/contests/abc410/tasks/abc410_g) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)。既習技能: 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 / 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。
- [ABC419 E「Subarray Sum Divisibility」](https://atcoder.jp/contests/abc419/tasks/abc419_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)。既習技能: 要素の一方向移動・一度だけの削除・potential減少から操作列全体の仕事量を抑える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC421 G「Increase to make it Increasing」](https://atcoder.jp/contests/abc421/tasks/abc421_g) — 主題: [最小費用流・circulation](/learn/graph/min-cost-flow/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC423 E「Sum of Subarrays」](https://atcoder.jp/contests/abc423/tasks/abc423_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC424 F「Adding Chords」](https://atcoder.jp/contests/abc424/tasks/abc424_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 円周をcutして端点を線形化し、交互配置またはlaminar括弧構造からchord交差を判定・数え上げできる。
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)。既習技能: 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。 / 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC429 F「Shortest Path Query」](https://atcoder.jp/contests/abc429/tasks/abc429_f) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)。既習技能: 遷移を半環行列として定義し、結合則と単位元を保つ二分累乗・区間積で巨大回数の最適化遷移を計算できる。 / DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。
- [ABC433 E「Max Matrix 2」](https://atcoder.jp/contests/abc433/tasks/abc433_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)。既習技能: 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。 / 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。
- [ABC451 G「Minimum XOR Walk」](https://atcoder.jp/contests/abc451/tasks/abc451_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)。既習技能: 整数をF2 vectorとして最高bit pivotで消去し、独立性判定・最大XOR・表現可能性をonlineに保つ。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- [ABC452 E「You WILL Like Sigma Problem」](https://atcoder.jp/contests/abc452/tasks/abc452_e) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC454 F「Make it Palindrome 2」](https://atcoder.jp/contests/abc454/tasks/abc454_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)。既習技能: 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC455 E「Unbalanced ABC Substrings」](https://atcoder.jp/contests/abc455/tasks/abc455_e) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。
- [ABC464 G「Celester 2」](https://atcoder.jp/contests/abc464/tasks/abc464_g) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。既習技能: 各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。 / 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- [ABC465 F「Sjeltzer?」](https://atcoder.jp/contests/abc465/tasks/abc465_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)。既習技能: 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

## 根拠

- [ABC213 F 公式解説](https://atcoder.jp/contests/abc213/editorial/2391)
- [ABC213 F 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_f)
- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC216 G 公式解説](https://atcoder.jp/contests/abc216/editorial/2474)
- [ABC216 G 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-chapter-query`
