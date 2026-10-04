---
title: "ABC464-F — Random Vault Heist"
draft: true
authoringUnit: {"problemId":"abc464-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-002/abc464-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-contribution-reordering","unit-modular-arithmetic"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-combinatorial-coefficients","tag-contribution-reordering","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc464-editorial-22267-0673f070f5e873df4f8c7d81703cf63f55dbd2bcb33ec4b2606cceb4d60d72c0","source-abc464-f-problem-dcb0e9e61dbba534dfb6d4ef7263a86cefd314e6d4642c1b493cc5bd45cb4b1c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"正の金額によりsum(S)<XはSまで停止しないことと同値である。各順列で盗む一個は直前のprefix集合Sへ一意に対応し、その集合がprefixになる確率と次の金額の条件付き平均を掛けた寄与を足すと、期待値の線形性により盗難総額の平均を得る。左右集合への分解は一意で、lower_boundの手前は厳密不等号を満たす右集合だけを含む。分子を個数項と金額和項へ分配した集計も元の和と等しい。等号では停止し、全体集合には次の手がないという二つの境界を除く。","sourceRevisionIds":["source-abc464-editorial-22267-0673f070f5e873df4f8c7d81703cf63f55dbd2bcb33ec4b2606cceb4d60d72c0","source-abc464-f-problem-dcb0e9e61dbba534dfb6d4ef7263a86cefd314e6d4642c1b493cc5bd45cb4b1c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md) — 数える対象を一意に固定し、その対象を含む選択や組の個数へ集計順を交換する。要素・組・区間・値のどれを固定すると重複が消えるかを比較する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

残りの金庫を一様に選ぶ操作は、最初に一様ランダムな順列を作り、盗んだ総額がX以上になるまで先頭から開ける操作と同じである。N!通りの順序を扱う代わりに、「次の一個を開ける直前の集合S」へ期待値の線形性を使う。

全金額は正なのでsum(S)<Xなら、それ以前のprefixも必ずX未満である。特定のSが順列の最初のs=|S|個を占める確率はs!(N−s)!/N!=1/C(N,s)。その直後の金額の条件付き期待値は(A_all−sum(S))/(N−s)である。従って求める期待値は、s<Nかつsum(S)<Xを満たす全Sについて

E = Σ (A_all−sum(S)) / (C(N,s)(N−s))

を足したものになる。sum(S)=Xは既に停止した状態なので含めない。例えばA=(2,5),X=2では空集合だけが次の盗難を生み、E=7/2となる。集合{2}を含めると停止後の5を加えてしまう。

集合全列挙も2^Nで大きいので、左右へ分けて各部分集合を(size,sum)にする。右側をsize kごとにsum順へ並べ、累積和を持つ。左の(s_L,sum_L)を固定すると必要な右集合はsum_R<X−sum_Lであり、lower_bound(X−sum_L)の手前だけである。その個数をc、sum_Rの総和をvとすると、この組の分子の総和はc(A_all−sum_L)−v。共通分母C(N,s_L+k)(N−s_L−k)で割って加算する。

各金額や部分集合和の比較は通常整数で行い、期待値の四則演算だけを法998244353で行う。sizeの組ごとに分母の逆元を前計算し、s_L+k=Nの組は次の金庫がないので除外する。

## 典型の発動条件

### random permutationのprefix集合化

発動条件: 残りから一様選択を条件失敗まで続ける期待値問題のとき。

順序過程をsubsetがprefixになる確率へ変換する。

### meet-in-the-middleのcount・sum query

発動条件: subset sizeとsum thresholdごとの個数・総和を求めたいとき。

片側をsize別sortしprefix count/sumで他側全subsetを照会する。

## 問題固有の要素

逐次random processを全順序ではなく到達可能subset状態ごとの一回の寄与へ線形化する。

別の問題へ持ち帰る視点: MITMでは存在・個数だけでなく、目的式が一次ならsubset sumのprefix総和も同時に前計算する。

## 正当性

正の金額によりsum(S)<XはSまで停止しないことと同値である。各順列で盗む一個は直前のprefix集合Sへ一意に対応し、その集合がprefixになる確率と次の金額の条件付き平均を掛けた寄与を足すと、期待値の線形性により盗難総額の平均を得る。左右集合への分解は一意で、lower_boundの手前は厳密不等号を満たす右集合だけを含む。分子を個数項と金額和項へ分配した集計も元の和と等しい。等号では停止し、全体集合には次の手がないという二つの境界を除く。

## 実装上の注意

- sumS<Xはstrictなのでlower_boundを使い、|S|=Nでは次金庫がなく分母0となるため除外する。mod binomial inverseをsize別に前計算する。

## 復習の核

- 順序が多すぎる期待値では、各実行の一回の寄与をprefix集合へ割り当てる。
- 条件が厳密不等号なら二分探索の境界も厳密にする。停止閾値と等しい状態から次を加算しない。
- MITMの目的式が一次なら、個数だけでなく部分集合和の累積和を持つ。

## 計算量と制約

### 時間

O(N²2^{ceil(N/2)})、左右subsetのsize別joinと二分探索を含む上界。

### 空間

O(2^{ceil(N/2)})。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 40; 1 \le A_i \le 10^{16}; 1 \le X \le \sum_{i=1}^{N} A_i; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/editorial/22267) — source-abc464-editorial-22267-0673f070f5e873df4f8c7d81703cf63f55dbd2bcb33ec4b2606cceb4d60d72c0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/tasks/abc464_f) — source-abc464-f-problem-dcb0e9e61dbba534dfb6d4ef7263a86cefd314e6d4642c1b493cc5bd45cb4b1c
