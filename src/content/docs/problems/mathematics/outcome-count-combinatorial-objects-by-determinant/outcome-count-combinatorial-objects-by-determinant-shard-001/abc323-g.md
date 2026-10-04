---
title: "ABC323-G — Inversion of Tree"
draft: true
authoringUnit: {"problemId":"abc323-g","docPath":"src/content/docs/problems/mathematics/outcome-count-combinatorial-objects-by-determinant/outcome-count-combinatorial-objects-by-determinant-shard-001/abc323-g.md","learningOutcomeIds":["outcome-count-combinatorial-objects-by-determinant"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-linear-system-rank","unit-polynomial-taylor-shift"],"excludedTopics":["行列式による数え上げの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-determinant-counting","tag-linear-system-rank","tag-polynomial-taylor-shift"],"sourceRevisionIds":["source-abc323-editorial-7356-8e3292da3a2b2feb61e13f336e46bb0792b987da9de409b538dc51805a9a9b37","source-abc323-g-problem-aa2b668975ee5b61998c77543746047f4e34f404d488bff153ab12768784bcda"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"行列木定理によりD(x)の係数は転倒辺数別の全域木数。x=1の完全グラフ余因子Cの行列式N^{N−2}は法上で非零だからA=−C^{-1}M_1が定義できる。対応する行・列操作は全て相似変換で特性多項式を保存し、Hessenberg形の最後の列の余因子展開は指定したp_iの漸化式を与える。p_0=1からの帰納で全係数を正しく求める。E(z)=det(M_1+zC)、Q(t)=t^dE(1/t)=D(1+t)、D(x)=Q(x−1)なので、反転とshiftを経た係数が要求する個数になる。","sourceRevisionIds":["source-abc323-editorial-7356-8e3292da3a2b2feb61e13f336e46bb0792b987da9de409b538dc51805a9a9b37","source-abc323-g-problem-aa2b668975ee5b61998c77543746047f4e34f404d488bff153ab12768784bcda"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [行列式による数え上げ](src/content/docs/learn/combinatorics-algebra/determinant-counting.md)

- 辺重みからLaplacianを構成し、根の行列余因子を全域木の重み付き個数へ対応させられる。有向木の向きと自己ループの扱いを説明できる。

先に読む単元:

- [線形方程式・rank](src/content/docs/learn/combinatorics-algebra/linear-system-rank.md) — 制約を体上の連立一次方程式へ写し、Gaussian eliminationでrank・可解性・解空間次元を求める。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [factorial convolutionによる多項式Taylor shift](src/content/docs/learn/combinatorics-algebra/polynomial-taylor-shift.md) — 畳み込みと二項係数の階乗表示を理解した後、二項展開の添字を反転して P(x+a) の全係数を一回の畳み込みへ落とす。多点評価や一般FPS合成とは目的を区別する。

## 考察

辺u<vについてP_u>P_vなら重みx、そうでなければ1とする。全域木の辺重み積はx^{転倒辺数}なので、重み付き行列木定理で得るLaplacianの余因子D(x)=det(M_0+xM_1)の各係数が答えになる。余因子の大きさd=N−1、各要素は一次式なので次数は高々d。

N点で掃き出しして補間する方法はO(N⁴)になる。N≤500では、全係数を一回のO(N³)処理で得たい。M_1が正則なら単位行列をxの係数へ作って特性多項式にできるが、転倒辺がない順列ではM_1=0になる。そこで正則な評価点を定数項側に置き、係数反転で両側を交換する。

本問はa=1でよい。このとき全辺の重みが1となり、C=M_0+M_1は完全グラフの余因子である。C=N I_d−J_d、J_dは全要素1の行列だから、全1ベクトル上の固有値はN−d=1、それに直交する部分ではN。よってdet C=N^{N−2}≠0（法998244353>N）であり、乱数や再試行は不要。通常の掃き出しでC^{-1}とdet Cを求め、A=−C^{-1}M_1とする。

ここからE(z)=det C·det(zI−A)を計算する。特性多項式を点ごとに評価しては元のO(N⁴)へ戻るので、以下で全係数を直接求める。

### 相似変換で上Hessenberg形へ移す

上Hessenberg行列HとはH_{r,c}=0（r>c+1）、つまり対角線の一つ下より下が全て0の行列。添字は1-based、最初H=A。列c=1,…,d−2を順に処理し、行c+1以降に非零H_{r,c}を探す。全て0ならその列は既に完成しているので飛ばす。非零行rを見つけたら行rとc+1を交換し、同時に列rとc+1も交換する。この対の操作は置換行列による相似変換である。

pivot h=H_{c+1,c}に対し、各r>c+1でα=H_{r,c}/hを取り、次を順に行う。

```text
row r ← row r − α·row(c+1)
column(c+1) ← column(c+1) + α·column r
```

前者が左からT=I−α E_{r,c+1}を掛ける操作、後者が右からT^{-1}=I+α E_{r,c+1}を掛ける操作なので、H←THT^{-1}。列操作には行操作後の値を使う。特性多項式はdet(zI−THT^{-1})=det(zI−H)で保存され、既に0にした前の列も再び非零にならない。行・列の対応操作を片方だけ行う通常の掃き出しとは違う。

### 先頭小行列の特性多項式を伸ばす

p_i(z)=det(zI_i−H[1:i,1:i])、p_0=1とする。最後の列で余因子展開すると、対角項は(z−H_{i,i})p_{i−1}。行k<iの非対角項では、Hessenberg形の0によって残りの右下部分は下副対角の鎖に固定され、先頭k−1部分だけが自由になる。鎖の負号と余因子の符号を合わせると、各項は−H_{k,i}(∏_{j=k}^{i−1}H_{j+1,j})p_{k−1}。したがって

```text
p_i(z) = (z−H_{i,i})p_{i−1}(z)
         − Σ_{k=1}^{i−1} H_{k,i}(∏_{j=k}^{i−1}H_{j+1,j})p_{k−1}(z)
```

となる。p_1=z−H_{1,1}、p_iの次数はiで最高次係数は1。iごとにkをi−1から1へ下げながら鎖の積を累積すれば、一つの項で掛けるのはscalarと既知の係数列だけ。副対角に0があれば鎖が切れて、その先の項も0になる。例えば2×2では(z−H_{2,2})(z−H_{1,1})−H_{1,2}H_{2,1}であり、通常の行列式と符号が一致する。

p_dからE(z)=det C·p_d(z)を得る。Q(t)=det(C+tM_1)=t^d E(1/t)なので、次数dの長さd+1の係数列を反転する。最高次の0も残す。最後にD(x)=Q(x−1)へ戻す。Q(t)=Σ_j q_j t^jなら、Dのi次係数はΣ_{j=i}^d q_j C(j,i)(−1)^{j−i}。階乗・逆階乗をdまで用意し、全i,jの二重loopでO(d²)計算すれば、行列処理のO(d³)以内に収まる。x^0,…,x^dの係数を順に出力する。N=2で転倒辺がない場合はA=0、E=z、Q=1であり、転倒辺がある場合はE=z+1、Q=1+t、D=xとなる。

## 典型の発動条件

### weighted Matrix-Tree theorem

発動条件: spanning treeをedge属性の個数別に数えたいとき。

属性edgeへ形式変数weightを付け、Laplacian cofactorを生成多項式にする。

### matrix pencilのdeterminant

発動条件: entryがA+xBの一次matrixでdeterminant全係数が必要なとき。

正則係数を単位行列へ変えcharacteristic polynomialへ帰着する。

### polynomial reversalとshift

発動条件: x係数matrixがsingularだが、ある評価点のconstant matrixは正則にできるとき。

変数をshiftし逆数変換で正則matrixを最高次係数側へ移す。

## 問題固有の要素

treeごとのinversion edge数という離散統計を、edge weight xの積へ符号化すると、N個の答えが1本のdeterminant polynomialに同時格納される。

別の問題へ持ち帰る視点: 構造ごとの属性個数分布は、属性要素へ形式変数を付けたweighted countの係数として一括計算する。

## 正当性

行列木定理によりD(x)の係数は転倒辺数別の全域木数。x=1の完全グラフ余因子Cの行列式N^{N−2}は法上で非零だからA=−C^{-1}M_1が定義できる。対応する行・列操作は全て相似変換で特性多項式を保存し、Hessenberg形の最後の列の余因子展開は指定したp_iの漸化式を与える。p_0=1からの帰納で全係数を正しく求める。E(z)=det(M_1+zC)、Q(t)=t^dE(1/t)=D(1+t)、D(x)=Q(x−1)なので、反転とshiftを経た係数が要求する個数になる。

## 実装上の注意

- Cはa=1で正則。法998244353上の通常の掃き出しと、特性多項式を保つ相似変換を区別する。
- Hessenbergのpivot交換は行と列を対にする。消去のαを保存し、行操作後に逆の列操作を行う。pivot候補が全て0ならその列を飛ばし、0の逆元を取らない。
- p_0=[1]、p_iは長さi+1の係数配列。鎖の積はkを降順に累積し、scalar倍と加減算だけで更新する。
- 係数反転は次数dまで0埋めし、shift係数では(−1)^{j−i}を掛ける。M_1のrankが小さくても長さd+1を維持する。

## 復習の核

- N=3で3本のedge weightからtree3通りの生成多項式を直接展開し、Laplacian cofactor、係数reverse、shift後の符号が一致するか確認する。

## 計算量と制約

### 時間

O(N³)。Cの反転・行列積がO(d³)、Hessenberg化はO(d²)回の消去で行・列各O(d)。p_iの各項の係数更新はO(k)、全i,kの和はO(d³)。係数反転はO(d)、上の二項展開によるshiftはO(d²)。a=1が必ず正則なので期待時間ではなく決定的な上界。

### 空間

O(N²)。定数個の密行列、p_0,…,p_dの合計O(d²)係数、階乗表・shift係数のO(d)作業領域。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 500; P is a permutation of (1,2,\ldots,N).

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/editorial/7356) — source-abc323-editorial-7356-8e3292da3a2b2feb61e13f336e46bb0792b987da9de409b538dc51805a9a9b37
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc323/tasks/abc323_g) — source-abc323-g-problem-aa2b668975ee5b61998c77543746047f4e34f404d488bff153ab12768784bcda
