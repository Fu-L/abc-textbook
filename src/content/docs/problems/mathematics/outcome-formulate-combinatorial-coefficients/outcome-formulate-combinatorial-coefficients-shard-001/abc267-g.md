---
title: "ABC267-G — Increasing K Times"
draft: true
authoringUnit: {"problemId":"abc267-g","docPath":"src/content/docs/problems/mathematics/outcome-formulate-combinatorial-coefficients/outcome-formulate-combinatorial-coefficients-shard-001/abc267-g.md","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["重なりを交互加減する包除・Möbius反転。"],"tagIds":["tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc267-g-problem-bb9f28d5ab502a248b41cd16e04bfce2270452ee7061ae74f38bad3e88484d89","source-abc267-editorial-4733-01257e7bc6b2de3598c9b786620c254542e7a95f537d98e5d9fb9a2bef607cf8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"値順に固定したラベル順でgapへ挿入すると各最終順列から最大処理要素を順に削除できるので構成は一意。sentinel込みascent mのうち増えないgapはm+c、増えるgapはn+1−m−c。既存ascentの置換と同値左隣gapを分けたこの分類は全gapを覆うため、DPが正しい分布を生成し最終K+1を取れば元のstrict ascent Kになる。","sourceRevisionIds":["source-abc267-g-problem-bb9f28d5ab502a248b41cd16e04bfce2270452ee7061ae74f38bad3e88484d89","source-abc267-editorial-4733-01257e7bc6b2de3598c9b786620c254542e7a95f537d98e5d9fb9a2bef607cf8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,1,2)、二つの1は区別、K=1。","procedure":["値列112,121はascent1、211は0。","各値列に1のラベル交換2通り。"],"executionTarget":null,"expectedResult":"4順列。","verificationStatus":"not_applicable","learningUnitIds":["unit-combinatorial-coefficients"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-formulate-combinatorial-coefficients"],"prerequisiteIds":[],"attainmentCondition":"同値要素を区別しない拡張でも同じDP値を使うか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"例では4/2!=2。"},"answer":{"reasoningOrVerification":"このDPはラベル順の挿入を数える。全値列のラベル倍率Πf_v!が共通なのでその逆元で除く。","procedure":["具体例の各状態・寄与を再計算する。","このDPはラベル順の挿入を数える。全値列のラベル倍率Πf_v!が共通なのでその逆元で除く。"],"expectedResult":"例では4/2!=2。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)

- 選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 重なりを交互加減する包除・Möbius反転。

## 考察

要素は同値でも添字で区別されるので、値の非減少順に固定した順序で一要素ずつ最終列のgapへ挿入すると各permutationを一意に構成できる。

両端へ0 sentinelを置くと、最終列の元のstrict ascent K個に加えて左sentinelから先頭へのascentが必ず一つあり、管理目標はK+1になる。

棄却する候補: N!個の添字permutationを列挙して隣接するA値を比較する。

N=5000でpermutation列挙は不可能である。

採用する候補: 値の小さい順に挿入し、dp[n][m]をn要素挿入後のascent数mの方法数として、ascentが増えるgap数と増えないgap数で遷移する。

新値xは既存値以上なので、gapの局所比較だけでascent変化が0か1か決まり、その候補数はmと同値既挿入数から求まる。

n要素挿入済み、ascent数m、既に挿入したxと同値の要素数cなら、ascentを一つ増やすgapは n＋1−m−c 個である。

残る m＋c 個のgapではascent数が変わらないので、newdp[m]+=dp\[m](m+c)、newdp[m+1]+=dp\[m](n+1−m−c) と遷移する。

Eulerian-number型のgap insertion DPをmultiset-like equal valuesへ拡張し、strict ascentを作れないequal-left gapsの補正を加える。

## 典型の発動条件

### 昇順挿入によるascent数DP

発動条件: permutationの隣接大小関係数を数え、要素を大小順に追加すると局所変化が単純になるとき。

現在のascent数を状態にし、新最大要素を各gapへ入れたときの増分別に候補数を掛ける。

### sentinelによる端点統一

発動条件: 列の先頭・末尾gapを内部gapと同じ挿入規則で扱いたいとき。

値域外または最小のdummyを両端に置き、端点比較を通常の隣接比較へ含める。

## 問題固有の要素

既存左値が新値xと等しい下降・等値gapへ挿入しても左比較がstrict ascentにならないため、同値既挿入数cを増加gapから引く。

別の問題へ持ち帰る視点: distinct値向けEulerian recurrenceを重複値へ拡張するときは、strict比較が成立しないequal boundaryを数える。

## 正当性

値順に固定したラベル順でgapへ挿入すると各最終順列から最大処理要素を順に削除できるので構成は一意。sentinel込みascent mのうち増えないgapはm+c、増えるgapはn+1−m−c。既存ascentの置換と同値左隣gapを分けたこの分類は全gapを覆うため、DPが正しい分布を生成し最終K+1を取れば元のstrict ascent Kになる。

## 実装上の注意

- Aを値順にsortし、同じ値group内で何個処理済みかをcとして一要素ごとに増やす。
- 初期列(0,0)はascent0の一通りで、最終的にdp[K+1]を答えとする。

## 復習の核

- permutationの局所比較統計は、値順に要素を挿入したとき一つのgapがどう変わるかで数える。
- 重複値がある場合、distinct版の候補gap数からstrict不等号を失う同値境界を明示的に除く。

## 計算量と制約

### 時間

O(N²)（目標Kで打切ればO(NK)）とsort O(N log N)。

### 空間

O(N)、打切りO(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5000; 0 \leq K \leq N - 1; 1 \leq A_i \leq N \, (1 \leq i \leq N); All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,1,2)、二つの1は区別、K=1。

1. 値列112,121はascent1、211は0。
2. 各値列に1のラベル交換2通り。

期待される結果: 4順列。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同値要素を区別しない拡張でも同じDP値を使うか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

このDPはラベル順の挿入を数える。全値列のラベル倍率Πf_v!が共通なのでその逆元で除く。

確認結果: 例では4/2!=2。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/tasks/abc267_g) — source-abc267-g-problem-bb9f28d5ab502a248b41cd16e04bfce2270452ee7061ae74f38bad3e88484d89
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc267/editorial/4733) — source-abc267-editorial-4733-01257e7bc6b2de3598c9b786620c254542e7a95f537d98e5d9fb9a2bef607cf8
