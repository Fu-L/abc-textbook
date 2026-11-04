---
title: '再帰分割・分割統治'
description: '「再帰分割・分割統治」で学ぶ概念と、基礎から応用へ進む問題一覧。'
draft: false
headingAliases:
  '再帰分割分割統治-1': '概要'
  '発展時刻順の寄与を分割する': '左の結果が右へ影響する場合の処理順'
  '積木の層ごとの仕事量': '多数の因子は同じくらいの大きさで掛ける'
sidebar:
  order: 7
---

# 再帰分割・分割統治

習得対象の目安:
**水色（1200–1599）**。分割・再帰・併合の役割を分け、重複のない合成と計算量を説明する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

同じ形の小問題に分けると、全体を直接解くよりも簡単になることがある。ただし、小問題を解いただけで親の答えが出るとは限らない。**子から何を受け取り、子だけでは処理できなかった何を親が担当するか**まで決めるのが分割統治の設計である。

この単元では、転倒数を小さい例にして、分割・再帰・合成の役割を作る。その後、列の最適化、区間の問い合わせ、値による分割へ広げ、中央で分ける場合と、性質を固定する位置で分ける場合の計算量の違いを学ぶ。

## 考え方

### 左右の個数だけでは、境界をまたぐ組が分からない

列 $$(4,1,3,2)$$ の転倒数を求めよう。長さ $$n$$ の列を $$A_1,\ldots,A_n$$ とすると、転倒とは $$i<j$$
かつ $$A_i>A_j$$ を満たす添字の組 $$(i,j)$$ である。全組を比較すれば $$O(n^2)$$ 時間かかる。

中央で $$(4,1)$$ と $$(3,2)$$ に分けてみる。転倒は、左内部の $$(4,1)$$、右内部の
$$(3,2)$$、左右をまたぐ $$(4,3),(4,2)$$
の合計4個だ。左右内部の問題は元と同じ形なので、再帰的に解けそうである。

残った課題は左右をまたぐ組である。左右内部の転倒数だけを返しても、値の大小関係は分からない。かといって毎回左右の全組を比較すれば、最初の合成だけで二乗時間を使ってしまう。

そこで、**各子から転倒数と整列済みの列を返す**。左を整列しても、元の左半分の各要素は元の右半分のどの要素よりも左にあったという関係を保てる。左右の内部で添字を並べ替えることは、左右をまたぐ転倒を数える妨げにならない。

### 整列済みなら、まとめて数えられる

子から $$(1,4)$$ と $$(2,3)$$
が返ってきたとする。両方の先頭を比べ、小さいほうを取り出して一つの整列列へ併合する。

| 次に取り出す値 | 左に残る値 | 右に残る値 | この段階で加える転倒数 |
| -------------- | ---------- | ---------- | ---------------------: |
| 左の1          | $$(1,4)$$  | $$(2,3)$$  |                      0 |
| 右の2          | $$(4)$$    | $$(2,3)$$  |                      1 |
| 右の3          | $$(4)$$    | $$(3)$$    |                      1 |
| 左の4          | $$(4)$$    | 空         |                      0 |

表の「残る値」は取り出す直前の状態である。右の値が左の先頭より小さいなら、整列されている左の残りすべてより小さい。左の残りの個数だけ、左右をまたぐ転倒がある。右の2と3を取り出す際に1個ずつ加算し、整列列
$$(1,2,3,4)$$ を作る。

左内部の1個、右内部の1個と合わせて4個を返せば、親の問題が解けた。値が等しいときは転倒ではないので左を先に取り出す。例えば左右に同じ2があっても、その組を加算しないためである。

### 各組が、初めて左右へ分かれた場所で担当される

手順を一般の区間へまとめると、長さ0または1なら転倒数0とその列を返す。それより長ければ中央で二つに分け、子を再帰的に解く。二つの整列列を併合し、右の先頭が左の先頭より小さいときに左の残りの個数を加える。最後に左右内部と左右をまたぐ個数の合計、および併合済みの列を返す。

正しさは、各転倒をどこが数えるかで確認できる。二つの添字が同じ子へ入る間は、その子へ処理を任せる。再帰を下って初めて左右へ分かれた呼出しで、必ず左右をまたぐ組として数える。それより下では両方の添字を含む子がなく、それより上では同じ子の内部として扱われるので、別の呼出しが二重に数えることもない。

また、併合は左右の全要素をちょうど一度出力し、常に残りの最小値を取り出すので、親へ返す列も整列済みになる。個数が正しいだけでなく、次の合成で必要な情報も正しく返せる。この二つを合わせた性質を各呼出しで保つ。

### 子の最適解だけで足りるかを確かめる

数え上げ以外でも、親の解が子の結果から作れるなら同じ構造が使える。ただし、子を別々に最適化してよい理由が必要だ。

[ABC413 E](/problems/abc413-e/)では、2の累乗の長さを持つ順列を扱う。添字を0から数え、長さが2の累乗で、その長さの倍数から始まる区間を反転できる。列全体を左右半分へ分けると、全体以外の反転は必ず一方の半分の内部に収まる。全体を反転しても二つの半分が丸ごと入れ替わるだけで、一部の要素だけを混ぜることはできない。

全体反転では各半分の内部も逆順になるが、その反転自体が子の区間でも許されている。したがって、全体反転を挟んでも、各半分で作れる並びの範囲は変わらない。

さらに、左右をそれぞれ反転してから全体を反転すれば、各半分の内部順序を保ったまま、左右を交換できる。左を
$$U$$、右を $$V$$、反転を $$\operatorname{rev}$$ と書くと、

$$
(U,V)\longrightarrow
(\operatorname{rev}(U),\operatorname{rev}(V))
\longrightarrow(V,U)
$$

である。したがって、各半分の中で作れる列を選び、その二つをどちらの順で置くか、という小問題へ帰着できる。

独自例 $$(7,2,6,4,8,1,5,3)$$ を、長さ1まで分けてから合成してみよう。

| 合成する長さ | 各区間で作れる辞書順最小の列               |
| ------------ | ------------------------------------------ |
| 2            | $$(2,7)$$、$$(4,6)$$、$$(1,8)$$、$$(3,5)$$ |
| 4            | $$(2,7,4,6)$$、$$(1,8,3,5)$$               |
| 8            | $$(1,8,3,5,2,7,4,6)$$                      |

親で二つの列を並べるとき、前に置いた半分の内部の比較が、後ろの半分より先に効く。そのため、各半分をそれぞれ辞書順最小にしておいてよい。要素は相異なるので、左右の最小列の先頭を比べ、小さいほうを前へ置けば、二つの並べ方のうち小さいものが決まる。

一般の最適化で子の最小値を一つ返すだけで済むとは限らない。例えば左右に合計予算がある問題では、左の最良解が予算を使い切り、右と組み合わせられないことがある。予算別の表など、親の制約を満たすための選択肢を残す必要がある。

### 問い合わせも、境界をまたぐ場所へ割り当てる

[ABC426 G](/problems/abc426-g/)では、指定された区間から重みの総和が容量以下となるように品物を選ぶナップサック問題へ、何度も答える。入力区間
$$[l,r]$$ を中央の $$m$$ で $$[l,m]$$ と $$[m+1,r]$$ に分け、問い合わせ区間 $$[L,R]$$
を次の三種類に分ける。

- $$R\leq m$$ なら左の子へ渡す。
- $$L>m$$ なら右の子へ渡す。
- $$L\leq m<R$$ なら、この呼出しで答える。

左右をまたぐ問い合わせには、中央から左へ伸ばした各区間と、中央から右へ伸ばした各区間について、容量ごとの最大価値を作っておく。最大容量を
$$C$$ とすると、長さ $$s$$ の区間でこれらの表を作る費用は $$O(sC)$$
である。各表は、品物を一つ加えるたびに、それを選ばない場合と選ぶ場合の最大を容量ごとに計算すれば作れる。

問い合わせ $$[L,R]$$ の容量を $$c$$、左側 $$[L,m]$$ で容量 $$t$$ 以下の最大価値を $$F_L(t)$$、右側
$$[m+1,R]$$ で容量 $$t$$ 以下の最大価値を $$F_R(t)$$ とする。答えは

$$
\max_{0\leq t\leq c}\bigl(F_L(t)+F_R(c-t)\bigr)
$$

であり、$$O(C)$$ で求まる。どの合法な選択も左右に分かれ、左の実際の重みを $$t$$
に取れば右は残り容量に収まる。逆に、式の各組は合計容量を超えない。これが容量別の表で十分な理由である。

長さ1まで同じ子へ入った問い合わせは、その品物を選べるかで答える。それ以外の問い合わせは初めて境界をまたいだ場所で一度だけ答えるので、高価な合成をすべての階層で繰り返す必要がない。

## 成立条件と計算量

### 再帰の深さと、一段の合計費用を分ける

転倒数の例で、長さ $$s$$ の区間を処理する時間を $$T(s)$$
とする。左右をほぼ同じ長さに分け、併合では各要素を一度ずつ取り出すから、

$$
T(s)=T(\lfloor s/2\rfloor)+T(\lceil s/2\rceil)+O(s)
$$

となる。同じ深さの区間は互いに重ならず、長さの合計は $$n$$ 以下。深さは $$O(\log n)$$ なので、時間は
$$O(n\log n)$$ である。入力配列、使い回す併合用配列、深さ $$O(\log n)$$ のスタックを合わせて
$$O(n)$$ 空間となる。数える組は最大 $$n(n-1)/2$$ 個なので、個数を格納する整数型にも注意する。

ABC413 Eでも、各合成で列を実際にコピーして作るなら一段の合計が列の長さに比例する。列長を $$M$$
とすると時間は
$$O(M\log M)$$。子の列を合成後に解放する深さ優先の実装では、入力・返す列・作業中の列とスタックを合わせて
$$O(M)$$ 空間で済む。再帰木の全節点の列を保存し続けるなら、空間は $$O(M\log M)$$ になる。

ABC426 Gでは、品物数を $$n$$、問い合わせ数を $$q$$ とすると、表を作る費用が各深さで
$$O(nC)$$、問い合わせの合成は全体で $$O(qC)$$。問い合わせを子へ配る走査も含めると、時間は
$$O(nC\log n+q\log n+qC)$$
となる。容量表を使い回し、処理済みの親の表を保持し続けなければ、入力と問い合わせも含め $$O(nC+q+n)$$
空間で実行できる。合成回数と問い合わせを振り分ける回数は区別して数えよう。

### 中央以外で分けるなら、別の根拠で総量を抑える

分割点は、中央に置けばよいとは限らない。[ABC282 Ex](/problems/abc282-ex/)では、区間の最小値と別の列の区間和を足した値が上限以下になる区間を数える。現在の区間で最小値を取る位置
$$p$$ を一つ選ぶと、$$p$$ を含む区間では最小値が固定される。これらをその場で数え、$$p$$
の左右に完全に収まる区間は子へ渡せる。最小値が複数あっても、例えば最も左の位置を選ぶと決めれば担当が曖昧にならない。

ただし、単調な列では最小値が毎回端に来て、再帰の深さは $$O(n)$$
になる。各呼出しで区間全体を走査すると二乗時間になり得る。そこで、左右の端点候補のうち短い側だけを列挙し、他方は累積和上の二分探索で数える。区間和を構成する値が非負なので、一方の端点を固定したときに他方の許容範囲が単調になる。

端点を選ぶ二つの範囲は $$[l,p]$$ と $$[p,r]$$ で、長さ $$s$$ に対して長さの和が $$s+1$$
である。列挙する側は高々 $$(s+1)/2$$
個。その要素が子に残って再び列挙されるなら、次に入る区間の長さは、その側から $$p$$ を除いた高々
$$(s-1)/2$$ 個になる。したがって一つの添字が列挙される回数は $$O(\log n)$$。各回の二分探索が
$$O(\log n)$$ なら合計 $$O(n\log^2 n)$$ となる。

この評価には、最小値の位置を毎回全走査しない準備も必要だ。例えば区間最小値とその位置を返す[セグメント木](/learn/query/monoid-segment-tree/)を使えば、全体の位置取得は
$$O(n\log n)$$ に収まる。入力・索引・累積和と、明示的なスタックで持つ未処理区間を合わせて $$O(n)$$
空間で実行できる。再帰関数を使う場合は深さも $$O(n)$$
になり得るので、呼出しスタックの上限を確かめる。

ここで高速化を保証したのは再帰木全体の高さではなく、列挙を負担する要素が次に属する問題の縮小である。中央分割と同じ理由で
$$O(\log n)$$ 段だと考えないことが大切だ。

### 区間以外の分割と、先に確定させるべきもの

整数の集合を上位ビットの0と1で分けることもできる。$$n$$ 個の $$b$$
ビット整数なら、次に見る桁を一つずつ下げるので深さは高々 $$b$$。各桁で要素を一度走査するだけなら
$$O(nb)$$
時間だが、異なる側の組の処理に追加費用があれば、それも加える。入力と二群への振り分け用配列を使い回すなら
$$O(n+b)$$
空間で済む。0と1へ分かれる最高位の桁で何が決まり、下位のどんな情報がまだ必要かを確認してから、[XOR閾値matching](/learn/modeling/xor-threshold-matching/)などへ進む。

### 左の結果が右へ影響する場合の処理順

時間の前半で確定した値を後半へ伝える場合には、順序も設計に含まれる。例えば時刻 $$0,1,2,3$$
の値を求め、早い時刻から遅い時刻へ寄与があるとしよう。左右を $$\{0,1\}$$ と $$\{2,3\}$$
に分けると、左内部の寄与は $$0\to1$$、右内部は $$2\to3$$、左右をまたぐものは
$$0\to2,0\to3,1\to2,1\to3$$ になる。

右を先に解くと、2の値を確定する前に左からの寄与を受け取れていない。そこで左を解き、左から右への寄与をまとめて反映し、それから右を解く。この順で添字区間を再帰的に処理する方法はCDQ分割統治と呼ばれる。

各呼出しでは、「それ以前の時刻の値は確定済みで、それらから担当区間への寄与は反映済み」と保つ。左の計算を終えると交差更新の元の値が確定し、交差更新を終えると右もこの条件を満たして解ける。一つの寄与は、元と先の時刻が初めて左右に分かれた呼出しで一度だけ反映する。交差更新に使った一時的な集計用データは、その担当を終えたら取り消し、別の呼出しへ混ぜない。

交差更新を全組比較より速くできるかが、ここでも鍵になる。長さ $$s$$ の区間で $$O(s\log s)$$
時間に集計できれば、各深さの合計は $$O(n\log n)$$、全体は $$O(n\log^2 n)$$
時間となる。入力・状態配列と、使い回せる $$O(s)$$ の集計領域で実行できる場合は、全空間も $$O(n)$$
にできる。どの集計を使えるかは寄与の式に依存する。この発展はABC213
Hなどの[online convolution](/learn/combinatorics-algebra/relaxed-convolution/)へつながる。畳み込みなどの演算はリンク先で学べばよい。

### 多数の因子は、同じくらいの大きさで掛ける

多項式を多数掛ける場面も、分割統治の使い所である。一次式が8個あるとして、先頭から順に掛けると、次数2、3、4、…、8の積を一つずつ作る。一方、二つずつ掛ければ、次数2の積を4個、次数4の積を2個、次数8の積を1個作る。これらを木の形にしたものが積木である。各段階の次数の合計は8のままで、次数の大きい積を何度も作ることを避けられる。

一般に因子数を $$k$$、各因子の次数を $$d_i$$、次数の総和を $$D=\sum_{i=1}^k d_i$$
とする。同じ深さの節点は因子を共有しないので、その深さにある積の次数総和は $$D$$
以下である。結果の次数が $$d$$ の乗算を $$O((d+1)\log(d+2))$$ で実行できると仮定すれば、一段の合計は
$$O((D+k)\log(D+2))$$、因子数をほぼ等分した全体は

$$
O\bigl((D+k)\log(D+2)\log(k+1)\bigr)
$$

時間で抑えられる。$$k$$
の項は定数多項式の係数や節点の管理も数えるために必要だ。次数が偏っていれば、因子数を等しくすることと次数を等しくすることは異なる。実際に作る各積の費用を、この評価からさらに詰められるかを考える。

また、最後に次数 $$K$$ までしか必要ないとしても、この式の $$D$$ を単純に $$K$$
へ置き換えてはいけない。一次式が $$k$$
個あれば、低い段階ではそれらすべてを読み、組にして掛ける仕事が残る。各積を次数 $$K$$
で打ち切る効果は、各段階の積の本数と長さで評価する。

全節点の係数を保存するなら $$O((D+k)\log(k+1))$$
空間で抑えられる。深さ優先で合成後の子の係数を解放し、乗算の作業領域が係数数に比例するなら、入力も含めて
$$O(D+k)$$ 空間にできる。待機中の部分木が因子を共有せず、その次数総和も $$D$$
以下だからだ。乗算の高速化は[畳み込み](/learn/combinatorics-algebra/polynomial-convolution/)、積木から剰余を子へ渡す応用は[多項式の多点評価](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)で扱う。

[半分全列挙](/learn/modeling/meet-in-the-middle/)は左右の選択肢を列挙して相手を探す。一方、ここで学んだ分割統治は、小問題をさらに解く仕組みと合成の契約を作る。初見では、分割後の小問題が何か、返す情報で十分か、どの対象をその場で担当するか、分割と合成を通じた総費用はいくらかを順に確かめよう。

概念上の親: [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)、[XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)。

pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### 習得する技能

- 分割・再帰・合成の役割を区別し、子から返す情報と、候補の漏れや重複がない理由を説明できる。
- 各層の合成費用から全体の計算量を求め、発展として時刻順の寄与の集計や、多項式の積の合成へ応用できる。

### このUnitでは扱わないもの

- 再帰分割・分割統治の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC413 E「Reverse 2^i」](https://atcoder.jp/contests/abc413/tasks/abc413_e) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC426 G「Range Knapsack Query」](https://atcoder.jp/contests/abc426/tasks/abc426_g) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC282 Ex「Min + Sum」](https://atcoder.jp/contests/abc282/tasks/abc282_h) — 主題: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。既習技能: [冪等演算のoverlap range query・Sparse Table](/learn/query/idempotent-overlap-range-query/)（冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC213 H「Stroll」](https://atcoder.jp/contests/abc213/tasks/abc213_h) — 主題: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC230 H「Bullion」](https://atcoder.jp/contests/abc230/tasks/abc230_h) — 主題: [母関数方程式・高度な係数抽出](/learn/combinatorics-algebra/generating-function-coefficients/)（母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。）。追加で学ぶ技能: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC247 Ex「Rearranging Problem」](https://atcoder.jp/contests/abc247/tasks/abc247_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC260 Ex「Colorfulness」](https://atcoder.jp/contests/abc260/tasks/abc260_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC267 Ex「Odd Sum」](https://atcoder.jp/contests/abc267/tasks/abc267_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC269 Ex「Antichain」](https://atcoder.jp/contests/abc269/tasks/abc269_h) — 主題: [heavy path上の多項式木DP](/learn/tree/heavy-path-tree-dp/)（heavy child上の漸化式をまとめ、light subtreeのsize総和を利用して木DPの多項式合成を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。
- [ABC272 Ex「Flipping Coins 2」](https://atcoder.jp/contests/abc272/tasks/abc272_h) — 主題: [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（任意の評価点からproduct treeを構築し、剰余をremainder treeで下ろす不変量とO(M(n) log n)の計算量を説明できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC273 Ex「Inv(0,1)ving Insert(1,0)n」](https://atcoder.jp/contests/abc273/tasks/abc273_h) — 主題: [Stern–Brocot木の経路と祖先](/learn/number-theory/stern-brocot-ancestry/)（隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [small-to-large・DSU on Tree](/learn/modeling/small-to-large/)（小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC281 Ex「Alchemy」](https://atcoder.jp/contests/abc281/tasks/abc281_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC304 G「Max of Medians」](https://atcoder.jp/contests/abc304/tasks/abc304_g) — 主題: [XOR閾値matchingのbit分割再帰](/learn/modeling/xor-threshold-matching/)（整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [単調境界を証明して探索する](/learn/modeling/monotone-search/)（判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。）。
- [ABC317 Ex「Walk」](https://atcoder.jp/contests/abc317/tasks/abc317_h) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC331 G「Collect Them All」](https://atcoder.jp/contests/abc331/tasks/abc331_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。追加で学ぶ技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC345 G「Sugoroku 5」](https://atcoder.jp/contests/abc345/tasks/abc345_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC348 G「Max (Sum - Max)」](https://atcoder.jp/contests/abc348/tasks/abc348_g) — 主題: [Monge・monotone minima最適化](/learn/geometry-optimization/monge-optimization/)（quadrangle inequality/Monge性から各行の最適遷移位置が単調になることを示し、divide-and-conquerやSMAWKで最小値を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC352 G「Socks 3」](https://atcoder.jp/contests/abc352/tasks/abc352_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC357 G「Stair-like Grid」](https://atcoder.jp/contests/abc357/tasks/abc357_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。追加で学ぶ技能: [Relaxed・online convolution](/learn/combinatorics-algebra/relaxed-convolution/)（係数が順に確定する因果的畳み込みをblock分割し、確定済みblock間だけをNTTでまとめて更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC381 G「Fibonacci Product」](https://atcoder.jp/contests/abc381/tasks/abc381_g) — 主題: [拡大有限体の表現と四則演算を構成する](/learn/number-theory/finite-field-extension/)（基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。） / [多項式の多点評価・補間](/learn/combinatorics-algebra/polynomial-multipoint-evaluation/)（評価点ar^kの等比構造を使い、r≠0のとき二項指数の恒等式からchirp-z評価を一回の畳み込みへ変形できる。）。 畳み込みと等比点評価を前提に、拡大体で数列の一般項を指数の式へ変換する方法を学ぶ。周期の商を高速冪、余りを平方根幅のblockへ分ける。等比的な線形因子の積F_m(X)は、F_{2m}(X)=F_m(X)F_m(r^mX)型の倍化（定数因子を別管理）で作り、block始点の等比点でchirp-z評価する。一般多点評価のremainder treeをこの問題の採用解法と取り違えない。
- [ABC383 G「Bar Cover」](https://atcoder.jp/contests/abc383/tasks/abc383_g) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC385 G「Counting Buildings」](https://atcoder.jp/contests/abc385/tasks/abc385_g) — 主題: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。追加で学ぶ技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC425 G「Sum of Min of XOR」](https://atcoder.jp/contests/abc425/tasks/abc425_g) — 主題: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。既習技能: [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。
- [ABC439 G「Sugoroku 6」](https://atcoder.jp/contests/abc439/tasks/abc439_g) — 主題: [FPS合成・power projection](/learn/combinatorics-algebra/fps-composition-power-projection/)（多項式/FPSのcompositionとその転置であるpower projectionを、block分割・transposition・rational functionへ還元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [FPS基本演算と多項式の多点評価を行う](/learn/combinatorics-algebra/formal-power-series/)（定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。） / [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。）。既習技能: [NTT・FFTで畳み込みと相互相関を求める](/learn/combinatorics-algebra/polynomial-convolution/)（係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。） / [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [再帰分割・分割統治](/learn/modeling/recursive-divide-and-conquer/)（pivot・上位bit・短い側で部分問題へ再帰分割するか、部分結果をbalancedな積木・remainder tree・CDQで重複なく合成できる。）。

## 根拠

- [ABC282 Ex 公式問題文](https://atcoder.jp/contests/abc282/tasks/abc282_h)・[個別公式解説](https://atcoder.jp/contests/abc282/editorial/5404) — 最小値の位置での分割と短い側の端点列挙。
- [ABC426 G 公式問題文](https://atcoder.jp/contests/abc426/tasks/abc426_g)・[個別公式解説](https://atcoder.jp/contests/abc426/editorial/14152) — 問い合わせの一意な担当と容量別の最大価値の合成。
- [ABC413 E 公式問題文](https://atcoder.jp/contests/abc413/tasks/abc413_e)・[個別公式解説](https://atcoder.jp/contests/abc413/editorial/13406) — 反転区間の構造、左右の交換と辞書順最小列の合成。
- [ABC213 H 公式解説](https://atcoder.jp/contests/abc213/editorial/2396)
- [ABC213 H 公式問題文](https://atcoder.jp/contests/abc213/tasks/abc213_h)
- [ABC230 H 公式解説](https://atcoder.jp/contests/abc230/editorial/3003)
- [ABC230 H 公式問題文](https://atcoder.jp/contests/abc230/tasks/abc230_h)
- [ABC247 H 公式解説](https://atcoder.jp/contests/abc247/editorial/3737)
- [ABC247 H 公式問題文](https://atcoder.jp/contests/abc247/tasks/abc247_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-recursive-divide-and-conquer`
