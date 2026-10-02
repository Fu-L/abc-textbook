---
title: "ABC386-G — Many MST"
draft: true
authoringUnit: {"problemId":"abc386-g","docPath":"src/content/docs/problems/mathematics/outcome-count-labeled-structures-by-components/outcome-count-labeled-structures-by-components-shard-001/abc386-g.md","learningOutcomeIds":["outcome-count-labeled-structures-by-components","outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions"],"excludedTopics":["label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-contribution-reordering","tag-labeled-component-decomposition","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc386-editorial-11690-735344c6a541a928331f8cc43afb46668a5259454f97d0e988843c3e9502bc1c","source-abc386-g-problem-4fe3a667a55c7a659d2989372828511e074d4a9b1e7389fd83c4b0b640f28822"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Kruskalで重みk未満のgraphの成分数は、MSTでk以上の辺を何本必要とするかに1を加えた値。threshold和と定数補正が各graphのMST重みに一致する。成分数総和は成分subsetを先に固定し、内部connected重み数・境界高重み・外側自由辺数を掛けて数える。anchor再帰が内部connected数を一度抽出するので全graphのMST総和が得られる。","sourceRevisionIds":["source-abc386-editorial-11690-735344c6a541a928331f8cc43afb46668a5259454f97d0e988843c3e9502bc1c","source-abc386-g-problem-4fe3a667a55c7a659d2989372828511e074d4a9b1e7389fd83c4b0b640f28822"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-labeled-structures-by-components","outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、各辺重み1または2。","procedure":["2重み辺0本は1graphでMST2、1本は3graphでMST2。","2本は3graphでMST3、3本は1graphでMST4。"],"executionTarget":null,"expectedResult":"2+6+9+4=21。","verificationStatus":"not_applicable","learningUnitIds":["unit-labeled-component-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-labeled-structures-by-components","outcome-reorder-counting-contributions"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-generating-functions"],"attainmentCondition":"N=2,M=2でshift補正を確認せよ。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"3。"},"answer":{"reasoningOrVerification":"唯一の辺の重み1,2の二graphでMST和3。0,1へshiftした和1にgraphごとのN−1=1を二回戻す。","procedure":["具体例の各状態・寄与を再計算する。","唯一の辺の重み1,2の二graphでMST和3。0,1へshiftした和1にgraphごとのN−1=1を二回戻す。"],"expectedResult":"3。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [label付き連結成分分解・exponential formula](src/content/docs/learn/combinatorics-algebra/labeled-component-decomposition.md)

- 最小labelを含む成分を一意に切り出し、全構造とconnected構造の関係をsubset DPまたは指数型母関数で解ける。
- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md)

対象外:

- label付き連結成分分解・exponential formulaの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

M通りの各辺重みについてM^{N choose 2} graphを直接列挙できない。MST重みはthreshold k未満の辺からなるgraph G_kの連結成分数の和として表せ、重み付き問題を各kの無向graph数え上げへ分解できる。

Σ_G c(G_k)はgraphを先に数えるのでなく、その連結成分として選ばれる連結部分graph Hを先に固定する主客転倒で扱える。

採用する候補: MST重みをthreshold成分数へ変換し、連結graphの重み付き数え上げDPを各kで行う

頂点数sの指定連結成分の寄与を、頂点1を含む成分を引く標準DPでO(N^2)計算でき、全kでもO(N^2M)がN,M≤500に適合する。

棄却する候補: 各edge重み付けを列挙してKruskal法を実行する

候補はM^{N(N-1)/2}個で指数的であり、個々のMSTを構成できない。

0..M-1重みへshiftすると、MST重みはΣ_{k=1}^M c(G_k)-Mとなり、最後に元の重みshift分を補正する。

f(s)はs頂点の内部edgeがk未満/以上の重みを持つ連結graphの重み和で、全graphから頂点1の連結成分size i<sを指定する寄与を引いて求める。

binomialと冪を前計算する。k=1..Mごとにf[1..N]を連結成分DPで求め、size sの成分を選ぶC(N,s)、外部とのedgeをk以上にする冪、残り内部edgeの自由度を掛けてΣ_G c(G_k)へ加える。threshold和とshift補正をmodで合成する。

## 典型の発動条件

### MST重みのthreshold積分

発動条件: 全edge重みの分布上でMST総和・期待値を数えたいとき。

各thresholdでの連結成分数を足す式へ変換する。

### 連結graph数え上げDP

発動条件: labelled graphの全体からconnectedなものだけを取り出すとき。

頂点1を含むcomponentを固定し、非連結caseをsize別に引く。

### 主客転倒

発動条件: graphごとのcomponent数総和を直接数えにくいとき。

component候補Hを固定して、それを成分に持つgraph数を数える。

## 問題固有の要素

MSTそのものの組合せを追わず、Kruskalで各重み層が答えへ寄与する量を連結成分数として線形化する。

別の問題へ持ち帰る視点: 全入力に対する最適構造の総和では、目的値をthreshold indicatorの和へ分解し、各層の構造数を数える。

## 正当性

Kruskalで重みk未満のgraphの成分数は、MSTでk以上の辺を何本必要とするかに1を加えた値。threshold和と定数補正が各graphのMST重みに一致する。成分数総和は成分subsetを先に固定し、内部connected重み数・境界高重み・外側自由辺数を掛けて数える。anchor再帰が内部connected数を一度抽出するので全graphのMST総和が得られる。

## 実装上の注意

- 重みを0..M-1へshiftした補正符号、k未満/以上の選択肢数kとM-k、edge本数の指数を混同しない。0^0は1として扱う。

## 復習の核

- N≤4,M≤3で全edge重みを列挙してKruskal結果を足し、各kの成分数総和と最終shift補正を独立に照合する。

## 計算量と制約

### 時間

O(MN²+MN log M)を上界とする。各thresholdでanchor連結成分DPを行う。

### 空間

O(N²+MN)。冪表をthreshold単位で持てばO(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 500; 1 \le M \le 500; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、各辺重み1または2。

1. 2重み辺0本は1graphでMST2、1本は3graphでMST2。
2. 2本は3graphでMST3、3本は1graphでMST4。

期待される結果: 2+6+9+4=21。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=2,M=2でshift補正を確認せよ。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

唯一の辺の重み1,2の二graphでMST和3。0,1へshiftした和1にgraphごとのN−1=1を二回戻す。

確認結果: 3。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/editorial/11690) — source-abc386-editorial-11690-735344c6a541a928331f8cc43afb46668a5259454f97d0e988843c3e9502bc1c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/tasks/abc386_g) — source-abc386-g-problem-4fe3a667a55c7a659d2989372828511e074d4a9b1e7389fd83c4b0b640f28822
