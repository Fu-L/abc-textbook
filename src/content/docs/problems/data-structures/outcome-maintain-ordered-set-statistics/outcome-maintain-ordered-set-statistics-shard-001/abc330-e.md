---
title: "ABC330-E — Mex and Update"
draft: true
authoringUnit: {"problemId":"abc330-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc330-e.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc330-e-problem-c9b8f55f67731908d9b6568c81445ed2e45abb094bbce6983b56400d4f72aa57","source-abc330-editorial-7752-701993db3856eaa396d8e9b0d19710eeefa288e210731f5c6cf0074c7dfa0cd6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"旧値vのfrequencyを減らして0になった瞬間だけvをmissingへ追加し、新値vが0から1になる瞬間だけmissingから削除する。 値がNより大きい場合はfrequency arrayもmissing setも触らず、A_i本体だけ更新すればよい。 mex範囲を有限化し、各queryを定数個のset insert/eraseと最小値参照で処理できる。","sourceRevisionIds":["source-abc330-e-problem-c9b8f55f67731908d9b6568c81445ed2e45abb094bbce6983b56400d4f72aa57","source-abc330-editorial-7752-701993db3856eaa396d8e9b0d19710eeefa288e210731f5c6cf0074c7dfa0cd6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(0,1,1)、位置2を4へ、次に位置3を2へ。","procedure":["初mex=2、最初は(0,4,1)でmex2。","次は(0,4,2)で1が欠ける。"],"executionTarget":null,"expectedResult":"各更新後mex2,1。","verificationStatus":"not_applicable","learningUnitIds":["unit-ordered-set-multiset"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"prerequisiteIds":[],"attainmentCondition":"Nより大きい4の頻度を持つ必要があるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"mexは0..Nにあるので不要。ただしA本体に4は保存し将来の旧値判定に使う。"},"answer":{"reasoningOrVerification":"mexは0..Nにあるので不要。ただしA本体に4は保存し将来の旧値判定に使う。","procedure":["具体例の各状態・寄与を再計算する。","mexは0..Nにあるので不要。ただしA本体に4は保存し将来の旧値判定に使う。"],"expectedResult":"mexは0..Nにあるので不要。ただしA本体に4は保存し将来の旧値判定に使う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さNの非負整数列のmexは必ず0..Nの範囲にあるため、Nより大きい値の出現数は答えへ影響しない。

各v∈[0,N]のfrequencyを持てば、mexはfrequency 0の値のうち最小のものになる。

1点更新でmissing集合が変わる可能性があるのは旧値と新値だけである。

採用する候補: 0..Nのfrequencyと、現在欠けている値のordered setを保ち、更新2値だけを反映する。

mex範囲を有限化し、各queryを定数個のset insert/eraseと最小値参照で処理できる。

棄却する候補: 各query後に0から順にA内にあるか調べ直す。

mexが大きいqueryが続くと毎回O(N)走査になる。

棄却する候補: A全体をordered setにして最小要素をmexとする。

mexは最小の存在値でなく最小の不存在値であり、重複frequencyの消滅も管理できない。

旧値vのfrequencyを減らして0になった瞬間だけvをmissingへ追加し、新値vが0から1になる瞬間だけmissingから削除する。

値がNより大きい場合はfrequency arrayもmissing setも触らず、A_i本体だけ更新すればよい。

cnt[0..N]を初期Aから作り、cnt[v]=0の全vをordered set missingへ入れる。query(i,x)で旧A_i≤Nならcntを減らし0になればinsertする。x≤Nなら更新前cnt[x]=0ならmissingからeraseし、その後増やす。A_i=xへ更新し、*missing.begin()を出力する。

## 典型の発動条件

### mexの値域制限

発動条件: 長さNの非負multisetのmexを動的に求めるとき。

候補を0..Nだけに絞る。

### zero-frequency set

発動条件: 動的frequencyから最小の欠損keyを問うとき。

count 0のkeyだけをordered setへ保持する。

### 境界crossing更新

発動条件: 集合membershipがcount>0かだけで決まるとき。

0↔1を跨ぐ更新時だけsetを変える。

## 問題固有の要素

入力値は10^9まででも、N+1個の候補0..Nのどれかは必ず欠ける鳩ノ巣原理により、巨大値を完全に無視できる。

別の問題へ持ち帰る視点: 欠損最小値問題では、要素数から答え候補の上界を先に証明して座標範囲を切る。

## 正当性

旧値vのfrequencyを減らして0になった瞬間だけvをmissingへ追加し、新値vが0から1になる瞬間だけmissingから削除する。 値がNより大きい場合はfrequency arrayもmissing setも触らず、A_i本体だけ更新すればよい。 mex範囲を有限化し、各queryを定数個のset insert/eraseと最小値参照で処理できる。

## 実装上の注意

- 旧値と新値が同じ場合も減算→増算の順で整合するが、0↔1判定の順序を統一する。
- missingは0..Nの少なくとも1要素を常に含むためbegin参照が空にならない。

## 復習の核

- 重複していた旧値を1個消すcaseと最後の1個を消すcase、N超の新旧値を含むcaseでmissing更新を確認する。

## 計算量と制約

### 時間

O(N+Q log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N,Q \le 2 \times 10^5; 0 \le A_i \le 10^9; 1 \le i_k \le N; 0 \le x_k \le 10^9

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(0,1,1)、位置2を4へ、次に位置3を2へ。

1. 初mex=2、最初は(0,4,1)でmex2。
2. 次は(0,4,2)で1が欠ける。

期待される結果: 各更新後mex2,1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

Nより大きい4の頻度を持つ必要があるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

mexは0..Nにあるので不要。ただしA本体に4は保存し将来の旧値判定に使う。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc330/tasks/abc330_e) — source-abc330-e-problem-c9b8f55f67731908d9b6568c81445ed2e45abb094bbce6983b56400d4f72aa57
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc330/editorial/7752) — source-abc330-editorial-7752-701993db3856eaa396d8e9b0d19710eeefa288e210731f5c6cf0074c7dfa0cd6
