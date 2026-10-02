---
title: "ABC232-F — Simple Operations on Sequence"
draft: true
authoringUnit: {"problemId":"abc232-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc232-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc232-editorial-3144-739c9255fe97d7547b110005e8a2a47d1393cadef05019ed068aa518e2ccf172","source-abc232-f-problem-6cea4f274f724badc0cfc01021a37f99c84df33baa0e728715d6390e1f9f96a7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"操作をswapによる順序決定と値補正に正規化できる。使用maskの次に元index xを置くと補正費用と残った前方indexを追い越す転倒費用が確定する。全順列はこの選択列に一意対応し、最小隣接swap数は転倒数なのでsubset DP最小が全操作最小。","sourceRevisionIds":["source-abc232-editorial-3144-739c9255fe97d7547b110005e8a2a47d1393cadef05019ed068aa518e2ccf172","source-abc232-f-problem-6cea4f274f724badc0cfc01021a37f99c84df33baa0e728715d6390e1f9f96a7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

ある要素を増減してから隣と交換する操作は、先に交換して移動先で同じ増減を行う操作へ入れ替えられる。 したがって全交換を先、全増減を後に行ってよく、最終的に A のどの元要素を B の各位置へ対応させるかという順列を選ぶ問題になる。 x を次に置くと、まだ未使用で x より小さい元添字は全て後ろへ来るので、その個数が x を左端とする転倒数としてこの時点で確定する。

棄却する候補: A の全順列を列挙し、転倒数による交換費用と B への増減費用を計算する。

N＝18 でも N の階乗個の順列は列挙できない。

採用する候補: B の左から対応元を決め、既に使用した A の添字集合だけを状態とする subset DP を行う。

次に元添字 x を置く増減費用と、新たに確定する転倒数が使用済み集合と x だけから決まる。

x を次に置くと、まだ未使用で x より小さい元添字は全て後ろへ来るので、その個数が x を左端とする転倒数としてこの時点で確定する。

操作の交換可能性で解を「順列＋位置別補正」へ正規化し、順列の prefix で確定する転倒寄与を使用済みビット集合の遷移コストとして最短 DP を行う。

## 典型の発動条件

### 操作順の正規化

発動条件: 二種類の操作が交換可能で、片方を全て先に寄せると最終構造を離散的に表せるとき。

交換を全て先にして A の順列を確定し、その後の増減費用を位置ごとの絶対差に分離する。

### 順列最適化の subset DP

発動条件: 順列を左から構成する追加費用が、使用済み要素集合と次要素だけに依存するとき。

mask の popcount を次の B 添字とし、未使用 x の対応費用と確定転倒数を加える。

## 問題固有の要素

増減費用は要素がどこへ移動したかだけ、交換費用は元添字順列の転倒数だけに依存し、操作列の細部を捨てられる。

別の問題へ持ち帰る視点: 値変更と位置変更が混在する最適化では、両操作を可換にして「対応」と「移動距離」の独立な費用へ分けられないか調べる。

## 正当性

操作をswapによる順序決定と値補正に正規化できる。使用maskの次に元index xを置くと補正費用と残った前方indexを追い越す転倒費用が確定する。全順列はこの選択列に一意対応し、最小隣接swap数は転倒数なのでsubset DP最小が全操作最小。

## 実装上の注意

- mask の要素数を k とすると次の対応先は B_k であり、未使用かつ x より小さい添字数を Y 倍する。
- Y と転倒数の積を含む費用は非常に大きいため 64 bit 整数と十分な INF を使う。

## 復習の核

- 操作が任意順なら、隣接する異種操作を交換して一方を前へ寄せても結果と費用が保たれるかを確認する。
- 順列の転倒数は完成後に数えるのでなく、次要素を置いた瞬間に確定する未使用要素との対として分配する。

## 計算量と制約

### 時間

列長N。maskN2^N遷移 O(N2^N)、各転倒増分を直接走査する実装は O(N²2^N)、popcountなら前者。

### 空間

maskDP O(2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 18; 1 \leq X \leq 10^8; 1 \leq Y \leq 10^{16}; 1 \leq A_i, B_i \leq 10^8; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/editorial/3144) — source-abc232-editorial-3144-739c9255fe97d7547b110005e8a2a47d1393cadef05019ed068aa518e2ccf172
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/tasks/abc232_f) — source-abc232-f-problem-6cea4f274f724badc0cfc01021a37f99c84df33baa0e728715d6390e1f9f96a7
