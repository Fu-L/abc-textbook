---
title: "ABC374-F — Shipping"
draft: true
authoringUnit: {"problemId":"abc374-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc374-f.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-dp-state-design"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition","tag-coordinate-compression","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc374-editorial-11095-96d88404a0b6b88070e5ffa964c6c9a7809ac83cb8431a9044b0de85ad249703","source-abc374-f-problem-23882ecbf159233e00a1d0f004e255e55db05c60e57a2c9909ea3a84c4ed95bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"到着順prefixに束ねた最適解では、束の最後の到着時刻と前便からX日後のうち遅い方より後へ出荷を遅らせる利点はない。この正規化を繰り返すと出荷日は `T_i+kX` の候補集合に入る。`dp[t][j]` の待つ遷移は出荷しない日を、出荷遷移は到着済みの次の連続1..K件を全て列挙し、各注文の不満度を出荷日−到着日で一度だけ加える。よって全正規化計画を過不足なく扱い、`j=N` の最小値が最適解となる。","sourceRevisionIds":["source-abc374-editorial-11095-96d88404a0b6b88070e5ffa964c6c9a7809ac83cb8431a9044b0de85ad249703","source-abc374-f-problem-23882ecbf159233e00a1d0f004e255e55db05c60e57a2c9909ea3a84c4ed95bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md) — 保持すべき疎な座標をsort-uniqueして順序・等値性を添字へ写す。距離・時間差・区間長も使う場合は元座標と間隔を併せて保存する。
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

先に到着した注文iを遅い便、後に到着した注文jを早い便へ割り当てているなら交換する。早い便にjが間に合うのでiも間に合い、便の件数も保たれる。不満度は出荷時刻の和から到着時刻の和を引いたものだから、交換しても変わらない。これを繰り返すと到着順に出荷する最適解が得られ、各便は未処理注文の連続prefixにできる。

固定した出荷束では、到着時刻と前回出荷からX日後の遅い方まで出荷日を早めてよい。したがって最適な日付は `T_i+kX` 型のO(N²)候補に限られる。

状態 `dp[t][j]` を「候補日tに出荷可能で、到着順にj件処理済みの最小不満度」とする。待つ遷移ではjを保って次の候補日へ進む。tで次のk件（`1≤k≤K`）を出す遷移は `T_{j+k}≤t` のときだけ可能で、加算費用は `k·t−(prefixT[j+k]−prefixT[j])`。未処理注文が残るときだけ、次の日を `lower_bound(t+X)` で選ぶ。全件を出し終えたらその費用で直接答えを更新し、次の候補日がなくても捨てない。

最初の候補日に `j=0` を置き、全注文を処理した状態 `j=N` の最小値を答える。

採用する候補: 候補日と処理済みprefix数を状態にするevent DP

巨大な日付軸を調べず、出荷可能時点だけを有限個列挙できる。

棄却する候補: 日付を1日ずつ進め、各日に出す注文集合を選ぶ。

最終到着は10^12まであり、日付走査も任意集合列挙も不可能。

## 典型の発動条件

### 連続時間のイベント圧縮

発動条件: 時刻上限は巨大だが、最適行動が入力時刻と固定間隔からしか起きないとき。

T_i+kX の候補日に限って DP する。

### 順序保存の batch DP

発動条件: 到着順を崩さず高々 K 個をまとめて処理する問題。

処理済み prefix 長だけを集合状態として持つ。

## 問題固有の要素

最適時刻を左へ動かしても悪化しない限界点を探すと、巨大な時間軸が有限イベントへ縮む。

別の問題へ持ち帰る視点: 束の中身を任意集合で持たず、交換論法で連続 prefix に限定する。

## 正当性

到着順prefixに束ねた最適解では、束の最後の到着時刻と前便からX日後のうち遅い方より後へ出荷を遅らせる利点はない。この正規化を繰り返すと出荷日は `T_i+kX` の候補集合に入る。`dp[t][j]` の待つ遷移は出荷しない日を、出荷遷移は到着済みの次の連続1..K件を全て列挙し、各注文の不満度を出荷日−到着日で一度だけ加える。よって全正規化計画を過不足なく扱い、`j=N` の最小値が最適解となる。

## 実装上の注意

- 候補日 `T_i+kX` はsort・uniqueする。次出荷は `t+X` 以上の最初の候補日へlower_boundする。
- `T_{j+k}≤t` を確認して未到着注文を混ぜない。不満度は `k·t−(prefixT[j+k]−prefixT[j])`。

## 復習の核

- 固定した出荷グループの時刻を早める議論から、なぜ候補日が T_i+kX に閉じるのかを再導出する。

## 計算量と制約

### 時間

N 注文、一便上限 K、間隔 X。候補日 E≤N(N+1) を使い O(E log E+ENK)⊆O(N³K+N²log N)。

### 空間

候補日と dp[event][処理数] で O(EN)=O(N³)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le K \le N \le 100; 1 \le X \le 10^9; 1 \le T_1 \le T_2 \le \dots \le T_N \le 10^{12}

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/editorial/11095) — source-abc374-editorial-11095-96d88404a0b6b88070e5ffa964c6c9a7809ac83cb8431a9044b0de85ad249703
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/tasks/abc374_f) — source-abc374-f-problem-23882ecbf159233e00a1d0f004e255e55db05c60e57a2c9909ea3a84c4ed95bf
