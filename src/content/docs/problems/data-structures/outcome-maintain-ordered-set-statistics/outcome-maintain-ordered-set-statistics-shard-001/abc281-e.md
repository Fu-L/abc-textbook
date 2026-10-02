---
title: "ABC281-E — Least Elements"
draft: true
authoringUnit: {"problemId":"abc281-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc281-e.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset","tag-two-pointers-window"],"sourceRevisionIds":["source-abc281-e-problem-d11db2b277b008f6758177c2a8c9dba9b4523974a151f78e84dcd865c5a052c3","source-abc281-editorial-5368-7f7b3eb734d53ddac960e9b66733c44c86def4cd7d960ac3b14835a4669980bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"新値をmax(L)以下ならL、そうでなければRへ入れればorder不変量を保てる。削除後を含め|L|はK±1以内なので1回のrebalanceで足りる。 重複値があるため、削除対象をどちらのmultisetに属するか判定し、iteratorまたは(value,index)で1個だけ消す必要がある。 window更新2要素だけを対数時間で反映し、K最小値の和を直接保持できる。","sourceRevisionIds":["source-abc281-e-problem-d11db2b277b008f6758177c2a8c9dba9b4523974a151f78e84dcd865c5a052c3","source-abc281-editorial-5368-7f7b3eb734d53ddac960e9b66733c44c86def4cd7d960ac3b14835a4669980bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(4,1,3,2),M=3,K=2。","procedure":["初窓(4,1,3)の小さい2個は1,3で和4。","次窓(1,3,2)は1,2で和3。"],"executionTarget":null,"expectedResult":"出力4,3。","verificationStatus":"not_applicable","learningUnitIds":["unit-ordered-set-multiset"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"prerequisiteIds":["unit-two-pointers-window"],"attainmentCondition":"K=Mなら残り集合Rからminを読むか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"Rは空なので読まない。Lが全窓を持ち、その和を答える。"},"answer":{"reasoningOrVerification":"Rは空なので読まない。Lが全窓を持ち、その和を答える。","procedure":["具体例の各状態・寄与を再計算する。","Rは空なので読まない。Lが全窓を持ち、その和を答える。"],"expectedResult":"Rは空なので読まない。Lが全窓を持ち、その和を答える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

隣接windowは左端1要素を削除し右端1要素を追加するだけなので、毎回sortし直す情報の大半は共通である。

windowを小さいK個のmultiset Lと残りRに分ければ、答えはsum(L)であり、必要な不変条件は|L|=Kかつmax(L)≤min(R)である。

採用する候補: ordered multiset L,RとsumLを維持し、削除・挿入後に境界要素を高々1個移して|L|=Kへ戻す。

window更新2要素だけを対数時間で反映し、K最小値の和を直接保持できる。

棄却する候補: 各windowのM要素をcopyしてsortし先頭K個を足す。

window数とMの積が二次規模になり、N≤2×10^5に間に合わない。

新値をmax(L)以下ならL、そうでなければRへ入れればorder不変量を保てる。削除後を含め|L|はK±1以内なので1回のrebalanceで足りる。

重複値があるため、削除対象をどちらのmultisetに属するか判定し、iteratorまたは(value,index)で1個だけ消す必要がある。

初windowをsortしてK個をL、残りをRへ入れsumLを作る。slideごとにoutgoingを所属setから削除し、incomingを境界比較で挿入する。|L|<KならminRをLへ、>KならmaxLをRへ移しsumLを更新して出力する。

## 典型の発動条件

### two-multiset order statistics

発動条件: 動的multisetの小さい方K個と残りを分け、その集約値を維持したいとき。

境界maxL/minRとsizeを不変量にし、insert/erase後にrebalanceする。

### sliding window差分更新

発動条件: 連続window間で出入りする要素が少数のとき。

outgoing削除とincoming挿入だけをdata structureへ反映する。

## 問題固有の要素

K-th値そのものではなくK最小値の和なので、balanced partitionにsum metadataを足すだけでqueryがO(1)になる。

別の問題へ持ち帰る視点: dynamic order statisticのprefix集約では、境界で集合を二分し片側のsum/countを持つ。

## 正当性

新値をmax(L)以下ならL、そうでなければRへ入れればorder不変量を保てる。削除後を含め|L|はK±1以内なので1回のrebalanceで足りる。 重複値があるため、削除対象をどちらのmultisetに属するか判定し、iteratorまたは(value,index)で1個だけ消す必要がある。 window更新2要素だけを対数時間で反映し、K最小値の和を直接保持できる。

## 実装上の注意

- K=MでRが空の場合にmaxL比較やminR移動を空参照しない。
- sumLはK·A_iで64 bitが必要で、値移動・削除・挿入のたび増減を同時更新する。

## 復習の核

- 境界値が重複するwindowで同値要素がL/R両方にある例を作り、どちらから1個消しても不変量を戻せる実装を確認する。

## 計算量と制約

### 時間

O(M log M+(N−M)log M)、N列長、M窓長。

### 空間

O(M)、二multiset。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq M \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(4,1,3,2),M=3,K=2。

1. 初窓(4,1,3)の小さい2個は1,3で和4。
2. 次窓(1,3,2)は1,2で和3。

期待される結果: 出力4,3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

K=Mなら残り集合Rからminを読むか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

Rは空なので読まない。Lが全窓を持ち、その和を答える。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/tasks/abc281_e) — source-abc281-e-problem-d11db2b277b008f6758177c2a8c9dba9b4523974a151f78e84dcd865c5a052c3
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc281/editorial/5368) — source-abc281-editorial-5368-7f7b3eb734d53ddac960e9b66733c44c86def4cd7d960ac3b14835a4669980bf
