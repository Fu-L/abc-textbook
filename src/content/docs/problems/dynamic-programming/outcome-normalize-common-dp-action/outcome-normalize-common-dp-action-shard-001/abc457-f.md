---
title: "ABC457-F — Second Gap"
draft: true
authoringUnit: {"problemId":"abc457-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-normalize-common-dp-action/outcome-normalize-common-dp-action-shard-001/abc457-f.md","learningOutcomeIds":["outcome-normalize-common-dp-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064","source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"新要素の挿入順位は三場合に互いに素に分かれる。最大・第二最大は距離条件から同じ旧状態だけを参照し、その他は上位二位置を保つため距離の一致だけで判定できる。各相対順序は最後に挿入した順位が一意なので、この更新は重複なく全順序を数える。scaleとepochはこのDP配列の表現方法だけを変え、保存した旧寄与を倍率適用後に足すことで通常の更新と一致する。","sourceRevisionIds":["source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064","source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

suffixへ先頭要素を相対順位で挿入する。最大なら新最大はi、第二最大なら旧最大が残り、それより下なら上位二位置は変わらない。前二場合では旧最大位置が `i+D_i` と決まり、最後の場合は `D_i=D_{i+1}` のときだけ合法になる。第二最大位置を状態に持たずに済むのは、この三場合の判定にその位置の実値が要らないからである。

1-indexで `dp[a]` を、現在のsuffixの最大位置がaとなる相対順序の個数とする。基底は `dp[N]=1`、他0。i=N−1,…,1について、次の順で更新する。

1. `v=旧dp[i+D_i]` を保存する。
2. 全dpへ倍率cを掛ける。i=N−1ではc=0。それ以外は `D_i=D_{i+1}` なら `c=N−i−1`、違えばc=0。
3. `新dp[i]` と `新dp[i+D_i]` へそれぞれvを加える。

二つの加算は新要素を最大・第二最大にする各一通り、倍率はそれ以外の挿入順位数である。i=N−1には第三の順位がないためD_Nを読まない。最後は全最大位置のdpを足す。

全状態の値を `scale×base[a]` と表す。c≠0なら `scale←scale·c` とし、点加算vは更新後のscaleで割ってbaseへ足す。c=0ならepochを進め、旧baseを論理消去してscale=1に戻し、保存したvを二点へ入れる。全状態を毎回走査するO(N²)のDPが、一括作用と二つの例外の処理に変わる。

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

新要素の挿入順位は三場合に互いに素に分かれる。最大・第二最大は距離条件から同じ旧状態だけを参照し、その他は上位二位置を保つため距離の一致だけで判定できる。各相対順序は最後に挿入した順位が一意なので、この更新は重複なく全順序を数える。scaleとepochはこのDP配列の表現方法だけを変え、保存した旧寄与を倍率適用後に足すことで通常の更新と一致する。

## 実装上の注意

- 基底dp[N]=1からi=N−1,…,1へ進む。i=N−1のc=0は分岐で決め、存在しないD_Nを参照しない。
- 旧vは倍率更新前に保存し、二つの点加算には更新後のscaleを使う。epoch不一致のbaseは0として読む。
- 値と逆元はmod 998244353で扱う。非零の倍率はN未満なので逆元を前計算でき、全体O(N)にできる。

## 復習の核

- 新要素rank三場合の上位二位置を小順列で追い、なぜb stateが不要かと全体倍率の実装不変量を説明する。

## 計算量と制約

### 時間

O(N)。全体倍率とepoch付き配列を使い、倍率の逆元はO(N)で前計算する。各段は二つの点更新と定数個の演算だけ。

### 空間

最大位置stateとepoch、逆元表で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2 \times 10^5; 1 \le D_i \le N - i; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc457/editorial/20140) — source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc457/tasks/abc457_f) — source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db
