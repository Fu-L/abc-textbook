---
title: "ABC260-G — Scalene Triangle Area"
draft: true
authoringUnit: {"problemId":"abc260-g","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc260-g.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference"],"sourceRevisionIds":["source-abc260-g-problem-73b3acd1300eb54732b0a3b6005ff93bc1b32699d9c289226c60fb1a2897f67d","source-abc260-editorial-4457-ea71f1cf715860eb7d2802e9bf012841420ffe11ab6158ae825429565cb4834c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"水平区間の開始印は (s,t) から下へ M 行続き、終了印は (s,t＋2M),(s＋1,t＋2M−2),… と傾き二の対角線を進む。 縦・斜めの差分をそれぞれ累積して水平差分配列へ合算し、各行を左から累積すれば全三角形の重ね合わせになる。 三角形一個を定数個の印へ変換でき、二種類の境界を復元した後は全マスの被覆数が一括で得られる。","sourceRevisionIds":["source-abc260-g-problem-73b3acd1300eb54732b0a3b6005ff93bc1b32699d9c289226c60fb1a2897f67d","source-abc260-editorial-4457-ea71f1cf715860eb7d2802e9bf012841420ffe11ab6158ae825429565cb4834c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

この解説で扱わないこと:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

コマ (s,t) が行 u=s+d で覆う列は、d≥0 に対して t から t＋2M−1−2d までの連続区間になる。

各行の区間へ水平 imos を行うなら、左端の +1 は縦線上、右端の次の −1 は一行下がるごとに二列左へ動く斜線上に並ぶ。

棄却する候補: 各コマから覆う全マスを走査して被覆数を一つずつ増やす。

コマが二乗個近くあり、一個の三角形も二乗面積を持ち得るため重複更新が大きすぎる。

採用する候補: 左境界を縦方向差分、右境界を遷移 (i−1,j＋2) から伝播する斜め差分で置き、最後に水平方向の累積和を取る。

三角形一個を定数個の印へ変換でき、二種類の境界を復元した後は全マスの被覆数が一括で得られる。

水平区間の開始印は (s,t) から下へ M 行続き、終了印は (s,t＋2M),(s＋1,t＋2M−2),… と傾き二の対角線を進む。

縦・斜めの差分をそれぞれ累積して水平差分配列へ合算し、各行を左から累積すれば全三角形の重ね合わせになる。

非軸平行な格子三角形を、境界方向ごとに異なる prefix operator を持つ multidirectional imos として加算する。

具体的にはN×N盤面を0-basedで扱い、各Oの位置(s,t)に対して二配列V,Dを0から次の四点だけ更新する。

V[s][t]+=1、V[s+M][t]−=1、D[s][t+2M]−=1、D[s+M][t]+=1。

Vは縦にV[u][v]+=V[u−1][v]、Dは斜めにD[u][v]+=D[u−1][v+2]で復元する。Dの負の印はM行だけ伝播し、(s+M,t)の正の印でその先を打ち消す。各行でV[u][v]+D[u][v]を左から累積すれば、列t≤v<t+2M−2(u−s)にだけ1が立つ。

更新印を収める行N+M、列N+2M程度の領域を確保する。入力のNはコマ数ではなく盤面の一辺で、Oの数は最大N²。全盤面を走査して四点更新し、質問(X_i,Y_i)の被覆数を取り出す。

## 典型の発動条件

### 多方向 imos 法

発動条件: 同じ形の斜辺付き領域を大量に加算し、境界が少数の格子方向へ揃っているとき。

各境界の方向に対応する差分配列を作り、それぞれの方向へ累積してから合成する。

### 水平区間への境界分解

発動条件: 各行との交差が一つの連続区間になる図形を一括加算するとき。

各行の左端へ +1、右端の次へ −1 を生成し、最後に行方向の累積和を取る。

## 問題固有の要素

不等式を 2(u−s)+(v−t)<2M と整数化すると、斜辺の列が一行ごとにちょうど二つずれることが明確になる。

別の問題へ持ち帰る視点: 分数係数を含む格子領域は整数倍して、境界の離散的なステップ方向を先に抽出する。

## 正当性

水平区間の開始印は (s,t) から下へ M 行続き、終了印は (s,t＋2M),(s＋1,t＋2M−2),… と傾き二の対角線を進む。 縦・斜めの差分をそれぞれ累積して水平差分配列へ合算し、各行を左から累積すれば全三角形の重ね合わせになる。 三角形一個を定数個の印へ変換でき、二種類の境界を復元した後は全マスの被覆数が一括で得られる。

## 実装上の注意

- 斜め累積は diag[i][j]+=diag[i−1][j＋2] の向きで行い、走査順と配列添字をこの依存関係に合わせる。
- t＋2M や s＋M の印は盤外へ出ても後で盤内へ伝播し得るため、M を含めた十分大きな余白を確保する。

## 復習の核

- 斜め図形の領域加算は、各行の区間端点がどの格子方向へ移動するかを描いて差分方向を決める。
- 複数方向の imos では、各中間配列が最終のどの境界印を生成するかを分けて不変条件を置く。

## 計算量と制約

### 時間

Nは盤面の一辺。Oの位置の列挙O(N²)、四点更新は各OにO(1)、余白を含む累積O((N+M)(N+2M))、照会O(Q)。M≤2Nより全体O(N²+Q)。

### 空間

余白込みの二差分配列と被覆数でO((N+M)(N+2M))=O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: N, M, X_i, Y_i, and Q are integers.; 1 \le N \le 2000; 1 \le M \le 2 \times N; S_i consists of O and X.; 1 \le Q \le 2 \times 10^5; 1 \le X_i,Y_i \le N

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/tasks/abc260_g) — source-abc260-g-problem-73b3acd1300eb54732b0a3b6005ff93bc1b32699d9c289226c60fb1a2897f67d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/editorial/4457) — source-abc260-editorial-4457-ea71f1cf715860eb7d2802e9bf012841420ffe11ab6158ae825429565cb4834c
