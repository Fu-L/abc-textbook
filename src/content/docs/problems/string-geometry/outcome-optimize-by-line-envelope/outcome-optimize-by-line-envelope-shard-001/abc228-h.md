---
title: "ABC228-H — Histogram"
draft: true
authoringUnit: {"problemId":"abc228-h","docPath":"src/content/docs/problems/string-geometry/outcome-optimize-by-line-envelope/outcome-optimize-by-line-envelope-shard-001/abc228-h.md","learningOutcomeIds":["outcome-optimize-by-line-envelope"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-prefix-partition","unit-greedy-exchange"],"excludedTopics":["Convex Hull Trick・直線包絡の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-hull-trick","tag-dp-prefix-partition","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc228-editorial-2946-865e83f94136ff412ee8bfb8814c501a550a1d8879454f663e30f654df862021","source-abc228-h-problem-f30374b56089c51f620508be1ec28412848e3a5b76afcd94350e1872fedd5777"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"使用する最終高さを固定すると、元高さA_iの棒はA_i以上で最小の使用高さへ割り当てるのが追加費用を最小にする。ゆえにA順の連続groupへ分割する解を考えれば十分である。最終group(l,r]の最適高さはA_rで、最終面積は(R_r−R_l)A_r。種類ごとの固定費Xを足したD_rの漸化式は、最終group境界lを全て比較しているので帰納的に最小値を得る。lの寄与を直線−R_l x+D_lに変形しても候補集合は変わらない。C_i>0により傾きが単調、A_rも単調なので不要直線と過去の最適直線をdequeから除ける。最後に定数である元面積を引く。","sourceRevisionIds":["source-abc228-editorial-2946-865e83f94136ff412ee8bfb8814c501a550a1d8879454f663e30f654df862021","source-abc228-h-problem-f30374b56089c51f620508be1ec28412848e3a5b76afcd94350e1872fedd5777"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Convex Hull Trick・直線包絡](src/content/docs/learn/geometry-optimization/line-envelope.md)

- 一次関数候補の傾き・交点順を保ち、query点で包絡線上の最適な直線を選べる。

先に読む単元:

- [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md) — DPの最小十分状態で得た考え方と実装を再利用し、prefix分割DPの発動条件・正当化・境界を重複なく学ぶ。
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md) — 局所選択を交換論で正当化し、候補を安全に確定できる順序を導く。

## 考察

棒をAの昇順に並べる。棒にはブロックを追加できるので、使用する最終高さを固定したら、各棒を元高さ以上の最小の使用高さへそろえるのが最安である。これにより最適解の完成値は非減少となる。

同じ完成値にそろえる連続区間を一つのグループとみなせる。その完成値は区間右端の元の高さA_rまで下げても実現可能性と種類数を保ち、追加費用を減らせるので、候補は右端値だけで十分である。

棄却する候補: 昇順列を連続グループへ分ける区間DPを、そのまま全ての直前境界について遷移する。

グループ末尾rごとに全てのl<rを調べる二乗遷移はN≤2×10^5に間に合わない。

採用する候補: 区間DPの遷移をA_rにおける一次関数の最小値queryへ変形し、傾きとqueryの単調性を使うConvex Hull Trickで処理する。

各境界lの寄与が傾き−R_l、切片D_lの直線になり、累積本数R_lとソート済みA_rによって追加・queryの順序がともに単調になる。

R_i=Σ_{j≤i}C_jとすると、区間(l,r]を高さA_rへそろえる最終面積は(R_r−R_l)A_rである。全体で元面積ΣA_iC_iを最後に引けば、追加する棒の枚数と種類ごとの固定費XだけをDPできる。

D_r=min_{l<r}{D_l+X+(R_r−R_l)A_r}=R_rA_r+X+min_l{(−R_l)A_r+D_l} と分離すると、過去状態が直線、現在のA_rがquery座標になる。

(A,C)をA順にソートし、D_0=0、R_0=0の直線から始める。rを昇順に走査してx=A_rで直線群の最小値をqueryしD_rを求め、傾き−R_r・切片D_rの直線を単調dequeへ追加する。最後にD_N−ΣA_iC_iを出力する。

## 典型の発動条件

### 交換論による単調な正規形

発動条件: 値を一方向にだけ変更でき、異なる完成値の個数にも費用がかかるとき。

元の高さ順に完成値を非減少へ正規化し、同値グループを連続区間として扱う。

### 分割DP

発動条件: ソート後の列を連続グループへ分割し、各グループの費用が端点と累積量で書けるとき。

最後のグループ(l,r]を高さA_rへそろえる費用を使ってprefixの最小費用を遷移する。

### 単調Convex Hull Trick

発動条件: DP遷移が一次関数群への最小値queryになり、直線の傾きとquery座標がともに単調なとき。

境界lを傾き−R_l・切片D_lの直線にし、x=A_rで最小の遷移元をdequeから得る。

## 問題固有の要素

追加費用を直接数える代わりに、完成後の総面積を最小化して元面積を最後に引くと、区間費用が(R_r−R_l)A_rという一次式になりCHTへつながる。

別の問題へ持ち帰る視点: 増減量の費用が扱いにくいときは、初期総量が定数であることを使って完成総量の最適化へ置き換え、遷移の代数形を単純化する。

## 正当性

使用する最終高さを固定すると、元高さA_iの棒はA_i以上で最小の使用高さへ割り当てるのが追加費用を最小にする。ゆえにA順の連続groupへ分割する解を考えれば十分である。最終group(l,r]の最適高さはA_rで、最終面積は(R_r−R_l)A_r。種類ごとの固定費Xを足したD_rの漸化式は、最終group境界lを全て比較しているので帰納的に最小値を得る。lの寄与を直線−R_l x+D_lに変形しても候補集合は変わらない。C_i>0により傾きが単調、A_rも単調なので不要直線と過去の最適直線をdequeから除ける。最後に定数である元面積を引く。

## 実装上の注意

- R_iA_iやDP値は64bit範囲で管理し、直線が不要かを判定する交差積はさらに広い整数型で比較して除算誤差を避ける。
- R_iはC_i>0により狭義増加するため傾きは狭義減少し、A_iはソートにより非減少する。この向きに合わせてdequeの先頭・末尾を更新する。

## 復習の核

- CHTの式だけを提示せず、完成値を非減少にできる交換論、各グループの値を右端A_rにできる理由、元面積を引く変換の順に導出を確認する。

## 計算量と制約

### 時間

A_iのソートに O(N log N)。傾きとquery座標の単調性を使うdequeの追加・削除は各直線一回で、DPは O(N)。全体 O(N log N)。

### 空間

入力・累積和・直線dequeを保持して O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq X \leq 10^6; 1 \leq A_i, C_i \leq 10^6 \, (1 \leq i \leq N); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc228/editorial/2946) — source-abc228-editorial-2946-865e83f94136ff412ee8bfb8814c501a550a1d8879454f663e30f654df862021
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc228/tasks/abc228_h) — source-abc228-h-problem-f30374b56089c51f620508be1ec28412848e3a5b76afcd94350e1872fedd5777
