---
title: "ABC312-EX — snukesnuke"
draft: true
authoringUnit: {"problemId":"abc312-ex","docPath":"src/content/docs/problems/string-geometry/outcome-normalize-string-to-primitive-period/outcome-normalize-string-to-primitive-period-shard-001/abc312-ex.md","learningOutcomeIds":["outcome-normalize-string-to-primitive-period"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-z-algorithm"],"excludedTopics":["文字列周期・primitive wordの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-string-periodicity","tag-amortized-monotone-progress","tag-z-algorithm-prefix-matching"],"sourceRevisionIds":["source-abc312-editorial-6837-5ef0557ec95f9f3695549301448e94bb2e86a3fa08555a97e500efeb9601fcf6","source-abc312-ex-problem-80b2b512b6e292ea11c777f5361a3e6cb93da64dd9ed4e5f47a50bc5164b478e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"反復列が一致する必要十分はprimitive rootと総指数が同じこと。Zから長さを割る最小周期を選ぶとrootが一意に定まり、異root間は衝突しない。同rootではnの倍数の最小未使用mが必要最小反復回数m/nを与える。同じnのpointerは後戻りせず既使用倍数を一度ずつ飛ばすため探索の調和級数境界を保つ。","sourceRevisionIds":["source-abc312-editorial-6837-5ef0557ec95f9f3695549301448e94bb2e86a3fa08555a97e500efeb9601fcf6","source-abc312-ex-problem-80b2b512b6e292ea11c777f5361a3e6cb93da64dd9ed4e5f47a50bc5164b478e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [文字列周期・primitive word](src/content/docs/learn/string/string-periodicity.md)

- prefix一致またはborderから最小periodを求め、文字列をprimitive rootと反復回数へ正規化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [Z algorithmによるprefix matching](src/content/docs/learn/string/z-algorithm.md) — 各位置からprefixと一致する最大長を既知のZ-boxから再利用し、全位置の一致長を線形時間で求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

二つの反復文字列 S_i^{k},S_j^{l} が等しくなるのは、S_i と S_j が同じ primitive root T の反復で、総長が等しい場合に限られる。よって primitive root ごとに独立化できる。

S_i=T^n と書けば、選ぶ k は既使用の指数集合 X に含まれない最小の n の倍数を探す問題になる。最終指数は総入力長 L 以下に抑えられる。

採用する候補: Z algorithm で各文字列の最小周期 primitive root を求め、group 内で各 n の次候補をメモしながら未使用倍数を探す。

文字列比較を整数指数問題へ変え、各 n で失敗する試行は高々 L/n 回なので調和級数的に償却できる。

棄却する候補: 各人について S_i,S_i²,…を実文字列として生成し、既使用文字列 set へ無いものまで試す。

長い反復文字列の生成・比較が総入力長では抑えられず、共通周期を持つ異なる S 同士の衝突も非効率に再発見する。

周期 p が |S| を割り、S[j]=S[j−p] を満たす最小 p を Z 値から選べば、prefix 長 p が一意な primitive root になる。

同じ n の次探索位置を保存すると、使用済み倍数 m を飛ばす検査は group 全体で単調に進み、Σ L/n=O(L log L) 回に収まる。

各 S_i に Z algorithm を行い最小周期 p_i と T_i=S_i[0:p_i]、指数 n_i=|S_i|/p_i を得る。T ごとに使用済み指数 set と next[n] を持ち、next[n],next[n]+n,…から最初の未使用 m を選ぶ。m を登録し next[n]=m+n、答え k_i=m/n_i とする。

## 典型の発動条件

### primitive root による反復文字列の正規化

発動条件: 文字列の任意回反復同士の等価性・衝突を扱うとき。

最小周期文字列と反復指数の組へ変換し、同じ root だけを比較する。

### 次候補ポインタの償却

発動条件: クエリごとに一定刻みの最小未使用値を探し、同じ刻みが繰り返されるとき。

前回失敗した位置より先から再開し、各使用済み候補を刻みごとに一度だけ検査する。

## 問題固有の要素

ニックネーム文字列を保存する代わりに「primitive root の group と総反復指数」だけで完全に同一性を判定できる。

別の問題へ持ち帰る視点: 反復文字列が絡む重複排除では、hash より先に周期の標準形で決定的に整数化できないか考える。

## 正当性

反復列が一致する必要十分はprimitive rootと総指数が同じこと。Zから長さを割る最小周期を選ぶとrootが一意に定まり、異root間は衝突しない。同rootではnの倍数の最小未使用mが必要最小反復回数m/nを与える。同じnのpointerは後戻りせず既使用倍数を一度ずつ飛ばすため探索の調和級数境界を保つ。

## 実装上の注意

- 周期候補は |S| を割る条件も必要で、単なる border 長を採用しない。出力は総指数 m ではなく元 S_i の反復回数 m/n_i である。

## 復習の核

- 文字列そのものを伸ばす前に、等しくなる必要十分条件を primitive root と長さで書く。償却では各刻み n の走査上限 L/n を明示する。

## 計算量と制約

### 時間

O(L log L)、L=Σ|S_i|。Z周期判定とroot別倍数pointer探索。

### 空間

O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N \geq 1; S_i is a string of length at least 1 consisting of lowercase English letters.; The sum of lengths of S_i is at most 2\times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/editorial/6837) — source-abc312-editorial-6837-5ef0557ec95f9f3695549301448e94bb2e86a3fa08555a97e500efeb9601fcf6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc312/tasks/abc312_h) — source-abc312-ex-problem-80b2b512b6e292ea11c777f5361a3e6cb93da64dd9ed4e5f47a50bc5164b478e
