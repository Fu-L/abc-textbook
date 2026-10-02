---
title: "ABC457-F — Second Gap"
draft: true
authoringUnit: {"problemId":"abc457-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-normalize-common-dp-action/outcome-normalize-common-dp-action-shard-001/abc457-f.md","learningOutcomeIds":["outcome-normalize-common-dp-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064","source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"後ろから相対順位を挿入すれば各順列は一意に構成される。新要素が最大なら最大位置はi、第二最大なら旧最大a、いずれも二最大の距離条件はa=i+D_i。第三位以下のN−i−1通りは旧二最大を変えず、D_i=D_{i+1}の場合に限り合法。その二最高順位の各一点加算と全stateへの共通倍率が全遷移を網羅する。第二最大位置を捨てても、新しく二最高へ入る場合には不要、入らない場合は距離値だけの比較で済むため十分状態を保つ。","sourceRevisionIds":["source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064","source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

順列を後ろから相対順位で挿入すると、新要素が最大・第二最大か、それ以下かの三場合だけを考えればよい。後者では最大位置が変わらず、条件は D_i=D_{i+1} に縮む。 新要素が最大または第二最大なら直前最大位置は a=i+D_i に強制され、それぞれ新最大位置iまたはaへ一点加算する。 それ以下の相対順位は個数N-1-i通りで、D_i=D_{i+1}の場合に全dp stateへ同じ倍率として作用する。

採用する候補: dp[i][a]をsuffix (P_i..P_N)の最大値位置aである相対順列数とし、最大・第二最大の二つの一点遷移と、それ以下全体へのscalar倍をin-place管理する。

第二最大位置をstateから捨てても、上位二値に入る遷移では直前最大aだけで新gapが決まり、入らない遷移では既存gapが保存されるため情報が十分である。

棄却する候補: suffixごとに最大位置と第二最大位置の両方をstateに持つ挿入DPをそのまま実装する。

O(N^2) stateを各段で走査して高次時間となり、第二最大位置が遷移に不要な構造を使えていない。

新要素が最大または第二最大なら直前最大位置は a=i+D_i に強制され、それぞれ新最大位置iまたはaへ一点加算する。

それ以下の相対順位は個数N-1-i通りで、D_i=D_{i+1}の場合に全dp stateへ同じ倍率として作用する。

末尾二要素の基底dpを置き、iを降順に進める。global multiplierで全stateの一括倍率をlazy保持し、必要なstate i+D_iを実値化して最大・第二最大遷移の二点を加算する。条件不一致なら下位順位遷移を0にする。

## 典型の発動条件

### 相対順位の挿入DP

発動条件: 順列条件がprefix/suffix内の上位少数要素位置だけに依存するとき。

新要素の相対rank別に状態遷移を数える。

### DP全体のscalar lazy

発動条件: 各段の大部分が全state同一倍率で、例外が少数点だけのとき。

global係数を外出ししpoint値だけ補正する。

## 問題固有の要素

上位二要素の条件でも、挿入時に第二最大位置を明示せず遷移条件へ消去できるか検討する。

別の問題へ持ち帰る視点: DPの全state同一操作は配列走査せずlazy scalarとして持ち、少数例外だけ更新する。

## 正当性

後ろから相対順位を挿入すれば各順列は一意に構成される。新要素が最大なら最大位置はi、第二最大なら旧最大a、いずれも二最大の距離条件はa=i+D_i。第三位以下のN−i−1通りは旧二最大を変えず、D_i=D_{i+1}の場合に限り合法。その二最高順位の各一点加算と全stateへの共通倍率が全遷移を網羅する。第二最大位置を捨てても、新しく二最高へ入る場合には不要、入らない場合は距離値だけの比較で済むため十分状態を保つ。

## 実装上の注意

- global multiplierが0になり逆元で実値化できない場合を避ける表現を選ぶ。i+D_iの範囲とD_i=D_{i+1}境界を確認する。

## 復習の核

- 新要素rank三場合の上位二位置を小順列で追い、なぜb stateが不要かと全体倍率の実装不変量を説明する。

## 計算量と制約

### 時間

N 長。全体倍率とepoch付き配列、倍率逆元を事前計算すれば O(N)。hash mapは期待O(N)、各stepべき逆元なら O(Nlog p)。

### 空間

最大位置stateとepoch、逆元表で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2 \times 10^5; 1 \le D_i \le N - i; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc457/editorial/20140) — source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc457/tasks/abc457_f) — source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db
