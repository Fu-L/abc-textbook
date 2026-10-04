---
title: "ABC408-E — Minimum OR Path"
draft: true
authoringUnit: {"problemId":"abc408-e","docPath":"src/content/docs/problems/hybrid/outcome-optimize-mask-by-bitwise-feasibility/outcome-optimize-mask-by-bitwise-feasibility-shard-001/abc408-e.md","learningOutcomeIds":["outcome-optimize-mask-by-bitwise-feasibility"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange"],"excludedTopics":["bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bitwise-greedy-feasibility","tag-dsu-components","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc408-e-problem-e774814460ea12d306f48f206f13754908f23756db98f6c49a2ff4c6c7a65dc4","source-abc408-editorial-13159-2968fa014b41358592ba76d3443d3b647cb6d15d7a38b7853c252eec434eea62"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"simple path 条件は connectivity 判定を妨げない。許可辺で walk があれば cycle を除いて simple path にでき、その OR は増えない。 ある候補 x が可能なら x に bit を足した mask も同じ経路を許すので、lexicographic な bit 最小化と同様に高位から貪欲決定できる。 各判定は edge label が候補 mask の submask かを調べて DSU で結ぶだけで、全体 O(30(N+M)α(N)) になる。","sourceRevisionIds":["source-abc408-e-problem-e774814460ea12d306f48f206f13754908f23756db98f6c49a2ff4c6c7a65dc4","source-abc408-editorial-13159-2968fa014b41358592ba76d3443d3b647cb6d15d7a38b7853c252eec434eea62"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [bitwise greedyによるmask最適化](src/content/docs/learn/modeling/bitwise-greedy-feasibility.md)

- 上位bitから候補maskを仮定し、残り問題のfeasibility oracleでそのbitを保持/除去できるか決める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- bitwise greedyによるmask最適化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

mask x に含まれる bit だけをもつ辺、すなわち w OR x=x の辺だけで 1 から N へ到達できれば、その経路の OR も x の submask である。

到達可能な mask の集合は bit を追加する方向に単調であるため、上位 bit から 0 にできるか試すことで数値として最小の mask を確定できる。

採用する候補: 全30 bitを立てた mask から上位 bit を順に仮消去し、許可辺だけの DSU connectivity が保たれるなら消去を確定する

棄却する候補: 各頂点に数値として最小の OR 値を一つだけ持つ Dijkstra 風緩和

数値が小さい mask が bit 集合として別 mask の subset とは限らず、途中の最小値一つが将来の辺との OR に対して常に優越するとは限らない。

ans=(1<<30)-1 とする。b=29..0 について cand=ans without bit b を作り、(w_i|cand)==cand の辺だけで DSU を再構築する。1,N が連結なら ans=cand とし、最後の ans を出力する。

## 典型の発動条件

### bit ごとの貪欲最小化

発動条件: 実行可能 mask が bit 追加に対して上向き閉集合で、数値最小を求めるとき。

最上位から各 bit を外した候補の実行可能性を判定する。

### submask 制約の connectivity

発動条件: path 上の全 edge label の OR を指定 mask 以下に抑えたいとき。

label の立っている bit が mask にすべて含まれる辺だけ残して連結性を見る。

### DSU

発動条件: 同じ edge filter で無向グラフの二点連結性だけ判定したいとき。

候補 mask ごとに初期化し、許可辺の端点を union する。

## 問題固有の要素

OR の値を path cost として直接比較せず、「この bit 集合だけで通れるか」という decision problem にすると単調性が現れる。

別の問題へ持ち帰る視点: bitwise 集約量の最小化では、候補 mask が許可する要素集合を作り、実行可能性 oracle と上位 bit 貪欲を組み合わせる。

## 正当性

simple path 条件は connectivity 判定を妨げない。許可辺で walk があれば cycle を除いて simple path にでき、その OR は増えない。 ある候補 x が可能なら x に bit を足した mask も同じ経路を許すので、lexicographic な bit 最小化と同様に高位から貪欲決定できる。 各判定は edge label が候補 mask の submask かを調べて DSU で結ぶだけで、全体 O(30(N+M)α(N)) になる。

## 実装上の注意

- label は bit 0..29 だけなので初期 mask を正確に 2^30-1 とする。各 bit 判定で DSU を初期化し直し、禁止 bit を一つでも含む辺を混ぜない。

## 復習の核

- 重み0だけの path、低位bitの少ない値と高位bitのある値が競合する path、bridge に特定bitが必要な例を全 simple path 列挙と比較する。

## 計算量と制約

### 時間

O(B(N+M)α(N))、B=30、各bit候補をDSUで判定。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le 2\times 10^5; N-1\le M\le 2\times 10^5; 1\le u_i < v_i\le N; 0\le w_i< 2^{30}; The given graph is connected.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/tasks/abc408_e) — source-abc408-e-problem-e774814460ea12d306f48f206f13754908f23756db98f6c49a2ff4c6c7a65dc4
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/editorial/13159) — source-abc408-editorial-13159-2968fa014b41358592ba76d3443d3b647cb6d15d7a38b7853c252eec434eea62
