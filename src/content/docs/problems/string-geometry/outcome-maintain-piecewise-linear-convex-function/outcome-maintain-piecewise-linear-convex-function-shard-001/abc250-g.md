---
title: "ABC250-G — Stonks"
draft: true
authoringUnit: {"problemId":"abc250-g","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc250-g.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-priority-queue-best-first"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick","tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc250-editorial-3929-7268adfb77e862152c0813b8f7f1c052ebbaa2479c7c002b297a92a61e43550b","source-abc250-g-problem-04fa701869f3e1dcb4924c6b3fea60c63a251e0badcb3ce5bd629c2ac9384907"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"所持株数に対する最大利益DPは凹で、限界的に一株増やす費用の変化点を最小ヒープに保持できる。価格pが最小値mを上回ると、最安の限界買値をpで売ることでp−mだけ最終利益が改善する。mを取り除きpを二個挿入するのは、pでの新規購入候補と、過去の売却を後で取り消してより高く売る候補の両方を残す操作である。そうでなければ新規購入候補一個を追加する。これは毎日の購入・売却・待機DPを圧縮した更新であり、同一日に二回実売買するという意味ではない。","sourceRevisionIds":["source-abc250-editorial-3929-7268adfb77e862152c0813b8f7f1c052ebbaa2479c7c002b297a92a61e43550b","source-abc250-g-problem-04fa701869f3e1dcb4924c6b3fea60c63a251e0badcb3ce5bd629c2ac9384907"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"価格[1,2,100]。","procedure":["初期heap=[1]、利益0。","2の日に1をpopし利益1、heapへ2を二個入れる。","100の日に2を一個popし利益98を追加する。これは前日の売却を100へ付け替えることに相当する。"],"executionTarget":null,"expectedResult":"利益99。実際には1で買い100で売れば達成できる。","verificationStatus":"not_applicable","learningUnitIds":["unit-slope-trick"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"prerequisiteIds":["unit-basic-convex-optimization","unit-priority-queue-best-first"],"attainmentCondition":"価格[3,2,1]で利益を得られるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"得られず0。各日で現在価格はheap最小値以下だから差益更新はなく、減少列で無理に取引しない。"},"answer":{"reasoningOrVerification":"得られず0。各日で現在価格はheap最小値以下だから差益更新はなく、減少列で無理に取引しない。","procedure":["具体例の各状態・寄与を再計算する。","得られず0。各日で現在価格はheap最小値以下だから差益更新はなく、減少列で無理に取引しない。"],"expectedResult":"得られず0。各日で現在価格はheap最小値以下だから差益更新はなく、減少列で無理に取引しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

日ごとの所持株数を持つDPは所持数に対して凹な折れ線になり、売買で増える傾きを価格の多重集合として管理できる。

採用する候補: 傾きを最小ヒープで管理するslope trick

各価格を傾きの変化点として挿入し、現在の最小買値より高く売れるときだけ差益を確定すれば、凹DP全体を線形個の要素で表せる。

棄却する候補: 日数と所持株数を列挙するDP

所持可能数が日数に比例するため二次状態となり、N=2×10^5では間に合わない。

最小の未対応買値mが今日の価格Pより小さければP-mを利益へ加え、mを取り除いてPを2個挿入する更新がDPの傾き変化を正確に表す。

利益が出ない日もPを1個挿入することで、将来の売却候補となる新しい傾きを残す。

利益を0、最小ヒープを最初の価格一個で初期化する。二日目以降は挿入前の最小値mとP_iを比較し、m<P_iならmを一つ取り出して利益へP_i-mを加え、P_iを二個挿入する。そうでなければP_iを一個挿入する。heapは取引候補の限界費用を表し、過去の売りを後から取り消してより高い価格へ付け替えられる。価格[1,2,100]では利益は1+98=99となる。全体O(N log N)。

## 典型の発動条件

### slope trick

発動条件: 整数状態上の凹・凸なDPが区分線形関数として表せる。

所持株数方向の傾き変化点を価格の多重集合で保持し、日ごとの遷移を挿入・置換にする。

### 優先度付きキューによる売買対応

発動条件: 過去の候補のうち最も安いものを現在価格と対応させたい。

最小買値を取り出して正の差益だけを確定し、売値を将来の境界として戻す。

## 問題固有の要素

ヒープの要素は実際の一対一売買履歴ではなく、所持数DPの傾きであり、売却時に同価格を二重挿入することが状態遷移を保存する。

別の問題へ持ち帰る視点: 大きな離散状態を持つ最適化でも、値関数の凸凹性があれば傾きの変化点だけを管理できる。

## 正当性

所持株数に対する最大利益DPは凹で、限界的に一株増やす費用の変化点を最小ヒープに保持できる。価格pが最小値mを上回ると、最安の限界買値をpで売ることでp−mだけ最終利益が改善する。mを取り除きpを二個挿入するのは、pでの新規購入候補と、過去の売却を後で取り消してより高く売る候補の両方を残す操作である。そうでなければ新規購入候補一個を追加する。これは毎日の購入・売却・待機DPを圧縮した更新であり、同一日に二回実売買するという意味ではない。

## 実装上の注意

- 利益は64ビット整数で持ち、同価格を多重集合として重複保持する。m<P_iのときだけ差益を加え、P_iの挿入個数を間違えない。

## 復習の核

- Nが小さい所持株数DPと比較し、単調増加・単調減少・同価格の連続・同日にヒープへ二重挿入する更新を検証する。

## 計算量と制約

### 時間

O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 2 \times 10^5; 1 \le P_i \le 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

価格[1,2,100]。

1. 初期heap=[1]、利益0。
2. 2の日に1をpopし利益1、heapへ2を二個入れる。
3. 100の日に2を一個popし利益98を追加する。これは前日の売却を100へ付け替えることに相当する。

期待される結果: 利益99。実際には1で買い100で売れば達成できる。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

価格[3,2,1]で利益を得られるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

得られず0。各日で現在価格はheap最小値以下だから差益更新はなく、減少列で無理に取引しない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/editorial/3929) — source-abc250-editorial-3929-7268adfb77e862152c0813b8f7f1c052ebbaa2479c7c002b297a92a61e43550b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc250/tasks/abc250_g) — source-abc250-g-problem-04fa701869f3e1dcb4924c6b3fea60c63a251e0badcb3ce5bd629c2ac9384907
