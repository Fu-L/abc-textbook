---
title: "ABC393-G — Unevenness"
draft: true
authoringUnit: {"problemId":"abc393-g","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-lagrangian-relaxation/outcome-optimize-by-lagrangian-relaxation-shard-001/abc393-g.md","learningOutcomeIds":["outcome-optimize-by-lagrangian-relaxation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-min-cost-flow","unit-rational-approximation","unit-weighted-shortest-path"],"excludedTopics":["Lagrangian relaxation・Aliens trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lagrangian-relaxation","tag-min-cost-flow","tag-rational-approximation","tag-shortest-path"],"sourceRevisionIds":["source-abc393-editorial-12192-51ff1775a4a84d6ea3fa0c64dbec89b06500e2c486d30a6f6b6b6bac1f4c3756","source-abc393-g-problem-941c6da45dc5fe62551ec4fb6a70726479c20b28a4f3308d466fa9cb8822a201"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Φ(B)=Σedge|B_u−B_v|、L(B)=Σ|B−A|と置く。固定λ≥0のh(λ)=min_B(Φ+λL)は各Bの一次式の下包絡線で凹。任意budget合法Bにh−λK≤Φが成り立ち、LP強双対によりmax_λ(h−λK)が最適値。費用circulationの残余差分制約から各λの最適potentialを復元し、budgetを挟む同支持面の二potentialを凸結合するとL≤Kを満たしdual下限を達成する。flow値をf=−hとする実装では符号を一貫して戻す。","sourceRevisionIds":["source-abc393-editorial-12192-51ff1775a4a84d6ea3fa0c64dbec89b06500e2c486d30a6f6b6b6bac1f4c3756","source-abc393-g-problem-941c6da45dc5fe62551ec4fb6a70726479c20b28a4f3308d466fa9cb8822a201"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

目的Φ=Σ隣接差、変更量L=Σ|B−A|とする。budget L≤Kの制約へλ≥0を付け、h(λ)=min_B(Φ+λL)をoracleで求める。hは一次式の下包絡線なので凹で、h(λ)−λKは常にprimal最適値の下限。強双対によりその最大が答えになる。費用circulationの値をf=−hと定義する場合はmin(f+λK)の符号を最後に反転する。grid両向き辺とsuper nodeの容量λ・cost±Aによるflow双対から残余potentialを復元する。budgetを挟むbreakpoint両側のpotentialを同支持面で補間すればdual下限を達成する配置が得られる。breakpointを有理Stern–Brocot探索し容量は分母倍で整数化する。

## 典型の発動条件

budget付き凸LPはLagrange oracleの支持線を探索し、双対値と主potentialを同時に復元する。min_B(Φ+λL)の値は凹であり、min-cost flow値との符号を明示する。

## 問題固有の要素

grid隣接絶対差と入力値からのL1変更はnetwork flow双対へ落ちる。rational breakpoint両側の最適potentialを補間してbudget境界の解を構成できる。

## 正当性

Φ(B)=Σedge|B_u−B_v|、L(B)=Σ|B−A|と置く。固定λ≥0のh(λ)=min_B(Φ+λL)は各Bの一次式の下包絡線で凹。任意budget合法Bにh−λK≤Φが成り立ち、LP強双対によりmax_λ(h−λK)が最適値。費用circulationの残余差分制約から各λの最適potentialを復元し、budgetを挟む同支持面の二potentialを凸結合するとL≤Kを満たしdual下限を達成する。flow値をf=−hとする実装では符号を一貫して戻す。

## 実装上の注意

hとflow値fの符号を固定し、max(h−λK)または−min(f+λK)のどちらか一貫した式で返す。負cost辺と有理λ容量の分母倍を扱う。budgetが余るΦ=0のcorner caseでは等号補間を強制しない。

## 復習の核

N2のA=[[0,2],[0,2]],K1で最適3を三角不等式と構成の両側から確認する。minを取った一次式の包絡線は凹であることとflow双対値の符号を復習する。

## 計算量と制約

### 時間

O(I·F(V,E,Cmax))。V=N²+1、E=O(N²)、Iは有理Stern–Brocot探索回数、Fは整数容量min-cost circulationの一回費用。

### 空間

O(V+E)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10; 1 \leq P \leq 10^{12}; 1 \leq Q \leq 10^{12}; \gcd(P, Q) = 1; 0 \leq A_{i,j} \leq 10; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/editorial/12192) — source-abc393-editorial-12192-51ff1775a4a84d6ea3fa0c64dbec89b06500e2c486d30a6f6b6b6bac1f4c3756
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc393/tasks/abc393_g) — source-abc393-g-problem-941c6da45dc5fe62551ec4fb6a70726479c20b28a4f3308d466fa9cb8822a201
