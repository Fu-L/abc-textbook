---
title: "ABC303-F — Damage over Time"
draft: true
authoringUnit: {"problemId":"abc303-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-and-search-threshold/outcome-prove-and-search-threshold-shard-002/abc303-f.md","learningOutcomeIds":["outcome-prove-and-search-threshold"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-integer-boundary-blocks"],"excludedTopics":["連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。"],"tagIds":["tag-monotone-threshold-search","tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc303-editorial-6443-30e1ebea1a4af726c45725dc3445b91467b44bfff76be07d0ade4e955c1baa4c","source-abc303-f-problem-a0f85dd8f4276fa524adc23cb037fe16e63d4a043ad917475e730fd1a41d89d7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"tの昇順境界間では、t_j>iのspellはi·d_j、t_j≤iのspellはt_jd_jを与える。したがってsuffix最大D=max d_jとprefix最大P=max t_jd_jを持てばF(i)=max(iD,P)であり、交点の前後を等差数列と定数列として総和できる。 各区間でF(i)が一次式i·Dと定数Pの最大に限られ、巨大な答え時刻まで一ターンずつ進めず累積damageを計算できる。","sourceRevisionIds":["source-abc303-editorial-6443-30e1ebea1a4af726c45725dc3445b91467b44bfff76be07d0ade4e955c1baa4c","source-abc303-f-problem-a0f85dd8f4276fa524adc23cb037fe16e63d4a043ad917475e730fd1a41d89d7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md)

- 判定の単調性を証明し、二分探索の成功側・失敗側を設定できる。

先に読む単元:

- [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md) — floorや整数根の値が変わる境界を正確に求め、同値な整数範囲をまとめて処理する。

この解説で扱わないこと:

- 連続窓の両端を一方向に進める尺取り法、および真偽判定の単調境界を持たない三分探索・局所探索。

## 考察

討伐時点からiターン前にspell jを使った一回分の累積damageはmin(i,t_j)d_jである。同じターンでは最大のspellを選べるため、i番目の最適寄与はF(i)=max_j min(i,t_j)d_jとなる。

採用する候補: tの境界ごとにF(i)の包絡線を区間和する

棄却する候補: 各ターンで全spellのdamageを評価する

必要ターン数Hもspell数Nも大きく、O(NH)では制約を満たさない。

spellをtで整理し、suffixの最大dとprefixの最大tdを用意する。tの連続する境界区間を走査し、PとiDの交点で区間を分けてFの和を加える。Hへ初めて到達する区間では累積和がH以上となる最小iを二分探索し、必要ターン数を返す。

## 典型の発動条件

### 区分線形な上側包絡線

発動条件: max_j min(i,t_j)d_jが、breakpoint t_jを境に式を変える。

各t区間で増加直線の最大と飽和定数の最大だけを残し、max(iD,P)へ圧縮する。

### 区間和と境界二分探索

発動条件: 時刻上限が巨大だが、damage列が区間ごとに単純な式で単調累積する。

等差和を一括加算し、目標Hを跨ぐ最後の区間だけ最初の到達時刻を二分探索する。

## 問題固有の要素

現在時刻からのdamageを追うより、終了時点から何ターン残っているかで一回のspellをmin(i,t)dと書くと、各ターンの最適選択が独立な最大値になる。

別の問題へ持ち帰る視点: 継続効果の最適化は終点からの残存時間で寄与を表し直すと、時系列依存を包絡線へ変換できることがある。

## 正当性

tの昇順境界間では、t_j>iのspellはi·d_j、t_j≤iのspellはt_jd_jを与える。したがってsuffix最大D=max d_jとprefix最大P=max t_jd_jを持てばF(i)=max(iD,P)であり、交点の前後を等差数列と定数列として総和できる。 各区間でF(i)が一次式i·Dと定数Pの最大に限られ、巨大な答え時刻まで一ターンずつ進めず累積damageを計算できる。

## 実装上の注意

- tが同じspellは境界処理前に最大値へ統合する。td、iD、区間和は64bitを超え得るので128bit相当を使い、区間端の包含と交点のfloor/ceilを統一する。

## 復習の核

- 小さいt,HでターンごとのFを直接列挙し、P=iDの一致点、同じt、単一spell、答えがt境界上になる場合を区間和と比較する。

## 計算量と制約

### 時間

O(N log N+log H)、spell sortと区間和、最後の区間内二分探索。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 3 \times 10^5; 1 \leq H \leq 10^{18}; 1 \leq t_i,d_i \leq 10^9; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/editorial/6443) — source-abc303-editorial-6443-30e1ebea1a4af726c45725dc3445b91467b44bfff76be07d0ade4e955c1baa4c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc303/tasks/abc303_f) — source-abc303-f-problem-a0f85dd8f4276fa524adc23cb037fe16e63d4a043ad917475e730fd1a41d89d7
