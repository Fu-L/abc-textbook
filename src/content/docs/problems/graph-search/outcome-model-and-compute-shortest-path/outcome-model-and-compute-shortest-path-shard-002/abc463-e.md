---
title: "ABC463-E — Roads and Gates"
draft: true
authoringUnit: {"problemId":"abc463-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc463-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc463-e-problem-b1c78b5d7f7d16c1826aad1e574e294a196536ae928b9132155e9f5063f3a837","source-abc463-editorial-21940-9ad8dc40350b56bbaa375436bfc75c2502805d6c694896eb049af73188c90b96"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"特別移動i→j費用X_i+Y+X_jはi→入口→出口→jの三辺costと一致。道路も元のままなので元routeは補助pathへ同costで写せ、補助pathも特別移動へ戻せる。非負最短路で任意組合せを自動比較する。","sourceRevisionIds":["source-abc463-e-problem-b1c78b5d7f7d16c1826aad1e574e294a196536ae928b9132155e9f5063f3a837","source-abc463-editorial-21940-9ad8dc40350b56bbaa375436bfc75c2502805d6c694896eb049af73188c90b96"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"二頂点、通常道路費用20、X=(2,3)、Y=4。","procedure":["特別route費用2+4+3=9。","通常道路20と比較。","Dijkstraは入口cost2、出口6、頂点2へ9。"],"executionTarget":null,"expectedResult":"9","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"入口出口を一頂点にまとめてY辺を消せるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。特別移動の固定費用Yを失う。方向を保つ中央辺が必要。"},"answer":{"reasoningOrVerification":"不可。特別移動の固定費用Yを失う。方向を保つ中央辺が必要。","procedure":["具体例の各状態・寄与を再計算する。","不可。特別移動の固定費用Yを失う。方向を保つ中央辺が必要。"],"expectedResult":"不可。特別移動の固定費用Yを失う。方向を保つ中央辺が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

特別な移動は任意の出発頂点iからcost X_iで共通地点へ入り、固定cost Yを経て任意jへcost X_jで出る一つのrouteとして表せる。 全iから共通入口へのcostがX_i、共通出口から全jへのcostがX_jというseparable edge weightを超頂点でfactorizeできる。 W_S→W_Tを有向にすることで、問題が許す特別移動方向・回数だけを表し不要な逆routeを作らない。

採用する候補: 二超頂点 W_S,W_T を追加し、i-W_SにX_i、W_S-W_TにY、W_T-jにX_jの有向辺を張って通常道路と合わせ、Dijkstraを一回行う。

超頂点route一回が特別移動と同costで対応し、非負辺最短路は通常道路と特別移動の任意組合せを自動的に比較する。

棄却する候補: Dijkstra中に各確定頂点iから全jへ X_i+Y+X_j の辺を直接緩和する。

完全graph相当のN^2特別辺を生成・緩和することになり、疎な入力制約を失う。

全iから共通入口へのcostがX_i、共通出口から全jへのcostがX_jというseparable edge weightを超頂点でfactorizeできる。

W_S→W_Tを有向にすることで、問題が許す特別移動方向・回数だけを表し不要な逆routeを作らない。

N+2頂点graphを作り、M本道路と各iの二本の超頂点接続、中央辺を追加する。指定sourceからpriority queue Dijkstraを実行し、各元頂点のdistを出力する。

## 典型の発動条件

### 完全辺costの超頂点分解

発動条件: 任意i,j間のedge costがf(i)+constant+g(j)に分離できるとき。

入口・出口supernodeでO(N)辺に置換する。

## 問題固有の要素

全点間shortcutを明示せず、edge weightのseparabilityを中間nodeを通るpathとしてgraph化する。

別の問題へ持ち帰る視点: 特殊操作を通常最短路へ埋め込むと、使用回数や道路との組合せを別caseで考えずに済む。

## 正当性

特別移動i→j費用X_i+Y+X_jはi→入口→出口→jの三辺costと一致。道路も元のままなので元routeは補助pathへ同costで写せ、補助pathも特別移動へ戻せる。非負最短路で任意組合せを自動比較する。

## 実装上の注意

- 道路の有向・無向と超辺方向を問題定義に合わせ、distanceは複数X,Y和に十分な64 bitを使う。

## 復習の核

- 一回の特別移動i→jと三辺pathのcost対応を確認し、超頂点を複数回通るpathも元操作列へ解釈できることを確かめる。

## 計算量と制約

### 時間

N元頂点M道路、補助2頂点・2N+1辺。Dijkstra O((N+M)log N)。

### 空間

道路、補助辺、dist O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\le N\le2\times10 ^ 5; 0\le M\le2\times10 ^ 5; 1\le u _ i\lt v _ i\le N\ (1\le i\le M); 1\le T _ i\le10 ^ 9\ (1\le i\le M); 1\le X _ i\le10 ^ 9\ (1\le i\le N); 1\le Y\le 10 ^ 9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

二頂点、通常道路費用20、X=(2,3)、Y=4。

1. 特別route費用2+4+3=9。
2. 通常道路20と比較。
3. Dijkstraは入口cost2、出口6、頂点2へ9。

期待される結果: 9

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

入口出口を一頂点にまとめてY辺を消せるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。特別移動の固定費用Yを失う。方向を保つ中央辺が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/tasks/abc463_e) — source-abc463-e-problem-b1c78b5d7f7d16c1826aad1e574e294a196536ae928b9132155e9f5063f3a837
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/editorial/21940) — source-abc463-editorial-21940-9ad8dc40350b56bbaa375436bfc75c2502805d6c694896eb049af73188c90b96
