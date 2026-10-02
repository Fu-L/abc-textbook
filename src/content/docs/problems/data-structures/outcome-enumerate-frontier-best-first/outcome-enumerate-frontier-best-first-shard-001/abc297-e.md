---
title: "ABC297-E — Kth Takoyaki Set"
draft: true
authoringUnit: {"problemId":"abc297-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc297-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-shortest-path"],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first","tag-shortest-path"],"sourceRevisionIds":["source-abc297-e-problem-c2bdfd3a97f8ac4edb44e2f8d2f6b4b51f4c118a1bfdd81ba9c479e80d3305d8","source-abc297-editorial-6167-210ab57043c1914bb3db0109bee8e686beeed0306098c0c93ca075a0bdc30886"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"次の金額の買い方から一個外せば既に確定済み以下の金額になるため、確定集合から一手足した候補だけ見れば十分。 0からv→v+A_jを生成し、最小値を重複除去しながらK個確定すれば買い方を列挙せず順位値を得られる。","sourceRevisionIds":["source-abc297-e-problem-c2bdfd3a97f8ac4edb44e2f8d2f6b4b51f4c118a1bfdd81ba9c479e80d3305d8","source-abc297-editorial-6167-210ab57043c1914bb3db0109bee8e686beeed0306098c0c93ca075a0bdc30886"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"価格A=(3,5)、正の異なる金額の4番目。","procedure":["0から3,5を生成。","確定順は0,3,5,6,8。6=3+3、8=3+5。"],"executionTarget":null,"expectedResult":"答え8。","verificationStatus":"not_applicable","learningUnitIds":["unit-priority-queue-best-first"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"prerequisiteIds":["unit-weighted-shortest-path"],"attainmentCondition":"8を別の順の買い方3+5と5+3で二回数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"金額の順位なので一回。重複pop時には順位を進めず子も再生成しない。"},"answer":{"reasoningOrVerification":"金額の順位なので一回。重複pop時には順位を進めず子も再生成しない。","procedure":["具体例の各状態・寄与を再計算する。","金額の順位なので一回。重複pop時には順位を進めず子も再生成しない。"],"expectedResult":"金額の順位なので一回。重複pop時には順位を進めず子も再生成しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

既知の安い金額vへたこ焼き一個A_jを足した値の中に、次に安い未出金額が必ず存在する。

採用する候補: 最小heapで金額グラフをDijkstra風列挙

0からv→v+A_jを生成し、最小値を重複除去しながらK個確定すれば買い方を列挙せず順位値を得られる。

棄却する候補: 各種類0..K個の個数全探索

K^Nで指数的。

次の金額の買い方から一個外せば既に確定済み以下の金額になるため、確定集合から一手足した候補だけ見れば十分。

heapへ0を入れ、最小値を取り出して直前確定値と異なる時だけ順位を進め、そのv+A_jを全j挿入する。0を含む順位補正後のK番目を返す。

## 典型の発動条件

### 暗黙グラフのbest-first search

発動条件: 非負加算で生成される半群の小さい値を順に列挙する。

min-heapから確定値を取り出し各generatorを足す。

### 重複除去

発動条件: 異なる買い方が同額になる。

同じheap値は順位で一度だけ数える。

## 問題固有の要素

買い方ではなく到達金額を頂点とみなすと、無限状態でも先頭K個だけDijkstra風に生成できる。

別の問題へ持ち帰る視点: 非負generatorのK小値はbest-firstで列挙する。

## 正当性

次の金額の買い方から一個外せば既に確定済み以下の金額になるため、確定集合から一手足した候補だけ見れば十分。 0からv→v+A_jを生成し、最小値を重複除去しながらK個確定すれば買い方を列挙せず順位値を得られる。

## 実装上の注意

- 0円を含めるためKを一つずらし、同額popでは子生成を重複させない実装方針を統一する。

## 復習の核

- 小Kの個数全探索と比較し、A重複、同額を複数和で作る例、N=1を確認する。

## 計算量と制約

### 時間

O(NK log(NK))、Nは種類数、Kは求める順位。重複popを含め高々O(NK)候補。

### 空間

O(NK)、heap。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10; 1 \le K \le 2 \times 10^5; 1 \le A_i \le 10^9; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

価格A=(3,5)、正の異なる金額の4番目。

1. 0から3,5を生成。
2. 確定順は0,3,5,6,8。6=3+3、8=3+5。

期待される結果: 答え8。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

8を別の順の買い方3+5と5+3で二回数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

金額の順位なので一回。重複pop時には順位を進めず子も再生成しない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/tasks/abc297_e) — source-abc297-e-problem-c2bdfd3a97f8ac4edb44e2f8d2f6b4b51f4c118a1bfdd81ba9c479e80d3305d8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc297/editorial/6167) — source-abc297-editorial-6167-210ab57043c1914bb3db0109bee8e686beeed0306098c0c93ca075a0bdc30886
