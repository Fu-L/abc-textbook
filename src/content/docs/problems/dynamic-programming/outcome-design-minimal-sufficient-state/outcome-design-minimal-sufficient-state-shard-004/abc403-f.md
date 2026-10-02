---
title: "ABC403-F — Shortest One Formula"
draft: true
authoringUnit: {"problemId":"abc403-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc403-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-prime-divisor"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-constructive-witness","tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc403-editorial-12771-40816f386a2e96d37d3b6ae4f78aaed6c4433ef1367bad2c312f7db54d5bea93","source-abc403-f-problem-4cf4b17433f9f9b863f1181b17134a8af10babfe57b14ebed9fb589ff7edc426"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"任意の式の最外演算は加算、乗算、括弧付き式、または1のみの literal である。加算を含む式を乗算因子にするには括弧が必要なので expr と term を分ける。加算両項の値と1でない乗算因子は対象値より小さく、昇順 DP がそれらの最短表現を取得する。因子1を掛ける表現は短くならないため除外できる。全構文分類を遷移で覆い、長さ加算には演算子・括弧を含めるので文法に従う最短式を得る。","sourceRevisionIds":["source-abc403-editorial-12771-40816f386a2e96d37d3b6ae4f78aaed6c4433ef1367bad2c312f7db54d5bea93","source-abc403-f-problem-4cf4b17433f9f9b863f1181b17134a8af10babfe57b14ebed9fb589ff7edc426"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

文法上、加算を含む式はそのまま乗算の因子にできない。最短の任意の <expr> と最短の乗算可能な <term> を別状態にする必要がある。 値 i は、十進表記がすべて 1 のリテラル、j+k=i の加算、j×k=i の乗算から構成でき、加算の部分値と 1 でない乗算因子はいずれも i より小さい。 dpExpr は dpExpr[j]+'+'+dpExpr[k] で更新できる一方、積は dpTerm 同士に限る。dpTerm には積のほか '('+加算式+')' を候補として渡す。 乗算で因子 1 を除けば依存先は真に小さくなり、i の昇順計算で循環しない。最短文字列の長さは O(log N) に抑えられるので文字列コピー込みでも制約内である。

採用する候補: 値 i ごとに最短文字列 dpExpr[i] と最短の <term> 文字列 dpTerm[i] を持つ構文対応 DP

repunit を初期値とし、全加算分割と約数対の乗算で更新する。加算を term にする場合だけ括弧 2 文字を加えるため、文法と長さを同時に保証できる。

棄却する候補: 長さ順に文字列を生成して構文解析し、値 N が現れるまで探索する

利用可能な文字からなる候補数は長さに対して指数的で、同じ値・同じ構文カテゴリの膨大な式を区別してしまう。

dpExpr は dpExpr[j]+'+'+dpExpr[k] で更新できる一方、積は dpTerm 同士に限る。dpTerm には積のほか '('+加算式+')' を候補として渡す。

乗算で因子 1 を除けば依存先は真に小さくなり、i の昇順計算で循環しない。最短文字列の長さは O(log N) に抑えられるので文字列コピー込みでも制約内である。

各 i を昇順に処理し、repunit に一致すれば両状態を初期化する。j=1..i-1 の加算分割から expr と括弧付き term を、j|i かつ j,i/j>1 の因数分解から term 同士の積を両状態へ緩和し、dpExpr[N] を出力する。

## 典型の発動条件

### 構文カテゴリ DP

発動条件: 同じ値でも、親演算子の中で括弧なしに使える式の種類が異なるとき。

<expr> と <term> の最短表現を分け、BNF の生成規則だけを遷移にする。

### 構成付き最短化 DP

発動条件: 最適値だけでなく、その最適値を達成する文字列を一つ出力するとき。

各緩和で長さを比較し、採用した式文字列または復元元を保存する。

### 整数分割と約数遷移

発動条件: 式の最上位演算が加算または乗算に分類できるとき。

和は全分割、積は約数対だけを列挙して値 i の候補を漏れなく調べる。

## 問題固有の要素

括弧は単なる見栄えではなく <expr> を <term> に昇格させるコスト 2 と捉えると、演算子優先順位を二状態の最短路として扱える。

別の問題へ持ち帰る視点: 式最短化では「値」に加えて親構文から要求される非終端記号を状態にすると、不正な式を後処理で除く必要がない。

## 正当性

任意の式の最外演算は加算、乗算、括弧付き式、または1のみの literal である。加算を含む式を乗算因子にするには括弧が必要なので expr と term を分ける。加算両項の値と1でない乗算因子は対象値より小さく、昇順 DP がそれらの最短表現を取得する。因子1を掛ける表現は短くならないため除外できる。全構文分類を遷移で覆い、長さ加算には演算子・括弧を含めるので文法に従う最短式を得る。

## 実装上の注意

- 未到達を十分大きい長さで初期化し、積で 1 を因子にしない。括弧と演算子の 1 文字を長さ比較へ必ず含め、同長候補はどれを選んでもよい。

## 復習の核

- N=1、repunit、素数、平方数について、出力を構文解析して値と長さを確認し、小さい N では長さ別全探索の最短値と照合する。

## 計算量と制約

### 時間

上限値 N。加算分割 O(N²)、約数分割を各 i で平方根まで調べ O(N√N)。式そのものを毎回コピーせず長さ・復元元を保存すれば全体 O(N²+L)、L は出力式長。

### 空間

二文法状態と復元元で O(N)、最終式 O(L)。候補文字列を全状態へ直接保存する実装はその総長ぶん増える。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2000; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc403/editorial/12771) — source-abc403-editorial-12771-40816f386a2e96d37d3b6ae4f78aaed6c4433ef1367bad2c312f7db54d5bea93
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc403/tasks/abc403_f) — source-abc403-f-problem-4cf4b17433f9f9b863f1181b17134a8af10babfe57b14ebed9fb589ff7edc426
