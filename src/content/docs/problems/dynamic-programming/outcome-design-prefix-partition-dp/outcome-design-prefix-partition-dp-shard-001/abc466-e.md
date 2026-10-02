---
title: "ABC466-E — Range Flip"
draft: true
authoringUnit: {"problemId":"abc466-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc466-e.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-greedy-exchange"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc466-e-problem-4ba87520bee3c600fc85b2af5308f919b501ce18367da34fe56b758004d431dd","source-abc466-editorial-22629-4ae993f0eb49e129b14e741f409c3997322e3cb8a3254fa1d3e195ceb2170757"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"K区間flipのxor結果には向きの切替境界が高々2K個あるので、裏runは高々K本。逆に裏runを各一回flipすれば同じ向き列を高々K操作で作れる。従って重なりを消した表・裏交互phaseへ正規化できる。先頭末尾の表phaseや未使用phaseは空を許す。左から各カードを現在phaseへ置くか次phaseへ進めるDPは全向き列の分割を網羅し、各phaseで対応面値を一度加えるため最大和を正確に求める。","sourceRevisionIds":["source-abc466-e-problem-4ba87520bee3c600fc85b2af5308f919b501ce18367da34fe56b758004d431dd","source-abc466-editorial-22629-4ae993f0eb49e129b14e741f409c3997322e3cb8a3254fa1d3e195ceb2170757"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

最適解ではflip区間を互いに交差しないよう正規化できる。したがって最終向き列は表・裏が交互に現れる高々2K+1個の連続区間へ分割した形になる。 左から奇数segmentでは表面値、偶数segmentでは裏面値を加え、空segmentを許せばflip個数がK未満の解も2K+1状態内に含められる。 各cardでjを維持するかj-1から移るだけなので、過去のsegment端点位置をstateに持つ必要がない。

採用する候補: dp[i][j]をcard iまで見て現在j番目の表裏交互segmentに属する最大得点とし、同segment継続または次segmentへ移る遷移をO(NK)で行う。

交差する二flip区間は端点を組み替えると最終parityを保ったまま総区間長を減らせるため除外でき、disjoint flip集合と交互segment分割が一対一に対応する。

棄却する候補: 最大K個のflip区間の全端点を列挙して得点を計算する。

O(N^{2K})候補となり、Kが入力で大きい場合に扱えない。

左から奇数segmentでは表面値、偶数segmentでは裏面値を加え、空segmentを許せばflip個数がK未満の解も2K+1状態内に含められる。

各cardでjを維持するかj-1から移るだけなので、過去のsegment端点位置をstateに持つ必要がない。

j=1..2K+1のdpを-∞で初期化し、cardを左から処理する。face(j)の値を加えたうえで old[j]から継続、old[j-1]から境界開始の最大を取る。空segment規約に応じprefix maxでskipを許し、最終全jの最大を返す。

## 典型の発動条件

### 区間flipの交互segment DP

発動条件: disjointな区間反転を高々K回選び、位置ごとの二状態得点を最大化するとき。

最終parity run番号だけをstateにして左から遷移する。

### 交差区間のuncrossing

発動条件: 区間操作の重なりがxor効果だけを持つとき。

端点を組替えて同じ結果のdisjoint区間へ正規化する。

## 問題固有の要素

操作列を列挙せず、最終的に各位置が何回反転されたかのparity runとして表現する。

別の問題へ持ち帰る視点: interval選択問題ではuncrossingで重なりを排除できると、端点DPが単純なsegment番号DPへ縮む。

## 正当性

K区間flipのxor結果には向きの切替境界が高々2K個あるので、裏runは高々K本。逆に裏runを各一回flipすれば同じ向き列を高々K操作で作れる。従って重なりを消した表・裏交互phaseへ正規化できる。先頭末尾の表phaseや未使用phaseは空を許す。左から各カードを現在phaseへ置くか次phaseへ進めるDPは全向き列の分割を網羅し、各phaseで対応面値を一度加えるため最大和を正確に求める。

## 実装上の注意

- 表から始まり表で終わる2K+1 segmentの空許容規約を遷移へ正しく反映する。-∞へ値を加えてoverflowしない。

## 復習の核

- 交差二区間の端点交換でflip parityが保たれることを図示し、disjoint区間とsegment番号の対応を確認する。

## 計算量と制約

### 時間

Nカード、flip上限K。高々2K+1のface phase DPで O(NK)。

### 空間

rolling phase配列O(K)、カード逐次入力なら追加O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq K \leq 10; 1 \leq A_i, B_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc466/tasks/abc466_e) — source-abc466-e-problem-4ba87520bee3c600fc85b2af5308f919b501ce18367da34fe56b758004d431dd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc466/editorial/22629) — source-abc466-editorial-22629-4ae993f0eb49e129b14e741f409c3997322e3cb8a3254fa1d3e195ceb2170757
