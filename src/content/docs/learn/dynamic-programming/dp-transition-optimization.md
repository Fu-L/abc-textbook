---
title: "DP遷移を因数分解・集約して加速する"
description: "「DP遷移を因数分解・集約して加速する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 78
---

# DP遷移を因数分解・集約して加速する

習得対象の目安: **青色（1600–1999）**。漸化式の共通項・例外・集約範囲を取り出し、状態数と遷移数を別々に減らす。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DP遷移の集約・高速化

DPの状態数が収まっていても、各状態の遷移元を毎回すべて調べると間に合わないことがある。このときは、複数の遷移先が同じ部分の和を何度も計算していないかを見る。共通部分を一度だけ集計すれば、元のDPと同じ値を少ない操作で求められる。

まず、ある時刻の状態を $$0,\ldots,m-1$$ とし、その時刻のDP配列を `old`、次の時刻の配列を `new` と呼ぶ。一時刻分の配列を層（layer）とも呼ぶ。次の状態 $$i$$ へ移れる旧状態の集合を $$A_i$$ とすると、個数を数えるDPの基本式は

$$
\mathrm{new}[i]=\sum_{j\in A_i}\mathrm{old}[j]
$$

である。遷移先も $$m$$ 個あり、各集合が大きければ、一層に $$O(m^2)$$ 時間かかる。ここでは状態の意味と許可条件を保ったまま、この総和の求め方を変える。まず区間和と例外の減算を学び、その後で共通作用や少数の集計値を使う発展へ進もう。

### 遷移範囲をまとめる

許可される遷移元が連続していれば、総和を区間和として取得できる。例えば旧配列が $$(2,1,3,4)$$ なら、添字1以上3未満の和は $$1+3=4$$、添字0以上3未満の和は $$2+1+3=6$$。二つの問い合わせで $$1+3$$ を足し直す必要はない。

先頭からの累積和を共有するのが基本である。ABC253 Eの一次元の区間和から、ABC282 Gの長方形和、ABC265 Fの対角線上の和へ広げられる。まず遷移元がどの範囲になるかを証明し、その範囲を速く取得する方法を選ぶ。

### 全体から例外を引く

許可集合が複雑でも、禁止集合が小さければ全体和から引けばよい。同じ旧配列で添字1だけが禁止なら、許可側を列挙した $$2+3+4$$ は、全体和を使って $$10-1=9$$ と求められる。

ABC212 Eでは禁止辺を個別に引き、ABC370 Eでは同じキーを持つ禁止状態をまとめて引く。ABC319 GはBFSで距離層を構成してから各層へこの減算を使う発展問題である。ただし、最小値・最大値から禁止項を「引く」ことは一般にはできない。

### 共通作用を外へ出す

和をまとめるだけでなく、全状態へ同じ操作をする費用も省けることがある。ABC372 Fの循環移動、ABC457 Fの全体倍率、ABC435 Gのアフィン作用（同じ倍率を掛けて同じ値を足す操作）と少数の集合変更へ進む。配列の読み方や共通係数を持ち、実際の書換えを例外だけに絞る。その表現が元の同時更新と一致する理由が必要になる。

### 少数の集計値・隣接状態の式・閉形式の後半

さらに、行別最大などの属性別の値や少数の重み付き和だけで次の値を決められる場合がある。隣接する出力の和が似ていれば、出入りする項だけで次の出力を求められる。巨大歩数の問題では、後半を同じ操作の反復へ置き換えられると証明し、短い前半だけDPする方法もある。どの場合も、何を省略してよいかを素朴式から確かめる。

### 習得する技能

- 余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。
- 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。
- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。
- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。
- 隣接する出力の遷移式を比較し、共通項の消去と出入りする項から定数時間更新を導ける。
- 全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。

## 考え方

最初は区間和と例外減算の二つを、自分で素朴式から導けるようにする。以降の発展でも、保持する値の意味、更新前後の対応、計算量を同じ順で確かめる。

### 区間・例外・少数の集計値を更新する

#### 累積和で共通部分を一度だけ足す

許可集合を半開区間 $$[L_i,R_i)$$、つまり $$L_i\leq j<R_i$$ を満たす整数添字の集合にできたとする。端点は $$0\leq L_i\leq R_i\leq m$$ とする。右端を含めないので、要素数は $$R_i-L_i$$、両端が同じなら空区間である。

旧配列を読むだけにして、累積和 $$P$$ を作る。ここでは数学的な和で説明し、ABC253 E・ABC212 E・ABC370 E・ABC372 Fで個数を求める際は、公式問題と同じく法998244353で計算する。

$$
P[0]=0,\qquad P[j+1]=P[j]+\mathrm{old}[j]
$$

この定義から $$P[r]$$ は添字0以上 $$r$$ 未満の和である。従って

$$
\begin{aligned}
\mathrm{new}[i]
&=\sum_{L_i\leq j<R_i}\mathrm{old}[j]\\
&=P[R_i]-P[L_i]
\end{aligned}
$$

となる。右辺では、右端までの和から左端より前の部分が消え、必要な項だけが一度ずつ残る。旧配列 $$(2,1,3,4)$$ なら $$P=(0,2,3,6,10)$$ で、先ほどの二つの和は $$P[3]-P[1]=4$$、$$P[3]-P[0]=6$$ と確認できる。

一層の手順は、旧配列から累積和を作り、各遷移先の区間和を新配列へ書き、すべて終わってから旧・新配列を交換する、となる。各状態が定数個の区間を参照するなら、一層の時間は前処理込みで $$O(m)$$、作業領域も $$O(m)$$。層数を $$h$$ とすれば全体は $$O(hm)$$ 時間となり、状態数はそのままで一状態当たりの走査を減らせる。

空区間では差が0になる。到達不能な状態も個数DPでは0で初期化する。途中で旧値を上書きすると、後の遷移が同じ時刻の値を読めなくなる。二配列を一つにまとめるときは、別途、依存する旧値が失われないことを示す必要がある。

[ABC253 Eの公式解説](https://atcoder.jp/contests/abc253/editorial/4018)では、長さを一つ伸ばす遷移でこの形が現れる。ここだけ値は問題文どおり $$1,\ldots,M$$ とし、$$\mathrm{old}[j]$$ を直前値が $$j$$ の列の個数とする。次の値 $$i$$ に対して

$$
\mathrm{new}[i]=\sum_{\substack{1\leq j\leq M\\|j-i|\geq K}}\mathrm{old}[j]
$$

を求めたい。$$K\geq1$$ なら許可範囲は $$j\leq i-K$$ と $$j\geq i+K$$ の二つで、重ならない。1始まりの値域に合わせて $$C[0]=0$$、$$C[r]=\sum_{j=1}^{r}\mathrm{old}[j]$$ と定めると

$$
\mathrm{new}[i]
=C[\max(0,i-K)]+C[M]-C[\min(M,i+K-1)]
$$

となる。端点を切り詰めることで値域外の空区間も処理できる。$$K=0$$ では全値が許可されるため、全体和 $$C[M]$$ を一度だけ使う。長さ1の各末尾の個数を1として長さ $$N$$ まで進め、最後の配列の和を答える。全体で $$O(NM)$$ 時間、$$O(M)$$ 空間である。

#### 全体和から禁止集合を除く

同じ基本式で、許可集合の補集合を $$F_i$$ とする。旧状態全体が許可集合と禁止集合に重複なく分かれるため

$$
T=\sum_{j=0}^{m-1}\mathrm{old}[j],\qquad
\mathrm{new}[i]=T-\sum_{j\in F_i}\mathrm{old}[j]
$$

と書ける。$$T$$ を一度作り、各遷移先で禁止項だけを引く。一層の時間は $$O(m+\sum_i|F_i|)$$ である。禁止条件が複数あっても、同じ状態を二度引いてはいけない。禁止集合が空なら $$T$$、全体なら0となる。

[ABC212 E](https://atcoder.jp/contests/abc212/editorial/2357)では、$$N$$ 都市の旅について、$$dp_t[v]$$ を $$t$$ 日後に都市 $$v$$ にいる旅の数とする。$$\mathrm{old}[v]=dp_t[v]$$、$$\mathrm{new}[v]=dp_{t+1}[v]$$ と対応する。禁止されるのは都市 $$v$$ 自身と、壊れた道路でつながる都市の集合 $$B(v)$$ なので

$$
\mathrm{new}[v]=T-\mathrm{old}[v]-\sum_{u\in B(v)}\mathrm{old}[u]
$$

となる。都市1の初期値だけ1、他は0とし、$$K$$ 日後の都市1の値を答える。壊れた道路 $$M$$ 本の両向きの寄与と自己遷移を引けば、一日 $$O(N+M)$$、全体 $$O(K(N+M))$$ 時間、二配列と道路の保存に $$O(N+M)$$ 空間で済む。

この減算に必要なのが**加法逆元**、つまり足した寄与を打ち消す値である。整数や法上の和なら減算でき、法上では負の結果を正規化する。一方、最小値2を持つ集合から値2の項を除いても、残りの最小値は元の最小値だけでは分からない。区間最小・最大には累積和の差をそのまま使えない。

ただし接尾区間の最大値なら、後ろからの集計（suffix最大）を共有できる。

$$
S[m]=-\infty,\qquad S[j]=\max(\mathrm{old}[j],S[j+1])
$$

これで $$\max_{L_i\leq j<m}\mathrm{old}[j]=S[L_i]$$。最大化DPの到達不能値も $$-\infty$$ とする。任意区間の極値が必要なら、その取得に合ったデータ構造を選ぶ。

#### 禁止状態が多ければキー別にまとめる

禁止集合そのものが大きくても、同じキーの状態をまとめて引ける場合がある。[ABC370 E](https://atcoder.jp/contests/abc370/editorial/10858)では $$dp[i]$$ を先頭 $$i$$ 要素の合法な分割数とする。累積和 $$B_i=\sum_{k=1}^{i}A_k$$、$$B_0=0$$ を使うと、最後の区間 $$j+1,\ldots,i$$ の和が $$K$$ になる条件は $$B_j=B_i-K$$ である。従って

$$
dp[i]=\sum_{\substack{0\leq j<i\\ B_j\ne B_i-K}}dp[j]
$$

であり、計算直前に次の二つの和を保てばよい。

$$
\mathrm{all}=\sum_{0\leq j<i}dp[j],\qquad
\mathrm{bucket}[x]=\sum_{\substack{0\leq j<i\\ B_j=x}}dp[j]
$$

遷移は $$dp[i]=\mathrm{all}-\mathrm{bucket}[B_i-K]$$ となる。空の先頭部分の分割を $$dp[0]=1$$ として、最初に `all` と `bucket[0]` へ登録する。各 $$i$$ では **値を取得してから**、$$dp[i]$$ を `all` と `bucket` のキー $$B_i$$ へ加える。これで集計には常に $$j<i$$ だけが入り、長さ0の最後の区間を混ぜない。

ここでは二層を同時更新するのでなく、確定した先頭部分の状態を順に追加している。例えば長さ1なら、$$A_1=K$$ のとき $$1-1=0$$、異なるとき $$1-0=1$$ になる。答えは $$dp[N]$$。キーが未登録なら和は0とし、ハッシュ表なら期待 $$O(N)$$、平衡木なら $$O(N\log N)$$ 時間、空間はいずれも $$O(N)$$ である。

#### 重みを分離して少数の和を持つ

遷移に重みがあっても、遷移先だけに依存する係数と遷移元だけに依存する係数に分けられることがある。現在有効な遷移元の集合を $$J$$ とし、重みを $$R$$ 個の積の和

$$
w(i,j)=\sum_{r=1}^{R}\alpha_r(i)\beta_r(j)
$$

へ分けられたとする。集計値 $$M_r=\sum_{j\in J}\beta_r(j)dp[j]$$ を持てば、和の順序を入れ替えて

$$
\sum_{j\in J}w(i,j)dp[j]=\sum_{r=1}^{R}\alpha_r(i)M_r
$$

となる。新しい遷移元 $$j$$ を許可するときは、各 $$M_r$$ へ $$\beta_r(j)dp[j]$$ を足す。取得・追加は各 $$O(R)$$ で、初期集計は $$O(R|J|)$$。$$R$$ が小さく、係数の計算も速いことが有効性の条件となる。

例えば重みが $$i+j$$ なら、$$\sum dp[j]$$ と $$\sum j\,dp[j]$$ の二つで足りる。単に現在の答えが集計値から出るだけでなく、次の集計値も保持している量だけで更新できることを確かめる。これを「更新について閉じる」と呼ぶ。

極値でも、行・列・属性ごとの最大へ分けられる場合は同じように共有できる。ABC224 Eのように狭義の大小関係がある場合、同じ値の全状態の取得を終えてからまとめて登録し、同値間の遷移を混ぜない。

### 共通作用と例外を同時遷移へ戻す

区間和の共有では旧配列を一度読む費用が残る。次は、全状態の共通更新そのものを省く方法である。ただし、表現を変えても「例外の寄与は同じ旧時刻から読む」という条件は変わらない。

#### 循環移動を添字対応で表す

[ABC372 F](https://atcoder.jp/contests/abc372/editorial/10969)では、環状の通常辺による移動に、少数の追加辺が加わる。ここでは頂点番号を $$0,\ldots,N-1$$ と読み替え、頂点の添字を法 $$N$$ で循環させる。

$$
\mathrm{new}[v]=\mathrm{old}[v-1]+\sum_{\text{追加辺 }u\to v}\mathrm{old}[u]
$$

通常辺だけなら旧配列 $$(2,1,3,4)$$ が $$(4,2,1,3)$$ へ回る。この移動は、保存配列を動かさず、読む位置を変えて表せる。保存配列を $$a$$、添字のずれを表すoffsetを $$o$$ とし、次の不変量を置く。

$$
\mathrm{old}[v]=a[(v-o)\bmod N]
$$

初めは $$o=0$$ とする。$$o$$ を1増やすと、頂点 $$v$$ から読む位置が旧頂点 $$v-1$$ の位置になるので、全通常辺の移動を一度に表せる。追加辺は次の順で処理する。

1. offsetを変える前に、全追加辺の遷移元 $$\mathrm{old}[u]$$ を退避する。
2. $$o\leftarrow(o+1)\bmod N$$ とする。
3. 各追加辺 $$u\to v$$ について、保存先 $$a[(v-o)\bmod N]$$ へ退避した値を足す。

これで通常辺の寄与に追加辺の寄与だけが加わる。辺ごとに読取りと加算を交互に行うと、ある辺の加算先を別の辺が新たな遷移元として読んでしまう。全退避が先である。負の剰余が返る言語では、保存先の添字を $$0,\ldots,N-1$$ へ正規化する。

頂点1（読み替え後は0）だけを1で初期化し、$$K$$ 回更新した後に全頂点の値を足す。初期化・最後の総和に $$O(N)$$、各手に $$O(M+1)$$ なので、全体は厳密には $$O(N+K(M+1))$$ 時間、空間は $$O(N+M)$$。通常は $$O(N+KM)$$ と略記されるが、$$M=0$$ でもこの手順は $$K$$ 回のoffset更新を行う。

#### 共通倍率・加算を係数で表す

今度は添字でなく値に共通操作を施す。体、例えば素数を法とする数の上で、実際のDP値 $$y_j$$ を保存値 $$x_j$$ と二つの共通係数で表す。

$$
y_j=\mu x_j+\nu
$$

初めは $$\mu=1,\nu=0$$、$$x_j$$ は初期値とする。全値へのアフィン作用 $$y\leftarrow ay+b$$ は

$$
a(\mu x_j+\nu)+b=(a\mu)x_j+(a\nu+b)
$$

だから、共通係数を $$\mu\leftarrow a\mu$$、$$\nu\leftarrow a\nu+b$$ とするだけでよい。この**更新後の** $$\mu$$ が非零なら、一点への実値 $$\delta$$ の加算は

$$
x_j\leftarrow x_j+\frac{\delta}{\mu}
$$

で実現できる。代入すると実値の増分が $$\delta$$ になることを確認しよう。例外の量自体が旧値に依存するなら、循環移動と同様に旧値を先に保存する。複数の作用は合成順を変えてはいけない。

$$a=0$$ では全実値が $$b$$ になり、旧保存値は不要になる。一方、倍率0には乗法逆元がないため、上の除算は使えない。ここは全消去として扱い、保存値をすべて0と見なして $$\mu=1,\nu=b$$ から再開する。

毎回全配列を消す費用を避けるには、各保存値に世代番号を付ける方法がある。全消去では現在世代だけを進め、古い世代の点は保存値0として読む。初めて書くときに世代と値を設定する。この方法は、データ構造が世代と既定値を扱える場合に使える。

全体和も持つなら、対象個数を $$n$$ として共通作用で $$\sum_j y_j\leftarrow a\sum_j y_j+nb$$、例外加算でさらに $$\delta$$ を足す。共通係数の更新は定数回、例外は点の個数分の体演算で済むが、逆元やデータ構造の操作費用は別途数える。体でない法上では非零でも逆元があるとは限らない。

### 隣接差と閉形式のtailを導く

#### 隣接する和の出入りだけを更新する

旧配列を固定し、幅 $$D\geq1$$ の窓の和を $$F_i$$ とする。

$$
F_i=\sum_{j=i}^{i+D-1}\mathrm{old}[j]
$$

窓を一つ右へずらすと、左端の一項が出て右端の一項が入る。共通項が消えるため

$$
F_{i+1}=F_i-\mathrm{old}[i]+\mathrm{old}[i+D]
$$

となる。例えば旧配列 $$(2,1,3,4)$$、$$D=2$$ では $$F_0=3$$、$$F_1=3-2+3=4$$、$$F_2=4-1+4=7$$。初めの和を $$O(D)$$ で作れば、$$q$$ 個の出力は全体 $$O(D+q)$$ 時間、入力・出力を除く追加領域は $$O(1)$$ で求まる。

範囲外を参照するなら、元の遷移に合わせて値を0とするなど境界を定める。重み付き和では窓の移動で残る項の重みも変わり得るため、この二項だけでは更新できない。差に何が残るかを式で調べ、必要な補助集計を導く。

#### 巨大歩数の後半を閉形式にする

ここまでの方法は一層の費用を減らす。層数そのものが巨大な場合は、後半（tail）をDPなしで求められる形へ変えられないか考える。

頂点数 $$n$$ のグラフで、各頂点に滞在する操作が許され、一手ごとに到着先の固定報酬 $$A_v$$ を得る場合を考える。開始時点では報酬を得ず、ちょうど $$K$$ 手の総報酬を最大化する。[ABC358 Gの公式解説](https://atcoder.jp/contests/abc358/editorial/10226)の交換論を、この条件のグラフへ一般化して確かめよう。

任意の $$K$$ 手の歩行について、開始点を含む訪問頂点のうち報酬が最大の頂点 $$v$$ を選ぶ。$$v$$ までの前半から同じ頂点へ戻る部分を削り、単純な経路へ縮める。残った経路の長さを $$t$$ とすると $$t\leq\min(K,n-1)$$。その経路をたどった後、残りの $$K-t$$ 手をすべて $$v$$ での滞在に替える。

削った部分と元の後半の各手の報酬は、どれも $$A_v$$ 以下である。置き換え後も総手数は同じで、その各手を報酬 $$A_v$$ に替えるので総報酬は減らない。

そこで $$dp[t][v]$$ を「ちょうど $$t$$ 手で $$v$$ へ来る最大報酬」とし、$$dp[0][\mathrm{start}]=0$$、他は $$-\infty$$ から通常のDPを行う。到達可能な状態について

$$
\max_{\substack{0\leq t\leq\min(K,n-1)\\v}}
\bigl(dp[t][v]+(K-t)A_v\bigr)
$$

を取れば答えになる。先の交換論で、任意の歩行以上の候補がこの式にある。逆に、各候補は前半の最良の歩行とその後の滞在で実現できるので、過大評価にもならない。前半DPが単純経路だけを扱う必要はない。

ABC358 Gでは $$n=HW$$ で各状態の移動先は定数個だから、時間は $$O(n(1+\min(K,n-1)))$$、二層だけを保持して候補を都度評価すれば空間は $$O(n)$$ となる。各頂点で滞在できない、報酬が時刻で変わる、といった問題にはこの証明をそのまま使えない。

### 初期状態と区間端を残して集約する

どの高速化でも、最後に元の状態の意味と端点へ戻る。整数添字の開区間 $$L<j<U$$ は、状態添字が0以上なら半開区間 $$[\max(0,L+1),U)$$ になる。空状態を $$j=0$$ に置くと、$$L=0$$ では含まれず、$$L=-1$$ では含まれる。「存在しない前回の位置」と「空状態の位置」を同じ番兵へまとめると、最初の合法遷移を落とすことがある。

[ABC446 G](https://atcoder.jp/contests/abc446/editorial/16371)では、同じ値列を一度だけ数えるための代表を固定する。$$dp[p]$$ は最後の同値要素のまとまりが入力位置 $$p$$ で終わる代表の個数で、$$dp[0]=1$$ は最初のまとまりを作るための空列を表す。一方、0回目の出現位置は $$-1$$ である。ここでは既存の問題解説に合わせ、両端を含む累積和を使う。

$$
P[t]=\sum_{j=0}^{t}dp[j],\qquad P[-1]=0
$$

冒頭の $$P[r]$$ は添字 $$r$$ を含まない和だったが、この節では含む和なので、取得式も合わせて変える。$$l=\max(0,L+1)$$、$$r=U-1$$ とすれば

$$
\sum_{L<j<U,\ j\geq0}dp[j]=P[r]-P[l-1]
$$

である。$$P[-1]$$ は配列の負添字を読まず、分岐で0を返す。例えば最小入力 $$N=1,A=(1)$$ では $$L=-1,U=1$$ なので、区間 $$[0,1)$$ は $$dp[0]$$ を含み、$$dp[1]=1$$ となる。

遷移が $$p$$ 未満だけを参照し、確定した旧状態を変更しないなら、この累積和を末尾へ伸ばすだけで各取得は $$O(1)$$ となる。常にFenwick木の $$O(\log N)$$ の取得が必要なわけではない。

最後の集計も状態の意味から決める。$$dp[1],\ldots,dp[N]$$ だけを足すなら既に非空列だけで、さらに1を引かない。空状態込みの $$P[N]$$ を使う場合だけ1を引く。初期化、遷移の両端、最終集計を同じ最小入力で追うことが、組合せた手順の検算になる。

## 成立条件と計算量

高速化を選ぶときは、次の違いを確認する。

| 共有するもの | 使える条件 | 省けない確認 |
| --- | --- | --- |
| 区間和 | 遷移元が少数の区間になり、和を減算できる | 両端・空区間・累積和を作る費用 |
| 全体和からの例外減算 | 禁止項を少数の項またはキー別の和にできる | 重複除去・自己遷移・登録順 |
| 共通作用 | 添字対応や共通係数で実値を再現できる | 旧値の退避・作用の合成順・倍率0 |
| 少数の集計値・隣接差 | 必要な量だけで取得と次の更新を行える | 有効な遷移元の範囲・補助集計 |
| 後半の閉形式 | 任意の解を同じ反復へ移す正当化がある | 滞在の可否・報酬の条件・前半の長さ |

時間計算量は「一回の取得が速い」で終えず、前処理、全層の全状態、集計の更新、最後の答えの取得まで数える。空間計算量には旧・新配列、集計値、入力やデータ構造を含める。小さな旧配列で直接総和と一致させた後、式の分解や不変量によって一般の場合も同じ値になることを説明しよう。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)。

正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。

### このUnitでは扱わないもの

- 固定線形遷移の巨大回累乗。

## 問題一覧

- [ABC253 E「Distance Sequence」](https://atcoder.jp/contests/abc253/tasks/abc253_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 許可される直前値を二つの区間へ分け、累積和で一層 $$O(M^2)$$ を $$O(M)$$ にする。本文で定義した $$C$$ を使い、端点を値域へ切り詰める。$$K=0$$ は全体和を一度だけ使う。
- [ABC442 F「Diagonal Separation 2」](https://atcoder.jp/contests/abc442/tasks/abc442_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 行の境界jを状態にし、new[j]=cost(row,j)+min_{k≥j}old[k]。全k走査をsuffix minimum一回で共有し、各行O(N)にする。
- [ABC212 E「Safety Journey」](https://atcoder.jp/contests/abc212/tasks/abc212_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 前日の全体和 $$T$$ から自己遷移と壊れた道路の寄与を引く。都市 $$v$$ の禁止隣接集合を $$B(v)$$ とすれば、$$\mathrm{new}[v]=T-\mathrm{old}[v]-\sum_{u\in B(v)}\mathrm{old}[u]$$。一日 $$O(N+M)$$ で求まる。
- [ABC370 E「Avoid K Partition」](https://atcoder.jp/contests/abc370/tasks/abc370_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全遷移の総和から禁止辺・禁止keyの集計値を引き、例外の総数で計算量を評価できる。）。 最後の区間の和が $$K$$ になる条件を $$B_j=B_i-K$$ と表し、$$dp[i]=\mathrm{all}-\mathrm{bucket}[B_i-K]$$ へ変形する。取得後に現在の状態を登録して $$j<i$$ を保つ。ハッシュ表で期待 $$O(N)$$。
- [ABC224 E「Integers on Grid」](https://atcoder.jp/contests/abc224/tasks/abc224_e) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [DAGのtopological processing](/learn/graph/dag-topological-processing/)（依存辺の向きを定め、入次数またはpostorderからtopological順を作って制約伝播・DP・scheduleを処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。 dp_i=1+max_{a_j>a_i,同じ行または列}dp_j型の遷移を行別・列別最大へ圧縮する。遷移先がなければ0。同値のbatchでは全取得を済ませてから更新し、狭義不等号を保つ。sort後の集約はO(N)。
- [ABC408 F「Athletic」](https://atcoder.jp/contests/abc408/tasks/abc408_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。 dp[p_h]=1+max_{|j−p_h|≤R,H_j≤h−D}dp[j]。高さ順にeligibleな点だけを有効化し、残る位置条件を区間最大にする。二条件の全点走査がsortとO(N log N)の更新・取得になる。
- [ABC372 F「Teleporting Takahashi 2」](https://atcoder.jp/contests/abc372/tasks/abc372_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。）。 環状の通常遷移をoffsetで表し、追加辺 $$M$$ 本だけを更新する。全遷移元を退避してからoffset変更・加算を行うことで、同じ旧時刻からの寄与を保つ。全体 $$O(N+K(M+1))$$ 時間。
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

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-transition-optimization`
