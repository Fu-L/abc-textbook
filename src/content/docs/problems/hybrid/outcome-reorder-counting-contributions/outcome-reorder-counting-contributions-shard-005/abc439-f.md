---
title: "ABC439-F — Beautiful Kadomatsu"
draft: true
authoringUnit: {"problemId":"abc439-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-005/abc439-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-modular-arithmetic","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-coordinate-compression","tag-fenwick-weighted-prefix","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc439-editorial-14989-e1dd7d975d4ecdcb47d569213dae5fffa55f5ff328f78027cd63aeab341562ce","source-abc439-editorial-14996-dafa76d1df1d12c5c0c2697ee8f8ddf459e9be86007e52bcdfd74e1eff5d15f9","source-abc439-f-problem-1ab367a1121b2356ace607e5cbe50f36affe330938a7f64cd56071baf9f89797"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"門松条件は最初の隣接比較が上りで最後の隣接比較が下りであることと同値なので、固定したl,rに対する両端候補数はp_lq_rとなる。間の要素は自由に採るか捨てるかを選べ、l<rなら `2^{r−l−1}` 通り。l=rの長さ3は同じ中央位置に対し `p_iq_i` 通りで、別項として一度だけ加える。rを固定した全l<r項は `2^{r−1}q_r·Σ_{l<r}p_l2^{-l}` に因数分解できるため、過去位置の値条件を追加せずscalar和Wだけで集約できる。","sourceRevisionIds":["source-abc439-editorial-14989-e1dd7d975d4ecdcb47d569213dae5fffa55f5ff328f78027cd63aeab341562ce","source-abc439-editorial-14996-dafa76d1df1d12c5c0c2697ee8f8ddf459e9be86007e52bcdfd74e1eff5d15f9","source-abc439-f-problem-1ab367a1121b2356ace607e5cbe50f36affe330938a7f64cd56071baf9f89797"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md) — 静的な接頭辞差分を理解した後、点更新を伴う頻度・反転数・重み付き接頭辞統計をFenwick Treeで保つ。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

部分列が門松列である条件は先頭の上りと末尾の下り、つまり `P_l<P_{l+1}` と `P_{r−1}>P_r` だけで決まる。第2要素位置lと末尾直前位置rを固定し、左の小さい値数をp_l、右をq_rとする。

l=r（長さ3）の寄与は `Σp_iq_i`。l<rでは間の `r−l−1` 個を自由に選ぶので寄与は `p_lq_r2^{r−l−1}`。この段階にはP_lとP_rの大小条件はない。

rを左から走査し、過去の `l<r` について `W=Σp_l·2^{-l}` だけを累積する。一般項は `2^{r−1}q_rW` となり、値条件用の二つ目のFenwick/segment treeは不要。p_lとq_rを求める左右のFenwickは残す。

採用する候補: 両端の小さい値数をFenwickで求め、位置重みを一つのscalar和に集約する。

部分列内部の自由度と両端条件を分け、不要な値軸を持たずに数えられる。

棄却する候補: 第二段でもP_lの値域でp_lを問い合わせるFenwick/segment treeを置く。

l<rにはP_lとP_r間の大小条件がない。

## 典型の発動条件

### 隣接比較列への変換

発動条件: 数列条件が山・谷など隣接大小の変化回数だけに依存するとき。

<,> 列で折返しの交互性を見て両端条件へ簡約する。

### 端点固定の部分列数え上げ

発動条件: 内部要素が自由で、最初/最後付近だけに条件がある部分列を数えるとき。

第2・末尾直前位置を固定し、端候補数の積と内部の 2 の冪を掛ける。

### 位置重みの累積和

発動条件: 二重和の内部が自由選択で、位置差の重みを左右の積へ分けられるとき。

2^(r-l-1) を 2^(r-1)·2^{-l} に分け、過去の p_l·2^{-l} を一つの累積値Wに足す。ここではP_lの値条件を加えない。

## 問題固有の要素

山と谷の差は内部の詳細でなく、比較符号列の開始符号と終了符号だけで決まる。

別の問題へ持ち帰る視点: 部分列の自由内部が 2 の冪になる二重和は、位置差指数を左右の積へ分離して sweep できる。

## 正当性

門松条件は最初の隣接比較が上りで最後の隣接比較が下りであることと同値なので、固定したl,rに対する両端候補数はp_lq_rとなる。間の要素は自由に採るか捨てるかを選べ、l<rなら `2^{r−l−1}` 通り。l=rの長さ3は同じ中央位置に対し `p_iq_i` 通りで、別項として一度だけ加える。rを固定した全l<r項は `2^{r−1}q_r·Σ_{l<r}p_l2^{-l}` に因数分解できるため、過去位置の値条件を追加せずscalar和Wだけで集約できる。

## 実装上の注意

- まずl=rの長さ3を `Σp_iq_i` で加える。l<rの走査ではrの寄与を計算する前に `l=r−1` をWへ追加し、`2^{r−1}q_rW` を足す。
- 第二段階でP_lとP_rの大小を条件にしない。位置の厳密順序と `r−l−1` の指数を確認する。

## 復習の核

- 折返し条件との同値性と、l=r および l<r の部分列が重複なく全て数えられることを確認する。

## 計算量と制約

### 時間

O(N log N)、左右小値countと重み付き集約。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 3 \times 10^5; P is a permutation of (1,2,\dots,N).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/editorial/14989) — source-abc439-editorial-14989-e1dd7d975d4ecdcb47d569213dae5fffa55f5ff328f78027cd63aeab341562ce
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/editorial/14996) — source-abc439-editorial-14996-dafa76d1df1d12c5c0c2697ee8f8ddf459e9be86007e52bcdfd74e1eff5d15f9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/tasks/abc439_f) — source-abc439-f-problem-1ab367a1121b2356ace607e5cbe50f36affe330938a7f64cd56071baf9f89797
