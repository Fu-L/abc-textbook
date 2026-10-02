---
title: "ABC256-EX — I like Query Problem"
draft: true
authoringUnit: {"problemId":"abc256-ex","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc256-ex.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-interval-partition","unit-range-actions"],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress","tag-lazy-segment-action","tag-ordered-interval-partition"],"sourceRevisionIds":["source-abc256-editorial-4113-b667817153afbda977d604d7adff6aba7889dddc553740a456a9480f421ac953","source-abc256-ex-problem-35ffd11a0ff489dfad648c6600b49e72b4c999c80b95ba184ed68743c2218d80"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"setには値が等しく1以上の極大区間だけを置き、除算質問では[L,R]と交わる区間を列挙して一様な新値をlazy segment treeへ代入する。 区間代入は新しい同値区間をO(1)個生成し、除算は正値を半減させるため、区間訪問総数を(N+Q)log max Aで償却できる。 同じ値の区間なら除算後も一括代入でき、各代入で生じた区間が正のまま分割除算される回数は値の対数回に限られる。","sourceRevisionIds":["source-abc256-editorial-4113-b667817153afbda977d604d7adff6aba7889dddc553740a456a9480f421ac953","source-abc256-ex-problem-35ffd11a0ff489dfad648c6600b49e72b4c999c80b95ba184ed68743c2218d80"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-bound-monotone-total-work"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(9,9,0)、全域を2で割り、再び2で割る。","procedure":["非零同値block9→4。","次に4→2、0は常に0。"],"executionTarget":null,"expectedResult":"列は(4,4,0)、次(2,2,0)。","verificationStatus":"not_applicable","learningUnitIds":["unit-amortized-monotone-progress"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-bound-monotone-total-work"],"prerequisiteIds":["unit-ordered-interval-partition","unit-range-actions"],"attainmentCondition":"除数1を償却の半減根拠に使えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"使えない。半減解析にはx≥2という制約が必要で、1なら更新を省く別扱いが必要。"},"answer":{"reasoningOrVerification":"使えない。半減解析にはx≥2という制約が必要で、1なら更新を省く別扱いが必要。","procedure":["具体例の各状態・寄与を再計算する。","使えない。半減解析にはx≥2という制約が必要で、1なら更新を省く別扱いが必要。"],"expectedResult":"使えない。半減解析にはx≥2という制約が必要で、1なら更新を省く別扱いが必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)
- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

区間floor除算は和に対する遅延作用として閉じない一方、x≥2なので正の値へ適用されるたび少なくとも半分になり、0になれば代入まで変化しない。

採用する候補: 非零同値区間のsetとrange-assign/range-sum lazy segment tree

同じ値の区間なら除算後も一括代入でき、各代入で生じた区間が正のまま分割除算される回数は値の対数回に限られる。

棄却する候補: 通常の遅延セグメント木へfloor除算を直接載せる

floor(a/x)の区間和は元の区間和だけから求まらず、一般区間へ作用を合成できない。

setには値が等しく1以上の極大区間だけを置き、除算質問では[L,R]と交わる区間を列挙して一様な新値をlazy segment treeへ代入する。

区間代入は新しい同値区間をO(1)個生成し、除算は正値を半減させるため、区間訪問総数を(N+Q)log max Aで償却できる。

初期配列を非零同値区間へまとめ、別に区間代入・区間和可能な遅延セグメント木を持つ。除算では対象区間をsplitして各値vをfloor(v/x)へ代入し、0区間をsetから消す。代入質問でもsetを置換し、和質問はsegment treeから得る。

## 典型の発動条件

### 同値区間の順序付き集合

発動条件: 非線形更新でも、一定値区間なら結果を一括計算できる。

非零の極大一定値区間を列挙し、境界分割・削除・再挿入する。

### 値減少による償却解析

発動条件: 更新一回の訪問区間数は多くても、各正値が定数比で減る。

一つの生成区間が除算で処理される回数をlog max Aへ課金する。

### range assign / range sum lazy tree

発動条件: 区間を一様値へ更新し、任意区間和を取得したい。

setで決めた新値を区間代入し、和質問を対数時間で答える。

## 問題固有の要素

floor除算の非線形性を無理にモノイド化せず、同値区間上では単純な代入になることと、値が半減する償却性を組み合わせる。

別の問題へ持ち帰る視点: 区間作用が集約値へ閉じなくても、作用可能な一様ブロックへ分け、その分割回数をポテンシャルで抑えられる場合がある。

## 正当性

setには値が等しく1以上の極大区間だけを置き、除算質問では[L,R]と交わる区間を列挙して一様な新値をlazy segment treeへ代入する。 区間代入は新しい同値区間をO(1)個生成し、除算は正値を半減させるため、区間訪問総数を(N+Q)log max Aで償却できる。 同じ値の区間なら除算後も一括代入でき、各代入で生じた区間が正のまま分割除算される回数は値の対数回に限られる。

## 実装上の注意

- setとsegment treeの値を全更新で同期させ、除算後に0となる区間はsetへ戻さない。端の区間を正確にsplitし、同値隣接区間は可能なら統合する。

## 復習の核

- 小さい配列の直接実装と比較し、除算で0になる例、同値区間の一部更新、代入後の再除算、隣接区間が同値へ戻る境界を確認する。

## 計算量と制約

### 時間

償却O((N+Q)log Amax log N)、非零blockは除算で半減する。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 1 \leq Q \leq 10^5; 1 \leq L \leq R \leq N; 1 \leq a_i \leq 10^5; 2 \leq x \leq 10^5; 1 \leq y \leq 10^5; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(9,9,0)、全域を2で割り、再び2で割る。

1. 非零同値block9→4。
2. 次に4→2、0は常に0。

期待される結果: 列は(4,4,0)、次(2,2,0)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

除数1を償却の半減根拠に使えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

使えない。半減解析にはx≥2という制約が必要で、1なら更新を省く別扱いが必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/editorial/4113) — source-abc256-editorial-4113-b667817153afbda977d604d7adff6aba7889dddc553740a456a9480f421ac953
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/tasks/abc256_h) — source-abc256-ex-problem-35ffd11a0ff489dfad648c6600b49e72b4c999c80b95ba184ed68743c2218d80
