---
title: "候補数を界して全列挙・有限case分解する"
description: "「候補数を界して全列挙・有限case分解する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
headingAliases:
  "有界全列挙有限case分解": "大きな答えを小さな設計図から作る"
  "集合をbitmaskで列挙する": "選ぶ集合をビット列と一対一に対応させる"
sidebar:
  order: 1
---

# 候補数を界して全列挙・有限case分解する

習得対象の目安: **緑色（800–1199）**。制約から候補数を見積もり、成功までの探索回数を界する考え方を学ぶ。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

全探索を使えるかどうかは、入力の最大値だけでは決まらない。答えの候補を少数のパラメータで作れるなら、巨大な値域を順に調べる必要はない。また、候補が多くても、同じ種類の失敗を繰り返せないなら、成功までの処理回数を小さく抑えられる。

この単元では、**何を一候補とし、何回処理するのかを証明してから列挙する**考え方を学ぶ。候補の表現、漏れと重複、生成・判定の費用を一続きに考えることが目標である。

### 習得する技能

- 条件を満たす対象を決定する量を見つけ、列挙範囲の上界と網羅性を説明する。
- 部分集合のbitmask表現と、個数を固定した組合せの生成を使い分ける。
- 早期終了までの失敗を、有限個の記録先へ対応付けて数える。
- 候補数だけでなく、前処理・生成・判定・保存を含めて実行可能性を判断する。

## 考え方

### 大きな答えを、小さな設計図から作る

十進表記で隣り合う桁の差が一定の整数を探すとしよう。例えば `246` や `975` が該当する。整数を1ずつ増やして検査すると、大きな答えにたどり着くまでの回数が問題になる。そこで、条件を検査する代わりに、条件を満たす数の作り方を考える。

3桁の数なら、最初の桁と桁の差を決めた時点で、残りの桁も決まる。

| 先頭 | 差 | 作る桁 | 判定 |
| --- | --- | --- | --- |
| 2 | 2 | 2 → 4 → 6 | 有効 |
| 9 | −2 | 9 → 7 → 5 | 有効 |
| 7 | −6 | 7 → 1 → −5 | 無効 |

最初の2行からは `246` と `975` が得られる。最後の行は、3桁目が0から9の範囲を外れるため捨てる。

一般に、桁数を $$\ell$$、先頭の桁を $$a$$、桁の差を $$d$$ とすると、先頭を0番目とした $$j$$ 番目の桁は $$a+jd$$ である。先頭は1から9、それ以外は0から9でなければならない。差は広めに $$-9\leq d\leq9$$ としておけば、必要な場合をすべて含められる。

桁数の上限を $$D$$ と定められれば、試すパラメータの組は高々

$$
D\times9\times19
$$

通りである。各組で桁を順に作り、範囲を外れたら捨て、完成した数が要求を満たすか調べる。

ここで必要なのは、範囲が小さいことに加えて、**正解がその範囲に必ず入る理由**である。[ABC234 E](/problems/abc234-e/)では、与えられる整数は $$10^{17}$$ 以下で、それ以上の等差数の最小値を求める。18桁の `111111111111111111` は必ず有効な上界になるため、18桁までを作れば足りる。18桁という打ち切りは、答えの上界から導いている。[公式問題文](https://atcoder.jp/contests/abc234/tasks/abc234_e)・[公式解説](https://atcoder.jp/contests/abc234/editorial/3234)でも確認できる。

任意の有効な整数から桁数・先頭・差を取り出すと、列挙した組の一つに戻る。したがって漏れはない。一方、1桁の数は差を変えても同じ数になる。最小値の更新なら重複して調べても答えは変わらないが、異なる整数の個数を数えるなら、1桁だけ別に扱うなどの重複対策が必要になる。

桁を毎回作り直す実装では、一候補に最大 $$O(D)$$ 時間かかり、全体は $$O(D^2)$$ 時間である。最良の候補だけを保持するなら全候補の保存は不要で、桁列を作業用に置く場合も追加空間は $$O(D)$$ で済む。以降も、候補の数と一候補を作る費用は分けて数える。

### 選ぶ集合を、ビット列と一対一に対応させる

次に、3個の品物から好きなものを選ぶ場面を考える。品物の添字を0、1、2とし、費用を順に2、3、5、予算を5とする。各品物について「選ぶ・選ばない」を決めれば、選ぶ集合をすべて作れる。

各選択を二進数の1桁に対応させた整数を **bitmask** と呼ぶ。右端を品物0の桁とすると、全候補は次の8通りになる。

| ビット列 | 選ぶ添字 | 費用 | 予算内か |
| --- | --- | --- | --- |
| `000` | 空集合 | 0 | はい |
| `001` | 0 | 2 | はい |
| `010` | 1 | 3 | はい |
| `011` | 0, 1 | 5 | はい |
| `100` | 2 | 5 | はい |
| `101` | 0, 2 | 7 | いいえ |
| `110` | 1, 2 | 8 | いいえ |
| `111` | 0, 1, 2 | 10 | いいえ |

品物が $$N$$ 個なら、maskを0以上 $$2^N$$ 未満の整数として走査する。添字 $$i$$ の品物を選ぶかは、実装では `(mask >> i) & 1` で調べられる。各部分集合には一つのビット列が、各ビット列には一つの部分集合が対応するので、漏れも重複もない。空集合を含むことも、この対応から分かる。

各maskで全品物を調べるなら $$O(N2^N)$$ 時間である。費用の入力配列に $$O(N)$$ 空間を使い、候補の集合を整数だけで表すなら追加空間は $$O(1)$$ で済む。ただし、これはmaskが定数個の機械語に収まる場合の評価である。実装言語の整数幅を超えるシフトや、符号付き整数の扱いにも注意する。

選んだ品物に共通する性質を調べたい場合も同じ表現が使える。例えば、品物0が対応できる曜日を月・水・金、品物1を水・金・日とすると、両方に共通する曜日は水・金である。各曜日にもビットを割り当てれば、集合の共通部分はビットごとのAND、和集合はORで求められる。

曜日の種類数を $$W=7$$ とし、品物 $$i$$ の曜日集合を `available[i]` で表す。一つの選択maskを評価するときは、`common` を全曜日のビットが1の `(1 << W) - 1` に初期化し、選んだ各品物について `common &= available[i]` と更新する。小例では、全曜日 → 月・水・金 → 水・金と絞られる。0で初期化すると、ANDを何度取っても空集合のままになる。

最後に立っているビットの個数を数える操作をpopcountといい、これで共通する曜日数が得られる。品物の選択に使う $$N$$ ビットと、曜日の性質に使う $$W$$ ビットは別の軸である。曜日集合が一語に収まるなら、全選択の共通部分も $$O(N2^N)$$ 時間で計算できる。複数語にまたがる場合は、ANDの費用にも語数分を掛ける。空の選択では `common` は全曜日のままだが、この選択を答えへ含めるかは問題の定義で決める。

bitmaskは集合の表現方法であり、使うだけで探索が速くなるわけではない。全maskを評価すれば候補数は依然として $$2^N$$ である。[ABC219 E](/problems/abc219-e/)では16領域の内外を選ぶため、この数が小さい。一方、領域の選び方が対応する堀を作れるかは別途判定する必要がある。[公式解説](https://atcoder.jp/contests/abc219/editorial/2652)の全探索も、この「生成と合法性の検査」の組合せである。

### 個数が決まっているなら、完成できる組だけを作る

5個から2個を選ぶなら、必要なのは $$2^5=32$$ 個の部分集合すべてではなく、$$\binom52=10$$ 個の組合せである。選んだ添字を小さい順に並べると、

$$
(0,1),(0,2),(0,3),(0,4),
(1,2),(1,3),(1,4),(2,3),(2,4),(3,4)
$$

だけを生成すればよい。選ぶ順番を自由にすると `(0,1)` と `(1,0)` が同じ集合を表すが、添字を増加させれば各集合の表現が一意になる。

一般に、$$N$$ 個から $$K$$ 個を選ぶ途中で、すでに $$r$$ 個を選んでいるとする。次に選ぶ添字を $$i$$ とすると、その後には $$K-r-1$$ 個分の添字が必要である。添字の最大値が $$N-1$$ なので、次の候補は

$$
i\leq N-(K-r)
$$

を満たすものだけにする。例えば5個から2個なら、最初に4を選ぶ枝は最初から作らない。以後の選択は直前の添字より大きい範囲に限り、$$K$$ 個になったら評価する。

この生成方法では、各途中状態が少なくとも一つの完成した組へ延長できる。深さごとに見ると、異なる途中状態の下にある完成形は重ならないため、途中状態も各深さで高々 $$\binom NK$$ 個である。したがって生成全体は、根を含めて $$O((K+1)\binom NK)$$ 時間で抑えられる。完成時の判定に $$C$$ 時間かかるなら、その費用 $$O(C\binom NK)$$ も加える。入力を保存する $$O(N)$$ に加え、選択列と再帰スタックは $$O(K)$$ 空間である。$$K=0$$ なら空集合を一度評価し、$$K>N$$ なら候補はない。

[ABC386 E](/problems/abc386-e/)のように $$\binom NK$$ が小さいという制約は、この生成を直接促している。特に $$K$$ が $$N$$ に近いなら、選ばない側の $$N-K$$ 個を作ると状態更新も軽くできる。XORでは全要素のXORから選ばない要素のXORを再び取ると、選ぶ側の値が得られる。ただし、補集合を列挙するには、元の候補の評価値を補集合から復元できることも必要である。[公式解説](https://atcoder.jp/contests/abc386/editorial/11697)ではこの対応を用いている。

### 全候補が多くても、失敗を記録する場所が少ない

「二重ループの回数を全部足すと大きい」だけでは、早期終了する探索を正しく評価できない。成功するまでに、何回失敗できるかを考えよう。

二部グラフで、片側に3頂点 $$x,y,z$$ があるとする。反対側の各頂点について、隣接する2頂点の組を調べる。組 $$\{x,y\}$$ が初めて出たら、それを見つけた頂点を記録する。同じ組が別の頂点から再び出れば、4頂点で長さ4のサイクルができる。

| 調べる頂点 | 隣接頂点の組 | 記録と判断 |
| --- | --- | --- |
| $$a$$ | $$\{x,y\}$$ | 初出なので $$a$$ を記録 |
| $$b$$ | $$\{x,z\}$$ | 初出なので $$b$$ を記録 |
| $$c$$ | $$\{x,y\}$$ | $$a$$ と $$c$$ が共通の2頂点を持つので成功 |

この時点で $$a\to x\to c\to y\to a$$ というサイクルが復元できる。記録先は $$\{x,y\},\{x,z\},\{y,z\}$$ の3個しかない。成功しない処理は必ず空の記録先を一つ埋めるので、失敗は高々3回、成功するなら遅くとも4回目である。衝突が起こらないまま全候補を調べ終えた場合は、「存在しない」と判定する。

[ABC260 F](/problems/abc260-f/)では、一方の頂点数に $$T\leq3000$$ という小さな上限がある。こちらの頂点対を記録先にすると、その数は $$B=\binom T2$$ 個になる。反対側の頂点を一つずつ処理し、各隣接リスト内で添字の異なる順不同の組を一度ずつ調べる。同じ頂点から同じ組を二度作らないため、記録済みの組を見つけたときは必ず別の頂点による発見になる。

探索中は「各記録には、その組の両頂点に隣接する、処理済みの頂点が一つ入っている」という不変条件を保つ。未記録なら登録し、記録済みならサイクルを出力して終了する。成功せずに全頂点を調べ終えたなら、共通の2頂点を持つ頂点対は存在せず、サイクルも存在しない。

組を調べる回数は高々 $$B+1$$ 回である。反対側の頂点数を $$S$$、辺数を $$M$$ とすると、隣接リストの構築・外側の走査・記録配列の初期化も含め、時間は $$O(S+T+M+T^2)$$、空間も $$O(S+T+M+T^2)$$ になる。[公式解説](https://atcoder.jp/contests/abc260/editorial/4437)の鳩ノ巣原理は、この失敗回数の評価に対応する。

この上界は、**発見したら探索全体を止める**ことに依存する。すべてのサイクルを数える要求では、同じ記録先が何度現れても続ける必要があり、同じ計算量とは言えない。

## 成立条件と計算量

列挙の設計では、まず正解を含む候補集合を定め、次にその生成方法の漏れ・重複を確認する。そのうえで、実際に処理する候補数と一候補の費用を掛け合わせる。前処理に $$P$$ 時間、実際に処理する候補が $$Q$$ 個、生成と判定の合計が一候補あたり最大 $$C$$ 時間なら、全体の時間は $$O(P+QC)$$ である。候補を全保存するか、その場で評価して捨てるかによって空間も変わる。

上界を出す根拠は問題によって異なる。少数の変数が独立に動くなら範囲の大きさを掛け、選ぶ個数が固定なら組合せを数える。配置を有限の場合に分けるなら、どの合法配置も少なくとも一つの場合に入ることを示す。場合が重なっても最適値を取るだけなら構わないが、計数では重複の補正が必要になる。

探索を打ち切る場合は、打ち切り前の処理回数を別に証明する。「早く見つかりそう」「枝刈りが効きそう」は最悪計算量の根拠にならない。失敗を未使用の記録先に対応付けられるか、数えた候補数だけで要求が確定するかを調べる。

bitmask列挙は完成した集合を表す方法であり、[バックトラック](/learn/modeling/backtracking-search/)は部分的な選択を伸ばして戻す方法である。後者でも使用集合をbitmaskで持てる。さらに枝刈りは、ある途中状態から必要な答えが出ないと証明して、その先を調べない判断を指す。表現・探索手順・候補を捨てる根拠は、それぞれ別に選ぶ。

主配置問題へ進む際は、[ABC234 E](/problems/abc234-e/)で「巨大な値を決定する小さなパラメータ」、[ABC328 E](/problems/abc328-e/)で「木を作る辺数を固定した組合せ」、[ABC219 E](/problems/abc219-e/)で「全maskの生成と形状の判定」を確認するとよい。[ABC260 F](/problems/abc260-f/)では候補総数を数える発想から一歩進め、失敗を記録する場所を探す。復習では、ループの形を覚える前に「何の個数を上から抑えたのか」を説明し直そう。

概念上の親: [モデル変換とアルゴリズム設計](/learn/modeling/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

候補総数を直接界す全列挙と、鳩ノ巣原理で成功前の失敗回数だけを界す探索を分け、実際に処理する回数を証明する。

### このUnitでは扱わないもの

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 問題一覧

- [ABC234 E「Arithmetic Number」](https://atcoder.jp/contests/abc234/tasks/abc234_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC254 E「Small d and k」](https://atcoder.jp/contests/abc254/tasks/abc254_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC328 E「Modulo MST」](https://atcoder.jp/contests/abc328/tasks/abc328_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC369 E「Sightseeing Tour」](https://atcoder.jp/contests/abc369/tasks/abc369_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（許す中継点集合を状態とするDPからFloyd–Warshallを導き、距離行列の更新順・到達不能・負閉路を扱える。）。
- [ABC272 E「Add and Mex」](https://atcoder.jp/contests/abc272/tasks/abc272_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC386 E「Maximize XOR」](https://atcoder.jp/contests/abc386/tasks/abc386_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC219 E「Moat」](https://atcoder.jp/contests/abc219/tasks/abc219_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC343 E「7x7x7」](https://atcoder.jp/contests/abc343/tasks/abc343_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC312 E「Tangency of Cuboids」](https://atcoder.jp/contests/abc312/tasks/abc312_e) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC260 F「Find 4-cycle」](https://atcoder.jp/contests/abc260/tasks/abc260_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC442 G「Lightweight Knapsack」](https://atcoder.jp/contests/abc442/tasks/abc442_g) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC313 F「Flip Machines」](https://atcoder.jp/contests/abc313/tasks/abc313_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC220 G「Isosceles Trapezium」](https://atcoder.jp/contests/abc220/tasks/abc220_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC223 E「Placing Rectangles」](https://atcoder.jp/contests/abc223/tasks/abc223_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC226 F「Score of Permutations」](https://atcoder.jp/contests/abc226/tasks/abc226_f) — 主題: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC227 H「Eat Them All」](https://atcoder.jp/contests/abc227/tasks/abc227_h) — 主題: [最大流・最小カット](/learn/graph/max-flow-min-cut/)（選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [Euler trail・circuit](/learn/graph/euler-trail-circuit/)（全辺を一度ずつ使うEuler trail・circuitについて、無向graphの奇数次数条件または有向graphの入出次数条件と辺を持つ部分の連結性から存在を判定し、具体的な辺列が必要ならHierholzer法で構成する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC234 Ex「Enumerate Pairs」](https://atcoder.jp/contests/abc234/tasks/abc234_h) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC240 Ex「Sequence of Substrings」](https://atcoder.jp/contests/abc240/tasks/abc240_h) — 主題: [値域集約による部分列DP](/learn/dynamic-programming/dp-value-range/)（末尾の値ごとに最良状態を持ち、許される直前値の区間を集約して部分列DPの遷移を高速化する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間monoid要約](/learn/query/range-monoid-aggregation/)（要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [Trieで共有接頭辞を索引化する](/learn/string/trie-prefix/)（文字列集合をTrieへ挿入し、nodeの通過数・子遷移・辞書順を使って共有接頭辞の問いを処理できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC246 F「typewriter」](https://atcoder.jp/contests/abc246/tasks/abc246_f) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [法上の四則演算・高速累乗・逆元](/learn/number-theory/modular-arithmetic/)（剰余を正規化して加減乗算し、二分累乗と可逆性を確認した逆元により法上の除算・確率を計算できる。） / [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（集合のbitmask表現から全部分集合と共通要素を列挙し、集合間のDP遷移を必要としない計数に利用できる。）。 非空の行集合Sをbitmaskで列挙し、共通文字数c(S)を求める。和集合の大きさはΣ_{S≠∅}(−1)^{|S|+1}c(S)^L。重複を交互に打ち消す包除原理が主題であり、subset間のDP遷移はない。
- [ABC248 E「K-colinear Line」](https://atcoder.jp/contests/abc248/tasks/abc248_e) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC257 F「Teleporter Setting」](https://atcoder.jp/contests/abc257/tasks/abc257_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC258 F「Main Street」](https://atcoder.jp/contests/abc258/tasks/abc258_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC270 F「Transportation」](https://atcoder.jp/contests/abc270/tasks/abc270_f) — 主題: [cut・cycle性質から最適全域木を構成する](/learn/graph/spanning-tree-optimization/)（cut・cycle性質で辺の安全性を証明し、Kruskal法または同値な選択で最小・最大全域木を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC271 Ex「General General」](https://atcoder.jp/contests/abc271/tasks/abc271_h) — 主題: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC284 E「Count Simple Paths」](https://atcoder.jp/contests/abc284/tasks/abc284_e) — 主題: [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC290 G「Edge Elimination」](https://atcoder.jp/contests/abc290/tasks/abc290_g) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC298 G「Strawberry War」](https://atcoder.jp/contests/abc298/tasks/abc298_g) — 主題: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC301 G「Worst Picture」](https://atcoder.jp/contests/abc301/tasks/abc301_g) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC302 G「Sort from 1 to 4」](https://atcoder.jp/contests/abc302/tasks/abc302_g) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC323 F「Push and Carry」](https://atcoder.jp/contests/abc323/tasks/abc323_f) — 主題: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC353 F「Tile Distance」](https://atcoder.jp/contests/abc353/tasks/abc353_f) — 主題: [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC387 E「Digit Sum Divisible 2」](https://atcoder.jp/contests/abc387/tasks/abc387_e) — 主題: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC410 F「Balanced Rectangles」](https://atcoder.jp/contests/abc410/tasks/abc410_f) — 主題: [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC419 G「Count Simple Paths 2」](https://atcoder.jp/contests/abc419/tasks/abc419_g) — 主題: [near-tree graphのkernel化](/learn/graph/near-tree-kernelization/)（terminal外の葉除去とdegree-2 chain縮約で、cycle rankや余分な辺数だけに依存する小kernelへ答えを保って縮約する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。追加で学ぶ技能: [cycle space・fundamental cycle basis](/learn/graph/cycle-space-basis/)（無向graphの全頂点が偶数次数となる辺集合を、対称差を加法とするF_2上のcycle spaceとして扱い、spanning forestと各non-tree edgeが作るfundamental cycleからbasisを構成して、連結成分数Cに対するdim C(G)=M-N+Cを導ける。連結graphではC=1となる。さらに同一連結成分内のs,tに対して固定したs-t path P_0を取ると、任意のs-t path PについてPhi(P)=P XOR P_0がcycle spaceに属し、Phi(P) XOR P_0=Pからこの写像が単射であることを示せる。したがってcycle-space dimensionを用いて、s-t path族の大きさを2^(dim C(G))以下に抑えられる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [backtracking・可逆な探索状態](/learn/modeling/backtracking-search/)（再帰の前後で使用状態を対称に更新・復元し、現在pathだけの制約を保って探索木を漏れなく列挙できる。）。
- [ABC423 G「Small Multiple 2」](https://atcoder.jp/contests/abc423/tasks/abc423_g) — 主題: [一次合同・CRTで解の類を統合する](/learn/number-theory/modular-congruence/)（合同条件の可解性を判定し、逆元・一次合同・CRTで解の類を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC459 G「Golf 2」](https://atcoder.jp/contests/abc459/tasks/abc459_g) — 主題: [二変数の凸区分線形整数最適化](/learn/geometry-optimization/two-variable-convex-lattice-optimization/)（二変数の凸区分線形目的について折れ目直線の交点で連続最小候補を求め、定数距離内に整数最適点があることを証明して有限個の近傍格子点だけを評価できる。）。追加で学ぶ技能: [gcdと整数解の成立条件](/learn/number-theory/gcd-diophantine/)（整除条件や一次不定方程式の可解性をgcdで特徴付け、必要なら拡張EuclidでBézout整数解を構成できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。

## 根拠

- [ABC219 E 公式問題文](https://atcoder.jp/contests/abc219/tasks/abc219_e)
- [ABC219 E 公式解説](https://atcoder.jp/contests/abc219/editorial/2652)
- [ABC220 G 公式解説](https://atcoder.jp/contests/abc220/editorial/2684)
- [ABC220 G 公式問題文](https://atcoder.jp/contests/abc220/tasks/abc220_g)
- [ABC223 E 公式問題文](https://atcoder.jp/contests/abc223/tasks/abc223_e)
- [ABC223 E 公式解説](https://atcoder.jp/contests/abc223/editorial/2781)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-bounded-enumeration`
