---
title: "ABC443-E — Climbing Silver"
draft: true
authoringUnit: {"problemId":"abc443-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-grid-table-dp/outcome-design-grid-table-dp-shard-001/abc443-e.md","learningOutcomeIds":["outcome-design-grid-table-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。"],"tagIds":["tag-grid-table-dp"],"sourceRevisionIds":["source-abc443-e-problem-b3960baa2caed86517a7483a19f035a7fa43860f29b9e6cf12ef1c1fb58bc67e","source-abc443-editorial-15178-902141be8f54ae13638e470cf9689e927602d2ef4019499fd15c4344db210272"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"壁を破壊する初回にはその列の全下方壁が既に壊れていなければならない。初めて壊せるのは元の最下壁だけである。その最下壁へ到達できたなら、同列を真上へ進み続けて全上方壁を順に壊す具体的なpathが存在するため、その列の上側は全て到達可能と確定してよい。最下壁より上へ別pathから入ったように見えても、下方壁を全て壊したpathは最下壁を通っているのでこの確定で網羅される。空きセルの三近傍伝播とこの列確定は全合法pathの必要十分な帰納更新。","sourceRevisionIds":["source-abc443-e-problem-b3960baa2caed86517a7483a19f035a7fa43860f29b9e6cf12ef1c1fb58bc67e","source-abc443-editorial-15178-902141be8f54ae13638e470cf9689e927602d2ef4019499fd15c4344db210272"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)

- グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。

## 考察

下段から上段へ侵入可能性を伝播できる。壁マスへ初めて到達したとき、その列で当該マスより下に壁が一つもなければ、そこから上の壁をまとめて壊して列全体へ侵入できる。 マス (i,j) へ下の三方向のいずれかから届かなければ、空きか壁かに関係なく新規侵入は起きない。 壁 (i,j) より下が全て空きなら銀を登ってその列の 1..i を一括で侵入可能にでき、この一括更新は列ごと高々一回で済む。

採用する候補: dp[i][j] をマス (i,j) へ侵入可能かとして下から上へ更新し、各列の最下壁位置を前計算して破壊可能条件を定数時間で判定する。

一段下の三近傍だけが通常遷移元であり、壁破壊の条件は最下壁位置という列ごとの一値に要約できるため全マスを一度ずつ処理できる。

棄却する候補: 壊す壁の列と開始位置をすべて選び、そのたびに盤面上の到達可能性を探索する。

候補ごとに O(N^2) 探索すると三乗以上になり、同じ到達状態を大量に再計算する。

マス (i,j) へ下の三方向のいずれかから届かなければ、空きか壁かに関係なく新規侵入は起きない。

壁 (i,j) より下が全て空きなら銀を登ってその列の 1..i を一括で侵入可能にでき、この一括更新は列ごと高々一回で済む。

各列の最下壁を求め、最下段の開始列を初期到達にする。i=N-1..1 で三近傍到達を調べ、空きなら dp を立てる。破壊可能な壁なら列の上側を到達済みにして以後の遷移へ使う。

## 典型の発動条件

### 盤面の依存順 DP

発動条件: 移動方向が一方向で、到達性が直前の層だけから決まるとき。

下段から上段へ三近傍の bool を伝播する。

### 列条件の前計算

発動条件: ある位置より下に障害が存在しないかを何度も問うとき。

各列の最下障害位置で破壊可能性を即時判定する。

## 問題固有の要素

壁を壊す操作も探索の分岐として列挙せず、初めて条件を満たした時の到達集合拡張として DP に組み込める。

別の問題へ持ち帰る視点: 方向付き盤面では、グラフ探索より行の依存順に沿う DP の方が一括更新を表しやすい場合がある。

## 正当性

壁を破壊する初回にはその列の全下方壁が既に壊れていなければならない。初めて壊せるのは元の最下壁だけである。その最下壁へ到達できたなら、同列を真上へ進み続けて全上方壁を順に壊す具体的なpathが存在するため、その列の上側は全て到達可能と確定してよい。最下壁より上へ別pathから入ったように見えても、下方壁を全て壊したpathは最下壁を通っているのでこの確定で網羅される。空きセルの三近傍伝播とこの列確定は全合法pathの必要十分な帰納更新。

## 実装上の注意

- 行の上下と index の増減を統一し、端列の j-1,j+1 を範囲外参照しない。一括で立てた dp を後続行で正しく利用する。

## 復習の核

- 壁破壊が可能な必要十分条件を列の最下壁で言い換え、通常遷移と一括到達を別々の小盤面で追う。

## 計算量と制約

### 時間

各case N×N。最下壁前計算と行DP、列の上側確定を各列一度までにして O(N²)。総時間 O(ΣN²)。

### 空間

盤面と到達tableで O(N²)、最下壁O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: T,N,C are integers.; 1 \le T \le 50000; 2 \le N \le 3000; 1 \le C \le N; S_i is a string of length N consisting of . and #.; The C-th character of S_N is ..; For each input, the sum of N^2 does not exceed 9 \times 10^6.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/tasks/abc443_e) — source-abc443-e-problem-b3960baa2caed86517a7483a19f035a7fa43860f29b9e6cf12ef1c1fb58bc67e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc443/editorial/15178) — source-abc443-editorial-15178-902141be8f54ae13638e470cf9689e927602d2ef4019499fd15c4344db210272
