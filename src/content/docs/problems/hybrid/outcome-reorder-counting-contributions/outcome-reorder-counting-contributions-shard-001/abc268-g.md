---
title: "ABC268-G — Random Student ID"
draft: true
authoringUnit: {"problemId":"abc268-g","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc268-g.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-modular-arithmetic","unit-trie-prefix"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-modular-arithmetic","tag-trie-prefix"],"sourceRevisionIds":["source-abc268-g-problem-1ce0d2d72d4e4fd15ee56036a2337b2e2dec2d261f9331527aaf393478ca62a1","source-abc268-editorial-4782-eba6ee35ec70b7e21f9935aec2f4f08bb56a01d390bc24e8952ee7c85cae2c51"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"別の文字列が厳密なprefixなら必ず先に、厳密な延長なら必ず後に並ぶ。どちらでもない二列は最初の異なる文字の順序が半々になる。この三分類が全相手を分割し、指示変数の期待値を足すと順位の式になる。","sourceRevisionIds":["source-abc268-g-problem-1ce0d2d72d4e4fd15ee56036a2337b2e2dec2d261f9331527aaf393478ca62a1","source-abc268-editorial-4782-eba6ee35ec70b7e21f9935aec2f4f08bb56a01d390bc24e8952ee7c85cae2c51"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。
- [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md) — 文字ごとの遷移を配列やmapで持ち、複数文字列の共有接頭辞を木として索引化する。

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

student iのIDは自分以下の名前数なので、期待値は各jについてS_j≤S_iとなる確率の和である。

prefix関係でなければ最初に異なる二文字のrandom alphabet順だけで大小が決まり、二文字の順序は対称なので各向き確率1/2である。

棄却する候補: 26!通りのalphabet順を列挙し、毎回全名前をsortしてIDを平均する。

alphabet permutationが巨大で、期待値の線形性とpairwise対称性を使っていない。

採用する候補: 各S_iについてprefix名数A_iとstrict extension名数B_iをtrieで数え、期待ID=(N+A_i−B_i)/2を計算する。

prefixなら大小が確定し、それ以外の全pairは確率1/2なので、必要情報がtrieの祖先terminal数と子孫terminal数だけになる。

A_iはS_i nodeまでのpath上のterminal数、B_iはそのnodeのsubtree terminal数から自分を引いた値である。

A_i個は確率1、B_i個は確率0、残るN−A_i−B_i個は確率1/2なので期待値式が得られる。

random total-order lexicographic rankの期待値をlinearity of expectationでpairwise comparisonへ分解し、deterministic prefix poset countsをtrieで集計する。

## 典型の発動条件

### 順位期待値の指示変数分解

発動条件: random順序における各要素のrank期待値を求めたいとき。

rankを自分以下となる各相手のindicator和にし、pairごとの確率を足す。

### trie上のprefix・extension数え上げ

発動条件: 各文字列について集合内のprefix数とstrict extension数を一括で求めるとき。

root pathのterminal累積とsubtree terminal和を計算する。

## 問題固有の要素

alphabet全体のrandom permutationではpairwise文字順に依存があっても、期待値の線形性により各異文字pairが1/2という周辺確率だけで十分である。

別の問題へ持ち帰る視点: random permutationの期待rankでは比較event同士の独立性は不要で、各pairの対称性だけを使う。

## 正当性

別の文字列が厳密なprefixなら必ず先に、厳密な延長なら必ず後に並ぶ。どちらでもない二列は最初の異なる文字の順序が半々になる。この三分類が全相手を分割し、指示変数の期待値を足すと順位の式になる。

## 実装上の注意

- 名前は相異なるため各terminalは1だが、prefix pathには自分自身をA_iとして含め、B_iからは自分を除く。
- 2での除算はmodulo 998244353のinverse of 2を掛け、trie node数は総文字数+1だけ確保する。

## 復習の核

- random順序のrankは、各相手に勝つ確率を足すindicator期待値へ必ず分解する。
- 辞書比較のrandom性が消えるprefix関係と、最初の異文字だけを見る対称caseを分離する。

## 計算量と制約

### 時間

O(L)、L全文字数、固定alphabet Trie。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N; N is an integer.; S_i is a string of length at least 1 consisting of lowercase English letters.; The sum of lengths of the given strings is at most 5 \times 10^5.; i \neq j \Rightarrow S_i \neq S_j

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc268/tasks/abc268_g) — source-abc268-g-problem-1ce0d2d72d4e4fd15ee56036a2337b2e2dec2d261f9331527aaf393478ca62a1
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc268/editorial/4782) — source-abc268-editorial-4782-eba6ee35ec70b7e21f9935aec2f4f08bb56a01d390bc24e8952ee7c85cae2c51
