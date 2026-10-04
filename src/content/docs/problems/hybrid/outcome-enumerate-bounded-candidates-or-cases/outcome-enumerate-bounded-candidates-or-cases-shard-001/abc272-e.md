---
title: "ABC272-E — Add and Mex"
draft: true
authoringUnit: {"problemId":"abc272-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc272-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc272-e-problem-493ed4f594f36757b3b1d7f3788f15076a0d245f0b81a4d87c0c453a941bbade","source-abc272-editorial-4982-2f64ff69fd347743a8eefbd6fcb44cf7401f2413cbda8aa0d11104a3e36b1d54"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"A_iが負でも、最初に非負となるj=max(1,ceil(−A_i/i))から始めれば無駄なnegative valuesを列挙しない。 各bucketの要素数をsとするとmexは高々sなので、0から見つかるまでのscan総量もbucket sizesの総和に比例する。 mexに影響するpair (i,j)だけの総数がO(N log N)で、不要な巨大値を完全に省ける。","sourceRevisionIds":["source-abc272-e-problem-493ed4f594f36757b3b1d7f3788f15076a0d245f0b81a4d87c0c453a941bbade","source-abc272-editorial-4982-2f64ff69fd347743a8eefbd6fcb44cf7401f2413cbda8aa0d11104a3e36b1d54"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

長さNのsequenceのmexは必ず0,…,Nの範囲なので、operation j後の値A_i+ijが[0,N)に入る場合だけを記録すればよい。

固定iで重要になるjの個数は高々⌈N/i⌉であり、全iの合計はharmonic sum O(N log N)になる。

棄却する候補: 各operationでN要素を更新し、setからmexを求め直す。

N×Mが最大4×10^10となる。

採用する候補: 各iについて0≤A_i+ij<Nとなるjだけを列挙し、operation jのbucketへ値を入れてbucketごとにmexを走査する。

mexの値域boundで全time-element pairsをsparse eventsへ絞り、arithmetic progressionの有効区間列挙とoffline bucketsで処理する。

## 典型の発動条件

### mexの値域による枝刈り

発動条件: 集合の要素数がNで、mex以外の巨大値が答えに影響しないとき。

各時刻で[0,N)に入る値だけをpresence候補として保存する。

### 調和級数による疎な列挙

発動条件: index iごとの有効event数がO(N/i)で抑えられるとき。

A_i+ijがmex範囲にある連続j区間だけを歩き、総event数をO(N log N)と評価する。

## 問題固有の要素

j回目の値は初期値を逐次更新せずA_i+ijと直接書けるため、要素ごとに有効時刻を逆列挙できる。

別の問題へ持ち帰る視点: 全時刻simulationが重いときは、各objectが答えのrelevant rangeへ入る時刻だけをofflineに配る。

## 正当性

A_iが負でも、最初に非負となるj=max(1,ceil(−A_i/i))から始めれば無駄なnegative valuesを列挙しない。 各bucketの要素数をsとするとmexは高々sなので、0から見つかるまでのscan総量もbucket sizesの総和に比例する。 mexに影響するpair (i,j)だけの総数がO(N log N)で、不要な巨大値を完全に省ける。

## 実装上の注意

- jの下端・上端を整数除算で求める際はnegative A_iのceil divisionを誤らず、[1,M]と交差させる。
- 同じbucketにduplicate値があってもpresenceだけを立て、mex scan用arrayをtimestamp方式で再利用できる。

## 復習の核

- mex問題では、まずsequence lengthから答えの上界を固定し、その範囲外の値を捨てる。
- 要素ごとの値が時刻の一次式なら、値域に入る時刻区間を解いてevent総数を評価する。

## 計算量と制約

### 時間

O(N log N+M)、時刻ごとの有効event総数ΣO(N/i)。

### 空間

O(N log N+M)、event bucket。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,M \leq 2\times 10^5; -10^9\leq A_i\leq 10^9; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/tasks/abc272_e) — source-abc272-e-problem-493ed4f594f36757b3b1d7f3788f15076a0d245f0b81a4d87c0c453a941bbade
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/editorial/4982) — source-abc272-editorial-4982-2f64ff69fd347743a8eefbd6fcb44cf7401f2413cbda8aa0d11104a3e36b1d54
