---
title: "単調進行による償却解析"
description: "「単調進行による償却解析」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 20
---

# 単調進行による償却解析

習得対象の目安: **水色（1200–1599）**。一度だけの削除やpotentialの減少に課金し、操作列全体を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調進行による償却解析

要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。

### 習得する技能

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC302 E「Isolation」](https://atcoder.jp/contests/abc302/tasks/abc302_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC403 E「Forbidden Prefix」](https://atcoder.jp/contests/abc403/tasks/abc403_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。）。
- [ABC428 F「Pyramid Alignment」](https://atcoder.jp/contests/abc428/tasks/abc428_f) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC466 F「Many Mod Calculation」](https://atcoder.jp/contests/abc466/tasks/abc466_f) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h) — 主題: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)（一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。追加で学ぶ技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)（prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g) — 主題: [Segment Tree Beats](/learn/query/segment-tree-beats/)（nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e) — 主題: [ordered interval partition・ODT](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

## 根拠

- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC255 H 公式解説](https://atcoder.jp/contests/abc255/editorial/4103)
- [ABC255 H 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `5856cce249dc16a05c694fe4136c7592920790e2786135edf898cc4b20161c4a` / LearningUnit `unit-amortized-monotone-progress`
