---
title: "ABC259-E — LCM on Whiteboard"
draft: true
authoringUnit: {"problemId":"abc259-e","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc259-e.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc259-e-problem-eb7a258d38ce1d9f2ef53211daa3360cf49824f3019fbd9570feb5c144957816","source-abc259-editorial-4271-76fe64c5c7a413668836b08101de648037f01ce8e462d52ce8eb8b8d1ab980e8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"LCMの各素数指数は最大値なので、除去で変わるのはその最大を唯一担う要素だけ。異なる特別要素i,jではiだけが最大の素数がi除去で下がりj除去で残るので結果は異なる。特別でない要素を除いた結果は全て元のLCMと同一。従って特別c種類と、存在するときだけ不変1種類を足す。","sourceRevisionIds":["source-abc259-e-problem-eb7a258d38ce1d9f2ef53211daa3360cf49824f3019fbd9570feb5c144957816","source-abc259-editorial-4271-76fe64c5c7a413668836b08101de648037f01ce8e462d52ce8eb8b8d1ab980e8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

この解説で扱わないこと:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

最小公倍数の素数pの指数は、全a_iにおけるpの指数の最大値である。a_iを1へ変えた影響は、a_iだけがある素数の最大指数を担っていたかどうかで決まる。

数値そのものは巨大になり得るが、入力は素因数と指数の組で与えられ、組の総数は2×10^5以下である。したがって素数ごとの最大指数と、その達成者数だけなら保持できる。

棄却する候補: 各iを除くN−1個の素因数表現を毎回走査し、得られるLCMの連想配列を集合へ入れる。

入力中の素因数組をiごとに再走査すると、Nと組数の積に近い処理になり制約を超える。

採用する候補: 素数ごとに全体の最大指数とその達成者数を集約し、各a_iが一意な最大指数を一つでも持つかを判定する。

a_iの除去でLCMが変わる必要十分条件を入力に現れる各素因数組だけで判定でき、変化する結果同士も区別できる。

a_iを除いてLCMが変わるのは、あるpについてa_iの指数が全体最大で、かつその最大値を持つ整数がa_iだけである場合に限る。

この条件を満たす異なるi,jの除去結果は同じにならない。iだけが最大だった素数pは、iを除けば指数が下がるが、jを除いたLCMでは最大のまま残るからである。

最初の走査で各素数pの最大指数max[p]と達成者数count[p]を求める。次に各a_iの組(p,e)を見てe=max[p]かつcount[p]=1が一つでもあればiを特別と数える。その個数をcとし、特別でないiがあれば共通の『LCM不変』も1種類なので、答えをmin(c+1,N)とする。

## 典型の発動条件

### LCMの素因数指数ごとの分解

発動条件: 整数が素因数分解済みで与えられ、LCMへ要素の追加・削除が与える影響を調べたいとき。

LCMを実数値で構成せず、各素数の最大指数として比較する。

### 最大値の達成者数の集約

発動条件: 要素を一つ除いたときに、属性ごとの最大値が変化するかだけを知りたいとき。

素数ごとの最大指数と同率最大の個数を持ち、一意な最大を担う整数を判定する。

## 問題固有の要素

LCMが変わる除去結果は全て相異なり、LCMが変わらない除去は全て同じ結果になるため、LCM表現をhashして種類数を直接管理する必要がない。

別の問題へ持ち帰る視点: 集合値の種類数を問われたら、各操作結果を構成する前に、変化を起こす証拠が操作ごとの識別子にもなるかを調べる。

## 正当性

LCMの各素数指数は最大値なので、除去で変わるのはその最大を唯一担う要素だけ。異なる特別要素i,jではiだけが最大の素数がi除去で下がりj除去で残るので結果は異なる。特別でない要素を除いた結果は全て元のLCMと同一。従って特別c種類と、存在するときだけ不変1種類を足す。

## 実装上の注意

- 最大指数を更新するときは達成者数を1へ戻し、同じ最大指数なら達成者数だけ増やす。入力に現れない素数の指数0は保存不要である。
- 全てのiが特別な場合には『LCM不変』の結果が存在しないため、c+1ではなくmin(c+1,N)とする。

## 復習の核

- 『一意最大ならLCMが変わる』の必要十分性に加え、特別な二つの除去結果が異なる証明と、非特別な除去が全体LCMへ合流することを分けて確認する。

## 計算量と制約

### 時間

O(S log S)で素数ごとにsort、S=Σm_i。hash集計なら期待O(S)。

### 空間

O(S)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq m_i; \sum{m_i} \leq 2 \times 10^5; 2 \leq p_{i,1} \lt \ldots \lt p_{i,m_i} \leq 10^9; p_{i,j} is prime.; 1 \leq e_{i,j} \leq 10^9; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc259/tasks/abc259_e) — source-abc259-e-problem-eb7a258d38ce1d9f2ef53211daa3360cf49824f3019fbd9570feb5c144957816
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc259/editorial/4271) — source-abc259-editorial-4271-76fe64c5c7a413668836b08101de648037f01ce8e462d52ce8eb8b8d1ab980e8
