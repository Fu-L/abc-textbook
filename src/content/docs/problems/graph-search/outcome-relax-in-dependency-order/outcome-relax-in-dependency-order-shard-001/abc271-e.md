---
title: "ABC271-E — Subsequence Path"
draft: true
authoringUnit: {"problemId":"abc271-e","docPath":"src/content/docs/problems/graph-search/outcome-relax-in-dependency-order/outcome-relax-in-dependency-order-shard-001/abc271-e.md","learningOutcomeIds":["outcome-relax-in-dependency-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc271-e-problem-fd7e62c9d1acf76da2f90ee7e99d215540cf06ce19275e120ba52dcdc8a76bc6","source-abc271-editorial-4924-1a068eda5b94d2332ed04171e4cfc5468c215a886d7473bd7efdd2dab9f874e6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"prefixを一つ伸ばすと新pathは旧pathか新edgeを最後に使うpathだけ。dp[u]からdestinationを一度relaxすることでこの二択を厳密に合成する。処理順がsubsequence順を保証し通常の到達性では表せない順序制約も保つ。","sourceRevisionIds":["source-abc271-e-problem-fd7e62c9d1acf76da2f90ee7e99d215540cf06ce19275e120ba52dcdc8a76bc6","source-abc271-editorial-4924-1a068eda5b94d2332ed04171e4cfc5468c215a886d7473bd7efdd2dab9f874e6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-relax-in-dependency-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺a:1→2費用2、b:2→3費用3。選択列(b,a)。","procedure":["b処理時dp2=∞なのでdp3未到達。","aでdp2=2。","bはもう過ぎたのでdp3は改善しない。"],"executionTarget":null,"expectedResult":"−1","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-relax-in-dependency-order"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"同じ元辺なら列位置を無視してDijkstraでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。上例はgraph上到達可能だが許されたsubsequence順では到達不能。"},"answer":{"reasoningOrVerification":"不可。上例はgraph上到達可能だが許されたsubsequence順では到達不能。","procedure":["具体例の各状態・寄与を再計算する。","不可。上例はgraph上到達可能だが許されたsubsequence順では到達不能。"],"expectedResult":"不可。上例はgraph上到達可能だが許されたsubsequence順では到達不能。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- DAGや使用可能な辺列の順に緩和し、処理済みprefixが表す経路集合を不変量として説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Eのprefixを一つ伸ばしたとき新たに許されるpathは、以前のpathを保つか、新しいedge E_iを最後に一度使うものだけである。 dp[v]を処理済みprefixのsubsequenceでtown 1からvへ行くminimum costとすれば、各E_iで変化し得るのはそのedgeのdestinationだけである。 通常のshortest pathのedge orderは自由だが、本問ではrelaxation順をEに固定することがsubsequence順序制約をそのまま保証する。 各stepは直前prefixのdp[a]だけを参照する。A_e≠B_eなのでdestinationへのin-place updateがsource値を壊さず、二次元DPを不要にする。

棄却する候補: Eから選ぶsubsequenceを列挙し、それが連続するdirected pathか判定する。

K個の採否に2^K通りあり、K=20万を扱えない。

採用する候補: Eを左から走査し、edge e=(a,b,c)ごとに dp[b]←min(dp[b],dp[a]+c) と更新する。

prefix DPのkeep/use二択を一つのrelaxationで表せ、N状態を使い回してlinear timeで処理できる。

通常のshortest pathのedge orderは自由だが、本問ではrelaxation順をEに固定することがsubsequence順序制約をそのまま保証する。

各stepは直前prefixのdp[a]だけを参照する。A_e≠B_eなのでdestinationへのin-place updateがsource値を壊さず、二次元DPを不要にする。

ordered edge stream上のsubsequence-constrained shortest pathを、prefixごとのsingle-edge relaxation DPとして計算する。

## 典型の発動条件

### subsequence順序を保つDP

発動条件: 候補操作列から順序を変えず一部を選び、到達状態の最適値を求めるとき。

Eの各edgeを使わない遷移はdp保持、使う遷移はsourceからdestinationへのrelaxationとする。

### rolling arrayによる状態圧縮

発動条件: step i+1のDPがstep iの同じ状態と少数の局所更新だけから定まるとき。

N頂点のdistance array一つを保持し、各stepで一つのdestinationだけ更新する。

## 問題固有の要素

edge番号そのものではなくE内で現れた時点が利用順を決めるため、同じroadが複数回現れれば各appearanceを別stepとしてrelaxする。

別の問題へ持ち帰る視点: 順序付き候補列のpath問題は、graph探索よりstream processing型のrelaxationとして捉える。

## 正当性

prefixを一つ伸ばすと新pathは旧pathか新edgeを最後に使うpathだけ。dp[u]からdestinationを一度relaxすることでこの二択を厳密に合成する。処理順がsubsequence順を保証し通常の到達性では表せない順序制約も保つ。

## 実装上の注意

- dp[1]=0、他をinfinityで初期化し、dp[a]が未到達ならcost加算によるoverflowを避ける。
- path costは最大2×10^14規模なので64 bit整数を使い、最後にdp[N]がinfinityなら−1を出す。

## 復習の核

- 候補列のprefixを一つ伸ばしたときに増える解だけを特定し、局所relaxationへ落とす。
- 二次元prefix DPを考えた後、各stepで更新される状態数を見てrolling/in-place化を検討する。

## 計算量と制約

### 時間

N 頂点、M 元辺、選択列長K。各選択edge一回relaxで O(N+M+K)。

### 空間

元辺、DP、列を逐次読むなら O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq M, K \leq 2 \times 10^5; 1 \leq A_i, B_i \leq N, A_i \neq B_i \, (1 \leq i \leq M); 1 \leq C_i \leq 10^9 \, (1 \leq i \leq M); 1 \leq E_i \leq M \, (1 \leq i \leq K); All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺a:1→2費用2、b:2→3費用3。選択列(b,a)。

1. b処理時dp2=∞なのでdp3未到達。
2. aでdp2=2。
3. bはもう過ぎたのでdp3は改善しない。

期待される結果: −1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ元辺なら列位置を無視してDijkstraでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。上例はgraph上到達可能だが許されたsubsequence順では到達不能。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/tasks/abc271_e) — source-abc271-e-problem-fd7e62c9d1acf76da2f90ee7e99d215540cf06ce19275e120ba52dcdc8a76bc6
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/editorial/4924) — source-abc271-editorial-4924-1a068eda5b94d2332ed04171e4cfc5468c215a886d7473bd7efdd2dab9f874e6
