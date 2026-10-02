---
title: "ABC430-E — Shift String"
draft: true
authoringUnit: {"problemId":"abc430-e","docPath":"src/content/docs/problems/string-geometry/outcome-build-prefix-match-state/outcome-build-prefix-match-state-shard-001/abc430-e.md","learningOutcomeIds":["outcome-build-prefix-match-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-z-algorithm-prefix-matching"],"sourceRevisionIds":["source-abc430-e-problem-b0cb6de7fb36a6c43cc9c715ac854f309a60dead8b8d1285ff1f92d4e123a3ea","source-abc430-editorial-14330-5bf5bf1021053e75dfa2c7c03f6556ac423e7ae4301be63af7cfd372f4f53c05"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"左shift kは二周列A+Aの開始kの長さNsubstringに等しい。prefix Bとその位置のZ値≥Nなら全N文字が一致し、そのshiftが実現する。k=0..N−1は全rotationを覆い昇順最初を選ぶので必要最小回数になる。alphabet外separatorはB比較が境界を跨ぐ偽一致を防ぐ。","sourceRevisionIds":["source-abc430-e-problem-b0cb6de7fb36a6c43cc9c715ac854f309a60dead8b8d1285ff1f92d4e123a3ea","source-abc430-editorial-14330-5bf5bf1021053e75dfa2c7c03f6556ac423e7ae4301be63af7cfd372f4f53c05"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md)

- 既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- Z algorithmによるprefix matchingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

一回の操作は左巡回シフトで、N 回後に元へ戻る。A の k 回シフトは、A+A の位置 k から長さ N を切り出した文字列である。

採用する候補: B と A+A を連結した文字列へ Z-algorithm を適用し、各 k<N で B と長さ N 一致する最初の位置を探す。

全候補回転との一致長を一度の線形時間前計算で得られる。

棄却する候補: 各 k=0,…,N-1 について回転文字列を作り B と比較する。

文字列生成・比較が各 O(N) で、最悪 O(N^2) になる。

B が A+A の開始位置 k に現れることと、A を k 回左シフトした結果が B であることは同値である。

Z 値は全体文字列の接頭辞との最長一致長なので、接頭辞に B を置けば回転候補との一致判定をまとめられる。

衝突しない区切り文字を用いて S=B+'#'+A+A を作り Z 配列を計算する。k=0…N-1 の順に、A+A 側の位置 offset+k の Z 値が N 以上なら k を返し、なければ -1 を返す。

## 典型の発動条件

### 文字列の二重化

発動条件: 巡回シフトや円環上の長さ N の区間を通常の部分文字列として扱いたいとき。

A+A の最初の N 個の開始位置を全回転に対応させる。

### Z-algorithm

発動条件: 一つのパターンとテキストの各位置との接頭辞一致長を線形時間で求めたいとき。

B を全体の接頭辞に置き、各回転開始位置の Z 値で完全一致を判定する。

## 問題固有の要素

巡回操作列挙は二重化した文字列中のパターン検索へ置き換えられる。

別の問題へ持ち帰る視点: 全候補と同じパターンを比較する問題では、パターンを接頭辞にした Z 配列が直接一致長を与える。

## 正当性

左shift kは二周列A+Aの開始kの長さNsubstringに等しい。prefix Bとその位置のZ値≥Nなら全N文字が一致し、そのshiftが実現する。k=0..N−1は全rotationを覆い昇順最初を選ぶので必要最小回数になる。alphabet外separatorはB比較が境界を跨ぐ偽一致を防ぐ。

## 実装上の注意

- B と A+A の間に入力 alphabet 外の区切りを入れ、Z 配列上の offset を正しくずらす。調べる k は 0≤k<N に限定する。

## 復習の核

- A+A の開始位置 k と左シフト k 回の対応、Z 値 N 以上という完全一致条件を確認する。

## 計算量と制約

### 時間

各case O(|A|)。B+# +A+AのZ配列。

### 空間

O(|A|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 10000; A and B are strings consisting of 0 and 1.; 2 \le |A|=|B| \le 10^6; For a single input, the sum of |A| does not exceed 10^6.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc430/tasks/abc430_e) — source-abc430-e-problem-b0cb6de7fb36a6c43cc9c715ac854f309a60dead8b8d1285ff1f92d4e123a3ea
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc430/editorial/14330) — source-abc430-editorial-14330-5bf5bf1021053e75dfa2c7c03f6556ac423e7ae4301be63af7cfd372f4f53c05
