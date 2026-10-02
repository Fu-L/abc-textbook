---
title: "ABC382-G — Tile Distance 3"
draft: true
authoringUnit: {"problemId":"abc382-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc382-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization"],"sourceRevisionIds":["source-abc382-editorial-11484-0f3ef9d23b66d088e18cfb5962464302ed86cbefccd2ea96cb2571746d938f73","source-abc382-g-problem-3d4b8aa9c36ebcefd1ffb0e2050e7b22f5ad9f8929f9034f4cb70707c3a5cc8f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i,j>0 の一般位置では (i,j) から (i-1,j-1) へ縮約すると最短距離がちょうど2減るため、対角方向の大部分を一括処理できる。 始点が境界から十分離れた offset や終点 tile 内の k≥2 は到達距離を変えず、少数の境界ケースだけ残る。 K や座標は10^16でも、距離に影響する局所量は max(S_y,K-3)、min(k,2)、parity 等へ縮約でき、遠距離分は閉形式で剥がせる。","sourceRevisionIds":["source-abc382-editorial-11484-0f3ef9d23b66d088e18cfb5962464302ed86cbefccd2ea96cb2571746d938f73","source-abc382-g-problem-3d4b8aa9c36ebcefd1ffb0e2050e7b22f5ad9f8929f9034f4cb70707c3a5cc8f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-equivalent-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"正規化した終点tile index(i,j)=(4,5)、基底index(1,2)。","procedure":["両成分から3を引く対角縮約を三回分まとめる。","各縮約で距離は2だけ減る。"],"executionTarget":null,"expectedResult":"元距離は基底距離+6。","verificationStatus":"not_applicable","learningUnitIds":["unit-normalization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-equivalent-states"],"prerequisiteIds":[],"attainmentCondition":"tile内offsetだけで全caseを一式にできるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"境界、parity、K=2の基底分岐が残る。対角縮約で大きい座標を除いてもそれらの条件は保存して評価する。"},"answer":{"reasoningOrVerification":"境界、parity、K=2の基底分岐が残る。対角縮約で大きい座標を除いてもそれらの条件は保存して評価する。","procedure":["具体例の各状態・寄与を再計算する。","境界、parity、K=2の基底分岐が残る。対角縮約で大きい座標を除いてもそれらの条件は保存して評価する。"],"expectedResult":"境界、parity、K=2の基底分岐が残る。対角縮約で大きい座標を除いてもそれらの条件は保存して評価する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 交換論による貪欲順の証明。

## 考察

敷き詰めは回転・反転・K 単位の平行移動で同型になり、始点を一つの基本ブロックへ正規化できる。遠方への距離は対角ブロックを一つ縮めるごとに一定だけ減る再帰性を持つ。

採用する候補: 対称変換で座標を標準形へ移し、始点の局所 offset と終点 tile index を飽和させた有限ケースへ分類し、ブロック差の再帰式と基底表で距離を O(1) 算出する。

K や座標は10^16でも、距離に影響する局所量は max(S_y,K-3)、min(k,2)、parity 等へ縮約でき、遠距離分は閉形式で剥がせる。

棄却する候補: 各 tile を頂点とするグラフを作り、始点から BFS する。

座標範囲が10^16で tile 数は無限に近く、局所探索だけでは遠方 query を処理できない。

i,j>0 の一般位置では (i,j) から (i-1,j-1) へ縮約すると最短距離がちょうど2減るため、対角方向の大部分を一括処理できる。

始点が境界から十分離れた offset や終点 tile 内の k≥2 は到達距離を変えず、少数の境界ケースだけ残る。

符号・軸・平行移動を使って 0≤Sx,Sy<K、Tx,Ty≥0 へ正規化し終点 tile (i,j,k) を特定する。min(i,j) などを再帰式で引き、残る i=0/j=0/(1,1) の基底ケースを K=2、parity、飽和 offset ごとの式で評価する。

## 典型の発動条件

### 周期幾何の対称性・再帰縮約

発動条件: 巨大周期タイル上の最短距離で局所形が繰り返されるとき。

標準領域へ正規化し、一定距離を持つブロック移動を閉形式化する。

## 問題固有の要素

casework を座標値そのものではなく、距離が変わる境界までの飽和値と parity に整理する。

別の問題へ持ち帰る視点: 愚直 0-1 BFS は小座標の oracle として使い、有限ケース式の検証へ回す。

## 正当性

i,j>0 の一般位置では (i,j) から (i-1,j-1) へ縮約すると最短距離がちょうど2減るため、対角方向の大部分を一括処理できる。 始点が境界から十分離れた offset や終点 tile 内の k≥2 は到達距離を変えず、少数の境界ケースだけ残る。 K や座標は10^16でも、距離に影響する局所量は max(S_y,K-3)、min(k,2)、parity 等へ縮約でき、遠距離分は閉形式で剥がせる。

## 実装上の注意

- 負座標の floor division を数学的床で実装し、軸交換・反転後の tile orientation を揃える。K=2 と基底領域は専用ケースを網羅する。

## 復習の核

- 一般位置の (i,j)→(i-1,j-1)+2 をまず証明し、残った有限ケースは小範囲 BFS と全列挙比較する。

## 計算量と制約

### 時間

O(1)、正規化後に対角成分min(i,j)を一括除去して有限個の基底式へ落とす。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^4; 2 \leq K \leq 10^{16}; -10^{16} \leq S_x, S_y, T_x, T_y \leq 10^{16}; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

正規化した終点tile index(i,j)=(4,5)、基底index(1,2)。

1. 両成分から3を引く対角縮約を三回分まとめる。
2. 各縮約で距離は2だけ減る。

期待される結果: 元距離は基底距離+6。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

tile内offsetだけで全caseを一式にできるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

境界、parity、K=2の基底分岐が残る。対角縮約で大きい座標を除いてもそれらの条件は保存して評価する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/editorial/11484) — source-abc382-editorial-11484-0f3ef9d23b66d088e18cfb5962464302ed86cbefccd2ea96cb2571746d938f73
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/tasks/abc382_g) — source-abc382-g-problem-3d4b8aa9c36ebcefd1ffb0e2050e7b22f5ad9f8929f9034f4cb70707c3a5cc8f
