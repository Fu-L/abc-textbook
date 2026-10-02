---
title: "ABC413-G — Big Banned Grid"
draft: true
authoringUnit: {"problemId":"abc413-g","docPath":"src/content/docs/problems/graph-search/outcome-dualize-planar-cut-to-path/outcome-dualize-planar-cut-to-path-shard-001/abc413-g.md","learningOutcomeIds":["outcome-dualize-planar-cut-to-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-max-flow-min-cut","unit-weighted-shortest-path"],"excludedTopics":["平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-planar-duality","tag-dsu-components"],"sourceRevisionIds":["source-abc413-editorial-13403-a6cd05e7174483f4d0b5d99d10829df1975ff360e308407cc36d37e401633d73","source-abc413-g-problem-a4cc07d09ba7337eb815934efae7939e57963df0d50fb0ec81dfee731455e485"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各free隣接辺を容量1、blockedを含む辺を0とするとfree path不在は容量0 cut存在と同値。平面dualでそのcutは二分した外側face間の0辺pathに一致する。障害物近傍のprimal辺だけが容量0になるので対応dual辺を全てunionすれば二端子連結が遮断の必要十分条件。","sourceRevisionIds":["source-abc413-editorial-13403-a6cd05e7174483f4d0b5d99d10829df1975ff360e308407cc36d37e401633d73","source-abc413-g-problem-a4cc07d09ba7337eb815934efae7939e57963df0d50fb0ec81dfee731455e485"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-dualize-planar-cut-to-path"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"3×3盤面、S=(1,1),G=(3,3)、障害物(2,1),(2,2),(2,3)。","procedure":["中段全体がblocked。","障害物に接する0容量辺のdual連鎖が外周二端子を結ぶ。","free pathは中段を横断できない。"],"executionTarget":null,"expectedResult":"No","verificationStatus":"not_applicable","learningUnitIds":["unit-planar-duality"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-dualize-planar-cut-to-path"],"prerequisiteIds":["unit-dsu-components","unit-max-flow-min-cut","unit-weighted-shortest-path"],"attainmentCondition":"中央障害物(2,2)一個だけなら遮断されるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"されない。上辺・右辺から迂回でき、dualの外側二端子も未連結。"},"answer":{"reasoningOrVerification":"されない。上辺・右辺から迂回でき、dualの外側二端子も未連結。","procedure":["具体例の各状態・寄与を再計算する。","されない。上辺・右辺から迂回でき、dualの外側二端子も未連結。"],"expectedResult":"されない。上辺・右辺から迂回でき、dualの外側二端子も未連結。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [平面graph双対・cut/path対応](src/content/docs/learn/graph/planar-duality.md)

- 埋め込みのfaceをdual頂点へ写し、primal cutとdual path/cycleの対応から最小cut問題を最短路へ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)
- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 平面graph双対・cut/path対応の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

free-cell graphでsourceからtargetへpathがあることは、各隣接edgeを両端freeなら容量1、どちらかblockedなら0としたnetworkのmax flowが正であることと同値である。 planar max-flow/min-cut dualityにより、到達不能はsource-targetを分ける容量0 cut、すなわち分割した外側face二端子を0-weight dual edgeだけで結ぶpathの存在に一致する。 外側faceはsource-target間のboundary arcで二つにsplitし、top+right側を一端子、left+bottom側を他端子とする。この二端子を結ぶdual pathがprimalのs-t cutになる。 horizontal primal edgeの上下face、vertical edgeの左右faceを、そのedgeの少なくとも一端が障害物ならunionする。内部faceは障害物近傍だけ遅延生成すればよい。

採用する候補: 障害物に接するcapacity0 primal edgeだけをdual face間のunionとして処理し、二つの外側arc terminalの連結性をDSUで判定する

各障害物は高々4本の隣接edgeを0にするので、巨大なHW個のcell/faceを生成せずO(K)個の関連faceだけhash mapで持てる。

棄却する候補: H×W全cellを頂点として通常BFSする

H,Wは各2×10^5でHWは4×10^10になり得る一方、障害物は2×10^5個しかなく疎性を使う必要がある。

外側faceはsource-target間のboundary arcで二つにsplitし、top+right側を一端子、left+bottom側を他端子とする。この二端子を結ぶdual pathがprimalのs-t cutになる。

horizontal primal edgeの上下face、vertical edgeの左右faceを、そのedgeの少なくとも一端が障害物ならunionする。内部faceは障害物近傍だけ遅延生成すればよい。

dual terminal U=top/right outer arc、D=left/bottom outer arcを作る。各obstacleと上下左右のgrid内neighborが作るprimal edgeを一度ずつ見て、horizontalなら上・下face、verticalなら左・右faceをDSUで結ぶ。boundary側faceはU/Dへ対応させる。最後にU,Dが同componentならNo、そうでなければYes。

## 典型の発動条件

### planar duality

発動条件: 平面graphの二点間path存在を、cutを横切るdual pathで判定したいとき。

0容量s-t cutを、0-weight dual edgeだけの外側arc間pathへ変換する。

### 疎なdual graphのDSU

発動条件: 巨大gridで非零eventが少なく、必要なのが特定edge集合のconnectivityだけのとき。

障害物に接するedge周辺のfaceだけ座標mapで生成しunionする。

### outer face splitting

発動条件: sourceとtargetが平面graphの外周にあり、s-t cutをdual shortest pathへ写すとき。

外周をsからtへの二arcに分けて別dual terminalとして扱う。

## 問題固有の要素

free cellを探索する代わりに、障害物が作る0-cost境界がtop/right arcとleft/bottom arcをつなぐかだけを見るため、計算量が面積でなく障害物数になる。

別の問題へ持ち帰る視点: 巨大領域の到達性では、通行可能領域を圧縮するほか、障害物側のseparator connectivityをplanar dualで調べる方向もある。

## 正当性

各free隣接辺を容量1、blockedを含む辺を0とするとfree path不在は容量0 cut存在と同値。平面dualでそのcutは二分した外側face間の0辺pathに一致する。障害物近傍のprimal辺だけが容量0になるので対応dual辺を全てunionすれば二端子連結が遮断の必要十分条件。

## 実装上の注意

- 同じprimal edgeを複数回処理してもよいがface座標を一意にmapする。H=1またはW=1では一edgeの両側が二outer terminalになり得る。source/targetは障害物でない保証を使う。

## 復習の核

- H=1/W=1、source隣接二cellの斜め障害物、top-bottom barrier、top-rightだけを結ぶ非separatorを小grid BFSと比較する。

## 計算量と制約

### 時間

障害物数 K。関連dual faceだけhashで生成する場合 expected O(Kα(K))、balanced mapなら O(K log K)。元盤面HWを走査しない。

### 空間

障害物近傍faceとDSUで O(K)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le H\le2\times10^5; 1\le W\le2\times10^5; 0\le K\le2\times10^5; 1\le r_i\le H\ (1\le i\le K); 1\le c_i\le W\ (1\le i\le K); (r_i,c_i)\ne(1,1)\ (1\le i\le K); (r_i,c_i)\ne(H,W)\ (1\le i\le K); (r_i,c_i)\ne(r_j,c_j)\ (1\le i\lt j\le K); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

3×3盤面、S=(1,1),G=(3,3)、障害物(2,1),(2,2),(2,3)。

1. 中段全体がblocked。
2. 障害物に接する0容量辺のdual連鎖が外周二端子を結ぶ。
3. free pathは中段を横断できない。

期待される結果: No

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

中央障害物(2,2)一個だけなら遮断されるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

されない。上辺・右辺から迂回でき、dualの外側二端子も未連結。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc413/editorial/13403) — source-abc413-editorial-13403-a6cd05e7174483f4d0b5d99d10829df1975ff360e308407cc36d37e401633d73
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc413/tasks/abc413_g) — source-abc413-g-problem-a4cc07d09ba7337eb815934efae7939e57963df0d50fb0ec81dfee731455e485
