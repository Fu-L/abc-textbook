---
title: "ABC456-G — Count Holidays"
draft: true
authoringUnit: {"problemId":"abc456-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc456-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dynamic-modular-product"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-dynamic-modular-product"],"sourceRevisionIds":["source-abc456-editorial-19853-85c25e151a71ee941f2b1cd32f444f6f1c74dc4e15b57ca939670e623d7db1ae","source-abc456-g-problem-2c386fec87007ddfba9b7c501fd2d26ba3aa37f87bc2f8f493ebe2ece0f8e9cb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定勤務xが連休を切るためrun割当ては独立。runごとの長い連休開始に包除を施したf(n,k)は最大連休≤kの正確な数で、frequency乗の積が全予定の累積分布F_kになる。exact最大kは互いに入れ子の事象差F_k−F_{k−1}。F_{−1}=0とk≥nの全2^nを保てば最大0も正しく含む。","sourceRevisionIds":["source-abc456-editorial-19853-85c25e151a71ee941f2b1cd32f444f6f1c74dc4e15b57ca939670e623d7db1ae","source-abc456-g-problem-2c386fec87007ddfba9b7c501fd2d26ba3aa37f87bc2f8f493ebe2ece0f8e9cb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=..x.。","procedure":["自由3日で全8予定。最大0は全勤務の1個。","最大≤1は長さ2runの3割当て×長さ1runの2割当て=6。"],"executionTarget":null,"expectedResult":"最大0,1,2の数は1,5,2。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-dynamic-modular-product"],"attainmentCondition":"全日xなら最大0を数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"最大0だけ1。"},"answer":{"reasoningOrVerification":"自由runがなく積は1。連休は0なのでexact最大0が1、他0。","procedure":["具体例の各状態・寄与を再計算する。","自由runがなく積は1。連休は0なのでexact最大0が1、他0。"],"expectedResult":"最大0だけ1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [可逆な非零剰余と剰余 0 因子を含む法上の動的積](src/content/docs/learn/number-theory/dynamic-modular-product.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

固定勤務日xで分断された各 '.' run は独立で、最長連休≤kの予定数 F(S,k) はrun長nごとの f(n,k) の積になる。最長連休がちょうどkは隣接kの差で得られる。

採用する候補: 各run長のfrequencyをまとめ、包除原理で f(n,k) を O(n/(k+2)) に計算し、全runの積をkごとに更新して F(S,k) を列挙する。

k+1連休の開始点をm個指定すると各禁止blockが勤務1日+休日k+1日を占め、mの上限は (n+1)/(k+2) なので全kの計算量が調和級数型に収まる。

棄却する候補: 2^N 通りの勤務・休日割当を列挙し、各列の最長連休を測る。

自由日数に対して指数時間で、Nの制約を扱えない。

固定xは連休を必ず切るので各 '.' run の割当選択は独立で、総数は積になる。

包除で k+1以上の連休開始を選ぶと、1日目を選ぶ/選ばない二ケースの g(n,k,m) が二項係数と2冪で閉形式になる。

Sをxでsplitしてrun長frequencyを作り、階乗・逆階乗・2冪を前計算する。k=0..Nで各distinct nの f(n,k) をmの交代和から求め、frequency乗してF_kを作る。F_k-F_{k-1}を所望の分布として出力する。

## 典型の発動条件

### 固定separatorによる積分解

発動条件: 列の禁止patternが固定記号を跨がず、自由runごとに独立なとき。

run別の数え上げを掛け合わせる。

### 長run禁止の包除原理

発動条件: binary列で連続1の最大長を制限したいとき。

違反runの開始blockを選び、圧縮配置を二項係数で数える。

## 問題固有の要素

最長値の分布は『最大≤k』の累積数を先に列挙し、差分でexact値へ戻す。

別の問題へ持ち帰る視点: 全kで重いように見える和も、各項のstepがk+2なら二重総和を調和級数で評価できる。

## 正当性

固定勤務xが連休を切るためrun割当ては独立。runごとの長い連休開始に包除を施したf(n,k)は最大連休≤kの正確な数で、frequency乗の積が全予定の累積分布F_kになる。exact最大kは互いに入れ子の事象差F_k−F_{k−1}。F_{−1}=0とk≥nの全2^nを保てば最大0も正しく含む。

## 実装上の注意

- f(n,k)=2^n となる k≥n を早期処理し、積の0因子やmod逆元更新を安全に扱う。F_{-1}=0の差分境界を置く。

## 復習の核

- 違反run開始blockが互いに必要な間隔を図示し、1日目を含む/含まない g の二式とm上限を再導出する。

## 計算量と制約

### 時間

O(N log²N)をrun長頻度と包除交代和の調和級数集計の目安とする。厳密にはO(N+Σ_{k=0}^NΣ_{n∈R}⌊n/(k+1)⌋+|R|N log N)、Rはdistinct run長、frequency冪を二分累乗する。

### 空間

O(N)。階乗・2冪とrun頻度。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer between 1 and 2 \times 10^5, inclusive.; S is a string of length N consisting of ., x.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=..x.。

1. 自由3日で全8予定。最大0は全勤務の1個。
2. 最大≤1は長さ2runの3割当て×長さ1runの2割当て=6。

期待される結果: 最大0,1,2の数は1,5,2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全日xなら最大0を数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

自由runがなく積は1。連休は0なのでexact最大0が1、他0。

確認結果: 最大0だけ1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/editorial/19853) — source-abc456-editorial-19853-85c25e151a71ee941f2b1cd32f444f6f1c74dc4e15b57ca939670e623d7db1ae
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/tasks/abc456_g) — source-abc456-g-problem-2c386fec87007ddfba9b7c501fd2d26ba3aa37f87bc2f8f493ebe2ece0f8e9cb
