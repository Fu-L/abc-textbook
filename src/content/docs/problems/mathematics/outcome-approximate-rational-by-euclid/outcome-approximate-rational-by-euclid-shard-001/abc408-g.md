---
title: "ABC408-G — A/B < p/q < C/D"
draft: true
authoringUnit: {"problemId":"abc408-g","docPath":"src/content/docs/problems/mathematics/outcome-approximate-rational-by-euclid/outcome-approximate-rational-by-euclid-shard-001/abc408-g.md","learningOutcomeIds":["outcome-approximate-rational-by-euclid"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。"],"tagIds":["tag-rational-approximation"],"sourceRevisionIds":["source-abc408-editorial-13160-f0bbad69a76239a83d4b9be0c4f4bf401ec4ac87d5f903c4c99db3dd24da480f","source-abc408-g-problem-bd7d0b7e294a989742d677343685b1f01aa8f28ed58c1a9ec4133fae8d4a6c6c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間の整数平行移動は分母を保つ。整数を含まない正規化区間では逆数を取り順序反転すると、最小分母の分数を連分数の次段へ移せる。最小分母q>1では二つの分子が入るならより小さい分母の間のfractionを作れて矛盾するので候補は一意。strict端点を保って再帰し分子分母をswapして戻せば最小qが得られる。","sourceRevisionIds":["source-abc408-editorial-13160-f0bbad69a76239a83d4b9be0c4f4bf401ec4ac87d5f903c4c99db3dd24da480f","source-abc408-g-problem-bd7d0b7e294a989742d677343685b1f01aa8f28ed58c1a9ec4133fae8d4a6c6c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [連分数・Stern–Brocotで有理近似する](src/content/docs/learn/number-theory/rational-approximation.md)

- Euclid互除法・連分数・Stern–Brocotの区間を使い、分母上限下の最良有理近似を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- Stern–Brocot木上の経路・祖先集合は「Stern–Brocot木の経路と祖先」で扱う。本Unitは分母制約の下で近似誤差を最小にする候補の選択を目的とする。

## 考察

最小分母 q>1 に対して区間内の分子 p は一意になる。二つの連続分子 p,p+1 が同じ q で入るなら、その間の p/(q-1) がより小さい分母で入って矛盾する。

両端から共通の整数部分 n=floor(A/B) を引く操作と、0<left<right≤1 で逆数を取り順序を反転する操作により、求める最簡分母 pair を Euclid algorithm と同様に再帰できる。

採用する候補: 開区間内で分母最小、q=1なら分子最小の pair f(A/B,C/D) を、整数部分除去と逆数・分子分母swapで求める

lower を [0,1) に正規化後、upper>1なら (1,1) が基底。upper≤1なら reciprocal interval を再帰し pair をswapする。連分数展開なので各 case 対数ステップで終わる。

棄却する候補: q=1,2,... と増やし、floor(Aq/B)+1 が Cq/D 未満かを調べる

答えの q 自体が 10^18 規模を超えて大きくなり得て、T=2×10^5 で分母を逐次探索できない。

区間を n だけ平行移動して再帰解が p/q なら、元の解は (p+nq)/q で分母を保つ。

0≤left<right≤1 では逆数で 1/right<q/p<1/left となり、再帰解の分子・分母を交換すれば元区間の pair へ戻る。これは連分数の一段に相当する。

各 testcase で n=floor(A/B) を取り両端から n を引く。正規化後の上端が1より大きければ pair=(1,1)、そうでなければ端点を逆数にして f(D/C,B/A) を再帰し pair をswapする。戻りながら p+=nq とし q を出力する。

## 典型の発動条件

### 連分数／Euclid 再帰

発動条件: 二有理数の間にある分母最小の有理数を求めるとき。

共通整数部分を除き、(0,1] 区間では逆数を取って分子分母の役割を交換する。

### fractional linear transformation

発動条件: 有理数区間の最適 pair を整数平行移動や逆数で小さい同型問題へ移したいとき。

pair (p,q) を移動で (p+nq,q)、逆数で (q,p) に写す。

## 問題固有の要素

厳密不等号の開区間でも、最小分母 pair の一意性と連分数変換を保ったまま直接求められる。

別の問題へ持ち帰る視点: 分母を外側から探索せず、区間両端の共通連分数 prefix を剥がして最初に分岐する位置で最小 pair を決める。

## 正当性

区間の整数平行移動は分母を保つ。整数を含まない正規化区間では逆数を取り順序反転すると、最小分母の分数を連分数の次段へ移せる。最小分母q>1では二つの分子が入るならより小さい分母の間のfractionを作れて矛盾するので候補は一意。strict端点を保って再帰し分子分母をswapして戻せば最小qが得られる。

## 実装上の注意

- 積による大小比較と p+nq は 128 bit または多倍長を使う。整数端点・strict inequality、正規化後lower=0で逆数上端が∞になる場合を sentinel または個別分岐で扱う。

## 復習の核

- 区間内に整数がある場合、上端が整数ちょうど、lower=0相当へ正規化される場合、Farey 隣接な端点を小さい q の全探索と比較する。

## 計算量と制約

### 時間

各case O(log V)、V=max(A,B,C,D)。連分数型Euclid再帰。

### 空間

O(log V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 2\times 10^5; 1\le A,B,C,D\le 10^{18}; \displaystyle\frac AB < \frac CD; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/editorial/13160) — source-abc408-editorial-13160-f0bbad69a76239a83d4b9be0c4f4bf401ec4ac87d5f903c4c99db3dd24da480f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc408/tasks/abc408_g) — source-abc408-g-problem-bd7d0b7e294a989742d677343685b1f01aa8f28ed58c1a9ec4133fae8d4a6c6c
