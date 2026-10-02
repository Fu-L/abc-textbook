---
title: "ABC230-F — Predilection"
draft: true
authoringUnit: {"problemId":"abc230-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-prefix-partition-dp/outcome-design-prefix-partition-dp-shard-001/abc230-f.md","learningOutcomeIds":["outcome-design-prefix-partition-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-dp-prefix-partition"],"sourceRevisionIds":["source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c","source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"隣接併合の結果は元列の連続ブロック分割の和列。切れ目の元prefix和を列挙すると、ブロック和からその列を累積和として一意に復元でき、逆に差分でブロック和が決まる。全体和は固定なので、異なる完成列の個数は内部prefix和列のdistinct subsequence（空を含む）の個数に等しい。次prefix和vを付加すると既存列全てへvを足せるが、前回vが現れた時点に付加した個数を引けば重複が消える。prefix和の最終出現を保持する累積DPはこの全単射と一致する。","sourceRevisionIds":["source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c","source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [prefix分割DP](src/content/docs/learn/dynamic-programming/dp-prefix-partition.md)

- 列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- prefix分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

隣接要素の加算を繰り返した最終列の各値は、元列を順序を保つ連続ブロックへ分割した各ブロック和になる。

異なる分割でも途中の区間和が 0 なら同じ最終列を作り得るため、分割数をそのまま数えると重複する。

棄却する候補: N−1 個の境界を残すか消すか全て列挙し、得られたブロック和列を集合で重複排除する。

境界選択が指数個あり、生成列を保存して比較することもできない。

採用する候補: 完成列を左から作る標準的な貪欲操作列へ一意化し、直前に同じ prefix 和が現れた位置を境界にした DP 区間和で数える。

完成列と標準操作列が一対一になり、重複を生む 0 和区間以前からの遷移だけをまとめて除外できる。

左端の目標値ができるまで左端二要素を併合する規則を固定すると、同じ完成列に複数の操作順を対応させずに済む。

区間和 0 は二つの prefix 和が等しいことなので、各 prefix 和の最新位置だけを map で保持すれば遷移の左端が分かる。

連続ブロック和列を左優先の正規形へ写し、prefix 和の最新重複位置で許される切れ目範囲を決め、DP の prefix sum から個数を計算する。

## 典型の発動条件

### 生成過程の正規形による重複排除

発動条件: 複数の操作列が同じ完成物を作り、操作列数と完成物数が一致しないとき。

左から目標要素を確定する貪欲規則を固定し、完成列ごとに一つの操作列だけを数える。

### prefix 和の最新出現位置

発動条件: 0 和区間の存在が遷移可能範囲の境界を決めるとき。

同じ prefix 和の直前位置を連想配列で取得し、DP の区間和を累積和で求める。

## 問題固有の要素

未対応の末尾が残っても、その総和が 0 なら最後の完成値へ吸収して同じ列を作れるため、答えも 0 和 suffix に対応する DP の和になる。

別の問題へ持ち帰る視点: 正規化した生成過程に余りが生じる場合、余りが完成物を変えない条件を終端条件として別に数える。

## 正当性

隣接併合の結果は元列の連続ブロック分割の和列。切れ目の元prefix和を列挙すると、ブロック和からその列を累積和として一意に復元でき、逆に差分でブロック和が決まる。全体和は固定なので、異なる完成列の個数は内部prefix和列のdistinct subsequence（空を含む）の個数に等しい。次prefix和vを付加すると既存列全てへvを足せるが、前回vが現れた時点に付加した個数を引けば重複が消える。prefix和の最終出現を保持する累積DPはこの全単射と一致する。

## 実装上の注意

- prefix 和は負にも 32 bit 範囲外にもなるため 64 bit のキーを使い、現在位置を計算した後に最新位置を更新する。
- DP・その累積和・最後の 0 和 suffix の添字基準を揃え、全体和が 0 の場合の先頭境界も含める。

## 復習の核

- 操作結果を数える問題では、操作列の列挙前に同じ結果を生む操作順・分割の例を作って一意性を検査する。
- 0 和区間が重複の原因なら、同じ prefix 和の「最新」出現がどの古い遷移を代表して消すかを追う。

## 計算量と制約

### 時間

ordered map使用でO(N log N)、平均O(1)hash mapなら期待O(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; |A_i| \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/editorial/91) — source-abc230-editorial-91-57398345efd5ab0d2f88d3e9a2bbc42970b339618e80adec35b099cbfc65b27c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc230/tasks/abc230_f) — source-abc230-f-problem-ae9e6183c1407560712788cce7e669f67b0385a0059c8ab7450168b151f495ba
