---
title: "ABC287-E — Karuta"
draft: true
authoringUnit: {"problemId":"abc287-e","docPath":"src/content/docs/problems/string-geometry/outcome-index-shared-prefixes-with-trie/outcome-index-shared-prefixes-with-trie-shard-001/abc287-e.md","learningOutcomeIds":["outcome-index-shared-prefixes-with-trie"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。"],"tagIds":["tag-trie-prefix"],"sourceRevisionIds":["source-abc287-e-problem-4db894920640533697c1ae44f746223d25b228dff8a43790261e0db6b225e331","source-abc287-editorial-5609-3eae5d32344ce4b280463e67fdc31b14606774c7b48316b446410cb81ae139bb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"depth kのgroupは先頭k文字が同じ文字列全体を保持する。終端はこれ以上一致できず最大k、一文字先groupがsingletonなら他と次文字で必ず異なり最大k。二本以上なら少なくともk+1一致するためそのgroupだけ再帰する。この分類は全他文字列とのLCP候補を保存し、最初の分離または終端で最大値を確定する。","sourceRevisionIds":["source-abc287-e-problem-4db894920640533697c1ae44f746223d25b228dff8a43790261e0db6b225e331","source-abc287-editorial-5609-3eae5d32344ce4b280463e67fdc31b14606774c7b48316b446410cb81ae139bb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Trieで共有接頭辞を索引化する](src/content/docs/learn/string/trie-prefix.md)

- 文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- failure linkやZ値で接頭辞と接尾辞の一致状態を更新する文字列照合。

## 考察

同じprefix長kを持つ文字列groupでは、長さがちょうどkの文字列はそれ以上一致できず答えkで確定する。

残りをk+1文字目で分類すると、size 1のgroupは他とk文字までしか一致せず答えk、size 2以上のgroupだけを次の深さへ再帰すればよい。

採用する候補: 共通prefixごとのgroupを次文字で再帰分割し、単独になった深さを各文字列の答えにする。

trieの各文字を総入力長に比例して辿るだけで、全文字列の最大LCPを同時に確定できる。

棄却する候補: 各iについて他のN-1文字列とのLCPを先頭から比較する。

文字列pairが二次個あり、総文字数5×10^5の制約では比較回数が大きすぎる。

棄却する候補: 文字列全体の最頻prefix長を1つ求め、全iへ同じ値を返す。

各文字列が属するbranchの混み方によって最長共有prefixは異なる。

ある深さのprefixを共有する文字列が2本以上なら、その全ては少なくともその深さまで誰かと一致し、1本になった直前の深さが最大値になる。

同じ文字列が複数回入力されても、終端深さのgroup sizeが2以上なので文字列長そのものが答えになる。

全indexをdepth 0のgroupとして再帰関数へ渡す。depth kで長さkの文字列へ答えkを設定し、それより長い文字列を次文字a..zでbucket分けする。bucket size 1ならそのindexの答えをk、size 2以上ならdepth k+1で再帰する。全indexの答えを入力順に出力する。

## 典型の発動条件

### trie相当のprefix分割

発動条件: 多数文字列について共有prefixの深さをまとめて追いたいとき。

次文字bucketへ再帰し、groupが単独になる深さを記録する。

### 総入力長による計算量評価

発動条件: 可変長文字列をdepthごとに処理する再帰があるとき。

各文字を所属文字列の1段として一度だけbucket処理する。

## 問題固有の要素

求める相手jを直接選ばず、「同じprefix nodeを通る文字列が2本以上か」という集合sizeへ置き換えると全iを同時に解ける。

別の問題へ持ち帰る視点: 各要素の最良なpartnerを問う問題では、partnerが存在する共有分類の最深levelを求める形へ変換できないか考える。

## 正当性

depth kのgroupは先頭k文字が同じ文字列全体を保持する。終端はこれ以上一致できず最大k、一文字先groupがsingletonなら他と次文字で必ず異なり最大k。二本以上なら少なくともk+1一致するためそのgroupだけ再帰する。この分類は全他文字列とのLCP候補を保存し、最初の分離または終端で最大値を確定する。

## 実装上の注意

- group内で文字列長が現在depthと等しいindexは終端として先に処理し、次文字へaccessしない。
- 再帰depthが最大文字列長になるため、stack制限が不安なら明示stackまたはtrie走査で実装する。

## 復習の核

- 重複文字列、他文字列のprefixになっている文字列、最初の1文字で単独になる文字列を同時に含むtrieを描き、確定depthを確認する。

## 計算量と制約

### 時間

O(L)、L=Σ|S_i|。共通prefix groupの各文字を一度分類する。

### 空間

O(L+N)。明示stackまたはtrie。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 5 \times 10^5; N is an integer.; S_i is a string of length at least 1 consisting of lowercase English letters (i = 1, 2, \dots, N).; The sum of lengths of S_i is at most 5 \times 10^5.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/tasks/abc287_e) — source-abc287-e-problem-4db894920640533697c1ae44f746223d25b228dff8a43790261e0db6b225e331
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc287/editorial/5609) — source-abc287-editorial-5609-3eae5d32344ce4b280463e67fdc31b14606774c7b48316b446410cb81ae139bb
