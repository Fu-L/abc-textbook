---
title: "ABC264-F — Monochromatic Path"
draft: true
authoringUnit: {"problemId":"abc264-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc264-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc264-f-problem-a49a4475102768a9fa99c60715edf21004bb6dbaca713d6223d205dd858d48c6","source-abc264-editorial-4588-1142d2110429e09e1541685a676a3524b7a47216f3b07f87a2ec53a643d1c694"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"右・下へ進む経路は各行・各列へ最初に入る時点が一回だけである。現在の行反転bitと列反転bitを持つと現在色が決まり、右へ進む際に新列bit、下へ進む際に新行bitを選んでその反転費用を初回だけ払える。移動前後の色が等しい遷移だけを許せば経路全体が単色になる。任意の経路と反転集合はこの遷移列を一意に定め、任意の遷移列から対応する経路と反転集合を復元できるため、最小費用DPが答えを与える。","sourceRevisionIds":["source-abc264-f-problem-a49a4475102768a9fa99c60715edf21004bb6dbaca713d6223d205dd858d48c6","source-abc264-editorial-4588-1142d2110429e09e1541685a676a3524b7a47216f3b07f87a2ec53a643d1c694"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

同じ行・列を二回反転する意味はなく、各行flip r_i と各列flip c_j の0/1だけを決めれば最終色は A_{i,j} XOR r_i XOR c_j になる。

右下へ進むpathでは新しい行へ初めて入るのは下移動、新しい列へ初めて入るのは右移動なので、その瞬間に対応flipを決められる。

棄却する候補: 全ての行・列の反転集合を列挙し、単色pathの存在を調べる。

反転選択が2^{H+W}通りあり、path探索以前に列挙不能である。

採用する候補: 目標色 t を固定し、dp[i][j][r][c] を現在行・列のflipが r,c で単色pathを作る最小費用として右・下へ遷移する。

次セルで既知なのは共有する現在行または列のflipだけで、新規側のflipは目標色条件から選べるため4状態へ圧縮できる。

下へ進むと列flip c は保存され、新行flip r' を選んで A_{i+1,j} XOR r' XOR c=t を満たし、r'=1ならR_{i+1}を払う。右移動も対称である。

白pathと黒pathは目標色 t=0,1 の同じDPで求められ、その小さい方が答えになる。

## 典型の発動条件

### 行列反転の XOR モデル

発動条件: 行・列を反転する操作があり、各マスへの作用が二つの選択のparityで決まるとき。

各操作有無をbitにし、最終セル値を元値とのXORで表す。

### 単調path上のfrontier DP

発動条件: 右下へ進む際、過去の行列選択のうち現在行・列だけが次セルに影響するとき。

現在行flipと現在列flipだけを状態に残し、新しい行・列へ入る時に費用を払う。

## 問題固有の要素

path外の行列反転は単色pathの成立に寄与せず費用が正なので、DPで初めて訪れる行・列だけを決めれば十分である。

別の問題へ持ち帰る視点: 存在する一経路だけが重要な正費用操作では、経路に接しないglobal decisionsを最適解から除ける。

## 正当性

右・下へ進む経路は各行・各列へ最初に入る時点が一回だけである。現在の行反転bitと列反転bitを持つと現在色が決まり、右へ進む際に新列bit、下へ進む際に新行bitを選んでその反転費用を初回だけ払える。移動前後の色が等しい遷移だけを許せば経路全体が単色になる。任意の経路と反転集合はこの遷移列を一意に定め、任意の遷移列から対応する経路と反転集合を復元できるため、最小費用DPが答えを与える。

## 実装上の注意

- 始点では r,c の4通りを試し、A_{1,1} XOR r XOR c=t のものへ rR_1+cC_1 を設定する。
- 費用和は64 bit整数、到達不能値は十分大きいINFとし、必要なら行ごとのrolling arrayでメモリを抑える。

## 復習の核

- 行列flip問題では、現在セルの最終色を決めるparityのうち次の移動へ持ち越すものだけを状態に残す。
- 単色条件は隣接一致として曖昧に持たず、目標色を0/1で固定すると遷移条件を単純化できる。

## 計算量と制約

### 時間

O(HW)、各cellは行/列flipの四状態と二目標色。

### 空間

O(HW)、rolling行ならO(W)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H, W \leq 2000; 1 \leq R_i \leq 10^9; 1 \leq C_j \leq 10^9; A_{i, j} \in \lbrace 0, 1\rbrace; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/tasks/abc264_f) — source-abc264-f-problem-a49a4475102768a9fa99c60715edf21004bb6dbaca713d6223d205dd858d48c6
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/editorial/4588) — source-abc264-editorial-4588-1142d2110429e09e1541685a676a3524b7a47216f3b07f87a2ec53a643d1c694
