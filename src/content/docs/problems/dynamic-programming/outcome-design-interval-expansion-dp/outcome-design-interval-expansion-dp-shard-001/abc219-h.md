---
title: "ABC219-H — Candles"
draft: true
authoringUnit: {"problemId":"abc219-h","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-expansion-dp/outcome-design-interval-expansion-dp-shard-001/abc219-h.md","learningOutcomeIds":["outcome-design-interval-expansion-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-state-design"],"excludedTopics":["区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-interval-expansion","tag-contribution-reordering"],"sourceRevisionIds":["source-abc219-editorial-2601-00b5be124195f0f7917fc9abf4c538f015b7626bbb9c12275967bbad8fa47726","source-abc219-h-problem-19592080329639576fd11d1b48e971c8eddcdbe98445cc3f0effeb8ba5571c9e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各経路で正の残量を持つろうそくを事前選択すれば、負まで燃えるモデルでも元の目的値を達成できる。逆に任意の選択集合の負の寄与を0へ切り上げると元の目的値以上にはならないので、両モデルの最適値は一致する。選んだろうそくの到着時刻の総和は各移動距離を未到達本数だけ重複して数えたものであり、kδの費用で正確に表せる。新たな訪問は区間の左右隣に限られ、そのろうそくを選ぶ・除外する二通りをDPが全て列挙する。k=0の終端と区間長降順の帰納法により、dummy状態から得る最大値は全選択集合と全経路の最適値になる。","sourceRevisionIds":["source-abc219-editorial-2601-00b5be124195f0f7917fc9abf4c538f015b7626bbb9c12275967bbad8fa47726","source-abc219-h-problem-19592080329639576fd11d1b48e971c8eddcdbe98445cc3f0effeb8ba5571c9e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間拡張DP](src/content/docs/learn/dynamic-programming/dp-interval-expansion.md)

- 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

位置を昇順に並べると、既訪問範囲は常に区間で、次に初めて訪れる候補はその左隣か右隣だけになる。しかし時刻を状態にすると座標の大きさに依存する。時間を未消火本数による費用へ置き換える。

各ろうそくの寄与max(A_i−到着時刻,0)は、「正の寄与を持つろうそくだけを事前に選び、選んだものは負の長さまで燃えるとしてΣA_i−Σ到着時刻を最大化する」と同値である。移動の各1単位は、その時点でまだ到達していない選択済みろうそくの本数kだけΣ到着時刻へ寄与する。従って移動距離δの費用はkδになる。

座標0に高さ0のdummyを置き、その添字をoとする。dp[l][r][side][k]を、訪問済み区間が[l,r]で端点sideにいて、区間外であとk本を選ぶときの最大の将来増分と定義する。現在時刻までの費用は既に差し引かれているので、この状態に時刻は要らない。kは区間外の本数以下に限る。

k=0なら以後何も選ばず止まれるので値は0。区間外にろうそくがなくk>0なら不可能で−∞。その他の状態では次の位置xをl−1またはr+1から選ぶ。現在端点からの距離をδ、新しい区間と端点の状態をnewとすると、

dp[l][r][side][k]=max_x { −kδ+dp[new][k], −kδ+A_x+dp[new][k−1] }

である。第一項はxを事前に除外する選択、第二項はxを救って残り本数を減らす選択。第二項はk>0の場合だけ使う。より大きい区間を参照するので、区間長を降順にして計算する。回答はmax_{0≤C≤N} dp[o][o][0][C]で、dummyは選択済みの本数へ入れない。

訪問順の列挙は左右の選択列が指数個になるが、このDPでは同じ区間・端点・残り本数を持つ履歴をまとめられる。O(N²)区間、2端点、O(N)本数、定数本の遷移でO(N³)。

## 典型の発動条件

### 数直線上の区間拡張 DP

発動条件: 原点から点を訪れ、訪問済み点の外側へ進むだけでよい最適順序を持つとき。

訪問済み区間、現在の左右端、追加状態を持ち、次の左端・右端への移動を遷移にする。

### 到着時刻和の残件数課金

発動条件: 選んだ対象それぞれに到着時刻がコストとして加わるとき。

各移動距離を未到着対象数だけ数える二重計数へ変え、残件数を DP 状態にする。

## 問題固有の要素

燃え尽きによる 0 下限を、救わないろうそくの事前除外へ移すことで、非線形な残量を線形な高さ加算と移動課金へ変えられる。

別の問題へ持ち帰る視点: max(value-cost,0) の総和では、正の寄与を持つ項だけ選ぶ部分集合最適化に直し、打ち切りを選択へ吸収できないか考える。

## 正当性

各経路で正の残量を持つろうそくを事前選択すれば、負まで燃えるモデルでも元の目的値を達成できる。逆に任意の選択集合の負の寄与を0へ切り上げると元の目的値以上にはならないので、両モデルの最適値は一致する。選んだろうそくの到着時刻の総和は各移動距離を未到達本数だけ重複して数えたものであり、kδの費用で正確に表せる。新たな訪問は区間の左右隣に限られ、そのろうそくを選ぶ・除外する二通りをDPが全て列挙する。k=0の終端と区間長降順の帰納法により、dummy状態から得る最大値は全選択集合と全経路の最適値になる。

## 実装上の注意

- 座標0の dummy は高さ0で一個追加し、同一座標の複数本も距離0の別要素として扱える。未到達状態を十分小さい負値で初期化し、距離×k とスコアは 64 bit にする。

## 復習の核

- 二本だけ救う経路で各到着時刻を足した値と、移動区間ごとの「まだ二本／残り一本」という課金を並べ、両者が一致することを確認する。

## 計算量と制約

### 時間

O(N³)。区間二端・残り選択本数・現在端の状態を各定数遷移で処理する。

### 空間

全区間保存ならO(N³)。区間長でrollingするならO(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 300; -10^9 \leq X_i \leq 10^9; 1 \leq A_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/editorial/2601) — source-abc219-editorial-2601-00b5be124195f0f7917fc9abf4c538f015b7626bbb9c12275967bbad8fa47726
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/tasks/abc219_h) — source-abc219-h-problem-19592080329639576fd11d1b48e971c8eddcdbe98445cc3f0effeb8ba5571c9e
