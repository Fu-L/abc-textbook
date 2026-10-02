---
title: "ABC372-F — Teleporting Takahashi 2"
draft: true
authoringUnit: {"problemId":"abc372-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-normalize-common-dp-action/outcome-normalize-common-dp-action-shard-001/abc372-f.md","learningOutcomeIds":["outcome-normalize-common-dp-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc372-editorial-10969-ee25597f59d2400ce6fd5335a2a3770e021095d149183b0aae43dea85c7377e5","source-abc372-f-problem-366da97398328238081e7fb0103fadbb1a66db6aa87bc7a830dce59f00c28490"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"cycle通常遷移は全分布の一位置shiftなので配列viewのoffset変更だけで表せる。追加辺寄与はshift前のsource値から加える。全source値を退避してから加算すれば同手内の追加寄与の再利用を防ぎ、各層の通常DPと完全一致する。","sourceRevisionIds":["source-abc372-editorial-10969-ee25597f59d2400ce6fd5335a2a3770e021095d149183b0aae43dea85c7377e5","source-abc372-f-problem-366da97398328238081e7fb0103fadbb1a66db6aa87bc7a830dce59f00c28490"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-common-dp-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"cycle1→2→3→1、追加辺1→3、K=2、開始1。","procedure":["一手後は2,3へ各1。","二手後は2→3と3→1、追加辺source1の旧値は0。","分布(1,0,1)。"],"executionTarget":null,"expectedResult":"全walk数2","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-transition-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-common-dp-action"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"追加寄与を即時sourceとして同じ手に再利用してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。一手で複数追加辺を渡るwalkを誤って作る。旧値を退避する。"},"answer":{"reasoningOrVerification":"不可。一手で複数追加辺を渡るwalkを誤って作る。旧値を退避する。","procedure":["具体例の各状態・寄与を再計算する。","不可。一手で複数追加辺を渡るwalkを誤って作る。旧値を退避する。"],"expectedResult":"不可。一手で複数追加辺を渡るwalkを誤って作る。旧値を退避する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

通常辺だけなら dp[i+1][v]=dp[i][v-1] という一マスの循環 shift である。追加辺は M≤50 本しかなく、shift 後の列と次の列が違う箇所もその端点付近に限られる。 cycle 辺による遷移は列全体の循環 shift と同一であり、値を移す代わりに添字の対応をずらせる。 追加辺 (X,Y) の寄与だけは shift に含まれないため、旧 dp[X] を新 dp[Y] へ加える差分として処理する。

採用する候補: dp 配列の論理的な始点を毎手ずらし、追加辺から生じる O(M) 個の差分だけを実配列へ加える inline DP を行う。

N 個の通常遷移をコピーせず配列 view の shift として共有でき、K 手を O(N+MK) で処理できる。

棄却する候補: dp[手数][頂点] を通常通り作り、全 N+M 辺を毎手緩和する。

N,K がともに2×10^5なので Θ(NK) の状態更新は不可能である。

cycle 辺による遷移は列全体の循環 shift と同一であり、値を移す代わりに添字の対応をずらせる。

追加辺 (X,Y) の寄与だけは shift に含まれないため、旧 dp[X] を新 dp[Y] へ加える差分として処理する。

K+N 程度の配列または循環 index で各時刻の dp を同じ領域に対応づける。各手で論理 offset を一つ進め、M 本の追加辺について遷移元の旧値を退避して遷移先へ加算する。

## 典型の発動条件

### inline DP

発動条件: 大部分の遷移が単なる shift で、各段で異なる箇所が少数のとき。

配列をコピーせず添字対応をずらし、例外遷移だけ差分更新する。

## 問題固有の要素

遷移式を図として一段ずらすと、二つの DP 列の差が疎であることが見える。

別の問題へ持ち帰る視点: ほぼ permutation の遷移では値の移動を省き、座標系そのものを動かす。

## 正当性

cycle通常遷移は全分布の一位置shiftなので配列viewのoffset変更だけで表せる。追加辺寄与はshift前のsource値から加える。全source値を退避してから加算すれば同手内の追加寄与の再利用を防ぎ、各層の通常DPと完全一致する。

## 実装上の注意

- 追加辺の全寄与は同じ時刻の旧 dp から読む必要がある。通常の cycle 辺と重複する追加辺はないが、複数辺の加算順で新値を再利用しない。

## 復習の核

- dp の二段を紙に一列ずつずらして重ね、どのセルだけが通常 shift と異なるかを発見する練習をする。

## 計算量と制約

### 時間

N cycle頂点、M追加辺、K手。offset shiftと追加辺処理で O(N+MK)。

### 空間

循環配列O(N)（線形offset配列実装はO(N+K)）、追加辺O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq M \leq 50; 1 \leq K \leq 2 \times 10^5; 1 \leq X_i, Y_i \leq N, X_i \neq Y_i; All of the N+M directed edges are distinct.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

cycle1→2→3→1、追加辺1→3、K=2、開始1。

1. 一手後は2,3へ各1。
2. 二手後は2→3と3→1、追加辺source1の旧値は0。
3. 分布(1,0,1)。

期待される結果: 全walk数2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

追加寄与を即時sourceとして同じ手に再利用してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。一手で複数追加辺を渡るwalkを誤って作る。旧値を退避する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/editorial/10969) — source-abc372-editorial-10969-ee25597f59d2400ce6fd5335a2a3770e021095d149183b0aae43dea85c7377e5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc372/tasks/abc372_f) — source-abc372-f-problem-366da97398328238081e7fb0103fadbb1a66db6aa87bc7a830dce59f00c28490
