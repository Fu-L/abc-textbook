---
title: "ABC226-E — Just one"
draft: true
authoringUnit: {"problemId":"abc226-e","docPath":"src/content/docs/problems/graph-search/outcome-peel-graph-core/outcome-peel-graph-core-shard-001/abc226-e.md","learningOutcomeIds":["outcome-peel-graph-core"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic"],"excludedTopics":["単一サイクル成分とgraph coreの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-graph-core-peeling","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc226-e-problem-3ca6433e5ec0f6996502c33674b13259def0590aeea6689d74a414ab33bbf677","source-abc226-editorial-2889-a9c5442114a34c37728bcec59eeeb20ea9188ddb5bd549a4dbcfec1bef7ea180"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各頂点の要求向きで成分辺数が頂点数と一致することが必要。連結V=Eはunicyclicで木枝の向きは葉から強制。cycleだけ二方向が可能で全要求を満たし二通り。成分は独立なので不一致なら0、全一致なら2^C。","sourceRevisionIds":["source-abc226-e-problem-3ca6433e5ec0f6996502c33674b13259def0590aeea6689d74a414ab33bbf677","source-abc226-editorial-2889-a9c5442114a34c37728bcec59eeeb20ea9188ddb5bd549a4dbcfec1bef7ea180"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単一サイクル成分とgraph core](src/content/docs/learn/graph/graph-core.md)

- 連結成分のE−V+1から独立な閉路数を判定し、E=Vなら唯一のcycleを持つことを示せる。必要なら次数1以下の頂点を反復削除し、残るcoreと削除順を求められる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

各頂点の出次数を1にすると、連結成分内の出次数総和は頂点数V'、一方で各無向辺は向きを一つ持つので総和は辺数E'である。したがって成分ごとにV'=E'が必要になる。 連結成分でE'=V'ならちょうど一つの閉路を持つ単一サイクル付き木であり、次数1の頂点から出る唯一の辺は外向きに強制される。 葉とその強制辺を繰り返し除くとサイクルだけが残り、各頂点の出次数を1にする向きはサイクルを一周する二方向だけである。

採用する候補: DFSで各連結成分の頂点数と辺数を数え、全成分が単一サイクルを持つV'=E'なら成分ごとの2方向を掛け合わせる。

V'=E'の連結グラフは葉を剥がすと一つのサイクルになり、木部分の向きは強制、サイクルだけが時計回り・反時計回りの2択になる。

棄却する候補: M本の辺の向きを2^M通り列挙し、各頂点の出次数を検査する。

Mは2×10^5まであり、成分構造を使わない指数列挙は不可能である。

連結成分でE'=V'ならちょうど一つの閉路を持つ単一サイクル付き木であり、次数1の頂点から出る唯一の辺は外向きに強制される。

葉とその強制辺を繰り返し除くとサイクルだけが残り、各頂点の出次数を1にする向きはサイクルを一周する二方向だけである。

未訪問頂点からDFSを行って成分のV'と次数和/2のE'を求め、不一致が一つでもあれば0、全て一致するなら2^(連結成分数)を998244353で返す。

## 典型の発動条件

### 連結成分ごとの独立な数え上げ

発動条件: 辺の制約と選択が連結成分をまたがず、全体の方法数が成分ごとの積になるとき。

各成分の実現可能性と方法数を別々に求め、不可能判定または積へ集約する。

### 単一サイクル連結成分の判定

発動条件: 連結無向グラフで頂点数と辺数が等しいという条件が現れるとき。

E=Vから閉路数が一つと判断し、葉を剥がした核がサイクルになる構造を使う。

## 問題固有の要素

『各頂点からちょうど一本』を全頂点で足すだけで、向き付けを考える前に成分ごとの辺数=頂点数という強い必要条件が得られ、それが十分条件にもなる。

別の問題へ持ち帰る視点: 局所次数条件は成分内で総和を取り、辺が何回数えられるかと比較して先にグラフ構造を絞る。

## 正当性

各頂点の要求向きで成分辺数が頂点数と一致することが必要。連結V=Eはunicyclicで木枝の向きは葉から強制。cycleだけ二方向が可能で全要求を満たし二通り。成分は独立なので不一致なら0、全一致なら2^C。

## 実装上の注意

- 無向辺を隣接リストで二回数える場合は次数和を2で割る。孤立頂点を含む成分もV'≠E'として正しく0にする。

## 復習の核

- 全頂点の次数条件はまず成分内で足し、EとVの関係が木・単一サイクル・多重サイクルのどれを強制するかを見る。

## 計算量と制約

### 時間

N頂点M辺。成分DFS O(N+M)、累積二倍O(N)。

### 空間

隣接とvisited O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 1 \leq U_i,V_i \leq N; U_i \neq V_i; All values in input are integers.; The given graph is simple.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/tasks/abc226_e) — source-abc226-e-problem-3ca6433e5ec0f6996502c33674b13259def0590aeea6689d74a414ab33bbf677
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc226/editorial/2889) — source-abc226-editorial-2889-a9c5442114a34c37728bcec59eeeb20ea9188ddb5bd549a4dbcfec1bef7ea180
