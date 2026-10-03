---
title: "ABC431-G — One Time Swap 2"
draft: true
authoringUnit: {"problemId":"abc431-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-set-statistics/outcome-maintain-ordered-set-statistics-shard-001/abc431-g.md","learningOutcomeIds":["outcome-maintain-ordered-set-statistics"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-set-multiset","tag-coordinate-compression","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc431-editorial-14517-99b426921794d7dec8960aeb826e802ebc66208b43ff209034a76585df924bcf","source-abc431-g-problem-233e542369d4b3006247612b2a6220f1dd6906f5101cc22696f475f0da480beb"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"最初の変更位置と交換後の値で小・同一・大の三ブロックが分かれる。小側の(l,A_r,−r)、大側の(−l,A_r,r)の順序は、二列で最初に値が異なる位置の比較と一致する。c_lの累積で左端のブロックを選び、suffix値頻度の順序統計と出現位置listの指定方向で右端を選ぶので、指定順位の列を実現する対が得られる。同一ブロックではどの同値対も元列を実現するため、保存した一組で正しい。対は重複列でも各一件として数えるので、順位のmultiplicityも保たれる。","sourceRevisionIds":["source-abc431-editorial-14517-99b426921794d7dec8960aeb826e802ebc66208b43ff209034a76585df924bcf","source-abc431-g-problem-233e542369d4b3006247612b2a6220f1dd6906f5101cc22696f475f0da480beb"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

- 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- ordered set・multisetの動的順序管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

求める出力はk番目の列を実現する交換位置(l,r)一組である。列を実体化して出力する必要はない。ただし全N(N−1)/2対がソート列に含まれるので、同じ値を交換して元列になる対も、それぞれ一件として順位を占める。

一回swapした列f(l,r)と元列Aの比較は最初に変わる位置lで決まり、A_r<A_lなら小さい、等しいなら同じ、大きいなら大きい。これを三ブロックへ分ける。各lについてc_l^−=#{r>l:A_r<A_l}、c_l^+=#{r>l:A_r>A_l}を、右から値頻度Fenwick木へ挿入して前計算する。小側総数S=Σc_l^−、同一総数E=Σ_v C(freq_v,2)、大側総数G=Σc_l^+で、S+E+G=C(N,2)。

小側では(l,A_r,−r)の辞書順に列が並ぶ。lが小さければ早い位置を小さくでき、同じlなら交換先の値が小さい方が先、同値なら元の大値を置くrが遅い方が先である。大側では(−l,A_r,r)の順で、最初の変更を遅らせるl降順、値昇順、同値r昇順となる。

k≤Sならl昇順のc_l^−累積から所属lとブロック内順位tを二分探索する。S<k≤S+Eなら元列を返す同値対を一つ選ぶ。各値の出現位置listから長さ2以上のlistを一つ保存しておけばよい。この場合の出力も(l,r)。残りはk−S−Eを大側のl降順累積へ入れてtを得る。

所属lが決まった質問をlごとにまとめ、l=N−1,…,1の順に処理する。Fenwick木にはr>lの値だけを入れる。小側のt番目はこのsuffixの値昇順t番目である（t≤c_l^−）。大側ではsuffixのA_l以下の個数uを数え、値昇順のu+t番目を選ぶ。Fenwick木の累積個数を用いた二分探索で交換先の値vを得る。

suffix内のv未満の個数をhとし、選んだ全体順位からhを引いた値をsとする。vの出現位置listでlより右の先頭位置をupper_boundし、suffix出現数mを求める。小側はそのsuffix listの後ろからs番目、大側は前からs番目をrにする。全ての順位・対の総数は64bitで持つ。質問の元の順に保存した(l,r)を出力する。

全交換後列の構築は三乗規模になるが、辞書順を決める最初の差と同値の後続位置だけをkeyにすれば、O((N+Q)log N)時間・O(N+Q)空間で選択から出力まで完結する。

## 典型の発動条件

### 辞書順の最初の相違点

発動条件: 大きな列候補同士の順序が、変更された最初の少数位置だけで決まるとき。

swap 後列を (l,A_r,±r) という定数長 key へ圧縮する。

### オフライン順序統計

発動条件: 多数の k 番目候補質問を、走査に合わせて集合を更新しながら答えるとき。

Fenwick 木または kth 対応集合で suffix 値の個数と k-th を得る。

### 対称ケース分解

発動条件: 基準列より小さい・等しい・大きい候補で比較規則が単純化するとき。

転倒対、等値対、昇順対を分離し、両端の群を反転した key で処理する。

## 問題固有の要素

一箇所 swap 後の辞書順は列全体でなく、最初の変更位置とそこへ来る値、同値時の二つ目の変更位置で決まる。

別の問題へ持ち帰る視点: 巨大な派生オブジェクト集合の k 番目は、比較を生成パラメータの短い key に落として順序統計を取る。

## 正当性

最初の変更位置と交換後の値で小・同一・大の三ブロックが分かれる。小側の(l,A_r,−r)、大側の(−l,A_r,r)の順序は、二列で最初に値が異なる位置の比較と一致する。c_lの累積で左端のブロックを選び、suffix値頻度の順序統計と出現位置listの指定方向で右端を選ぶので、指定順位の列を実現する対が得られる。同一ブロックではどの同値対も元列を実現するため、保存した一組で正しい。対は重複列でも各一件として数えるので、順位のmultiplicityも保たれる。

## 実装上の注意

- 出力するのは交換位置l,r。同一列のブロックでも同値対を一つ出す。
- 小側は同値のr降順、大側はr昇順。全交換対数とkは64bit。
- Fenwick木を更新する走査時点を、r>lだけが登録された状態にそろえる。

## 復習の核

- 小側・大側それぞれの key を実際の最初の相違位置で証明し、k の群内 offset と r の tie-break を確認する。

## 計算量と制約

### 時間

O((N+Q)log N)。対数個の値頻度照会と順位選択を一質問で行い、出力は一組二整数なのでO(Q)。

### 空間

O(N+Q)、出力を逐次生成する。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 2\times 10^5; 1\leq Q\leq 2\times 10^5; 1\leq A_i\leq N; 1\leq k\leq \frac{N(N-1)}{2}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/editorial/14517) — source-abc431-editorial-14517-99b426921794d7dec8960aeb826e802ebc66208b43ff209034a76585df924bcf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc431/tasks/abc431_g) — source-abc431-g-problem-233e542369d4b3006247612b2a6220f1dd6906f5101cc22696f475f0da480beb
