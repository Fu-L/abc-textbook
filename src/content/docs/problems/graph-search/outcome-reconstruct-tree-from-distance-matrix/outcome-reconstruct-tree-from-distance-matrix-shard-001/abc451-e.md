---
title: "ABC451-E — Tree Distance"
draft: true
authoringUnit: {"problemId":"abc451-e","docPath":"src/content/docs/problems/graph-search/outcome-reconstruct-tree-from-distance-matrix/outcome-reconstruct-tree-from-distance-matrix-shard-001/abc451-e.md","learningOutcomeIds":["outcome-reconstruct-tree-from-distance-matrix"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-tree-metric"],"excludedTopics":["加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-additive-tree-metric-reconstruction"],"sourceRevisionIds":["source-abc451-e-problem-486faf52b69d92d668c8a94037cf4238e216a473304d2419ed11e05cbaf873c7","source-abc451-editorial-18053-511e274e4d8a71aa2362be37507a426841ec0b50030f23fe407b2e86badbfa53"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"有効な正辺木ではrootからiへのpath上の真祖先だけが距離加法等式を満たし、iを除いた最も近い祖先は直前の親である。よって存在する木なら手順はその親辺を復元する。逆に構成候補の全点対距離が入力と一致すれば、その候補木自体が入力を実現するため、Yes判定も十分である。","sourceRevisionIds":["source-abc451-e-problem-486faf52b69d92d668c8a94037cf4238e216a473304d2419ed11e05cbaf873c7","source-abc451-editorial-18053-511e274e4d8a71aa2362be37507a426841ec0b50030f23fe407b2e86badbfa53"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [加法的tree metric復元](src/content/docs/learn/tree/additive-tree-metric-reconstruction.md)

- 加法的距離行列から正重み木の候補を復元し、全点対距離の再計算で存在を完全検証できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

対象外:

- 加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

根を頂点1に固定する。正辺重みの木でiの真の祖先jならA_{1,j}+A_{j,i}=A_{1,i}である。逆にこの等式を満たす頂点はrootからiへのpath上にあり、i自身も等式を満たすので候補から必ず除外する。残る真祖先のうちA_{j,i}が最小の頂点が親である。

各i≠1についてその親と重みA_{j,i}の辺を内部で構成し、全頂点対の木距離をAと照合する。全て一致すればYes、一つでも違えばNo。出力はYes/Noのみなので、構成した辺は判定の検証に使い外へ出さない。

## 典型の発動条件

### 距離行列からの木復元

発動条件: 正重み木の全点対距離が与えられ、存在判定と構成を行うとき。

root 距離の加法等式から祖先・親を特定する。

### 候補構成後の完全検証

発動条件: 局所条件で唯一候補を作れるが十分性の直接判定が複雑なとき。

候補 object の定義量を再計算して入力と全一致させる。

## 問題固有の要素

存在するなら一意に決まる構造では、必要条件で候補を強制構成し、最後に直接検証する方が判定条件を簡潔にできる。

別の問題へ持ち帰る視点: 木距離の equality は path 上包含を表し、root を選ぶことで親子関係へ順序化できる。

## 正当性

有効な正辺木ではrootからiへのpath上の真祖先だけが距離加法等式を満たし、iを除いた最も近い祖先は直前の親である。よって存在する木なら手順はその親辺を復元する。逆に構成候補の全点対距離が入力と一致すれば、その候補木自体が入力を実現するため、Yes判定も十分である。

## 実装上の注意

- 親候補はj≠iに制限し、A_{j,i}が最小の真祖先を選ぶ。候補木の距離を全点対で検証する。
- 問題の出力はYes/Noだけであり、復元辺を出力しない。

## 復習の核

- 祖先等式の必要十分性と「最も近い祖先=親」を tree path で証明し、構成後検証が反例を全て排除する理由を確認する。

## 計算量と制約

### 時間

距離行列N²。各点親候補O(N²)、全始点木DFS O(N²)。

### 空間

入力距離O(N²)、候補木O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 3000; 1 \le A_{i,j} \le 9999; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/tasks/abc451_e) — source-abc451-e-problem-486faf52b69d92d668c8a94037cf4238e216a473304d2419ed11e05cbaf873c7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/editorial/18053) — source-abc451-editorial-18053-511e274e4d8a71aa2362be37507a426841ec0b50030f23fe407b2e86badbfa53
