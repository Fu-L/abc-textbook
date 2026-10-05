---
title: "半順序・Dilworth・最大反鎖"
description: "「半順序・Dilworth・最大反鎖」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 199
---

# 半順序・Dilworth・最大反鎖

習得対象の目安: **黄色（2000–2399）**。半順序のchain・antichainを整理し、matchingやLDSとの対応を使う。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 半順序・Dilworth・最大反鎖

比較可能性をposetとして明示し、antichain・chain cover・LDS・bipartite matching/min-cutの双対関係を選んで最適化する。

### 習得する技能

- 対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。

## 考え方

半順序≤は反射律・反対称律・推移律を満たす比較関係である。異なる要素の厳密な比較をx<yと書く。chainは任意の二要素が比較可能な集合、antichain（反鎖）は異なる二要素がどちらの向きにも比較できない集合である。chainへ全要素を分割する最小本数と、反鎖の最大要素数を結び付ける。

### chain分割とmatching

各要素xの左右コピーx_L,x_Rを作り、すべてのx<yに辺x_L→y_Rを張る。最大matching Mの辺をx→yへ戻すと、各要素の直前・直後は高々一つである。厳密順序にはcycleがないので、選択辺はchainをつなぐpathへ分かれる。初めのN本のsingletonから辺一本ごとに一本減り、chain数はN−|M|となる。逆にK本のchain分割の隣接要素をつなぐとN−K辺のmatchingを作れるため、最小chain数=N−最大matching数である。

各chainから反鎖が取れるのは高々一要素なので、どの反鎖もN−|M|以下。一方、二部グラフの最小被覆CはKőnigの定理で|M|頂点となる。左右どちらのコピーもCに含まれない要素を選ぶと、比較辺が覆われなくなることはないので反鎖であり、少なくともN−|M|要素ある。上下界が一致し、最大反鎖数=最小chain数というDilworthの定理が得られる。前提単元の到達集合を使えば、反鎖は{x: x_L∈Z_Lかつx_R∉Z_R}として復元できる。

### 重みを容量でまとめる

要素xに非負整数重みw(x)があり、反鎖の重み和を最大化するとする。xをw(x)個の互いに比較不能なコピーへ置き換え、x<yならxの全コピーからyの全コピーへ比較を置く。最適反鎖では選んだ要素のコピーを全部取ってよいので、元の最大重みと複製後の最大要素数が一致する。同じ要素のコピー同士を比較してしまうと、一つしか取れなくなりこの対応が壊れる。

W=Σ_x w(x)とする。複製後のmatchingを巨大なグラフに展開せず、s→x_Lとx_R→tの容量をw(x)、x<yの比較辺x_L→y_Rの容量をINF=W+1として最大流Fを求める。整数流はコピー間のmatchingへ展開でき、逆にmatchingをまとめればこのnetworkの整数流になる。よって答えはW−F。容量1の非重み付き帰着を、頂点の個数ではなく容量で圧縮した形である。

### cutから反鎖を復元する

最大流後に残余辺でsから到達する集合をSとし、S_L={x: x_L∈S}、S_R={x: x_R∈S}とする。INF辺を横切らないので、A=S_L∖S_Rは反鎖である。x<yがともにAなら、比較辺x_L→y_Rがcutを横切ってしまう。

このcutの容量はW−w(A)+w(B)、B=S_R∖S_Lである。どんな反鎖A_0についても、その厳密な上方集合U={y: あるx∈A_0がx<y}を用い、source側をS_L=A_0∪U、S_R=Uとすれば、推移律により比較辺を横切らず容量W−w(A_0)のcutを作れる。最適反鎖の重みをOPTとすると、すべてのcutはW−OPT以上であり、上の構成でその値を達成できる。

したがって最小cutから得たAではw(A)−w(B)=OPT。A自身が反鎖でw(A)≤OPT、重みは非負なのでw(B)=0、w(A)=OPTとなる。値W−Fだけでなく、実際に選ぶ要素もAとして復元できる。

### 推移関係と同一要素をどう扱うか

比較辺は推移的な厳密順序を表す必要がある。DAGの元の辺だけを用いるとchain分割が別の問題になる。三要素x<y<zで比較辺x→zを省き、重みが2,1,2なら、容量帰着は両端を同時に選べると誤って判断し値3を返すが、正しい反鎖の最大重みは2である。必要なら各始点探索などで到達関係を作る。

部分文字列の包含などで等しい対象が複数ある場合、両方向に比較辺を置くと厳密順序でなくなる。等しい対象から高々一つを選ぶモデルなら最大重みの代表だけを残すか、同値な対象をID順のchainへする。自分自身への比較辺も置かない。これは重み分の「互いに比較不能なコピー」と、入力中の「同時に選べない同一対象」との違いである。

添字順に並ぶ列の非減少部分列をchainとする場合は、i<jかつa_i≤a_jを順序にする。反鎖は厳密減少部分列になるため、最小非減少部分列分割数=LDS長が得られる。値が等しいときの比較を変えるなら、LIS/LDSの狭義・広義もそれに合わせる。

## 成立条件と計算量

N要素、比較関係E本の非重み付き帰着は、関係を作る費用にO((N+E)√N)の二部matchingを加える。重み付きnetworkは2N+2頂点、O(N+E)辺で、一般容量のDinicならO(N²(N+E))が上界となる。E=O(N²)ならO(N⁴)であり、単位容量の速い上界を流用しない。計算量にW個のコピーの展開は含めず、容量と合計Wが収まる型を使う。最大流自体は[最大流・最小カット](/learn/graph/max-flow-min-cut/)の算法を利用できる。負重み要素は選ぶ必要がないので、反鎖の最大化だけなら重み0へ置換できる。関係の推移閉包を計算する場合はその時間・空間も数える。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)、[列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。

このUnitを直接前提とする単元: なし。

二部matching・Hall・Kőnig・列・subsequence DPで得た考え方と実装を再利用し、半順序・Dilworth・最大反鎖の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 半順序・Dilworth・最大反鎖の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC237 Ex「Hakata」](https://atcoder.jp/contests/abc237/tasks/abc237_h) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC354 G「Select Strings」](https://atcoder.jp/contests/abc354/tasks/abc354_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC237 H 公式解説](https://atcoder.jp/contests/abc237/editorial/3321)
- [ABC237 H 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_h)
- [ABC354 G 公式解説](https://atcoder.jp/contests/abc354/editorial/10029)
- [ABC354 G 公式問題文](https://atcoder.jp/contests/abc354/tasks/abc354_g)
- [ABC457 G 公式解説](https://atcoder.jp/contests/abc457/editorial/20073)
- [ABC457 G 公式問題文](https://atcoder.jp/contests/abc457/tasks/abc457_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-poset-dilworth-antichain`
