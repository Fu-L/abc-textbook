---
title: "ABC462-G — Completely Wrong"
draft: true
authoringUnit: {"problemId":"abc462-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc462-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-modular-arithmetic","unit-polynomial-convolution"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-convolution","tag-generating-functions","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc462-editorial-21456-125bd5706c0cdf5e896a02d1a23eef13dc6df29f4a75b59feaf156115895e857","source-abc462-g-problem-73f7e339d052db10556f4c6375992f51700de1db87661f7cad566dd5896ace03"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一致位置を指定する包除で、値kのj位置選択はC(Y_k,j)、それへ相異なるC側indexを割り当てる数は(X_k)_j。従ってfactorのj次係数は(−1)^j C(Y_k,j)(X_k)_j。積のi次係数は全一致指定i位置の交差項で、残り(N−i)!を掛けて合計すると完全不一致順列数。全N!で割るとその確率になる。","sourceRevisionIds":["source-abc462-editorial-21456-125bd5706c0cdf5e896a02d1a23eef13dc6df29f4a75b59feaf156115895e857","source-abc462-g-problem-73f7e339d052db10556f4c6375992f51700de1db87661f7cad566dd5896ace03"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"C=(1,2,3)、G=(1,2,3)。","procedure":["完全不一致順列は(2,3,1),(3,1,2)の二つ。","全順列6で割る。"],"executionTarget":null,"expectedResult":"確率1/3。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"prerequisiteIds":["unit-generating-functions","unit-modular-arithmetic","unit-polynomial-convolution"],"attainmentCondition":"C=(1,1),G=(2,2)なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"確率1。"},"answer":{"reasoningOrVerification":"一致がどの位置でも起きないので全2!順列が完全不一致。包除の各factorは定数1。","procedure":["具体例の各状態・寄与を再計算する。","一致がどの位置でも起きないので全2!順列が完全不一致。包除の各factorは定数1。"],"expectedResult":"確率1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

位置iが完全に外れる事象 C_{P_i}≠G_i の全積を包除すると、選んだ一致位置は値class kごとの選択数D_kだけで数えられる。

採用する候補: 各値kの出現数 X_k,Y_kから多項式 f_k(x)=Σ_j(-1)^j C(X_k,j)C(Y_k,j)j!x^j を作り、全f_kをNTTで積み、係数c_iに(N-i)!を掛けて総和する。

class kでj位置を一致させる方法は両側からj個選びbijectionをj!通り作る数で、全class独立な畳み込みになり、残りN-i位置は(N-i)!通り自由に並べられる。

棄却する候補: 全N!順列を列挙し、どの位置でもC_{P_i}≠G_iか検査する。

factorial個の候補を扱えず、値ごとの対称性を利用していない。

包除subsetの符号は一致を強制した総位置数ΣD_kのparityだけで、多項式係数の(-1)^jへ分配できる。

各factor次数の総和はNなので、小次数factorからpriority queueで畳み込むと O(N log^2 N) に抑えられる。

C,Gの値frequency X,Yとfactorialを前計算する。各kでj=0..min(X_k,Y_k)の係数を作り、size順にNTT convolutionしてfを得る。ans=invFact[N]×Σ_i f_i×fact[N-i]をmodulus上で計算する。

## 典型の発動条件

### 包除原理のclass別生成関数

発動条件: permutationの位置一致禁止が値classごとに対称なとき。

各classの一致数選択を多項式にし、積で全配分を畳み込む。

### 多項式積のsmall-to-large convolution

発動条件: factor次数総和がNで多数factorを掛けたいとき。

小さい二factorからNTT mergeしてlog段を抑える。

## 問題固有の要素

permutation包除を位置subsetの2^Nで回さず、同値classごとの選択個数へorbit圧縮する。

別の問題へ持ち帰る視点: 独立class間の総選択数だけを追う式は、生成関数の積としてそのまま実装できる。

## 正当性

一致位置を指定する包除で、値kのj位置選択はC(Y_k,j)、それへ相異なるC側indexを割り当てる数は(X_k)_j。従ってfactorのj次係数は(−1)^j C(Y_k,j)(X_k)_j。積のi次係数は全一致指定i位置の交差項で、残り(N−i)!を掛けて合計すると完全不一致順列数。全N!で割るとその確率になる。

## 実装上の注意

- 係数のj!を誤ってD_k!ではなく別箇所へ重複させない。最後にN!で割る確率正規化と負係数modを処理する。

## 復習の核

- 一classでj個一致を強制する C(X,j)C(Y,j)j! のbijectionを数え、class積後の残り(N-i)!を導く。

## 計算量と制約

### 時間

O(N log²N)。値class包除多項式を小次数順NTTで合成する。

### 空間

O(N log N)の積木保持、逐次解放でO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2\times 10^5; 1\le C_i,G_k\le N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

C=(1,2,3)、G=(1,2,3)。

1. 完全不一致順列は(2,3,1),(3,1,2)の二つ。
2. 全順列6で割る。

期待される結果: 確率1/3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

C=(1,1),G=(2,2)なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一致がどの位置でも起きないので全2!順列が完全不一致。包除の各factorは定数1。

確認結果: 確率1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/editorial/21456) — source-abc462-editorial-21456-125bd5706c0cdf5e896a02d1a23eef13dc6df29f4a75b59feaf156115895e857
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/tasks/abc462_g) — source-abc462-g-problem-73f7e339d052db10556f4c6375992f51700de1db87661f7cad566dd5896ace03
