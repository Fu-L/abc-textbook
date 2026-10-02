---
title: "ABC305-E — Art Gallery on Graph"
draft: true
authoringUnit: {"problemId":"abc305-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc305-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first","tag-shortest-path"],"sourceRevisionIds":["source-abc305-e-problem-03168a468ff5b7f12311033f32db62599adf5a0287f95d9a4b4270b9c3701d8f","source-abc305-editorial-6539-dbccec279dda77fe4e284c020f8ec0b6c0726521fc1806fec4d8c56e8f19b880"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未確定候補で最大の体力xを持つ頂点vを取り出すと、別経路が後からvへ届ける体力はxを超えない。これは辺ごとに値が1だけ減る、Dijkstra法の符号を反転したlabel-settingである。 複数の警備員は、各p_iの初期値をh_iにする多始点として同じ探索へ同時投入できる。警備員の個別BFSを合成する必要はない。 より小さい体力で同じ頂点へ着く経路は以後も大きい体力の経路を上回れず、最大値一つへ支配関係でまとめられる。","sourceRevisionIds":["source-abc305-e-problem-03168a468ff5b7f12311033f32db62599adf5a0287f95d9a4b4270b9c3701d8f","source-abc305-editorial-6539-dbccec279dda77fe4e284c020f8ec0b6c0726521fc1806fec4d8c56e8f19b880"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

警備員iが頂点vを守れる条件dist(p_i,v)≤h_iは、p_iから体力h_iで出発し、辺を一つ進むたび体力を1減らして、非負のままvへ着ける条件と言い換えられる。

頂点vで必要なのは、どの警備員が来たかではなく到達時の残り体力の最大値d_vだけである。残り体力xでvへ来れば、隣接頂点へx−1を伝播できる。

棄却する候補: 各警備員を始点に深さh_iまでBFSし、訪れた頂点を警備済みにする。

警備範囲が大きく重なると同じ頂点・辺を警備員ごとに繰り返し走査し、Kとグラフサイズの積に達し得る。

採用する候補: 各頂点へ届く最大残り体力を状態にし、その値が最大の頂点から優先度付きキューで確定・伝播する。

より小さい体力で同じ頂点へ着く経路は以後も大きい体力の経路を上回れず、最大値一つへ支配関係でまとめられる。

未確定候補で最大の体力xを持つ頂点vを取り出すと、別経路が後からvへ届ける体力はxを超えない。これは辺ごとに値が1だけ減る、Dijkstra法の符号を反転したlabel-settingである。

複数の警備員は、各p_iの初期値をh_iにする多始点として同じ探索へ同時投入できる。警備員の個別BFSを合成する必要はない。

dを−1で初期化し、各(p_i,h_i)でd[p_i]をh_iにして最大heapへ入れる。最大の(x,v)を取り出し、古い候補なら捨てる。x>0なら各隣接uへx−1を緩和し、最後にd[v]≥0の頂点を昇順で列挙する。

## 典型の発動条件

### 多始点の最大値伝播

発動条件: 複数の源が異なる初期資源を持ち、辺を進むたび一定量減る資源の最大到達値を求めたいとき。

全警備員を初期labelとして同じ最大heapへ入れ、頂点ごとの最大残り体力だけを伝える。

### Dijkstra型のlabel-setting

発動条件: 優先度最大の暫定値を確定でき、後続遷移がその順序を逆転させないとき。

残り体力が最大の頂点から確定し、1減らした値で隣接頂点を緩和する。

## 問題固有の要素

距離制約h_iを『到達時に残る体力h_i−dist』へ変えると、警備員ごとの球の和集合が一つのmax-plus伝播になる。

別の問題へ持ち帰る視点: 始点ごとに半径が異なる到達可能性では、半径から移動距離を引いた残余量を頂点labelとして統合する。

## 正当性

未確定候補で最大の体力xを持つ頂点vを取り出すと、別経路が後からvへ届ける体力はxを超えない。これは辺ごとに値が1だけ減る、Dijkstra法の符号を反転したlabel-settingである。 複数の警備員は、各p_iの初期値をh_iにする多始点として同じ探索へ同時投入できる。警備員の個別BFSを合成する必要はない。 より小さい体力で同じ頂点へ着く経路は以後も大きい体力の経路を上回れず、最大値一つへ支配関係でまとめられる。

## 実装上の注意

- 同じ頂点の古いheap entryが残るため、取り出したxが現在のd[v]と一致しなければ処理しない。x=0からは負値を伝播させない。
- 警備員の頂点は相異なるが、一般化して同じ始点があっても初期値の最大を取る形にしておくと更新規則が一貫する。

## 復習の核

- 警備員二人の範囲が重なる小グラフでh_i−distを直接書き、頂点ごとの大きい値だけ残しても、その先の警備可能性を失わないことを確認する。

## 計算量と制約

### 時間

O((N+M+K)log(N+M+K))、N頂点M辺K警備員。

### 空間

O(N+M+K)、隣接表とheap。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min \left(\frac{N(N-1)}{2}, 2 \times 10^5 \right); 1 \leq K \leq N; 1 \leq a_i, b_i \leq N; The given graph is simple.; 1 \leq p_i \leq N; All p_i are distinct.; 1 \leq h_i \leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/tasks/abc305_e) — source-abc305-e-problem-03168a468ff5b7f12311033f32db62599adf5a0287f95d9a4b4270b9c3701d8f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/editorial/6539) — source-abc305-editorial-6539-dbccec279dda77fe4e284c020f8ec0b6c0726521fc1806fec4d8c56e8f19b880
