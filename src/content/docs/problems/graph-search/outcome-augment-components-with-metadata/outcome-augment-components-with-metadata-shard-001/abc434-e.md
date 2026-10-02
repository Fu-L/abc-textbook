---
title: "ABC434-E — Distribute Bunnies"
draft: true
authoringUnit: {"problemId":"abc434-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc434-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression"],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components","tag-coordinate-compression"],"sourceRevisionIds":["source-abc434-e-problem-57a85c270331d5a998fe7241beb665e9a2a94be6ab8e403b818953267214041c","source-abc434-editorial-14684-e3f7929aa75b4bff090151a80f1d38ab481ab915f85146db5cb26658674d2e74"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一成分で覆う頂点数は min(n,m) 以下。木では根以外を各親辺で選び n−1=m を達成。閉路成分では閉路辺を循環方向へ選んで閉路全頂点を覆い、付く木の枝を子方向へ選べば全n頂点を覆える。成分間に座標重複がないので寄与を足す。","sourceRevisionIds":["source-abc434-e-problem-57a85c270331d5a998fe7241beb665e9a2a94be6ab8e403b818953267214041c","source-abc434-editorial-14684-e3f7929aa75b4bff090151a80f1d38ab481ab915f85146db5cb26658674d2e74"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

- 成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)

対象外:

- DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各ウサギ i は二座標 X_i-R_i と X_i+R_i のどちらかへ置ける。座標を頂点、ウサギをその二頂点を結ぶ辺とすると、各辺が端点一つを選び、選ばれた相異なる頂点数を最大化する問題になる。 木成分は任意の根を除き、各木辺で子側端点を選べば相異なる n-1 頂点を覆える。 閉路を含む成分は全域木を根付き木として根以外を覆い、木外辺の一つで根を選べるため全頂点を覆える。

採用する候補: 座標グラフの連結成分ごとに頂点数 n と辺数 m を数え、木なら n-1、閉路を含むなら n を加える。

木では辺数による上限 n-1 を根付き向き付けで達成し、非木では全域木と余分な一辺で全 n 頂点を選べる。

棄却する候補: ウサギ―座標の二部グラフで最大マッチングを求める。

正しく多項式時間だが、この二択構造では連結成分の木/非木判定だけでより簡潔・高速に解ける。

木成分は任意の根を除き、各木辺で子側端点を選べば相異なる n-1 頂点を覆える。

閉路を含む成分は全域木を根付き木として根以外を覆い、木外辺の一つで根を選べるため全頂点を覆える。

各端点座標を座標圧縮し、N 本の辺を張る。DSU または DFS で連結成分ごとの頂点数 n と辺数 m を集計し、m=n-1 なら n-1、m≥n なら n を答えへ加える。

## 典型の発動条件

### 選択問題のグラフ化

発動条件: 各対象が二候補のどちらか一方を選び、相異なる選択先を最大化するとき。

候補を頂点、対象を辺として、辺ごとの端点選択へ置き換える。

### 連結成分の閉路判定

発動条件: 成分ごとの最適値が木か閉路を含むかだけで決まるとき。

頂点数と辺数を比較し、木成分と非木成分を分類する。

### DSU と座標圧縮

発動条件: 大きな座標値を持つ疎グラフの連結成分を辺追加から集計するとき。

2N 個以下の端点を圧縮し、辺で unite して成分情報をまとめる。

## 問題固有の要素

二択配置を辺の向き付けと見ると、覆える頂点数は成分の独立閉路数が 0 か正かだけで決まる。

別の問題へ持ち帰る視点: 各辺が端点一つを資源として選ぶ問題では、木の根以外を覆う構成と余剰辺による根の補完が典型になる。

## 正当性

一成分で覆う頂点数は min(n,m) 以下。木では根以外を各親辺で選び n−1=m を達成。閉路成分では閉路辺を循環方向へ選んで閉路全頂点を覆い、付く木の枝を子方向へ選べば全n頂点を覆える。成分間に座標重複がないので寄与を足す。

## 実装上の注意

- 多重辺も閉路を作る非木成分として辺数に数える。孤立座標は入力に現れず寄与しないため、辺端点だけを圧縮すればよい。

## 復習の核

- 木成分の寄与 n-1 と非木成分の寄与 n を、それぞれ上界と達成構成の両方から確認する。

## 計算量と制約

### 時間

ウサギ数 N、座標数 V≤2N。圧縮 sort O(N log N)、DSU O(Nα(V))。

### 空間

座標、辺、DSUで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; -10^9 \leq X_i \leq 10^9; 1 \leq R_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/tasks/abc434_e) — source-abc434-e-problem-57a85c270331d5a998fe7241beb665e9a2a94be6ab8e403b818953267214041c
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14684) — source-abc434-editorial-14684-e3f7929aa75b4bff090151a80f1d38ab481ab915f85146db5cb26658674d2e74
