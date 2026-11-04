---
title: "局所寄与へ分解して集計順を交換する"
description: "「局所寄与へ分解して集計順を交換する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 5
headingAliases:
  寄与の数え上げと順序交換: 概要
  何を固定すると集計が一度で済むか: 順序を変えても足す項は変えない
  認識の手掛かり: 固定する軸は残った条件から選ぶ
  境界: 境界では何を一回とするかを確かめる
  習得する技能: 概要
---

# 局所寄与へ分解して集計順を交換する

習得対象の目安: **緑色（800–1199）**。要素・組・値・区間のどれを固定すれば一意に数えられるかを見抜き、総和の順を交換する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

すべての区間や組について得点を計算し、その総和を求める問題では、同じ要素を何度も調べがちです。そこで、得点を小さな加算の単位へ分解し、**一つの単位を固定して、それが答えに何回現れるかを先に数えます**。この見方を寄与の数え上げ、あるいは主客転倒と呼びます。

たとえば、配列のすべての区間和を足すなら、各要素の値に「その位置を含む区間の個数」を掛けて足せます。しかし、区間内の値の種類数を足すときは、同じ値の要素を別々に数えると重複します。高速化の前に、何を一回として数えるかを決めることがこの単元の中心です。

以下では、要素を固定する小例から始め、重複を防ぐ代表の決め方、三つ組の中央を固定する方法、指示変数による期待値の分解へ進みます。有限和の順序交換を自分で組み立て、固定した後に残る計算まで評価できることを目指します。

## 考え方

### 区間を作る側から、区間に含まれる側へ

配列 $$A=(2,1,2)$$ の、空でないすべての連続区間の和を、さらに足すことを考えます。区間を左から順に挙げると、

$$
2+3+5+1+3+2=16
$$

です。最初の三項は左端が1、次の二項は左端が2、最後の一項は左端が3の区間に対応します。

長さを $$N$$ とすると、区間は $$N(N+1)/2$$ 個あります。各区間内を走査する素朴解は時間 $$O(N^3)$$、累積和で一つの区間和を定数時間で得ても全体で $$O(N^2)$$ です。求めるものは総和一つなので、区間をすべて作らずに計算する余地があります。

同じ位置の要素が、複数の区間和に現れることに注目します。位置は1始まりとし、位置 $$i$$ を固定しましょう。区間の左端を $$l$$、右端を $$r$$ とすると、その要素を含む条件は

$$
1\leq l\leq i\leq r\leq N
$$

です。左端には $$i$$ 通り、右端には $$N-i+1$$ 通りの選択があります。どの左端と右端を組み合わせても有効であり、一つの区間の端点は一意なので、位置 $$i$$ は $$i(N-i+1)$$ 個の区間に含まれます。

| 位置 | 値 | 区間数 | 寄与 |
| --- | --- | --- | --- |
| 1 | 2 | $$1\times3=3$$ | 6 |
| 2 | 1 | $$2\times2=4$$ | 4 |
| 3 | 2 | $$3\times1=3$$ | 6 |

先ほど区間ごとに足した16を、今度は $$6+4+6$$ と計算できました。一般にも、答えは

$$
\sum_{i=1}^{N} A_i\,i(N-i+1)
$$

です。要素を一度ずつ処理すればよいので時間は $$O(N)$$。入力を順に読んで加算すれば追加空間は $$O(1)$$、配列を保存する実装なら全空間は $$O(N)$$ です。

### 順序を変えても、足す項は変えない

この変形が正しい理由を、他の問題でも使える形にします。完成した区間・選択などの集合を $$\mathcal C$$、得点を分解した単位の集合を $$U$$ とします。一つの完成形 $$c\in\mathcal C$$ において、単位 $$u\in U$$ が持つ寄与を $$q(c,u)$$ と定義します。関係しない組には寄与0を与えれば、総和は

$$
\sum_{c\in\mathcal C}\sum_{u\in U}q(c,u)
=
\sum_{u\in U}\sum_{c\in\mathcal C}q(c,u)
$$

と書けます。どちらも同じ有限個の組 $$(c,u)$$ の寄与を一度ずつ足しているため、足す順を変えられます。寄与に負数があっても、この等式は成立します。

区間和の例では $$U$$ は位置の集合で、$$q([l,r],i)$$ は、$$l\leq i\leq r$$ なら $$A_i$$、それ以外は0です。左辺は「区間を選び、中の要素を足す」、右辺は「位置を選び、その要素を含む区間の分だけ足す」に対応します。

以降、条件 $$P$$ が成立すれば1、成立しなければ0となる記号を $$[P]$$ と書きます。この0か1の量を**指示変数**と呼びます。たとえば $$q([l,r],i)=A_i[l\leq i\leq r]$$ です。

大切なのは、**式の順序交換だけでは計算量は減らない**ことです。すべての組を改めて列挙すれば元と同じです。区間和では、固定した位置に対する内側の和を、端点の選択数の積で定数時間にまとめたことが高速化になっています。

### 種類数では、区間内の最初の出現へ割り当てる

同じ $$A=(2,1,2)$$ で、今度はすべての区間に含まれる「異なる値の種類数」を足してみます。六つの区間の種類数は、先ほどと同じ順に $$1,2,2,1,2,1$$ で、総和は9です。

各位置を含む区間数をそのまま足すと $$3+4+3=10$$ となり、一つ多くなります。区間 $$[1,3]$$ に値2が二つあるためです。この区間の種類数には値2を一回だけ加えたいのに、位置1と位置3から二回加えてしまいました。

正しい加算単位は「区間と、その区間に含まれる値の組」です。入力に現れる値の集合を $$V$$ とすると、

$$
\sum_{1\leq l\leq r\leq N}\ \sum_{x\in V}
[x\text{ が }A_l,\ldots,A_r\text{ に現れる}]
$$

を計算したいわけです。出現する回数によらず、各値の指示変数は1以下になります。

値を固定した後も、同じ値の複数の位置をどう扱うかが残ります。そこで、各区間について、その値の**区間内で最も左の出現**を代表にします。値が現れるなら代表が必ず一つあり、現れなければ代表はありません。

位置 $$i$$ より前で $$A_i$$ と同じ値が最後に現れた位置を $$p_i$$ とします。前に現れなければ $$p_i=0$$ とします。位置 $$i$$ が区間内の最初の出現になる条件は、

$$
p_i<l\leq i\leq r\leq N
$$

です。$$l\leq p_i$$ なら前の出現まで含んでしまい、$$l>p_i$$ なら $$l$$ から $$i-1$$ に同じ値はありません。したがって左端は $$i-p_i$$ 通り、右端は $$N-i+1$$ 通りであり、位置 $$i$$ に割り当てる寄与は

$$
(i-p_i)(N-i+1)
$$

となります。

| 位置 | 直前の出現 | 左端の候補 | 区間数 |
| --- | --- | --- | --- |
| 1 | 0 | 1 | $$1\times3=3$$ |
| 2 | 0 | 1, 2 | $$2\times2=4$$ |
| 3 | 1 | 2, 3 | $$2\times1=2$$ |

値2の寄与は位置1と位置3に分かれて $$3+2=5$$、値1の寄与は4です。区間 $$[1,3]$$ の値2は位置1だけが担当し、位置3は担当しません。こうして $$5+4=9$$ を重複なく得られます。

実装では、各値の直前の出現位置を `last` に保存し、左から走査します。たとえば $$1\leq A_i\leq N$$ なら、次の擬似コードで計算できます。

```text
last[1..N] = 0
answer = 0
for i = 1..N:
    x = A[i]
    answer += (i - last[x]) * (N - i + 1)
    last[x] = i
return answer
```

位置 $$i$$ の処理前に、`last[x]` は位置 $$i-1$$ までの最後の出現を表します。加算後に更新するので、この意味が次の位置でも保たれます。先に更新すると自分自身を前の出現にしてしまい、寄与が0になるため、操作順も条件式の一部です。

初期化と走査を合わせて時間 $$O(N)$$、`last` と入力保存を含めた空間は $$O(N)$$ です。値が大きく配列の添字にできない場合は、ソートによる座標圧縮や平衡木の連想配列を使えば時間 $$O(N\log N)$$、空間 $$O(N)$$ で処理できます。

別の数え方として、固定した値を**含まない区間**を全区間から引く方法もあります。その値の出現位置の間にある、値を含まない連続部分を考えましょう。配列の両端の部分も含め、それぞれの長さを $$g_0,\ldots,g_m$$ とします。ここで $$m$$ はその値の出現回数です。値を含まない区間は必ず一つの部分に収まり、異なる部分にまたがることはありません。よって、その値を含む区間数は

$$
\frac{N(N+1)}2-\sum_{t=0}^{m}\frac{g_t(g_t+1)}2
$$

です。例の値2では、出現位置1と3の間の長さ1だけが寄与し、$$6-1=5$$ となります。これは[ABC371 Eの公式解説](https://atcoder.jp/contests/abc371/editorial/10922)の数え方です。値別に出現位置を並べて処理しても、全部の出現回数の和は $$N$$、部分の総数は $$N+|V|$$ なので、全体で線形時間に収まります。

代表へ割り当てる方法と、含まない範囲を引く方法は、同じ「値と区間の組」を別の分け方で数えています。どちらでも、何が一意に決まり、何を一回だけ数えるかを言えることが正当性の核です。

### 三つ組は、中央を固定して残りを分類する

三つの位置 $$i<j<k$$ を選ぶ問題では、中央 $$j$$ を固定すると、残りの位置の条件を $$i<j$$ と $$k>j$$ に分けられます。左端 $$i$$ だけを固定した場合は、まだ $$j<k$$ という関係が残るので、中央固定をまず試す理由があります。

ただし、左右の候補数をそのまま掛けてよいかは、位置以外の条件にもよります。残った条件が左右を結び付けるなら、条件を確認せずに全候補数を掛けることはできません。

[ABC308 E「MEX」](/problems/abc308-e/)では、文字列から `M`, `E`, `X` をこの順に選び、対応する三つの値の mex を足します。mexとは、それらに含まれない最小の非負整数です。値はいずれも0, 1, 2です。

仕組みを見るため、次の小例を使います。

```text
位置:  1 2 3 4 5
文字:  M M E X X
値:    0 0 1 2 0
```

中央は位置3に決まります。左に `M` が2個、右に `X` が2個あるため、三つ組は4個です。しかし得点は一様ではありません。

- 右に位置4の値2を選ぶ2組は、値が $$(0,1,2)$$ なので mex は3。寄与は $$2\times1\times3=6$$。
- 右に位置5の値0を選ぶ2組は、値が $$(0,1,0)$$ なので mex は2。寄与は $$2\times1\times2=4$$。

合計は10です。添字を一つずつ区別する代わりに、**同じ得点になる値の組へまとめ、その組数を掛ける**と計算できます。

一般に、中央 $$j$$ より左にある「値 $$a$$ の `M`」の個数を $$L_j[a]$$、右にある「値 $$b$$ の `X`」の個数を $$R_j[b]$$ とします。$$S_j=\mathrm E$$ である中央一つの寄与は、

$$
\sum_{a=0}^{2}\sum_{b=0}^{2}
L_j[a]R_j[b]\operatorname{mex}(a,A_j,b)
$$

です。$$j,a,b$$ を固定すれば得点が決まり、その分類内では左右のどの候補を組み合わせても有効です。また、各三つ組は中央と左右の値を一意に持つので、異なる分類へ重複して入りません。

毎回左右を数え直すと $$O(N^2)$$ 時間かかります。左の個数をすべて0、右の個数を入力全体の `X` の個数で初期化し、中央を左から右へ動かします。現在位置が `X` なら先に右から除き、`E` なら9通りの値の組を加算し、`M` なら最後に左へ加えます。この順にすれば、寄与を求める時点で左は $$i<j$$、右は $$k>j$$ だけを数えます。

初期集計を含めて時間 $$O(N)$$、左右のカウンタは計6個です。入力の配列と文字列を保存するので、全空間は $$O(N)$$、入力以外の追加空間は $$O(1)$$ です。[公式解説](https://atcoder.jp/contests/abc308/editorial/6708)のように値別の累積和を用意しても、同じ式を評価できます。

[ABC318 E「Sandwiches」](/problems/abc318-e/)では、同じ中央固定でも左右の値を等しくし、中央とは異なる値に限ります。左右を値別に数え、同じ値同士の個数の積を足す必要があります。値の種類は最大 $$N$$ なので、各中央で全値を調べると二次時間です。固定による式の簡略化に加え、中央を動かしたときにどの集計値だけが変わるかを見る段階へ進みます。

### 期待値は、各単位が現れる確率を足す

「種類数の期待値」も、種類ごとに指示変数を置けば同じ見方で扱えます。まず、赤2個・青1個・緑1個のキャンディから、2個を一様に選ぶ例を考えましょう。同じ赤でも二つのキャンディは別物です。

選び方は6通りあり、赤同士の1通りは1色、それ以外の5通りは2色なので、種類数の期待値は $$11/6$$ です。これを、色ごとに数え直します。

赤が選ばれたら1、選ばれなければ0となる指示変数を $$I_{\mathrm R}$$ とし、青・緑にも $$I_{\mathrm B},I_{\mathrm G}$$ を定めます。どの選択結果でも、種類数 $$X$$ は

$$
X=I_{\mathrm R}+I_{\mathrm B}+I_{\mathrm G}
$$

です。赤を含む選び方は、青と緑だけを選ぶ1通りを除いた5通りです。青を含む選び方は残り3個から相手を選ぶ3通りで、緑も同様です。したがって

$$
\mathbb E[X]=\frac56+\frac36+\frac36=\frac{11}{6}
$$

となります。

ここで、色の登場は独立ではありません。青と緑が両方選ばれる確率は $$1/6$$ であり、それぞれの確率の積 $$1/2\times1/2=1/4$$ と異なります。それでも期待値を足せる理由を確認します。

起こり得る結果の有限集合を $$\Omega$$、結果 $$\omega$$ の確率を $$p_\omega$$ とします。期待値は「各結果の値にその確率を掛けた総和」です。種類などの集合 $$U$$ に対して $$X(\omega)=\sum_{u\in U}I_u(\omega)$$ と書けるなら、

$$
\begin{aligned}
\mathbb E[X]
&=\sum_{\omega\in\Omega}p_\omega\sum_{u\in U}I_u(\omega)\\
&=\sum_{u\in U}\sum_{\omega\in\Omega}p_\omega I_u(\omega)\\
&=\sum_{u\in U}\Pr(I_u=1)
\end{aligned}
$$

です。二行目は有限和の順序交換、三行目は指示変数が1になる結果の確率だけを足す操作です。これが期待値の線形性であり、独立性を仮定する箇所はありません。各単位に結果によらない重み $$w_u$$ が付く場合も、$$X=\sum_u w_uI_u$$ と分ければ、$$\mathbb E[X]=\sum_u w_u\Pr(I_u=1)$$ となります。

[ABC215 G「Colorful Candies 2」](/problems/abc215-g/)では、$$N$$ 個から $$K$$ 個を一様に選びます。ある色が $$n_x$$ 個あるとき、その色を少なくとも一つ選ぶ確率は、「その色を一つも選ばない確率」を引けば求まります。

$$
\Pr(I_x=1)=1-\frac{\binom{N-n_x}{K}}{\binom NK}
$$

ここで $$\binom ab$$ は $$a$$ 個から $$b$$ 個を選ぶ組合せ数で、$$b>a$$ なら0とします。分子はその色以外から選ぶ場合の数、分母は全選択の場合の数です。各色についてこの確率を足せば、色の組合せ全体を列挙せずに期待値を得られます。

ただし、これで全体の高速化が終わるとは限りません。この問題はすべての $$K=1,\ldots,N$$ に答えるため、組合せ数を定数時間で計算できても、毎回全色を走査すれば最悪 $$O(N^2)$$ 時間です。個別解説では、確率が色の個数 $$n_x$$ だけに依存することを使い、同じ個数の色をまとめるところまで進みます。

## 成立条件と計算量

### 固定する軸は、残った条件から選ぶ

最初に、完成形一つの得点をどの単位の和にできるかを考えます。そのうえで、各単位を固定したときに残る条件を式にします。要素・値・中央・端点のどれを選ぶかは、その条件を少ない情報で数えられるかによって決まります。

- **要素を固定する。** 区間和の総和のように、含まれるたびに値を加えるなら位置ごとに分ける。左右の端点が自由に選べれば、個数の積へまとめられる。
- **値を固定する。** 種類数のように、何回現れても一回だけ加えるなら値ごとの指示変数にする。複数の出現がある場合は、一意な代表へ割り当てるか、その値を含まない場合を引く。
- **中央を固定する。** 順序付き三つ組で、左右の位置条件を分離したいときに試す。残る値の条件や得点によって候補を分類し、分類内の選択がすべて有効かを確認する。
- **端点を固定する。** 右端を一つ進めたときに、条件を満たす左端の範囲や寄与の変化だけを更新できるなら、区間全体を作り直す必要がなくなる。

たとえば[ABC247 E「Max Min」](/problems/abc247-e/)では、区間の最大値と最小値を指定します。条件は区間内の値を一つずつ加える形には分かれませんが、右端を固定すると、必要な値の最後の出現と、許されない値の最後の出現から左端の範囲を数えられます。一つの集計軸で数えにくいときは、完成形を別の一意な軸で分け直す候補を持ちましょう。

### 和へ分けられることと、各項を安く求められることを分ける

順序交換は、有限個の寄与を加算する場合に使えます。整数を法で扱う加算でも同様です。一方、最大値を要素の値の和へ置き換えるなど、元の得点と一致しない分解はできません。最大値を値ごとの指示変数へ分解するなら、その等式自体を別途導く必要があります。

計算量は、**固定する対象の個数 × 一対象の寄与を求める費用**に、初期化・ソート・前計算を加えて評価します。種類別の式ができても、種類数が多ければ重いままです。今回の三つ組で速かったのは、左右の値が3種類ずつで、移動時の更新も定数回で済んだからです。値別の累積和や頻度表、必要ならFenwick Treeなど、内側の集計を処理する道具は条件に合わせて選びます。

累積和は区間の情報を取り出す道具で、寄与分解は何を足すかを設計する考え方です。両者は組み合わせて使えます。また、時刻順の更新を扱う問題でも、「各時刻の全要素を更新する」処理を「一要素が有効だった期間の寄与」へ交換できる場合があります。[ABC347 E「Set Add Query」](/problems/abc347-e/)は、その接続を学ぶ問題です。時刻順の走査自体の設計は[event sweepの単元](/learn/modeling/event-sweep/)で扱います。

### 境界では、何を一回とするかを確かめる

区間の最初の出現へ割り当てる式では、前の出現がないときの0が左端1を許します。隣接した同値要素でも、後ろの要素が最初になる左端はその位置一つだけあり、$$i-p_i=1$$ になります。すべて同じ値なら種類数は各区間で1なので、答えは $$N(N+1)/2$$。すべて異なれば種類数は区間長に等しく、位置を含む区間数を足す式と一致します。

中央固定では現在位置を左右両方から除き、厳密な $$i<j<k$$ を守ります。左または右に候補がなければ積は0です。確率では、一様に選ぶときだけ「場合の数の比」をそのまま使えます。一様でなくても期待値の線形性は成立しますが、各結果の実際の確率を用いる必要があります。

中間値の大きさも確認します。区間ごとの種類数の総和は最大で

$$
\sum_{i=1}^{N}i(N-i+1)=\frac{N(N+1)(N+2)}6
$$

です。これは各区間の長さの総和でもあります。32 bit整数では不足する入力があり、要素の値や得点を掛ける問題ではさらに大きくなります。代入先だけでなく、積の計算を始める型から必要な幅を確保します。

この単元から問題一覧へ進むときは、**一つの完成形の得点を分ける → 加算単位を固定する → 漏れと重複を確認する → 内側の集計をまとめる**、という順で自分の式を作ってみてください。まずABC371 Eで代表と余事象を、ABC318 E・ABC308 Eで中央固定と値別集計を確かめると、同じ「総和」の要求でも固定すべき軸が変わる理由を比較できます。

## 前提と範囲

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。

### このUnitでは扱わないもの

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 問題一覧

- [ABC233 E「Σ[k=0..10^100]floor(X／10^k)」](https://atcoder.jp/contests/abc233/tasks/abc233_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC371 E「I Hate Sigma Problems」](https://atcoder.jp/contests/abc371/tasks/abc371_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC318 E「Sandwiches」](https://atcoder.jp/contests/abc318/tasks/abc318_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC308 E「MEX」](https://atcoder.jp/contests/abc308/tasks/abc308_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC365 E「Xor Sigma Problem」](https://atcoder.jp/contests/abc365/tasks/abc365_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC324 E「Joint Two Strings」](https://atcoder.jp/contests/abc324/tasks/abc324_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC347 E「Set Add Query」](https://atcoder.jp/contests/abc347/tasks/abc347_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC423 E「Sum of Subarrays」](https://atcoder.jp/contests/abc423/tasks/abc423_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC379 E「Sum of All Substrings」](https://atcoder.jp/contests/abc379/tasks/abc379_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC247 E「Max Min」](https://atcoder.jp/contests/abc247/tasks/abc247_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC334 E「Christmas Color Grid 1」](https://atcoder.jp/contests/abc334/tasks/abc334_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC280 E「Critical Hit」](https://atcoder.jp/contests/abc280/tasks/abc280_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。
- [ABC418 E「Trapezium」](https://atcoder.jp/contests/abc418/tasks/abc418_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC436 F「Starry Landscape Photo」](https://atcoder.jp/contests/abc436/tasks/abc436_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC411 E「E [max]」](https://atcoder.jp/contests/abc411/tasks/abc411_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。追加で学ぶ技能: [可逆な非零剰余と剰余 0 因子を含む法上の動的積](/learn/number-theory/dynamic-modular-product/)（法 m 上の積で一因子を差し替えるとき、取り得る因子のうち非零剰余がすべて可逆かを確認し、剰余 0 の因子数と可逆な非零剰余因子の積を分離して、可逆な旧因子を逆元で除き新因子を掛けて更新後の積を復元できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC378 E「Mod Sigma Problem」](https://atcoder.jp/contests/abc378/tasks/abc378_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC396 F「Rotated Inversions」](https://atcoder.jp/contests/abc396/tasks/abc396_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC290 E「Make it Palindrome」](https://atcoder.jp/contests/abc290/tasks/abc290_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC255 E「Lucky Numbers」](https://atcoder.jp/contests/abc255/tasks/abc255_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC306 F「Merge Sets」](https://atcoder.jp/contests/abc306/tasks/abc306_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC261 F「Sorting Color Balls」](https://atcoder.jp/contests/abc261/tasks/abc261_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC220 E「Distance on Large Perfect Binary Tree」](https://atcoder.jp/contests/abc220/tasks/abc220_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [対称性・深さ・label区間で巨大な完全二分木を数える](/learn/tree/implicit-binary-tree/)（同じ深さの対称性と2冪で距離splitを集約するか、heap番号の祖先case分解と子孫label区間を使い、巨大な完全二分木を展開せず数えられる。）。
- [ABC269 F「Numbered Checker」](https://atcoder.jp/contests/abc269/tasks/abc269_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。）。
- [ABC439 F「Beautiful Kadomatsu」](https://atcoder.jp/contests/abc439/tasks/abc439_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC407 F「Sums of Sliding Window Maximum」](https://atcoder.jp/contests/abc407/tasks/abc407_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC390 F「Double Sum 3」](https://atcoder.jp/contests/abc390/tasks/abc390_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC438 F「Sum of Mex」](https://atcoder.jp/contests/abc438/tasks/abc438_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [ancestor query・LCA](/learn/tree/tree-ancestor-lca/)（binary lifting等を前計算し、level ancestor・LCA・木距離をqueryとして取得できる。）。
- [ABC380 G「Another Shuffle Window」](https://atcoder.jp/contests/abc380/tasks/abc380_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。） / [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。
- [ABC295 E「Kth Number」](https://atcoder.jp/contests/abc295/tasks/abc295_e) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC362 F「Perfect Matching on a Tree」](https://atcoder.jp/contests/abc362/tasks/abc362_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（非負頂点重みの総和に対し、除去後の各成分を半分以下にする一点を線形時間で選び、通常の頂点数重心と葉数重心を区別できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC215 G「Colorful Candies 2」](https://atcoder.jp/contests/abc215/tasks/abc215_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC268 G「Random Student ID」](https://atcoder.jp/contests/abc268/tasks/abc268_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。）。
- [ABC295 F「substr = S」](https://atcoder.jp/contests/abc295/tasks/abc295_f) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC231 G「Balls in Boxes」](https://atcoder.jp/contests/abc231/tasks/abc231_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC330 G「Inversion Squared」](https://atcoder.jp/contests/abc330/tasks/abc330_g) — 主題: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC216 F「Max Sum Counting」](https://atcoder.jp/contests/abc216/tasks/abc216_f) — 主題: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC219 H「Candles」](https://atcoder.jp/contests/abc219/tasks/abc219_h) — 主題: [区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)（訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC221 E「LEQ」](https://atcoder.jp/contests/abc221/tasks/abc221_e) — 主題: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](/learn/query/weighted-prefix-fenwick/)（処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC221 F「Diameter set」](https://atcoder.jp/contests/abc221/tasks/abc221_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC222 E「Red and Blue Tree」](https://atcoder.jp/contests/abc222/tasks/abc222_e) — 主題: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC224 F「Problem where +s Separate Digits」](https://atcoder.jp/contests/abc224/tasks/abc224_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC238 Ex「Removing People」](https://atcoder.jp/contests/abc238/tasks/abc238_h) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC258 G「Triangle」](https://atcoder.jp/contests/abc258/tasks/abc258_g) — 主題: [bitsetで集合演算をword並列化する](/learn/query/bitset-word-parallel/)（集合をbit列へ符号化し、交差・和・shift・popcountをword並列に実行した計算量を評価できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC262 Ex「Max Limited Sequence」](https://atcoder.jp/contests/abc262/tasks/abc262_h) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC277 G「Random Walk to Millionaire」](https://atcoder.jp/contests/abc277/tasks/abc277_g) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC280 G「Do Use Hexagon Grid 2」](https://atcoder.jp/contests/abc280/tasks/abc280_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。追加で学ぶ技能: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC283 Ex「Popcount Sum」](https://atcoder.jp/contests/abc283/tasks/abc283_h) — 主題: [格子点転置によるfloor_sum](/learn/number-theory/euclidean-floor-sum/)（Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC297 F「Minimum Bounding Box 2」](https://atcoder.jp/contests/abc297/tasks/abc297_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC314 F「A Certain Game」](https://atcoder.jp/contests/abc314/tasks/abc314_f) — 主題: [DSU merge tree・Kruskal reconstruction tree](/learn/tree/dsu-merge-tree/)（成分併合ごとに新しい親nodeを作り、併合時刻・threshold・成分包含を一つのrooted treeへ記録する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC321 G「Electric Circuit」](https://atcoder.jp/contests/abc321/tasks/abc321_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC326 E「Revenge of "The Salary of AtCoder Inc."」](https://atcoder.jp/contests/abc326/tasks/abc326_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC351 E「Jump Distance Sum」](https://atcoder.jp/contests/abc351/tasks/abc351_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC353 E「Yet Another Sigma Problem」](https://atcoder.jp/contests/abc353/tasks/abc353_e) — 主題: [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC359 G「Sum of Tree Distance」](https://atcoder.jp/contests/abc359/tasks/abc359_g) — 主題: [木の均衡分離点から重心分解へ進む](/learn/tree/tree-balanced-separators/)（各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC386 G「Many MST」](https://atcoder.jp/contests/abc386/tasks/abc386_g) — 主題: [label付き連結成分分解・exponential formula](/learn/combinatorics-algebra/labeled-component-decomposition/)（最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。）。追加で学ぶ技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC390 G「Permutation Concatenation」](https://atcoder.jp/contests/abc390/tasks/abc390_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC401 F「Add One Edge 3」](https://atcoder.jp/contests/abc401/tasks/abc401_f) — 主題: [基準点からの木距離・剰余類・直径・中心](/learn/tree/tree-metric/)（一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC417 F「Random Gathering」](https://atcoder.jp/contests/abc417/tasks/abc417_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC433 F「1122 Subsequence 2」](https://atcoder.jp/contests/abc433/tasks/abc433_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC455 F「Merge Slimes 2」](https://atcoder.jp/contests/abc455/tasks/abc455_f) — 主題: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC464 F「Random Vault Heist」](https://atcoder.jp/contests/abc464/tasks/abc464_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

## 根拠

本文の具体例と式は、以下の公式問題文・個別公式解説の条件を確認して構成した。区間内の最初の出現へ割り当てる数え方は、本文中で対応を示した。

- [ABC371 E 公式問題文](https://atcoder.jp/contests/abc371/tasks/abc371_e)・[公式解説](https://atcoder.jp/contests/abc371/editorial/10922) — 値ごとの寄与と、含まない区間による計数。
- [ABC308 E 公式問題文](https://atcoder.jp/contests/abc308/tasks/abc308_e)・[公式解説](https://atcoder.jp/contests/abc308/editorial/6708) — 中央固定・値別頻度による重み付き集計。
- [ABC318 E 公式問題文](https://atcoder.jp/contests/abc318/tasks/abc318_e)・[公式解説（英語）](https://atcoder.jp/contests/abc318/editorial/7082) — 中央固定後の値別集計と差分更新。
- [ABC247 E 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_e)・[公式解説](https://atcoder.jp/contests/abc247/editorial/3736) — 指定した最大値・最小値をともに含む区間の条件。
- [ABC347 E 公式問題文](https://atcoder.jp/contests/abc347/tasks/abc347_e)・[公式解説](https://atcoder.jp/contests/abc347/editorial/9698) — 要素が集合に属する期間ごとの寄与。
- [ABC215 G 公式解説（英語）](https://atcoder.jp/contests/abc215/editorial/2516) — 指示変数・余事象と頻度別集約。

既存の分類・問題配置に対応する出典:

- [ABC215 G 公式解説](https://atcoder.jp/contests/abc215/editorial/2497)
- [ABC215 G 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_g)
- [ABC216 F 公式解説](https://atcoder.jp/contests/abc216/editorial/2560)
- [ABC216 F 公式問題文](https://atcoder.jp/contests/abc216/tasks/abc216_f)
- [ABC219 H 公式解説](https://atcoder.jp/contests/abc219/editorial/2601)
- [ABC219 H 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-contribution-reordering`
