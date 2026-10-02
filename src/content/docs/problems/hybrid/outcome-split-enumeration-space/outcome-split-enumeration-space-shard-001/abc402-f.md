---
title: "ABC402-F — Path to Integer"
draft: true
authoringUnit: {"problemId":"abc402-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc402-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle"],"sourceRevisionIds":["source-abc402-editorial-12713-b694a104e0818db20607af90c3769a6d79fdc4c66a4eb243a0aa4be1fa578817","source-abc402-f-problem-da2fa5cd1889a27d365df403a7a588d73613e27327d2c49e21e1071dce6b588e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"中央cellのweightは前半側だけへ含め、後半側から除外して二重加算を防ぐ。 固定xに対し(x+y) mod M最大は、y<M-xの最大があればそれ、なければS2最大である。 全path数C(2N-2,N-1)を、各半分O(2^{N-1})へ分割し、各xに対する最適yをbinary searchしてO(N2^N)程度で処理できる。","sourceRevisionIds":["source-abc402-editorial-12713-b694a104e0818db20607af90c3769a6d79fdc4c66a4eb243a0aa4be1fa578817","source-abc402-f-problem-da2fa5cd1889a27d365df403a7a588d73613e27327d2c49e21e1071dce6b588e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

pathが通るcell(i,j)のdigitは最終decimal numberで10^{2N-i-j}の位を占めるため、各path scoreは通過cell weightの和mod Mになる。

任意pathは反対角線i+j=N+1をちょうど一cell通る。そこまでの前半と以後の後半は各O(2^{N})通りで独立に列挙できる。

採用する候補: 反対角線でmeet-in-the-middleし、cell別の前半/後半剰余集合をsortして最大mod和を探す

全path数C(2N-2,N-1)を、各半分O(2^{N-1})へ分割し、各xに対する最適yをbinary searchしてO(N2^N)程度で処理できる。

棄却する候補: 全start-to-goal pathを列挙してdecimal値を計算する

N=20でも約C(38,19)が大きく、中央分割を使わないと間に合わない。

中央cellのweightは前半側だけへ含め、後半側から除外して二重加算を防ぐ。

固定xに対し(x+y) mod M最大は、y<M-xの最大があればそれ、なければS2最大である。

10冪mod Mでcell weightを作る。DFS/DPでstartから各反対角cellまでのsum residue、goalから同cell直後までのsum residueを列挙する。後半listをsortし各前半xへlower_bound(M-x)直前または末尾を組み合わせてmaxを取る。

## 典型の発動条件

### meet-in-the-middle on lattice paths

発動条件: path長が約40で全path列挙は重いが中央layerで二分できるとき。

反対角線cellごとに前後path residueを列挙する。

### maximum modular pair sum

発動条件: 二集合から(x+y) mod Mの最大を求めるとき。

wrap直前のyをbinary searchする。

## 問題固有の要素

decimal連結を逐次value更新する代わりに各cellの固定place valueへ展開すると、前後pathの寄与が加法的になりmeet-in-the-middleできる。

別の問題へ持ち帰る視点: path上で順序依存に見える数値も、位置がpath長で固定なら重み付き和へ変換する。

## 正当性

中央cellのweightは前半側だけへ含め、後半側から除外して二重加算を防ぐ。 固定xに対し(x+y) mod M最大は、y<M-xの最大があればそれ、なければS2最大である。 全path数C(2N-2,N-1)を、各半分O(2^{N-1})へ分割し、各xに対する最適yをbinary searchしてO(N2^N)程度で処理できる。

## 実装上の注意

- 中央cellを前半/後半どちらか一方だけに含める。M-x=0のlower_bound境界、N=1の空後半を扱う。

## 復習の核

- N≤6で全pathを列挙し、Mが小さくresidue重複が多いcase、wrap有無、N=1を比較する。

## 計算量と制約

### 時間

O(N2ᴺ)、半path列挙・後半sort・各前半lower_bound。

### 空間

O(2ᴺ+N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 20; 2 \leq M \leq 10^9; 1 \leq A_{i,j} \leq 9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc402/editorial/12713) — source-abc402-editorial-12713-b694a104e0818db20607af90c3769a6d79fdc4c66a4eb243a0aa4be1fa578817
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc402/tasks/abc402_f) — source-abc402-f-problem-da2fa5cd1889a27d365df403a7a588d73613e27327d2c49e21e1071dce6b588e
