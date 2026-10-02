---
title: "ABC222-F — Expensive Expense"
draft: true
authoringUnit: {"problemId":"abc222-f","docPath":"src/content/docs/problems/graph-search/outcome-use-tree-diameter-extrema/outcome-use-tree-diameter-extrema-shard-001/abc222-f.md","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-metric-diameter"],"sourceRevisionIds":["source-abc222-editorial-2749-cb72f04445c42ee4f95179943cc79215b014c3a378e4fca01c003957191f0cd8","source-abc222-f-problem-560ed9c13e262423a180bde639aa3b84fce0a06e3f0a65a156d92c00b25dac80"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"jへ長さD_jの葉を付けるとd(i,j)+D_jが拡張tree距離になる。任意iの最遠は直径両端に代表される。j=i除外に当たる端葉はもう一方の端を使う公式補正で排除し、その他は二距離maxが要求値を与える。","sourceRevisionIds":["source-abc222-editorial-2749-cb72f04445c42ee4f95179943cc79215b014c3a378e4fca01c003957191f0cd8","source-abc222-f-problem-560ed9c13e262423a180bde639aa3b84fce0a06e3f0a65a156d92c00b25dac80"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

各始点 i で求める値は、木上距離 d(i,j) に行先だけの加点 D_j を足した最大値であり、N=2×10^5 なので始点ごとに全行先を探索する余裕はない。 頂点加点 D_j を長さ D_j の垂れ下がり辺へ移すと、異なる種類だった『距離』と『行先加点』が一つの木上距離になる。 直径端の補助葉の親を始点にした場合は j=i を選べないため、その端自身ではなく反対側の直径端までの距離を使う。

採用する候補: 各頂点 j に重み D_j の補助辺と葉 j' を付け、拡張木の直径の両端への距離から全頂点の最大値を求める。

d(i,j)+D_j が拡張木での d(i,j') そのものになり、木の任意の頂点からの最遠点を直径の二端点だけで代表できる。

棄却する候補: 子方向と親方向の最大寄与を合成する全方位木DPを構成する。

この方法も正しいが、最大化対象を補助葉へ移すと二つの直径端点だけで済み、今回はより状態の少ない直径解法を採用できる。

頂点加点 D_j を長さ D_j の垂れ下がり辺へ移すと、異なる種類だった『距離』と『行先加点』が一つの木上距離になる。

直径端の補助葉の親を始点にした場合は j=i を選べないため、その端自身ではなく反対側の直径端までの距離を使う。

補助葉を含む重み付き木で直径端 s',t' を求め、両端から全頂点への距離を計算し、端の親に対する除外だけ補正して二距離の最大を答える。

## 典型の発動条件

### 頂点重みの補助葉への変換

発動条件: 目的関数が距離に行先頂点だけの重みを加えた形で、全始点について最大値を求めるとき。

各行先へ重み付き補助辺を付け、頂点重み込みの評価を通常の木上距離へ統一する。

### 木の直径端による全頂点最遠距離

発動条件: 木で全頂点からの最遠距離を求められ、評価対象を通常の頂点へ表現できたとき。

直径の両端から距離配列を作り、各頂点の最遠距離をその二値の最大として得る。

## 問題固有の要素

観光費 D_j を頂点に置いたまま扱わず、j の外側に葉を生やすと、行先加点付き距離が木の直径問題へ変わる。

別の問題へ持ち帰る視点: 距離に片端だけの加点が付くときは、その加点を辺長として持つ補助頂点を追加できないか試す。

## 正当性

jへ長さD_jの葉を付けるとd(i,j)+D_jが拡張tree距離になる。任意iの最遠は直径両端に代表される。j=i除外に当たる端葉はもう一方の端を使う公式補正で排除し、その他は二距離maxが要求値を与える。

## 実装上の注意

- 距離と答えは64 bit整数で保持し、直径端が補助葉であることと、始点自身の補助葉を候補から除く二つの例外を混同しない。

## 復習の核

- 『距離＋行先だけの報酬』を見たら、報酬を垂れ下がり辺へ移して通常の距離にできるかを最初に検討する。

## 計算量と制約

### 時間

元N頂点、補助葉N個。拡張tree直径と二距離 O(N)。

### 空間

拡張treeと二距離 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq N (1 \leq i \leq N-1); 1 \leq B_i \leq N (1 \leq i \leq N-1); 1 \leq C_i \leq 10^9 (1 \leq i \leq N-1); 1 \leq D_i \leq 10^9 (1 \leq i \leq N); It is possible to travel from Town i to Town j via some number of roads, for a pair of integers (i,j) such that 1 \leq i \lt j \leq N.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/editorial/2749) — source-abc222-editorial-2749-cb72f04445c42ee4f95179943cc79215b014c3a378e4fca01c003957191f0cd8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/tasks/abc222_f) — source-abc222-f-problem-560ed9c13e262423a180bde639aa3b84fce0a06e3f0a65a156d92c00b25dac80
