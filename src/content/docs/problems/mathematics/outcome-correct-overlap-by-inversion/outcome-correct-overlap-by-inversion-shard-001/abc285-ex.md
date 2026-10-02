---
title: "ABC285-EX — Avoid Square Number"
draft: true
authoringUnit: {"problemId":"abc285-ex","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc285-ex.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions","unit-prime-divisor"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-generating-functions","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc285-editorial-5531-9754cd49821d1394d83759ef0b347b6909fe57c23c4b702d002070f3b04c9c7a","source-abc285-ex-problem-950bbedb3eeab9fd63d783709cbc9551732240ee4a8ab213ef941838e8b96dfe"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"指定i位置が平方数なら全素因数のその位置指数が偶数なので、各primeの分配数はF_i=[x^E](1−x²)^{−i}(1−x)^{−(N−i)}。prime間で独立に掛け、位置選択C(N,i)で包除すると平方要素なしだけ残る。F_{i+1}=F_i/(1+x)の係数式b_d=a_d−b_{d−1}は同じ関数を正確に更新する。","sourceRevisionIds":["source-abc285-editorial-5531-9754cd49821d1394d83759ef0b347b6909fe57c23c4b702d002070f3b04c9c7a","source-abc285-ex-problem-950bbedb3eeab9fd63d783709cbc9551732240ee4a8ab213ef941838e8b96dfe"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、積はp²。","procedure":["指数分配(0,2),(1,1),(2,0)。","両要素が平方でないのは(p,p)だけ。"],"executionTarget":null,"expectedResult":"1列。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-generating-functions","unit-prime-divisor"],"attainmentCondition":"同じNで積p³なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0。"},"answer":{"reasoningOrVerification":"各非平方要素はこの一primeの指数が奇数。奇数+奇数は偶数なので総指数3にできない。","procedure":["具体例の各状態・寄与を再計算する。","各非平方要素はこの一primeの指数が奇数。奇数+奇数は偶数なので総指数3にできない。"],"expectedResult":"0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

積を∏p_j^{E_j}に固定すると、各primeの指数E_jをN要素へ非負分配する選択はprimeごとに独立である。

指定したi個の要素をsquareにするには、そのi位置へ割り当てる各prime指数をすべて偶数にすればよい。

squareな要素が1つもない条件は、squareである位置集合に対する包含排除で表せる。

採用する候補: 指定i位置がsquareとなる指数分配を生成関数の係数で数え、iを1つ増やすたび多項式を線形更新して包含排除する。

位置subsetはC(N,i)でまとめられ、各iの全係数を前状態からO(D)で得られる。

棄却する候補: 積のdivisorを列挙してN要素へ配り、各要素がsquareか検査する。

prime数・指数とも最大10000でdivisor数も列数も巨大になり、積そのものも保持できない。

棄却する候補: 各iについて(1-x²)^(-i)(1-x)^(-(N-i))を畳み込みで最初から構築する。

同じ近接した生成関数をN回再計算し、次数Dに対して二次以上の無駄が生じる。

指定i位置について指数Eを配る個数は\[x^E](1-x²)^(-i)(1-x)^(-(N-i))であり、全primeの個数はその係数をjごとに掛けたものになる。

i→i+1では生成関数へ(1-x)/(1-x²)=1/(1+x)を掛けるだけなので、係数b_d=a_d-b_{d-1}という交互prefix型の更新で済む。

i位置の選び方C(N,i)と符号(-1)^iを掛けてi=0..Nを足せば、square要素を少なくとも1つ持つ列が包含排除される。

D=max E_jまで係数arrayを持つ。初期F_0=(1-x)^(-N)はdelta arrayへN回prefix sumを施して作る。各iでvalue_i=∏_j F_i[E_j]を求め、(-1)^i C(N,i)value_iを答えへ加える。その後F_{i+1}=F_i/(1+x)をb_0=a_0, b_d=a_d-b_{d-1}で全次数更新する。すべてmod 10^9+7で行う。

## 典型の発動条件

### 指数分配の生成関数

発動条件: 整数の積をprime指数ごとに分離し、複数要素へ指数を配るとき。

自由な指数は(1-x)^-1、偶数指数は(1-x²)^-1で表す。

### 位置条件の包含排除

発動条件: どの位置も禁止属性を持たない列を数えるとき。

指定subsetがsquareである列をsubset sizeごとに符号付き加算する。

### 生成関数間の差分更新

発動条件: parameterを1増やした生成関数の比が単純な級数になるとき。

1/(1+x)倍を一次漸化式で計算する。

## 問題固有の要素

「要素がsquare」は全prime指数が偶数というprime横断条件だが、指定位置集合を先に固定すると各primeの係数を独立に数えて最後に積へ戻せる。

別の問題へ持ち帰る視点: 複数軸にまたがる禁止条件は、一方の対象subsetで包含排除してから、残る独立軸ごとの数え上げへ分離する。

## 正当性

指定i位置が平方数なら全素因数のその位置指数が偶数なので、各primeの分配数はF_i=\[x^E](1−x²)^{−i}(1−x)^{−(N−i)}。prime間で独立に掛け、位置選択C(N,i)で包除すると平方要素なしだけ残る。F_{i+1}=F_i/(1+x)の係数式b_d=a_d−b_{d−1}は同じ関数を正確に更新する。

## 実装上の注意

- F更新のb_dは直前の新しいb_{d-1}を使い、減算結果をmodで正規化する。
- 係数はD=max E_jまでで十分で、各iの積が0になっても後続iのF更新は続ける。
- C(N,i)はfactorialまたは隣接漸化式で正しく更新し、符号をiのparityで切り替える。

## 復習の核

- 小さいNで「指定位置がsquare」の係数式を指数分配から導き、F_i/(1+x)=F_{i+1}の係数漸化式と包含排除の符号を順に照合する。

## 計算量と制約

### 時間

O(ND+NK)、D=max E_j。係数初期化とiごとの交互prefix更新。

### 空間

O(D+N+K)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le N,K,E_i \le 10000

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、積はp²。

1. 指数分配(0,2),(1,1),(2,0)。
2. 両要素が平方でないのは(p,p)だけ。

期待される結果: 1列。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じNで積p³なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各非平方要素はこの一primeの指数が奇数。奇数+奇数は偶数なので総指数3にできない。

確認結果: 0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/editorial/5531) — source-abc285-editorial-5531-9754cd49821d1394d83759ef0b347b6909fe57c23c4b702d002070f3b04c9c7a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/tasks/abc285_h) — source-abc285-ex-problem-950bbedb3eeab9fd63d783709cbc9551732240ee4a8ab213ef941838e8b96dfe
