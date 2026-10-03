---
title: "ABC383-G — Bar Cover"
draft: true
authoringUnit: {"problemId":"abc383-g","docPath":"src/content/docs/problems/string-geometry/outcome-allocate-by-convex-marginal-costs/outcome-allocate-by-convex-marginal-costs-shard-001/abc383-g.md","learningOutcomeIds":["outcome-allocate-by-convex-marginal-costs"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-basic-convex-optimization","unit-recursive-divide-and-conquer"],"excludedTopics":["分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-separable-convex-marginals","tag-recursive-divide-and-conquer"],"sourceRevisionIds":["source-abc383-editorial-11500-ab0a48e7cda2a99f752f9faef52005366b6bdf6afeb68d0ce190a22a973b8251","source-abc383-g-problem-72be83610d4356251b6c9b25d5441578f5fdd5ac5db4c535baf1c323433e9444"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"許可開始位置を固定した各状態で、i−1本とi+1本の等長barの衝突グラフは次数高々2の二部グラフとなる。青が一本多い成分の色交換で総利得を保存したi本ずつの合法配置が得られるため、負利得も含め2F_i≥F_{i−1}+F_{i+1}。これは全境界状態に適用でき、凹列のmaxの一般的な閉性を仮定しない。短い区間は0〜2本の合法候補を直接列挙する。大きな区間では中央禁止幅jとK−1−jが全合法な左右選択を覆い、各組に衝突を作らない。子列は凹なので、max-plus積は非増加差分のmergeで正確に得られる。各jの値列の最大が親の最適列になり、rootの境界禁止0の列が全本数の答えとなる。","sourceRevisionIds":["source-abc383-editorial-11500-ab0a48e7cda2a99f752f9faef52005366b6bdf6afeb68d0ce190a22a973b8251","source-abc383-g-problem-72be83610d4356251b6c9b25d5441578f5fdd5ac5db4c535baf1c323433e9444"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [分離凸・凹の単調限界値選択](src/content/docs/learn/geometry-optimization/separable-convex-marginals.md)

- 分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [一次元凸・単峰最適化](src/content/docs/learn/geometry-optimization/basic-convex-optimization.md)
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md)

対象外:

- 分離凸・凹の単調限界値選択の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

長さKのbarを置く開始位置iの利得は連続和B_iであり、bar同士が重ならない条件は選んだ開始位置の距離がK以上と言い換えられる。

許可する開始位置の範囲を固定し、ちょうど i 本の最大利得を F_i とする。凹性を調べるには、i−1本とi+1本の最適配置を赤・青で重ねる。同色barは互いに重ならない。長さが全て K なので、一つのbarと重なる他色のbarは高々二本しかない。三本と重なるなら、他色の最左・最右の開始位置は2K以上離れるが、当該barと重なる開始位置の幅は2K未満なので矛盾する。

barを頂点、二色間の重なりを辺とする衝突グラフは次数高々2の二部グラフであり、道・偶閉路・孤立頂点へ分かれる。各成分の色別本数差は0か±1。合計の青−赤の差は2なので、青が一本多い成分を一つ色交換すれば、双方i本の非衝突配置になる。合計利得は保存され、2F_i≥F_{i−1}+F_{i+1}を得る。利得が負でも同じ議論である。

左右端の開始位置を禁止しても、許可範囲内の配置について同じ衝突グラフを作れるので、全境界状態でこの凹性が成立する。一般の異なる長さの区間では次数3以上があり得て、この証明は使えない。

採用する候補: 境界から選べない長さを状態に持つ分割統治DPを、離散凹列の傾きmergeで結合する

K≤5なので左右境界状態はO(K²)。各状態の実現可能な本数列を非増加の差分列として持ち、中央の禁止幅を全て試して線形mergeする。短い区間の直接計算を含む時間はO(NK² log(N+1)+NK³)となる。

棄却する候補: dp[position][count]で次の選択位置を遷移する

全countの答えを持つ二次元DPはΘ(N^2)状態になり、N=2×10^5では扱えない。

Bの添字区間 [l,r) で、許可開始位置が [l+x,r−y) となる本数別最適列を D[l,r,x,y] とする（0≤x,y<K）。許可範囲が空なら0本の値0だけが可能。長さ r−l≤2K の区間は直接計算する。この範囲で置けるbarは高々二本なので、許可位置の0個・1個・距離K以上の2個の全候補から値列を作れる。これを基底にすれば、短い子で外側の禁止幅が子を突き抜ける曖昧さを避けられる。

長さが2Kより大きい区間では m=floor((l+r)/2) で二分し、両子の長さはK以上となる。中央の禁止幅 j=0,…,K−1 ごとに、左 D[l,m,x,j] と右 D[m,r,K−1−j,y] を結合する。最後の左開始位置は高々m−j−1、最初の右開始位置は少なくともm+K−1−jなので距離K以上。逆に合法な左右選択の最終左位置a・先頭右位置bは、m+K−1−b≤j≤m−1−aを満たすjで表される。片側が空なら、その側を全禁止する必要はなく、j=0またはK−1で他方の中央禁止をなくせばよい。

二列 U,V のmax-plus積は Z_t=max_{a+b=t}(U_a+V_b)。U_0=V_0=0で、両列の非増加差分を大きい順にmergeすると各tの最大が得られる。同値では各列内の順序を守る。全jのZ_tの最大をDの値列とし、その後に差分を作り直す。親の凹性は、このmax操作からの帰納ではなく、許可範囲を固定した上の交換証明による。

Aの長さK window sum列Bを作る。区間を再帰分割し、各(x,y)境界状態についてj=0..K-1の左右DPを凹列としてmergeし最大を取る。rootの制約なし列から各bar本数の答えを得る。

## 典型の発動条件

### 分割統治DPと境界状態

発動条件: 局所制約が区間結合時に境界近傍だけで干渉するとき。

左右端の禁止幅をK未満で持ち、中央衝突だけを調整する。

### 離散凹列のmax-plus convolution

発動条件: 選択個数ごとの最適値が限界利得非増加になるとき。

二列の差分を降順mergeしてconvolutionを線形化する。

## 問題固有の要素

Kが小さいのは遷移幅だけでなく、区間を結ぶ際に伝えるべき情報が両端各K通りしかないことを意味する。

別の問題へ持ち帰る視点: 長距離の答え数が多くても、相互作用が境界幅に局在し価値列が凹なら分割統治と傾き表現を検討する。

## 正当性

許可開始位置を固定した各状態で、i−1本とi+1本の等長barの衝突グラフは次数高々2の二部グラフとなる。青が一本多い成分の色交換で総利得を保存したi本ずつの合法配置が得られるため、負利得も含め2F_i≥F_{i−1}+F_{i+1}。これは全境界状態に適用でき、凹列のmaxの一般的な閉性を仮定しない。短い区間は0〜2本の合法候補を直接列挙する。大きな区間では中央禁止幅jとK−1−jが全合法な左右選択を覆い、各組に衝突を作らない。子列は凹なので、max-plus積は非増加差分のmergeで正確に得られる。各jの値列の最大が親の最適列になり、rootの境界禁止0の列が全本数の答えとなる。

## 実装上の注意

- 不可能な選択個数は負の無限大とし、短い区間ではx,yの禁止が重なる場合を正規化する。負のA_iでも0本の値を基準に壊さない。

## 復習の核

- N≤12では開始位置subsetを全列挙し、負利得、K=1、区間長<K、中央直前直後を選ぶcaseで全個数のDP列と凹性を照合する。

## 計算量と制約

### 時間

O(NK² log(N+1)+NK³)。長さs>2Kの区間で実現可能な選択数はO(s/K)なので、K²境界状態×K中央split×O(s/K)のmergeでO(K²s)。同深さの区間長の和はO(N)、深さO(log N)よりO(NK² log(N+1))。長さ≤2Kの基底は一状態O(K²)、全境界O(K⁴)、基底数O(N/K)でO(NK³)（全体が短ければ直接O(K²N²)≤O(NK³)）。不可能な本数を含む長さsの配列を作らず、可能な係数だけを持つ。

### 空間

O(K²N)の安全な上界。深さ優先で子を解放し、各列は実現可能な本数までだけ保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq K \leq \min(5,N); -10^9 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/editorial/11500) — source-abc383-editorial-11500-ab0a48e7cda2a99f752f9faef52005366b6bdf6afeb68d0ce190a22a973b8251
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc383/tasks/abc383_g) — source-abc383-g-problem-72be83610d4356251b6c9b25d5441578f5fdd5ac5db4c535baf1c323433e9444
