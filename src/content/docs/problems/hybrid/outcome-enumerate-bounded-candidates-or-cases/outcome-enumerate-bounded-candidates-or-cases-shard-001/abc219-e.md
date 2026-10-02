---
title: "ABC219-E — Moat"
draft: true
authoringUnit: {"problemId":"abc219-e","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc219-e.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc219-e-problem-d3751faf2a5e10eeb5d4598775804d94d37a9e65155af89d89b3217d49f47b4b","source-abc219-editorial-2652-903281e108555192bca83c7928679324c5c0dde2dbef7f14d716583dd3f80943"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"有効な mask は「村セルを全て含む」「選択セルが一成分」「非選択セルが盤外と一成分」の三条件で特徴付けられる。 盤面サイズが固定で全候補を調べられ、幾何条件を有限グリッド上の連結性へ正確に移せる。","sourceRevisionIds":["source-abc219-e-problem-d3751faf2a5e10eeb5d4598775804d94d37a9e65155af89d89b3217d49f47b4b","source-abc219-editorial-2652-903281e108555192bca83c7928679324c5c0dde2dbef7f14d716583dd3f80943"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

頂点が整数格子上、辺が軸平行なので、堀の内部か外部かは 4×4 の各単位正方形について決まる。異なる単純な堀は異なる内部セル集合を作るため、連続図形を 16 bit の選択へ置き換えられる。

内部セル集合は全ての村を含むだけでは足りない。内部が4近傍で一つにつながり、外部も盤面の外側から4近傍で全て到達できなければ、境界が複数になったり穴を囲んだりして一つの自己交差しない多角形にならない。

採用する候補: 2^16 個の内部セル mask を全列挙し、村の包含、内部の4連結、穴のない外部連結を flood fill で判定する。

盤面サイズが固定で全候補を調べられ、幾何条件を有限グリッド上の連結性へ正確に移せる。

棄却する候補: 格子点を順にたどって軸平行多角形の頂点列を直接生成する。

同じ境界の始点や向きによる重複を除く必要があり、自己交差、複数境界、穴の判定も複雑になる。

有効な mask は「村セルを全て含む」「選択セルが一成分」「非選択セルが盤外と一成分」の三条件で特徴付けられる。

各 mask について村 bit が全て立っているか確認し、選択セルを4近傍探索して選択数と到達数を比較する。さらに盤面を外枠付きに拡張し、外枠から非選択セルだけを探索して未到達の空セルがなければ答えへ加える。

## 典型の発動条件

### 小固定盤面の bitmask 全探索

発動条件: 連続的に見える構成が少数セルの内外選択で一意に表せるとき。

各単位領域を1 bit に対応させ、全候補へ局所・連結条件を検査する。

### 外枠からの flood fill による穴判定

発動条件: 選択領域が穴を持たないこと、または全ての空領域が外部につながることを判定するとき。

盤面を一周広げた外側から非選択セルを探索し、囲まれた未到達セルの有無を調べる。

## 問題固有の要素

堀そのものを数える代わりに、堀が決める16領域の内外分類を数えると一対一対応になり、幾何の例外が二種類の4連結性へ落ちる。

別の問題へ持ち帰る視点: 整数格子上の直交多角形では、境界列挙より先にセル集合との双対表現を探し、内部と補集合の連結性を確認する。

## 正当性

有効な mask は「村セルを全て含む」「選択セルが一成分」「非選択セルが盤外と一成分」の三条件で特徴付けられる。 盤面サイズが固定で全候補を調べられ、幾何条件を有限グリッド上の連結性へ正確に移せる。

## 実装上の注意

- 外部判定は4×4 内の空セル一個から始めず、6×6 などの外枠を置いて盤外から始める。内部連結の起点は mask の立っている任意の1 bit とする。

## 復習の核

- 村を全て含むが内部が二成分の mask と、内部は連結だが空洞を持つ mask を一つずつ描き、二回の flood fill が別々に必要な理由を確認する。

## 計算量と制約

### 時間

O(2¹⁶·16)、4×4盤面maskと内外flood fill。

### 空間

O(16)、mask一つ分探索。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: A_{i, j} \in \lbrace 0, 1\rbrace; There is at least one pair (i, j) such that A_{i, j} = 1.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/tasks/abc219_e) — source-abc219-e-problem-d3751faf2a5e10eeb5d4598775804d94d37a9e65155af89d89b3217d49f47b4b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc219/editorial/2652) — source-abc219-editorial-2652-903281e108555192bca83c7928679324c5c0dde2dbef7f14d716583dd3f80943
