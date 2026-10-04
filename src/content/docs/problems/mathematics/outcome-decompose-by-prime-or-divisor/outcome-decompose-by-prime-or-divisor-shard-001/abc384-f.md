---
title: "ABC384-F — Double Sum 2"
draft: true
authoringUnit: {"problemId":"abc384-f","docPath":"src/content/docs/problems/mathematics/outcome-decompose-by-prime-or-divisor/outcome-decompose-by-prime-or-divisor-shard-001/abc384-f.md","learningOutcomeIds":["outcome-decompose-by-prime-or-divisor"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["床関数や整数根の値が一定となる区間への分割。"],"tagIds":["tag-prime-divisor-decomposition"],"sourceRevisionIds":["source-abc384-editorial-11568-6cd162019da4df6e1237d39d3aa124ae586b7de8014d28607a84619e62964cbf","source-abc384-f-problem-b501d68ce08b504f7dd3cebf2a90e741710e70cfc9ed3be3a591dada95efa709"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"d_kを2^kで割り切れるi≤jの和A_i+A_jの総和とすると、v2がexactly kの層はd_k−d_{k+1}。各層を2^kで割ると目的の奇数部分になる。j走査で自身を先に登録してから補数剰余を照会すればi≤jが全て一度集計される。これを全kで差分すれば各pairが唯一の層で数えられる。","sourceRevisionIds":["source-abc384-editorial-11568-6cd162019da4df6e1237d39d3aa124ae586b7de8014d28607a84619e62964cbf","source-abc384-f-problem-b501d68ce08b504f7dd3cebf2a90e741710e70cfc9ed3be3a591dada95efa709"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [素因数分解と約数構造](src/content/docs/learn/number-theory/prime-divisor.md)

- 整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。

この解説で扱わないこと:

- 床関数や整数根の値が一定となる区間への分割。

## 考察

各和sをv2(s)=kで層分けすると目的値はs/2^k。d_kを2^kで割り切れるi≤jの和の総和とすれば層はd_k−d_{k+1}になる。各kについてj昇順に、現在A_jをその剰余counterへ先に登録し、補数剰余のcount C,sum SからC A_j+Sを加える。これでi≤jの対角も含み各pairを一度数える。登録を後にするとi<jだけなので、別途対角の奇数部分を足す必要がある。

## 典型の発動条件

倍数条件の累積量から隣接差を取ってexact p進指数へ戻す。補数剰余をcountとsumで集約し、pairの添字条件に登録時点を合わせる。

## 問題固有の要素

対象はi≤jなので対角pair(A_j,A_j)も寄与する。対角の和2A_jの奇数部分はA_jの奇数部分に等しい。

## 正当性

d_kを2^kで割り切れるi≤jの和A_i+A_jの総和とすると、v2がexactly kの層はd_k−d_{k+1}。各層を2^kで割ると目的の奇数部分になる。j走査で自身を先に登録してから補数剰余を照会すればi≤jが全て一度集計される。これを全kで差分すれば各pairが唯一の層で数えられる。

## 実装上の注意

先にA_jを登録してから補数剰余をlookupする。lookup後登録の実装なら全jの対角寄与を別加算する。各d_kと答えは64bit、負剰余は正規化し、最大和を超えた層は0とする。

## 復習の核

A=(1,3)ではi≤jの三和2,4,6から答え5。i<jだけの1と混同しない。余りが自分自身の補数になるcaseの登録順を確認する。

## 計算量と制約

### 時間

O(N log V)期待時間、V=2max A。各2冪の剰余をhash集計する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2\times 10^5; 1\le A_i\le 10^7; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc384/editorial/11568) — source-abc384-editorial-11568-6cd162019da4df6e1237d39d3aa124ae586b7de8014d28607a84619e62964cbf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc384/tasks/abc384_f) — source-abc384-f-problem-b501d68ce08b504f7dd3cebf2a90e741710e70cfc9ed3be3a591dada95efa709
