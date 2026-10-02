---
title: "ABC218-H — Red and Blue Lamps"
draft: true
authoringUnit: {"problemId":"abc218-h","docPath":"src/content/docs/problems/graph-search/outcome-optimize-path-matching-by-contraction/outcome-optimize-path-matching-by-contraction-shard-001/abc218-h.md","learningOutcomeIds":["outcome-optimize-path-matching-by-contraction"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange","unit-linked-list-index","unit-normalization","unit-priority-queue-best-first"],"excludedTopics":["path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-path-matching-contraction","tag-linked-list-index","tag-priority-queue-best-first","tag-state-normalization"],"sourceRevisionIds":["source-abc218-editorial-2602-b0528a6671f0dcdb9faa1ec4ef660172c27c9dca2be84a213d6fccf220956ae8","source-abc218-h-problem-ef3aa80259d7936f07de61bb8bc41cb0f8441d5233bcd9d91c8e61b6e30cce70"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"正Aの交換論で少数色を隣接しない最適にでき、孤立点の報酬Bは両側境界和。最大B_iを選ぶ/選ばず両隣を選ぶ差をB_left−B_i+B_rightへ縮約すると、一選択済み後の同型問題を正確に残す。最大をR回採る帰納法で非隣接R個最大和を得る。","sourceRevisionIds":["source-abc218-editorial-2602-b0528a6671f0dcdb9faa1ec4ef660172c27c9dca2be84a213d6fccf220956ae8","source-abc218-h-problem-ef3aa80259d7936f07de61bb8bc41cb0f8441d5233bcd9d91c8e61b6e30cce70"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-optimize-path-matching-by-contraction"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=4,R=1,A=(2,5,3)。","procedure":["B=(2,7,8,3)。","最大は位置3の8。","色BBRBで異色辺報酬5+3。"],"executionTarget":null,"expectedResult":"8","verificationStatus":"not_applicable","learningUnitIds":["unit-path-matching-contraction"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-optimize-path-matching-by-contraction"],"prerequisiteIds":["unit-greedy-exchange","unit-linked-list-index","unit-normalization","unit-priority-queue-best-first"],"attainmentCondition":"contractionをせず最大Bを削り隣も永久に除くとR>1でも最適か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"一般に不可。後で中央の選択を両隣へ交換する可能性を補正値に残す必要がある。"},"answer":{"reasoningOrVerification":"一般に不可。後で中央の選択を両隣へ交換する可能性を補正値に残す必要がある。","procedure":["具体例の各状態・寄与を再計算する。","一般に不可。後で中央の選択を両隣へ交換する可能性を補正値に残す必要がある。"],"expectedResult":"一般に不可。後で中央の選択を両隣へ交換する可能性を補正値に残す必要がある。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [path matchingのheap縮約greedy](src/content/docs/learn/graph/path-matching-contraction.md)

- 重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [要素索引と連結リストで局所linkを更新する](src/content/docs/learn/query/linked-list-index.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

赤青を交換しても異色になる隣接辺は変わらないため、選ぶ少数色の個数を min(R,N-R) としてよい。A_i は全て正なので、公式の交換操作により少数色が隣り合わない最適解を選べる。 少数色のランプ i を孤立して選ぶと、左右の境界辺の報酬をまとめた B_i=A_{i-1}+A_i を得る。端では存在する一辺だけを使うため、問題は列 B から隣接しない R 個を選ぶ最大和へ変わる。 内部の最大値 B_i を確定した後、三要素を B_{i-1}-B_i+B_{i+1} に置き換えると、元問題で中央を選ばない場合の両隣の利益差まで縮約後の一要素が表す。

採用する候補: B の最大要素を選ぶたび、隣接三要素を一つの補正値へ縮約する公式の貪欲法を、priority queue と双方向連結で実装する。

局所三要素の「中央を選ぶ／両隣を選ぶ」という二場合を補正値 B_{i-1}-B_i+B_{i+1} に保存でき、選択数を一つ減らした同型問題へ帰着できる。

棄却する候補: 位置と選んだ個数を状態にした通常の DP で、隣接しない R 要素の最大和を求める。

正しいが状態数が N×R となり、R が N/2 程度まである制約では実行できない。

棄却する候補: 選択一個ごとの罰金を導入し、個数付き線形 DP と二分探索を行う。

公式に示された有効な別解だが、個数に関する上凸性と tie-break を伴うため、この record では局所縮約を直接追える貪欲法を採用する。

内部の最大値 B_i を確定した後、三要素を B_{i-1}-B_i+B_{i+1} に置き換えると、元問題で中央を選ばない場合の両隣の利益差まで縮約後の一要素が表す。

R を min(R,N-R) にし、B_1=A_1、B_N=A_{N-1}、内部 B_i=A_{i-1}+A_i を作る。最大 B_i を R 回取り出して答えへ加え、端なら二要素を、内部なら両隣を削除して補正値を置き、隣接 link と heap を更新する。

## 典型の発動条件

### 色反転による少数側への正規化

発動条件: 二色の役割を交換しても目的値が不変で、片方の個数だけが指定されるとき。

選ぶ色の個数を min(R,N-R) に抑え、構造定理を少数側に適用する。

### 隣接非選択最大和の局所縮約

発動条件: 列から隣接しない要素を固定個数選び、最大値の選択を補正値付きの短い列へ移せるとき。

最大要素と両隣を縮約し、priority queue と linked list で貪欲選択を反復する。

## 問題固有の要素

元の報酬は辺に付くが、少数色が孤立する最適解を示すことで、各少数色ランプへ隣接二辺の報酬を重複なく移せる。

別の問題へ持ち帰る視点: 局所境界に報酬が付く二色列では、同色ブロックの交換で最適解の形を絞り、辺の重みを選択頂点の重みへ移せないか考える。

## 正当性

正Aの交換論で少数色を隣接しない最適にでき、孤立点の報酬Bは両側境界和。最大B_iを選ぶ/選ばず両隣を選ぶ差をB_left−B_i+B_rightへ縮約すると、一選択済み後の同型問題を正確に残す。最大をR回採る帰納法で非隣接R個最大和を得る。

## 実装上の注意

- heap 内の古い候補を version または alive 情報で捨て、縮約後の左右 link を正しくつなぐ。端点の縮約は内部の三要素式と分け、重み和は 64 bit にする。

## 復習の核

- 三要素で中央を選ぶ解と両端を選ぶ解を比較し、補正値 B_left-B_mid+B_right が何を持ち越すかを式から再導出する。

## 計算量と制約

### 時間

Nランプ、少数色R=min(R,N−R)。heap contraction O((N+R)log N)。

### 空間

alive link、heapと値 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq R \leq N-1; 1 \leq A_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=4,R=1,A=(2,5,3)。

1. B=(2,7,8,3)。
2. 最大は位置3の8。
3. 色BBRBで異色辺報酬5+3。

期待される結果: 8

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

contractionをせず最大Bを削り隣も永久に除くとR>1でも最適か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

一般に不可。後で中央の選択を両隣へ交換する可能性を補正値に残す必要がある。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/editorial/2602) — source-abc218-editorial-2602-b0528a6671f0dcdb9faa1ec4ef660172c27c9dca2be84a213d6fccf220956ae8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc218/tasks/abc218_h) — source-abc218-h-problem-ef3aa80259d7936f07de61bb8bc41cb0f8441d5233bcd9d91c8e61b6e30cce70
