---
title: "ABC443-F — Non-Increasing Number"
draft: true
authoringUnit: {"problemId":"abc443-f","docPath":"src/content/docs/problems/graph-search/outcome-select-state-graph-search/outcome-select-state-graph-search-shard-002/abc443-f.md","learningOutcomeIds":["outcome-select-state-graph-search"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness"],"excludedTopics":["状態グラフのモデリングと探索の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-state-graph-search","tag-constructive-witness"],"sourceRevisionIds":["source-abc443-editorial-15197-a20cb5df4ba450c476b50c9c0f0fc1204fdf7c0999bdc9367872550ab414173b","source-abc443-f-problem-a265f7e24b275c6d7683481599950207c9a31fbf981eb33be438240bfde46da0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"剰余と末尾桁が同じ状態では、以後付けられる桁と次の剰余が同じなので、BFSで先に到達した最短・最小prefixだけ残せばよい。辺は非減少桁条件を保ち、BFSは桁数順、同じ桁数では数字列の辞書順で展開するため、剰余0への初回到達が最小の正整数となる。到達stateから親を逆走すればその整数を復元できる。queueが空なら条件を満たす整数はなく、−1を出力する。","sourceRevisionIds":["source-abc443-editorial-15197-a20cb5df4ba450c476b50c9c0f0fc1204fdf7c0999bdc9367872550ab414173b","source-abc443-f-problem-a265f7e24b275c6d7683481599950207c9a31fbf981eb33be438240bfde46da0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

- 暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。

## 考察

状態を「剰余x、末尾桁c」とし、c以上の桁dを付ける辺でBFSする。剰余は `(10x+d) mod N`。先頭0を除くため、番兵state `(0,0)` から1〜9を最初の桁として追加する。BFSを桁の昇順で進めれば、最短桁数の中で最小の整数が最初に得られ、親を辿って復元できる。

実装では遷移先の桁dを小さい順に見て、既訪問stateに当たった時点でそのstateからの遷移を打ち切る。未訪問遷移は各stateへ一度しか入らず、打切り判定も一状態一回なので、定数桁数のO(10N)探索になる。

採用する候補: 剰余と末尾桁を頂点にしたBFSで、最小桁数・最小値を復元する。

元の巨大整数を保持せず、次の状態を決める情報だけを残す。

棄却する候補: 非減少桁の整数を値の小さい順に直接生成する。

答えの大きさや試行数を制限できない。

## 典型の発動条件

### 剰余オートマトンの BFS

発動条件: 桁列条件を満たす最小の N の倍数を探し、値を直接保持できないとき。

先頭桁と各状態からの追加桁を昇順に試し、剰余と末尾桁の未訪問状態へ初めて到達したとき親状態と追加桁を記録する。remainder=0から親を逆に辿り、反転して最短・辞書順最小の整数を復元する。

## 問題固有の要素

巨大整数探索は、割り切れ方を剰余、文字列制約を末尾桁へ要約すると有限状態最短路になる。

別の問題へ持ち帰る視点: 最短文字列の数値最小化では、BFS 層順と遷移文字の昇順を組み合わせる。

## 正当性

剰余と末尾桁が同じ状態では、以後付けられる桁と次の剰余が同じなので、BFSで先に到達した最短・最小prefixだけ残せばよい。辺は非減少桁条件を保ち、BFSは桁数順、同じ桁数では数字列の辞書順で展開するため、剰余0への初回到達が最小の正整数となる。到達stateから親を逆走すればその整数を復元できる。queueが空なら条件を満たす整数はなく、−1を出力する。

## 実装上の注意

- 番兵state `(0,0)` からは1〜9だけを追加し、以降は `d≥lastDigit`。既訪問遷移先に達したら桁昇順の走査をbreakする。
- queueが空になるケースがある。N=10では非減少桁の正整数倍数がなく、答えは−1。

## 復習の核

- 状態が保持しない過去情報でも、次遷移と目標判定に本当に不要かを確認し、BFS の tie-break を説明する。

## 計算量と制約

### 時間

法N、10N剰余×末digit状態、各最大10遷移。BFS O(100N)。

### 空間

dist親digit・queue O(10N)、復元答え長O(10N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 3\times 10^6; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/editorial/15197) — source-abc443-editorial-15197-a20cb5df4ba450c476b50c9c0f0fc1204fdf7c0999bdc9367872550ab414173b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/tasks/abc443_f) — source-abc443-f-problem-a265f7e24b275c6d7683481599950207c9a31fbf981eb33be438240bfde46da0
