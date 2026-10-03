---
title: "ABC382-G — Tile Distance 3"
draft: true
authoringUnit: {"problemId":"abc382-g","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-001/abc382-g.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization"],"sourceRevisionIds":["source-abc382-editorial-11484-0f3ef9d23b66d088e18cfb5962464302ed86cbefccd2ea96cb2571746d938f73","source-abc382-g-problem-3d4b8aa9c36ebcefd1ffb0e2050e7b22f5ad9f8929f9034f4cb70707c3a5cc8f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"回転・偶数parityのblock平行移動・block内中心線での反転はタイルの正の長さの辺隣接を保つので、正規化後も距離が等しい。同blockではタイル内番号差の移動と隣の縦タイル経由の二手の最小が距離になる。別blockでは、対角方向へ一組のblock境界を越える二手と、軸上で二block進むK=2の三手・K≥3の四手を剥がす関係が成り立つ。各関係は到達可能タイルの境界を一段ずつ拡張すると、縮約前後で同じ局所番号の到達時刻がその分だけずれることから示せる。例外の(1,1)を剥がさず、軸上も添字1,…,3を残す。残る基底ではsを終端側の三段、kを始端側の三段へ飽和させても、隣blockへの最短の入り方は同じであり、表はその有限な辺隣接から得られる距離である。従って縮約分と基底距離の和が全ケースの最短距離になる。","sourceRevisionIds":["source-abc382-editorial-11484-0f3ef9d23b66d088e18cfb5962464302ed86cbefccd2ea96cb2571746d938f73","source-abc382-g-problem-3d4b8aa9c36ebcefd1ffb0e2050e7b22f5ad9f8929f9034f4cb70707c3a5cc8f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

無限平面をBFSすることはできない。まずタイルの向きを揃え、遠方の繰り返し部分を除いて有限の境界問題へ帰着する。各座標は整数マスの左下なので、反転は点の中心の0.5も反映して行う。

次の手順で始点のタイルを横向きのblock (0,0)へ置き、終点blockの添字を非負にする。

1. 始点blockが奇数parityで縦向きなら、両点へ(x,y)←(y,−x−1)を適用する。この90度回転でblockのparityが反転し、配置を保ったまま横向きになる。
2. 始点のblock添字u=floor(S_x/K),v=floor(S_y/K)を求め、両点から(uK,vK)を引く。u+vは偶数なので配置は保存される。
3. T_x<0なら両点のxをK−1−xへ、T_y<0なら両点のyをK−1−yへ反転する。始点はblock (0,0)内のままである。

横向き始点のタイル内番号s=S_y（0≤s<K）を得る。終点のblockはi=floor(T_x/K),j=floor(T_y/K)。終点タイル内番号はi+jが偶数ならk=T_y mod K、奇数ならk=T_x mod Kである。横長タイルの内部x座標は距離に影響しない。

i=j=0なら回答はmin(|s−k|,2)。同blockの隣接横タイルを順に移る道と、横隣の縦タイルを経由する二手の道を比較する。

その他では次の縮約を行い、取り除いた距離をcostへ足す。

- i,j>0ならd=min(i,j)を取る。ただしi=jならdを1減らして(1,1)を残す。(i,j)←(i−d,j−d)、cost+=2d。
- その後i=0またはj=0ならn=max(i,j)、h=max(0,floor((n−2)/2))とする。非零の添字から2hを引き、K=2ならcost+=3h、それ以外ならcost+=4h。

最初の縮約は(i,j)≠(1,1)で両添字を1ずつ減らすと距離が2減る性質、次は軸上の添字n≥4を2減らすと距離がK=2で3、K≥3で4減る性質を使う。結果は(0,1),(0,2),(0,3),(1,0),(2,0),(3,0),(1,1)の七つだけになる。

K≥3ではs≤K−3の差は遠方への距離に影響せず、k≥2も同じである。s'=max(s,K−3)−(K−3)、k'=min(k,2)として、次の表のs'行・k'列（いずれも0,1,2）を読む。各行は角括弧内の三つの数、セミコロンで次の行へ進む。

| 終点block | K≥3の基底距離行列 |
| --- | --- |
| (0,1) | [3,3,3]; [2,2,2]; [1,1,1] |
| (0,2) | [4,5,6]; [3,4,5]; [2,3,4] |
| (0,3) | [7,7,7]; [6,6,6]; [5,5,5] |
| (1,0) | [1,2,3]; [1,2,3]; [1,2,3] |
| (2,0) | [4,4,4]; [4,4,4]; [4,4,4] |
| (3,0) | [5,6,7]; [5,6,7]; [5,6,7] |
| (1,1) | [2,3,4]; [2,3,3]; [2,2,2] |

K=2ではs,k∈{0,1}をそのまま行・列に使う。

| 終点block | K=2の基底距離行列 |
| --- | --- |
| (0,1) | [2,2]; [1,1] |
| (0,2) | [3,4]; [2,3] |
| (0,3) | [5,5]; [4,4] |
| (1,0) | [1,2]; [1,2] |
| (2,0) | [3,3]; [3,3] |
| (3,0) | [4,5]; [4,5] |
| (1,1) | [2,3]; [2,2] |

回答はcostと基底距離の和。表は巨大座標を列挙した結果ではなく、境界からの0,1,2と向きだけを残した有限問題の距離である。

## 典型の発動条件

### 周期幾何の対称性・再帰縮約

発動条件: 巨大周期タイル上の最短距離で局所形が繰り返されるとき。

標準領域へ正規化し、一定距離を持つブロック移動を閉形式化する。

## 問題固有の要素

casework を座標値そのものではなく、距離が変わる境界までの飽和値と parity に整理する。

別の問題へ持ち帰る視点: 愚直 0-1 BFS は小座標の oracle として使い、有限ケース式の検証へ回す。

## 正当性

回転・偶数parityのblock平行移動・block内中心線での反転はタイルの正の長さの辺隣接を保つので、正規化後も距離が等しい。同blockではタイル内番号差の移動と隣の縦タイル経由の二手の最小が距離になる。別blockでは、対角方向へ一組のblock境界を越える二手と、軸上で二block進むK=2の三手・K≥3の四手を剥がす関係が成り立つ。各関係は到達可能タイルの境界を一段ずつ拡張すると、縮約前後で同じ局所番号の到達時刻がその分だけずれることから示せる。例外の(1,1)を剥がさず、軸上も添字1,…,3を残す。残る基底ではsを終端側の三段、kを始端側の三段へ飽和させても、隣blockへの最短の入り方は同じであり、表はその有限な辺隣接から得られる距離である。従って縮約分と基底距離の和が全ケースの最短距離になる。

## 実装上の注意

- 負座標のblock添字は数学的floor divisionで求める。中心座標の反転は−xではなく−x−1（回転）またはK−1−x（block反転）を使う。
- 対角縮約で(1,1)を残す。同blockケースにはs,kの飽和を使わず、元の|s−k|を評価する。
- K=2とK≥3の表を分ける。座標・縮約量・距離は64ビット整数。

## 復習の核

- 一般位置の (i,j)→(i-1,j-1)+2 をまず証明し、残った有限ケースは小範囲 BFS と全列挙比較する。

## 計算量と制約

### 時間

O(1)、正規化後に対角成分min(i,j)を一括除去して有限個の基底式へ落とす。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^4; 2 \leq K \leq 10^{16}; -10^{16} \leq S_x, S_y, T_x, T_y \leq 10^{16}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/editorial/11484) — source-abc382-editorial-11484-0f3ef9d23b66d088e18cfb5962464302ed86cbefccd2ea96cb2571746d938f73
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc382/tasks/abc382_g) — source-abc382-g-problem-3d4b8aa9c36ebcefd1ffb0e2050e7b22f5ad9f8929f9034f4cb70707c3a5cc8f
