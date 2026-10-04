---
title: "ABC288-E — Wish List"
draft: true
authoringUnit: {"problemId":"abc288-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc288-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc288-e-problem-15cf566edfd9f31b80f5ca5d322329f4a4a29a6521bdd4cf87915262817ef427","source-abc288-editorial-5659-5ba9ee2cd7f0cc7cd4a06ec5bdcc18492d47530691265e993c706e1a745a0a74"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"個別の下界を同時に達成できることを構成で示す。各iで最小のCを与えるx_i∈[0,i−1]を独立に選ぶ。B_1から順に購入順のリストを作り、B_iを「既存のi−1個のうち先頭x_i個の直後」へ挿入する。これでB_iより小さい購入予定商品が、B_iの前にちょうどx_i個置かれる。後から挿入する商品は全てB_iより大きいため、この個数を変えない。また大きい商品の購入はB_iの売れ残り中の順位に影響しない。最終リストに従って買えば、全iで順位B_i−x_iとなり、各商品ごとの最小Cを同時に達成できる。\n\n従って固定購入集合の最小費用はΣ_i(A_{B_i}+min C_{B_i−i+1..B_i})。番号順のDPでは、次の商品より小さい選択商品の個数jだけで追加費用が決まる。必須商品は購入だけ、任意商品は購入・非購入の両方を遷移させるので全ての許容集合を網羅する。同じ(i,j)では将来の追加費用が同じだから最小費用だけ残せばよい。","sourceRevisionIds":["source-abc288-e-problem-15cf566edfd9f31b80f5ca5d322329f4a4a29a6521bdd4cf87915262817ef427","source-abc288-editorial-5659-5ba9ee2cd7f0cc7cd4a06ec5bdcc18492d47530691265e993c706e1a745a0a74"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

買う集合を昇順B_1<…<B_Kと固定する。B_iを買う時点で、それより小さい購入予定商品のうち先に買った個数をxとすると、売れ残り中の順位はB_i−xである。したがって追加費用の候補は A_{B_i}+C_{B_i−x}、0≤x<i。各iのxを同時に最小化できるかが購入順を消せる鍵であり、その構成は正当性で確認する。

固定集合の費用がこの最小値の和にできれば、番号順のDPで十分である。item iを処理する時点で、既に買った小さいitem数jだけが次のrank候補を決める。cost(i,j)=min C_{i−j..i}を前計算し、dp[i][j]を先頭i itemからj個買う最小費用とする。wishlist itemは必ず買い、他は買う・買わないの両方へ遷移する。

## 典型の発動条件

### 操作順の集合コスト化

発動条件: 選んだ対象集合を固定すると、最適な操作順の費用が各要素のrankだけで表せるとき。

購入順を消去し、昇順集合B_iごとの下界兼達成値へ置き換える。

### 選択個数DP

発動条件: 番号順に必須・任意要素を選び、次のcostが過去の選択数に依存するとき。

prefixで買った個数jを状態にする。

### 区間minの漸化前計算

発動条件: 左端を1つずつ伸ばす区間最小を全長について使うとき。

直前のminimumと新要素のminで更新する。

## 問題固有の要素

item B_iを買う瞬間のrank候補はB_i,B_i-1,…,B_i-i+1に限られ、その中の最安Cを全itemで同時達成できる購入順がある。

別の問題へ持ち帰る視点: 順序依存操作では、固定した最終集合に対する各要素の可能rank範囲と、個別下界が同時達成可能かを分けて証明する。

## 正当性

個別の下界を同時に達成できることを構成で示す。各iで最小のCを与えるx_i∈[0,i−1]を独立に選ぶ。B_1から順に購入順のリストを作り、B_iを「既存のi−1個のうち先頭x_i個の直後」へ挿入する。これでB_iより小さい購入予定商品が、B_iの前にちょうどx_i個置かれる。後から挿入する商品は全てB_iより大きいため、この個数を変えない。また大きい商品の購入はB_iの売れ残り中の順位に影響しない。最終リストに従って買えば、全iで順位B_i−x_iとなり、各商品ごとの最小Cを同時に達成できる。

従って固定購入集合の最小費用はΣ_i(A_{B_i}+min C_{B_i−i+1..B_i})。番号順のDPでは、次の商品より小さい選択商品の個数jだけで追加費用が決まる。必須商品は購入だけ、任意商品は購入・非購入の両方を遷移させるので全ての許容集合を網羅する。同じ(i,j)では将来の追加費用が同じだから最小費用だけ残せばよい。

## 実装上の注意

- cost(i,j)のC indexはi-j以上1であり、jはiより前に買えるitem数までに制限する。
- 費用総和は32bitを超えるので64bit整数と十分大きいINFを使う。
- wishlist判定をboolean arrayにし、必須itemでskip遷移を入れない。

## 復習の核

- 3 item程度で追加itemを買うcaseを固定し、各B_iのrank候補とcost下界を達成する購入順、DPのjが一致するかを確認する。

## 計算量と制約

### 時間

N item。j選択数のsuffix min前計算とDPで O(N²)。

### 空間

cost全表とDP全表なら O(N²)、DPはrolling O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 5000; 1 \leq A_i \leq 10^9; 1 \leq C_i \leq 10^9; 1 \leq X_1 \lt X_2 \lt \cdots \lt X_M \leq N; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/tasks/abc288_e) — source-abc288-e-problem-15cf566edfd9f31b80f5ca5d322329f4a4a29a6521bdd4cf87915262817ef427
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/editorial/5659) — source-abc288-editorial-5659-5ba9ee2cd7f0cc7cd4a06ec5bdcc18492d47530691265e993c706e1a745a0a74
