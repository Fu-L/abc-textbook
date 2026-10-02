---
title: "ABC452-G — 221 Substring"
draft: true
authoringUnit: {"problemId":"abc452-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-lcp-index/outcome-build-suffix-lcp-index-shard-001/abc452-g.md","learningOutcomeIds":["outcome-build-suffix-lcp-index"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["rolling hashによる一致比較と回文半径。"],"tagIds":["tag-suffix-lcp-index"],"sourceRevisionIds":["source-abc452-editorial-18406-31af11ca79f4f4e52658cb366e92976bda9c6c0bf3f3dd361472a8d6f5b88938","source-abc452-g-problem-2dcf1791ac2d6bae9c05b1ac88dfedaeb943e4967b9246015a391dde2148eb08"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"221列は各数字vのrun長がvに等しい。元run長m<vは使えず0で区切り、m=vは内部使用可、m>vは端としてだけ使えるのでv,0,vで左右利用を分ける。この変換はvalid列種類とzerofree短列substring種類を一対一に写す。SA順の既出共有prefixは直前LCPまでなのでzerofree長からそれを引いた正部分が各suffixの新種類数。全和がdistinct数になる。","sourceRevisionIds":["source-abc452-editorial-18406-31af11ca79f4f4e52658cb366e92976bda9c6c0bf3f3dd361472a8d6f5b88938","source-abc452-g-problem-2dcf1791ac2d6bae9c05b1ac88dfedaeb943e4967b9246015a391dde2148eb08"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [接尾辞の順序とLCPを索引化する](src/content/docs/learn/string/suffix-lcp-index.md)

- 接尾辞の辞書順とLCPを索引化し、出現範囲・部分文字列順位・distinct数・巡回shiftを処理できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- rolling hashによる一致比較と回文半径。

## 考察

S を run-length encoding すると、221部分文字列の内部 run は値=長さ、両端 run は値≤長さである。各 run を値・0・値の短列へ置換すると候補は0を含まない部分列へ一対一対応する。

採用する候補: RLE から変換列 T を作り、suffix array と LCP を構築する。各 suffix の先頭から0までの長さ zerofree と直前 suffix との LCP の差の正部分を足す。

辞書順 suffix 順に初めて現れる substring 長は LCP+1 以降であり、0を含まない最大長で打ち切ると distinct な有効 substring を一度ずつ数えられる。

棄却する候補: S の全連続部分文字列を列挙し、run 長が221条件を満たすか set で重複除去する。

候補が Θ(N^2) 個あり、文字列比較と set 格納も大きすぎる。

run が短すぎる v>m なら使用不能で0、ぴったりなら内部可の v、余裕 v<m なら左右端利用を区切る v,0,v に置換する。

suffix p_k から始まる新規有効 substring 数は max(0,zerofree[p_k]-LCP[k]) である。

S を (v_i,m_i) に圧縮して規則により T を長さO(N)で生成する。T の suffix array・LCP を作り、後ろから各位置の次の0までの長さを求め、suffix順に正部分差を64 bitで合計する。

## 典型の発動条件

### run-length 条件の記号列変換

発動条件: 部分文字列の各 run に内部・端点で異なる制約があるとき。

利用可能性を sentinel 0 付きの短列へ符号化する。

### suffix array による distinct substring 数え上げ

発動条件: 禁止記号までに限った異なる連続部分列数を数えたいとき。

suffix ごとの有効 prefix 長から前 suffix との LCP を引く。

## 問題固有の要素

複雑な run 条件を、候補 block 列に sentinel を挿入して単なる禁止記号なし substring へ変換できる。

別の問題へ持ち帰る視点: distinct substring は各 suffix が辞書順で初めて追加する prefix 長区間として数える。

## 正当性

221列は各数字vのrun長がvに等しい。元run長m<vは使えず0で区切り、m=vは内部使用可、m>vは端としてだけ使えるのでv,0,vで左右利用を分ける。この変換はvalid列種類とzerofree短列substring種類を一対一に写す。SA順の既出共有prefixは直前LCPまでなのでzerofree長からそれを引いた正部分が各suffixの新種類数。全和がdistinct数になる。

## 実装上の注意

- v<m の同じ run が左右端の二役を持つため v,0,v の対応を崩さない。LCP index と zerofree の位置 mapping を一致させる。

## 復習の核

- v>m、v=m、v<m の三runを端・内部として使えるか比較し、変換 T 上の substring との一対一対応を小例で確かめる。

## 計算量と制約

### 時間

O(N)を線形suffix arrayとLCP構築の場合とする。RLEと短列生成もO(N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 500\,000; 1 \leq A_i \leq 9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/editorial/18406) — source-abc452-editorial-18406-31af11ca79f4f4e52658cb366e92976bda9c6c0bf3f3dd361472a8d6f5b88938
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc452/tasks/abc452_g) — source-abc452-g-problem-2dcf1791ac2d6bae9c05b1ac88dfedaeb943e4967b9246015a391dde2148eb08
