---
title: "ABC374-G — Only One Product Name"
draft: true
authoringUnit: {"problemId":"abc374-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc374-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-scc-condensation","unit-transitive-closure"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-scc-condensation","tag-transitive-closure"],"sourceRevisionIds":["source-abc374-editorial-11099-08ffa618d6266b4f574965ba7db128d0fd6d4897a29e321b44770b9f29b48990","source-abc374-g-problem-ef990b1fe81062fb5fa496062ddb53c9751bba11b379a7113f4381ffff2dda7b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"SCC内はwalkで全商品を訪ねられる。異SCCの順序はDAG到達に一致し、到達closureのpath coverへ帰着する。一matching辺で二chainを結びcycleはDAGなので生じない。最少chain数C−maximum matchingが最少walk数。","sourceRevisionIds":["source-abc374-editorial-11099-08ffa618d6266b4f574965ba7db128d0fd6d4897a29e321b44770b9f29b48990","source-abc374-g-problem-ef990b1fe81062fb5fa496062ddb53c9751bba11b379a7113f4381ffff2dda7b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-bipartite-matching"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"縮約DAGは1→2→3。","procedure":["closure辺は1→2,2→3,1→3。","matchingは1左–2右と2左–3右で2。","C−2=1。"],"executionTarget":null,"expectedResult":"1walk","verificationStatus":"not_applicable","learningUnitIds":["unit-bipartite-matching"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-bipartite-matching"],"prerequisiteIds":["unit-bipartite-structure","unit-scc-condensation","unit-transitive-closure"],"attainmentCondition":"直辺だけでmatchingしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一般に足りない。途中SCCを歩いて到達する連結可能性も必要で推移閉包を使う。"},"answer":{"reasoningOrVerification":"一般に足りない。途中SCCを歩いて到達する連結可能性も必要で推移閉包を使う。","procedure":["具体例の各状態・寄与を再計算する。","一般に足りない。途中SCCを歩いて到達する連結可能性も必要で推移閉包を使う。"],"expectedResult":"一般に足りない。途中SCCを歩いて到達する連結可能性も必要で推移閉包を使う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)
- [SCC・縮約DAG・トポロジカル順序](src/content/docs/learn/graph/scc-condensation.md)
- [推移閉包](src/content/docs/learn/graph/transitive-closure.md)

対象外:

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

使用済み二文字名を頂点とし、後字と前字が一致する頂点間に辺を張ると、NG文字列はグラフ上の walk に一致する。必要なのは全頂点を少なくとも一度覆う walk の最小本数である。 SCC 内では任意の入口・出口をつなぎつつ全頂点を通る walk を作れるので、一つの path-cover 頂点へ縮約できる。 DAG の最小 path cover 数は |V|-最大二部マッチングであり、辺には直接辺でなく到達可能関係を使う。

採用する候補: グラフを SCC 縮約して到達可能関係の DAG を作り、その最小 path cover を二部最大マッチングから求める。

一つの SCC 内は一本の walk で全頂点を巡れ、SCC 間の walk 結合可能性は DAG の到達関係だけで決まる。

棄却する候補: 各文字を頂点、使用済み二文字名を辺として Euler 路分解を求める。

同じ商品名を NG 文字列中で複数回使ってよく、目的は辺を一度ずつ覆うことではないため Euler 路問題とは一致しない。

SCC 内では任意の入口・出口をつなぎつつ全頂点を通る walk を作れるので、一つの path-cover 頂点へ縮約できる。

DAG の最小 path cover 数は |V|-最大二部マッチングであり、辺には直接辺でなく到達可能関係を使う。

商品名頂点の遷移グラフを構築して SCC 分解する。縮約 DAG の推移閉包を求め、到達可能な成分対に二部辺を張って最大マッチングを計算し、成分数から引く。

## 典型の発動条件

### walk cover の SCC 縮約

発動条件: 頂点の重複訪問を許す複数 walk で全頂点を覆いたいとき。

強連結内部を一単位にし、成分間到達を path cover へ渡す。

### DAG 最小 path cover

発動条件: DAG の頂点を最小本数の互いに素な有向 path で覆うとき。

到達関係の二部グラフで |V|-maximum matching を用いる。

## 問題固有の要素

文字列の隣接二文字列を、辺ではなく「使用済み商品名という頂点」の walk としてモデル化する。

別の問題へ持ち帰る視点: walk は再訪可能なので SCC の内部順序を忘れ、成分間の到達可能性だけを残せる。

## 正当性

SCC内はwalkで全商品を訪ねられる。異SCCの順序はDAG到達に一致し、到達closureのpath coverへ帰着する。一matching辺で二chainを結びcycleはDAGなので生じない。最少chain数C−maximum matchingが最少walk数。

## 実装上の注意

- 同じ二文字列は一頂点で、遷移辺の重複は除いてよい。path cover 用の辺は縮約 DAG の直接辺だけでなく推移閉包で張る。

## 復習の核

- 元文字列から商品名頂点列を作る対応を両方向に確認し、Euler 路との違いを「再訪可・頂点被覆」で整理する。

## 計算量と制約

### 時間

商品名graph V頂点E辺、SCC数C。SCC O(V+E)、DAG到達O(C(C+E))、closure matching O(C²√C)。

### 空間

元graph、closureとmatching O(V+E+C²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 26^2; N is an integer.; Each S_i is a string of length 2 consisting of uppercase English letters.; All S_1,S_2,\ldots,S_N are distinct.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

縮約DAGは1→2→3。

1. closure辺は1→2,2→3,1→3。
2. matchingは1左–2右と2左–3右で2。
3. C−2=1。

期待される結果: 1walk

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

直辺だけでmatchingしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一般に足りない。途中SCCを歩いて到達する連結可能性も必要で推移閉包を使う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/editorial/11099) — source-abc374-editorial-11099-08ffa618d6266b4f574965ba7db128d0fd6d4897a29e321b44770b9f29b48990
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/tasks/abc374_g) — source-abc374-g-problem-ef990b1fe81062fb5fa496062ddb53c9751bba11b379a7113f4381ffff2dda7b
