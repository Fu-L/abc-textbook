---
title: "ABC458-G — Children Yearn for the Evil Kindergarten"
draft: true
authoringUnit: {"problemId":"abc458-g","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc458-g.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-monotone-search"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc458-editorial-20460-e7a773e046a413de8fde9c92430ead7c8be1da0c945dda54fa45a64f9d7646e0","source-abc458-g-problem-daae3589eb6dc548e2acfaefe7b95b81cff1f2ffe69465dc271f2fccdfe38cae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"脱出する人だけへ資源を再配分し、他者を初日に脱落させても脱出可能人数は減らない。固定mの収支g(x)=f(x)+A_i−B_i xと、脱出後の最大値max_{z≥x}(g(z)−C_i(z−x))は、各人に必要なメダルを配る元の操作と一致する。一次加算は凹列の傾き順を保ち、非負な整数位置は空または一つの整数区間となる。端の負線分を除いた後の床除算は、隣接線分上の非負な最後・最初の整数位置を正確に選び、その端の値も保存する。脱出段階はg(z)−C_i zが非減少となる左側の線分を削り、その最大点から傾きC_iで延長する操作であり、整数延長floor(v/C_i)と残りv−C_i kは全整数xで元の最大遷移に等しい。空domainは失敗、一点domainも同じ収支・延長式で扱え、0へ届いたときだけ成功する。対象人数を減らせば支出が減るので可否は単調で、初日の支払い上界の下で二分探索した最大成功人数が答えである。","sourceRevisionIds":["source-abc458-editorial-20460-e7a773e046a413de8fde9c92430ead7c8be1da0c945dda54fa45a64f9d7646e0","source-abc458-g-problem-daae3589eb6dc548e2acfaefe7b95b81cff1f2ffe69465dc271f2fccdfe38cae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

## 考察

全体で10^100人いても、最終的に脱出するm人だけを追えばよい。脱出しない人へ渡すメダルはそのm人へ回し、他の人には初日に何も渡さず脱落させると支出を増やさない。m人を脱出させる手順から一部の人を除けばB_iの支出も脱出費用も減るため、成功人数に対する可否は単調である。

固定mでは、日終了時に残る人数xごとの最大メダルf(x)を持つ。初期状態はf(m)=0だけ有限で、それ以外は到達不能。日iにまずg(x)=f(x)+A_i−B_i xを作り、g(x)<0の状態を捨てる。生き残るx人に各B_iを渡す必要十分条件がこの非負条件である。続いて元の人数zからx人を残す遷移は

f_new(x)=max_{z≥x}(g(z)−C_i(z−x))

の非負部分となる。残す人へ余剰を集め、脱出者へ各C_iを渡せば達成できる。x=0は全員脱出の成功を表し、余剰は脱出者へ渡してよい。成功した日で判定を終了する。

この式を全x,zで計算する素朴DPは遅い。gの傾きがxとともに非増加なら、g(z)−C_i zの最大点より左は傾きC_iの直線、右はgそのものになる。一次加算、非負部分への切断、この傾き制限が凹性を保つので、有限domainと整数の折点列を直接管理する。ここで必要なのは整数人数上の凹列であり、全実数上の有限凸関数を二heapで表す基本形に、domainと整数端点の管理を追加する。

### dequeの表現

xが厳密に増える点p=(x,y)をdeque Dに持ち、全体への一次加算をs,tに分ける。点の実際の値はval(p)=y+s x+t、隣接p,q間の実際の傾きは slope(p,q)=(q.y−p.y)/(q.x−p.x)+s。保存する線分の傾きは整数で、区間内の各整数xの値をこの線分から復元できる。domain外は−∞とする。初期D=[(m,0)],s=t=0は一点domainであり、両端が同じ場合に傾きを計算してはいけない。

以下のpushではnewPoint(x,v)=(x,v−s x−t)として実値vを保存する。毎日s←s−B_i,t←t+A_iとしてから、次の順で更新する。floor(v/d)の分子vは非負、分母dは正なので、ここでは通常の整数除算でよい。

```text
while Dが空でなく val(D.back)<0:
    q = D.pop_back()
    if Dが空: break
    p = D.back
    if val(p)<0: continue
    h = slope(p,q)                 # h<0
    k = floor(val(p)/(-h))
    if k>0: D.push_back(newPoint(p.x+k, val(p)+h*k))
    break

while Dが空でなく val(D.front)<0:
    p = D.pop_front()
    if Dが空: break
    q = D.front
    if val(q)<0: continue
    h = slope(p,q)                 # h>0
    k = floor(val(q)/h)
    if k>0: D.push_front(newPoint(q.x-k, val(q)-h*k))
    break

if Dが空: return false
while D.size>=2 and slope(D[0],D[1])>=C_i:
    D.pop_front()
p = D.front
k = min(p.x, floor(val(p)/C_i))
if k==p.x: return true             # x=0を合法に実現
if k>0: D.push_front(newPoint(p.x-k, val(p)-C_i*k))
```

右側切断は、非負点pから傾きh<0で進める最後の整数を選ぶ。左側切断も、非負点qから戻れる最大整数歩数を選ぶ。いずれも丸めた端点の実値を保存するので、次の日へ余りを引き継ぐ。k=0なら隣の点がそのまま端となり、同じ座標を二重挿入しない。

脱出段階ではg(z)−C_i zが増える傾き≥C_iの線分を左から除き、残る左端pを最大化する代表にする。等傾きの線分も右端で同じ値を作れるので除いてよい。左へ伸ばせる人数はfloor(val(p)/C_i)で、伸ばした端の値はval(p)−C_i kである。0まで届けば全員成功、それ以外はその整数端点を保存する。

例えばm=1、二日の(A,B,C)が(2,1,2),(2,3,1)なら、一日目のx=1で余剰1、脱出人数floor(1/2)=0。二日目は余剰0なので脱出できない。実数の交点x=0.5を状態として残すと偽の成功が起きるため、整数性は最終判定だけでなく毎日の更新に課す。

m=0は成功。m>0では初日に全m人へB_1が必要なので、成功側lo=0、失敗側hi=floor(A_1/B_1)+1とし、整数二分探索で最大成功mを得る。hi≤10^6+1であり、人数10^100を探索範囲に使う必要はない。

## 典型の発動条件

### 人数に対する可能性二分探索

発動条件: 対象人数を減らすと手順をそのまま流用できるresource配分問題のとき。

固定mの全員脱出可能性を単調predicateにする。

### slope trickによるconcave DP

発動条件: 一変数DPが区間domainとconcave折れ線を保ち、一次加算・max closureを繰り返すとき。

傾き変化点をdequeで管理して各breakpointを償却定数回処理する。

## 問題固有の要素

人数dimensionのDPを配列として走査せず、関数形のconcavityとbreakpoint列そのものをstateにできる。

別の問題へ持ち帰る視点: 遷移式を値更新ではなくグラフへの一次関数加算・切断・傾き制約として幾何的に読むとslope trickが見える。

## 正当性

脱出する人だけへ資源を再配分し、他者を初日に脱落させても脱出可能人数は減らない。固定mの収支g(x)=f(x)+A_i−B_i xと、脱出後の最大値max_{z≥x}(g(z)−C_i(z−x))は、各人に必要なメダルを配る元の操作と一致する。一次加算は凹列の傾き順を保ち、非負な整数位置は空または一つの整数区間となる。端の負線分を除いた後の床除算は、隣接線分上の非負な最後・最初の整数位置を正確に選び、その端の値も保存する。脱出段階はg(z)−C_i zが非減少となる左側の線分を削り、その最大点から傾きC_iで延長する操作であり、整数延長floor(v/C_i)と残りv−C_i kは全整数xで元の最大遷移に等しい。空domainは失敗、一点domainも同じ収支・延長式で扱え、0へ届いたときだけ成功する。対象人数を減らせば支出が減るので可否は単調で、初日の支払い上界の下で二分探索した最大成功人数が答えである。

## 実装上の注意

- 点の保存値yと実値y+s x+tを混同しない。trimと延長の新端点には、丸め後の残りメダルまで保存する。
- 隣接点のx差は正、y差はそのx差で割り切れる。D.size<2では傾きを参照しない。k=0は挿入しない。
- 凹列は傾きが左から右へ非増加。非負状態の切断を終えてから脱出処理をする。
- s,t,yおよび積s xには64bit整数を使う。x≤10^6、|s|≤3×10^11なのでマスクの積も3×10^17以下の規模になる。

## 復習の核

- 折れ線DPでは値だけでなく有限domain・初期一点・整数端点を状態として持つ。
- 床除算は「何人動けるか」を決め、余りは「次の日に使える資源」を決める。両方を保存する。
- 高速性は一日あたりの生成点数と全pop数から導く。

## 計算量と制約

### 時間

一判定O(N)。一日に右trim、左trim、脱出延長で各高々一点を挿入し、各点は高々一度popされるのでdeque処理は償却O(N)。U=floor(A_1/B_1)≤10^6として一case O(N log(U+2))、全caseはΣN≤3×10^5に対するこの和。

### 空間

O(N)。一判定で生成する点は高々1+3N個、入力列とdequeを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 3 \times 10^5; 1 \leq N \leq 3 \times 10^5; 1 \leq A_i \leq 10^6; 1 \leq B_i \leq 10^6; 1 \leq C_i \leq 10^6; The sum of N over all test cases is at most 3 \times 10^5.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/editorial/20460) — source-abc458-editorial-20460-e7a773e046a413de8fde9c92430ead7c8be1da0c945dda54fa45a64f9d7646e0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc458/tasks/abc458_g) — source-abc458-g-problem-daae3589eb6dc548e2acfaefe7b95b81cff1f2ffe69465dc271f2fccdfe38cae
