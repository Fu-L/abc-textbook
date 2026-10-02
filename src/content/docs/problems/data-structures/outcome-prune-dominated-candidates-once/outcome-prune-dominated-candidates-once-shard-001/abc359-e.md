---
title: "ABC359-E — Water Tank"
draft: true
authoringUnit: {"problemId":"abc359-e","docPath":"src/content/docs/problems/data-structures/outcome-prune-dominated-candidates-once/outcome-prune-dominated-candidates-once-shard-001/abc359-e.md","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["全候補から極値を反復取得するheap・ordered set。"],"tagIds":["tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc359-e-problem-eb51ad038f13dca0efcc5ccca6afd91ec904df066f80b2da5974f7679fe2c227","source-abc359-editorial-10262-ea2d05f58e64259f16d8f79a4e1d1735011cd9cc6ff98609133b62b2895323f5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"stackの各組(v,c)は、現在のsuffix最大値列に値vがc個連続して現れるblockを表し、下から上へ高さが厳密に減る。 popしたblockのv*cを和から引き、個数を新しいH_iのblockへ足してH_i*cを加えると、区間chmax後の和を直接更新できる。 各blockは追加後に一度だけpopされ、必要なsuffix最大値の和を逐次維持できる。","sourceRevisionIds":["source-abc359-e-problem-eb51ad038f13dca0efcc5ccca6afd91ec904df066f80b2da5974f7679fe2c227","source-abc359-editorial-10262-ea2d05f58e64259f16d8f79a4e1d1735011cd9cc6ff98609133b62b2895323f5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 全候補から極値を反復取得するheap・ordered set。

## 考察

位置 n の水量が初めて正になる直前には、各 i<n の水量が右側 H_{i+1}..H_n の最大値に一致する。操作回数は全水量の増加量なので、答えはこれらsuffix最大値の和に1を足したものになる。

nを右へ一つ伸ばすと、新しい高さH_n以下だった末尾側の最大値区間がすべてH_nへ統合される。この変更は高さが厳密に減るblock列として表せる。

採用する候補: 高さとその高さを取る連続個数を単調stackで持ち、H_i以下のblockを併合しながら総和を更新する。

各blockは追加後に一度だけpopされ、必要なsuffix最大値の和を逐次維持できる。

棄却する候補: 各nについてH_1..H_nを右から走査し、suffix最大値をすべて計算し直す。

答え同士で大部分が共通なのに再計算するため、単調な入力では走査量が二次的に増える。

stackの各組(v,c)は、現在のsuffix最大値列に値vがc個連続して現れるblockを表し、下から上へ高さが厳密に減る。

popしたblockのv*cを和から引き、個数を新しいH_iのblockへ足してH_i*cを加えると、区間chmax後の和を直接更新できる。

sum=0と空stackを用意する。各H_iについて、top.height≤H_iの間は組を取り出し、そのcountをまとめてsumからheight×countを引く。まとめた個数に新位置の1を加えた(H_i,count)を積み、sumへH_i×countを加えて、sum+1を出力する。

## 典型の発動条件

### 単調stackによる区間併合

発動条件: 新要素によってsuffix上の劣る値が一括で置換されるとき。

等しい高さもpopして一blockへまとめ、suffix最大値列をrun-length encodingする。

### 集約値の差分維持

発動条件: 圧縮表現を更新しながら全要素の和も毎回必要なとき。

blockの削除・追加と同時に高さ×個数を増減して全体和を保つ。

## 問題固有の要素

複雑な水の伝播を直接simulationせず、「初めて次の容器へ届く直前」の静止形をsuffix最大値として捉えることが本質である。

別の問題へ持ち帰る視点: 反復操作の時刻を求める問題では、注目event直前の状態に不変条件がないか探す。

## 正当性

stackの各組(v,c)は、現在のsuffix最大値列に値vがc個連続して現れるblockを表し、下から上へ高さが厳密に減る。 popしたblockのv*cを和から引き、個数を新しいH_iのblockへ足してH_i*cを加えると、区間chmax後の和を直接更新できる。 各blockは追加後に一度だけpopされ、必要なsuffix最大値の和を逐次維持できる。

## 実装上の注意

- 同じ高さは別blockに残さず≤で併合する。H_iと個数の積および累積和は32 bitを超えるため64 bit整数で持つ。

## 復習の核

- まず小さい列で「次の容器に水が入る直前」のAを書き出し、suffix最大値になる理由を固める。その後stackの各組が表す添字範囲とsumの不変条件を明記する。

## 計算量と制約

### 時間

O(N)、各blockは一回push/pop。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10 ^ 5; 1\leq H _ i\leq10 ^ 9\ (1\leq i\leq N); All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/tasks/abc359_e) — source-abc359-e-problem-eb51ad038f13dca0efcc5ccca6afd91ec904df066f80b2da5974f7679fe2c227
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/editorial/10262) — source-abc359-editorial-10262-ea2d05f58e64259f16d8f79a4e1d1735011cd9cc6ff98609133b62b2895323f5
