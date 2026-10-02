---
title: "ABC352-E — Clique Connect"
draft: true
authoringUnit: {"problemId":"abc352-e","docPath":"src/content/docs/problems/graph-search/outcome-construct-optimal-spanning-tree/outcome-construct-optimal-spanning-tree-shard-001/abc352-e.md","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-greedy-exchange"],"excludedTopics":["任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。"],"tagIds":["tag-spanning-tree-optimization","tag-dsu-components"],"sourceRevisionIds":["source-abc352-e-problem-63943885010ffcd58b64e6a5cbc8fba4ab2fee9afa4bf3221604b5ff1f7fe224","source-abc352-editorial-9920-a69cbec2e0e236e4ccd2a0125cc276621b0f9657d4e46f481f41da5f25d73630"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同cost cliqueを同cost starへ変えても各閾値の連結成分が同じ。MSTのKruskal選択数は各重み閾値の連結性で決まるため最小costも不変。生成starのMSTを得れば元cliqueでも同cost接続を実現できる。","sourceRevisionIds":["source-abc352-e-problem-63943885010ffcd58b64e6a5cbc8fba4ab2fee9afa4bf3221604b5ff1f7fe224","source-abc352-editorial-9920-a69cbec2e0e236e4ccd2a0125cc276621b0f9657d4e46f481f41da5f25d73630"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、一操作A={1,2,3},C=4。","procedure":["clique三辺を1–2,1–3のstarへ。","二辺で全連結。","各4を足す。"],"executionTarget":null,"expectedResult":"8","verificationStatus":"not_applicable","learningUnitIds":["unit-spanning-tree-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-construct-optimal-spanning-tree"],"prerequisiteIds":["unit-dsu-components","unit-greedy-exchange"],"attainmentCondition":"starの基点は最小番号必須か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不要。集合内の任意一頂点なら同閾値連結性を再現できる。"},"answer":{"reasoningOrVerification":"不要。集合内の任意一頂点なら同閾値連結性を再現できる。","procedure":["具体例の各状態・寄与を再計算する。","不要。集合内の任意一頂点なら同閾値連結性を再現できる。"],"expectedResult":"不要。集合内の任意一頂点なら同閾値連結性を再現できる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [cut・cycle性質から最適全域木を構成する](src/content/docs/learn/graph/spanning-tree-optimization.md)

- cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 任意の全域木を一つ構成するだけの探索、および辺重みを最適化しない連結成分管理。

## 考察

集合 K_i 内へ重み C_i の clique を張ると辺数は二乗になるが、同じ重みの clique 内では一頂点を中心とする K_i−1 本だけで全頂点を同重み以下で連結できる。 Kruskal 法では、ある辺の両端がその辺以下の重みの別 path で既に結ばれるなら、その辺を候補から除いても MST 重みは変わらない。 star path は二辺かかっても MST の目的は辺数でなく重み総和であり、cycle property により同重み clique 辺を削除できる。 全候補処理後に DSU component が一つでなければ、元の全 clique graph でも連結不能なので −1 である。

採用する候補: 各 clique を任意の代表と他頂点を結ぶ star K_i−1 辺へ縮約し、全 star 辺へ Kruskal 法を適用する。

削除した clique 辺は同じ重みの star path で代替でき、候補辺総数が ΣK_i に落ちる。

棄却する候補: 各集合内の全頂点対に辺を生成して通常の Kruskal 法を行う。

一集合 K_i=N のとき Θ(N²) 辺となり、ΣK_i≤4×10^5 という入力サイズ保証を活かせない。

star path は二辺かかっても MST の目的は辺数でなく重み総和であり、cycle property により同重み clique 辺を削除できる。

全候補処理後に DSU component が一つでなければ、元の全 clique graph でも連結不能なので −1 である。

各操作 i について A_{i,1} と A_{i,j}(j≥2) の辺 (C_i) だけを生成する。重み昇順に sort し、DSU で異 component を結ぶ辺の重みを加算する。採用辺が N−1 本なら総和、そうでなければ −1 を出す。

## 典型の発動条件

### 密な同重み clique の sparse certificate

発動条件: 暗黙に追加される完全グラフの全辺が同じ重みで、連結性だけが重要なとき。

任意 spanning tree だけ残し、同重み path を代替証明にする。

### Kruskal 法と cycle property

発動条件: 辺候補を安全に削減して MST を求めたいとき。

辺以下の重みで端点を結ぶ別 path がある辺を除外する。

## 問題固有の要素

clique の完全な隣接情報は不要で、MST に必要な「同コストで集合内を連結できる証明書」は star で十分である。

別の問題へ持ち帰る視点: 暗黙 dense graph では、目的関数が保持される sparse certificate をまず探す。

## 正当性

同cost cliqueを同cost starへ変えても各閾値の連結成分が同じ。MSTのKruskal選択数は各重み閾値の連結性で決まるため最小costも不変。生成starのMSTを得れば元cliqueでも同cost接続を実現できる。

## 実装上の注意

- star の中心は集合内ならどれでもよく、同重み辺の sort 順は任意。総重みは最大10^9(N−1)なので 64 bit を使う。

## 復習の核

- 「二辺の代替だから高くなる」と誤解せず、Kruskal の時点で同重み連結になっていることを考える。縮約後の連結性も確認する。

## 計算量と制約

### 時間

N頂点、操作M、所属総数L=ΣK_i。生成辺O(L)、Kruskal O(L log L+Lα(N))。

### 空間

star辺とDSU O(N+L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M \leq 2 \times 10^5; 2 \leq K_i \leq N; \sum_{i=1}^{M} K_i \leq 4 \times 10^5; 1 \leq A_{i,1} < A_{i,2} < \dots < A_{i,K_i} \leq N; 1 \leq C_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、一操作A={1,2,3},C=4。

1. clique三辺を1–2,1–3のstarへ。
2. 二辺で全連結。
3. 各4を足す。

期待される結果: 8

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

starの基点は最小番号必須か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不要。集合内の任意一頂点なら同閾値連結性を再現できる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc352/tasks/abc352_e) — source-abc352-e-problem-63943885010ffcd58b64e6a5cbc8fba4ab2fee9afa4bf3221604b5ff1f7fe224
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc352/editorial/9920) — source-abc352-editorial-9920-a69cbec2e0e236e4ccd2a0125cc276621b0f9657d4e46f481f41da5f25d73630
