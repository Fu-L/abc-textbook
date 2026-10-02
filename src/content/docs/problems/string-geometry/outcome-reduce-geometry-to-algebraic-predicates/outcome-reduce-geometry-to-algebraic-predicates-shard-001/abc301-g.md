---
title: "ABC301-G — Worst Picture"
draft: true
authoringUnit: {"problemId":"abc301-g","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc301-g.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc301-editorial-6330-6027599d6197eb06cbd58bb5c57e1270afe2a37a348e6cf70da2d5141b3e2b28","source-abc301-g-problem-17e39979cd39918343e6cf0d6f6bdcf1ea2e6c4245a8daedcf5c8a493c60522f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"写る人数がN未満なら撮影点は重なる二人の直線上にある。一つのrayでcnt人が重なれば隠れるのはcnt−1人。最適点は単一有効直線上か複数有効直線の交点として列挙され、同じ直線をcanonical統合すればその隠人数を二重加算しない。x<0からx>0の人を見るため同一直線上の人は同じrayに入り、直線間の隠れ寄与は独立に足せる。","sourceRevisionIds":["source-abc301-editorial-6330-6027599d6197eb06cbd58bb5c57e1270afe2a37a348e6cf70da2d5141b3e2b28","source-abc301-g-problem-17e39979cd39918343e6cf0d6f6bdcf1ea2e6c4245a8daedcf5c8a493c60522f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

撮影点pで二人以上が同一直線上に重なる場合だけ人数が減るため、最適値がNでなければpは少なくとも一つの人pair直線上にある。

採用する候補: 有効pair直線とその交点を有理数で列挙

x<0を通る各直線上単独候補と、複数直線が交わるpを調べ、各直線上人数-1の隠人数を合計すれば最小可視人数を得られる。

棄却する候補: 3D空間を連続最適化

目的値が直線配置で離散的に変化し、座標探索では候補を保証できない。

pを通る同一直線上ではx>0の人は同じrayに並び最前の一人だけ写る。複数の異なる有効直線がpで交わる時、隠人数寄与を加算できる。

全person pairからx<0領域へ延びる相異なる3D直線をcanonical有理表現で作り各包含人数を数える。直線単独と全二直線交点x<0をmapで集約し、通過直線ごとの(cnt-1)最大をNから引く。

## 典型の発動条件

### 配置が変わる臨界集合の列挙

発動条件: 連続位置pでscoreがcollinearity時だけ変化する。

pairが定める直線とその交点だけを候補にする。

### 有理幾何

発動条件: 3D直線の一致・交点を誤差なく扱う。

整数比をcanonical化してmap keyにする。

## 問題固有の要素

隠れが発生するための必要条件が人pairとpの共線性なので、連続3D最適化をO(N^4)の離散交点へ落とせる。

別の問題へ持ち帰る視点: 幾何scoreの不連続条件を列挙して候補集合を作る。

## 正当性

写る人数がN未満なら撮影点は重なる二人の直線上にある。一つのrayでcnt人が重なれば隠れるのはcnt−1人。最適点は単一有効直線上か複数有効直線の交点として列挙され、同じ直線をcanonical統合すればその隠人数を二重加算しない。x<0からx>0の人を見るため同一直線上の人は同じrayに入り、直線間の隠れ寄与は独立に足せる。

## 実装上の注意

- x<0の候補だけ採用し、同一直線重複を統合する。射影が重なる場合は別平面を使い、128ビットで積を守る。

## 復習の核

- 小Nで候補点を直接評価し、全X同値で答N、3人以上共線、3本以上が一点交差する例を確認する。

## 計算量と制約

### 時間

O(N⁴ log N)を上界とする。L≤C(N,2)本のcanonical直線の全pair交点をmap集約。

### 空間

O(N⁴)。交点mapは高々O(L²)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 50; 0 < X_i \leq 1000; -1000 \leq Y_i,Z_i \leq 1000; The triples (X_i,Y_i,Z_i) are distinct.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6330) — source-abc301-editorial-6330-6027599d6197eb06cbd58bb5c57e1270afe2a37a348e6cf70da2d5141b3e2b28
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_g) — source-abc301-g-problem-17e39979cd39918343e6cf0d6f6bdcf1ea2e6c4245a8daedcf5c8a493c60522f
