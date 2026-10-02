---
title: "ABC255-E — Lucky Numbers"
draft: true
authoringUnit: {"problemId":"abc255-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc255-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc255-e-problem-dde0a80c90b6a5ec20e4c943ea1eadc9b486c8ba5a36a2ae222afe2f425ce40a","source-abc255-editorial-4098-edf839c6f7d5786b29be087ec28707fcf812feea7ff84a4db64613ce3cd6ba10"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"B_1=0、B_i=S_(i-1)-B_(i-1)とすればZに依存しない部分を線形時間で作れる。 A_i=X_jはZ=(-1)^(i+1)(X_j-B_i)と同値なので、最適Zは必ずこの候補集合に含まれる。 A_i=X_jとなるZを全N M組から計算し、同じZの頻度を数えれば、そのZでラッキーになる位置数を直接最大化できる。","sourceRevisionIds":["source-abc255-e-problem-dde0a80c90b6a5ec20e4c943ea1eadc9b486c8ba5a36a2ae222afe2f425ce40a","source-abc255-editorial-4098-edf839c6f7d5786b29be087ec28707fcf812feea7ff84a4db64613ce3cd6ba10"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

A_1=Zと置くと和条件から全項が一意に伝播し、A_i=(-1)^(i+1)Z+B_iというZの係数が±1の形になる。

採用する候補: 各位置・ラッキーナンバーが要求するZへの投票

A_i=X_jとなるZを全N M組から計算し、同じZの頻度を数えれば、そのZでラッキーになる位置数を直接最大化できる。

棄却する候補: Zの数値範囲を走査する

S_i,X_jが±10^9でZ候補範囲は広く、必要な候補は入力から導かれるN M個だけである。

B_1=0、B_i=S_(i-1)-B_(i-1)とすればZに依存しない部分を線形時間で作れる。

A_i=X_jはZ=(-1)^(i+1)(X_j-B_i)と同値なので、最適Zは必ずこの候補集合に含まれる。

Bを漸化式で作り、全i,jについて候補Z=(-1)^(i+1)(X_j-B_i)を連想配列で数える。最大頻度を答えとする。

## 典型の発動条件

### 一次自由度のアフィン伝播

発動条件: 隣接項の式があり、一つの初期値を決めると全列が決まる。

A_1をパラメータZとし、各項を符号付きZと定数B_iへ分離する。

### 候補パラメータの頻度最大化

発動条件: 各制約を満たすパラメータ値が一意に求まる。

位置と目標値の各組が要求するZを数え、最多票のZを選ぶ。

## 問題固有の要素

交互和で現れる符号反転を保ったまま一変数化すると、数列最適化が候補値の同値数え上げへ変わる。

別の問題へ持ち帰る視点: 一自由度の構成で評価条件が等式なら、各評価項目が要求するパラメータ値を列挙して投票問題へ落とせる。

## 正当性

B_1=0、B_i=S_(i-1)-B_(i-1)とすればZに依存しない部分を線形時間で作れる。 A_i=X_jはZ=(-1)^(i+1)(X_j-B_i)と同値なので、最適Zは必ずこの候補集合に含まれる。 A_i=X_jとなるZを全N M組から計算し、同じZの頻度を数えれば、そのZでラッキーになる位置数を直接最大化できる。

## 実装上の注意

- B_iと候補Zは負になり得るため符号付き64ビットで保持し、iの偶奇による符号を一致させる。X_jは相異なるので一位置が同じZへ二重投票しない。

## 復習の核

- 小さい範囲のZを全探索した結果と比較し、正負のS・X、偶奇位置、同じZへ多くの位置が集まる例を確認する。

## 計算量と制約

### 時間

平衡map版O(NM log(NM))、M候補値数。hash mapなら期待O(NM)。

### 空間

O(NM)、候補Z頻度。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 1 \leq M \leq 10; -10^9 \leq S_i \leq 10^9; -10^9 \leq X_i \leq 10^9; X_1 \lt X_2 \lt \cdots \lt X_M; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/tasks/abc255_e) — source-abc255-e-problem-dde0a80c90b6a5ec20e4c943ea1eadc9b486c8ba5a36a2ae222afe2f425ce40a
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc255/editorial/4098) — source-abc255-editorial-4098-edf839c6f7d5786b29be087ec28707fcf812feea7ff84a4db64613ce3cd6ba10
