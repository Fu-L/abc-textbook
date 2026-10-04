---
title: "ABC212-F — Greedy Takahashi"
draft: true
authoringUnit: {"problemId":"abc212-f","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc212-f.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting"],"sourceRevisionIds":["source-abc212-editorial-2362-aea76636a7c36404d7fbd71626002882ba2187c3d8d979b8c9005a8cb482628a","source-abc212-f-problem-62eaab628a2d9150c7f51b5a8a376dc3f779544501a3fe52df15eaafa0ea3e2b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各街で最初の出発便を選ぶ規則は一意なのでバス到着後の後継を固定写像にできる。時間は厳密進行するためcycleはなく、到着観測時刻未満の便をjumpで飛ばして最後の乗車/待機境界だけ見ると同じ旅程位置を得る。","sourceRevisionIds":["source-abc212-editorial-2362-aea76636a7c36404d7fbd71626002882ba2187c3d8d979b8c9005a8cb482628a","source-abc212-f-problem-62eaab628a2d9150c7f51b5a8a376dc3f779544501a3fe52df15eaafa0ea3e2b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 考察

高橋君は街にいるたび、現在時刻以後にその街を出る最初のバスへ必ず乗る。各街の同一出発時刻は重複しないので、次に選ぶバスは一意に定まる。 バス i の到着後に乗るバスは、到着街から時刻 T_i 以後に出る最初の一本であり、街ごとの出発時刻順リストから二分探索できる。 旅程は時刻とともに前へ進み、バスを頂点とすると各頂点の後継が高々一つの関数グラフとして表せる。 終了時刻 Z が出発前、乗車中、到着後のどこに入るかで、出力は一つの街または二つの街に分かれる。

棄却する候補: 各クエリで開始時刻からバスを一台ずつ追跡し、時刻 Z に達するまでシミュレーションする。

一つの旅程が多数のバスを経由し得るため、クエリ数とバス数の積に近い追跡が発生する。

採用する候補: 各バスの一意な次バスを求め、その写像の 2 の冪回先をダブリング表として前計算する。

各クエリでは開始バスを二分探索し、到着時刻が Z 未満の範囲だけを大きな跳躍から選んで進められる。

旅程は時刻とともに前へ進み、バスを頂点とすると各頂点の後継が高々一つの関数グラフとして表せる。

終了時刻 Z が出発前、乗車中、到着後のどこに入るかで、出力は一つの街または二つの街に分かれる。

街別にソートした出発時刻列で後継バスを構成し、後継写像へ二進法的なジャンプ表を重ねて、時刻上限付きの経路追跡クエリへ変換する。

## 典型の発動条件

### 関数グラフのダブリング

発動条件: 各状態から次状態が一意で、同じ遷移を多数のクエリから長距離たどるとき。

バスを状態、到着後の最初のバスを後継とし、2 の冪回先とその時刻情報を前計算する。

### 時刻表への二分探索

発動条件: 要素が場所ごとに時刻順で並び、指定時刻以後の最初の要素を繰り返し探すとき。

各街のバスを出発時刻で整列し、開始時刻または到着時刻以上となる最初の出発を lower_bound で得る。

## 問題固有の要素

半整数時刻に居場所を問う設定により、整数の出発・到着時刻との等号を曖昧にせず、乗車中か街にいるかを比較だけで判定できる。

別の問題へ持ち帰る視点: 連続時間の問い合わせでも、イベント時刻との境界関係を整理すると離散的な後継遷移と終端判定へ落とせる。

## 正当性

各街で最初の出発便を選ぶ規則は一意なのでバス到着後の後継を固定写像にできる。時間は厳密進行するためcycleはなく、到着観測時刻未満の便をjumpで飛ばして最後の乗車/待機境界だけ見ると同じ旅程位置を得る。

## 実装上の注意

- 後継が存在しないバスには共通の番兵を割り当て、ダブリング表の参照が配列外へ出ないようにする。
- Z がバスの出発時刻以下なら出発街、出発より後かつ到着以下なら乗車中、それより後なら到着街という境界を統一する。

## 復習の核

- 行動規則に「最も早いもの」があり同時刻の重複が排除されていたら、状態ごとの後継が一意になる点を先に抽出する。
- ダブリングで終端を飛び越えるだけでなく、最後に残った一本の出発・到着時刻と質問時刻を比較して出力形式を決める。

## 計算量と制約

### 時間

街N、バスM、質問Q。出発sort O(M log M)、後継表O(M log M)、質問O(log M)、計 O(N+(M+Q)log M)。

### 空間

街別リストとjump O(N+M log M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 1 \leq M \leq 10^5; 1 \leq Q \leq 10^5; 1 \leq A_i,B_i \leq N\ (1 \leq i \leq M); A_i \neq B_i\ (1 \leq i \leq M); 1 \leq S_i \lt T_i \leq 10^9\ (1 \leq i \leq M); S_i \neq S_j\ (i \neq j); 1 \leq X_i \lt Z_i \leq 10^9\ (1 \leq i \leq Q); 1 \leq Y_i \leq N\ (1 \leq i \leq Q); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/editorial/2362) — source-abc212-editorial-2362-aea76636a7c36404d7fbd71626002882ba2187c3d8d979b8c9005a8cb482628a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/tasks/abc212_f) — source-abc212-f-problem-62eaab628a2d9150c7f51b5a8a376dc3f779544501a3fe52df15eaafa0ea3e2b
