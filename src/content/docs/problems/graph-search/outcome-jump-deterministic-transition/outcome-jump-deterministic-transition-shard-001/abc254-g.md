---
title: "ABC254-G — Elevators"
draft: true
authoringUnit: {"problemId":"abc254-g","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc254-g.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep"],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting","tag-coordinate-compression","tag-event-sweep"],"sourceRevisionIds":["source-abc254-editorial-4066-05bd0b7509c479dae1b93fe87469a756b306d5a0371b28bf7ce5d3a1f55f7197","source-abc254-g-problem-50d845b175a7b04cc11c1acd8b2012462ddd6b02728437d85b1a960ca3e1b190"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同ビル重複区間は無料移動でき一つへ統合可能。端点を同じ区間内の上/下へ正規化しても最小有料通路数は変わらない。現在階以下から使える区間の最大上端は同一回数で他全候補を支配するので単調写像反復の最小回数でよい。jumpはその反復を正確に倍化する。","sourceRevisionIds":["source-abc254-editorial-4066-05bd0b7509c479dae1b93fe87469a756b306d5a0371b28bf7ce5d3a1f55f7197","source-abc254-g-problem-50d845b175a7b04cc11c1acd8b2012462ddd6b02728437d85b1a960ca3e1b190"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。

## 考察

始点階Yと終点階WをY≤Wに揃えると、最適経路の通過階は単調増加にでき、費用はビル間の連絡通路を使う回数だけを最小化すればよい。 始点が含まれる統合区間では無料で最上階へ、終点が含まれる区間では無料で最下階へ動けるので、質問端点をまず正規化する。 現在到達階以下に入口を持つ全エレベーターの最上階へ進める一回遷移は単調であり、その反復回数をbinary liftingで数えられる。

採用する候補: エレベーター区間の統合と到達階ダブリング

同一ビルの重なる区間をまとめた後、一回の連絡通路で伸ばせる最高階を遷移として座標圧縮し、2の冪回の遷移を前計算できる。

棄却する候補: 各問い合わせでエレベーターグラフをBFS

エレベーター・問い合わせとも2×10^5あり、毎回全区間を探索できない。

始点が含まれる統合区間では無料で最上階へ、終点が含まれる区間では無料で最下階へ動けるので、質問端点をまず正規化する。

現在到達階以下に入口を持つ全エレベーターの最上階へ進める一回遷移は単調であり、その反復回数をbinary liftingで数えられる。

同じビルで共通部分を持つエレベーター区間をマージし、端点階を座標圧縮する。一回通路を使った後の最大到達階nextを前計算してダブリング表を作り、各質問をY≤Wへ正規化し、到達階を下から持ち上げて最小通路数を求める。

## 典型の発動条件

### 区間のマージ

発動条件: 同一場所の重なり合う移動可能区間は乗り換えなしで一体として使える。

ビルごとに区間をソートし、共通部分を持つものを統合する。

### 到達可能性のダブリング

発動条件: 単調な一回遷移を多数回反復した最小回数を問い合わせたい。

2^j回の通路利用後の最高到達階を前計算し、上位bitから遷移する。

## 問題固有の要素

階を上下する経路を考える必要はなく、端点を正規化すると「通路一回で最高到達階をどこまで伸ばせるか」という一次元反復になる。

別の問題へ持ち帰る視点: 幾何的な移動でも最適経路の単調性が示せれば、区間到達と関数反復の問題へ圧縮できる。

## 正当性

同ビル重複区間は無料移動でき一つへ統合可能。端点を同じ区間内の上/下へ正規化しても最小有料通路数は変わらない。現在階以下から使える区間の最大上端は同一回数で他全候補を支配するので単調写像反復の最小回数でよい。jumpはその反復を正確に倍化する。

## 実装上の注意

- Y=Wなら同じビルは0、別ビルは1を先に処理し、Y>Wでは端点を入れ替える。端点を含む区間は等号込みで探し、正規化後にY≥Wとなる同一ビル等の例を処理する。

## 復習の核

- 小さい区間集合から状態グラフを作る全探索と比較し、接する区間のマージ、同階、同一ビル、始終点が区間内部、端点正規化で到達済みになる場合を確認する。

## 計算量と制約

### 時間

エレベータ区間M、質問Q、圧縮座標数V=O(M)。sort O(M log M)、jump O(V log V)、各質問O(log V)、全体O((M+Q)log M)。

### 空間

統合区間とjump O(M log M)。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M,Q \le 2 \times 10^5; 1 \le A_i \le N; 1 \le B_i < C_i \le 10^9; 1 \le X_i,Z_i \le N; 1 \le Y_i,W_i \le 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/editorial/4066) — source-abc254-editorial-4066-05bd0b7509c479dae1b93fe87469a756b306d5a0371b28bf7ce5d3a1f55f7197
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/tasks/abc254_g) — source-abc254-g-problem-50d845b175a7b04cc11c1acd8b2012462ddd6b02728437d85b1a960ca3e1b190
