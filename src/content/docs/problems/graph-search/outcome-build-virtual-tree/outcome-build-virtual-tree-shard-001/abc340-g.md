---
title: "ABC340-G — Leaf Color"
draft: true
authoringUnit: {"problemId":"abc340-g","docPath":"src/content/docs/problems/graph-search/outcome-build-virtual-tree/outcome-build-virtual-tree-shard-001/abc340-g.md","learningOutcomeIds":["outcome-build-virtual-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation","unit-tree-ancestor-lca","unit-tree-euler-flattening"],"excludedTopics":["virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-virtual-tree","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc340-editorial-9249-f5e2a5be1cd8f51c782110c8e5dcec99b713d85318ee4151297c7fa061066d86","source-abc340-g-problem-e70db04af46e85658e7ad8818675e163c7295eebabf06a60954d3a6c85519bf8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"degree1頂点が同色cの有効subtreeのterminalはc頂点、分岐点はそれらのLCA。圧縮辺内部はdegree2で色条件に無関係なのでvirtual treeが選択を一意保存する。P積とQ一子和で子選択0/1/2以上を区別しtopmostのleaf条件を適用する。size≥2のsubtreeは葉色一意、singletonは最後にN個を足す。","sourceRevisionIds":["source-abc340-editorial-9249-f5e2a5be1cd8f51c782110c8e5dcec99b713d85318ee4151297c7fa061066d86","source-abc340-g-problem-e70db04af46e85658e7ad8818675e163c7295eebabf06a60954d3a6c85519bf8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-virtual-tree"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、色(7,9,7)。","procedure":["singleton三個は全て有効。","二点連結subset{1,2},{2,3}は葉色不同で無効。","全体は葉1,3が色7で有効。"],"executionTarget":null,"expectedResult":"4","verificationStatus":"not_applicable","learningUnitIds":["unit-virtual-tree"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-virtual-tree"],"prerequisiteIds":["unit-rooted-tree-aggregation","unit-tree-ancestor-lca","unit-tree-euler-flattening"],"attainmentCondition":"圧縮辺内部の色9が葉色7と違っても使えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"使える。選択内degree2で葉条件の対象外。"},"answer":{"reasoningOrVerification":"使える。選択内degree2で葉条件の対象外。","procedure":["具体例の各状態・寄与を再計算する。","使える。選択内degree2で葉条件の対象外。"],"expectedResult":"使える。選択内degree2で葉条件の対象外。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [virtual tree・auxiliary tree](src/content/docs/learn/tree/virtual-tree.md)

- 対象頂点と必要なLCAだけをEuler順・stackで結び、元の木上pathを保つvirtual treeを構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)
- [ancestor query・LCA](src/content/docs/learn/tree/tree-ancestor-lca.md)
- [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)

対象外:

- virtual tree・auxiliary treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

頂点数2以上の連結誘導subtreeは少なくとも二つのleafを持ち、その共通色cは一意である。色cを固定すると、使われ得るbranch端は色c頂点だけで、必要な分岐関係はそれらとLCAからなるvirtual treeへ圧縮できる。 virtual treeで親辺も選ばれるopen状態g_vを考える。子branch選択積P=∏(1+g_child)、ちょうど一子を選ぶ和Q=Σg_childとすると、親接続時は子0ならvがleafなのでg_v=(P-1)+[A_v=c]。vをtopmostとする閉subtreeは子1の時だけvの色条件が必要で、(P-1-Q)+[A_v=c]Qとなる。

採用する候補: 色ごとにvirtual treeを構築し、leaf条件を数える木DPを行う

色cの出現数mに対しO(m)頂点へ縮約でき、全色のvirtual treeサイズ総和をO(N)に抑えられる。

棄却する候補: 各色について元のN頂点tree全体をDPする

色数がO(N)あり、合計O(N^2)になる。

virtual treeで親辺も選ばれるopen状態g_vを考える。子branch選択積P=∏(1+g_child)、ちょうど一子を選ぶ和Q=Σg_childとすると、親接続時は子0ならvがleafなのでg_v=(P-1)+[A_v=c]。vをtopmostとする閉subtreeは子1の時だけvの色条件が必要で、(P-1-Q)+[A_v=c]Qとなる。

元treeをEuler tourしLCA前計算する。各色cの頂点をtin順に並べ隣接LCAを追加・再sortしてstackでvirtual treeを作る。postorderでP,Q,gを計算し、各vのclosed countを色cの答えへ加算する。全色分のsize≥2 subtree数を合計し、degree 0で条件を満たすN個のsingletonを一度だけ加える。

## 典型の発動条件

### virtual tree

発動条件: 特定色の頂点間の祖先・分岐関係だけが必要で、全元頂点を色ごとに走査したくない。

対象頂点と隣接Euler順LCAを残し、元pathを圧縮辺にする。

### 境界degreeを持つ木DP

発動条件: connected subtreeのleafだけにmark条件があり、親辺を選ぶかで頂点degreeが変わる。

親へopenな状態とtopmostで閉じる寄与を分け、選択child数0・1・2以上を積と一次和で集計する。

## 問題固有の要素

圧縮辺内部の頂点は選ばれるならdegree 2でleafにならず、valid subtreeのtopmost leafは色c頂点、branch頂点はLCAなのでvirtual tree上の選択だけで元subtreeを一意に表せる。

別の問題へ持ち帰る視点: path内部が制約対象外のdegreeになる場合、terminalとbranching LCAだけを残す圧縮が数え上げも保つ。

## 正当性

degree1頂点が同色cの有効subtreeのterminalはc頂点、分岐点はそれらのLCA。圧縮辺内部はdegree2で色条件に無関係なのでvirtual treeが選択を一意保存する。P積とQ一子和で子選択0/1/2以上を区別しtopmostのleaf条件を適用する。size≥2のsubtreeは葉色一意、singletonは最後にN個を足す。

## 実装上の注意

- 同色頂点が一つの場合もvirtual treeを作れるようにし、singletonは色ごとに重複加算せず最後にNを足す。P,Qの更新順とmod減算を正規化する。

## 復習の核

- N=1、pathで両端同色/異色、starで選ぶleaf色、同色頂点一つ、virtual edgeが長い例を全subset列挙と比較する。

## 計算量と制約

### 時間

N頂点。LCA前計算O(N log N)、各色Euler順sort/LCAで総O(N log N)、virtual tree DP総O(N)。

### 空間

祖先表O(N log N)、全色頂点listとvirtual tree作業O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq N; 1 \leq u_i \lt v_i \leq N; The graph given in the input is a tree.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、色(7,9,7)。

1. singleton三個は全て有効。
2. 二点連結subset{1,2},{2,3}は葉色不同で無効。
3. 全体は葉1,3が色7で有効。

期待される結果: 4

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

圧縮辺内部の色9が葉色7と違っても使えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

使える。選択内degree2で葉条件の対象外。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc340/editorial/9249) — source-abc340-editorial-9249-f5e2a5be1cd8f51c782110c8e5dcec99b713d85318ee4151297c7fa061066d86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc340/tasks/abc340_g) — source-abc340-g-problem-e70db04af46e85658e7ad8818675e163c7295eebabf06a60954d3a6c85519bf8
