---
title: "ABC379-F — Buildings 2"
draft: true
authoringUnit: {"problemId":"abc379-f","docPath":"src/content/docs/problems/data-structures/outcome-prune-dominated-candidates-once/outcome-prune-dominated-candidates-once-shard-001/abc379-f.md","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["全候補から極値を反復取得するheap・ordered set。"],"tagIds":["tag-monotone-stack-queue"],"sourceRevisionIds":["source-abc379-editorial-11309-8919f169b4e747b33f78529614802e8cbe94424c249443424ee87563093fb8c5","source-abc379-f-problem-82dc25ffda54fdaed747134be3455bd303a1e2dc789ce44d64a96f6517140140"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"x>rがlから見えるなら全中間高さはH_xより低い。rからxまでの中間位置はその部分集合なのでrからも見える。右からのstackは視点lの処理直前にlより東の可視候補を持つ。queryへ答えた後、H_lより低い末尾候補をpopしlをpushすると、次の視点l−1に対しlが遮る候補だけを除ける。各indexは一度だけpush/popされる。","sourceRevisionIds":["source-abc379-editorial-11309-8919f169b4e747b33f78529614802e8cbe94424c249443424ee87563093fb8c5","source-abc379-f-problem-82dc25ffda54fdaed747134be3455bd303a1e2dc789ce44d64a96f6517140140"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"H=(3,1,2)、質問(l,r)=(1,2)。","procedure":["候補x=3の間にあるのは高さ1だけなので1から見える。","2から3の間は空である。query処理時にはH_1をstackへまだ挿入しない。"],"executionTarget":null,"expectedResult":"答え1。","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-stack-queue"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"prerequisiteIds":[],"attainmentCondition":"視点自身の高さ3でビル3の高さ2を遮るか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"定義の中間位置l<k<xにl自身は含まれないため遮らない。先にH_lをstackへ挿入するとこの例を落とす。"},"answer":{"reasoningOrVerification":"定義の中間位置l<k<xにl自身は含まれないため遮らない。先にH_lをstackへ挿入するとこの例を落とす。","procedure":["具体例の各状態・寄与を再計算する。","定義の中間位置l<k<xにl自身は含まれないため遮らない。先にH_lをstackへ挿入するとこの例を落とす。"],"expectedResult":"定義の中間位置l<k<xにl自身は含まれないため遮らない。先にH_lをstackへ挿入するとこの例を落とす。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 全候補から極値を反復取得するheap・ordered set。

## 考察

両視点から見える候補xはrより東でlから見えるものに一致する。可視性は中間ビルだけに依存し視点自身の高さは含まない。右から左へ進むと新たに中間へ入るビルが、それより低い東側候補だけを遮るので単調stackが使える。query(l,r)はlを挿入する前に答え、その後H_lより低い末尾をpopしてlを追加する。候補indexは単調なのでrを越す個数を二分探索できる。

## 典型の発動条件

### 可視要素の monotone stack

発動条件: 各位置から右を見た record high の列を多数 query したいとき。

走査方向を揃えて可視候補を stack で維持する。

## 問題固有の要素

二条件の一方が他方を含意することを証明すると、共通集合問題が一視点だけの query になる。

別の問題へ持ち帰る視点: query を左端でオフライン整列すると、位置ごとの可視 stack を一度ずつ構成できる。

## 正当性

x>rがlから見えるなら全中間高さはH_xより低い。rからxまでの中間位置はその部分集合なのでrからも見える。右からのstackは視点lの処理直前にlより東の可視候補を持つ。queryへ答えた後、H_lより低い末尾候補をpopしlをpushすると、次の視点l−1に対しlが遮る候補だけを除ける。各indexは一度だけpush/popされる。

## 実装上の注意

queryをstack更新前に処理する。pop条件はtopの高さ<H_l。高さは順列なので同値はない。r自身を含めずindex>rだけを数える。

## 復習の核

H=(3,1,2),(l,r)=(1,2)で答え1を確認し、視点高さを遮蔽物へ入れない。query→低いtop削除→l挿入の順を再現する。

## 計算量と制約

### 時間

O(N+Q log N)、stack構築は償却O(N)、各照会はindex列の二分探索。

### 空間

O(N+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq H_i \leq N; H_i\neq H_j\ (i\neq j); 1 \leq l_i < r_i \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

H=(3,1,2)、質問(l,r)=(1,2)。

1. 候補x=3の間にあるのは高さ1だけなので1から見える。
2. 2から3の間は空である。query処理時にはH_1をstackへまだ挿入しない。

期待される結果: 答え1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

視点自身の高さ3でビル3の高さ2を遮るか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

定義の中間位置l<k<xにl自身は含まれないため遮らない。先にH_lをstackへ挿入するとこの例を落とす。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc379/editorial/11309) — source-abc379-editorial-11309-8919f169b4e747b33f78529614802e8cbe94424c249443424ee87563093fb8c5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc379/tasks/abc379_f) — source-abc379-f-problem-82dc25ffda54fdaed747134be3455bd303a1e2dc789ce44d64a96f6517140140
