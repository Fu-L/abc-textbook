---
title: "ABC245-E — Wrapping Chocolate"
draft: true
authoringUnit: {"problemId":"abc245-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc245-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-ordered-set-multiset"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-event-sweep","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc245-e-problem-3747bf2b4d93efbb6cebd8f5f3fdd6af7abf39175b1aaa9e00dd0c74491f2235","source-abc245-editorial-3635-9cd671c90db1c3c45428f2c40f8f2eefb4be5c6ff55de05211aa69c0363ddd9b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"現在使える D のうち B 以上で最小のものを選んでも、より大きい D を将来へ残すので不利にならない。任意の実現可能な割当てで現在の箱をこの最小箱と交換できる。 A=C の箱はそのチョコレートに使用可能なので、同値イベントでは箱を先に処理しなければならない。 大きいチョコレートに過剰に大きい箱を残さず、各要素の挿入・検索・削除だけで割当てを構成できる。","sourceRevisionIds":["source-abc245-e-problem-3747bf2b4d93efbb6cebd8f5f3fdd6af7abf39175b1aaa9e00dd0c74491f2235","source-abc245-editorial-3635-9cd671c90db1c3c45428f2c40f8f2eefb4be5c6ff55de05211aa69c0363ddd9b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"チョコ(幅,高さ)=(2,3),(2,5)、箱=(2,3),(2,6)。","procedure":["高さ3のチョコへ使用可能最小高さ3を選ぶ。","高さ5には箱6を残す。"],"executionTarget":null,"expectedResult":"Yes。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-event-sweep","unit-ordered-set-multiset"],"attainmentCondition":"同じ幅2でチョコeventを箱より先に処理すると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"本来使える箱を未登録とみなしNoを返し得る。幅同値では箱を先に解禁する。"},"answer":{"reasoningOrVerification":"本来使える箱を未登録とみなしNoを返し得る。幅同値では箱を先に解禁する。","procedure":["具体例の各状態・寄与を再計算する。","本来使える箱を未登録とみなしNoを返し得る。幅同値では箱を先に解禁する。"],"expectedResult":"本来使える箱を未登録とみなしNoを返し得る。幅同値では箱を先に解禁する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 対称操作による状態の正規化。

## 考察

各チョコレートは回転できず、2 辺とも箱以下でなければならない。N≤M でも、同じ箱を 2 回使えないため、辺ごとの存在判定だけでは足りない。

一方の辺 A,C を大きい順に処理すると、現在のチョコレートに使える箱は C≥A を満たす処理済みの箱だけになる。残る選択条件は B≤D の 1 次元に落ちる。

採用する候補: A,C の降順に箱とチョコレートを走査し、利用可能になった箱の D を multiset に入れる。チョコレートでは B 以上の最小 D を 1 個取り除く。

大きいチョコレートに過剰に大きい箱を残さず、各要素の挿入・検索・削除だけで割当てを構成できる。

棄却する候補: 各チョコレートについて、未使用箱を先頭から探して最初に入る箱へ割り当てる。

探索順により必要な箱を浪費し得るうえ、全組を調べると N,M≤2×10^5 に対して二次時間になる。

現在使える D のうち B 以上で最小のものを選んでも、より大きい D を将来へ残すので不利にならない。任意の実現可能な割当てで現在の箱をこの最小箱と交換できる。

A=C の箱はそのチョコレートに使用可能なので、同値イベントでは箱を先に処理しなければならない。

2 次元の支配条件を一方の座標で sweep し、もう一方を ordered multiset の lower_bound で貪欲に照合する。途中で候補がなければ No、全チョコレートを処理できれば Yes とする。

## 典型の発動条件

### sweep line と ordered multiset

発動条件: 2 属性の両方が閾値を満たす一対一割当てで、一方の属性順に候補集合を単調に追加できるとき。

A,C を降順 sweep し、C≥A の箱だけを multiset に入れて D の下限検索を行う。

### 交換法による貪欲

発動条件: 複数の候補から最小限の資源を選ぶと、残りの候補集合が将来に対して支配的になるとき。

B を満たす最小 D を選び、元の実現可能解との箱の交換で安全性を示す。

## 問題固有の要素

箱を第一辺で利用可能化してから第二辺の最小適合値を消費すれば、長方形の 2 条件を独立な貪欲処理へ分解できる。

別の問題へ持ち帰る視点: 多次元マッチングでも、候補集合が一方向にだけ増える順序を作れるなら、残り 1 軸の ordered set 問題に落とせる。

## 正当性

現在使える D のうち B 以上で最小のものを選んでも、より大きい D を将来へ残すので不利にならない。任意の実現可能な割当てで現在の箱をこの最小箱と交換できる。 A=C の箱はそのチョコレートに使用可能なので、同値イベントでは箱を先に処理しなければならない。 大きいチョコレートに過剰に大きい箱を残さず、各要素の挿入・検索・削除だけで割当てを構成できる。

## 実装上の注意

- 箱とチョコレートを同じ event 列へ入れる場合、第一辺が同じなら箱を先に並べる。
- lower_bound(B) が end なら即 No とし、erase(value) ではなく iterator を消して重複 D を 1 個だけ使用する。

## 復習の核

- A=C かつ B=D の箱を使う最小例と、同じ D の箱が複数ある例で、tie-break と 1 個だけの削除を説明させる。

## 計算量と制約

### 時間

O((N+M)log(N+M))、箱とチョコの幅sweep、高さmultiset。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq M \leq 2\times 10^5; 1 \leq A_i,B_i,C_i,D_i \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

チョコ(幅,高さ)=(2,3),(2,5)、箱=(2,3),(2,6)。

1. 高さ3のチョコへ使用可能最小高さ3を選ぶ。
2. 高さ5には箱6を残す。

期待される結果: Yes。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ幅2でチョコeventを箱より先に処理すると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

本来使える箱を未登録とみなしNoを返し得る。幅同値では箱を先に解禁する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/tasks/abc245_e) — source-abc245-e-problem-3747bf2b4d93efbb6cebd8f5f3fdd6af7abf39175b1aaa9e00dd0c74491f2235
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc245/editorial/3635) — source-abc245-editorial-3635-9cd671c90db1c3c45428f2c40f8f2eefb4be5c6ff55de05211aa69c0363ddd9b
