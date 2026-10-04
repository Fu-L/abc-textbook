---
title: "ABC272-F — Two Strings"
draft: true
authoringUnit: {"problemId":"abc272-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc272-f.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index"],"sourceRevisionIds":["source-abc272-f-problem-a727b0bf5f488819f551a42b8159ea16d18ca49319439ea98beeb18aec176ec8","source-abc272-editorial-4980-d52fbe747f96935bfd3eb3b09ba0482022ee7a90764a755c9d61e48a8e329860"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"巡回列が異なるpairは最初のN文字に最初の不一致があり、接尾辞比較も同じ方向となる。等しいpairはその長さNの周期的延長も一致する。padding開始距離の差がN未満なので、先のpaddingが終わる前に後のpaddingも始まる。その間は、S側がpaddingならa≤相手の小文字、T側がpaddingなら相手の小文字≤zなので、S側が大きくなることはない。両paddingが重なる最初の位置でa<zとなる。従って巡回列S側≤T側であることと、対象接尾辞S側がT側より先のrankであることが同値である。各Tを処理する時のcountSはそのrankより小さい全対象Sの数だから、条件を満たす全pairを一度ずつ加算する。","sourceRevisionIds":["source-abc272-f-problem-a727b0bf5f488819f551a42b8159ea16d18ca49319439ea98beeb18aec176ec8","source-abc272-editorial-4980-d52fbe747f96935bfd3eb3b09ba0482022ee7a90764a755c9d61e48a8e329860"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [接尾辞の順序とLCPを索引化する](src/content/docs/learn/string/suffix-lcp-index.md)

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- rolling hashによる一致比較と回文半径。

## 考察

0-indexで巡回列f(S,i)はSSのiから始まる長さNの部分列である。ただし長さNを切らず接尾辞のまま比較すると、等しい巡回列の後ろまで比較してしまう。本問は≤を数えるので、等しい時に必ずS側が先になる後続を設計する。

公式の構成X=SS+a^N+TT+z^Nを使う。S側の対象開始indexは0,…,N−1、T側は3N,…,4N−1だけである。最初のN文字で異なれば接尾辞順も同じ。等しい巡回列の場合のpaddingの証明は次の通り。

S側開始i、T側開始jからpadding開始までの距離はd_S=2N−i、d_T=2N−jで、差の絶対値はN未満。等しい巡回列の周期的延長は同じなので、先にpaddingへ達するまでは比較が一致する。Sが先ならaと相手の小文字を比べるのでS側が大きくなることはなく、Tが先なら相手の小文字とzを比べるのでやはりS側が大きくなることはない。その間に差が出なければ、遅い方もpaddingへ入る時点でS側a、T側zとなる。先のpaddingもまだN文字の中に残っているのでa<zが比較を必ず決める。i=jや全a・全z、周期の短い列も含む。

Xのsuffix arrayをSA-ISで構築し、辞書順の小さい方から走査する。対象S開始を見たらcountSを一増やし、対象T開始を見たらcountSを答えへ加える。それ以外の接尾辞は集計しない。対象接尾辞は別の開始点なのでrankは異なり、巡回列の等号はpaddingが作る厳密なS側先行として数えられる。答えは最大N²なので64 bit整数で持つ。

全N²pairを直接比較すればpair数だけで二乗になる。ここでは全比較の順序を一つの索引へまとめ、二群の順位関係を一回の走査で集計する。

## 典型の発動条件

### 二倍文字列によるrotation表現

発動条件: 固定長stringの全cyclic shiftsをsubstringとして同時に扱いたいとき。

SとTをそれぞれ二回連結し、先頭N positionsをrotation startsとみなす。

### suffix arrayによる全比較の順位化

発動条件: 多数のsubstring間のlexicographic relationを一括で数えたいとき。

combined stringのsuffix arrayからS/T rotation startsの相対rankを得てpair countingする。

## 問題固有の要素

a,zは入力にも現れるので「一文字の番兵で直ちに差が出る」とは限らない。N文字ずつのpaddingに重なる位置があることまで示すと、全同字や周期列の等号も保証できる。

別の問題へ持ち帰る視点: 固定長部分列を接尾辞として比較する時は、等しいprefixの後続が要求するstrict/non-strict関係を、後続の字母と長さの両方で設計する。

## 正当性

巡回列が異なるpairは最初のN文字に最初の不一致があり、接尾辞比較も同じ方向となる。等しいpairはその長さNの周期的延長も一致する。padding開始距離の差がN未満なので、先のpaddingが終わる前に後のpaddingも始まる。その間は、S側がpaddingならa≤相手の小文字、T側がpaddingなら相手の小文字≤zなので、S側が大きくなることはない。両paddingが重なる最初の位置でa<zとなる。従って巡回列S側≤T側であることと、対象接尾辞S側がT側より先のrankであることが同値である。各Tを処理する時のcountSはそのrankより小さい全対象Sの数だから、条件を満たす全pairを一度ずつ加算する。

## 実装上の注意

- combined string内で対象にするのは各SS/TT blockの最初のN start positionsだけで、paddingや二個目のcopyを数えない。
- pair数はN^2まで達するため64 bit整数で集計する。

## 復習の核

- cyclic shiftsはdoubled stringへ置き換え、全比較をsuffix ranksのcross-group countingへまとめる。
- fixed-length prefixが完全一致するcaseでsuffix orderが何を返すかを確認し、paddingで≤のtieを制御する。

## 計算量と制約

### 時間

SA-IS使用でO(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 2 \times 10^5; S and T are strings of length N each, consisting of lowercase English letters.; N is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/tasks/abc272_f) — source-abc272-f-problem-a727b0bf5f488819f551a42b8159ea16d18ca49319439ea98beeb18aec176ec8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc272/editorial/4980) — source-abc272-editorial-4980-d52fbe747f96935bfd3eb3b09ba0482022ee7a90764a755c9d61e48a8e329860
