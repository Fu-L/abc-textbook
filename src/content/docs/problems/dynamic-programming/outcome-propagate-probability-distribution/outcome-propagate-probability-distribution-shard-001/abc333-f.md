---
title: "ABC333-F — Bomb Game 2"
draft: true
authoringUnit: {"problemId":"abc333-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-propagate-probability-distribution/outcome-propagate-probability-distribution-shard-001/abc333-f.md","learningOutcomeIds":["outcome-propagate-probability-distribution"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-dp-transition-optimization","unit-modular-arithmetic"],"excludedTopics":["二人零和ゲームの勝敗・Grundy数。"],"tagIds":["tag-stochastic-expectation-dp","tag-dp-transition-acceleration","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc333-editorial-7948-878d3c4235c73de09b12d30fc039195e9b1841d59732fe12bea2294109950431","source-abc333-f-problem-5cc10600d7c767aafc3b18bc813406a6568df55bfe456eb9dcd8c41c7789f235"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"人数mで最初に除かれる位置kまでに先頭側の人が失敗する確率を幾何級数で足すと `p^k/(1−p^m)` になる。各除去後の残りは人数m−1の同じ過程なので、この重みで旧rowを回転・加重したものが新rowである。`new[0]` は旧row全体の重み付き和を式どおりに計算し、隣接項は `new[j+1]=p(new[j]+old[j])` に変形できるため、全位置の確率を正しく得る。","sourceRevisionIds":["source-abc333-editorial-7948-878d3c4235c73de09b12d30fc039195e9b1841d59732fe12bea2294109950431","source-abc333-f-problem-5cc10600d7c767aafc3b18bc813406a6568df55bfe456eb9dcd8c41c7789f235"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [確率過程・期待値DP](src/content/docs/learn/dynamic-programming/dp-stochastic.md)

- 互いに排反な状態に確率を配り、遷移確率・吸収条件・総確率を保って分布や到達確率を計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md) — 正しい状態と遷移を作った後、共通項の因数分解や集約で同じDPを高速化する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

この解説で扱わないこと:

- 二人零和ゲームの勝敗・Grundy数。

## 考察

m人いる間に位置kが最初に除かれる確率は、各周の失敗をまとめて `p^k/(1−p^m)` と書ける（`p=1/2`）。この位置の人を除いた後はm−1人の分布へ移るので、全位置の寄与を足せば次のrowが得られる。

隣接する出力位置の式を比べると、重み付き和は `new[j+1]=p·new[j]+p·old[j]` で更新できる。したがって全和を計算するのは `new[0]` の一回だけでよい。

採用する候補: 人数と先頭からの位置の確率DPを、最初の位置の全和と隣接漸化式でO(N²)に計算する。

各rowの残りは定数時間で埋まり、三重ループを避けられる。

棄却する候補: 各状態から全ての除去位置へ遷移する。

O(N²)状態それぞれにO(N)の和を計算するとO(N³)になる。

## 典型の発動条件

### 吸収までの無限等比級数

発動条件: 同じ列配置が一周ごとに確率p^iを掛けて再訪される。

一周内で位置kが除かれる確率を1/(1-p^i)で正規化する。

### DP遷移のsliding更新

発動条件: 隣接する出力状態の畳み込み重みが一段shiftし、一項だけ出入りする。

new[0]だけ全和を計算し、new[j+1]をnew[j]とold[j]から定数時間で更新する。

## 問題固有の要素

確率過程を一操作ずつ追わず「現在人数から最初に誰が消えるか」までまとめると、人数が一つ減る有限DPへ変換できる。

別の問題へ持ち帰る視点: 自己loopを含む確率過程は、次に状態が本質的に変化する時点までを幾何級数で吸収するとDAG状DPにできる。

## 正当性

人数mで最初に除かれる位置kまでに先頭側の人が失敗する確率を幾何級数で足すと `p^k/(1−p^m)` になる。各除去後の残りは人数m−1の同じ過程なので、この重みで旧rowを回転・加重したものが新rowである。`new[0]` は旧row全体の重み付き和を式どおりに計算し、隣接項は `new[j+1]=p(new[j]+old[j])` に変形できるため、全位置の確率を正しく得る。

## 実装上の注意

- 0始まりのold indexで `new[0]=Σ_{j=0}^{m−2} p^{m−j} old[j]/(1−p^m)` とする。`m=2` なら係数は `p²/(1−p²)=1/3`、残りの確率は `2/3`。
- `p=1/2` はmod 998244353上の逆元として扱い、rowを作るときは一つ前の人数のoldを参照する。

## 復習の核

- N=2を手計算の(1/3,2/3)と照合し、各Nで確率総和が1になること、O(N^3)の直接遷移と小Nで一致することを確認する。

## 計算量と制約

### 時間

O(N²)、人数mのrow先頭O(m)、残位置はO(1)shift更新。

### 空間

O(N)、rolling二row。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 3000; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/editorial/7948) — source-abc333-editorial-7948-878d3c4235c73de09b12d30fc039195e9b1841d59732fe12bea2294109950431
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc333/tasks/abc333_f) — source-abc333-f-problem-5cc10600d7c767aafc3b18bc813406a6568df55bfe456eb9dcd8c41c7789f235
