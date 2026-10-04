---
title: "ABC339-E — Smooth Subsequence"
draft: true
authoringUnit: {"problemId":"abc339-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-aggregate-subsequence-transitions-by-value/outcome-aggregate-subsequence-transitions-by-value-shard-001/abc339-e.md","learningOutcomeIds":["outcome-aggregate-subsequence-transitions-by-value"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-sequence","unit-range-monoid-aggregation"],"excludedTopics":["値域集約による部分列DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-value-range-dp","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc339-e-problem-d1ae6b185f28e930dd11f3599a4571ed64b9e1fe38266405278a0a9df6a93bdd","source-abc339-editorial-9210-e395e1e0a4a0093fb7af80b3b3dad26c960b2f5bccedf1f8c83363bc38e6e94b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各A_iで終わる解の直前値は[A_i−D,A_i+D]に限る。前prefixのこの範囲の最長値へ1を足せば全候補を覆う。値が同じ状態は長い方が全将来に有利なので最大だけを保持でき、入力順の帰納法で正しい。","sourceRevisionIds":["source-abc339-e-problem-d1ae6b185f28e930dd11f3599a4571ed64b9e1fe38266405278a0a9df6a93bdd","source-abc339-editorial-9210-e395e1e0a4a0093fb7af80b3b3dad26c960b2f5bccedf1f8c83363bc38e6e94b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [値域集約による部分列DP](src/content/docs/learn/dynamic-programming/dp-value-range.md)

- 末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md) — DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。
- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md) — queryに十分な値と結合順・単位元を定義し、Segment Treeまたはprefix foldで動的区間要約を保つ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

A_iを末尾にするsmooth subsequenceの最長長だけを値ごとに持てばよい。直前値xは|x-A_i|≤D、すなわち値域区間[A_i-D,A_i+D]にあるため、遷移は区間最大値+1になる。 dp[x]を処理済みprefixで値xを末尾とする最大長とすれば、A_i以外のdpは変化しない。new=1+max_{x∈[A_i-D,A_i+D]}dp[x]を計算してdp[A_i]をchmaxすれば、同じ値が再登場しても最良prefixだけを残せる。

採用する候補: 値軸segment treeでrange maximum queryとpoint chmaxを行う

入力順を保つ一次元DPを、値域上のO(log V)query/updateで実装できる。

棄却する候補: 各iで全ての以前のjを調べるLIS型二重loop

隣接差条件の確認にO(N^2)かかりN=5×10^5に間に合わない。

dp[x]を処理済みprefixで値xを末尾とする最大長とすれば、A_i以外のdpは変化しない。new=1+max_{x∈[A_i-D,A_i+D]}dp[x]を計算してdp[A_i]をchmaxすれば、同じ値が再登場しても最良prefixだけを残せる。

値域1…500000にmax segment treeを作る。A_iを左から読み、l=max(1,A_i-D), r=min(V,A_i+D)の区間maxをqueryしv+1を得る。位置A_iを現在値とのmaxでpoint updateし、tree全体のmaxを出力する。

## 典型の発動条件

### 値域DP

発動条件: subsequence遷移条件がindex距離でなく直前要素の値範囲で決まる。

末尾値ごとにprefix内の最良長をまとめ、入力順に一度ずつ更新する。

### segment treeのrange max・point update

発動条件: 連続値区間の最大値を多数queryし、一点だけchmaxする。

値をleaf indexにしてmonoid maxを管理する。

## 問題固有の要素

dpにindex次元を残す必要はなく、将来から区別されるのは最後の値だけなので、過去の同値末尾を最大長へ集約できる。

別の問題へ持ち帰る視点: subsequence DPは将来条件が末尾値だけを見るなら、index×値状態を値別frontierへ圧縮する。

## 正当性

各A_iで終わる解の直前値は[A_i−D,A_i+D]に限る。前prefixのこの範囲の最長値へ1を足せば全候補を覆う。値が同じ状態は長い方が全将来に有利なので最大だけを保持でき、入力順の帰納法で正しい。

## 実装上の注意

- query区間は値域端で切り、segment treeが半開区間ならr+1を渡す。D=0では同値だけが遷移元となり、update前の値をqueryしてから加える。

## 復習の核

- D=0、Dが値域以上、同じ値の反復、増減が交互の列をO(N^2) DPと比較する。

## 計算量と制約

### 時間

列長N、値域V=500000。segment treeで O(N log V)。

### 空間

DPを値ごとに保持して O(V)、入力逐次処理可。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 0 \leq D \leq 5 \times 10^5; 1 \leq A_i \leq 5 \times 10^5; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc339/tasks/abc339_e) — source-abc339-e-problem-d1ae6b185f28e930dd11f3599a4571ed64b9e1fe38266405278a0a9df6a93bdd
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc339/editorial/9210) — source-abc339-editorial-9210-e395e1e0a4a0093fb7af80b3b3dad26c960b2f5bccedf1f8c83363bc38e6e94b
