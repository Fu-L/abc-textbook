---
title: "ABC256-E — Takahashi's Anguish"
draft: true
authoringUnit: {"problemId":"abc256-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc256-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc256-e-problem-0d8df9007490c402dd5a18303e2a7b03fd211edc2b4ae22d6213283fb2f6c648","source-abc256-editorial-4135-a9756d99270d5a1ed1223af97a234dfbf5999a1b15c21d899f2f27a470d84893"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"入次数0を除くと木部分だけ消えcycleが残る。cycleの全関係を満たす順序は存在しないので少なくとも一人の不満を払う必要がある。最小費用のcycle点で関係を切れば残りはDAGとなり順序が作れる。別cycleは独立なので最小費用の和が最適。","sourceRevisionIds":["source-abc256-e-problem-0d8df9007490c402dd5a18303e2a7b03fd211edc2b4ae22d6213283fb2f6c648","source-abc256-editorial-4135-a9756d99270d5a1ed1223af97a234dfbf5999a1b15c21d899f2f27a470d84893"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-functional-graph"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"X=(2,1,2)、C=(7,3,100)。","procedure":["3は入次数0で削除。","cycleは1↔2。","cycle最小費用は頂点2の3。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-functional-graph-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-functional-graph"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"cycleへ流れ込む頂点3の費用を選べばcycleを解消できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"できない。cycle内の順序矛盾は残るのでcycle上で一つ切る必要がある。"},"answer":{"reasoningOrVerification":"できない。cycle内の順序矛盾は残るのでcycle上で一つ切る必要がある。","procedure":["具体例の各状態・寄与を再計算する。","できない。cycle内の順序矛盾は残るのでcycle上で一つ切る必要がある。"],"expectedResult":"できない。cycle内の順序矛盾は残るのでcycle上で一つ切る必要がある。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各頂点からちょうど一本の辺i→X_iが出るfunctional graphでは、弱連結成分ごとに閉路がちょうど一つあり、それ以外の頂点は閉路へ向かう木を作る。 閉路外の頂点は入次数0の頂点から除いていけば全て消え、残った頂点がちょうど全閉路を構成する。 閉路上では循環する希望順を全て満たせないが、最小Cの頂点を最後の破れにすればその一人分で実現できる。

採用する候補: 閉路だけを抽出して各最小Cを足す

木部分は葉側から順序を選べば不満を発生させず、閉路では少なくとも一人の不満が避けられないため、最小費用一人だけを犠牲にするのが最適である。

棄却する候補: 全員のCを払う、または局所的に安い頂点を選ぶ

必要な支払いは各連結成分の閉路に一つだけであり、木頂点や同じ閉路の複数頂点を払うのは過剰になる。

閉路外の頂点は入次数0の頂点から除いていけば全て消え、残った頂点がちょうど全閉路を構成する。

閉路上では循環する希望順を全て満たせないが、最小Cの頂点を最後の破れにすればその一人分で実現できる。

各頂点の入次数を求め、入次数0をキューに入れて辺を順に削除する。最後まで残る閉路頂点を未訪問ごとに一周し、その閉路上のC最小値を答えへ加える。

## 典型の発動条件

### functional graphの閉路抽出

発動条件: 全頂点の出次数が1で、各成分の唯一の閉路だけが必要になる。

入次数0からのトポロジカル削除後に残る頂点を閉路として列挙する。

### 閉路ごとの局所最適化

発動条件: 木部分は制約を満たせるが、循環依存で一箇所の違反が不可避になる。

各閉路で違反させる費用が最小の頂点を一つ選ぶ。

## 問題固有の要素

不満の原因を人の列全体で追う代わりに、希望関係をfunctional graphへ写すと、避けられない費用が閉路ごとに一つだけだと分かる。

別の問題へ持ち帰る視点: 各頂点が一つだけ依存先を持つ順序問題では、木部分を消去し閉路上の不可避コストを最適化する。

## 正当性

入次数0を除くと木部分だけ消えcycleが残る。cycleの全関係を満たす順序は存在しないので少なくとも一人の不満を払う必要がある。最小費用のcycle点で関係を切れば残りはDAGとなり順序が作れる。別cycleは独立なので最小費用の和が最適。

## 実装上の注意

- 答えは最大2×10^14になるため64ビットで保持し、削除後の閉路を各一度だけ巡回する。X_i≠iだが、実装は閉路長に依存しない形にする。

## 復習の核

- 小さいNの全順列と比較し、複数成分、長い木が閉路へ入る例、閉路ごとの最小Cが先頭・末尾にある例を確認する。

## 計算量と制約

### 時間

N 頂点に対して O(N)。

### 空間

出辺、入次数、queue、visited O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq X_i \leq N; X_i \neq i; 1 \leq C_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

X=(2,1,2)、C=(7,3,100)。

1. 3は入次数0で削除。
2. cycleは1↔2。
3. cycle最小費用は頂点2の3。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

cycleへ流れ込む頂点3の費用を選べばcycleを解消できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

できない。cycle内の順序矛盾は残るのでcycle上で一つ切る必要がある。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/tasks/abc256_e) — source-abc256-e-problem-0d8df9007490c402dd5a18303e2a7b03fd211edc2b4ae22d6213283fb2f6c648
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc256/editorial/4135) — source-abc256-editorial-4135-a9756d99270d5a1ed1223af97a234dfbf5999a1b15c21d899f2f27a470d84893
