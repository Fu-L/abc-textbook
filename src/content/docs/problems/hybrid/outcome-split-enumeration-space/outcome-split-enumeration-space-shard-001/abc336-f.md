---
title: "ABC336-F — Rotation Puzzle"
draft: true
authoringUnit: {"problemId":"abc336-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc336-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-state-graph-search"],"sourceRevisionIds":["source-abc336-editorial-9077-0cd54d18f7cc11b31dcadd7717f47d87708c62acb78535738776c658707e70f8","source-abc336-f-problem-a8622f4a21e80664937f8b887d949e748d985863cfc0fec2d26b8c93ceb99fb0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最短距離20以下のpathには、初期から10手以内かつ目標から10手以内の中間状態が必ずある。両側で各状態への最短depthを記録すれば、共通状態に対するdistStart+distGoalの最小値が答えになる。 自己逆操作により中間状態で二つのpathを連結でき、探索深さを20から10へ半減できる。","sourceRevisionIds":["source-abc336-editorial-9077-0cd54d18f7cc11b31dcadd7717f47d87708c62acb78535738776c658707e70f8","source-abc336-f-problem-a8622f4a21e80664937f8b887d949e748d985863cfc0fec2d26b8c93ceb99fb0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一手は4種類の(H-1)×(W-1) rectangleの180度回転で、各操作は自分自身が逆操作である。20手を片側から列挙せず、初期状態と完成状態から各10手の到達集合を作ればよい。

採用する候補: 両端からdepth 10までBFSするmeet-in-the-middle

自己逆操作により中間状態で二つのpathを連結でき、探索深さを20から10へ半減できる。

棄却する候補: 初期状態からdepth 20まで全状態を探索する

直前と同じ操作を除いても約4·3^19通りとなり現実的でない。

最短距離20以下のpathには、初期から10手以内かつ目標から10手以内の中間状態が必ずある。両側で各状態への最短depthを記録すれば、共通状態に対するdistStart+distGoalの最小値が答えになる。

grid配列をcanonicalなstate keyへencodeし、初期と完成gridを始点にそれぞれ4回転を辺とするBFSをdepth 10まで行う。二つのdistance mapの小さい側を走査して共通keyを探し、距離和の最小が20以下なら出力、なければ-1とする。

## 典型の発動条件

### meet-in-the-middle探索

発動条件: 操作数上限が20でbranchingは小さいが片側全探索は指数的に大きい。

pathを10+10に分割し、両端の到達state集合のintersectionを取る。

### involutionの逆向き探索

発動条件: 各操作が180度回転で、同じ操作をもう一度行うと元に戻る。

目標からも同じ遷移生成器でBFSし、逆操作実装を別に持たない。

## 問題固有の要素

各操作が四隅のどれか一cellを除いた大rectangleを反転するだけなので、盤面全体をstateとしても10層なら探索可能である。

別の問題へ持ち帰る視点: 短い操作列の最短化では、可逆な操作なら両端BFSで指数の肩を半分にできる。

## 正当性

最短距離20以下のpathには、初期から10手以内かつ目標から10手以内の中間状態が必ずある。両側で各状態への最短depthを記録すれば、共通状態に対するdistStart+distGoalの最小値が答えになる。 自己逆操作により中間状態で二つのpathを連結でき、探索深さを20から10へ半減できる。

## 実装上の注意

- 各側で最初に訪れたdepthだけを保存しdepth 10からは展開しない。HW≤64なので各値を6bitでpackできるが、衝突しないkey表現を使う。

## 復習の核

- 初期=完成、1手で完成、同じ回転2回、最短10・11・20手、到達不能を片側の浅いBFSで検証する。

## 計算量と制約

### 時間

O(HW·4¹⁰)、各側depth10まで四分岐をstate encodeしてBFS。

### 空間

O(HW·4¹⁰)、二distance mapの保守的上界。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 3 \leq H,W \leq 8; 1 \leq S_{i,j} \leq H \times W; If (i,j) \neq (i',j'), then S_{i,j} \neq S_{i',j'}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc336/editorial/9077) — source-abc336-editorial-9077-0cd54d18f7cc11b31dcadd7717f47d87708c62acb78535738776c658707e70f8
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc336/tasks/abc336_f) — source-abc336-f-problem-a8622f4a21e80664937f8b887d949e748d985863cfc0fec2d26b8c93ceb99fb0
