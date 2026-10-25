---
title: "列・subsequence DP"
description: "「列・subsequence DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 64
---

# 列・subsequence DP

習得対象の目安: **緑色（800–1199）**。選ぶ・選ばない遷移と最後の要素を状態にし、同じ要素の重複利用を避ける。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 編集距離・sequence alignment DP

二つの列prefixを状態にし、一致・挿入・削除・置換の局所遷移から最小編集費用を求める。閾値がある場合は長さ差の下界で対角帯へ状態を絞る。

### 列・subsequence DP

列のprefixや最後に選んだ要素を状態にし、順序を保つ選択を組み立てる。

左から処理し、未来の延長可能性が等しい履歴を同じ状態へまとめる。ABC327 Eでは、選択個数ごとにレートの式の分子を最大化する。末尾へ成績を追加したときの重みの変化を一つの更新式にまとめ、選ぶ・選ばないを比較する。

最後の位置、選択数、差分など、未来の可否や報酬に影響する情報を残す。LISの長さ別最小末尾への圧縮は、この一般の状態設計に支配関係を追加して導く。

### 習得する技能

- 二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から|i-j|≤Kの対角帯だけを計算できる。
- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

## 考え方

処理済みprefixの答えを、次の一要素を選ぶ・選ばないという遷移で更新する。最後の値や選択数など、次の選択に必要な情報を状態へ加える。

### 選択個数を固定し、重み付きの分子を最大化する

[ABC327 E「Maximize Rating」](https://atcoder.jp/contests/abc327/tasks/abc327_e)では、成績を元の順序を保って一つ以上選ぶ。選んだ個数を
$$j$$、選んだ成績を古い順に $$Q_1,\ldots,Q_j$$ とすると、レートは次の式で決まる。

$$
R=\frac{\sum_{r=1}^{j}0.9^{j-r}Q_r}{\sum_{r=1}^{j}0.9^{j-r}}-\frac{1200}{\sqrt{j}}
$$

選ぶ個数が変わると、分母も罰則の項も変わる。まず $$j$$
を固定すると、この二つは選ぶ成績によらず、分母は正なので、分子が最大の選び方でレートも最大になる。そこでDPにはレートそのものではなく、**選択個数ごとの分子の最大値**を持つ。

全成績数を $$N$$、元の列の $$i$$ 番目の成績を $$P_i$$ とする。$$dp[i][j]$$ は「先頭 $$i$$
個を処理し、その中から順序を保ってちょうど $$j$$ 個選んだときの分子の最大値」と定義する。$$i$$
は処理済みの個数、$$j$$ は選んだ個数であり、選ばない成績があれば両者は異なる。空の選択の分子は $$0$$
とし、初期値を $$dp[0][0]=0$$、それ以外を到達不能を表す $$-\infty$$ とする。

成績 $$P_i$$ を選ばなければ、分子は $$dp[i-1][j]$$ のままである。選ぶ場合は、すでに選んだ $$j-1$$
個の末尾へ追加する。例えば一つの成績 $$1000$$ の後ろに $$1200$$ を加えると、分子は $$1000$$ から
$$0.9\times1000+1200=2100$$
になる。古い成績はすべて「選んだ列の末尾からの距離」が一つ増え、重みが一律に $$0.9$$
倍される。新しい成績の重みは $$1$$ なので、分子全体の更新は「旧分子を $$0.9$$ 倍し、$$P_i$$
を足す」でよい。

したがって、$$1\leq j\leq i\leq N$$ について次の二候補を比較する。

$$
dp[i][j]=\max\bigl(dp[i-1][j],\;0.9\,dp[i-1][j-1]+P_i\bigr)
$$

常に $$dp[i][0]=0$$、$$j>i$$
は到達不能とする。到達不能な状態からは選ぶ遷移を行わない。任意の選び方は $$P_i$$
を選ぶか選ばないかのどちらかに分かれるので、この二候補で漏れがない。また、同じ選択個数なら大きな分子ほど末尾追加後も大きい。倍率
$$0.9$$ が正なので大小関係が保たれ、各状態で最大値だけを残せる。

### 降順に更新して、同じ成績の再利用を防ぐ

前の行しか参照しないので、配列を一次元の $$dp[j]$$ へ圧縮できる。最初は $$dp[0]=0$$、他を
$$-\infty$$ とし、$$P_i$$ を読むたびに $$j=i,i-1,\ldots,1$$ の降順で次の更新を行う。

$$
dp[j]\leftarrow\max\bigl(dp[j],\;0.9\,dp[j-1]+P_i\bigr)
$$

更新前の $$dp[j]$$ を候補に残すことが「今回は選ばない」に当たる。降順なら、参照する $$dp[j-1]$$
はまだ今回の成績で更新されておらず、必ず先頭 $$i-1$$ 個からの選択を表す。

二成績 $$P=(1000,1200)$$ で追うと、配列は次の順に変わる。$$dp[0]$$ は常に $$0$$ のままとする。

| 処理・更新箇所          | $$dp[1]$$   | $$dp[2]$$   |
| ----------------------- | ----------- | ----------- |
| 初期状態                | $$-\infty$$ | $$-\infty$$ |
| $$P_1=1000$$ で $$j=1$$ | $$1000$$    | $$-\infty$$ |
| $$P_2=1200$$ で $$j=2$$ | $$1000$$    | $$2100$$    |
| 同じ $$P_2$$ で $$j=1$$ | $$1200$$    | $$2100$$    |

二成績目では、まず旧 $$dp[1]=1000$$ から $$dp[2]=2100$$ を作る。その後、$$dp[1]$$
は「選ばない」候補の $$1000$$ と「選ぶ」候補の $$1200$$ を比較して $$1200$$
になる。もし昇順に更新すると、先に更新した $$dp[1]=1200$$ を読んで $$dp[2]=0.9\times1200+1200=2280$$
としてしまう。これは二成績目を二度選んだ不正な値である。二つの配列で旧行と新行を分ける場合は、この混同は起こらない。

全成績を処理したら、選択個数ごとの分母 $$W_j$$ と罰則を戻す。分母は $$W_0=0$$、$$W_j=0.9W_{j-1}+1$$
で順に求められ、答えは次の最大値になる。

$$
\max_{1\leq j\leq N}\left(\frac{dp[j]}{W_j}-\frac{1200}{\sqrt{j}}\right)
$$

小例では、一つ選ぶと $$1200-1200=0$$、二つ選ぶと $$2100/1.9-1200/\sqrt{2}\simeq256.73502$$
となり、後者を採用する。空の選択はDPの出発点にだけ使い、答えには含めない。最大レートが負になる入力もあるので、答えの初期値を
$$0$$ にしない。

ここで選択個数だけを添字にできたのは、処理済み位置を走査で管理し、次に選べる成績が過去の末尾に依存せず、分子の大小関係も末尾追加で保たれるためである。一般の部分列DPでは、直前の値や位置、公差などが次の選択を制限することもある。その場合は必要な情報を状態に残す。末尾の支配関係を使う圧縮は[LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)、許される末尾値の範囲から遷移を集約する方法は[値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)へ進む。

### 二つのprefixを扱う編集距離と帯DP

二列prefixの編集距離は[グリッド・多次元表DP](/learn/dynamic-programming/dp-grid-table/)の三つの最後の操作と同じ漸化式で求められる。ここでの
$$i,j$$ は二つの列の処理済みの長さであり、上の選択個数DPとは添字の意味が異なる。

二列の長さを $$N,M$$、判定する距離の上限を $$K$$ とする。単位編集費用で距離 $$K$$
以下だけを判定する場合、状態 $$(i,j)$$ への費用は長さ差 $$|i-j|$$ 以上なので、$$|i-j|>K$$
を捨ててよい。各行で $$\max(0,i-K)\leq j\leq\min(M,i+K)$$ だけ計算し、帯外を $$\infty$$、帯内の値を
$$K+1$$ で打ち切る。距離 $$K$$ 以下の実際の編集列は途中でも高々 $$K$$
の費用しか使わず帯外へ出られないため、この制限で有効解を落とさない。$$|N-M|>K$$
なら即不可能で、帯DPは $$O(N(K+1))$$ 時間、行の再利用で $$O(K+1)$$ 空間となる。

空のprefix同士の距離は
$$0$$、片方だけが空なら距離はもう片方の長さになる。この基底も帯内だけ設定し、行を再利用するときは帯外の古い値を遷移元に使わない。

## 成立条件と計算量

段数 $$N$$、各段 $$S$$ 状態・各状態から $$D$$ 遷移なら
$$O(NSD)$$。同じ要素から連続して二回遷移しない更新順が必要。支配関係による圧縮には、残す状態がすべての未来に対して劣らないことの証明を付ける。

ABC327 Eでは $$i$$ 番目の成績につき $$i$$ 個の選択数を更新するため、合計 $$O(N^2)$$
時間となる。一次元配列と分母の計算に必要な領域は $$O(N)$$。編集距離の帯DPでは、閾値 $$K$$
が各行の計算幅を制限する。選択数の軸を降順に更新することは領域の削減であり、この帯による状態数の削減とは区別する。

概念上の親: [列・編集距離・区間合成DP](/learn/dynamic-programming/dp-sequence-interval/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)、[値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)、[半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)。

DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 下位単元

- [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/) — 水色
- [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/) — 水色

## 問題一覧

- [ABC327 E「Maximize Rating」](https://atcoder.jp/contests/abc327/tasks/abc327_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC362 E「Count Arithmetic Subsequences」](https://atcoder.jp/contests/abc362/tasks/abc362_e) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC315 F「Shortcuts」](https://atcoder.jp/contests/abc315/tasks/abc315_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から|i-j|≤Kの対角帯だけを計算できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 同じ文字の直前出現と隣接禁止から、末尾追加が重複しない直前状態の区間[L_i,R_i]を導く。その後dp[i]=Σ_{j=L_i}^{R_i}dp[j]をprefix差へ変形する。境界の正当化が計数の核心。
- [ABC238 F「Two Exams」](https://atcoder.jp/contests/abc238/tasks/abc238_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC299 F「Square Subsequence」](https://atcoder.jp/contests/abc299/tasks/abc299_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC225 F「String Cards」](https://atcoder.jp/contests/abc225/tasks/abc225_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC246 Ex「01? Queries」](https://atcoder.jp/contests/abc246/tasks/abc246_h) — 主題: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。

## 根拠

- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC225 F 公式解説](https://atcoder.jp/contests/abc225/editorial/2833)
- [ABC225 F 公式問題文](https://atcoder.jp/contests/abc225/tasks/abc225_f)
- [ABC237 F 公式解説](https://atcoder.jp/contests/abc237/editorial/3320)
- [ABC237 F 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_f)
- [ABC327 E 公式解説](https://atcoder.jp/contests/abc327/editorial/7564)
- [ABC327 E 公式問題文](https://atcoder.jp/contests/abc327/tasks/abc327_e)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-sequence`
