---
title: "同値な状態を正規化する"
description: "「同値な状態を正規化する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 3
---

# 同値な状態を正規化する

習得対象の目安: **水色（1200–1599）**。対称性で同じ候補をまとめ、代表だけを残してよい理由を示せるようにする。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 状態・配置の正規化

対称操作で同値な状態を一意な標準形へ写し、重複した探索・数え上げを除く。

### 習得する技能

- 鏡映対称な文字列を自由な前半で一意に表し、辞書順上限以下の個数を前半prefixの基数値と、等号境界の完成文字列一候補との比較で求められる。
- 対称操作で同値な状態の標準形と不変量を選べる。

## 考え方

解の値と将来の選択肢を変えない変形によって、複数の状態を一つの代表へ写す。並べ替え、平行移動、共通因子の除去など、入力に残る自由度を先に取り除くと本質的な変数が見える。


鏡映回文の計数では長さN、文字種数b、前半長h=ceil(N/2)とする。各回文は前半Tから一意に完成する。上限文字列SについてS[0:h]をb進数として読んだ値Vは、それより小さい前半の数である。それらを完成した回文はSより小さい。一方、前半が等しい候補は一つだけなので、その鏡映完成PがP≤Sなら1を加える。前半が大きい候補は全体でも大きいから不要。答えはV+[P≤S]、O(N)で計算できる。対称性を消した代表と元の対象が一対一になる例であり、軌道のサイズが一定という仮定で割っているのではない。

### 局所変換を高速な合成へまとめる

列が外部の値Tへ作用する場合は、全Tへの関数が同じことを同値の定義にできる。照会しやすい代表列の条件を選び、隣接二要素の変換が全Tへの作用を保存すると示す。ただし定数時間の局所変換を繰り返すだけでは、正規化全体が線形になるとは限らない。

ABC427 Gでは良い列P,Qのマージに、P側cursor l、Q側cursor r、確定prefix末尾hを使う。長さLの未処理P[j]の実効値をmax(P[j]−rB,h+(j−l+1)A)にまとめ、Q側の次の値をQ[r]−(L−l)Aとして比較する。局所変換をこの二補正へまとめる不変量が、左向き挿入の二乗回数をなくす。各反復がどちらかのcursorを一つ進めることから、初めて一マージO(|P|+|Q|)と分かる。その上で、同長ブロックの合成を二進カウンタとして償却できる。

未知問でも、作用の同値、代表条件、合成中の不変量、全反復数を分けて確認する。代表化して速くなる照会だけでなく、その代表を作る総費用まで設計する。

### 代表と元の対象の対応を固定する

代表化は「答えが同じ」「最適値が同じ」「種類の集合が一対一」のどれを保つかで条件が違う。distinctな部分列を数えるなら、同じ値列の最早の埋込みを代表にできる。前の代表位置jより右にある最初の一致位置を選ぶと、任意の別の埋込みの対応位置以下であることを帰納的に示せるため、存在する値列を失わない。各値列へ唯一の代表を割り当てることで、位置の重複を除ける。

[ABC446 G](https://atcoder.jp/contests/abc446/editorial/16371)では各runの末尾だけを残すが、runを最早のx個のxとして復元できる条件を確認する必要がある。空列の末尾0と、0回目の出現を表すJ(x,0)=−1は異なる役割を持つ。開区間で遷移元を表すなら、最初のrunで初期状態0を含むことを最小入力で確かめる。非空末尾の総和を答えにした後、さらに空列を引かない。

[ABC452 G](https://atcoder.jp/contests/abc452/editorial/18406)では元のrunを短い記号列へ写すが、保つのは出現位置の個数ではなく値列の種類である。長いrunから同じ記号を二つ作っても、展開した値列は同じになる。対応の単位を先に定めれば、変換後にもdistinct substringの重複除去が必要だと分かる。

同値な操作の圧縮でも、残した特徴だけから合法な操作を復元できるかを点検する。[ABC399 E](https://atcoder.jp/contests/abc399/editorial/12564)の全置換では、目的地が異なる文字群は合流後に分離できない。純cycleには退避が要るが、流入木付きcycleでは同じ目的地の二群を合流させて空きを作れる。cycleという分類名だけで費用を一律に加えず、圧縮した各型に対する合法な操作列へ戻す。

## 成立条件と計算量

同じ代表へ写った二状態が同じ答えを持つこと、必要なら元の解へ戻せることを示す。正規化自体のsortや走査費用を数える。最適値だけの同値と、解の個数まで保存する同値は違う。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [群作用・軌道数え上げ](/learn/combinatorics-algebra/orbit-counting/)。

対称な状態を同一視できると探索やDPの状態数を減らせるため、同値類の標準形と不変量を先に定める。

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

- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)
- [ABC219 F 公式解説](https://atcoder.jp/contests/abc219/editorial/2654)
- [ABC219 F 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_f)
- [ABC232 H 公式解説](https://atcoder.jp/contests/abc232/editorial/3140)
- [ABC232 H 公式問題文](https://atcoder.jp/contests/abc232/tasks/abc232_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-normalization`
