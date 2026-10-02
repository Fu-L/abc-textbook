---
title: "ABC260-F — Find 4-cycle"
draft: true
authoringUnit: {"problemId":"abc260-f","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc260-f.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc260-f-problem-cdeb74ee8abe8ff151e1a5f4608728f3eaaa54d071f3df636b41281d86980f3e","source-abc260-editorial-4437-b3ba3b06d77e60c16895f85058b48209a1ae9a0cdbca62613ac9ed1afffef89b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"4-cycleがない間は各 V_2 頂点対が高々一度しか現れないため、全隣接リストの二重ループも鳩ノ巣原理で V_2 頂点対数に抑えられる。 同じ V_2 頂点対を別の V_1 頂点が作った瞬間に必要な四頂点が揃い、対表は T×T に収まる。","sourceRevisionIds":["source-abc260-f-problem-cdeb74ee8abe8ff151e1a5f4608728f3eaaa54d071f3df636b41281d86980f3e","source-abc260-editorial-4437-b3ba3b06d77e60c16895f85058b48209a1ae9a0cdbca62613ac9ed1afffef89b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

二部グラフの4-cycleは、片側の異なる二頂点 x,y が、反対側に共通隣接頂点を二つ持つことと同値である。

小さい側 V_2 の頂点対は T^2 個程度しかなく、最初にその対を作った V_1 頂点だけを記録できる。

棄却する候補: 各頂点対について共通隣接頂点数を隣接行列積で求める。

S が 30 万まである密行列を構築・乗算する必要はなく、見つけた時点で終了できる性質も使えない。

採用する候補: 各 z∈V_1 の隣接リスト内の組 (x,y) を列挙し、pairOwner[x][y] に最初の z を保存し、二回目の z で4-cycleを出力する。

同じ V_2 頂点対を別の V_1 頂点が作った瞬間に必要な四頂点が揃い、対表は T×T に収まる。

4-cycleがない間は各 V_2 頂点対が高々一度しか現れないため、全隣接リストの二重ループも鳩ノ巣原理で V_2 頂点対数に抑えられる。

短い偶閉路の検出を、二歩パスの両端対に中点を記録する collision detection として実装する。

## 典型の発動条件

### 共通隣接頂点対による4-cycle検出

発動条件: 二部グラフで長さ4の閉路を一つ見つけたいとき。

片側二頂点の共通隣接頂点を一つ記録し、別の共通隣接頂点との衝突を探す。

### 早期終了と鳩ノ巣原理による列挙上界

発動条件: 同じ有限キーを二回生成した時点で答えが確定する列挙処理。

未発見中は各キーを一度しか処理しないため、見かけ上の次数二乗和をキー空間の大きさで抑える。

## 問題固有の要素

S と T は非対称で、T≤3000 の側の頂点対をキーに選ぶことで二次元表を現実的な大きさにできる。

別の問題へ持ち帰る視点: 二部構造で片側だけが小さいときは、小さい側の組を状態空間にして大きい側を走査する。

## 正当性

4-cycleがない間は各 V_2 頂点対が高々一度しか現れないため、全隣接リストの二重ループも鳩ノ巣原理で V_2 頂点対数に抑えられる。 同じ V_2 頂点対を別の V_1 頂点が作った瞬間に必要な四頂点が揃い、対表は T×T に収まる。

## 実装上の注意

- 各隣接リストでは x<y の組だけを列挙し、同一頂点対や順序違いを重複処理しない。
- pairOwner は未登録を −1 とし、登録済み w を見つけたら z,w,x,y の四頂点を元の番号で出力する。

## 復習の核

- 短い閉路は、閉路そのものより同じ両端を持つ複数の短いパスとして捉える。
- 次数二乗和が一見大きくても、答え未発見中に同じキーを再訪できないならキー数で償却できるか確認する。

## 計算量と制約

### 時間

O(M+T²)、二部の小さい側T、collision以前の二歩端点pair数≤C(T,2)。

### 空間

O(M+T²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq S \leq 3 \times 10^5; 2 \leq T \leq 3000; 4 \leq M \leq \min(S \times T,3 \times 10^5); 1 \leq u_i \leq S; S + 1 \leq v_i \leq S + T; If i \neq j, then (u_i, v_i) \neq (u_j, v_j).; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/tasks/abc260_f) — source-abc260-f-problem-cdeb74ee8abe8ff151e1a5f4608728f3eaaa54d071f3df636b41281d86980f3e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/editorial/4437) — source-abc260-editorial-4437-b3ba3b06d77e60c16895f85058b48209a1ae9a0cdbca62613ac9ed1afffef89b
