---
title: "ABC396-E — Min of Restricted Sum"
draft: true
authoringUnit: {"problemId":"abc396-e","docPath":"src/content/docs/problems/graph-search/outcome-propagate-static-graph-potentials/outcome-propagate-static-graph-potentials-shard-001/abc396-e.md","learningOutcomeIds":["outcome-propagate-static-graph-potentials"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-state-graph-search"],"excludedTopics":["静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-graph-potential-propagation","tag-constructive-witness"],"sourceRevisionIds":["source-abc396-e-problem-c31b2e0500585e6c964e0c4d69feb8d69b79c20268e0b70f888a608f5050f5be","source-abc396-editorial-12390-71791dcbbee89dd3c8461b74eb40ed29a5b6449cb7af08322d917ad0443365bc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同成分の全解はA_v=p_v xor tで、辺xorは共通tで打ち消される。矛盾potentialは解なし。bitごとt反転は成分全bitを反転しone数をsize−onesへ替えるので少数側を選ぶのが総和最小。bit寄与は独立に加算できる。","sourceRevisionIds":["source-abc396-e-problem-c31b2e0500585e6c964e0c4d69feb8d69b79c20268e0b70f888a608f5050f5be","source-abc396-editorial-12390-71791dcbbee89dd3c8461b74eb40ed29a5b6449cb7af08322d917ad0443365bc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [静的graph等式制約のpotential伝播](src/content/docs/learn/graph/graph-potential-propagation.md)

- 辺等式をDFS/BFSでroot-relative potentialへ伝播し、cycle矛盾を検出して各連結成分の全解を自由offset一つで表現・復元できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 静的graph等式制約のpotential伝播の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

constraint A_x xor A_y=zはbitごとに独立で、連結成分内では一頂点の値を決めるとpath上のxorにより全頂点値が決まる。 rootを0と仮定したpotential p_vをDFSで付けると、任意解はcomponent共通mask tに対してA_v=p_v xor tとなる。 既訪問vertexへ別pathから到達したとき、既存p_vとp_u xor zが異なればcycle xorが非零で解なしである。 Z≤10^9なので必要bit範囲を覆えばよく、各bitの選択を組み合わせたmask tで全値を同時に構成できる。

採用する候補: xor potentialで整合性を検査し、各component・各bitで1の個数が少ないroot bitを選ぶ

bit bでt_bを反転するとcomponent全頂点のbitが反転するため、onesとsize-onesの小さい方を独立に選べばΣA_iを最小化できる。

棄却する候補: A_iを整数としてcomponentごとにgreedy決定する

整数大小の局所選択はxor constraintを伝播し、各bitの独立な全体最適化を表せない。

既訪問vertexへ別pathから到達したとき、既存p_vとp_u xor zが異なればcycle xorが非零で解なしである。

Z≤10^9なので必要bit範囲を覆えばよく、各bitの選択を組み合わせたmask tで全値を同時に構成できる。

各未訪問rootをp=0としてDFS/BFSし、edge(u,v,z)でp_v=p_u xor zを割り当て矛盾検査する。componentごとに各bitのonesを数え、ones>size-onesならtのbitを1にし、A_v=p_v xor tを出す。

## 典型の発動条件

### xor potential graph

発動条件: 辺が二頂点値のxor差を指定するとき。

rootからpath xorをpotentialとして伝播しcycle整合性を判定する。

### bitwise independent minimization

発動条件: 制約と目的がbitごとの重み付き和へ分離できるとき。

component共通flipをbitごとに多数決の少数側へ選ぶ。

## 問題固有の要素

自由度は頂点ごとでなく各connected componentの共通xor mask一つだけで、その各bitを独立に選べる。

別の問題へ持ち帰る視点: 群差constraintではroot potential＋component共通shiftとして一般解を表し、残る自由度だけ最適化する。

## 正当性

同成分の全解はA_v=p_v xor tで、辺xorは共通tで打ち消される。矛盾potentialは解なし。bitごとt反転は成分全bitを反転しone数をsize−onesへ替えるので少数側を選ぶのが総和最小。bit寄与は独立に加算できる。

## 実装上の注意

- self-edgeやparallel constraintでも既訪問整合性を検査する。0..30程度の全bitを含め、isolated vertexは全0が最小。

## 復習の核

- 小componentでroot maskを全探索し、非零cycle xor、tie bit、isolated vertexを比較して最小sumを確認する。

## 計算量と制約

### 時間

N頂点M xor制約、最大bit数B。potential探索O(N+M)、各成分bit最小化O(NB)。

### 空間

隣接、potential、回答 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2\times 10^5; 0 \le M \le 10^5; 1 \le X_i, Y_i \le N; 0 \le Z_i \le 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc396/tasks/abc396_e) — source-abc396-e-problem-c31b2e0500585e6c964e0c4d69feb8d69b79c20268e0b70f888a608f5050f5be
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc396/editorial/12390) — source-abc396-editorial-12390-71791dcbbee89dd3c8461b74eb40ed29a5b6449cb7af08322d917ad0443365bc
