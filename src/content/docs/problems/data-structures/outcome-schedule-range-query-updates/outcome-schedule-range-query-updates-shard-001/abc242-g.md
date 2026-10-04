---
title: "ABC242-G — Range Pairing Query"
draft: true
authoringUnit: {"problemId":"abc242-g","docPath":"src/content/docs/problems/data-structures/outcome-schedule-range-query-updates/outcome-schedule-range-query-updates-shard-001/abc242-g.md","learningOutcomeIds":["outcome-schedule-range-query-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンラインのpriority queue・multiset、および単調stack・queue。"],"tagIds":["tag-mo-offline-range"],"sourceRevisionIds":["source-abc242-editorial-3517-8f6f37f325f43fbaf555b844c1ee19c06ff832fb51d07701a93709823ba4c8e8","source-abc242-g-problem-89ae51a54b637dec16389b5cf4655ca2afd6fc5b686c76874fc04bec7d7003f5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"非線形な floor(cnt/2) でも、一個の増減差は cnt の偶奇だけで決まるため Mo の add/remove に必要な十分状態は頻度と総 pair 数だけである。 各 query を独立集計せず、近い区間間で O(1) update を共有でき、Q=10^6にも対応できる。","sourceRevisionIds":["source-abc242-editorial-3517-8f6f37f325f43fbaf555b844c1ee19c06ff832fb51d07701a93709823ba4c8e8","source-abc242-g-problem-89ae51a54b637dec16389b5cf4655ca2afd6fc5b686c76874fc04bec7d7003f5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Moの順序で区間問い合わせの差分を更新する](src/content/docs/learn/query/mo-offline-range.md)

- 区間問い合わせの順序と追加・削除操作を設計し、端点移動の総量を評価できる。

この解説で扱わないこと:

- オンラインのpriority queue・multiset、および単調stack・queue。

## 考察

区間内で色 c が cnt_c 人なら作れる pair は floor(cnt_c/2) で、答えは色ごとのこの値の和になる。query 間で端点を一つ動かすと変化するのは追加・削除した一色だけである。

色を一個追加したとき旧個数が奇数なら pair が1増え、削除時は旧個数が偶数なら1減るため、区間状態を定数時間で更新できる。

採用する候補: query を Mo's algorithm の順に並べ、現在区間の色頻度と pair 総数を四種類の端点移動で保つ。

各 query を独立集計せず、近い区間間で O(1) update を共有でき、Q=10^6にも対応できる。

棄却する候補: 各 query で区間を走査して色頻度を作り直す。

長い区間 query が多数あると総走査量が NQ になる。

非線形な floor(cnt/2) でも、一個の増減差は cnt の偶奇だけで決まるため Mo の add/remove に必要な十分状態は頻度と総 pair 数だけである。

query を左端 block と右端で Mo 順に sort する。現在 [L,R] を伸縮し、add(x) は count[A_x] が奇数なら ans++、remove(x) は削除前 count[A_x] が偶数なら ans-- として頻度を更新し、元 query index へ ans を保存する。

## 典型の発動条件

### Mo's algorithm

発動条件: 静的配列の多数の offline range query で、要素一個の追加・削除から答えを更新できるとき。

端点移動総数が小さくなる block 順へ query を並べ替える。

### 頻度関数の差分更新

発動条件: 答えが Σg(cnt_c) の形で、cnt を±1した差が簡単なとき。

対象色の g(new)-g(old) だけを総和へ反映する。

## 問題固有の要素

pair 数の増減条件が追加前は奇数、削除前は偶数と逆になる。

別の問題へ持ち帰る視点: floor や parity を含む頻度集計では add/remove の差を別々に式で導き、対称だと決めつけない。

## 正当性

非線形な floor(cnt/2) でも、一個の増減差は cnt の偶奇だけで決まるため Mo の add/remove に必要な十分状態は頻度と総 pair 数だけである。 各 query を独立集計せず、近い区間間で O(1) update を共有でき、Q=10^6にも対応できる。

## 実装上の注意

- remove 判定は count を減らす前の偶奇で行う。Q が10^6なので query object、sort comparator、入出力の定数倍を抑え、右端順を block ごとに反転する実装も検討する。

## 復習の核

- 同じ色の個数を0→1→2→1→0と動かし、pair 数の差と add/remove の判定時点を表にして覚える。

## 計算量と制約

### 時間

O(Q log Q+QB+N²/B)、Bは左端block幅。B≈N/√Qで移動O(N√Q+Q)。 左端block幅Bでは左端の移動がO(QB)、右端は高々N/B個のblockで各O(N)なのでO(N²/B)。B=max(1,⌊N/√Q⌋)で均衡させる。

### 空間

O(N+Q)、頻度とquery。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 10^5; 1 \le Q \le 10^6; 1 \le A_i \le N; 1 \le l \le r \le N in each query.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/editorial/3517) — source-abc242-editorial-3517-8f6f37f325f43fbaf555b844c1ee19c06ff832fb51d07701a93709823ba4c8e8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc242/tasks/abc242_g) — source-abc242-g-problem-89ae51a54b637dec16389b5cf4655ca2afd6fc5b686c76874fc04bec7d7003f5
