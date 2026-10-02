---
title: "ABC293-EX — Optimal Path Decomposition"
draft: true
authoringUnit: {"problemId":"abc293-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc293-ex.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc293-editorial-5964-fa661f02f6876e8896f80d4179788d50bb5a6502ede71ab300bd6a35945c80c9","source-abc293-ex-problem-a073d501650d2242c62acd73265aeb8e9e62825f1dbe51a2e2cbb5363343f6b9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"異なる子部分木内の二頂点を結ぶパスはvを通り、選んだ枝ではvと子の色が共通になるため、色数はl_a+l_b+1である。子内部のパスは帰納的に検査済みなので、最大二枝と根からの最大枝を検査すれば全パスを尽くす。選択可能な子のlを1減らす操作では、大きい値を先に減らすほど最大値も最大二値和も悪化しないため、Xの先頭から選べる。\n\n親へ渡す際、根からの最大色数を1以上増やして親との同色接続を可能にしても、接続で減る色数は高々1であり、親側のパスを短くできない。部分木内部の制約も改善しない。したがって最小dpだけを保持し、その値で接続可能ならf=0を優先する状態の圧縮が正しい。同色の子を高々二つ、親と同色なら高々一つにすることで、各色成分は次数2以下の木、すなわちパスになる。","sourceRevisionIds":["source-abc293-editorial-5964-fa661f02f6876e8896f80d4179788d50bb5a6502ede71ab300bd6a35945c80c9","source-abc293-ex-problem-a073d501650d2242c62acd73265aeb8e9e62825f1dbe51a2e2cbb5363343f6b9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

色の連結成分がパスになるように木を分解する。異色の辺を横切る回数に1を加えたものが、その単純パス上の色数である。答えKを固定し、全パスで色数≤Kとなるかを葉から判定する。

dp_vは、vの部分木内の全パス制約を満たす分解のうち、vから子孫へのパスの最大色数を最小にした値。f_vはその最小値を達成しながら親と同色にできる余地があれば0、必ず同色の子が二つになるなら1とする。葉は(dp,f)=(1,0)。実現できなければ判定は失敗である。

f_w=0の子のdp_wを降順にX、f_w=1の子をYとする。vと同色にできる子はXから高々二つ。k=0,1,2個を選ぶ候補について、Xの先頭k個だけを選ぶ。選択した子ではl_w=dp_w−1、その他ではl_w=dp_wと置く。vからの最大色数r=1+max_w l_w、異なる二子を結ぶパスの最大色数は1+最大二つのl_wの和になる。子が一つならrだけ、葉なら1を検査する。これらがK以下の候補のうちr最小を選び、同値ならk≤1を優先してf=0とする。

全子をsortする必要はない。Xの上位3個、Yの上位2個を保持すれば、選択後の最大二つも求まる。各頂点の走査は次数に比例する。K=1..Nを二分探索すればO(N log N)で解ける。

## 典型の発動条件

### 答えの二分探索

発動条件: 最大値最小化でK以下の可否が単調。

木DP判定を繰り返す。

### 木DPの支配状態削減

発動条件: 親との接続可否と最悪値だけが上位へ影響する。

(dp,f)の非支配状態一つへ圧縮する。

## 問題固有の要素

同色辺を選ぶことを各頂点次数高々2のパス分解とみると、子の選択肢が0〜2個に限定される。

別の問題へ持ち帰る視点: 木上のパス制約は親境界で必要な要約状態を探す。

## 正当性

異なる子部分木内の二頂点を結ぶパスはvを通り、選んだ枝ではvと子の色が共通になるため、色数はl_a+l_b+1である。子内部のパスは帰納的に検査済みなので、最大二枝と根からの最大枝を検査すれば全パスを尽くす。選択可能な子のlを1減らす操作では、大きい値を先に減らすほど最大値も最大二値和も悪化しないため、Xの先頭から選べる。

親へ渡す際、根からの最大色数を1以上増やして親との同色接続を可能にしても、接続で減る色数は高々1であり、親側のパスを短くできない。部分木内部の制約も改善しない。したがって最小dpだけを保持し、その値で接続可能ならf=0を優先する状態の圧縮が正しい。同色の子を高々二つ、親と同色なら高々一つにすることで、各色成分は次数2以下の木、すなわちパスになる。

## 実装上の注意

- 色数なので葉は1。異色辺数との1の差を全遷移で統一する。
- 最大二枝が必要な検査を根半径rだけで代用しない。候補が同じrなら親接続可能なf=0を残す。
- 深い木ではpostorderを反復処理してよい。

## 復習の核

根からの最大値と子をまたぐ最大値を分けて定義し、親との接続で改善できる量が高々1であることから状態の優越性を導く。

## 計算量と制約

### 時間

O(N log N)、K判定O(N)、子summaryの上位定数個を保持。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i, B_i \leq N; The given graph is a tree.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/editorial/5964) — source-abc293-editorial-5964-fa661f02f6876e8896f80d4179788d50bb5a6502ede71ab300bd6a35945c80c9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc293/tasks/abc293_h) — source-abc293-ex-problem-a073d501650d2242c62acd73265aeb8e9e62825f1dbe51a2e2cbb5363343f6b9
