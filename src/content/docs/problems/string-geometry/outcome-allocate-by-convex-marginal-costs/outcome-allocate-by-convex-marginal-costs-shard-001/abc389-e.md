---
title: "ABC389-E — Square Price"
draft: true
authoringUnit: {"problemId":"abc389-e","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc389-e.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-monotone-search"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc389-e-problem-3a553297817d29a27dfb7d11685a16ed62c082e74450f447d074a561c7780d7c","source-abc389-editorial-11933-465f9d18cab3042f93ba18a34e19f674ce5a62395f1b557e7fa003637d1dcd6d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"商品iのk個costは増加限界価格P_i,3P_i,…のprefix和。全限界単位を安い順に買うとprefix条件が自動的に守られ、同個数の最小costを与える。threshold以下全購入costが予算内となる最大整数xを選ぶと、次価格x+1全ては買えない。残金でその同価格単位だけ追加した後はどの安い単位も残っておらず個数最大になる。","sourceRevisionIds":["source-abc389-e-problem-3a553297817d29a27dfb7d11685a16ed62c082e74450f447d074a561c7780d7c","source-abc389-editorial-11933-465f9d18cab3042f93ba18a34e19f674ce5a62395f1b557e7fa003637d1dcd6d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(1,2)、M=10。","procedure":["限界価格は1,2,3,5,6,…。最安3単位のcost6。","四単位はcost11で予算超。"],"executionTarget":null,"expectedResult":"最大3個。","verificationStatus":"not_applicable","learningUnitIds":["unit-separable-convex-marginals"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"prerequisiteIds":["unit-basic-convex-optimization","unit-monotone-search"],"attainmentCondition":"M=11へ増やすと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"4個。"},"answer":{"reasoningOrVerification":"価格5の次単位が買え、商品1を3個/商品2を1個でcost9+2=11。","procedure":["具体例の各状態・寄与を再計算する。","価格5の次単位が買え、商品1を3個/商品2を1個でcost9+2=11。"],"expectedResult":"4個。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

対象外:

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

商品iをk個買うcost k²P_iは、限界価格P_i,3P_i,5P_i,…の安い順にk個買う総和と等しい。全商品を跨いで限界価格の安いものから取るgreedyに言い換えられる。

限界価格x以下を全て買う個数とcostは、各iでk_i=floor((x/P_i+1)/2)としてΣk_i, ΣP_i k_i²からO(N)で評価できる。

採用する候補: 買える限界価格thresholdを二分探索し、残予算で境界価格の商品を追加する

threshold以下の総costは単調で、O(N log M)で最大thresholdを求めた後、次の同価格限界単位を残予算分だけ加えれば最適個数になる。

棄却する候補: 各商品の次の限界価格をheapで一個ずつ取り出す

答え個数が予算Mに比例して最大10^18級になり得て、購入単位ごとのloopは終わらない。

平方costの差(k+1)²-k²=2k+1が限界価格列を作る。

threshold計算中はcostがMを超えた時点で打ち切り、積P_i k_i²のoverflowを防ぐ。

xを限界価格としてtotalCost(x)=ΣP_i floor((x/P_i+1)/2)²≤Mの最大xを二分探索する。対応個数cntと残金を求め、価格x+1の限界単位を買えるだけ追加する。

## 典型の発動条件

### 凸costの限界費用展開

発動条件: 同種をk個取るcostが離散凸で、総個数を予算内最大化するとき。

差分costを独立unitの価格とみなして全体greedyにする。

### answer thresholdの二分探索

発動条件: 閾値以下の全候補の個数・総costを集約できるとき。

購入境界の限界価格を単調判定する。

## 問題固有の要素

各種類の平方costをそのまま最適化せず、離散微分すると全種類共通の「最安から購入」という単純greedyになる。

別の問題へ持ち帰る視点: separable convex resource allocationは各変数のmarginal cost列をmergeする視点を持つ。

## 正当性

商品iのk個costは増加限界価格P_i,3P_i,…のprefix和。全限界単位を安い順に買うとprefix条件が自動的に守られ、同個数の最小costを与える。threshold以下全購入costが予算内となる最大整数xを選ぶと、次価格x+1全ては買えない。残金でその同価格単位だけ追加した後はどの安い単位も残っておらず個数最大になる。

## 実装上の注意

- upper boundとmid計算、P_i k_i²には128 bit相当を使いM超過でsaturateする。境界価格の追加数を実在する次unit数で制限する。

## 復習の核

- N≤5,M≤1000でheapによるunit greedyと比較し、thresholdに価格が存在しない場合、同価格unit多数、P_i>Mを確認する。

## 計算量と制約

### 時間

O(N log M)。価格thresholdごとの平方cost評価。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^{5}; 1 \leq M \leq 10^{18}; 1 \leq P_i \leq 2 \times 10^{9}; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(1,2)、M=10。

1. 限界価格は1,2,3,5,6,…。最安3単位のcost6。
2. 四単位はcost11で予算超。

期待される結果: 最大3個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

M=11へ増やすと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

価格5の次単位が買え、商品1を3個/商品2を1個でcost9+2=11。

確認結果: 4個。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc389/tasks/abc389_e) — source-abc389-e-problem-3a553297817d29a27dfb7d11685a16ed62c082e74450f447d074a561c7780d7c
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc389/editorial/11933) — source-abc389-editorial-11933-465f9d18cab3042f93ba18a34e19f674ce5a62395f1b557e7fa003637d1dcd6d
