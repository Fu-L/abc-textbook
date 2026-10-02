---
title: "ABC283-EX — Popcount Sum"
draft: true
authoringUnit: {"problemId":"abc283-ex","docPath":"src/content/docs/problems/mathematics/outcome-sum-affine-floors-by-euclid/outcome-sum-affine-floors-by-euclid-shard-001/abc283-ex.md","learningOutcomeIds":["outcome-sum-affine-floors-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-euclidean-floor-sum","tag-contribution-reordering"],"sourceRevisionIds":["source-abc283-editorial-5432-69576b5888a8b64c6839b15fc69174eba2a3541e05c98db79b7dad54d564ab00","source-abc283-ex-problem-bcb6222919f7d6e23a9fbed1f4a936cf8936716ec7c9e09f842b1856896e3ee3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"対象値は正の等差数列R+tMに一意に並ぶ。bit kの指示値はfloor((A+2^k)/2^{k+1})−floor(A/2^{k+1})であり各Aについて0または1になる。これを等差数列で合計した二つのfloor_sumの差は当該bitの1個数そのもの。全bitを足すことでpopcount総和を得る。","sourceRevisionIds":["source-abc283-editorial-5432-69576b5888a8b64c6839b15fc69174eba2a3541e05c98db79b7dad54d564ab00","source-abc283-ex-problem-bcb6222919f7d6e23a9fbed1f4a936cf8936716ec7c9e09f842b1856896e3ee3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-sum-affine-floors-by-euclid"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=10,M=3,R=1。","procedure":["対象は1,4,7,10。popcountは1,1,3,2。"],"executionTarget":null,"expectedResult":"7。","verificationStatus":"not_applicable","learningUnitIds":["unit-euclidean-floor-sum"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-sum-affine-floors-by-euclid"],"prerequisiteIds":["unit-contribution-reordering"],"attainmentCondition":"R=0では0を対象へ含めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"最初の値M、例の答え4。"},"answer":{"reasoningOrVerification":"範囲は1..Nなので除く。例えばN=6,M=3の対象は3,6でpopcount和2+2=4。","procedure":["具体例の各状態・寄与を再計算する。","範囲は1..Nなので除く。例えばN=6,M=3の対象は3,6でpopcount和2+2=4。"],"expectedResult":"最初の値M、例の答え4。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [格子点転置によるfloor_sum](src/content/docs/learn/number-theory/euclidean-floor-sum.md)

- Σ floor((ai+b)/m)を整数部分の取り出しと格子点領域の転置で再帰し、Euclid型の引数減少からO(log m)を示せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

対象外:

- 格子点転置によるfloor_sumの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

popcount総和はbitごとの1の個数の和なので、k=0…29について合同条件を満たしbit kが1の整数数を数えればよい。

合同条件の整数はA_t=R+tMという等差数列になり、bit indicatorをfloorの差へ変えればfloor_sumを適用できる。

採用する候補: 各bitで1_{bit k(A)=1}=floor((A+2^k)/2^{k+1})−floor(A/2^{k+1})を使い、合同等差数列上の二つのfloor和をACL floor_sumで求める。

Nまでの対象整数を列挙せず、各bitをlogarithmicなEuclid型計算へ集約でき、T≤10^5に対応する。

棄却する候補: R mod Mの整数を1からNまで列挙し、各popcountを足す。

M=1,N=10^9のtestが多数あると対象数が巨大になる。

bit kはA mod2^{k+1}が[2^k,2^{k+1})にあるindicatorで、floor差が周期blockを正確に数える。

t=t_0,…,t_0+n-1にshiftすると各項はfloor((M·i+b)/2^{k+1})となり、floor_sum(n,mod,M,b)の形になる。

最小正のA=R+tMと最大≤Nからt rangeを求める。各kでm=2^{k+1}とし、shift後b=R+t_0Mについてfloor_sum(n,m,M,b+2^k)−floor_sum(n,m,M,b)をanswerへ足す。

## 典型の発動条件

### popcountのbit別寄与

発動条件: 多数整数のpopcount総和を求め、各bitの立つ個数を別々に数えられるとき。

sum_x popcount(x)=sum_k count(bit_k=1)へ交換する。

### floor sum

発動条件: 等差数列上のfloor((ai+b)/m)の総和が必要なとき。

Euclid algorithm型floor_sumでindex数に依存せず計算する。

## 問題固有の要素

周期的bit patternを直接区間数えせず、半周期shiftしたfloor quotientの差にすると合同等差列とも自然に合成できる。

別の問題へ持ち帰る視点: periodic 0/1 indicatorはfloor((x+shift)/period)-floor(x/period)で表せないか試す。

## 正当性

対象値は正の等差数列R+tMに一意に並ぶ。bit kの指示値はfloor((A+2^k)/2^{k+1})−floor(A/2^{k+1})であり各Aについて0または1になる。これを等差数列で合計した二つのfloor_sumの差は当該bitの1個数そのもの。全bitを足すことでpopcount総和を得る。

## 実装上の注意

- R=0ではt=0のA=0を除き最初をMにし、1≤A≤Nの項数を正確に作る。
- floor_sum内部積とanswerは64 bitを使い、b=R+t_0Mが大きい場合も型幅を確保する。

## 復習の核

- k=2のbit pattern00001111…とfloor((A+4)/8)-floor(A/8)をA=0…15で並べ、合同列へ抜き出して確認する。

## 計算量と制約

### 時間

各case O(log N·log max(N,M))。30bitそれぞれをEuclid型floor_sumで数える。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; 1 \leq M \leq N \leq 10^9; 0 \leq R < M; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=10,M=3,R=1。

1. 対象は1,4,7,10。popcountは1,1,3,2。

期待される結果: 7。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

R=0では0を対象へ含めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

範囲は1..Nなので除く。例えばN=6,M=3の対象は3,6でpopcount和2+2=4。

確認結果: 最初の値M、例の答え4。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/editorial/5432) — source-abc283-editorial-5432-69576b5888a8b64c6839b15fc69174eba2a3541e05c98db79b7dad54d564ab00
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc283/tasks/abc283_h) — source-abc283-ex-problem-bcb6222919f7d6e23a9fbed1f4a936cf8936716ec7c9e09f842b1856896e3ee3
