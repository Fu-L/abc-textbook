---
title: "ABC367-E — Permute K times"
draft: true
authoringUnit: {"problemId":"abc367-e","docPath":"src/content/docs/problems/graph-search/outcome-jump-deterministic-transition/outcome-jump-deterministic-transition-shard-001/abc367-e.md","learningOutcomeIds":["outcome-jump-deterministic-transition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["doubling・binary liftingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-binary-lifting"],"sourceRevisionIds":["source-abc367-e-problem-ee4a7e33c3e0527687a3ff0327ae52d41f34616b5b5f22a2144cbb87b07b56e8","source-abc367-editorial-10707-9b0092098f46b0b3a8d74b217af06864ebabd9c9a95f8c17dd68f5bfb69b23f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各操作後の位置iは旧X_iを参照する。二回分はX_{X_i}なのでjump倍化がsource indexを正しく合成する。Kのbitに従う合成で元列の参照位置を得る。K=0は恒等なので元列をそのまま返す。","sourceRevisionIds":["source-abc367-e-problem-ee4a7e33c3e0527687a3ff0327ae52d41f34616b5b5f22a2144cbb87b07b56e8","source-abc367-editorial-10707-9b0092098f46b0b3a8d74b217af06864ebabd9c9a95f8c17dd68f5bfb69b23f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [doubling・binary lifting](src/content/docs/learn/graph/binary-lifting.md)

- 一意な遷移の2の冪回先を前計算し、巨大回数後の状態または区間到達を求められる。

## 考察

一回の操作後の位置iには元のX_i番目の要素が来るため、操作は値ではなくsource index写像P(i)=X_iとして合成できる。2^k回後のsource写像P_kはP_k(i)=P_{k−1}(P_{k−1}(i))で得られ、Kのbinary digitごとに必要な写像だけ合成できる。P_k[i]は「現在のiから移る先」ではなく「最終位置iへ元のどのindexが来るか」であり、合成の参照順をこの定義に合わせる。K=0では恒等写像Q_i=iのままで、答えは元列Aになる。

採用する候補: source index写像のdoubling tableを作り、Kの立ったbitを恒等写像へ合成して最終indexを得る。

Kが10^18でも必要な合成段数はbit数だけで、全位置を同時に追跡できる。

棄却する候補: 数列を実際にK回並べ替える。

一回は線形でもKが巨大で、同じpermutation写像の反復構造を使えていない。

K=0では恒等写像Q_i=iのままで、答えは元列Aになる。

P[0]=Xとし、k=1..59でP[k][i]=P[k−1][P[k−1][i]]を作る。Q_i=iから始め、Kのk bitが1ならQ_i=P[k][Q_i]へ全位置を更新する。最後に各iへA[Q_i]を出力する。

## 典型の発動条件

### 写像のdoubling

発動条件: 固定の関数・permutationを巨大回数適用するとき。

2冪回の合成tableを自己合成で構築する。

### binary decompositionによる写像合成

発動条件: 任意回数の反復を2冪のprecomputeから組み立てるとき。

恒等写像へKのset bitに対応する写像を順次合成する。

## 問題固有の要素

数列の値を更新する代わりに、各出力位置のsource indexだけを追えばAの内容に依存しない前計算になる。

別の問題へ持ち帰る視点: rearrangement反復ではpayloadとindex mappingを分離する。

## 正当性

各操作後の位置iは旧X_iを参照する。二回分はX_{X_i}なのでjump倍化がsource indexを正しく合成する。Kのbitに従う合成で元列の参照位置を得る。K=0は恒等なので元列をそのまま返す。

## 実装上の注意

- 1-index/0-indexをtable全体で統一し、Q更新をin-placeしてよい合成方向か確かめる。Kの最上位bitまで64 bitで走査する。

## 復習の核

- 一回・二回操作した小配列を手で追い、P[P[i]]の順序が定義どおりか確認する。K=0も独立に試す。

## 計算量と制約

### 時間

長さ N、操作回数 K。source index写像の倍増で O(N log(K+1))。

### 空間

全jump表 O(N log(K+1))、現在段のみ倍化なら O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 2 \times 10^5; 0 \le K \le 10^{18}; 1 \le X_i \le N; 1 \le A_i \le 2 \times 10^5

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc367/tasks/abc367_e) — source-abc367-e-problem-ee4a7e33c3e0527687a3ff0327ae52d41f34616b5b5f22a2144cbb87b07b56e8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc367/editorial/10707) — source-abc367-editorial-10707-9b0092098f46b0b3a8d74b217af06864ebabd9c9a95f8c17dd68f5bfb69b23f7
