---
title: "ABC272-F — Two Strings"
draft: true
authoringUnit: {"problemId":"abc272-f","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc272-f.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index"],"sourceRevisionIds":["source-abc272-f-problem-a727b0bf5f488819f551a42b8159ea16d18ca49319439ea98beeb18aec176ec8","source-abc272-editorial-4980-d52fbe747f96935bfd3eb3b09ba0482022ee7a90764a755c9d61e48a8e329860"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各巡回シフトは倍化文字列内の長さNの区間として現れる。比較の最初のN文字で差が出ればsuffix順と巡回文字列順が一致する。等しい場合はS側が先になるようpaddingの字母と長さを設計し、S≤Tという等号込みの条件をsuffixの全順序へ埋め込む。対象の開始点だけをSA順に走査し、T側ごとに先行S側の個数を加えれば全条件成立対を一度ずつ数える。paddingの正しさが等号処理の証明に不可欠である。","sourceRevisionIds":["source-abc272-f-problem-a727b0bf5f488819f551a42b8159ea16d18ca49319439ea98beeb18aec176ec8","source-abc272-editorial-4980-d52fbe747f96935bfd3eb3b09ba0482022ee7a90764a755c9d61e48a8e329860"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

rotation f(S,i)はdoubled string SSのposition iから始まるlength-N substringとして表せるが、通常のsuffix orderだけでは同一rotationの≤を正しくtie-breakできない。

X=SS+a^N+TT+z^Nというpadding付き文字列では、S側とT側の対象suffix順が長さNのrotationsの≤関係と一致する。

棄却する候補: N^2個のrotation pairsごとにlength Nの文字列を比較する。

pair数だけでO(N^2)となり、比較生成まで含めるとさらに重い。

採用する候補: padding付きcombined stringのsuffix arrayを構築し、対象S/T suffixのrank順を一回走査して条件を満たすpair数を数える。

全rotation比較を一つのtotal orderに埋め込み、SA-IS構築後はlinear scanだけで集計できる。

rotationsが最初のN文字以内で異なればsuffix比較も同じ箇所で決まり、等しい場合はa-paddingとz-paddingがS側≤T側になるよう順序を固定する。

suffix arrayを小さい順に走査して既出S rotations数を持てば、各T rotationでrank(S)≤rank(T)の個数を答えへ加えられる。

cyclic-string comparisonをcarefully padded doubled stringsのsuffix rankingへ変換し、cross-group order pairsをrank sweepで数える。

## 典型の発動条件

### 二倍文字列によるrotation表現

発動条件: 固定長stringの全cyclic shiftsをsubstringとして同時に扱いたいとき。

SとTをそれぞれ二回連結し、先頭N positionsをrotation startsとみなす。

### suffix arrayによる全比較の順位化

発動条件: 多数のsubstring間のlexicographic relationを一括で数えたいとき。

combined stringのsuffix arrayからS/T rotation startsの相対rankを得てpair countingする。

## 問題固有の要素

equal rotationsも条件≤には含むため、S側の後続を小さく、T側の後続を大きくするa^N/z^N paddingがtieを望む向きへ崩す。

別の問題へ持ち帰る視点: fixed-length substring比較をsuffix比較へ移すときは、prefix-equal caseの後続文字が要求するstrict/non-strict relationを再現するようsentinelを設計する。

## 正当性

各巡回シフトは倍化文字列内の長さNの区間として現れる。比較の最初のN文字で差が出ればsuffix順と巡回文字列順が一致する。等しい場合はS側が先になるようpaddingの字母と長さを設計し、S≤Tという等号込みの条件をsuffixの全順序へ埋め込む。対象の開始点だけをSA順に走査し、T側ごとに先行S側の個数を加えれば全条件成立対を一度ずつ数える。paddingの正しさが等号処理の証明に不可欠である。

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
