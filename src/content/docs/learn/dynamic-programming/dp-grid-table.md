---
title: "グリッド・多次元表の局所DPを設計する"
description: "「グリッド・多次元表の局所DPを設計する」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: false
sidebar:
  order: 61
---

# グリッド・多次元表の局所DPを設計する

習得対象の目安: **緑色（800–1199）**。二次元以上の添字と依存順を定め、隣接状態から表を埋める。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### グリッド・多次元表の局所DP

グリッド経路や多次元表の依存関係をDAG順に並べ、隣接する小さな状態集合から各セル・各添字を更新する。

### 習得する技能

- グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。

## 考え方

二つのprefix長や盤面の位置を状態にして、隣接する小状態から遷移する。編集距離では削除・挿入・置換を最後の操作として分類し、二列の一致を状態間の依存へ直す。


編集距離D[i][j]をAのprefix長iからBのprefix長jへの最小操作数とする。D[i][0]=i、D[0][j]=jで初期化し、`D[i][j]=min(D[i−1][j]+1,D[i][j−1]+1,D[i−1][j−1]+[A[i−1]≠B[j−1]])`。最後の操作が削除・挿入・一致または置換のいずれかであり、全最適列をこの三候補へ分けられる。i,jの昇順なら三依存が全て既知になる。盤面path数では障害物を0、開始点を1として上・左から足すなど、目的に応じた初期値と集約演算を定める。

## 成立条件と計算量

H×W状態で定数遷移ならO(HW)。直前の行だけでよければ空間を削減できるが、経路復元には追加情報が必要。斜め遷移、障害物、空prefixの初期値を確認する。

概念上の親: [動的計画法](/learn/dynamic-programming/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。

このUnitを直接前提とする単元: [frontier/profile DP・境界状態圧縮](/learn/dynamic-programming/frontier-profile-dp/)。

状態と遷移を定義できることを前提に、グリッドや多次元表の依存方向をDAGとして並べ、局所遷移で埋める。

### このUnitでは扱わないもの

- 一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。

## 問題一覧

- [ABC311 E「Defect-free Squares」](https://atcoder.jp/contests/abc311/tasks/abc311_e) — 主題: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。追加で学ぶ技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。
- [ABC415 E「Hungry Takahashi」](https://atcoder.jp/contests/abc415/tasks/abc415_e) — 主題: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC443 E「Climbing Silver」](https://atcoder.jp/contests/abc443/tasks/abc443_e) — 主題: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC221 H「Count Multiset」](https://atcoder.jp/contests/abc221/tasks/abc221_h) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。 f[x][y]=f[x][y−x]+Σ_{直前M行k}f[k][y−x]。列ごとに行方向のsliding sumを保持してM項走査を消す。入る行を足し、出る行を引く順序を固定する。
- [ABC227 F「Treasure Hunting」](https://atcoder.jp/contests/abc227/tasks/abc227_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。
- [ABC259 Ex「Yet Another Path Counting」](https://atcoder.jp/contests/abc259/tasks/abc259_h) — 主題: [平方根・閾値による軽重分類](/learn/modeling/threshold-heavy-light/)（頻度・次数・更新回数を閾値でheavy/lightに分け、両側の計算量を均衡させる。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。） / [組合せ係数と対称性で数える](/learn/combinatorics-algebra/combinatorial-coefficients/)（選択・順列・分配の重複の有無を識別し、組合せ係数の式を立てられる。）。
- [ABC347 F「Non-overlapping Squares」](https://atcoder.jp/contests/abc347/tasks/abc347_f) — 主題: [候補数を界して全列挙・有限case分解する](/learn/modeling/bounded-enumeration/)（制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。） / [一次元・二次元累積和と差分で区間情報を線形化する](/learn/query/prefix-aggregate/)（prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。）。
- [ABC358 G「AtCoder Tour」](https://atcoder.jp/contests/abc358/tasks/abc358_g) — 主題: [DP遷移を因数分解・集約して加速する](/learn/dynamic-programming/dp-transition-optimization/)（余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。 K歩DPを直接展開するとKに比例する。walkの余分な周回を訪問済み最大報酬の頂点での滞在へ移せるので、t≤HWだけDPし、dp[t][v]+(K−t)A_vを最大化する。巨大時間を短いprefixと線形tailへ分ける証明が核心。
- [ABC464 E「Fill-Rect Query」](https://atcoder.jp/contests/abc464/tasks/abc464_e) — 主題: [時間を逆向きにして未来依存を消す](/learn/modeling/reverse-offline/)（時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。）。既習技能: [グリッド・多次元表の局所DPを設計する](/learn/dynamic-programming/dp-grid-table/)（グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。）。

## 根拠

- [ABC221 H 公式解説](https://atcoder.jp/contests/abc221/editorial/2719)
- [ABC221 H 公式問題文](https://atcoder.jp/contests/abc221/tasks/abc221_h)
- [ABC227 F 公式解説](https://atcoder.jp/contests/abc227/editorial/2914)
- [ABC227 F 公式問題文](https://atcoder.jp/contests/abc227/tasks/abc227_f)
- [ABC259 H 公式解説](https://atcoder.jp/contests/abc259/editorial/4269)
- [ABC259 H 公式問題文](https://atcoder.jp/contests/abc259/tasks/abc259_h)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `f1ae39bc7201c3374c108e800284e1e0068ce6f7a57f15b2a9e5219616e3c4fe` / LearningUnit `unit-dp-grid-table`
