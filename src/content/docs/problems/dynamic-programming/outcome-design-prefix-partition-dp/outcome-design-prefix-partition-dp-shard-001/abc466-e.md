---
title: "ABC466-E — Range Flip"
draft: true
authoringUnit: {"problemId":"abc466-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc466-e.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-greedy-exchange"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc466-e-problem-4ba87520bee3c600fc85b2af5308f919b501ce18367da34fe56b758004d431dd","source-abc466-editorial-22629-4ae993f0eb49e129b14e741f409c3997322e3cb8a3254fa1d3e195ceb2170757"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"K区間のxor結果の裏run数は高々Kであり、逆に各裏runを一回反転すればその向き列を高々K操作で作れる。空を許す2K+1個の交互phase分割はこの全向き列を表す。prefixへカードを追加する際、以前の最後のphase hから任意のj≥hへ進み、その間を空にした分割を選べる。従ってprefix最大値から面値を加える遷移は全分割を網羅し、カードごとに一度だけ得点を加える。空prefixの全phase初期値0からの帰納と最終全phaseの最大値で最適得点が得られる。","sourceRevisionIds":["source-abc466-e-problem-4ba87520bee3c600fc85b2af5308f919b501ce18367da34fe56b758004d431dd","source-abc466-editorial-22629-4ae993f0eb49e129b14e741f409c3997322e3cb8a3254fa1d3e195ceb2170757"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

## 考察

区間反転の効果は各カードを含む操作数の偶奇で決まる。K操作の端点は高々2K個なので、最終的な裏向きrunは高々K個。逆に各裏runを一回反転すれば同じ向き列を作れる。したがって重なりや操作順を探索せず、裏runを高々K個持つ二値列の得点最大化へ帰着する。

0-basedのphase番号j=0,…,2Kを使い、偶数phaseは表のA_i、奇数phaseは裏のB_iを加える。空phaseを許す全分割なら、最初から裏、全て表、最後まで裏、K未満の操作も同じ状態で表せる。

dp[j]を処理済みprefixをphase0,…,jへ分けた最大得点とし、現在の最後のphaseが空でもよいものとする。カードをまだ読んでいない初期値は全jで0。カードiごとに旧dpのprefix maximumを作り、

```text
best_j = max_{0≤h≤j} old[h]
next[j] = best_j + (jが偶数 ? A_i : B_i)
```

とする。h<jなら間のphaseを空のまま飛ばし、h=jなら同じphaseを継続する。毎行をprefix maximum一回で処理してO(K)、答えは最終dpの全jの最大値。初期値全0は空prefixをどのphaseまで進めても得点0である意味で、未読カードを加点する意味ではない。

N=1,K=1,A_1=1,B_1=10なら裏phase1へ直接入り10を得る。dpを全て−∞にするだけでは初手が存在せず、phase0だけを0にして「次phaseだけ」へ遷移する説明では空phaseを飛ばす意味が曖昧になる。ここでは空phaseをprefix maximumの式に統一する。

端点を全列挙するとO(N^{2K})だが、処理位置と現在phaseだけが将来の選択へ影響するためO(NK)へ圧縮できる。

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

K区間のxor結果の裏run数は高々Kであり、逆に各裏runを一回反転すればその向き列を高々K操作で作れる。空を許す2K+1個の交互phase分割はこの全向き列を表す。prefixへカードを追加する際、以前の最後のphase hから任意のj≥hへ進み、その間を空にした分割を選べる。従ってprefix最大値から面値を加える遷移は全分割を網羅し、カードごとに一度だけ得点を加える。空prefixの全phase初期値0からの帰納と最終全phaseの最大値で最適得点が得られる。

## 実装上の注意

- phaseは0-basedで偶数が表、奇数が裏。初期dp[j]=0（全j）、各カードは旧配列のprefix maxからnextへ更新する。
- 最終phaseが表である必要はないので、全jの最大値を返す。得点は最大N·10^9、64 bit整数を使う。

## 復習の核

- 操作区間の列挙を、最終的な裏runの個数制約へ変える。両方向の実現可能性を示してからDPへ進む。
- 空phaseを許すなら、初期値とphaseを飛ばすprefix maximumを一組として覚える。

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
