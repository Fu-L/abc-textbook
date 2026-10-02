---
title: "ABC286-EX — Don't Swim"
draft: true
authoringUnit: {"problemId":"abc286-ex","docPath":"src/content/docs/problems/string-geometry/outcome-restrict-geometric-candidates-to-boundary/outcome-restrict-geometric-candidates-to-boundary-shard-001/abc286-ex.md","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-convex-boundary-hull"],"sourceRevisionIds":["source-abc286-editorial-5568-b6443e17b93b4acda941f3898e1facf7191809b5faa1df975f1edfa7c506b00e","source-abc286-ex-problem-15c38577c720eb4723e02ad546c45234cfb17e37d1b62b397e322fb118847716"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"線分STが凸障害物の内部を通らなければ三角不等式により直線が最短。内部を通る場合、最短経路の自由空間部分は直線で、境界への接続は接線となり、接点間は境界の二方向のいずれかをたどる。C∪{S,T}の凸包はこの接線と境界arcを同時に表すので、その周上のS−T二つのarc長の最小が最短である。境界への接触だけは内部交差と区別して直線を許す。","sourceRevisionIds":["source-abc286-editorial-5568-b6443e17b93b4acda941f3898e1facf7191809b5faa1df975f1edfa7c506b00e","source-abc286-ex-problem-15c38577c720eb4723e02ad546c45234cfb17e37d1b62b397e322fb118847716"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"障害物は正方形(0,0),(2,0),(2,2),(0,2)、S=(−1,1),T=(3,1)。","procedure":["直線STは内部を横切るので不許可。","下側の接点は(0,0),(2,0)、上側なら(0,2),(2,2)。","どちらも距離√2+2+√2。"],"executionTarget":null,"expectedResult":"最短距離2+2√2。","verificationStatus":"not_applicable","learningUnitIds":["unit-convex-boundary-hull"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-restrict-geometric-candidates-to-boundary"],"prerequisiteIds":["unit-geometry-primitives"],"attainmentCondition":"S=(−1,0),T=(3,0)へ変えると答えはいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"4。辺に沿う直線移動は内部へ入らず許される。境界接触を内部交差と誤判定すると不要な迂回が起こる。"},"answer":{"reasoningOrVerification":"4。辺に沿う直線移動は内部へ入らず許される。境界接触を内部交差と誤判定すると不要な迂回が起こる。","procedure":["具体例の各状態・寄与を再計算する。","4。辺に沿う直線移動は内部へ入らず許される。境界接触を内部交差と誤判定すると不要な迂回が起こる。"],"expectedResult":"4。辺に沿う直線移動は内部へ入らず許される。境界接触を内部交差と誤判定すると不要な迂回が起こる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [凸包・支持方向・境界候補](src/content/docs/learn/geometry-optimization/convex-boundary-hull.md)

- 目的関数に対して内部候補が不要な理由を示し、凸境界だけを列挙できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 凸包・支持方向・境界候補の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

線分S–Tが凸polygonの内部を通らなければ、Euclidean直線距離が下界を達成するので迂回は不要である。

内部を横切る場合の最短pathは、Sからpolygonへのtangent、polygon境界上の連続arc、polygonからTへのtangentの組合せに変形できる。

必要なtangent接点はCの全頂点にS,Tを加えたconvex hull上でS,Tに接続する頂点として現れる。

採用する候補: 直線が内部を通る場合にC∪{S,T}のconvex hullを作り、hull上のS–T間2方向のarc長の小さい方を取る。

tangent区間と障害物境界を1本のhull周上へ統合でき、接点候補を個別探索せず両迂回方向を比較できる。

棄却する候補: polygon頂点をvisibility graphの頂点とし、全頂点対の見通しedgeを作って最短路を解く。

convex性により最適pathは境界順のarcだけで十分なのに、二次個のedgeを生成してしまう。

棄却する候補: S,Tに最も近いpolygon頂点を接点として選ぶ。

最短の接点は距離単独ではなく内部を横切らないtangent条件で決まり、最近傍とは限らない。

polygonへ触れる前後の折れ線は、内部へ入らない範囲で直線へ短縮できるため、曲がる可能性があるのは凸境界のtangent頂点だけである。

convex hullの一方のS–T arcが時計回り迂回、もう一方が反時計回り迂回に対応し、その辺長和には接線区間も自動的に含まれる。

まずS=Tや線分S–TがCの内部と交わらない場合を判定し、そのときはhypotで直線距離を返す。交わる場合はpolygon頂点とS,Tのconvex hullを求め、hull周上のedge長prefix sumを作る。SとTのindex間の周長を一方向でd、全周長をPとして、min(d,P-d)を出力する。

## 典型の発動条件

### 凸障害物まわりの接線最短路

発動条件: 平面上で1つの凸領域の内部だけを避ける最短距離を求めるとき。

直線または両側のtangent＋境界arcだけを候補にする。

### convex hullによる接点抽出

発動条件: 外部点から凸polygonへの極限visibility頂点をまとめて得たいとき。

障害物頂点と外部点のunionのhullを取る。

### 環状prefix length

発動条件: polygon周上の2点間を時計・反時計回りで比較するとき。

一方向距離dと全周長P-dを比較する。

## 問題固有の要素

S,Tをhullへ加えることで、接線の選択とpolygon境界arcの選択がhullの隣接edge列という同じ表現に吸収される。

別の問題へ持ち帰る視点: 幾何の折れ線候補を直接列挙する代わりに、極点を含む凸包の境界へ最適pathを載せられないか考える。

## 正当性

線分STが凸障害物の内部を通らなければ三角不等式により直線が最短。内部を通る場合、最短経路の自由空間部分は直線で、境界への接続は接線となり、接点間は境界の二方向のいずれかをたどる。C∪{S,T}の凸包はこの接線と境界arcを同時に表すので、その周上のS−T二つのarc長の最小が最短である。境界への接触だけは内部交差と区別して直線を許す。

## 実装上の注意

- 境界上を通ることは許されるため、線分が辺や頂点に接するだけのcaseを内部交差として誤判定しない。
- cross productは座標差の積が大きくなるので64bit以上で計算し、距離和はdoubleまたはlong doubleを使う。
- hull構築時のcollinear点除去規則でS,Tの位置を見失わないよう、交差caseで両点のindexを明示的に取得する。

## 復習の核

- 直線が障害物を外れる例・頂点に接する例・内部を横切る例を描き、最後のcaseでhullの2arcが上下2方向のtangent経路に一致するか確認する。

## 計算量と制約

### 時間

O(N log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 3\leq N \leq 10^5; |x_i|,|y_i|,|s_x|,|s_y|,|t_x|,|t_y|\leq 10^9; (x_1,y_1),(x_2,y_2),\ldots, and (x_N,y_N) form a convex polygon in counterclockwise order.; No three points of C are colinear.; S and T are outside C and not on the circumference of C.; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

障害物は正方形(0,0),(2,0),(2,2),(0,2)、S=(−1,1),T=(3,1)。

1. 直線STは内部を横切るので不許可。
2. 下側の接点は(0,0),(2,0)、上側なら(0,2),(2,2)。
3. どちらも距離√2+2+√2。

期待される結果: 最短距離2+2√2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=(−1,0),T=(3,0)へ変えると答えはいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

4。辺に沿う直線移動は内部へ入らず許される。境界接触を内部交差と誤判定すると不要な迂回が起こる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/editorial/5568) — source-abc286-editorial-5568-b6443e17b93b4acda941f3898e1facf7191809b5faa1df975f1edfa7c506b00e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc286/tasks/abc286_h) — source-abc286-ex-problem-15c38577c720eb4723e02ad546c45234cfb17e37d1b62b397e322fb118847716
