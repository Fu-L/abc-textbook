---
title: "ABC223-G — Vertex Deletion"
draft: true
authoringUnit: {"problemId":"abc223-g","docPath":"src/content/docs/problems/graph-search/outcome-reroot-tree-aggregation/outcome-reroot-tree-aggregation-shard-001/abc223-g.md","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-rooted-tree-aggregation"],"excludedTopics":["rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rerooting"],"sourceRevisionIds":["source-abc223-editorial-2775-b9495e8e94b6b8b7e40cdb1fe86bdf8916d98f2e3f5da3a7f386d2f5a5eb7781","source-abc223-g-problem-01be590afa613a2946015c9dac83abad397f7c515256b827fd1817e48d4b932e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"未使用子があれば親とmatchingするpostorder貪欲は葉交換で最大matchingを保つ。指定vをrootにするとv未使用で終われることがvを除いても最大数不変の必要十分条件。各辺両側の未使用情報をrerootで合成し全vを同じ貪欲条件で評価する。","sourceRevisionIds":["source-abc223-editorial-2775-b9495e8e94b6b8b7e40cdb1fe86bdf8916d98f2e3f5da3a7f386d2f5a5eb7781","source-abc223-g-problem-01be590afa613a2946015c9dac83abad397f7c515256b827fd1817e48d4b932e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3。","procedure":["元最大matching数1。","1削除後2–3で1、3削除後1–2で1。","2削除後二孤立で0。"],"executionTarget":null,"expectedResult":"削除可能頂点数2","verificationStatus":"not_applicable","learningUnitIds":["unit-rerooting"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reroot-tree-aggregation"],"prerequisiteIds":["unit-rooted-tree-aggregation"],"attainmentCondition":"最大matchingの一つで使用される頂点は必ず削除不可か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"違う。端1はmatching1–2で使用されるが別最大matching2–3では未使用。存在性を判定する。"},"answer":{"reasoningOrVerification":"違う。端1はmatching1–2で使用されるが別最大matching2–3では未使用。存在性を判定する。","procedure":["具体例の各状態・寄与を再計算する。","違う。端1はmatching1–2で使用されるが別最大matching2–3では未使用。存在性を判定する。"],"expectedResult":"違う。端1はmatching1–2で使用されるが別最大matching2–3では未使用。存在性を判定する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rerooting・全方位木DP](src/content/docs/learn/tree/rerooting.md)

- 子側と親側の寄与の差し替えを定義し、各頂点を根とした答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

対象外:

- rerooting・全方位木DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

頂点 v を消しても最大マッチング数が変わらないことは、元の木に v を使わない最大マッチングが存在することと同値である。候補ごとに木DPをやり直すと二乗時間になる。 根から遠い順に、白い子があればその子と親をマッチして親を黒にする手順は、各部分木で作れる最大本数を失わない。 この貪欲処理後に根が白なら最大マッチングは根を使わずに達成され、根を削除しても最大本数が保たれる。

採用する候補: 各頂点を根とした葉側からの貪欲マッチングで根が未使用になるかを判定し、その判定を全方位木DPで全ての根へ伝播する。

木では未使用の子があれば親と組にする後順の貪欲法が最大マッチングを作り、削除可能性が最終的な根の未使用状態だけに現れる。

棄却する候補: 各頂点を実際に削除し、残った森の最大マッチングを木DPで再計算する。

一回の判定に木全体を走査するため N 個の削除候補で二乗時間となり、N=2×10^5 に間に合わない。

根から遠い順に、白い子があればその子と親をマッチして親を黒にする手順は、各部分木で作れる最大本数を失わない。

この貪欲処理後に根が白なら最大マッチングは根を使わずに達成され、根を削除しても最大本数が保たれる。

有向辺の反対側を処理したときの白黒状態を木DPで求め、親側と子側の寄与をrerootして、各頂点を根にしたとき白で終わる頂点を数える。

## 典型の発動条件

### 木の最大マッチングの葉側貪欲

発動条件: 木のマッチングで、葉側から局所的に辺を確定しても循環による競合が起きないとき。

未使用の子を持つ親を一つの子と結び、部分木ごとの最大本数と根の使用可否を同時に管理する。

### 全方位木DP

発動条件: ある頂点を根とした判定を全頂点について求め、隣接部分木の要約を根の移動時に再利用できるとき。

各方向の白黒要約を合成し、根を一つずつ試す代わりに全頂点の根状態を一括計算する。

## 問題固有の要素

削除後の値を直接比較せず、『最大マッチングの中にその頂点を使わないものがあるか』へ言い換えると、根の白黒一値で判定できる。

別の問題へ持ち帰る視点: 最適値を保つ要素削除は、その要素を避けた最適解の存在として捉え、DPに使用・不使用状態を持たせる。

## 正当性

未使用子があれば親とmatchingするpostorder貪欲は葉交換で最大matchingを保つ。指定vをrootにするとv未使用で終われることがvを除いても最大数不変の必要十分条件。各辺両側の未使用情報をrerootで合成し全vを同じ貪欲条件で評価する。

## 実装上の注意

- 次数の大きい頂点でも子を除いた状態を定数時間で作れるよう、白い隣接方向の個数など必要な集約量だけを保持する。

## 復習の核

- 『削除しても最適値が同じ』を見たら、削除をシミュレートする前に、その要素を使わない最適解の存在へ言い換える。

## 計算量と制約

### 時間

N木頂点。有向辺白黒DPとreroot集計 O(N)。

### 空間

木と各有向辺状態 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq u_i < v_i \leq N; The given graph is a tree.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3。

1. 元最大matching数1。
2. 1削除後2–3で1、3削除後1–2で1。
3. 2削除後二孤立で0。

期待される結果: 削除可能頂点数2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

最大matchingの一つで使用される頂点は必ず削除不可か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

違う。端1はmatching1–2で使用されるが別最大matching2–3では未使用。存在性を判定する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/editorial/2775) — source-abc223-editorial-2775-b9495e8e94b6b8b7e40cdb1fe86bdf8916d98f2e3f5da3a7f386d2f5a5eb7781
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc223/tasks/abc223_g) — source-abc223-g-problem-01be590afa613a2946015c9dac83abad397f7c515256b827fd1817e48d4b932e
