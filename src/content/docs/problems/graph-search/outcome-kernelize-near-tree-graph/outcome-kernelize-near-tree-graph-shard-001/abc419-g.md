---
title: "ABC419-G — Count Simple Paths 2"
draft: true
authoringUnit: {"problemId":"abc419-g","docPath":"src/content/docs/problems/graph-search/outcome-kernelize-near-tree-graph/outcome-kernelize-near-tree-graph-shard-001/abc419-g.md","learningOutcomeIds":["outcome-kernelize-near-tree-graph","outcome-use-cycle-space-basis"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-backtracking-search","unit-bounded-enumeration","unit-cycle-space-basis","unit-graph-core"],"excludedTopics":["near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-cycle-space-basis","tag-near-tree-kernelization","tag-backtracking-search","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc419-editorial-13636-a04e992f7fda4e4105fa306cbdbd87a839e59db1971fb6c3485398f79ad70ad6","source-abc419-g-problem-878c630043f399210fb234e50a45e76f4c850b4ca999c206bce7f741a3e543bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非terminal葉は1–N単純pathへ入れず削除可能。degree2 chainを一辺へ置換すると単純path集合と長さが一対一対応する。固定pathとの差をcycle spaceへ写す単射でpath数≤2^K、縮約graphはO(K)頂点辺。visited頂点DFSは全単純pathを一度ずつ列挙しchain長和を正確に戻す。","sourceRevisionIds":["source-abc419-editorial-13636-a04e992f7fda4e4105fa306cbdbd87a839e59db1971fb6c3485398f79ad70ad6","source-abc419-g-problem-878c630043f399210fb234e50a45e76f4c850b4ca999c206bce7f741a3e543bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-kernelize-near-tree-graph","outcome-use-cycle-space-basis"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺1–2,2–3,1–3、terminal1,3。","procedure":["cycle rankは1。","path1–3は長1、path1–2–3は長2。","degree2 chainを長2辺へ縮約してもparallel二辺を別に残す。"],"executionTarget":null,"expectedResult":"長1:1本、長2:1本","verificationStatus":"not_applicable","learningUnitIds":["unit-near-tree-kernelization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-kernelize-near-tree-graph","outcome-use-cycle-space-basis"],"prerequisiteIds":["unit-backtracking-search","unit-bounded-enumeration","unit-cycle-space-basis","unit-graph-core"],"attainmentCondition":"縮約parallel辺を一本へまとめてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。別chainは別simple pathを表すので本数と長さ分布が失われる。"},"answer":{"reasoningOrVerification":"不可。別chainは別simple pathを表すので本数と長さ分布が失われる。","procedure":["具体例の各状態・寄与を再計算する。","不可。別chainは別simple pathを表すので本数と長さ分布が失われる。"],"expectedResult":"不可。別chainは別simple pathを表すので本数と長さ分布が失われる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [near-tree graphのkernel化](src/content/docs/learn/graph/near-tree-kernelization.md)

- terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [backtracking・可逆な探索状態](src/content/docs/learn/modeling/backtracking-search.md)
- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [cycle space・fundamental cycle basis](src/content/docs/learn/graph/cycle-space-basis.md)
- [単一サイクル成分とgraph core](src/content/docs/learn/graph/graph-core.md)

対象外:

- near-tree graphのkernel化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

無向graphで全頂点の次数が偶数となる辺部分集合全体は、XOR（対称差）を加法とするF_2上のcycle spaceをなす。spanning forest Fを一つ固定すると、各non-tree edge eについてF+eに生じる唯一のcycleがfundamental cycle basisをなし、連結成分数をCとすればdim C(G)=M-N+Cとなる。この問題のgraphは連結なのでC=1、dim C(G)=M-N+1=Kである。 固定した1-N simple path P_0に対し、各simple path PをPhi(P)=P XOR P_0へ写す。端点を含む全頂点で次数parityが打ち消されるのでPhi(P)はcycle spaceに属し、さらにPhi(P) XOR P_0=PよりPを一意に復元できる。したがってPhiは単射で、simple path総数は|C(G)|=2^K以下である。 大graphのうちterminal以外のdegree1頂点は1-N simple pathに使われず、残ったdegree2 chainは長さweightをもつ一本のedgeへ縮約できる。 terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。 縮約edgeのweightを元chainのedge数にすれば、H上pathのweight和が元simple pathのedge数へ正確に戻る。parallel edgeは異なるchainとして別々に列挙する。

採用する候補: leaf pruning後にbranch/terminalだけのweighted multigraph Hへ縮約し、H上の全simple 1-N pathをDFS列挙して長さ別に数える

coreの頂点数≤2K+2、辺数≤3K+1で、simple path総数も≤2^K。前処理O(N)、列挙O(K2^K)になる。

棄却する候補: 元のN頂点graphでsimple path DFSをそのまま行う

path数自体は少なくても各pathが長いdegree2 chainを一頂点ずつ辿り、最大N2^K回の再帰呼出しになる。

terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。

縮約edgeのweightを元chainのedge数にすれば、H上pathのweight和が元simple pathのedge数へ正確に戻る。parallel edgeは異なるchainとして別々に列挙する。

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

全頂点が偶数次数となる辺集合をF_2上のcycle spaceとし、spanning forest Fと各non-tree edge eが作る唯一のcycleからfundamental cycle basisを構成する。連結成分数Cを用いてdim C(G)=M-N+Cを導き、連結graphではC=1に特殊化する。ABC419-Gでは固定したpathとのXORがcycle spaceに入り、かつpathを復元できることから、simple s-t path数を2^(M-N+1)以下に抑える。

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

非terminal葉は1–N単純pathへ入れず削除可能。degree2 chainを一辺へ置換すると単純path集合と長さが一対一対応する。固定pathとの差をcycle spaceへ写す単射でpath数≤2^K、縮約graphはO(K)頂点辺。visited頂点DFSは全単純pathを一度ずつ列挙しchain長和を正確に戻す。

## 実装上の注意

- 1,Nはdegree1でも削除しない。parallel縮約edgeをまとめず別edgeとして保持し、self-loopはsimple pathに使えない。weight和はN-1以下、countは64 bitにする。

## 復習の核

- tree・単一cycle・theta graph・複数連結成分のgraphで、spanning forestによるfundamental cycle basisとdim C(G)=M-N+Cを確認する。その後、s-tが同じ連結成分にある例で異なるs-t pathがP XOR P_0で異なるcycle-space要素へ写ることを検証し、terminalへの枝、parallel chains、不要leafが伸びる例を元graphのsimple path列挙と比較する。

## 計算量と制約

### 時間

連結graph N 頂点、M 辺、cycle rank K=M−N+1。読込・縮約 O(N+M)、単純path列挙 O(K2^K)、出力 O(N)。

### 空間

元graph O(N+M)、縮約graph O(K)、長さ別答え O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; N-1\leq M\leq N+20; 1\leq u_i\lt v_i\leq N; The given graph is a simple connected undirected graph.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺1–2,2–3,1–3、terminal1,3。

1. cycle rankは1。
2. path1–3は長1、path1–2–3は長2。
3. degree2 chainを長2辺へ縮約してもparallel二辺を別に残す。

期待される結果: 長1:1本、長2:1本

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

縮約parallel辺を一本へまとめてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。別chainは別simple pathを表すので本数と長さ分布が失われる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/editorial/13636) — source-abc419-editorial-13636-a04e992f7fda4e4105fa306cbdbd87a839e59db1971fb6c3485398f79ad70ad6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/tasks/abc419_g) — source-abc419-g-problem-878c630043f399210fb234e50a45e76f4c850b4ca999c206bce7f741a3e543bf
