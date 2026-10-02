---
title: "ABC349-G — Palindrome Construction"
draft: true
authoringUnit: {"problemId":"abc349-g","docPath":"src/content/docs/problems/string-geometry/outcome-characterize-palindrome-intervals/outcome-characterize-palindrome-intervals-shard-001/abc349-g.md","learningOutcomeIds":["outcome-characterize-palindrome-intervals"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-dsu-components"],"excludedTopics":["一般の部分文字列hash比較と、接尾辞・LCPの索引。"],"tagIds":["tag-palindrome-radius","tag-constructive-witness","tag-dsu-components"],"sourceRevisionIds":["source-abc349-editorial-9782-4abdcd44aecd9b4532728588d61fa361d9924abf347e49b7857cc9d5a622f030","source-abc349-g-problem-47759f44ba66a31c4361f8d924405fe5fbe9dbcce3c7982e2ae33a3f07457474"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"要求半径内のmirror位置は等値、次の外側pairは不等であり半径exact条件に必要十分。等値をDSU縮約すると不等self-loopは矛盾。重なる内部等値はmirrorで再利用でき新右端だけunionすれば全必要制約を得る。componentを初出順に既着色neighborと異なる最小色で塗ればprefix辞書順を最小化でき、未着色componentは後で別色を選べる。通常Manacherで全半径を照合して仮定付き省略の不整合を排除する。","sourceRevisionIds":["source-abc349-editorial-9782-4abdcd44aecd9b4532728588d61fa361d9924abf347e49b7857cc9d5a622f030","source-abc349-g-problem-47759f44ba66a31c4361f8d924405fe5fbe9dbcce3c7982e2ae33a3f07457474"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [回文半径と左右対称区間を特定する](src/content/docs/learn/string/palindrome-radius.md)

- 各中心の回文半径を求め、左右対称な区間の成立条件を判定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)
- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 一般の部分文字列hash比較と、接尾辞・LCPの索引。

## 考察

各iの内側palindrome条件は対称位置同士のequality、もう一つ外側までpalindromeでない条件は外側pairのinequalityになる。equality edgeをDSUで縮約し、inequality edgeをcomponent間の色違い制約として扱える。

採用する候補: Manacher型の再利用でO(N)本のequality unionだけ生成し、縮約graphをgreedy coloringする

本来O(ΣA_i)本ある対称pairの連結性を線形に保ち、最終検証込みで大入力へ対応できる。

棄却する候補: 各iで距離1…A_iの全対称pairをunionする

A_iが大きいcenterが多数あるとequality edge数がO(N^2)になる。

既に処理したcenterのradius情報で重なるpalindrome内部のequalityをmirrorから再利用し、新しく右端を伸ばす対称pairだけunionすれば、Manacherと同じ償却でunion回数をO(N)にできる。得たcomponent内にinequality edge両端が入れば不可能である。

modified Manacher走査で各center iの要求radius A_iまで、既知mirror範囲をskipしつつ新規対称位置をDSU unionする。境界内なら(i-A_i-1,i+A_i+1)をinequality edgeにする。自己loopがなければ元index昇順に未着色componentへ、既着色のinequality neighborが使わない最小正整数を割り当てる。生成Sを通常Manacherで検証し全radius=A_iなら出力、違えばNo。

## 典型の発動条件

### Manacher型の対称制約圧縮

発動条件: 多数centerのpalindrome equality区間が大きく重複する。

既知の右端とmirror radiusを再利用し、未確認部分だけ対称pairを接続する。

### equality縮約後のgreedy coloring

発動条件: 等しい変数群と、異なる必要がある群pairがあり、正整数color数に上限がない。

DSU componentを最初の出現順に処理し、colored neighborのmexを割り当てる。

## 問題固有の要素

lexicographic最小化はindexを左から見て、そのindexのcomponentが初出の時に利用可能な最小値を選べばよい。未来componentは無制限な新色で必ず調整できるため、このgreedyを妨げない。

別の問題へ持ち帰る視点: unbounded graph coloringのlexicographic最小列はcomponent初出順のneighbor-color mexで構成できる。

## 正当性

要求半径内のmirror位置は等値、次の外側pairは不等であり半径exact条件に必要十分。等値をDSU縮約すると不等self-loopは矛盾。重なる内部等値はmirrorで再利用でき新右端だけunionすれば全必要制約を得る。componentを初出順に既着色neighborと異なる最小色で塗ればprefix辞書順を最小化でき、未着色componentは後で別色を選べる。通常Manacherで全半径を照合して仮定付き省略の不整合を排除する。

## 実装上の注意

- modified union生成は入力が不整合でも仮定付きなので、構成後に標準ManacherでradiusがAと完全一致するか必ず検証する。inequality self-loopを先に弾く。

## 復習の核

- A_i=0、全体palindrome、重なるradiusが矛盾する配列、inequality self-loopを小Nのpartition/color全探索と比較し最終radiusを再計算する。

## 計算量と制約

### 時間

O(Nα(N))。Manacher償却でO(N) unionと不等辺処理、最終検証。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 0 \leq A_i \leq \min\{i-1,N-i\}; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/editorial/9782) — source-abc349-editorial-9782-4abdcd44aecd9b4532728588d61fa361d9924abf347e49b7857cc9d5a622f030
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc349/tasks/abc349_g) — source-abc349-g-problem-47759f44ba66a31c4361f8d924405fe5fbe9dbcce3c7982e2ae33a3f07457474
