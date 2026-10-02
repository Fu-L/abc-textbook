---
title: "ABC246-F — typewriter"
draft: true
authoringUnit: {"problemId":"abc246-f","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-001/abc246-f.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-modular-arithmetic"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-bounded-enumeration","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc246-editorial-3703-5f85057e90e262a99e173328f8aea104b062c4190fe41c301f6b3005f52e5521","source-abc246-f-problem-b94ffbe6c9d6fa14522518bddc097e6ac7134d9d96564598d89d696b6f231de5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"ある行で入力可能な文字列集合の和集合を包除する。複数行の交差集合は共通alphabetの文字だけで全L位置を埋める列なのでc^L通り。各非空行subsetを奇数なら足し偶数なら引くと、使える行がt≥1ある文字列の係数はΣ(−1)^{k+1}C(t,k)=1となる。","sourceRevisionIds":["source-abc246-editorial-3703-5f85057e90e262a99e173328f8aea104b062c4190fe41c301f6b3005f52e5521","source-abc246-f-problem-b94ffbe6c9d6fa14522518bddc097e6ac7134d9d96564598d89d696b6f231de5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

ある文字列を入力できる行が 1 行以上存在すれば数えるので、求める集合は各行から入力可能な文字列集合の和集合である。

選んだ複数行すべてで入力可能な文字列に使える文字は、それらの行の文字集合の共通部分だけであり、種類数を c とすれば長さ L の列は c^L 個ある。

採用する候補: 非空な行 subset を全列挙し、文字 bitmask の AND の popcount を c として c^L を subset size の奇偶で足し引きする。

N≤18 なので 2^N を列挙でき、重複する文字列を包除原理で一度だけ数えられる。

棄却する候補: 長さ L の全小文字列を生成し、少なくとも 1 行で打てるか検査する。

L≤10^9 で候補数 26^L は列挙不能である。

行集合 I の共通部分を数えるとき、I に含まれない行で入力可能かどうかは問わないため、包除原理の交差項として正しく使える。

文字の順序には追加制約がないので、共通 alphabet の各文字を L 箇所で独立に選び、交差集合の大きさは popcount(AND)^L になる。

各 S_i を 26 bit mask にする。mask=1,…,2^N-1 ごとに選択行の AND と選択数を求め、共通文字数^L を高速累乗する。選択数が奇数なら加算、偶数なら減算し、998244353 で正規化する。

## 典型の発動条件

### 包除原理

発動条件: 複数集合の和集合を数えたいが、要素が複数集合に重複して現れるとき。

少なくとも 1 行で打てる文字列を、非空な行集合の交差数の符号付き和として数える。

### bitmask subset 全探索

発動条件: 対象集合数 N が 20 前後で、各 subset の共通属性を高速に集約できるとき。

行集合を 2^N で走査し、26 bit AND と popcount で共通 alphabet を求める。

## 問題固有の要素

入力可能文字列という巨大集合を直接持たず、行 subset の共通 alphabet の大きさだけで交差項を評価できる。

別の問題へ持ち帰る視点: 集合要素の列挙が巨大でも、任意の集合交差の要素数に閉形式があれば包除原理が候補になる。

## 正当性

ある行で入力可能な文字列集合の和集合を包除する。複数行の交差集合は共通alphabetの文字だけで全L位置を埋める列なのでc^L通り。各非空行subsetを奇数なら足し偶数なら引くと、使える行がt≥1ある文字列の係数はΣ(−1)^{k+1}C(t,k)=1となる。

## 実装上の注意

- 空 subset は含めず、符号は選択行数が奇数なら正、偶数なら負にする。
- 共通文字数が 0 の項も L≥1 なので 0 とし、減算後は 998244353 の非負剰余へ戻す。

## 復習の核

- 2 行が一部だけ文字を共有する例で、単純和が共通 alphabet^L を重複計上し、偶数 subset で引くことを具体的に示す。

## 計算量と制約

### 時間

O(2^N log L+Σ|S_i|)。subset ANDを1bit除去から計算する。

### 空間

O(2^N)、subset DFSならO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N and L are integers.; 1 \le N \le 18; 1 \le L \le 10^9; S_i is a (not necessarily contiguous) non-empty subsequence of abcdefghijklmnopqrstuvwxyz.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/editorial/3703) — source-abc246-editorial-3703-5f85057e90e262a99e173328f8aea104b062c4190fe41c301f6b3005f52e5521
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc246/tasks/abc246_f) — source-abc246-f-problem-b94ffbe6c9d6fa14522518bddc097e6ac7134d9d96564598d89d696b6f231de5
