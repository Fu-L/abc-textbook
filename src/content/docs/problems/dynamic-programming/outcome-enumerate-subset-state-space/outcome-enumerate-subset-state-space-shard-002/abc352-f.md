---
title: "ABC352-F — Estimate Order"
draft: true
authoringUnit: {"problemId":"abc352-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc352-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-graph-potential-propagation"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-graph-potential-propagation"],"sourceRevisionIds":["source-abc352-editorial-9924-9f4a632245687078caf887539d0a943a3fdae14d244b269cc96b7f0c6dbb80a1","source-abc352-f-problem-35d14022d92c00f83a01507e4d6b5bc77077b50b3809064a4417b574c01caa21"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"等式辺を伝播すると同一成分内の差は固定され、解は成分全体の平行移動だけを残す。正規化した形状の全合法 shift を列挙するので可能な絶対配置を漏らさない。配置 DP は互いに素な占有 mask だけを併合し、各成分を一回ずつ使う。対象成分を固定した候補が可能であることは、残り成分がその補集合をちょうど覆えることと同値。これを満たす候補全てで人物の位置が同じ場合に限り順位は一意である。","sourceRevisionIds":["source-abc352-editorial-9924-9f4a632245687078caf887539d0a943a3fdae14d244b269cc96b7f0c6dbb80a1","source-abc352-f-problem-35d14022d92c00f83a01507e4d6b5bc77077b50b3809064a4417b574c01caa21"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [静的graph等式制約のpotential伝播](src/content/docs/learn/graph/graph-potential-propagation.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

差制約 X_A−X_B=C は同じ連結成分内の相対順位を一意に決める。DFS で各頂点の offset D_i を求めれば、成分全体は共通 shift だけが自由になる剛体 block である。 N≤16 なので、各成分が占める順位 mask の可能な shift を列挙し、成分同士が重ならない placement を subset DP で判定できる。 成分内 offset を min=0 に正規化し、shift 後の全値が0..N−1で相異なる場合だけ、その occupancy mask が候補になる。 人物 i の成分をある mask に固定したとき、残り成分で補集合を敷き詰められるかを prefix/suffix または除外成分 DP で判定し、可能な i の絶対位置を集める。 配置成分の順は固定してよい。累積人数が厳密増加するので占有maskのpopcountで処理層が一意に決まり、各maskから次成分のshiftだけを試す。対象成分の除外は配置可否を変えない固定順を取り直すだけである。

採用する候補: 差制約 graph を連結成分へ分け、各成分の可能位置 mask を列挙して、他成分配置の bit DP から各人物の順位が一意か判定する。

連続でない剛体形状も mask で正確に扱え、N²2^N 程度で全配置可能性を調べられる。

棄却する候補: 順位1..Nの全 permutation を列挙し、M 個の差制約を検査する。

N=16でも16!は扱えず、差制約が成分ごとの平行移動だけを残すことを利用していない。

成分内 offset を min=0 に正規化し、shift 後の全値が0..N−1で相異なる場合だけ、その occupancy mask が候補になる。

人物 i の成分をある mask に固定したとき、残り成分で補集合を敷き詰められるかを prefix/suffix または除外成分 DP で判定し、可能な i の絶対位置を集める。

無向差制約 graph を DFS し D_A=D_B+C を伝播して成分を作る。各成分について全 shift の occupancy mask と各頂点位置を列挙する。成分を順に配置する dp[mask] を行い、各対象成分を除いた配置可能 mask と候補 placement の disjoint/全被覆条件から人物ごとの可能順位集合を求め、一要素ならその順位、複数なら −1。

## 典型の発動条件

### 差制約 component の平行移動

発動条件: x_u−x_v が固定された制約 graph で絶対座標だけ未定なとき。

DFS potential で相対値を求め、component を剛体として全 shift する。

### 形状 mask の exact cover DP

発動条件: 小さい universe 上へ複数の固定形状を重ならず配置したいとき。

各形状の shift mask を候補とし、occupied subset を状態にする。

## 問題固有の要素

順位差制約を一人ずつ扱うのでなく、連結成分を「穴を含む形状」として盤面1..Nへ置く問題に変換する。

別の問題へ持ち帰る視点: potential が決まる制約系では、component ごとの残り自由度が translation 一つかを確認する。

## 正当性

等式辺を伝播すると同一成分内の差は固定され、解は成分全体の平行移動だけを残す。正規化した形状の全合法 shift を列挙するので可能な絶対配置を漏らさない。配置 DP は互いに素な占有 mask だけを併合し、各成分を一回ずつ使う。対象成分を固定した候補が可能であることは、残り成分がその補集合をちょうど覆えることと同値。これを満たす候補全てで人物の位置が同じ場合に限り順位は一意である。

## 実装上の注意

- 辺の向きごとに C の符号を逆にする。成分内 offset 重複や範囲外 shift を候補にせず、複数配置で同じ人物順位が重なる場合は set で統合する。

## 復習の核

- まず一成分の relative positions を数直線に描き、自由度が shift だけと確認する。全体解の存在と個人順位の一意性を別の判定として扱う。

## 計算量と制約

### 時間

人数 N、制約 M、成分数 C≤N。対象成分を一つずつ除外して配置DPを行う。maskのpopcountから次に置く固定順成分が定まるので、一対象あたり全maskに高々N個のshift候補を試し O(N2^N)、全体 O(N+M+CN2^N)⊆O(M+N²2^N)。

### 空間

差制約 graph と DP の再利用で O(N+M+2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 16; 0 \leq M \leq \frac{N(N - 1)}{2}; 1 \leq A_i, B_i \leq N; 1 \leq C_i \leq N - 1; (A_i, B_i) \neq (A_j, B_j) (i \neq j); There is at least one possible ranking that does not contradict the given information.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc352/editorial/9924) — source-abc352-editorial-9924-9f4a632245687078caf887539d0a943a3fdae14d244b269cc96b7f0c6dbb80a1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc352/tasks/abc352_f) — source-abc352-f-problem-35d14022d92c00f83a01507e4d6b5bc77077b50b3809064a4417b574c01caa21
