---
title: "ABC349-E — Weighted Tic-Tac-Toe"
draft: true
authoringUnit: {"problemId":"abc349-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-evaluate-adversarial-game-value/outcome-evaluate-adversarial-game-value-shard-001/abc349-e.md","learningOutcomeIds":["outcome-evaluate-adversarial-game-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["勝敗だけを分類する通常の後退解析・Grundy数。"],"tagIds":["tag-game-value-dp"],"sourceRevisionIds":["source-abc349-e-problem-d85b1428d634ff73f6e42fa7cec9d7e7d380c8a49707ceea3650eb6132304b14","source-abc349-editorial-9780-919791b6256f66739ac67ccbd469d346f11d403d464187d1024aa862d9bfa6e7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"三目成立なら即勝敗、全埋めなら重み合計で終端。非終端は手番の人が自分勝ちchildを一つでも選べると勝ち、全child負けなら負け。このminimax帰納法は空き数を減らすDAG上で厳密。同盤面は将来同じなのでmemo可能。","sourceRevisionIds":["source-abc349-e-problem-d85b1428d634ff73f6e42fa7cec9d7e7d380c8a49707ceea3650eb6132304b14","source-abc349-editorial-9780-919791b6256f66739ac67ccbd469d346f11d403d464187d1024aa862d9bfa6e7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [minimax・得点差・局面値を評価するゲームDP](src/content/docs/learn/dynamic-programming/dp-game-value.md)

- 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 勝敗だけを分類する通常の後退解析・Grundy数。

## 考察

盤面は各cellがwhite/red/blueの3状態で高々3^9通りしかない。手番は塗られたcell数のparityで決まり、終了していなければ現在playerは「一手先に自分が勝つstateがあるか」だけを選べばよい。 terminalで同色三目があればその色のplayerが勝ち、全埋まりならred取得weight和とblue取得weight和を比較する。非terminalでは一つでもcurrent player勝利となるchildがあれば勝ち、全childが相手勝利なら負ける。

採用する候補: 盤面stateをmemo化したminimax再帰で勝者を判定する

全game treeの同一盤面を共有し、有限DAG上の勝敗を高々3^9×9遷移で解ける。

棄却する候補: 局所的に最高weightのcellをgreedyに取る

三目完成による即勝利がscoreより優先され、相手のthreatもあるためweightだけの局所選択は最適でない。

terminalで同色三目があればその色のplayerが勝ち、全埋まりならred取得weight和とblue取得weight和を比較する。非terminalでは一つでもcurrent player勝利となるchildがあれば勝ち、全childが相手勝利なら負ける。

redMask,blueMaskまたはternary codeをstate keyにする。8本のwinning maskを検査し、full boardならmask別weight sumを比較する。未終了ではmove数偶数ならTakahashi、奇数ならAokiとして各empty cellを自色へ追加し再帰し、自分勝ちchildを見つけたらtrueをmemoする。初期stateのwinnerを出力する。

## 典型の発動条件

### 有限完全情報gameのminimax

発動条件: 運要素がなく、双方が勝利を目的に最適行動し、state遷移がacyclicである。

terminal winnerをbaseに、存在/全称でcurrent playerの勝敗を後ろ向きに決める。

### bitmask盤面表現

発動条件: 3×3盤面の占有とwinning line包含を高速に検査したい。

playerごとの9-bit maskを持ち、(mask&line)==lineで三目を判定する。

## 問題固有の要素

score最大化gameではなく勝敗gameなので、途中の三目は残りweightに関係なく即終了し、score比較は9手完了時だけ行う。

別の問題へ持ち帰る視点: 複数終了規則のgame DPではrule priorityをterminal evaluatorにそのまま反映する。

## 正当性

三目成立なら即勝敗、全埋めなら重み合計で終端。非終端は手番の人が自分勝ちchildを一つでも選べると勝ち、全child負けなら負け。このminimax帰納法は空き数を減らすDAG上で厳密。同盤面は将来同じなのでmemo可能。

## 実装上の注意

- 三目判定をfull-board scoreより先に行う。Aは負でもscoreをsigned 64bitで合計し、総和odd保証によりfull board tieはない。

## 復習の核

- 即勝ちを取る局面、相手三目をblockする局面、三目なしで負weightを含むscore決着を手作業minimaxと比較する。

## 計算量と制約

### 時間

9マス。ternary盤面は3^9、各9遷移で O(9·3^9)。

### 空間

memo O(3^9)、再帰深さ9。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: |A_{i,j}| \leq 10^9; \sum_{i=1}^3 \sum_{j=1}^3 A_{i,j} is odd.; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/tasks/abc349_e) — source-abc349-e-problem-d85b1428d634ff73f6e42fa7cec9d7e7d380c8a49707ceea3650eb6132304b14
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/editorial/9780) — source-abc349-editorial-9780-919791b6256f66739ac67ccbd469d346f11d403d464187d1024aa862d9bfa6e7
