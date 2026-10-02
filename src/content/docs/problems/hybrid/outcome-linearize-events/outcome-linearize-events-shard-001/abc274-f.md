---
title: "ABC274-F — Fishing"
draft: true
authoringUnit: {"problemId":"abc274-f","docPath":"src/content/docs/problems/hybrid/outcome-linearize-events/outcome-linearize-events-shard-001/abc274-f.md","learningOutcomeIds":["outcome-linearize-events"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-geometry-primitives"],"excludedTopics":["更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。"],"tagIds":["tag-event-sweep","tag-geometry-orientation-transform"],"sourceRevisionIds":["source-abc274-f-problem-2fc534f53deab4a68e673f61f407eb17832df060862c7177163e534a96ea2933","source-abc274-editorial-5021-c2218204378652ca3ddfe2ed53d7212a742a711610e7d343c09631410bf41866"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"relative velocity ΔVが0ならrelative position ΔXが[0,A]かで全時刻/emptyを判定し、ΔV≠0なら二不等式からentry/exit timesを得る。 net endpointsはinclusiveなので同じtimeにentryとexitが重なる場合、その瞬間のweightを評価するためadd eventsをremove eventsより先に処理する。 固定anchorでは捕獲weightがinterval endpointsでのみ変化し、2N eventsの最大prefix weightを求めればよい。","sourceRevisionIds":["source-abc274-f-problem-2fc534f53deab4a68e673f61f407eb17832df060862c7177163e534a96ea2933","source-abc274-editorial-5021-c2218204378652ca3ddfe2ed53d7212a742a711610e7d343c09631410bf41866"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-linearize-events"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"幅A=2、anchor魚は位置0速度0重み3、魚2は位置4速度−1重み5。","procedure":["魚2の相対位置4−tが[0,2]に入るのはt∈[2,4]。","その時間はanchorと魚2の重み合計8。"],"executionTarget":null,"expectedResult":"このanchorの最大8。","verificationStatus":"not_applicable","learningUnitIds":["unit-event-sweep"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-linearize-events"],"prerequisiteIds":["unit-geometry-primitives"],"attainmentCondition":"一魚が時刻2に退出し別魚が時刻2に入るなら両者を同時に取れるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"境界inclusiveなので時刻2では両方取れる。同時刻では追加、評価、削除の順にする。"},"answer":{"reasoningOrVerification":"境界inclusiveなので時刻2では両方取れる。同時刻では追加、評価、削除の順にする。","procedure":["具体例の各状態・寄与を再計算する。","境界inclusiveなので時刻2では両方取れる。同時刻では追加、評価、削除の順にする。"],"expectedResult":"境界inclusiveなので時刻2では両方取れる。同時刻では追加、評価、削除の順にする。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)

- 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [幾何の基本判定と座標変換](src/content/docs/learn/geometry-optimization/geometry-primitives.md)

対象外:

- 更新を単に逆順へ読む処理、答えの局所寄与だけを集計する順序交換、sort-uniqueしたkeyの添字化、および固定方向の単純scan。

## 考察

最適なlength-A netは、捕まえるfishのうち最左のものにleft endpointを合わせても捕獲集合を減らさない。

left endpointをfish iのposition X_i+V_i tへ追従させると、fish jがnet内にいる条件は0≤(X_j−X_i)+(V_j−V_i)t≤Aで、t≥0上の一intervalになる。

棄却する候補: timeとnet positionを連続量のまま探索する。

候補が無限にあり、任意時刻ごとのfish positionsを列挙できない。

採用する候補: anchor fish iを全列挙し、各fishのnet滞在time intervalのweighted add/remove eventsをsortしてsweepする。

固定anchorでは捕獲weightがinterval endpointsでのみ変化し、2N eventsの最大prefix weightを求めればよい。

relative velocity ΔVが0ならrelative position ΔXが[0,A]かで全時刻/emptyを判定し、ΔV≠0なら二不等式からentry/exit timesを得る。

net endpointsはinclusiveなので同じtimeにentryとexitが重なる場合、その瞬間のweightを評価するためadd eventsをremove eventsより先に処理する。

moving interval captureをleftmost anchorで離散化し、relative-motion inequalitiesから得るweighted time intervalsのmaximum overlapへ帰着する。

## 典型の発動条件

### moving objectsの相対座標化

発動条件: moving windowを一objectへ固定すると、他objectsの所属条件がtimeの一次不等式になるとき。

fish iを静止anchorとみなし、各fish jのrelative position ΔX+ΔVtが[0,A]に入る区間を求める。

### 重み付きinterval event sweep

発動条件: 各対象が有効なtime rangeを一intervalで持ち、同時に有効なweight総和の最大を求めるとき。

entryで+W、exitで−Wのeventsを時刻順に処理してmaximum active weightを更新する。

## 問題固有の要素

net left endpointのanchorは捕獲時点の最左fishに選べるため、N anchorsで全optimal placementsを覆う。

別の問題へ持ち帰る視点: 連続位置の固定長window最適化では、optimal windowを含有objectの境界へslideして候補を離散化する。

## 正当性

relative velocity ΔVが0ならrelative position ΔXが[0,A]かで全時刻/emptyを判定し、ΔV≠0なら二不等式からentry/exit timesを得る。 net endpointsはinclusiveなので同じtimeにentryとexitが重なる場合、その瞬間のweightを評価するためadd eventsをremove eventsより先に処理する。 固定anchorでは捕獲weightがinterval endpointsでのみ変化し、2N eventsの最大prefix weightを求めればよい。

## 実装上の注意

- rational endpointの大小はcross multiplicationで比較してfloating errorを避け、negative-time portionをt=0でclipする。
- 同時刻eventのinclusive規約をsort tie-breakへ反映し、unbounded intervalにはremove eventを作らない。

## 復習の核

- 連続なwindow位置は、最適解を失わず端点をobjectへ合わせて有限候補にする。
- 移動体のwindow membershipはanchorとの相対位置に直し、有効time intervalのoverlapとして見る。

## 計算量と制約

### 時間

O(N² log N)、各anchorにN個の有効時刻区間をsort。

### 空間

O(N)、一anchorのevent。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2000; 1 \leq A \leq 10^4; 1 \leq W_i\leq 10^4; 0 \leq X_i\leq 10^4; 1 \leq V_i\leq 10^4; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

幅A=2、anchor魚は位置0速度0重み3、魚2は位置4速度−1重み5。

1. 魚2の相対位置4−tが[0,2]に入るのはt∈[2,4]。
2. その時間はanchorと魚2の重み合計8。

期待される結果: このanchorの最大8。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

一魚が時刻2に退出し別魚が時刻2に入るなら両者を同時に取れるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

境界inclusiveなので時刻2では両方取れる。同時刻では追加、評価、削除の順にする。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/tasks/abc274_f) — source-abc274-f-problem-2fc534f53deab4a68e673f61f407eb17832df060862c7177163e534a96ea2933
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc274/editorial/5021) — source-abc274-editorial-5021-c2218204378652ca3ddfe2ed53d7212a742a711610e7d343c09631410bf41866
