---
title: "ABC278-E — Grid Filling"
draft: true
authoringUnit: {"problemId":"abc278-e","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc278-e.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference"],"sourceRevisionIds":["source-abc278-e-problem-10674eb9290e2dc650f840ffa0ef8850b60b66a1125ee5faf3d3e8a5e280b1a9","source-abc278-editorial-5234-56a3d9f81b47d9ae6267aafcf1b29b21bec3c877e8bc9b0d4f078948018b65c4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"値xが答えに含まれる条件はtotal[x]>insideWindow[x]であり、window外の位置を個別に列挙する必要はない。 rectangle内個数は4 cornerの2D prefix差で求まり、同じprefix tableを全windowで再利用できる。 windowごとのcell再走査を避け、各値のrectangle countを定数時間で得られる。","sourceRevisionIds":["source-abc278-e-problem-10674eb9290e2dc650f840ffa0ef8850b60b66a1125ee5faf3d3e8a5e280b1a9","source-abc278-editorial-5234-56a3d9f81b47d9ae6267aafcf1b29b21bec3c877e8bc9b0d4f078948018b65c4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

各windowの外側に残るdistinct数は、値xごとに『grid全体の出現数−window内出現数が正か』を数えればよい。

H,W,N≤300なので、値ごとに2D prefix countを持つHWN規模の集計が制約内に収まる。

採用する候補: 各値xのindicator gridに2D累積和を作り、各h×w window内のx個数を全体個数から引いて外に残る値を数える。

棄却する候補: 各windowごとにblackout外の全HW cellを走査し、setでdistinctを数える。

window数もHW規模で、全体が(HW)²になり得る。

count[r][c][x]を(1,1)…(r,c)のx出現数として全値分構築する。各top-left(k,l)とxについてh×w内個数を4項で取り、total[x]との差が正ならanswerを1増やして表形式で出力する。

## 典型の発動条件

### 値別2D累積和

発動条件: 小さい値域の各カテゴリについて、多数のrectangle内出現数queryが必要なとき。

カテゴリindicatorのprefix countを第三次元に持ち、4 corner差を取る。

### 補集合でdistinct判定

発動条件: 領域外のdistinct種類数を求め、全体頻度と領域内頻度が得られるとき。

total-inside>0のカテゴリ数を数える。

## 問題固有の要素

blackout外を直接見る代わりに、各値がblackout内へ全出現を奪われたかだけを判定すればよい。

別の問題へ持ち帰る視点: 領域削除後のdistinct数は、カテゴリごとの全体頻度と削除領域頻度の一致判定へ分解する。

## 正当性

値xが答えに含まれる条件はtotal[x]>insideWindow[x]であり、window外の位置を個別に列挙する必要はない。 rectangle内個数は4 cornerの2D prefix差で求まり、同じprefix tableを全windowで再利用できる。 windowごとのcell再走査を避け、各値のrectangle countを定数時間で得られる。

## 実装上の注意

- prefix配列の0行・0列を用意し、window端点のinclusive/exclusive規約を統一する。
- 実際に出現しない値はtotal=0なので答えへ加えず、Nの全値を走査しても条件をstrictly positiveにする。

## 復習の核

- ある値の全出現がwindow内に入る場合と1個だけ外へ残る場合を描き、判定がtotal==insideかどうかに集約されることを確認する。

## 計算量と制約

### 時間

O(HWN+(H−h+1)(W−w+1)N)、Nは色数、h×wを切り抜く。

### 空間

O(HWN)、色別2D prefix。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H,W,N \leq 300; 1 \leq h \leq H; 1 \leq w \leq W; (h,w)\neq(H,W); 1 \leq A _ {i,j} \leq N\ (1\leq i\leq H,1\leq j\leq W); All values in the input are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/tasks/abc278_e) — source-abc278-e-problem-10674eb9290e2dc650f840ffa0ef8850b60b66a1125ee5faf3d3e8a5e280b1a9
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/editorial/5234) — source-abc278-editorial-5234-56a3d9f81b47d9ae6267aafcf1b29b21bec3c877e8bc9b0d4f078948018b65c4
