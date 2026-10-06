---
title: "ABC478 G — Division Point Hull"
draft: true
authoringUnit: {"problemId":"abc478-g","docPath":"src/content/docs/problems/updates/abc478-g.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-convex-boundary-hull"],"sourceRevisionIds":["source-abc478-g-problem-aeba07c33615b14b7c8163fb621fd5cf36b440d9a6721cee9144dbc3ef80f67d","source-abc478-editorial-26504-d7397a35197892da6c236aa4b0081aaaab17fd84c7c7aefb891c0a70d9318c2c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"左右をまたぐ全ペアの凸包は、凸結合の展開により左右の凸包のMinkowski和と一致する。その頂点へ置き換えても全体の凸包は変わらない。各i<jは唯一の分割で処理されるので候補凸包が全ペア凸包に一致する。面積は座標の(p+q)倍により(p+q)²倍となるため最後の換算で元の面積になる。","sourceRevisionIds":["source-abc478-g-problem-aeba07c33615b14b7c8163fb621fd5cf36b440d9a6721cee9144dbc3ef80f67d","source-abc478-editorial-26504-d7397a35197892da6c236aa4b0081aaaab17fd84c7c7aefb891c0a70d9318c2c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

## 考察

全てのi<jについて内分点を作ると O(N²) 個になる。欲しいのは面積なので、内部点を保存せず凸包だけを扱いたい。ただし係数がi側にq、j側にpと非対称で、元の点集合を勝手に並べ替えることはできない。

添字区間を左右へ分割する。左右をまたぐペアならi<jは自動的に満たされ、(p+q)倍した内分点はqP_i+pP_jになる。この点集合の凸包はq conv(左点集合)+p conv(右点集合)というMinkowski和である。凸包と正の拡大・Minkowski和が交換することを使う。

二つの凸多角形のMinkowski和は、循環する辺ベクトルを偏角順でmergeして求める。同じ方向の辺はまとめるので、頂点数は左右の凸包サイズの和以下。一点の包は平行移動、線分の包は往復二辺として扱うか、退化ケースを分ける。

各分割でこの交差ペア凸包の頂点を候補配列へ追加し、左右でも同様に再帰する。各ペアは二つの添字が初めて別の子へ分かれる唯一の分割に所属する。最終的に候補全部の凸包を一度取れば、全内分点の凸包になる。この実装は途中で内分点包を再帰的にmergeせず、各深さで候補総数が O(N) であることだけを使うため、合計 O(N log N) 個を保存する。

元点の凸包を各分割でsortから作っても、深さを合計した時間は O(N log²N)。候補の最後のsortも O(N log²N) に収まる。整数座標のままshoelaceで二倍面積を求め、最後に2(p+q)²で割る。

## 典型の発動条件

ペア全体を添字の分割統治で直積へ切り、凸包のMinkowski和で二次個数の点を境界だけへ圧縮する。

## 問題固有の要素

順序条件i<jを守る分割が不可欠。候補を全深さ分集めることで、途中の内分点包の頂点数に関する強い補題を不要にする。

## 正当性

左右をまたぐ全ペアの凸包は、凸結合の展開により左右の凸包のMinkowski和と一致する。その頂点へ置き換えても全体の凸包は変わらない。各i<jは唯一の分割で処理されるので候補凸包が全ペア凸包に一致する。面積は座標の(p+q)倍により(p+q)²倍となるため最後の換算で元の面積になる。

## 実装上の注意

重複点・一直線・一点の凸包を扱う。座標は最大約2×10^8、crossの和は64 bit境界を越え得るので128 bit整数を使う。入力添字順を維持する。

## 復習の核

全ペアの集約で、添字条件を分割して直積を作れるか、求める量が内部点を捨てても変わらないか考える。

## 計算量と制約

### 時間

各深さの凸包生成と最後の候補凸包を合わせ O(N log²N)。

### 空間

候補 O(N log N)、再帰中の元点と一時包 O(N)、stack O(log N)。

### 制約との対応

Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; 1 \leq p \lt q \leq 10; |X_i|\leq 10^7; |Y_i|\leq 10^7; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc478/tasks/abc478_g)
- [公式解説](https://atcoder.jp/contests/abc478/editorial/26504)
