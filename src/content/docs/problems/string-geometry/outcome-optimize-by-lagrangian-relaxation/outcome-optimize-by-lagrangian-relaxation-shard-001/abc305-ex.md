---
title: "ABC305-EX — Shojin"
draft: true
authoringUnit: {"problemId":"abc305-ex","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc305-ex.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-dp-prefix-partition","unit-greedy-exchange"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-dp-prefix-partition","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc305-ex-problem-730ae4f7996eba3782f92a13c6c00df6cb84ff2c25a18bfbe74bb063308496d2","source-abc305-editorial-6534-00b45bdb795c412a311d2d938a469f5c2f7c15e05d5c7d698c7b7da52d6e2d54"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"隣接交換により比B/(A−1)順が各日の最小疲労を与え、A=1の問題はどの分割でも固定和B_0を加えるだけなので除去できる。追加限界費用の単調性から区間費用はMongeで、最小疲労の列d(k)は離散凸となる。長さがLを超える区間や費用X'超の区間を除いても予算内の分割は全て残る。削除後の費用列全体の凸性は仮定せず、予算線以下の元の凸列が一致することを使う。penalty付きprefix DPは削除後の凸包の支持線G(p)を正確に求め、予算線との交点を変えないため、比の最大値を切り上げると最小の実現可能日数Dとなる。整数費用の隣接傾きにより整数pだけで足り、日数を少ない方へtie-breakしたoracleの最初のD以下の支持線はDも支持する。そのためG(p)−pDがD日での最小疲労となり、除いたB_0を戻して両出力を得る。","sourceRevisionIds":["source-abc305-ex-problem-730ae4f7996eba3782f92a13c6c00df6cb84ff2c25a18bfbe74bb063308496d2","source-abc305-editorial-6534-00b45bdb795c412a311d2d938a469f5c2f7c15e05d5c7d698c7b7da52d6e2d54"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Lagrangian relaxation・Aliens trick](src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md) — 差分/導関数の単調性または単峰性を証明し、連続解近傍・ternary search・整数境界で最適点を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md) — DPの最小十分状態で得た考え方と実装を再利用し、prefix分割DPの発動条件・正当化・境界を重複なく学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

## 考察

一日の集合を固定する。二問を順に解くと疲労の差はB_1(A_2−1)−B_2(A_1−1)なので、A>1の問題をB/(A−1)昇順に並べれば最小となる。A=1の問題は最後に置け、どの日へ割り当てても全日合計へBだけを加える。まずそれらを除いてBの総和B_0を記録し、残りを元順序で圧縮し、予算をX'=X−B_0とする。残りn=0なら答えは一日、疲労B_0である。

残った全A_i≥2についてc(l,r)を区間(l,r]を一日で解く最小疲労とする。集合へ一問を追加する増分は、挿入位置の前の疲労b、後ろの合成倍率cを使ってc((A_i−1)b+B_i)と書ける。集合が増えるとb,cは減らないので限界費用は増大する。これから区間費用のMonge性、日数別最小疲労d(k)の離散凸性が得られる。全日数のDPを持つ代わりに支持線を問い合わせる。

まず各終点rの直前L=1+⌊log₂X'⌋問だけを候補にすればよい。m問の最小疲労は少なくとも2^{m−1}なので、もっと長い区間は予算を超える。各rについて左端を一つずつ伸ばし、比B/(A−1)順の平衡二分探索木へ問題を挿入する。各部分木にaffine合成αx+βを保持すれば、根のβがc(l,r)となる。α,βはX'+1へ飽和させ、β>X'の辺は候補から除く。全候補費用をO(nL log(L+1))で一度だけ作る。

penalty pを付けたDPはdp[0]=(0,0)、dp[r]=min_l(dp[l]+(c(l,r)+p,1))。同じpenalty込み費用なら日数が少ない方を選ぶ。一回のoracleは各終点から高々L辺を調べるO(nL)。残した辺だけでの最小疲労をd̃(k)とすると、返す値はG(p)=min_k(d̃(k)+pk)と、その最小日数である。辺を削るとd̃全体の凸性は保証されない。しかし費用≤X'の分割を失わず、その範囲ではd̃(k)=d(k)なので、凸包と予算線の交点は変わらない。

第一の出力Dは

D=⌈max_{p∈{1,…,X'}} (G(p)−X')/p⌉

で求まる。凸性による支持線の下界はDへ一致し、整数費用の傾きなので整数pで十分。予算内の一問ずつの分割があり、p>X'を加えてもこの切上げ値は改善しない。比は単峰なので整数三分探索し、最後の短い区間を全列挙する。比較は浮動小数ではなくcross productで行う。最大の比が負ならDを1以上へ切り上げる。

第二の出力を忘れてはいけない。p∈[0,X']で、oracleの最小日数がD以下になる最初のpを二分探索する。予算内のd(D)とその右側は元の凸列に一致し、Dもこの境界の支持線上にあるため、oracleがtieでDを飛び越してもd(D)=G(p)−pDで復元できる。元の疲労はd(D)+B_0。p=0で既に日数がD以下の場合も同じ式を使える。

## 典型の発動条件

### 隣接交換による最適順序

発動条件: operationsの順序だけを変えられ、二操作の前後比較からscalar keyを導けるとき。

B_p(A_q−1)とB_q(A_p−1)をcross multiplyし、B/(A−1)順で一日分のaffine transformsを合成する。

### Monge分割DPとAliens trick

発動条件: segment partition costがquadrangle inequalityを満たし、最適costをsegment数制約と同時に求めたいとき。

segment数へpenaltyを付けたunconstrained DPをoracleとし、convex dualから必要daysと元costを復元する。

## 問題固有の要素

求めるのはcost≤Xの最小DとそのDでのd(D)なので、convex sequence dそのものを全列挙せずsupporting-line queriesから交点を特定する。

別の問題へ持ち帰る視点: 個数別最適値がconvexなら、budgetとの最初の交点をLagrangian oracleの傾き情報から探せる。

## 正当性

隣接交換により比B/(A−1)順が各日の最小疲労を与え、A=1の問題はどの分割でも固定和B_0を加えるだけなので除去できる。追加限界費用の単調性から区間費用はMongeで、最小疲労の列d(k)は離散凸となる。長さがLを超える区間や費用X'超の区間を除いても予算内の分割は全て残る。削除後の費用列全体の凸性は仮定せず、予算線以下の元の凸列が一致することを使う。penalty付きprefix DPは削除後の凸包の支持線G(p)を正確に求め、予算線との交点を変えないため、比の最大値を切り上げると最小の実現可能日数Dとなる。整数費用の隣接傾きにより整数pだけで足り、日数を少ない方へtie-breakしたoracleの最初のD以下の支持線はDも支持する。そのためG(p)−pDがD日での最小疲労となり、除いたB_0を戻して両出力を得る。

## 実装上の注意

- 比の比較はB_i(A_j−1)のcross product。飽和させるのは非負のaffine合成であり、penalty込みDP値や比の比較までX'へ切り捨てない。
- 候補費用は一度作って全oracleで共有する。木の順序が同じ比なら元indexで区別し、同じkeyの問題を消さない。
- oracleは費用と日数のpairを比較し、同費用では少ない日数。第二出力はoracleの選んだ日数の費用ではなくG(p)−pD。
- A=1を全て除いた場合はlog X'を計算する前に一日・固定和を返す。

## 復習の核

- 区間内を並べ替えられるcostは、まず二要素交換でcanonical orderとset functionの性質を導く。
- 分割数ごとの最適値が凸なら、個数を直接DP dimensionにせずpenalty付き最適化のdualを見る。

## 計算量と制約

### 時間

O(N+nL log(L+1)+nL log(X'+1))、L=1+⌊log₂X'⌋。前処理後の各oracleはO(nL)、整数三分探索と二分探索は合計O(log(X'+1))回なので、全体はO(N log²(X+1))。X≤10^8よりL≤27。

### 空間

O(N+nL)。高々nL個の区間費用を事前に保存し、DPはO(n)。元のN²区間表を作らない。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq X \leq 10^8; 1 \leq A_i \leq 10^5; 1 \leq B_i; \sum_{i=1}^N B_i \leq X; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/tasks/abc305_h) — source-abc305-ex-problem-730ae4f7996eba3782f92a13c6c00df6cb84ff2c25a18bfbe74bb063308496d2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc305/editorial/6534) — source-abc305-editorial-6534-00b45bdb795c412a311d2d938a469f5c2f7c15e05d5c7d698c7b7da52d6e2d54
