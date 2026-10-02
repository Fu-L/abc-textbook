---
title: "ABC431-E — Reflection on Grid"
draft: true
authoringUnit: {"problemId":"abc431-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-002/abc431-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc431-e-problem-aea5e8bc55c0fa23b159bfddf8b55bc876c2e47eea1ef3ef0541c2e1a4d1bf24","source-abc431-editorial-14483-a92eb04ac846e8663319adb90bc5e8e2a713a25188f00fa53d73c9d38bde3b8e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同マスでも入方向が違うと元鏡で出られる方向が変わるので方向状態が必要。元鏡に一致する接続0、別鏡1は必要変更数と対応し、最短routeを単純化する公式議論で固定鏡配置に戻せる。出口の向きまで一致する最短costが答え。","sourceRevisionIds":["source-abc431-e-problem-aea5e8bc55c0fa23b159bfddf8b55bc876c2e47eea1ef3ef0541c2e1a4d1bf24","source-abc431-editorial-14483-a92eb04ac846e8663319adb90bc5e8e2a713a25188f00fa53d73c9d38bde3b8e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"H=1,W=2、鏡列AA。","procedure":["左から右へ第一Aを直進。","第二Aも直進して右側出口。","元鏡を全て保つ。"],"executionTarget":null,"expectedResult":"0","verificationStatus":"not_applicable","learningUnitIds":["unit-weighted-shortest-path"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"同じ1×2で鏡列BAなら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"第一Bは下へ曲げて盤外へ出すので第一をAへ変更する必要があり1。"},"answer":{"reasoningOrVerification":"第一Bは下へ曲げて盤外へ出すので第一をAへ変更する必要があり1。","procedure":["具体例の各状態・寄与を再計算する。","第一Bは下へ曲げて盤外へ出すので第一をAへ変更する必要があり1。"],"expectedResult":"第一Bは下へ曲げて盤外へ出すので第一をAへ変更する必要があり1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

光線がマスへ入る方向まで含めれば、その後の遷移先は鏡の置き方で決まる。元の鏡を使う遷移は変更数 0、別の置き方を選ぶ遷移は変更数 1 とみなせる。 同じマスを経路中に再訪して異なる変更要求が起きる懸念は、最短路を単純路にできるため状態グラフの最短コストとして扱える。 反対方向へそのまま戻る出射は不可で、残りの出射方向のうち現在の鏡型に対応するものだけがコスト 0 である。

採用する候補: 状態 (x,y,入射方向) を頂点とし、可能な出射方向への辺重みを鏡変更の要否 0/1 として 01-BFS する。

経路上で変更したマス数が辺重み和に一致し、重みが 0/1 なので線形時間最短路になる。

棄却する候補: 変更するマス集合を列挙し、そのたび光線をシミュレーションする。

鏡配置が指数通りあり、同じ部分経路を繰り返し調べる。

同じマスを経路中に再訪して異なる変更要求が起きる懸念は、最短路を単純路にできるため状態グラフの最短コストとして扱える。

反対方向へそのまま戻る出射は不可で、残りの出射方向のうち現在の鏡型に対応するものだけがコスト 0 である。

四方向を符号化して dist[x][y][dir] を INF で初期化する。各状態から逆向き以外の ndir へ、鏡 A/B/C がその組を接続するなら 0、変更が必要なら 1 の辺で隣接マス状態へ進み、deque による 01-BFS で出口までの最小値を求める。

## 典型の発動条件

### 状態拡張グラフ

発動条件: 位置だけでは次の遷移が決まらず、到着方向など小さな履歴が必要なとき。

グリッド辺の向きを状態へ加え、鏡による入射―出射の対応を通常の有向辺にする。

### 01-BFS

発動条件: 辺コストが 0 または 1 の最短路を求めるとき。

元配置の遷移を deque 前方、変更を要する遷移を後方へ追加する。

## 問題固有の要素

『鏡を変える』という配置選択を先に決めず、光線が使う局所遷移へ変更コストを課すと最短路になる。

別の問題へ持ち帰る視点: 局所設定の変更回数最小化は、設定を使う状態遷移に 0/1 コストを付ける形へ帰着できることがある。

## 正当性

同マスでも入方向が違うと元鏡で出られる方向が変わるので方向状態が必要。元鏡に一致する接続0、別鏡1は必要変更数と対応し、最短routeを単純化する公式議論で固定鏡配置に戻せる。出口の向きまで一致する最短costが答え。

## 実装上の注意

- 方向番号と xor による鏡型判定を表と照合し、盤外へ出る遷移を終点として扱う。距離更新時だけ deque へ追加する。

## 復習の核

- コスト 0 の出射方向が各鏡型に対して正しいか、逆戻り方向を候補から除いているかを確認する。

## 計算量と制約

### 時間

盤面V=HW、四方向状態4V、各定数遷移。01-BFS O(HW)。

### 空間

方向distとdeque、盤面 O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T; 1\leq H,W; HW\leq 2\times 10^5; S_i is a string of length W consisting of A, B, C.; T, H, and W are integers.; The sum of HW over all test cases is at most 2\times 10^5.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

H=1,W=2、鏡列AA。

1. 左から右へ第一Aを直進。
2. 第二Aも直進して右側出口。
3. 元鏡を全て保つ。

期待される結果: 0

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ1×2で鏡列BAなら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

第一Bは下へ曲げて盤外へ出すので第一をAへ変更する必要があり1。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/tasks/abc431_e) — source-abc431-e-problem-aea5e8bc55c0fa23b159bfddf8b55bc876c2e47eea1ef3ef0541c2e1a4d1bf24
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/editorial/14483) — source-abc431-editorial-14483-a92eb04ac846e8663319adb90bc5e8e2a713a25188f00fa53d73c9d38bde3b8e
