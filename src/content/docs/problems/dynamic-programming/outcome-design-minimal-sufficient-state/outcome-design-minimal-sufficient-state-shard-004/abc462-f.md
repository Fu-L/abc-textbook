---
title: "ABC462-F — More ABC"
draft: true
authoringUnit: {"problemId":"abc462-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc462-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc462-editorial-16164-52cbbb3827b91c096a486d13c992362aea139b8b1e716475326183aac32a6c62","source-abc462-f-problem-31b1d1c4439105d0f203b91f1d5f4a8da45b6be631e272f544ac6728d4ec70a0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ABCは自分と重ならないため、末尾の新ABCを採ると直前三文字を一blockとして前prefixと分離できる。元prefixがその三文字間で失う既存ABCはX_i個、block作成はY_i変更なのでdp[i−3,j−1+X_i]+Y_i。末尾ABCを作らない最適では末尾字を元へ戻してもABC数は減らず変更数が減るから、skipはdp[i−1,j+Z_i]。この論法は「少なくともj増加」の状態で成立し、j=0の基底0を用いる。最終に過剰増加があっても変更字を一字ずつ元へ戻すと、一字でABC数は高々1だけ変わるので目標ちょうどKを必ず通り、費用は増えない。よって最小の少なくともK解とちょうどK解の費用は等しい。","sourceRevisionIds":["source-abc462-editorial-16164-52cbbb3827b91c096a486d13c992362aea139b8b1e716475326183aac32a6c62","source-abc462-f-problem-31b1d1c4439105d0f203b91f1d5f4a8da45b6be631e272f544ac6728d4ec70a0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=\"AACDDD\",K=1。","procedure":["元のABC数は0。","位置2のAをBへ変更するとABCDDDとなりABC一個。","0変更では目標未達なので下界1を達成。"],"executionTarget":null,"expectedResult":"1","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":[],"attainmentCondition":"同じSでK=2なら最小変更は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"4。長さ6でABC二個はABCABC以外なく、AAC→ABCが1変更、DDD→ABCが3変更で計4。"},"answer":{"reasoningOrVerification":"4。長さ6でABC二個はABCABC以外なく、AAC→ABCが1変更、DDD→ABCが3変更で計4。","procedure":["具体例の各状態・寄与を再計算する。","4。長さ6でABC二個はABCABC以外なく、AAC→ABCが1変更、DDD→ABCが3変更で計4。"],"expectedResult":"4。長さ6でABC二個はABCABC以外なく、AAC→ABCが1変更、DDD→ABCが3変更で計4。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

dp[i,j]は元prefixよりABCを「少なくともj個」増やす最小変更数とする。ABCblock追加の基準差はX_i、末尾不採用の基準差はZ_iで補正する。j=0は全iで0。末尾字を元へ戻す優越性はこの下限制約で成立する。最終の少なくともK解は、文字を一字ずつ元へ戻す過程でABC数が一度に高々1変わるため、費用を増やさずちょうどKの解へできる。

## 典型の発動条件

### 短pattern末尾分解DP

発動条件: 文字置換で特定長pattern出現数を所定量増やしたいとき。

末尾patternを採用するblock遷移と採用しない一文字遷移に分ける。

## 問題固有の要素

置換文字そのものをstateにせず、最適解で変更が意味を持つのは新しいtarget patternを完成させる場合だけと示して遷移を削る。

別の問題へ持ち帰る視点: 元文字列にも既存patternがあるため、増加数stateでは新旧prefixのpattern差を遷移indexへ補正する。

## 正当性

ABCは自分と重ならないため、末尾の新ABCを採ると直前三文字を一blockとして前prefixと分離できる。元prefixがその三文字間で失う既存ABCはX_i個、block作成はY_i変更なのでdp[i−3,j−1+X_i]+Y_i。末尾ABCを作らない最適では末尾字を元へ戻してもABC数は減らず変更数が減るから、skipはdp[i−1,j+Z_i]。この論法は「少なくともj増加」の状態で成立し、j=0の基底0を用いる。最終に過剰増加があっても変更字を一字ずつ元へ戻すと、一字でABC数は高々1だけ変わるので目標ちょうどKを必ず通り、費用は増えない。よって最小の少なくともK解とちょうどK解の費用は等しい。

## 実装上の注意

dp[i,0]=0を全prefixへ置き、j=1..Kを更新する。i<3でblockを使わず、i−3参照とj−1+X_i,j+Z_iの範囲を確認する。状態はexact差ではないのでj=0を通常漸化式で上書きしない。

## 復習の核

- 末尾をABCにしない場合にS_i変更が不要なdominance証明と、X_i/Z_i補正を具体的な重複pattern例で確認する。

## 計算量と制約

### 時間

文字列長 N、増加目標K≤10。三文字block遷移と一文字skipの O(NK)。全caseでは O(ΣNK)。

### 空間

全文DPはO(NK)、i−1/i−3だけ参照するrollingならO(K)、文字列入力O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 10^5; S is a string of length between 3 and 3\times 10^5, inclusive, consisting of uppercase English letters.; 1\leq K \leq 10; In each input, the total length of S over all test cases is at most 3\times 10^5.; T and K are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S="AACDDD",K=1。

1. 元のABC数は0。
2. 位置2のAをBへ変更するとABCDDDとなりABC一個。
3. 0変更では目標未達なので下界1を達成。

期待される結果: 1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じSでK=2なら最小変更は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

4。長さ6でABC二個はABCABC以外なく、AAC→ABCが1変更、DDD→ABCが3変更で計4。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/editorial/16164) — source-abc462-editorial-16164-52cbbb3827b91c096a486d13c992362aea139b8b1e716475326183aac32a6c62
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/tasks/abc462_f) — source-abc462-f-problem-31b1d1c4439105d0f203b91f1d5f4a8da45b6be631e272f544ac6728d4ec70a0
