---
title: "ABC473 F — A/AB Insertion"
draft: true
authoringUnit: {"problemId":"abc473-f","docPath":"src/content/docs/problems/updates/abc473-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc473-f-problem-6765f26a090a2527805d7a4c8921dcc781d567743353e7734138dced5427bb09","source-abc473-editorial-24871-584757f1a051e445fdfbf822725aabee827e0dc023eeb9ae75fc3cde9e0ab886"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非負prefix性は許可挿入で保存される。逆にBがある非負prefix列では先頭Bの直前がAで、AB削除が残りの非負prefix性を保つため、帰納的に空列へ削除できる。連結要約の式は左prefixか左総和を加えた右prefixかの最小を取るので、区間の生成可能性を正しく判定する。","sourceRevisionIds":["source-abc473-f-problem-6765f26a090a2527805d7a4c8921dcc781d567743353e7734138dced5427bb09","source-abc473-editorial-24871-584757f1a051e445fdfbf822725aabee827e0dc023eeb9ae75fc3cde9e0ab886"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

## 考察

Aを+1、Bを−1へ変えると、挿入で作れる文字列は全prefix和が非負である列になる。A挿入は以後のprefixを増やし、AB挿入は途中に+1の盛り上がりを作るだけなので必要性はすぐ分かる。十分性は先頭のBの直前のAと組にしてABを削除する。組の総和は0で他のprefixを変えず、残ったAを削除すれば空列へ戻れる。

区間ごとに総和sと、空prefixも含むprefix最小値mを保つ。連結L,Rの要約は (s_L+s_R,min(m_L,s_L+m_R))。葉Aは(1,0)、葉Bは(−1,−1)、空区間は(0,0)。この結合をSegment Treeに載せ、一文字更新は一葉を置き換え、問い合わせ[l,r]は区間要約のm≥0を確認する。

左右を交換するとprefixの意味が変わる非可換演算なので、区間foldの左累積・右累積の順を守る。全文の累積和をlazyで管理する別解もあるが、局所列のmonoidにすれば通常の一点更新木だけで実装できる。

## 典型の発動条件

括弧列に似た生成可能性をprefix不等式へ変える。局所区間の総和とprefix最小値は非可換monoidとして保守できる。

## 問題固有の要素

最後の総和0は不要で、Aだけの文字列も生成できる。正しい括弧列判定と混同しない。

## 正当性

非負prefix性は許可挿入で保存される。逆にBがある非負prefix列では先頭Bの直前がAで、AB削除が残りの非負prefix性を保つため、帰納的に空列へ削除できる。連結要約の式は左prefixか左総和を加えた右prefixかの最小を取るので、区間の生成可能性を正しく判定する。

## 実装上の注意

空prefixを含めた最小値の定義を葉と単位元にそろえる。B→A更新とA→B更新を同じ葉差替えで扱う。

## 復習の核

必要条件を見つけたら、逆操作で十分性を証明する。総和だけでなく途中prefixを見る。

## 計算量と制約

### 時間

木構築 O(N)、全クエリ O(Q log N)。

### 空間

Segment Tree O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer satisfying 1 \le N \le 5 \times 10^5.; S is a string of length N consisting of A and B.; Q is an integer satisfying 1 \le Q \le 2 \times 10^5.; Each given query is of type 1 or 2.; Queries of type 1 satisfy the following constraints: i is an integer satisfying 1 \le i \le N, and c is A or B.; i is an integer satisfying 1 \le i \le N, and; c is A or B.; Queries of type 2 satisfy the following constraints: l and r are integers satisfying 1 \le l \le r \le N.; l and r are integers satisfying 1 \le l \le r \le N.

## 出典

- [公式問題](https://atcoder.jp/contests/abc473/tasks/abc473_f)
- [公式解説](https://atcoder.jp/contests/abc473/editorial/24871)
