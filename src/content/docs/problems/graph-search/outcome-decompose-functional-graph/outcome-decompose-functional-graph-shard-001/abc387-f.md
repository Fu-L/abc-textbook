---
title: "ABC387-F — Count Arrays"
draft: true
authoringUnit: {"problemId":"abc387-f","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc387-f.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization","unit-rooted-tree-aggregation","unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition","tag-dp-transition-acceleration","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc387-editorial-11834-86e47cdfbb55d84752bd9b893e3702857efbcfb3dfa7d6c99cfe7f66dac7e971","source-abc387-f-problem-d8df2e613ad268786b4f640f24a45e1357a5898c07726be951026680a2666c16"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"cycle上の一周の不等式は全値等号を強制するため一頂点へ縮約してよい。親値jを固定すると各子は1..jから独立に選べ、子DP prefix和の積が厳密な部分木数。葉からの帰納法で各rootの和が成分数となり、成分は独立なので積が全答え。 cycle検出ではi→A_i、木DPではその逆の親A_i→子iを用いる。親値jに対するx_i≤jという元の不等式とprefix和の範囲が一致し、逆向きの不等式を数えない。","sourceRevisionIds":["source-abc387-editorial-11834-86e47cdfbb55d84752bd9b893e3702857efbcfb3dfa7d6c99cfe7f66dac7e971","source-abc387-f-problem-d8df2e613ad268786b4f640f24a45e1357a5898c07726be951026680a2666c16"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

先に読む単元:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md) — DPの最小十分状態で得た考え方と実装を再利用し、根付き木DP・部分木集約の発動条件・正当化・境界を重複なく学ぶ。
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

条件はx_i≤x_{A_i}である。まず各iから親A_iへi→A_iを張る。これなら出次数が1のfunctional graphで、各弱連結成分は一つのcycleとそこへ流れ込む木からなる。cycle上は不等式が一周して全値が等しくなるのでcycleを一つのrootへ縮約する。

木DPでは逆向きのparent→childをたどる。cycleでない各iをchildren[A_i]へ入れ、cycle頂点間の辺だけ除く。cycle rootの子はcycle上の全頂点へ入っていた木の子を集める。この向きでは親値jに対し子値は1..jであり、各子部分木は独立である。

```text
pref_child[j] = Σ_{k=1}^j dp[child][k], pref_child[0]=0
dp[v][j] = ∏_{child c} pref_c[j], 1≤j≤M
componentWays = Σ_{j=1}^M dp[root][j]
answer = 全componentWaysの積
```

葉では空積なのでdp[v][j]=1。縮約cycle rootにもM通りの共通値jがあり、cycle長だけ値の選択回数を掛けない。postorderで子ごとにprefix sumを一回作れば、一つの辺の全jをO(M)で処理できる。成分ごとのroot値の和を取り、独立な成分間で掛ける。

A=(2,1,1),M=3なら1,2がcycleで値jは等しく、子3には1..jのj通り。従ってΣ_{j=1}^3 j=6。graphをA_i→iで作ってもよいが、その場合は木がcycleから外へ伸びる向きであり、それをさらに反転してDPの子としてはならない。向きの混同を避けるため、ここではcycle検出用i→A_iとDP用A_i→iを明示的に分ける。

## 典型の発動条件

### functional graphのcycle縮約

発動条件: 各頂点が一つの親を持ち、cycle上の制約が全頂点を同値化するとき。

cycleを一頂点としてrooted treeへ変える。

### tree DPの累積和高速化

発動条件: 親値に応じて子値のprefix/suffix範囲を合計するとき。

子dpのprefix sumを全jへ使い回す。

## 問題固有の要素

循環不等式は矛盾でなくcycle全体の等値を強制するので、cycle長を状態へ持つ必要がない。

別の問題へ持ち帰る視点: 有向cycle上に単調な順序制約が閉じている場合、全辺が等号になり縮約できる。

## 正当性

cycle上の一周の不等式は全値等号を強制するため一頂点へ縮約してよい。親値jを固定すると各子は1..jから独立に選べ、子DP prefix和の積が厳密な部分木数。葉からの帰納法で各rootの和が成分数となり、成分は独立なので積が全答え。 cycle検出ではi→A_i、木DPではその逆の親A_i→子iを用いる。親値jに対するx_i≤jという元の不等式とprefix和の範囲が一致し、逆向きの不等式を数えない。

## 実装上の注意

- 自己loopもcycleとして一rootにする。縮約後のchild重複を避け、mod積とprefix sumを各mergeで正規化する。

## 復習の核

- 自己loop、長いcycle、cycle頂点ごとに木が付くN≤8例を全M^N列挙し、縮約前後の条件とcomponent積を照合する。

## 計算量と制約

### 時間

N 頂点、選択値上限 M。cycle縮約 O(N)、prefix和DP O(NM)。

### 空間

全縮約頂点DPを保存するなら O(NM)、グラフO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M \leq 2025; 1 \leq A_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/editorial/11834) — source-abc387-editorial-11834-86e47cdfbb55d84752bd9b893e3702857efbcfb3dfa7d6c99cfe7f66dac7e971
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/tasks/abc387_f) — source-abc387-f-problem-d8df2e613ad268786b4f640f24a45e1357a5898c07726be951026680a2666c16
