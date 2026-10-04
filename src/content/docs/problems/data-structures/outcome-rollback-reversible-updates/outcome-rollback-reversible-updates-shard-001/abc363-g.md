---
title: "ABC363-G — Dynamic Scheduling"
draft: true
authoringUnit: {"problemId":"abc363-g","docPath":"src/content/docs/problems/data-structures/outcome-rollback-reversible-updates/outcome-rollback-reversible-updates-shard-001/abc363-g.md","learningOutcomeIds":["outcome-rollback-reversible-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-matching","unit-range-actions","unit-segment-tree-canonical-decomposition"],"excludedTopics":["rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rollback","tag-bipartite-matching-hall","tag-lazy-segment-action","tag-segment-tree-canonical-decomposition"],"sourceRevisionIds":["source-abc363-editorial-10451-6d090c51cdcb5cd135b6516c2a81751ba5d845e3e3c1302f5031dacd528bc3ce","source-abc363-g-problem-4b21bdcb8e03600245118519ddd01979cb186e7c265ba480003997492e6ba9e3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"単位時間の仕事を期限順に並べると、全tでdeadline≤tの個数がt以下であることが実行可能性の必要十分条件となる。これは入れ子の容量制約を持つmatroidで、最大報酬の独立集合を一仕事ずつ挿入できる。\n\n新仕事e=(D,P)で違反する場合、元のfは非負なので、D以上で元のf(t)=0だった位置だけが違反する。その最初をt*とする。違反を直すにはdeadline≤t*の選択済み仕事を一つ外す必要があり、この条件を満たせば後続の違反も全て直る。一方、D未満の余裕は増えるだけなので新しい違反を作らない。従ってdeadline≤t*の選択済み仕事の報酬最小とeを比較し、eの方が高い場合だけ交換する。matroidの交換性により、この最小報酬の回路要素との交換は新しい最大報酬集合を与える。\n\n各仕事versionの有効期間を時刻segment treeへ分解すると、葉へ至る経路上の仕事がその時刻の入力と正確に一致する。挿入の順序に依存せず最適集合を維持し、退出時に採否・余裕・報酬を全てundoすれば、各葉で求めた報酬が正しい。","sourceRevisionIds":["source-abc363-editorial-10451-6d090c51cdcb5cd135b6516c2a81751ba5d845e3e3c1302f5031dacd528bc3ce","source-abc363-g-problem-4b21bdcb8e03600245118519ddd01979cb186e7c265ba480003997492e6ba9e3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rollback・DFS入退場の状態復元](src/content/docs/learn/query/rollback.md)

- 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md) — 二部グラフの彩色と成分構造で得た考え方と実装を再利用し、二部matching・Hall・Kőnigの発動条件・正当化・境界を重複なく学ぶ。
- [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md) — 結合的な区間要約を設計した後、更新作用の合成順と要約への適用を遅延評価する。
- [Segment Treeのcanonical区間分解](src/content/docs/learn/query/segment-tree-canonical-decomposition.md) — 区間monoid要約で得た考え方と実装を再利用し、Segment Treeのcanonical区間分解の発動条件・正当化・境界を重複なく学ぶ。

## 考察

期限内に実行する仕事集合Xが実行可能である条件は、全nについてdeadline≤nの仕事数がn以下であることに等しい。f(n)=n−count(D_i≤n)を置けば全f(n)≥0で判定できる。

一仕事を追加した最適集合は、追加可能なら採用し、不可能なら、それを採用可能にする選択済み仕事のうち報酬最小のものと交換して報酬が増える場合だけ更新すればよい。

採用する候補: 仕事の有効期間を時刻segment treeへ載せ、DFS中にrollback可能な最適集合をHall条件のrange-min構造で更新する。

任意変更を追加とundoへ変換し、各nodeで共通して有効な仕事だけを一方向に挿入できる。

棄却する候補: 各query後にdeadline順の通常greedyを全N仕事へ実行し直す。

単発問題には使えるが、一件変更のたびにほぼ同じ並べ替えと選択を繰り返す。

仕事(D,P)をXへ入れるとf(D..N)へ−1、外すと+1であり、全体minimumが非負かをlazy segment treeで判定できる。

各仕事versionが存在するquery時刻区間をsegment treeの標準分解nodeへ置き、node退出時に変更履歴stackを逆順undoすれば兄弟区間を汚さない。

各仕事の初期値と更新後versionについて有効な時刻区間を求め、time segment treeへ登録する。DFSでnode内の仕事を順に追加し、Hall余裕fをrange add/minで管理する。invalidなら追加を可能にする選択済み仕事の最小報酬候補を補助set・segment treeで求め、利益が増す場合だけ交換する。葉で選択報酬和を出力し、退出時に全操作をrollbackする。

交換候補の探し方まで具体化する。Hall余裕f(t)=t−count(D_i≤t)をrange add/minの木へ置く。挿入前の[D,N]で最初のf(t)=0を木上探索し、あればt*とする。選択済み仕事をdeadline別の報酬multisetへ入れ、その最小値を別segment treeに載せれば、deadline≤t*の最小報酬をprefix minでO(log N)取得できる。交換時は新旧仕事のdeadline以後へ−1/+1を加え、multisetと総報酬も更新する。挿入不可かつ交換で利益が増えない場合は新仕事を棄却する。退出時はこの一連の操作を記録した逆順に戻す。

## 典型の発動条件

### 時間segment treeとrollback

発動条件: offlineな一点変更を、要素の追加だけ得意なdata structureで処理したいとき。

各versionの生存区間をnodeへ分解し、DFSのstack順で追加・undoする。

### Hall条件のprefix slack管理

発動条件: deadlineまでに一件ずつ割り当てるschedule集合の実行可能性を動的判定するとき。

f(n)=n−期限n以下の選択数をsuffix加算・全体最小で保持する。

## 問題固有の要素

費用流の負閉路更新は、このnested deadline構造では「新仕事を追加、または最小報酬仕事と一回交換」に具体化できる。

別の問題へ持ち帰る視点: 一般最適化の残余操作も、近傍集合がnestedなら単純な交換oracleへ縮むことがある。

## 正当性

単位時間の仕事を期限順に並べると、全tでdeadline≤tの個数がt以下であることが実行可能性の必要十分条件となる。これは入れ子の容量制約を持つmatroidで、最大報酬の独立集合を一仕事ずつ挿入できる。

新仕事e=(D,P)で違反する場合、元のfは非負なので、D以上で元のf(t)=0だった位置だけが違反する。その最初をt*とする。違反を直すにはdeadline≤t*の選択済み仕事を一つ外す必要があり、この条件を満たせば後続の違反も全て直る。一方、D未満の余裕は増えるだけなので新しい違反を作らない。従ってdeadline≤t*の選択済み仕事の報酬最小とeを比較し、eの方が高い場合だけ交換する。matroidの交換性により、この最小報酬の回路要素との交換は新しい最大報酬集合を与える。

各仕事versionの有効期間を時刻segment treeへ分解すると、葉へ至る経路上の仕事がその時刻の入力と正確に一致する。挿入の順序に依存せず最適集合を維持し、退出時に採否・余裕・報酬を全てundoすれば、各葉で求めた報酬が正しい。

## 実装上の注意

- 同じ仕事の旧versionと新versionの有効区間を半開区間で重複させない。追加失敗時に除ける最小報酬候補のdeadline範囲と、全補助構造のundo順を一致させる。

## 復習の核

- まず静的なXのvalid条件と一仕事追加時の交換則を別々に証明する。その後、各mutationを履歴recordにまとめ、node退出で完全復元できるかassertする。

## 計算量と制約

### 時間

O((N+Q)log Q log N)、各仕事versionをO(log Q)時刻nodeへ登録し、各追加・undoをO(log N)で処理。

### 空間

O(N+Q log Q)、Hall木とversion登録・履歴。

### 制約との対応

公式制約の確認範囲: Time limit: 8 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq Q \leq 10^5; 1 \leq D_i \leq N; 1 \leq P_i \leq 10^9; 1 \leq c \leq N; 1 \leq x \leq N; 1 \leq y \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc363/editorial/10451) — source-abc363-editorial-10451-6d090c51cdcb5cd135b6516c2a81751ba5d845e3e3c1302f5031dacd528bc3ce
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc363/tasks/abc363_g) — source-abc363-g-problem-4b21bdcb8e03600245118519ddd01979cb186e7c265ba480003997492e6ba9e3
