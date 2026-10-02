---
title: "ABC393-F — Prefix LIS Query"
draft: true
authoringUnit: {"problemId":"abc393-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-lis-frontier/outcome-design-lis-frontier-shard-001/abc393-f.md","learningOutcomeIds":["outcome-design-lis-frontier"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-sequence","unit-event-sweep"],"excludedTopics":["LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lis-state","tag-event-sweep"],"sourceRevisionIds":["source-abc393-editorial-12252-2c47af898a83fbae6ed97509092415b6a76c99ea5847d3fba170615ef30eea0d","source-abc393-f-problem-e0e9edbbde1eef3fa48ba213588f4d51c7172f39ea658be6f6bcdf81b50b1d06"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"tails[j] を長さ j+1 の増加部分列の最小末尾とする不変条件は lower_bound 置換で保たれる。末尾≤Xの列では全要素が末尾以下なので値上限を満たす。逆に値上限を満たす列が長さ j+1なら最小末尾も≤X。従って tails 内の≤Xの要素数が答えであり、prefix R 時点の upper_bound がそれを返す。","sourceRevisionIds":["source-abc393-editorial-12252-2c47af898a83fbae6ed97509092415b6a76c99ea5847d3fba170615ef30eea0d","source-abc393-f-problem-e0e9edbbde1eef3fa48ba213588f4d51c7172f39ea658be6f6bcdf81b50b1d06"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [LIS・末尾の支配関係](src/content/docs/learn/dynamic-programming/dp-lis.md)

- 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

prefix A[1..R]の通常LIS tails配列dp[j]=長さjの増加部分列の最小末尾は、jについてstrict増加する。 値上限Xの要素だけからなる最長長さは、prefix R処理時点でdp[j]≤Xとなる最大jに等しい。末尾がX以下なら構成要素もstrict増加ゆえ全てX以下である。 strict LISなのでA_iの更新位置はdpでA_i以上となる最初の場所（lower_bound）である。 queryはdp[j]≤Xの個数なのでXより大きい最初の位置（upper_bound）が答えになる。

採用する候補: R昇順にoffline queryを処理しながらpatience sortingのtailsを更新し、Xをupper_boundする

各A_iのlower_bound更新と各queryのupper_boundをO(log N)で行い、全体O((N+Q)log N)になる。

棄却する候補: 各queryごとにA[1..R]からX超過を除いてLISを再計算する

prefixが重なるのに計算を共有せず、最悪O(NQ log N)となる。

strict LISなのでA_iの更新位置はdpでA_i以上となる最初の場所（lower_bound）である。

queryはdp[j]≤Xの個数なのでXより大きい最初の位置（upper_bound）が答えになる。

queryをR別bucketへ入れる。i=1..NでtailsへA_iをlower_bound置換し、R=iの各queryについてtailsをXでupper_boundしたindexを答えとして保存する。

## 典型の発動条件

### offline prefix query

発動条件: query条件の一軸がprefix終端で、状態を一要素ずつ更新できるとき。

R順にsweepして同じprefix状態を共有する。

### LIS tails invariant

発動条件: strict LIS長を最小末尾列で管理するとき。

lower_bound更新と値thresholdのupper_boundを組み合わせる。

## 問題固有の要素

「各要素≤X」という制約はLIS DPへ新しい次元を足さず、最小末尾dpの値境界を読むだけで表せる。

別の問題へ持ち帰る視点: prefix subsequence queryでは、標準online DPのfrontierにquery条件が直接binary searchできないか確認する。

## 正当性

tails[j] を長さ j+1 の増加部分列の最小末尾とする不変条件は lower_bound 置換で保たれる。末尾≤Xの列では全要素が末尾以下なので値上限を満たす。逆に値上限を満たす列が長さ j+1なら最小末尾も≤X。従って tails 内の≤Xの要素数が答えであり、prefix R 時点の upper_bound がそれを返す。

## 実装上の注意

- strict増加なのでupdateはlower_bound、queryは≤Xなのでupper_boundを使う。未到達INFをtailsへ含める実装ではXとの比較範囲を揃える。

## 復習の核

- 重複値列、降順列、Xがちょうどtails要素/その直前のcaseをsubsequence全探索と比較する。

## 計算量と制約

### 時間

N 要素、Q 質問。R別 bucket で O((N+Q)log N)、query sort を使うなら追加 O(Qlog Q)。

### 空間

tails、bucket、出力で O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,Q \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; 1 \leq R_i \leq N; \min\lbrace A_1, A_2,\dots,A_{R_i} \rbrace\leq X_i\leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/editorial/12252) — source-abc393-editorial-12252-2c47af898a83fbae6ed97509092415b6a76c99ea5847d3fba170615ef30eea0d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/tasks/abc393_f) — source-abc393-f-problem-e0e9edbbde1eef3fa48ba213588f4d51c7172f39ea658be6f6bcdf81b50b1d06
