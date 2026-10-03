---
title: "ABC299-F — Square Subsequence"
draft: true
authoringUnit: {"problemId":"abc299-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc299-f.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc299-editorial-6251-94128205fc1b51c51fdfe62c4746d7ae50cc2230ebb5f40e1ca4799fb2f23905","source-abc299-f-problem-33a84192a9a499265c4e7d0f05a7e4276ac4e4d1674e1d1a89a8f8f2e075fe6a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"任意の文字列TTには全体を左から最左出現で取る一意な取り出し方があり、その後半先頭xも一意である。xを固定したDPはTの先頭を決め、同じ次文字を両半分へ最左遷移するので、それぞれの文字列Tを一度だけ生成する。p<xが前半と後半の順序を保ち、終了時のσ(p,S_x)=xがTT全体の最左取り出し方との一致を保証する。よって各有効なTTはその唯一のxの終了状態に一度だけ数えられ、全xの総和は種類数になる。","sourceRevisionIds":["source-abc299-editorial-6251-94128205fc1b51c51fdfe62c4746d7ae50cc2230ebb5f40e1ca4799fb2f23905","source-abc299-f-problem-33a84192a9a499265c4e7d0f05a7e4276ac4e4d1674e1d1a89a8f8f2e075fe6a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じ部分列文字列を重複なく数えるには、各文字を常に直前位置より右で最左の出現から取る取り出し方を固定する。σ(i,c)をiより厳密に右で文字cが最初に現れる位置、存在しなければN+1と定義し、i=0,…,Nと26文字について前計算する。

TTの後半先頭q_1=xを固定する。先頭文字はT_1=S_x、前半先頭はp_1=σ(0,S_x)。p_1≥xなら有効なTTはない。そうでなければdp[p_1][x]=1、その他0から始める。

dp[p][q]は、現在までの同じ文字列を前半・後半からそれぞれ最左遷移で取り出し、その末尾がp,qになった種類数。次文字cを選びp'=σ(p,c),q'=σ(q,c)とし、p'<xかつq'≤Nならdp[p'][q']+=dp[p][q]とする。両添字が厳密に増えるため、p,qの昇順で評価できる。

前半が終わった直後の同じ先頭文字の最左位置がxでなければ、TT全体の最左取り出し方ではない。従ってσ(p,S_x)=xを満たす状態だけをΣ_q dp[p][q]として足す。短いTも途中状態で数え、さらに延長する遷移も続ける。全てのxについて加算したものが回答で、法998244353上で求める。

p<xを保つだけでは前半と後半の境界の一意性を保証できない。最後のσ条件が、同じTTを異なるxで数える重複を除く。一方、位置の取り出し方を全列挙する方法は2^N通りであり、同じ文字列を繰り返し数えてしまう。

## 典型の発動条件

### distinct subsequenceのcanonical embedding

発動条件: 同一文字列の複数取り出し方を一度だけ数える。

各文字を常に最左の可能位置から選ぶ。

### 二列同期遷移DP

発動条件: 同じ未知文字列を二つのsubsequenceとして並行に埋め込む。

前半・後半位置対を状態にし同じ文字で進める。

## 問題固有の要素

square TTの二コピーを同時に追い、後半の最初位置で分類すると重複除去条件を局所化できる。

別の問題へ持ち帰る視点: 繰返しsubsequenceは複数embeddingを最左規則で正規化する。

## 正当性

任意の文字列TTには全体を左から最左出現で取る一意な取り出し方があり、その後半先頭xも一意である。xを固定したDPはTの先頭を決め、同じ次文字を両半分へ最左遷移するので、それぞれの文字列Tを一度だけ生成する。p<xが前半と後半の順序を保ち、終了時のσ(p,S_x)=xがTT全体の最左取り出し方との一致を保証する。よって各有効なTTはその唯一のxの終了状態に一度だけ数えられ、全xの総和は種類数になる。

## 実装上の注意

- nextが∞の遷移を除き、長さ0のTを数えず、終了条件を各状態で重複加算しない。

## 復習の核

- N≤12の全subsequence文字列setと比較し、同文字反復、重なるembedding、長さ奇数でsquare不能な例を確認する。

## 計算量と制約

### 時間

O(26N³)、後半先頭xごとに位置pair DP。

### 空間

O(N²+26N)、一xのDPとnext表。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: S is a string consisting of lowercase English letters whose length is between 1 and 100, inclusive.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/editorial/6251) — source-abc299-editorial-6251-94128205fc1b51c51fdfe62c4746d7ae50cc2230ebb5f40e1ca4799fb2f23905
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc299/tasks/abc299_f) — source-abc299-f-problem-33a84192a9a499265c4e7d0f05a7e4276ac4e4d1674e1d1a89a8f8f2e075fe6a
