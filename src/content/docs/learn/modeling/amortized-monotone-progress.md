---
title: "単調進行による償却解析"
description: "「単調進行による償却解析」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 17
---

# 単調進行による償却解析

習得対象の目安: **水色（1200–1599）**。一度だけの削除やpotentialの減少に課金し、操作列全体を評価する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 単調進行による償却解析

一回の操作に長いwhileループがあっても、各反復で一つの要素が次の段階へ進み、元の段階へ戻らないなら、全操作を通じた反復数を抑えられる。まず各反復を追加された要素へ対応させ、次に一反復あたりの費用を数える。

### 習得する技能

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

## 考え方

### queueからheapへ、一度だけ移す

[ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e)では、列の末尾への追加、先頭の出力・削除、列全体の昇順ソートを行う。毎回全体をソートすると、同じ要素を繰り返し処理してしまう。必要なのは先頭の値なので、最後のソートまでにあった部分を最小値を取り出すheap、その後に追加した部分を到着順のqueueで持つ。

常に「heap内の要素を昇順に並べた列、その後ろにqueueの列を連結したもの」が現在の列になるよう保つ。追加はqueueの末尾へ入れる。ソートはqueueが空になるまで先頭をheapへ移す。出力・削除はheapが非空ならその最小値、空ならqueueの先頭を取り出す。これでソート時には全要素がheapに入り、ソート後の追加は既存の部分の後ろに残る。

次は独自の短い操作列である。queueは先頭からの順、heapは内容を読みやすく昇順に記す。heapの内部配列の配置ではない。「移動」は今回queueからheapへ移した個数で、`∅`は空を表す。

| 操作 | queue | heap | 移動 |
| --- | --- | --- | --- |
| 3, 1を順に追加 | 3, 1 | ∅ | 0 |
| ソート | ∅ | 1, 3 | 2 |
| 0を追加 | 0 | 1, 3 | 0 |
| 1を出力 | 0 | 3 | 0 |
| ソート | ∅ | 0, 3 | 1 |
| もう一度ソート | ∅ | 0, 3 | 0 |
| 0, 3を順に出力 | ∅ | ∅ | 0 |
| 2を追加・出力 | ∅ | ∅ | 0 |
| ソート | ∅ | ∅ | 0 |

0を追加した直後も先頭はheapの1であり、二つの容器の最小値を比較して0を先に出してはいけない。また、既にheapにある3は次のソートでも移動しない。最後に追加した2のように、queueから直接出力される要素は移動を一度も経験しない。

各ソートでのwhileの反復を、そこでheapへ移した要素に課金する。各要素の経路は「queue→heap→削除」または「queue→削除」であり、heapからqueueへ戻る経路はない。したがって全ソートでの反復数は追加要素数以下となる。表でも追加4個に対して移動は合計3回である。同じ値を複数回追加しても、それぞれ別の要素として数える。

### 削除した辺の再追加は、新しい実体として数える

[ABC302 E「Isolation」](https://atcoder.jp/contests/abc302/tasks/abc302_e)では、空の無向グラフへ辺を追加する操作と、指定頂点につながる全辺を削除する操作がある。追加の直前にその辺は存在しないが、削除後に同じ端点対を再び追加することはできる。

各頂点の隣接先をsetで持ち、辺の追加時は両端の集合へ相手を入れる。頂点の全辺削除では、その頂点の隣接先を一つずつ列挙して相手側の集合からも消し、最後に自分側を空にする。両側から消すことで、後から反対側の頂点を処理しても同じ辺は再び列挙されない。

3頂点の例で、追加されるたびに辺へ新しい名前を付ける。

| 操作 | 操作後に存在する辺 | 今回の削除辺数 |
| --- | --- | --- |
| (1, 2)を追加 | e₁=(1, 2) | 0 |
| (1, 3)を追加 | e₁, e₂=(1, 3) | 0 |
| 頂点1の全辺を削除 | ∅ | 2 |
| 頂点1の全辺を削除 | ∅ | 0 |
| (1, 2)を再追加 | e₃=(1, 2) | 0 |
| 頂点2の全辺を削除 | ∅ | 1 |
| 頂点1の全辺を削除 | ∅ | 0 |

端点対は2種類だが、削除辺数の合計は3である。「同じ端点対は一度しか消さない」と数えると誤る。課金先は追加一回で生まれ、削除されるまで存在する**辺の実体**である。e₁とe₃は別実体なので、全辺削除の内側の反復数は辺の追加回数以下となる。無向辺を二つの隣接集合から消す費用は、一実体につき定数回の集合操作として数える。

孤立頂点数も、次数が0から正になる追加時、正から0になる削除時だけ更新すればよい。既に孤立している頂点の全辺削除では、反復も個数の変更も起きない。

## 成立条件と計算量

操作数を $$Q$$、追加された要素・辺の実体数を $$R$$ とする。各実体が高々一度だけ内側の反復を起こすと証明できれば、総反復数は $$R$$ 以下である。一反復の費用の上界を $$T$$ とし、各操作の固定費用が定数なら、初期化を除く全体は $$O(Q+RT)$$ 時間で抑えられる。反復しない空の操作も $$Q$$ の項へ含める。

ABC217 Eでは $$R\leq Q$$ で、queue操作を定数時間、heapの挿入・取り出しを $$O(\log(Q+1))$$ 時間で行う。取り出し回数も $$Q$$ 以下なので、全体は $$O(Q\log(Q+1))$$ 時間、空間は $$O(Q)$$ である。queueの先頭削除で残り全要素をずらす実装では、この評価にならない。

ABC302 Eでは頂点数を $$N$$ とすると、平衡木のset操作は $$O(\log(N+1))$$ 時間である。追加ごとの挿入も定数回、削除時の総列挙も $$R\leq Q$$ 回なので、集合を頂点ごとに用意する初期化と各操作後の出力を含め、全体は $$O(N+Q\log(N+1))$$ 時間、空間は $$O(N+Q)$$ となる。集合を空にする費用も、消す隣接要素の総数へ含める。

残りの処理予算を数値で持つ見方もできる。この値を**ポテンシャル（potential）**と呼ぶ。例えば未移動のqueue要素数なら、追加一回で1増え、移動一回で1減り、常に非負である。queueから直接出力する場合も1減るので、総移動数は初期量と全追加による増加量の和を超えない。部分問題サイズが半減する場合も、「あと何回半減できるか」という対数の予算を考えられる。

ただし、削除後に状態を巻き戻すrollbackがあると、この予算は復活する。例えば $$K$$ 個の要素を持つ状態へ戻すたびに全削除すれば、これを $$L$$ 回繰り返す総取り出し回数は $$KL$$ になる。最初の $$K$$ 個だけに一度ずつ課金することはできない。復元・再生成で増える予算と、その操作自体の費用を数え直す必要がある。新たな実体や予算の生成数を入力サイズから抑えられることまで確認して使う。

概念上の親: [軽重分類と償却解析で総仕事量を抑える](/learn/modeling/decomposition-amortization/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

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
- [ABC368 G「Add and Multiply Queries」](https://atcoder.jp/contests/abc368/tasks/abc368_g) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC466 F「Many Mod Calculation」](https://atcoder.jp/contests/abc466/tasks/abc466_f) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC428 F「Pyramid Alignment」](https://atcoder.jp/contests/abc428/tasks/abc428_f) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（dequeなどの端点操作でrun分割を更新し、左右の境界からの削除・追加と各要素の償却回数を説明できる。）。
- [ABC256 Ex「I like Query Problem」](https://atcoder.jp/contests/abc256/tasks/abc256_h) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC255 Ex「Range Harvest Query」](https://atcoder.jp/contests/abc255/tasks/abc255_h) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC267 E「Erasing Vertices 2」](https://atcoder.jp/contests/abc267/tasks/abc267_e) — 主題: [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC295 G「Minimum Reachable City」](https://atcoder.jp/contests/abc295/tasks/abc295_g) — 主題: [単調path contraction・DSU jump](/learn/graph/monotone-path-contraction/)（一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC305 F「Dungeon Explore」](https://atcoder.jp/contests/abc305/tasks/abc305_f) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。追加で学ぶ技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC312 Ex「snukesnuke」](https://atcoder.jp/contests/abc312/tasks/abc312_h) — 主題: [文字列周期・primitive word](/learn/string/string-periodicity/)（prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC329 E「Stamp」](https://atcoder.jp/contests/abc329/tasks/abc329_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC364 F「Range Connect MST」](https://atcoder.jp/contests/abc364/tasks/abc364_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC417 G「Binary Cat」](https://atcoder.jp/contests/abc417/tasks/abc417_g) — 主題: [圧縮・反復・再帰文字列へ問い合わせる](/learn/string/recursive-compressed-string/)（圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [doubling・binary lifting](/learn/graph/binary-lifting/)（一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。）。
- [ABC421 F「Erase between X and Y」](https://atcoder.jp/contests/abc421/tasks/abc421_f) — 主題: [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC426 F「Clearance」](https://atcoder.jp/contests/abc426/tasks/abc426_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC430 G「Range Set Modifying Query」](https://atcoder.jp/contests/abc430/tasks/abc430_g) — 主題: [Segment Tree Beats](/learn/query/segment-tree-beats/)（nodeの最大/次点/個数等からrange chmin/chmaxが一括適用できる条件を判定し、失敗時だけ子へ降りる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。
- [ABC435 E「Cover query」](https://atcoder.jp/contests/abc435/tasks/abc435_e) — 主題: [端点更新型のrun分割管理](/learn/query/ordered-interval-partition/)（互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

## 根拠

- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC302 E 公式問題文](https://atcoder.jp/contests/abc302/tasks/abc302_e)
- [ABC302 E 公式解説](https://atcoder.jp/contests/abc302/editorial/6410)
- [ABC255 H 公式解説](https://atcoder.jp/contests/abc255/editorial/4103)
- [ABC255 H 公式問題文](https://atcoder.jp/contests/abc255/tasks/abc255_h)
- [ABC256 H 公式解説](https://atcoder.jp/contests/abc256/editorial/4113)
- [ABC256 H 公式問題文](https://atcoder.jp/contests/abc256/tasks/abc256_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-amortized-monotone-progress`
