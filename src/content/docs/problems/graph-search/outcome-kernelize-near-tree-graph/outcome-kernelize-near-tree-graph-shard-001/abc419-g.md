---
title: "ABC419-G — Count Simple Paths 2"
draft: true
authoringUnit: {"problemId":"abc419-g","docPath":"src/content/docs/problems/graph-search/outcome-kernelize-near-tree-graph/outcome-kernelize-near-tree-graph-shard-001/abc419-g.md","learningOutcomeIds":["outcome-kernelize-near-tree-graph","outcome-use-cycle-space-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-backtracking-search","unit-bounded-enumeration","unit-cycle-space-basis","unit-graph-core"],"excludedTopics":["near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cycle-space-basis","tag-near-tree-kernelization","tag-backtracking-search","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc419-editorial-13636-a04e992f7fda4e4105fa306cbdbd87a839e59db1971fb6c3485398f79ad70ad6","source-abc419-g-problem-878c630043f399210fb234e50a45e76f4c850b4ca999c206bce7f741a3e543bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"単純pathが非terminalの葉へ入ると同じ辺を戻るしかなくなるため、葉は除去できる。残るdegree2 chainの内部では進路が一意なので、chain長を重みにした縮約前後でpathは一対一に対応する。parallel edgeも区別して残すと対応を失わない。DFSでは現在pathの頂点だけをvisitedにし、復帰時に戻すため、異なる分岐のpathをすべて一度ずつ数えられる。","sourceRevisionIds":["source-abc419-editorial-13636-a04e992f7fda4e4105fa306cbdbd87a839e59db1971fb6c3485398f79ad70ad6","source-abc419-g-problem-878c630043f399210fb234e50a45e76f4c850b4ca999c206bce7f741a3e543bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [near-tree graphのkernel化](src/content/docs/learn/graph/near-tree-kernelization.md)

- terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。

先に読む単元:

- [backtracking・可逆な探索状態](src/content/docs/learn/modeling/backtracking-search.md) — 再帰へ入る直前に局所選択を反映し、復帰時に必ずundoして現在pathだけの制約を保ちながら探索木を列挙する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。
- [cycle space・fundamental cycle basis](src/content/docs/learn/graph/cycle-space-basis.md) — 無向graphを探索してspanning forestを構築できることを土台に、偶数次数辺集合をF_2上のcycle spaceとして捉え、fundamental cycle basisとdim C(G)=M-N+C（Cは連結成分数）を導く。さらに辺labelによる線形写像を通してcycle XORのspanを作り、path族の上界やwalk XORの自由度へ接続する。
- [単一サイクル成分とgraph core](src/content/docs/learn/graph/graph-core.md) — 連結成分の辺数と頂点数からcycle rankを判定し、必要なら葉を反復削除してcycle coreと削除順を得る。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

前提単元のcycle spaceの次元を使う。連結graphなのでcycle rankはK=M−N+1である。固定した1-N simple path P_0に対し、各simple path PをPhi(P)=P XOR P_0へ写す。端点を含む全頂点で次数parityが打ち消されるのでPhi(P)はcycle spaceに属し、さらにPhi(P) XOR P_0=PよりPを一意に復元できる。したがってPhiは単射で、simple path総数は|C(G)|=2^K以下である。 大graphのうちterminal以外のdegree1頂点は1-N simple pathに使われず、残ったdegree2 chainは長さweightをもつ一本のedgeへ縮約できる。 terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。 縮約edgeのweightを元chainのedge数にすれば、H上pathのweight和が元simple pathのedge数へ正確に戻る。parallel edgeは異なるchainとして別々に列挙する。

採用する候補: leaf pruning後にbranch/terminalだけのweighted multigraph Hへ縮約し、H上の全simple 1-N pathをDFS列挙して長さ別に数える

coreの頂点数≤2K+2、辺数≤3K+1で、simple path総数も≤2^K。前処理O(N)、列挙O(K2^K)になる。

棄却する候補: 元のN頂点graphでsimple path DFSをそのまま行う

path数自体は少なくても各pathが長いdegree2 chainを一頂点ずつ辿り、最大N2^K回の再帰呼出しになる。

degree1非terminalをpeelingし、S={1,N}∪{deg≥3}を作る。各S頂点から未処理edgeを辿って次のS頂点までのdegree2 chainをweighted edge化する。Hでvisited vertexを持つDFSを1から行い、N到着時にans[weightSum]++し、ans[1..N-1]を出力する。

## 典型の発動条件

### 2-core型leaf pruning

発動条件: 指定terminal間simple pathに絶対含まれない枝を除きたいとき。

terminal以外のdegree1頂点を反復削除する。

### degree-2 chain compression

発動条件: path選択に分岐を生まない長いchainがあり、長さだけ保持すればよいとき。

branch/terminal間をweighted multiedgeへ縮約する。

### cycle space・fundamental cycle basis

発動条件: 無向graphでcycle空間の次元M-N+Cが小さく、cycleやterminal間pathの候補数を理論的に抑えたいとき。

cycle spaceの定義と基底は前提単元を使い、考察の固定pathとのXORによる単射へ接続する。

### 小さなcycle rankをparameterとする候補全列挙

発動条件: 候補数が2^K以下と証明でき、Kが十分小さいとき。

前処理で各1-N simple pathあたりの仕事量をO(K)に抑えたうえで、全候補をO(K 2^K)で直接評価する。

### 可逆なvisited状態によるsimple path backtracking

発動条件: 同じ頂点を再訪問しないpathを、現在の再帰pathだけを状態にして全列挙するとき。

頂点に入るときvisitedをmarkし、未訪問隣接へ再帰し、戻るときにunmarkして別branchの状態を汚さない。

## 問題固有の要素

Nが20万でも「余分なedgeが21本」というparameterでbranch coreをO(K)頂点にkernelizeし、全pathを直接列挙できる。

別の問題へ持ち帰る視点: near-tree graphではcycle rankをparameterに、leaf除去とdegree2圧縮で小kernelを作って指数部をKだけに閉じ込める。

## 正当性

単純pathが非terminalの葉へ入ると同じ辺を戻るしかなくなるため、葉は除去できる。残るdegree2 chainの内部では進路が一意なので、chain長を重みにした縮約前後でpathは一対一に対応する。parallel edgeも区別して残すと対応を失わない。DFSでは現在pathの頂点だけをvisitedにし、復帰時に戻すため、異なる分岐のpathをすべて一度ずつ数えられる。

## 実装上の注意

- 1,Nはdegree1でも削除しない。parallel縮約edgeをまとめず別edgeとして保持し、self-loopはsimple pathに使えない。weight和はN-1以下、countは64 bitにする。

## 復習の核

- terminalを葉として持ち、parallelな二つのchainと不要な枝を持つ小graphで、枝除去・縮約・長さの復元がpath集合を保つか確認する。

## 計算量と制約

### 時間

連結graph N 頂点、M 辺、cycle rank K=M−N+1。読込・縮約 O(N+M)、単純path列挙 O(K2^K)、出力 O(N)。

### 空間

元graph O(N+M)、縮約graph O(K)、長さ別答え O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; N-1\leq M\leq N+20; 1\leq u_i\lt v_i\leq N; The given graph is a simple connected undirected graph.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/editorial/13636) — source-abc419-editorial-13636-a04e992f7fda4e4105fa306cbdbd87a839e59db1971fb6c3485398f79ad70ad6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/tasks/abc419_g) — source-abc419-g-problem-878c630043f399210fb234e50a45e76f4c850b4ca999c206bce7f741a3e543bf
