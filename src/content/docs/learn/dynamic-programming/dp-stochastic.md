---
title: "確率過程・期待値DP"
description: "「確率過程・期待値DP」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 75
---

# 確率過程・期待値DP

習得対象の目安: **水色（1200–1599）**。一段先で条件分けし、確率・期待値の式と自己ループの移項を扱う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 確率・期待値DP

確率遷移に対する期待値・分布・到達確率の再帰式を解く。

確率DPでは、分布・到達確率、期待費用、観測後の行動最適化を区別する。以下ではABC300 E、ABC263 E、ABC266 Eの式を用いて、その違いを示す。

ABC300 Eでは初期値1に公平なサイコロの目を掛け、Nへの到達確率を求める。目1を何回引いても成功事象は変わらない。次に1以外が出るまで待つと、2〜6のどの目も確率1/5である。待機が永遠に続く確率は0。

前向きにはp[1]=1とし、値vから2v,…,6vへ各p[v]/5を配る。Nに達した分を吸収し、Nを越えた分を失敗へ集める。未吸収・成功・失敗の総確率は1のまま。

後ろ向きにはq(N)=1,q(v)=0 (v>N)、q(v)=Σ_{d=2}^6 q(dv)/5。再帰先は真に増え、2,3,5の指数で表せる疎な状態だけをmemo化できる。

期待回数なら一試行の費用1を加えるが、到達確率には加えない。法上では5の逆元を用い、N=1や2,3,5以外の素因数を持つNを確認する。

ABC226 Hは連続分布への発展例。閾値xを固定し、各変数がx以上かの独立Bernoulli分布を成功個数DPで合成する。得た裾確率P(Y≥x)をxについて積分して期待値を得る。確率分布を作る工程と、裾確率から期待値を得る恒等式を分けて理解する。

入力: iからi,…,i+A_iへ等確率で移動し、N到達までの期待試行回数をE_iとする。終端はE_N=0。

一歩解析: E_i=1+(E_i+Σ_{j=i+1}^{i+A_i}E_j)/(A_i+1)。自己項を左へ移すとE_i=(A_i+1+ΣE_j)/A_i。費用1まで自己ループと一緒に消してはいけない。

A_i≥1なのでiを離れるまでの期待時間は有限。離れた後は位置が増えるため、後ろから順に解ける。suffix sumで連続区間の和を取れば全体O(N)。

境界: A_i=1ならE_i=2+E_{i+1}。一般に自己ループ確率p=1なら移項して割れず、正の費用を払う過程の期待時間は無限。

入力: 残りr回まで振れるとき、次の目を見る前の最適期待報酬をV_rとする。最後の1回は必ず採用するのでV_1=3.5。

r≥2では目dを観測してから停止か続行を選ぶ。停止はd、続行は独立な未来の最適値V_{r-1}。従ってV_r=(1/6)Σ_{d=1}^6 max(d,V_{r-1})。

max(E[d],V_{r-1})では、目を観測する前に一律に停止・続行を決めることになり別問題となる。V_2=4.25であり、3.5との差は観測情報の価値を表す。

残り回数が減るので後退帰納で最適性を証明できる。O(N)時間O(1)空間。最後の強制停止、同点でどちらを選んでも値が同じことを確認する。

ABC242 Exでは、異なる区間がk種類集まった段階に分ける。次の新種類までの期待待ち時間はM/(M−k)で、その段階まで被覆が終わっていない確率を掛けて足す。全被覆するk-subset数f(k)を別のDPで求めれば、期待値はΣ_{k=0}^{M−1}(1−f(k)/C(M,k))·M/(M−k)になる。

f(k)の計数は、区間を左端順に処理し、隙間なく覆ったprefixの右端rと選択数kを状態にする走査DPである。区間[L,R]を選ぶならL≤r+1を要求し、右端をmax(r,R)へ更新する。一度隙間を残すと後続の区間では埋められない。二つの独立区間の解を掛け合わせる区間DPではない。

### 習得する技能

- 意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。
- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。
- 状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/)。

状態と遷移を定義できることを前提に、確率遷移から期待値・到達確率の方程式を立てる。

### このUnitでは扱わないもの

- 二人零和ゲームの勝敗・Grundy数。

## 問題一覧

- [ABC263 E「Sugoroku 3」](https://atcoder.jp/contests/abc263/tasks/abc263_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。
- [ABC266 E「Throwing the Die」](https://atcoder.jp/contests/abc266/tasks/abc266_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。
- [ABC275 E「Sugoroku 4」](https://atcoder.jp/contests/abc275/tasks/abc275_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC298 E「Unfair Sugoroku」](https://atcoder.jp/contests/abc298/tasks/abc298_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC300 E「Dice Product 3」](https://atcoder.jp/contests/abc300/tasks/abc300_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC314 E「Roulettes」](https://atcoder.jp/contests/abc314/tasks/abc314_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。
- [ABC323 E「Playlist」](https://atcoder.jp/contests/abc323/tasks/abc323_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC350 E「Toward 0」](https://atcoder.jp/contests/abc350/tasks/abc350_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC360 E「Random Swaps of Balls」](https://atcoder.jp/contests/abc360/tasks/abc360_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC382 E「Expansion Packs」](https://atcoder.jp/contests/abc382/tasks/abc382_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC402 E「Payment Required」](https://atcoder.jp/contests/abc402/tasks/abc402_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC421 E「Yacht」](https://atcoder.jp/contests/abc421/tasks/abc421_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC333 F「Bomb Game 2」](https://atcoder.jp/contests/abc333/tasks/abc333_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。）。 一周後の再訪を等比級数で消去し、new[0]だけ重み付き和で計算する。隣接出力の式を比較するとnew[j+1]=p(new[j]+old[j])となり、一行O(m²)からO(m)へ落ちる。
- [ABC342 F「Black Jack」](https://atcoder.jp/contests/abc342/tasks/abc342_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 dealerの配布先とplayerの継続先は連続するD状態。r[i]=max(q[i],Σ_{j=1}^D r[i+j]/D)の和をsliding更新し、確率分布も差分配布で集約する。最適停止の式を確立してからO(ND)をO(N+D)へ減らす。
- [ABC404 F「Lost and Pound」](https://atcoder.jp/contests/abc404/tasks/abc404_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 総数順の最適方策を証明し、自己loopを移項する。dp_i=(1+Σ_{j>i}A_j dp_j/S)/(1−Σ_{j<i}A_j/S)。prefix Aと降順の重み付きsuffix和で、一状態の全色走査を定数時間へ落とす。
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC450 G「Random Subtraction」](https://atcoder.jp/contests/abc450/tasks/abc450_g) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC226 H「Random Kth Max」](https://atcoder.jp/contests/abc226/tasks/abc226_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC242 Ex「Random Painting」](https://atcoder.jp/contests/abc242/tasks/abc242_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC270 Ex「add 1」](https://atcoder.jp/contests/abc270/tasks/abc270_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC299 Ex「Dice Sum Infinity」](https://atcoder.jp/contests/abc299/tasks/abc299_h) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [線形方程式・rank](/learn/combinatorics-algebra/linear-system-rank/)（制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC239 Ex「Dice Product 2」](https://atcoder.jp/contests/abc239/tasks/abc239_h) — 主題: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。
- [ABC249 Ex「Dye Color」](https://atcoder.jp/contests/abc249/tasks/abc249_h) — 主題: [期待値の頻度圧縮と加法的ポテンシャル](/learn/dynamic-programming/additive-expectation-potential/)（対称な確率過程の期待費用を頻度別関数の和へ分離し、自己ループを含む一段方程式と終端の較正から吸収までの期待費用を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。
- [ABC271 G「Access Counter」](https://atcoder.jp/contests/abc271/tasks/abc271_g) — 主題: [固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)（固定線形遷移を行列または漸化式にし、巨大回数後の値を求められる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC280 E「Critical Hit」](https://atcoder.jp/contests/abc280/tasks/abc280_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC310 F「Make 10 Again」](https://atcoder.jp/contests/abc310/tasks/abc310_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC409 G「Accumulation of Wealth」](https://atcoder.jp/contests/abc409/tasks/abc409_g) — 主題: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。

## 根拠

- [ABC226 H 公式解説](https://atcoder.jp/contests/abc226/editorial/2879)
- [ABC226 H 公式問題文](https://atcoder.jp/contests/abc226/tasks/abc226_h)
- [ABC239 H 公式解説](https://atcoder.jp/contests/abc239/editorial/3357)
- [ABC239 H 公式問題文](https://atcoder.jp/contests/abc239/tasks/abc239_h)
- [ABC242 H 公式解説](https://atcoder.jp/contests/abc242/editorial/3523)
- [ABC242 H 公式問題文](https://atcoder.jp/contests/abc242/tasks/abc242_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dp-stochastic`
