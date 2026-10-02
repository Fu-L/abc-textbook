---
title: "ABC239-F — Construct Highway"
draft: true
authoringUnit: {"problemId":"abc239-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc239-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-dsu-components"],"sourceRevisionIds":["source-abc239-editorial-3388-dc81d0d4766dbac2e06bc9e0143f085c6d867ff6751d63ac3b5cfa05ba65cac5","source-abc239-f-problem-48a1c8d798e7adf11e9a1d0cf8599c96e887b6cb653727685a9cd5aa55e9a0c5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"不足1の成分 X と不足 d≥2 の成分 Y を結ぶと、併合後の不足は 1+d-2=d-1 であり、総不足=2·成分数-2 の不変量も保たれる。 成分数 m に対する総不足 2m-2 と各成分の正の不足を保ち、縮約木の leaf を一つずつ確定できる。","sourceRevisionIds":["source-abc239-editorial-3388-dc81d0d4766dbac2e06bc9e0143f085c6d867ff6751d63ac3b5cfa05ba65cac5","source-abc239-f-problem-48a1c8d798e7adf11e9a1d0cf8599c96e887b6cb653727685a9cd5aa55e9a0c5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-recover-valid-witness"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、既存辺12、目標degree(1,2,1)。","procedure":["成分{1,2}のstubは頂点2に一個、成分{3}は3に一個。","残り二不足1成分を23で結ぶ。"],"executionTarget":null,"expectedResult":"追加辺(2,3)。","verificationStatus":"not_applicable","learningUnitIds":["unit-constructive-witness"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-recover-valid-witness"],"prerequisiteIds":["unit-dsu-components"],"attainmentCondition":"既存辺がcycleならdegree総和だけで判定できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"木は既存cycleを消せないため即不可能。cycle検査と個別degree超過の検査も必要。"},"answer":{"reasoningOrVerification":"木は既存cycleを消せないため即不可能。cycle検査と個別degree超過の検査も必要。","procedure":["具体例の各状態・寄与を再計算する。","木は既存cycleを消せないため即不可能。cycle検査と個別degree超過の検査も必要。"],"expectedResult":"木は既存cycleを消せないため即不可能。cycle検査と個別degree超過の検査も必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

追加後は連結で辺数が N-1 なので最終グラフは木である。したがって既存辺に cycle がある場合、現在次数が D_i を超える場合、または ΣD_i≠2N-2 の場合は直ちに不可能である。

既存 forest の各連結成分を一点へ縮約すると、新しい辺は異なる成分間だけを結ぶ。各頂点の残り次数を stub として並べれば、成分が外へ出すべき次数は stub 数の合計になる。

採用する候補: 不足次数1の成分を leaf として不足次数2以上の成分へ順に接続し、最後の不足次数1の二成分を結ぶ。

成分数 m に対する総不足 2m-2 と各成分の正の不足を保ち、縮約木の leaf を一つずつ確定できる。

棄却する候補: 異なる既存成分を任意順に結び、その場で余っている頂点の stub を使う。

不足次数の小さい成分を内部頂点にして stub を使い切ると、未接続成分が残っても接続口がなくなる。

不足1の成分 X と不足 d≥2 の成分 Y を結ぶと、併合後の不足は 1+d-2=d-1 であり、総不足=2·成分数-2 の不変量も保たれる。

DSU で既存辺の cycle と各 current degree を検査し、各成分に頂点 i を D_i-currentDegree_i 回並べた stub list を持つ。不足1 queue と不足2以上 queue から成分を取り、各 list の末尾同士を新辺として出して併合・再分類し、最後の二つの不足1成分を結ぶ。

## 典型の発動条件

### 連結成分の縮約

発動条件: 既存辺を必ず残したまま全体を木や連結グラフへ拡張するとき。

既存 forest の各成分を supernode とし、外部へ必要な次数だけを扱う。

### 木次数列の leaf 除去

発動条件: 正の次数列の総和が2m-2で、対応する木を構成したいとき。

次数1の頂点を leaf として次数2以上の頂点へ接続し、後者の次数を一つ減らす。

## 問題固有の要素

成分の不足次数を、その成分に残る接続口の本数と見なすと、頂点レベルの指定次数と成分レベルの木構築が分離する。

別の問題へ持ち帰る視点: 指定部分グラフを含む構成問題では、固定成分を縮約し、残余資源を stub の多重集合として持つ。

## 正当性

不足1の成分 X と不足 d≥2 の成分 Y を結ぶと、併合後の不足は 1+d-2=d-1 であり、総不足=2·成分数-2 の不変量も保たれる。 成分数 m に対する総不足 2m-2 と各成分の正の不足を保ち、縮約木の leaf を一つずつ確定できる。

## 実装上の注意

- 既存辺を読む時点で cycle と degree 超過を検出し、各成分の不足が0なら複数成分を結べないので失敗する。stub の総数だけを格納し、出力辺数が N-M-1 か最後に確認する。

## 復習の核

- 成分数 m、総不足 2m-2、各不足正という三条件を一回の併合前後で書き、なぜ途中で leaf が必ず存在するかを確認する。

## 計算量と制約

### 時間

O((N+M)α(N))、総stub≤2N−2、DSUとcomponent queue。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 0 \leq M \lt N-1; 1 \leq D_i \leq N-1; 1\leq A_i \lt B_i \leq N; If i\neq j, then (A_i, B_i) \neq (A_j,B_j).; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、既存辺12、目標degree(1,2,1)。

1. 成分{1,2}のstubは頂点2に一個、成分{3}は3に一個。
2. 残り二不足1成分を23で結ぶ。

期待される結果: 追加辺(2,3)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

既存辺がcycleならdegree総和だけで判定できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

木は既存cycleを消せないため即不可能。cycle検査と個別degree超過の検査も必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/editorial/3388) — source-abc239-editorial-3388-dc81d0d4766dbac2e06bc9e0143f085c6d867ff6751d63ac3b5cfa05ba65cac5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc239/tasks/abc239_f) — source-abc239-f-problem-48a1c8d798e7adf11e9a1d0cf8599c96e887b6cb653727685a9cd5aa55e9a0c5
