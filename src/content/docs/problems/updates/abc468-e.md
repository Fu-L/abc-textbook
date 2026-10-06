---
title: "ABC468 E — Sum of Average"
draft: true
authoringUnit: {"problemId":"abc468-e","docPath":"src/content/docs/problems/updates/abc468-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc468-e-problem-c7d6ff7764a3cb6b75f92bcefca91966433a27e702433f69ca97bbde743d855a","source-abc468-editorial-23476-32566941db6b816bb4cf5b70028f0ae488dec2cc2be57c29c483e77207a2b491"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各区間の平均を二つの累積和項に分けて有限和の順序を交換すると、B_iの正係数はH_i、負係数はH_{N−i}になる。従って各区間の寄与が一度ずつ同じ値で加算される。非零分母の逆元で割り算を表すことは有限体上でも成立する。","sourceRevisionIds":["source-abc468-e-problem-c7d6ff7764a3cb6b75f92bcefca91966433a27e702433f69ca97bbde743d855a","source-abc468-editorial-23476-32566941db6b816bb4cf5b70028f0ae488dec2cc2be57c29c483e77207a2b491"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

## 考察

全区間の平均を足すので、区間和は累積和B_i=Σ_{j≤i}A_jで O(1) にできる。ただし区間数は O(N²) で、分母の長さが違うから普通の区間和の総和にはならない。ここで平均を (B_r−B_{l−1})/(r−l+1) と分け、Bの各項の係数を集める。

H_0=0、H_i=Σ_{d=1}^i inv(d) と置く。右端がrの正の項はB_r H_r。左端がlの負の項はB_{l−1} H_{N−l+1}。添字をそろえると答えは Σ_{i=0}^N B_i(H_i−H_{N−i})。これなら線形個数の加算で済む。

法p=998244353は素数でN<pなので、1からNまでの逆元がすべて存在する。inv(1)=1、inv(i)=−floor(p/i) inv(p mod i) mod p の漸化式で全逆元を O(N) で作り、B,Hを前計算して最後に一度走査する。各分母へ個別に高速累乗すると O(N log p) となるので、ここでは逆元表を使う。

## 典型の発動条件

総和の中に同じ累積量が繰り返し現れたら、区間側の列挙から累積量側の係数計算へ移す。長さの逆数は調和数の累積和になる。

## 問題固有の要素

平均の分母は区間長なので、累積和を引いた後に長さ別の係数を整理する必要がある。

## 正当性

各区間の平均を二つの累積和項に分けて有限和の順序を交換すると、B_iの正係数はH_i、負係数はH_{N−i}になる。従って各区間の寄与が一度ずつ同じ値で加算される。非零分母の逆元で割り算を表すことは有限体上でも成立する。

## 実装上の注意

負の係数をmodで正規化する。i=0,Nの端点も式に含め、H_0=B_0=0とする。

## 復習の核

区間の平均を直接集めず、どの累積和が何回どの重みで現れるかを見る。

## 計算量と制約

### 時間

逆元・累積和・係数和を各一度計算して O(N)。

### 空間

逆元と累積和表に O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 5\times 10^5; 0\le A_i < 998244353; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc468/tasks/abc468_e)
- [公式解説](https://atcoder.jp/contests/abc468/editorial/23476)
