---
title: "ABC347-E — Set Add Query"
draft: true
authoringUnit: {"problemId":"abc347-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-003/abc347-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc347-e-problem-2279a1a95ed2bb4dcab5638b92a7a79a3d5f86306ccaf60f0782cebaf5ad85e2","source-abc347-editorial-9698-544bfc4af8fe0b31f60059cf56a1f1319c7d7c7404590873bca6f6954b49b3f2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"xがquery lで挿入されquery rで削除されるなら、xはtoggle後の時刻l,…,r-1でSにいるため寄与はpref[r-1]-pref[l-1]である。最後まで残る場合はpref[Q]-pref[l-1]になる。 toggleをO(1)で処理し、削除時または最後に一期間の寄与をprefix差で加算できる。","sourceRevisionIds":["source-abc347-e-problem-2279a1a95ed2bb4dcab5638b92a7a79a3d5f86306ccaf60f0782cebaf5ad85e2","source-abc347-editorial-9698-544bfc4af8fe0b31f60059cf56a1f1319c7d7c7404590873bca6f6954b49b3f2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

index xがSに入っている連続期間だけA_xへ各query後の|S|が加わる。全query後の値だけが必要なので、期間内の|S|総和をprefix sumで一括取得できる。

採用する候補: query時の|S| prefix sumと各indexの加入開始時刻を記録する

棄却する候補: 各query後にSの全要素へ|S|を加える

|S|がO(N)のqueryが続くと合計O(NQ)になる。

inSet、start[x]、現在size、pref[0]=0を持つ。query tでxが未加入なら加入markとstart=t,size++、加入済みならans[x]+=pref[t-1]-pref[start-1]として削除しsize--する。そのtoggle後にpref[t]=pref[t-1]+sizeを置き、終了後のactive xへ残期間差を加える。

## 典型の発動条件

### active intervalへの寄与集約

発動条件: 要素がonの各時刻にglobal値を受け取り、on/offがtoggleされる。

各on区間の開始を保存し、global時系列prefixの差を要素answerへ足す。

### 時系列prefix sum

発動条件: 各query後のset sizeを任意期間で合計したい。

pref[t]=Σ_{q≤t}|S_q|を構築して区間和をO(1)にする。

## 問題固有の要素

update値|S|は全active要素に共通なので、要素側を走査せずglobal accumulatorの増分を加入・脱退時に精算できる。

別の問題へ持ち帰る視点: 同じ時系列量をactive集合全体へ配る処理は、global累積値のsnapshot差でlazyに受け取れる。

## 正当性

xがquery lで挿入されquery rで削除されるなら、xはtoggle後の時刻l,…,r-1でSにいるため寄与はpref[r-1]-pref[l-1]である。最後まで残る場合はpref[Q]-pref[l-1]になる。 toggleをO(1)で処理し、削除時または最後に一期間の寄与をprefix差で加算できる。

## 実装上の注意

- |S|はqueryのtoggle後の大きさである。削除query自身は寄与しないためpref[t-1]までを精算し、start-1のindexを揃える。

## 復習の核

- 一回だけ加入して最後まで残る、直後に削除、同じxの複数期間、複数要素でsizeが変動する例を逐次simulationと比較する。

## 計算量と制約

### 時間

O(N+Q)、size prefix和と各要素の在籍区間差。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,Q\leq 2\times10^5; 1\leq x_i\leq N; All given numbers are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/tasks/abc347_e) — source-abc347-e-problem-2279a1a95ed2bb4dcab5638b92a7a79a3d5f86306ccaf60f0782cebaf5ad85e2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc347/editorial/9698) — source-abc347-editorial-9698-544bfc4af8fe0b31f60059cf56a1f1319c7d7c7404590873bca6f6954b49b3f2
