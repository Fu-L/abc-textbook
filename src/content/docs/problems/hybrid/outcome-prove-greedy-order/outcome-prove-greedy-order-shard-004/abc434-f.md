---
title: "ABC434-F — Concat (2nd)"
draft: true
authoringUnit: {"problemId":"abc434-f","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-004/abc434-f.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-z-algorithm"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-z-algorithm-prefix-matching"],"sourceRevisionIds":["source-abc434-editorial-14670-66bb51f94f1f13b38f028cda9f5695e6525c00591da0b0b7ffe5e2f2be4b1dfc","source-abc434-editorial-14680-3197538bd4a21389bc1fa50f82b70c602af314a82a2c8d77c1acca870b5aa256","source-abc434-f-problem-3a3e08003e3179b45b06e2fc5aee175704c4918cacfd1bd966d5dbc75ed6adc9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"隣接 S'_i,S'_{i+1} が可換なら swap しても同じ最小文字列がもう一度現れるため、二番目も最小連結文字列になる。 全隣接対が非可換なら転倒数 2 以上の順序にはそれより小さい列が少なくとも二つあるので候補外で、最後付近の転倒数 1 の二候補だけが残る。 |X|≥|Y| の XY 対 YX は、Y と X の対応区間を直接 O(|Y|) 比較し、X 内部同士の長い比較を Z_X で O(1) にできる。 総比較コストを O(Σ|S_i|log N) に抑え、後半の候補も高々二つの連結比較で決められる。 三blockの比較では中央だけが長くなるが、同一文字列内のprefix比較なのでZで最初の差を正確に得られる。merge sortの各比較を出力されるIDへ課金すると、各階層の費用は総文字数以下である。","sourceRevisionIds":["source-abc434-editorial-14670-66bb51f94f1f13b38f028cda9f5695e6525c00591da0b0b7ffe5e2f2be4b1dfc","source-abc434-editorial-14680-3197538bd4a21389bc1fa50f82b70c602af314a82a2c8d77c1acca870b5aa256","source-abc434-f-problem-3a3e08003e3179b45b06e2fc5aee175704c4918cacfd1bd966d5dbc75ed6adc9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md)

対象外:

- 対称操作による状態の正規化。

## 考察

任意順連結の辞書順最小順序は XY<YX を比較規則としてソートした列 S' で得られる。求める二番目では、最小順序からの転倒を最小限だけ増やす候補に絞れる。

採用する候補: XY 対 YX を短い方の長さに比例して比較できるよう各文字列の Z 配列を持ち、ソート後に二番目候補を局所的に構成する。

総比較コストを O(Σ|S_i|log N) に抑え、後半の候補も高々二つの連結比較で決められる。

棄却する候補: 比較ごとに XY と YX を実際に生成して標準ソートする。

長い同一文字列が多数回比較されると Ω(N|S_i|) となり、総文字数制約だけでは抑えられない。

隣接 S'_i,S'_{i+1} が可換なら swap しても同じ最小文字列がもう一度現れるため、二番目も最小連結文字列になる。

全隣接対が非可換なら転倒数 2 以上の順序にはそれより小さい列が少なくとも二つあるので候補外で、最後付近の転倒数 1 の二候補だけが残る。

|X|≥|Y| の XY 対 YX は、Y と X の対応区間を直接 O(|Y|) 比較し、X 内部同士の長い比較を Z_X で O(1) にできる。

比較を再現するため0-basedで n=|X|≥m=|Y| とする。XYとYXをそれぞれ X[0:m]・X[m:n]・Y と、Y・X[0:n−m]・X[n−m:n] の三blockへ分ける。第一blockの比較はO(m)。同じなら中央をZ_X[m]で比較し、z=Z_X[m]<n−mならX[m+z]とX[z]で決定、そうでなければ最後の二blockをO(m)で比較する。n=mのとき中央は空。n<mならX,Yを交換した比較結果の符号を反転する。全block一致なら可換である。

各S_iのZをO(L)で前計算し、文字列本体をコピーせずIDをmerge sortする。一回の先頭比較の費用O(min(|X|,|Y|))は、取り出した側の文字列長以下なのでその要素へ課金できる。各merge階層で総O(L)、階層O(log N)でO(L log N)。この評価は具体的なmerge順によるもので、単に比較回数O(N log N)へLmaxを掛けて制約適合を済ませない。隣接可換対があれば sorted 連結を返す。なければ末尾二要素を入れ替える列と、末尾三要素中の別の隣接入替え列を構成し、連結結果の小さい方を返す。N=2 は定義された一候補を処理する。

## 典型の発動条件

### 連結順序 comparator

発動条件: 文字列群の連結結果を辞書順最小化するとき。

X<Y を XY<YX で定義し、交換法で最適ソート順を得る。

### Z 配列による自己部分文字列比較

発動条件: 比較中に同じ長い文字列内の二区間の LCP が必要なとき。

各文字列の Z 値を保持し、ずれた suffix と prefix の一致長を定数時間で得る。

### 転倒数による第二候補の絞り込み

発動条件: 全順列の二番目を、最小順序からの局所交換として特徴付けられるとき。

転倒数 2 以上を排除し、接頭辞を最大限共有する末尾付近の二候補だけ比較する。

## 問題固有の要素

比較一回の最悪長より、各要素がソート全体で何文字読まれるかを抑える comparator 設計が必要である。

別の問題へ持ち帰る視点: 辞書順二番目は最小解との最長共通接頭辞を持つ局所的な一転倒へ絞れる場合がある。

## 正当性

隣接 S'_i,S'_{i+1} が可換なら swap しても同じ最小文字列がもう一度現れるため、二番目も最小連結文字列になる。 全隣接対が非可換なら転倒数 2 以上の順序にはそれより小さい列が少なくとも二つあるので候補外で、最後付近の転倒数 1 の二候補だけが残る。 |X|≥|Y| の XY 対 YX は、Y と X の対応区間を直接 O(|Y|) 比較し、X 内部同士の長い比較を Z_X で O(1) にできる。 総比較コストを O(Σ|S_i|log N) に抑え、後半の候補も高々二つの連結比較で決められる。 三blockの比較では中央だけが長くなるが、同一文字列内のprefix比較なのでZで最初の差を正確に得られる。merge sortの各比較を出力されるIDへ課金すると、各階層の費用は総文字数以下である。

## 実装上の注意

- comparator は等価な XY=YX に対して strict weak ordering を壊さないよう false を返す。N=2 と可換対ありを先に処理し、候補の添字を範囲内にする。

## 復習の核

- 比較が O(min長) に収まる区間分解と、非可換時に残す二つの末尾候補が公式の順序どおりかを確認する。

## 計算量と制約

### 時間

O(L log N)、Lは総文字数。Z前計算O(L)、IDのmerge sortは各階層で比較費用を取り出した文字列長へ課金してO(L)、隣接可換判定と二候補の構築・比較はO(L)。

### 空間

O(L+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 1.5 \times 10^5; 2 \le N \le 3 \times 10^5; T,N are integers.; S_i is a string consisting of lowercase English letters with length between 1 and 10^6-1, inclusive.; For a single input, the sum of N does not exceed 3 \times 10^5.; For a single input, the sum of |S_i| does not exceed 10^6.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14670) — source-abc434-editorial-14670-66bb51f94f1f13b38f028cda9f5695e6525c00591da0b0b7ffe5e2f2be4b1dfc
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/editorial/14680) — source-abc434-editorial-14680-3197538bd4a21389bc1fa50f82b70c602af314a82a2c8d77c1acca870b5aa256
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc434/tasks/abc434_f) — source-abc434-f-problem-3a3e08003e3179b45b06e2fc5aee175704c4918cacfd1bd966d5dbc75ed6adc9
