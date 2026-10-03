---
title: "ABC365-F — Takahashi on Grid"
draft: true
authoringUnit: {"problemId":"abc365-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-001/abc365-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc365-editorial-10582-ce83fb2ad4d8834dc35fd6020b9f2457dbada335c7ffceeecf6b17d36d777bda","source-abc365-f-problem-0e67b138b92e3c46ad2cede58de7ff3b3270e1ad124881d959dccfcc234401ae"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"隣接区間が交わるため、次列へ進む前の移動は通行区間への最小のclampでよく、以後必要な縦移動を先に行っても総移動を減らせない。blockのfはこの貪欲の最終座標、g,Cは費用関数を正確に表す。f_aが一点かf_a=g_aかの場合分けから、合成後の最小費用区間と端点の式が得られ、関数合成そのものなので結合的である。開始列を除く(s_x,t_x]の要約で横移動をちょうどt_x−s_x回数え、最後の縦距離を足すと貪欲経路の最短距離になる。同じ列の場合は単位元により縦距離だけを返す。","sourceRevisionIds":["source-abc365-editorial-10582-ce83fb2ad4d8834dc35fd6020b9f2457dbada335c7ffceeecf6b17d36d777bda","source-abc365-f-problem-0e67b138b92e3c46ad2cede58de7ff3b3270e1ad124881d959dccfcc234401ae"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

必要なら始終点を交換してs_x≤t_xとする。隣接する通行区間は交わるため、次の列へ進めるなら先に進んで損をしない。次列[L,U]から外れたyだけをその近い端へ移し、横へ一歩進む貪欲法で最短になる。最後の列では目標yまで移動する。全列を毎回たどるとO(NQ)なので、この貪欲の入出力と費用を区間要約にする。

block=(f=[f_L,f_U],g=[g_L,g_U],C)を、入力yに対する出力F(y)=clamp(y,f_L,f_U)、費用G(y)=C+dist(y,g)として定義する。dist(y,[l,u])=max(0,l−y,y−u)。一列へ入るblockはf=g=[L_i,U_i]、C=1。この1は横方向の一歩である。全blockには「fまたはgが非退化区間ならf=g、そうでなければ両方一点」という不変量がある。

左block aの後に右block bを通る合成は、F(y)=F_b(F_a(y))、G(y)=G_a(y)+G_b(F_a(y))。具体的に

f_L=clamp(f_{L,a},f_{L,b},f_{U,b})、f_U=clamp(f_{U,a},f_{L,b},f_{U,b})、
g_L=clamp(g_{L,b},g_{L,a},g_{U,a})、g_U=clamp(g_{U,b},g_{L,a},g_{U,a})、
C=C_a+dist(g_L,g_a)+C_b+dist(clamp(g_L,f_a),g_b)

で求められる。clamp(y,f_a)はaの出力区間へのclampの略。fはclamp合成の端点、gは費用の最小区間で、Cはその端点g_Lを元の費用合成へ代入した値である。f_aが一点なら右側費用は定数になる。そうでなければf_a=g_aで、二区間が重なる場合は交わりが最小区間、離れる場合はg_aの近い端点だけが最小となる。この場合分けがgとCの式を与え、不変量も保つ。

単位元はf=g=[0,10^9+1]、C=0とする。扱う座標範囲ではF(y)=y、G(y)=0である。二区間の処理を順に実行する関数合成なので結合的で、順序を保ったセグメント木へ載せられる。

質問の開始列は既にその列にいるので含めず、1-basedの列(s_x,t_x]、すなわち列s_x+1,…,t_xだけを合成する。得たblockへs_yを入れ、答えをG(s_y)+|F(s_y)−t_y|とする。s_x=t_xなら積は単位元で、答えは|s_y−t_y|。開始列まで含めると横移動を一歩余計に数える。

全列の構築O(N)、各質問O(log N)、合成は定数個のclampと距離計算だけである。

## 典型の発動条件

### 区間関数合成segment tree

発動条件: 列上の各要素が状態遷移関数で、範囲適用queryが多数あるとき。

関数を定数parameterへ圧縮し、結合順を保つsegment tree積として取得する。

### clampと一次凸関数の閉包

発動条件: 区間制約へ射影しながら移動距離を累積するとき。

到達位置をclamp、追加costを平坦区間からの距離で表す。

## 問題固有の要素

greedy path全体ではなく「任意の開始yをどこへ写し何歩使うか」というtransfer functionを持つとquery間で再利用できる。

別の問題へ持ち帰る視点: 経路queryでは区間の答えを単値でなく境界状態に対する関数として要約する。

## 正当性

隣接区間が交わるため、次列へ進む前の移動は通行区間への最小のclampでよく、以後必要な縦移動を先に行っても総移動を減らせない。blockのfはこの貪欲の最終座標、g,Cは費用関数を正確に表す。f_aが一点かf_a=g_aかの場合分けから、合成後の最小費用区間と端点の式が得られ、関数合成そのものなので結合的である。開始列を除く(s_x,t_x]の要約で横移動をちょうどt_x−s_x回数え、最後の縦距離を足すと貪欲経路の最短距離になる。同じ列の場合は単位元により縦距離だけを返す。

## 実装上の注意

- 区間は1-basedで(s_x,t_x]。開始列へ入る横一歩を重複して数えない。
- 左blockの後に右blockを通す非可換な順序を保つ。fとgの向きは合成式が異なる。
- 空区間用の単位元を用意し、費用は64bitで保持する。

## 復習の核

- 二行だけのsummaryを全y領域で手計算して合成式と照合する。segment tree queryが返す行範囲と、最後の縦移動を別々に管理する。

## 計算量と制約

### 時間

O(N+Q log N)、summaryの合成はO(1)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq2\times10 ^ 5; 1\leq L _ i\leq U _ i\leq10 ^ 9\ (1\leq i\leq N); \lbrack L _ i,U _ i\rbrack\cap\lbrack L _ {i+1},U _ {i+1}\rbrack\neq\emptyset\ (1\leq i\lt N); 1\leq Q\leq2\times10 ^ 5; 1\leq s _ {x,i}\leq N and L _ {s _ {x,i}}\leq s _ {y,i}\leq U _ {s _ {x,i}}\ (1\leq i\leq Q); 1\leq t _ {x,i}\leq N and L _ {t _ {x,i}}\leq t _ {y,i}\leq U _ {t _ {x,i}}\ (1\leq i\leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/editorial/10582) — source-abc365-editorial-10582-ce83fb2ad4d8834dc35fd6020b9f2457dbada335c7ffceeecf6b17d36d777bda
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc365/tasks/abc365_f) — source-abc365-f-problem-0e67b138b92e3c46ad2cede58de7ff3b3270e1ad124881d959dccfcc234401ae
