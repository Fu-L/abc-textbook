---
title: "ABC456-F — Plan Holidays"
draft: true
authoringUnit: {"problemId":"abc456-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-queue-aggregate-with-swag/outcome-maintain-queue-aggregate-with-swag-shard-001/abc456-f.md","learningOutcomeIds":["outcome-maintain-queue-aggregate-with-swag"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation","unit-semiring-matrix-exponentiation"],"excludedTopics":["SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-swag","tag-semiring-matrix-exponentiation"],"sourceRevisionIds":["source-abc456-editorial-19850-1d97b4b1e594c4b2729b05b473dd354815c21e3562ccaa7c3fea95fc01fdf3d4","source-abc456-f-problem-0dd36040c4e14d3a225cf51e1b030c92a632f97fb983cd85b9fa7dea6891eacb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"隣り合う休日間を2日以上空けない条件は、現在日を休まない状態が直前休日状態からだけ遷移する式 dp0'=dp1 を与える。 最初と最後の休日距離はK-1またはKだけ見ればよく、window境界の A_{l-1}=INF を含む初期vectorで二ケースを吸収できる。 写像合成は結合的で固定4係数の形に閉じ、SWAGは非可換でもqueue前後stackの累積積により各要素を定数回だけ処理できる。","sourceRevisionIds":["source-abc456-editorial-19850-1d97b4b1e594c4b2729b05b473dd354815c21e3562ccaa7c3fea95fc01fdf3d4","source-abc456-f-problem-0dd36040c4e14d3a225cf51e1b030c92a632f97fb983cd85b9fa7dea6891eacb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-queue-aggregate-with-swag"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"費用列(5,2,4)、初期DP=(0,INF)、三遷移。","procedure":["日1は(INF,5)。日2は(5,7)。","日3は(7,9)。"],"executionTarget":null,"expectedResult":"最終休日stateの費用9。","verificationStatus":"not_applicable","learningUnitIds":["unit-swag"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-queue-aggregate-with-swag"],"prerequisiteIds":["unit-range-monoid-aggregation","unit-semiring-matrix-exponentiation"],"attainmentCondition":"SWAG後stackの積順を逆にしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"写像は非可換。f_2(f_5(0,INF))=(5,7)に対しf_5(f_2(0,INF))=(2,7)なので順序を保つ。"},"answer":{"reasoningOrVerification":"写像は非可換。f_2(f_5(0,INF))=(5,7)に対しf_5(f_2(0,INF))=(2,7)なので順序を保つ。","procedure":["具体例の各状態・寄与を再計算する。","写像は非可換。f_2(f_5(0,INF))=(5,7)に対しf_5(f_2(0,INF))=(2,7)なので順序を保つ。"],"expectedResult":"写像は非可換。f_2(f_5(0,INF))=(5,7)に対しf_5(f_2(0,INF))=(2,7)なので順序を保つ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [SWAG・two-stack queue aggregation](src/content/docs/learn/query/swag.md)

- queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)
- [半環行列・min-plus/max-min遷移](src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md)

対象外:

- SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

休日列の局所条件は、各日を休日にする/しない二状態のmin-cost DPで表せる。長さK windowごとに同じ2×2 min-plus遷移の積を求める問題になる。

採用する候補: 各A_iを写像 f_a(x,y)=(y,min(x,y)+a) または2×2 min-plus行列として表し、長さKのsliding productをSWAGで維持して全開始位置を評価する。

写像合成は結合的で固定4係数の形に閉じ、SWAGは非可換でもqueue前後stackの累積積により各要素を定数回だけ処理できる。

棄却する候補: 最初の休日候補 l ごとに長さKの二状態DPを最初から計算する。

window数Nに各K段かかり Θ(NK) となる。

隣り合う休日間を2日以上空けない条件は、現在日を休まない状態が直前休日状態からだけ遷移する式 dp0'=dp1 を与える。

最初と最後の休日距離はK-1またはKだけ見ればよく、window境界の A_{l-1}=INF を含む初期vectorで二ケースを吸収できる。

各日の min-plus matrix [[INF,0],[A_i,A_i]] を作る。SWAGで順序付き長さK積をslideし、初期vector (0,A_{l-1}) へ作用させた休日終了stateの最小を答えへ反映する。端点ケースを番兵INFで処理する。

## 典型の発動条件

### DP遷移のmin-plus行列化

発動条件: 短い状態DPを多数の連続windowで再評価したいとき。

各要素の遷移を小行列として区間積へ変換する。

### SWAG

発動条件: 非可換なassociative積をsliding windowごとに求めたいとき。

front/back stackの向き付き累積積でqueue積を維持する。

## 問題固有の要素

windowごとのDPは状態数が小さければ、入力要素を遷移operatorに変えてsliding product問題へ移せる。

別の問題へ持ち帰る視点: min-plus写像も結合則があれば通常のmonoid queueと同じdata structureで扱える。

## 正当性

隣り合う休日間を2日以上空けない条件は、現在日を休まない状態が直前休日状態からだけ遷移する式 dp0'=dp1 を与える。 最初と最後の休日距離はK-1またはKだけ見ればよく、window境界の A_{l-1}=INF を含む初期vectorで二ケースを吸収できる。 写像合成は結合的で固定4係数の形に閉じ、SWAGは非可換でもqueue前後stackの累積積により各要素を定数回だけ処理できる。

## 実装上の注意

- matrix積の左右順を日付順に合わせ、SWAG二stackの積順を逆にしない。INF加算overflowとK/N境界を処理する。

## 復習の核

- 一日遷移をmatrix×vectorへ書き、二日分の合成順とSWAGのfrontProduct⊗backProductを具体値で照合する。

## 計算量と制約

### 時間

O(N)、固定2×2行列のSWAGへ各日を一回pushし高々一回移送・popする。

### 空間

O(K)、window積を保つ二stack。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq K \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; All input values are integers.; The sum of N over all test cases is at most 2\times 10^5.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

費用列(5,2,4)、初期DP=(0,INF)、三遷移。

1. 日1は(INF,5)。日2は(5,7)。
2. 日3は(7,9)。

期待される結果: 最終休日stateの費用9。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

SWAG後stackの積順を逆にしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

写像は非可換。f_2(f_5(0,INF))=(5,7)に対しf_5(f_2(0,INF))=(2,7)なので順序を保つ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/editorial/19850) — source-abc456-editorial-19850-1d97b4b1e594c4b2729b05b473dd354815c21e3562ccaa7c3fea95fc01fdf3d4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/tasks/abc456_f) — source-abc456-f-problem-0dd36040c4e14d3a225cf51e1b030c92a632f97fb983cd85b9fa7dea6891eacb
