---
title: "ABC243-G — Sqrt"
draft: true
authoringUnit: {"problemId":"abc243-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-compress-dp-sufficient-aggregates/outcome-compress-dp-sufficient-aggregates-shard-001/abc243-g.md","learningOutcomeIds":["outcome-compress-dp-sufficient-aggregates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-integer-boundary-blocks"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc243-editorial-3510-390624bcb30e413c9c5a41a55f2872e9d60338300d004b539c551de1c561a5b1","source-abc243-g-problem-b11ec941d82d048180799a902b0fd591a98479641423b35d2b627222a5187a82"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"1へ到達すると以後の値は全て1なので、無限に長い列は有限の減少prefixで決まる。dp(1)=1、x>1ではdp(x)=Σ_{i≤floor√x}dp(i)。二段目の選択を入れ替えて和を数えると、第三値iを持つ第二値はi²からs=floor√xまでのs−i²+1個だからdp(x)=(s+1)Σ_{i≤r}dp(i)−Σ_{i≤r}i²dp(i)、r=floor√s。小さいdpと二つのprefix和だけで全質問を評価できる。x=1でも同式は1を返す。","sourceRevisionIds":["source-abc243-editorial-3510-390624bcb30e413c9c5a41a55f2872e9d60338300d004b539c551de1c561a5b1","source-abc243-g-problem-b11ec941d82d048180799a902b0fd591a98479641423b35d2b627222a5187a82"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 遷移式を属性別極値・少数の重み付き和へ分解し、その集計値が更新について閉じることを示せる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md) — floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

どの選択でも値は平方根以下へ落ち続け、1に着けば以後は1しか選べない。10^100回の長さではなく、1へ至る有限な prefix の選び方だけを数えればよい。

dp[x] を x から始まる種類数とすると dp[1]=1、x>1 で dp[x]=Σ_{i≤floor√x}dp[i] だが、X の平方根は約3×10^9で直接前計算できない。

採用する候補: 二手先 A_3=i を固定し、中間 A_2 の個数 floor√x-i²+1 を係数にして i≤floor fourth-root(x) だけを和にする。

一段多く遷移をまとめることで query の列挙範囲を四乗根へ縮め、さらに二種類の prefix sum で和を一括評価できる。

棄却する候補: dp[1..floor√X] を全て順に計算して dp[X] を求める。

X は9×10^18で平方根範囲が数十億になり、T=20に対して保持・走査できない。

A_3=i なら A_2 は i²≤A_2≤floor√x の任意値なので、dp[x]=Σ_{i≤floor fourth-root x}(floor√x-i²+1)dp[i] となる。

P0[r]=Σ_{i≤r}dp[i]、P2[r]=Σ_{i≤r}i²dp[i] を持てば、s=floor√x、r=floor√s に対して dp[x]=(s+1)P0[r]-P2[r] と評価できる。

全 query の最大 fourth-root まで dp[1]=1、dp[v]=P0[floor√v] を順に前計算し、P0,P2 を更新する。各 X は整数平方根 s と r を厳密に求め、(s+1)P0[r]-P2[r] を64 bitで出力する。

## 典型の発動条件

### 遷移を二段まとめる state-space 縮小

発動条件: 一段遷移先がまだ多いが、二段先を固定すると中間状態数を閉形式で数えられるとき。

中間選択の multiplicity を係数にして、より小さい二段先だけを列挙する。

### 重み付き prefix sum

発動条件: Σ(a-bi²)dp[i] のように係数が少数の基底へ分解できるとき。

Σdp と Σi²dp を別々に前計算して query の和を線形結合する。

## 問題固有の要素

平方根遷移を二回合成すると探索上限が X^{1/2} から X^{1/4} へ下がり、中間値 A_2 の範囲長が単純な係数になる。

別の問題へ持ち帰る視点: 単調に値が縮む recurrence では、複数 step を飛ばした遷移先数を数えて指数を半減できないか考える。

## 正当性

1へ到達すると以後の値は全て1なので、無限に長い列は有限の減少prefixで決まる。dp(1)=1、x>1ではdp(x)=Σ_{i≤floor√x}dp(i)。二段目の選択を入れ替えて和を数えると、第三値iを持つ第二値はi²からs=floor√xまでのs−i²+1個だからdp(x)=(s+1)Σ_{i≤r}dp(i)−Σ_{i≤r}i²dp(i)、r=floor√s。小さいdpと二つのprefix和だけで全質問を評価できる。x=1でも同式は1を返す。

## 実装上の注意

- 浮動小数の sqrt だけを信じず、候補を __int128 の平方比較で補正する。式の中間積も signed 64 bit 境界を意識して広い型で計算する。

## 復習の核

- X=16で A_3=1,2 ごとの A_2 候補を列挙し、係数 floor√X-i²+1 と答え5を対応させる。

## 計算量と制約

### 時間

前計算O(X_max^(1/4))、各質問O(1)の整数平方根と式評価。整数平方根を二分探索する場合はO(log X)も含める。

### 空間

O(X_max^(1/4))。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 20; 1 \leq X \leq 9\times 10^{18}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/editorial/3510) — source-abc243-editorial-3510-390624bcb30e413c9c5a41a55f2872e9d60338300d004b539c551de1c561a5b1
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc243/tasks/abc243_g) — source-abc243-g-problem-b11ec941d82d048180799a902b0fd591a98479641423b35d2b627222a5187a82
