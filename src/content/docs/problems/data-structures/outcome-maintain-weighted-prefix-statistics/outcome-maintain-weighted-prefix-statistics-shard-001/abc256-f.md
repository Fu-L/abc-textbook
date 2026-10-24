---
title: "ABC256-F — Cumulative Cumulative Cumulative Sum"
draft: true
authoringUnit: {"problemId":"abc256-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-weighted-prefix-statistics/outcome-maintain-weighted-prefix-statistics-shard-001/abc256-f.md","learningOutcomeIds":["outcome-maintain-weighted-prefix-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic","unit-prefix-aggregate"],"excludedTopics":["一般のモノイドによるSegment Treeの区間要約。"],"tagIds":["tag-fenwick-weighted-prefix","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc256-editorial-4131-5a56cfc1385cccb66caaa609b059936e87f87c1a1fe818c7857a8646d481623a","source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"三重和で固定した $$A_i$$ が現れるのは、添字が $$i\\leq j\\leq t\\leq x$$ を満たす項である。各 $$t$$ に対して $$j$$ は $$t-i+1$$ 通りなので、寄与係数は $$\\sum_{t=i}^{x}(t-i+1)$$ となる。考察の三角数と多項式への変形はこの全寄与を過不足なく数えている。\n\n各 Fenwick Tree が保持する点の値を、それぞれ現在の $$A_i,iA_i,i^2A_i$$ とする。初期値の点加算でこの条件は成立し、代入時に $$\\Delta,p\\Delta,p^2\\Delta$$ を加えると、位置 $$p$$ の値だけが新しい値に対応する重みへ変わる。したがって、何回更新しても三本の接頭辞和は定義した $$S_0(x),S_1(x),S_2(x)$$ に一致する。\n\nこの三つを展開式へ代入すれば、現在の配列の三重累積和が得られる。法 $$M=998244353$$ では2の逆元が存在するので、整数として導いた係数の式は法上でも成立する。よって、すべての取得クエリで正しい $$D_x\\bmod M$$ を返す。","sourceRevisionIds":["source-abc256-editorial-4131-5a56cfc1385cccb66caaa609b059936e87f87c1a1fe818c7857a8646d481623a","source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

- 処理済み値の頻度から反転数を数えるか、必要な添字付き接頭辞統計を導き、Fenwick Treeの線形結合で式を評価できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 一般のモノイドによるSegment Treeの区間要約。

## 考察

累積和を三回取り直す代わりに、元の一要素が答えに何回足されるかを数える。その回数を添字の多項式に直すと、必要な情報を三種類の重み付き接頭辞和にまとめられる。

問題の添字は1始まりとする。三つの累積和の定義は次のとおりである。

$$
\begin{aligned}
B_j&=\sum_{i=1}^{j}A_i,\\
C_t&=\sum_{j=1}^{t}B_j,\\
D_x&=\sum_{t=1}^{x}C_t
\end{aligned}
$$

一点代入のたびにこれらの配列を作り直すと、1回に $$O(N)$$、全体で $$O(NQ)$$ かかる。$$N,Q\leq 2\times10^5$$ では間に合わない。一方、どの累積和も元の要素を足し合わせているだけなので、更新される一要素の寄与に注目してみる。

### 一要素の寄与が三角数になる理由

まず $$A=(1,2,3)$$ で三回累積すると、$$B=(1,3,6)$$、$$C=(1,4,10)$$、$$D=(1,5,15)$$ となる。値を代入する前の形で見ると、

$$
\begin{aligned}
C_1&=A_1,\\
C_2&=2A_1+A_2,\\
C_3&=3A_1+2A_2+A_3
\end{aligned}
$$

だから、これらを足した $$D_3$$ は

$$
\begin{aligned}
D_3&=(1+2+3)A_1\\
&\quad +(1+2)A_2+A_3\\
&=6A_1+3A_2+A_3=15
\end{aligned}
$$

となる。先頭の要素ほど何度も使われ、係数は $$1+2+\cdots$$ という三角数になっている。

一般にも、$$i\leq t$$ のとき、固定した $$A_i$$ は $$B_i,B_{i+1},\ldots,B_t$$ に一度ずつ含まれる。よって、それらを足す $$C_t$$ には $$t-i+1$$ 回寄与する。さらに $$D_x$$ は $$C_1,\ldots,C_x$$ の和なので、$$i\leq x$$ のときの係数は

$$
\begin{aligned}
&\sum_{t=i}^{x}(t-i+1)\\
&=1+2+\cdots+(x-i+1)\\
&=\frac{(x-i+1)(x-i+2)}{2}
\end{aligned}
$$

である。$$i>x$$ なら寄与しない。定義の三重和を「どの $$A_i$$ を使う項か」でまとめ直すと、

$$
\begin{aligned}
D_x
&=\sum_{t=1}^{x}\sum_{j=1}^{t}\sum_{i=1}^{j}A_i\\
&=\sum_{i=1}^{x}\frac{(x-i+1)(x-i+2)}{2}A_i
\end{aligned}
$$

が得られる。

### 三種類の接頭辞和へ分離する

このままでは、取得位置 $$x$$ が変わるたびに各要素の重みも変わる。毎回すべての係数を掛け直すのを避けるため、係数のうち $$x$$ に依存する部分を和の外へ出したい。分子を $$i$$ の次数で整理すると、

$$
\begin{aligned}
&(x-i+1)(x-i+2)\\
&=i^2-(2x+3)i+(x+1)(x+2)
\end{aligned}
$$

となる。つまり、要素側には $$i^2A_i,iA_i,A_i$$ の三種類だけを用意すればよい。そこで、$$r=0,1,2$$ に対して

$$
S_r(x)=\sum_{i=1}^{x}i^rA_i
$$

と定義する。このように添字のべき乗を重みにした和を、ここではモーメント（moment）と呼ぶ。$$S_0$$ は通常の接頭辞和、$$S_1,S_2$$ はそれぞれ添字と添字の二乗で重み付けした接頭辞和である。求める式は

$$
D_x=\frac{\begin{aligned}
&S_2(x)-(2x+3)S_1(x)\\
&\quad +(x+1)(x+2)S_0(x)
\end{aligned}}{2}
$$

となる。取得位置によって変わる係数は、三つの和を取得した後に掛ければよい。

### 代入を差分加算へ変える

三本の Fenwick Tree に、各位置 $$i$$ の値 $$A_i,iA_i,i^2A_i$$ をそれぞれ持たせる。これで点加算と接頭辞和の取得を各 $$O(\log N)$$ で行える。以降の計算はすべて法 $$M=998244353$$ 上で行う。

1. 初期配列を保存し、全要素0の三本の木を用意する。各位置 $$i$$ に $$A_i,iA_i,i^2A_i$$ を点加算する。この初期化には $$O(N\log N)$$ かかる。
2. 代入クエリ `1 p v` では、保存した旧値との差 $$\Delta=v-A_p$$ を求める。三本の木の位置 $$p$$ にそれぞれ $$\Delta,p\Delta,p^2\Delta$$ を加え、保存値も $$A_p=v$$ に置き換える。
3. 取得クエリ `2 x` では、各木から範囲 $$[1,x]$$ の和を取得する。それらを上の式へ代入し、2の逆元 $$499122177$$ を掛けて答える。

例えば先ほどの配列で $$A_2$$ を2から0へ代入すると、$$\Delta=-2$$ である。$$D_3$$ における $$A_2$$ の係数は3なので、答えは $$15-2\times3=9$$ へ変わる。三本の木へ加える値は順に $$-2,-4,-8$$ であり、同じ変化を全要素の再計算なしで反映できる。

## 典型の発動条件

### 多項式 moment の分離

更新位置と取得位置に依存する重みが低次多項式で表せるときは、更新位置の次数ごとに和を分ける。取得位置だけの係数を和の外へ出せれば、毎回の重みの掛け直しを、少数の集約値の線形結合へ変えられる。

### Fenwick tree

必要な集約値が接頭辞和で、変更を点加算へ変換できるときに使える。本問では代入の旧値を保存することで差分加算に直せる。三種類の重みを別々の木に持たせても、操作回数は定数倍である。

## 問題固有の要素

三重累積という定義から、固定した一要素が使われる回数を追うと三角数が現れる。その係数が添字の二次式になることが、本問で三本の木を用意する理由である。累積配列そのものを更新しようとする前に、元の要素一つを固定して、どの和に何回含まれるかを調べる。

## 正当性

三重和で固定した $$A_i$$ が現れるのは、添字が $$i\leq j\leq t\leq x$$ を満たす項である。各 $$t$$ に対して $$j$$ は $$t-i+1$$ 通りなので、寄与係数は $$\sum_{t=i}^{x}(t-i+1)$$ となる。考察の三角数と多項式への変形はこの全寄与を過不足なく数えている。

各 Fenwick Tree が保持する点の値を、それぞれ現在の $$A_i,iA_i,i^2A_i$$ とする。初期値の点加算でこの条件は成立し、代入時に $$\Delta,p\Delta,p^2\Delta$$ を加えると、位置 $$p$$ の値だけが新しい値に対応する重みへ変わる。したがって、何回更新しても三本の接頭辞和は定義した $$S_0(x),S_1(x),S_2(x)$$ に一致する。

この三つを展開式へ代入すれば、現在の配列の三重累積和が得られる。法 $$M=998244353$$ では2の逆元が存在するので、整数として導いた係数の式は法上でも成立する。よって、すべての取得クエリで正しい $$D_x\bmod M$$ を返す。

## 実装上の注意

- 添字は1始まりで統一する。特に $$x=1$$ では係数が1で $$D_1=A_1$$ になる。末尾 $$p=N$$ の更新は $$x<N$$ の取得結果に影響せず、$$D_N$$ には差分が一度だけ加わる。
- 値を小さくする代入では $$\Delta$$ が負になる。減算後は法 $$M$$ で $$0\leq\Delta<M$$ に正規化し、答えの引き算も同様に正規化する。同じ値への再代入なら差分は0である。
- 法を取った分子を通常の整数除算で2で割らない。分子が法を取る前に偶数でも、剰余は奇数になり得るため、2の逆元を掛ける。
- 乗算には十分な整数幅を使う。例えば $$i^2A_i$$ を整数のまま計算すると最大で $$4\times10^{19}$$ となり、符号付き64 bit整数でも収まらない。$$i^2$$ を64 bit整数で計算して法を取り、その結果に $$A_i\bmod M$$ を掛ける。他の積も二因子ごとに法を取れば、各因子を $$M$$ 未満に抑えられ、積は符号付き64 bit整数に収まる。

## 復習の核

- 多重累積では、元の一要素が使われる回数を数える。どの添字の組を数えているかが分かれば、係数の式を暗記する必要はない。
- 重みが更新位置と取得位置の多項式なら、更新位置の次数ごとの和を探す。「何本の木を持つか」は展開後に必要な和の種類から決める。
- 代入を加算型のデータ構造で扱うには旧値との差分を使う。減少代入でも、法上の差分で同じ手順が通る。

## 計算量と制約

### 時間

初期化は三本の Fenwick Tree へ各要素を点加算するので $$O(N\log N)$$。各クエリは点加算または接頭辞和の取得を三回行うため $$O(\log N)$$ であり、全体は $$O((N+Q)\log N)$$ となる。

### 空間

三本の Fenwick Tree と代入の差分計算に使う現在の配列を持つので、$$O(N)$$。

### 制約との対応

$$N,Q\leq2\times10^5$$ に対し、各要素の初期化と各クエリは、いずれも定数本の木の対数時間操作で済む。$$0\leq A_i,v\leq10^9$$ であり、入力値が法以上でも剰余に直して扱える。三回の累積で得られる整数全体を保持せず、各演算を法上で行う。

公式制約は時間制限2秒、メモリ制限1024 MiB。$$1\leq N,Q\leq2\times10^5$$、$$1\leq x\leq N$$ で、入力はすべて整数である。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/editorial/4131) — source-abc256-editorial-4131-5a56cfc1385cccb66caaa609b059936e87f87c1a1fe818c7857a8646d481623a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/tasks/abc256_f) — source-abc256-f-problem-77ec1c7e89587cdf14d63e8c6c0c4f679708532e7f2da582ab635b6814a88965
