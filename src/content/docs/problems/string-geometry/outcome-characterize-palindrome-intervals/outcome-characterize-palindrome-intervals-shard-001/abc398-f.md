---
title: "ABC398-F — ABCBA"
draft: true
authoringUnit: {"problemId":"abc398-f","docPath":"src/content/docs/problems/string-geometry/outcome-characterize-palindrome-intervals/outcome-characterize-palindrome-intervals-shard-001/abc398-f.md","learningOutcomeIds":["outcome-characterize-palindrome-intervals"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["一般の部分文字列hash比較と、接尾辞・LCPの索引。"],"tagIds":["tag-palindrome-radius"],"sourceRevisionIds":["source-abc398-editorial-12501-01e1edb514d0ffe21194f92add6db7cc726417d4a9fa6e2b794adb918f94727f","source-abc398-f-problem-c396893f0e5336d3421eef21e366c3e05c35d3dfc955c0f3248dc124818a60eb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"S先頭k文字のmirrorは追加suffixとして一意に強制される。残るS[k..]が回文ならその両側をmirrorで挟んで全回文になり、逆にも全回文なら残りは回文である。従って追加最小は最長回文suffixの開始k最小。Manacherは偶奇全中心の最大半径を求めるので右端Nへ届く候補を尽くす。","sourceRevisionIds":["source-abc398-editorial-12501-01e1edb514d0ffe21194f92add6db7cc726417d4a9fa6e2b794adb918f94727f","source-abc398-f-problem-c396893f0e5336d3421eef21e366c3e05c35d3dfc955c0f3248dc124818a60eb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [回文半径と左右対称区間を特定する](src/content/docs/learn/string/palindrome-radius.md)

- 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。

この解説で扱わないこと:

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 考察

Sをprefixに持つ長さ|S|+kのpalindromeでは、追加suffixはS先頭k文字のreverseに一意に決まる。

この構成が可能な必要十分条件は、Sの残るsuffix S[k..]自体がpalindromeであることなので、k最小化は最長palindromic suffix探索になる。

採用する候補: Manacher法で全中心のpalindrome半径を求め、末尾へ達する最長substringを選んで不足prefixを反転追加する

全palindromic suffixをO(N)で判定でき、|S|=5×10^5でも最短追加長を線形時間で求められる。

棄却する候補: k=0..Nを順に試し、各suffixを両端比較する

同じ文字比較を繰り返して最悪O(N²)になる。

最長palindromic suffixの開始位置kが分かれば、答えはS+reverse(S[0..k))である。

偶数長・奇数長suffixの双方を扱うため、Manacherの二種類半径またはseparator変換を使う。

S（またはseparator込み列）へManacher法を適用する。各centerの半径から右端がNに達するpalindromeの最小start kを求め、Sへprefix[0,k)のreverseを連結する。

## 典型の発動条件

### palindrome completion

発動条件: 文字列をprefixに保ったまま末尾追加でpalindrome化するとき。

最長palindromic suffixを残し、不足prefixをreverseする。

### Manacher algorithm

発動条件: 全centerの最長palindrome半径を線形時間で求めたいとき。

末尾到達するodd/even palindromeを探索する。

## 問題固有の要素

完成文字列を探索せず、追加部分が既存prefixから強制されることを先に示すと、自由度は残すpalindromic suffixの長さだけになる。

別の問題へ持ち帰る視点: 最小append/prepend palindrome問題は、反対側の最長palindromic borderへ帰着する。

## 正当性

S先頭k文字のmirrorは追加suffixとして一意に強制される。残るS[k..]が回文ならその両側をmirrorで挟んで全回文になり、逆にも全回文なら残りは回文である。従って追加最小は最長回文suffixの開始k最小。Manacherは偶奇全中心の最大半径を求めるので右端Nへ届く候補を尽くす。

## 実装上の注意

- 長さ1、全体が既にpalindrome、even suffixを扱う。prefixをreverseする範囲はpalindromic suffix開始位置より前だけ。

## 復習の核

- 短い全stringをk全探索と比較し、既回文、palindrome suffix長1、最長suffixが偶数/奇数のcaseを確認する。

## 計算量と制約

### 時間

O(|S|)。Manacherと追加prefix反転。

### 空間

O(|S|)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string of length between 1 and 500000, inclusive, consisting of uppercase English letters.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/editorial/12501) — source-abc398-editorial-12501-01e1edb514d0ffe21194f92add6db7cc726417d4a9fa6e2b794adb918f94727f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/tasks/abc398_f) — source-abc398-f-problem-c396893f0e5336d3421eef21e366c3e05c35d3dfc955c0f3248dc124818a60eb
