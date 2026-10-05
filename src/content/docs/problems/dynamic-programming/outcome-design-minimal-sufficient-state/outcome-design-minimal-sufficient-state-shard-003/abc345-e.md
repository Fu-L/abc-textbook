---
title: "ABC345-E — Colorful Subsequence"
draft: true
authoringUnit: {"problemId":"abc345-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc345-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-sequence"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc345-e-problem-5aa8fc0b31bf873d4f9d40975c86630bb9be6aca22f86462b97b93ef518bfa64","source-abc345-editorial-9580-f52243b3d88a2f4066020b56630b08a6be5e2a0c09850fc5d8e221e1fd0a870b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"保持時は直前色と異なる最良値だけ必要。最大値候補の色が現在色と同じなら二位の異色候補が最良なので、各削除数で異色二候補が十分。削除は旧状態をそのまま移し、保持は現在色の値を生成するため全合法列を覆う。","sourceRevisionIds":["source-abc345-e-problem-5aa8fc0b31bf873d4f9d40975c86630bb9be6aca22f86462b97b93ef518bfa64","source-abc345-editorial-9580-f52243b3d88a2f4066020b56630b08a6be5e2a0c09850fc5d8e221e1fd0a870b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md) — DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

prefixからj個削除した時、将来のballを残せるかは現在右端のcolorとvalue総和だけで決まる。ただし新ballと同colorの最良stateを除外する必要があるため、各jでcolorが異なる上位二stateを残せば十分である。ball(C,V)を残す遷移では、直前の最良stateのcolorがCでなければ一位、Cなら二位を使うだけである。削除遷移は前段j-1の上位二候補をそのまま引き継ぐので、新しい上位二は高々三候補から選べる。

採用する候補: 削除数ごとに末尾color別DPの上位二候補だけを保持する

keep遷移のmax over color≠CをO(1)で取り、全体O(NK)へ圧縮できる。

棄却する候補: 末尾color N種類を全て持つ三次元DP

状態O(N^2K)となりN=2×10^5で保持・更新できない。

color 0,value 0のsentinelを削除数0の一位として初期化する。各ballを処理しjを範囲内で更新して、削除候補としてprev[j-1]の上位二、保持候補としてprev[j]のC以外の最良値+Vをcolor Cで生成する。候補をcolor別最大へ統合しvalue上位二をnext[j]へ置き、最後のj=Kの一位を出すか未到達なら-1。

## 典型の発動条件

### 除外付きtop-2 DP圧縮

発動条件: 遷移が全category最大から指定category一つを除いた最大を要求する。

異なるcategoryの一位・二位を持ち、除外対象が一位の時だけ二位を使う。

### exact deletion count DP

発動条件: 各要素を削除するか保持するか選び、削除数を正確にKへ合わせる。

jを削除済み個数として、deleteはj+1、keepは同じjへ遷移する。

## 問題固有の要素

上位二stateはvalue順位だけでなくcolorを異ならせる必要があり、同colorの複数候補は先に最大へ統合する。

別の問題へ持ち帰る視点: category除外maxの圧縮ではtop entriesのcategory distinctnessが不変条件になる。

## 正当性

保持時は直前色と異なる最良値だけ必要。最大値候補の色が現在色と同じなら二位の異色候補が最良なので、各削除数で異色二候補が十分。削除は旧状態をそのまま移し、保持は現在色の値を生成するため全合法列を覆う。

## 実装上の注意

- 同一iterationのstateを再利用しないようprev/nextを分離する。jの到達可能範囲を制限し、-INFへVを加えない。

## 復習の核

- 全ball同色、K=N-1、同valueで異colorのtop tie、最良colorが新ballと一致する例を色全保持DPと比較する。

## 計算量と制約

### 時間

N ball、削除数K。異色上位二候補で各遷移定数、O(N(K+1))。

### 空間

rolling削除数ごとの二候補 O(K+1)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1\leq K<N\leq 2\times 10^5; K\leq 500; 1\leq C_i\leq N; 1\leq V_i\leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc345/tasks/abc345_e) — source-abc345-e-problem-5aa8fc0b31bf873d4f9d40975c86630bb9be6aca22f86462b97b93ef518bfa64
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc345/editorial/9580) — source-abc345-editorial-9580-f52243b3d88a2f4066020b56630b08a6be5e2a0c09850fc5d8e221e1fd0a870b
