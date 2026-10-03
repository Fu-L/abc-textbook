---
title: "ABC406-G — Travelling Salesman Problem"
draft: true
authoringUnit: {"problemId":"abc406-g","docPath":"src/content/docs/problems/string-geometry/outcome-maintain-piecewise-linear-convex-function/outcome-maintain-piecewise-linear-convex-function-shard-001/abc406-g.md","learningOutcomeIds":["outcome-maintain-piecewise-linear-convex-function"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-constructive-witness","unit-ordered-set-multiset"],"excludedTopics":["slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-slope-trick","tag-constructive-witness","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc406-editorial-13048-920868b4aa7b9d1ecd1f5cb46d721512ac85991b33891224b3674ac02c77ee00","source-abc406-g-problem-af05a869e705437c9cfa5c822aa6d808b155b4a5c08c1bb41d36ec3d3f5db3f2"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"C|x−y|とのmin convolutionは任意y候補の凸costを比較し、元関数の傾きを[−C,C]へ切る操作に等しい。D|X_i−x|追加は現在受取費用であり、従って各f_iは最適prefix費用そのもの。最終minimizerからclipで元fと一致した区間へclampすると最適yが得られるので、保存した区間を逆順に参照して全受取位置も最適に構成できる。 初期f_0は原点以外を禁止し、最初の費用C|x|を必ず含む。clipで残った区間I_iへのclampはconvolutionの最小候補を与えるため、逆順の各接続が等号を保ち、原点からの復元列の費用が最小値に一致する。","sourceRevisionIds":["source-abc406-editorial-13048-920868b4aa7b9d1ecd1f5cb46d721512ac85991b33891224b3674ac02c77ee00","source-abc406-g-problem-af05a869e705437c9cfa5c822aa6d808b155b4a5c08c1bb41d36ec3d3f5db3f2"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [slope trick](src/content/docs/learn/geometry-optimization/slope-trick.md)

- 区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- slope trickの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

品物 i を座標 x で受け取るときの最小費用 f_i(x) は、直前座標 y から自分が動く C|x-y| と商人 i が X_i から動く D|X_i-x| の和で遷移する。

f が離散凸なら g(x)=min_y(f(y)+C|x-y|) も凸であり、これは f の傾きを [-C,C] に切り詰める操作に一致する。その後 D|X_i-x| を加えると X_i に傾き差 2D が入る。

採用する候補: 凸区分線形関数の傾き変化を slope trick で管理し、絶対値の min-plus convolution と加算を各商人について更新する

変化点を map または Fenwick tree で扱えば各更新を対数時間で行え、各段のclipで残る区間の両端を保存して逆順に最適な受取座標も復元できる。

棄却する候補: 全座標 x,y を列挙して dp_i[x]=min_y(dp_{i-1}[y]+C|x-y|)+D|X_i-x| を計算する

座標候補が約 2×10^5、商人も 2×10^5 で、少なくとも状態数だけで O(NR)、素朴遷移は O(NR^2) になる。

min convolution で値が f から変わらない座標は一つの区間をなし、その外側では端点から傾き ±C で延長される。したがって傾き変化を左右から削るだけで g を得られる。

最終 f_N の最小点を選び、各段階で現在座標 x を「f_{i-1}=g_i だった区間」へ clamp すると最適な直前座標を得る。各段階でこの区間の二端を保存すれば逆順に参照できる。

初期状態はf_0(0)=0、f_0(x≠0)=+∞。従って最初のconvolutionはg_1(x)=C|x|であり、f_1(x)=C|x|+D|X_1−x|から始める。定数0で初期化すると自由な始点を許すので、X_1=1,C=2,D=3の最小費用2を0と誤る。

各i≥2では、f_{i−1}の離散傾きq(z)=f_{i−1}(z+1)−f_{i−1}(z)を非減少順に保持する。−C未満の左側、Cより大きい右側を削り、残った傾きとの境界をI_i=[l_i,r_i]として保存する。これはg_i=f_{i−1}となる閉区間である。全座標[-10^5,10^5]内で端がなければdomain端を用い、I_1=[0,0]とする。削った側では区間端から傾き−C,+Cでg_iを延長し、その後D|X_i−x|を足す。絶対値追加の傾きjumpはX_iで2Dなので、変化点とその重みを二つのheapまたはordered mapへ追加する。境界のjumpを途中まで削る場合は残り重みも保持する。

各追加は一つのjumpを作り、clipで削除したjumpは再登場しないので、削除総数を償却できる。I_iの二端だけを保存すれば、変更履歴全体のundoは必要ない。最終f_Nの最小点A_Nを選び、i=N,…,2でA_{i−1}=clamp(A_i,I_i)とする。A_iがI_i内ならy=A_i、外なら近い端点がmin_y(f_{i−1}(y)+C|A_i−y|)を達成するため、この復元はprefix最適値へ戻る。A_0=0として復元列のΣ_i C|A_i−A_{i−1}|+D|X_i−A_i|が出力した最小値に等しいことも検査できる。

## 典型の発動条件

### slope trick

発動条件: 絶対値を加える操作や絶対値との min-plus convolution を繰り返す凸 DP のとき。

傾きの変化点・変化量と基準値を持ち、傾き clip と kink 追加で関数全体を更新する。

### 凸 DP の最適解復元

発動条件: 関数値の最小値だけでなく各段階の argmin 列が必要なとき。

前向き更新の履歴を保存し、逆向きに convolution の不変区間へ座標を clamp する。

### 離散凸関数の傾き管理

発動条件: 整数座標上の区分線形凸関数を多数更新したいとき。

傾き差分を ordered map や座標範囲上の Fenwick tree で保持する。

## 問題固有の要素

商人と自分の移動順序を受取座標列だけに集約すると、二種類の移動費は連続する座標差と入力座標からの絶対値として完全に分離する。

別の問題へ持ち帰る視点: 絶対値距離の列最適化では DP 関数そのものではなく傾きの変化だけを持ち、復元には clip で失った領域の境界履歴を残す。

## 正当性

C|x−y|とのmin convolutionは任意y候補の凸costを比較し、元関数の傾きを[−C,C]へ切る操作に等しい。D|X_i−x|追加は現在受取費用であり、従って各f_iは最適prefix費用そのもの。最終minimizerからclipで元fと一致した区間へclampすると最適yが得られるので、保存した区間を逆順に参照して全受取位置も最適に構成できる。 初期f_0は原点以外を禁止し、最初の費用C|x|を必ず含む。clipで残った区間I_iへのclampはconvolutionの最小候補を与えるため、逆順の各接続が等号を保ち、原点からの復元列の費用が最小値に一致する。

## 実装上の注意

- 最初はC|x|+D|X_1−x|。全て0の初期関数にしない。
- 傾きjumpは個数ではなく重みを持つ。clipで一jumpの一部を除く場合も残り重みを保存する。
- 復元用には各I_iの二端だけを記録する。A_0=0から復元列の費用を計算し、最小値と一致することを確認する。

## 復習の核

- N=1、C≪D、C≫D、同一 X の反復、X が左右に交互に振れる場合を小座標の全 DP と比較し、費用と復元列の双方を再評価する。

## 計算量と制約

### 時間

O(N log N)。左右の傾き変化をheap/treeでclipし履歴を復元する。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq C, D \leq 10^5; -10^5 \leq X_i \leq 10^5; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc406/editorial/13048) — source-abc406-editorial-13048-920868b4aa7b9d1ecd1f5cb46d721512ac85991b33891224b3674ac02c77ee00
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc406/tasks/abc406_g) — source-abc406-g-problem-af05a869e705437c9cfa5c822aa6d808b155b4a5c08c1bb41d36ec3d3f5db3f2
