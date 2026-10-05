---
title: "ABC251-E — Takahashi and Animals"
draft: true
authoringUnit: {"problemId":"abc251-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-002/abc251-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc251-e-problem-7c9287bd212a0a604dc19a9cf77613d3cef0b2dbf5527459d4f2e00e169015c7","source-abc251-editorial-3960-1d8338326b3b9ca141e5de2a04f3325e817b795409f99f48ec6f5b8de3fda6d2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各対象が隣接二操作の少なくとも一方に覆われる条件を直前と現在の採否で検査できる。先頭を固定すると全内部条件を順に満たし、最後にN,1の条件も検査する。二ケースは全解を排他的に覆うので最小費用が正しい。","sourceRevisionIds":["source-abc251-e-problem-7c9287bd212a0a604dc19a9cf77613d3cef0b2dbf5527459d4f2e00e169015c7","source-abc251-editorial-3960-1d8338326b3b9ca141e5de2a04f3325e817b795409f99f48ec6f5b8de3fda6d2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

操作iを選ぶと動物iとi+1が餌を得るので、全動物を満たす条件は円環上の隣り合う二操作が同時に未選択にならないことと同値である。これは動物を辺、餌やり操作を頂点とみなした重み付きサイクル頂点被覆である。直線DPでは直前の操作を選んだかだけを持ち、直前も現在も未選択となる遷移を禁止すればよい。

採用する候補: 先頭状態を固定した円環DP

操作1を選ぶ場合と選ばない場合に分ければ残りは直線上の2状態DPになり、末尾と先頭の整合も確実に判定できる。

棄却する候補: その場で安い方の操作を選ぶ貪欲法

一つの選択が左右二匹を同時に覆い、円環の閉じ方にも影響するため局所的な安さだけでは最適性が保証されない。

操作1を選択・非選択の二ケースに固定し、各位置で現在の操作を選ぶかを2状態DPで更新する。最後に操作Nと操作1がともに未選択のケースを除き、二ケースの最小費用を取る。

## 典型の発動条件

### 円環DP

発動条件: 局所制約が隣接要素間にあり、先頭と末尾も隣接する。

先頭状態を列挙して列を直線化し、最後に閉路制約を検査する。

### 重み付き頂点被覆

発動条件: 各辺を少なくとも一方の端点の選択で覆う問題になる。

動物を操作間の辺として捉え、選択費用最小化へ写像する。

## 問題固有の要素

餌やり対象を直接追うより、操作同士の間に動物がいると見ると「連続して二つ休めない」という二値列制約になる。

別の問題へ持ち帰る視点: 円環上の有限状態DPは、先頭状態を全列挙して末尾との整合を取ることで直線DPへ還元する。

## 正当性

各対象が隣接二操作の少なくとも一方に覆われる条件を直前と現在の採否で検査できる。先頭を固定すると全内部条件を順に満たし、最後にN,1の条件も検査する。二ケースは全解を排他的に覆うので最小費用が正しい。

## 実装上の注意

- 費用合計は64ビットで保持し、選択済みの先頭費用を二重加算しない。Nが小さい場合も先頭・末尾の制約を同じ定義で処理する。

## 復習の核

- 全選択を列挙できる小さな円環と比較し、最安の操作が隣接する例、先頭を選ばない最適解、閉路境界だけが違反する状態を確認する。

## 計算量と制約

### 時間

N 操作の円環。先頭採否二ケース、各二状態で O(N)。

### 空間

直前採否二状態をrollingして O(1)、入力費用O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 3 \times 10^5; 1 \leq A_i \leq 10^9; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/tasks/abc251_e) — source-abc251-e-problem-7c9287bd212a0a604dc19a9cf77613d3cef0b2dbf5527459d4f2e00e169015c7
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc251/editorial/3960) — source-abc251-editorial-3960-1d8338326b3b9ca141e5de2a04f3325e817b795409f99f48ec6f5b8de3fda6d2
