---
title: "ABC387-E — Digit Sum Divisible 2"
draft: true
authoringUnit: {"problemId":"abc387-e","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc387-e.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0","source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"N≥10^6ではB=L−2≥4。表の全行でx+1≤p<2xなのでN<(x+1)10^B≤p10^B<2x10^B≤2N。各pの桁和は8、a=p10^Bは8倍数で、a+1はcarryなく桁和9となるため9倍数である。小さいNでは範囲内の各候補を問題の条件どおり直接検査する。","sourceRevisionIds":["source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0","source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

桁和が2の偶数と、その次の桁和3の数を作ればどちらも桁和で割り切れる。同様に桁和8の8倍数と、その次の桁和9の数も使える。末尾へ3個以上の0を付けると8倍数で、+1のcarryも起こらない。巨大なNを割り算する必要はなく、上位桁で区間[N,2N)に入る候補を選べばよい。

N<10^6ではa=N,…,2N−1を直接調べ、aとa+1を各桁和で割る。大きいNの桁数をL、上位二桁をx、B=L−2とすると、x·10^B≤N<(x+1)·10^B。次の表のprefix pを選び、a=p·10^Bを文字列として出す。

| xの範囲 | p |
| --- | --- |
| 10〜16 | 17 |
| 17〜25 | 26 |
| 26〜34 | 35 |
| 35〜61 | 62 |
| 62〜99 | 107 |

例えば35≤x≤61ではN<62·10^B=a、かつa<70·10^B≤2N。各行で同じくx+1≤p<2xが成立する。prefixが三桁の107では出力がNより一桁長くなっても問題ない。B≥4なので末尾は8倍数を保証するだけの0を持つ。

全prefixの桁和は8であり、a+1の桁和は9。従ってこの表だけでgood性と範囲を別々に証明できる。

## 典型の発動条件

### constructive problemの有限パターン被覆

発動条件: 巨大な範囲から一例だけ求め、局所条件を固定suffixで保証できるとき。

先頭桁区間を少数のprefix候補で覆う。

### 桁和と倍数判定

発動条件: 桁和で割り切れる数を構成したいとき。

桁和1,3,9と末尾による2・8の倍数性を組み合わせる。

## 問題固有の要素

大整数を数値として扱わず、上位prefixが大小範囲を、0 suffixが割り切り条件を担当する二層構成にする。

別の問題へ持ち帰る視点: 巨大桁の構成では、比較を決める上位桁と合同条件を決める下位桁を独立に設計できないか探す。

## 正当性

N≥10^6ではB=L−2≥4。表の全行でx+1≤p<2xなのでN<(x+1)10^B≤p10^B<2x10^B≤2N。各pの桁和は8、a=p10^Bは8倍数で、a+1はcarryなく桁和9となるため9倍数である。小さいNでは範囲内の各候補を問題の条件どおり直接検査する。

## 実装上の注意

- 小N探索の上端はa+1≤2Nを満たす2N-1。大Nではprefix 107により桁数が一つ増えるcaseを含め、先頭0を出力しない。

## 復習の核

- 各prefix候補について桁和と末尾の倍数判定を独立に証明し、区間境界16/17,25/26,34/35,61/62,99/100付近を文字列比較で検査する。

## 計算量と制約

### 時間

O(L+10⁶·Lsmall)、Lは入力桁数、N<10⁶時の全走査は定数上限。大入力は文字列出力O(L)。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer at least 1 and less than 10^{100000}.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/tasks/abc387_e) — source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/editorial/11830) — source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d
