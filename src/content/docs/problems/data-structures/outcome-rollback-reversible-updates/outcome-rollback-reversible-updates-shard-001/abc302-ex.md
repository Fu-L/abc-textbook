---
title: "ABC302-EX — Ball Collector"
draft: true
authoringUnit: {"problemId":"abc302-ex","docPath":"src/content/docs/problems/data-structures/outcome-rollback-reversible-updates/outcome-rollback-reversible-updates-shard-001/abc302-ex.md","learningOutcomeIds":["outcome-rollback-reversible-updates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rollback","tag-dsu-components"],"sourceRevisionIds":["source-abc302-editorial-6409-0980d612d8a3b798d479cf989dcde01464de3545aff24aa2d5d6528a3fe792d2","source-abc302-ex-problem-fe03a8a5ec8d36feacf56530e37fa3ad843cdeafb3615a1d48ba6eb56243ddb1"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"値グラフの一つの連結成分に頂点数V、辺数Eがあると、各辺から一端を選んで得られる相異なる値の最大数はmin(V,E)である。木成分なら各辺を異なる頂点へ割り当てられ、cycleを含むなら全頂点を覆える。 DFSで根から現在頂点までのpair辺だけを追加し、戻り際にundoすれば、全vの独立な質問を共有計算できる。","sourceRevisionIds":["source-abc302-editorial-6409-0980d612d8a3b798d479cf989dcde01464de3545aff24aa2d5d6528a3fe792d2","source-abc302-ex-problem-fe03a8a5ec8d36feacf56530e37fa3ad843cdeafb3615a1d48ba6eb56243ddb1"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-rollback-reversible-updates"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"path pairは(1,2),(2,3),(3,1)。","procedure":["二辺までの成分はV=3,E=2で値数2。","三辺目でcycleとなりmin(V,E)=3。"],"executionTarget":null,"expectedResult":"最大相異なる値数3。","verificationStatus":"not_applicable","learningUnitIds":["unit-rollback"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-rollback-reversible-updates"],"prerequisiteIds":["unit-dsu-components"],"attainmentCondition":"次にself-loop(1,1)を足しても辺数を更新するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"更新する。V=3,E=4で寄与は3のままだがrollback履歴と今後の成分評価のためE増分が必要。"},"answer":{"reasoningOrVerification":"更新する。V=3,E=4で寄与は3のままだがrollback履歴と今後の成分評価のためE増分が必要。","procedure":["具体例の各状態・寄与を再計算する。","更新する。V=3,E=4で寄与は3のままだがrollback履歴と今後の成分評価のためE増分が必要。"],"expectedResult":"更新する。V=3,E=4で寄与は3のままだがrollback履歴と今後の成分評価のためE増分が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [rollback・DFS入退場の状態復元](src/content/docs/learn/query/rollback.md)

- 更新前の差分をstackへ記録し、分割統治・時間Segment Tree・DFSの退場時に状態を正確に巻き戻す。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- rollback・DFS入退場の状態復元の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

根1から頂点vへのpath上の各頂点は、値A_iとB_iのどちらか一方を選ぶpairに対応する。値を頂点、各pairを辺とする多重グラフに直すと、選べる相異なる値の最大数を連結成分ごとに評価できる。

採用する候補: 値グラフの連結成分量をrollback DSUでpathごとに保つ

DFSで根から現在頂点までのpair辺だけを追加し、戻り際にundoすれば、全vの独立な質問を共有計算できる。

棄却する候補: 各vについて根からのpathを取り出し、値の選び方を最初から解く

path長の総和がO(N^2)になり得て、各pairの二択も直接探索できない。

値グラフの一つの連結成分に頂点数V、辺数Eがあると、各辺から一端を選んで得られる相異なる値の最大数はmin(V,E)である。木成分なら各辺を異なる頂点へ割り当てられ、cycleを含むなら全頂点を覆える。

元の木を頂点1からDFSし、頂点iへ入ると値A_iとB_iを結ぶ辺をrollback DSUへ追加する。DSUは各成分の頂点数・辺数とΣmin(V,E)を持ち、その時点の総和をiの答えとして記録し、子の処理後に追加前までrollbackする。

## 典型の発動条件

### rollback DSU

発動条件: DFSの現在pathに対応する辺集合へ追加し、subtree処理後に直前の状態へ戻したい。

path compressionを使わずunion by sizeと変更履歴を持ち、辺追加・成分併合・同一成分内辺の増加をundoする。

### 多重グラフ上の選択割当

発動条件: 各二択から一つの値を選び、異なる選択値の個数を最大化する。

二択を辺、候補値を頂点と見て、成分の辺数と頂点数だけに目的値を圧縮する。

## 問題固有の要素

path上のball選択問題は、値グラフの各辺をいずれかの端点へ向ける問題であり、答えは成分ごとのmin(辺数,頂点数)の和になる。

別の問題へ持ち帰る視点: 二択の集合族はグラフ化すると、distinct代表選択の最大数を連結成分のcycle有無で捉えられる。

## 正当性

値グラフの一つの連結成分に頂点数V、辺数Eがあると、各辺から一端を選んで得られる相異なる値の最大数はmin(V,E)である。木成分なら各辺を異なる頂点へ割り当てられ、cycleを含むなら全頂点を覆える。 DFSで根から現在頂点までのpair辺だけを追加し、戻り際にundoすれば、全vの独立な質問を共有計算できる。

## 実装上の注意

- A_i=B_iのself-loopや、既に同じ成分に属する両端を結ぶ辺でも辺数だけは増える。rollback履歴には併合なしの更新も記録し、path compressionは行わない。

## 復習の核

- 小さい木で全pathと2択を総当たりし、self-loop、平行辺、木成分がcycle成分へ変わる瞬間、兄弟subtree間で状態が漏れないことを照合する。

## 計算量と制約

### 時間

O(N log N)、union-by-size rollback DSU。

### 空間

O(N)、値座標/DSU/変更履歴。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \le N \le 2 \times 10^5; 1 \le A_i,B_i \le N; The given graph is a tree.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

path pairは(1,2),(2,3),(3,1)。

1. 二辺までの成分はV=3,E=2で値数2。
2. 三辺目でcycleとなりmin(V,E)=3。

期待される結果: 最大相異なる値数3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

次にself-loop(1,1)を足しても辺数を更新するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

更新する。V=3,E=4で寄与は3のままだがrollback履歴と今後の成分評価のためE増分が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/editorial/6409) — source-abc302-editorial-6409-0980d612d8a3b798d479cf989dcde01464de3545aff24aa2d5d6528a3fe792d2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc302/tasks/abc302_h) — source-abc302-ex-problem-fe03a8a5ec8d36feacf56530e37fa3ad843cdeafb3615a1d48ba6eb56243ddb1
