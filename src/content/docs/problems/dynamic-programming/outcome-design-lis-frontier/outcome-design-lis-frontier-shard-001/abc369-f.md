---
title: "ABC369-F — Gather Coins"
draft: true
authoringUnit: {"problemId":"abc369-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-lis-frontier/outcome-design-lis-frontier-shard-001/abc369-f.md","learningOutcomeIds":["outcome-design-lis-frontier"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness","unit-dp-sequence"],"excludedTopics":["LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lis-state","tag-constructive-witness"],"sourceRevisionIds":["source-abc369-editorial-10835-f7d009793c7de08f42cda826cd15d1d190b2503e80d06887d02386e9732cdddb","source-abc369-f-problem-fe90546a65130e5d35f17df00887c4686167db073e1ed767b6b9d2a080a6828c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"右下移動で通れるcoin列はrow,columnとも非減少。row昇順で同rowはcolumn昇順に並べるとcolumn LNDSがこのchainに一対一対応する。predecessor復元したchainをD,Rで接ぐと全選択coinを実際に通れ、最長chainが上界も達成する。","sourceRevisionIds":["source-abc369-editorial-10835-f7d009793c7de08f42cda826cd15d1d190b2503e80d06887d02386e9732cdddb","source-abc369-f-problem-fe90546a65130e5d35f17df00887c4686167db073e1ed767b6b9d2a080a6828c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [LIS・末尾の支配関係](src/content/docs/learn/dynamic-programming/dp-lis.md)

- 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md) — 存在条件の証明に対応する親・選択・局所操作を記録し、実際の構成へ戻す。
- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md) — DPの最小十分状態で得た考え方と実装を再利用し、列・subsequence DPの発動条件・正当化・境界を重複なく学ぶ。

## 考察

右・下移動だけで複数coinを拾える必要十分条件は、coinをrow昇順・同rowならcolumn昇順に並べたときcolumn列が広義単調増加することである。 したがって最大coin数はcolumn列のLNDSであり、predecessorを保存すれば選んだcoin列も復元できる。始終点間の残り移動は自由に補える。 同じrowではcolumn昇順に拾えるため、狭義LISでなく最初のd_j>cを置換する広義増加部分列を使う。 長さjを更新したcoin iにpre[i]=id[j−1]を保存し、最終idから逆に辿れば最適chainの座標列が得られる。

採用する候補: coinを(row,column)sortし、upper_bound版LISとpredecessorで最大列を復元して経路文字列を構成する。

二次元の到達可能chainを一次元LNDSへ落とし、最適値だけでなく実際の通過点も得られる。

棄却する候補: H×W grid上で各cellまでの最大coin数DPと経路復元を行う。

H,Wとも大きくgrid面積を確保できず、coinのないcellを状態にする必要はない。

同じrowではcolumn昇順に拾えるため、狭義LISでなく最初のd_j>cを置換する広義増加部分列を使う。

長さjを更新したcoin iにpre[i]=id[j−1]を保存し、最終idから逆に辿れば最適chainの座標列が得られる。

coinを(row,column)で昇順sortする。columnを順に見てdの最初の値>columnとなる位置jをupper_boundし、d[j],id[j]を更新、j>0ならpre[i]=id[j−1]とする。最長末尾からcoin列を復元し、(1,1)、各coin、(H,W)の間を必要なDとRで繋いだpathを出力する。

## 典型の発動条件

### 二次元chainのLNDS帰着

発動条件: 二座標がともに非減少な最大部分集合を選ぶとき。

第一座標でsortし、第二座標の広義増加部分列を求める。

### patience sortingの経路復元

発動条件: LIS系algorithmで最適長だけでなく要素列が必要なとき。

各長さの最新末尾idと更新時のpredecessorを保存する。

## 問題固有の要素

coin間のpath形状はcoin数に影響せず、比較可能なcoin chainさえ決めれば縦横移動を後から機械的に埋められる。

別の問題へ持ち帰る視点: 疎なgrid最適化では重要点のpartial orderを解き、空白区間のpathを後付けする。

## 正当性

右下移動で通れるcoin列はrow,columnとも非減少。row昇順で同rowはcolumn昇順に並べるとcolumn LNDSがこのchainに一対一対応する。predecessor復元したchainをD,Rで接ぐと全選択coinを実際に通れ、最長chainが上界も達成する。

## 実装上の注意

- 同row coinをcolumn昇順にsortし、upper_boundを使って同columnも連結可能にする。復元列は反転し、各区間のrow/column差だけ文字を出す。

## 復習の核

- 同じrow・同じcolumnに複数coinがある例でsortとupper_boundの組を確認する。復元後の各coinがpath上に現れるかsimulateする。

## 計算量と制約

### 時間

coin数N、盤面H×W。sortとLNDS O(N log N)、復元出力O(H+W)。

### 空間

coin、predecessor、tailsで O(N)、出力文字列 O(H+W)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq H,W \leq 2\times 10^5; 1\leq N \leq \min(HW-2, 2\times 10^5); 1\leq R_i \leq H; 1\leq C_i \leq W; (R_i,C_i)\neq (1,1); (R_i,C_i)\neq (H,W); (R_i,C_i) are pairwise distinct.; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc369/editorial/10835) — source-abc369-editorial-10835-f7d009793c7de08f42cda826cd15d1d190b2503e80d06887d02386e9732cdddb
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc369/tasks/abc369_f) — source-abc369-f-problem-fe90546a65130e5d35f17df00887c4686167db073e1ed767b6b9d2a080a6828c
