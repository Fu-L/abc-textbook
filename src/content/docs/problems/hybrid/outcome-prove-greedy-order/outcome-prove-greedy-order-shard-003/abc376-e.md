---
title: "ABC376-E — Max × Sum"
draft: true
authoringUnit: {"problemId":"abc376-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc376-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc376-e-problem-7bc711965a6cb1a7ffa745402a6fb1ece00c92df9108f71ecf78624601b0b740","source-abc376-editorial-11187-abe02a99a58ed4a8685fd3fd6fcfabae2aaf5b2597061f987de0b9d63ec82993"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"r を選択集合中で A が最大の最後の index とすれば、候補は prefix r に限定され、A の値は A_r に固定される。 max-heap に K-1 個を保ち、新しい B を入れて最大を捨てると、各 prefix の最小 K-1 個の和が維持される。 最大 A の担当を全探索することで積の二要素を分離でき、各 prefix の K-1 最小和を差分更新して O(N log N) になる。","sourceRevisionIds":["source-abc376-e-problem-7bc711965a6cb1a7ffa745402a6fb1ece00c92df9108f71ecf78624601b0b740","source-abc376-editorial-11187-abe02a99a58ed4a8685fd3fd6fcfabae2aaf5b2597061f987de0b9d63ec82993"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"pair(A,B)=(2,5),(3,1),(4,2)、K=2。","procedure":["集合12のcost3·6=18、13は4·7=28、23は4·3=12。","最後rでA最大を固定し前prefixの小さいBを選ぶ。"],"executionTarget":null,"expectedResult":"最小12。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-ordered-set-multiset"],"attainmentCondition":"現在B_rを先にheapへ入れて候補を計算してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"rを必ず選ぶときprefixのK−1個はrを除く必要がある。二重選択を防ぐため候補計算後に挿入する。"},"answer":{"reasoningOrVerification":"rを必ず選ぶときprefixのK−1個はrを除く必要がある。二重選択を防ぐため候補計算後に挿入する。","procedure":["具体例の各状態・寄与を再計算する。","rを必ず選ぶときprefixのK−1個はrを除く必要がある。二重選択を防ぐため候補計算後に挿入する。"],"expectedResult":"rを必ず選ぶときprefixのK−1個はrを除く必要がある。二重選択を防ぐため候補計算後に挿入する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 対称操作による状態の正規化。

## 考察

選ぶ K 個のうち A の最大値を与える index r を固定すると、A_r は定数になり、残り K-1 個はそれ以前の B が小さいものを選ぶだけでよい。

採用する候補: (A_i,B_i) を A 昇順に sort し、走査中にそれ以前の B の小さい K-1 個と総和を max-heap で維持して各 r を評価する。

最大 A の担当を全探索することで積の二要素を分離でき、各 prefix の K-1 最小和を差分更新して O(N log N) になる。

棄却する候補: A が小さい K 個、または B が小さい K 個をそのまま選ぶ。

目的は max A と sum B の積であり、一方だけを局所最小化しても他方との trade-off を考慮できない。

r を選択集合中で A が最大の最後の index とすれば、候補は prefix r に限定され、A の値は A_r に固定される。

max-heap に K-1 個を保ち、新しい B を入れて最大を捨てると、各 prefix の最小 K-1 個の和が維持される。

A 昇順に並べ、heap が r より前の B の最小 K-1 個を表す時だけ A_r×(B_r+sumHeap) で答えを更新する。その後 B_r を heap へ入れサイズを K-1 に戻す。

## 典型の発動条件

### 最大要素の担当を固定

発動条件: 目的関数に選択集合の max と加法量の積が含まれるとき。

max を与える要素を走査し、残りを prefix 内の単純最適化へ落とす。

## 問題固有の要素

非線形な max×sum でも max の担当を決めれば残りは K-smallest の線形問題になる。

別の問題へ持ち帰る視点: ソート後の prefix 条件と heap の差分更新を組み合わせる定番形である。

## 正当性

r を選択集合中で A が最大の最後の index とすれば、候補は prefix r に限定され、A の値は A_r に固定される。 max-heap に K-1 個を保ち、新しい B を入れて最大を捨てると、各 prefix の最小 K-1 個の和が維持される。 最大 A の担当を全探索することで積の二要素を分離でき、各 prefix の K-1 最小和を差分更新して O(N log N) になる。

## 実装上の注意

- 同じ A の順序は任意でも全候補を評価できる。heap に r 自身を入れる前に評価し、K=1 では空 heap を扱う。

## 復習の核

- 集合中の最大 A を担う要素に印を付けた小例を作り、残りがなぜ B だけで選べるかを確認する。

## 計算量と制約

### 時間

O(N log N+N log K)、sortとK−1小値heap。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq K \leq N \leq 2 \times 10^5; 1 \leq A_i, B_i \leq 10^6; The sum of N over all test cases is at most 2 \times 10^5.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

pair(A,B)=(2,5),(3,1),(4,2)、K=2。

1. 集合12のcost3·6=18、13は4·7=28、23は4·3=12。
2. 最後rでA最大を固定し前prefixの小さいBを選ぶ。

期待される結果: 最小12。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

現在B_rを先にheapへ入れて候補を計算してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

rを必ず選ぶときprefixのK−1個はrを除く必要がある。二重選択を防ぐため候補計算後に挿入する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc376/tasks/abc376_e) — source-abc376-e-problem-7bc711965a6cb1a7ffa745402a6fb1ece00c92df9108f71ecf78624601b0b740
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc376/editorial/11187) — source-abc376-editorial-11187-abe02a99a58ed4a8685fd3fd6fcfabae2aaf5b2597061f987de0b9d63ec82993
