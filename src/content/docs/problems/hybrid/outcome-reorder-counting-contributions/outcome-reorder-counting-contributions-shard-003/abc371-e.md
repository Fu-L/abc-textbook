---
title: "ABC371-E — I Hate Sigma Problems"
draft: true
authoringUnit: {"problemId":"abc371-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc371-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc371-e-problem-4317baef9dcf6c77612f151f700251d71ba4de4fd36a0edac3241c3756e9a5d9","source-abc371-editorial-10922-65463ad1e84ad122b219d944a7e2e3b3839270644ebe295fb6e2c39cfd6624ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"値 i の出現位置に 0 と N+1 を番兵として加えると、長さ g の各 gap が i を含まない区間を g(g+1)/2 個だけ生む。 全区間数 N(N+1)/2 から非出現区間数を引いた量が、値 i が答えへ 1 を寄与する区間数そのものである。 値 i の非出現区間は隣接する出現位置の間へ一意に属し、全値にわたる出現位置の総数が N なので O(N) で集計できる。","sourceRevisionIds":["source-abc371-e-problem-4317baef9dcf6c77612f151f700251d71ba4de4fd36a0edac3241c3756e9a5d9","source-abc371-editorial-10922-65463ad1e84ad122b219d944a7e2e3b3839270644ebe295fb6e2c39cfd6624ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

求める distinct 数の総和は、値ごとに「その値を含む連続部分列の個数」を足す形へ寄与を交換できる。各値の出現回数の総和は N なので、値ごとの処理を出現位置数に比例させれば全体を線形にできる。

採用する候補: 各値について全区間数からその値を含まない区間数を引き、出現位置間の gap ごとに三角数を足す。

値 i の非出現区間は隣接する出現位置の間へ一意に属し、全値にわたる出現位置の総数が N なので O(N) で集計できる。

棄却する候補: 左端を固定して右へ伸ばし、集合で distinct 数を更新する。

一つの左端には O(N) 個の右端があり、distinct 数を定数時間で更新しても O(N^2) となる。

値 i の出現位置に 0 と N+1 を番兵として加えると、長さ g の各 gap が i を含まない区間を g(g+1)/2 個だけ生む。

全区間数 N(N+1)/2 から非出現区間数を引いた量が、値 i が答えへ 1 を寄与する区間数そのものである。

各値の出現位置列を作り、番兵を含む隣接位置差から非出現区間数を計算する。全区間数との差を全値について加算し、64 bit 整数で答えを得る。

## 典型の発動条件

### 寄与の交換と余事象

発動条件: 区間ごとの distinct 数の総和のように、対象ごとの 0/1 寄与へ分解できるとき。

区間を列挙せず、各値が含まれる区間数を余事象から数える。

### 出現位置と gap の数え上げ

発動条件: ある値を避ける連続区間を数えたいとき。

出現位置間の空白を独立な区間として三角数で集計する。

## 問題固有の要素

distinct 数を値ごとの指示関数へ分解すると二重和の順序を交換できる。

別の問題へ持ち帰る視点: 区間統計の総和では、各要素が寄与する区間を数える視点を最初に試す。

## 正当性

値 i の出現位置に 0 と N+1 を番兵として加えると、長さ g の各 gap が i を含まない区間を g(g+1)/2 個だけ生む。 全区間数 N(N+1)/2 から非出現区間数を引いた量が、値 i が答えへ 1 を寄与する区間数そのものである。 値 i の非出現区間は隣接する出現位置の間へ一意に属し、全値にわたる出現位置の総数が N なので O(N) で集計できる。

## 実装上の注意

- 番兵 0,N+1 と gap 長 x_{j+1}-x_j-1 を混同せず、N=2×10^5 の総和を 64 bit 整数で保持する。

## 復習の核

- 「各区間に何種類あるか」ではなく「各値が何区間に現れるか」へ和を交換できることと、非出現区間が gap に分割されることを再現する。

## 計算量と制約

### 時間

O(N)、値別位置gapの総数N+distinct数。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times 10^5; 1\leq A_i\leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/tasks/abc371_e) — source-abc371-e-problem-4317baef9dcf6c77612f151f700251d71ba4de4fd36a0edac3241c3756e9a5d9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/editorial/10922) — source-abc371-editorial-10922-65463ad1e84ad122b219d944a7e2e3b3839270644ebe295fb6e2c39cfd6624ad
