---
title: "ABC215-F — Dist Max 2"
draft: true
authoringUnit: {"problemId":"abc215-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc215-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-two-pointers-window"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-two-pointers-window"],"sourceRevisionIds":["source-abc215-editorial-2492-8f1c76515d6e5413c6eff27c70a7838983645ed3c9703cd2a31857ed9bf65256","source-abc215-f-problem-3d3bb0596de094bb9dd0c51488ee4ac4d12638dafb79e095c451f0bf8b08b537"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"min が K 以上という条件は二つの絶対差への AND に分解され、片方をソート順と尺取りで処理できる。 候補点の y 座標を全て検索する必要はなく、現在の y から最も離れ得る最小値と最大値だけで存在判定できる。 K が実現できればそれ以下も実現できる単調性があり、一回の判定はソート済み点列の一走査で済む。","sourceRevisionIds":["source-abc215-editorial-2492-8f1c76515d6e5413c6eff27c70a7838983645ed3c9703cd2a31857ed9bf65256","source-abc215-f-problem-3d3bb0596de094bb9dd0c51488ee4ac4d12638dafb79e095c451f0bf8b08b537"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

二点間距離 min(|x_i−x_j|,|y_i−y_j|) が K 以上であることは、x 差と y 差がともに K 以上であることと同値である。

点を x 座標順に並べると、現在点より x が K 以上小さい過去点だけを候補にし、その y の最小値と最大値で y 差 K 以上の存在を判定できる。

棄却する候補: 全ての異なる二点組について定義通り距離を計算し、最大値を更新する。

点対が N の二乗規模存在するため、20 万点の制約では全列挙できない。

採用する候補: 答え K を二分探索し、x 順の尺取りで条件を満たす過去点の y 最小値・最大値を保って実現可能性を判定する。

K が実現できればそれ以下も実現できる単調性があり、一回の判定はソート済み点列の一走査で済む。

min が K 以上という条件は二つの絶対差への AND に分解され、片方をソート順と尺取りで処理できる。

候補点の y 座標を全て検索する必要はなく、現在の y から最も離れ得る最小値と最大値だけで存在判定できる。

最大化する距離を閾値判定へ変え、x 座標で解禁される過去点集合を二ポインタで管理し、その y の両極値を使う単調判定を二分探索へ組み込む。

## 典型の発動条件

### 答えの二分探索

発動条件: 最大化する整数値 K について、K を達成可能なら全ての小さい値も達成可能となるとき。

距離 K 以上の点対が存在するかを判定関数とし、真となる最大の K を探す。

### ソートと尺取りによる候補集合管理

発動条件: 二要素の座標差条件があり、一方の座標順に候補が単調に追加されるとき。

x 差が K 以上になった過去点を順に追加し、y の最小・最大だけを維持する。

## 問題固有の要素

距離定義の min は難しさではなく、閾値を固定した後には「両方の座標差を満たす」という分離可能な条件になる。

別の問題へ持ち帰る視点: min や max を含む目的関数は、答え候補で閾値化すると論理積・論理和へ単純化する場合がある。

## 正当性

min が K 以上という条件は二つの絶対差への AND に分解され、片方をソート順と尺取りで処理できる。 候補点の y 座標を全て検索する必要はなく、現在の y から最も離れ得る最小値と最大値だけで存在判定できる。 K が実現できればそれ以下も実現できる単調性があり、一回の判定はソート済み点列の一走査で済む。

## 実装上の注意

- 各現在点より前の点だけを候補へ追加し、K＝0 の判定でも同じ点自身を点対として使わない。
- 候補集合が空の間は y の最小・最大を参照せず、minY≤y−K または maxY≥y＋K のどちらかを確認する。

## 復習の核

- min で定義された距離を見たら、値 K 以上という条件を書き下して各成分の同時成立へ分解する。
- 候補集合から「現在値と K 以上離れる要素があるか」だけを問うなら、全要素でなく最小値・最大値で十分か検討する。

## 計算量と制約

### 時間

O(N log N+N log C)、Cは座標差上限、各閾値判定O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 200000; 0 \leq x_i,y_i \leq 10^9; (x_i,y_i) \neq (x_j,y_j) (i \neq j); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/editorial/2492) — source-abc215-editorial-2492-8f1c76515d6e5413c6eff27c70a7838983645ed3c9703cd2a31857ed9bf65256
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/tasks/abc215_f) — source-abc215-f-problem-3d3bb0596de094bb9dd0c51488ee4ac4d12638dafb79e095c451f0bf8b08b537
