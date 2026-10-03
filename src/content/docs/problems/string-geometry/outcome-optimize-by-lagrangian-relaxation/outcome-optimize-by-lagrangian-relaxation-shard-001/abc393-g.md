---
title: "ABC393-G — Unevenness"
draft: true
authoringUnit: {"problemId":"abc393-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc393-g.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-min-cost-flow","unit-rational-approximation","unit-weighted-shortest-path"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-min-cost-flow","tag-rational-approximation","tag-shortest-path"],"sourceRevisionIds":["source-abc393-editorial-12192-51ff1775a4a84d6ea3fa0c64dbec89b06500e2c486d30a6f6b6b6bac1f4c3756","source-abc393-g-problem-941c6da45dc5fe62551ec4fb6a70726479c20b28a4f3308d466fa9cb8822a201"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"固定λのΦ+λLを正部分へ分解すると、明示した容量・費用の循環流とLP双対になる。その費用は−hで、最適流の残余辺の差分制約は相補性条件なので復元potentialがhを達成する。clamp後の整数配置はL≤Dで、支持線の整数性からbreakpointの分母≤D、次数4の三角不等式からλ≤4が保証される。有理探索の判定QLとPは最適Lの非増加性に従い、打切り後は両端間に別のbreakpointがない。二配置は同じ境界で最適なので、その凸結合もhを達成する。正のpenaltyではΦ,Lの凸性のgapがともに0となり、定義したαが変更量をKに合わせる。したがって合法配置が双対下限を達成して最適である。一定配置で予算が余る場合はΦ=0という自明な下限を達成する。","sourceRevisionIds":["source-abc393-editorial-12192-51ff1775a4a84d6ea3fa0c64dbec89b06500e2c486d30a6f6b6b6bac1f4c3756","source-abc393-g-problem-941c6da45dc5fe62551ec4fb6a70726479c20b28a4f3308d466fa9cb8822a201"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Lagrangian relaxation・Aliens trick](src/content/docs/learn/geometry-optimization/lagrangian-relaxation.md)

- 個数制約へpenalty λを加えたoracleで双対下界を求める。厳密復元には個数別最適値の離散凸性などから対象個数で双対ギャップがないことを証明し、その上で個数単調性とtie-breakにより支持直線を探索する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [最小費用流・circulation](src/content/docs/learn/graph/min-cost-flow.md)
- [連分数・Stern–Brocotで有理近似する](src/content/docs/learn/number-theory/rational-approximation.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

変更後の配置をB、隣接差の和をΦ(B)=Σ_{無向辺{u,v}}|B_u−B_v|、変更量をL(B)=Σ_v|B_v−A_v|、予算をK=P/Qとする。制約L≤Kをλ≥0で緩めたh(λ)=min_B(Φ(B)+λL(B))を解く。任意の合法配置についてh(λ)−λK≤Φ(B)だからこれは下限であり、LP強双対によって下限の最大が答えになる。単にλを探索するだけでなく、各λの配置を復元するoracleが必要である。

固定λの目的を、差分の正部分へ分解する。各隣接対を両向きにしたΣmax(B_v−B_u,0)と、Σ_v λ[max(B_v−A_v,0)+max(A_v−B_v,0)]となる。基準頂点Sのpotentialを0とすれば、これは最小費用循環流の双対である。gridの両向き辺は容量1・費用0、S→vは容量λ・費用A_v、v→Sは容量λ・費用−A_v。全頂点の流量保存を課す。循環流の最小費用f(λ)は−h(λ)なので、最終目的は−min_λ(f(λ)+λK)。

λ=a/bなら全容量をb倍し、grid容量b、Sとの辺容量aの整数循環流として解く。費用は変えず、計算した整数費用をbで割ってfを戻す。負費用のv→Sを最初に容量一杯まで流すと、残余辺は全て非負費用になり、Sに流入超過、各vに流出超過aができる。補助始点からSへ合計aN²、各vから補助終点へaを要求する最小費用流でこの不均衡を解消する。初期の負辺の費用も加算する。これは容量上限下で各辺を個別に最安にした状態を、最小の追加費用で流量保存へ戻す操作である。

最適流の残余辺u→vの費用をwとすると、potentialはB_v−B_u≤wを満たす。元辺でf_e<c_eなら順方向の条件、f_e>0なら逆方向のB_u−B_v≤−w_eを入れる。これが相補性条件である。全頂点へ費用0の補助辺を張ってBellman–Fordを実行すれば、最適残余グラフには負閉路がないので全距離が得られる。距離からSの距離を引いてB_S=0とする。費用が整数なので復元値も整数。Bを[0,Amax]へclampしてもΦ,Lとも増えず、同じλの最適配置を保つ。

有限な探索範囲と精度を先に評価する。D=N²Amaxとする。復元配置のΦ,Lは整数で、0≤L≤D。hは有限個の整数傾きL・整数切片Φの支持線の下包絡線。異なる二支持線の交点λ*の分母は|L1−L2|≤D。さらにΦ(A)≤4L(B)+Φ(B)は各頂点の次数が高々4という三角不等式から得られ、λ≥4ではB=Aが最適になる。よって必要なbreakpointは0≤λ≤4、分母≤D、分子≤4D。Amax=0は既にΦ=0で終了する。

λ=0では一定値のmedian(A)を採れば、Φ=0の配置のうちLが最小になる。そのL≤Kならこの配置と答え0を返す。そうでなければλを増やすと最適Lは非増加なので、Stern–BrocotでL(B)≥K側とL(B)<K側を挟む。判定はQL(B)とPの整数比較で行い、L=Kを得たらその配置で終了できる。

探索は隣接分数l=a/b,r=c/dから媒介分数(a+c)/(b+d)を試す。初期は0/1と1/0（+∞）。同じ側が続く間はl+trまたはr+tlの係数tを倍増探索し、続いて二分探索して、その側に残る最大tを求める。分母D・分子4Dの上限も課す。連分数の各係数を一段ずつ歩かずまとめるため、oracle回数はO(log(D+1))で済む。次の媒介分数が上限を超えれば、両端の間に許されたbreakpointはない。

保存した両端の配置をB_L,B_R、変更量をL_L≥K>L_Rとする。間に別のbreakpointがないので二配置は同じ境界λ*の最適解でもある。α=(K−L_R)/(L_L−L_R)としてB=αB_L+(1−α)B_Rを返す。凸性によりL(B)≤K、Φ(B)≤αΦ(B_L)+(1−α)Φ(B_R)。しかも両配置が同じh(λ*)を達成するので、この二つの凸性不等式の総和にはgapがない。λ*>0ならL(B)=KかつΦ(B)=h(λ*)−λ*Kとなり、下限を達成する。λ*=0の予算が余る場合は先のmedian分岐で処理済みである。

例えば2×2のA=[[0,2],[0,2]],K=1では、一定配置と元配置がλ*=1の同じ支持面にあり、補間で差の和3を達成する。支持面を共有することが、異なるλの最適配置を無条件に混ぜる操作との違いである。

## 典型の発動条件

### 予算制約のLagrange双対と主解の復元

発動条件: 予算付き凸最適化で、固定penaltyの問題が差分の正部分の和になるとき。

費用流の容量・費用を正部分の係数から組み立て、残余辺の差分制約を使ってpotentialを復元する。

### 整数支持線による有理探索

発動条件: 最適値が区分線形で、各支持線の傾き・切片が整数になるとき。

傾き差からbreakpointの分母上限を導く。予算を挟む二解が同じ支持面にあることを確認してから補間する。

## 問題固有の要素

grid隣接絶対差と入力値からのL1変更はnetwork flow双対へ落ちる。rational breakpoint両側の最適potentialを補間してbudget境界の解を構成できる。

## 正当性

固定λのΦ+λLを正部分へ分解すると、明示した容量・費用の循環流とLP双対になる。その費用は−hで、最適流の残余辺の差分制約は相補性条件なので復元potentialがhを達成する。clamp後の整数配置はL≤Dで、支持線の整数性からbreakpointの分母≤D、次数4の三角不等式からλ≤4が保証される。有理探索の判定QLとPは最適Lの非増加性に従い、打切り後は両端間に別のbreakpointがない。二配置は同じ境界で最適なので、その凸結合もhを達成する。正のpenaltyではΦ,Lの凸性のgapがともに0となり、定義したαが変更量をKに合わせる。したがって合法配置が双対下限を達成して最適である。一定配置で予算が余る場合はΦ=0という自明な下限を達成する。

## 実装上の注意

- 循環流費用は整数化した容量の分母bで割る。potentialの距離は費用を変えていないのでbで割らない。
- 補助始点・終点を外した元の残余グラフでpotentialを復元する。Sの距離を引いて基準をそろえる。
- P,Q≤10^12の比較・補間分子は十分な整数幅を使う。小数は最終出力でだけ使い、Φも有理数のまま合成すると桁落ちを避けられる。

## 復習の核

- 最小費用流の解から主解を戻す根拠は、残余辺の差分制約と相補性である。
- 有理探索の前に、支持線の整数性・分母上限・penalty範囲を導く。
- 二配置の補間は、同じ支持面を共有する理由まで確認する。

## 計算量と制約

### 時間

O(N^6 Amax log(N+1) log(N²Amax+1))。V,E=O(N²)、整数化後の総流量F=aN²≤4DN²=O(N^4 Amax)。非負残余辺からpotential付きDijkstraで逐次最短路を送り、一oracleはO(F E log V+VE)=O(N^6 Amax log(N+1))。加速したStern–Brocot探索はO(log(D+1))回。N≤10,Amax≤10,D≤1000。

### 空間

O(V+E)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10; 1 \leq P \leq 10^{12}; 1 \leq Q \leq 10^{12}; \gcd(P, Q) = 1; 0 \leq A_{i,j} \leq 10; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/editorial/12192) — source-abc393-editorial-12192-51ff1775a4a84d6ea3fa0c64dbec89b06500e2c486d30a6f6b6b6bac1f4c3756
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/tasks/abc393_g) — source-abc393-g-problem-941c6da45dc5fe62551ec4fb6a70726479c20b28a4f3308d466fa9cb8822a201
