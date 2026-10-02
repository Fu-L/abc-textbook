---
title: "ABC292-E — Transitivity"
draft: true
authoringUnit: {"problemId":"abc292-e","docPath":"src/content/docs/problems/graph-search/outcome-compute-transitive-closure/outcome-compute-transitive-closure-shard-001/abc292-e.md","learningOutcomeIds":["outcome-compute-transitive-closure"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-transitive-closure"],"sourceRevisionIds":["source-abc292-e-problem-edcb478dbb9ec49e093c3079b675dad0fae05bf62cac02c422f56c03055ffa66","source-abc292-editorial-5874-1a03583c8be421b7ea294c349cd239be44ea432b717e4d32a9d1ac6dd5a83f3c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"辺追加u→wがu→v→wから行われるので元の到達性を変えない。操作が止まると二段pathが直接辺を持ち、path長に関する帰納法で全到達pairが直接辺になる。したがって閉包の相異なる頂点pair数から元辺数を引けば追加数が確定する。","sourceRevisionIds":["source-abc292-e-problem-edcb478dbb9ec49e093c3079b675dad0fae05bf62cac02c422f56c03055ffa66","source-abc292-editorial-5874-1a03583c8be421b7ea294c349cd239be44ea432b717e4d32a9d1ac6dd5a83f3c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compute-transitive-closure"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺1→2,2→3。","procedure":["1から到達する相異なる頂点は2,3の二個。","2からは3の一個、3からは0。","閉包3辺から初期2辺を引く。"],"executionTarget":null,"expectedResult":"追加1辺","verificationStatus":"not_applicable","learningUnitIds":["unit-transitive-closure"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compute-transitive-closure"],"prerequisiteIds":[],"attainmentCondition":"始点自身がcycleで到達可能なら閉包辺に数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"数えない。要求辺は異なる頂点間なので探索で始点を除外する。"},"answer":{"reasoningOrVerification":"数えない。要求辺は異なる頂点間なので探索で始点を除外する。","procedure":["具体例の各状態・寄与を再計算する。","数えない。要求辺は異なる頂点間なので探索で始点を除外する。"],"expectedResult":"数えない。要求辺は異なる頂点間なので探索で始点を除外する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [推移閉包](src/content/docs/learn/graph/transitive-closure.md)

- 各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 推移閉包の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

操作は到達可能性を変えず、停止時には元グラフで到達可能な全頂点への辺が揃う。 最終辺数はΣ_x(|reachable(x)|-1)で、元のM辺を引けば追加回数になる。

採用する候補: 各始点からBFS/DFSで到達数を数える

N,M≤2000なので全始点探索で推移閉包の辺数を求められる。

棄却する候補: 距離2の辺追加を逐次模擬

追加順に依存する再探索が多く、最終状態を直接数える方が明快である。

最終辺数はΣ_x(|reachable(x)|-1)で、元のM辺を引けば追加回数になる。

各xから探索し、x以外の到達頂点数を合計して初期辺数Mを引く。

## 典型の発動条件

### 推移閉包

発動条件: 有向辺の推移律を満たすまで追加する。

各始点の到達集合を最終出辺集合とみなす。

## 問題固有の要素

局所的な距離2追加を繰り返す操作の不変量は到達可能性である。

別の問題へ持ち帰る視点: 反復閉包操作では不変な関係と固定点を先に特定する。

## 正当性

辺追加u→wがu→v→wから行われるので元の到達性を変えない。操作が止まると二段pathが直接辺を持ち、path長に関する帰納法で全到達pairが直接辺になる。したがって閉包の相異なる頂点pair数から元辺数を引けば追加数が確定する。

## 実装上の注意

- 始点自身は辺数へ含めず、初期M辺を最後に一度だけ引く。

## 復習の核

- 小グラフで辺追加を停止まで模擬し、閉路・孤立頂点・既に推移的な例と比較する。

## 計算量と制約

### 時間

N 頂点、M 辺。全始点探索 O(N(N+M))。

### 空間

隣接 O(N+M)、visitedとqueue O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2000; 0 \leq M \leq 2000; 1 \leq u_i ,v_i \leq N; u_i \neq v_i; (u_i,v_i) \neq (u_j,v_j) if i \neq j.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺1→2,2→3。

1. 1から到達する相異なる頂点は2,3の二個。
2. 2からは3の一個、3からは0。
3. 閉包3辺から初期2辺を引く。

期待される結果: 追加1辺

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

始点自身がcycleで到達可能なら閉包辺に数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

数えない。要求辺は異なる頂点間なので探索で始点を除外する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/tasks/abc292_e) — source-abc292-e-problem-edcb478dbb9ec49e093c3079b675dad0fae05bf62cac02c422f56c03055ffa66
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/editorial/5874) — source-abc292-editorial-5874-1a03583c8be421b7ea294c349cd239be44ea432b717e4d32a9d1ac6dd5a83f3c
