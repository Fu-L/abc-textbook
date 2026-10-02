---
title: "ABC292-EX — Rating Estimator"
draft: true
authoringUnit: {"problemId":"abc292-ex","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc292-ex.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc292-editorial-5887-7498e511a2951ba3c4f47d7ef98b7c42f5f9a34d616491b4d39b45c93e8cfb43","source-abc292-ex-problem-9f6fad77868d72dbd6f000ad47dea0254c74ec49279cbf1d42f024da899fc99b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"列S,Tの結合は(sumS+sumT,max(maxPrefS,sumS+maxPrefT))というモノイドになる。 結合(sum,maxPrefix)で一点更新・最初の非負prefix探索・必要prefix和を全て対数時間にできる。","sourceRevisionIds":["source-abc292-editorial-5887-7498e511a2951ba3c4f47d7ef98b7c42f5f9a34d616491b4d39b45c93e8cfb43","source-abc292-ex-problem-9f6fad77868d72dbd6f000ad47dea0254c74ec49279cbf1d42f024da899fc99b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-associative-range-summary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"B=5、p=(3,8,1)。","procedure":["q=(-2,3,-4)、非空prefix和は-2,1,-3。","最初の非負prefixは位置2、平均は11/2。"],"executionTarget":null,"expectedResult":"最初の基準達成位置は2。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-monoid-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-associative-range-summary"],"prerequisiteIds":[],"attainmentCondition":"空prefixを探索候補に含めてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"空prefixは常に0なので位置0を誤って返す。問題の非空prefix定義と単位元のmaxPrefixを分ける。"},"answer":{"reasoningOrVerification":"空prefixは常に0なので位置0を誤って返す。問題の非空prefix定義と単位元のmaxPrefixを分ける。","procedure":["具体例の各状態・寄与を再計算する。","空prefixは常に0なので位置0を誤って返す。問題の非空prefix定義と単位元のmaxPrefixを分ける。"],"expectedResult":"空prefixは常に0なので位置0を誤って返す。問題の非空prefix定義と単位元のmaxPrefixを分ける。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

平均が初めてB以上になる位置は、q_i=p_i-Bのprefix和が初めて0以上になる位置である。

採用する候補: 区間和と最大prefix和を持つsegment tree

結合(sum,maxPrefix)で一点更新・最初の非負prefix探索・必要prefix和を全て対数時間にできる。

棄却する候補: 更新後に先頭から走査

Q回でO(NQ)になる。

列S,Tの結合は(sumS+sumT,max(maxPrefS,sumS+maxPrefT))というモノイドになる。

qを葉に置き、max_right相当の木上二分探索で最初のprefix和≥0のsを求め、prefix和から指定式のratingを計算する。

## 典型の発動条件

### prefix最大モノイド

発動条件: 更新列で閾値を初めて越えるprefixを探す。

区間和と最大prefix和を結合してsegment treeに載せる。

### segment tree上の二分探索

発動条件: prefix判定が単調に失敗する最初の位置が欲しい。

左から節点を降りてsを求める。

## 問題固有の要素

平均条件をp_i-Bの符号付き累積和へ移すと、動的な最初の閾値越えになる。

別の問題へ持ち帰る視点: 動的平均条件は基準値を各項から引いてprefix問題へ変換する。

## 正当性

列S,Tの結合は(sumS+sumT,max(maxPrefS,sumS+maxPrefT))というモノイドになる。 結合(sum,maxPrefix)で一点更新・最初の非負prefix探索・必要prefix和を全て対数時間にできる。

## 実装上の注意

- 非負prefixが無い場合はs=Nとし、葉・単位元のmaxPrefix定義を空区間と混同しない。

## 復習の核

- 直接prefix走査と照合し、最初の要素で到達・最後まで負・更新でsが左右へ動く例を確認する。

## 計算量と制約

### 時間

O(N+Q log N)、木上探索で最初の非負prefixを得る。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 1 \leq B \leq 10^9; 1 \leq Q \leq 10^5; 0 \leq a_i \leq 10^9; 1 \leq c \leq N; 0 \leq x \leq 10^9; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

B=5、p=(3,8,1)。

1. q=(-2,3,-4)、非空prefix和は-2,1,-3。
2. 最初の非負prefixは位置2、平均は11/2。

期待される結果: 最初の基準達成位置は2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

空prefixを探索候補に含めてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

空prefixは常に0なので位置0を誤って返す。問題の非空prefix定義と単位元のmaxPrefixを分ける。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/editorial/5887) — source-abc292-editorial-5887-7498e511a2951ba3c4f47d7ef98b7c42f5f9a34d616491b4d39b45c93e8cfb43
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc292/tasks/abc292_h) — source-abc292-ex-problem-9f6fad77868d72dbd6f000ad47dea0254c74ec49279cbf1d42f024da899fc99b
