---
title: "ABC425-F — Inserting Process"
draft: true
authoringUnit: {"problemId":"abc425-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-002/abc425-f.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-normalization"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp","tag-state-normalization"],"sourceRevisionIds":["source-abc425-editorial-14075-fe2a4e375b616dc66bfc769078c5ebea5de9aeeacb74e28b00a9e9678ab2c00c","source-abc425-f-problem-0daba476797131229053d0bfee38097c725ef04ba5116bc52103f1073a1be4d3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"逆削除で残文字列は位置maskが一意に表す。ただし同じ文字の連続runからどの同文字を消すかは、逆前状態の文字列と挿入操作が同じため重複になる。各runの左端だけを消すという代表化で同じ一手を一回数える。全逆過程はこの代表規約へ一意に写り、任意の代表削除列は合法挿入列へ逆転できるので空maskまでの経路数が答え。直前文字は元位置の直前でなく残mask内の直前を使う。","sourceRevisionIds":["source-abc425-editorial-14075-fe2a4e375b616dc66bfc769078c5ebea5de9aeeacb74e28b00a9e9678ab2c00c","source-abc425-f-problem-0daba476797131229053d0bfee38097c725ef04ba5116bc52103f1073a1be4d3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"T=\"aab\"。","procedure":["最初の削除候補はrun aaの左端aとb。","aを消すとab、そこから二順序で空へ。","bを消すとaa、そこからa,aの一順序。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-state"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"prerequisiteIds":["unit-dp-state-design","unit-normalization"],"attainmentCondition":"最初のaaの二位置を両方削除候補にすると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同じ中間文字列abへの一手を二度数え、合計5と過大評価する。"},"answer":{"reasoningOrVerification":"同じ中間文字列abへの一手を二度数え、合計5と過大評価する。","procedure":["具体例の各状態・寄与を再計算する。","同じ中間文字列abへの一手を二度数え、合計5と過大評価する。"],"expectedResult":"同じ中間文字列abへの一手を二度数え、合計5と過大評価する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

挿入過程を順方向に追うと同じ中間文字列への多数の経路が重複する。操作を逆にすると、最終文字列 T の位置集合から一文字ずつ削る部分集合 DP になる。 残存列で同じ文字が隣り合う一群からどの位置を消しても結果は同じなので、左端だけを削除可能にすれば各結果に代表遷移が一つだけ残る。 元の添字順に立っている bit を調べ、削除候補の直前の残存文字が同じならその候補を禁止する。

採用する候補: 残存位置の集合を bitmask とし、同じ残存文字列を生む削除を規則で一意化して部分集合 DP を行う。

状態数 2^N、各状態の削除候補 N 個で処理でき、重複経路を正確に排除できる。

棄却する候補: 挿入する文字と位置をすべて選ぶ順方向探索を行う。

同じ文字列が異なる挿入履歴から生成され、履歴数を数えてしまうため文字列の種類数にならない。

残存列で同じ文字が隣り合う一群からどの位置を消しても結果は同じなので、左端だけを削除可能にすれば各結果に代表遷移が一つだけ残る。

元の添字順に立っている bit を調べ、削除候補の直前の残存文字が同じならその候補を禁止する。

dp[mask] を mask の位置が残る文字列への到達方法数とし、全位置 mask から開始する。各 mask で残存位置を左から走査し、直前の残存位置と文字が同じでない位置だけを消した mask へ加算する。空 mask の値を答える。

## 典型の発動条件

### 部分集合 DP

発動条件: 要素数が小さく、各状態を残している要素集合で完全に表せるとき。

T の各位置を bit に対応させ、削除一回を一 bit 落とす遷移にする。

### 同値遷移の代表化

発動条件: 異なる操作対象が同じ次状態を生み、単純な経路数が対象の種類数と一致しないとき。

連続して残る同文字のうち左端だけを削除可とし、同じ結果への遷移を一意にする。

## 問題固有の要素

重複は元の文字列上の隣接ではなく、現在残っている位置列で隣接する同文字の間に生じる。

別の問題へ持ち帰る視点: 生成物の種類を数える DP では、同じ次状態を作る操作を同値類に分け、代表操作だけ残す。

## 正当性

逆削除で残文字列は位置maskが一意に表す。ただし同じ文字の連続runからどの同文字を消すかは、逆前状態の文字列と挿入操作が同じため重複になる。各runの左端だけを消すという代表化で同じ一手を一回数える。全逆過程はこの代表規約へ一意に写り、任意の代表削除列は合法挿入列へ逆転できるので空maskまでの経路数が答え。直前文字は元位置の直前でなく残mask内の直前を使う。

## 実装上の注意

- 『直前』は mask 内で直前に立っている bit を指す。走査中に直前の残存文字を更新し、同文字なら右側の削除を飛ばす。

## 復習の核

- 禁止条件を元の隣接位置だけに適用していないか、各削除後文字列にちょうど一つの遷移が残ることを小例で確認する。

## 計算量と制約

### 時間

最終長 N≤22。全subsetを一回走査し残位置ごとに削除候補を作り O(N2^N)。

### 空間

dp[mask]で O(2^N)、文字列O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 22; N is an integer.; T is a string of length N consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

T="aab"。

1. 最初の削除候補はrun aaの左端aとb。
2. aを消すとab、そこから二順序で空へ。
3. bを消すとaa、そこからa,aの一順序。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

最初のaaの二位置を両方削除候補にすると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じ中間文字列abへの一手を二度数え、合計5と過大評価する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc425/editorial/14075) — source-abc425-editorial-14075-fe2a4e375b616dc66bfc769078c5ebea5de9aeeacb74e28b00a9e9678ab2c00c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc425/tasks/abc425_f) — source-abc425-f-problem-0daba476797131229053d0bfee38097c725ef04ba5116bc52103f1073a1be4d3
