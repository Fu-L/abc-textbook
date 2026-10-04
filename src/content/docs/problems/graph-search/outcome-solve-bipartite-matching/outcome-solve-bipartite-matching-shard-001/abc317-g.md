---
title: "ABC317-G — Rearranging"
draft: true
authoringUnit: {"problemId":"abc317-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc317-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching","outcome-characterize-bipartite-feasibility-by-hall"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall"],"sourceRevisionIds":["source-abc317-editorial-7023-b224a577adb130f22958f2d9304d2188c87a4c17f5ad75a70ef80be439255603","source-abc317-g-problem-a15c857f0fa50149ef4a0e2c01ca8d89bf6581a5772e58b2ab82726188a66e0a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各値がN行全体でM回現れるので行–値graphはM正則。任意左subsetの出辺数M|S|≤M|neighbors|からHall条件を満たしperfect matching存在。一つ削ると(M−1)正則になり帰納的に全列を作れる。多重edge occurrenceも一つずつ削除する。","sourceRevisionIds":["source-abc317-editorial-7023-b224a577adb130f22958f2d9304d2188c87a4c17f5ad75a70ef80be439255603","source-abc317-g-problem-a15c857f0fa50149ef4a0e2c01ca8d89bf6581a5772e58b2ab82726188a66e0a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。

先に読む単元:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md) — 無向グラフを探索できることを前提に二部性と部の交換対称性を扱い、連結二部グラフの彩色重複も補正する。

## 考察

各入力要素 A_{i,j} を「行 i」と「値 A_{i,j}」を結ぶ多重辺と見ると、各行頂点も各値頂点も次数 M の M-正則二部多重グラフになる。 出力の一列は各行を一度、各値を一度使うので完全 matching であり、全 M 列を作ることは全辺を M 個の完全 matching に分解することと同値である。 左側 I から出る辺は |I|M 本で、右頂点一つの次数は M だから近傍は少なくとも |I| 個あり Hall 条件が従う。 同じ行・値間の多重辺も元の何番目の要素かを保持し、matching で使った一辺だけを削除すれば元の行内 multiset を正確に消費する。

採用する候補: 二部グラフから完全 matching を一つ求め、その辺を一列へ割り当てて削除する操作を M 回繰り返す。

正則二部グラフは Hall 条件を満たし、一 matching 削除後も (M−1)-正則なので帰納的に必ず完遂できる。

棄却する候補: 各行を独立に並べ、列ごとに重複した値を局所 swap で直す。

一つの重複解消が別列の重複を生み、全列同時の制約を保証する局所不変量がない。

左側 I から出る辺は |I|M 本で、右頂点一つの次数は M だから近傍は少なくとも |I| 個あり Hall 条件が従う。

同じ行・値間の多重辺も元の何番目の要素かを保持し、matching で使った一辺だけを削除すれば元の行内 multiset を正確に消費する。

行 N 頂点と値 N 頂点の二部多重グラフを作る。col=1..M ごとに Hopcroft–Karp または最大流でサイズ N の matching を求め、matched value を各行の col へ出力し、対応する edge occurrence を graph から削除する。

## 典型の発動条件

### 正則二部グラフの matching 分解

発動条件: 各左・右頂点の次数が同じで、全辺を列や色へ均等に割り当てたいとき。

Hall で完全 matching の存在を示し、削除を帰納的に繰り返す。

### 配列再配置の二部グラフ化

発動条件: 各行から一要素ずつ選び、各ラベルも一度ずつ使う列を構成するとき。

行とラベルを部集合、要素 occurrence を辺とみなす。

## 問題固有の要素

「各値が全体で M 回」という保証は右次数を M にし、行長 M と合わせて正則性・常時 matching 存在を与える。

別の問題へ持ち帰る視点: 均等出現条件を見たら、行列を incidence matrix として regular bipartite graph の辺彩色へ読み替える。

## 正当性

各値がN行全体でM回現れるので行–値graphはM正則。任意左subsetの出辺数M|S|≤M|neighbors|からHall条件を満たしperfect matching存在。一つ削ると(M−1)正則になり帰納的に全列を作れる。多重edge occurrenceも一つずつ削除する。

## 実装上の注意

- 同値の複数 occurrence を一辺に潰さず multiplicity を保つ。各 round で使用辺だけを削除し、matching 配列の左右対応を出力列へ正しく写す。

## 復習の核

- 一列が満たす制約を「各行・各値を一回」と言い換えて matching を見抜く。構成可能性は入力保証ではなく、次数から Hall 条件を自分で導く。

## 計算量と制約

### 時間

行N、列M、辺NM。M回Hopcroft–Karpで O(M·NM√N)=O(NM²√N)。

### 空間

多重所属graphと出力 O(NM)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,M \leq 100; 1 \leq A_{i,j} \leq N; All input values are integers.; The NM numbers A_{1,1},\ldots,A_{N,M} contain exactly M occurrences of each of 1,\ldots,N.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/editorial/7023) — source-abc317-editorial-7023-b224a577adb130f22958f2d9304d2188c87a4c17f5ad75a70ef80be439255603
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc317/tasks/abc317_g) — source-abc317-g-problem-a15c857f0fa50149ef4a0e2c01ca8d89bf6581a5772e58b2ab82726188a66e0a
