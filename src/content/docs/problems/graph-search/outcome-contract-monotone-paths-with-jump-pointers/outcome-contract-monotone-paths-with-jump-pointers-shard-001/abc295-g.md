---
title: "ABC295-G — Minimum Reachable City"
draft: true
authoringUnit: {"problemId":"abc295-g","docPath":"src/content/docs/problems/graph-search/outcome-contract-monotone-paths-with-jump-pointers/outcome-contract-monotone-paths-with-jump-pointers-shard-001/abc295-g.md","learningOutcomeIds":["outcome-contract-monotone-paths-with-jump-pointers"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-dsu-components"],"excludedTopics":["単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-monotone-path-contraction","tag-amortized-monotone-progress","tag-dsu-components"],"sourceRevisionIds":["source-abc295-editorial-6052-e8a82887ceedd6e246d7ee23d6abb37b105a7c8de6a510a6a1a6cd79cf4fb735","source-abc295-g-problem-1e1a3e055f7aad2cd56a4f89ed9743a56d6ccc6b472446f9aa7eb01f150272ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"追加u→vで親向きのv→u pathがcycleになり、pathの既存SCCだけを併合する。SCC最小labelは最上位なのでそれから親境界を辿れば必要成分を漏れなく吸収する。吸収済境界は代表でskipされ二度処理しない。","sourceRevisionIds":["source-abc295-editorial-6052-e8a82887ceedd6e246d7ee23d6abb37b105a7c8de6a510a6a1a6cd79cf4fb735","source-abc295-g-problem-1e1a3e055f7aad2cd56a4f89ed9743a56d6ccc6b472446f9aa7eb01f150272ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-contract-monotone-paths-with-jump-pointers"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"親 p2=1,p3=2、元辺2→1,3→2、追加1→3。","procedure":["3から1へのpath全体がcycle。","三成分を一つへunion。","各点の到達可能最小labelは1。"],"executionTarget":null,"expectedResult":"質問3の答え1","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-path-contraction"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-contract-monotone-paths-with-jump-pointers"],"prerequisiteIds":["unit-amortized-monotone-progress","unit-dsu-components"],"attainmentCondition":"単に端点1,3だけunionしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。中間2も同cycleでSCCに属するためpath全体を併合する。"},"answer":{"reasoningOrVerification":"不可。中間2も同cycleでSCCに属するためpath全体を併合する。","procedure":["具体例の各状態・寄与を再計算する。","不可。中間2も同cycleでSCCに属するためpath全体を併合する。"],"expectedResult":"不可。中間2も同cycleでSCCに属するためpath全体を併合する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調path contraction・DSU jump](src/content/docs/learn/graph/monotone-path-contraction.md)

- 一度確定したpath区間を次未処理pointerまたはDSU parentで飛ばし、各頂点を高々一度だけ縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 単調path contraction・DSU jumpの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

追加辺u→vは元の親木上でvからuへのpathと交わる既存SCCを全て一つへ併合する。 各SCCは元の有向木上の連結部分木で、xから到達できる最小番号はx所属SCCの最上位頂点になる。

採用する候補: SCCをDSU、path圧縮を最小頂点jumpで管理

各SCCの最小番号が黒木上の最上位なので、それを辿ってpath上の成分だけを併合し、一度吸収された境界を再訪しない償却処理ができる。

棄却する候補: 辺追加ごとにSCC分解

Q回O(N+Q)で過大。

各SCCは元の有向木上の連結部分木で、xから到達できる最小番号はx所属SCCの最上位頂点になる。

DSU各rootに成分最小頂点を持つ。追加クエリではv側成分からuを含む成分まで最小頂点と親を使って上りながらunionし、出力はfind(x)の最小頂点を返す。

## 典型の発動条件

### DSUによる単調SCC併合

発動条件: 辺追加でSCCが分裂せず併合だけする。

連結成分と最小頂点をunionで維持する。

### path compression jump

発動条件: 木path上の未併合境界を繰り返し越える。

吸収済み区間を代表値で飛ばし総移動を償却する。

## 問題固有の要素

p_i≤iにより頂点番号が木の祖先方向と対応し、SCC最小番号がpath探索のjump pointerを兼ねる。

別の問題へ持ち帰る視点: 単調併合問題では成分の極値を次の未処理位置として使う。

## 正当性

追加u→vで親向きのv→u pathがcycleになり、pathの既存SCCだけを併合する。SCC最小labelは最上位なのでそれから親境界を辿れば必要成分を漏れなく吸収する。吸収済境界は代表でskipされ二度処理しない。

## 実装上の注意

- クエリの到達保証が示すu,vの祖先方向を取り違えず、union後の最小頂点を即更新する。

## 復習の核

- 小木で毎回SCCを再計算し、鎖・枝分かれ・既に同SCCの追加・長path一括併合を比較する。

## 計算量と制約

### 時間

N頂点Q操作。吸収境界は高々N−1、DSU操作で O((N+Q)α(N))。

### 空間

親木、DSUと成分最小 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2\leq N \leq 2\times 10^5; 1\leq Q \leq 2\times 10^5; 1\leq p_i\leq i; For each query in the first format: 1\leq u,v \leq N. u \neq v. On G_S, vertex u is reachable from vertex v via some edges.; 1\leq u,v \leq N.; u \neq v.; On G_S, vertex u is reachable from vertex v via some edges.; For each query in the second format, 1\leq x \leq N.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

親 p2=1,p3=2、元辺2→1,3→2、追加1→3。

1. 3から1へのpath全体がcycle。
2. 三成分を一つへunion。
3. 各点の到達可能最小labelは1。

期待される結果: 質問3の答え1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

単に端点1,3だけunionしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。中間2も同cycleでSCCに属するためpath全体を併合する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/editorial/6052) — source-abc295-editorial-6052-e8a82887ceedd6e246d7ee23d6abb37b105a7c8de6a510a6a1a6cd79cf4fb735
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/tasks/abc295_g) — source-abc295-g-problem-1e1a3e055f7aad2cd56a4f89ed9743a56d6ccc6b472446f9aa7eb01f150272ba
