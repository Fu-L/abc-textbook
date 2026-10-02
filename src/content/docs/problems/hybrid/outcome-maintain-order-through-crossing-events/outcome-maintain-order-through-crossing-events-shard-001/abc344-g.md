---
title: "ABC344-G — Points and Comparison"
draft: true
authoringUnit: {"problemId":"abc344-g","docPath":"src/content/docs/problems/hybrid/outcome-maintain-order-through-crossing-events/outcome-maintain-order-through-crossing-events-shard-001/abc344-g.md","learningOutcomeIds":["outcome-maintain-order-through-crossing-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-kinetic-order-maintenance","tag-event-sweep"],"sourceRevisionIds":["source-abc344-editorial-9491-1b4a4b6aad92d2f681c081c3b4ff810904462a03e22b918e8b6d8d2eadcc55fd","source-abc344-g-problem-d809ded0a0e2df95e9eb3d8af3f604d216fa6b1928af47694c116afc97a46ef3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"現在score順で隣接するXの異なる二点は、等値になるrational slopeを越えた時だけswapする。最小の次crossingをpriority queueで処理し、swap後に新しく隣接したpairのeventだけを追加すればsorted orderを連続的に保てる。 全pairの順序反転は高々O(N^2)回で、各queryは現在のsorted score列をbinary searchできる。","sourceRevisionIds":["source-abc344-editorial-9491-1b4a4b6aad92d2f681c081c3b4ff810904462a03e22b918e8b6d8d2eadcc55fd","source-abc344-g-problem-d809ded0a0e2df95e9eb3d8af3f604d216fa6b1928af47694c116afc97a46ef3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [kinetic sorting・交差event順序更新](src/content/docs/learn/modeling/kinetic-order-maintenance.md)

- 隣接要素が入れ替わる有効時刻だけをevent処理し、連続parameterに対する全順序と集計を更新できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

対象外:

- kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

query(A,B)は各点のscore_A(i)=-A X_i+Y_iがB以上かを数える問題である。Aを昇順に処理すれば各scoreはAの一次関数で、二点の順序は両点を結ぶslopeを跨ぐ時に高々一度だけ反転する。

採用する候補: queryをA順にsortし、点score順を隣接swap eventでkineticに維持する

全pairの順序反転は高々O(N^2)回で、各queryは現在のsorted score列をbinary searchできる。

棄却する候補: 各queryでN点のinequalityを直接判定する

Qは10^7でNQは最大5×10^10となり実行できない。

現在score順で隣接するXの異なる二点は、等値になるrational slopeを越えた時だけswapする。最小の次crossingをpriority queueで処理し、swap後に新しく隣接したpairのeventだけを追加すればsorted orderを連続的に保てる。

生成器からQ個の(A,B)を作りA昇順にsortする。点列はA→-∞での順序に対応する(X,Y)辞書順から始め、隣接crossing slopeをexact rational keyのheapへ入れる。各query A前にslope≤Aの有効eventを処理してswap・隣接event更新し、現在順のscore=-AX+Yへlower_boundしてscore≥Bの個数を加算する。

## 典型の発動条件

### kinetic sorting

発動条件: parameter Aの変化に伴いlinear keyのsorted orderが変わり、多数の同parameter queryがある。

隣接要素の次crossingだけをevent queueで管理し、局所swapで全順序を更新する。

### offline query sorting

発動条件: query同士は独立で、parameterを単調順に並べるとdata structure更新を共有できる。

生成した(A,B)をA昇順に処理し、点順序を戻さず進める。

## 問題固有の要素

N本の一次関数のarrangementを全Aで構築せず、query Aへ到達するまでの隣接交差だけ処理すると、順序変更総数をpair数O(N^2)で抑えられる。

別の問題へ持ち帰る視点: moving-order queryは隣接swap eventのkinetic data structureとして扱える。

## 正当性

現在score順で隣接するXの異なる二点は、等値になるrational slopeを越えた時だけswapする。最小の次crossingをpriority queueで処理し、swap後に新しく隣接したpairのeventだけを追加すればsorted orderを連続的に保てる。 全pairの順序反転は高々O(N^2)回で、各queryは現在のsorted score列をbinary searchできる。

## 実装上の注意

scoreはY−AX。A直後の順序を採用するなら同scoreのtieはX降順、Xも同じなら固定indexで安定化する。次eventは現在隣接していて左X<右Xのpairだけへ登録し、同slopeも同じ向きの確認後に一回だけswapする。逆向きへ戻すeventを生成せず、多点の同時crossingが有限回で整列する。scoreとrational cross productは128bitで評価する。

## 復習の核

- X同値でswapしないpair、複数pairが同slopeで交差、同A query、R_a=0をN小の全点sort真値と比較する。

## 計算量と制約

### 時間

O((N²+Q)log(N+Q))、各点pairは高々一crossing、隣接event heap。

### 空間

O(N²+Q)、生成event上界。

### 制約との対応

公式制約の確認範囲: Time limit: 10 sec; Memory limit: 1024 MiB; Constraints: All input values are integers.; 1 \le N \le 5000; 1 \le Q \le 10^7; |X_i|, |Y_i| \le 10^8; The pairs (X_i,Y_i) are distinct.; 0 \le G_0 < (2^{31}-1); 0 \le R_a \le 10^8; 0 \le R_b \le 10^{16}

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc344/editorial/9491) — source-abc344-editorial-9491-1b4a4b6aad92d2f681c081c3b4ff810904462a03e22b918e8b6d8d2eadcc55fd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc344/tasks/abc344_g) — source-abc344-g-problem-d809ded0a0e2df95e9eb3d8af3f604d216fa6b1928af47694c116afc97a46ef3
