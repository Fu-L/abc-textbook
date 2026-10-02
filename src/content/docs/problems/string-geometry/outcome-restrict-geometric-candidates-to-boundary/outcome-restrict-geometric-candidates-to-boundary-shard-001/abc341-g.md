---
title: "ABC341-G — Highest Ratio"
draft: true
authoringUnit: {"problemId":"abc341-g","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc341-g.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull"],"sourceRevisionIds":["source-abc341-editorial-9326-f7af493fa4dae6393c81c87687e016a4cc680f445c19b89afe4d6ea25cf7e8b0","source-abc341-g-problem-dcabda9ffa6ce4e4b9261053e335e65354faeb0ab8d81bc72d99dc904ed5f8c2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"区間平均はprefix二点の傾き。固定左点はsuffix集合の最左x点なので、最大傾き方向はupper hullの隣接辺になる。hullの内側の点を消してもその最大方向を変えず、右から追加するstackのpopは各点一度だけ。各左点追加直後の隣接傾きを取れば全左端の最大平均を得る。","sourceRevisionIds":["source-abc341-editorial-9326-f7af493fa4dae6393c81c87687e016a4cc680f445c19b89afe4d6ea25cf7e8b0","source-abc341-g-problem-dcabda9ffa6ce4e4b9261053e335e65354faeb0ab8d81bc72d99dc904ed5f8c2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

prefix sum点P_i=(i,Σ_{j≤i}A_j)を置くと、区間[k,r]の平均はP_{k-1}からP_rへのslopeである。固定した左点から右側点への最大slopeは、そのsuffix点集合のupper convex hullで左点に隣接する点が与える。

採用する候補: prefix sum点を右から追加しupper hullをstackで維持する

各点は一度push/popされ、全kの最大slopeをO(N)で得られる。

棄却する候補: 各kで全r≥kの平均を走査する

suffix長の総和がO(N^2)になりN=2×10^5に間に合わない。

P_{k-1}はsuffix点集合でx最小の点である。そこから引ける直線の最大傾きはupper hullの時計回り側の最初の辺の傾きであり、内部点へのslopeはその値を超えない。

prefix sumsを作り、i=Nから0へ点P_iをstack hullへ追加する。末尾二点と新点のcross productがupper-hullのconvexityを壊す間、中央点をpopする。P_{k-1}追加直後にその隣のhull点との(y差)/(x差)をans[k]として記録しdoubleで出力する。

## 典型の発動条件

### prefix sum幾何

発動条件: 連続区間の平均や比率がsum差/lengthとして現れる。

prefix点間slopeへ変換し、endpoint選択を幾何的な接線問題にする。

### monotone convex hull

発動条件: 点がx順に追加され、各時点のsuffix hull端の隣接辺が欲しい。

cross productで不要点をstackからpopし、各点を償却O(1)で処理する。

## 問題固有の要素

各kで別々のconvex hullを作らず、kを右から減らすと候補点集合へ左端点が一つ追加されるだけなのでhullを永続的に更新できる。

別の問題へ持ち帰る視点: nested suffix queryは走査方向を合わせ、monotone data structureを一回構築しながら答える。

## 正当性

区間平均はprefix二点の傾き。固定左点はsuffix集合の最左x点なので、最大傾き方向はupper hullの隣接辺になる。hullの内側の点を消してもその最大方向を変えず、右から追加するstackのpopは各点一度だけ。各左点追加直後の隣接傾きを取れば全左端の最大平均を得る。

## 実装上の注意

- cross productはprefix sum最大2×10^11との積を扱う64bit範囲を確認し、collinear点のpop不等号を最大slopeと隣接点規約に合わせる。出力は十分なprecisionを使う。

## 復習の核

- 全要素同値、単調増加・減少、collinearなprefix点、最大がr=kとr=Nになる例をO(N^2)真値と比較する。

## 計算量と制約

### 時間

O(N)。prefix点を右から追加する単調hull。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 2\times 10^5; 1\leq A_i\leq 10^6; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc341/editorial/9326) — source-abc341-editorial-9326-f7af493fa4dae6393c81c87687e016a4cc680f445c19b89afe4d6ea25cf7e8b0
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc341/tasks/abc341_g) — source-abc341-g-problem-dcabda9ffa6ce4e4b9261053e335e65354faeb0ab8d81bc72d99dc904ed5f8c2
