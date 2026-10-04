---
title: "ABC466-G — Segment Sum Constraints"
draft: true
authoringUnit: {"problemId":"abc466-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-carry-or-mixed-radix-dp/outcome-design-carry-or-mixed-radix-dp-shard-001/abc466-g.md","learningOutcomeIds":["outcome-design-carry-or-mixed-radix-dp","outcome-maintain-potential-differences"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["数値上限とのtight flagや文字列pattern状態を接頭辞から更新する桁・automaton DP。"],"tagIds":["tag-carry-mixed-radix-dp","tag-potential-dsu"],"sourceRevisionIds":["source-abc466-editorial-22603-f992aca49e269ba09ae63173b5ecfa3abca8cb1209f03e38c7a61966ed2ebbe6","source-abc466-g-problem-f651880065e63f9eadfd21ab05aa1ddfd0d51291fb74a755a028f47b63830dd6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"A_i−1へ変換して非負列との全単射を作る。prefix差等式のpotential整理で矛盾を検出し、同成分のindexを順に結ぶ差だけ残せば、元差はそれらの和で再現でき必要十分である。低bit既決定部分の和とtarget下位部分の差を2^bで割ったcarryが、上位桁へ残る唯一の影響となる。次bitmaskの区間和とcarryの偶奇をtargetbitへ合わせ、半分をnextcarryとする遷移は各bit式と同値。30bit後carry0は全整数式の完全一致を保証する。未登場変数があれば一解からその変数を任意に増やせるので無限、存在判定はmod個数0とは別に保持する。","sourceRevisionIds":["source-abc466-editorial-22603-f992aca49e269ba09ae63173b5ecfa3abca8cb1209f03e38c7a61966ed2ebbe6","source-abc466-g-problem-f651880065e63f9eadfd21ab05aa1ddfd0d51291fb74a755a028f47b63830dd6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

正整数AをA_i-1で非負化し、prefix sum B_iで各区間和条件を差分等式 B_R-B_{L-1}=S と表すと、条件間の整合性はpotential差付き連結成分として扱える。 同じweighted DSU成分のprefix二点へ新制約を追加すると、既存potential差とSが不一致なら解は0である。 bit iで式jのcarry C_jと区間内bit和を足し、S'_jのbitとparityを合わせた後の半分が次carryになる。

採用する候補: weighted DSUでprefix変数間の差制約を統合・矛盾検出し、独立な必要十分区間式へ整理する。その後、各A_jのbit選択と各式のcarry vectorだけを状態にして下位bitから進むcarry DPで解数を数える。

DSU potentialが同成分内の全prefix差を一意に決め、独立式数は高々Nになる。N≤8なのでcarry state積≤1024、各bitの2^N選択を前計算して全遷移を列挙できる。

棄却する候補: 各A_iを0..10^9で列挙し、M個の区間和条件を検査する。

候補が10^{9N}級で、Nが小さくても値域全探索は成立しない。

同じweighted DSU成分のprefix二点へ新制約を追加すると、既存potential差とSが不一致なら解は0である。

bit iで式jのcarry C_jと区間内bit和を足し、S'_jのbitとparityを合わせた後の半分が次carryになる。

各Sから区間長を引き非負問題へ変換する。weighted DSUでB_{L-1},B_Rを差Sでunionし矛盾を検出、成分内隣接prefixから独立区間式を抽出する。carry vector DPをbit0..29で回し、各bitのN-bit maskからnext carryを更新する。

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

A_i−1へ変換して非負列との全単射を作る。prefix差等式のpotential整理で矛盾を検出し、同成分のindexを順に結ぶ差だけ残せば、元差はそれらの和で再現でき必要十分である。低bit既決定部分の和とtarget下位部分の差を2^bで割ったcarryが、上位桁へ残る唯一の影響となる。次bitmaskの区間和とcarryの偶奇をtargetbitへ合わせ、半分をnextcarryとする遷移は各bit式と同値。30bit後carry0は全整数式の完全一致を保証する。未登場変数があれば一解からその変数を任意に増やせるので無限、存在判定はmod個数0とは別に保持する。

## 実装上の注意

- 未登場A_jがあれば可解時Infinity、不可解時0なので、mod countとは別に存在boolを持つ。31bit目の最終carry0を確認し、正数→非負shiftを戻す。

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
