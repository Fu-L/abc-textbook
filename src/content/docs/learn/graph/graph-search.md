---
title: "状態グラフ探索・到達関係"
description: "「状態グラフ探索・到達関係」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 87
---

# 状態グラフ探索・到達関係

導入対象の目安: **緑色（800–1199）**。入力の頂点以外にも状態を作り、探索と到達関係を使う入口。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

探索は、今いる頂点から辺をたどり、どこまで到達できるかを調べる方法である。到達の有無を知りたいのか、最短の辺数を知りたいのかで、頂点を調べる順序の意味が変わる。

入力がグラフでなくても、問題の状態を頂点、合法な1回の操作を辺とみなせば探索を使える。長距離に及ぶ効果が通行条件を決める問題では、先に[方向別の走査](/learn/graph/directional-grid-effect-scan/)で通行可能な場所を確定し、その後で探索する。

## 考え方

### 到達できることと、最短で到達すること

独自の小例として、五つの頂点 $$s,a,b,c,t$$ と、無向辺 $$sa,ac,ct,sb,bt$$ だけを持つグラフを考える。$$s$$ から $$t$$ へは次の二つの経路がある。

- $$s\to a\to c\to t$$：3辺。
- $$s\to b\to t$$：2辺。

深さ優先探索（DFS）は、未訪問の隣接頂点へ進み、そこから先を調べ終えたら戻る。$$s$$ から先に $$a$$ を選べば、$$t$$ に初めて着く経路は3辺になり得る。到達できることは分かるが、最初に見つけた経路が最短とは限らない。到達判定では、頂点へ入る時点で探索全体の訪問済み記録 `visited` に印を付け、戻っても消さない。どの経路で来ても、その頂点から進める先は同じなので、一度調べればよい。初めて各頂点へ進んだ辺を残せば探索木も得られる。

幅優先探索（BFS）は、先に追加した頂点から取り出すFIFOのキューを使う。$$s$$ の距離を0としてキューへ入れ、頂点 $$v$$ を取り出したら、未訪問の隣接頂点 $$u$$ に距離 $$d(u)=d(v)+1$$ を記録し、その場で訪問済みにして末尾へ追加する。小例で $$a,b$$ の順に調べると、キューは次のようになる。左端が次に取り出す頂点で、括弧内は距離である。

| 処理直後 | 未処理のキュー |
| --- | --- |
| $$s$$ を追加 | $$s(0)$$ |
| $$s$$ を展開 | $$a(1),b(1)$$ |
| $$a$$ を展開 | $$b(1),c(2)$$ |
| $$b$$ を展開 | $$c(2),t(2)$$ |

$$c$$ より先に $$b$$ を処理するので、$$t$$ の距離は2で確定する。後で $$c$$ から $$t$$ を調べても、既に訪問済みなので追加しない。

### キューの距離層が最短性を保証する理由

同じ最短距離の頂点の集まりを距離層と呼ぶ。先頭の距離が $$d$$ のとき、キューには未処理の距離 $$d$$ の頂点、その後ろに距離 $$d+1$$ の頂点しかない。最初は距離0の始点だけであり、距離 $$d$$ の頂点から新しく追加する頂点の距離は $$d+1$$ だからである。FIFOでは残りの距離 $$d$$ の頂点を追い越さず、次の層を先に展開することもない。距離 $$d$$ の層を処理し終えると、同じ性質が次の層へ引き継がれる。

距離 $$d$$ の頂点から初めて見つけた頂点に、$$d+1$$ 辺より短い経路があると仮定する。その経路の直前の頂点には $$d$$ 辺未満で着けるため、もっと前の層で処理され、この頂点も既に発見されているはずである。これは初めての発見に反する。従って、キューへの**追加時に記録する距離が最短距離**となる。同時に訪問を記録すれば、複数の隣接頂点から同じ頂点を重複追加することもない。

### 辺の向きと、訪問済みの意味を確認する

無向グラフなら、一つの始点から到達できる頂点の集合が、その始点の連結成分になる。有向グラフでは辺の向きにだけ進む。辺 $$s\to a$$ が1本だけなら、$$s$$ から $$a$$ には着けても逆には着けない。一方向の到達を、無向の連結性や相互に到達できる関係と同一視しない。

ここまでの訪問済み記録は「この頂点は既に発見し、そこから先を調べる対象にした」という意味である。履歴によって次の操作が変わる場合は、同じ位置でも別の状態として扱う必要がある。また、異なる経路を列挙する目的では、到達判定と同じ訪問制限は使えない。この区別を[状態グラフのモデリングと探索](/learn/graph/state-graph-search/)で具体化する。

## 成立条件と計算量

頂点数を $$V$$、辺数を $$E$$ とする。隣接リストを使い、各頂点を一度だけ展開するDFS・BFSなら、各頂点の処理と隣接辺の走査を合わせて $$O(V+E)$$ 時間となる。無向辺は両端から1回ずつ調べる。入力の隣接リストが $$O(V+E)$$、訪問記録とBFSのキューが $$O(V)$$ なので、全体で $$O(V+E)$$ 空間を使う。再帰DFSでは、最悪で $$V$$ 段になる呼出しスタックも必要である。

BFSが追加時に最短距離を確定できるのは、すべての辺の費用が1のときである。同じ正の費用なら最短辺数にその費用を掛けられるが、辺ごとに費用が違うとFIFOの距離層は成り立たない。[最短路モデル](/learn/graph/weighted-shortest-path/)で重みに合う方法を選ぶ。到達不能な頂点は未訪問のまま残し、始点の距離0と区別する。

概念上の親: [グラフアルゴリズム](/learn/graph/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

### このUnitでは扱わないもの

- eventをsortしてactive集合を増減するsweep line。
- 非負重み付き距離の緩和・確定と最短路certificateの復元。

## 下位単元

- [状態グラフのモデリングと探索](/learn/graph/state-graph-search/) — 緑色
- [推移閉包](/learn/graph/transitive-closure/) — 水色
- [方向別grid scanによる長距離効果の前計算](/learn/graph/directional-grid-effect-scan/) — 水色

## 問題一覧

この単元に直接配置する問題はありません。下位単元または関連問題を参照してください。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC257 G「Prefix Concatenation」](https://atcoder.jp/contests/abc257/tasks/abc257_g) — 主題: [Z algorithmによるprefix matching](/learn/string/z-algorithm/)（既知のZ-boxを再利用してZ arrayを線形時間で構成し、各位置から始まる接尾辞と文字列全体のprefixの最大一致長を、文字列連結によるprefix照合へ利用できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC374 G「Only One Product Name」](https://atcoder.jp/contests/abc374/tasks/abc374_g) — 主題: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [推移閉包](/learn/graph/transitive-closure/)（各始点探索または中継許可集合の段階不変条件を保つWarshall更新で推移閉包を求め、必要なら初回到達段階も記録できる。） / [SCC・縮約DAG・トポロジカル順序](/learn/graph/scc-condensation/)（有向グラフの閉路を扱い、必要なら強連結成分へ縮約してDAG順に情報を伝播できる。）。
- [ABC413 F「No Passage」](https://atcoder.jp/contests/abc413/tasks/abc413_f) — 主題: [循環局面の後退解析とminimax距離](/learn/dynamic-programming/cyclic-minimax-game/)（終了局面から逆辺を辿り、終了側が一手選べば確定するOR局面と全手の確定を待つAND局面を区別する。未確定局面で無限継続を判定し、非負重みなら優先度付きキューで有限なminimax距離を確定する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC417 E「A Path in A Dictionary」](https://atcoder.jp/contests/abc417/tasks/abc417_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。

## 根拠

- [ABC241 F 公式解説](https://atcoder.jp/contests/abc241/editorial/3451)
- [ABC241 F 公式問題文](https://atcoder.jp/contests/abc241/tasks/abc241_f)
- [ABC244 F 公式解説](https://atcoder.jp/contests/abc244/editorial/3599)
- [ABC244 F 公式問題文](https://atcoder.jp/contests/abc244/tasks/abc244_f)
- [ABC257 G 公式解説](https://atcoder.jp/contests/abc257/editorial/4185)
- [ABC257 G 公式問題文](https://atcoder.jp/contests/abc257/tasks/abc257_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-graph-search`
