---
title: "ABC434-E — Distribute Bunnies"
draft: true
authoringUnit: {"problemId":"abc434-e","docPath":"src/content/docs/problems/graph-search/outcome-augment-components-with-metadata/outcome-augment-components-with-metadata-shard-001/abc434-e.md","learningOutcomeIds":["outcome-augment-components-with-metadata"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression"],"excludedTopics":["DSUによる連結成分管理・縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dsu-components","tag-coordinate-compression"],"sourceRevisionIds":["source-abc434-e-problem-57a85c270331d5a998fe7241beb665e9a2a94be6ab8e403b818953267214041c","source-abc434-editorial-14684-e3f7929aa75b4bff090151a80f1d38ab481ab915f85146db5cb26658674d2e74"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"木成分はn頂点をn−1辺で全て覆えないが、根以外を各親辺で選べるためn−1を達成する。閉路を含む成分では余分な辺を外しても全域木は残る。根をその余分な辺の一端に選べば、全域木の子側選択で根以外、余分な辺で根を覆い、n頂点すべてを異なる選択先にできる。成分間で頂点は共有しないため寄与を足せる。","sourceRevisionIds":["source-abc434-e-problem-57a85c270331d5a998fe7241beb665e9a2a94be6ab8e403b818953267214041c","source-abc434-editorial-14684-e3f7929aa75b4bff090151a80f1d38ab481ab915f85146db5cb26658674d2e74"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

座標を頂点、ウサギをその二座標を結ぶ辺とみなす。各辺は端点一つを選ぶので、一成分で覆える頂点数は辺数m以下でもあり、常にn以下である。木成分では任意に根を選び、各辺で子側を選べばn−1頂点を覆う。閉路を含む成分では全域木と余分な辺を一つ選び、その余分な辺の端点uを全域木の根にする。木辺では各子を選び、余分な辺で根uを選ぶと全n頂点を覆える。よって成分の答えは木ならn−1、m≥nならn。

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

木成分はn頂点をn−1辺で全て覆えないが、根以外を各親辺で選べるためn−1を達成する。閉路を含む成分では余分な辺を外しても全域木は残る。根をその余分な辺の一端に選べば、全域木の子側選択で根以外、余分な辺で根を覆い、n頂点すべてを異なる選択先にできる。成分間で頂点は共有しないため寄与を足せる。

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
