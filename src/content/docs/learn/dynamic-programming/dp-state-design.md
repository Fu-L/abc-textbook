---
title: "最小十分状態からDPを設計する"
description: "「最小十分状態からDPを設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 60
---

# 最小十分状態からDPを設計する

習得対象の目安: **緑色（800–1199）**。未来の選択に必要な情報だけを残し、履歴を同じ状態へまとめる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

DPで難しいのは、式を立てる前の「何を覚えておけば、過去を使い回せるか」という判断である。履歴をすべて持てば正しくても、状態が多すぎて計算できない。一方、情報を捨てすぎると、将来の選択が違う候補を同じものとして扱ってしまう。

この単元では、未来の振る舞いを基準に履歴をまとめる。足りない状態を反例で見つけ、残した情報から遷移が決まることを確かめ、個数や最小費用を集約するところまでを一つの設計として扱う。「最小十分」は、式を短くすることよりも、正しく区別すべきものだけを区別するための考え方である。

### 習得する技能

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

## 考え方

### 今いる場所が同じなら、同じ状態だろうか

グラフ上をちょうど $$L$$ 回移動し、指定頂点 $$s$$ を訪れた回数が偶数になる歩き方を数えるとする。同じ回数だけ歩いて同じ頂点 $$v$$ にいても、これまで $$s$$ を奇数回訪れた履歴と偶数回訪れた履歴では、同じ続きを付けたときの最終判定が逆になる。位置と移動回数だけにまとめてはならない。

必要なのは訪問回数そのものだろうか。最終条件が偶奇だけなら、0回と2回、1回と3回は同じ扱いにできる。次に $$s$$ へ入るたびに偶奇が反転し、それ以外なら維持されるためである。初期頂点を訪問に含めるかも問題の定義で決め、初期値に反映する。

この例で残す状態は「移動済み回数、現在頂点、訪問回数の偶奇」になる。少なすぎる案から出発して反例で必要な情報を足し、その後、回数全体ではなく偶奇だけで十分だと削っている。

### 同じ続きを与えて区別する

一般に、二つの履歴を同じ状態へまとめたいなら、そこへ同じ操作列を続けたときに何が起こるかを比べる。合法性、次状態、得点や費用の増分、最後の受理条件が変わるなら、二つは区別する必要がある。

[ABC215 E](/problems/abc215-e/)では、同じ種類を一つのかたまりとして選ぶ。使用集合だけを残す案に対して、`AB` と `BA` へ `A` を付けると、前者だけが不適切になる。末尾だけの案も、`AB` と `CB` へ `A` を付ければ違いが出る。こうして使用集合と末尾の両方が必要だと分かる。

次は十分性を確かめる。二つの情報が同じなら、次文字が現在のかたまりを延長するか、新しい種類を始めるか、禁止された再登場かを同じように判定できる。更新後の集合と末尾も同じになる。この一文字の対応を繰り返せば、どの長さの続きに対しても同じ振る舞いになる。

反例は「この情報を捨てると困る」を教え、遷移規則は「ここまで残せば十分」を教える。小例を多数試して失敗しなかっただけでは、十分性の証明の代わりにならない。

### 状態のラベルと、そこへ蓄える値を分ける

状態が未来を決める情報なら、その状態へ来る値は、過去の候補をどう集約するかを表す。

| 求めるもの | 同じ状態へ来た候補の集約 |
| --- | --- |
| 存在するか | 一つでも可能なら真 |
| 選び方の個数 | 個数を加える |
| 最小費用 | 最小値を残す |
| 最大得点 | 最大値を残す |

例えば、同じ状態への費用が7と11なら、今後の選択と追加費用が等しい限り、11の候補が後から逆転することはない。最小化では7だけ残せる。数え上げなら、二つの履歴が別の選び方に当たる限り、二通りとして足さなければならない。

これまでの費用が将来に影響する問題では、話が変わる。残予算で行動が制限されるなら残予算も状態の候補になるし、費用と別の能力に優劣の交換関係があれば、単純に最小費用一個へはまとめられない。最良値だけ残すには、捨てる候補が以後のどの続きでも有利にならない根拠が要る。

### 覚える情報を減らすために、処理順も設計する

履歴の必要性は、何をこれから処理するかによって変わる。[ABC264 F](/problems/abc264-f/)では、全行・全列の反転を先に決めると、多数のビットを覚えたくなる。ところが右・下への経路を伸ばす順で決めると、新しく入る行か列の一ビットだけを追加すればよい。

既に離れた行・列には戻らないため、それらのビットは未来へ影響しない。現在の行と列の二ビットが分かれば、隣接マスを同色にする次ビットと追加費用が決まる。ここで、過去の反転操作は値に含む支払い済み費用へ集約し、今後必要な二ビットだけをラベルへ残す。

このように、情報を忘れられるのは「もう使わない」という理由があるときである。左や上へ戻ることを許せば、忘れた行・列を再訪する可能性が生まれ、同じ状態設計は使えなくなる。

### 遷移式を作った後で、数える単位と更新順を点検する

状態の定義ができたら、何も処理していない時点を初期化し、一操作後の遷移をすべて列挙する。最後に、どの状態から答えを取り出すかを定める。空の選択を入れるか、到達不能をどう表すかも、この意味に合わせる。

数え上げでは、各候補が遷移列へ一意に対応するかが重要になる。ABC215 Eで同じ文字を選ぶ場合と飛ばす場合は同じ状態へ入るが、位置集合が違うため両方を加える。一方、出来上がる文字列の種類数を求める別問題なら、同じ文字列を複数回数えない工夫が必要になる。

更新順も遷移の意味に合わせる。位置 $$i$$ の値だけを読んで位置 $$i+1$$ を作るなら、二配列を使うと「今回作った値を、同じ操作でもう一度使う」ことを防げる。集合や費用が増えるからといって、その座標だけの降順更新で十分とは限らない。座標が変わらない遷移も含め、どの値を読むべきかを確認する。

右・下だけの経路のように状態間の依存が一方向なら、その順序で走査すればよい。依存に閉路があるなら、通常の一回のDP走査では解けない。状態を作ることと、その状態グラフをどの手法で解くかは別の判断である。

## 成立条件と計算量

同じ状態にまとめるには、以後の合法な選択と、その選択による変化を残した情報から決められることが必要である。最適化で一つの値だけを残すには、状態が同じ候補の優劣が同じ続きを付けても逆転しないことも確認する。情報を落とす前後で、最終判定に使う条件まで一致させる。

全状態数を $$S$$、一状態から試す選択数を最大 $$T$$ とする。各状態を一度処理し、一遷移が定数時間なら、基本の評価は $$O(ST)$$ 時間・$$O(S)$$ 空間である。集合の部分集合列挙、配列のコピー、データ構造の操作などがあれば、それらも一遷移または全体の費用へ含める。

位置ごとに $$S_0$$ 状態を持ち、直前の位置だけに依存するなら、長さ $$N$$ に対して $$O(NS_0T)$$ 時間、DP領域は二層化して $$O(S_0)$$ にできる。ただし入力保存や解の復元に使う領域は別に加える。全履歴を復元したい場合、最良値だけを保存した計算と同じ空間に収まるとは限らない。

状態数を見積もるのは、残す情報の候補を決めた後である。種類数の小さい集合、偶奇、短い末尾、現在の境界などは有力な圧縮先だが、その型へ無理に当てはめない。復習では「何を捨てると区別が必要になるか」「残したものから何が決まるか」を対にして説明できるか確認する。

## 前提と範囲

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)、[上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)、[繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)、[ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)、[minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)、[グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)、[区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)、[区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)、[prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)、[列・subsequence DP](/learn/dynamic-programming/dp-sequence/)、[確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)、[資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)、[部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)、[frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)、[固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)、[根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

### このUnitでは扱わないもの

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 問題一覧

- [ABC244 E「King Bombee」](https://atcoder.jp/contests/abc244/tasks/abc244_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC251 E「Takahashi and Animals」](https://atcoder.jp/contests/abc251/tasks/abc251_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC310 E「NAND repeatedly」](https://atcoder.jp/contests/abc310/tasks/abc310_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC232 E「Rook Path」](https://atcoder.jp/contests/abc232/tasks/abc232_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC215 E「Chain Contestant」](https://atcoder.jp/contests/abc215/tasks/abc215_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC265 E「Warp」](https://atcoder.jp/contests/abc265/tasks/abc265_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。 障害物があると移動回数の多項係数だけでは途中の可否を判定できない。時刻tと二種類の移動回数i,jを状態にし、残る回数t−i−jから位置を復元して三つの次状態の障害物を判定する。基本的な履歴圧縮を見た後、少ない状態から位置も復元する例として扱う。
- [ABC247 F「Cards」](https://atcoder.jp/contests/abc247/tasks/abc247_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC283 E「Don't Isolate Elements」](https://atcoder.jp/contests/abc283/tasks/abc283_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC264 F「Monochromatic Path」](https://atcoder.jp/contests/abc264/tasks/abc264_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC229 F「Make Bipartite」](https://atcoder.jp/contests/abc229/tasks/abc229_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC344 F「Earn to Advance」](https://atcoder.jp/contests/abc344/tasks/abc344_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC462 F「More ABC」](https://atcoder.jp/contests/abc462/tasks/abc462_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC311 F「Yet Another Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 強制黒の閉包を作ってから対角線上の境界jを状態にする。new[j]=Σ_{k≥j}old[k]をsuffix和一走査で求め、盤外・強制黒と矛盾する境界を除く。境界圧縮と遷移集約を分けて説明する。
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。）。
- [ABC217 G「Groups」](https://atcoder.jp/contests/abc217/tasks/abc217_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC376 F「Hands on Ring (Hard)」](https://atcoder.jp/contests/abc376/tasks/abc376_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC279 G「At Most 2 Colors」](https://atcoder.jp/contests/abc279/tasks/abc279_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 最後に異なる色を置いた位置pごとのdpを、既に制約窓を出たsingとactive区間に分ける。dp[i−1]=sing(C−1)+Σ_{p=i−K+1}^{i−2}dp[p]の区間和をprefix差へ変える。
- [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（二部割当が可能であることを近傍集合の大きさに関するHall条件で特徴付け、必要ならmin-cut条件と対応させられる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。 次の二つのrankの大小関係で遷移元が四つの長方形へ分かれる。new[j][k][l]の全rank対走査を、旧layerの二次元prefix和から定数個の長方形和へ変える。
- [ABC296 Ex「Unite」](https://atcoder.jp/contests/abc296/tasks/abc296_h) — 主題: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC311 E「Defect-free Squares」](https://atcoder.jp/contests/abc311/tasks/abc311_e) — 主題: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。追加で学ぶ技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e) — 主題: [資源・容量DP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC350 E「Toward 0」](https://atcoder.jp/contests/abc350/tasks/abc350_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)（順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC379 G「Count Grid 3-coloring」](https://atcoder.jp/contests/abc379/tasks/abc379_g) — 主題: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC381 F「1122 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から|i-j|≤Kの対角帯だけを計算できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f) — 主題: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)（正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC457 F「Second Gap」](https://atcoder.jp/contests/abc457/tasks/abc457_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。 順位別挿入の全遷移を、new[j]=a_i old[j]+b_{i,j}（bは少数点のみ非零）へ分ける。共通倍率を外出しして二点を補正する。倍率0は逆元を使えないので全消去として扱い、現在世代の例外から再開する。

## 根拠

- [ABC264 F 公式問題文](https://atcoder.jp/contests/abc264/tasks/abc264_f)
- [ABC264 F 公式解説](https://atcoder.jp/contests/abc264/editorial/4588)

- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC217 G 公式解説](https://atcoder.jp/contests/abc217/editorial/2390)
- [ABC217 G 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_g)
- [ABC227 E 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC227 E 公式解説](https://atcoder.jp/contests/abc227/editorial/2908)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-state-design`
