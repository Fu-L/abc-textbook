---
title: "ABC285-G — Tatami"
draft: true
authoringUnit: {"problemId":"abc285-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-flow-with-lower-bounds/outcome-solve-flow-with-lower-bounds-shard-001/abc285-g.md","learningOutcomeIds":["outcome-solve-flow-with-lower-bounds"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-max-flow-min-cut"],"excludedTopics":["下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-flow-feasibility-lower-bounds","tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc285-editorial-5500-15ce389fe4a17393dab7f63ad59b360a880879cee4ada634068acb3225c095af","source-abc285-g-problem-c175c30fd08313f9aff4bec8a706abc0de7c3ebf334e2d5b55ab72187ebddc0e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dominoは隣接matchingで、文字2は必ずmatched、?は任意、文字1はdomino不可。二側の2について入口/出口流量下限1を置くと必須matchingを正確に強制する。下限を需要へ移す標準変換とsink→source辺で元feasible flowに一対一対応し、残る?はmonominoで覆える。","sourceRevisionIds":["source-abc285-editorial-5500-15ce389fe4a17393dab7f63ad59b360a880879cee4ada634068acb3225c095af","source-abc285-g-problem-c175c30fd08313f9aff4bec8a706abc0de7c3ebf334e2d5b55ab72187ebddc0e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-flow-with-lower-bounds"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"1×2、文字列2?。","procedure":["2を必須matchedにする。","隣接?とdomino一本で両側を覆う。","下限需要がこの一本のflowで満たされる。"],"executionTarget":null,"expectedResult":"Yes","verificationStatus":"not_applicable","learningUnitIds":["unit-flow-lower-bounds"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-flow-with-lower-bounds"],"prerequisiteIds":["unit-max-flow-min-cut"],"attainmentCondition":"文字列21なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"1はdomino不可なので2に相手がなくNo。"},"answer":{"reasoningOrVerification":"1はdomino不可なので2に相手がなくNo。","procedure":["具体例の各状態・寄与を再計算する。","1はdomino不可なので2に相手がなくNo。"],"expectedResult":"1はdomino不可なので2に相手がなくNo。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [下限制約付きflowの実現可能性](src/content/docs/learn/graph/flow-lower-bounds.md)

- 各辺のlower boundを先に流して頂点需要へ変換し、super source/sinkを加えたcirculationの飽和可能性を判定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

対象外:

- 下限制約付きflowの実現可能性の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

1×2 tileを置くことは、1でない隣接2cellを1本のmatching edgeで結ぶことに対応し、残った?は1×1 tileで覆える。 文字2のcellは必ずmatchingに含める必要がある一方、?のcellはmatchedでもunmatchedでもよい。 grid隣接graphはcheckerboard parityで二部graphになるため、matching条件をunit-capacity flowへ変換できる。 左側頂点ではsourceからの辺、右側頂点ではsinkへの辺を流量1に強制すれば、そのcellがちょうど1本のdominoに含まれる。 lower bound Lを先に流したとみなして各頂点の需要差へ変換し、super source/sinkと元sink→元sourceの辺を加えるとcirculation feasibilityになる。

採用する候補: 二部matching networkの必須頂点にlower bound 1を設定し、lower-bound付きflowのfeasibilityを最大流へ帰着する。

左右どちら側にある2も必ず飽和する条件をflow conservationとして同時に表現できる。

棄却する候補: 2のcellから順に空いている隣接cellへ貪欲にdominoを置く。

局所選択が別の必須cellの唯一の相手を奪う場合があり、matching全体の組替えが必要になる。

棄却する候補: 通常の最大matchingを1回求め、cardinalityだけで可否を決める。

最大本数が同じでも、特定の2頂点をすべてcoverしているかというlower-bound条件をcardinalityだけでは表せない。

左側頂点ではsourceからの辺、右側頂点ではsinkへの辺を流量1に強制すれば、そのcellがちょうど1本のdominoに含まれる。

lower bound Lを先に流したとみなして各頂点の需要差へ変換し、super source/sinkと元sink→元sourceの辺を加えるとcirculation feasibilityになる。

文字1のcellを除き、偶奇で左右に分けて隣接辺を容量1で張る。source→左cellと右cell→sinkも容量1とし、文字2ならその辺のlower boundを1、?なら0にする。lower bound分を頂点需要へ移し、super sourceから需要超過頂点、供給超過頂点からsuper sinkへ辺を張り、sink→sourceへ十分大きい辺を追加する。最大流でsuper sourceからの全辺を飽和できればYes。

## 典型の発動条件

### gridの二部matching

発動条件: 隣接cellを重ならないpairへ分けるtile配置問題。

checkerboard parityを二部にしてdominoをmatching edgeとみなす。

### lower-bound flow feasibility

発動条件: 一部の辺に最低流量があり、指定頂点の飽和を強制したいとき。

需要差とsuper source/sinkを導入して通常の最大流へ帰着する。

## 問題固有の要素

1はgraphから除外し、2だけを必須matched、?を任意matchedとすると、1×1 tile自体を明示的に選ぶ変数は不要になる。

別の問題へ持ち帰る視点: 混在tile問題では、大きいtileだけをpackingとして選び、小さいtileで埋められる残余を自由状態として消去する。

## 正当性

dominoは隣接matchingで、文字2は必ずmatched、?は任意、文字1はdomino不可。二側の2について入口/出口流量下限1を置くと必須matchingを正確に強制する。下限を需要へ移す標準変換とsink→source辺で元feasible flowに一対一対応し、残る?はmonominoで覆える。

## 実装上の注意

- 必須lower boundを引いた残容量と各頂点のbalanceの符号を統一し、super sourceから出る総容量が全て流れたかで判定する。
- H×W≤90000なのでgraphをcell indexへ変換し、隣接edgeを同じ向きで重複なく張る。

## 復習の核

- 左右それぞれに文字2がある小さなgridで、どのsource/sink辺にlower boundが付くか、需要変換後に全必須cellが1本ずつmatchingされるかを追う。

## 計算量と制約

### 時間

盤面cellV=HW、grid辺E=O(V)。lower-bound circulation networkもO(V)頂点辺、一般Dinic安全上界O(V³)。

### 空間

残余network、需要O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 300; H and W are integers.; c_{i,j} is one of 1, 2, and ?.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

1×2、文字列2?。

1. 2を必須matchedにする。
2. 隣接?とdomino一本で両側を覆う。
3. 下限需要がこの一本のflowで満たされる。

期待される結果: Yes

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

文字列21なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

1はdomino不可なので2に相手がなくNo。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/editorial/5500) — source-abc285-editorial-5500-15ce389fe4a17393dab7f63ad59b360a880879cee4ada634068acb3225c095af
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc285/tasks/abc285_g) — source-abc285-g-problem-c175c30fd08313f9aff4bec8a706abc0de7c3ebf334e2d5b55ab72187ebddc0e
