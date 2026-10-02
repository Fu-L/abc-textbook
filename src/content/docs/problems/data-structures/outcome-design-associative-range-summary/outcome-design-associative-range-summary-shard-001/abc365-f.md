---
title: "ABC365-F — Takahashi on Grid"
draft: true
authoringUnit: {"problemId":"abc365-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc365-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc365-editorial-10582-ce83fb2ad4d8834dc35fd6020b9f2457dbada335c7ffceeecf6b17d36d777bda","source-abc365-f-problem-0e67b138b92e3c46ad2cede58de7ff3b3270e1ad124881d959dccfcc234401ae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"clampの合成は再びclampであり、出力可能区間fは前区間端点を後区間へclampして求められる。 cost関数も平坦区間gとそこからの距離という凸な形を保ち、合成後のCは代表点g_Lを代入して評価できる。 最大20万行を一歩ずつ辿らず、最終yと縦横移動costを定数サイズmonoidとしてまとめられる。","sourceRevisionIds":["source-abc365-editorial-10582-ce83fb2ad4d8834dc35fd6020b9f2457dbada335c7ffceeecf6b17d36d777bda","source-abc365-f-problem-0e67b138b92e3c46ad2cede58de7ff3b3270e1ad124881d959dccfcc234401ae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"開始y=5、順に通れる区間[1,3],[2,4]、最後の目標y=4。","procedure":["最初に5を3へclampし縦移動2。","次の区間では3のまま、最後に4へ1移動。"],"executionTarget":null,"expectedResult":"縦移動合計3。横移動は対象遷移数を別途加える。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":[],"attainmentCondition":"二区間の順を逆にしたら同じか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"5→4→3となり縦移動2、目標4へ1で同例の総費用は同じでも最終位置などの写像は一般に順序依存。例えば開始0なら順方向2、逆方向2で同じ出力だが、[1,1],[3,3]では出力が3と1に分かれる。"},"answer":{"reasoningOrVerification":"5→4→3となり縦移動2、目標4へ1で同例の総費用は同じでも最終位置などの写像は一般に順序依存。例えば開始0なら順方向2、逆方向2で同じ出力だが、[1,1],[3,3]では出力が3と1に分かれる。","procedure":["具体例の各状態・寄与を再計算する。","5→4→3となり縦移動2、目標4へ1で同例の総費用は同じでも最終位置などの写像は一般に順序依存。例えば開始0なら順方向2、逆方向2で同じ出力だが、[1,1],[3,3]では出力が3と1に分かれる。"],"expectedResult":"5→4→3となり縦移動2、目標4へ1で同例の総費用は同じでも最終位置などの写像は一般に順序依存。例えば開始0なら順方向2、逆方向2で同じ出力だが、[1,1],[3,3]では出力が3と1に分かれる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

行を進められるなら先に進んでも損をせず、次行の通行可能区間[L,U]に現在yが入らなければ、その端点まで縦移動してから横へ一歩進むのが最短である。

連続行区間を通過した後のyはclamp(y,f_L,f_U)、移動回数はC+max(0,g_L−y,y−g_U)という定数個のparameterで表せ、隣接区間の合成でも形が閉じる。

採用する候補: 各行区間をclamp写像と凸な距離関数のsummaryにし、segment treeでquery範囲を順序付き合成する。

最大20万行を一歩ずつ辿らず、最終yと縦横移動costを定数サイズmonoidとしてまとめられる。

棄却する候補: 各queryで開始行から終了行までgreedy移動を一行ずつsimulationする。

一本のqueryは正しく解けても、長い行区間を含むqueryが多数来ると同じclamp処理を繰り返す。

clampの合成は再びclampであり、出力可能区間fは前区間端点を後区間へclampして求められる。

cost関数も平坦区間gとそこからの距離という凸な形を保ち、合成後のCは代表点g_Lを代入して評価できる。

各行をsummary(f=[L_i,U_i],g=[L_i,U_i],C=1)としてsegment treeへ載せる。queryは必要なら始終点をswapし、中間の行summaryを左から合成する。開始yへsummaryのcost式を適用して横断costを得て、到達y=clamp(startY,f)からtargetYまでの差を足す。

## 典型の発動条件

### 区間関数合成segment tree

発動条件: 列上の各要素が状態遷移関数で、範囲適用queryが多数あるとき。

関数を定数parameterへ圧縮し、結合順を保つsegment tree積として取得する。

### clampと一次凸関数の閉包

発動条件: 区間制約へ射影しながら移動距離を累積するとき。

到達位置をclamp、追加costを平坦区間からの距離で表す。

## 問題固有の要素

greedy path全体ではなく「任意の開始yをどこへ写し何歩使うか」というtransfer functionを持つとquery間で再利用できる。

別の問題へ持ち帰る視点: 経路queryでは区間の答えを単値でなく境界状態に対する関数として要約する。

## 正当性

clampの合成は再びclampであり、出力可能区間fは前区間端点を後区間へclampして求められる。 cost関数も平坦区間gとそこからの距離という凸な形を保ち、合成後のCは代表点g_Lを代入して評価できる。 最大20万行を一歩ずつ辿らず、最終yと縦横移動costを定数サイズmonoidとしてまとめられる。

## 実装上の注意

- 合成は交換可能でないためleft/right accumulatorの順序を守る。同じ行のquery、始終点swap、横移動回数をsummaryに含める範囲を確認する。

## 復習の核

- 二行だけのsummaryを全y領域で手計算して合成式と照合する。segment tree queryが返す行範囲と、最後の縦移動を別々に管理する。

## 計算量と制約

### 時間

O(N+Q log N)、summaryの合成はO(1)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10 ^ 5; 1\leq L _ i\leq U _ i\leq10 ^ 9\ (1\leq i\leq N); \lbrack L _ i,U _ i\rbrack\cap\lbrack L _ {i+1},U _ {i+1}\rbrack\neq\emptyset\ (1\leq i\lt N); 1\leq Q\leq2\times10 ^ 5; 1\leq s _ {x,i}\leq N and L _ {s _ {x,i}}\leq s _ {y,i}\leq U _ {s _ {x,i}}\ (1\leq i\leq Q); 1\leq t _ {x,i}\leq N and L _ {t _ {x,i}}\leq t _ {y,i}\leq U _ {t _ {x,i}}\ (1\leq i\leq Q); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

開始y=5、順に通れる区間[1,3],[2,4]、最後の目標y=4。

1. 最初に5を3へclampし縦移動2。
2. 次の区間では3のまま、最後に4へ1移動。

期待される結果: 縦移動合計3。横移動は対象遷移数を別途加える。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

二区間の順を逆にしたら同じか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

5→4→3となり縦移動2、目標4へ1で同例の総費用は同じでも最終位置などの写像は一般に順序依存。例えば開始0なら順方向2、逆方向2で同じ出力だが、[1,1],[3,3]では出力が3と1に分かれる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/editorial/10582) — source-abc365-editorial-10582-ce83fb2ad4d8834dc35fd6020b9f2457dbada335c7ffceeecf6b17d36d777bda
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/tasks/abc365_f) — source-abc365-f-problem-0e67b138b92e3c46ad2cede58de7ff3b3270e1ad124881d959dccfcc234401ae
