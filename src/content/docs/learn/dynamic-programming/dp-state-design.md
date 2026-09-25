---
title: "最小十分状態からDPを設計する"
description: "「最小十分状態からDPを設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 59
---

# 最小十分状態からDPを設計する

習得対象の目安: **緑色（800–1199）**。未来の選択に必要な情報だけを残し、履歴を同じ状態へまとめる。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### DPの最小十分状態

将来の選択肢と答えが同じprefixを同一状態に縮約する。

DPの状態は、同じ状態へまとめた履歴から先の選択肢と遷移後の答えが一致するように作る。ABC244 Eでは現在の頂点に経路長の偶奇1 bitを加え、到達先だけでは足りない情報を状態へ含める。

ABC251 Eでは最初の品物を選ぶかどうかを固定して円環を列DPにし、最後に先頭との条件を確認する。ABC310 Eでは右端を固定した部分文字列をNAND値ごとの個数へまとめ、次の文字で更新する。ABC232 Eでは盤面の座標を持たず、目的地と同じ行・列かどうかの4状態に集約する。

これらの基本的な履歴圧縮の後、ABC265 Eでは時刻と二種類の移動回数から三つ目の回数と座標を復元し、障害物を判定する。必要な情報を小さい状態に保ちながら位置を復元する例として扱う。続くABC247 Fでは入力グラフを2-正則成分へ分解して各cycleのDPを組み合わせ、単一区間の状態設計から構造を利用した複合問題へ進む。

### 習得する技能

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)、[上限制約付き桁DP](/learn/dynamic-programming/digit-dp/)、[繰り上がり・借り・混合基数を状態にするDP](/learn/dynamic-programming/dp-carry-mixed-radix/)、[ゲーム状態の勝敗とGrundy数](/learn/dynamic-programming/dp-game/)、[minimax・得点差・局面値を評価するゲームDP](/learn/dynamic-programming/dp-game-value/)、[グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)、[区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)、[区間拡張DP](/learn/dynamic-programming/dp-interval-expansion/)、[prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)、[列・subsequence DP](/learn/dynamic-programming/dp-sequence/)、[確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)、[集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)、[部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)、[DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)、[frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)、[固定線形遷移を巨大回数進める](/learn/dynamic-programming/linear-recurrence/)、[根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)。

初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

### このUnitでは扱わないもの

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 下位単元

- [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/) — 黄色

## 問題一覧

- [ABC215 E「Chain Contestant」](https://atcoder.jp/contests/abc215/tasks/abc215_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。
- [ABC227 E「Swap」](https://atcoder.jp/contests/abc227/tasks/abc227_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC232 E「Rook Path」](https://atcoder.jp/contests/abc232/tasks/abc232_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC244 E「King Bombee」](https://atcoder.jp/contests/abc244/tasks/abc244_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC251 E「Takahashi and Animals」](https://atcoder.jp/contests/abc251/tasks/abc251_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC265 E「Warp」](https://atcoder.jp/contests/abc265/tasks/abc265_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。 障害物があると移動回数の多項係数だけでは途中の可否を判定できない。時刻tと二種類の移動回数i,jを状態にし、残る回数t−i−jから位置を復元して三つの次状態の障害物を判定する。基本的な履歴圧縮を見た後、少ない状態から位置も復元する例として扱う。
- [ABC283 E「Don't Isolate Elements」](https://atcoder.jp/contests/abc283/tasks/abc283_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC307 E「Distinct Adjacent」](https://atcoder.jp/contests/abc307/tasks/abc307_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [同値な状態を正規化する](/learn/modeling/normalization/)（対称操作で同値な状態の標準形と不変量を選べる。）。
- [ABC310 E「NAND repeatedly」](https://atcoder.jp/contests/abc310/tasks/abc310_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC311 E「Defect-free Squares」](https://atcoder.jp/contests/abc311/tasks/abc311_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。追加で学ぶ技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC345 E「Colorful Subsequence」](https://atcoder.jp/contests/abc345/tasks/abc345_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。
- [ABC375 E「3 Team Division」](https://atcoder.jp/contests/abc375/tasks/abc375_e) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。
- [ABC229 F「Make Bipartite」](https://atcoder.jp/contests/abc229/tasks/abc229_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC247 F「Cards」](https://atcoder.jp/contests/abc247/tasks/abc247_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC264 F「Monochromatic Path」](https://atcoder.jp/contests/abc264/tasks/abc264_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC311 F「Yet Another Grid Task」](https://atcoder.jp/contests/abc311/tasks/abc311_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 強制黒の閉包を作ってから対角線上の境界jを状態にする。new[j]=Σ_{k≥j}old[k]をsuffix和一走査で求め、盤外・強制黒と矛盾する境界を除く。境界圧縮と遷移集約を分けて説明する。
- [ABC344 F「Earn to Advance」](https://atcoder.jp/contests/abc344/tasks/abc344_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC376 F「Hands on Ring (Hard)」](https://atcoder.jp/contests/abc376/tasks/abc376_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC403 F「Shortest One Formula」](https://atcoder.jp/contests/abc403/tasks/abc403_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [素因数分解と約数構造](/learn/number-theory/prime-divisor/)（整数の条件を素因数ごとの指数または約数格子上の条件に分解できる。） / [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。
- [ABC422 F「Eat and Ride」](https://atcoder.jp/contests/abc422/tasks/abc422_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [局所寄与へ分解して集計順を交換する](/learn/modeling/contribution-reordering/)（答えを独立な局所寄与の和または積に分解し、重複を避けて集計順を交換できる。）。
- [ABC450 F「Strongly Connected 2」](https://atcoder.jp/contests/abc450/tasks/abc450_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [区間更新を要約へ作用させる](/learn/query/range-actions/)（更新作用の合成順と要約への適用を定義し、遅延評価で保てる。）。
- [ABC462 F「More ABC」](https://atcoder.jp/contests/abc462/tasks/abc462_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC217 G「Groups」](https://atcoder.jp/contests/abc217/tasks/abc217_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC273 G「Row Column Sums 2」](https://atcoder.jp/contests/abc273/tasks/abc273_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC279 G「At Most 2 Colors」](https://atcoder.jp/contests/abc279/tasks/abc279_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。 最後に異なる色を置いた位置pごとのdpを、既に制約窓を出たsingとactive区間に分ける。dp[i−1]=sing(C−1)+Σ_{p=i−K+1}^{i−2}dp[p]の区間和をprefix差へ変える。
- [ABC281 G「Farthest City」](https://atcoder.jp/contests/abc281/tasks/abc281_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC389 G「Odd Even Graph」](https://atcoder.jp/contests/abc389/tasks/abc389_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せを生成関数へ符号化する](/learn/combinatorics-algebra/generating-functions/)（組合せの合成を生成関数の積・逆数・畳み込みに符号化できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC391 G「Many LCS」](https://atcoder.jp/contests/abc391/tasks/abc391_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC416 G「Concat (1st)」](https://atcoder.jp/contests/abc416/tasks/abc416_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [交換論から選択順を導く](/learn/modeling/greedy-exchange/)（局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。）。
- [ABC440 G「Haunted House」](https://atcoder.jp/contests/abc440/tasks/abc440_g) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [DSUによる連結成分管理・縮約](/learn/graph/dsu-components/)（成分へmetadataまたはmerge履歴を集約し、成分を一頂点に縮約した隣接関係、または併合後の代表情報を構成できる。）。
- [ABC313 Ex「Group Photo」](https://atcoder.jp/contests/abc313/tasks/abc313_h) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。） / [二部matching・Hall・Kőnig](/learn/graph/bipartite-matching/)（左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC236 E「Average and Median」](https://atcoder.jp/contests/abc236/tasks/abc236_e) — 主題: [fractional programming・比率parametric search](/learn/geometry-optimization/fractional-parametric-search/)（比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC282 G「Similar Permutation」](https://atcoder.jp/contests/abc282/tasks/abc282_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。）。 次の二つのrankの大小関係で遷移元が四つの長方形へ分かれる。new[j][k][l]の全rank対走査を、旧layerの二次元prefix和から定数個の長方形和へ変える。
- [ABC309 E「Family and Insurance」](https://atcoder.jp/contests/abc309/tasks/abc309_e) — 主題: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC309 G「Ban Permutation」](https://atcoder.jp/contests/abc309/tasks/abc309_g) — 主題: [包除・Möbius反転で重複を補正する](/learn/combinatorics-algebra/inclusion-exclusion/)（条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。）。既習技能: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)（未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。） / [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC322 E「Product Development」](https://atcoder.jp/contests/abc322/tasks/abc322_e) — 主題: [集合・資源軸のDP](/learn/dynamic-programming/dp-subset-resource/)（資源軸の上限と更新順を選び、選択の重複を避けられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC350 E「Toward 0」](https://atcoder.jp/contests/abc350/tasks/abc350_e) — 主題: [確率過程・期待値DP](/learn/dynamic-programming/dp-stochastic/)（意思決定時点で観測済みの情報を状態にし、行動の最適化と確率平均を正しい順序で組み合わせたBellman式を解ける。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC374 F「Shipping」](https://atcoder.jp/contests/abc374/tasks/abc374_f) — 主題: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)（列の最後のブロックを固定し、処理済みprefixの答えから次の切れ目へ遷移する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [疎なkeyの順序を保ってdense indexへ圧縮する](/learn/modeling/coordinate-compression/)（初期値・将来更新値・疎なevent座標をsort-uniqueし、順序と等値性を保つdense indexまたは有限状態へ写せる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)（順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC381 F「1122 Subsequence」](https://atcoder.jp/contests/abc381/tasks/abc381_f) — 主題: [部分集合・bitmask状態DP](/learn/dynamic-programming/dp-subset-state/)（bitmaskの各bitが表す意味を定め、部分集合間の遷移を正しく設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC386 F「Operate K」](https://atcoder.jp/contests/abc386/tasks/abc386_f) — 主題: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)（列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC388 F「Dangerous Sugoroku」](https://atcoder.jp/contests/abc388/tasks/abc388_f) — 主題: [数値半群のconductor以後を一括到達とみなす](/learn/number-theory/numerical-semigroup-reachability/)（正の生成元をgcdで正規化し、Frobenius数・conductorまたは剰余類ごとの最小到達値から、それ以後の全距離が非負整数結合で到達可能だと証明して有限prefixだけを調べられる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC418 G「Binary Operation」](https://atcoder.jp/contests/abc418/tasks/abc418_g) — 主題: [有限状態automatonの構成](/learn/string/finite-pattern-automaton/)（未来の一文字遷移を決める有限同値類を定義し、pattern suffix・subsequence進行・圧縮DP rowなどから完全遷移表を構成してDPや行列累乗に接続できる。）。追加で学ぶ技能: [automaton上のDP・行列遷移](/learn/dynamic-programming/automaton-dp/)（位置・長さとautomaton stateの積状態を作り、禁止条件を満たす遷移を除き、処理終了時に目的言語の受理状態を集計する。禁止パターン回避では検出状態を除外し、全パターン充足では出現maskが全て立つ状態を受理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [区間合成・領域分割DP](/learn/dynamic-programming/dp-interval-composition/)（区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC427 E「Wind Cleaning」](https://atcoder.jp/contests/abc427/tasks/abc427_e) — 主題: [状態グラフのモデリングと探索](/learn/graph/state-graph-search/)（暗黙状態・重みなし辺・訪問条件を定義し、到達判定・最短手数・列挙の目的に応じてBFS・DFS・backtrackingを選べる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（各軸を昇順に累積して多次元prefix和を作り、D次元直方体を2^D隅の包除で取得できる。一次元の区間差と一括加算の端点差分にも接続できる。）。
- [ABC435 F「Cat exercise」](https://atcoder.jp/contests/abc435/tasks/abc435_f) — 主題: [大小関係をCartesian treeへ変換する](/learn/query/cartesian-tree/)（配列順とheap順を保つCartesian treeを単調stackで構成し、各部分木が表す連続区間へ問題を分解できる。）。既習技能: [根付き木DP・部分木集約](/learn/tree/rooted-tree-aggregation/)（根付き木で子側の状態を合成し、部分木または木全体の値を求められる。） / [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。） / [支配関係から不要な候補を単調stack・queueで削る](/learn/query/monotone-stack-queue/)（候補を捨てられる支配条件を証明し、各候補を高々一度だけ単調stack・queueから削除できる。）。
- [ABC457 F「Second Gap」](https://atcoder.jp/contests/abc457/tasks/abc457_f) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（全状態に共通する添字移動・倍率・affine作用を外出しし、旧値の保存と非可逆な作用を扱って例外だけを更新できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。 順位別挿入の全遷移を、new[j]=a_i old[j]+b_{i,j}（bは少数点のみ非零）へ分ける。共通倍率を外出しして二点を補正する。倍率0は逆元を使えないので全消去として扱い、現在世代の例外から再開する。

## 根拠

- [ABC215 E 公式問題文](https://atcoder.jp/contests/abc215/tasks/abc215_e)
- [ABC215 E 公式解説](https://atcoder.jp/contests/abc215/editorial/2483)
- [ABC217 G 公式解説](https://atcoder.jp/contests/abc217/editorial/2390)
- [ABC217 G 公式問題文](https://atcoder.jp/contests/abc217/tasks/abc217_g)
- [ABC227 E 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_e)
- [ABC227 E 公式解説](https://atcoder.jp/contests/abc227/editorial/2908)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `fb4add6bc302b195502d39f75b81dbe179acb127bdfa4bae7bfe7471110b5887` / LearningUnit `unit-dp-state-design`
