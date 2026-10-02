---
title: "ABC213-E — Stronger Takahashi"
draft: true
authoringUnit: {"problemId":"abc213-e","docPath":"src/content/docs/problems/graph-search/outcome-model-and-compute-shortest-path/outcome-model-and-compute-shortest-path-shard-001/abc213-e.md","learningOutcomeIds":["outcome-model-and-compute-shortest-path"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-shortest-path"],"sourceRevisionIds":["source-abc213-e-problem-624292782f4c8b364f18dc594853524d1d33202469ad5e99cae8bafb8fdb49cf","source-abc213-editorial-2397-60e8361c70415c0dfa7bed299c0772eb609d9a5146949cc6a4184e0d40204db0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"通路移動は0、パンチで開く局所領域へ移ることを1辺にする。パンチを必要時まで遅らせる公式正規化により過去破壊集合を状態に持たず位置最小費用だけでよい。局所1辺は実際のパンチと移動で実現でき、0辺も合法なので最短costが最小パンチ数。","sourceRevisionIds":["source-abc213-e-problem-624292782f4c8b364f18dc594853524d1d33202469ad5e99cae8bafb8fdb49cf","source-abc213-editorial-2397-60e8361c70415c0dfa7bed299c0772eb609d9a5146949cc6a4184e0d40204db0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

- 非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最短路モデルの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

通路どうしは上下左右へ自由に移動でき、費用が増えるのは 2×2 の領域をパンチして壁を壊すときだけである。 パンチは実際に通行が必要になった時点まで遅らせられるため、過去にどの壁を壊したかを状態として保持する必要はない。 壊した壁を永続的な盤面状態として追う代わりに、パンチ一回で到達可能になる近傍マスへの有料辺へ操作を畳み込む。 徒歩辺は元から通路の上下左右だけだが、パンチ辺の到着先は元のマスが壁か通路かにかかわらず利用できる。

棄却する候補: 現在位置に加えて、これまでに破壊した全ての 2×2 領域または壁集合を状態として探索する。

破壊履歴の組合せが膨大であり、同じ位置への到達を履歴ごとに分ける必要もない。

採用する候補: 徒歩を重み 0、現在位置に隣接する 2×2 領域へのパンチ後の移動を重み 1 の辺としてマス間グラフを作る。

各操作の費用が 0 または 1 で、位置ごとの最小パンチ数だけを 0-1 BFS で確定できる。

壊した壁を永続的な盤面状態として追う代わりに、パンチ一回で到達可能になる近傍マスへの有料辺へ操作を畳み込む。

徒歩辺は元から通路の上下左右だけだが、パンチ辺の到着先は元のマスが壁か通路かにかかわらず利用できる。

不可逆な盤面変更を位置間の 0・1 重み付き遷移へ置換し、距離更新が 0 の頂点を deque の前、1 の頂点を後ろへ入れる最短路探索を行う。

## 典型の発動条件

### 0-1 BFS

発動条件: グラフの辺重みが 0 と 1 だけで、頂点までの最小費用を求めるとき。

無料の徒歩移動を deque の前、有料のパンチ移動を後ろへ追加して最小パンチ数を更新する。

### 操作履歴の辺への圧縮

発動条件: 環境を変更する操作があるが、必要になる直前へ遅延しても最適性が失われないとき。

破壊済み壁集合を持たず、パンチ一回後に到達できる一定範囲のマスへ重み 1 の辺を張る。

## 問題固有の要素

2×2 のパンチ領域を現在位置に隣接させて選べば、一回のパンチで 5×5 近傍の四隅を除く範囲へ移れる。

別の問題へ持ち帰る視点: 局所的な破壊操作では、操作領域そのものより「現在地から一操作後に到達できる位置集合」を列挙すると状態を減らせる。

## 正当性

通路移動は0、パンチで開く局所領域へ移ることを1辺にする。パンチを必要時まで遅らせる公式正規化により過去破壊集合を状態に持たず位置最小費用だけでよい。局所1辺は実際のパンチと移動で実現でき、0辺も合法なので最短costが最小パンチ数。

## 実装上の注意

- パンチ候補は縦横差がともに 2 以下の範囲から四隅を除き、各候補について盤外かだけを確認する。
- 徒歩の重み 0 辺は到着先が通路の場合だけ張り、パンチの重み 1 辺では元の壁判定を条件にしない。

## 復習の核

- 破壊状態が指数的に見えたら、破壊を必要になる瞬間まで延期できるかを検討し、位置だけの状態へ戻せないか考える。
- パンチ範囲の図を単に暗記せず、現在地に隣接する各 2×2 領域から到達可能な相対位置の和集合として復元する。

## 計算量と制約

### 時間

H×W、定数個の0/1隣接transition。01-BFS O(HW)。

### 空間

盤面、dist、deque O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H,W \leq 500; H and W are integers.; S_{i,j} is . or #.; S_{1,1} and S_{H,W} are ..

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/tasks/abc213_e) — source-abc213-e-problem-624292782f4c8b364f18dc594853524d1d33202469ad5e99cae8bafb8fdb49cf
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc213/editorial/2397) — source-abc213-editorial-2397-60e8361c70415c0dfa7bed299c0772eb609d9a5146949cc6a4184e0d40204db0
