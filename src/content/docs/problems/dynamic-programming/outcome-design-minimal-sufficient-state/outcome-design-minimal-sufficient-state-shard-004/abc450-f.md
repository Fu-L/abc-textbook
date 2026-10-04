---
title: "ABC450-F — Strongly Connected 2"
draft: true
authoringUnit: {"problemId":"abc450-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc450-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-actions"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-lazy-segment-action"],"sourceRevisionIds":["source-abc450-editorial-17271-14f4cc413a1f20739b575ff4d2dd353fd67bcb2d2e31e1636bfd69e58b7c76fa","source-abc450-f-problem-4bffc8e2482d19c23c3dca668eba04d09cbc5636627009a34727807427000eaa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"固定下向きchainにより到達集合はprefix1..rであり、Nが1から到達可能なら全頂点が強連結。辺をX昇順に処理すれば一度X>rとなった状態は以後到達を伸ばせず、先に選んだ到達不能辺が後から使えることもない。選ぶ辺(X,Y)はr<Xなら到達を変えず二択、X≤r<Yなら不採用はr・採用はY、r≥Yならどちらもrで二択。この完全な場合分けが区間倍・区間和からYへの加算となり、各subsetを一度だけ数える。削除subsetと残存subsetは補集合で一対一。","sourceRevisionIds":["source-abc450-editorial-17271-14f4cc413a1f20739b575ff4d2dd353fd67bcb2d2e31e1636bfd69e58b7c76fa","source-abc450-f-problem-4bffc8e2482d19c23c3dca668eba04d09cbc5636627009a34727807427000eaa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md) — 結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

元の強連結 graph から辺を残す見方より、基礎となる N頂点N-1辺の graph に M 辺を選択追加して強連結化する数え上げへ補集合を取ると状態が作りやすい。 X≤r<Y の状態で辺を採用すると reachable 最大値が Y へ伸び、非採用分だけが r に残る。 r<X または r>Y では辺を採用しても state r が変わらないため、採用・非採用の二通りで dp[r] が倍になる。

採用する候補: 追加候補辺を X 昇順に処理し、dp[r] を頂点1から到達できる最大番号 r とする。区間倍加・区間和・一点更新を lazy segment tree で遷移する。

辺 (X,Y) の採否が reach prefix の端 r に与える効果は r<X、X≤r<Y、r=Y、r>Y の連続区間ごとに同一で、遷移を range operation へまとめられる。

棄却する候補: M 本の辺の残す・削るを全て列挙し、各 subgraph の強連結性を SCC で検査する。

2^M 通りの選択があり、M が大きいため graph 検査以前に列挙不能である。

固定辺はv→v−1（2≤v≤N）であり、頂点1の初期到達範囲は{1}。dp[1]=1、他は0とする。追加候補(X,Y)をX昇順に処理し、旧配列をoldとすると

```text
new[r] = 2old[r]                       (r<X または r>Y)
new[r] = old[r]                        (X≤r<Y)
new[Y] = 2old[Y]+Σ_{X≤r<Y}old[r]
```

となる。lazy tree上での実行順は、まずz=sum([X,Y))を取得し、[1,X)と[Y,N+1)を2倍にし、最後に位置Yへzを加える。半開区間[Y,N+1)がold[Y]の採用・非採用二通りも数えるので、point addの前に倍加する。答えはdp[N]、全演算は法998244353。

同じXの辺順は任意でよい。到達していないXは同じXの辺からも到達可能にならず、到達済みなら選んだ辺のYの最大値へ伸びるだけだからである。r<Xの倍加を省いてもその状態は以後X以上へ伸びないので最終回答には影響しないが、上の式は全状態の意味を保持する。

N=2、候補(1,2)一本ではz=1でdp[2]=1。候補が同じ(1,2)二本なら二本目の更新でdp[2]=2·1+1=3となり、「少なくとも一本を残す」三subsetと一致する。候補辺は入力で識別されるので重複も別の採否である。

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

- dp[1]=1、他は0。sum([X,Y))は倍加前に保存し、[Y,N+1)の倍加後に位置Yへ加える。
- r=Yを倍加の区間に含める。sumにYも含める流儀と混ぜるとold[Y]を三回数える。
- 候補辺をX昇順に処理し、最後は全状態和ではなくdp[N]を出力する。

## 復習の核

- 一辺 (X,Y) に対する四つの r 範囲で採用・非採用後 state を表にし、その式と data structure 操作を一対一に対応させる。

## 計算量と制約

### 時間

N頂点、選択辺M。Xでsort O(Mlog M)、lazy tree更新 O(N+Mlog N)、全体 O(N+Mlog M+Mlog N)。X別bucketならO(N+Mlog N)。

### 空間

tree、辺で O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2\times 10^5; 1 \leq M \leq 2\times 10^5; 1 \leq X_i < Y_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/editorial/17271) — source-abc450-editorial-17271-14f4cc413a1f20739b575ff4d2dd353fd67bcb2d2e31e1636bfd69e58b7c76fa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/tasks/abc450_f) — source-abc450-f-problem-4bffc8e2482d19c23c3dca668eba04d09cbc5636627009a34727807427000eaa
