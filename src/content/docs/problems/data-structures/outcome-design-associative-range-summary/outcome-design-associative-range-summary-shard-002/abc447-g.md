---
title: "ABC447-G — Div. 1 & Div. 2"
draft: true
authoringUnit: {"problemId":"abc447-g","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc447-g.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-event-sweep"],"sourceRevisionIds":["source-abc447-editorial-16718-a1b669c119b77dfc8a1a573bcb336299847d65177f0a055fe603e08d6272f111","source-abc447-g-problem-c03ac610934126bc19d4d5f101725d00a6f56667a89b1edeec154307dfe53200"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"左右の外側二問は、それぞれ共有中央二ジャンルを避ければよく、左右間の重複は合法である。L,Rの異ジャンル上位4は二ジャンル禁止後の最良二件を含むため、pairは正確であり、M_c(x)と右側の和は中央を固定した最適値になる。固定した右外側二ジャンルとcを避ける候補がMの異ジャンル上位4に残り、捨てた候補以上の左価値を持つので、セグメント木の要約だけで全中央候補を評価できる。通常値から変わり得るcはK_xと通常採用二件のジャンルだけである。変更・全問い合わせ・復元の順に処理すれば、各cで全葉がM_cを表す不変量を保つ。全yを一度照会するので全合法解の最大が得られる。","sourceRevisionIds":["source-abc447-editorial-16718-a1b669c119b77dfc8a1a573bcb336299847d65177f0a055fe603e08d6272f111","source-abc447-g-problem-c03ac610934126bc19d4d5f101725d00a6f56667a89b1edeec154307dfe53200"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

選ぶ添字を i_1<…<i_6 とする。ジャンルが相異なる必要があるのは、Div. 2 の位置1〜4とDiv. 1の位置3〜6の各集合内である。共有する中央二問のジャンルは互いに異なり、左右の外側二問はそれぞれ中央二ジャンルを避ける。左外側と右外側の間には重複を許す。例えば K=(1,2,3,4,1,2)、A=(1,1,1,1,1,1) は六問全てを選べて答え6になる。

六重ループは Θ(N^6)。中央 x=i_3,y=i_4 を固定すると、左は[1,x−1]、右は[y+1,N]からそれぞれ二問を選ぶ。両側は別々に最適化できるが、全(x,y)でも二次時間になる。まず「二ジャンルを禁止して異ジャンル二件を取る」という問い合わせを要約し、次に中央ジャンルを固定して x の候補をまとめる。

集合 S の各ジャンルの最大価値だけを残し、その上位4件を T(S) とする。禁止ジャンルが二つなら上位4件から高々二件しか消えないので、必要な上位二件は必ずここにある。L_i=T([1,i])、R_i=T([i,N]) を作り、L_0=R_{N+1}=空集合とする。新しい一件との結合は定数時間なので前計算は O(N)。同価値には添字などで固定の順を与える。

pair(S;a,b) を、Sからジャンルa,bを除いた異ジャンル上位二件の価値和と定義する。二件未満なら −∞。右中央のジャンル c=K_y を固定し、左中央候補の値を

M_c(x)=A_x+pair(L_{x−1};K_x,c) （K_x≠c）、M_c(x)=−∞ （K_x=c）

とする。中央 (x,y) から得る六問の価値は M_c(x)+A_y+pair(R_{y+1};K_x,c)。答えは全 y と x<y についての最大で、有限候補がなければ −1 である。

各区間に、ジャンルごとの最大 M_c(x) の上位4件を持つセグメント木を置く。K_y=c の y に対し [1,y−1] を照会し、返った候補 x を高々4件試して上式を評価する。左右の添字範囲は互いに素で、両側の外側ジャンル同士を照合して排除してはいけない。

なぜ M の上位4件だけでよいか。任意の最適候補 x と、それに対して実際に選ぶ右外側二問を固定する。この二ジャンルと c を禁止しても、異ジャンル上位4候補には一つ以上が残る。残る x' は M_c(x')≥M_c(x) で、その右外側二問をそのまま使える。同ジャンル x の代表が上位4にある場合も、その代表へ交換すればよい。したがって捨てた候補による改善はない。

次に c ごとに木を再構築する O(N²) を避ける。通常値を M_*(x)=A_x+pair(L_{x−1};K_x) とする。ここで pair(S;a) は一ジャンルだけを除いた二件の和。通常の二件が存在するとき、そのジャンルを p_x,q_x とする。追加禁止 c がこの二つ以外なら通常の二件がそのまま最適で、値は変わらない。c=K_x では候補自体を無効にする。従って各 x の変更イベントは {K_x,p_x,q_x} の高々三カテゴリだけ。通常の二件がない場合は常に −∞なのでイベントは不要である。

全葉を通常値で構築し、イベント表 events[c] に (x,M_c(x)) を前計算する。各 c では、(1) events[c] の葉を変更、(2) K_y=c の全 y を照会して回答更新、(3) 同じ葉を M_*(x) へ復元、の順に処理する。復元を忘れると前の禁止ジャンルが残る。イベント総数は高々3N、問い合わせ総数はNなので O(N log N) になる。

## 典型の発動条件

### カテゴリ distinct top-K 要約

発動条件: 禁止カテゴリが定数個で、区間からカテゴリ重複なしの上位候補を取りたいとき。

各区間に異ジャンル上位4の固定長配列を保持する。

### parameter sweep と差分更新

発動条件: 全 parameter ごとの値が各要素で定数回しか変化しないとき。

再構築せず変化点だけ segment tree へ反映する。

## 問題固有の要素

distinct 制約で候補を削る数が定数なら、最適解探索に必要な各側 top-K も定数にできる。

別の問題へ持ち帰る視点: 外側 parameter の全探索で前計算を繰り返す前に、各状態値の変化回数を数えて event 化する。

## 正当性

左右の外側二問は、それぞれ共有中央二ジャンルを避ければよく、左右間の重複は合法である。L,Rの異ジャンル上位4は二ジャンル禁止後の最良二件を含むため、pairは正確であり、M_c(x)と右側の和は中央を固定した最適値になる。固定した右外側二ジャンルとcを避ける候補がMの異ジャンル上位4に残り、捨てた候補以上の左価値を持つので、セグメント木の要約だけで全中央候補を評価できる。通常値から変わり得るcはK_xと通常採用二件のジャンルだけである。変更・全問い合わせ・復元の順に処理すれば、各cで全葉がM_cを表す不変量を保つ。全yを一度照会するので全合法解の最大が得られる。

## 実装上の注意

- 空集合と候補不足は −∞。有限候補同士だけを足し、同ジャンルは最高価値一件へ統合する。和は最大6×10^9なので64bitで持つ。
- 固定長top4配列を結合する。左外側と右外側のジャンル重複を禁止しない。
- events[c] を適用してからK_y=cの問い合わせを全て行い、同じ葉を通常値へ復元する。

## 復習の核

- 複数の制約集合が重なるときは、共有部分と独立な部分を先に分ける。
- 「禁止カテゴリ数＋必要候補数」で要約幅を導き、交換相手が合法な理由まで説明する。
- パラメータ全探索の前に、一要素の通常値を変えるカテゴリだけを列挙する。

## 計算量と制約

### 時間

O(N log N)。L,Rと高々3NイベントはO(N)で作る。変更・復元が各O(N)回、区間照会が計N回で各O(log N)。top4の結合は定数時間。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 6 \leq N \leq 10^5; 1 \leq K_i \leq N; 1 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/editorial/16718) — source-abc447-editorial-16718-a1b669c119b77dfc8a1a573bcb336299847d65177f0a055fe603e08d6272f111
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc447/tasks/abc447_g) — source-abc447-g-problem-c03ac610934126bc19d4d5f101725d00a6f56667a89b1edeec154307dfe53200
