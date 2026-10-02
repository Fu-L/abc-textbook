---
title: "ABC273-G — Row Column Sums 2"
draft: true
authoringUnit: {"problemId":"abc273-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc273-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc273-g-problem-a8cbbb62a9f35cc5fae747bf912339c2bb22b8268b05a7f1af189bba14e66e72","source-abc273-editorial-5014-e1daa5033dad807950b2b2a3df8e18844b1cb388bdb54b4cd79cbd890d2c684d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一行の和は0,1,2だけなので、その行を置く前の各列の残余は0,1,2のいずれかである。残余2の列数と残余1の列数を状態とすると、同じ残余の列は交換対称である。一行の2を一列へ置く場合と二列へ1ずつ置く場合を、それぞれ選ぶ列の組合せ数で遷移すれば、各行の配置を全て一回ずつ数えられる。残余総和から片方の列数は復元できるため二次元DPに圧縮でき、全行処理後の残余0状態が答えとなる。","sourceRevisionIds":["source-abc273-g-problem-a8cbbb62a9f35cc5fae747bf912339c2bb22b8268b05a7f1af189bba14e66e72","source-abc273-editorial-5014-e1daa5033dad807950b2b2a3df8e18844b1cb388bdb54b4cd79cbd890d2c684d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"R=(1,1),C=(1,1)。","procedure":["各行に一個、各列に一個なので二つのpermutation matrix。","((1,0),(0,1))と((0,1),(1,0))。"],"executionTarget":null,"expectedResult":"2通り。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-combinatorial-coefficients"],"attainmentCondition":"R=(2,0),C=(1,1)なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"第一行を(1,1)、第二行を(0,0)へ置く唯一のmatrixで1通り。"},"answer":{"reasoningOrVerification":"第一行を(1,1)、第二行を(0,0)へ置く唯一のmatrixで1通り。","procedure":["具体例の各状態・寄与を再計算する。","第一行を(1,1)、第二行を(0,0)へ置く唯一のmatrixで1通り。"],"expectedResult":"第一行を(1,1)、第二行を(0,0)へ置く唯一のmatrixで1通り。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

rowを上から埋める途中、各columnのremaining sumは0,1,2のいずれかで、同じremaining sumを持つcolumnsは将来について交換可能である。

remaining-2 columns数xが分かれば、remaining-1 columns数yは total column remainder−2x=ΣC−Σ_{k≤i}R_k−2xから一意に決まる。

棄却する候補: 各rowのN個のentriesまたは各column remainder vectorを列挙する。

column identitiesを保持すると状態数が指数的になり、matrix entriesの配置列挙も巨大である。

採用する候補: dp[i][x]をi rows後にremaining sum 2のcolumnsがx個であるwaysとし、R_i∈{0,1,2}ごとのconstant patternsを組合せ係数付きで遷移する。

yもxから復元でき、一rowのsumが高々2なので使うcolumn種別のpatternが定数個しかない。

R_i=1ではremaining 2または1のcolumnを一つ選び、R_i=2では一columnへ2、または二columnsへ1ずつ置く全patternを数える。

各patternのmultiplicityはx、y、C(x,2)、C(y,2)、xyのいずれかで、column labelsを失ったstateでも正確なwaysを復元できる。

bounded row/column-sum matrix countingをcolumn remainder histogramへstate compressionし、row sum別のcombinatorial transitionsで数える。

## 典型の発動条件

### exchangeable objectsの個数DP

発動条件: 個体identityではなく少数の状態classごとの個数だけが将来遷移を決めるとき。

columnsをremaining 0/1/2に分類し、remaining-2の個数xだけを明示stateにする。

### 小さいrow sumの組合せ遷移

発動条件: 一stepで配る総量が小定数で、選ぶclass patternを全列挙できるとき。

0,1,2 unitsの配り方を列挙し、該当columnsの選択数をbinomial coefficientsで掛ける。

## 問題固有の要素

ΣR≠ΣCなら即0で、等しい場合は最終x=0ならremaining totalも0なのでyも自動的に0となりdp[N][0]が答えになる。

別の問題へ持ち帰る視点: 圧縮stateで省いたclass countは保存量のconservation lawから復元し、終端条件も同じ保存量で簡約する。

## 正当性

一行の和は0,1,2だけなので、その行を置く前の各列の残余は0,1,2のいずれかである。残余2の列数と残余1の列数を状態とすると、同じ残余の列は交換対称である。一行の2を一列へ置く場合と二列へ1ずつ置く場合を、それぞれ選ぶ列の組合せ数で遷移すれば、各行の配置を全て一回ずつ数えられる。残余総和から片方の列数は復元できるため二次元DPに圧縮でき、全行処理後の残余0状態が答えとなる。

## 実装上の注意

- 式から得るx,yが0…Nの範囲外ならそのstateを無効とし、組合せ係数もnegative countへ適用しない。
- row indexごとにold/new arraysを分けてzero clearし、全waysをmodulo 998244353で加算する。

## 復習の核

- 残容量が少数値しか取らない割当問題は、itemsのidentityを捨ててcapacity class countsへ圧縮する。
- stateを一変数まで減らす際は、残りのclass countが総和保存から一意に戻ることを式で示す。

## 計算量と制約

### 時間

O(N²)、行番号×remaining2列数、remaining1数は総残量から復元。

### 空間

O(N)、rolling行DP。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5000; 0 \leq R_i \leq 2; 0 \leq C_i \leq 2; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

R=(1,1),C=(1,1)。

1. 各行に一個、各列に一個なので二つのpermutation matrix。
2. ((1,0),(0,1))と((0,1),(1,0))。

期待される結果: 2通り。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

R=(2,0),C=(1,1)なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

第一行を(1,1)、第二行を(0,0)へ置く唯一のmatrixで1通り。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/tasks/abc273_g) — source-abc273-g-problem-a8cbbb62a9f35cc5fae747bf912339c2bb22b8268b05a7f1af189bba14e66e72
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/editorial/5014) — source-abc273-editorial-5014-e1daa5033dad807950b2b2a3df8e18844b1cb388bdb54b4cd79cbd890d2c684d
