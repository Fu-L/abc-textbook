---
title: "ABC331-G — Collect Them All"
draft: true
authoringUnit: {"problemId":"abc331-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc331-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-encode-counting-by-generating-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-generating-functions","tag-inclusion-exclusion","tag-convolution","tag-modular-arithmetic","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc331-editorial-7763-4a22d39e350c730d06c236f2536ec68f54b34f357f0788f08790e344b88caf38","source-abc331-g-problem-2ff1239dc9161ed18837a37d3769cd399cf62e34a2065aca8ff9f5a278f1cc76"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"tail-sumの包除では未取得種類集合の確率を等比和で足す。取得可能subsetの総枚数kだけが分母N−kを決め、その符号付きsubset数はΠ(1−x^{C_i})の係数に等しい。次数Nは全集合で分母0だがtail式から除外される。k<Nの係数へN/(N−k)を掛けて足せば全種類取得の期待値になる。","sourceRevisionIds":["source-abc331-editorial-7763-4a22d39e350c730d06c236f2536ec68f54b34f357f0788f08790e344b88caf38","source-abc331-g-problem-2ff1239dc9161ed18837a37d3769cd399cf62e34a2065aca8ff9f5a278f1cc76"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-encode-counting-by-generating-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、M=2、C=(1,1)。","procedure":["符号付き多項式は−(1−x)²=−1+2x−x²。","k<2の寄与は−1·2/2+2·2/1。"],"executionTarget":null,"expectedResult":"期待回数3。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion","outcome-encode-counting-by-generating-function"],"prerequisiteIds":["unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"attainmentCondition":"M=1なら次数Nの項を足すか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"期待回数1。"},"answer":{"reasoningOrVerification":"全種類は一回で必ず揃う。定数項だけで1、次数Nは分母0なので加えない。","procedure":["具体例の各状態・寄与を再計算する。","全種類は一回で必ず揃う。定数項だけで1、次数Nは分母0なので加えない。"],"expectedResult":"期待回数1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。
- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

全種類を得るまでの回数Tは、tail-sum公式E[T]=Σ_{n≥0}Pr(T>n)で表せる。n回で全種類を得る確率へ包除原理を適用すると、subset Sだけから引く確率(Σ_{i∈S}C_i/N)^nが現れる。

subsetごとの寄与はC_iの総和kだけで決まり、nについての無限和はN/(N-k)という等比級数へ閉じる。残る課題は同じkを持つsubsetの符号和を全kについて求めることである。

採用する候補: 包除原理を母関数∏(1-X^{C_i})へまとめ、積をdivide-and-conquer convolutionする

subset符号和を次数Nの多項式係数として一括計算でき、NTTによる積でO(N(log N)^2)に抑えられる。

棄却する候補: 未収集種類subsetを状態とするcoupon collector DP

Mは2×10^5で2^M状態を持てず、種類ごとの出現確率も異なるため収集種類数だけには圧縮できない。

棄却する候補: DP[m][k]で多項式積を逐次更新する

式は正しいがO(MN)となり、双方が最大2×10^5では実行できない。

係数d_k=\[X^k](-1)^{M-1}∏(1-X^{C_i})は、総枚数kになるsubsetの(-1)^{M-1-|S|}の総和そのものである。

全集合S=Uではf(S)=1となって等比級数が発散するが、tail probabilityの変形ではS⊊Uだけが残るため次数Nの項を除きk=0..N-1だけを使う。

各iの疎多項式(1-X^{C_i})を用意し、次数Nで打ち切りながら小さい多項式同士を優先してconvolutionする。得た係数へ全体符号を掛け、Σ_{k=0}^{N-1} d_k×N/(N-k)をmod 998244353で計算する。

## 典型の発動条件

### tail-sum formulaと包除原理

発動条件: 非負整数停止時刻の期待値を、時刻nまでに全条件を満たす確率から求められるとき。

未完了確率を全nで足し、種類subsetだけを引く確率へ展開する。

### subset和の母関数化

発動条件: subsetの寄与が選択要素の重み総和と選択数の符号だけに依存するとき。

符号付きsubset sumを∏(1-X^{C_i})の係数へ集約する。

### divide-and-conquer polynomial product

発動条件: 多数の低次数多項式の積を所要次数まで高速に得たいとき。

NTT convolutionを積木状に行いO(N(log N)^2)で係数を求める。

## 問題固有の要素

非一様coupon collectorの無限時間期待値が、包除後にはカード枚数subset sum kごとの有限な多項式係数とN/(N-k)の内積になる。

別の問題へ持ち帰る視点: 確率過程の無限和でも、イベントを包除して各項を等比級数にできれば有限の組合せ集計へ落ちることがある。

## 正当性

tail-sumの包除では未取得種類集合の確率を等比和で足す。取得可能subsetの総枚数kだけが分母N−kを決め、その符号付きsubset数はΠ(1−x^{C_i})の係数に等しい。次数Nは全集合で分母0だがtail式から除外される。k<Nの係数へN/(N−k)を掛けて足せば全種類取得の期待値になる。

## 実装上の注意

- 多項式の全体符号と各因子の負号を二重に扱わない。次数N項は分母0なので加えず、mod除算には逆元を使う。

## 復習の核

- M=1とC_i=1の等確率ケースを既知のNH_Mと照合し、小さいNではsubset包除の直接計算と係数・符号・k=N除外を比較する。

## 計算量と制約

### 時間

O(N log²N)。総次数Nの疎因子積木と逆元和。

### 空間

O(N log M)の積木保持、逐次解放でO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 2\times 10^5; 1 \leq C_i; \sum_{i=1}^{M}C_i=N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、M=2、C=(1,1)。

1. 符号付き多項式は−(1−x)²=−1+2x−x²。
2. k<2の寄与は−1·2/2+2·2/1。

期待される結果: 期待回数3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

M=1なら次数Nの項を足すか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

全種類は一回で必ず揃う。定数項だけで1、次数Nは分母0なので加えない。

確認結果: 期待回数1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc331/editorial/7763) — source-abc331-editorial-7763-4a22d39e350c730d06c236f2536ec68f54b34f357f0788f08790e344b88caf38
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc331/tasks/abc331_g) — source-abc331-g-problem-2ff1239dc9161ed18837a37d3769cd399cf62e34a2065aca8ff9f5a278f1cc76
