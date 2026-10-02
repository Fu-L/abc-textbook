---
title: "ABC289-F — Teleporter Takahashi"
draft: true
authoringUnit: {"problemId":"abc289-f","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc289-f.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc289-editorial-5711-35f815926d997c26a481f222916a555bfe995f3ce8b5e932baaacd706600b73d","source-abc289-f-problem-1f32a1a08520a0ac19fdb978380f591e6a40ecbc56db75f6b3597ba6821413a8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"(a,c),(a+1,c)の2操作はyを元へ戻してxだけ+2し、逆順ならxだけ-2する。y方向も(a,c),(a,c+1)の順序で同様に独立調整できる。 singleton軸でtargetが初期値なら偶数、中心反射値なら奇数を要求する。奇数が必要なら最初に(a,c)で1回反射し、残りを偶数回のtranslationへ帰着する。 x,yを変えない2操作単位で一方ずつ調整でき、共有する偶奇だけを先に整えれば具体的な操作列を構成できる。","sourceRevisionIds":["source-abc289-editorial-5711-35f815926d997c26a481f222916a555bfe995f3ce8b5e932baaacd706600b73d","source-abc289-f-problem-1f32a1a08520a0ac19fdb978380f591e6a40ecbc56db75f6b3597ba6821413a8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-recover-valid-witness"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"start(0,0),target(2,0)、中心矩形x∈[0,1],y=0。","procedure":["中心(0,0)反射で(0,0)、中心(1,0)で(2,0)。","二回でyを保つ。"],"executionTarget":null,"expectedResult":"二操作で到達。","verificationStatus":"not_applicable","learningUnitIds":["unit-constructive-witness"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-recover-valid-witness"],"prerequisiteIds":[],"attainmentCondition":"x軸も中心0に固定した場合target2へ届くか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"xは初期0と反射0の二候補しかなく、target2は不可。singleton軸の反射parity制約を検査する。"},"answer":{"reasoningOrVerification":"xは初期0と反射0の二候補しかなく、target2は不可。singleton軸の反射parity制約を検査する。","procedure":["具体例の各状態・寄与を再計算する。","xは初期0と反射0の二候補しかなく、target2は不可。singleton軸の反射parity制約を検査する。"],"expectedResult":"xは初期0と反射0の二候補しかなく、target2は不可。singleton軸の反射parity制約を検査する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

点(x,y)中心のreflectionは(p_x,p_y)→(2x-p_x,2y-p_y)なので、各座標のparityはどの操作でも不変である。

1次元で中心区間が1点aだけなら、偶数回後はs、奇数回後は2a-sに限られる。区間にa,a+1があれば、その順の2回で+2、逆順で-2を実現できる。

2次元では操作回数の偶奇を両座標で共有するため、singletonなx/y区間が要求する偶奇が矛盾しないことも必要になる。

採用する候補: 到達可能性を座標parityとsingleton軸の操作回数parityで判定し、必要なら最初に1回反射してから±2平行移動pairを並べる。

x,yを変えない2操作単位で一方ずつ調整でき、共有する偶奇だけを先に整えれば具体的な操作列を構成できる。

棄却する候補: x座標用とy座標用の1次元操作列を独立に作って単純に連結する。

各reflectionは両座標へ同時に作用し、特にsingleton軸が要求する総操作回数の偶奇が衝突し得る。

棄却する候補: 現在点からtargetへ近づく中心を毎回greedyに選ぶ。

reflectionは距離を単調に減らすとは限らず、到達不可能条件や10^6回上限の保証を与えない。

(a,c),(a+1,c)の2操作はyを元へ戻してxだけ+2し、逆順ならxだけ-2する。y方向も(a,c),(a,c+1)の順序で同様に独立調整できる。

singleton軸でtargetが初期値なら偶数、中心反射値なら奇数を要求する。奇数が必要なら最初に(a,c)で1回反射し、残りを偶数回のtranslationへ帰着する。

まずs_x≡t_x、s_y≡t_y (mod 2)を確認する。a=bならt_xがs_xまたは2a-s_xか、c=dならyも同様かを調べ、singleton軸同士の要求parityが一致しなければNo。成立時、要求parityが奇なら(a,c)を1回出力して現在点を更新する。x差が正なら(a,c),(a+1,c)、負なら逆順を|差|/2回、yも(a,c),(a,c+1)または逆順で調整し、Yesと操作列を出す。

## 典型の発動条件

### reflection合成によるtranslation

発動条件: 中心反転を複数回使って目標座標へ構成的に移動するとき。

近接2中心での反射を合成して±2の平行移動を作る。

### 不変量と退化case

発動条件: 操作可能領域が区間で、長さ0の場合だけ自由度が失われるとき。

座標parityに加え、singleton中心での操作回数parityを判定する。

### 構成問題の現在状態更新

発動条件: 出力操作列を段階的に組み立てるとき。

各reflection後の現在座標を更新し、残差をtranslation pairで消す。

## 問題固有の要素

2操作を同じy中心で行えばyへの反射が相殺され、xだけを動かせるため、2次元の結合は総操作回数parity以外ほぼ分離できる。

別の問題へ持ち帰る視点: 複数座標へ同時作用する操作は、短い操作列を合成して不要座標への作用をidentityにできないか探す。

## 正当性

(a,c),(a+1,c)の2操作はyを元へ戻してxだけ+2し、逆順ならxだけ-2する。y方向も(a,c),(a,c+1)の順序で同様に独立調整できる。 singleton軸でtargetが初期値なら偶数、中心反射値なら奇数を要求する。奇数が必要なら最初に(a,c)で1回反射し、残りを偶数回のtranslationへ帰着する。 x,yを変えない2操作単位で一方ずつ調整でき、共有する偶奇だけを先に整えれば具体的な操作列を構成できる。

## 実装上の注意

- a=bのときa+1を、c=dのときc+1を中心として出力しない。必要な差が非zeroなら対応区間が非退化であることを判定済みにする。
- 最初の奇数回reflection後にcurrent x,yを両方更新してからtranslation回数を計算する。
- 最大でも先頭1回と両座標差に比例する80万回余りで、10^6上限内だがvector容量と出力時間を考慮する。

## 復習の核

- 両区間がsingletonで一方だけ反射を要求する不可能例と、片軸だけ非退化な可能例を試し、初回reflection後の±2 pairが他軸を保つか追う。

## 計算量と制約

### 時間

O(Dx+Dy)、Dx,Dyは2刻みtranslation数。

### 空間

O(Dx+Dy)、操作列。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 0\leq s _ x,s _ y,t _ x,t _ y\leq2\times10^5; 0\leq a\leq b\leq2\times10^5; 0\leq c\leq d\leq2\times10^5; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

start(0,0),target(2,0)、中心矩形x∈[0,1],y=0。

1. 中心(0,0)反射で(0,0)、中心(1,0)で(2,0)。
2. 二回でyを保つ。

期待される結果: 二操作で到達。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

x軸も中心0に固定した場合target2へ届くか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

xは初期0と反射0の二候補しかなく、target2は不可。singleton軸の反射parity制約を検査する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/editorial/5711) — source-abc289-editorial-5711-35f815926d997c26a481f222916a555bfe995f3ce8b5e932baaacd706600b73d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc289/tasks/abc289_f) — source-abc289-f-problem-1f32a1a08520a0ac19fdb978380f591e6a40ecbc56db75f6b3597ba6821413a8
