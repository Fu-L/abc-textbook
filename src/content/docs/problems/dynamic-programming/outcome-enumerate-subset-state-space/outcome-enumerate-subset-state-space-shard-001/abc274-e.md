---
title: "ABC274-E — Booster"
draft: true
authoringUnit: {"problemId":"abc274-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc274-e.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc274-e-problem-be297a46ec7a2045345d36a9d15ec7c9add4612d197ff976f4aac752017a43be","source-abc274-editorial-5020-27bf5ebee0c7846a38ea722d708f7869d9fd869ff41dad3fe6be350009735934"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"訪問maskからbooster数が分かり速度を2^countで復元できる。nextまでの所要時間は今の速度で決まるのでmask,lastが十分。全街を含むmaskから原点へ戻るcostを評価し、booster任意採否も全maskが覆う。","sourceRevisionIds":["source-abc274-e-problem-be297a46ec7a2045345d36a9d15ec7c9add4612d197ff976f4aac752017a43be","source-abc274-editorial-5020-27bf5ebee0c7846a38ea722d708f7869d9fd869ff41dad3fe6be350009735934"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

townsとchestsを合わせても17 pointsで、visited subsetから必須townsの達成状況と取得booster数の両方を復元できる。 visited chests数がkなら現在speedは2^kであり、次pointまでのtravel timeはEuclidean distance/2^kとなる。 同じmask,lastに達した経路は現在speedと残りpointsが一致するため、所要時間の最小値だけを保持すればよい。 全town bitsを含む任意mask,lastからoriginへ戻るtimeを加えれば、そのmaskに含まれないchestsを訪ねず終了する候補になる。

棄却する候補: 訪問するchest subsetを固定し、その各caseで別々にtown/chest TSPを解く。

可能ではあるがchest subset列挙とpath DPが重なり2^N3^Mの余分なfactorを持つ。

採用する候補: 全pointsを同じbitmaskへ入れ、dp[mask][last]をそのvisited集合でlastへいるminimum timeとして遷移する。

chestを訪問しない選択もmask列挙に自然に含まれ、booster countを追加stateなしで計算できる。

同じmask,lastに達した経路は現在speedと残りpointsが一致するため、所要時間の最小値だけを保持すればよい。

全town bitsを含む任意mask,lastからoriginへ戻るtimeを加えれば、そのmaskに含まれないchestsを訪ねず終了する候補になる。

optional pickups that alter speedをsubset TSPへ統合し、visited-mask-derived resource levelでedge costsを評価する。

## 典型の発動条件

### 訪問集合bit DP

発動条件: 対象点が20個未満で、経路の将来がvisited subsetとcurrent pointだけで決まるとき。

未訪問point jを追加し、dp[mask∪{j}][j]へcurrent-to-j travel timeをrelaxする。

### optional verticesの同一state化

発動条件: 必須訪問点と任意訪問点が同じ移動graph上にあり、任意点の効果をmaskから計算できるとき。

town/chestを同じpoint listに置き、終端条件だけをall-town-bits includedとする。

## 問題固有の要素

booster countはpopcount(mask & chestMask)なので、speedをDP dimensionとして重複保持しない。

別の問題へ持ち帰る視点: resourceが特定visited itemsの個数だけで単調に変わるならsubset自体から導出する。

## 正当性

訪問maskからbooster数が分かり速度を2^countで復元できる。nextまでの所要時間は今の速度で決まるのでmask,lastが十分。全街を含むmaskから原点へ戻るcostを評価し、booster任意採否も全maskが覆う。

## 実装上の注意

- originをmask外のstart/endとしてdp singletonをdistance from originで初期化し、N+M=0相当の空case規約も明確にする。
- distanceはhypotでdouble計算し、infinity初期値と2^kによる除算を一貫させる。

## 復習の核

- 少数のoptional visitsは外側でsubset固定せず、必須pointsと同じvisited maskへ統合する。
- 訪問で変化するspeed/resourceは、同じmaskなら一意かを確認してstate dimensionを削る。

## 計算量と制約

### 時間

街N、boosterM、V=N+M。subset TSP O(V²2^V)。

### 空間

mask×last O(V2^V)、距離表O(V²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 12; 0 \leq M \leq 5; -10^9 \leq X_i,Y_i,P_i,Q_i \leq 10^9; (0,0), (X_i,Y_i), and (P_i,Q_i) are distinct.; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/tasks/abc274_e) — source-abc274-e-problem-be297a46ec7a2045345d36a9d15ec7c9add4612d197ff976f4aac752017a43be
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/editorial/5020) — source-abc274-editorial-5020-27bf5ebee0c7846a38ea722d708f7869d9fd869ff41dad3fe6be350009735934
