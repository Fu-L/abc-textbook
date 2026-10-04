---
title: "ABC344-G — Points and Comparison"
draft: true
authoringUnit: {"problemId":"abc344-g","docPath":"src/content/docs/problems/hybrid/outcome-maintain-order-through-crossing-events/outcome-maintain-order-through-crossing-events-shard-001/abc344-g.md","learningOutcomeIds":["outcome-maintain-order-through-crossing-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep"],"excludedTopics":["kinetic sorting・交差event順序更新の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-kinetic-order-maintenance","tag-event-sweep"],"sourceRevisionIds":["source-abc344-editorial-9491-1b4a4b6aad92d2f681c081c3b4ff810904462a03e22b918e8b6d8d2eadcc55fd","source-abc344-g-problem-d809ded0a0e2df95e9eb3d8af3f604d216fa6b1928af47694c116afc97a46ef3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"score昇順で隣接するX_i<X_jの二者は、交点h=(Y_j−Y_i)/(X_j−X_i)で順序が一度だけ逆転する。連続性から次の順位変化はどこかの隣接pairで起こるので、全ての現在隣接pairの将来交点をheapに持てば最初の変化を漏らさない。隣接性を失った古いentryは無効化し、有効swap後に変わった隣接pairを登録すると同じ不変条件を保つ。\n\n同じ交点でも新しい隣接逆転を再登録し、X降順の同値blockになるまで処理する。各swapはその二者のX順を昇順から降順へ一度だけ変え、parameterがさらに増えても戻らないので、全swap数はC(N,2)以下である。query A以下の全有効交点を処理した後はscoreが昇順で、Aと等しい交点でのswapは等値要素の順しか変えない。lower_bound(B)のsuffix個数が正確にscore≥B、すなわちY_i≥A X_i+Bを満たす点数となる。","sourceRevisionIds":["source-abc344-editorial-9491-1b4a4b6aad92d2f681c081c3b4ff810904462a03e22b918e8b6d8d2eadcc55fd","source-abc344-g-problem-d809ded0a0e2df95e9eb3d8af3f604d216fa6b1928af47694c116afc97a46ef3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

heapのentryを(交点h,左ID i,右ID j)として、orderとposの両方を持つ。score昇順でi,jが隣接しX_i<X_jのときだけ、h=(Y_j−Y_i)/(X_j−X_i)を登録する。pop時にもpos[j]=pos[i]+1かつX_i<X_jを確認し、既に隣接でない古いentryは捨てる。有効entryならその二者をswapし、posを更新し、変わった隣接pairの交点を再登録する。

現在処理中の交点がcなら、新しい隣接pairの交点h=cも登録する。h>cだけにすると多点同時交差を取り落とす。例えば点(0,0),(1,0),(2,0)はc=0直前の順[0,1,2]から直後の順[2,1,0]になる。一回のswap後にも同じcの新隣接逆転が生じるため、heap最小の有効交点がquery Aより大きくなるまで処理を続ける。

この方式では任意順に二者を一回ずつ交換して終えるのではなく、同じcでX_i<X_jとなる隣接逆転が全てなくなるまで新eventを加える。同値scoreのblock内でX降順になるまでの隣接反転なので有限回で終わる。queryが交点と一致しても、直後順はその時点の同値scoreの並べ替えにすぎず、score≥Bの個数を変えない。

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

score昇順で隣接するX_i<X_jの二者は、交点h=(Y_j−Y_i)/(X_j−X_i)で順序が一度だけ逆転する。連続性から次の順位変化はどこかの隣接pairで起こるので、全ての現在隣接pairの将来交点をheapに持てば最初の変化を漏らさない。隣接性を失った古いentryは無効化し、有効swap後に変わった隣接pairを登録すると同じ不変条件を保つ。

同じ交点でも新しい隣接逆転を再登録し、X降順の同値blockになるまで処理する。各swapはその二者のX順を昇順から降順へ一度だけ変え、parameterがさらに増えても戻らないので、全swap数はC(N,2)以下である。query A以下の全有効交点を処理した後はscoreが昇順で、Aと等しい交点でのswapは等値要素の順しか変えない。lower_bound(B)のsuffix個数が正確にscore≥B、すなわちY_i≥A X_i+Bを満たす点数となる。

## 実装上の注意

- score=Y−AXの昇順を保持する。A直後のtieはX降順、Xも同じならY順で不変である。初期は(X,Y)辞書順。
- pop時の両IDの現在隣接性・向きを検査する。同時交差で新隣接pairの交点が現在cと等しい場合も登録して、そのcの残る逆転を処理する。
- 有理数の分母X_j−X_iは正にし、heap内の比較は交差積で行う。scoreと交差積は128bitで評価する。

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
