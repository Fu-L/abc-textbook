---
title: "ABC346-F — SSttrriinngg in StringString"
draft: true
authoringUnit: {"problemId":"abc346-f","docPath":"src/content/docs/problems/string-geometry/outcome-query-recursively-defined-string/outcome-query-recursively-defined-string-shard-001/abc346-f.md","learningOutcomeIds":["outcome-query-recursively-defined-string"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-search"],"excludedTopics":["明示された文字列への接尾辞索引の構築。"],"tagIds":["tag-recursive-compressed-string","tag-monotone-threshold-search"],"sourceRevisionIds":["source-abc346-editorial-9644-88f7e07664cbfa0a620f9e228a583be943e0b1dd2c9f831fa6a5d315791ddf01","source-abc346-f-problem-769406fbef8b7355fc2543f1baf82c8095f9f130818a7db02444532f78852c8a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"subsequence照合は各要求文字の最早出現を選べば、任意の他照合より後続余地を減らさないので必要十分判定になる。一文字k連続要求は周期内頻度から完全周回を飛ばし残り出現順位を求めることと同じ。kを増やすと要求列は長くなり可否は単調なので上限までの二分探索が最大kを得る。","sourceRevisionIds":["source-abc346-editorial-9644-88f7e07664cbfa0a620f9e228a583be943e0b1dd2c9f831fa6a5d315791ddf01","source-abc346-f-problem-769406fbef8b7355fc2543f1baf82c8095f9f130818a7db02444532f78852c8a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [圧縮・反復・再帰文字列へ問い合わせる](src/content/docs/learn/string/recursive-compressed-string.md)

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

先に読む単元:

- [単調境界を証明して探索する](src/content/docs/learn/modeling/monotone-search.md) — 判定結果が一方向に変わることを証明し、巨大な値域から成功・失敗の境界を二分探索で求める。

この解説で扱わないこと:

- 明示された文字列への接尾辞索引の構築。

## 考察

kを大きくしてg(T,k)がsubsequenceでなくなれば、それ以上も不可能なので答えは単調判定を二分探索できる。固定kではTの各文字をk回ずつ、f(S,N)内の最早位置へgreedy matchingすればよい。

採用する候補: 文字別出現位置と周期countを使うsubsequence判定＋k二分探索

巨大なS^Nを構築せず、各T文字についてk個先の出現をO(log |S|)またはO(1)算術で飛べる。

棄却する候補: f(S,N)とg(T,k)を実際に生成する

Nは10^12で繰返し文字列長が巨大になりmemory/timeとも不可能である。

現在absolute位置a以降で文字cのb回目出現は、S一周期内のc個数cnt_cでfull cyclesをまとめ、S+S内の出現位置またはposition vectorのlower_boundで残りを決められる。最早出現を選ぶgreedyは後続に最大の余地を残す。

S内の各文字の出現positionを前計算し、TにS不在文字があれば0を返す。feasible(k)ではpos=0から各c∈Tについて、pos mod |S|以降のc出現数、必要なfull cycle数、周期内indexを算術とbinary searchで求めてposをk個目の直後へ進め、pos≤N|S|か判定する。0…floor(N|S|/|T|)で最大kを二分探索する。

## 典型の発動条件

### 周期文字列上のk-th occurrence jump

発動条件: 有限base stringの巨大反復上で、指定文字の多数回先の出現位置が欲しい。

一周期countで商を飛ばし、周期内position listで余りを定位する。

### 答えの二分探索

発動条件: k回のblock反復がsubsequenceなら、それより小さい回数も必ずsubsequenceである。

feasible(k)を単調predicateとして最大の真を探す。

## 問題固有の要素

g(T,k)はT全体をk回繰り返すのではなく、各T文字を連続k回要求するので、判定loopはT順に文字ごとのk-th occurrence jumpを行う。

別の問題へ持ち帰る視点: 似た二種類のrepeat定義は展開順序を明示し、要求run単位のjumpへ合わせる。

## 正当性

subsequence照合は各要求文字の最早出現を選べば、任意の他照合より後続余地を減らさないので必要十分判定になる。一文字k連続要求は周期内頻度から完全周回を飛ばし残り出現順位を求めることと同じ。kを増やすと要求列は長くなり可否は単調なので上限までの二分探索が最大kを得る。

## 実装上の注意

- absolute positionとN|S|は最大10^17級なので64bitを使い、jump途中で上限超過したら早期falseにする。positionは「次に探すindex」か「最後に使ったindex」かを統一する。

## 復習の核

- TにS不在文字、k=0、S一周期境界を跨ぐrun、同じ文字が疎なSを小さい反復文字列の直接matchingと比較する。

## 計算量と制約

### 時間

O(|S|+|T| log|S|·log(N|S|/|T|+1))。文字別position列のlower_boundで各batchをjumpする。

### 空間

O(|S|+|T|)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1\leq N\leq 10^{12}; S and T are strings consisting of lowercase English letters with lengths between 1 and 10^5, inclusive.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc346/editorial/9644) — source-abc346-editorial-9644-88f7e07664cbfa0a620f9e228a583be943e0b1dd2c9f831fa6a5d315791ddf01
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc346/tasks/abc346_f) — source-abc346-f-problem-769406fbef8b7355fc2543f1baf82c8095f9f130818a7db02444532f78852c8a
