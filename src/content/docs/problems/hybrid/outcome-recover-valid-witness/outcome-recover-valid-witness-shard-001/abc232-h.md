---
title: "ABC232-H — King's Tour"
draft: true
authoringUnit: {"problemId":"abc232-h","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc232-h.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-normalization"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-state-normalization"],"sourceRevisionIds":["source-abc232-editorial-3140-33bcd41478c7207b82cce3e1b87b03d84419cf4186633cc501442bbc51c6e634","source-abc232-h-problem-2fa16046cc8b2129e81b3850e6db5071ad203b31aa25ee42c6f09f75104425cd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"S＝第一列全体と (H,2) を通る経路の末尾は、第一列を除いて上下反転した残り盤面の左上角に対応する。 終点が S 内にある場合は行列を転置すると、同じ形の境界が終点を含まない向きへ交換できる。 各段階で訪問済み帯と残りが一つの長方形になり、開始角と指定終点を保つ同じ問題へ縮小できる。","sourceRevisionIds":["source-abc232-editorial-3140-33bcd41478c7207b82cce3e1b87b03d84419cf4186633cc501442bbc51c6e634","source-abc232-h-problem-2fa16046cc8b2129e81b3850e6db5071ad203b31aa25ee42c6f09f75104425cd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

キングは縦横だけでなく斜めにも一マス動けるため、幅 2 の帯では上下を交互に通る経路と端を回る経路を柔軟につなげられる。

任意終点へ合わせた全盤面の蛇行を直接場合分けすると端・角の例外が増えるが、外周の細い経路を先に通れば一辺短い同型問題が残る。

棄却する候補: 行ごとの通常の蛇行順を作り、末尾を指定マスへ局所的に入れ替える。

終点が内部や端にある場合に未訪問領域が分断され、局所修正だけでは全マス一回訪問を保証できない。

採用する候補: 幅 2 を明示構成の基底とし、指定終点を避ける L 字境界 S を先に訪問して、転置・反転した小さい長方形へ再帰する。

各段階で訪問済み帯と残りが一つの長方形になり、開始角と指定終点を保つ同じ問題へ縮小できる。

S＝第一列全体と (H,2) を通る経路の末尾は、第一列を除いて上下反転した残り盤面の左上角に対応する。

終点が S 内にある場合は行列を転置すると、同じ形の境界が終点を含まない向きへ交換できる。

長方形 Hamilton path の構成不変条件を「左上開始・任意の別終点」とし、対称変換で終点を境界から外して一列ずつ剥がす再帰構成を行う。

## 典型の発動条件

### 構成問題の再帰的不変条件

発動条件: 大きい盤面の一部を固定経路で消費すると、座標変換後に同じ条件の小さい盤面が残るとき。

L 字境界を出力し、残りを上下反転・平行移動した幅 W−1 の問題として再帰する。

### 転置・反転による場合分け削減

発動条件: 行と列が対称で、困難な境界位置を別向きの標準ケースへ写せるとき。

W＝2 や終点が境界 S 内のケースを盤面転置で既存ケースへ移す。

## 問題固有の要素

除く領域を単なる一列でなく末尾に隣列の一マスを加えた L 字にすることで、経路末尾が反転後の残り長方形の開始角へ接続する。

別の問題へ持ち帰る視点: 再帰構成では削る領域の大きさだけでなく、固定経路の出口が残り問題の標準始点に一致する形を設計する。

## 正当性

S＝第一列全体と (H,2) を通る経路の末尾は、第一列を除いて上下反転した残り盤面の左上角に対応する。 終点が S 内にある場合は行列を転置すると、同じ形の境界が終点を含まない向きへ交換できる。 各段階で訪問済み帯と残りが一つの長方形になり、開始角と指定終点を保つ同じ問題へ縮小できる。

## 実装上の注意

- H＝2 の基底構成では列 b の終点だけを最後へ回し、b＝1 や b＝W の空区間も重複なく処理する。
- 再帰ごとの転置・上下反転を座標変換として合成し、出力が元盤面で全 HW マスを一度ずつ含むようにする。

## 復習の核

- 構成の特殊ケースが増えたら、固定した帯を訪問した後の未訪問領域が同じ問題になる削り方を探す。
- 再帰構成は出力列を眺めるだけでなく、各段階の開始点・終了点・未訪問長方形の三つを不変条件として検証する。

## 計算量と制約

### 時間

O(HW)、境界剥離と出力path。

### 空間

O(HW)、全訪問座標。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq H \leq 100; 2 \leq W \leq 100; 1 \leq a \leq H; 1 \leq b \leq W; (a, b) \neq (1, 1); All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/editorial/3140) — source-abc232-editorial-3140-33bcd41478c7207b82cce3e1b87b03d84419cf4186633cc501442bbc51c6e634
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc232/tasks/abc232_h) — source-abc232-h-problem-2fa16046cc8b2129e81b3850e6db5071ad203b31aa25ee42c6f09f75104425cd
