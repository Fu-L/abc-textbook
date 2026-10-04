---
title: "ABC229-F — Make Bipartite"
draft: true
authoringUnit: {"problemId":"abc229-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc229-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc229-editorial-2964-a66e289920d7588fbb4b2e2cd89b55615cf46b882c4d66e37469774e168f85e0","source-abc229-f-problem-f2579985b675f085a56d0c290e1dc7beff1aa85aa5f2a862ccfd13f209542fb4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二部グラフには二彩色があり、固定彩色の同色辺は必ず削除し異色辺は全て残してよい。よって同色辺の費用最小化と元問題は同値。中心色は全色反転対称性で0に固定できる。外周を切り、最初の色を固定すると放射辺と隣接辺の費用は直前色と今の色だけで決まる。最後に環を閉じる辺B_Nを先頭色と比較して加えることで全彩色を漏れなく最適化する。","sourceRevisionIds":["source-abc229-editorial-2964-a66e289920d7588fbb4b2e2cd89b55615cf46b882c4d66e37469774e168f85e0","source-abc229-f-problem-f2579985b675f085a56d0c290e1dc7beff1aa85aa5f2a862ccfd13f209542fb4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

残す辺だけで二部グラフにすることは、全頂点を二色に塗り、同色の両端を結ぶ辺を削除することと同値である。

頂点 0 の色は全色を反転しても費用が変わらないので固定でき、各頂点 i の色を決めると A_i の削除費用が局所的に決まる。

棄却する候補: 頂点 1 から N の全ての二色塗り分けを列挙し、同色辺の重み和を計算する。

各頂点の二択による指数個の彩色があり、N が 20 万では列挙できない。

採用する候補: 環の辺 (N,1) を一旦外し、現在色と頂点 1 の色を状態に持つ列 DP を行い、最後に外した辺の費用を足す。

パス上では新しい頂点の色と直前色だけで追加費用が決まり、先頭色を保持すれば閉路条件も最後に評価できる。

二部性を辺集合から直接考えるのでなく、彩色を決めたとき削除必須となる同色辺の総重み最小化へ双対的に読み替える。

中心頂点の色を固定し、外周の環を切って二色の系列 DP にし、直前色・先頭色を使って放射辺と隣接辺の同色費用を加算する。

## 典型の発動条件

### 二部グラフ化の二色彩色最適化

発動条件: 重み付き辺を削除して二部グラフにし、削除重みを最小化するとき。

頂点彩色を選び、両端が同色になった辺の重みだけを削除費用として数える。

### 環を切る先頭状態付き DP

発動条件: 環状列の局所コストが隣接状態だけで決まり、最後と最初の整合も必要なとき。

先頭色を状態へ保存してパスとして走査し、最後に (N,1) の費用を評価する。

## 問題固有の要素

頂点 0 と i の辺は i が頂点 0 と同色のときだけ A_i を払い、外周辺は隣接色が同じときだけ B_i を払う。

別の問題へ持ち帰る視点: グラフの特殊構造が「固定頂点への辺＋環」なら、固定頂点の影響を単項コスト、環辺を隣接コストへ分離する。

## 正当性

二部グラフには二彩色があり、固定彩色の同色辺は必ず削除し異色辺は全て残してよい。よって同色辺の費用最小化と元問題は同値。中心色は全色反転対称性で0に固定できる。外周を切り、最初の色を固定すると放射辺と隣接辺の費用は直前色と今の色だけで決まる。最後に環を閉じる辺B_Nを先頭色と比較して加えることで全彩色を漏れなく最適化する。

## 実装上の注意

- 頂点 0 の色を 0 に固定し、i の色が 0 のときだけ放射辺 A_i の費用を加える規則を統一する。
- B_N は頂点 N と 1 の辺なので走査中に加えず、最終色と保存した先頭色が等しい場合だけ最後に加える。

## 復習の核

- 二部化のための削除では、最終的に残る彩色を先に固定し、削除必須辺が局所判定できるかを見る。
- 環状遷移を線形化するときは、切った一本の辺をどの状態で最後に回収するかを明示する。

## 計算量と制約

### 時間

O(N)。先頭色を二通り固定する。

### 空間

O(1)補助領域。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 10^9; 1 \leq B_i \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc229/editorial/2964) — source-abc229-editorial-2964-a66e289920d7588fbb4b2e2cd89b55615cf46b882c4d66e37469774e168f85e0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc229/tasks/abc229_f) — source-abc229-f-problem-f2579985b675f085a56d0c290e1dc7beff1aa85aa5f2a862ccfd13f209542fb4
