---
title: "ABC435-E — Cover query"
draft: true
authoringUnit: {"problemId":"abc435-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-interval-partition/outcome-maintain-ordered-interval-partition-shard-001/abc435-e.md","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-ordered-set-multiset"],"excludedTopics":["端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-interval-partition","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc435-e-problem-5227c9034b5752c55f7b3016adf5e19e52c5bdec91124387880c04a2700827b5","source-abc435-editorial-14733-0e61d37e3106540e780b0121efa0e3e48e9aa8db6e9351b0421ca9ff3fd6bc2b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"交差区間は順序付き集合中で連続し、最初は r≥L となる区間を lower_bound で見つければよい。 一回の削除で区間数が増えるのは一つの区間が左右へ割れる場合だけで増分 1。したがって完全に消される区間の総数も初期数+全増分に抑えられる。 各クエリの境界処理は定数個、完全削除区間は全体で O(Q) 個なので O(Q log Q) に償却できる。","sourceRevisionIds":["source-abc435-e-problem-5227c9034b5752c55f7b3016adf5e19e52c5bdec91124387880c04a2700827b5","source-abc435-editorial-14733-0e61d37e3106540e780b0121efa0e3e48e9aa8db6e9351b0421ca9ff3fd6bc2b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=7、[3,5]、次に[2,6]を黒くする。","procedure":["初回の白区間は[1,2],[6,7]で4マス。","次回は交差する2,6だけ追加で黒くなる。"],"executionTarget":null,"expectedResult":"白数は4,2。","verificationStatus":"not_applicable","learningUnitIds":["unit-ordered-interval-partition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"prerequisiteIds":["unit-amortized-monotone-progress","unit-ordered-set-multiset"],"attainmentCondition":"既に黒い[3,5]を再び黒くすると何を引くか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"交差する白区間がないので0を引く。区間長3を無条件に引いてはいけない。"},"answer":{"reasoningOrVerification":"交差する白区間がないので0を引く。区間長3を無条件に引いてはいけない。","procedure":["具体例の各状態・寄与を再計算する。","交差する白区間がないので0を引く。区間長3を無条件に引いてはいけない。"],"expectedResult":"交差する白区間がないので0を引く。区間長3を無条件に引いてはいけない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

白マス集合は互いに素な極大区間の順序付き集合として持てる。黒くする [L,R] と交差する区間だけを削除し、左右にはみ出した部分を高々二つ戻せばよい。

採用する候補: 白い極大区間を始点順の ordered set で管理し、[L,R] と交差する連続した区間だけ列挙・分割する。

各クエリの境界処理は定数個、完全削除区間は全体で O(Q) 個なので O(Q log Q) に償却できる。

棄却する候補: 長さ N の配列で各マスの色を持ち、クエリ区間を全走査する。

N や区間長が大きく、同じ黒マスを何度も処理して O(NQ) になり得る。

交差区間は順序付き集合中で連続し、最初は r≥L となる区間を lower_bound で見つければよい。

一回の削除で区間数が増えるのは一つの区間が左右へ割れる場合だけで増分 1。したがって完全に消される区間の総数も初期数+全増分に抑えられる。

set に [1,N] を入れ白マス総数 total=N とする。各 [L,R] で r≥L の最初の区間から l≤R の間だけ erase し、交差長を total から引く。l<L なら [l,L-1]、R<r なら [R+1,r] を insert し、total を出力する。

## 典型の発動条件

### 互いに素な区間の ordered set

発動条件: 単調に削除される一次元集合へ範囲削除を行い、残存長を求めるとき。

白い連続成分だけを保持し、交差成分の split/erase に限定する。

### 削除の償却解析

発動条件: 一回の更新で多数の区間を消すが、新しい区間の生成数が定数のとき。

各消滅区間を過去の初期・生成イベントへ課金して総反復数を O(Q) にする。

## 問題固有の要素

単調な塗りつぶしでは既に消えた点を再訪せず、現在の連続成分単位で処理するのが本質である。

別の問題へ持ち帰る視点: 範囲更新で大量 erase が起きても、split による要素増加が小さければ ordered set 走査を償却できる。

## 正当性

交差区間は順序付き集合中で連続し、最初は r≥L となる区間を lower_bound で見つければよい。 一回の削除で区間数が増えるのは一つの区間が左右へ割れる場合だけで増分 1。したがって完全に消される区間の総数も初期数+全増分に抑えられる。 各クエリの境界処理は定数個、完全削除区間は全体で O(Q) 個なので O(Q log Q) に償却できる。

## 実装上の注意

- 探索 key が始点基準なら L を含み得る直前区間も確認する。erase 中の iterator 更新、左右残片の空区間除外、total の差分を正確に行う。

## 復習の核

- [L,R] と交差する最初の区間を取り逃さず、各交差長を一度だけ total から引いているかを確認する。

## 計算量と制約

### 時間

全Q質問で償却O(Q log Q)。

### 空間

O(Q)、白極大区間。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 10^9; 1\leq Q\leq 2\times 10^5; 1\leq L_i\leq R_i\leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=7、[3,5]、次に[2,6]を黒くする。

1. 初回の白区間は[1,2],[6,7]で4マス。
2. 次回は交差する2,6だけ追加で黒くなる。

期待される結果: 白数は4,2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

既に黒い[3,5]を再び黒くすると何を引くか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

交差する白区間がないので0を引く。区間長3を無条件に引いてはいけない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/tasks/abc435_e) — source-abc435-e-problem-5227c9034b5752c55f7b3016adf5e19e52c5bdec91124387880c04a2700827b5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/editorial/14733) — source-abc435-editorial-14733-0e61d37e3106540e780b0121efa0e3e48e9aa8db6e9351b0421ca9ff3fd6bc2b
