---
title: "ABC258-E — Packing Potatoes"
draft: true
authoringUnit: {"problemId":"abc258-e","docPath":"src/content/docs/problems/hybrid/outcome-maintain-monotone-window/outcome-maintain-monotone-window-shard-001/abc258-e.md","learningOutcomeIds":["outcome-maintain-monotone-window"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-functional-graph-decomposition"],"excludedTopics":["値域上の真偽境界を探す二分探索・パラメトリックサーチ。"],"tagIds":["tag-two-pointers-window","tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc258-e-problem-0364fdbf688afacf3ea02f0bfc43da2acc99ce5dd8a122b17d767aff74275084","source-abc258-editorial-4215-8032ea71bad48ab39a21683e9c46e7343d183f364d135e122f077ea621e02973"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"総重量Sの一周をfloor(X/S)回必ず入れられ、そのqN個を全C_iへ加えた後は余りX mod S<Sだけを二周配列上の尺取法で補う。 始点0からは高々N頂点で再訪が起きるため、問い合わせのK-1遷移を前周期長と閉路長の剰余へ写せる。 Xを総重量の整数周と余りへ分ければ全C_iを線形時間で求められ、実際に辿る頂点列の前周期・閉路から巨大Kへ定数時間で答えられる。","sourceRevisionIds":["source-abc258-e-problem-0364fdbf688afacf3ea02f0bfc43da2acc99ce5dd8a122b17d767aff74275084","source-abc258-editorial-4215-8032ea71bad48ab39a21683e9c46e7343d183f364d135e122f077ea621e02973"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

- 一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

対象外:

- 値域上の真偽境界を探す二分探索・パラメトリックサーチ。

## 考察

周期列で箱に入る個数C_iは先頭の種類iだけで決まり、箱を閉じた後の次種類は(i+C_i) mod Nなので、箱列はN頂点functional graph上の歩行になる。

採用する候補: 全周期分を分離した円環尺取法と始点0からの周期検出

棄却する候補: 各質問についてK番目の箱まで逐次シミュレート

Kは最大10^12で、Qも2×10^5あるため反復できない。

q=floor(X/S), rem=X mod Sとし、二周したW上の二点法でrem以上にする追加個数を各iへ求めてC_i=qN+追加数とする。next[i]=(i+C_i) mod Nを作り、0からの頂点列と閉路開始を記録して各K_i-1位置のCを返す。

## 典型の発動条件

### 円環尺取法

発動条件: 正の周期重み列で各始点から閾値へ達する最短長を全始点について求めたい。

完全周を除いた閾値に対し、二周配列上で右端を単調に動かす。

### functional graphの前周期・閉路

発動条件: 決定的遷移を巨大回数反復した位置へ多数問い合わせが来る。

始点から初回再訪までの列を作り、閉路部分を剰余で参照する。

## 問題固有の要素

箱の中身そのものではなく「次の箱を始める種類」だけを状態にすると、無限のじゃがいも列がN状態の関数反復になる。

別の問題へ持ち帰る視点: 周期入力の閾値分割では、各区間長を状態遷移にしてから反復列の周期性を使う。

## 正当性

総重量Sの一周をfloor(X/S)回必ず入れられ、そのqN個を全C_iへ加えた後は余りX mod S<Sだけを二周配列上の尺取法で補う。 始点0からは高々N頂点で再訪が起きるため、問い合わせのK-1遷移を前周期長と閉路長の剰余へ写せる。 Xを総重量の整数周と余りへ分ければ全C_iを線形時間で求められ、実際に辿る頂点列の前周期・閉路から巨大Kへ定数時間で答えられる。

## 実装上の注意

- XがSの倍数でrem=0なら追加個数は0としC_i=qNになる。C_iとK_iは64ビットで保持し、質問はK_i番目の箱なので遷移回数はK_i-1である。

## 復習の核

- 小さい周期列の長期シミュレーションと比較し、X<S、X=S、XがSの倍数、全重み同値、前周期を持つnext列を確認する。

## 計算量と制約

### 時間

O(N+Q)、正重み尺取でnextを構築し0から前周期・閉路を分解。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, Q \leq 2 \times 10^5; 1 \leq X \leq 10^9; 1 \leq W_i \leq 10^9 \, (0 \leq i \leq N - 1); 1 \leq K_i \leq 10^{12} \, (1 \leq i \leq Q); All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/tasks/abc258_e) — source-abc258-e-problem-0364fdbf688afacf3ea02f0bfc43da2acc99ce5dd8a122b17d767aff74275084
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc258/editorial/4215) — source-abc258-editorial-4215-8032ea71bad48ab39a21683e9c46e7343d183f364d135e122f077ea621e02973
