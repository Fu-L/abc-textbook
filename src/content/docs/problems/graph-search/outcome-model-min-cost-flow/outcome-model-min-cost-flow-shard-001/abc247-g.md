---
title: "ABC247-G — Dream Team"
draft: true
authoringUnit: {"problemId":"abc247-g","docPath":"src/content/docs/problems/graph-search/outcome-model-min-cost-flow/outcome-model-min-cost-flow-shard-001/abc247-g.md","learningOutcomeIds":["outcome-model-min-cost-flow"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-min-cost-flow"],"sourceRevisionIds":["source-abc247-editorial-3729-d7de442ae3dd43ece4043120c05ae811a331d91ecdc233e51e30718c40e10dbd","source-abc247-g-problem-97ce63edb2c318a18b4ac80ee8763a28ae0868ff43b08fa9551a8ec5ec9ea7d3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"人を大学–分野辺とすると二側容量1が双方重複禁止を表す。flow量kの費用はkBIG−power総和なので同kで費用最小はpower最大。残余逆辺が以前のmatchingを組み替えられるため逐次augmentで各kの最適を得る。","sourceRevisionIds":["source-abc247-editorial-3729-d7de442ae3dd43ece4043120c05ae811a331d91ecdc233e51e30718c40e10dbd","source-abc247-g-problem-97ce63edb2c318a18b4ac80ee8763a28ae0868ff43b08fa9551a8ec5ec9ea7d3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)

- 流量と費用を持つ残余networkを設計し、potential付き最短路・slope・cycle cancelingで流量別最小費用を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 最小費用流・circulationの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

大学を左頂点、得意分野を右頂点、人をその間の重み付き辺とすると、dream team は端点を共有しない辺集合、すなわち二部 matching である。 必要なのは最大 cardinality だけでなく、サイズ i ごとの最大重みなので、1 unit ずつ flow を増やした各段階の最適費用を記録する必要がある。 source→大学と分野→sink の容量を 1 にすると、同じ大学・同じ分野を 2 人選べない条件が flow の容量制約そのものになる。 人辺を cost=BIG-C_i とすれば、固定 flow 量 i では定数 i×BIG が共通なので、費用最小化と power 和最大化が同値になる。

採用する候補: 大学・分野の二部 flow network を作り、人の power を BIG-C_i の費用へ変換して、min-cost flow を 1 unit ずつ流す。

flow 量 i の最小費用が i×BIG から最大 power 和を引いた値になり、全 i の最適値を successive augmentation で得られる。

棄却する候補: power の大きい人から、未使用の大学・分野なら貪欲に採用する。

高 power の 1 辺が 2 本の組合せを塞ぐ場合があり、各サイズの最大重み matching を保証しない。

source→大学と分野→sink の容量を 1 にすると、同じ大学・同じ分野を 2 人選べない条件が flow の容量制約そのものになる。

人辺を cost=BIG-C_i とすれば、固定 flow 量 i では定数 i×BIG が共通なので、費用最小化と power 和最大化が同値になる。

S→各大学、各分野→T に容量 1・費用 0、人ごとに大学→分野へ容量 1・費用 BIG-C_i の辺を張る。増加路がなくなるまで 1 flow ずつ min-cost flow を進め、累積費用 cost_i から i×BIG-cost_i を順に出力する。

## 典型の発動条件

### 二部 matching の flow 表現

発動条件: 2 種類の属性がそれぞれ重複禁止で、要素が属性対を結ぶとき。

大学と分野を二部頂点にし、各人を容量 1 の辺として選択を表す。

### 重み付き matching の min-cost flow

発動条件: matching size ごとの最大重みをすべて求めたいとき。

重みを BIG-C に反転し、unit augmentation ごとの累積最小費用を記録する。

## 問題固有の要素

dream team の 2 種類の重複禁止条件は二部 matching であり、BIG による費用反転で同じ flow run から全 team size の最大 power を得られる。

別の問題へ持ち帰る視点: 固定個数ごとの最大価値が必要なら、cardinality を flow 量にし、1 unit ごとの最適費用列を利用する。

## 正当性

人を大学–分野辺とすると二側容量1が双方重複禁止を表す。flow量kの費用はkBIG−power総和なので同kで費用最小はpower最大。残余逆辺が以前のmatchingを組み替えられるため逐次augmentで各kの最適を得る。

## 実装上の注意

- BIG は全 C_i より大きくして人辺費用を非負にし、power 和・累積費用は 64 bit で保持する。
- 同じ (A_i,B_i) の人が複数いても平行辺として扱える。圧縮するなら最大 C_i 以外が最適解に不要であることを明示する。

## 復習の核

- 最高 power の 1 人を選ぶと最適な 2 人組を塞ぐ反例を作り、各 flow 量で残余辺を含む再最適化が必要な理由を確認する。

## 計算量と制約

### 時間

大学U、分野F、人N、最大matching数K。V=U+F+2,E=O(U+F+N)。potential付きsuccessive shortest pathなら O(K E log V)。

### 空間

残余network O(E+V)、全K回答O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3\times 10^4; 1 \leq A_i,B_i \leq 150; 1 \leq C_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/editorial/3729) — source-abc247-editorial-3729-d7de442ae3dd43ece4043120c05ae811a331d91ecdc233e51e30718c40e10dbd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/tasks/abc247_g) — source-abc247-g-problem-97ce63edb2c318a18b4ac80ee8763a28ae0868ff43b08fa9551a8ec5ec9ea7d3
