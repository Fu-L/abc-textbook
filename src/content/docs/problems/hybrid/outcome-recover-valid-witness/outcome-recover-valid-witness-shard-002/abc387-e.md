---
title: "ABC387-E — Digit Sum Divisible 2"
draft: true
authoringUnit: {"problemId":"abc387-e","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-002/abc387-e.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0","source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"小さい場合は全てのa∈[N,2N)を条件どおり調べるので、出力する組は有効で、見つからない場合に限り-1となる。大きい場合は表の各行がN<a<2Nを保証し、桁和8かつ8の倍数のaと、桁和9かつ9の倍数のa+1を作る。よって両場合とも条件を満たす組だけを出力する。","sourceRevisionIds":["source-abc387-e-problem-192a642a754258adc79e3149680c6874fbae41bc1334c46ab2b728e8375555e0","source-abc387-editorial-11830-ec18309bf0ba574d1dc8dcab13f48dccc3aaeeabb60104e678c384b60544669d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

小さいNではaを[N,2N)から順に調べ、aとa+1がそれぞれ自身の桁和で割り切れるかを直接判定する。a+1≤2Nも確認し、見つからなければ-1を出す。

大きいNでは桁数をL、B=L−2、先頭二桁をxとする。Nの先頭二桁範囲ごとに表のprefix pを選び、a=p·10^Bとする。各行でx+1≤p<2xなのでN<a<2Nが成り立つ。表のpは桁和8、末尾には少なくとも4個の0があるためaは8の倍数で、a+1は繰上がりなしで桁和9となり9で割り切れる。上位prefixで範囲、下位0で倍数条件を保証する。

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

小さい場合は全てのa∈[N,2N)を条件どおり調べるので、出力する組は有効で、見つからない場合に限り-1となる。大きい場合は表の各行がN<a<2Nを保証し、桁和8かつ8の倍数のaと、桁和9かつ9の倍数のa+1を作る。よって両場合とも条件を満たす組だけを出力する。

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
