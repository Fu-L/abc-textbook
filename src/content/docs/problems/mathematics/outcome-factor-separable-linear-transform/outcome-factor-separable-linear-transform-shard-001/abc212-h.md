---
title: "ABC212-H — Nim Counting"
draft: true
authoringUnit: {"problemId":"abc212-h","docPath":"src/content/docs/problems/mathematics/outcome-factor-separable-linear-transform/outcome-factor-separable-linear-transform-shard-001/abc212-h.md","learningOutcomeIds":["outcome-factor-separable-linear-transform"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-game","unit-modular-arithmetic"],"excludedTopics":["分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-linear-transform","tag-game-grundy-dp","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc212-editorial-2359-f9d87ccd5416d18dffb837aeec421ac629ded4d482abbc978a9039a7e7de81bc","source-abc212-h-problem-6d59df27e1ea2613396368476fb4fd191681ddd9c65d0af29f3e91fed9a03e93"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"長さmのXOR分布は許容値の指示配列のm回XOR畳み込みで、Walsh–Hadamard変換後は各成分のm乗になる。変換先でm=1..Nを合計して戻すと全長の分布を得る。添字0だけがNimの敗北局面なので総列数から引けば勝ち局面だけ残る。","sourceRevisionIds":["source-abc212-editorial-2359-f9d87ccd5416d18dffb837aeec421ac629ded4d482abbc978a9039a7e7de81bc","source-abc212-h-problem-6d59df27e1ea2613396368476fb4fd191681ddd9c65d0af29f3e91fed9a03e93"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離可能線形変換・Walsh–Hadamard変換](src/content/docs/learn/combinatorics-algebra/separable-linear-transform.md)

- Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 分離可能線形変換・Walsh–Hadamard変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各山から一個以上の石を取れる通常の Nim なので、先手が負ける必要十分条件は全ての山サイズの排他的論理和が 0 になることである。

許される山サイズの指示配列を C とすると、山が M 個のときの排他的論理和別の列数は C の M 回 XOR 畳み込みになる。

棄却する候補: 山数を一つずつ増やし、各時点の XOR 値と全ての許可サイズを組み合わせる DP を行う。

山数ごとに XOR 状態と K 種類のサイズを掛け合わせるため、N と値域が大きい制約には収まらない。

採用する候補: Walsh–Hadamard 変換で XOR 畳み込みを成分ごとの積へ変え、各成分で 1 個から N 個までの冪和を求める。

山数ごとの畳み込みを反復せず、変換後の各座標で等比数列を計算して一度だけ逆変換できる。

求める勝ち局面を直接数えるより、総列数から XOR が 0 の負け局面数を引くと Nim の判定条件をそのまま使える。

山数が固定でなく 1 から N までである点は、変換後の各値 v に対する v＋v²＋…＋vᴺ という冪和に吸収できる。

Nim の敗北条件を XOR 畳み込みの添字 0 の係数へ翻訳し、XOR 変換領域で可変長列の冪和をまとめて評価してから逆変換する。

## 典型の発動条件

### Nim 和による勝敗判定

発動条件: 複数の山から一山だけ選んで正の個数を減らす通常プレイのゲームを扱うとき。

全山サイズの XOR が 0 の列を後手勝ちとして数え、全ての列から差し引く。

### XOR 畳み込みと Walsh–Hadamard 変換

発動条件: 選択値の XOR ごとの組合せ数を求め、同じ分布の畳み込みを何度も重ねるとき。

許可サイズの指示配列を変換し、座標ごとの冪和を計算して逆変換後の添字 0 を読む。

## 問題固有の要素

山数 1 から N の答えを個別に作らず、変換後の一座標では全山数の寄与が単なる有限等比級数になる。

別の問題へ持ち帰る視点: 同じ畳み込み核を回数違いで合算する問題は、対角化後に冪の和として一括計算できないか検討する。

## 正当性

長さmのXOR分布は許容値の指示配列のm回XOR畳み込みで、Walsh–Hadamard変換後は各成分のm乗になる。変換先でm=1..Nを合計して戻すと全長の分布を得る。添字0だけがNimの敗北局面なので総列数から引けば勝ち局面だけ残る。

## 実装上の注意

- 変換長は全ての A_i を添字に持てる 2 の冪とし、逆変換では長さの逆元による正規化を行う。
- 変換値が 0 や 1 の場合も有限冪和を正しく扱い、分母 v−1 の逆元を無条件に取らない。

## 復習の核

- 山の個数やサイズの列挙へ進む前に、まずゲーム理論側で負け局面を一つの代数条件へ絞り込む。
- 演算が通常の加算ではなく XOR なら、通常畳み込みではなく XOR 畳み込みを対角化する変換を想起する。

## 計算量と制約

### 時間

O(B log B+B log N)、B=2^16。冪和を各成分で二分累乗する。

### 空間

O(B)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 1 \leq K < 2^{16}; 1 \leq A_i < 2^{16}; All A_i are distinct.; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/editorial/2359) — source-abc212-editorial-2359-f9d87ccd5416d18dffb837aeec421ac629ded4d482abbc978a9039a7e7de81bc
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc212/tasks/abc212_h) — source-abc212-h-problem-6d59df27e1ea2613396368476fb4fd191681ddd9c65d0af29f3e91fed9a03e93
