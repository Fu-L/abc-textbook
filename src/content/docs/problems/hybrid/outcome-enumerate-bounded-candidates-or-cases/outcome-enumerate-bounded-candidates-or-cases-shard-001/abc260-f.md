---
title: "ABC260-F — Find 4-cycle"
draft: true
authoringUnit: {"problemId":"abc260-f","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc260-f.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc260-f-problem-cdeb74ee8abe8ff151e1a5f4608728f3eaaa54d071f3df636b41281d86980f3e","source-abc260-editorial-4437-b3ba3b06d77e60c16895f85058b48209a1ae9a0cdbca62613ac9ed1afffef89b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同じ $$V_2$$ 頂点対 $$(x,y)$$ を異なる $$V_1$$ 頂点 $$z,w$$ が作れば、$$z,x,w,y$$ は4-cycleをなす。逆に、4-cycleがあれば、その二つの $$V_1$$ 頂点を処理した時点までに共通の頂点対が衝突するので、見逃さない。\n\n各隣接リストで同じ組を一度だけ生成するため、衝突前に生成した頂点対はすべて異なる。キーは $$\\binom{T}{2}$$ 種類なので、衝突しない場合の対の処理回数は高々 $$\\binom{T}{2}$$ 回、衝突する場合も終了直前の1回を加えて高々 $$\\binom{T}{2}+1$$ 回である。この上界が抑えるのは対の処理回数であり、空のリストを含む全頂点の走査や表の初期化は別に数える。","sourceRevisionIds":["source-abc260-f-problem-cdeb74ee8abe8ff151e1a5f4608728f3eaaa54d071f3df636b41281d86980f3e","source-abc260-editorial-4437-b3ba3b06d77e60c16895f85058b48209a1ae9a0cdbca62613ac9ed1afffef89b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

この解説で扱わないこと:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

二部グラフの4-cycleは、片側の異なる二頂点 x,y が、反対側に共通隣接頂点を二つ持つことと同値である。

小さい側 V_2 の頂点対は T^2 個程度しかなく、最初にその対を作った V_1 頂点だけを記録できる。

棄却する候補: 各頂点対について共通隣接頂点数を隣接行列積で求める。

S が 30 万まである密行列を構築・乗算する必要はなく、見つけた時点で終了できる性質も使えない。

採用する候補: 各 z∈V_1 の隣接リスト内の組 (x,y) を列挙し、pairOwner[x][y] に最初の z を保存し、二回目の z で4-cycleを出力する。

短い偶閉路の検出を、二歩パスの両端対に中点を記録する collision detection として実装する。

具体的には、$$V_1$$ の各頂点に対応する $$S$$ 個の隣接リストを用意し、入力の $$M$$ 辺を保存する。$$T\times T$$ の表 `pairOwner` を −1 で初期化したら、空の隣接リストも含めて $$V_1$$ の全頂点を順に走査する。各リストから異なる二頂点の組を一度ずつ生成し、表を調べる。衝突したら直ちに四頂点を出力し、最後まで衝突しなければ −1 を出力する。

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

同じ $$V_2$$ 頂点対 $$(x,y)$$ を異なる $$V_1$$ 頂点 $$z,w$$ が作れば、$$z,x,w,y$$ は4-cycleをなす。逆に、4-cycleがあれば、その二つの $$V_1$$ 頂点を処理した時点までに共通の頂点対が衝突するので、見逃さない。

各隣接リストで同じ組を一度だけ生成するため、衝突前に生成した頂点対はすべて異なる。キーは $$\binom{T}{2}$$ 種類なので、衝突しない場合の対の処理回数は高々 $$\binom{T}{2}$$ 回、衝突する場合も終了直前の1回を加えて高々 $$\binom{T}{2}+1$$ 回である。この上界が抑えるのは対の処理回数であり、空のリストを含む全頂点の走査や表の初期化は別に数える。

## 実装上の注意

- 各隣接リストでは x<y の組だけを列挙し、同一頂点対や順序違いを重複処理しない。
- pairOwner は未登録を −1 とし、登録済み w を見つけたら z,w,x,y の四頂点を元の番号で出力する。

## 復習の核

- 短い閉路は、閉路そのものより同じ両端を持つ複数の短いパスとして捉える。
- 次数二乗和が一見大きくても、答え未発見中に同じキーを再訪できないならキー数で償却できるか確認する。

## 計算量と制約

### 時間

全体で $$O(S+M+T^2)$$ 時間。隣接リストの準備と入力の保存に $$O(S+M)$$、対を記録する表の初期化に $$O(T^2)$$ を使う。探索では、空のリストも含む $$S$$ 頂点の走査に $$O(S)$$、各隣接リスト内の外側ループに合計 $$O(M)$$ がかかる。対そのものの処理は、正当性で示した衝突までの上界から $$O(T^2)$$ である。辺が少なくても $$S$$ 個のリストを走査する費用は残る。

### 空間

全体で $$O(S+M+T^2)$$ 空間。$$S$$ 個の隣接リストの管理領域と、そこへ保存する $$M$$ 個の辺に $$O(S+M)$$、`pairOwner` の $$T\times T$$ 要素に $$O(T^2)$$ を使う。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq S \leq 3 \times 10^5; 2 \leq T \leq 3000; 4 \leq M \leq \min(S \times T,3 \times 10^5); 1 \leq u_i \leq S; S + 1 \leq v_i \leq S + T; If i \neq j, then (u_i, v_i) \neq (u_j, v_j).; All values in input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/tasks/abc260_f) — source-abc260-f-problem-cdeb74ee8abe8ff151e1a5f4608728f3eaaa54d071f3df636b41281d86980f3e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc260/editorial/4437) — source-abc260-editorial-4437-b3ba3b06d77e60c16895f85058b48209a1ae9a0cdbca62613ac9ed1afffef89b
