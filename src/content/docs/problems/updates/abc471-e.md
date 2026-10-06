---
title: "ABC471 E — Sum of Square of Sum"
draft: true
authoringUnit: {"problemId":"abc471-e","docPath":"src/content/docs/problems/updates/abc471-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc471-e-problem-546ffa3ec66efe17523a293a454de78dd65662269660a0d7ba83ff604862eb4c","source-abc471-editorial-23910-0ce59372f46952e66dc4a3e5484633db975b33af9943769a72145858fff0a922"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"二乗の対角項と非対角項は全ての選択で同じ形式に展開できる。固定要素または固定二要素を含むK集合の個数は残りから選ぶ二項係数である。S²−Tは非対角の順序付き積を一度ずつ含むため、式は全選択の得点と一致する。","sourceRevisionIds":["source-abc471-e-problem-546ffa3ec66efe17523a293a454de78dd65662269660a0d7ba83ff604862eb4c","source-abc471-editorial-23910-0ce59372f46952e66dc4a3e5484633db975b33af9943769a72145858fff0a922"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

## 考察

K個の選び方は巨大だが、選ばれた和の二乗を展開すると一項と二項の寄与へ分かれる。各iのA_i²は、iを含む選択 C(N−1,K−1) 回に現れる。各異なるi,jの積は二乗の交差項として二回現れ、その組を含む選択は C(N−2,K−2) 回。

S=ΣA_i、T=ΣA_i² とすると、順序付き異なる二項の積の和は S²−T。従って答えは T·C(N−1,K−1)+(S²−T)·C(N−2,K−2)。組の係数をまとめているので、後半に再び2を掛けない。

階乗・逆階乗をNまで作り、範囲外のC(n,k)は0とする。N=1やK=1では後半は存在しないので0にする。この直接寄与式なら期待値へ変えてN(N−1)で割る場合のN=1特別処理も明確になる。

## 典型の発動条件

全組合せの多項式得点は展開して少数要素を固定する。二次なら対角と非対角へ分け、Σ_{i≠j}A_iA_jをS²−Tへ圧縮する。

## 問題固有の要素

選択数Kが固定なので要素と二要素の出現回数はそれぞれ一つの二項係数になる。

## 正当性

二乗の対角項と非対角項は全ての選択で同じ形式に展開できる。固定要素または固定二要素を含むK集合の個数は残りから選ぶ二項係数である。S²−Tは非対角の順序付き積を一度ずつ含むため、式は全選択の得点と一致する。

## 実装上の注意

K=1は二項寄与0。N=1で負の階乗添字を参照しない。各積の前に法へ還元する。

## 復習の核

期待値の独立性を仮定しない。固定個数抽出の二要素同時選択数を正しく数える。

## 計算量と制約

### 時間

階乗・逆階乗・S,Tの集計 O(N)、逆元用累乗 O(log p)。

### 空間

階乗と逆階乗 O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq K \leq N \leq 2\times 10^5; 1 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc471/tasks/abc471_e)
- [公式解説](https://atcoder.jp/contests/abc471/editorial/23910)
