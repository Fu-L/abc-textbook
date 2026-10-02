---
title: "ABC265-G — 012 Inversion"
draft: true
authoringUnit: {"problemId":"abc265-g","docPath":"src/content/docs/problems/data-structures/outcome-design-range-update-action/outcome-design-range-update-action-shard-001/abc265-g.md","learningOutcomeIds":["outcome-design-range-update-action"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["過去の版の保存・rollback・構造共有。"],"tagIds":["tag-lazy-segment-action","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc265-g-problem-8dbb301709bd4fc77f81f3ea41c287ffaa6d5aa567c6fab03d38eb782514e17e","source-abc265-editorial-4586-307b3949ba570b71f3bef422c5922b5378f3b38810cbee2dec0feb621c99ab00"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"左右nodeを結合すると pair[x][y]=leftPair[x][y]+rightPair[x][y]+leftCnt[x]×rightCnt[y] になる。 写像f適用後はnewCnt[u]=Σ_{f(x)=u}cnt[x]、newPair[u][v]=Σ_{f(x)=u,f(y)=v}pair[x][y] と再分類できる。 node結合も写像適用も固定3値の定数個演算で閉じ、反転数はΣ_{x>y}pair[x][y]として直ちに得られる。","sourceRevisionIds":["source-abc265-g-problem-8dbb301709bd4fc77f81f3ea41c287ffaa6d5aa567c6fab03d38eb782514e17e","source-abc265-editorial-4586-307b3949ba570b71f3bef422c5922b5378f3b38810cbee2dec0feb621c99ab00"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-range-update-action"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,0,1)、写像f=(1,1,0)。","procedure":["初期反転は(2,0),(2,1)の2。","更新後は(0,1,1)で反転0。"],"executionTarget":null,"expectedResult":"更新後反転数0。","verificationStatus":"not_applicable","learningUnitIds":["unit-range-actions"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-range-update-action"],"prerequisiteIds":["unit-range-monoid-aggregation"],"attainmentCondition":"二値が同じ値に写るとpair情報は消してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"消さず同値pairへ合算する。後の結合には元の位置二つが残っているためfull pair表は同値組も保持する。"},"answer":{"reasoningOrVerification":"消さず同値pairへ合算する。後の結合には元の位置二つが残っているためfull pair表は同値組も保持する。","procedure":["具体例の各状態・寄与を再計算する。","消さず同値pairへ合算する。後の結合には元の位置二つが残っているためfull pair表は同値組も保持する。"],"expectedResult":"消さず同値pairへ合算する。後の結合には元の位置二つが残っているためfull pair表は同値組も保持する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間更新を要約へ作用させる](src/content/docs/learn/query/range-actions.md)

- 更新作用の合成順と要約への適用を定義し、遅延評価で保てる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 過去の版の保存・rollback・構造共有。

## 考察

値域が0,1,2だけなので、区間の反転数は各値の個数と、値xが値yより前に現れるordered pair数だけで表せる。

更新は三値集合上の関数 f=(S,T,U) を区間全体へ作用させる操作で、複数更新の遅延tagも関数合成で閉じる。

棄却する候補: 更新区間の全要素を書き換え、問い合わせごとにFenwick木等で反転数を数え直す。

区間長に比例する更新・照会が10万回あり最悪二乗時間になる。

採用する候補: 各segment nodeにcnt[x]とpair[x][y]を持ち、三値写像をlazy actionとしてpair表を写し替える遅延segment treeを使う。

node結合も写像適用も固定3値の定数個演算で閉じ、反転数はΣ_{x>y}pair[x][y]として直ちに得られる。

左右nodeを結合すると pair[x][y]=leftPair[x][y]+rightPair[x][y]+leftCnt[x]×rightCnt[y] になる。

写像f適用後はnewCnt[u]=Σ_{f(x)=u}cnt[x]、newPair[u][v]=Σ_{f(x)=u,f(y)=v}pair[x][y] と再分類できる。

small-alphabet sequence statisticsをordered-pair monoidへ持ち上げ、alphabet endomorphismをそのmonoidへのlazy actionとしてsegment treeに載せる。

## 典型の発動条件

### 小値域のpair統計量monoid

発動条件: 列の順序統計が値種類ごとの個数とordered pair数で決まり、値域が定数のとき。

部分列結合時に左右内部pairと左右をまたぐcnt積を足す。

### 写像作用付き遅延segment tree

発動条件: 区間更新が有限集合上の一括写像で、更新合成とnode統計の写し替えが定数時間でできるとき。

lazy tagを値ごとの行き先配列として持ち、新tagを既存tagの出力へ適用して合成する。

## 問題固有の要素

逆向きpairは pair[x][y]+pair[y][x]=cnt[x]cnt[y] から復元できるため、個数3つと反転方向3つの計6量だけを持つ実装も可能である。

別の問題へ持ち帰る視点: ordered pair表に対称な恒等式があるなら、必要方向だけ保存してstateを縮められる。

## 正当性

左右nodeを結合すると pair[x][y]=leftPair[x][y]+rightPair[x][y]+leftCnt[x]×rightCnt[y] になる。 写像f適用後はnewCnt[u]=Σ_{f(x)=u}cnt[x]、newPair[u][v]=Σ_{f(x)=u,f(y)=v}pair[x][y] と再分類できる。 node結合も写像適用も固定3値の定数個演算で閉じ、反転数はΣ_{x>y}pair[x][y]として直ちに得られる。

## 実装上の注意

- full 3×3 pair表を持つ場合、pair[x][x]は同値二位置の組数として扱い、leafでは0、mergeでcnt積を加える。
- lazy合成の順序は「既存の写像を受けた値へ新しい写像を適用」であり、配列代入順を逆にしない。
- pair数と反転数はN(N−1)/2まで増えるため64 bit整数を使う。

## 復習の核

- 小alphabetの区間統計は、全値pairの個数を持てば更新写像に対して閉じるか検討する。
- 遅延作用素が代入値ではなく写像なら、恒等写像と合成順序を先に定義してから実装する。

## 計算量と制約

### 時間

O(N+Q log N)、値域3なのでpair表は定数サイズ。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq A_i \leq 2; 1\leq Q\leq 10^5; In each query, 1\leq L \leq R \leq N.; In each query of the second kind, 0\leq S,T,U \leq 2.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,0,1)、写像f=(1,1,0)。

1. 初期反転は(2,0),(2,1)の2。
2. 更新後は(0,1,1)で反転0。

期待される結果: 更新後反転数0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

二値が同じ値に写るとpair情報は消してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

消さず同値pairへ合算する。後の結合には元の位置二つが残っているためfull pair表は同値組も保持する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/tasks/abc265_g) — source-abc265-g-problem-8dbb301709bd4fc77f81f3ea41c287ffaa6d5aa567c6fab03d38eb782514e17e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc265/editorial/4586) — source-abc265-editorial-4586-307b3949ba570b71f3bef422c5922b5378f3b38810cbee2dec0feb621c99ab00
