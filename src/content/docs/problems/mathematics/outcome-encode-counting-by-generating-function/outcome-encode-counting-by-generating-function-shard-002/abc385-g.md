---
title: "ABC385-G — Counting Buildings"
draft: true
authoringUnit: {"problemId":"abc385-g","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-002/abc385-g.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-compute-convolution-or-correlation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-convolution","tag-generating-functions","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc385-editorial-11656-abbc96ead53c07d1d269bc2f578c53f96e5460874c25eaa08274554d877da35a","source-abc385-g-problem-e8e51b64f6070e9628eba3ed49737ae3a5b5b216afbfa3cb75da906281b76834"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"降順挿入では新値は最小なので左端だけLを増やし、右端だけRを増やし、内部gapでは両方不変。既存i+1要素の内部gap数iより差のLaurent因子x^{−1}+i+xを得る。N−1回の挿入を掛け、x^{N−1}でshiftするとΠ(1+ix+x²)。従ってK+N−1次係数がexact差Kの順列を一度数える。","sourceRevisionIds":["source-abc385-editorial-11656-abbc96ead53c07d1d269bc2f578c53f96e5460874c25eaa08274554d877da35a","source-abc385-g-problem-e8e51b64f6070e9628eba3ed49737ae3a5b5b216afbfa3cb75da906281b76834"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 係数積和または反転列との相互相関を多項式積へ変換し、NTT・FFTで必要な係数範囲を計算できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

順列へ値を降順に挿入すると、新要素は既存要素より小さい。左端なら左可視数Lだけが1増え、右端ならRだけが1増え、中間i箇所ではどちらも変わらない。

差k=L-Rだけを追う挿入DPはdp_{i+1}[k]=dp_i[k-1]+i·dp_i[k]+dp_i[k+1]となり、生成関数では二次式(1+ix+x^2)の積になる。

採用する候補: 挿入DPを生成関数へ変換し、二次多項式群を分割統治NTTで積む

欲しい差Kの個数を積の係数へ帰着し、次数総和O(N)の積をO(N(log N)^2)で計算してN=2×10^5に対応できる。

棄却する候補: 差kを全範囲持つ挿入DPをN段更新する

状態数が段数に比例して増え合計O(N^2)となる。

Laurent多項式のx^{-1},1,xを全体でx^{N-1}shiftすると、通常多項式∏_{i=0}^{N-2}(1+ix+x^2)の係数K+N-1を取ればよい。

多項式を前から一つずつ掛けると再び二次になるため、次数の近いものをmergeするか均等分割して各levelの次数総和をO(N)に保つ。

i=0..N-2の多項式1+ix+x^2を作り、priority queueによるsmall-to-largeまたは分割統治でconvolutionする。最終積の次数K+N-1の係数をmodで出力する。

## 典型の発動条件

### 順列の挿入DP

発動条件: 最大または最小要素を挿入した際に統計量の変化が位置種別だけで決まるとき。

最小要素の左端・右端・中間挿入でL-Rの変化を分類する。

### 多数多項式のbalanced product

発動条件: 次数総和が小さい多数の因子を高速に掛けたいとき。

分割統治またはmerge techniqueでconvolution treeを平衡化する。

## 問題固有の要素

左右可視数を別々に持たず要求値L-Rへ射影すると、挿入位置N通りが変化+1,-1,0の三種類へ潰れる。

別の問題へ持ち帰る視点: 順列統計の差・和だけを問う場合、挿入で必要な統計量へ直接圧縮し、遷移係数を生成関数の因子として読む。

## 正当性

降順挿入では新値は最小なので左端だけLを増やし、右端だけRを増やし、内部gapでは両方不変。既存i+1要素の内部gap数iより差のLaurent因子x^{−1}+i+xを得る。N−1回の挿入を掛け、x^{N−1}でshiftするとΠ(1+ix+x²)。従ってK+N−1次係数がexact差Kの順列を一度数える。

## 実装上の注意

- Kが負でもindex K+N-1へ正しくshiftする。i=0因子やN=1の空積を扱い、convolution結果は必要次数までに保つ。

## 復習の核

- N≤8の全順列でL,Rを直接数え、Kの対称性ans(K)=ans(-K)、係数shift、N=1を照合する。

## 計算量と制約

### 時間

O(N log²N)。二次因子の均衡積木をNTTで合成する。

### 空間

O(N log N)の素朴積木、逐次解放でO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; |K| \leq N-1; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/editorial/11656) — source-abc385-editorial-11656-abbc96ead53c07d1d269bc2f578c53f96e5460874c25eaa08274554d877da35a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc385/tasks/abc385_g) — source-abc385-g-problem-e8e51b64f6070e9628eba3ed49737ae3a5b5b216afbfa3cb75da906281b76834
