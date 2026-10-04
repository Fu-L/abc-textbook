---
title: "ABC466-G — Segment Sum Constraints"
draft: true
authoringUnit: {"problemId":"abc466-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-carry-or-mixed-radix-dp/outcome-design-carry-or-mixed-radix-dp-shard-001/abc466-g.md","learningOutcomeIds":["outcome-design-carry-or-mixed-radix-dp","outcome-maintain-potential-differences"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。"],"tagIds":["tag-carry-mixed-radix-dp","tag-potential-dsu"],"sourceRevisionIds":["source-abc466-editorial-22603-f992aca49e269ba09ae63173b5ecfa3abca8cb1209f03e38c7a61966ed2ebbe6","source-abc466-g-problem-f651880065e63f9eadfd21ab05aa1ddfd0d51291fb74a755a028f47b63830dd6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"非負化は元の正整数解との全単射である。成分内の隣接prefix差を満たせば、足し合わせてすべての入力等式を戻せる。負の右辺を入力時と抽出時に排除することで、非負区間和という前提を維持する。既決定の下位bit和と目標下位部分の差を2^bで割った値がcarryであり、偶奇検査と次carryへの更新は一桁の加算と同値になる。登場変数・目標は2^30未満なので、30bit後のcarry0で整数として完全一致する。未登場変数は他の条件を変えず任意に増やせるため、一解の存在が無限個の解を意味する。","sourceRevisionIds":["source-abc466-editorial-22603-f992aca49e269ba09ae63173b5ecfa3abca8cb1209f03e38c7a61966ed2ebbe6","source-abc466-g-problem-f651880065e63f9eadfd21ab05aa1ddfd0d51291fb74a755a028f47b63830dd6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [繰り上がり・借り・混合基数を状態にするDP](src/content/docs/learn/dynamic-programming/dp-carry-mixed-radix.md)

- 整除鎖の端数または加算式を下位桁から処理し、切り上げ・切り下げや次桁へのcarryだけを状態にした遷移を設計できる。
- DSUの親辺にpotential差を持たせ、経路圧縮時の差の累積と根の併合方向に応じた符号を導出し、オンラインの差制約追加と頂点間差・矛盾のqueryを処理できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。

## 考察

正整数列をu_i=A_i−1で非負化し、各条件の目標をS−(R−L+1)へ変える。ここが負なら非負区間和では作れず、答えは0。prefix B_i=Σ_{j≤i}u_jを使えば、条件はB_R−B_{L−1}=S'という差等式になる。

採用する候補: weighted DSUで等式を整理した後、下位bitからcarry vector DPを行う。

同じDSU成分の二点に要求された差が既存potentialと食い違えば0。各成分のprefix添字を昇順に並べ、隣接するp<qだけを結ぶ式Σ_{p<j≤q}u_j=B_q−B_pを残す。元の差はこれらを足して戻せるので、独立式は高々N本になる。ただし、抽出した右辺もすべて非負か調べる。入力の右辺が非負でも、例えばu_1=9,u_1+u_2=3から得るu_2=−6は不可能で、DSUの等式検査だけでは弾けない。

棄却する候補: 各u_iを0..10^9から選んで条件を検査する。

N≤8でも値域の直積は列挙できない。一方、式jの区間長をℓ_jとするとcarryは0..ℓ_j−1だけで、その組合せは本問では高々1024通りに収まる。

bit bでは各u_iのbitをN-bit maskで選ぶ。式jの区間内bit数をa_j、目標bitをs_jとし、C_j+a_jとs_jの偶奇が一致するmaskだけを許す。次carryは(C_j+a_j−s_j)/2。初期は全carry0の個数1、他は0とし、bit0..29を処理した全carry0の個数を得る。

条件に登場する非負変数は、元の区間和の目標≤10^9に抑えられるため、30bitで足りる。未登場変数はDPでは0に固定して存在だけを調べ、可解ならInfinity、不可解なら0とする。存在boolを個数mod 998244353とは別に保つ。

## 典型の発動条件

### weighted DSUの差制約

発動条件: 変数差x_v-x_u=wの整合性をonlineで統合したいとき。

component rootへのpotentialを持ち、同成分constraintの矛盾を検出する。

### 加算式のbitwise carry DP

発動条件: 少数変数の複数subset sum等式を大きな値域で数えたいとき。

各等式のcarry vectorだけを桁間状態として下位bitから遷移する。数値上限との一致を追うtight flagは持たない。

## 問題固有の要素

区間和等式はprefix差制約として線形依存を先に除くと、bitwise carry DPで追う式数とcarry空間を縮められる。

別の問題へ持ち帰る視点: 複数加算式も下位bitから処理すれば、過去情報は各式の小さなcarryだけに圧縮できる。

## 正当性

非負化は元の正整数解との全単射である。成分内の隣接prefix差を満たせば、足し合わせてすべての入力等式を戻せる。負の右辺を入力時と抽出時に排除することで、非負区間和という前提を維持する。既決定の下位bit和と目標下位部分の差を2^bで割った値がcarryであり、偶奇検査と次carryへの更新は一桁の加算と同値になる。登場変数・目標は2^30未満なので、30bit後のcarry0で整数として完全一致する。未登場変数は他の条件を変えず任意に増やせるため、一解の存在が無限個の解を意味する。

## 実装上の注意

- shift後の入力目標と、隣接prefixから抽出した全目標の両方を検査し、負なら0を出す。
- 30桁を処理したdp[30][全carry0]を取る。未登場変数はbit選択を0へ固定し、登場変数の解数と存在boolを並行して更新する。

## 復習の核

- prefix差への変換とDSU potential符号を小式で確認し、一つの区間和のbit加算からnext carry式を導いて複数式vectorへ拡張する。

## 計算量と制約

### 時間

N≤8、式M、独立式q≤N、bit数B=30、carry候補C≤1024。potential整理O(Mα(N)+N²)。各maskの式内bit数を前計算O(2^N qN)、直接carry遷移O(BC2^Nq)。hash状態表ならこの部分は期待計算量、carryをmixed-radix配列にすれば確定的。

### 空間

rollingcarry O(C)、mask式内和O(2^Nq)、式potential O(N+M)。遷移表全保持ならO(C2^Nq)が追加。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 8; 1 \leq M \leq 36; 1\leq L_i\leq R_i\leq N; 1\leq S_i\leq 10^9; All (L_i,R_i) are distinct.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc466/editorial/22603) — source-abc466-editorial-22603-f992aca49e269ba09ae63173b5ecfa3abca8cb1209f03e38c7a61966ed2ebbe6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc466/tasks/abc466_g) — source-abc466-g-problem-f651880065e63f9eadfd21ab05aa1ddfd0d51291fb74a755a028f47b63830dd6
