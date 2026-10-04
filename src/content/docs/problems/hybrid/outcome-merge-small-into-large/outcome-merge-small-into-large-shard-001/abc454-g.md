---
title: "ABC454-G — Mode in the Subtree"
draft: true
authoringUnit: {"problemId":"abc454-g","docPath":"src/content/docs/problems/hybrid/outcome-merge-small-into-large/outcome-merge-small-into-large-shard-001/abc454-g.md","learningOutcomeIds":["outcome-merge-small-into-large"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-small-to-large"],"sourceRevisionIds":["source-abc454-editorial-19112-21efa506cd2931dfa4f71807ea339ebc5965f80a6cd28ee83425351988c7d598","source-abc454-g-problem-fb905e5fd81e3cc2ba3f70fbe1984b727ee3d478c85de7cd863e7777f4e3a4f6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"最大subtree sizeの子をheavyにすると、light edgeを下るたびsubtree sizeが半分以下になり、一頂点の再追加回数が対数回になる。 色 x を追加すると num[cnt[x]]を減らし cnt[x]を増やして numを増やすだけで、mode回数 mx とその色数 num[mx]を即時取得できる。 各頂点が add される回数は root path 上の light edge 数+1で O(log N) に抑えられ、subtree query時にはちょうどそのsubtree全体の頻度表が残る。","sourceRevisionIds":["source-abc454-editorial-19112-21efa506cd2931dfa4f71807ea339ebc5965f80a6cd28ee83425351988c7d598","source-abc454-g-problem-fb905e5fd81e3cc2ba3f70fbe1984b727ee3d478c85de7cd863e7777f4e3a4f6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

各subtreeで必要なのは色ごとの出現回数と、その最大回数を持つ色数だけである。色番号がN以下なので hash map を使わず配列で頻度を持てる。

採用する候補: heavy child の集計を残し light child の Euler区間を追加し直す DSU on Tree を行い、cnt[color]、num[freq]、現在最大freqを配列で更新する。

各頂点が add される回数は root path 上の light edge 数+1で O(log N) に抑えられ、subtree query時にはちょうどそのsubtree全体の頻度表が残る。

棄却する候補: 各subtreeの色頻度 unordered_map を small-to-large merge する。

漸近的には可能でも N=2.5×10^6 では hash node の時間・空間定数が大きく、実用的な制限を超える。

最大subtree sizeの子をheavyにすると、light edgeを下るたびsubtree sizeが半分以下になり、一頂点の再追加回数が対数回になる。

色 x を追加すると num[cnt[x]]を減らし cnt[x]を増やして numを増やすだけで、mode回数 mx とその色数 num[mx]を即時取得できる。

最初のDFSでsubtree size、heavy child、Euler区間を求める。solve(v,keep) でlight childをkeep=false、heavyをtrueで処理し、light各Euler区間とvをaddする。答え(mx,num[mx])を保存し、keep=falseなら触れた範囲をresetする。

## 典型の発動条件

### DSU on Tree

発動条件: 全subtreeの頻度統計を、色値域配列で軽量に求めたいとき。

heavy childのtableを再利用しlight subtreeだけ追加・削除する。

### 頻度の頻度配列

発動条件: 要素追加中にmode頻度とmode種類数を即時取得したいとき。

cnt[color]とnum[count]を同時更新する。

## 問題固有の要素

small-to-large の計算量だけでなく、巨大Nではcontainer一要素の実メモリを見て配列ベースの traversal reuseを選ぶ。

別の問題へ持ち帰る視点: mode queryは全色を走査せず、frequency histogramを持つと最大bucketだけで答えられる。

## 正当性

最大subtree sizeの子をheavyにすると、light edgeを下るたびsubtree sizeが半分以下になり、一頂点の再追加回数が対数回になる。 色 x を追加すると num[cnt[x]]を減らし cnt[x]を増やして numを増やすだけで、mode回数 mx とその色数 num[mx]を即時取得できる。 各頂点が add される回数は root path 上の light edge 数+1で O(log N) に抑えられ、subtree query時にはちょうどそのsubtree全体の頻度表が残る。

## 実装上の注意

- 再帰stackと巨大配列のmemoryを抑え、resetで全配列clearせず実際に追加したEuler範囲だけ戻す。num[0]の扱いをqueryに混ぜない。

## 復習の核

- light edge数が対数回となるsize半減証明と、solve(v,keep)終了時のtable内容を小木で追って確認する。

## 計算量と制約

### 時間

O(N log N)、sack法でlight側の再追加を半減回数へ課金。

### 空間

O(N)、Euler・色頻度・頻度別色数。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2.5 \times 10^6; 1 \leq p_i \lt i; 1 \leq c_i \leq N; 1 \leq \mathrm{seed} \lt 2^{31}; 2 \leq M \leq \min(N, 10^5); 1 \leq F \leq N; 1 \leq q_i \lt i; 1 \leq d_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc454/editorial/19112) — source-abc454-editorial-19112-21efa506cd2931dfa4f71807ea339ebc5965f80a6cd28ee83425351988c7d598
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc454/tasks/abc454_g) — source-abc454-g-problem-fb905e5fd81e3cc2ba3f70fbe1984b727ee3d478c85de7cd863e7777f4e3a4f6
