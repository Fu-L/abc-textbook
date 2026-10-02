---
title: "ABC329-F — Colored Ball"
draft: true
authoringUnit: {"problemId":"abc329-f","docPath":"src/content/docs/problems/hybrid/outcome-merge-small-into-large/outcome-merge-small-into-large-shard-001/abc329-f.md","learningOutcomeIds":["outcome-merge-small-into-large"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-small-to-large"],"sourceRevisionIds":["source-abc329-editorial-7729-ea6187e9d38477f2f22c6ba9fbced4b85f50530bded67a053ee6c5af570b7d6b","source-abc329-f-problem-3681f3e42c982f349fc3afb43aeb531e6783de03991288d25354a68c5d0ac2c4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"set[a]が大きいときset[a],set[b]自体をswapすれば、その後smallなaをlargeなbへmergeしても、最終的にunionがbox b、空がbox aになる。 小集合サイズs、移動先t≥s、重複数dとする。d≥s/2ならs回の処理をd個の消滅実体へ高々2ずつ課金する。d<s/2ならs-d個の生存実体へ高々2ずつ課金し、その所属サイズはt+s-d>3s/2となる。消滅への課金は一実体一回、生存への課金はサイズの単調増加によりO(log N)回なので、全insert試行はO(N log N)。平衡木setなら一試行O(log N)で全体O(N log²N+Q)。新規実体の再生成がある問題では別途その総数を界す。 queryの向きと物理merge方向をhandle交換で分離し、全insert回数をsmall-to-largeで償却できる。","sourceRevisionIds":["source-abc329-editorial-7729-ea6187e9d38477f2f22c6ba9fbced4b85f50530bded67a053ee6c5af570b7d6b","source-abc329-f-problem-3681f3e42c982f349fc3afb43aeb531e6783de03991288d25354a68c5d0ac2c4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各boxについて必要なのは含まれるcolorの集合で、同colorのballが複数あっても出力への寄与は1である。

query後のbox bはset[a]∪set[b]、box aは空なので、物理containerを交換してから小さいsetを大きいsetへinsertしても論理結果は同じである。

重複を消すsetでは所属サイズの倍増は保証されない。例えば{1,2}と{2,3}のunionはサイズ3である。償却解析では色名でなく各container内の要素実体を数え、重複insertで消える実体にも仕事を課金する。

採用する候補: boxごとにcolor setを持ち、sizeの小さいsetを大きいsetへmergeして必要ならcontainerをswapする。

queryの向きと物理merge方向をhandle交換で分離し、全insert回数をsmall-to-largeで償却できる。

棄却する候補: 常にset[a]の全colorをset[b]へ順にinsertする。

大集合aを小集合bへ繰り返し移すquery列で、同じ多数colorを何度も処理する。

棄却する候補: 各boxにN色のboolean arrayを持ってunionする。

1 queryあたりN走査と全体N^2 memoryが必要になる。

set[a]が大きいときset[a],set[b]自体をswapすれば、その後smallなaをlargeなbへmergeしても、最終的にunionがbox b、空がbox aになる。

小集合サイズs、移動先t≥s、重複数dとする。d≥s/2ならs回の処理をd個の消滅実体へ高々2ずつ課金する。d<s/2ならs-d個の生存実体へ高々2ずつ課金し、その所属サイズはt+s-d>3s/2となる。消滅への課金は一実体一回、生存への課金はサイズの単調増加によりO(log N)回なので、全insert試行はO(N log N)。平衡木setなら一試行O(log N)で全体O(N log²N+Q)。新規実体の再生成がある問題では別途その総数を界す。

初期box iのsetへC_iを1つ入れる。query(a,b)でsize(set[a])>size(set[b])なら2つのset handleをswapする。その後set[a]の全colorをset[b]へinsertし、set[a]をclearする。size(set[b])を出力する。

## 典型の発動条件

### small-to-large merging

発動条件: 集合union queryが続き、片方containerを空にできるとき。

常に小集合の要素を大集合へ移す。

### logical IDとphysical containerのswap

発動条件: 操作結果の格納先IDが固定だが効率的なmerge方向は逆になり得るとき。

container handleをO(1)交換して意味を合わせる。

## 問題固有の要素

「aからbへ移す」という向きはballの論理状態だけの指定で、set objectのidentityには意味がないため、merge前のswapで計算量を最適化できる。

別の問題へ持ち帰る視点: 可変集合問題では外部IDと内部containerをpointerで分離するとsmall-to-largeの向きを自由に選べる。

## 正当性

set[a]が大きいときset[a],set[b]自体をswapすれば、その後smallなaをlargeなbへmergeしても、最終的にunionがbox b、空がbox aになる。 小集合サイズs、移動先t≥s、重複数dとする。d≥s/2ならs回の処理をd個の消滅実体へ高々2ずつ課金する。d<s/2ならs-d個の生存実体へ高々2ずつ課金し、その所属サイズはt+s-d>3s/2となる。消滅への課金は一実体一回、生存への課金はサイズの単調増加によりO(log N)回なので、全insert試行はO(N log N)。平衡木setなら一試行O(log N)で全体O(N log²N+Q)。新規実体の再生成がある問題では別途その総数を界す。 queryの向きと物理merge方向をhandle交換で分離し、全insert回数をsmall-to-largeで償却できる。

## 実装上の注意

- swap後もloop対象が小さい論理set[a]、結果が論理box bのset[b]になる順序を守る。
- merge終了後set[a]を必ず空にし、次queryで古いcolorを残さない。

## 復習の核

- a側が大きいqueryでset objectをswapしてからmergeし、最終的なbox aが空・box bがunionになっているかIDを追う。

## 計算量と制約

### 時間

O(N log²N+Q)、平衡木set。重複が多い移動を消滅へ課金する償却解析。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 200000; 1 \leq C_i \leq N; 1 \leq a, b \leq N; a \neq b; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc329/editorial/7729) — source-abc329-editorial-7729-ea6187e9d38477f2f22c6ba9fbced4b85f50530bded67a053ee6c5af570b7d6b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc329/tasks/abc329_f) — source-abc329-f-problem-3681f3e42c982f349fc3afb43aeb531e6783de03991288d25354a68c5d0ac2c4
