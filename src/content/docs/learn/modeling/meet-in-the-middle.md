---
title: "meet-in-the-middle・半分全列挙"
description: "「meet-in-the-middle・半分全列挙」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
headingAliases:
  "meet-in-the-middle半分全列挙-1": "前半と後半の必要な相手を探す"
sidebar:
  order: 8
---

# meet-in-the-middle・半分全列挙

習得対象の目安: **水色（1200–1599）**。全列挙と整列・検索を組み合わせ、指数の半減と照合条件を設計する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

概念上の親: [探索空間を分けて照合・再帰分割する](/learn/modeling/divide-enumeration/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 概要

全部を列挙できなくても、二つに分けた各側なら列挙できることがある。各側の候補から結合に必要な情報だけを取り出し、条件の合う組を検索して全体の解を求める。これがmeet-in-the-middle、半分全列挙である。

使う手がかりは「選択回数が40程度」「解が前半と後半の選択へ一意に分かれる」「結合条件を和・XOR・境界状態などで書ける」といった構造にある。指数を半分にすることと、結合を高速にすることを一緒に設計する。

### 習得する技能

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

## 考え方

### 前半と後半の、必要な相手を探す

列 `1, 2, 2, 3` の位置からいくつか選び、合計4にする方法を数えたい。左を `1, 2`、右を `2, 3` に分ける。

| 左の選択 | 左の合計 $$x$$ | 必要な右の合計 $$4-x$$ | 右の選択 |
| --- | --- | --- | --- |
| 空 | 0 | 4 | なし |
| `1` | 1 | 3 | `3` |
| 左の `2` | 2 | 2 | 右の `2` |
| `1, 2` | 3 | 1 | なし |

左右それぞれの部分集合を作った後は、右の合計値の頻度を調べるだけで答え2を得られる。全体の選択を左右に分ける方法が一意なので、合法な左右の組を数えることと元の選び方を数えることは一致する。

一般に、左の合計値の多重集合を $$L$$、右の合計値の頻度を $$f_R$$ とすると、目標 $$T$$ に対する答えは

$$
\sum_{x\in L}f_R(T-x).
$$

値が等しくても選んだ位置が違えば別の候補である。例えば左が `2, 2` なら、合計2を作る選択は2通りある。単なる集合にすると一つへ減ってしまうので、多重集合か頻度を残す。空選択も各側に一度ずつ含める。目標0の場合に、空選択を許すかどうかは問題の要求に従って最後に調整する。

合計がちょうど目標になる個数ではなく、「$$T$$ 以下で最大の合計」が必要なら、左の合計 $$x$$ ごとに、右側で $$T-x$$ 以下の最大値を探す。整列後の `upper_bound` の一つ前が候補だが、位置が先頭なら該当する相手はない。各左候補にとって最良の右候補だけを比べればよいので、全体の最大値を失わない。負の値がある場合も照合式は同じだが、途中の合計が目標を超えただけで生成を打ち切る枝刈りは使えない。

### 生成の費用も指数の大きさへ合わせる

片側が $$m$$ 個なら、まず合計0の一覧から始め、各値 $$a$$ を処理するたびに、既存の各合計 $$s$$ から $$s+a$$ を一つずつ追加できる。既存分が「選ばない」、追加分が「選ぶ」に対応する。追加した要素を同じ段階でもう一度読むと同じ位置を複数回選ぶことになるため、更新前の長さを固定する。

生成数は $$1+2+\cdots+2^{m-1}=2^m-1$$ なので、合計値の計算は $$O(2^m)$$ 時間で行える。候補ごとに全要素のbitを調べて合計する方法は $$O(m2^m)$$ であり、同じ「半分全列挙」でも費用が違う。

右の一覧を整列すれば、左の合計ごとに $$T-x$$ の `lower_bound` と `upper_bound` の差を取って頻度を求められる。ハッシュ表も使えるが、その場合は操作時間が期待値であることを区別する。ここでは整列と二分探索による確定的な方法を基本にする。

### 結合に必要なのは、合計だけとは限らない

[ABC427 F](/problems/abc427-f/)では隣接する位置を同時に選べない。左右それぞれで非隣接の選択を列挙しても、左末尾と右先頭を両方選んだ組は結合できない。従って、各候補に「境界の位置を選んだか」というflagを持たせる。

一般には、部分候補の内部で検査できる条件は生成中に検査し、両側をまたぐ条件だけを照合時へ残す。この分離で、必要な要約が見える。合計が同じでも境界flagが違えば、結合できる相手が違うので、同じ候補として混ぜてはいけない。

[ABC271 F](/problems/abc271-f/)では、$$N\times N$$ 盤面を右か下へ進む経路を分ける。始点から $$N-1$$ 歩進んだマスを中間とすれば、すべての全体経路が対角線 $$r+c=N+1$$ 上の一マスで一度だけ合流する。終点からは上か左へ $$N-1$$ 歩進めばよい。

合流マスを $$v$$、その値を $$a_v$$ とし、両側がマス $$v$$ も含めたXORをそれぞれ $$p,q$$ として保存する。このまま $$p\mathbin{\mathrm{xor}}q$$ を取ると、合流マスは二度含まれて消える。全体のXORを0にする条件は

$$
p\mathbin{\mathrm{xor}}q\mathbin{\mathrm{xor}}a_v=0,
\quad\text{すなわち}\quad q=p\mathbin{\mathrm{xor}}a_v.
$$

同じ合流マス内だけでこの相手の頻度を調べる。XORが一致しても別のマスの部分経路は結べない。$$N=1$$ では両側が同じ一マスだけを含み、式はそのマスの値が0かを正しく判定する。

### 到達状態を両端から探す

操作列を探索する場合も、始点側と終点側から途中まで調べて同じ状態で出会う方法がある。[ABC336 F](/problems/abc336-f/)では、上限20回の操作を10回ずつに分ける。始点から10回以内、目標から逆操作で10回以内に到達する状態と、それぞれの最短手数を保存する。

共通状態の手数和の最小値が候補になる。長さ20以下の任意の経路には、両端からそれぞれ10手以内にある分割点が存在するため、解を失わない。終点側から使うのは逆向きの遷移である。操作が自己逆なら同じ生成器が使えるが、一般の有向な操作ではそのまま使えない。

## 成立条件と計算量

左右の候補が独立に生成でき、合法な全体解と合法な候補対の対応が説明できることが必要である。そのうえで、結合に使う情報と、同じ情報を持つ候補の多重度を決める。存在だけなら重複する要約を集合へまとめられても、個数・最小手数・解の復元では、頻度・最小値・代表の選択情報などを残す。

二択 $$N$$ 回を均等に分け、左右の候補数を $$P,Q$$ とする。合計値を差分で作り、右を整列して検索する基本形は $$O(P+Q+Q\log Q+P\log Q)$$ 時間。$$P,Q=O(2^{N/2})$$ なら $$O(N2^{N/2})$$ 時間、保存に $$O(2^{N/2})$$ 空間である。全要素を逐一走査して候補を作る場合の追加費用や、要約の比較費用も含める。

盤面経路の例では、各側の末端候補数は合計 $$2^{N-1}$$ で、途中状態も同じオーダー。整列と検索を含め $$O(N2^N)$$ 時間、盤面と候補を含め $$O(N^2+2^N)$$ 空間になる。盤面状態をキーにする探索では、キーをコピー・比較する費用は盤面サイズに依存するため、単純に定数扱いしない。

半分を保存するメモリも実行可能か確認しよう。和が小さい非負整数なら容量DPの方が適する場合があり、必要な上位だけが少ないなら別の列挙法も候補になる。値域に依存するDPと、選択回数の指数に依存する半分全列挙を、制約から比較する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

部分集合の列挙、整列と二分探索、必要に応じてBFSを前提とする。ここでは二群を一度作り、照合して全体へ戻す。小さい同形問題を繰り返し解く分割統治とは、結合の役割が異なる。

問題へ進む際は、分割位置、各側が持つ値、重複の数え方、結合条件の四つを先に書いてみよう。境界の重複や空選択は、最小サイズの入力に式を当てると確認しやすい。

### このUnitでは扱わないもの

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC271 F「XOR on Grid Path」](https://atcoder.jp/contests/abc271/tasks/abc271_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。
- [ABC427 F「Not Adjacent」](https://atcoder.jp/contests/abc427/tasks/abc427_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。
- [ABC402 F「Path to Integer」](https://atcoder.jp/contests/abc402/tasks/abc402_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。
- [ABC326 F「Robot Rotation」](https://atcoder.jp/contests/abc326/tasks/abc326_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC336 F「Rotation Puzzle」](https://atcoder.jp/contests/abc336/tasks/abc336_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。
- [ABC464 F「Random Vault Heist」](https://atcoder.jp/contests/abc464/tasks/abc464_f) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC300 G「P-smooth number」](https://atcoder.jp/contests/abc300/tasks/abc300_g) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [尺取り法・sliding windowで連続区間を走査する](/learn/modeling/two-pointers-window/)（一列の窓または二列の現在blockに関する不変条件を保ち、各pointerを単調に進められる。）。
- [ABC252 Ex「K-th beautiful Necklace」](https://atcoder.jp/contests/abc252/tasks/abc252_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [bit列をTrieで索引化する](/learn/query/binary-trie/)（整数を上位bitからTrieへ格納し、部分木情報を保ちながらXOR・大小条件に最適な分岐を選べる。）。
- [ABC220 H「Security Camera」](https://atcoder.jp/contests/abc220/tasks/abc220_h) — 主題: [meet-in-the-middle・半分全列挙](/learn/modeling/meet-in-the-middle/)（探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。）。既習技能: [分離可能線形変換・Walsh–Hadamard変換](/learn/combinatorics-algebra/separable-linear-transform/)（Kronecker積で表される多次元線形変換を各軸の小変換へ分離し、stride走査で正変換または逆変換を計算できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC427 F 公式解説](https://atcoder.jp/contests/abc427/editorial/14195)
- [ABC336 F 公式解説](https://atcoder.jp/contests/abc336/editorial/9077)

- [ABC220 H 公式解説](https://atcoder.jp/contests/abc220/editorial/2685)
- [ABC220 H 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_h)
- [ABC252 H 公式解説](https://atcoder.jp/contests/abc252/editorial/3981)
- [ABC252 H 公式問題文](https://atcoder.jp/contests/abc252/tasks/abc252_h)
- [ABC271 F 公式解説](https://atcoder.jp/contests/abc271/editorial/4925)
- [ABC271 F 公式問題文](https://atcoder.jp/contests/abc271/tasks/abc271_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-meet-in-the-middle`
