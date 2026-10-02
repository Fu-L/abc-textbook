---
title: "ABC304-G — Max of Medians"
draft: true
authoringUnit: {"problemId":"abc304-g","docPath":"src/content/docs/problems/hybrid/outcome-solve-xor-threshold-matching/outcome-solve-xor-threshold-matching-shard-001/abc304-g.md","learningOutcomeIds":["outcome-solve-xor-threshold-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-search","unit-recursive-divide-and-conquer"],"excludedTopics":["一般二部matching・一般グラフmatchingを汎用アルゴリズムで解く問題。","二集合間の最大XORだけを求める最小化問題、および上位bitを順に固定するbitwise greedy feasibility。"],"tagIds":["tag-xor-threshold-matching","tag-monotone-threshold-search","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc304-editorial-6509-25665901acc3aee34a2f625c898512795ee5ada3a6f576e8ca88f946ca941092","source-abc304-g-problem-7222f03c3a6f796b532d44f31f39fb82660aa4eadbb9f8ec4112eecc795e3f5a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"bit dでx_d=0なら異なるbit群のxorはその時点でxを上回るため可能なだけ貪欲にpairにし、余剰だけを下位bitへ渡せる。x_d=1なら同じbit群のpairはx未満に確定し、異なる群同士だけをcross-pair関数gで再帰する。この場合分けが最大matching数を保つ。 xorと閾値の大小を上位bitから決め、同一集合内pairと二集合間pairの二関数に分ければ、一回の判定をほぼ線形対数時間で行える。","sourceRevisionIds":["source-abc304-editorial-6509-25665901acc3aee34a2f625c898512795ee5ada3a6f576e8ca88f946ca941092","source-abc304-g-problem-7222f03c3a6f796b532d44f31f39fb82660aa4eadbb9f8ec4112eecc795e3f5a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-xor-threshold-matching"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、値(0,1,2,3)。","procedure":["pair(0,3),(1,2)は両XOR3。","全値は2bit以内なのでXORは3以下。"],"executionTarget":null,"expectedResult":"最大median3。","verificationStatus":"not_applicable","learningUnitIds":["unit-xor-threshold-matching"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-xor-threshold-matching"],"prerequisiteIds":["unit-monotone-search","unit-recursive-divide-and-conquer"],"attainmentCondition":"高位threshold bit1では同bit群をpairにできるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同bitならXOR高位0で閾値未満が確定する。異bit群のcross matchingだけへ再帰する。"},"answer":{"reasoningOrVerification":"同bitならXOR高位0で閾値未満が確定する。異bit群のcross matchingだけへ再帰する。","procedure":["具体例の各状態・寄与を再計算する。","同bitならXOR高位0で閾値未満が確定する。異bit群のcross matchingだけへ再帰する。"],"expectedResult":"同bitならXOR高位0で閾値未満が確定する。異bit群のcross matchingだけへ再帰する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR閾値matchingのbit分割再帰](src/content/docs/learn/modeling/xor-threshold-matching.md)

- 整数集合を上位bitで分け、XORが固定閾値以上となる最大pair数を、同一集合内と二集合間の再帰関数へ分解して正しく合成できる。閾値bitごとのcross pairの確定条件と最大性を証明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 一般二部matching・一般グラフmatchingを汎用アルゴリズムで解く問題。
- 二集合間の最大XORだけを求める最小化問題、および上位bitを順に固定するbitwise greedy feasibility。

## 考察

候補x以上のxor pairを最大で何組作れるかをf(A,x)とすると、medianをx以上にできる必要十分条件はf(A,x)≥floor((N+1)/2)である。この判定はxに対して単調なので答えを二分探索できる。

採用する候補: bitごとの分割再帰でxor≥xとなる最大matching数を求める

xorと閾値の大小を上位bitから決め、同一集合内pairと二集合間pairの二関数に分ければ、一回の判定をほぼ線形対数時間で行える。

棄却する候補: 値をsortして隣接要素同士をpairにする

最大medianでは一部のpairだけをx以上にすればよく、xorの大小も数値順の隣接性に従わないため、固定pairingの最適性がない。

bit dでx_d=0なら異なるbit群のxorはその時点でxを上回るため可能なだけ貪欲にpairにし、余剰だけを下位bitへ渡せる。x_d=1なら同じbit群のpairはx未満に確定し、異なる群同士だけをcross-pair関数gで再帰する。この場合分けが最大matching数を保つ。

f_d(C,x)をC内、g_d(C,D,x)をCとD間でxor≥xとなる最大pair数として、各列をbit dの0群・1群へ分割する。d=-1ではそれぞれfloor(|C|/2)、min(|C|,|D|)とし、x_dに応じて確定するcross pair数と下位bitのf/gを公式の漸化式で合成する。f_29(A,x)がfloor((N+1)/2)以上かを判定してxを二分探索する。

## 典型の発動条件

### bitwise divide and conquer

発動条件: xorと閾値の比較が、最上位の異なるbitで決まる。

各bitで要素を0/1群へ分け、既に閾値超過が確定するpairと下位bit比較が必要なpairを分離する。

### 最大値の二分探索

発動条件: medianをx以上にできるなら、より小さい閾値も必ず実現できる。

最大good-pair数f(A,x)を判定関数とし、30bit範囲の最大の真となるxを探す。

## 問題固有の要素

長さNのxor列のmedianは昇順でfloor(N/2)+1番目なので、全N pairを閾値以上にする必要はなく、ceil(N/2)=floor((N+1)/2)組だけ作れればよい。

別の問題へ持ち帰る視点: 順列自由なmedian最大化は、閾値以上の要素を必要個数だけ作る最大matching判定へ変えると扱いやすい。

## 正当性

bit dでx_d=0なら異なるbit群のxorはその時点でxを上回るため可能なだけ貪欲にpairにし、余剰だけを下位bitへ渡せる。x_d=1なら同じbit群のpairはx未満に確定し、異なる群同士だけをcross-pair関数gで再帰する。この場合分けが最大matching数を保つ。 xorと閾値の大小を上位bitから決め、同一集合内pairと二集合間pairの二関数に分ければ、一回の判定をほぼ線形対数時間で行える。

## 実装上の注意

- 入力は2N要素で、必要good pair数はfloor((N+1)/2)である。再帰のbase d=-1、空group、fとgの引数の向きを揃え、sort区間で群を表す場合はbit境界indexを正しく求める。

## 復習の核

- Nの小さいmultisetで全perfect matchingを列挙し、重複値、0、bit境界直前・直後のx、Nの偶奇について判定fとmedianの最大値を比較する。

## 計算量と制約

### 時間

O(NB²)、Nはpair数で入力長2N、B=30、各判定O(NB)。

### 空間

O(NB)、sorted bit分割境界の前計算。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq A_i < 2^{30}; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、値(0,1,2,3)。

1. pair(0,3),(1,2)は両XOR3。
2. 全値は2bit以内なのでXORは3以下。

期待される結果: 最大median3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

高位threshold bit1では同bit群をpairにできるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同bitならXOR高位0で閾値未満が確定する。異bit群のcross matchingだけへ再帰する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/editorial/6509) — source-abc304-editorial-6509-25665901acc3aee34a2f625c898512795ee5ada3a6f576e8ca88f946ca941092
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/tasks/abc304_g) — source-abc304-g-problem-7222f03c3a6f796b532d44f31f39fb82660aa4eadbb9f8ec4112eecc795e3f5a
