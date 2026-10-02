---
title: "ABC451-G — Minimum XOR Walk"
draft: true
authoringUnit: {"problemId":"abc451-g","docPath":"src/content/docs/problems/mathematics/outcome-minimize-xor-coset-representative/outcome-minimize-xor-coset-representative-shard-001/abc451-g.md","learningOutcomeIds":["outcome-minimize-xor-coset-representative"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-trie","unit-cycle-space-basis"],"excludedTopics":["XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-xor-linear-basis","tag-binary-trie","tag-cycle-space-basis"],"sourceRevisionIds":["source-abc451-editorial-18047-62bc417f992179f3df75def0b0c1f308181d42c6211616762d86cf48a3f0ae9f","source-abc451-g-problem-5dd2c13ea56b4998c7775e3e4437ad346e68834e1e7cacfa8f4d632c67287a23"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"tree xor A_u⊕A_vから任意walkのxorはcycle空間のspanだけ変えられる。cycleを往復接続するwalkでその任意線形結合も挿入できるので、可能集合はそのcoset全体。既約基底のcanonical最小写像fは線形でf(A_u⊕A_v)=f(A_u)⊕f(A_v)。従って各頂点を正規化しtrieでXOR≤Kのunordered pairを数えることが要求最小walk条件と同値。","sourceRevisionIds":["source-abc451-editorial-18047-62bc417f992179f3df75def0b0c1f308181d42c6211616762d86cf48a3f0ae9f","source-abc451-g-problem-5dd2c13ea56b4998c7775e3e4437ad346e68834e1e7cacfa8f4d632c67287a23"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

- XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md)
- [cycle space・fundamental cycle basis](src/content/docs/learn/graph/cycle-space-basis.md)

対象外:

- XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

全域木 root-to-v の xor を A_v とすると、任意辺 e=(u,v) の cycle xor W'_e=W_e⊕A_u⊕A_v を好きな回数 walk に挿入できる。walk xor の自由度は W'_e の線形 span である。

採用する候補: W'_e の xor 基底を簡約して各 A_v の coset 最小代表 B_v=f(A_v) を求め、B_i⊕B_j≤K となる pair を binary trie で数える。

span 要素の xor 追加が可能な walk と一対一に対応し、canonical 最小化写像 f は f(x⊕y)=f(x)⊕f(y) を満たすため pair ごとの最小 walk xor が B_i⊕B_j になる。

棄却する候補: 各頂点 pair について全 walk または cycle の組合せを探索して最小 xor を求める。

walk は無限に存在し、cycle subset も2^M通りで、N^2 pair への独立探索は不可能である。

tree 辺では W'_e=0 なので、任意の cycle xor 列を挿入しつつ任意始終点を結ぶ walk を構成できる。

基底を最上位 bit ごとに簡約した coset 最小代表は xor に関する線形写像となり、二点差の最小化を各点の正規化へ分離できる。

DFSで A_v を計算し、全辺の W'_e を30 bit xor basisへ挿入・reduced canonical formにする。各 A_v を貪欲に小さくして B_v を得る。値を順に binary trieへ追加し、xorがK以下となる既存値数を上位bitから数える。

## 典型の発動条件

### cycle xor の線形基底

発動条件: graph walk に cycle を挿入して xor 重みを最小化・可否判定するとき。

spanning tree potential で辺を cycle xorへ変換し span を作る。

### binary trie の xor pair 数え上げ

発動条件: 多数の値 pair で xor が閾値以下となる個数を求めたいとき。

K のbitに従い枝ごとの個数を一括加算する。

## 問題固有の要素

graph の xor walk は tree potential で端点依存部分と cycle span に分離できる。

別の問題へ持ち帰る視点: pair ごとの coset 最小化が各値の canonical 化へ分離できるかは、正規化写像の xor 線形性を証明して判断する。

## 正当性

tree xor A_u⊕A_vから任意walkのxorはcycle空間のspanだけ変えられる。cycleを往復接続するwalkでその任意線形結合も挿入できるので、可能集合はそのcoset全体。既約基底のcanonical最小写像fは線形でf(A_u⊕A_v)=f(A_u)⊕f(A_v)。従って各頂点を正規化しtrieでXOR≤Kのunordered pairを数えることが要求最小walk条件と同値。

## 実装上の注意

- 基底は単なる echelon 挿入だけでなく f の線形性を満たす canonical reduction 順に整える。≤K の trie 分岐と bit幅30を確認する。

## 復習の核

- W'_e の telescoping 式、span の任意組合せを実現する walk、f(x⊕y) の線形性の三段を順に再構成する。

## 計算量と制約

### 時間

O((N+M)B+B²)、B=30。cycle基底とbinary trie。

### 空間

O(NB+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; 2 \leq N \leq 2 \times 10^5; N-1 \leq M \leq 2 \times 10^5; 0 \leq K \lt 2^{30}; 1 \leq U_i \lt V_i \leq N; 0 \leq W_i \lt 2^{30}; The given graph is simple and connected.; All input values are integers.; The sum of N over all test cases in a single input is at most 2 \times 10^5.; The sum of M over all test cases in a single input is at most 2 \times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/editorial/18047) — source-abc451-editorial-18047-62bc417f992179f3df75def0b0c1f308181d42c6211616762d86cf48a3f0ae9f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/tasks/abc451_g) — source-abc451-g-problem-5dd2c13ea56b4998c7775e3e4437ad346e68834e1e7cacfa8f4d632c67287a23
