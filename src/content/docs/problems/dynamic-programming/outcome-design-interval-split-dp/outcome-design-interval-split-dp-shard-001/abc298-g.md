---
title: "ABC298-G — Strawberry War"
draft: true
authoringUnit: {"problemId":"abc298-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc298-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-dp-state-design","unit-prefix-aggregate"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp","tag-bounded-enumeration","tag-prefix-difference"],"sourceRevisionIds":["source-abc298-editorial-6212-714fee5065565dad928d724e4d246c759083fd6f70b57311491a155320dfdaa2","source-abc298-g-problem-4aa32cffef2a254d7c9397481059a8a0e4669ca3c79d27ec3102535408f5aec5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最後に使った切線を固定すると二つの長方形ができ、それぞれの内部の切り方は独立である。最小piece和の下限aを固定したDPでは、未切断pieceは和≥aの時だけ許し、切断では二部分の最適最大piece和のmaxを最小化する。切線と片数配分を全列挙するので全guillotine分割を覆い、逆に全遷移は実行可能な切り方を表す。最適解の最小piece和はどれかの長方形和なので、全長方形和aを試せばその解も候補に入り、求める最小max−minが得られる。","sourceRevisionIds":["source-abc298-editorial-6212-714fee5065565dad928d724e4d246c759083fd6f70b57311491a155320dfdaa2","source-abc298-g-problem-4aa32cffef2a254d7c9397481059a8a0e4669ca3c79d27ec3102535408f5aec5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

先に読む単元:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md) — 候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

## 考察

各最終pieceは部分長方形で、そのイチゴ数最小値は全部分長方形和の有限候補集合に含まれる。

採用する候補: 最小値候補列挙＋長方形分割DP

下限aを固定すれば、m片へ切った最大piece和の最小値を長方形・片数DPで求め、max-minを評価できる。

棄却する候補: 全切断順を列挙

切断位置と順の分岐が指数的。

最後の一切りは水平または垂直で二長方形へ分かれるため、片数配分を列挙すればoptimal substructureが成立する。

2D prefix和で全長方形和候補aを列挙する。各aごとにdp[rect][m]を、m=1は和≥aなら和、m>1は全切線・片数分割のmax(dp1,dp2)最小として計算しdp[whole][T+1]-aを最小化する。

## 典型の発動条件

### guillotine partition DP

発動条件: 長方形を直線切断で所定個数へ分割する。

最後の切断と片数配分で区間DPする。

### 最小値候補固定

発動条件: 目的がmax(piece)-min(piece)。

minを実現可能な部分長方形和に固定してmaxを最小化する。

## 問題固有の要素

H,W≤6なら高次多項式でも、実在するpiece和だけを下限候補にし状態の不可能条件で強く枝刈りできる。

別の問題へ持ち帰る視点: 小盤面最適分割は最後のcutと目的値固定を組み合わせる。

## 正当性

最後に使った切線を固定すると二つの長方形ができ、それぞれの内部の切り方は独立である。最小piece和の下限aを固定したDPでは、未切断pieceは和≥aの時だけ許し、切断では二部分の最適最大piece和のmaxを最小化する。切線と片数配分を全列挙するので全guillotine分割を覆い、逆に全遷移は実行可能な切り方を表す。最適解の最小piece和はどれかの長方形和なので、全長方形和aを試せばその解も候補に入り、求める最小max−minが得られる。

## 実装上の注意

- T回切断はT+1片。rect面積<mを除外し、INF状態のmax加算を避ける。全体の苺数は最大36×10^16なので符号付き64 bitで持つ。

## 復習の核

- 小盤面の全guillotine切断と比較し、T=0相当基底、全0、一cell大値、片数=面積を確認する。

## 計算量と制約

### 時間

O(R²(H+W)T²)、R=H(H+1)W(W+1)/4、下限候補R個×長方形/片数/最後の切線DP。

### 空間

O(RT+HW)、下限一つ分のDP。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W \leq 6; 1 \leq T \leq HW-1; 0 \leq s_{i,j} \leq 10^{16}; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/editorial/6212) — source-abc298-editorial-6212-714fee5065565dad928d724e4d246c759083fd6f70b57311491a155320dfdaa2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc298/tasks/abc298_g) — source-abc298-g-problem-4aa32cffef2a254d7c9397481059a8a0e4669ca3c79d27ec3102535408f5aec5
