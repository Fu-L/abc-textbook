---
title: "ABC324-G — Generate Arrays"
draft: true
authoringUnit: {"problemId":"abc324-g","docPath":"src/content/docs/problems/hybrid/outcome-merge-small-into-large/outcome-merge-small-into-large-shard-001/abc324-g.md","learningOutcomeIds":["outcome-merge-small-into-large"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset"],"excludedTopics":["small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-small-to-large","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc324-editorial-7399-ab02b564dea5abbc9ea0b59039ac96169d94dc9751a2bfc5aa105c089979319a","source-abc324-g-problem-a2a995abf08034c8681a217ff49c1a74625a353740871446c9b75fd426e15ea7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"type 1ではprefix長min(x,L)とsuffix長L-min(x,L)が既知で、短い方をposition setの端から列挙できる。 type 2ではvalue x以下とx超のsizeをorder-statisticまたは中央値管理で判定し、短い方をvalue setの端から列挙できる。 短い側が元sequence sに残る場合はcontainer handleを交換し、既存の大containerを新sequence iへ割り当てることで、仕様上のIDを保ったまま移動量を小さくする。 各elementの移動回数を逆向きmergeの倍増論法でlog N回に抑え、両種類のsplitを同じ枠組みで処理できる。","sourceRevisionIds":["source-abc324-editorial-7399-ab02b564dea5abbc9ea0b59039ac96169d94dc9751a2bfc5aa105c089979319a","source-abc324-g-problem-a2a995abf08034c8681a217ff49c1a74625a353740871446c9b75fd426e15ea7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

全sequenceは元permutation Aの部分列なので、各elementは一意な(original position,value)を持ち、sequence内順序はoriginal position順のままである。

各splitで2つに分かれるうち短い側だけのelementを別containerへ移し、長い側には既存containerを割り当てれば、1 queryの移動数をmin(両length)にできる。

position splitとvalue splitの両方を扱うには、各sequenceで(position,value)をposition順とvalue順の2つのbalanced setに同期保持すればよい。

採用する候補: sequenceごとにposition順・value順の2 setを持ち、短いresult側だけを移すreverse small-to-large simulation。

各elementの移動回数を逆向きmergeの倍増論法でlog N回に抑え、両種類のsplitを同じ枠組みで処理できる。

棄却する候補: 各operationで新sequenceに属する全elementを常にsourceからコピー・削除する。

毎回大きい側が新sequenceになるcaseを繰り返すと同じ多数要素を何度も走査してNQ規模になる。

棄却する候補: 各sequenceをvectorとして保持し、type 2で全要素をvalue比較する。

value thresholdがposition上で連続とは限らず、長いsequence全scanを避けられない。

type 1ではprefix長min(x,L)とsuffix長L-min(x,L)が既知で、短い方をposition setの端から列挙できる。

type 2ではvalue x以下とx超のsizeをorder-statisticまたは中央値管理で判定し、短い方をvalue setの端から列挙できる。

短い側が元sequence sに残る場合はcontainer handleを交換し、既存の大containerを新sequence iへ割り当てることで、仕様上のIDを保ったまま移動量を小さくする。

各sequence handleにposition-ordered setとvalue-ordered setを持ち、element移動時は両方からeraseして相手containerへinsertする。type 1はcut=min(x,length)からprefix/suffixの小さい側をposition端から移す。type 2はvalue rankで≤x側と>x側のsizeを得て、小さい側をvalue端から移す。移動した側・残った側が仕様のs,iへ対応するようhandleを必要ならswapし、新sequence iのsizeを出力する。

## 典型の発動条件

### reverse small-to-large

発動条件: partition操作列で毎回2集合のどちらかを新containerへ分離できるとき。

短い側だけを動かし、逆時間では小集合を大集合へmergeする倍増解析を使う。

### 複数key indexの同期管理

発動条件: 同じ要素集合を位置thresholdと値thresholdの両方で分割するとき。

position setとvalue setを同時更新する。

### container handle swap

発動条件: logical IDが要求する側と、物理的に残したい大container側が逆になるとき。

pointer/handleだけ交換し、大量要素の移動を避ける。

## 問題固有の要素

split後も各要素は1つのsequenceにだけ属し、逆順に見ると必ず2集合のmergeになるため、通常のsmall-to-largeを時間反転したamortized解析が成立する。

別の問題へ持ち帰る視点: 分割操作が多い問題では逆時間のmergeとして見て、短いresultだけを物理移動する設計を検討する。

## 正当性

type 1ではprefix長min(x,L)とsuffix長L-min(x,L)が既知で、短い方をposition setの端から列挙できる。 type 2ではvalue x以下とx超のsizeをorder-statisticまたは中央値管理で判定し、短い方をvalue setの端から列挙できる。 短い側が元sequence sに残る場合はcontainer handleを交換し、既存の大containerを新sequence iへ割り当てることで、仕様上のIDを保ったまま移動量を小さくする。 各elementの移動回数を逆向きmergeの倍増論法でlog N回に抑え、両種類のsplitを同じ枠組みで処理できる。

## 実装上の注意

- type 1のx≥lengthはnewが空、x=0はsourceが空になる境界でもhandle割当を正しく行う。
- element移動はposition/value両setへ必ず同じ1要素を反映し、sequence sizeの不整合を防ぐ。
- type 2でvalue xが存在しない場合もupper_bound境界から≤xと>xを正しく分ける。

## 復習の核

- 短い側がsourceに残るcaseでhandle swap後のsequence IDを追い、同じelementがposition/value setの両方で同じcontainerへ所属するか確認する。

## 計算量と制約

### 時間

O(N log²N+Q log N)、各要素は小さい側分割のたび所属sizeが半減し移動O(log N)回。

### 空間

O(N+Q)、二順序setとhandle。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq A _ i\leq N\ (1\leq i\leq N); A _ i\neq A _ j\ (1\leq i\lt j\leq N); 1\leq Q\leq2\times10^5; t _ i=1,2\ (1\leq i\leq Q); 0\leq s _ i\lt i\ (1\leq i\leq Q); 0\leq x _ i\leq N\ (1\leq i\leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc324/editorial/7399) — source-abc324-editorial-7399-ab02b564dea5abbc9ea0b59039ac96169d94dc9751a2bfc5aa105c089979319a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc324/tasks/abc324_g) — source-abc324-g-problem-a2a995abf08034c8681a217ff49c1a74625a353740871446c9b75fd426e15ea7
