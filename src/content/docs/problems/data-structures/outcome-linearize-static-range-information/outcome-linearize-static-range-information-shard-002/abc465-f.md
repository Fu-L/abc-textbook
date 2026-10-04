---
title: "ABC465-F — Sjeltzer?"
draft: true
authoringUnit: {"problemId":"abc465-f","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-002/abc465-f.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference"],"sourceRevisionIds":["source-abc465-editorial-22562-36c2843189624076ba172ca8a1b2407c7540468aee86c2eb28e660f3bb35e6b4","source-abc465-f-problem-c9109dea2048fa5cc3b2fce223d2b8a41089a550bf80d96a71c5b1220b08bde1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"base10 indexの桁kを一つずつ累積すると、他の桁を固定したline上のprefix sumを全座標へin-place伝播できる。 下端x_k=0のdimensionでx_k-1を選ぶ包除項は空boxなので0としてskipする。 各dimensionの累積和を順に適用するとzeta[y]=Σ_{s_k≤y_k}weight(s)になり、直方体[x,y]は各dimensionで上端yか下端x-1を選ぶ標準包除で完全に復元できる。","sourceRevisionIds":["source-abc465-editorial-22562-36c2843189624076ba172ca8a1b2407c7540468aee86c2eb28e660f3bb35e6b4","source-abc465-f-problem-c9109dea2048fa5cc3b2fce223d2b8a41089a550bf80d96a71c5b1220b08bde1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

この解説で扱わないこと:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

各IDの六桁size sをcoordinate-wise box x≤s≤y で集計するqueryである。下端0のprefix box総和を全10^6座標に前計算すれば一般boxは六次元包除で得られる。

採用する候補: sizeをbase10六次元indexにして6方向のzeta transformを行い、各queryでx_k>y_kなら0、そうでなければ下端条件を64個のprefix boxへ包除する。

棄却する候補: 各queryで全IDを走査し、六桁が各区間内か比較してsizeを足す。

NQ回の六次元比較となり、座標値域10^6が固定である利点を使えていない。

10^6配列に各ID weightを加える。k=0..5で全indexを走査しdigit_k>0ならzeta[idx]+=zeta[idx-10^k]とする。queryはmask0..63で bound_k=(mask bit?x_k-1:y_k)、符号(-1)^{popcount}を付けzeta[bound]を合計する。

## 典型の発動条件

### 6次元累積和（鎖の直積上のprefix集約）

発動条件: 各座標が小さく固定次元で、coordinate-wise prefix box総和を多数問うとき。

各軸の桁値0〜9を昇順に累積する。添字の順序は座標ごとの大小関係であり、二進部分マスク関係ではない。

### 直方体の包除原理

発動条件: prefix box oracleから一般axis-aligned box総和を求めたいとき。

各dimensionの上端・下端直前を2^D通り選ぶ。

## 問題固有の要素

六桁decimal IDを一整数でなく各桁独立座標として見ると、固定10^6gridの多次元prefix sumになる。

別の問題へ持ち帰る視点: 次元6は2^6包除が小さいため、query数が多くても定数64項で処理できる。

## 正当性

base10 indexの桁kを一つずつ累積すると、他の桁を固定したline上のprefix sumを全座標へin-place伝播できる。 下端x_k=0のdimensionでx_k-1を選ぶ包除項は空boxなので0としてskipする。 各dimensionの累積和を順に適用するとzeta[y]=Σ_{s_k≤y_k}weight(s)になり、直方体[x,y]は各dimensionで上端yか下端x-1を選ぶ標準包除で完全に復元できる。

## 実装上の注意

- leading zeroを含む六桁分解を固定し、idxのdigit判定でdecimal carryを跨がない。weight総和に十分な64 bitを使う。

## 復習の核

- 二次元版のprefix rectangle包除を先に書き、base10 indexで一dimension累積がidx-10^kになる条件を確認する。

## 計算量と制約

### 時間

O(N+6·10⁶+64Q)、NはID数、Qはbox query数。

### 空間

O(10⁶)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1 \leq N \leq 3 \times 10^5; S_i is a string consisting of digits (0-9).; |S_i| = 6; S_1, \dots, S_N are distinct.; V_i is an integer.; 1 \leq V_i \leq 10^9; Q is an integer.; 1 \leq Q \leq 3 \times 10^5; In each query, x and y are strings consisting of digits (0-9).; In each query, |x| = |y| = 6.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/editorial/22562) — source-abc465-editorial-22562-36c2843189624076ba172ca8a1b2407c7540468aee86c2eb28e660f3bb35e6b4
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/tasks/abc465_f) — source-abc465-f-problem-c9109dea2048fa5cc3b2fce223d2b8a41089a550bf80d96a71c5b1220b08bde1
