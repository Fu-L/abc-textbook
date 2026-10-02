---
title: "ABC248-EX — Beautiful Subsequences"
draft: true
authoringUnit: {"problemId":"abc248-ex","docPath":"src/content/docs/problems/data-structures/outcome-prune-dominated-candidates-once/outcome-prune-dominated-candidates-once-shard-001/abc248-ex.md","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-actions","unit-range-monoid-aggregation"],"excludedTopics":["全候補から極値を反復取得するheap・ordered set。"],"tagIds":["tag-monotone-stack-queue","tag-lazy-segment-action","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc248-editorial-3748-51de1a635ac39c7fc5b595ff37e3681992e2acc608fc251c5f78b57f45d0bc6b","source-abc248-ex-problem-baf24b6ac5cb67b9c0b284a4a5ce0b4d0970da1abe68fafc5eb086f954a2e49d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"新しい P_R が suffix maximum を更新する左端範囲は単調 stack の pop 区間として互いにまとめられ、max の増分だけ V へ range add できる。minimum も対称に更新できる。 R の増加で -(R-L) は全 active L に -1 を加え、新しい L=R の値は 0 から始まる。これらも range add と point activation で表せる。 V は非負整数で root の最小値は active な singleton により 0 なので、小さい distinct 値を K+1 個と各個数だけ保持すれば、値≤K の個数を復元できる。 K≤3 と V_L≥0 を使い、全左端の値を持ちながら条件内の小値だけを root から数えられる。","sourceRevisionIds":["source-abc248-editorial-3748-51de1a635ac39c7fc5b595ff37e3681992e2acc608fc251c5f78b57f45d0bc6b","source-abc248-ex-problem-baf24b6ac5cb67b9c0b284a4a5ce0b4d0970da1abe68fafc5eb086f954a2e49d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"P=(2,1,3)、K=0。","procedure":["singleton三つはV=0。","長さ2は(2,1)だけV=0、全域もV=0。"],"executionTarget":null,"expectedResult":"条件区間は5個。","verificationStatus":"not_applicable","learningUnitIds":["unit-monotone-stack-queue"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prune-dominated-candidates-once"],"prerequisiteIds":["unit-range-actions","unit-range-monoid-aggregation"],"attainmentCondition":"P=(1,1)でもV≥0と仮定できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"順列でなく重複があればmax−min−(R−L)=−1となる。小値K+1段で十分な証明は順列の非負性に依存する。"},"answer":{"reasoningOrVerification":"順列でなく重複があればmax−min−(R−L)=−1となる。小値K+1段で十分な証明は順列の非負性に依存する。","procedure":["具体例の各状態・寄与を再計算する。","順列でなく重複があればmax−min−(R−L)=−1となる。小値K+1段で十分な証明は順列の非負性に依存する。"],"expectedResult":"順列でなく重複があればmax−min−(R−L)=−1となる。小値K+1段で十分な証明は順列の非負性に依存する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)

- 候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 全候補から極値を反復取得するheap・ordered set。

## 考察

P は permutation なので長さ len=R-L+1 の区間では max-min≥len-1=R-L であり、V_L=max(P_L…P_R)-min(P_L…P_R)-(R-L) は常に非負整数である。

固定した右端 R について条件を満たす左端数は V_L≤K の個数で、R を 1 ずつ進めたとき全 L の V_L は区間加算として更新できる。

採用する候補: 単調 stack で suffix max/min が変わる左端区間を求め、V_L に range add する。segment tree の各 node に小さい値と個数を K+1 段まで保持する。

K≤3 と V_L≥0 を使い、全左端の値を持ちながら条件内の小値だけを root から数えられる。

棄却する候補: 全 L,R を列挙し、区間 max/min を RMQ で取得して不等式を判定する。

区間が二次個あるため、各判定を定数または対数時間にしても N≤1.4×10^5 では間に合わない。

新しい P_R が suffix maximum を更新する左端範囲は単調 stack の pop 区間として互いにまとめられ、max の増分だけ V へ range add できる。minimum も対称に更新できる。

R の増加で -(R-L) は全 active L に -1 を加え、新しい L=R の値は 0 から始まる。これらも range add と point activation で表せる。

V は非負整数で root の最小値は active な singleton により 0 なので、小さい distinct 値を K+1 個と各個数だけ保持すれば、値≤K の個数を復元できる。

未使用 L を INF にした lazy segment tree を用意する。各 R で既存 active 範囲へ -1、新要素による suffix max/min の変化量を monotone stack が示す区間へ加算し、L=R を V=0 で有効化する。root の保持 pair のうち value≤K の count を答えへ足す。

## 典型の発動条件

### monotone stack による suffix extrema 更新

発動条件: 右端を伸ばすたび、全左端に対する区間 max/min の変化をまとめて処理したいとき。

pop された extrema の担当左端区間へ、新値との差を range add する。

### 上位少数値を持つ lazy segment tree

発動条件: 全要素への区間加算があり、小さい固定閾値内の要素数だけが必要なとき。

各 node で K+1 個の最小 distinct 値と multiplicity を merge し、lazy を値へ一括加算する。

## 問題固有の要素

permutation の max-min は区間長-1 以上という下界により slack V が非負になり、K≤3 の条件は最小側 K+1 段だけを見る問題へ変わる。

別の問題へ持ち帰る視点: 小さい K の不等式数え上げでは、対象量の整数下界を示してから、閾値近傍の少数 rank だけを data structure に持てないか考える。

## 正当性

新しい P_R が suffix maximum を更新する左端範囲は単調 stack の pop 区間として互いにまとめられ、max の増分だけ V へ range add できる。minimum も対称に更新できる。 R の増加で -(R-L) は全 active L に -1 を加え、新しい L=R の値は 0 から始まる。これらも range add と point activation で表せる。 V は非負整数で root の最小値は active な singleton により 0 なので、小さい distinct 値を K+1 個と各個数だけ保持すれば、値≤K の個数を復元できる。 K≤3 と V_L≥0 を使い、全左端の値を持ちながら条件内の小値だけを root から数えられる。

## 実装上の注意

- node merge では左右の最大 2(K+1) 個の pair を値順にまとめ、同値の count を合算してから最小 K+1 distinct 値だけ残す。
- 未有効な L の INF が range add で有効値へ落ちないよう十分大きくし、max stack と min stack の区間端を off-by-one なく対応させる。

## 復習の核

- R を 1 回伸ばした小さな permutation で各 L の V を表にし、max/min stack の加算と全体 -1 後に segment tree の値が一致するか追跡する。

## 計算量と制約

### 時間

O((K+1)N log N)、K≤3、各nodeで最小K+1 distinct値をmerge。

### 空間

O((K+1)N)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 1.4\times 10^5; P is a permutation of (1,\ldots,N).; 0 \leq K \leq 3; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

P=(2,1,3)、K=0。

1. singleton三つはV=0。
2. 長さ2は(2,1)だけV=0、全域もV=0。

期待される結果: 条件区間は5個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

P=(1,1)でもV≥0と仮定できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

順列でなく重複があればmax−min−(R−L)=−1となる。小値K+1段で十分な証明は順列の非負性に依存する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/editorial/3748) — source-abc248-editorial-3748-51de1a635ac39c7fc5b595ff37e3681992e2acc608fc251c5f78b57f45d0bc6b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc248/tasks/abc248_h) — source-abc248-ex-problem-baf24b6ac5cb67b9c0b284a4a5ce0b4d0970da1abe68fafc5eb086f954a2e49d
