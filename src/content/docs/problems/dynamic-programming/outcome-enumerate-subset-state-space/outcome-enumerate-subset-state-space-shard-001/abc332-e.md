---
title: "ABC332-E — Lucky bag"
draft: true
authoringUnit: {"problemId":"abc332-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc332-e.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc332-e-problem-8bb165a60ca59abbe8085534c31611759b62aed863af2ee2364d279f1508dd30","source-abc332-editorial-7904-577d9356dd1beb3d48672fa28ad733c35d8de85c7bb8b4e3a79dc139bb6dacc8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"平均μは全袋で固定。袋の集合Tのcost=(sumT−μ)²を加算すると分散のD倍になる。最後の袋Tを切り出すことで全partitionを覆い、同mask袋数では最小costだけが将来に優越する。empty袋は問題条件に合わせてsubmask0も扱う。","sourceRevisionIds":["source-abc332-e-problem-8bb165a60ca59abbe8085534c31611759b62aed863af2ee2364d279f1508dd30","source-abc332-editorial-7904-577d9356dd1beb3d48672fa28ad733c35d8de85c7bb8b4e3a79dc139bb6dacc8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

全袋の平均μ=(ΣW_i)/Dは分け方によらないため、目的は各袋の重さxにcost (x-μ)^2を付けてD個のgroupへ全itemを分割することになる。N≤15はsubset DPを示唆する。 空袋も許されるので、最後の袋へ割り当てるsubset Tには空集合も含めれば、ちょうどD袋という条件を同じ遷移で表せる。 各subsetのweight sumとcostを先に計算すれば、遷移は加算とminだけになる。全Sに対する部分集合Tの総数はΣ_S2^{|S|}=3^Nである。 分散そのものを逐次更新せず、固定平均μからの偏差平方和を最小化して最後にDで割ればよい。

採用する候補: dp[k][S]をSをk袋へ分けた偏差平方和の最小値とするsubset partition DP

最後の1袋Tを切り出す遷移で全分割を覆い、全mask・submaskのO(D3^N)がN≤15に適合する。

棄却する候補: 重いitemから現在最軽量の袋へgreedyに入れる

多分割の平方誤差最小化では局所的な均衡化が将来の組合せを拘束し、最適性を保証できない。

棄却する候補: 袋ラベルごとに全割当D^Nを列挙する

D,Nが15のとき膨大で、袋の順序対称性も無駄に重複する。

各subsetのweight sumとcostを先に計算すれば、遷移は加算とminだけになる。全Sに対する部分集合Tの総数はΣ_S2^{|S|}=3^Nである。

分散そのものを逐次更新せず、固定平均μからの偏差平方和を最小化して最後にDで割ればよい。

全maskのsum[mask]とcost[mask]=(sum[mask]-μ)^2を前計算する。dp[1][S]=cost[S]から始め、k=2..DでSの全submask Tを列挙してdp[k-1][S\T]+cost[T]の最小を取る。答えはdp[D][all]/D。

## 典型の発動条件

### subset partition DP

発動条件: Nが15程度で、集合を少数groupへ分けた加法的costを最小化するとき。

最後のgroupをsubmaskとして切り出し、残りの最適解へ接続する。

### 部分集合の部分集合はO(3^N)

発動条件: 全maskそれぞれについて全submaskを列挙する遷移が現れたとき。

各要素の非S・S\T・Tという3状態で遷移総数を数える。

## 問題固有の要素

平均が分割によらず固定されるため、袋ごとのcostが独立なsubset関数になり、分散最小化を通常の加法的集合分割へ変えられる。

別の問題へ持ち帰る視点: 分散や二乗誤差では、平均・総和が決定済みかを最初に確認すると相互依存を分離できる。

## 正当性

平均μは全袋で固定。袋の集合Tのcost=(sumT−μ)²を加算すると分散のD倍になる。最後の袋Tを切り出すことで全partitionを覆い、同mask袋数では最小costだけが将来に優越する。empty袋は問題条件に合わせてsubmask0も扱う。

## 実装上の注意

- 空袋を許すためT=0も遷移に含める。INFと平方値は十分広い浮動小数型で持ち、出力桁数を確保する。

## 復習の核

- 全itemが同重、D=N、最適解に空袋が入る小ケースをD^N全探索と比較し、T=0と最後のD除算を確認する。

## 計算量と制約

### 時間

N重み、袋D。subset sum O(N2^N)またはbit recurrence O(2^N)、submask DP O(D3^N)。

### 空間

rolling袋数DP O(2^N)、cost/sum O(2^N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq D\leq N\leq 15; 1 \leq W_i\leq 10^8; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc332/tasks/abc332_e) — source-abc332-e-problem-8bb165a60ca59abbe8085534c31611759b62aed863af2ee2364d279f1508dd30
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc332/editorial/7904) — source-abc332-editorial-7904-577d9356dd1beb3d48672fa28ad733c35d8de85c7bb8b4e3a79dc139bb6dacc8
