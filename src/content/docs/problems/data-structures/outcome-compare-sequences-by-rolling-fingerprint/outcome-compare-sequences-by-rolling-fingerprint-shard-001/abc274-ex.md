---
title: "ABC274-EX — XOR Sum of Arrays"
draft: true
authoringUnit: {"problemId":"abc274-ex","docPath":"src/content/docs/problems/data-structures/outcome-compare-sequences-by-rolling-fingerprint/outcome-compare-sequences-by-rolling-fingerprint-shard-001/abc274-ex.md","learningOutcomeIds":["outcome-compare-sequences-by-rolling-fingerprint","outcome-compute-in-finite-field-extension"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["列・文字列のrolling fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-finite-field-extension","tag-sequence-fingerprint"],"sourceRevisionIds":["source-abc274-ex-problem-1977cb083717a817883b8a1b0087b2f48e93b0d3dc6a6476be2d4f433637865f","source-abc274-editorial-5026-a8d70954ac8fc6d04a66ca8b0fe9fa0e4f8c4e764783633bec1da60e35e26838"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"hash(A[a..a+k)) xor hash(A[c..c+k))がelementwise XOR列prefixのhashに一致するため、virtual sequenceをmaterializeせずequality判定できる。 LCPがmin(leftLength,rightLength)未満なら実値A_{a+l} xor A_{c+l}とA_{e+l}を比較し、全prefix一致なら短い列だけがstrictly smallerである。 各substring hashとXOR-combined hashを定数時間で作れ、一queryをO(log N) hash comparisonsにできる。 ここでhash一致を列の一致とみなす箇所は衝突がない条件で正しい。長さk以下の異なる列のhash差はβの非零多項式で、固定入力に対し一様な64-bit体のβを使えば誤一致確率は高々(k−1)/2^64。基数を非退化値に限定する場合はその候補数を分母に使う。複数の照合への失敗確率は和の上界で評価する。","sourceRevisionIds":["source-abc274-ex-problem-1977cb083717a817883b8a1b0087b2f48e93b0d3dc6a6476be2d4f433637865f","source-abc274-editorial-5026-a8d70954ac8fc6d04a66ca8b0fe9fa0e4f8c4e764783633bec1da60e35e26838"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・文字列のrolling fingerprint](src/content/docs/learn/query/sequence-fingerprint.md)

- 順序を保つprefix hashと連結則を設計し、部分列のhash差やLCP二分探索で列の一致を比較する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。
- 基底と既約関係を定めて拡大有限体の元を一意に表し、標準形を保つ加減乗除を実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 列・文字列のrolling fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

lexicographic comparisonは二列のLCP長を求め、最初の不一致要素またはlengthだけを比較すればよい。

通常rolling hashはelementwise additionに線形だが、nimber fieldではfield additionがbitwise XORなので H(B xor C)=H(B) xor H(C) が成り立つ。

棄却する候補: 各queryでXOR列を実際に生成し、target subarrayと先頭から比較する。

query lengthの総和がNQ規模になり得る。

採用する候補: 64-bit nimbers上のrandom-base rolling hashを前計算し、virtual XOR sequenceとtargetのprefix equalityをbinary searchしてLCPを得る。

各substring hashとXOR-combined hashを定数時間で作れ、一queryをO(log N) hash comparisonsにできる。

hash(A[a..a+k)) xor hash(A[c..c+k))がelementwise XOR列prefixのhashに一致するため、virtual sequenceをmaterializeせずequality判定できる。

LCPがmin(leftLength,rightLength)未満なら実値A_{a+l} xor A_{c+l}とA_{e+l}を比較し、全prefix一致なら短い列だけがstrictly smallerである。

XORを加法とするfinite fieldへrolling hashを移植し、linear hash compositionとLCP binary searchでvirtual arraysを比較する。

Nim積を⊗、加法をxorと書く。基数β、pow[0]=1、pow[t+1]=pow[t]⊗βを用い、prefix[0]=0、prefix[i+1]=(prefix[i]⊗β) xor A_iとする。0-based半開区間[l,r)のhashはprefix[r] xor (prefix[l]⊗pow[r−l])。これで全substringを同じ次数へ揃えられ、同長の二列のhashをxorするだけで要素ごとのXOR列のhashが得られる。

長さkでこの合成hashと第三列のprefix hashを比べ、共通prefix長を二分探索する。hash衝突がなければ一致判定は単調。探索後は実要素を比較し、共通prefixだけで片方が尽きた場合は長さを比較する。hashは確率的な一致判定であり、体上の線形性そのものは厳密だが、異なる列のhash一致を完全には排除しない。

## 典型の発動条件

### rolling hashによるLCP二分探索

発動条件: 多数のsubstring/virtual sequenceをlexicographically比較し、prefix equalityを高速判定できるとき。

prefix length kのhash一致をpredicateとして最大共通prefix長をbinary searchする。

### 演算に線形なhash fieldの選択

発動条件: elementwise演算後のsequence hashをoperand hashesから直接合成したいとき。

XORが加法になるnimber fieldとNim productをrolling-hashの係数演算に用いる。

## 問題固有の要素

64-bit nimber hashでruntime-random baseを選ぶと、入力を固定するjudgeがcollision rootを狙うことを防ぎ、長さに対して小さいfailure probabilityを得る。

別の問題へ持ち帰る視点: combined sequenceの演算とhash加法を一致させるには、その演算を加法に持つalgebraic fieldを探す。

## 正当性

hash(A[a..a+k)) xor hash(A[c..c+k))がelementwise XOR列prefixのhashに一致するため、virtual sequenceをmaterializeせずequality判定できる。 LCPがmin(leftLength,rightLength)未満なら実値A_{a+l} xor A_{c+l}とA_{e+l}を比較し、全prefix一致なら短い列だけがstrictly smallerである。 各substring hashとXOR-combined hashを定数時間で作れ、一queryをO(log N) hash comparisonsにできる。 ここでhash一致を列の一致とみなす箇所は衝突がない条件で正しい。長さk以下の異なる列のhash差はβの非零多項式で、固定入力に対し一様な64-bit体のβを使えば誤一致確率は高々(k−1)/2^64。基数を非退化値に限定する場合はその候補数を分母に使う。複数の照合への失敗確率は和の上界で評価する。

## 実装上の注意

- substring hashのlength normalizationを揃え、三prefixが同じ次数配置になるようprefix formulaとpowersを統一する。
- Nim productは再帰分解と小block tableで実装し、baseは実行時randomかつ0,1など退化値を避ける。

## 復習の核

- virtual elementwise sequenceの比較は、演算に線形なhashを作ってprefix equality oracleにする。
- lexicographic判定ではLCP探索後の不一致比較と、片方がprefixになったlength比較を分離する。

## 計算量と制約

### 時間

前計算O(N)、Q比較O(Q log N)。64-bit nimber演算の固定幅コストを定数とする。

### 空間

O(N)、hashと基数冪。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^5; 0 \leq A_i \leq 10^{18}; 1 \leq Q \leq 5 \times 10^4; 1 \leq a \leq b \leq N; 1 \leq c \leq d \leq N; 1 \leq e \leq f \leq N; b - a = d - c; All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/tasks/abc274_h) — source-abc274-ex-problem-1977cb083717a817883b8a1b0087b2f48e93b0d3dc6a6476be2d4f433637865f
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/editorial/5026) — source-abc274-editorial-5026-a8d70954ac8fc6d04a66ca8b0fe9fa0e4f8c4e764783633bec1da60e35e26838
