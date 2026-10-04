---
title: "ABC464-E — Fill-Rect Query"
draft: true
authoringUnit: {"problemId":"abc464-e","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-002/abc464-e.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-grid-table-dp"],"sourceRevisionIds":["source-abc464-e-problem-defb471e43dca2de9900801f05276d827ac60ff531290f56e41c86990cc76685","source-abc464-editorial-22266-6370d9e67da4830cfa46aad5c75e6537ae480407f14e26ee599880eadbcdc4c9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同じ(R,C)に複数操作がある場合は最大timestampだけ置けば、それ以前はどのcellでも最終値にならない。 suffix rectangle最大は dp[r][c]=max(mark[r][c],dp[r+1][c],dp[r][c+1]) で重複を気にせず計算できる。 cellを覆う操作点集合はそのcellの右下rectangleで、suffix maximum recurrenceがその集合最大timestampをちょうど集約する。","sourceRevisionIds":["source-abc464-e-problem-defb471e43dca2de9900801f05276d827ac60ff531290f56e41c86990cc76685","source-abc464-editorial-22266-6370d9e67da4830cfa46aad5c75e6537ae480407f14e26ee599880eadbcdc4c9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

先に読む単元:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md) — 状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。

この解説で扱わないこと:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

操作iでX_iを書く代わりにtimestamp iを書くと、最終cell(r,c)は r≤R_i,c≤C_i を満たす最大iの値になる。これは各点から右下領域にあるmark最大値を問う二次元suffix maximumである。

採用する候補: 各操作点(R_i,C_i)に最大timestamp iを置き、右下から左上へ grid DPして各cellに max(self,down,right) を伝播し、得たtimestampをX_iへ戻す。

棄却する候補: Q回のrectangle overwriteごとに含まれる全cellを書き換える。

一操作がHW cellsへ及び得て O(HWQ) となる。

H×W配列markを0で初期化し各query iでmark[R_i][C_i]=iへ更新する。r=H..1,c=W..1の順にdown/right最大を伝え、timestamp0なら初期値、正なら対応X_timestampを各cellへ出力する。

## 典型の発動条件

### 上書き時刻への変換

発動条件: 複数range overwrite後の最終状態をofflineで求めたいとき。

値でなく操作index最大を求めて最後に値へ写す。

### 二次元suffix maximum

発動条件: 各cellから右下rectangle内の最大markを全cellで求めたいとき。

右下からdown/rightのmaxを伝播する。

## 問題固有の要素

offline overwriteは最新操作indexのrange maximum問題へ変えると、値の大小と時系列を分離できる。

別の問題へ持ち帰る視点: anchored rectangle queryは二次元imosの加算でなく、演算maxのsuffix DPとして同じ走査形を使える。

## 正当性

同じ(R,C)に複数操作がある場合は最大timestampだけ置けば、それ以前はどのcellでも最終値にならない。 suffix rectangle最大は dp[r][c]=max(mark[r][c],dp[r+1][c],dp[r][c+1]) で重複を気にせず計算できる。 cellを覆う操作点集合はそのcellの右下rectangleで、suffix maximum recurrenceがその集合最大timestampをちょうど集約する。

## 実装上の注意

- R_i,C_iが覆う向きとsuffix走査方向を逆にしない。同一点markは代入ではなく最大timestampを残す。

## 復習の核

- 一cellを覆う操作条件を操作点のrectangleとして描き、max recurrenceがその全点を含むことを小gridで確認する。

## 計算量と制約

### 時間

O(HW+Q)、timestamp配置と2D suffix max。

### 空間

O(HW+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le H, W; H \times W \le 10^6; 1 \le Q \le 2 \times 10^5; 1 \le R_i \le H; 1 \le C_i \le W; X_i is an uppercase English letter.; All input numbers are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/tasks/abc464_e) — source-abc464-e-problem-defb471e43dca2de9900801f05276d827ac60ff531290f56e41c86990cc76685
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/editorial/22266) — source-abc464-editorial-22266-6370d9e67da4830cfa46aad5c75e6537ae480407f14e26ee599880eadbcdc4c9
