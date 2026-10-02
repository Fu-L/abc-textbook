---
title: "DP遷移を因数分解・集約して加速する"
description: "「DP遷移を因数分解・集約して加速する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 78
---

# DP遷移を因数分解・集約して加速する

習得対象の目安: **青色（1600–1999）**。漸化式の共通項・例外・集約範囲を取り出し、状態数と遷移数を別々に減らす。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DP遷移の集約・高速化

同じ形の遷移をprefix、単調構造、剰余類などでまとめる。

最初に素朴な遷移式を確定し、何を共有できるかで読む節を選ぶ。和・最大値の区間集約、全体からの例外除去、共通作用の遅延は、必要な代数的性質も更新の不変量も異なる。以下の問題には式変形を併記し、前提を要する技能はProblemごとに既習技能として示す。

### 遷移範囲をまとめる

Σ_{j∈[L_i,R_i]}dp[j]やmin_{j∈[L_i,R_i]}dp[j]へ変形する。prefix差には加減算、区間最小には最小値を保持する構造が必要。ABC253 Eから二次元のABC282 Gや対角線のABC265 Fへ広げる。集合を区間へ変える証明と、区間問い合わせの実装を区別する。

### 全体から例外を引く

全体和Tを一度作り、禁止辺や同じkeyだけを引く。ABC212 E→ABC370 Eで明示的な禁止辺からkey別の集約へ進む。ABC319 GはBFSによる距離層の構成を先に学んでから、各層へこの引き算を適用する発展問題。minやmaxには一般に引き算がないので同じ変形は使えない。

### 共通作用を外へ出す

ABC372 F→ABC457 F→ABC435 Gの順で、添字shift、全体倍率、affine作用と疎な集合変更へ進む。全状態の実値を毎回書き換えず、表現と共通作用の合成を保持する。例外への同時更新と非可逆な倍率0の扱いを確かめる。

### 少数の集計値・隣接状態の式・閉形式の後半

属性別最大や少数の重み付き和が更新について閉じる場合は、その集計値を状態に持つ。隣接出力の遷移和が似ている場合は差分の式を導く。巨大歩数の後半を同じ操作へ正規化できる場合は、その証明を先に行って有限prefixだけDPする。これらを「累積和」と一括りにしない。

### 習得する技能

- 余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。
- 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。
- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。
- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。
- 隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。
- 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。

## 考え方

素朴な漸化式を先に書き、全遷移で共通する和・範囲・作用を共有する。区間和はprefix、禁止対象は全体から差し引く、共通倍率やshiftは表現へ遅延させるなど、式に応じて方法を選ぶ。

### 区間・例外・少数の集計値を更新する

旧layerを固定し、P[0]=0、P[j+1]=P[j]+old[j]を作れば、new[i]=Σ_{L_i≤j<R_i}old[j]はP[R_i]−P[L_i]。空区間は0となる。suffix最大ならS[N]=−∞、S[j]=max(old[j],S[j+1])としてnew[i]=S[L_i]を取る。到達不能な状態は和では0、最大化では−∞と、元のDPに合わせて初期化する。一layer内で旧値を上書きすると、別の遷移まで新値を参照するので、同時遷移はoldとnewを分ける。

全体からの例外除去ではT=Σ_j old[j]を一度作り、禁止集合F_iを重複のない集合としてnew[i]=T−Σ_{j∈F_i}old[j]とする。一layerの費用はO(N+Σ_i |F_i|)。禁止条件がkey一致ならbucket[k]=Σ_{j:key(j)=k}dp[j]を持つ。prefix DPでは空prefixのdp[0]=1をallと対応するbucketへ登録し、dp[i]=all−bucket[禁止key(i)]を求めてから両集計へ追加する。この順序によりj<iだけを遷移元にできる。

重みがw(i,j)=Σ_{r=1}^R α_r(i)β_r(j)へ分かれるなら、M_r=Σ_j β_r(j)dp[j]を持つことでΣ_j w(i,j)dp[j]=Σ_r α_r(i)M_rとなる。初めの遷移元だけでMを作り、新しい元jを許可するときM_r←M_r+β_r(j)dp[j]を各rへ施す。取得と追加はO(R)であり、Rが小さいことと、どの元が現在有効かを示す。極値版も行・列・属性ごとのmaxへ分けられる場合に使え、同値を遷移元にしない条件では同値batchの全取得後に追加する。

### 共通作用と例外を同時遷移へ戻す

環状の添字移動にはold[v]=a[(v−o) mod N]という不変量を置き、初めo=0。new[v]=old[v−1]の共通遷移はo←o+1だけで実現する。追加辺u→vの寄与は、offsetを変える前に全old[u]を保存し、変えた後の物理位置(v−o) mod Nへ加算する。一つずつ読む・加えるを混ぜると、別の追加辺が新値を読むため誤る。

体上の共通affine作用には実値y_j=μx_j+νを保ち、初めμ=1、ν=0、x_j=初期値とする。全体へy←ay+bを施すとμ←aμ、ν←aν+b。新しいμが非零なら、例外点への実値δの加算はx_j←x_j+δ/μでよい。a=0なら全実値はbとなり旧xは不要だが、逆元では更新できない。xの世代を切り替えて未登録点を0とするなど、全消去を表現し、μ=1、ν=bから例外を追加する。これは構造側が世代と既定値を扱える場合の方法である。共通作用を合成する順序を保ち、和を持つなら対象個数nに対してΣy←aΣy+nbも同時に更新する。費用は共通作用と例外数分の体演算であり、逆元の計算費用は別に数える。

### 隣接差と閉形式のtailを導く

隣接出力で共通項を消す基本形はF_i=Σ_{j=i}^{i+D−1}old[j]。F_0を直接作り、F_(i+1)=F_i−old[i]+old[i+D]とすれば、全出力はO(N+D)。範囲外のoldは0など元の式に合う境界を定める。重み付き和では重みの変化も差に残るため、同じ二項だけで更新できるとは限らず、必要な補助集計を導く。

歩行の線形tailは、各頂点で滞在でき、一手で到着した頂点の報酬A_vを得る場合に導ける。任意のK歩walkで最大報酬の訪問頂点vを選び、vへのprefixから同じ頂点への周回を削る。残るprefixは単純pathなのでt≤N−1。その後をvでの滞在へ替えると、削除した周回や元の後半の各報酬がA_v以下だから総報酬は減らない。従ってdp[0][start]=0、他を−∞としてt≤min(K,N−1)の有限DPを作り、max_{t,v}(dp[t][v]+(K−t)A_v)で最適値を得る。各候補は実際に歩けるので上界だけでなく等号が成り立つ。滞在不可・時刻依存報酬などではこの交換論は使えない。ABC358 GではN=HWであり、巨大Kを状態数で界したprefixと線形tailへ分けられる。

## 成立条件と計算量

各高速化は代数的な条件を要する。minには一般に引き算がなく、倍率0には逆元がない。最適化後の総query数と構造費用を数え、素朴式と同じ値を保つ不変量を示す。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)。

正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

### このUnitでは扱わないもの

- 固定線形遷移の巨大回累乗。

## 問題一覧

- [ABC253 E「Distance Sequence」](https://atcoder.jp/contests/abc253/tasks/abc253_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 素朴にはnew[j]=Σ_{|i−j|≥K}old[i]でO(M²)。Pをoldのprefix和としてP[j−K]+P[M]−P[j+K−1]へ分けO(M)。K=0では二範囲が重なるので全体和を一度だけ使う。
- [ABC442 F「Diagonal Separation 2」](https://atcoder.jp/contests/abc442/tasks/abc442_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 行の境界jを状態にし、new[j]=cost(row,j)+min_{k≥j}old[k]。全k走査をsuffix minimum一回で共有し、各行O(N)にする。
- [ABC212 E「Safety Journey」](https://atcoder.jp/contests/abc212/tasks/abc212_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 new[v]=Σ_{u:移動可}old[u]を、T−old[v]−Σ_{u:禁止辺uv}old[u]へ変形する。密な許可辺を列挙せず、一日O(N+M)で禁止辺だけを差し引く。
- [ABC370 E「Avoid K Partition」](https://atcoder.jp/contests/abc370/tasks/abc370_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 dp[i]=Σ_{j<i,B_j≠B_i−K}dp[j]をall−bucket[B_i−K]へ変形する。dp[i]を求めてからallとbucketを更新し、空区間を遷移へ混ぜない。期待O(N)のkey別集約。
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。 dp_i=1+max_{a_j>a_i,同じ行または列}dp_j型の遷移を行別・列別最大へ圧縮する。遷移先がなければ0。同値のbatchでは全取得を済ませてから更新し、狭義不等号を保つ。sort後の集約はO(N)。
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。 dp[p_h]=1+max_{|j−p_h|≤R,H_j≤h−D}dp[j]。高さ順にeligibleな点だけを有効化し、残る位置条件を区間最大にする。二条件の全点走査がsortとO(N log N)の更新・取得になる。
- [ABC372 F「Teleporting Takahashi 2」](https://atcoder.jp/contests/abc372/tasks/abc372_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。）。 new[v]=old[v−1]+Σ_{追加辺u→v}old[u]。環状の基本遷移を添字offset一つへ移し、M本の追加辺だけを更新してO(N+KM)。同時更新なので例外の遷移元は上書き前に退避する。
- [ABC358 G「AtCoder Tour」](https://atcoder.jp/contests/abc358/tasks/abc358_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。 K歩DPを直接展開するとKに比例する。walkの余分な周回を訪問済み最大報酬の頂点での滞在へ移せるので、t≤HWだけDPし、dp[t][v]+(K−t)A_vを最大化する。巨大時間を短いprefixと線形tailへ分ける証明が核心。
- [ABC224 F「Problem where +s Separate Digits」](https://atcoder.jp/contests/abc224/tasks/abc224_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC353 G「Merchant Takahashi」](https://atcoder.jp/contests/abc353/tasks/abc353_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。）。 max_j(dp[j]−C|j−t|)+pを、j≤tのmax(dp[j]+Cj)−Ct+pとj≥tのmax(dp[j]−Cj)+Ct+pへ分ける。二本の区間最大で各イベントO(log N)。
- [ABC334 F「Christmas Present 2」](https://atcoder.jp/contests/abc334/tasks/abc334_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。 配達の直接経路をbaselineにし、補充境界iの追加費用をd_iとする。dp[i]=d_i+min_{i−K≤j<i}dp[j]。窓から出た候補と支配される候補をdequeから除き、O(NK)をO(N)へ落とす。
- [ABC249 E「RLE」](https://atcoder.jp/contests/abc249/tasks/abc249_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 ラン長lを全列挙する遷移を、桁数dごとの10^{d−1}≤l<10^dへまとめる。同じ圧縮長増分d+1を持つ遷移元の区間和をprefix差で得て、各状態の線形走査をO(log N)区間へ減らす。
- [ABC243 G「Sqrt」](https://atcoder.jp/contests/abc243/tasks/abc243_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。既習技能: [整数境界と同値区間を正確に分ける](/learn/number-theory/integer-boundary-blocks/)（floor(N/i)が一定の最大区間を整数除算で列挙し、O(√N)個の区間へ集約できる。整数根・桁数の境界も誤差なく扱える。）。 二段先iを固定して中間状態数を数えるとΣ_{i≤r}(s+1−i²)dp[i]になる（s=⌊√X⌋,r=⌊√s⌋）。P0=Σdp、P2=Σi²dpを持てば(s+1)P0[r]−P2[r]で答えられる。
- [ABC457 F「Second Gap」](https://atcoder.jp/contests/abc457/tasks/abc457_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。 順位別挿入の全遷移を、new[j]=a_i old[j]+b_{i,j}（bは少数点のみ非零）へ分ける。共通倍率を外出しして二点を補正する。倍率0は逆元を使えないので全消去として扱い、現在世代の例外から再開する。
- [ABC265 F「Manhattan Cafe」](https://atcoder.jp/contests/abc265/tasks/abc265_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 一座標を全整数へ動かす遷移核を、二つの絶対値の折れ目で三領域へ分ける。各領域では距離pairが一定方向に動くので、二次元DPの対角線prefix和で同方向の全遷移をまとめる。
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。 次の二つのrankの大小関係で遷移元が四つの長方形へ分かれる。new[j][k][l]の全rank対走査を、旧layerの二次元prefix和から定数個の長方形和へ変える。
- [ABC435 G「Domino Arrangement」](https://atcoder.jp/contests/abc435/tasks/abc435_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。）。 素朴な色別更新T_k(c)=S_{k−4}−T_{k−2}(c)を、parity別mapの共通affine作用として保持する。集合C_kとの対称差だけを追加・削除し、総仕事量を入力の集合サイズ総和で界す。値和も作用で更新する。
- [ABC338 G「evall」](https://atcoder.jp/contests/abc338/tasks/abc338_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。 各開始位置の式評価状態(pre,mul,term)を個別更新する代わりに、cnt,Σpre,Σmul,Σtermを保持する。桁追加ではΣtermを10倍してd·Σmulを足す。+と*も集計値に閉じる更新を導き、全substring走査をO(N)へ圧縮する。
- [ABC221 H「Count Multiset」](https://atcoder.jp/contests/abc221/tasks/abc221_h) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。 f[x][y]=f[x][y−x]+Σ_{直前M行k}f[k][y−x]。列ごとに行方向のsliding sumを保持してM項走査を消す。入る行を足し、出る行を引く順序を固定する。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC214 F「Substrings」](https://atcoder.jp/contests/abc214/tasks/abc214_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 同じ文字の直前出現と隣接禁止から、末尾追加が重複しない直前状態の区間[L_i,R_i]を導く。その後dp[i]=Σ_{j=L_i}^{R_i}dp[j]をprefix差へ変形する。境界の正当化が計数の核心。
- [ABC235 G「Gardens」](https://atcoder.jp/contests/abc235/tasks/abc235_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。）。 F_A(i)=Σ_{k≤A}C(i,k)を毎回足し直さず、Pascalの式からF_A(i+1)=2F_A(i)−C(i,A)とする。三色分を同時更新して包除の各項を定数時間で計算する。
- [ABC263 E「Sugoroku 3」](https://atcoder.jp/contests/abc263/tasks/abc263_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。
- [ABC279 G「At Most 2 Colors」](https://atcoder.jp/contests/abc279/tasks/abc279_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 最後に異なる色を置いた位置pごとのdpを、既に制約窓を出たsingとactive区間に分ける。dp[i−1]=sing(C−1)+Σ_{p=i−K+1}^{i−2}dp[p]の区間和をprefix差へ変える。
- [ABC288 F「Integer Division」](https://atcoder.jp/contests/abc288/tasks/abc288_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。 最後の切れ目jを列挙するdp[i]=Σ_{j<i}dp[j] value(j+1..i)にvalue=10·旧value+d_iを代入する。dp[0]=1,dp[1]=d_1を初期値とし、i≥2ではdp[i]=10dp[i−1]+d_iΣ_{j<i}dp[j]となる。前答えと累積和だけでO(N)。
- [ABC311 F「Yet Another Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 強制黒の閉包を作ってから対角線上の境界jを状態にする。new[j]=Σ_{k≥j}old[k]をsuffix和一走査で求め、盤外・強制黒と矛盾する境界を除く。境界圧縮と遷移集約を分けて説明する。
- [ABC319 G「Counting Shortest Paths」](https://atcoder.jp/contests/abc319/tasks/abc319_g) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 補グラフBFSで距離層を先に確定する。dp[v]=Σ_{u∈前層,uv許可}dp[u]を前層総和−禁止隣接点のdp和へ変形する。BFSの未訪問集合走査と経路数の補集合集約は別工程として計算量を証明する。
- [ABC333 F「Bomb Game 2」](https://atcoder.jp/contests/abc333/tasks/abc333_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。）。 一周後の再訪を等比級数で消去し、new[0]だけ重み付き和で計算する。隣接出力の式を比較するとnew[j+1]=p(new[j]+old[j])となり、一行O(m²)からO(m)へ落ちる。
- [ABC342 F「Black Jack」](https://atcoder.jp/contests/abc342/tasks/abc342_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 dealerの配布先とplayerの継続先は連続するD状態。r[i]=max(q[i],Σ_{j=1}^D r[i+j]/D)の和をsliding更新し、確率分布も差分配布で集約する。最適停止の式を確立してからO(ND)をO(N+D)へ減らす。
- [ABC387 F「Count Arrays」](https://atcoder.jp/contests/abc387/tasks/abc387_f) — 主題: [関数グラフのcycle・tree分解](/learn/graph/functional-graph-decomposition/)（後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 cycle縮約後の木でdp[v][j]=∏_{子u}Σ_{k≤j}dp[u][k]。子ごとにprefix和を作れば、親の値ごとに子の全値を走査する二乗因子が消える。functional graph縮約と木DPを先に履修する。
- [ABC412 F「Socks 4」](https://atcoder.jp/contests/abc412/tasks/abc412_f) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（状態から先の期待費用・期待回数を定義し、一歩分の費用と未来の期待値を分け、自己ループを移項した方程式を解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。 総数順の最適方策を証明し、自己loopを移項する。dp_i=(1+Σ_{j>i}A_j dp_j/S)/(1−Σ_{j<i}A_j/S)。prefix Aと降順の重み付きsuffix和で、一状態の全色走査を定数時間へ落とす。
- [ABC436 G「Linear Inequation」](https://atcoder.jp/contests/abc436/tasks/abc436_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 位取りで巨大添字の係数抽出を繰り返す。各段の全組合せを多項式分布との畳み込みへまとめ、その後同じ商へ移る剰余blockを区間集約する。畳み込みと区間集約の二つの高速化を区別する。
- [ABC446 G「221 Subsequence」](https://atcoder.jp/contests/abc446/tasks/abc446_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 各値列の辞書順最小添字列だけを数える正準化から、直前位置の開区間L_p<j<R_pを導く。dp[p]=Σ dp[j]をrange sumとpoint addへ写し、O(N²)をO(N log N)へ減らす。

## 根拠

- [ABC212 E 公式問題文](https://atcoder.jp/contests/abc212/tasks/abc212_e)
- [ABC212 E 公式解説](https://atcoder.jp/contests/abc212/editorial/2357)
- [ABC214 F 公式解説](https://atcoder.jp/contests/abc214/editorial/2440)
- [ABC214 F 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_f)
- [ABC221 H 公式解説](https://atcoder.jp/contests/abc221/editorial/2719)
- [ABC221 H 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dp-transition-optimization`
