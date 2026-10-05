---
title: "ABC421-F — Erase between X and Y"
draft: true
authoringUnit: {"problemId":"abc421-f","docPath":"src/content/docs/problems/data-structures/outcome-maintain-local-sequence-links/outcome-maintain-local-sequence-links-shard-001/abc421-f.md","learningOutcomeIds":["outcome-maintain-local-sequence-links"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-amortized-monotone-progress"],"excludedTopics":["全候補の大小順や区間集約を保つ平衡木・heap。"],"tagIds":["tag-linked-list-index","tag-amortized-monotone-progress"],"sourceRevisionIds":["source-abc421-editorial-13787-433e8d0a684c462cc1e7cceabc14552e13947bbf5910cabd3c98196fd12e0564","source-abc421-f-problem-0ab28e8057b1b056ea75492696f2deba87c12925e65a0fb80b14697fe8aea8b9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"type 1はold=next[x]を保存してnext[x]=i,next[i]=oldとするだけで、配列上の位置を持つ必要がない。 type 2で削除される中間node数をkとすると、勝つ探索はk+1歩、反対側も高々k+1歩で止まる。Σkは追加総数以下なので、queryごとの定数項を加えて総歩数O(Q)となる。 数値x<yから列内順序は分からないが、両探索を同速にすれば正しい向きが端点間距離で到達し、他方もそれ以上進まない。走査量を削除node数へ償却して全体O(Q)にできる。","sourceRevisionIds":["source-abc421-editorial-13787-433e8d0a684c462cc1e7cceabc14552e13947bbf5910cabd3c98196fd12e0564","source-abc421-f-problem-0ab28e8057b1b056ea75492696f2deba87c12925e65a0fb80b14697fe8aea8b9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [要素索引と連結リストで局所linkを更新する](src/content/docs/learn/query/linked-list-index.md)

- 要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。

先に読む単元:

- [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md) — 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑える。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 全候補の大小順や区間集約を保つ平衡木・heap。

## 考察

挿入される値iは一意で既存値xの直後に置かれるため、現在列は値をnode IDとするnext配列だけで表せる。区間削除も、先に現れる端点から後の端点までnextを辿って一本のlinkを張り替えればよい。

採用する候補: x側とy側からnextを交互に進め、到達した向きの中間nodeだけを集計・spliceする

棄却する候補: 各queryで先頭0からx,yの位置を探す

端点間が短くても長いprefixを毎回走査し、削除されないnodeをΘ(Q²)回通る入力を作れる。

棄却する候補: 平衡二分木で列順と区間和を管理する

O(Q log Q)では解ける可能性があるが、操作が一意値の直後挿入と永久削除に限られるため、next配列と償却解析だけでより単純な線形解法が得られる。

next[0]=-1から始め、挿入は二本のnextを更新する。削除queryではcurX=x,curY=yと二つの一時和を持ち、両側を一歩ずつ進める。curXがyへ届けばx側の和を出してnext[x]=y、curYがxへ届けばy側の和を出してnext[y]=xとし、中間nodeを列から切り離す。

## 典型の発動条件

### 配列による連結リスト

発動条件: 要素IDが小さい整数で一意であり、既知node直後への挿入と連続区間のspliceだけを行う。

値そのものをindexとしてnextを持ち、挿入と区間切断をlink更新だけで表す。

### 削除への償却解析

発動条件: 一回の操作は長く走査し得るが、走査対象の主要部分が直後に永久削除される。

両向き探索の歩数を削除node数の定数倍へ抑え、全queryの総和を線形にする。

## 問題固有の要素

x<yは値の大小にすぎず列順を教えないが、nextしか持たなくても両端から交互に探索すれば、余計なprevや順序data structureなしで先行端点を特定できる。

別の問題へ持ち帰る視点: 一方向構造で二点の順序が未知なら、両候補を同じ速度で進め、正しい側の到達距離に反対側の仕事量も拘束できるかを調べる。

## 正当性

type 1はold=next[x]を保存してnext[x]=i,next[i]=oldとするだけで、配列上の位置を持つ必要がない。 type 2で削除される中間node数をkとすると、勝つ探索はk+1歩、反対側も高々k+1歩で止まる。Σkは追加総数以下なので、queryごとの定数項を加えて総歩数O(Q)となる。 数値x<yから列内順序は分からないが、両探索を同速にすれば正しい向きが端点間距離で到達し、他方もそれ以上進まない。走査量を削除node数へ償却して全体O(Q)にできる。

## 実装上の注意

- 端点自身は和へ加えず、nextが相手に到達した時点でその向きだけを採用する。末尾-1へ達した側はそれ以上進めず、勝つ側の探索を続ける。切り離したnodeの古いnextは残っても、以後query端点にならない保証を利用できる。

## 復習の核

- 標準vectorで小さい列を愚直更新する実装と比較し、端点が隣接する空区間、逆順端点、片側が先に末尾へ着く場合、長区間削除後の挿入、削除和が64 bitになる場合を確認する。

## 計算量と制約

### 時間

総O(Q)、一回の削除探索O(k+1)を削除node数へ償却。

### 空間

O(Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq Q \leq 5\times 10^5; For the i-th query: If it is a type 1 query: 0\leq x < i A contains x immediately before processing the query. If it is a type 2 query: 0\leq x < y < i A contains both x and y immediately before processing the query.; If it is a type 1 query: 0\leq x < i A contains x immediately before processing the query.; 0\leq x < i; A contains x immediately before processing the query.; If it is a type 2 query: 0\leq x < y < i A contains both x and y immediately before processing the query.; 0\leq x < y < i; A contains both x and y immediately before processing the query.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc421/editorial/13787) — source-abc421-editorial-13787-433e8d0a684c462cc1e7cceabc14552e13947bbf5910cabd3c98196fd12e0564
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc421/tasks/abc421_f) — source-abc421-f-problem-0ab28e8057b1b056ea75492696f2deba87c12925e65a0fb80b14697fe8aea8b9
