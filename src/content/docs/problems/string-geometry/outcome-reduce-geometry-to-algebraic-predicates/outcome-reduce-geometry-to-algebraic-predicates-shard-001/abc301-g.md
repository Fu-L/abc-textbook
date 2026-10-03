---
title: "ABC301-G — Worst Picture"
draft: true
authoringUnit: {"problemId":"abc301-g","docPath":"src/content/docs/problems/string-geometry/outcome-reduce-geometry-to-algebraic-predicates/outcome-reduce-geometry-to-algebraic-predicates-shard-001/abc301-g.md","learningOutcomeIds":["outcome-reduce-geometry-to-algebraic-predicates"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration"],"excludedTopics":["凸包の境界候補列挙・半平面交差。"],"tagIds":["tag-geometry-orientation-transform","tag-bounded-enumeration"],"sourceRevisionIds":["source-abc301-editorial-6330-6027599d6197eb06cbd58bb5c57e1270afe2a37a348e6cf70da2d5141b3e2b28","source-abc301-g-problem-17e39979cd39918343e6cf0d6f6bdcf1ea2e6c4245a8daedcf5c8a493c60522f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"pのx<0、人のX_i>0なので、pを通る同一直線上のcnt_l人は同じ半直線に並び、ちょうどcnt_l−1人が隠れる。隠れがあるpは必ず有効な人pair直線上にある。一つだけならその直線単独の寄与であり、複数なら列挙する二直線交点の一つである。直線上には他直線の交点を避けた点も存在するので、単独候補も達成可能。\n\nΔX≠0の直線はy=ax+b,z=cx+dに一意に表され、約分した四有理数の一致が3D直線の一致と同値である。二直線の異なる傾きから求めたxで、残りの座標も一致する場合に限り真の交点となる。同じ両傾きなら統合済みの一致か平行であり、除外してよい。従って射影の偽交点を採用せず、真の交点を漏らさない。\n\n相異なる二直線がpで交わるとき、同じ人が両方に属するならpとその人を通る同一直線となり矛盾する。よって直線ごとの人集合は互いに素で、IDを重複除去した寄与和が正確な隠人数である。全候補の最大をNから引けば最小可視人数を得る。","sourceRevisionIds":["source-abc301-editorial-6330-6027599d6197eb06cbd58bb5c57e1270afe2a37a348e6cf70da2d5141b3e2b28","source-abc301-g-problem-17e39979cd39918343e6cf0d6f6bdcf1ea2e6c4245a8daedcf5c8a493c60522f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

- 幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

対象外:

- 凸包の境界候補列挙・半平面交差。

## 考察

人数が減るのは、撮影点pから同じ半直線上に二人以上が並ぶときである。pのxは負、人のX_iは正なので、pを通る同一直線上の人は同じ側に並び、一番近い一人だけが写る。従って最適値がN未満なら、pは少なくとも一つの人pairが定める直線上にある。

人pairのXが同じなら、その直線はxが正の一定値であり、撮影点を置けない。このpairは捨てる。X_i≠X_jなら、直線をxで媒介し、y=ax+b,z=cx+dと表せる。

```text
ΔX = X_j−X_i
 a = (Y_j−Y_i)/ΔX,  b = (Y_i X_j−Y_j X_i)/ΔX
 c = (Z_j−Z_i)/ΔX,  d = (Z_i X_j−Z_j X_i)/ΔX
```

各有理数n/mは分母を正にし、gcd(|n|,m)で約分する。0は0/1。四つの有理数(a,b,c,d)をキーにして同じ3D直線を統合する。xが媒介変数として一意なので、同じ直線ならどのpairから作っても同じキーとなる。各直線lについて全人を調べ、Y_i=aX_i+bかつZ_i=cX_i+dの人数cnt_lを求める。

一本の直線上で、他の直線との有限個の交点を避けた点なら隠れる人数はcnt_l−1。複数の相異なる直線上に同時に乗る場合だけ寄与が増えるので、あとは全二直線の交点を列挙すればよい。二直線l_1,l_2の交点は、二つの式を同時に満たすかで判定する。

- a_1≠a_2ならx=(b_2−b_1)/(a_1−a_2)を解き、c_1x+d_1=c_2x+d_2も確認する。
- a_1=a_2,c_1≠c_2ならx=(d_2−d_1)/(c_1−c_2)を解き、a_1x+b_1=a_2x+b_2も確認する。
- a_1=a_2,c_1=c_2なら、b,dも等しい場合は同一直線で既に統合済み。違えば平行で交点はない。

片方の座標で解けても、もう片方で違えばねじれの位置であり捨てる。例えば(1,1,0),(2,2,0)の直線はy=x,z=0、(1,−3,1),(2,−4,1)の直線はy=−x−2,z=1。xy上ではx=−1,y=−1に見かけの交点があるが、zが異なるので3D交点ではない。逆にxy上で重なる直線も、cの違いから交点を求められるので別の射影へ切り替える必要はない。

両式が一致しx<0のときだけ、p=(x,a_1x+b_1,c_1x+d_1)の各有理数を同じ規約で正規化して交点mapのキーにする。値はpを通る直線IDの集合とし、pairの両IDを追加する。三本以上が同一点で交わると一つのIDが何度も現れるので、重複を除いてΣ_l(cnt_l−1)を求める。

隠れる人数の最大値を、0、各直線単独のcnt_l−1、各交点の集合の寄与和から選び、Nから引く。全X_iが同じなら有効直線がなく、答えはN。連続空間の探索を、O(N²)本の直線とO(N⁴)個の交点へ落とせる。

## 典型の発動条件

### 配置が変わる臨界集合の列挙

発動条件: 連続位置pでscoreがcollinearity時だけ変化する。

pairが定める直線とその交点だけを候補にする。

### 有理幾何

発動条件: 3D直線の一致・交点を誤差なく扱う。

整数比をcanonical化してmap keyにする。

## 問題固有の要素

隠れが発生するための必要条件が人pairとpの共線性なので、連続3D最適化をO(N^4)の離散交点へ落とせる。

別の問題へ持ち帰る視点: 幾何scoreの不連続条件を列挙して候補集合を作る。

## 正当性

pのx<0、人のX_i>0なので、pを通る同一直線上のcnt_l人は同じ半直線に並び、ちょうどcnt_l−1人が隠れる。隠れがあるpは必ず有効な人pair直線上にある。一つだけならその直線単独の寄与であり、複数なら列挙する二直線交点の一つである。直線上には他直線の交点を避けた点も存在するので、単独候補も達成可能。

ΔX≠0の直線はy=ax+b,z=cx+dに一意に表され、約分した四有理数の一致が3D直線の一致と同値である。二直線の異なる傾きから求めたxで、残りの座標も一致する場合に限り真の交点となる。同じ両傾きなら統合済みの一致か平行であり、除外してよい。従って射影の偽交点を採用せず、真の交点を漏らさない。

相異なる二直線がpで交わるとき、同じ人が両方に属するならpとその人を通る同一直線となり矛盾する。よって直線ごとの人集合は互いに素で、IDを重複除去した寄与和が正確な隠人数である。全候補の最大をNから引けば最小可視人数を得る。

## 実装上の注意

- 有理数の正規化は直線キーと交点キーの両方に使う。分母0の分岐を先に分け、比較は交差積で行う。計算途中も128bit整数を用い、浮動小数でmapの同一性を判定しない。
- ΔX=0の人pairを除く。交点は両座標の一致とx<0を全て確認する。x=0は許されない。
- 各交点へ直線IDのsetを持つか、pairからIDを配列へ集めてsort/uniqueする。一点で三本が交わる場合にも各cnt_l−1を一度だけ足す。

## 復習の核

- 射影上の交点は3D交点の必要条件に過ぎない。残りの座標を確認する。
- 媒介変数が一意なら、直線の同一性はその一次式の係数へ落とせる。
- 交点の重複と、同じ交点へ送った直線IDの重複を別々に除く。

## 計算量と制約

### 時間

O(N³+N⁴ log(N+1))。L≤C(N,2)本の直線キーを統合し、包含人数をO(LN)で計算する。全O(L²)直線pairの有理交点をmapへ入れ、直線IDを重複除去する。座標制約内の固定長整数算術をO(1)とする。

### 空間

O(N⁴)。交点キーとIDの登録総数はO(L²)、直線の係数と包含人数はO(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 50; 0 < X_i \leq 1000; -1000 \leq Y_i,Z_i \leq 1000; The triples (X_i,Y_i,Z_i) are distinct.; All values in the input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/editorial/6330) — source-abc301-editorial-6330-6027599d6197eb06cbd58bb5c57e1270afe2a37a348e6cf70da2d5141b3e2b28
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc301/tasks/abc301_g) — source-abc301-g-problem-17e39979cd39918343e6cf0d6f6bdcf1ea2e6c4245a8daedcf5c8a493c60522f
