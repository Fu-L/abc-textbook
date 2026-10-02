---
title: "ABC273-F — Hammer 2"
draft: true
authoringUnit: {"problemId":"abc273-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-expansion-dp/outcome-design-interval-expansion-dp-shard-001/abc273-f.md","learningOutcomeIds":["outcome-design-interval-expansion-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-dp-state-design"],"excludedTopics":["区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-interval-expansion","tag-coordinate-compression"],"sourceRevisionIds":["source-abc273-f-problem-a23415db39faeea1d5f7cb1589561daf2369e39a6c5823b405080ae921d1cadc","source-abc273-editorial-5034-c6b24d04b150c9f609a42309732436031f54e838f8f84ae875a9562beb6779cf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"座標順に並べた原点・壁・ハンマー・目標を考える。到達済み地点は原点を含む連続区間となり、その中のハンマーは追加条件なく回収できる。次に未到達地点へ進むには区間の左隣または右隣を通るしかなく、壁なら対応ハンマーが区間内にあることが必要十分である。状態を到達区間と現在端点にすれば次の移動費用と壁条件が決まる。全合法経路はこの拡張列へ縮約でき、全合法拡張は実際に歩けるので、最短距離の区間DPが正しい。","sourceRevisionIds":["source-abc273-f-problem-a23415db39faeea1d5f7cb1589561daf2369e39a6c5823b405080ae921d1cadc","source-abc273-editorial-5034-c6b24d04b150c9f609a42309732436031f54e838f8f84ae875a9562beb6779cf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間拡張DP](src/content/docs/learn/dynamic-programming/dp-interval-expansion.md)

- 訪問済み範囲と現在いる端を状態にし、未訪問の左右の隣点へ拡張する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 区間拡張DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

number line上で既に到達したevent coordinatesの集合は常にoriginを含むinterval [L,R]として扱え、次に新しく経験するeventは直外側のL−1番目かR+1番目だけでよい。

outside eventがwall iなら、そのhammer coordinate Z_iが現在のvisited interval内にある場合に限ってその側へ拡張できる。

棄却する候補: 位置と取得hammer subsetをstateにしてshortest path searchする。

hammer subsetが2^N通りあり、coordinateも大きい。

採用する候補: eventsを座標sortし、dp[l][r][side]をoriginから区間[l,r]を経験して現在が左端/右端にいるminimum distanceとするinterval DPを行う。

取得済みhammer集合はvisited intervalから復元でき、各stateから左右二方向への拡張だけを考えればよい。

同じvisited intervalとcurrent endpointに至る履歴は、取得済みeventsも以後の選択肢も一致するため最小distanceだけを残せる。

左端から右へ拡張するcostと右端から右へ拡張するcostのように、現在endpointからnew coordinateまでのabsolute differenceを加える。

line exploration with prerequisite wallsをvisited-coordinate intervalへstate compressionし、endpoint-based interval DPでminimum travel distanceを求める。

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

座標順に並べた原点・壁・ハンマー・目標を考える。到達済み地点は原点を含む連続区間となり、その中のハンマーは追加条件なく回収できる。次に未到達地点へ進むには区間の左隣または右隣を通るしかなく、壁なら対応ハンマーが区間内にあることが必要十分である。状態を到達区間と現在端点にすれば次の移動費用と壁条件が決まる。全合法経路はこの拡張列へ縮約でき、全合法拡張は実際に歩けるので、最短距離の区間DPが正しい。

## 実装上の注意

- origin・goal・walls・hammersをdistinct coordinate順に並べ、各wallから対応hammerのcompressed indexを保持する。
- distance総和は32 bitを超えるため64 bitと大きなinfinityを使い、unreachable transitionは更新しない。

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
