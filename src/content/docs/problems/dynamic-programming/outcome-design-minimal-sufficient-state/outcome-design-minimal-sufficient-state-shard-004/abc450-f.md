---
title: "ABC450-F — Strongly Connected 2"
draft: true
authoringUnit: {"problemId":"abc450-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc450-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-actions"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc450-editorial-17271-14f4cc413a1f20739b575ff4d2dd353fd67bcb2d2e31e1636bfd69e58b7c76fa","source-abc450-f-problem-4bffc8e2482d19c23c3dca668eba04d09cbc5636627009a34727807427000eaa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定下向きchainにより到達集合はprefix1..rであり、Nが1から到達可能なら全頂点が強連結。辺をX昇順に処理すれば一度X>rとなった状態は以後到達を伸ばせず、先に選んだ到達不能辺が後から使えることもない。選ぶ辺(X,Y)はr<Xなら到達を変えず二択、X≤r<Yなら不採用はr・採用はY、r≥Yならどちらもrで二択。この完全な場合分けが区間倍・区間和からYへの加算となり、各subsetを一度だけ数える。削除subsetと残存subsetは補集合で一対一。","sourceRevisionIds":["source-abc450-editorial-17271-14f4cc413a1f20739b575ff4d2dd353fd67bcb2d2e31e1636bfd69e58b7c76fa","source-abc450-f-problem-4bffc8e2482d19c23c3dca668eba04d09cbc5636627009a34727807427000eaa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、選択辺1→2が一本、2→3が二本、固定3→2→1。","procedure":["1→2は残す必要がある。","2→3の二本は少なくとも一本残すので三subset。","二本のラベルを区別して選択する。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-state-design"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"prerequisiteIds":["unit-range-actions"],"attainmentCondition":"到達r<Xの状態を途中で消しても最終答えが変わらない理由は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"X順なので後続辺の始点はrより大きく、到達prefixを二度と伸ばせない。Nへ到達する最終状態には寄与しない。"},"answer":{"reasoningOrVerification":"X順なので後続辺の始点はrより大きく、到達prefixを二度と伸ばせない。Nへ到達する最終状態には寄与しない。","procedure":["具体例の各状態・寄与を再計算する。","X順なので後続辺の始点はrより大きく、到達prefixを二度と伸ばせない。Nへ到達する最終状態には寄与しない。"],"expectedResult":"X順なので後続辺の始点はrより大きく、到達prefixを二度と伸ばせない。Nへ到達する最終状態には寄与しない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

元の強連結 graph から辺を残す見方より、基礎となる N頂点N-1辺の graph に M 辺を選択追加して強連結化する数え上げへ補集合を取ると状態が作りやすい。 X≤r<Y の状態で辺を採用すると reachable 最大値が Y へ伸び、非採用分だけが r に残る。 r<X または r>Y では辺を採用しても state r が変わらないため、採用・非採用の二通りで dp[r] が倍になる。

採用する候補: 追加候補辺を X 昇順に処理し、dp[r] を頂点1から到達できる最大番号 r とする。区間倍加・区間和・一点更新を lazy segment tree で遷移する。

辺 (X,Y) の採否が reach prefix の端 r に与える効果は r<X、X≤r<Y、r=Y、r>Y の連続区間ごとに同一で、遷移を range operation へまとめられる。

棄却する候補: M 本の辺の残す・削るを全て列挙し、各 subgraph の強連結性を SCC で検査する。

2^M 通りの選択があり、M が大きいため graph 検査以前に列挙不能である。

X≤r<Y の状態で辺を採用すると reachable 最大値が Y へ伸び、非採用分だけが r に残る。

r<X または r>Y では辺を採用しても state r が変わらないため、採用・非採用の二通りで dp[r] が倍になる。

辺を (X,Y) 方向に整理して X 昇順 sort する。dp 初期状態を segment tree に置き、各辺で必要区間の和を取得し、range multiply 2 と Y への point add/assign を公式遷移順に行う。最終 dp[N] を読む。

## 典型の発動条件

### 到達 prefix の状態圧縮 DP

発動条件: 頂点順に処理した graph で reachable 集合が prefix として表せるとき。

最大到達番号だけを state にして辺追加効果を分類する。

### DP 遷移の lazy segment tree 化

発動条件: 状態値の連続区間へ同一倍率を掛け、一部に区間和由来の加算をするとき。

range multiply・range sum・point update を一つの木で行う。

## 問題固有の要素

辺 subset 数え上げは、各辺の効果が同じ state 範囲を見つけると区間一括 DP にできる。

別の問題へ持ち帰る視点: 強連結条件そのものではなく、特殊な基礎 graph に対する頂点1の reach frontier として進捗を測る。

## 正当性

固定下向きchainにより到達集合はprefix1..rであり、Nが1から到達可能なら全頂点が強連結。辺をX昇順に処理すれば一度X>rとなった状態は以後到達を伸ばせず、先に選んだ到達不能辺が後から使えることもない。選ぶ辺(X,Y)はr<Xなら到達を変えず二択、X≤r<Yなら不採用はr・採用はY、r≥Yならどちらもrで二択。この完全な場合分けが区間倍・区間和からYへの加算となり、各subsetを一度だけ数える。削除subsetと残存subsetは補集合で一対一。

## 実装上の注意

- in-place 更新で区間和は更新前 dp から読む順序を守る。X,Y の向き、閉区間端、不要な r<X 更新省略の影響を確認する。

## 復習の核

- 一辺 (X,Y) に対する四つの r 範囲で採用・非採用後 state を表にし、その式と data structure 操作を一対一に対応させる。

## 計算量と制約

### 時間

N頂点、選択辺M。Xでsort O(Mlog M)、lazy tree更新 O(N+Mlog N)、全体 O(N+Mlog M+Mlog N)。X別bucketならO(N+Mlog N)。

### 空間

tree、辺で O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 1 \leq X_i < Y_i \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、選択辺1→2が一本、2→3が二本、固定3→2→1。

1. 1→2は残す必要がある。
2. 2→3の二本は少なくとも一本残すので三subset。
3. 二本のラベルを区別して選択する。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

到達r<Xの状態を途中で消しても最終答えが変わらない理由は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

X順なので後続辺の始点はrより大きく、到達prefixを二度と伸ばせない。Nへ到達する最終状態には寄与しない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/editorial/17271) — source-abc450-editorial-17271-14f4cc413a1f20739b575ff4d2dd353fd67bcb2d2e31e1636bfd69e58b7c76fa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/tasks/abc450_f) — source-abc450-f-problem-4bffc8e2482d19c23c3dca668eba04d09cbc5636627009a34727807427000eaa
