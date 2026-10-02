---
title: "01 on Tree・親先行順序のcluster縮約"
description: "「01 on Tree・親先行順序のcluster縮約」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 144
---

# 01 on Tree・親先行順序のcluster縮約

習得対象の目安: **橙色（2400–2799）**。親先行制約の交換比較量を導き、clusterをheapとDSUで縮約する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### 01 on Tree・親先行順序のcluster縮約

親が子より先という順序制約の下でclusterの交換比較量を導き、priority queueとDSUで最良clusterを親へ縮約する。

### 習得する技能

- 親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。

## 考え方

### 標準形とblockの交換比較

根付き木の各頂点に0か1が書かれているとする。親が子より先になる頂点順序を選び、並べた01列の転倒数、すなわち「1が0より前にある組の数」を最小化する。頂点に固定順の01列が書かれている場合も、各列を分割しないblockとして同じ算法を使える。

block Aには、0の個数C0(A)、1の個数C1(A)、内部転倒数I(A)を持つ。Aの後にBを連結すると、新たな転倒はAの1とBの0の組だけなので、`I(AB)=I(A)+I(B)+C1(A)C0(B)`。したがってABとBAの費用差は `C1(A)C0(B)−C1(B)C0(A)` となる。

AをBより先に置く方がよい条件はC1(A)C0(B)≤C1(B)C0(A)。C0>0ならC1/C0の小さい順、同値にC0/C1の大きい順である。除算せず交差積で比較すれば、全て0のblock（最優先）や全て1のblock（最後）も扱える。等しい比較値ではどちらの順でも費用が同じである。

### 最優先blockを親へ連結できる理由

現在の縮約木で根以外の最優先block Bを選び、その親blockをPとする。blockを分割しない最適順序を一つ取る。PとBの間の各block XはBの祖先ではない（直接の親がP）し、子孫でもない（子孫はBより後）。よってBをそれらの直前へ動かしても先行制約を壊さない。BはX以上に優先されるため、上の費用差により交換するたび費用は増えない。

したがって、Pの直後にBがある最適順序が必ず存在する。PとBを内部順PBの一blockへ連結し、C0・C1をそれぞれ加算、Iを上式で更新する。新blockの親はPの親で、PまたはBの外部の子は新blockの子になる。縮約前のPBが隣接する順序と縮約後の順序は費用を保って対応するため、これを繰り返して最適解を構成できる。根は他のblockへ連結できないので、最優先の選択対象から外す。

各頂点を一blockとして開始し、根以外を比較量のheapへ入れる。取り出したBの現在の親PをDSUで求めて連結し、更新したPを根でなければheapへ入れ直す。古い統計のheap要素には版番号を付け、削除済み・旧版なら捨てる。DSUの代表とblockの先頭頂点は別の情報として保持し、親は先頭頂点の元の親が属する成分から引く。復元には各blockの先頭・末尾と頂点間nextを持ち、Pの末尾へBの先頭を接続する。毎回配列をコピーする必要はない。

[ABC376 G公式解説](https://atcoder.jp/contests/abc376/editorial/11196)のような `Σ_i i a[q_i]` の最小化も、頂点vのblockを「a_v個の0の後に1」とすれば、各0に寄与する先行blockの1の数が位置iなので転倒数へ写る。大きなa_v個の0を実際に展開せず、C0=a_v・C1=1の統計だけで処理する。

## 成立条件と計算量

N blockからN−1回連結し、各回のheap追加・無効化は定数個なのでO(N log N)、DSUはO(N α(N))、記憶と復元はO(N)。単一の親を持つ木の先行制約と、上記の非負の個数からなる転倒費用が前提である。一般DAGや任意の重み付き目的関数へ比率順を流用しない。交差積と累積転倒数には十分な整数幅を使い、連結したblockの内部順を固定する。

概念上の親: [木構造](/learn/tree/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)、[交換論から選択順を導く](/learn/modeling/greedy-exchange/)。

このUnitを直接前提とする単元: なし。

DSUによる連結成分管理・縮約・貪欲法と交換論で得た考え方と実装を再利用し、01 on Tree・親先行順序のcluster縮約の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- 01 on Tree・親先行順序のcluster縮約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)（親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC376 G 公式解説](https://atcoder.jp/contests/abc376/editorial/11196)
- [ABC376 G 公式問題文](https://atcoder.jp/contests/abc376/tasks/abc376_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-tree-precedence-contraction`
