---
title: "ABC318-F — Octopus"
draft: true
authoringUnit: {"problemId":"abc318-f","docPath":"src/content/docs/problems/mathematics/outcome-partition-at-critical-integer-boundaries/outcome-partition-at-critical-integer-boundaries-shard-001/abc318-f.md","learningOutcomeIds":["outcome-partition-at-critical-integer-boundaries"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-greedy-exchange"],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks","tag-bipartite-matching-hall","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc318-editorial-7075-3df92a12bdca86dc839ab5e4172efb614eef253a7ac1f559b431faae2b767c43","source-abc318-f-problem-0b824504860b99ebc9bb8759faba1965f56e706e77d629f4ac4f0f8615b89119"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"距離を昇順に足長へ対応させるgreedyは交換で悪化しない。失敗位置があれば長足でしか届かない宝が足数を超えるので不可能、全位置成功なら実際のmatchingになる。各距離が足長境界を跨ぐ整数位置以外では全適否関係が一定。列挙境界の区間を代表一点で検査して区間長を足せば巨大座標でも全頭位置を正確に数える。","sourceRevisionIds":["source-abc318-editorial-7075-3df92a12bdca86dc839ab5e4172efb614eef253a7ac1f559b431faae2b767c43","source-abc318-f-problem-0b824504860b99ebc9bb8759faba1965f56e706e77d629f4ac4f0f8615b89119"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-partition-at-critical-integer-boundaries"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"X=(0,4)、L=(1,3)。","procedure":["両距離≤3の位置はk=1,2,3。","短足1が届くのはk=1または3で、k=2は両距離2のため失敗。"],"executionTarget":null,"expectedResult":"2位置。","verificationStatus":"not_applicable","learningUnitIds":["unit-integer-boundary-blocks"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-partition-at-critical-integer-boundaries"],"prerequisiteIds":["unit-bipartite-matching","unit-greedy-exchange"],"attainmentCondition":"境界X_i−L_j−1の−1を省くと。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"左境界直前の−1が必要。"},"answer":{"reasoningOrVerification":"整数のinclusive到達範囲の切れ目がずれる。位置k=X_i−L_jは届く最初の位置なのでその直前を境界として持つ。","procedure":["具体例の各状態・寄与を再計算する。","整数のinclusive到達範囲の切れ目がずれる。位置k=X_i−L_jは届く最初の位置なのでその直前を境界として持つ。"],"expectedResult":"左境界直前の−1が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- 成立判定が変わり得る整数境界を全て列挙し、隣り合う境界の間で判定が一定であることを示して、代表点判定と区間長で整数解の個数を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 素因数指数による整数条件の分解。

## 考察

頭位置 k を固定すると宝までの距離を昇順 Y_i に並べ、Y_i≤L_i が全 i で成立することが matching 可能性の必要十分条件になる。

k を全整数で試せないが、適否が k と k+1 で変わるのは、ある距離が足長境界を跨ぐ k=X_i+L_j または X_i−L_j−1 のときだけである。

採用する候補: 全 O(N²) 個の変化点を sort し、隣接変化点間の代表位置で距離列を判定して有効整数区間長を加える。

判定値が各区間で一定で、N≤200 なので O(N²) 区間×O(N) 判定の O(N³) が可能である。

棄却する候補: 頭位置について最小から最大座標まで整数を一つずつ動かして判定する。

座標範囲が 10^18 級で、N が小さくても位置列挙はできない。

sorted distance と sorted L の成分比較は、近い宝を短い足へ割り当てる greedy matching であり、失敗時は遠い宝の本数に対する Hall 条件に反する。

適否を変える可能性のある整数境界を両側 X_i+L_j と X_i−L_j−1 から全列挙すれば、負座標や巨大な空白も区間長としてまとめられる。

S={X_i+L_j, X_i−L_j−1} を sort unique する。各連続境界について代表 k（公式の端点規約では右端 S_t）を選び、|X_i−k| を sort して全 Y_i≤L_i か検査する。有効なら前境界+1..現境界の整数個数を答えへ加える。外側無限区間は十分遠方で必ず失敗する。

## 典型の発動条件

### 離散イベント点による整数区間圧縮

発動条件: 巨大座標上の可否が有限個の不等式境界を跨ぐ時だけ変わるとき。

全境界を列挙し、その間を代表点一つで判定して区間長を加える。

### sorted greedy matching

発動条件: 能力が昇順の資源を、要求値だけを持つ同数の対象へ一対一割当てるとき。

要求も昇順にし、各順位で要求≤能力かを比較する。

## 問題固有の要素

可否関数自体は単調でなくても、変化点が O(N²) なら全ての定常区間を走査できる。

別の問題へ持ち帰る視点: 二分探索できない座標判定では、真偽が変わる等式条件を列挙して piecewise constant に分解する。

## 正当性

距離を昇順に足長へ対応させるgreedyは交換で悪化しない。失敗位置があれば長足でしか届かない宝が足数を超えるので不可能、全位置成功なら実際のmatchingになる。各距離が足長境界を跨ぐ整数位置以外では全適否関係が一定。列挙境界の区間を代表一点で検査して区間長を足せば巨大座標でも全頭位置を正確に数える。

## 実装上の注意

- 整数境界の −1 を落とすと区間端で off-by-one になる。座標和差と答えは 10^18 を越え得る範囲を考慮した整数型を使う。

## 復習の核

- 可否が単調かを決めつけず、k→k+1 でどの不等式だけが変化できるかを書く。代表点と加える区間の対応を数直線で確認する。

## 計算量と制約

### 時間

O(N³ log N)。O(N²)境界ごとにN距離をsortする。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N\leq 200; -10^{18} \leq X_1<X_2<\cdots<X_N\leq 10^{18}; 1\leq L_1\leq L_2\leq\cdots\leq L_N\leq 10^{18}; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

X=(0,4)、L=(1,3)。

1. 両距離≤3の位置はk=1,2,3。
2. 短足1が届くのはk=1または3で、k=2は両距離2のため失敗。

期待される結果: 2位置。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

境界X_i−L_j−1の−1を省くと。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

整数のinclusive到達範囲の切れ目がずれる。位置k=X_i−L_jは届く最初の位置なのでその直前を境界として持つ。

確認結果: 左境界直前の−1が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/editorial/7075) — source-abc318-editorial-7075-3df92a12bdca86dc839ab5e4172efb614eef253a7ac1f559b431faae2b767c43
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc318/tasks/abc318_f) — source-abc318-f-problem-0b824504860b99ebc9bb8759faba1965f56e706e77d629f4ac4f0f8615b89119
