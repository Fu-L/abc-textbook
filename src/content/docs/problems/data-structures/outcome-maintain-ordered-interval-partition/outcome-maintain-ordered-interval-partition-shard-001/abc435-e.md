---
title: "ABC435-E — Cover query"
draft: true
authoringUnit: {"problemId":"abc435-e","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-interval-partition/outcome-maintain-ordered-interval-partition-shard-001/abc435-e.md","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress","unit-ordered-set-multiset"],"excludedTopics":["端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-interval-partition","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc435-e-problem-5227c9034b5752c55f7b3016adf5e19e52c5bdec91124387880c04a2700827b5","source-abc435-editorial-14733-0e61d37e3106540e780b0121efa0e3e48e9aa8db6e9351b0421ca9ff3fd6bc2b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"白集合が互いに素な極大閉区間の和で、totalがその長さの総和であることを不変条件とする。初期[1,N]はこれを満たす。左端L以上の最初の区間と、右端がL以上である場合だけ選ぶその直前から探索すると、Lより前に始まる交差区間を落とさず、非交差の古い区間は飛ばせる。以後の左端l≤Rの区間は、順序と非交差性から全て質問へ交差する。l>Rになればその後も交差しないので停止してよい。\n\n各訪問区間の交差部分[min(r,R)−max(l,L)+1]だけをtotalから除き、左右の非交差部分だけを保存するため、更新後の白集合は元の白集合から[L,R]を除いたものに正確に一致する。削除しか行わないので残る区間同士が新たにつながることはなく、極大性も保つ。生成した残区間を走査後に入れれば各旧区間を一度だけ処理する。全訪問で旧区間をeraseし、一質問の新規生成は高々二個なので全erase数≤1+2Qとなり、記載の償却計算量もこの実行手順から従う。","sourceRevisionIds":["source-abc435-e-problem-5227c9034b5752c55f7b3016adf5e19e52c5bdec91124387880c04a2700827b5","source-abc435-editorial-14733-0e61d37e3106540e780b0121efa0e3e48e9aa8db6e9351b0421ca9ff3fd6bc2b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

白マスだけを互いに素な極大閉区間[l,r]として持ち、左端lの昇順にordered setへ保存する。初めは[1,N]だけ、白マス数total=Nである。黒くする[L,R]に交差する区間を消し、左のはみ出し[l,L−1]と右のはみ出し[R+1,r]だけを残せば元の操作を表せる。

交差候補の探索を具体化する。it=lower_bound((L,−∞))で左端がL以上の最初の区間を求める。その直前の区間が存在し右端r≥Lなら、itをその直前へ戻す。区間は互いに素なので、左端がLより小さくLへかかる区間は直前の高々一個だけである。左端順のlower_boundへ、右端の条件r≥Lをそのまま渡してはいけない。

itが末尾でなく左端l≤Rである間、その区間は[L,R]と交差する。totalからmin(r,R)−max(l,L)+1を引く。l<Lなら[l,L−1]、R<rなら[R+1,r]を残す候補として保存し、現在区間をeraseして次のiteratorへ進む。残す区間は走査が終わってからinsertすれば、新しい区間を同じ質問で再処理せずに済む。最後にtotalを出力する。

[L,R]内に白区間がない場合は何も変わらない。L=Rの一点、端点だけの交差、全域削除、同じ範囲の再削除、左端がLより前の一区間を二分する場合も同じ規則で扱える。例えば[1,10]に[4,6]を作用させると、lower_boundだけでは末尾だが直前[1,10]を選び、[1,3],[7,10]と白数7を得る。

一質問が多くの区間を消すことはあるが、残せるのは境界をまたぐ高々二区間だけである。初期一区間と全Q質問の生成高々2Q区間を数えると、eraseされる区間の総数は高々1+2Q。各set操作O(log(Q+1))で、全体O(Q log(Q+1))に償却できる。巨大なNの各マスを持つ候補や、同じ黒マスまで毎回走査する候補は不要である。

## 典型の発動条件

### 互いに素な区間の ordered set

発動条件: 単調に削除される一次元集合へ範囲削除を行い、残存長を求めるとき。

白い連続成分だけを保持し、交差成分の split/erase に限定する。

### 削除の償却解析

発動条件: 一回の更新で多数の区間を消すが、新しい区間の生成数が定数のとき。

各消滅区間を過去の初期・生成イベントへ課金して総反復数を O(Q) にする。

## 問題固有の要素

単調な塗りつぶしでは既に消えた点を再訪せず、現在の連続成分単位で処理するのが本質である。

別の問題へ持ち帰る視点: 範囲更新で大量 erase が起きても、split による要素増加が小さければ ordered set 走査を償却できる。

## 正当性

白集合が互いに素な極大閉区間の和で、totalがその長さの総和であることを不変条件とする。初期[1,N]はこれを満たす。左端L以上の最初の区間と、右端がL以上である場合だけ選ぶその直前から探索すると、Lより前に始まる交差区間を落とさず、非交差の古い区間は飛ばせる。以後の左端l≤Rの区間は、順序と非交差性から全て質問へ交差する。l>Rになればその後も交差しないので停止してよい。

各訪問区間の交差部分[min(r,R)−max(l,L)+1]だけをtotalから除き、左右の非交差部分だけを保存するため、更新後の白集合は元の白集合から[L,R]を除いたものに正確に一致する。削除しか行わないので残る区間同士が新たにつながることはなく、極大性も保つ。生成した残区間を走査後に入れれば各旧区間を一度だけ処理する。全訪問で旧区間をeraseし、一質問の新規生成は高々二個なので全erase数≤1+2Qとなり、記載の償却計算量もこの実行手順から従う。

## 実装上の注意

- 左端順setならlower_boundで得たiteratorの直前も調べ、その右端がL以上のときだけ戻す。beginや空集合の場合には直前を取らない。
- eraseが返す次iteratorを使うか、削除前に次iteratorを保存する。残す左右区間のinsertは走査完了後に行う。
- 元のマス区間は閉区間なので長さr−l+1。左右の残区間は[l,L−1],[R+1,r]で、空区間を入れない。
- Nと白数は64 bit整数で管理する。区間数はO(Q)で、Nの大きさには依らない。

## 復習の核

- [L,R] と交差する最初の区間を取り逃さず、各交差長を一度だけ total から引いているかを確認する。

## 計算量と制約

### 時間

全Q質問で償却O(Q log Q)。

### 空間

O(Q)、白極大区間。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 10^9; 1\leq Q\leq 2\times 10^5; 1\leq L_i\leq R_i\leq N; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/tasks/abc435_e) — source-abc435-e-problem-5227c9034b5752c55f7b3016adf5e19e52c5bdec91124387880c04a2700827b5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc435/editorial/14733) — source-abc435-editorial-14733-0e61d37e3106540e780b0121efa0e3e48e9aa8db6e9351b0421ca9ff3fd6bc2b
