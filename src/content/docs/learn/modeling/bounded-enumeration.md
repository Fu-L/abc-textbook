---
title: "候補数を界して全列挙・有限case分解する"
description: "「候補数を界して全列挙・有限case分解する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
headingAliases:
  "有界全列挙有限case分解": "値域ではなく自由に決める量を数える"
  "集合をbitmaskで列挙する": "小さい集合なら採用不採用をそのまま表す"
sidebar:
  order: 1
---

# 候補数を界して全列挙・有限case分解する

習得対象の目安: **緑色（800–1199）**。制約から候補数を見積もり、成功までの探索回数を界する考え方を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 概要

全探索が間に合うかは、入力の見た目よりも、実際に生成する候補の数で決まる。大きな数を一つずつ試す代わりに、その数を決める少数のパラメータを列挙できないか考えよう。

この単元では、候補を漏れなく表す方法と、その総数・生成費用の評価を学ぶ。全候補が少ない場合に加え、同じ分類が二度現れたら答えが得られるため、探索途中で必ず止まる場合も扱う。

### 習得する技能

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。
- 集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。

## 考え方

### 値域ではなく、自由に決める量を数える

隣り合う桁の差が一定の正整数を探したいとする。`1357` は差2、`777` は差0で条件を満たす。数の上限が大きくても、桁列は「桁数」「先頭の桁」「公差」の三つを選べば決まる。

例えば4桁・先頭1・公差2なら `1 → 3 → 5 → 7` と生成する。次の桁が0から9の外へ出たら、その候補は使えない。先頭は1から9、公差は2桁以上なら必ず−9から9の範囲なので、最大桁数を $$D$$ とするとパラメータの組は高々 $$9\times19\times D$$ 通りしかない。1桁の数は公差によらず同じになるため、個数を数えるなら重複を除くか別扱いにする。

[ABC234 E](/problems/abc234-e/)ではこの表現から、下限以上の候補の最小値を選べる。必要なのは、どの合法な数もこのパラメータで生成されることと、生成された候補を桁・範囲の条件で検査することである。「少し先まで試したら見つかりそう」という経験的な打ち切りとは根拠が異なる。

### 小さい集合なら、採用・不採用をそのまま表す

$$n$$ 個の要素から部分集合を選ぶとき、各要素には選ぶ・選ばないの2通りがある。位置を $$0,1,\ldots,n-1$$ とし、整数 $$s$$ の $$i$$ 番目のbitが1なら要素 $$i$$ を選ぶ、と決めれば、$$0\leq s<2^n$$ とすべての部分集合が一対一に対応する。

例えば要素 `a, b, c` では、二進表記 `101` は `a, c`、`000` は空集合、`111` は全要素を表す。条件に合う集合を数えるなら、各maskを一度ずつ調べれば重複はない。必須要素のmaskを $$R$$ とすると、すべてを含む条件は $$(s\mathbin{\&}R)=R$$ である。

集合を表せても、合法性の判定は別に必要になる。[ABC219 E](/problems/abc219-e/)では小さい盤面の内側にする領域を選ぶが、必須の村を含むだけでは足りない。内側が分断されていないか、囲まれた穴がないかを確かめる必要がある。候補生成と判定を分けると、列挙から何が保証され、何を後から検査するのかが明確になる。

集合の和はOR、交差はANDで計算でき、1のbit数を数えれば要素数が得られる。例えば全体集合が4要素なら、mask `1011` と `1101` の交差は `1001` で、共通要素は位置0と3の二つである。複数集合の共通部分を求めるなら、初めに全要素のbitが1のmaskを置き、各集合とのANDを取る。初期値を0にすると、どの集合を読んでも空集合のままになる。

条件集合が $$m$$ 個あり、それぞれを選ぶ・選ばない全組合せについて共通部分を評価するなら、選択maskは $$2^m$$ 通り。一候補で最大 $$m$$ 回のANDを行うので、各集合が機械語一つに収まる場合は $$O(m2^m)$$ 時間で評価できる。集合の要素数と、選ぶ集合の個数は異なる列挙軸である。要素数が語長を超えるなら、複数語にまたがるANDの費用も加える。全bitのmaskを作るshiftが整数型の幅を超えないことも確かめる。

全maskを走査して各要素を調べるなら $$O(n2^n)$$ 時間を使う。$$n=20$$ の $$2^n$$ は約100万だが、$$n=40$$ なら約1兆になる。候補の表現が簡潔でも、候補数そのものが減るわけではない。

### 選択数が決まっているなら、必要な組だけ作る

$$N$$ 個からちょうど $$K$$ 個を選ぶ候補は $$\binom NK$$ 通りであり、全部分集合 $$2^N$$ 通りとは違う。選んだ添字を昇順 $$i_1<\cdots<i_K$$ に固定すれば、同じ集合の選択順による重複も避けられる。

次の添字を選ぶ再帰では、残り $$r$$ 個を選ぶ必要があるなら、後ろに少なくとも $$r-1$$ 個残る位置までしか試さない。これにより、完成できない枝を作らず、各完成候補へ至る途中状態の数も深さを掛けて評価できる。単に「完成候補が少ない」と言うだけでは、無駄な途中探索が小さい保証にはならない。

[ABC386 E](/problems/abc386-e/)では $$\binom NK\leq10^6$$ が保証される。$$K$$ が $$N$$ に近い場合は、選ばない側の $$r=N-K$$ 個を列挙すると深さを減らせる。全要素のXORを $$X$$、選ばない要素のXORを $$Y$$ とすれば、選んだ側は $$X\mathbin{\mathrm{xor}}Y$$。自分自身とのXORが0になるためである。空の補集合では $$Y=0$$ とする。

一般に $$r=\min(K,N-K)$$ を使い、各組を $$O(r)$$ で作って評価する方法なら、全体は入力と全XORの計算も含め $$O(N+(r+1)\binom Nr)$$ 時間になる。$$r=0$$ でも入力の走査と一候補の処理は残る。

### 成功するまでの失敗回数を数える

候補全体が多くても、同じ分類が二度現れれば目的を達成できる探索がある。[ABC260 F](/problems/abc260-f/)では、二部グラフの小さい側から異なる二頂点 $$x,y$$ を選び、両方につながる大きい側の頂点を探す。同じ組 $$\{x,y\}$$ に対して二つの頂点 $$u,v$$ が見つかれば、$$u\to x\to v\to y\to u$$ が長さ4のサイクルになる。

小さい側が $$T$$ 頂点なら組は $$\binom T2$$ 種類。大きい側の頂点を順に見て、その隣接頂点の異なる組を列挙し、初出の持ち主を保存する。既に持ち主がいる組が現れたら、その場で答えを出して終了する。

例えば小さい側が `a, b, c` なら分類は `ab, ac, bc` の3種類である。大きい側の頂点が何個あっても、4回目の組の処理までには、いずれかが重複する。したがって成功前の組処理は高々 $$\binom T2+1$$ 回。全頂点の隣接組数を足した上界が大きくても、実行するのはそのすべてではない。

この証明が使えるのは、重複を発見した時点で停止してよい要求だからである。サイクルを全部列挙したいなら、同じ上界は使えない。また、組を作らない頂点の走査、入力、表の初期化も消えない。大きい側を $$S$$ 頂点、辺数を $$M$$ とし、密な表を使えば、全体で $$O(S+M+T^2)$$ 時間・空間を要する。

## 成立条件と計算量

まず、すべての合法な解が生成される理由を示す。最適化では同じ解を複数回評価しても最小値・最大値は変わらないが、個数を数えるなら一意な生成か重複除去が必要である。候補を減らすための制限は、単に自然そうだからではなく、解を失わない理由を持たせる。

次に、生成・判定・集計の全費用を数える。上の桁列の例では、パラメータが $$O(D)$$ 通りで、一候補を最大 $$D$$ 桁かけて作るなら $$O(D^2)$$ 時間。候補を一つずつ評価すれば、出力に不要な候補一覧をすべて保存する必要はない。

探索の打ち切りや枝刈りには、別の証明が要る。失敗回数が有限種類への初回登録に対応するのか、各途中状態が少数の完成候補へ課金できるのかを具体化しよう。乱数例で速かったことを最悪計算量の説明にしない。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

ループ、再帰、bit演算、集合、基本的な探索と計算量を前提とする。本単元では候補の総数または停止までの回数を直接抑える。候補を二群に分けて照合する[半分全列挙](/learn/modeling/meet-in-the-middle/)、同形の小問題を再帰的に解く[分割統治](/learn/modeling/recursive-divide-and-conquer/)は別単元で扱う。

問題一覧の前半では、値域からパラメータへ変える、少数の選択だけを列挙する、という表現の選び方を練習する。ABC260 Fでは停止条件が回数の上界を作る。何を一候補と呼ぶかを決めてから、候補数と評価費用を分けて考えてほしい。

### このUnitでは扱わないもの

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 問題一覧

- [ABC234 E「Arithmetic Number」](https://atcoder.jp/contests/abc234/tasks/abc234_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC254 E「Small d and k」](https://atcoder.jp/contests/abc254/tasks/abc254_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。）。
- [ABC272 E「Add and Mex」](https://atcoder.jp/contests/abc272/tasks/abc272_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC386 E「Maximize XOR」](https://atcoder.jp/contests/abc386/tasks/abc386_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC219 E「Moat」](https://atcoder.jp/contests/abc219/tasks/abc219_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC312 E「Tangency of Cuboids」](https://atcoder.jp/contests/abc312/tasks/abc312_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC260 F「Find 4-cycle」](https://atcoder.jp/contests/abc260/tasks/abc260_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC442 G「Lightweight Knapsack」](https://atcoder.jp/contests/abc442/tasks/abc442_g) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。）。 非空の行集合Sをbitmaskで列挙し、共通文字数c(S)を求める。和集合の大きさはΣ_{S≠∅}(−1)^{|S|+1}c(S)^L。重複を交互に打ち消す包除原理が主題であり、subset間のDP遷移はない。
- [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e) — 主題: [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC290 G「Edge Elimination」](https://atcoder.jp/contests/abc290/tasks/abc290_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC302 G「Sort from 1 to 4」](https://atcoder.jp/contests/abc302/tasks/abc302_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)（terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [二変数の凸区分線形整数最適化](/learn/geometry-optimization/two-variable-convex-lattice-optimization/)（二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。）。追加で学ぶ技能: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。

## 根拠

- [ABC234 E 公式解説](https://atcoder.jp/contests/abc234/editorial/3225)
- [ABC260 F 公式解説](https://atcoder.jp/contests/abc260/editorial/4437)
- [ABC386 E 公式解説](https://atcoder.jp/contests/abc386/editorial/11697)

- [ABC219 E 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_e)
- [ABC219 E 公式解説](https://atcoder.jp/contests/abc219/editorial/2652)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC223 E 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 E 公式解説](https://atcoder.jp/contests/abc223/editorial/2781)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-bounded-enumeration`
