---
title: "ABC311-G — One More Grid Task"
draft: true
authoringUnit: {"problemId":"abc311-g","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc311-g.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components","unit-prefix-aggregate"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-dsu-components","tag-prefix-difference"],"sourceRevisionIds":["source-abc311-editorial-6823-e9cae54078c6ad33bc3642aa2558197d3003df36df591ffaaf3e8b0cfa764b27","source-abc311-g-problem-2a29d86b1d8c2c308850ebf04c6a3b490eb4775f13e72bbb91d5ff45a96d0544"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"高さが大きい列から有効化すると、列 j の追加時に左右の既存連続成分を結んだ区間は全列が少なくとも H_j 行伸び、j が高さのボトルネックになる。 真の最小値が a の長方形を含む極大候補は threshold m=a の走査で評価されるため、「最小値が m 以上」の領域へ m を掛けても最大値を取り逃さない。 各候補長方形は最小高さを与える列が追加された時点の連続成分として現れ、二次元 prefix sum で領域和を O(1) 取得できる。\n\nここで列挙するのは閾値a以上の極大成分矩形で、すべての部分矩形そのものではない。ただしA_ij>0なので、閾値を保ったまま矩形を広げても領域和は減らない。元の最小値aの矩形は、同じ閾値で元以上の評価値を持つ極大候補に含められるため、最適値を取り逃さない。","sourceRevisionIds":["source-abc311-editorial-6823-e9cae54078c6ad33bc3642aa2558197d3003df36df591ffaaf3e8b0cfa764b27","source-abc311-g-problem-2a29d86b1d8c2c308850ebf04c6a3b490eb4775f13e72bbb91d5ff45a96d0544"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

先に読む単元:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md) — 辺追加や同値関係をDSUで統合し、成分代表と必要な成分metadataを一貫して保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

この解説で扱わないこと:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

評価値は領域和×領域最小値で、和は二次元累積和から O(1) で得られる。難しい最小値は A_ij≤300 という小さい値域を固定して扱える。

最小値下限 m と長方形の下端行 i を固定すると、各列 j で上へ連続して A≥m となる高さ H_j が決まり、候補は histogram の長方形に似た形になる。

採用する候補: m と下端行を固定し、高さ H_j の降順に列を activate して連続成分ごとの極大長方形を評価する。

各候補長方形は最小高さを与える列が追加された時点の連続成分として現れ、二次元 prefix sum で領域和を O(1) 取得できる。

棄却する候補: 上下の行を固定し、各列区間の和と最小値をセグメント木で調べる。

O(N³ log M) となり 300³ にさらに log と重い定数が乗るため、制限時間に対して危険である。

高さが大きい列から有効化すると、列 j の追加時に左右の既存連続成分を結んだ区間は全列が少なくとも H_j 行伸び、j が高さのボトルネックになる。

真の最小値が a の長方形を含む極大候補は threshold m=a の走査で評価されるため、「最小値が m 以上」の領域へ m を掛けても最大値を取り逃さない。

二次元累積和を作る。m=1..300 ごとに各行を下端として列別連続高さ H を更新する。H の降順 bucket で列を activate し、連結リストまたは DSU で左右成分を併合するたび、その成分幅×高さ H_j の長方形和を取得して m 倍し最大値を更新する。

## 典型の発動条件

### 値域 threshold sweep

発動条件: min を含む目的関数で、要素値の種類数が小さいとき。

最小値候補 m を固定し、A≥m の領域だけを連結構造として扱う。

### histogram の降順 activation

発動条件: 各列の利用可能高さがあり、ボトルネック高さごとの最大連続区間を列挙したいとき。

高さ順に列を追加し、左右の active 成分を併合して極大区間を生成する。

## 問題固有の要素

通常の最大長方形は面積だけだが、本問は領域和が必要なので、連続成分の端点を得て二次元累積和へ接続する。

別の問題へ持ち帰る視点: 既知典型の評価関数が変わったとき、候補列挙部分を保ち、値の取得だけ別データ構造へ差し替える。

## 正当性

高さが大きい列から有効化すると、列 j の追加時に左右の既存連続成分を結んだ区間は全列が少なくとも H_j 行伸び、j が高さのボトルネックになる。 真の最小値が a の長方形を含む極大候補は threshold m=a の走査で評価されるため、「最小値が m 以上」の領域へ m を掛けても最大値を取り逃さない。 各候補長方形は最小高さを与える列が追加された時点の連続成分として現れ、二次元 prefix sum で領域和を O(1) 取得できる。

ここで列挙するのは閾値a以上の極大成分矩形で、すべての部分矩形そのものではない。ただしA_ij>0なので、閾値を保ったまま矩形を広げても領域和は減らない。元の最小値aの矩形は、同じ閾値で元以上の評価値を持つ極大候補に含められるため、最適値を取り逃さない。

## 実装上の注意

- 同じ高さの列は順次追加しても各長方形がどこかで現れるが、成分端点更新を左右両方へ正しく伝える。積と領域和は 64 bit にする。

## 復習の核

- min を固定しただけで終わらず、その threshold 内で「候補領域を漏れなく一度は生成する仕組み」を説明する。追加列がボトルネックになる瞬間を小例で追う。

## 計算量と制約

### 時間

O(VHW α(W))、V≤300は値上限、bucket activationのDSU版。

### 空間

O(HW)、prefixと一行の高さ・DSU。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N,M \le 300; 1 \le A_{i,j} \le 300

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/editorial/6823) — source-abc311-editorial-6823-e9cae54078c6ad33bc3642aa2558197d3003df36df591ffaaf3e8b0cfa764b27
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc311/tasks/abc311_g) — source-abc311-g-problem-2a29d86b1d8c2c308850ebf04c6a3b490eb4775f13e72bbb91d5ff45a96d0544
