---
title: "ABC306-F — Merge Sets"
draft: true
headingAliases: {"式変形によるpair-contribution化":"典型の発動条件","fenwick-treeのoffline走査":"典型の発動条件"}
authoringUnit: {"problemId":"abc306-f","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-002/abc306-f.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering","tag-coordinate-compression","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc306-f-problem-63fe6d6c7ae0bf5d4e0b393df64ed190600bfaf0159f4d78ea5e158e1c75a3c8","source-abc306-editorial-6601-7f08b56f50b5a14b21a2e311a92a05e3f3dcea5339f6c4fe18fd5dc598b9117e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各順位は、自集合内の順位と、相手集合のそれより小さい要素数の和に厳密に分かれる。自集合内の順位和を全組について足した値が基礎分である。\n\n後ろからの走査では、集合 $$S_i$$ の問い合わせ時に、木は $$i$$ より大きい集合番号の要素だけを保持する。prefix和は、その中で値が小さいものを漏れなく一度ずつ数える。よって各問い合わせは、分解式の対応する項と一致する。全要素について加え、基礎分を戻すことで、求める全順位和が得られる。","sourceRevisionIds":["source-abc306-f-problem-63fe6d6c7ae0bf5d4e0b393df64ed190600bfaf0159f4d78ea5e158e1c75a3c8","source-abc306-editorial-6601-7f08b56f50b5a14b21a2e311a92a05e3f3dcea5339f6c4fe18fd5dc598b9117e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

先に読む単元:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

この解説で扱わないこと:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

集合を二つずつ併合して順位を調べる代わりに、一つの要素の順位を「同じ集合の要素」と「相手の集合の要素」へ分ける。前者は常に一定で、後者は集合番号と値の大小を満たすペア数になる。

### 順位を、前にいる要素の個数へ戻す

各集合は $$M$$ 要素を持ち、すべての値は相異なる。集合 $$S_i$$ の要素 $$x$$ は、$$S_i\cup S_j$$ を昇順に並べたとき、

$$
1+|\{y\in S_i:y<x\}|+|\{y\in S_j:y<x\}|
$$

番目になる。順位という一見全体に依存する量も、要素との大小比較の和である。

例えば $$S_i=\{2,8\},S_j=\{1,5\}$$ なら、2の順位は $$1+0+1=2$$、8の順位は $$1+1+2=4$$。和6は、同じ集合から来る基礎分 $$1+2=3$$ と、相手の小さい要素とのペア数3に分かれる。

一般に同じ集合の順位は、集合を昇順に見れば $$1,2,\ldots,M$$。どの集合の組でも基礎分は $$M(M+1)/2$$ になる。集合の組は $$N(N-1)/2$$ 個なので、この部分はまとめて計算できる。

残るのは

$$
\sum_{i=1}^{N}\ \sum_{x\in S_i}
|\{y\in S_{i+1}\cup\cdots\cup S_N:y<x\}|
$$

である。要素 $$x$$ ごとに、自分より後ろの集合にある小さい値を数えればよい。集合の組を明示的に作る必要がなくなった。

### 集合番号を処理順にし、値だけを数える

条件は「集合番号が大きい」と「値が小さい」の二つある。一方を走査順で満たせば、もう一方だけをデータ構造へ任せられる。

$$i=N,N-1,\ldots,1$$ の順に処理し、Fenwick Treeへ、これまで処理した集合の値の出現個数を入れる。集合 $$S_i$$ の処理直前には、ちょうど $$S_{i+1}\cup\cdots\cup S_N$$ が登録されている。

値域は $$10^9$$ まであるため、全 $$L=NM$$ 要素を昇順に並べ、0始まりの順位へ座標圧縮する。順位 $$r$$ の要素より小さい登録要素数は、Fenwick Treeの半開区間 $$[0,r)$$ の和で求められる。

一つの集合では、まず全要素を問い合わせて答えに加え、その後で全要素を登録する。これにより、同じ集合内の小さい値を誤って数えない。

先ほどの二集合なら、先に $$\{1,5\}$$ を登録する。2への問い合わせは1、8への問い合わせは2を返す。基礎分3へ足して6になる。集合の内部をソートしなくても、全問い合わせを先に行えば正しく数えられる。

最後に、基礎分と全問い合わせ結果の総和を足して出力する。

## 典型の発動条件

### 順位を、大小関係の寄与へ分解する

併合後の順位や挿入位置を大量に求めるとき、「自分以下の要素数」や「自分より前へ入る要素数」に戻す。対象の由来ごとに分ければ、一定の部分と、対象間の比較だけが残る場合がある。

本問では自集合内の順位和が一定なので、その部分を先に取り除けた。値が重複する設定では、同値をどの順に置くかで順位の定義が変わり得る。厳密な大小と同値の扱いを、元の定義へ合わせる必要がある。

### 二条件のペア数を、走査と累積頻度へ分担する

$$i<j$$ かつ値の大小を満たすペアは、添字を一方向に走査し、既に見た値の分布をFenwick Treeなどへ保存して数えられる。走査が一つの条件を保証し、prefix和がもう一つを判定する。

まとめて処理すべき対象がある場合は、同じ対象内の寄与を混ぜないことも重要である。本問の集合のように、同じ時刻・同じグループからの影響を禁じるときは、問い合わせ段階と登録段階を分ける。この順序がモデル上の条件を実装へ落としたものになる。

## 問題固有の要素

$$f(S_i,S_j)$$ が、併合後の前者の順位だけを足す非対称な関数である。従って対象は「後ろの集合にある、自分より小さい値」であり、逆向きのペアまで足さない。小さな二集合を実際に併合すると、この向きを確認できる。

## 正当性

各順位は、自集合内の順位と、相手集合のそれより小さい要素数の和に厳密に分かれる。自集合内の順位和を全組について足した値が基礎分である。

後ろからの走査では、集合 $$S_i$$ の問い合わせ時に、木は $$i$$ より大きい集合番号の要素だけを保持する。prefix和は、その中で値が小さいものを漏れなく一度ずつ数える。よって各問い合わせは、分解式の対応する項と一致する。全要素について加え、基礎分を戻すことで、求める全順位和が得られる。

## 実装上の注意

- 集合ごとに「全問い合わせ→全登録」を守る。一要素ずつ問い合わせ直後に登録すると、自集合のペアが混ざる。
- 圧縮順位を0始まりにする場合、小さい値の範囲は $$[0,r)$$。自分自身の順位まで含めない。
- 答えと基礎分の積は64bit整数で計算する。積を作ってから64bitへ代入するのでは遅い。
- $$N=1$$ なら集合の組がなく、基礎分・問い合わせの寄与とも0になる。

## 復習の核

- 順位の和は、各要素の前に入る対象の個数へ戻す。
- 二つの大小条件の一方を処理順で保証し、残りを累積頻度で数える。
- 同じグループの影響を除く必要があるなら、問い合わせと登録を二段階にする。

## 計算量と制約

### 時間

$$L=NM$$ とする。全値の座標圧縮に $$O(L\log L)$$、各要素の問い合わせと登録に合計 $$O(L\log L)$$。入力と基礎分の処理も含め、全体は $$O(NM\log(NM))$$ である。

### 空間

入力の各集合、圧縮用配列、Fenwick Treeを合わせて $$O(NM)$$。集合の全組を保存しない。

### 制約との対応

$$NM\leq10^6$$ なので、値全体の整列と対数時間の頻度操作で処理できる。答えは各組の $$M$$ 要素の順位が高々 $$2M$$ であることから $$O(N^2M^2)$$、最大でも $$10^{12}$$ 程度であり、64bit整数に収まる。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/tasks/abc306_f) — source-abc306-f-problem-63fe6d6c7ae0bf5d4e0b393df64ed190600bfaf0159f4d78ea5e158e1c75a3c8
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc306/editorial/6601) — source-abc306-editorial-6601-7f08b56f50b5a14b21a2e311a92a05e3f3dcea5339f6c4fe18fd5dc598b9117e
