---
title: "ABC420-F — kirinuki"
draft: true
authoringUnit: {"problemId":"abc420-f","docPath":"src/content/docs/problems/data-structures/outcome-build-cartesian-tree-decomposition/outcome-build-cartesian-tree-decomposition-shard-001/abc420-f.md","learningOutcomeIds":["outcome-build-cartesian-tree-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-monotone-stack-queue","unit-prefix-aggregate"],"excludedTopics":["最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。"],"tagIds":["tag-cartesian-tree","tag-monotone-stack-queue","tag-prefix-difference"],"sourceRevisionIds":["source-abc420-editorial-13741-3707893785f657ea0534c3a14747e11b63e4f398d30f858a61cc0ee929c15fa7","source-abc420-f-problem-e5255d1e68596a19e9632578192125b612d2b28436ace623ca5a7f368018ff95"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"a≤bとすればg(w)=w (1≤w≤a)、a (a<w≤b)、a+b-w (b<w≤a+b-1)。したがって各部分はαw+βで表せる。 q_w=floor(K/w)とwq_w=w floor(K/w)のprefixを用意すれば、threshold d=floor(K/h_i)でsplitしたΣg(w)min(h_i,q_w)を、各一次区間につき定数個のprefix差で求められる。 g(w)は三つの一次関数区間。min(h_i,floor(K/w))はw≤floor(K/h_i)でh_i、それ以降floor(K/w)なので、Σq_wとΣwq_wの前計算で各iを定数時間処理できる。","sourceRevisionIds":["source-abc420-editorial-13741-3707893785f657ea0534c3a14747e11b63e4f398d30f858a61cc0ee929c15fa7","source-abc420-f-problem-e5255d1e68596a19e9632578192125b612d2b28436ace623ca5a7f368018ff95"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-cartesian-tree-decomposition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"1×3盤面が全てdot、K=2。","procedure":["高さは(1,1,1)。幅1の長方形は3、幅2は2。","幅3は面積3で除外。等高さの担当は一意にする。"],"executionTarget":null,"expectedResult":"面積2以下のdot長方形は5個。","verificationStatus":"not_applicable","learningUnitIds":["unit-cartesian-tree"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-cartesian-tree-decomposition"],"prerequisiteIds":["unit-monotone-stack-queue","unit-prefix-aggregate"],"attainmentCondition":"同値を左右両方でstrict比較するとどうなるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"複数位置が同じ区間の最小値を担当し重複計数する。左右のstrict/non-strict規約を対にする必要がある。"},"answer":{"reasoningOrVerification":"複数位置が同じ区間の最小値を担当し重複計数する。左右のstrict/non-strict規約を対にする必要がある。","procedure":["具体例の各状態・寄与を再計算する。","複数位置が同じ区間の最小値を担当し重複計数する。左右のstrict/non-strict規約を対にする必要がある。"],"expectedResult":"複数位置が同じ区間の最小値を担当し重複計数する。左右のstrict/non-strict規約を対にする必要がある。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [大小関係をCartesian treeへ変換する](src/content/docs/learn/query/cartesian-tree.md)

- 配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [支配関係から不要な候補を単調stack・queueで削る](src/content/docs/learn/query/monotone-stack-queue.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 最近傍の大小関係だけを答える単調stack、および木を構成せず冪等演算へ答えるRMQ。

## 考察

bottom rowを固定し、各columnの上向き連続dot数h_jを更新すると、横interval幅wから作れるrectangle数はmin(min h on interval,floor(K/w))である。

各intervalをtie-break付き最小h_iへ一意に担当させると、iから左右へ伸ばせる長さa,bが決まり、幅wのinterval個数は増加・一定・減少する台形状の一次関数g(w)になる。

採用する候補: 各rowのhistogramにCartesian tree／monotonic stackでminimum担当範囲を求め、幅別寄与をfloor(K/w)のprefix sumsでO(1)集計する

g(w)は三つの一次関数区間。min(h_i,floor(K/w))はw≤floor(K/h_i)でh_i、それ以降floor(K/w)なので、Σq_wとΣwq_wの前計算で各iを定数時間処理できる。

棄却する候補: 全top/bottom row pairについて共通dot列を作り、全horizontal intervalを数える

row pairがO(N^2)、さらにcolumn走査が必要で面積制約NM≤5×10^6でも二乗規模になる。

a≤bとすればg(w)=w (1≤w≤a)、a (a<w≤b)、a+b-w (b<w≤a+b-1)。したがって各部分はαw+βで表せる。

q_w=floor(K/w)とwq_w=w floor(K/w)のprefixを用意すれば、threshold d=floor(K/h_i)でsplitしたΣg(w)min(h_i,q_w)を、各一次区間につき定数個のprefix差で求められる。

各bottom rowでh_jを更新し、(h_j,j)などの一意順序によるnearest smaller境界からa=i-l+1,b=r-i+1を得る。h_i=0はskipし、gの三rangeをd=K/h_iでも分割して、h_iΣ(αw+β)またはαΣwq_w+βΣq_wを足す。全rowの寄与を64 bitで合計する。

## 典型の発動条件

### histogram reduction

発動条件: all-dot subrectangleをbottom固定の連続高さ配列へ変換するとき。

各columnの連続dot数をrowごとにO(1)更新する。

### Cartesian tree／monotonic stack

発動条件: 全subarrayを一意なminimum位置へ割り当てたいとき。

tie-break付きnearest smaller境界から各iがminimumとなる左右extentを得る。

### floor値の重み付きprefix sum

発動条件: Σ(αw+β)floor(K/w)を多数rangeで求めたいとき。

floor(K/w)とw倍の二prefix配列を前計算する。

## 問題固有の要素

area≤Kを高さごとに列挙せず、interval minimum hと幅wのmin(h,K/w)へし、幅の選択multiplicityが一次関数になることまで利用する。

別の問題へ持ち帰る視点: subarray minimum寄与に長さ依存capが掛かる場合、担当範囲の長さ分布をpiecewise polynomial化し、cap列のmoment prefixと掛け合わせる。

## 正当性

a≤bとすればg(w)=w (1≤w≤a)、a (a<w≤b)、a+b-w (b<w≤a+b-1)。したがって各部分はαw+βで表せる。 q_w=floor(K/w)とwq_w=w floor(K/w)のprefixを用意すれば、threshold d=floor(K/h_i)でsplitしたΣg(w)min(h_i,q_w)を、各一次区間につき定数個のprefix差で求められる。 g(w)は三つの一次関数区間。min(h_i,floor(K/w))はw≤floor(K/h_i)でh_i、それ以降floor(K/w)なので、Σq_wとΣwq_wの前計算で各iを定数時間処理できる。

## 実装上の注意

- equal hの担当が重複しないよう左右stackのstrict/non-strict規約を対にする。h=0でK/hを計算せず、幅上限M、dのrange外clamp、答えは64 bitとする。

## 復習の核

- 全dot、全#、K=1、同じ高さが連続するhistogram、Kが全area以上の小gridをrectangle全列挙と比較する。

## 計算量と制約

### 時間

O(HW+W)、H,Wは盤面の高さと幅。floor(K/w)のprefixを先に構築する。

### 空間

O(W)、高さ・stack・prefix表。入力保存を含めるならO(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N, M, and K are integers.; 1 \le N,M \le 5 \times 10^5; 1 \le N \times M \le 5 \times 10^6; 1 \le K \le N \times M; S_i is a string of length M consisting of . and #.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

1×3盤面が全てdot、K=2。

1. 高さは(1,1,1)。幅1の長方形は3、幅2は2。
2. 幅3は面積3で除外。等高さの担当は一意にする。

期待される結果: 面積2以下のdot長方形は5個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同値を左右両方でstrict比較するとどうなるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

複数位置が同じ区間の最小値を担当し重複計数する。左右のstrict/non-strict規約を対にする必要がある。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc420/editorial/13741) — source-abc420-editorial-13741-3707893785f657ea0534c3a14747e11b63e4f398d30f858a61cc0ee929c15fa7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc420/tasks/abc420_f) — source-abc420-f-problem-e5255d1e68596a19e9632578192125b612d2b28436ace623ca5a7f368018ff95
