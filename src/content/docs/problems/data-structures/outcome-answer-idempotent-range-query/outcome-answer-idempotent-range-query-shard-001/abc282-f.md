---
title: "ABC282-F — Union of Two Sets"
draft: true
authoringUnit: {"problemId":"abc282-f","docPath":"src/content/docs/problems/data-structures/outcome-answer-idempotent-range-query/outcome-answer-idempotent-range-query-shard-001/abc282-f.md","learningOutcomeIds":["outcome-answer-idempotent-range-query"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-interactive-protocol","unit-range-monoid-aggregation"],"excludedTopics":["冪等演算のoverlap range query・Sparse Tableの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-idempotent-overlap-range-query","tag-interactive-protocol"],"sourceRevisionIds":["source-abc282-editorial-5403-a6fc1b073b674859f239b20188df61ec3a08834c8b5f8c17af1ca21e9ccd56e4","source-abc282-f-problem-86da67b53a7e864329b60455cddbbc086b4f398d45a9087c6e381fc9847ec1d8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"2^k≤len<2^{k+1}なので、左右2区間の合計長2^{k+1}はlen以上となりgapがなく、どちらも[L,R]内なのでunionが正確にquery区間になる。 各(power,start)に出力indexを記録すれば、phase2は二つのtable lookupだけでよい。 登録数N(logN+1)が50000以内で、各queryをlog tableから定数時間で復元できる。","sourceRevisionIds":["source-abc282-editorial-5403-a6fc1b073b674859f239b20188df61ec3a08834c8b5f8c17af1ca21e9ccd56e4","source-abc282-f-problem-86da67b53a7e864329b60455cddbbc086b4f398d45a9087c6e381fc9847ec1d8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [冪等演算のoverlap range query・Sparse Table](src/content/docs/learn/query/idempotent-overlap-range-query.md)

- 冪等な演算なら重なりを許す二つの2冪区間で任意rangeを覆えることを使い、静的queryをO(1)で答える。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [対話protocolを守って情報を取得する](src/content/docs/learn/modeling/interactive-protocol.md)
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 冪等演算のoverlap range query・Sparse Tableの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

任意query区間を事前登録2区間のunionで表すには、重なりを許せることが重要で、disjoint分解を2個に限定する必要はない。

長さlenに対し最大の2^k≤lenを選ぶと、左端からの長さ2^k区間と右端までの長さ2^k区間が重なりつつ全[L,R]を覆う。

採用する候補: 長さ1,2,4,…の全開始位置区間を登録し、queryを同じ長さの左prefix区間と右suffix区間の2個で答える。

登録数N(logN+1)が50000以内で、各queryをlog tableから定数時間で復元できる。

棄却する候補: 全N(N+1)/2区間を登録してquery自身を1個選ぶ。

N=4000でM上限50000を大きく超える。

2^k≤len<2^{k+1}なので、左右2区間の合計長2^{k+1}はlen以上となりgapがなく、どちらも[L,R]内なのでunionが正確にquery区間になる。

各(power,start)に出力indexを記録すれば、phase2は二つのtable lookupだけでよい。

k=0…floor(log2N)、l=1…N-2^k+1の区間[l,l+2^k-1]を列挙しid[k][l]を保存して出力する。query[L,R]ではk=floor(log2(R-L+1))としてid[k][L]とid[k][R-2^k+1]を返す。

## 典型の発動条件

### sparse tableのoverlapping decomposition

発動条件: idempotent queryやunion表現で、区間を同長power-of-two区間2個へ分けられるとき。

最大2冪長の左・右blockを重ねて全区間を覆う。

### offline family design

発動条件: query前に制限個数の集合族を提示し、後から任意区間を少数集合で表すとき。

全power-of-two intervalをuniversal familyとして登録する。

## 問題固有の要素

unionでは重複が無視されるため、sparse tableと同じoverlap分解がそのままinteractive構成になる。

別の問題へ持ち帰る視点: 二つの集合で区間を表す問題では、重なり許容なら最大2冪の両端coverを試す。

## 正当性

2^k≤len<2^{k+1}なので、左右2区間の合計長2^{k+1}はlen以上となりgapがなく、どちらも[L,R]内なのでunionが正確にquery区間になる。 各(power,start)に出力indexを記録すれば、phase2は二つのtable lookupだけでよい。 登録数N(logN+1)が50000以内で、各queryをlog tableから定数時間で復元できる。

## 実装上の注意

- N=4000で登録数が48000以下になることを出力前に確認し、idは1-indexedの出力順と一致させる。
- 各phase出力後にflushし、lenが2冪なら左右idが同一でもa=bが許される。

## 復習の核

- len=5,6,7とlen=8で左右の長さ4/8区間を描き、gapがなく外へはみ出さないことを確認する。

## 計算量と制約

### 時間

登録O(N log N)、各質問O(1)。

### 空間

O(N log N)、登録ID表。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 4000; 1 \leq Q \leq 10^5; 1 \leq L \leq R \leq N; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/editorial/5403) — source-abc282-editorial-5403-a6fc1b073b674859f239b20188df61ec3a08834c8b5f8c17af1ca21e9ccd56e4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc282/tasks/abc282_f) — source-abc282-f-problem-86da67b53a7e864329b60455cddbbc086b4f398d45a9087c6e381fc9847ec1d8
