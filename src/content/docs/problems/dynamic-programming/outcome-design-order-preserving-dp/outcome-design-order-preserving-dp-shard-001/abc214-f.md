---
title: "ABC214-F — Substrings"
draft: true
authoringUnit: {"problemId":"abc214-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc214-f.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp","tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc214-editorial-2440-8404c7a84430603f504698d7a67b0eb89173b87ef656cf7e522e1d7ef121c7ac","source-abc214-f-problem-203e028b0a1974274025dd558bce523e82e7a094cc1d77c32448a6e2abd00b75"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各文字列をその末尾文字の最右の採用位置へ割り当てる。位置iに付加できるprefixは隣接を避けるためi−2以前で終わるものと空文字。直前の同文字位置kへ既に付加できたprefixを除けば重複は消える。よって新規分はprefix終了位置の連続区間の和となり、累積和で計算できる。任意の実現可能な文字列を末尾の同文字のより右の出現へ移しても隣接禁止を破らないので、この除去で実現可能な文字列を失わない。","sourceRevisionIds":["source-abc214-editorial-2440-8404c7a84430603f504698d7a67b0eb89173b87ef656cf7e522e1d7ef121c7ac","source-abc214-f-problem-203e028b0a1974274025dd558bce523e82e7a094cc1d77c32448a6e2abd00b75"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-order-preserving-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=aaa。","procedure":["一文字のaはどの位置を選んでも同一文字列。","長さ二のaaは位置1,3で作れる。","長さ三は隣接禁止に反する。"],"executionTarget":null,"expectedResult":"異なる非空文字列はa,aaの2個。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-sequence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-order-preserving-dp"],"prerequisiteIds":["unit-dp-state-design","unit-dp-transition-optimization"],"attainmentCondition":"S=abのときabも数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"数えない。二つの位置は隣接するため、合法なのはa,bの2個だけ。通常のdistinct-subsequence DPをそのまま使うとabを誤って追加する。"},"answer":{"reasoningOrVerification":"数えない。二つの位置は隣接するため、合法なのはa,bの2個だけ。通常のdistinct-subsequence DPをそのまま使うとabを誤って追加する。","procedure":["具体例の各状態・寄与を再計算する。","数えない。二つの位置は隣接するため、合法なのはa,bの2個だけ。通常のdistinct-subsequence DPをそのまま使うとabを誤って追加する。"],"expectedResult":"数えない。二つの位置は隣接するため、合法なのはa,bの2個だけ。通常のdistinct-subsequence DPをそのまま使うとabを誤って追加する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

対象外:

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

選んだ位置が隣り合わない部分列を数えるが、異なる位置集合から同じ文字列が得られる場合は一つとして数える必要がある。

位置 i の文字を末尾に使う文字列は、それ以前に同じ文字が最後に現れた位置 k より前の末尾から作る重複分を除くことで一意に数えられる。

棄却する候補: 各位置を選ぶか否かだけの DP で、隣接位置を同時に選ばない位置集合の個数を求める。

同じ文字列を作る異なる位置集合を別々に数えるため、問題が要求する相異なる部分列数にならない。

採用する候補: 各文字列を最後に採用した位置で分類する部分列 DP に、前の採用位置を一つ以上空ける遷移範囲を組み込む。

同じ末尾文字による重複を最終出現位置で排除しながら、非隣接条件も和を取る添字範囲で表せる。

通常の部分列 DP における最終出現による重複排除と、隣接位置を選べないことによる一つ手前までの遷移制限を同時に適用する。

dp₀ を空文字列の一通り、隣接禁止用の番兵 dp₁ を 0 と置くと、同じ形の区間和で先頭付近も処理できる。

末尾位置で分類した distinct-subsequence DP を作り、同じ文字の直前位置を左端、隣接を避けた位置を右端とする区間和を累積和で評価する。

## 典型の発動条件

### 最終出現による部分列の重複排除

発動条件: 異なる位置選択が同じ文字列を作り得るため、相異なる部分列だけを数えるとき。

現在文字と同じ文字の直前出現位置を境界にし、それ以前から作られる重複した末尾追加を遷移から除く。

### DP 遷移の累積和

発動条件: 各状態が連続した添字範囲の DP 値の総和として表されるとき。

最終出現位置から隣接禁止境界までの和を prefix sum の差で求める。

## 問題固有の要素

重複排除が文字の最終出現を左境界にし、非隣接制約が現在位置の一つ前を右境界から外すため、二条件が一つの区間和へ統合される。

別の問題へ持ち帰る視点: 部分列に局所的な位置制約を追加するときは、既存の重複排除 DP の遷移元範囲をどう狭めるかとして考える。

## 正当性

各文字列をその末尾文字の最右の採用位置へ割り当てる。位置iに付加できるprefixは隣接を避けるためi−2以前で終わるものと空文字。直前の同文字位置kへ既に付加できたprefixを除けば重複は消える。よって新規分はprefix終了位置の連続区間の和となり、累積和で計算できる。任意の実現可能な文字列を末尾の同文字のより右の出現へ移しても隣接禁止を破らないので、この除去で実現可能な文字列を失わない。

## 実装上の注意

- dp の添字は実際の文字位置から一つずれるため、存在しない最終出現を 0 とする番兵を含めて遷移範囲を固定する。
- 各区間和を法 10⁹＋7 で正規化し、最終的な合計から空文字列を含めない。

## 復習の核

- 部分列の個数を問われたら、位置集合の個数か生成文字列の個数かを最初に区別し、同じ文字の例で重複を検査する。
- 通常の最終出現 DP を基準にし、追加の位置制約が遷移元のどちらの境界を動かすかを式で比較する。

## 計算量と制約

### 時間

O(N)。アルファベット26種の最終出現と累積和を用いる。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string of length between 1 and 2 \times 10^5 (inclusive) consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=aaa。

1. 一文字のaはどの位置を選んでも同一文字列。
2. 長さ二のaaは位置1,3で作れる。
3. 長さ三は隣接禁止に反する。

期待される結果: 異なる非空文字列はa,aaの2個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=abのときabも数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

数えない。二つの位置は隣接するため、合法なのはa,bの2個だけ。通常のdistinct-subsequence DPをそのまま使うとabを誤って追加する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/editorial/2440) — source-abc214-editorial-2440-8404c7a84430603f504698d7a67b0eb89173b87ef656cf7e522e1d7ef121c7ac
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc214/tasks/abc214_f) — source-abc214-f-problem-203e028b0a1974274025dd558bce523e82e7a094cc1d77c32448a6e2abd00b75
