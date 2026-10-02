---
title: "ABC287-EX — Directed Graph and Query"
draft: true
authoringUnit: {"problemId":"abc287-ex","docPath":"src/content/docs/problems/graph-search/outcome-compute-transitive-closure/outcome-compute-transitive-closure-shard-001/abc287-ex.md","learningOutcomeIds":["outcome-compute-transitive-closure"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bitset-word-parallel","unit-event-sweep"],"excludedTopics":["推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-transitive-closure","tag-bitset-word-parallel","tag-event-sweep"],"sourceRevisionIds":["source-abc287-editorial-5635-87e762447ee5c71e40ec9615ff2d1e5e1f5364b1fdc004b0565ed82bbbd24090","source-abc287-ex-problem-088a9f5f7b92ce562b44a495e34373f0201ba7422b503c4bf3b34a28058b29fc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"外側k段のWarshallは中継番号≤kだけを許すpathを表す。最大頂点番号を最小化する目的は、端点も≤kとなる最初の到達段に一致する。row ORは全jのboolean更新と同値なのでbit並列化しても不変条件を保つ。最初の成立段を固定すれば最小値。","sourceRevisionIds":["source-abc287-editorial-5635-87e762447ee5c71e40ec9615ff2d1e5e1f5364b1fdc004b0565ed82bbbd24090","source-abc287-ex-problem-088a9f5f7b92ce562b44a495e34373f0201ba7422b503c4bf3b34a28058b29fc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compute-transitive-closure"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"有向辺1→3,3→2。質問1→2。","procedure":["k=1,2では1→2の中継pathなし。","k=3で1→3→2が許される。","両端≤3も成立。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-transitive-closure"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compute-transitive-closure"],"prerequisiteIds":["unit-bitset-word-parallel","unit-event-sweep"],"attainmentCondition":"直接辺1→5はk=1からreachにある。答え1でよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。path costは端点を含む最大番号なので最低5。k≥max(s,t)を要求する。"},"answer":{"reasoningOrVerification":"不可。path costは端点を含む最大番号なので最低5。k≥max(s,t)を要求する。","procedure":["具体例の各状態・寄与を再計算する。","不可。path costは端点を含む最大番号なので最低5。k≥max(s,t)を要求する。"],"expectedResult":"不可。path costは端点を含む最大番号なので最低5。k≥max(s,t)を要求する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [推移閉包](src/content/docs/learn/graph/transitive-closure.md)

- 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [bitsetで集合演算をword並列化する](src/content/docs/learn/query/bitset-word-parallel.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Warshall法で中継頂点を1,2,…の順に許可すると、外側loop k終了時のreach[i][j]は中継に番号≤kの頂点だけを使うpathの存在を表す。 path costには両端も含むため、query(s,t)の答えはk≥max(s,t)かつreach[s][t]になった最初のkである。 boolean reachability rowをbitsetにすると、i→kがあるときの全j更新をrow[i] |= row[k]のword並列演算へ変えられる。 最大頂点番号を最小化する問題は、番号k以下を使用可能にする単調なthreshold判定として見ると、最初に到達可能になるkが答えになる。 Warshallの更新reach[i][j] |= reach[i][k] & reach[k][j]は、reach[i][k]がtrueなrowだけreach[k]を丸ごとORすれば同値である。

採用する候補: bitset版Warshallを番号順に進め、各段階で未確定queryの初回到達を記録する。

minimax costをthreshold kの到達可能性へ変え、N≤2000のtransitive closureを64bit並列化できる。

棄却する候補: 各queryについてcost thresholdを二分探索し、許可頂点subgraphでDFSする。

最大10^4 queryごとに複数回graph探索が必要で、共通するreachability計算を再利用できない。

棄却する候補: boolean matrixをscalar三重loopでWarshall更新する。

N=2000では約N^3のboolean更新が重く、row ORによるword並列化を使える。

最大頂点番号を最小化する問題は、番号k以下を使用可能にする単調なthreshold判定として見ると、最初に到達可能になるkが答えになる。

Warshallの更新reach[i][j] |= reach[i][k] & reach[k][j]は、reach[i][k]がtrueなrowだけreach[k]を丸ごとORすれば同値である。

各direct edge a→bにbit reach[a][b]を立てる。k=1..Nについて、reach[i][k]が立つ全iでreach[i] |= reach[k]をin-place実行する。その段階で未回答queryを走査し、k≥max(s,t)かつreach[s][t]ならanswer=kを記録する。最後まで未回答なら-1を出力する。

## 典型の発動条件

### minimax値のthreshold sweep

発動条件: path costが使用要素の最大keyで、許可thresholdに対し可否が単調なとき。

頂点をkey順に追加し、初めて到達可能になる段階を答えにする。

### bitset transitive closure

発動条件: boolean Warshallのj方向更新を集合unionとして表せるとき。

到達先集合をmachine word列で持ち、row ORで一括更新する。

### Floyd–Warshallの段階不変条件

発動条件: 中継候補を順序付きで解禁し、その時点の情報へqueryしたいとき。

外側loop終了時に許可済み中継集合だけのpathを表す。

## 問題固有の要素

通常は最終closureだけを使うWarshallの途中状態が、この問題ではpath上の最大labelという最適値をちょうど符号化している。

別の問題へ持ち帰る視点: DPの各段階が制約thresholdを表すなら、完成値だけでなく「初めて成立する段階」を回答として利用できる。

## 正当性

外側k段のWarshallは中継番号≤kだけを許すpathを表す。最大頂点番号を最小化する目的は、端点も≤kとなる最初の到達段に一致する。row ORは全jのboolean更新と同値なのでbit並列化しても不変条件を保つ。最初の成立段を固定すれば最小値。

## 実装上の注意

- reachabilityだけでは端点番号のcostを反映しないため、回答条件へk≥max(s,t)を必ず入れる。
- bitsetのindexと頂点番号の0/1-indexを揃え、未回答queryだけを最初の成立時に確定する。
- in-place row ORは外側loopをkに固定し、reach[i][k]判定後に行う。

## 復習の核

- 端点番号が大きいdirect edgeと、小さい中継だけで繋がるpathを比較し、reachが早くtrueでもmax(s,t)未満では回答しないことを確認する。

## 計算量と制約

### 時間

N 頂点、Q 質問、word幅 w。bitset Warshall O(N³/w+N²)、全段質問走査 O(NQ)。

### 空間

到達bitset O(N²/w) words、質問 O(Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 4.5 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2000; 0 \leq M \leq N(N-1); 1 \leq a_i,b_i \leq N; a_i \neq b_i; If i \neq j, then (a_i,b_i) \neq (a_j,b_j).; 1 \leq Q \leq 10^4; 1 \leq s_i,t_i \leq N; s_i \neq t_i; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

有向辺1→3,3→2。質問1→2。

1. k=1,2では1→2の中継pathなし。
2. k=3で1→3→2が許される。
3. 両端≤3も成立。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

直接辺1→5はk=1からreachにある。答え1でよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。path costは端点を含む最大番号なので最低5。k≥max(s,t)を要求する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/editorial/5635) — source-abc287-editorial-5635-87e762447ee5c71e40ec9615ff2d1e5e1f5364b1fdc004b0565ed82bbbd24090
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/tasks/abc287_h) — source-abc287-ex-problem-088a9f5f7b92ce562b44a495e34373f0201ba7422b503c4bf3b34a28058b29fc
