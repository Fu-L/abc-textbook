---
title: "ABC374-F — Shipping"
draft: true
authoringUnit: {"problemId":"abc374-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc374-f.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-dp-state-design"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition","tag-coordinate-compression","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc374-editorial-11095-96d88404a0b6b88070e5ffa964c6c9a7809ac83cb8431a9044b0de85ad249703","source-abc374-f-problem-23882ecbf159233e00a1d0f004e255e55db05c60e57a2c9909ea3a84c4ed95bf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"早着注文を遅い便へ、遅着注文を早い便へ入れる逆転を交換すると、到着制約を保ち総待ち時間は変わらない。よって連続 prefix ごとの便だけを考えればよい。固定分割では各便を前便+Xと最後の到着日の大きい方まで早めるのが最適。この再帰から全便日は T_i+kX に含まれる。イベント DP の待つ遷移と次の1..K件を送る遷移は全正規化解を網羅し、待ち時間加算も各注文を一回だけ数える。","sourceRevisionIds":["source-abc374-editorial-11095-96d88404a0b6b88070e5ffa964c6c9a7809ac83cb8431a9044b0de85ad249703","source-abc374-f-problem-23882ecbf159233e00a1d0f004e255e55db05c60e57a2c9909ea3a84c4ed95bf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

注文は到着時刻順にまとめて出荷する最適解がある。同じ注文集合を出す時刻は、最後の注文到着時刻を待つか、前回出荷から X 日後に即出すかのどちらかである。 注文 j を i より先に出しても不満度は改善しないので、到着順の prefix を順番に処理する最適解へ交換できる。 固定した次の束では出荷日は max(束末尾の T, 前回日+X) まで早めてよく、これを繰り返すと T_i+kX しか現れない。

採用する候補: 候補日 T_i+kX の O(N^2) 個だけをイベント化し、イベント日と最後に処理した注文数を状態とする DP で最大 K 件の連続注文を出荷する。

最適出荷日が候補集合に限定され、N≤100 なのでイベント・注文数・束サイズの多項式 DP が時間内に収まる。

棄却する候補: 日付を1日ずつ進め、各日にどの注文を出すか試す。

T_N は10^12で日付走査が不可能であり、出荷集合の任意選択も指数的になる。

注文 j を i より先に出しても不満度は改善しないので、到着順の prefix を順番に処理する最適解へ交換できる。

固定した次の束では出荷日は max(束末尾の T, 前回日+X) まで早めてよく、これを繰り返すと T_i+kX しか現れない。

全 T_i+kX (0≤k≤N) を sort unique する。dp[event][j] を j 件まで出した最小不満度とし、何もしない遷移と、その日に次の1..K件を出して X 日後以降の次 event へ進む遷移を行う。

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

早着注文を遅い便へ、遅着注文を早い便へ入れる逆転を交換すると、到着制約を保ち総待ち時間は変わらない。よって連続 prefix ごとの便だけを考えればよい。固定分割では各便を前便+Xと最後の到着日の大きい方まで早めるのが最適。この再帰から全便日は T_i+kX に含まれる。イベント DP の待つ遷移と次の1..K件を送る遷移は全正規化解を網羅し、待ち時間加算も各注文を一回だけ数える。

## 実装上の注意

- 同一候補日は unique し、次に出荷可能な最初の event を lower_bound する。不満度積と T_i は 64 bit で持つ。

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
