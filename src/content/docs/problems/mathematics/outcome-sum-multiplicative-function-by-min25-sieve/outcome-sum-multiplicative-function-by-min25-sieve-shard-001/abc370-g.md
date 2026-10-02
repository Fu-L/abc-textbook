---
title: "ABC370-G — Divisible by 3"
draft: true
authoringUnit: {"problemId":"abc370-g","docPath":"src/content/docs/problems/mathematics/outcome-sum-multiplicative-function-by-min25-sieve/outcome-sum-multiplicative-function-by-min25-sieve-shard-001/abc370-g.md","learningOutcomeIds":["outcome-sum-multiplicative-function-by-min25-sieve"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-integer-boundary-blocks","unit-prime-divisor"],"excludedTopics":["Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min25-sieve","tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc370-editorial-10869-b805b19b481f5f6449220fab8a2c5502e7d0135bdecba7ae5c67b32de475acd1","source-abc370-g-problem-24d3314149c61d48b68d9a4609bdb987c7c7fd4e495ed430aa041d2f82f6562f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"積nの指数をM位置へ配る個数g(n)=ΠC(e+M−1,M−1)は乗法的。σも乗法的なのでσ(n) mod3が非零なのは全prime-powerのσが非零のとき。hをそのcaseの重みだけ残す乗法関数として作るとg−hが目的重みになる。素因数の最小primeで分類するMin_25再帰は各nを一度生成し、商状態圧縮は必要な上限を全て保持する。","sourceRevisionIds":["source-abc370-editorial-10869-b805b19b481f5f6449220fab8a2c5502e7d0135bdecba7ae5c67b32de475acd1","source-abc370-g-problem-24d3314149c61d48b68d9a4609bdb987c7c7fd4e495ed430aa041d2f82f6562f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-sum-multiplicative-function-by-min25-sieve"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=6、M=1。","procedure":["σ(1..6)=1,3,4,7,6,12。","3の倍数はn=2,5,6、M=1なので各重み1。"],"executionTarget":null,"expectedResult":"3。","verificationStatus":"not_applicable","learningUnitIds":["unit-min25-sieve"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-sum-multiplicative-function-by-min25-sieve"],"prerequisiteIds":["unit-integer-boundary-blocks","unit-prime-divisor"],"attainmentCondition":"prime p=3のpowerはσ(p^e) mod3でどの状態か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"σ(3^e)≡1。"},"answer":{"reasoningOrVerification":"1+3+…+3^e≡1で常に非零。hはそのprime-power重みを残す。","procedure":["具体例の各状態・寄与を再計算する。","1+3+…+3^e≡1で常に非零。hはそのprime-power重みを残す。"],"expectedResult":"σ(3^e)≡1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Min_25・Lucy DP型の総和篩](src/content/docs/learn/number-theory/min25-sieve.md)

- floor(N/i)の異なる値だけを状態に、prime追加で篩更新して乗法的関数のprefix sumをN^(2/3)級で求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- Min_25・Lucy DP型の総和篩の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

積がnとなる長さMの正整数列数g(n)は、n=∏p^eに対して指数eをM要素へ配る方法の積∏C(e+M−1,M−1)となり、乗法的である。

約数和σも乗法的で、σ(n)が3の倍数なのは少なくとも一つのprime-power因子p^eでσ(p^e)≡0となる場合に限る。

採用する候補: 乗法的gと「bad prime-powerを含まない」hを定義し、Lucy DP＋Min_25型prefix sumでΣg−Σhを求める。

good条件を二つの乗法的関数の差へ変換し、Nまでの全整数を列挙せず商集合上で総和を計算できる。

棄却する候補: 各n≤Nを素因数分解し、σ(n)%3と積がnの列数を求めて足す。

Nが10^10で整数を一つずつ訪問できず、gとσの乗法性を利用していない。

h(p^e)=0 if σ(p^e)≡0 else g(p^e) と乗法的に延長すると、h(n)はσ(n)非零mod3のときだけg(n)に等しく、求めるindicator付き重みはg(n)−h(n)になる。

floor(N/i)の異なる値集合Q_Nは小さく、Lucy DPで各q∈Q_Nの素数重みprefixを作れば、prime-power遷移によるMin_25型DPを圧縮状態上で行える。

各eについてg(p^e)=C(e+M−1,M−1)、h(p^e)は幾何和1+p+…+p^eのmod3判定で0またはgとする。Lucy DPでq=floor(N/i)ごとのΣ_{p≤q}g(p),Σh(p)を、hでは素数のmod3 classも分けて得る。それぞれを初期値にprimeを逆順処理する簡略Min_25 DPでG(N)=Σg,H(N)=Σhを計算し、G−Hを法上で出力する。

## 典型の発動条件

### 条件indicatorの乗法的関数差分化

発動条件: 乗法的量の積が0となるprime-power factorを少なくとも一つ含む対象を数えるとき。

全重みgからbad factorを一つも含まない乗法的重みhを引く。

### Lucy DPとMin_25型乗法的prefix sum

発動条件: Nが巨大でprime-power値が容易に計算できる乗法的関数の総和。

floor quotient集合上でprime prefixを篩い、prime-powerを最小素因数順に追加する。

## 問題固有の要素

σ(n)%3=0というglobal条件が、mod3が体でσの積のどれかが0というlocal prime-power条件へ分解する。

別の問題へ持ち帰る視点: 乗法的関数の零判定では、法が素数なら積が零となるfactor条件を補集合化できる。

## 正当性

積nの指数をM位置へ配る個数g(n)=ΠC(e+M−1,M−1)は乗法的。σも乗法的なのでσ(n) mod3が非零なのは全prime-powerのσが非零のとき。hをそのcaseの重みだけ残す乗法関数として作るとg−hが目的重みになる。素因数の最小primeで分類するMin_25再帰は各nを一度生成し、商状態圧縮は必要な上限を全て保持する。

## 実装上の注意

- n=1ではσ(1)=1なのでg−h=0になる初期値を揃える。binomialは必要な小さいeだけ前計算し、p^eとfloor quotient計算のoverflowを防ぐ。

## 復習の核

- prime powerごとにp mod3とeからσ(p^e)を手計算しhを検証する。汎用prefix-sum routineへg,hのprime-power callbackを渡し、両者の初期値差を比較する。

## 計算量と制約

### 時間

O(N^{3/4}/log N)を標準Min_25系の目安とし、厳密にはO(√N+Σ_{p≤√N}|{q∈Q_N:q≥p²}|+素数冪遷移数)。

### 空間

O(√N+M+log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^{10}; 1 \leq M \leq 10^5; N and M are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=6、M=1。

1. σ(1..6)=1,3,4,7,6,12。
2. 3の倍数はn=2,5,6、M=1なので各重み1。

期待される結果: 3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

prime p=3のpowerはσ(p^e) mod3でどの状態か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

1+3+…+3^e≡1で常に非零。hはそのprime-power重みを残す。

確認結果: σ(3^e)≡1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/editorial/10869) — source-abc370-editorial-10869-b805b19b481f5f6449220fab8a2c5502e7d0135bdecba7ae5c67b32de475acd1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc370/tasks/abc370_g) — source-abc370-g-problem-24d3314149c61d48b68d9a4609bdb987c7c7fd4e495ed430aa041d2f82f6562f
