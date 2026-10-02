---
title: "ABC388-F — Dangerous Sugoroku"
draft: true
authoringUnit: {"problemId":"abc388-f","docPath":"src/content/docs/problems/mathematics/outcome-bound-reachability-in-numerical-semigroup/outcome-bound-reachability-in-numerical-semigroup-shard-001/abc388-f.md","learningOutcomeIds":["outcome-bound-reachability-in-numerical-semigroup"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-gcd-diophantine"],"excludedTopics":["負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。"],"tagIds":["tag-numerical-semigroup","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc388-editorial-11910-44c135f6f2bb0c5394307649d28958752d8dc1dfbb0d91533670c8a14ce272d5","source-abc388-f-problem-4a77b90240fbb5b9a0c466ac85f65c4fcbfd5d55efb81144da0bee3978cb3698"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"外部との一歩接続は幅B以内なのでsafe区間のhead/tailだけ保持すれば必要接続を全て残せる。同区間内の二点は距離がstep和なら単調に進んで安全で、長距離は連続step B−1,Bによる表現可能性から一括判定できる。boundary graphの各辺は実経路で実現可能、実経路も境界を通る順へ縮約できるので到達可能性が一致する。","sourceRevisionIds":["source-abc388-editorial-11910-44c135f6f2bb0c5394307649d28958752d8dc1dfbb0d91533670c8a14ce272d5","source-abc388-f-problem-4a77b90240fbb5b9a0c466ac85f65c4fcbfd5d55efb81144da0bee3978cb3698"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [数値半群のconductor以後を一括到達とみなす](src/content/docs/learn/number-theory/numerical-semigroup-reachability.md)

- 正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)

対象外:

- 負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。

## 考察

Nは10^12だがstep幅B≤20、bad intervalは互いに離れM≤2×10^4である。長い安全区間の内部を一cellずつDPする必要はなく、各安全区間の先頭・末尾B点だけが次の障害越えに影響する。

A<BならB-1とBを作れるため、十分大きい距離wは常にstep和で表せる。小距離だけ到達可能性を前計算すれば、障害のない長区間をO(1)で飛ばせる。

採用する候補: 各安全区間の両端B点だけを圧縮DPし、障害なし距離の可到達表で内部を接続する

保持点はO(MB)、各区間境界の遷移はO(B²)で、巨大Nに依存せずO(MB²+B³)で判定できる。

棄却する候補: 1..Nの各cellについて到達可能DPをする

Nが10^12で配列も逐次走査も不可能である。

bad interval間の安全区間I_i=[S_i,T_i]ごとに先頭X_iと末尾Y_iを最大B点だけ保持すれば、外部からの一歩は必ずその境界帯へ着地する。

A=Bは移動先が1 mod Aに固定される別caseであり、Nの合同とbad interval内の同合同cell存在だけを確認する。

A=Bなら合同条件をO(M)検査する。A<Bなら小距離のstep和可否をDPし、各safe intervalのhead/tail B座標を作る。座標順に、直前B距離のedgeと同一区間head→tailの複数歩可否でreachableを伝播し、Nを判定する。

## 典型の発動条件

### 巨大座標DPの境界圧縮

発動条件: 障害が区間で与えられ、遷移幅が小さいとき。

各安全componentの先頭・末尾だけを状態に残す。

### 数値半群の十分大距離到達性

発動条件: 互いに近い二step長を任意回使うとき。

B-1,Bを使えることからFrobenius型の閾値以上を一括Yesにする。

## 問題固有の要素

安全区間の内部は均質なので、次のbad intervalを跨ぐための入口・出口だけが情報を持ち、長さそのものはstep和可否へ集約される。

別の問題へ持ち帰る視点: 巨大line上の疎な障害では、局所遷移幅ぶんのboundary stateと均質区間のtransferを組み合わせる。

## 正当性

外部との一歩接続は幅B以内なのでsafe区間のhead/tailだけ保持すれば必要接続を全て残せる。同区間内の二点は距離がstep和なら単調に進んで安全で、長距離は連続step B−1,Bによる表現可能性から一括判定できる。boundary graphの各辺は実経路で実現可能、実経路も境界を通る順へ縮約できるので到達可能性が一致する。

## 実装上の注意

- safe intervalがB未満ならheadとtailが重複するので座標を重複管理しない。A=Bを先に分岐し、N自身と1をbad扱いしない入力条件を使う。

## 復習の核

- Nを数百へ縮めたrandom disjoint bad intervalsで全cell DPと比較し、A=B、短いsafe interval、閾値直前/直後の距離を重点検証する。

## 計算量と制約

### 時間

O(MB²+B³)を上界とする。step距離の小DPと各safe区間の境界band遷移。A=BならO(M)。

### 空間

O(MB+B²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^{12}; 0 \leq M \leq 2 \times 10^4; 1 \leq A \leq B \leq 20; 1 < L_i \leq R_i < N \ (1 \leq i \leq M); R_i < L_{i+1} \ (1 \leq i \leq M - 1); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/editorial/11910) — source-abc388-editorial-11910-44c135f6f2bb0c5394307649d28958752d8dc1dfbb0d91533670c8a14ce272d5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/tasks/abc388_f) — source-abc388-f-problem-4a77b90240fbb5b9a0c466ac85f65c4fcbfd5d55efb81144da0bee3978cb3698
