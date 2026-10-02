---
title: "ABC260-EX — Colorfulness"
draft: true
authoringUnit: {"problemId":"abc260-ex","docPath":"src/content/docs/problems/mathematics/outcome-encode-counting-by-generating-function/outcome-encode-counting-by-generating-function-shard-001/abc260-ex.md","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-inclusion-exclusion","unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"excludedTopics":["係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。"],"tagIds":["tag-formal-power-series","tag-generating-functions","tag-combinatorial-coefficients","tag-convolution","tag-inclusion-exclusion","tag-modular-arithmetic","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc260-ex-problem-d07c2253eb6027bf7537a67461899f6ac61aac2cd22b86e9deb1c82ea83807fd","source-abc260-editorial-4434-864dffceff26d14b00bdc9dbe05af08146c10a71c91bc9ab5b65db1d57ee1a40"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同色境界を指定した数q_nはexact分布p_dの二項変換であり、色内runの縮約とEGF積がその交差項を数える。二項反転でp_dを復元しt=N−1−dへ移せば異色境界分布a_tを得る。Σa_t/(1−tx)のk次係数はΣa_tt^kなので、分数の合成と定数項1の分母逆元で全momentを正確に生成できる。","sourceRevisionIds":["source-abc260-ex-problem-d07c2253eb6027bf7537a67461899f6ac61aac2cd22b86e9deb1c82ea83807fd","source-abc260-editorial-4434-864dffceff26d14b00bdc9dbe05af08146c10a71c91bc9ab5b65db1d57ee1a40"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"色は(a,a,b)、3人は区別する。","procedure":["値列aab,aba,baaは各2順列。異色境界数は1,2,1。","F(1)=2(1+2+1)=8、F(2)=2(1+4+1)=12。"],"executionTarget":null,"expectedResult":"F(1)=8、F(2)=12。","verificationStatus":"not_applicable","learningUnitIds":["unit-generating-functions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-encode-counting-by-generating-function","outcome-apply-formal-power-series-operations"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-inclusion-exclusion","unit-modular-arithmetic","unit-polynomial-convolution","unit-recursive-divide-and-conquer"],"attainmentCondition":"同色二人のラベルを戻す階乗を省くと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"2!の補正が必要。"},"answer":{"reasoningOrVerification":"値列だけの数となり結果は半分の4,6になる。元問題の順列は人を区別するので色内の2!を戻す。","procedure":["具体例の各状態・寄与を再計算する。","値列だけの数となり結果は半分の4,6になる。元問題の順列は人を区別するので色内の2!を戻す。"],"expectedResult":"2!の補正が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

- 組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。
- 定数項の前提と次数打切りを確認し、Newton法を用いたFPSの逆数・対数・指数などを畳み込み計算へ還元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [NTT・FFTで畳み込みと相互相関を求める](src/content/docs/learn/combinatorics-algebra/polynomial-convolution.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 係数列同士を単に畳み込む相互相関、および係数の組合せ的意味を持たない信号処理。

## 考察

全 k について C(P)^k を直接足す代わりに、C(P)=t となる順列数 a_t を先に得れば F(k)=Σ_t a_t t^k と分離できる。

異色境界数 C と同色境界数 D は C＋D=N−1 なので、同色境界を指定して満たす列を数える包除原理が使える。

棄却する候補: 色の多重集合順列を DP で列挙し、遷移回数ごとの分布を色数・個数状態で数える。

色ごとの残数を状態にすると次元が色数に依存し、N=25 万では扱えない。

採用する候補: 指定した同色隣接を満たす数 q を色ごとのブロック EGF の積で求め、二項反転で正確な分布 a を復元した後、Σ_t a_t/(1−tx) を FPS 展開する。

分布計算と全冪モーメント生成の双方を多項式積・畳み込みへ落とせ、NTT と積木、FPS 逆元を一貫して利用できる。

同色境界が正確に d 個の列数を p_d、指定した n 個以上の同色境界を満たす数を q_n とすると、q_n=Σ_{d≥n}binom(d,n)p_d であり、二項反転で p を得られる。

色 c の個数 m_c に対するブロック選択を g_c(x)=Σ_k binom(m_c−1,m_c−k)x^k/k! と正規化すると、積 ∏g_c の係数が多項係数付きの q 計算を表す。

モーメント列の通常型母関数は Σ_{k≥0}F(k)x^k=Σ_t a_t/(1−tx) となり、分数を積木でまとめて分母の FPS 逆元を取れば M 項を一括生成できる。

同色 run の組合せを exponential generating function で合成し、binomial inversion で分布を復元し、power moments を rational generating function の級数展開へ接続する。

## 典型の発動条件

### 指定事象数から正確事象数への二項反転

発動条件: ちょうど d 個成立する対象は数えにくいが、指定した n 個が全て成立する対象なら数えやすいとき。

q_n=Σ binom(d,n)p_d を作り、階乗で正規化した畳み込みとして p を復元する。

### 指数型母関数によるラベル付き合成

発動条件: 独立な種類ごとの部品数を合成するときに、多項係数で配置順を混ぜる必要があるとき。

係数を階乗で割った色別多項式を掛け、最終係数へ階乗を戻す。

### 有理型母関数と FPS 逆元

発動条件: 有限分布 a_t の全冪モーメント Σa_t t^k を多数の k について求めるとき。

Σa_t/(1−tx) の分子・分母を積木でbalancedにまとめ、Newton 法で総分母を反転して必要次数まで展開する。

## 問題固有の要素

同色の球は色列を数える段階では同一視でき、最後に各色内の球番号の並べ方 ∏m_c! を掛けて元の球の順列数へ戻せる。

別の問題へ持ち帰る視点: 評価値が属性列だけで決まるラベル付き順列は、属性列の数え上げと属性内ラベルの置換を分離する。

## 正当性

同色境界を指定した数q_nはexact分布p_dの二項変換であり、色内runの縮約とEGF積がその交差項を数える。二項反転でp_dを復元しt=N−1−dへ移せば異色境界分布a_tを得る。Σa_t/(1−tx)のk次係数はΣa_tt^kなので、分数の合成と定数項1の分母逆元で全momentを正確に生成できる。

## 実装上の注意

- 色別多項式や分数は次数の小さいものから priority queue で併合し、極端に偏った逐次積を避ける。
- 同色境界数 d と異色境界数 N−1−d の添字反転、および色内ラベル置換の階乗係数を落とさない。
- FPS 逆元は定数項が 1 の分母に対し u←2u−tu^2 を必要次数で切り詰めながら倍化する。

## 復習の核

- 同じ統計量の多数の冪和を求めるなら、まず統計量の値別分布へ問題を分離する。
- 多項係数を伴う独立部品の合成では、階乗正規化により通常の畳み込みへ変わるか確認する。
- 有限分布の moment sequence は各値の等比級数を足した有理関数になる、という変換を候補にする。

## 計算量と制約

### 時間

O((N+M)log²(N+M))。色別積、二項反転、分数積木とFPS展開を用いる。

### 空間

O((N+M)log(N+M))の積木保持、逐次解放でO(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2.5 \times 10^5; 1 \leq M \leq 2.5 \times 10^5; 1 \leq a_i \leq N; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

色は(a,a,b)、3人は区別する。

1. 値列aab,aba,baaは各2順列。異色境界数は1,2,1。
2. F(1)=2(1+2+1)=8、F(2)=2(1+4+1)=12。

期待される結果: F(1)=8、F(2)=12。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同色二人のラベルを戻す階乗を省くと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

値列だけの数となり結果は半分の4,6になる。元問題の順列は人を区別するので色内の2!を戻す。

確認結果: 2!の補正が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/tasks/abc260_h) — source-abc260-ex-problem-d07c2253eb6027bf7537a67461899f6ac61aac2cd22b86e9deb1c82ea83807fd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/editorial/4434) — source-abc260-editorial-4434-864dffceff26d14b00bdc9dbe05af08146c10a71c91bc9ab5b65db1d57ee1a40
