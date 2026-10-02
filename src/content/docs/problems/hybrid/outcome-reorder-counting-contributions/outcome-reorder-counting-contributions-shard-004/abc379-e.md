---
title: "ABC379-E — Sum of All Substrings"
draft: true
authoringUnit: {"problemId":"abc379-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-004/abc379-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc379-e-problem-e9963952c4cbe394961dcbec53050d5c7c6f124ccb29b9cb3943db806c3c4461","source-abc379-editorial-11311-8df95e624e814d6cbd50522069342595ba95bb2f9838769b7583c12ee97c6c99"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定右端 i の全左端を足すと、S_j は j 個の部分文字列に現れるため A_i=ΣjS_j という単純な prefix が得られる。 答えは Σ10^{N-i}A_i なので、最下位から carry+=A_i、digit=carry mod10、carry/=10 と通常の加算筆算にできる。 答えそのものは非常に長く通常整数に入らないが、各桁と繰上りだけなら O(N) 回の整数演算で構成できる。","sourceRevisionIds":["source-abc379-e-problem-e9963952c4cbe394961dcbec53050d5c7c6f124ccb29b9cb3943db806c3c4461","source-abc379-editorial-11311-8df95e624e814d6cbd50522069342595ba95bb2f9838769b7583c12ee97c6c99"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

各部分文字列の値を桁寄与でまとめると、元の j 桁目 S_j は右端 i≥j ごとに j·S_j·10^{N-i} を寄与する。従って係数列 A_i=Σ_{j≤i}jS_j を下位桁から足せばよい。

採用する候補: A_i の累積を作り、i=N から逆順に carry へ A_i を加えて一桁ずつ10進の筆算を行う。

答えそのものは非常に長く通常整数に入らないが、各桁と繰上りだけなら O(N) 回の整数演算で構成できる。

棄却する候補: 各部分文字列を数値へ変換して総和へ加える。

部分文字列が Θ(N^2) 個あり、各値も最大 N 桁なので時間も整数サイズも過大になる。

固定右端 i の全左端を足すと、S_j は j 個の部分文字列に現れるため A_i=ΣjS_j という単純な prefix が得られる。

答えは Σ10^{N-i}A_i なので、最下位から carry+=A_i、digit=carry mod10、carry/=10 と通常の加算筆算にできる。

文字 digit を整数化し prefixWeighted += i×digit として A_i を保存する。逆順に carry へ A_i を足して digit を出力用 buffer に積み、全 A を使った後も carry が0になるまで桁を伸ばし、反転して出力する。

## 典型の発動条件

### 巨大整数の桁別寄与と筆算

発動条件: 答えが多数桁だが10冪係数の和として表せるとき。

係数を下位から繰上り処理して文字列として構成する。

## 問題固有の要素

部分文字列の位置ごとの寄与を、左端数 j と右端側の10冪に分離する。

別の問題へ持ち帰る視点: 多倍長整数ライブラリがなくても、基数10の係数列なら carry 正規化で十分である。

## 正当性

固定右端 i の全左端を足すと、S_j は j 個の部分文字列に現れるため A_i=ΣjS_j という単純な prefix が得られる。 答えは Σ10^{N-i}A_i なので、最下位から carry+=A_i、digit=carry mod10、carry/=10 と通常の加算筆算にできる。 答えそのものは非常に長く通常整数に入らないが、各桁と繰上りだけなら O(N) 回の整数演算で構成できる。

## 実装上の注意

- 問題の index は1-originで係数が j になる。最後の carry を全て吐き、出力 buffer の反転と先頭0を正しく扱う。

## 復習の核

- N=3 の全部分文字列を展開し、各 S_j の係数が j を含む prefix A_i になる過程を手で確かめる。

## 計算量と制約

### 時間

O(N)、weighted digit prefixとcarry。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; N is an integer.; S is a string of length N consisting of digits from 1 through 9.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc379/tasks/abc379_e) — source-abc379-e-problem-e9963952c4cbe394961dcbec53050d5c7c6f124ccb29b9cb3943db806c3c4461
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc379/editorial/11311) — source-abc379-editorial-11311-8df95e624e814d6cbd50522069342595ba95bb2f9838769b7583c12ee97c6c99
