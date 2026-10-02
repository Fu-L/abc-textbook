---
title: "ABC383-G — Bar Cover"
draft: true
authoringUnit: {"problemId":"abc383-g","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc383-g.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-recursive-divide-and-conquer"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc383-editorial-11500-ab0a48e7cda2a99f752f9faef52005366b6bdf6afeb68d0ce190a22a973b8251","source-abc383-g-problem-72be83610d4356251b6c9b25d5441578f5fdd5ac5db4c535baf1c323433e9444"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"bar選択は開始位置距離K以上の集合に等しい。左右分割時の跨ぎ衝突は右端禁止jと左端禁止K−1−jで全合法組を覆える。各状態の個数別最適値は凹列で、二列のmax-plus積は非増加限界利得のmergeで正しく得られる。境界split全てのmaxを取るため各個数の合法解を取りこぼさず、再帰から全体最適列になる。","sourceRevisionIds":["source-abc383-editorial-11500-ab0a48e7cda2a99f752f9faef52005366b6bdf6afeb68d0ce190a22a973b8251","source-abc383-g-problem-72be83610d4356251b6c9b25d5441578f5fdd5ac5db4c535baf1c323433e9444"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=4,K=2,A=(1,5,4,2)。","procedure":["window利得は6,9,6。一barなら中央9。","二barは開始1,3だけで6+6=12。"],"executionTarget":null,"expectedResult":"0,1,2本の最適値0,9,12。","verificationStatus":"not_applicable","learningUnitIds":["unit-separable-convex-marginals"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"prerequisiteIds":["unit-basic-convex-optimization","unit-recursive-divide-and-conquer"],"attainmentCondition":"Aが全負でも0本の値を負無限にしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0本は0。"},"answer":{"reasoningOrVerification":"0本は実現可能で値0。例えばK=1,A=(−1,−2)のexact本数列は0,−1,−3。","procedure":["具体例の各状態・寄与を再計算する。","0本は実現可能で値0。例えばK=1,A=(−1,−2)のexact本数列は0,−1,−3。"],"expectedResult":"0本は0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さKのbarを置く開始位置iの利得は連続和B_iであり、bar同士が重ならない条件は選んだ開始位置の距離がK以上と言い換えられる。

各個数についての最大値列は離散凹になる。この性質により、左右区間の解を通常のmax-plus convolutionより速くmergeできる。

採用する候補: 境界から選べない長さを状態に持つ分割統治DPを、離散凹列の傾きmergeで結合する

K≤5なので左右境界状態はO(K^2)に抑えられ、各nodeの個数方向を凹列の傾き列として線形mergeすることで全体O(NK^2 log N)になる。

棄却する候補: dp[position][count]で次の選択位置を遷移する

全countの答えを持つ二次元DPはΘ(N^2)状態になり、N=2×10^5では扱えない。

dp[l][r][x][y]は左右端からx,y個の開始位置を禁止したとき、選択個数ごとの最大和を表す。

中央を跨ぐ衝突は左側の右端禁止jと右側の左端禁止K-1-jを組にすれば排除できる。凹列のconvolutionは限界利得を降順mergeすればよい。

Aの長さK window sum列Bを作る。区間を再帰分割し、各(x,y)境界状態についてj=0..K-1の左右DPを凹列としてmergeし最大を取る。rootの制約なし列から各bar本数の答えを得る。

## 典型の発動条件

### 分割統治DPと境界状態

発動条件: 局所制約が区間結合時に境界近傍だけで干渉するとき。

左右端の禁止幅をK未満で持ち、中央衝突だけを調整する。

### 離散凹列のmax-plus convolution

発動条件: 選択個数ごとの最適値が限界利得非増加になるとき。

二列の差分を降順mergeしてconvolutionを線形化する。

## 問題固有の要素

Kが小さいのは遷移幅だけでなく、区間を結ぶ際に伝えるべき情報が両端各K通りしかないことを意味する。

別の問題へ持ち帰る視点: 長距離の答え数が多くても、相互作用が境界幅に局在し価値列が凹なら分割統治と傾き表現を検討する。

## 正当性

bar選択は開始位置距離K以上の集合に等しい。左右分割時の跨ぎ衝突は右端禁止jと左端禁止K−1−jで全合法組を覆える。各状態の個数別最適値は凹列で、二列のmax-plus積は非増加限界利得のmergeで正しく得られる。境界split全てのmaxを取るため各個数の合法解を取りこぼさず、再帰から全体最適列になる。

## 実装上の注意

- 不可能な選択個数は負の無限大とし、短い区間ではx,yの禁止が重なる場合を正規化する。負のA_iでも0本の値を基準に壊さない。

## 復習の核

- N≤12では開始位置subsetを全列挙し、負利得、K=1、区間長<K、中央直前直後を選ぶcaseで全個数のDP列と凹性を照合する。

## 計算量と制約

### 時間

O(K³N log N)。各境界状態K²と中央split Kについて線形凹列mergeを行う。

### 空間

O(K²N log N)の素朴再帰保持、解放でO(K²N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq K \leq \min(5,N); -10^9 \leq A_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=4,K=2,A=(1,5,4,2)。

1. window利得は6,9,6。一barなら中央9。
2. 二barは開始1,3だけで6+6=12。

期待される結果: 0,1,2本の最適値0,9,12。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

Aが全負でも0本の値を負無限にしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

0本は実現可能で値0。例えばK=1,A=(−1,−2)のexact本数列は0,−1,−3。

確認結果: 0本は0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/editorial/11500) — source-abc383-editorial-11500-ab0a48e7cda2a99f752f9faef52005366b6bdf6afeb68d0ce190a22a973b8251
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/tasks/abc383_g) — source-abc383-g-problem-72be83610d4356251b6c9b25d5441578f5fdd5ac5db4c535baf1c323433e9444
