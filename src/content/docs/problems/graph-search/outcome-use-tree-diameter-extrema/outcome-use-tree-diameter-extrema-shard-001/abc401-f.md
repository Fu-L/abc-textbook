---
title: "ABC401-F — Add One Edge 3"
draft: true
authoringUnit: {"problemId":"abc401-f","docPath":"src/content/docs/problems/graph-search/outcome-use-tree-diameter-extrema/outcome-use-tree-diameter-extrema-shard-001/abc401-f.md","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。"],"tagIds":["tag-tree-metric-diameter","tag-contribution-reordering"],"sourceRevisionIds":["source-abc401-editorial-12686-947690906b5f4e3221530f4049b0833ce4f7acd8743b0ddf19dcb9db001a05a8","source-abc401-f-problem-adef891681b8a3808bff938b89092b507738bebe28945f9a1407a965e1aaa9c2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一辺i–jで結合した直径は元二直径の最大Dと、跨ぐ最長距離ecc1[i]+1+ecc2[j]のmax。tree最遠距離は直径二端から得る。Bをsortするとmaxの切替点が一つになり個数Dとsuffix和を厳密に集計できる。","sourceRevisionIds":["source-abc401-editorial-12686-947690906b5f4e3221530f4049b0833ce4f7acd8743b0ddf19dcb9db001a05a8","source-abc401-f-problem-adef891681b8a3808bff938b89092b507738bebe28945f9a1407a965e1aaa9c2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"各木は二頂点一辺、全辺長1。","procedure":["両ecc列は(1,1)、元D=1。","どの結合pairも跨ぐ直径1+1+1=3。","4pairを足す。"],"executionTarget":null,"expectedResult":"総直径和12","verificationStatus":"not_applicable","learningUnitIds":["unit-tree-metric"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-use-tree-diameter-extrema"],"prerequisiteIds":["unit-contribution-reordering"],"attainmentCondition":"元直径Dを無視して跨ぐ値だけ足せるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。長い木の中心同士をつなぐと跨ぐ値が元直径より短い場合がある。maxを取る。"},"answer":{"reasoningOrVerification":"不可。長い木の中心同士をつなぐと跨ぐ値が元直径より短い場合がある。maxを取る。","procedure":["具体例の各状態・寄与を再計算する。","不可。長い木の中心同士をつなぐと跨ぐ値が元直径より短い場合がある。maxを取る。"],"expectedResult":"不可。長い木の中心同士をつなぐと跨ぐ値が元直径より短い場合がある。maxを取る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [基準点からの木距離・剰余類・直径・中心](src/content/docs/learn/tree/tree-metric.md)

- 一回または二回の木探索で少数の基準点からの距離を求め、一意経路・直径端点・中心の性質から頂点分類や最遠距離条件を整理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

対象外:

- 根付き木の子状態を合成する木DP、およびLCA・HLDによるパスの区間分解。

## 考察

二treeをedge(i,j)で結んだ後のdiameterは、元diameter d1,d2か、そのedgeを通るpathのどれかである。 edgeを通る最長pathはiのeccentricity A_i＋1＋jのeccentricity B_jなのでf(i,j)=max(D,A_i+B_j+1), D=max(d1,d2)。 treeの任意vertex vのeccentricityはdiameter両端u,wへのdistanceのmaxである。 threshold jはA_iが増えるほど単調なのでtwo-pointerでも総線形、binary searchでも十分高速である。

採用する候補: 各treeのdiameter端点から全vertex eccentricityを求め、sort＋prefix sumで全pair maxを集計する

Bを昇順にすると各A_iについてA_i+B_j+1≥Dとなる境界を二分探索でき、下側はD×個数、上側はB prefix/suffix sumでO(log N)集計できる。

棄却する候補: 各(i,j)で結合treeのdiameterをBFSし直す

N1N2 pairそれぞれ線形探索となり到底間に合わない。

treeの任意vertex vのeccentricityはdiameter両端u,wへのdistanceのmaxである。

threshold jはA_iが増えるほど単調なのでtwo-pointerでも総線形、binary searchでも十分高速である。

各treeで二回BFS/DFSしてdiameter endpointsとdを得て、両端からdistanceを計算しeccentricity列A,Bを作る。Bをsortしprefix sumを作り、各aのlower_bound(D-a-1)でmaxの和を足す。

## 典型の発動条件

### diameter endpointsによるeccentricity

発動条件: treeの全vertexから最遠点distanceを求めたいとき。

diameter二端へのdistanceのmaxを使う。

### max(const,a+b)のsort集計

発動条件: 全pairにthreshold付き線形式を足したいとき。

一方をsortし境界とprefix sumで二群を計算する。

## 問題固有の要素

追加edgeを通るdiameter候補は両treeで接続点から最も遠い方向を独立に選べるため、各vertexのeccentricity一値だけで十分である。

別の問題へ持ち帰る視点: 二構造を一edgeで繋ぐ全pairqueryでは、cross pathのendpoint最適化を各側のsummaryへ分離する。

## 正当性

一辺i–jで結合した直径は元二直径の最大Dと、跨ぐ最長距離ecc1[i]+1+ecc2[j]のmax。tree最遠距離は直径二端から得る。Bをsortするとmaxの切替点が一つになり個数Dとsuffix和を厳密に集計できる。

## 実装上の注意

- tree size1ではdiameter endpointとdistance0を扱う。総和はpair数×distanceで64 bit整数を使い、threshold等号をmax側に含める。

## 復習の核

- 小tree全pairを実際に結んで全点対distanceを求め、single vertex、path、starの式を比較する。

## 計算量と制約

### 時間

木サイズN,M。二木eccentricity O(N+M)、B sort O(M log M)、各A二分探索 O(N log M)。

### 空間

二木、eccentricity、prefix和 O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N_1, N_2 \le 2 \times 10^{5}; 1 \le u_{1,i}, v_{1,i} \le N_1; 1 \le u_{2,i}, v_{2,i} \le N_2; Both given graphs are trees.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

各木は二頂点一辺、全辺長1。

1. 両ecc列は(1,1)、元D=1。
2. どの結合pairも跨ぐ直径1+1+1=3。
3. 4pairを足す。

期待される結果: 総直径和12

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

元直径Dを無視して跨ぐ値だけ足せるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。長い木の中心同士をつなぐと跨ぐ値が元直径より短い場合がある。maxを取る。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc401/editorial/12686) — source-abc401-editorial-12686-947690906b5f4e3221530f4049b0833ce4f7acd8743b0ddf19dcb9db001a05a8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc401/tasks/abc401_f) — source-abc401-f-problem-adef891681b8a3808bff938b89092b507738bebe28945f9a1407a965e1aaa9c2
