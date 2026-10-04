---
title: "ABC441-E — A > B substring"
draft: true
authoringUnit: {"problemId":"abc441-e","docPath":"src/content/docs/problems/data-structures/outcome-linearize-static-range-information/outcome-linearize-static-range-information-shard-001/abc441-e.md","learningOutcomeIds":["outcome-linearize-static-range-information"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-weighted-prefix-fenwick"],"excludedTopics":["オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。"],"tagIds":["tag-prefix-difference","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc441-e-problem-36a728463fec107cef6ad052a2c07ef41c766a99bf71452baa8c2277046cd8cb","source-abc441-editorial-15101-836aa71057f4008e66fae982f48c48538e32df6d86a9d632e5cd47750c32ee31"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"区間条件 A_count>B_count は D_j>D_{i-1} と同値で、空 prefix D_0 も左端1の区間を表す。 等しい prefix 差は個数差0の区間なので数えず、strict less の query にする必要がある。 各有効部分文字列と i<j かつ D_i<D_j の組が一対一に対応し、D_i は [-N,N] に収まるため全組を高速に数えられる。","sourceRevisionIds":["source-abc441-e-problem-36a728463fec107cef6ad052a2c07ef41c766a99bf71452baa8c2277046cd8cb","source-abc441-editorial-15101-836aa71057f4008e66fae982f48c48538e32df6d86a9d632e5cd47750c32ee31"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

- prefix配列またはprefix変数を置き、区間和を二つのprefix値の差で表現できる。多次元の直方体は2^D隅の包除で取得し、一括加算は端点差分へ変換できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- オンライン更新を伴うFenwick Tree・Segment Treeの動的区間要約。

## 考察

部分文字列内の A と B の個数差は、prefix 差 D_i=(先頭 i 文字の A 数)-(B 数) の差 D_j-D_{i-1} で表せる。したがって条件は二つの prefix 値の狭義大小だけに落ちる。

採用する候補: D_0=0 から順に走査し、過去に現れた D_i のうち現在値 D_j より小さいものの個数を Fenwick tree または値域 frequency で加算する。

棄却する候補: 各左端から右端を伸ばし、A と B の個数を数え直す。

個数差を更新できても部分文字列の候補は Θ(N^2) 個あり、N=5×10^5 では列挙できない。

A を +1、B を -1 として prefix 差を作る。各 D_j の処理前に過去頻度の D<D_j を答えへ加え、その後 D_j を登録する。値域を offset して累積頻度または Fenwick tree で管理する。

## 典型の発動条件

### prefix 差への変換

発動条件: 部分区間内の二種類の個数差や和の符号を問われるとき。

区間条件を二つの prefix 値の大小関係へ変換する。

### オンライン順序対の数え上げ

発動条件: i<j を保ちながら prefix 値の大小を数えたいとき。

過去値の頻度に対する狭義 prefix sum を加算する。

## 問題固有の要素

文字列条件を +1/-1 の累積和にすると、部分文字列の内容ではなく端点の順序対だけを数えればよい。

別の問題へ持ち帰る視点: 区間の和や個数差の総数では、prefix 値の大小・一致へ言い換えられないかを確認する。

## 正当性

区間条件 A_count>B_count は D_j>D_{i-1} と同値で、空 prefix D_0 も左端1の区間を表す。 等しい prefix 差は個数差0の区間なので数えず、strict less の query にする必要がある。 各有効部分文字列と i<j かつ D_i<D_j の組が一対一に対応し、D_i は [-N,N] に収まるため全組を高速に数えられる。

## 実装上の注意

- D_0 を先に登録し、D_j 自身は query の後で登録する。同値を含めると A と B が同数の区間まで誤って数える。

## 復習の核

- 区間 [l,r] と prefix の組 (l-1,r) の対応を書き、空 prefix・狭義不等号・登録順の三点を小例で照合する。

## 計算量と制約

### 時間

O(N log N)、Dの値域[-N,N]。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le5\times10 ^ 5; S is a string of length N consisting of A, B, and C.; N is an integer.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/tasks/abc441_e) — source-abc441-e-problem-36a728463fec107cef6ad052a2c07ef41c766a99bf71452baa8c2277046cd8cb
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/editorial/15101) — source-abc441-editorial-15101-836aa71057f4008e66fae982f48c48538e32df6d86a9d632e5cd47750c32ee31
