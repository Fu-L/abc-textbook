---
title: "ABC328-G — Cut and Reorder"
draft: true
authoringUnit: {"problemId":"abc328-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-enumerate-subset-state-space/outcome-enumerate-subset-state-space-shard-001/abc328-g.md","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc328-editorial-7644-ac85e40ab4cc26b49b938335f8909857cf44b865ee29e80cc86036e1b17a7995","source-abc328-g-problem-d42d13198dfc03048e75095b0c276abbeeb2f45adc94365aabd2e3709c5e0f43"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"並べた出力prefixに使った元添字集合Sを状態とする。次のblockは未使用の連続区間[l,r]であり、置かれるtarget位置は|S|から一意に決まる。よって内部順を保つblockの絶対差costと、空prefixでなければ境界cost Cを加える遷移が目的関数と一致する。任意の分割とblock順はこの遷移列になる。逆にdisjoint intervalを全添字まで追加した遷移列は実際の分割・並べ替えを表す。無駄に分けた隣接blockは統合遷移も存在するため、全状態の最小化は最適解を失わない。","sourceRevisionIds":["source-abc328-editorial-7644-ac85e40ab4cc26b49b938335f8909857cf44b865ee29e80cc86036e1b17a7995","source-abc328-g-problem-d42d13198dfc03048e75095b0c276abbeeb2f45adc94365aabd2e3709c5e0f43"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,A=(2,1),B=(1,2),C=1。","procedure":["切らない並びは差1+1=2。","二singletonへ切って交換すると差0、境界cost1。"],"executionTarget":null,"expectedResult":"最小1。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-state"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-subset-state-space"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"全maskから全N²intervalを列挙したという上界だけで十分か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"disjoint制約により長さk intervalを加えられるmaskは2^{N−k}個。長いblockほど対応maskが減り総遷移O(N2ᴺ)となる。"},"answer":{"reasoningOrVerification":"disjoint制約により長さk intervalを加えられるmaskは2^{N−k}個。長いblockほど対応maskが減り総遷移O(N2ᴺ)となる。","procedure":["具体例の各状態・寄与を再計算する。","disjoint制約により長さk intervalを加えられるmaskは2^{N−k}個。長いblockほど対応maskが減り総遷移O(N2ᴺ)となる。"],"expectedResult":"disjoint制約により長さk intervalを加えられるmaskは2^{N−k}個。長いblockほど対応maskが減り総遷移O(N2ᴺ)となる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

- bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 部分集合・bitmask状態DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

split-and-reorderを複数回行っても、使った全cut位置でAを細分したblockを1回で同じ順に並べればよく、reorder操作は高々1回でよい。

reorder後のAは、元indexの互いに素な連続区間を各区間内順序を保ったまま並べたpermutationとして表せる。

block数がqならcut costは(q-1)Cで、各出力位置iに元indexp_iを置くvalue調整costは|A_{p_i}-B_i|である。

採用する候補: 使用済み元index集合Sを状態にし、未使用の連続区間を次blockとしてappendするsubset DP。

N≤22で全permutation N!を避け、全interval遷移数をO(N2^N)へ抑えつつblock costと位置別差を加算できる。

棄却する候補: Aの全permutationを列挙し、各permutationの最小cut数とvalue差を評価する。

N=22でN!候補は不可能である。

棄却する候補: 各B_iへ近いA_jを独立にassignmentするminimum-cost matching。

選んだindex順が元Aのcontiguous block列として実現できるcut costを無視する。

dp[S]は出力prefix長|S|までにSのindexを何らかのblock順で置いた最小確定costとし、次block[l,r]のtarget位置は|S|+1から自動的に決まる。

Sと[l,r]がdisjointならappend可能で、Sが非空なら新block境界cost Cを1回加える。連続してmerge可能な冗長block表現は、より早い1区間遷移が同じ並びを安く表す。

長さk intervalを追加できるmaskは2^{N-k}個なので、全mask・全intervalの総遷移数はO(N2^N)に収まる。

dp[0]=0、他INFとする。各mask Sについて全original interval [l,r] whose bitmask I is disjoint from Sを列挙し、pos=popcount(S)としてadd=Σ_{t=0}^{r-l}|A_{l+t}-B_{pos+1+t}|を求める。dp[S|I]=min(dp[S|I],dp[S]+add+(S≠0?C:0))と更新する。intervalとtarget開始位置ごとのaddは前計算または延長時の累積でO(1)取得し、dp[(1<<N)-1]を出力する。

## 典型の発動条件

### subset DPへのblock append

発動条件: 元列をcontiguous blockへ分け、block順を自由に並べてtarget列へ合わせるとき。

使用済みindex maskへ未使用interval maskを追加する。

### 操作合成による一回化

発動条件: 複数回のcut/reorderが、全cutの共通細分化を一度並べ替える操作で再現できるとき。

最終block partitionだけを最適化する。

### interval長別の遷移総数評価

発動条件: subset状態からdisjoint contiguous intervalを追加するとき。

長さkごとに2^{N-k}(N+1-k)を足してO(N2^N)と見る。

## 問題固有の要素

出力prefixの具体的な元index順を保持せず、同じ使用済み集合に至る全block順の最小costだけを残しても、次intervalのvalue costはprefix長|S|だけで決まる。

別の問題へ持ち帰る視点: subset DPでは履歴順が目的関数へ影響しても、将来寄与が集合sizeと新blockだけに依存するなら最小履歴へmergeできる。

## 正当性

並べた出力prefixに使った元添字集合Sを状態とする。次のblockは未使用の連続区間[l,r]であり、置かれるtarget位置は|S|から一意に決まる。よって内部順を保つblockの絶対差costと、空prefixでなければ境界cost Cを加える遷移が目的関数と一致する。任意の分割とblock順はこの遷移列になる。逆にdisjoint intervalを全添字まで追加した遷移列は実際の分割・並べ替えを表す。無駄に分けた隣接blockは統合遷移も存在するため、全状態の最小化は最適解を失わない。

## 実装上の注意

- value差とcut costの総和は10^16級になり得るため64bit整数の上限に余裕あるINFを選び、加算overflowを避ける。
- 最初のblockにはCを加えず、intervalの出力先B indexがpopcount(mask)から始まることを揃える。
- N=22で1<<Nは32bit内だがmask計算型とbit shift literalを明示する。

## 復習の核

- rotationを2 blockで作る例と、元順の1 block例をDP遷移にし、最初のblock無料・以後CとB位置の対応を確認する。

## 計算量と制約

### 時間

O(N2ᴺ+N³)、interval追加数を長さ別にΣ(N−k+1)2^{N−k}と数える。

### 空間

O(2ᴺ+N³)、subset DPとinterval/target開始cost。

### 制約との対応

公式制約の確認範囲: Time limit: 2.8 sec; Memory limit: 512 MiB; Constraints: 1\leq N\leq22; 1\leq C\leq10^{15}; 1\leq A_i\leq10^{15}\ (1\leq i\leq N); 1\leq B_i\leq10^{15}\ (1\leq i\leq N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,A=(2,1),B=(1,2),C=1。

1. 切らない並びは差1+1=2。
2. 二singletonへ切って交換すると差0、境界cost1。

期待される結果: 最小1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全maskから全N²intervalを列挙したという上界だけで十分か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

disjoint制約により長さk intervalを加えられるmaskは2^{N−k}個。長いblockほど対応maskが減り総遷移O(N2ᴺ)となる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc328/editorial/7644) — source-abc328-editorial-7644-ac85e40ab4cc26b49b938335f8909857cf44b865ee29e80cc86036e1b17a7995
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc328/tasks/abc328_g) — source-abc328-g-problem-d42d13198dfc03048e75095b0c276abbeeb2f45adc94365aabd2e3709c5e0f43
