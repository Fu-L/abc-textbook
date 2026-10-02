---
title: "ABC371-G — Lexicographically Smallest Permutation"
draft: true
authoringUnit: {"problemId":"abc371-g","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-003/abc371-g.md","learningOutcomeIds":["outcome-prove-greedy-order","outcome-solve-modular-constraints"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-functional-graph-decomposition"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-modular-congruence-crt","tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc371-editorial-10927-b78b5dfbfa5fd637b4b32dffd7d05bf2479c2b7f2048d6ef632c89442c2e911a","source-abc371-g-problem-66e221723f80cbd939ec99dfb1c3296a6f08aa68cc9b6232599d4a402642c923"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"先頭 i-1 項を固定する操作回数は一つの合同類で表せ、i 項で選べる位置は歩幅 m を cycle 長 L_i で見た軌道になる。 新しい法は lcm(m,L_i) だが、巨大整数そのものを保持せず、各 cycle に対する m の剰余的な作用だけを更新できる。 前の成分を変えない操作回数だけを調べるので辞書順の貪欲が正当で、各 cycle を確定時に一括処理すれば総走査量を O(N) に抑えられる。","sourceRevisionIds":["source-abc371-editorial-10927-b78b5dfbfa5fd637b4b32dffd7d05bf2479c2b7f2048d6ef632c89442c2e911a","source-abc371-g-problem-66e221723f80cbd939ec99dfb1c3296a6f08aa68cc9b6232599d4a402642c923"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order","outcome-solve-modular-constraints"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"一cycle P=(2,3,1)、A=(3,1,2)。","procedure":["可能な共通操作回数mod3で列は(3,1,2),(1,2,3),(2,3,1)。","先頭最小1を選ぶと回数mod3が固定。"],"executionTarget":null,"expectedResult":"最小列(1,2,3)。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order","outcome-solve-modular-constraints"],"prerequisiteIds":["unit-functional-graph-decomposition"],"attainmentCondition":"cycleを独立に最小rotateしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"全cycleに共通の操作回数なので合同条件が両立する必要がある。既に固定したprefix制約を保つ軌道だけを探索する。"},"answer":{"reasoningOrVerification":"全cycleに共通の操作回数なので合同条件が両立する必要がある。既に固定したprefix制約を保つ軌道だけを探索する。","procedure":["具体例の各状態・寄与を再計算する。","全cycleに共通の操作回数なので合同条件が両立する必要がある。既に固定したprefix制約を保つ軌道だけを探索する。"],"expectedResult":"全cycleに共通の操作回数なので合同条件が両立する必要がある。既に固定したprefix制約を保つ軌道だけを探索する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。
- 合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

対象外:

- 対称操作による状態の正規化。

## 考察

一回の操作は permutation P を一回適用することで、x 回後の列は A_{P_i^x} になる。辞書順最小化は先頭から、許される x の合同条件を順に絞る問題である。

採用する候補: 位置 i の P-cycle 長 L_i を使い、既確定の x≡r (mod m) の範囲で A_{P_i^x} の最小値を選び、CRT 型に法を lcm(m,L_i) へ更新する。

前の成分を変えない操作回数だけを調べるので辞書順の貪欲が正当で、各 cycle を確定時に一括処理すれば総走査量を O(N) に抑えられる。

棄却する候補: 操作回数を 0 から permutation 全体の周期まで列挙して列を比較する。

全 cycle 長の lcm は固定長整数をはるかに超え、候補回数も指数的に大きくなり得る。

先頭 i-1 項を固定する操作回数は一つの合同類で表せ、i 項で選べる位置は歩幅 m を cycle 長 L_i で見た軌道になる。

新しい法は lcm(m,L_i) だが、巨大整数そのものを保持せず、各 cycle に対する m の剰余的な作用だけを更新できる。

P を cycle 分解し、先頭から未確定位置を処理する。現在の操作回数合同類が各 cycle 上で到達する位置を走査して最小の A を選び、同じ制約で確定する cycle 要素をまとめて答えへ反映する。

## 典型の発動条件

### permutation の cycle 分解

発動条件: 同じ permutation を巨大回数だけ反復する操作があるとき。

各位置の遷移を独立な巡回列として扱う。

### 辞書順貪欲と合同条件

発動条件: 一つの大域的な操作回数が全要素へ同時に作用し、先頭から最小化したいとき。

既確定 prefix を保つ操作回数の合同類を更新する。

## 問題固有の要素

辞書順では先頭の最小値を決めた瞬間、操作回数の自由度が合同式として残る。

別の問題へ持ち帰る視点: 巨大な lcm を数値で持たず、各 cycle 上で残る到達集合を表現できないか考える。

## 正当性

先頭 i-1 項を固定する操作回数は一つの合同類で表せ、i 項で選べる位置は歩幅 m を cycle 長 L_i で見た軌道になる。 新しい法は lcm(m,L_i) だが、巨大整数そのものを保持せず、各 cycle に対する m の剰余的な作用だけを更新できる。 前の成分を変えない操作回数だけを調べるので辞書順の貪欲が正当で、各 cycle を確定時に一括処理すれば総走査量を O(N) に抑えられる。

## 実装上の注意

- lcm は 2^2367 程度まで膨らみ得るため通常整数へ格納しない。cycle 内 offset の符号と P の適用方向を統一する。

## 復習の核

- 「先頭を変えない x はどの合同類か」を各段で言葉にし、lcm を直接保持しない実装表現まで含めて復習する。

## 計算量と制約

### 時間

O(N)回のcycle要素走査。各cycleは確定時に一括処理し、巨大lcmそのものを構成せず残りcycleに対する剰余作用を保持する。

### 空間

O(N)、巨大lcm値を持たずcycleごとの作用。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10^5; 1\leq P_i\leq N\ (1\leq i\leq N); P_i\neq P_j\ (1\leq i<j\leq N); 1\leq A_i\leq N\ (1\leq i\leq N); A_i\neq A_j\ (1\leq i<j\leq N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

一cycle P=(2,3,1)、A=(3,1,2)。

1. 可能な共通操作回数mod3で列は(3,1,2),(1,2,3),(2,3,1)。
2. 先頭最小1を選ぶと回数mod3が固定。

期待される結果: 最小列(1,2,3)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

cycleを独立に最小rotateしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

全cycleに共通の操作回数なので合同条件が両立する必要がある。既に固定したprefix制約を保つ軌道だけを探索する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/editorial/10927) — source-abc371-editorial-10927-b78b5dfbfa5fd637b4b32dffd7d05bf2479c2b7f2048d6ef632c89442c2e911a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc371/tasks/abc371_g) — source-abc371-g-problem-66e221723f80cbd939ec99dfb1c3296a6f08aa68cc9b6232599d4a402642c923
