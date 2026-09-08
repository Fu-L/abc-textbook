---
title: "cycle space・fundamental cycle basis"
description: "前提からcycle space・fundamental cycle basisを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 105
---

# cycle space・fundamental cycle basis

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: なし
- この位置で学ぶ理由: 無向graphを探索してspanning forestを構築できることを土台に、偶数次数辺集合をF_2上のcycle spaceとして捉え、fundamental cycle basisとdim C(G)=M-N+C（Cは連結成分数）を導き、path族への単射へ接続する。

### この単元では扱わない範囲

- ord/lowを用いた橋・関節点の検出、および偶数次数辺集合のcycle-space構造を使わない単なるcycle検出。

## 発動条件と見分け方

### cycle space・fundamental cycle basis

無向graphで全頂点が偶数次数となる辺集合をF_2上のcycle space C(G)として扱い、連結成分数C、spanning forest F、各non-tree edge eが作る唯一のcycleからfundamental cycle basisとdim C(G)=M-N+Cを導く。連結graphではC=1なのでM-N+1となる。

検索語: cycle space、fundamental cycle basis、サイクル基底、サイクル空間

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる

題材: [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)

選定理由: terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。指定terminal間simple pathに絶対含まれない枝を除きたいとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 無向graphの全頂点が偶数次数となる辺集合をcycle spaceとして扱い、spanning forestとfundamental cycle basisから、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらにABC419-Gでは固定pathとのXORがcycle spaceへの写像となり、逆写像を持つことからs-t path族上で単射であると証明できる。

#### 観察

- 無向graphで全頂点の次数が偶数となる辺部分集合全体は、XOR（対称差）を加法とするF_2上のcycle spaceをなす。spanning forest Fを一つ固定すると、各non-tree edge eについてF+eに生じる唯一のcycleがfundamental cycle basisをなし、連結成分数をCとすればdim C(G)=M-N+Cとなる。この問題のgraphは連結なのでC=1、dim C(G)=M-N+1=Kである。
- 固定した1-N simple path P_0に対し、各simple path PをPhi(P)=P XOR P_0へ写す。端点を含む全頂点で次数parityが打ち消されるのでPhi(P)はcycle spaceに属し、さらにPhi(P) XOR P_0=PよりPを一意に復元できる。したがってPhiは単射で、simple path総数は|C(G)|=2^K以下である。
- 大graphのうちterminal以外のdegree1頂点は1-N simple pathに使われず、残ったdegree2 chainは長さweightをもつ一本のedgeへ縮約できる。

#### 候補を比較する

- **採用**: leaf pruning後にbranch/terminalだけのweighted multigraph Hへ縮約し、H上の全simple 1-N pathをDFS列挙して長さ別に数える — coreの頂点数≤2K+2、辺数≤3K+1で、simple path総数も≤2^K。前処理O(N)、列挙O(K2^K)になる。
- **棄却**: 元のN頂点graphでsimple path DFSをそのまま行う — path数自体は少なくても各pathが長いdegree2 chainを一頂点ずつ辿り、最大N2^K回の再帰呼出しになる。

#### 鍵となる着眼

- terminal以外のleafをqueueで反復削除しても1-N path集合は変わらない。削除後のdegree総和とcycle rankからdegree≥3頂点数は2K以下に抑えられる。
- 縮約edgeのweightを元chainのedge数にすれば、H上pathのweight和が元simple pathのedge数へ正確に戻る。parallel edgeは異なるchainとして別々に列挙する。

#### アルゴリズムへ接続する

degree1非terminalをpeelingし、S={1,N}∪{deg≥3}を作る。各S頂点から未処理edgeを辿って次のS頂点までのdegree2 chainをweighted edge化する。Hでvisited vertexを持つDFSを1から行い、N到着時にans[weightSum]++し、ans[1..N-1]を出力する。


## 転用するときの確認

- **2-core型leaf pruning**: 指定terminal間simple pathに絶対含まれない枝を除きたいとき。 適用: terminal以外のdegree1頂点を反復削除する。
- **degree-2 chain compression**: path選択に分岐を生まない長いchainがあり、長さだけ保持すればよいとき。 適用: branch/terminal間をweighted multiedgeへ縮約する。
- **cycle space・fundamental cycle basis**: 無向graphでcycle空間の次元M-N+Cが小さく、cycleやterminal間pathの候補数を理論的に抑えたいとき。 適用: 全頂点が偶数次数となる辺集合をF_2上のcycle spaceとし、spanning forest Fと各non-tree edge eが作る唯一のcycleからfundamental cycle basisを構成する。連結成分数Cを用いてdim C(G)=M-N+Cを導き、連結graphではC=1に特殊化する。ABC419-Gでは固定したpathとのXORがcycle spaceに入り、かつpathを復元できることから、simple s-t path数を2^(M-N+1)以下に抑える。
- **小さなcycle rankをparameterとする候補全列挙**: 候補数が2^K以下と証明でき、Kが十分小さいとき。 適用: 前処理で各1-N simple pathあたりの仕事量をO(K)に抑えたうえで、全候補をO(K 2^K)で直接評価する。
- **可逆なvisited状態によるsimple path backtracking**: 同じ頂点を再訪問しないpathを、現在の再帰pathだけを状態にして全列挙するとき。 適用: 頂点に入るときvisitedをmarkし、未訪問隣接へ再帰し、戻るときにunmarkして別branchの状態を汚さない。
- near-tree graphではcycle rankをparameterに、leaf除去とdegree2圧縮で小kernelを作って指数部をKだけに閉じ込める。
- tree・単一cycle・theta graph・複数連結成分のgraphで、spanning forestによるfundamental cycle basisとdim C(G)=M-N+Cを確認する。その後、s-tが同じ連結成分にある例で異なるs-t pathがP XOR P_0で異なるcycle-space要素へ写ることを検証し、terminalへの枝、parallel chains、不要leafが伸びる例を元graphのsimple path列挙と比較する。

## 到達確認

### 到達確認 1 — 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる

境界検証の元題材: [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g)

**課題**: ABC419 G「Count Simple Paths 2」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 無向graphの全頂点が偶数次数となる辺集合をcycle spaceとして扱い、spanning forestとfundamental cycle basisから、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらにABC419-Gでは固定pathとのXORがcycle spaceへの写像となり、逆写像を持つことからs-t path族上で単射であると証明できる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC419 G 公式解説](https://atcoder.jp/contests/abc419/editorial/13636)
- [ABC419 G 公式問題文](https://atcoder.jp/contests/abc419/tasks/abc419_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-cycle-space-basis`
