---
title: "ABC305-F — Dungeon Explore"
draft: true
authoringUnit: {"problemId":"abc305-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-001/abc305-f.md","learningOutcomeIds":["outcome-select-state-graph-search","outcome-maintain-interactive-query-protocol"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interactive-protocol","tag-state-graph-search","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc305-editorial-6542-fb4c7cf6c4c3a4faf71fe74fb0d98f376f1ad7e98f2ffe32ebf555e1121cc090","source-abc305-f-problem-f13178bfa7b480c26c6206c3c96d4f08526a5036807fe624b1e4484ef7ba8de9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未訪問neighborへ進むと新DFS木辺になり、行き止まりは既知の親辺で戻る。各木辺は行き帰り高々一回で、連結性から未訪問点がある間は探索が尽きない。従ってgoalを必ず上限以内に訪れる。","sourceRevisionIds":["source-abc305-editorial-6542-fb4c7cf6c4c3a4faf71fe74fb0d98f376f1ad7e98f2ffe32ebf555e1121cc090","source-abc305-f-problem-f13178bfa7b480c26c6206c3c96d4f08526a5036807fe624b1e4484ef7ba8de9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。
- judgeとの問い合わせ応答または交互手番のprotocolを守り、許された形式で応答依存の探索・合法手の提示・終了処理を実行できる。query上限がある場合はその回数も満たす。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

対象外:

- 状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

未知のグラフでも、現在頂点の隣接一覧は毎手与えられる。既訪問集合と、各頂点へ初めて来たときの親を自分で記録すれば、未訪問隣接点へ進むか親へ戻るDFSの一手を決められる。 DFSで初訪問に使った辺だけを集めると全域木になる。木の辺は子へ進むときと戻るときの高々2回しか通らないので、頂点Nへ着くまでの移動数は2(N−1)以下である。 judgeがadaptiveでも、過去に提示された隣接関係と矛盾しない連結グラフが存在する限り、DFSは現在見えた辺だけを使うので同じ論理で進められる。 上限が2N回なのは最短路を当てることを要求しているのではなく、全域木の往復2(N−1)回という探索保証に合わせた値である。

採用する候補: 見えている隣接点から常に未訪問頂点を選び、無ければ最初に来た親へ戻るオンラインDFSを行う。

未公開の辺を仮定せず現在までの情報だけで実行でき、連結性により全頂点を訪問し、移動上限もDFS木から保証できる。

棄却する候補: 各手で頂点Nに近そうな未訪問隣接点を貪欲に選び、行き止まりでは任意の隣接点へ移る。

未知部分への距離を比較できず、戻り先を管理しないと既訪問領域を巡回して2N手の保証を失う。

judgeがadaptiveでも、過去に提示された隣接関係と矛盾しない連結グラフが存在する限り、DFSは現在見えた辺だけを使うので同じ論理で進められる。

上限が2N回なのは最短路を当てることを要求しているのではなく、全域木の往復2(N−1)回という探索保証に合わせた値である。

visited[1]=true、DFS stack=[1]で始める。毎回受け取った隣接一覧から未訪問uがあればvisitedにしてstackへ積みuを出力し、無ければstack末尾を捨てて新しい末尾の頂点を出力する。Nへ移動したらjudgeのOKを受けて直ちに終了する。

## 典型の発動条件

### オンラインDFSと明示的backtracking

発動条件: 探索先の隣接情報が訪問時にだけ判明し、移動そのものも辺に沿って行う必要があるとき。

既訪問集合とDFS stackを持ち、未訪問の子へ進み、無ければ親へ実際に一歩戻る。

### 探索木による操作回数の償却

発動条件: DFSの前進と後退が操作回数として課金され、総回数の上界が必要なとき。

初訪問辺ごとに往路・復路を高々一回ずつ対応させ、全域木の辺数から上界を出す。

## 問題固有の要素

隣接一覧が逐次しか得られなくても、DFSに必要な情報は現在頂点の隣接点・既訪問判定・親だけであり、グラフ全体の事前取得は不要である。

別の問題へ持ち帰る視点: オンライン探索では、既知の全体像を求める前に、標準探索の『次の一手』が局所情報だけで決まるかを分解する。

## 正当性

未訪問neighborへ進むと新DFS木辺になり、行き止まりは既知の親辺で戻る。各木辺は行き帰り高々一回で、連結性から未訪問点がある間は探索が尽きない。従ってgoalを必ず上限以内に訪れる。

## 実装上の注意

- 各出力の直後にflushし、入力が−1またはOKなら追加の読出し・出力をせず即時終了する。通常のサンプル入出力として一括処理しない。
- 未訪問隣接点がない頂点1へ戻る前にNへ到達することが連結性から保証される。stackをpopした後の親参照が空にならない前提をこの保証と対応させる。

## 復習の核

- 未知グラフを推測する説明ではなく、DFSの各判断に必要な三情報がいつ得られるかを追う。次に各前進辺へ高々一つの後退を対応させ、2N制約との余裕を確認する。

## 計算量と制約

### 時間

連結graph N頂点。DFS木を往復する移動回数≤2(N−1)、各返答の隣接読込総量はjudgeが提示する量Lに O(L)。

### 空間

visitedと探索stack O(N)、受信隣接O(max degree)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq100; N-1\leq M\leq\dfrac{N(N-1)}2; The graph is simple and connected.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/editorial/6542) — source-abc305-editorial-6542-fb4c7cf6c4c3a4faf71fe74fb0d98f376f1ad7e98f2ffe32ebf555e1121cc090
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/tasks/abc305_f) — source-abc305-f-problem-f13178bfa7b480c26c6206c3c96d4f08526a5036807fe624b1e4484ef7ba8de9
