---
title: "ABC217-E — Sorting Queries"
draft: true
authoringUnit: {"problemId":"abc217-e","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc217-e.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-priority-queue-best-first"],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc217-e-problem-1e6120a670aded81a6140b0683c3fbebcaf515943138cefcb894a42a7a8f66b2","source-abc217-editorial-2577-6c9a638e0f3bd96939a9d944fcbb933559e21b4dc87288def9136d0f371b017b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"heap が空でなければその最小値が必ず列の先頭であり、heap が空になって初めて queue の先頭が列の先頭になる。 操作1の到着順と操作3後の昇順を同時に保てる。各要素が queue から heap へ移るのは高々一度なので、操作3の一回の重さではなく全クエリを通した仕事量で評価できる。","sourceRevisionIds":["source-abc217-e-problem-1e6120a670aded81a6140b0683c3fbebcaf515943138cefcb894a42a7a8f66b2","source-abc217-editorial-2577-6c9a638e0f3bd96939a9d944fcbb933559e21b4dc87288def9136d0f371b017b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

操作3の直後に存在した要素は昇順のまま先頭側に並び、その後の操作1で加わる要素だけが末尾へ到着順に連なる。したがって、現在の列は「ソート済み部分」と「まだ一度もソートされていない追加部分」に分けて考えられる。

操作2が必要とするのは列全体ではなく先頭だけであり、ソート済み部分からは最小値、未ソート部分からは最古の要素だけを取り出せればよい。

採用する候補: 未ソート部分を FIFO queue、ソート済み部分を min-priority queue で別々に持ち、操作3で前者の全要素を後者へ移す。

操作1の到着順と操作3後の昇順を同時に保てる。

棄却する候補: 列を一つの配列で保持し、操作3のたびに配列全体をソートする。

操作1を大量に行った後で操作3を繰り返す入力では同じ要素を何度もソートし、Q が 2×10^5 の制約に収まらない。

操作1では queue へ追加し、操作2では heap が非空ならその最小値、空なら queue の先頭を出力して削除する。操作3では queue が空になるまで要素を heap へ移し、明示的な全体ソートを行わない。

## 典型の発動条件

### 列の状態分割

発動条件: 一部の操作だけが既存要素を並べ替え、その後の追加要素は並べ替え済み部分の後ろに残るとき。

操作履歴の境界で列をソート済み部分と未処理 suffix に分け、それぞれに必要な順序だけを持つデータ構造を割り当てる。

### 償却解析

発動条件: 一回だけ見ると重い一括移動がある一方、各要素がその移動を経験する回数を制限できるとき。

操作3で移した個数の総和を、操作1で追加された全要素数以下として数える。

## 問題固有の要素

「sort」は過去の全要素だけを heap 側へ確定させ、以後に append された要素の FIFO 順までは壊さない。

別の問題へ持ち帰る視点: 更新が列全体へ及ぶように見えたら、更新時点より前と後の要素で意味が変わらないかを調べ、履歴の境界を状態として残す。

## 正当性

heap が空でなければその最小値が必ず列の先頭であり、heap が空になって初めて queue の先頭が列の先頭になる。 操作1の到着順と操作3後の昇順を同時に保てる。各要素が queue から heap へ移るのは高々一度なので、操作3の一回の重さではなく全クエリを通した仕事量で評価できる。

## 実装上の注意

- queue の先頭削除を配列の shift で実装せず、deque または読み取り index を使う。重複値は heap に個別要素としてそのまま保持する。

## 復習の核

- サンプル1の操作3の直後と、その後に 0 を追加した直後を書き出し、heap を queue より先に読む理由を言葉で再確認する。

## 計算量と制約

### 時間

全Q操作でO(Q log Q)、queueの各要素は高々一度heapへ移る。

### 空間

O(Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq Q \leq 2 \times 10^5; 0 \leq x \leq 10^9; A will not be empty when a query 2 is given.; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/tasks/abc217_e) — source-abc217-e-problem-1e6120a670aded81a6140b0683c3fbebcaf515943138cefcb894a42a7a8f66b2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/editorial/2577) — source-abc217-editorial-2577-6c9a638e0f3bd96939a9d944fcbb933559e21b4dc87288def9136d0f371b017b
