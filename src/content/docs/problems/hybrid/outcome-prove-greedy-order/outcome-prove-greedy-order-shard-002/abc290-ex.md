---
title: "ABC290-EX — Bow Meow Optimization"
draft: true
authoringUnit: {"problemId":"abc290-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc290-ex.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-resource"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-knapsack-resource"],"sourceRevisionIds":["source-abc290-editorial-5769-af1ef8e27fc3523ef9c273dc56ead5943390dfeba6f55f04302c6650407ccb2d","source-abc290-ex-problem-a29b268f9fcb6fef3dc807abeffbc5b02d4686294356e60cfb3d6a59ecc855b3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"中央順位の犬猫の間の個体を外へ移す交換と、中央へ向かう係数逆転を直す交換はいずれも費用を増やさない。従って中央個体の除去後は犬猫を半数ずつ持つ昇順二列への割当を調べれば十分である。除去時に中央個体自身と残る反対種族の偏りの変化を足した額が偶奇表のCになる。DPは係数昇順に各個体の左右配置を全て試し、配置時に確定する反対種族の左右個数から正しい偏り費用を足す。初期値から指定半数の終状態までの最小値にCを加えると元の最適費用になる。","sourceRevisionIds":["source-abc290-editorial-5769-af1ef8e27fc3523ef9c273dc56ead5943390dfeba6f55f04302c6650407ccb2d","source-abc290-ex-problem-a29b268f9fcb6fef3dc807abeffbc5b02d4686294356e60cfb3d6a59ecc855b3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

対象外:

- 対称操作による状態の正規化。

## 考察

全動物の順列を探すと最大600匹を扱えない。まず位置ごとの偏りと係数を分離し、交換で最適列の形を絞る。

犬・猫の中央順位の個体の間に他の個体があれば、間の犬を中央の猫の外側へ、間の猫を中央の犬の外側へ移せる。移した個体の偏りは減り、残る個体の偏りは増えない。この操作で、奇数の種族は一匹の中央個体、偶数の種族は左右半分の境界が同じ中央付近に揃う。両種族偶数なら左右に犬N/2匹・猫M/2匹ずつを置く形にできる。

同種族内では偏りの小さい位置に大係数を割り当てる。中央へ向かう片側で、外側の係数uが内側の係数vより大きい逆転を考える。犬猫を交換すると外側個体の偏りは2減り、内側個体の偏りは2増えるため、費用差は2(v−u)≤0。同種族の隣接交換では偏りが変わらない。従って各側を中央へ向かって係数昇順にしてよい。

奇数の種族があれば、その最大係数の個体を中央から除いて両種族を偶数にする。原配列をA,Bとして、前処理の加算額Cは次の通り。

| Nの偶奇 | Mの偶奇 | 除く個体 | 加算額C |
| --- | --- | --- | --- |
| 偶 | 偶 | なし | 0 |
| 奇 | 偶 | 最大係数の犬 | ΣB |
| 偶 | 奇 | 最大係数の猫 | ΣA |
| 奇 | 奇 | 最大係数の犬と猫 | ΣA+ΣB |

一方だけ奇数なら中央個体の偏りは0。その個体を除くと反対種族の全個体の偏りが1減るので、反対種族の係数和を加える。両方奇数では中央の犬猫が隣接し、両者の偏りは1。残る全個体も反対種族の中央個体を除くことで偏りが1減るので、加算額は全係数和になる。犬猫が一匹ずつ、係数2,3ならC=5で、後続の空DPは0を返す。

残る犬猫数をn,mとする。残る全個体を係数昇順に並べ、左から中央へ伸ばす列Pか、右から中央へ伸ばす列Qへ一匹ずつ置く。完成列はPと反転したQの連結である。

dp_i[j][k]を、i匹処理済みでPに犬j匹・猫k匹を置いたときの最小費用とする。処理済みの犬猫数をd,eとすれば、Qの個数はd−j,e−k。両側で犬n/2匹・猫m/2匹を超える状態を許さない。初期値はdp_0[0][0]=0、その他∞。

次の係数をwとすると、遷移は以下になる。どれも配置先の上限を満たすときだけchminする。

| 種族・配置先 | 遷移先 | 加算費用 |
| --- | --- | --- |
| 犬・P | (j+1,k) | w(m−2k) |
| 犬・Q | (j,k) | w(m−2(e−k)) |
| 猫・P | (j,k+1) | w(n−2j) |
| 猫・Q | (j,k) | w(n−2(d−j)) |

例えばPへ犬を置くと、その左の猫は既配置のk匹、右の猫は残りm−k匹なので偏りはm−2k。ほかの式も同様である。回答はC+dp_{n+m}[n/2][m/2]。n=0やm=0でも同じ式で扱える。

## 典型の発動条件

### 並べ替え不等式と交換論

発動条件: 位置ごとの偏りが中央から単調に増える。

大係数を小偏りへ寄せ、中央へ向かう係数順を正規化する。

### 個数制約付き割当DP

発動条件: 係数順に要素を二群へ配り、各群の種別個数が指定される。

dp[i][dogP][catP]で左右どちらへ置くかを選ぶ。

## 問題固有の要素

種族ごとの中央値の位置関係を先に固定すると、複雑な混合順列が「昇順列P＋反転列Q」という二群割当に縮む。

別の問題へ持ち帰る視点: 順列最適化では交換で標準形を示してから、残る割当だけをDPする。

## 正当性

中央順位の犬猫の間の個体を外へ移す交換と、中央へ向かう係数逆転を直す交換はいずれも費用を増やさない。従って中央個体の除去後は犬猫を半数ずつ持つ昇順二列への割当を調べれば十分である。除去時に中央個体自身と残る反対種族の偏りの変化を足した額が偶奇表のCになる。DPは係数昇順に各個体の左右配置を全て試し、配置時に確定する反対種族の左右個数から正しい偏り費用を足す。初期値から指定半数の終状態までの最小値にCを加えると元の最適費用になる。

## 実装上の注意

- 偶奇表の係数和は除去前の原配列で定義する。
- 左右両方の個数上限を確認し、不可能状態から遷移しない。
- 係数・費用と∞は64ビット整数。N,Mは原問題の犬猫数であり、全動物数と混同しない。

## 復習の核

- 小規模の全順列と比較し、各偶奇組合せ、同じ係数、中央の最大係数を除く前処理を検査する。

## 計算量と制約

### 時間

残る犬猫数n,mに対しsort O((n+m)log(n+m))、DP O((n+m)(n/2+1)(m/2+1))。最大n=m=300なら約1370万状態、各状態は定数回の遷移で、公式のO(NM(N+M))解法に対応する。

### 空間

走査位置iを二層にrollingしてO((n/2+1)(m/2+1))。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N,M \leq 300; 1\leq A_i,B_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/editorial/5769) — source-abc290-editorial-5769-af1ef8e27fc3523ef9c273dc56ead5943390dfeba6f55f04302c6650407ccb2d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc290/tasks/abc290_h) — source-abc290-ex-problem-a29b268f9fcb6fef3dc807abeffbc5b02d4686294356e60cfb3d6a59ecc855b3
