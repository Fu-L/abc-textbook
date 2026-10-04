---
title: "ABC318-E — Sandwiches"
draft: true
authoringUnit: {"problemId":"abc318-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc318-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc318-e-problem-70c4c614fc1f6c6f052372ab7f5a476b184b77ecf4c3f561ff9333ccd64d62b4","source-abc318-editorial-7068-092cf3852f4a8e6d08d5e530476d0cf637d2836240da2dcaa8deef09ead12c1d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"total は左右頻度ベクトルの内積であり、一要素を right から減らす/left へ増やす前にその値の旧寄与を引き、更新後寄与を足せばよい。 中央値と同じ x の組は A_i=A_j=A_k となり条件外なので、各 j で left[A_j]right[A_j] を明示的に差し引く。 各 j の寄与 total−left[A_j]right[A_j] を O(1) で得られ、全体 O(N) になる。","sourceRevisionIds":["source-abc318-e-problem-70c4c614fc1f6c6f052372ab7f5a476b184b77ecf4c3f561ff9333ccd64d62b4","source-abc318-editorial-7068-092cf3852f4a8e6d08d5e530476d0cf637d2836240da2dcaa8deef09ead12c1d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

条件 i<j<k と A_i=A_k≠A_j は中央 j を固定すると、左右で同じ値 x を一つずつ選ぶ積 left[x]right[x] の和から x=A_j だけ除く形になる。

j を一つ右へ動かすと left/right で変わる値は A_j 一種類だけなので、全 x の積和 total=Σleft[x]right[x] も差分更新できる。

採用する候補: 中央位置を左から一度走査し、値別左右頻度と内積totalを一点差分で維持する。

棄却する候補: 両端 i,k を同値ごとに列挙し、その間の A_j≠A_i の個数を数える。

同じ値が N 回現れる場合に端点対が Θ(N²) となり、間の個数を O(1) で取っても間に合わない。

初期 right を全頻度、left=0,total=0 とする。j を左から処理する際、まず A_j を right から一つ外し total を差分更新する。答えへ total−left[A_j]right[A_j] を加え、次の中央に備えて A_j を left へ一つ加えて total を再度差分更新する。

## 典型の発動条件

### 三つ組の中央固定

発動条件: i<j<k の両側要素に対称な条件があり、中央要素が除外条件を持つとき。

左右の頻度・集約量を持ち、j ごとの組数を積で表す。

### 頻度ベクトル内積の差分更新

発動条件: 入力indexを一方向に走査すると左右multisetが一点ずつ変わり、Σf_xg_xが毎回必要なとき。

変化する x の旧寄与だけ引き、新寄与だけ足す。

## 問題固有の要素

一見「同値の両端」を選ぶ問題でも、異値条件を持つ中央へ課金すると頻度内積が一走査で更新できる。

別の問題へ持ち帰る視点: 順序付き三つ組は、どの index を固定すると残り二つが独立な左右選択になるか試す。

## 正当性

total は左右頻度ベクトルの内積であり、一要素を right から減らす/left へ増やす前にその値の旧寄与を引き、更新後寄与を足せばよい。 中央値と同じ x の組は A_i=A_j=A_k となり条件外なので、各 j で left[A_j]right[A_j] を明示的に差し引く。 各 j の寄与 total−left[A_j]right[A_j] を O(1) で得られ、全体 O(N) になる。

## 実装上の注意

- 中央 j を right から除いてから寄与を数え、left へ入れるのは数えた後にする。答えは Θ(N³) なので 64 bit を使う。

## 復習の核

- 更新順を「rightから除く→数える→leftへ入れる」と言語化する。全要素同値の例で除外項により0になることを確認する。

## 計算量と制約

### 時間

O(N)、左右頻度内積を一要素差分更新。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3\leq N\leq 3\times 10^5; 1\leq A_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/tasks/abc318_e) — source-abc318-e-problem-70c4c614fc1f6c6f052372ab7f5a476b184b77ecf4c3f561ff9333ccd64d62b4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/editorial/7068) — source-abc318-editorial-7068-092cf3852f4a8e6d08d5e530476d0cf637d2836240da2dcaa8deef09ead12c1d
