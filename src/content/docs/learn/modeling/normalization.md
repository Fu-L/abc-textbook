---
title: '同値な状態を正規化する'
description: '「同値な状態を正規化する」で学ぶ概念と、基礎から応用へ進む問題一覧。'
draft: false
headingAliases:
  状態配置の正規化: 集合の一致を同じ並びの一致へ変える
  局所変換を高速な合成へまとめる: 代表を保つ操作の費用も設計する
  代表と元の対象の対応を固定する: 重複する埋込みから一つだけを選ぶ
sidebar:
  order: 3
---

# 同値な状態を正規化する

習得対象の目安:
**水色（1200–1599）**。対称性で同じ候補をまとめ、代表だけを残してよい理由を示せるようにする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 概要

答えに影響しない違いを取り除き、同じ対象を一つの表現へそろえる。これを正規化という。候補を減らすだけでなく、比較や数え上げを「代表が一致するか」という簡単な問いへ変えられる。

最初に決めるべきことは、どの違いを無視してよいかである。見た目が似ていることではなく、問題で問われる値や許される操作が保たれることを根拠にする。

## 考え方

### 集合の一致を、同じ並びの一致へ変える

列 `8, 3, 8, 5` と `5, 8, 3`
に含まれる値の集合を比較したい。列のままでは長さも順番も違う。しかし、求めるのは「各値が一度でも現れるか」であり、順番と重複回数は答えに使わない。

各列を昇順に並べ、重複を取り除くと、どちらも `3, 5, 8` になる。この変換を $$C$$ と書くと、元の列
$$X,Y$$ について

$$
X\text{ と }Y\text{ の値の集合が等しい}
\quad\Longleftrightarrow\quad C(X)=C(Y)
$$

が成り立つ。右から左は、残った値がそのまま元の集合の全要素だからである。左から右は、同じ集合を昇順に並べた列が一意だからである。この両方向が、代表による比較の根拠になる。

「集合」を「多重集合」に変えたら、重複を除いてはいけない。`3, 3, 8` と `3, 8, 8`
は集合としては等しいが、多重集合としては違う。問いが変わると、保存すべき情報も変わる。

### 同じ代表に集まる範囲を定める

一般には、無視してよい違いだけを持つ対象どうしを「同値」と呼ぶ。各対象を代表へ写す正規化では、同値な対象を同じ代表へ写し、異なる同値類を混ぜないようにする。変換を繰り返しても代表が変わらない
$$C(C(X))=C(X)$$
も、実装で確かめやすい性質である。ただし、この性質だけで正しい正規化とはいえない。すべてを空列へ写す変換も満たしてしまう。

座標なら、全点を同じだけ平行移動しても相対位置が保たれる場合がある。点集合から辞書順最小の点を選び、それを原点へ移せば、平行移動だけ異なる集合は同じ代表になる。元から決まった原点までの距離を問う問題では、この変換は使えない。

回転も同一視したいなら、許される各回転を試し、それぞれで平行移動を正規化したうえで、最小の表現を選ぶ方法がある。代表選択を一意にしなければ、同じ図形でも別の表現が残る。「都合のよい向きにする」と「一意な代表を作る」は区別しよう。前者だけでも場合分けの削減には役立つが、後者を要する重複除去の証明には足りない。

### 問いが限られていれば、代表をさらに短くできる

集合を毎回並べ直すのは高い。[ABC250 E](/problems/abc250-e/)では、二つの列の接頭辞に含まれる値の集合を何度も比較する。ここでは、一方の列
$$A$$ に初めて現れる順に、各値へ番号 $$1,2,\ldots$$ を割り当てるとよい。

例えば $$A=(8,3,8,5)$$ なら、値 `8, 3, 5` の番号はそれぞれ `1, 2, 3`。$$A$$
のどの接頭辞の集合も、番号で見ると必ず $$\{1,\ldots,k\}$$
の形になる。任意の集合との比較を、番号が連続してそろっているかという問いへ変えられた。

もう一方の接頭辞について、異なる番号の個数を $$c$$、最大番号を $$m$$
とする。すべての番号が正で、$$A$$ にない値を含まないなら、集合が $$\{1,\ldots,k\}$$ である条件は
$$c=m=k$$ である。実際、$$1$$ 以上 $$k$$ 以下の異なる整数が $$k$$
個あれば、そのすべてがそろう。$$A$$ にない値が現れた接頭辞は別途不一致とする。

例えば番号集合 $$\{1,3\}$$
は、個数2、最大3なので一致しない。最大番号だけでは穴を見落とし、個数だけでは $$\{1,2\}$$ と
$$\{1,3\}$$
を区別できない。短い要約が使えるのは、比較相手が連続した番号集合だと分かっているためである。任意の集合どうしを個数と最大値だけで比較する方法ではない。

### 自由に選ぶ部分だけを残す

対称な対象には、残りを自動で復元できる部分がある。長さ5の回文なら、前半3文字 `ABC` を選ぶと、全体は
`ABCBA` に決まる。長さ $$N$$ の回文は、最初の $$\lceil N/2\rceil$$ 文字と一対一に対応する。

[ABC242 E](/problems/abc242-e/)では、辞書順の上限もある。前半が上限の前半より小さければ、完成後の後半によらず条件を満たす。前半が等しい場合だけ、反転して完成させた全体を上限と比較する。例えば上限
`ABCAA` に対して前半 `ABC` からできる `ABCBA` は大きすぎる。前半だけの比較で等号を受理すると誤る。

ここでは異なる回文を合併するのではなく、同じ対象をより少ない自由変数で表している。正規化を考えるときは、「同じものをまとめる」のか「一対象を短く表す」のかも意識すると、数え上げで何を一回ずつ数えているかが明確になる。

### 重複する埋込みから、一つだけを選ぶ

部分列では、同じ値列を異なる位置から取り出せる。`A B A B` から値列 `A B`
を作る位置は複数あるが、最も左から順に選べば位置 `(1, 2)`
が代表になる。値列が固定されているとして、先頭文字の最初の出現を選び、次の文字は直前に選んだ位置より右の最初の出現を選ぶ。

任意の別の埋込みと比較すると、この貪欲な代表の各位置は対応する位置以下になる。先頭では明らかであり、一つ前までそうなら、別の埋込みの次の位置は代表にとっても選択可能だからである。したがって、存在する値列を代表の選択によって失うことはない。同時に、選び方が確定的なので一値列に一代表だけが対応する。

[ABC446 G](/problems/abc446-g/)のように位置ではなく値列の種類を数える問題では、この対応から重複のない遷移条件を作る。位置の選び方を数える問題へ流用すると、必要な多重度を消してしまう。

### 代表を保つ操作の費用も設計する

正規化した二つの対象を結合するとき、結合のたびに先頭から作り直す方法は高くつくことがある。例えば長さ1の列を順に追加して、毎回長さ
$$1,2,\ldots,N$$ の代表を作り直せば、合計は $$O(N^2)$$ になる。

[ABC427 G](/problems/abc427-g/)のように列が外部の値へ作用する場合には、全入力値への作用が等しいことを保ちつつ代表を合成する。局所変形の同値性を示した後、未処理部分への補正を少数の値にまとめ、どの要素が次に確定するかを決める。二列のcursorが各要素を一度だけ通過するなら、一回の合成は長さの和で抑えられる。さらに均等な大きさの列を段階的に合成すれば、各要素が通る合成回数も対数回になる。代表が存在する証明と、代表を効率よく更新する証明は別に用意しよう。

## 成立条件と計算量

比較では、代表の一致と本来の一致が同値であることを示す。到達可能性や最適値を扱うなら、許された操作と費用も保存する必要がある。不変量が一致することは必要条件にとどまる場合があるので、それだけで同じ状態へ移れると結論しない。正規化した代表まで実際に変形できることを示せば、十分性の証明にも使える。

数え上げでは同値類の大きさに注意する。長さ4の二値列を回転で同一視すると、`0000`
の異なる回転は1個、`0101` は2個、`0001`
は4個である。元の列数を一律に4で割っても同値類の数にはならない。一意な代表を生成するか、各類の重複数を正しく扱う必要がある。

長さ $$N$$ の列をsort-uniqueする方法は $$O(N\log N)$$ 時間、コピーを用いるなら入力込みで $$O(N)$$
空間。既に作った代表の比較にも、その長さに応じた時間がかかる。ABC250 Eの番号付けは順序付き辞書なら
$$O(N\log N)$$、接頭辞の要約は番号配列で $$O(N)$$、各質問は $$O(1)$$ 時間で、入力と要約の保存に
$$O(N)$$ 空間を使う。代表の生成が元の探索と同じほど高ければ、高速化にはならない。

### 習得する技能

- 鏡映対称な文字列を自由な前半で一意に表し、辞書順上限以下の個数を前半prefixの基数値と、等号境界の完成文字列一候補との比較で求められる。
- 対称操作で同値な状態の標準形と不変量を選べる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。

集合・多重集合、辞書順、並べ替えを前提とする。本単元では、同値な対象の代表、対称性による場合分けの削減、自由変数による一意な表現を学ぶ。大小関係だけを保存する添字化は[座標圧縮](/learn/modeling/coordinate-compression/)で扱う。

問題一覧では、回文の前半、接頭辞集合の番号付け、座標の対称性と順に、何を保存するかを確かめてほしい。後半のABC219
Fでは、反復移動で重なり得る点を同じ軌道へ分類する。代表を作った後に、同じ類の内部へどんな情報を残すかまでが解法になる。

### このUnitでは扱わないもの

- 交換論による貪欲順の証明。

## 問題一覧

- [ABC462 E「Alternating Costs」](https://atcoder.jp/contests/abc462/tasks/abc462_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [一次元凸・単峰最適化](/learn/geometry-optimization/basic-convex-optimization/)（差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC242 E「(∀x∀)」](https://atcoder.jp/contests/abc242/tasks/abc242_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（鏡映対称な文字列を自由な前半で一意に表し、辞書順上限以下の個数を前半prefixの基数値と、等号境界の完成文字列一候補との比較で求められる。）。
- [ABC250 E「Prefix Equality」](https://atcoder.jp/contests/abc250/tasks/abc250_e) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC296 F「Simultaneous Swap」](https://atcoder.jp/contests/abc296/tasks/abc296_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC302 G「Sort from 1 to 4」](https://atcoder.jp/contests/abc302/tasks/abc302_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 各値列の辞書順最小添字列だけを数える正準化から、直前位置の開区間L_p<j<R_pを導く。dp[p]=Σ dp[j]をrange sumとpoint addへ写し、O(N²)をO(N log N)へ減らす。
- [ABC463 F「Senshuraku」](https://atcoder.jp/contests/abc463/tasks/abc463_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC313 G「Redistribution of Piles」](https://atcoder.jp/contests/abc313/tasks/abc313_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。
- [ABC219 F「Cleaning Robot」](https://atcoder.jp/contests/abc219/tasks/abc219_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC427 G「Takahashi's Expectation 2」](https://atcoder.jp/contests/abc427/tasks/abc427_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC382 G「Tile Distance 3」](https://atcoder.jp/contests/abc382/tasks/abc382_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC232 H「King's Tour」](https://atcoder.jp/contests/abc232/tasks/abc232_h) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC278 G「Generalized Subtraction Game」](https://atcoder.jp/contests/abc278/tasks/abc278_g) — 主題: [ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)（後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。）。既習技能: [対話protocolを守って情報を取得する](/learn/modeling/interactive-protocol/)（judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC284 G「Only Once」](https://atcoder.jp/contests/abc284/tasks/abc284_g) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC301 F「Anti-DDoS」](https://atcoder.jp/contests/abc301/tasks/abc301_f) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC411 G「Count Cycles」](https://atcoder.jp/contests/abc411/tasks/abc411_g) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC425 F「Inserting Process」](https://atcoder.jp/contests/abc425/tasks/abc425_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。

## 根拠

- [ABC242 E 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_e)・[公式解説](https://atcoder.jp/contests/abc242/editorial/3527)
  — 回文の前半による一意な表現。
- [ABC250 E 公式問題文](https://atcoder.jp/contests/abc250/tasks/abc250_e)・[公式解説](https://atcoder.jp/contests/abc250/editorial/3906)
  — 初出順による接頭辞集合の表現。本文の番号と最大値による判定は、この条件から独立に導いた。
- [ABC446 G 公式解説](https://atcoder.jp/contests/abc446/editorial/16371)
  — 値列の貪欲な添字列を代表とする対応。
- [ABC427 G 公式解説](https://atcoder.jp/contests/abc427/editorial/14187)
  — 作用を保存する列の合成と総費用。


- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC219 F 公式解説](https://atcoder.jp/contests/abc219/editorial/2654)
- [ABC219 F 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_f)
- [ABC232 H 公式解説](https://atcoder.jp/contests/abc232/editorial/3140)
- [ABC232 H 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-normalization`
