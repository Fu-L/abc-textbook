---
title: "ABC398-G — Not Only Tree Game"
draft: true
authoringUnit: {"problemId":"abc398-g","docPath":"src/content/docs/problems/hybrid/outcome-solve-game-by-parity-invariant/outcome-solve-game-by-parity-invariant-shard-001/abc398-g.md","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。"],"tagIds":["tag-bipartite-structure","tag-game-parity-invariant"],"sourceRevisionIds":["source-abc398-editorial-12480-8003d1b46f2ff6c39f41ce5531a9f0c5e3fbac8643c13eb674fb68d9b50bea86","source-abc398-g-problem-c9d2f0a8e8b595fd43c0a9850a40dfb21e3ed14ea05848869b4786b802cf3e4d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"まず二成分の結合による変化を計算する。サイズ(a,b),(c,d)を同じ向きで合わせると新たな成分内の候補辺はad+bc本、反転して合わせるとac+bd本。うち一本を今置くのでxの増加はそれぞれad+bc−1、ac+bd−1。成分内への追加ではxが1減る。どの手もMの偶奇、従ってp=oo+xの偶奇を反転する。\n\nEO同士を結ぶと、向きによりEE（xの増分は奇数）またはOO（増分は偶数）になる。EOとIも、Iをどちらの部へ入れるかでEE（増分奇数）またはOO（増分偶数）を選べる。両部が非空のEOではどちらの結び方も合法である。I同士はOOになりxは増えない。EE/OO同士の結合ではeo=0を保ってxの偶奇が反転し、EE/OOとIの結合はeo=1を作る。\n\nN奇数の判定は、終局の辺数が必ず偶数であることから従う。以下はN偶数。辺は増えるだけで有限なので、残りの追加可能手数について帰納して、負け局面からは全て勝ち局面へ移り、勝ち局面には負け局面へ移す手があることを示す。\n\n- eo=0。q=iso/2+xが奇数なら、x>0では成分内へ一本置き、そうでなければiso≥2なので孤立点を二つ結ぶ。どちらもeo=0,q偶数へ送れる。q偶数から、成分内追加・I同士・EE/OO同士の結合は全てeo=0,q奇数へ移る。残るIと非孤立成分の結合はeo=1へ移る。終局はeo=iso=x=0でq偶数である。\n- eo=1。eo+iso偶数よりisoは奇数で少なくとも1。EOを孤立点と結び、EEかOOの向きを選ぶ。eo=0になり、二通りのxの増分の偶奇が異なるので、(iso−1)/2+x'を偶数にできる。上の負け局面へ一手で送れる。\n- eo=2。二つのEOを結べばeo=0になる。EEかOOを選ぶ二通りでx'の偶奇が異なるので、iso/2+x'偶数へ送れる。\n- eo≥3。p偶数からeo≥3に留まる手はp奇数へ移る。一手でeoは高々2減るため、境界を越えてもeo=1か2で、既に示した勝ち局面となる。一方p奇数ならx>0またはoo>0。x>0なら成分内追加、そうでなければOOを一つEOへ結ぶ。後者はEOのままでeo個数を保ち、ooを1減らしてxの偶奇を変えない。どちらもeo≥3,p偶数の負け局面へ送れる。\n\n以上が全合法手を覆う。例えばeo=1でIが一つある場合、EOへ加えるIの向きでx'の偶奇を選べる。eo=3からeo=1,2へ減らす手は相手に勝ち局面を渡すため、p奇数の側は上の境界を越えない手を使う。分類を再掲するだけでなく、この応答可能性が勝敗の根拠となる。","sourceRevisionIds":["source-abc398-editorial-12480-8003d1b46f2ff6c39f41ce5531a9f0c5e3fbac8643c13eb674fb68d9b50bea86","source-abc398-g-problem-c9d2f0a8e8b595fd43c0a9850a40dfb21e3ed14ea05848869b4786b802cf3e4d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [偶奇不変量からゲームの勝敗を決める](src/content/docs/learn/modeling/game-parity-invariant.md)

- 合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。
- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。

## 考察

奇閉路を作らないので各成分は二部グラフ。成分内では彩色が固定されるが、別成分を初めて結ぶときは片方を反転できる。この向きの自由度が最終辺数の偶奇を変えるため、初期の二部集合全体を一度足すだけでは勝敗を決められない。

一手ごとに辺が一つ増え、終局は完全二部グラフになる。成分cの二部サイズを(a_c,b_c)、辺数をm_cとし、成分を変えず追加できる辺数をx=Σ_c(a_cb_c−m_c)とする。成分の型をEE（両方偶数）、OO（両方奇数）、EO（偶奇、孤立点を除く）、I（孤立点）に分け、個数をee,oo,eo,isoとする。EOは三頂点以上で両側非空、Iは(1,0)なので、向きの選択が実際に可能かどうかを区別する。

現在の辺数MはM≡oo+x (mod2)。Nが奇数なら終局の二部サイズは偶奇なので辺数が偶数になり、どの戦略でも残り手数の偶奇はMと等しい。従ってoo+xが奇数なら先手勝ち。

Nが偶数では、eo+isoは偶数である。以下の正当性で負け局面を構成すると、判定はeo=0ならiso/2+xの偶奇、eo=1,2なら常に先手勝ち、eo≥3ならoo+xの偶奇となる。ここでいう先手はAoki。二部分彩色と成分集計のO(N+M)で判定でき、巨大な辺追加game treeを探索する必要はない。

## 典型の発動条件

### game stateのparity invariant

発動条件: 毎手edgeが一つ増え、terminal graphのedge parityが少数特徴量で決まるとき。

勝敗を残手数parityへ落とす。

### bipartite component type classification

発動条件: component mergeで彩色反転自由度があり、part size parityだけが重要なとき。

(even,even),(odd,odd),(even,odd),isolatedへ分類する。

## 問題固有の要素

disconnectedでは二部分彩色がcomponentごとに反転可能なので、単純な全体part積でなく、merge後parityを操作できるeo/isolated componentがgameの戦略自由度になる。

別の問題へ持ち帰る視点: component merge gameでは、各componentのorientation自由度と、mergeで変わるsize parity classを抽象stateにする。

## 正当性

まず二成分の結合による変化を計算する。サイズ(a,b),(c,d)を同じ向きで合わせると新たな成分内の候補辺はad+bc本、反転して合わせるとac+bd本。うち一本を今置くのでxの増加はそれぞれad+bc−1、ac+bd−1。成分内への追加ではxが1減る。どの手もMの偶奇、従ってp=oo+xの偶奇を反転する。

EO同士を結ぶと、向きによりEE（xの増分は奇数）またはOO（増分は偶数）になる。EOとIも、Iをどちらの部へ入れるかでEE（増分奇数）またはOO（増分偶数）を選べる。両部が非空のEOではどちらの結び方も合法である。I同士はOOになりxは増えない。EE/OO同士の結合ではeo=0を保ってxの偶奇が反転し、EE/OOとIの結合はeo=1を作る。

N奇数の判定は、終局の辺数が必ず偶数であることから従う。以下はN偶数。辺は増えるだけで有限なので、残りの追加可能手数について帰納して、負け局面からは全て勝ち局面へ移り、勝ち局面には負け局面へ移す手があることを示す。

- eo=0。q=iso/2+xが奇数なら、x>0では成分内へ一本置き、そうでなければiso≥2なので孤立点を二つ結ぶ。どちらもeo=0,q偶数へ送れる。q偶数から、成分内追加・I同士・EE/OO同士の結合は全てeo=0,q奇数へ移る。残るIと非孤立成分の結合はeo=1へ移る。終局はeo=iso=x=0でq偶数である。
- eo=1。eo+iso偶数よりisoは奇数で少なくとも1。EOを孤立点と結び、EEかOOの向きを選ぶ。eo=0になり、二通りのxの増分の偶奇が異なるので、(iso−1)/2+x'を偶数にできる。上の負け局面へ一手で送れる。
- eo=2。二つのEOを結べばeo=0になる。EEかOOを選ぶ二通りでx'の偶奇が異なるので、iso/2+x'偶数へ送れる。
- eo≥3。p偶数からeo≥3に留まる手はp奇数へ移る。一手でeoは高々2減るため、境界を越えてもeo=1か2で、既に示した勝ち局面となる。一方p奇数ならx>0またはoo>0。x>0なら成分内追加、そうでなければOOを一つEOへ結ぶ。後者はEOのままでeo個数を保ち、ooを1減らしてxの偶奇を変えない。どちらもeo≥3,p偶数の負け局面へ送れる。

以上が全合法手を覆う。例えばeo=1でIが一つある場合、EOへ加えるIの向きでx'の偶奇を選べる。eo=3からeo=1,2へ減らす手は相手に勝ち局面を渡すため、p奇数の側は上の境界を越えない手を使う。分類を再掲するだけでなく、この応答可能性が勝敗の根拠となる。

## 実装上の注意

- I（孤立点）はEOへ混ぜない。EOでは両部が非空で向きを選べることが戦略の根拠。
- x=Σ a_cb_c−Mは64 bitで集計する。各成分の辺数は次数和の半分。
- N偶数,eo=0ではisoが偶数。条件分岐はeo=0、1/2、3以上の順に分ける。
- 先手の名前はAoki、後手はTakahashi。

## 復習の核

- 辺数の偶奇という観察を、終局の形と全合法手の変化へ結び付ける。
- 成分結合ゲームでは、彩色を反転できる向きと実際に選べる接続を区別する。
- 勝敗分類の証明には「負けから全手が勝ちへ」「勝ちから負けへの一手」の両方が必要。

## 計算量と制約

### 時間

O(N+M)、成分二色塗りと五集約量。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq M \leq 2\times 10^5; 1 \leq U_i < V_i \leq N; The given graph does not contain an odd cycle.; The given graph does not contain multi-edges.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/editorial/12480) — source-abc398-editorial-12480-8003d1b46f2ff6c39f41ce5531a9f0c5e3fbac8643c13eb674fb68d9b50bea86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/tasks/abc398_g) — source-abc398-g-problem-c9d2f0a8e8b595fd43c0a9850a40dfb21e3ed14ea05848869b4786b802cf3e4d
