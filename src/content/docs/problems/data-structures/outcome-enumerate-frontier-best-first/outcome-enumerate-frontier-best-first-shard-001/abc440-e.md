---
title: "ABC440-E — Cookies"
draft: true
authoringUnit: {"problemId":"abc440-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc440-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc440-e-problem-f89833a96662127092b91631b0acdc65154d16ee3b87c9932c2feed24ed1db29","source-abc440-editorial-15015-bb7a452f0626cf265d8db0e660d4c12d4b42c6c2c082d611debd70795e99722c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"すべての状態が最大状態から到達可能で、親候補より子候補の和が大きくならないため、まだヒープに現れていない状態が現在の最大候補を追い越すことはない。 一つの枚数ベクトルへ複数の妥協順から到達できるので、visited は和ではなく C 全体をキーにして重複挿入を防ぐ。 全辺で評価値が非増加なので、未処理状態の最大値を取り出す best-first search がそのまま上位 X 個の列挙順になる。","sourceRevisionIds":["source-abc440-e-problem-f89833a96662127092b91631b0acdc65154d16ee3b87c9932c2feed24ed1db29","source-abc440-editorial-15015-bb7a452f0626cf265d8db0e660d4c12d4b42c6c2c082d611debd70795e99722c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(5,3)、K=2。","procedure":["枚数vector(2,0)は10。","一枚ずつ次種類へ移し(1,1)=8,(0,2)=6。"],"executionTarget":null,"expectedResult":"列挙値は10,8,6。","verificationStatus":"not_applicable","learningUnitIds":["unit-priority-queue-best-first"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"prerequisiteIds":[],"attainmentCondition":"A=(5,5)なら同じ和をvisitedで統合するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"三枚数vectorは別の選び方なので全て残し5K=10を三回出力する。"},"answer":{"reasoningOrVerification":"三枚数vectorは別の選び方なので全て残し5K=10を三回出力する。","procedure":["具体例の各状態・寄与を再計算する。","三枚数vectorは別の選び方なので全て残し5K=10を三回出力する。"],"expectedResult":"三枚数vectorは別の選び方なので全て残し5K=10を三回出力する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

A を降順に並べ、種類ごとの選択枚数を C=(C_1,…,C_N) と表すと、最大の選び方は (K,0,…,0) である。

C_i>0 のクッキーを一枚だけ種類 i+1 へ移すと美味しさの和は増えない。また任意の総和 K の C は、この隣接移動を繰り返して最大状態から到達できる。

採用する候補: 選び方を頂点、一枚を次の種類へ移す妥協を辺とする状態グラフを、最大ヒープで和の大きい順に探索する。

全辺で評価値が非増加なので、未処理状態の最大値を取り出す best-first search がそのまま上位 X 個の列挙順になる。

棄却する候補: 総和が K になる N 種類の枚数ベクトルを全列挙して美味しさの和をソートする。

選び方は最大で二項係数個あり、X≤10^5 しか必要ないのに全状態を生成することになる。

棄却する候補: ヒープでは美味しさの和だけを管理し、同じ和の状態を一つにまとめる。

異なる選び方が同じ和を持つ場合も重複込みで出力する必要があり、遷移可能な次状態も枚数ベクトルに依存する。

すべての状態が最大状態から到達可能で、親候補より子候補の和が大きくならないため、まだヒープに現れていない状態が現在の最大候補を追い越すことはない。

一つの枚数ベクトルへ複数の妥協順から到達できるので、visited は和ではなく C 全体をキーにして重複挿入を防ぐ。

初期状態 (K,0,…,0) と和 K A_1 を最大ヒープへ入れる。最大状態を取り出して和を出力し、各 C_i>0 に対して C_iを1減らしC_{i+1}を1増やした未訪問状態を、和から A_i−A_{i+1} を引いて追加する。これを X 回繰り返す。

## 典型の発動条件

### 単調な状態グラフの best-first 列挙

発動条件: 最大状態から全候補へ到達でき、遷移のたびに評価値が悪化する上位 K 個列挙であるとき。

選び方をヒープで管理し、現在最大の状態から一段階の妥協だけを生成する。

### 重複状態を持つ暗黙グラフ探索

発動条件: 同じ組合せ状態へ異なる操作順で到達し得るとき。

枚数ベクトルを visited set に保存して、同じ選び方を一度だけヒープへ入れる。

## 問題固有の要素

「妥協」を一枚だけ右隣へ移す操作に限定しても、弱合成 C の任意状態へ到達でき、A の降順性により評価値の単調性も同時に得られる。

別の問題へ持ち帰る視点: 上位解列挙では、最良解から全解を生成できる局所変形と、その変形で目的値が単調になる順序を探す。

## 正当性

すべての状態が最大状態から到達可能で、親候補より子候補の和が大きくならないため、まだヒープに現れていない状態が現在の最大候補を追い越すことはない。 一つの枚数ベクトルへ複数の妥協順から到達できるので、visited は和ではなく C 全体をキーにして重複挿入を防ぐ。 全辺で評価値が非増加なので、未処理状態の最大値を取り出す best-first search がそのまま上位 X 個の列挙順になる。

## 実装上の注意

- A_i が等しい場合も異なる枚数ベクトルは別の選び方なので、美味しさの和が同値でも visited で統合しない。
- K A_1 と差分更新後の和は符号付き64 bitで持ち、C_i>0 かつ i<N の遷移だけを生成する。

## 復習の核

- 上位列挙へ進む前に、局所変形の到達可能性と評価値の単調性を別々に証明する。同じ和を持つ別状態が出力から消えないことも小例で確かめる。

## 計算量と制約

### 時間

O(N log N+XN(N+log(XN)))、X列挙状態、枚数vectorコピー/hash比較O(N)を含む保守的上界。

### 空間

O(XN²)、生成最大O(XN)状態に長さN vectorを保存。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 50; 1 \leq K \leq 10^5; 1 \leq X \leq \min\left(10^5, \binom{N+K-1}{K}\right); -10^9 \leq A_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(5,3)、K=2。

1. 枚数vector(2,0)は10。
2. 一枚ずつ次種類へ移し(1,1)=8,(0,2)=6。

期待される結果: 列挙値は10,8,6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A=(5,5)なら同じ和をvisitedで統合するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

三枚数vectorは別の選び方なので全て残し5K=10を三回出力する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/tasks/abc440_e) — source-abc440-e-problem-f89833a96662127092b91631b0acdc65154d16ee3b87c9932c2feed24ed1db29
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/editorial/15015) — source-abc440-editorial-15015-bb7a452f0626cf265d8db0e660d4c12d4b42c6c2c082d611debd70795e99722c
