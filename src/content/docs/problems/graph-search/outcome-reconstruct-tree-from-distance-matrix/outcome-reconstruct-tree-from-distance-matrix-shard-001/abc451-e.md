---
title: "ABC451-E — Tree Distance"
draft: true
authoringUnit: {"problemId":"abc451-e","docPath":"src/content/docs/problems/graph-search/outcome-reconstruct-tree-from-distance-matrix/outcome-reconstruct-tree-from-distance-matrix-shard-001/abc451-e.md","learningOutcomeIds":["outcome-reconstruct-tree-from-distance-matrix"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-tree-metric"],"excludedTopics":["加法的tree metric復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-additive-tree-metric-reconstruction"],"sourceRevisionIds":["source-abc451-e-problem-486faf52b69d92d668c8a94037cf4238e216a473304d2419ed11e05cbaf873c7","source-abc451-editorial-18053-511e274e4d8a71aa2362be37507a426841ec0b50030f23fe407b2e86badbfa53"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"正辺木ではroot1からiへのpath上jだけがA1j+Aji=A1iを満たす真祖先。最短ji候補が直前祖先で一意なので真metricなら元treeを復元できる。構成後全pair照合が非metric入力の誤受理を防ぐ。","sourceRevisionIds":["source-abc451-e-problem-486faf52b69d92d668c8a94037cf4238e216a473304d2419ed11e05cbaf873c7","source-abc451-editorial-18053-511e274e4d8a71aa2362be37507a426841ec0b50030f23fe407b2e86badbfa53"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reconstruct-tree-from-distance-matrix"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"距離 A12=2,A23=3,A13=5。","procedure":["root1から2の親1、3は祖先2を選ぶ。","辺1–2重み2、2–3重み3。","全pair距離2,3,5と一致。"],"executionTarget":null,"expectedResult":"Yes","verificationStatus":"not_applicable","learningUnitIds":["unit-additive-tree-metric-reconstruction"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reconstruct-tree-from-distance-matrix"],"prerequisiteIds":["unit-tree-metric"],"attainmentCondition":"局所親条件だけで全入力を信頼できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。別枝間距離の矛盾を見逃す。構成treeの全pair距離照合が必要。"},"answer":{"reasoningOrVerification":"不可。別枝間距離の矛盾を見逃す。構成treeの全pair距離照合が必要。","procedure":["具体例の各状態・寄与を再計算する。","不可。別枝間距離の矛盾を見逃す。構成treeの全pair距離照合が必要。"],"expectedResult":"不可。別枝間距離の矛盾を見逃す。構成treeの全pair距離照合が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

正辺重みの木 metric が存在するなら、頂点1を根とした i の祖先 j は A_{1,j}+A_{j,i}=A_{1,i} を満たし、そのうち i に最も近いものが親である。 j が root-to-i path 上なら距離加法 A_{1,j}+A_{j,i}=A_{1,i} が成立し、木では逆も成立する。 候補親を全頂点で選んだ後に N-1 辺の木として得た距離が A と完全一致すれば、それが存在証明そのものになる。

採用する候補: 各 i≠1 について祖先条件を満たす j の中から A_{i,j} 最小を親候補にして重み A_{i,j} の辺を張り、完成候補木の全点対距離を再計算して入力行列と照合する。

木 path 上の加法性が祖先を必要十分に特徴付け、正重みにより最も近い真祖先が一意な親になる。最後の全距離検証が局所構成で見落とす全 metric 公理を保証する。

棄却する候補: 三角不等式など距離行列の局所条件だけを検査し、木を構築せず Yes と判定する。

一般 metric 条件だけでは tree metric の十分条件にならず、同じ局所等式を満たしても全体 path 構造が矛盾し得る。

j が root-to-i path 上なら距離加法 A_{1,j}+A_{j,i}=A_{1,i} が成立し、木では逆も成立する。

候補親を全頂点で選んだ後に N-1 辺の木として得た距離が A と完全一致すれば、それが存在証明そのものになる。

対称化した A を使い、各 i の祖先候補を O(N) 走査して最短の j を選ぶ。候補なしなら No。辺を構築後、各始点から tree DFS で距離を求め、全 A_{i,j} と一致した場合だけ Yes と辺集合を出力する。

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

正辺木ではroot1からiへのpath上jだけがA1j+Aji=A1iを満たす真祖先。最短ji候補が直前祖先で一意なので真metricなら元treeを復元できる。構成後全pair照合が非metric入力の誤受理を防ぐ。

## 実装上の注意

- 対角0・対称性・正辺を全距離再計算で検出し、親候補 tie も最終検証へ任せる場合は cycle/連結性を安全に確認する。

## 復習の核

- 祖先等式の必要十分性と「最も近い祖先=親」を tree path で証明し、構成後検証が反例を全て排除する理由を確認する。

## 計算量と制約

### 時間

距離行列N²。各点親候補O(N²)、全始点木DFS O(N²)。

### 空間

入力距離O(N²)、候補木O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 3000; 1 \le A_{i,j} \le 9999; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

距離 A12=2,A23=3,A13=5。

1. root1から2の親1、3は祖先2を選ぶ。
2. 辺1–2重み2、2–3重み3。
3. 全pair距離2,3,5と一致。

期待される結果: Yes

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

局所親条件だけで全入力を信頼できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。別枝間距離の矛盾を見逃す。構成treeの全pair距離照合が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/tasks/abc451_e) — source-abc451-e-problem-486faf52b69d92d668c8a94037cf4238e216a473304d2419ed11e05cbaf873c7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/editorial/18053) — source-abc451-editorial-18053-511e274e4d8a71aa2362be37507a426841ec0b50030f23fe407b2e86badbfa53
