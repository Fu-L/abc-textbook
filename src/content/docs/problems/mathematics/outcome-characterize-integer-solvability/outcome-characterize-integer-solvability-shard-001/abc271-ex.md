---
title: "ABC271-EX — General General"
draft: true
authoringUnit: {"problemId":"abc271-ex","docPath":"src/content/docs/problems/mathematics/outcome-characterize-integer-solvability/outcome-characterize-integer-solvability-shard-001/abc271-ex.md","learningOutcomeIds":["outcome-characterize-integer-solvability"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-greedy-exchange"],"excludedTopics":["差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。"],"tagIds":["tag-bezout-diophantine","tag-bounded-enumeration","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc271-ex-problem-9abb57848a51cc20c07d75f488b4a5fb140a9b2c476da22b1063d27dd964c85b","source-abc271-editorial-4932-e1684d9e0f3cc5470b43074d0974aa4a5e5e858b299595ed97e3b743f74bcf6a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"反対方向を同数ずつ除くと変位を保ち手数が減るので、最適解にはその組がない。円周間隔による六型の交換は、使用済みの方向だけへ置き換え、減らす回数の下限を確認することで非負性と変位を保ち、手数を増やさない。軸を二つ含む三方向は必ず二方向以下へ減り、四方向もこの三方向を選んで一方向を除ける。二対角と一軸だけが残る型では交換を反復して軸の回数を高々1へ減らせる。従って最適解はsingle/pairまたは許可軸一回とpairへ正規化できる。行列式solverは二方向の係数を一意に求め、整数性・非負性を検査する。列挙候補は全て合法で、正規化された最適解も含むため、その最小手数が答えとなる。","sourceRevisionIds":["source-abc271-ex-problem-9abb57848a51cc20c07d75f488b4a5fb140a9b2c476da22b1063d27dd964c85b","source-abc271-editorial-4932-e1684d9e0f3cc5470b43074d0974aa4a5e5e858b299595ed97e3b743f74bcf6a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [gcdと整数解の成立条件](src/content/docs/learn/number-theory/gcd-diophantine.md)

- 整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

対象外:

- 差や周期をgcdへ集約する不変量の抽出は「gcd不変量・差分構造」で扱う。複数の合同条件の統合は合同式・CRT、有理近似は連分数・Stern–Brocotの単元へ進む。

## 考察

8方向への移動は可換なので、各許可ベクトルの非負使用回数だけを考える。座標が10^9規模ではBFSは使えないが、方向は8個しかない。目標の大きさではなく、最適解で併用する方向数を減らせないかを調べる。

E=(1,0)、NE=(1,1)、N=(0,1)、NW=(−1,1)、W=(−1,0)、SW=(−1,−1)、S=(0,−1)、SE=(1,−1)と書く。反対方向u,−uを同時に使うなら、少ない側の回数だけ両方から引けば同じ変位で手数が減る。よって最適解には反対方向の組がなく、使用方向数は高々4。

三方向の交換を調べる。以下の「→」は同じ変位を持つ使用回数への置換である。方向名の重複はその回数を意味し、右辺は左辺の三方向に既に含まれる方向だけを使う。

| 使用する三方向 | 交換 | 適用条件と終了形 |
| --- | --- | --- |
| E,NE,N | E+N→NE | E,Nがともに1回以上。片方が0になるまで繰り返し、手数を1ずつ減らす。 |
| E,NE,NW | 2E+NW→NE | Eが2回以上、NWが1回以上。Eが高々1回になるかNWが0になるまで繰り返す。 |
| E,NE,S | NE+S→E | NE,Sがともに1回以上。片方が0になるまで繰り返す。 |
| E,NE,SE | NE+SE→2E | NE,SEがともに1回以上。手数を保ち、一方の対角方向を0にする。 |
| E,N,SW | E+N+SW→0 | 三方向がともに1回以上。少ない回数だけ三つから引く。 |
| E,NW,SW | 2E+NW+SW→0 | Eが2回以上、両対角方向が1回以上。Eが高々1回か一方の対角方向が0になるまで繰り返す。 |

各交換は、減らす回数が存在するときだけ行うので非負性を保つ。手数は減るか同じで、新たな未許可方向を追加しない。残る例外は、二つの対角方向と軸方向がちょうど1回の形だけである。

この表が全三方向を覆うことも確認する。円周順の三方向の間隔を45度単位で測る。反対方向がないため間隔4は現れず、三つの正整数の和8は、順序を除いて(1,1,6)、(1,2,5)、(2,3,3)だけ。90度回転と反転では軸と対角を区別したまま、各間隔型に軸始まり・対角始まりの二種類があり、表の六行に対応する。45度回転は軸と対角の移動長を変えるので対称性に使わない。

四方向なら、反対方向を含まない軸方向は高々二つ、対角方向も高々二つなので、軸二つと対角二つである。軸二つと対角一つを取ると、表の一行目・三行目・五行目の対称形になり、回数2を要求せずに一方向を0へ減らせる。残る三方向にも表を適用すればよい。これで最適解の候補は「高々二方向」または「軸を一回と二対角」に尽くされる。

実装では許可された全single/pairを列挙する。非平行u,vに対してΔ=det(u,v)とすると、目標tの係数はp=det(t,v)/Δ、q=det(u,t)/Δ。両分子がΔで割り切れ、p,q≥0ならp+qが候補。単一方向ではt=puとなる非負整数pを確認する。反対方向のpairは相殺後singleへ減るので省ける。目標(0,0)には0手を入れる。

さらに許可された各軸eを一回使い、目標t−eで同じsingle/pair solverを呼んで1を足す。全候補の最小値を取り、存在しなければ−1。例えばNE,NW,Sだけを許可し目標(0,1)とすると、NE+NW+Sの3手が必要で、二方向だけでは到達できない。軸一回の例外を省いてはならない。

## 典型の発動条件

### 交換法によるsupport削減

発動条件: 多数種類の同価操作を可換に組み合わせ、vector relationで同じ結果をより少ない種類へ変形できるとき。

8方向moveの三種類以上の併用を置換し、定数個の二方向pairと限定された三方向例外を漏れなく全列挙する。

### 二変数一次Diophantine方程式

発動条件: target vectorを二つのinteger vectorsの非負整数結合で表せるか判定したいとき。

determinantとdivisibilityで二係数を求め、nonnegativeなら使用回数和を比較する。

## 問題固有の要素

rotation/reflection symmetryで方向pairの形をさらに定数個へ標準化できるが、8方向全pairを直接列挙しても十分小さい。

別の問題へ持ち帰る視点: 操作集合が小さくtargetが巨大な最短walkでは、探索空間よりoptimal representationのsupport boundを探す。

## 正当性

反対方向を同数ずつ除くと変位を保ち手数が減るので、最適解にはその組がない。円周間隔による六型の交換は、使用済みの方向だけへ置き換え、減らす回数の下限を確認することで非負性と変位を保ち、手数を増やさない。軸を二つ含む三方向は必ず二方向以下へ減り、四方向もこの三方向を選んで一方向を除ける。二対角と一軸だけが残る型では交換を反復して軸の回数を高々1へ減らせる。従って最適解はsingle/pairまたは許可軸一回とpairへ正規化できる。行列式solverは二方向の係数を一意に求め、整数性・非負性を検査する。列挙候補は全て合法で、正規化された最適解も含むため、その最小手数が答えとなる。

## 実装上の注意

- 行列式が0のpairは除き、singleと目標(0,0)を別に検査する。係数0も合法。
- 軸一回の候補では、その軸と残りの各方向が全て許可されていることを確認する。
- 90度回転と反転は合法性・手数を保つ。45度回転をこの表の対称操作としない。実装は8方向全pairを列挙すれば対称操作自体が不要。

## 復習の核

- 可換なvector操作では、三種類以上の使用を同じ変位・非増加costで置換するrelationを探す。
- support boundが得られたら、幾何的case分けをdeterminantによる統一solverへ落とす。

## 計算量と制約

### 時間

各case O(1)。許可8方向の全single/pairと軸1回の例外を列挙する。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^4; -10^9 \leq A,B \leq 10^9; s_i is 0 or 1.; T, A, and B are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/tasks/abc271_h) — source-abc271-ex-problem-9abb57848a51cc20c07d75f488b4a5fb140a9b2c476da22b1063d27dd964c85b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc271/editorial/4932) — source-abc271-editorial-4932-e1684d9e0f3cc5470b43074d0974aa4a5e5e858b299595ed97e3b743f74bcf6a
