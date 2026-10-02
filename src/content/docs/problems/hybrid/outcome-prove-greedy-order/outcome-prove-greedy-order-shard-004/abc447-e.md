---
title: "ABC447-E — Divide Graph"
draft: true
authoringUnit: {"problemId":"abc447-e","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-004/abc447-e.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-dsu-components"],"sourceRevisionIds":["source-abc447-e-problem-02331c348ec8140e3148280a27c01e036fb008a7d23c4271fb3f25530617f98c","source-abc447-editorial-16717-19b4073504d42c4a9ec3b36e49833fb26bc42a9191d686d1f75a89ac344471f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最適解が三成分以上でも、成分間の一部の辺を戻して二成分にしてコストを増やさないため「非連結」まで条件を緩めても最適値は同じ。 現在 component 数が2で異なる成分を結ぶ辺だけは追加すると連結になるので捨て、それ以外は高い順に必ず採用できる。 2進重みでは採否が異なる最大番号の辺だけで総和の大小が決まり、より高い辺を残せるなら全ての低い辺より優先すべきだからである。","sourceRevisionIds":["source-abc447-e-problem-02331c348ec8140e3148280a27c01e036fb008a7d23c4271fb3f25530617f98c","source-abc447-editorial-16717-19b4073504d42c4a9ec3b36e49833fb26bc42a9191d686d1f75a89ac344471f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"三角形の辺ID1=12,2=23,3=13、削除cost2^ID。","procedure":["高いID3を保持し成分{1,3},{2}。","ID2と1は二成分を繋ぐので削除する。"],"executionTarget":null,"expectedResult":"削除cost4+2=6、二成分になる。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-dsu-components"],"attainmentCondition":"低い二辺のcost和が高い辺一つを超えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"2冪ではΣ_{j<i}2^j<2^iなので高位辺の保持を最優先するgreedyが安全。"},"answer":{"reasoningOrVerification":"2冪ではΣ_{j<i}2^j<2^iなので高位辺の保持を最優先するgreedyが安全。","procedure":["具体例の各状態・寄与を再計算する。","2冪ではΣ_{j<i}2^j<2^iなので高位辺の保持を最優先するgreedyが安全。"],"expectedResult":"2冪ではΣ_{j<i}2^j<2^iなので高位辺の保持を最優先するgreedyが安全。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 対称操作による状態の正規化。

## 考察

削除辺コスト最小化は、全辺コストから「残しても graph が非連結な辺」の総和最大化を引く問題である。重み2^iは上位一辺が全下位辺の総和より大きい。

採用する候補: 辺番号を M から1へ降順に見て、追加後も graph が非連結ならその辺を残す貪欲を DSU で実行する。

2進重みでは採否が異なる最大番号の辺だけで総和の大小が決まり、より高い辺を残せるなら全ての低い辺より優先すべきだからである。

棄却する候補: 二つの連結成分への頂点分割を全探索し、cross edge の削除コストを比較する。

cut は指数個存在し、一般の重み付き cut 列挙として扱うと頂点数の制約に耐えない。

最適解が三成分以上でも、成分間の一部の辺を戻して二成分にしてコストを増やさないため「非連結」まで条件を緩めても最適値は同じ。

現在 component 数が2で異なる成分を結ぶ辺だけは追加すると連結になるので捨て、それ以外は高い順に必ず採用できる。

DSU を孤立頂点で初期化し、i=M..1 を処理する。端点が別成分で componentCount=2 なら辺 i を削除側へ、そうでなければ残して必要なら union する。powers of two の和を指定 modulus/表現で集計する。

## 典型の発動条件

### 超増加重みの辞書順貪欲

発動条件: 各重みがそれより小さい全重み和を上回る選択問題のとき。

番号降順に実行可能なら採用し、高位 bit を最優先する。

### DSU による増分連結性

発動条件: 辺追加だけで graph が連結になる瞬間を判定したいとき。

成分数と端点 root から追加可否を決める。

## 問題固有の要素

2^i の目的関数は総和最大化を採用 bit 列の辞書順最大化へ変えるため、交換法が単純になる。

別の問題へ持ち帰る視点: 削除問題は残す側へ補集合を取ると、制約を壊さない最大独立系風の増分構成になる場合がある。

## 正当性

最適解が三成分以上でも、成分間の一部の辺を戻して二成分にしてコストを増やさないため「非連結」まで条件を緩めても最適値は同じ。 現在 component 数が2で異なる成分を結ぶ辺だけは追加すると連結になるので捨て、それ以外は高い順に必ず採用できる。 2進重みでは採否が異なる最大番号の辺だけで総和の大小が決まり、より高い辺を残せるなら全ての低い辺より優先すべきだからである。

## 実装上の注意

- 同一成分内の辺は component 数を変えないので常に残せる。全辺和と残辺和のどちらを答えにするか、modulus 上の減算を統一する。

## 復習の核

- 採否が異なる最大辺 x を用いた交換証明と、component 数2のときだけ union が禁止される条件を別々に説明する。

## 計算量と制約

### 時間

O(Mα(N)+N)、逆順Kruskalで一度ずつ辺を見る。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; N-1 \leq M \leq \min\left(\frac{N(N-1)}{2}, 2\times 10^5\right); 1 \leq U_i < V_i \leq N; (U_i, V_i) \neq (U_j, V_j) if i \neq j; G is connected.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

三角形の辺ID1=12,2=23,3=13、削除cost2^ID。

1. 高いID3を保持し成分{1,3},{2}。
2. ID2と1は二成分を繋ぐので削除する。

期待される結果: 削除cost4+2=6、二成分になる。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

低い二辺のcost和が高い辺一つを超えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

2冪ではΣ_{j<i}2^j<2^iなので高位辺の保持を最優先するgreedyが安全。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/tasks/abc447_e) — source-abc447-e-problem-02331c348ec8140e3148280a27c01e036fb008a7d23c4271fb3f25530617f98c
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/editorial/16717) — source-abc447-editorial-16717-19b4073504d42c4a9ec3b36e49833fb26bc42a9191d686d1f75a89ac344471f7
