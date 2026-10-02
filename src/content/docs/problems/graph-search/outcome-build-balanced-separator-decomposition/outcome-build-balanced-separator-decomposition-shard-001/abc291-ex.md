---
title: "ABC291-EX — Balanced Tree"
draft: true
authoringUnit: {"problemId":"abc291-ex","docPath":"src/content/docs/problems/graph-search/outcome-build-balanced-separator-decomposition/outcome-build-balanced-separator-decomposition-shard-001/abc291-ex.md","learningOutcomeIds":["outcome-build-balanced-separator-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["LCA・HLDによる固定木上パスの区間分解。"],"tagIds":["tag-tree-balanced-separator"],"sourceRevisionIds":["source-abc291-editorial-5840-f81899847d6c0912676ee91faaba0803527dfcec357072d21460af24e7909b0c","source-abc291-ex-problem-0f5a2a3d492a1dc4e0890bcd3980e0243acdf9436eed5817e512836de4613d9d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"重心の除去後は全成分が半分以下。各成分の再帰構成を帰納的に接ぐ。異なる成分間の元pathは重心を通り、同成分内のpathは再帰で扱えるためpath包含条件も保つ。","sourceRevisionIds":["source-abc291-editorial-5840-f81899847d6c0912676ee91faaba0803527dfcec357072d21460af24e7909b0c","source-abc291-ex-problem-0f5a2a3d492a1dc4e0890bcd3980e0243acdf9436eed5817e512836de4613d9d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [木の均衡分離点から重心分解へ進む](src/content/docs/learn/tree/tree-balanced-separators.md)

- 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- LCA・HLDによる固定木上パスの区間分解。

## 考察

各頂点で子部分木が自身の部分木の半分以下という条件は、その部分木の根が重心であることを再帰的に要求している。 元木のx-yパスが重心を通らない組は同じ除去後成分内に限られるため、成分ごとの再帰結果を重心の子へ接続してよい。

採用する候補: 重心分解木を答えとして構成

元木の重心を根とし、重心除去後の各成分を独立に再帰処理すれば、サイズ半減条件とパス包含条件を同時に満たせる。

棄却する候補: 任意の根から元の木をそのまま根付き化

大きい子部分木が半分を超えることがあり、平衡条件を保証できない。

元木のx-yパスが重心を通らない組は同じ除去後成分内に限られるため、成分ごとの再帰結果を重心の子へ接続してよい。

現在成分の重心を求めて分解木の根とし、重心を除いた各連結成分を再帰処理して得た根の親をその重心に設定する。

## 典型の発動条件

### 重心分解

発動条件: 木を各段階で半分以下の連結成分へ再帰分割したい。

部分木サイズから重心を求め、分解木の親子を出力する。

### 分割統治

発動条件: 重心を通らない制約が除去後成分内で独立になる。

各成分を別問題として再帰し、その根を重心へ結ぶ。

## 問題固有の要素

求める木は元の辺を保つ必要がなく、元木上のパス条件だけを重心が媒介すればよい。

別の問題へ持ち帰る視点: 出力構成問題では、条件が分離するseparatorを新しい親子関係に使う。

## 正当性

重心の除去後は全成分が半分以下。各成分の再帰構成を帰納的に接ぐ。異なる成分間の元pathは重心を通り、同成分内のpathは再帰で扱えるためpath包含条件も保つ。

## 実装上の注意

- 全体O(N log N)になるよう各分解段で現成分だけを走査し、深い通常再帰によるstack overflowを避ける。

## 復習の核

- 出力木について全親子部分木サイズを検査し、小木では全頂点対の元パス条件も確認する。

## 計算量と制約

### 時間

N 頂点、各分解段で現成分だけ走査して O(N log N)。

### 空間

木、削除flag、分解親で O(N)、分解再帰深さ O(log N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1\leq A_i,B_i \leq N; All values in the input are integers.; The given graph is a tree.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/editorial/5840) — source-abc291-editorial-5840-f81899847d6c0912676ee91faaba0803527dfcec357072d21460af24e7909b0c
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc291/tasks/abc291_h) — source-abc291-ex-problem-0f5a2a3d492a1dc4e0890bcd3980e0243acdf9436eed5817e512836de4613d9d
