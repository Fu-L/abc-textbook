---
title: "ABC359-G — Sum of Tree Distance"
draft: true
authoringUnit: {"problemId":"abc359-g","docPath":"src/content/docs/problems/graph-search/outcome-build-balanced-separator-decomposition/outcome-build-balanced-separator-decomposition-shard-001/abc359-g.md","learningOutcomeIds":["outcome-build-balanced-separator-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["LCA・HLDによる固定木上パスの区間分解。"],"tagIds":["tag-tree-balanced-separator","tag-contribution-reordering"],"sourceRevisionIds":["source-abc359-editorial-10255-fa04795b52dc53305443c6a4e796293ae03ceecf0d2aae499b55cdd328735db6","source-abc359-g-problem-8807cff19735b7bad644485d89225be83901ac5aa78ee97ba0357f51da0c4dbc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各同色対は、重心分解で初めて別の子成分へ分かれる段、または一端が重心になる段に一度だけ属する。cnt_allは重心を含み、同じ子成分の個数を引くので、その段に属する相手だけが残る。異なる子成分の対は両端の重心までの経路長を一度ずつ足し、重心を端点とする対は非重心端点の経路長を一度だけ足す。従って式は各対の距離を重複なく合計する。同子成分内の対は再帰で数えられる。","sourceRevisionIds":["source-abc359-editorial-10255-fa04795b52dc53305443c6a4e796293ae03ceecf0d2aae499b55cdd328735db6","source-abc359-g-problem-8807cff19735b7bad644485d89225be83901ac5aa78ee97ba0357f51da0c4dbc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [木の均衡分離点から重心分解へ進む](src/content/docs/learn/tree/tree-balanced-separators.md)

- 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。

先に読む単元:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。

この解説で扱わないこと:

- LCA・HLDによる固定木上パスの区間分解。

## 考察

同じラベルの全頂点対を列挙すると、全頂点が同色の場合にO(N²)になる。距離を重心へ向かう二つの経路長へ分け、重心を通る対だけを一括集計する。

現在成分の重心をcとし、cを取り除いた子成分をC_1,…,C_sとする。cnt_all[a]はc自身を含む現在成分のラベルaの頂点数、cnt_i[a]はC_i内の個数と定義する。DFSで所属成分とdepth_c(v)=d(c,v)を得る。

v∈C_iを一端とし、経路がcを通る同色対の相手は、C_i外の同色頂点だけである。その個数はcnt_all[A_v]−cnt_i[A_v]。そこでこの段の寄与を

Σ_{i=1}^s Σ_{v∈C_i} depth_c(v)·(cnt_all[A_v]−cnt_i[A_v])

として加算する。異なる子成分の対(u,v)は、u側からdepth_c(u)、v側からdepth_c(v)が一度ずつ足され、距離全体になる。cを端点とする対(c,v)はv側からだけ数えられる。cnt_allにcを含めたので、その対の別加算はしない。

この個数は「vからcまでの経路全体の利用回数」である。vの重心向きの単一辺の利用回数ではない。その辺はvの子孫を端点とする対も使うため、辺単位の式として読んではならない。

cを除いた各子成分へ再帰し、まだ数えていない同成分内の対を集計する。重心で各成分が半分以下になるので、同じ頂点が処理される段数はO(log N)。各段のDFSとラベル集計を成分サイズに比例させれば、全体O(N log N)になる。

## 典型の発動条件

### 重心分解

発動条件: 木上の多数のpair量を、ある中心を通るpathごとに分割して数えるとき。

各段で重心を通るpairのみを集計し、残りを独立な子成分へ送る。

### 全体集計から同一groupを除く

発動条件: 異なる部分木に属する同属性pairを数えたいとき。

ラベル別全体count・sumから、処理中の子部分木の同ラベル集計を差し引く。

## 問題固有の要素

距離をpairごとに測る代わりに、重心へ向かう各path segmentが何組に使われるかを数えると積の集計へ落ちる。

別の問題へ持ち帰る視点: pair距離総和では「pairを列挙」ではなく「辺または中心への距離の利用回数」を数える。

## 正当性

各同色対は、重心分解で初めて別の子成分へ分かれる段、または一端が重心になる段に一度だけ属する。cnt_allは重心を含み、同じ子成分の個数を引くので、その段に属する相手だけが残る。異なる子成分の対は両端の重心までの経路長を一度ずつ足し、重心を端点とする対は非重心端点の経路長を一度だけ足す。従って式は各対の距離を重複なく合計する。同子成分内の対は再帰で数えられる。

## 実装上の注意

- 同じ重心子部分木内のpairをこの段で混ぜない。ラベル配列を毎段全初期化せず、訪れたラベルだけ消去するなど総作業量を守る。

## 復習の核

- 各pairがどの重心段で一度だけ数えられるかを先に説明する。実装では全体寄与と子部分木内の除外寄与を別関数にすると二重計上を追いやすい。

## 計算量と制約

### 時間

N 頂点。各重心段の DFS 集計が線形なら O(N log N)。ラベルを balanced map で集計する場合 O(N log²N)。

### 空間

木、重心情報、現在成分のラベル集計で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq u_i, v_i \leq N; 1 \leq A_i \leq N; The input graph is a tree.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/editorial/10255) — source-abc359-editorial-10255-fa04795b52dc53305443c6a4e796293ae03ceecf0d2aae499b55cdd328735db6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/tasks/abc359_g) — source-abc359-g-problem-8807cff19735b7bad644485d89225be83901ac5aa78ee97ba0357f51da0c4dbc
