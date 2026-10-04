---
title: "ABC308-E — MEX"
draft: true
authoringUnit: {"problemId":"abc308-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc308-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc308-e-problem-3bfa4f4d23e60ae943a87baa44eda259ab21b58cf882d17e704d7efaa5900098","source-abc308-editorial-6708-83c0d47e88e485e9deedd8952bdad8c3f4af73cafd21885d4ffebffcadf27205"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"scan前に全X valuesをrightへ数え、positionを処理する前後でcurrent charに応じてrightから除去・leftへ追加すればstrict i<j<kを保てる。 同じ(a,b) classの全index pairsはmex値も同じなので、個々の組をcount productへ集約できる。 value universeが3なのでpositionごとの処理が定数になり全体O(N)である。","sourceRevisionIds":["source-abc308-e-problem-3bfa4f4d23e60ae943a87baa44eda259ab21b58cf882d17e704d7efaa5900098","source-abc308-editorial-6708-83c0d47e88e485e9deedd8952bdad8c3f4af73cafd21885d4ffebffcadf27205"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

middle index j with S_j='E'を固定すると、left M indexとright X indexのidentityは不要で、それぞれのA value 0,1,2別countだけで全組をまとめられる。

mex(a,A_j,b)は3^3の定数表として前計算でき、left/right value countsの積が対応triples数になる。

棄却する候補: 全i<j<k triplesを列挙して文字条件とmexを調べる。

Θ(N^3)である。

採用する候補: left M counts[3]とright X counts[3]を維持し、各E positionで9 value pairsのcount積×mexを加える。

ordered triple sumをmiddle-index sweepとsmall-alphabet frequency aggregationへ分解する。

## 典型の発動条件

### 中央要素固定のtriplet counting

発動条件: i<j<kの寄与がsmall categories of endpointsとmiddle valueだけで決まるとき。

jをscanし、left/right category frequenciesの直積で全endpoint pairsを数える。

### 小さい値域の全組表

発動条件: 状態値が少数で、三値関数を繰り返し評価するとき。

a,b∈{0,1,2}を9通り列挙してmex(a,A_j,b)を加える。

## 問題固有の要素

M/E/Xという文字役割とAの数値役割を分離し、文字が位置のside、Aがfrequency classを決める。

別の問題へ持ち帰る視点: subsequence countingでは順序をscanで、値依存をcategory countsで処理する。

## 正当性

scan前に全X valuesをrightへ数え、positionを処理する前後でcurrent charに応じてrightから除去・leftへ追加すればstrict i<j<kを保てる。 同じ(a,b) classの全index pairsはmex値も同じなので、個々の組をcount productへ集約できる。 value universeが3なのでpositionごとの処理が定数になり全体O(N)である。

## 実装上の注意

- current positionがXならE評価前にright countから外し、Mなら評価後にleftへ足してstrict inequalityを保つ。
- triple数はN^3規模なので64 bit整数で積と答えを保持する。

## 復習の核

- ordered tripleはmiddleを固定し、左右要素を答えに必要な最小categoryへ集約する。
- 値域が定数ならendpoint categoriesを全列挙し、frequency積でsubsequencesを数える。

## 計算量と制約

### 時間

O(N)、alphabet0,1,2の固定九組を各Eで集計。

### 空間

O(1)補助。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3\leq N \leq 2\times 10^5; N is an integer.; A_i \in \lbrace 0,1,2\rbrace; S is a string of length N consisting of M, E, and X.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/tasks/abc308_e) — source-abc308-e-problem-3bfa4f4d23e60ae943a87baa44eda259ab21b58cf882d17e704d7efaa5900098
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc308/editorial/6708) — source-abc308-editorial-6708-83c0d47e88e485e9deedd8952bdad8c3f4af73cafd21885d4ffebffcadf27205
