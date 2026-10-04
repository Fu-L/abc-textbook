---
title: "ABC253-G — Swap Many Times"
draft: true
authoringUnit: {"problemId":"abc253-g","docPath":"src/content/docs/problems/mathematics/outcome-evaluate-compressed-integer-blocks/outcome-evaluate-compressed-integer-blocks-shard-001/abc253-g.md","learningOutcomeIds":["outcome-evaluate-compressed-integer-blocks"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["素因数指数による整数条件の分解。"],"tagIds":["tag-integer-boundary-blocks"],"sourceRevisionIds":["source-abc253-editorial-4026-6dddf3d68aae8c03de2977e126898a6e0bcfb1dfb17f2d04883dd840568e7651","source-abc253-g-problem-1c8b3efdbf4b48372ac46aeaa71ef0cfbde0c000f3b9045a169f679bf0fa1b8c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一完全行の交換(l,l+1)..(l,N)を実際に追うとsuffixの最後の値がlへ来て、それ以前が一つ右へずれる。k連続完全行では元suffix末尾k個が逆順で先頭へ並び、残りは元順のまま後ろへ来る。従ってsuffix全体と残りsuffixの二回の反転で同じ結果を得る。先頭末尾の不完全行と合成すれば指定交換区間そのものになる。","sourceRevisionIds":["source-abc253-editorial-4026-6dddf3d68aae8c03de2977e126898a6e0bcfb1dfb17f2d04883dd840568e7651","source-abc253-g-problem-1c8b3efdbf4b48372ac46aeaa71ef0cfbde0c000f3b9045a169f679bf0fa1b8c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [整数境界と同値区間を正確に分ける](src/content/docs/learn/number-theory/integer-boundary-blocks.md)

- 圧縮block内の一次・二次式や操作列の累積境界を閉形式にし、極値・順位・個数を求められる。

この解説で扱わないこと:

- 素因数指数による整数条件の分解。

## 考察

交換列は左端lごとの行に分かれ、行の長さはN−lである。N=4の一行を手で追うと(1,2),(1,3),(1,4)の結果は[4,1,2,3]になり、末尾を先頭へ持ってくる右回転と分かる。三角数の累積からL,Rの所属行を求め、両端の不完全行だけ直接交換する。k連続完全行は元suffixの末尾k要素を逆順で先頭へ出し、残りを元順で後ろへ置く操作になる。suffix全体を反転し、その先頭k要素の後ろのsuffixを再反転すればこれを一括実現できる。交換ごとの模倣では二次時間になるが、二つの境界行と区間反転ならO(N)で終わる。

## 典型の発動条件

規則的な操作列は小さい例で合成結果を追い、順列作用を区間反転や回転へ圧縮する。完全行一つはsuffixの右回転、完全行k個は末尾k要素を逆順で前へ出す作用になる。三角数で操作番号を行・行内位置へ分解する。

## 問題固有の要素

交換は(l,l+1),(l,l+2),…,(l,N)という順なので、位置lの元要素が末尾へ移る左回転ではない。k完全行では元の最後、最後から二番目、…が各行先頭に確定する。

## 正当性

一完全行の交換(l,l+1)..(l,N)を実際に追うとsuffixの最後の値がlへ来て、それ以前が一つ右へずれる。k連続完全行では元suffix末尾k個が逆順で先頭へ並び、残りは元順のまま後ろへ来る。従ってsuffix全体と残りsuffixの二回の反転で同じ結果を得る。先頭末尾の不完全行と合成すれば指定交換区間そのものになる。

## 実装上の注意

交換番号L,Rは1始まり、行先頭の累積数と行内offsetを合わせる。L,Rが同じ行なら直接処理だけを行う。完全行群の二回目の反転は先頭k要素を除く残りsuffixに適用する。三角数は64bit。

## 復習の核

N=4の行1で[4,1,2,3]、最初の2完全行で[4,3,1,2]になることを必ず確認する。完全行一つを左回転と取り違えない。境界番号が行先頭・行末の場合を直接シミュレーションで照合する。

## 計算量と制約

### 時間

O(N)。境界行を特定し不完全行を直接実行、完全行群を区間反転で一括する。

### 空間

O(N)。結果順列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq L \leq R \leq \frac{N(N-1)}{2}; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/editorial/4026) — source-abc253-editorial-4026-6dddf3d68aae8c03de2977e126898a6e0bcfb1dfb17f2d04883dd840568e7651
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc253/tasks/abc253_g) — source-abc253-g-problem-1c8b3efdbf4b48372ac46aeaa71ef0cfbde0c000f3b9045a169f679bf0fa1b8c
