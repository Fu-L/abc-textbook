---
title: "ABC217-G — Groups"
draft: true
authoringUnit: {"problemId":"abc217-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc217-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc217-editorial-2390-3e14cd67c50c643eb6ed83f86b0a18144437cde207cb3f0d90786c0a766be53a","source-abc217-g-problem-89671adfa61460fc1d2709554f7877054b80a8f9d7f0af49f3283bd82905f555"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i番の人と同じ余りの既存人数はfloor((i−1)/M)。それらは既に別groupを占めるので既存jgroupのうち許容合流先はj−floor((i−1)/M)。新singletonは旧j−1状態から一通り。無名groupを新規生成順で一意に扱うため重複なくpartitionを数える。","sourceRevisionIds":["source-abc217-editorial-2390-3e14cd67c50c643eb6ed83f86b0a18144437cde207cb3f0d90786c0a766be53a","source-abc217-g-problem-89671adfa61460fc1d2709554f7877054b80a8f9d7f0af49f3283bd82905f555"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

人を ID 順に一人ずつ追加すると、人 i より前に同じ余りを持つ人はちょうど floor((i-1)/M) 人いる。条件を満たす分け方では、その全員が互いに異なるグループへ入っている。 グループに名前はなく、追加した人 i は新しい一人グループを作るか、既存グループへ合流するかのどちらかで全ての場合を一意に分類できる。 既存 j グループのうち禁止されるのは同余りの先行者が一人ずついる floor((i-1)/M) グループであり、合流可能数は j-floor((i-1)/M) である。

採用する候補: dp[i][j] を先頭 i 人をちょうど j 個のグループへ分ける方法数とし、人 i の所属で遷移する。

同じ余りの既存人数が配置によらず floor((i-1)/M) 個の禁止グループを占めるため、状態に各グループの中身を持たず j だけで合流先の個数を決められる。

棄却する候補: 制約を無視した Stirling 数の漸化式 dp[i-1][j-1]+j dp[i-1][j] をそのまま使う。

人 i と同じ余りの人を含むグループへの合流も数えてしまい、サンプル1の一グループ分割などを過大計数する。

既存 j グループのうち禁止されるのは同余りの先行者が一人ずついる floor((i-1)/M) グループであり、合流可能数は j-floor((i-1)/M) である。

dp[i][j]=dp[i-1][j-1]+(j-floor((i-1)/M))dp[i-1][j] を法 998244353 で計算し、i=N の j=1..N を順に出力する。

## 典型の発動条件

### 集合分割の逐次 DP

発動条件: ラベルなしグループへの分割を数え、新要素が singleton を作る場合と既存群へ入る場合に分けられるとき。

処理済み人数とグループ数を状態にし、追加先の有効グループ数を遷移係数にする。

### 配置によらない禁止数の抽出

発動条件: 加入禁止条件があるものの、禁止要素同士が必ず別々の箱を占める不変条件があるとき。

各分割の詳細を持たず、禁止グループ数だけを既知の人数から差し引く。

## 問題固有の要素

ID 順に処理することで、余り i mod M の先行者数が floor((i-1)/M) という単純な式になり、その人たちが別群にいることまで条件自身が保証する。

別の問題へ持ち帰る視点: 属性衝突つき集合分割では、処理順を選んで「同属性の先行者数」と「それらが占める箱数」を一致させられないか調べる。

## 正当性

i番の人と同じ余りの既存人数はfloor((i−1)/M)。それらは既に別groupを占めるので既存jgroupのうち許容合流先はj−floor((i−1)/M)。新singletonは旧j−1状態から一通り。無名groupを新規生成順で一意に扱うため重複なくpartitionを数える。

## 実装上の注意

- j-floor((i-1)/M) が負になる状態は到達不能として扱い、dp[0][0]=1 から必要な j 範囲だけ更新する。出力はグループ数 1 から N の順である。

## 復習の核

- M=2 で人1,3を先に意識し、なぜ同じグループにいないことが「禁止グループ数=同余り人数」を保証するか説明する。

## 計算量と制約

### 時間

N 人、modulus M。人数×group数 DP O(N²)。

### 空間

rolling group数 O(N)、全行保存なら O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5000; 2 \leq M \leq N; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/editorial/2390) — source-abc217-editorial-2390-3e14cd67c50c643eb6ed83f86b0a18144437cde207cb3f0d90786c0a766be53a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/tasks/abc217_g) — source-abc217-g-problem-89671adfa61460fc1d2709554f7877054b80a8f9d7f0af49f3283bd82905f555
