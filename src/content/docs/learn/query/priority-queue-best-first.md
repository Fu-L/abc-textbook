---
title: "priority queue・best-first列挙"
description: "「priority queue・best-first列挙」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 33
---

# priority queue・best-first列挙

習得対象の目安: **緑色（800–1199）**。優先度付きキューで、現在選べる候補だけを管理して順に取り出す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

全候補を作るには多すぎても、必要なのが先頭の少数だけなら、次に選べる候補を保つことで列挙を途中で止められる。この単元では、**候補集合の外に、もっと先に選ぶべきものがない理由**を学ぶ。

## priority queue・best-first列挙

優先度付きキュー（priority queue）は、候補の追加と、優先値が最小または最大の候補の取り出しを行うデータ構造である。代表的な実装がヒープ（heap）で、最小値を取り出すものをmin-heap、最大値を取り出すものをmax-heapと呼ぶ。

現在の候補の中から最も優先するものを取り出し、そこから次の候補を生成する探索をbest-first探索と呼ぶ。これで全体を値の順に列挙するには、まだ生成していない候補が先に選ばれるべきものではない、と保証する必要がある。まずは二つの配列の和で、その保証を考えよう。

### 習得する技能

- 未出力の候補を代表する探索境界を設計し、集合の外により良い候補がない理由を説明する。
- 何を同じ状態とみなすか、登録時に重複を除けるかを判断し、生成する候補数から計算量を評価する。

## 考え方

昇順の配列 $$A=(1,4), B=(2,5)$$
から一つずつ選び、和を小さい順に取り出したい。和を行ごとに並べると、次の表になる。添字は0から始める。

| 行      | 最初の和  | 次の和    |
| ------- | --------- | --------- |
| $$i=0$$ | $$1+2=3$$ | $$1+5=6$$ |
| $$i=1$$ | $$4+2=6$$ | $$4+5=9$$ |

各行は既に昇順なので、未出力の先頭だけをmin-heapに入れる。和と一緒に添字の組を保持すれば、どの行を進めるかも分かる。最初は3と6。3を出力したら同じ行の次の6を追加し、以後も「取り出した行の先頭」だけを進める。結果は3、6、6、9となる。同じ値の6でも選んだ組が違うので二回数える。

このような「既に生成した、次に選べる候補の集合」を探索境界（frontier）と呼ぶ。まだheapにない値は、その行の先頭以上である。したがってheapの最小値は、未出力の全候補の最小値でもある。heapを使うことに加えて、この不変条件が順序の正しさを保証する。

## 成立条件と計算量

この例で、小さい方から最大 $$K$$ 組を求めるとする。$$|A|,|B|$$ はそれぞれの配列の要素数を表す。各行の先頭を一括でheap構築すると $$O(|A|)$$。実際に出力する組数を $$L=\min(K,|A||B|)$$
とすれば、列挙は $$O(L\log(|A|+1))$$、配列を除く空間は
$$O(|A|)$$。どちらかの配列が空なら終了し、全組数より多く要求されてもheapが空になったら止める。

この例の状態は選んだ添字の組であり、各組を一つ前の列から一度だけ生成する。[ABC391 F](/problems/abc391-f/)のように複数方向から同じ状態を生成する列挙でも、**優先値と後続の遷移が状態だけで決まり、到達経路によらない**なら、heapへの追加時に生成済み状態を記録して二重登録を防げる。「同じ状態」と「同じ値の別状態」は区別する。

[ABC297 E](/problems/abc297-e/)では、買い方が違っても同じ金額は一回だけ数える。同額なら次に一個足して作れる金額も同じなので、金額そのものを状態にできる。解説では同額を取り出した際に、順位の更新と次候補の生成を両方省いている。ABC391 Fでは添字の組、ABC297 Eでは金額を区別する、という数える対象の違いに注目して読み比べたい。

一方、[ABC305 E](/problems/abc305-e/)のように、同じ頂点へ後からより良い値で到達できる探索では、追加済みという理由で再登録を禁止できない。頂点ごとに、これまでに見つけた最良値を暫定値として持ち、改善したら更新してheapへ再登録する。この更新を**緩和**と呼ぶ。取り出した候補の値が現在の最良値と一致しなければ、古い候補として捨てる。

例えば、辺を一つ進むごとに体力が1減るとする。パス `1–2–3–4` の頂点1に体力4、頂点2に体力1の警備員がいるとき、頂点2は初期登録済みでも、頂点1から届く体力3へ更新する必要がある。再登録して伝播すれば、各頂点の最大残り体力は順に $$4,3,2,1$$ となる。頂点2の再登録を禁止すると、その先の頂点4まで警備できることを見落とす。

最大値から列挙するならmax-heapを使う。ABC391 Fでは、最大の組から添字を一つずつ増やすと値は増えない。任意の未出力状態へ至る経路で最初の未出力状態は、出発点として、または直前の状態を取り出したときに登録され、heapに残っている。その値は経路の先の値以上なので、heapの外に最大値を見落とすことはない。最小値からの列挙では不等号の向きが逆になる。符号や遷移が変わる問題では、この性質を改めて確認する。

復習では、**heapの外にもっと良い候補がないのはなぜか**を説明してから、[ABC391 F](/problems/abc391-f/)の三方向への展開と比べる。操作自体を確認するなら[概念上の親単元](/learn/query/ordered-set-heap/)へ戻る。

概念上の親: [heap・ordered setで全候補の極値を保つ](/learn/query/ordered-set-heap/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)。

全候補を最初からheapへ入れる場合から一歩進み、必要な候補だけを生成して探索する場合を扱う。

### このUnitでは扱わないもの

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC384 E「Takahashi is Slime 2」](https://atcoder.jp/contests/abc384/tasks/abc384_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC331 E「Set Meal」](https://atcoder.jp/contests/abc331/tasks/abc331_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。
- [ABC305 E「Art Gallery on Graph」](https://atcoder.jp/contests/abc305/tasks/abc305_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。
- [ABC297 E「Kth Takoyaki Set」](https://atcoder.jp/contests/abc297/tasks/abc297_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。
- [ABC391 F「K-th Largest Triplet」](https://atcoder.jp/contests/abc391/tasks/abc391_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC409 F「Connecting Points」](https://atcoder.jp/contests/abc409/tasks/abc409_f) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。）。
- [ABC440 E「Cookies」](https://atcoder.jp/contests/abc440/tasks/abc440_e) — 主題: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC214 E「Packing Under Range Regulations」](https://atcoder.jp/contests/abc214/tasks/abc214_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。
- [ABC217 E「Sorting Queries」](https://atcoder.jp/contests/abc217/tasks/abc217_e) — 主題: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC218 H「Red and Blue Lamps」](https://atcoder.jp/contests/abc218/tasks/abc218_h) — 主題: [path matchingのheap縮約greedy](/learn/graph/path-matching-contraction/)（重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [要素索引と連結リストで局所linkを更新する](/learn/query/linked-list-index/)（要素IDから前後linkを引き、挿入・削除で変わる局所linkだけを更新して列順を復元できる。） / [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC249 F「Ignore Operations」](https://atcoder.jp/contests/abc249/tasks/abc249_f) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC250 G「Stonks」](https://atcoder.jp/contests/abc250/tasks/abc250_g) — 主題: [slope trick](/learn/geometry-optimization/slope-trick/)（区分線形凸関数を左右breakpointのheapと定数項で表し、|x-a|追加・平行移動・prefix minimumを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC252 F「Bread」](https://atcoder.jp/contests/abc252/tasks/abc252_f) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC307 F「Virus 2」](https://atcoder.jp/contests/abc307/tasks/abc307_f) — 主題: [最短路モデル](/learn/graph/weighted-shortest-path/)（非負重みの距離確定を証明し、一般非負重みでは優先度付きキュー、0・1重みではdeque、単位重みではFIFOを選べる。）。既習技能: [単調進行による償却解析](/learn/modeling/amortized-monotone-progress/)（要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC319 F「Fighter Takahashi」](https://atcoder.jp/contests/abc319/tasks/abc319_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC320 E「Somen Nagashi」](https://atcoder.jp/contests/abc320/tasks/abc320_e) — 主題: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [ordered set・multisetの動的順序管理](/learn/query/ordered-set-multiset/)（比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC359 F「Tree Degree Optimization」](https://atcoder.jp/contests/abc359/tasks/abc359_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC373 F「Knapsack with Diminishing Values」](https://atcoder.jp/contests/abc373/tasks/abc373_f) — 主題: [分離凸・凹の単調限界値選択](/learn/geometry-optimization/separable-convex-marginals/)（分離凸費用または分離凹利益を単調な限界値列へ分解し、heap mergeか閾値別の個数・総和により必要な上位・下位K項を選べる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。） / [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC376 G「Treasure Hunting」](https://atcoder.jp/contests/abc376/tasks/abc376_g) — 主題: [01 on Tree・親先行順序のcluster縮約](/learn/tree/tree-precedence-contraction/)（親先行制約下の交換比較をcluster統計へまとめ、01 on Treeの縮約貪欲で最適順序を構成できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（静的な辺を探索して成分を付けるか、辺追加ごとに成分を併合し、同一成分・サイズを判定できる。） / [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC407 E「Most Valuable Parentheses」](https://atcoder.jp/contests/abc407/tasks/abc407_e) — 主題: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。既習技能: [priority queue・best-first列挙](/learn/query/priority-queue-best-first/)（現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

## 根拠

- [ABC391 F 公式問題文](https://atcoder.jp/contests/abc391/tasks/abc391_f)
- [ABC391 F 公式解説：状態の重複生成を防ぐ列挙](https://atcoder.jp/contests/abc391/editorial/12109)
- [ABC297 E 公式問題文](https://atcoder.jp/contests/abc297/tasks/abc297_e)
- [ABC297 E 公式解説：同じ金額を一回だけ数える列挙](https://atcoder.jp/contests/abc297/editorial/6167)
- [ABC305 E 公式問題文](https://atcoder.jp/contests/abc305/tasks/abc305_e)
- [ABC305 E 公式解説：暫定値の緩和と古い候補の棄却](https://atcoder.jp/contests/abc305/editorial/6539)
- [ABC214 E 公式問題文](https://atcoder.jp/contests/abc214/tasks/abc214_e)
- [ABC214 E 公式解説](https://atcoder.jp/contests/abc214/editorial/2431)
- [ABC217 E 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_e)
- [ABC217 E 公式解説](https://atcoder.jp/contests/abc217/editorial/2577)
- [ABC218 H 公式解説](https://atcoder.jp/contests/abc218/editorial/2602)
- [ABC218 H 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-priority-queue-best-first`
