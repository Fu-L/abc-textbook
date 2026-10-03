---
title: "ABC388-F — Dangerous Sugoroku"
draft: true
authoringUnit: {"problemId":"abc388-f","docPath":"src/content/docs/problems/mathematics/outcome-bound-reachability-in-numerical-semigroup/outcome-bound-reachability-in-numerical-semigroup-shard-001/abc388-f.md","learningOutcomeIds":["outcome-bound-reachability-in-numerical-semigroup"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-gcd-diophantine"],"excludedTopics":["負の係数も許す整数線形結合のgcd可解性だけを判定する問題、および使用回数に上限がある有限knapsack。"],"tagIds":["tag-numerical-semigroup","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc388-editorial-11910-44c135f6f2bb0c5394307649d28958752d8dc1dfbb0d91533670c8a14ce272d5","source-abc388-f-problem-4a77b90240fbb5b9a0c466ac85f65c4fcbfd5d55efb81144da0bee3978cb3698"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"A=B の場合は到達点が 1 mod A に固定される。N の合同条件を満たし、各禁止区間 [L_i,R_i] に最初の同合同点 1+A⌈(L_i−1)/A⌉ が存在しなければ到達できる。\n\nA<B の場合、B−1 と B はともに使える。D=(B−1)(B−2) と置く。d≥D を d=q(B−1)+r、0≤r<B−1 と書くと q≥B−2≥r なので、d=(q−r)(B−1)+rB と表せる。従って D 以上はすべて到達可能な距離である。0≤d<D は reach[0]=true とし、A..B の step を使う通常の到達 DP で正確に求める。B=2 では D=0 で全非負距離が可能となる。\n\n各安全区間の先頭・末尾 B 点を保持する。区間外との一歩は長さ B 以下なので、進入・脱出は必ずこの境界帯を通る。同じ安全区間の head から tail への距離が reach で可能なら、正の step による実経路は両端の間に収まり安全である。保持点間の距離 A..B の一歩も元の操作そのものなので、圧縮 graph の各辺は実現できる。\n\n逆に実経路を安全区間への進入から脱出までで分割する。境界帯の外に出る部分だけを head→tail の距離判定へまとめ、それ以外の一歩を保持すると圧縮経路になる。短い安全区間を一歩で複数飛び越す場合も、全保持点間の一歩を残すので失わない。よって圧縮 graph と元の到達可能性は一致する。","sourceRevisionIds":["source-abc388-editorial-11910-44c135f6f2bb0c5394307649d28958752d8dc1dfbb0d91533670c8a14ce272d5","source-abc388-f-problem-4a77b90240fbb5b9a0c466ac85f65c4fcbfd5d55efb81144da0bee3978cb3698"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

保持点はO((M+1)B)、各区間境界の遷移はO(B²)で、巨大Nに依存せずO((M+1)B²+B³)で判定できる。

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

A=B の場合は到達点が 1 mod A に固定される。N の合同条件を満たし、各禁止区間 [L_i,R_i] に最初の同合同点 1+A⌈(L_i−1)/A⌉ が存在しなければ到達できる。

A<B の場合、B−1 と B はともに使える。D=(B−1)(B−2) と置く。d≥D を d=q(B−1)+r、0≤r<B−1 と書くと q≥B−2≥r なので、d=(q−r)(B−1)+rB と表せる。従って D 以上はすべて到達可能な距離である。0≤d<D は reach[0]=true とし、A..B の step を使う通常の到達 DP で正確に求める。B=2 では D=0 で全非負距離が可能となる。

各安全区間の先頭・末尾 B 点を保持する。区間外との一歩は長さ B 以下なので、進入・脱出は必ずこの境界帯を通る。同じ安全区間の head から tail への距離が reach で可能なら、正の step による実経路は両端の間に収まり安全である。保持点間の距離 A..B の一歩も元の操作そのものなので、圧縮 graph の各辺は実現できる。

逆に実経路を安全区間への進入から脱出までで分割する。境界帯の外に出る部分だけを head→tail の距離判定へまとめ、それ以外の一歩を保持すると圧縮経路になる。短い安全区間を一歩で複数飛び越す場合も、全保持点間の一歩を残すので失わない。よって圧縮 graph と元の到達可能性は一致する。

## 実装上の注意

- 小距離 DP の閾値は D=(B−1)(B−2)。負距離は不可、距離 0 は可能、D 以上は可能とする。
- 各安全区間の head/tail の重複座標を統合する。座標 1 を true にして座標順に処理する。
- 一歩の辺は同一区間や隣接区間に限定せず、距離 A..B の全保持点間に張る。head→tail は同じ安全区間内の前向き pair だけ。
- A=B は合同条件で別処理する。禁止区間の端点と N は 64 bit 整数で持つ。

## 復習の核

- Nを数百へ縮めたrandom disjoint bad intervalsで全cell DPと比較し、A=B、短いsafe interval、閾値直前/直後の距離を重点検証する。

## 計算量と制約

### 時間

A=B は O(M)。A<B は小距離 DP が O(B³)、保持点数 O((M+1)B)。各保持点の B 距離内にある整数座標は高々 B 個で、一歩の列挙は O((M+1)B²)。各安全区間の head/tail pair も O(B²)。全体 O((M+1)B²+B³)。

### 空間

保持点と到達配列 O((M+1)B)、小距離表 O(B²)。辺は明示保存せず伝播でき、合計 O((M+1)B+B²)。

### 制約との対応

N≤10^12 でも B≤20 と禁止区間数にだけ依存する。M=0 の場合にも一つの安全区間を処理する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/editorial/11910) — source-abc388-editorial-11910-44c135f6f2bb0c5394307649d28958752d8dc1dfbb0d91533670c8a14ce272d5
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc388/tasks/abc388_f) — source-abc388-f-problem-4a77b90240fbb5b9a0c466ac85f65c4fcbfd5d55efb81144da0bee3978cb3698
