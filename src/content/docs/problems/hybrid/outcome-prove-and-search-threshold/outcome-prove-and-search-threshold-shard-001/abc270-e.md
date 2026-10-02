---
title: "ABC270-E — Apple Baskets on Circle"
draft: true
authoringUnit: {"problemId":"abc270-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-001/abc270-e.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc270-e-problem-c66b9322e3464e79568be9c6696ffcf139a715b51e01dd520d8c5f31b00ee5cc","source-abc270-editorial-4848-2b1a57357f7fe70823c07b69b7bd043bd1109b94db76394e285cff9f168c4475"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各basketの消費数は周回数でsaturateするmin(A_i,m)なので、異なる高さの山を同じ水位mまで削る問題として扱える。 最大mを採用した後に未消費数が一周分以上残るならm+1も条件を満たすため、端数処理は必ず高々N basketで終わる。 一周数の判定をO(N)、探索をO(log K)、最後の走査をO(N)で行える。","sourceRevisionIds":["source-abc270-e-problem-c66b9322e3464e79568be9c6696ffcf139a715b51e01dd520d8c5f31b00ee5cc","source-abc270-editorial-4848-2b1a57357f7fe70823c07b69b7bd043bd1109b94db76394e285cff9f168c4475"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

m周を終えた時点ではbasket iからmin(A_i,m)個食べており、総数F(m)=Σmin(A_i,m)はmについて単調非減少である。

K個を超えない最大の完全周回数mまで一括処理すれば、残りK−F(m)個はbasket 1から一周未満の順次走査で食べられる。

棄却する候補: 一回の行動ごとにbasketを巡回してK個食べるまでsimulationする。

Kが10^12まであり、空basketを通る行動も含めて逐次処理できない。

採用する候補: F(m)≤Kを満たす最大mをbinary searchし、各A_iからmまでをまとめて引いた後、端数だけ一周simulationする。

一周数の判定をO(N)、探索をO(log K)、最後の走査をO(N)で行える。

各basketの消費数は周回数でsaturateするmin(A_i,m)なので、異なる高さの山を同じ水位mまで削る問題として扱える。

最大mを採用した後に未消費数が一周分以上残るならm+1も条件を満たすため、端数処理は必ず高々N basketで終わる。

cyclic simulationをcomplete roundsのmonotone aggregateへ圧縮し、binary searchと一回のresidual scanで最終状態を再構成する。

## 典型の発動条件

### 答え上の二分探索

発動条件: 同一操作をm回まとめた効果を計算でき、消費量がmに対して単調なとき。

Σmin(A_i,m)≤Kとなる最大のfull-round countを探す。

### bulk処理と端数simulation

発動条件: 周期的処理の大部分を一括適用した後、残りが一周期未満になるとき。

m周分を全basketからまとめて減らし、残りだけindex順に1個ずつ減らす。

## 問題固有の要素

full rounds後のbasket iはmax(A_i−m,0)であり、残りの食数はこの正値basketを先頭から一度ずつ訪ねればよい。

別の問題へ持ち帰る視点: 巨大なcyclic processでは、全要素に同回数作用する完全周期と短いsuffixに分ける。

## 正当性

各basketの消費数は周回数でsaturateするmin(A_i,m)なので、異なる高さの山を同じ水位mまで削る問題として扱える。 最大mを採用した後に未消費数が一周分以上残るならm+1も条件を満たすため、端数処理は必ず高々N basketで終わる。 一周数の判定をO(N)、探索をO(log K)、最後の走査をO(N)で行える。

## 実装上の注意

- F(m)の加算は10^17規模になり得るため64 bitを使い、Kを超えた時点で打ち切ってoverflowを避ける。
- binary searchはF(m)≤Kを満たす最大mという境界規約を固定し、端数が0なら余計にbasketを減らさない。

## 復習の核

- 円環simulationでは、m周後の各要素と累積処理数を直接式にできるかを先に調べる。
- 一括処理の境界は、残処理が一周期未満になる最大値として定義すると復元が単純になる。

## 計算量と制約

### 時間

O(N log Amax)、完了周回数の判定O(N)、端数走査O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq A_i \leq 10^{12}; 1 \leq K \leq 10^{12}; There are at least K apples in total. That is, \sum_{i=1}^{N}A_i\geq K.; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/tasks/abc270_e) — source-abc270-e-problem-c66b9322e3464e79568be9c6696ffcf139a715b51e01dd520d8c5f31b00ee5cc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc270/editorial/4848) — source-abc270-editorial-4848-2b1a57357f7fe70823c07b69b7bd043bd1109b94db76394e285cff9f168c4475
