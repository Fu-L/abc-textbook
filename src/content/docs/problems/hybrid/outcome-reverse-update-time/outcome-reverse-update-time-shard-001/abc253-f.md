---
title: "ABC253-F — Operations on a Matrix"
draft: true
authoringUnit: {"problemId":"abc253-f","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc253-f.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-prefix-aggregate","unit-weighted-prefix-fenwick"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-fenwick-weighted-prefix","tag-prefix-difference"],"sourceRevisionIds":["source-abc253-editorial-4025-a9dda18762878be5ec2358cece648988d3e594c03022782f457e4a13e5c3a095","source-abc253-f-problem-9b46b432bebd3b4b187ea5abb99002da9ceeb10b0aeccaa727cd4c94ffc87a7b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"取得時の列累積量をS_now[j]、直前代入時をS_set[j]とすれば答えはx+S_now[j]-S_set[j]になる。 代入時に全M列を記録する必要はなく、その代入へ結び付いた将来の点取得が使う列jだけをスナップショットすればよい。 各点取得が参照する直前の行代入を先に特定し、時間順走査中に列加算の代入時スナップショットを引けば、行列を持たずに答えられる。","sourceRevisionIds":["source-abc253-editorial-4025-a9dda18762878be5ec2358cece648988d3e594c03022782f457e4a13e5c3a095","source-abc253-f-problem-9b46b432bebd3b4b187ea5abb99002da9ceeb10b0aeccaa727cd4c94ffc87a7b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

行iへの代入後に行う点取得(i,j)は、代入値xに、その代入時刻から取得時刻までに列jへ加わった量だけを足せばよい。

採用する候補: 最終行代入へ問い合わせを結び付けるオフラインBIT

各点取得が参照する直前の行代入を先に特定し、時間順走査中に列加算の代入時スナップショットを引けば、行列を持たずに答えられる。

棄却する候補: N×M行列を更新する

行列サイズが最大4×10^5同士で、保存も区間更新も不可能である。

取得時の列累積量をS_now[j]、直前代入時をS_set[j]とすれば答えはx+S_now[j]-S_set[j]になる。

代入時に全M列を記録する必要はなく、その代入へ結び付いた将来の点取得が使う列jだけをスナップショットすればよい。

一度目の走査で各点取得をその行の直前代入へ紐付ける。二度目は列区間加算をrange-add/point-query BITで処理し、代入時に紐付く各列のBIT値を負の補正として保存し、取得時のBIT値と代入値へ加える。

## 典型の発動条件

### オフライン依存先の付け替え

発動条件: 問い合わせの答えが過去の最後の更新一つと、その後の差分で決まる。

行ごとの最終代入時刻を追い、将来の点取得を該当更新イベントへ接続する。

### range-add point-query BIT

発動条件: 列区間への加算履歴から特定列の累積値だけが必要になる。

差分BITで区間加算し、代入時と取得時の二時点の値を引き算する。

## 問題固有の要素

行代入は列ごとに異なる過去加算を全て打ち消すため、一つの行基準値では表せないが、実際に問われる列だけを代入時へ遡って差し引けばよい。

別の問題へ持ち帰る視点: 巨大な二次元状態でも、上書き境界と一次元差分を問い合わせ単位で結び付けるオフライン化が有効である。

## 正当性

取得時の列累積量をS_now[j]、直前代入時をS_set[j]とすれば答えはx+S_now[j]-S_set[j]になる。 代入時に全M列を記録する必要はなく、その代入へ結び付いた将来の点取得が使う列jだけをスナップショットすればよい。 各点取得が参照する直前の行代入を先に特定し、時間順走査中に列加算の代入時スナップショットを引けば、行列を持たずに答えられる。

## 実装上の注意

- 直前代入がない取得は基準値0・時刻0として扱い、同じ時刻の操作順を変えない。加算総和と代入値は64ビット整数で保持する。

## 復習の核

- 小さい行列を直接更新する実装と比較し、代入前後に同じ列へ加算する例、代入なし、同じ行への連続代入、異なる列の取得を確認する。

## 計算量と制約

### 時間

O((M+Q)log M)、列range-add BIT、各点取得を一回snapshot。

### 空間

O(N+M+Q)、行lastと取得紐付け。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M, Q \leq 2 \times 10^5; Every query is in one of the formats listed in the Problem Statement.; For each query in the format 1 l r x, 1 \leq l \leq r \leq M and 1 \leq x \leq 10^9.; For each query in the format 2 i x, 1 \leq i \leq N and 1 \leq x \leq 10^9.; For each query in the format 3 i j, 1 \leq i \leq N and 1 \leq j \leq M.; At least one query in the format 3 i j is given.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/editorial/4025) — source-abc253-editorial-4025-a9dda18762878be5ec2358cece648988d3e594c03022782f457e4a13e5c3a095
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/tasks/abc253_f) — source-abc253-f-problem-9b46b432bebd3b4b187ea5abb99002da9ceeb10b0aeccaa727cd4c94ffc87a7b
