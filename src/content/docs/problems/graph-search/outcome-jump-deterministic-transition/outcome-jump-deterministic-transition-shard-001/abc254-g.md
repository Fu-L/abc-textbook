---
title: "ABC254-G — Elevators"
draft: true
authoringUnit: {"problemId":"abc254-g","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc254-g.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep"],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting","tag-coordinate-compression","tag-event-sweep"],"sourceRevisionIds":["source-abc254-editorial-4066-05bd0b7509c479dae1b93fe87469a756b306d5a0371b28bf7ce5d3a1f55f7197","source-abc254-g-problem-50d845b175a7b04cc11c1acd8b2012462ddd6b02728437d85b1a960ca3e1b190"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同一ビル内で共通階を持つ区間を統合しても、使える移動は変わらない。端点を寄せる移動は元のYからWへの単調な鉛直移動の一部であり、費用W−Yへ含まれている。通路数が同じならより高い到達階が他の候補を支配するため、Fの反復で到達可能な最高階を追えばよい。終点ビルの統合区間に初めて入る際、その下端以上から最後の通路で渡れる。端点処理・ダブリングで得た最小通路数に、正規化前の階差を足せば最短時間となる。","sourceRevisionIds":["source-abc254-editorial-4066-05bd0b7509c479dae1b93fe87469a756b306d5a0371b28bf7ce5d3a1f55f7197","source-abc254-g-problem-50d845b175a7b04cc11c1acd8b2012462ddd6b02728437d85b1a960ca3e1b190"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md) — 値・時刻・座標順にeventを並べ、同値eventの処理順を決めてactive集合を増分更新する。逆向き処理や寄与分解とは不変量が異なるため独立に学ぶ。

## 考察

始点階Yと終点階WをY≤Wに揃える。上下に往復する区間は、同じ階の連絡通路へ置き換えられるので、最適経路は階を単調に上がる形にできる。このとき鉛直移動の時間は元の階差W−Yで固定される。ここを先に別計上し、残る「ビル間の通路を何回使うか」だけを最小化する。

採用する候補: ビルごとのエレベーター区間の統合と、最高到達階のダブリング。

同一ビルで重なるエレベーター区間は、乗り継いで区間内の任意の階へ行けるので統合する。始点を含む区間の上端、終点を含む区間の下端まで端点を寄せる。これは通路数を数えるための正規化であり、鉛直移動を無料にする操作ではない。

棄却する候補: 問い合わせごとに区間を頂点としたグラフをBFSする。

M,Qとも最大2×10^5なので、毎回すべての区間を探索できない。

正規化後の始点階をy、終点階をwとする。y≥wなら同一ビルは通路0回、別ビルは1回で終点へ行ける。そうでなければ、まず終点ビル以外のどのビルにいてもよいとして最高到達階を伸ばす。高さhから一回通路を使うと、入口がh以下で出口がh以上のエレベーターへ乗り換えられる。全ビルの区間から最大の上端F(h)を選ぶと、他の候補より先へ行ける可能性を失わない。

区間端点を圧縮し、Fの2の冪回先を前計算する。Fを反復してw以上へ達する最小回数tをダブリングで求め、最後に終点ビルへ渡る1回を加える。Fが伸びずwに届かなければ−1。到達できる場合の回答は、保存した元の階差と通路数の和である。同一ビルの1階から2階へ同じエレベーターで行く例なら、通路0回でも時間は1になる。

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

同一ビル内で共通階を持つ区間を統合しても、使える移動は変わらない。端点を寄せる移動は元のYからWへの単調な鉛直移動の一部であり、費用W−Yへ含まれている。通路数が同じならより高い到達階が他の候補を支配するため、Fの反復で到達可能な最高階を追えばよい。終点ビルの統合区間に初めて入る際、その下端以上から最後の通路で渡れる。端点処理・ダブリングで得た最小通路数に、正規化前の階差を足せば最短時間となる。

## 実装上の注意

- 端点を入れ替えたり区間端へ寄せたりする前にD=|Y−W|を保存する。到達時は一貫してD+最小通路数を出す。
- Y=Wと正規化後y≥wでは、同一ビルの通路数0、別ビルの通路数1を扱う。区間包含の検索は等号を含める。
- F(h)=hとなって先へ進めない場合は−1。Fの反復回数と最後の終点ビルへの1回を区別する。

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
