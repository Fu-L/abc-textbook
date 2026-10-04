---
title: "ABC457-F — Second Gap"
draft: true
authoringUnit: {"problemId":"abc457-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-normalize-common-dp-action/outcome-normalize-common-dp-action-shard-001/abc457-f.md","learningOutcomeIds":["outcome-normalize-common-dp-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064","source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最大・第二最大へ入る遷移は旧最大位置 `i+D_i` だけから決まるため、その旧値を共通倍率の適用前に保存すれば各例外寄与が正しい。それ以外の相対順位は条件成立時に全stateへ同じ倍率を掛けるので、lazy scalarは配列全更新と等価である。倍率が0なら従来stateは全て0となるためepochを進めて旧baseを無効化し、新しい例外加算だけをscale=1で登録すれば同じ配列状態を表す。従って全段のDPと一致する。","sourceRevisionIds":["source-abc457-editorial-20140-f7f05153de638e20d8a9d91ff20b3afe593cb79dcaa4b7b6105de9fd025c6064","source-abc457-f-problem-9769767990a68437fd8f505e2e1e09553115be9784fb340c2dabe8018196b0db"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 固定線形遷移の巨大回累乗。

## 考察

後ろから相対順位で挿入すると、新要素が最大・第二最大の場合だけ直前の最大位置 `a=i+D_i` が決まり、二つの一点遷移になる。それ以下の順位は最大二つを変えず、条件 `D_i=D_{i+1}` のとき全stateへ共通倍率 `N−i−1` を掛ける。

最大位置aだけをstateに持ち、末尾側の基底からiを降順に処理する。各stepでは例外遷移に必要な旧 `dp[i+D_i]` を倍率更新前に読む。

全stateの値を `scale×base[a]` と表す。共通倍率cが非0なら `scale←scale·c` とし、点加算δは `base[a]←base[a]+δ/scale` とする。c=0なら旧state全体が0になるのでepochを一つ進めて旧baseを論理消去し、`scale=1` に戻して例外の二点加算を行う。古い値はepoch不一致として0を返す。

採用する候補: 共通倍率をlazy scalarにし、倍率0はepochで配列を論理clearする。

一括作用は全state走査を避け、例外だけを点更新できる。

棄却する候補: 各iで全最大位置stateを走査する。

O(N²)になり、共通倍率の構造を使えない。

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

最大・第二最大へ入る遷移は旧最大位置 `i+D_i` だけから決まるため、その旧値を共通倍率の適用前に保存すれば各例外寄与が正しい。それ以外の相対順位は条件成立時に全stateへ同じ倍率を掛けるので、lazy scalarは配列全更新と等価である。倍率が0なら従来stateは全て0となるためepochを進めて旧baseを無効化し、新しい例外加算だけをscale=1で登録すれば同じ配列状態を表す。従って全段のDPと一致する。

## 実装上の注意

- `dp[N][N]=1` を基底にiを降順処理し、`dp[i+D_i]` を共通倍率更新より先に読む。最後は `dp[1][a]` を全aで足す。
- scaleが非0なら点加算δを `δ/scale` としてbaseへ入れる。共通倍率0ではepochを進め、scale=1にして二つの例外遷移を加える。epoch不一致の要素は0として読む。
- 逆元と値はmod 998244353で扱う。

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
