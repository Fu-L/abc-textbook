---
title: "ABC273-F — Hammer 2"
draft: true
authoringUnit: {"problemId":"abc273-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-expansion-dp/outcome-design-interval-expansion-dp-shard-001/abc273-f.md","learningOutcomeIds":["outcome-design-interval-expansion-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-dp-state-design"],"excludedTopics":["区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-interval-expansion","tag-coordinate-compression"],"sourceRevisionIds":["source-abc273-f-problem-a23415db39faeea1d5f7cb1589561daf2369e39a6c5823b405080ae921d1cadc","source-abc273-editorial-5034-c6b24d04b150c9f609a42309732436031f54e838f8f84ae875a9562beb6779cf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"数直線上の任意の連続移動で、経験済みイベントのindex集合は原点を含む区間である。その内部のハンマーは全て回収済み、壁は全て通過可能なので、同じ区間と現在端点の履歴は以後の選択肢が同じである。次の新イベントは左隣か右隣に限られ、そこまでの余計な往復は直進へ置き換えて距離を減らせる。壁通過の必要十分条件も対応ハンマーindexの区間内包含で復元できる。従って二拡張遷移は全合法なイベント順を過不足なく表す。区間長は毎回一増えるので昇順DPは最短値を確定し、目標初到達時の端点状態の最小が元の最短距離となる。","sourceRevisionIds":["source-abc273-f-problem-a23415db39faeea1d5f7cb1589561daf2369e39a6c5823b405080ae921d1cadc","source-abc273-editorial-5034-c6b24d04b150c9f609a42309732436031f54e838f8f84ae875a9562beb6779cf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間拡張DP](src/content/docs/learn/dynamic-programming/dp-interval-expansion.md)

- 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

原点・目標・全壁・全ハンマーの座標をsortし、x_0<…<x_{M−1}とする。原点indexをo、目標indexをg、壁index wに対応するハンマーindexをh(w)として前計算する。移動中に通過した座標の集合は原点を含む連続区間で、その内部のハンマーは全て回収済みである。従って所持品の2^N bitmaskを、訪問区間[l,r]だけで復元できる。

新しいイベントを訪れる瞬間には現在地が左右の端点になる。D[l][r][0/1]を、区間[l,r]の全イベントを経験し、左端/右端にいるまでの最短距離とする。D[o][o][0]=D[o][o][1]=0、他は∞で初期化し、区間長の昇順に処理する。sideに対応する現在座標をp=x_lまたはx_rとする。

```text
for length = 1,...,M:
    for [l,r] with r-l+1 = length and l <= o <= r:
        for side = 0,1 with finite D[l][r][side]:
            p = x_l if side == 0 else x_r
            if l > 0 and (l-1 is not a wall or l <= h(l-1) <= r):
                D[l-1][r][0] = min(D[l-1][r][0], D[l][r][side] + p-x_(l-1))
            if r+1 < M and (r+1 is not a wall or l <= h(r+1) <= r):
                D[l][r+1][1] = min(D[l][r+1][1], D[l][r][side] + x_(r+1)-p)
```

壁でなければ無条件に区間を広げられる。壁なら拡張前の区間に対応ハンマーがあるかを判定する。未訪問ハンマーを壁の向こうから先取りできない。内部移動は既に壊した壁だけを通るので自由で、次の未訪問座標までは直進すればよい。

答えはg=lのD[l][r][0]とg=rのD[l][r][1]の全状態の最小値。目標への初到達は必ず拡張した側の端点なのでこれで全てを含む。有限値がなければ−1。初到達時の端点状態を集計すれば十分であり、目標を通過した後の状態を追加して調べる必要はない。

## 典型の発動条件

### 数直線上の区間DP

発動条件: 訪問済み地点が連続区間をなし、次の未訪問候補が左右の直外側に限られるとき。

sorted eventsの[l,r]とcurrent sideをstateにし、l−1/r+1への移動をrelaxする。

### 取得条件の区間包含判定

発動条件: key itemを取得済みかどうかが、そのcoordinateを訪問範囲に含むかで決まるとき。

wall iへ進む前にZ_iのsorted positionが[l,r]内かを確認する。

## 問題固有の要素

goalは通過可能性を妨げない通常eventとして追加し、goalを含むstateに初めて達した候補distanceの最小を答えにする。

別の問題へ持ち帰る視点: 到達targetも他のeventsと同じ順序列へ埋め込むと、終了判定をDP stateの包含条件にできる。

## 正当性

数直線上の任意の連続移動で、経験済みイベントのindex集合は原点を含む区間である。その内部のハンマーは全て回収済み、壁は全て通過可能なので、同じ区間と現在端点の履歴は以後の選択肢が同じである。次の新イベントは左隣か右隣に限られ、そこまでの余計な往復は直進へ置き換えて距離を減らせる。壁通過の必要十分条件も対応ハンマーindexの区間内包含で復元できる。従って二拡張遷移は全合法なイベント順を過不足なく表す。区間長は毎回一増えるので昇順DPは最短値を確定し、目標初到達時の端点状態の最小が元の最短距離となる。

## 実装上の注意

- wallとhammerを別のイベント種別で保存し、sort後のindexで対応を張る。座標のdistinct条件により同一座標内の処理順は不要。
- 壁判定は拡張前の[l,r]。∞状態は更新せず、累積移動距離は64 bit整数で持つ。
- 目標初到達のsideを調べる。原点から目標までの間に未入手ハンマーを必要とする壁があれば、反対側へ取りに行く経路もDPが含む。

## 復習の核

- 数直線を往復する探索では、visited setがintervalなら両端と現在側だけをstateにできないかを見る。
- 多数の取得item bitmaskは、item位置がvisited interval内かという包含判定で復元できる場合がある。

## 計算量と制約

### 時間

O(N²)、壁/hammer/始終点座標数O(N)の区間×両端DP。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in the input are integers.; 1 \le N \le 1500; 1 \le |X|,|Y_i|,|Z_i| \le 10^9; The (2 \times N + 1) coordinates X,Y_i and Z_i are distinct.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/tasks/abc273_f) — source-abc273-f-problem-a23415db39faeea1d5f7cb1589561daf2369e39a6c5823b405080ae921d1cadc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/editorial/5034) — source-abc273-editorial-5034-c6b24d04b150c9f609a42309732436031f54e838f8f84ae875a9562beb6779cf
