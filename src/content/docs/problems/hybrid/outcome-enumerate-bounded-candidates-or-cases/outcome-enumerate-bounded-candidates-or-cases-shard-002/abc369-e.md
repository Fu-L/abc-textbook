---
title: "ABC369-E — Sightseeing Tour"
draft: true
authoringUnit: {"problemId":"abc369-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc369-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-shortest-path"],"sourceRevisionIds":["source-abc369-e-problem-91586391e0380c03e57b0037a7cf36736b092e413fd475d1e190499057107efc","source-abc369-editorial-10842-61a4d0201858282fe5bae420312bd8fc0692a6e12ae02a319c95b832ef07e1f1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"順番と向きをx_1→y_1,...,x_K→y_Kと固定すれば、費用はdist(1,x_1)+Σ(edgeCost+dist(y_i,x_{i+1}))+edgeCost_K+dist(y_K,N)で一意に最小化される。 指定橋は通常移動中に先に通ってもよいが、最適walkで「必須として数える最初の通過順」を選べば列挙候補に含まれ、距離表利用は正当である。 大きいgraph部分を共通距離表へ圧縮し、query固有の組合せは小さいKだけに限定できる。","sourceRevisionIds":["source-abc369-e-problem-91586391e0380c03e57b0037a7cf36736b092e413fd475d1e190499057107efc","source-abc369-editorial-10842-61a4d0201858282fe5bae420312bd8fc0692a6e12ae02a319c95b832ef07e1f1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"島1,2,3、辺12=2,23=3,13=1、必須橋23。","procedure":["1→2の最短2、必須2→3が3で合計5。","逆向きは1→3=1,3→2=3,2→3の最短3で7。"],"executionTarget":null,"expectedResult":"最短5。","verificationStatus":"not_applicable","learningUnitIds":["unit-bounded-enumeration"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"prerequisiteIds":["unit-weighted-shortest-path"],"attainmentCondition":"通常移動中に必須橋を先に通っても候補を禁止するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"禁止しない。最初の必須通過順を採れば列挙候補へ含まれ、余分な通過があってもvalid walkである。"},"answer":{"reasoningOrVerification":"禁止しない。最初の必須通過順を採れば列挙候補へ含まれ、余分な通過があってもvalid walkである。","procedure":["具体例の各状態・寄与を再計算する。","禁止しない。最初の必須通過順を採れば列挙候補へ含まれ、余分な通過があってもvalid walkである。"],"expectedResult":"禁止しない。最初の必須通過順を採れば列挙候補へ含まれ、余分な通過があってもvalid walkである。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

指定橋以外の移動には制約がないので、全頂点pairの通常最短距離を前計算すれば、指定橋間の移動は端点間距離の参照に置き換えられる。

queryで必須な橋は高々5本であり、最適walkはそれらを渡る順列と各橋を渡る向きの全候補から選べる。

採用する候補: 全点対最短距離を前計算し、各queryで必須橋の順列と向きを列挙して接続距離を評価する。

大きいgraph部分を共通距離表へ圧縮し、query固有の組合せは小さいKだけに限定できる。

棄却する候補: queryごとに「何本の指定橋を通過済みか」を状態にして元graph上を最短路探索する。

最大3000 queryで大きいgraph探索を繰り返し、K≤5だから可能な小さな順序列挙を活かせない。

順番と向きをx_1→y_1,...,x_K→y_Kと固定すれば、費用はdist(1,x_1)+Σ(edgeCost+dist(y_i,x_{i+1}))+edgeCost_K+dist(y_K,N)で一意に最小化される。

指定橋は通常移動中に先に通ってもよいが、最適walkで「必須として数える最初の通過順」を選べば列挙候補に含まれ、距離表利用は正当である。

Floyd-Warshallでdist[u][v]を全pairについて求める。各queryのK橋indexをpermutationし、各bit maskで端点方向を決め、島1から各橋入口、橋出口から次入口、最後の出口から島Nまでのdistと橋重みを足す。全候補最小を出力する。

## 典型の発動条件

### 全点対最短路による経路segment圧縮

発動条件: 多数queryで少数の必須edge・地点を任意順に訪れるとき。

制約のない区間をendpoint間distのlookupへ置き換える。

### 小Kの順列・向き全探索

発動条件: 必須対象数だけが非常に小さく、順序とorientationが未知なとき。

permutationとbit maskを直積列挙して各固定caseを評価する。

## 問題固有の要素

元graphの辺数は大きいがN=400なので、query前にmetric closureを作ることでqueryをK個の橋だけの問題にできる。

別の問題へ持ち帰る視点: static graph上の多数routing queryでは、端点候補が小さくなる前にmetric closureを検討する。

## 正当性

順番と向きをx_1→y_1,...,x_K→y_Kと固定すれば、費用はdist(1,x_1)+Σ(edgeCost+dist(y_i,x_{i+1}))+edgeCost_K+dist(y_K,N)で一意に最小化される。 指定橋は通常移動中に先に通ってもよいが、最適walkで「必須として数える最初の通過順」を選べば列挙候補に含まれ、距離表利用は正当である。 大きいgraph部分を共通距離表へ圧縮し、query固有の組合せは小さいKだけに限定できる。

## 実装上の注意

- 平行辺があればdist初期化をminにし、dist[i][i]=0とする。橋重みは順序によらず一度ずつ足し、64 bitでINF加算を避ける。

## 復習の核

- K=1で両方向の式を手計算し、開始1・終了Nとの接続を確認する。permutation配列はqueryごとに初期sortして全候補を生成する。

## 計算量と制約

### 時間

O(N³+Σ_query K!2ᴷK)、K≤5は指定橋数。

### 空間

O(N²+M)、距離と辺情報。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 400; N-1 \leq M \leq 2 \times 10^5; 1 \leq U_i < V_i \leq N; 1 \leq T_i \leq 10^9; 1 \leq Q \leq 3000; 1 \leq K_i \leq 5; 1 \leq B_{i,1} < B_{i,2} < \cdots < B_{i,K_i} \leq M; All input values are integers.; It is possible to travel between any two islands using some bridges.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

島1,2,3、辺12=2,23=3,13=1、必須橋23。

1. 1→2の最短2、必須2→3が3で合計5。
2. 逆向きは1→3=1,3→2=3,2→3の最短3で7。

期待される結果: 最短5。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

通常移動中に必須橋を先に通っても候補を禁止するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

禁止しない。最初の必須通過順を採れば列挙候補へ含まれ、余分な通過があってもvalid walkである。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc369/tasks/abc369_e) — source-abc369-e-problem-91586391e0380c03e57b0037a7cf36736b092e413fd475d1e190499057107efc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc369/editorial/10842) — source-abc369-editorial-10842-61a4d0201858282fe5bae420312bd8fc0692a6e12ae02a319c95b832ef07e1f1
