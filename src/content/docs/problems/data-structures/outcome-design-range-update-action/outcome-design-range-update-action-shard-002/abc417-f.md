---
title: "ABC417-F — Random Gathering"
draft: true
authoringUnit: {"problemId":"abc417-f","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-002/abc417-f.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-modular-arithmetic","unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc417-editorial-13549-9592f5d00c9cb4b14771101aa832aa0791fe2e15d3b99f55a07229f40675b664","source-abc417-f-problem-1fbb588cf6c343f09c00dde44b41f0da9c4ec9e47246eac1da54be528285f28c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"実際の配置は一皿に全stoneが集まるが、各jが選ばれる確率1/lenなのでE[X'_j]=E[ΣX_k]/len=ΣE[X_k]/lenとなる。 lazy tagは加算ではなく上書きで、node区間長lenNodeに値vをassignしたときsum=v·lenNodeへ置換し、後のtagが前のtagを上書きする。 各操作でsum=prod(L,R)、v=sum/(R-L+1)を求めrange assign vとし、全体O((N+M)log N)で処理できる。","sourceRevisionIds":["source-abc417-editorial-13549-9592f5d00c9cb4b14771101aa832aa0791fe2e15d3b99f55a07229f40675b664","source-abc417-f-problem-1fbb588cf6c343f09c00dde44b41f0da9c4ec9e47246eac1da54be528285f28c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-range-update-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,8)、全区間から一皿を等確率で選んで全石を集める。","procedure":["合計10。","各皿が選ばれる確率1/2なので両期待値は5。"],"executionTarget":null,"expectedResult":"期待値列(5,5)。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-actions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-range-update-action"],"prerequisiteIds":["unit-contribution-reordering","unit-modular-arithmetic","unit-range-monoid-aggregation"],"attainmentCondition":"期待値が0の区間代入をtagなしとしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"区間総和0も正規の更新である。値0とtagなしを区別しないと過去の値が残る。"},"answer":{"reasoningOrVerification":"区間総和0も正規の更新である。値0とtagなしを区別しないと過去の値が残る。","procedure":["具体例の各状態・寄与を再計算する。","区間総和0も正規の更新である。値0とtagなしを区別しないと過去の値が残る。"],"expectedResult":"区間総和0も正規の更新である。値0とtagなしを区別しないと過去の値が残る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

一操作後、区間[L,R]の各plateの期待stone数は、操作前区間総和をlenで割った同じ値になる。選択位置とstone数は相関しても、期待値の線形性により総和の期待値だけでよい。

区間外の期待値は変わらないため、必要操作は現在期待値配列へのrange sum queryと、その区間全体へのconstant assignmentである。

採用する候補: range sumとrange assignment lazy propagationを持つsegment treeで期待値配列をオンライン更新する

各操作でsum=prod(L,R)、v=sum/(R-L+1)を求めrange assign vとし、全体O((N+M)log N)で処理できる。

棄却する候補: 各操作で[L,R]の全要素を走査して合計し同じ期待値を書き込む

区間長がNの操作がM回あり得てO(NM)となる。

実際の配置は一皿に全stoneが集まるが、各jが選ばれる確率1/lenなのでE[X'_j]=E[ΣX_k]/len=ΣE[X_k]/lenとなる。

lazy tagは加算ではなく上書きで、node区間長lenNodeに値vをassignしたときsum=v·lenNodeへ置換し、後のtagが前のtagを上書きする。

leafをA_iでbuildする。各(L,R)でrange sum sを取得し、v=s·inv(R-L+1) mod 998244353を計算してrange assignする。全操作後に各point value、またはtreeを展開したleafを順に出力する。

## 典型の発動条件

### 期待値の線形性

発動条件: ランダムに全量を一地点へ集める操作の各位置期待値を追うとき。

選択indicatorと区間総量の積を条件付けし、期待総和を均等配分する。

### lazy segment tree

発動条件: range aggregate取得とrange全代入が混在するとき。

node sumとoptional assignment tagを持ち、区間長倍でapplyする。

## 問題固有の要素

ランダム過程の分布や共分散を保持せず、操作が線形なので期待値vector自体へ同じ確定range平均操作を適用できる。

別の問題へ持ち帰る視点: 確率操作が状態の線形変換なら、期待値にも同じ線形変換を施し、deterministic data structureで処理する。

## 正当性

実際の配置は一皿に全stoneが集まるが、各jが選ばれる確率1/lenなのでE[X'_j]=E[ΣX_k]/len=ΣE[X_k]/lenとなる。 lazy tagは加算ではなく上書きで、node区間長lenNodeに値vをassignしたときsum=v·lenNodeへ置換し、後のtagが前のtagを上書きする。 各操作でsum=prod(L,R)、v=sum/(R-L+1)を求めrange assign vとし、全体O((N+M)log N)で処理できる。

## 実装上の注意

- assignment値0とtagなしを別flagで区別する。区間長の逆元をmodで計算し、half-open indexとnode長を揃える。

## 復習の核

- 長さ1、全区間、重なる区間、期待値0のassignmentを小Nの全乱数列挙と比較する。

## 計算量と制約

### 時間

長さ逆元前計算O(N)、操作O(M log N)、葉展開O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 1\le M\le2\times10 ^ 5; 0\le A _ i\lt998244353\ (1\le i\le N); 1\le L _ i\le R _ i\le N\ (1\le i\le M); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,8)、全区間から一皿を等確率で選んで全石を集める。

1. 合計10。
2. 各皿が選ばれる確率1/2なので両期待値は5。

期待される結果: 期待値列(5,5)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

期待値が0の区間代入をtagなしとしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

区間総和0も正規の更新である。値0とtagなしを区別しないと過去の値が残る。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc417/editorial/13549) — source-abc417-editorial-13549-9592f5d00c9cb4b14771101aa832aa0791fe2e15d3b99f55a07229f40675b664
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc417/tasks/abc417_f) — source-abc417-f-problem-1fbb588cf6c343f09c00dde44b41f0da9c4ec9e47246eac1da54be528285f28c
