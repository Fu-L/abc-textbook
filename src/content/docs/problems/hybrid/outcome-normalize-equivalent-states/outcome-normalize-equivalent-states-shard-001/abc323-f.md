---
title: "ABC323-F — Push and Carry"
draft: true
authoringUnit: {"problemId":"abc323-f","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc323-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bounded-enumeration","unit-geometry-primitives"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-bounded-enumeration","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc323-editorial-7358-370aebf0591df8f5c36451aa6f2f5067c6c01a5d3283a77333bcfc0fdf0c9b30","source-abc323-f-problem-3ff85140a4659479a5b62f24de1ad91652ffa3d65987caf1dadff61e5348d6f7"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"normalized start A'からstance pへの距離は通常Manhattan距離で、A',pが同じ座標軸上の原点反対側にあるときだけ+2する。 x,y両方向のpushが必要ならstanceは直交する2点で、その間は原点を避けて常に2歩なので、先に訪れる方だけを2候補比較すればよい。 stanceへ到着後の各push action自体はcargoのManhattan移動量と1対1に対応する。 64通りの方向caseを、最大2点の訪問順と原点迂回という共通式へまとめられる。","sourceRevisionIds":["source-abc323-editorial-7358-370aebf0591df8f5c36451aa6f2f5067c6c01a5d3283a77333bcfc0fdf0c9b30","source-abc323-f-problem-3ff85140a4659479a5b62f24de1ad91652ffa3d65987caf1dadff61e5348d6f7"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-equivalent-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"人A=(−1,0)、荷物B=(0,0)、目標C=(1,1)。","procedure":["右push stanceは(−1,0)で既に到着。","一回右へ押し、直交stanceへ回り込む2歩後に一回上へ押す。"],"executionTarget":null,"expectedResult":"総移動4。","verificationStatus":"not_applicable","learningUnitIds":["unit-normalization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-equivalent-states"],"prerequisiteIds":["unit-bounded-enumeration","unit-geometry-primitives"],"attainmentCondition":"人が(1,0)、最初のstanceが(−1,0)なら距離2で足りるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"荷物原点を通れないので迂回2を加え4歩。座標axisで原点を挟む場合だけ補正する。"},"answer":{"reasoningOrVerification":"荷物原点を通れないので迂回2を加え4歩。座標axisで原点を挟む場合だけ補正する。","procedure":["具体例の各状態・寄与を再計算する。","荷物原点を通れないので迂回2を加え4歩。座標axisで原点を挟む場合だけ補正する。"],"expectedResult":"荷物原点を通れないので迂回2を加え4歩。座標axisで原点を挟む場合だけ補正する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)
- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

cargo初期位置Bを原点へ平行移動すると、cargoを+xへ押すには人が(-1,0)、-xなら(1,0)、+yなら(0,-1)、-yなら(0,1)を必ず一度訪れる。

cargoのpush回数は|X_C-X_B|+|Y_C-Y_B|から減らせず、残る最適化は人が必要な1個または2個の押出し位置へ原点を通らず移動する距離である。

同一直線上で開始点と必要位置が原点を挟む場合だけ、Manhattan最短路がcargo位置を通るため2歩の迂回が必要になる。

採用する候補: Bを原点に正規化し、必要な押出し位置への障害物付きManhattan距離とpush回数を足す。

64通りの方向caseを、最大2点の訪問順と原点迂回という共通式へまとめられる。

棄却する候補: 広いgrid上で人とcargoの位置pairをBFSする。

座標が10^17まであり状態空間を列挙できない。

棄却する候補: 人→cargo距離−1とcargo→target距離を常に足す。

押す向きの反対側へ回り込む必要や、x方向からy方向へ切り替える2歩を数え落とす。

normalized start A'からstance pへの距離は通常Manhattan距離で、A',pが同じ座標軸上の原点反対側にあるときだけ+2する。

x,y両方向のpushが必要ならstanceは直交する2点で、その間は原点を避けて常に2歩なので、先に訪れる方だけを2候補比較すればよい。

stanceへ到着後の各push action自体はcargoのManhattan移動量と1対1に対応する。

A'=(X_A-X_B,Y_A-Y_B)、D=(X_C-X_B,Y_C-Y_B)とする。D_x>0なら(-1,0)、D_x<0なら(1,0)をrequiredへ入れ、yも符号と逆側の点を入れる。avoidDist(A',p)=Manhattan距離に、同一axisで原点を挟む場合だけ2を足す。requiredが1点ならwalk=avoidDist、2点ならwalk=min(avoidDist(A',p_1),avoidDist(A',p_2))+2。答えはwalk+|D_x|+|D_y|。

## 典型の発動条件

### 平行移動による正規化

発動条件: 点配置問題で相対位置だけが操作を決めるとき。

cargo初期位置を原点に移し、人とtargetを差分座標にする。

### 必須通過点への縮約

発動条件: 対象を各方向へ動かすため特定の隣接位置へ立つ必要があるとき。

push方向ごとのstanceを列挙し、その訪問距離だけ最適化する。

### Manhattan最短路の一点障害

発動条件: 格子最短路で唯一避ける点があり、端点が同一axis上にあるとき。

障害点を挟む唯一のcaseへ2歩加える。

## 問題固有の要素

cargoと人の連成移動を、cargoの不可避push数と、人がpush方向を準備するための最大2 stance訪問へ分解できる。

別の問題へ持ち帰る視点: 押す操作の最短化では、対象物の移動量と操作者の向き変更・回り込みcostを別々に数える。

## 正当性

normalized start A'からstance pへの距離は通常Manhattan距離で、A',pが同じ座標軸上の原点反対側にあるときだけ+2する。 x,y両方向のpushが必要ならstanceは直交する2点で、その間は原点を避けて常に2歩なので、先に訪れる方だけを2候補比較すればよい。 stanceへ到着後の各push action自体はcargoのManhattan移動量と1対1に対応する。 64通りの方向caseを、最大2点の訪問順と原点迂回という共通式へまとめられる。

## 実装上の注意

- 座標差・距離和は最大10^18近くなるため64bit整数を使い、符号判定を差の積ではなく比較で行う。
- D_xまたはD_yが0なら対応stanceを追加せず、requiredはB≠Cの保証により空にならない。

## 復習の核

- 人と必要stanceがcargoを挟んで一直線の例、x/y両pushで順序を替える例を描き、+2迂回とstance間2歩を区別する。

## 計算量と制約

### 時間

O(1)、二つ以下のstance候補とManhattan距離。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: -10^{17}\leq X_A,Y_A,X_B,Y_B,X_C,Y_C\leq 10^{17}; (X_A,Y_A)\neq (X_B,Y_B); (X_B,Y_B)\neq (X_C,Y_C); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

人A=(−1,0)、荷物B=(0,0)、目標C=(1,1)。

1. 右push stanceは(−1,0)で既に到着。
2. 一回右へ押し、直交stanceへ回り込む2歩後に一回上へ押す。

期待される結果: 総移動4。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

人が(1,0)、最初のstanceが(−1,0)なら距離2で足りるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

荷物原点を通れないので迂回2を加え4歩。座標axisで原点を挟む場合だけ補正する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/editorial/7358) — source-abc323-editorial-7358-370aebf0591df8f5c36451aa6f2f5067c6c01a5d3283a77333bcfc0fdf0c9b30
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/tasks/abc323_f) — source-abc323-f-problem-3ff85140a4659479a5b62f24de1ad91652ffa3d65987caf1dadff61e5348d6f7
