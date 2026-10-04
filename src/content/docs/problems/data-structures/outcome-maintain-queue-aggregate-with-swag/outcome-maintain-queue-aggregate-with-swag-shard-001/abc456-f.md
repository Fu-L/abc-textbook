---
title: "ABC456-F — Plan Holidays"
draft: true
authoringUnit: {"problemId":"abc456-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-queue-aggregate-with-swag/outcome-maintain-queue-aggregate-with-swag-shard-001/abc456-f.md","learningOutcomeIds":["outcome-maintain-queue-aggregate-with-swag"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation","unit-semiring-matrix-exponentiation"],"excludedTopics":["SWAG・two-stack queue aggregationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-swag","tag-semiring-matrix-exponentiation"],"sourceRevisionIds":["source-abc456-editorial-19850-1d97b4b1e594c4b2729b05b473dd354815c21e3562ccaa7c3fea95fc01fdf3d4","source-abc456-f-problem-0dd36040c4e14d3a225cf51e1b030c92a632f97fb983cd85b9fa7dea6891eacb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"端の休日を削ると費用が下がり、休日間の距離は高々2なので、条件を保つ最短の両端距離はK−1かKになる。初期二状態と末日の休日状態はこの二場合を覆い、日ごとの遷移は合法な休日列だけを過不足なく扱う。SWAGの向き付き積は同じ遷移列の合成を返すので、全窓最小が最適費用に一致する。","sourceRevisionIds":["source-abc456-editorial-19850-1d97b4b1e594c4b2729b05b473dd354815c21e3562ccaa7c3fea95fc01fdf3d4","source-abc456-f-problem-0dd36040c4e14d3a225cf51e1b030c92a632f97fb983cd85b9fa7dea6891eacb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [SWAG・two-stack queue aggregation](src/content/docs/learn/query/swag.md)

- queueを二つのstackへ分け、それぞれの向きにmonoid積を持ってpush/pop/foldを償却O(1)で処理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [半環行列・min-plus/max-min遷移](src/content/docs/learn/combinatorics-algebra/semiring-matrix-exponentiation.md) — 線形遷移・行列累乗で得た考え方と実装を再利用し、半環行列・min-plus/max-min遷移の発動条件・正当化・境界を重複なく学ぶ。

## 考察

休日同士の間には出勤を一日までしか挟めない。正の費用なので、最初と最後の休日の距離がKを超える計画は、端の休日を削って距離K−1またはKへ縮められる。長さKの窓を選び、末日は休日、初日は窓内またはその直前の休日から始めるDPを考える。

`dp0` を当日出勤、`dp1` を当日休日の最小費用とする。一日の遷移は `dp0′=dp1`、`dp1′=min(dp0,dp1)+A_i`。出勤を続けられないことと、休日なら直前状態を問わないことをそのまま表している。列vector用のmin-plus行列は `M_i=[[INF,0],[A_i,A_i]]` である。

窓の開始l=1,…,N−K+1に対し、直前の初期vectorを `(0,A_{l−1})` とする。第1成分はlを最初の休日にする選択、第2成分はl−1から始める選択を表す。l=1だけ番兵 `A_0=INF` を使い、l>1では実際の費用を使う。

`M_{l+K−1}…M_l` を初期vectorへ作用させたdp1が、この窓の最小費用である。全窓のdp1の最小を出す。毎回K日分を計算するとO(NK)だが、行列積は結合的なのでSWAGで窓の積を保てる。各日を定数回push・移送・popするだけで全体O(N)となる。

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

端の休日を削ると費用が下がり、休日間の距離は高々2なので、条件を保つ最短の両端距離はK−1かKになる。初期二状態と末日の休日状態はこの二場合を覆い、日ごとの遷移は合法な休日列だけを過不足なく扱う。SWAGの向き付き積は同じ遷移列の合成を返すので、全窓最小が最適費用に一致する。

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

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/editorial/19850) — source-abc456-editorial-19850-1d97b4b1e594c4b2729b05b473dd354815c21e3562ccaa7c3fea95fc01fdf3d4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc456/tasks/abc456_f) — source-abc456-f-problem-0dd36040c4e14d3a225cf51e1b030c92a632f97fb983cd85b9fa7dea6891eacb
