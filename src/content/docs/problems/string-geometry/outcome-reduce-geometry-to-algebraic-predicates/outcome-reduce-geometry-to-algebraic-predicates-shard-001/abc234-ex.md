---
title: "ABC234-EX — Enumerate Pairs"
draft: true
authoringUnit: {"problemId":"abc234-ex","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc234-ex.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc234-editorial-3226-f232d4ffcb06885e5072dcae4a2b6363748007bee7fe77327ffb0b96620eb015","source-abc234-ex-problem-07118ff864612051334090e1f97931adfd6226874136d32df91d62fe2a7b0db4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"距離K以下の点対は各座標差もK以下なので、幅Kの格子bucketでは同一または隣接bucketに限られる。一つのbucketを四つの半幅正方形へ分けると各小正方形の直径はK以下で、bucket内B点から真の出力がΩ(B²)−O(B)個生じる。隣接bucket間の候補積は2B_uB_v≤B_u²+B_v²で抑えられ、各bucketの隣接数は定数。よって全距離判定は O(N+R)。実際の二乗距離を最後に確認し、index順p<qだけを採用するので漏れも二重計数もない。","sourceRevisionIds":["source-abc234-editorial-3226-f232d4ffcb06885e5072dcae4a2b6363748007bee7fe77327ffb0b96620eb015","source-abc234-ex-problem-07118ff864612051334090e1f97931adfd6226874136d32df91d62fe2a7b0db4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

この解説で扱わないこと:

- 凸包の境界候補列挙・半平面交差。

## 考察

平面を一辺 K の正方形バケットへ分けると、距離 K 以下の二点は x・y のどちらのバケット番号も高々 1 しか違わない。

したがって各点の相手候補は自バケットと周囲 8 バケットだけだが、一バケットに点が集中する場合の比較数も評価する必要がある。

棄却する候補: 全ての二点組についてユークリッド距離を計算し、K 以下なら出力する。

出力が少なくても点対自体は N の二乗個あり、20 万点では走査できない。

採用する候補: 座標を K で割ったバケットへ点を格納し、各点について 3×3 個の隣接バケット内だけを全探索する。

幾何的に候補漏れがなく、密なバケットはそれ自体が多数の真の近距離ペアを生むため、比較総数を入力数と出力数で抑えられる。

一辺 K のバケットをさらに定数個の直径 K 以下の小正方形で覆えるので、バケット内点数 B が大きければ真の出力ペアも B² に比例して多い。

隣接バケット間の候補積 B_uB_v も B_u²＋B_v² で抑えられ、出力上限 4×10^5 が探索量の上限証明に使える。

距離閾値をセル幅にした spatial hashing で局所候補だけを列挙し、セル密度が真の出力数へ下界を与えることから output-sensitive な全探索を正当化する。

## 典型の発動条件

### 固定半径近傍の空間ハッシュ

発動条件: 距離 R 以下の全点対を列挙し、座標範囲は大きいが閾値 R が共通のとき。

セル幅 R で座標を割り、同一・隣接セルの点だけを距離検査する。

### 出力依存計算量の密度評価

発動条件: 候補集合が局所的に密になる可能性がある一方、真の出力個数に上限が与えられているとき。

セル内候補数の二乗が実際の近距離ペア数でも下から抑えられることを示す。

## 問題固有の要素

一辺 K のセル内の全点対が必ず近いわけではないが、4 個の直径 K 以下の領域で覆う鳩ノ巣原理により十分多くの真ペアが存在する。

別の問題へ持ち帰る視点: 粗い空間分割の偽陽性を評価するとき、各セルを定数個の「内部全対が真」な領域で被覆して出力下界を作る。

## 正当性

距離K以下の点対は各座標差もK以下なので、幅Kの格子bucketでは同一または隣接bucketに限られる。一つのbucketを四つの半幅正方形へ分けると各小正方形の直径はK以下で、bucket内B点から真の出力がΩ(B²)−O(B)個生じる。隣接bucket間の候補積は2B_uB_v≤B_u²+B_v²で抑えられ、各bucketの隣接数は定数。よって全距離判定は O(N+R)。実際の二乗距離を最後に確認し、index順p<qだけを採用するので漏れも二重計数もない。

## 実装上の注意

- 各候補対は p＜q の向きで一度だけ調べ、距離二乗と K² は 64 bit 整数で比較する。
- 見つけた組は辞書順にソートしてから個数とともに出力し、同座標の異なる点も距離 0 の別ペアとして扱う。

## 復習の核

- 近傍列挙でセル分割を使う際は候補漏れだけでなく、セル集中時の偽陽性比較数を出力数から抑えられるか確認する。
- 距離閾値とセル幅を同じにし、何セル先まで見れば十分かを各座標差から導く。

## 計算量と制約

### 時間

Rを出力される点対数として、連想配列を平衡木で持つ場合 O(N log N+R log(R+1))。候補点対の距離判定総数自体は O(N+R)。hash mapならbucket操作は期待 O(N)だが、最終辞書順sortの費用は残る。

### 空間

bucketの点と出力点対を保持して O(N+R)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N \le 2 \times 10^5; 1 \le K \le 1.5 \times 10^9; 0 \le x_i,y_i \le 10^9; There are at most 4 \times 10^5 pairs of integers that should be listed.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/editorial/3226) — source-abc234-editorial-3226-f232d4ffcb06885e5072dcae4a2b6363748007bee7fe77327ffb0b96620eb015
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc234/tasks/abc234_h) — source-abc234-ex-problem-07118ff864612051334090e1f97931adfd6226874136d32df91d62fe2a7b0db4
