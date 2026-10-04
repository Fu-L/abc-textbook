---
title: "ABC362-E — Count Arithmetic Subsequences"
draft: true
authoringUnit: {"problemId":"abc362-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-order-preserving-dp/outcome-design-order-preserving-dp-shard-001/abc362-e.md","learningOutcomeIds":["outcome-design-order-preserving-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-sequence-subsequence-dp"],"sourceRevisionIds":["source-abc362-e-problem-12d537dccbcb369fc5a6142726d86335fa37a673f581d34beeb99b6bda5e0ace","source-abc362-editorial-10399-fb31b09b5e81b48ced70ca519f2ccf93e7c7fc2c9e0291693eee4c5e26ffdbc9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"等差列の最初二indexを固定すると公差が定まり、その後は同公差の次index始まり列だけ接げる。右から計算して依存先を確定する。各列は最初二indexと残りに一意分解され長さ別に漏れ重複なく数えられる。","sourceRevisionIds":["source-abc362-e-problem-12d537dccbcb369fc5a6142726d86335fa37a673f581d34beeb99b6bda5e0ace","source-abc362-editorial-10399-fb31b09b5e81b48ced70ca519f2ccf93e7c7fc2c9e0291693eee4c5e26ffdbc9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 列の順序を保つ状態と、選ぶ・選ばない遷移を設計できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

## 考察

長さ1の部分列は必ず等差数列でN個ある。長さ2以上では先頭位置i、第2位置jを選ぶと公差d=A_j−A_iが一意に決まる。 先頭がiで長さl、公差dの列は、j>iかつA_j−A_i=dである「先頭j、長さl−1、公差d」の列の前へA_iを付けたものとして分解できる。 各pair(i,j)は長さ2の等差部分列を一つ作り、それより長い列はdp[j][l−1][d]をそのまま延長する。 dは負数や10^9規模も取るため、位置ごとの連想配列または事前列挙した差の座標圧縮で管理する。

採用する候補: iを後ろから処理し、dp[i][length][difference]へ後続jの同じ公差の状態を加える。

位置順・長さ・公差という等差部分列の必要情報だけで閉じ、Nが80なので全長を同時に数えられる。

棄却する候補: 全ての部分列をbit maskで列挙し、隣接差が一定か判定する。

部分列数が指数的で、N=80では列挙の入口にも立てない。

各pair(i,j)は長さ2の等差部分列を一つ作り、それより長い列はdp[j][l−1][d]をそのまま延長する。

dは負数や10^9規模も取るため、位置ごとの連想配列または事前列挙した差の座標圧縮で管理する。

ans[1]=Nとする。iをN−1から0へ、j>iを走査してd=A_j−A_iを得る。dp[i][2][d]へ1を足し、各l≥3でdp[j][l−1][d]をdp[i][l][d]へ加える。同時に各追加分をans[l]へ法上で加算し、全長の答えを出力する。

## 典型の発動条件

### 部分列の先頭追加DP

発動条件: 先頭二要素で属性が決まり、残りが同属性の短い部分列になるとき。

後ろから状態を確定し、後続状態の前に一要素を接続する。

### 疎な差分状態

発動条件: 差や傾きが大きな整数範囲を取るが、実際に現れる種類が入力pairに限られるとき。

mapまたは位置別圧縮で存在する公差だけを保存する。

## 問題固有の要素

「最後の二項」で延長する定番DPと対称に、「最初の二項」を固定して後ろから処理しても公差情報が閉じる。

別の問題へ持ち帰る視点: 部分列DPでは走査方向を選び、既に確定した側の状態へ一要素を付ける形にする。

## 正当性

等差列の最初二indexを固定すると公差が定まり、その後は同公差の次index始まり列だけ接げる。右から計算して依存先を確定する。各列は最初二indexと残りに一意分解され長さ別に漏れ重複なく数えられる。

## 実装上の注意

- 長さ1をDPのpair遷移とは別に数える。A_j−A_iは負も含み、各加算を指定modで正規化する。

## 復習の核

- 長さ2のbase caseと長さ3の延長を具体的な三要素で追う。dpのiが先頭か末尾かをコード中でも統一する。

## 計算量と制約

### 時間

N≤80。始点、次index、長さの走査 O(N³)、hash公差照会はexpected O(1)。

### 空間

始点×長さ×異公差を全保存する安全な上界 O(N³)、公差mapを使う。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 80; 1 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc362/tasks/abc362_e) — source-abc362-e-problem-12d537dccbcb369fc5a6142726d86335fa37a673f581d34beeb99b6bda5e0ace
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc362/editorial/10399) — source-abc362-editorial-10399-fb31b09b5e81b48ced70ca519f2ccf93e7c7fc2c9e0291693eee4c5e26ffdbc9
