---
title: "ABC464-G — Celester 2"
draft: true
authoringUnit: {"problemId":"abc464-g","docPath":"src/content/docs/problems/graph-search/outcome-optimize-path-matching-by-contraction/outcome-optimize-path-matching-by-contraction-shard-001/abc464-g.md","learningOutcomeIds":["outcome-optimize-path-matching-by-contraction"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-greedy-exchange","unit-priority-queue-best-first"],"excludedTopics":["path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-path-matching-contraction","tag-greedy-exchange-order"],"sourceRevisionIds":["source-abc464-editorial-22263-0960a9f1dc1410f75f462b47b2a53f7d625d4255420c30b453009cd454388b54","source-abc464-g-problem-985c658fee637f7070d0b04d92ae4b8089f5ec419f593aafab19ab36913e711a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定端差分の一flipは隣接二bit反転。最適増加操作をzero二つのpairingへ正規化するとpair費用はzero位置距離。noncrossing最適は隣接zero間path matchingで、最小gap選択と両隣−中央の補正contractionが濃度別最小を保つ。prefixcostは各必要増加量の最少flip数。","sourceRevisionIds":["source-abc464-editorial-22263-0960a9f1dc1410f75f462b47b2a53f7d625d4255420c30b453009cd454388b54","source-abc464-g-problem-985c658fee637f7070d0b04d92ae4b8089f5ec419f593aafab19ab36913e711a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [path matchingのheap縮約greedy](src/content/docs/learn/graph/path-matching-contraction.md)

- 重み付きpathの最小k-matchingについて、最小edge採用後の補正縮約を証明し、heapと双方向linkで全cardinalityの最適値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)
- [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

対象外:

- path matchingのheap縮約greedyの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

両端に固定S,Rを足して隣接異符号を1とする差分01列へ移すと、一文字flipは隣接二bitの反転になる。1を増やす最適操作は二つの0をpairにし、その間を移動させて00を11にすることと解釈できる。 差分列の1数 b とRS遷移数aは固定端により a=(b-1)/2 なので、目的は1数を必要量まで増やすことに等しい。 隣り合う0位置をpairにするcostはその距離で、同じ0を二pairで使えない条件はDの隣接要素を同時選択できないpath matching条件になる。

採用する候補: 0位置列の隣接距離Dを作り、隣接edgeを共有しないmatchingから所定個数を選ぶ最小重み問題を、最小edge貪欲と連結list更新 D_{l}+D_{r}-D_i で順に解く。

最適操作では11を00へ減らすflipを除去でき、0 pairのnoncrossing matchingへ正規化できる。path matchingのcardinality別最小重みにはCandies型のedge contraction貪欲が成立する。

棄却する候補: 元文字列の全2^N flip subsetを列挙し、各結果のRS境界数を数える。

flip位置subsetが指数個あり、同じ最終差分を作る操作順も重複する。

差分列の1数 b とRS遷移数aは固定端により a=(b-1)/2 なので、目的は1数を必要量まで増やすことに等しい。

隣り合う0位置をpairにするcostはその距離で、同じ0を二pairで使えない条件はDの隣接要素を同時選択できないpath matching条件になる。

固定端込み差分を作り0位置間距離Dを列挙する。各D_iをmin-heapへ入れ、alive linked listを持つ。最小iを選んで累積costを記録し、隣接edgeを削除して新edge D_left+D_right-D_iを挿入する。必要な1増加数/2回分のprefix costを答える。

## 典型の発動条件

### 文字flipの境界差分化

発動条件: binary文字列の一文字反転でrun数・遷移数を最適化したいとき。

隣接差分では操作が隣接二bit反転になる。

### path matchingのcontraction貪欲

発動条件: path edgeから隣接しない所定本数を最小重みで選びたいとき。

最小edge採用後に近傍を縮約し補正重みをheapへ戻す。

## 問題固有の要素

run数の文字列操作は境界bitへ変換すると、0の移動と消去というmatching問題に見える。

別の問題へ持ち帰る視点: cardinality別minimum path matchingは単純な軽辺順ではなく、選択後の隣接edgeを補正contractすることで貪欲化できる。

## 正当性

固定端差分の一flipは隣接二bit反転。最適増加操作をzero二つのpairingへ正規化するとpair費用はzero位置距離。noncrossing最適は隣接zero間path matchingで、最小gap選択と両隣−中央の補正contractionが濃度別最小を保つ。prefixcostは各必要増加量の最少flip数。

## 実装上の注意

- 両端sentinelは変更不能だが差分0位置には含める規約を合わせる。heapのstale entryとlinked list端番兵を安全に処理する。

## 復習の核

- 一文字flipが差分二bitを反転する例と、0 pair距離が操作数になる移動列を描き、contraction補正式を三edgeで確認する。

## 計算量と制約

### 時間

文字列長N、必要pair数K。zero gap列O(N)、heap/list contraction O((N+K)log N)。

### 空間

zero位置、alive link、heap、prefix回答 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le T \le 10^4; N is an integer between 2 and 10^6, inclusive.; S is a string of length N consisting of S and R.; The sum of N in a single input is at most 10^6.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/editorial/22263) — source-abc464-editorial-22263-0960a9f1dc1410f75f462b47b2a53f7d625d4255420c30b453009cd454388b54
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc464/tasks/abc464_g) — source-abc464-g-problem-985c658fee637f7070d0b04d92ae4b8089f5ec419f593aafab19ab36913e711a
