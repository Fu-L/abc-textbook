---
title: "ABC233-G — Strongest Takahashi"
draft: true
authoringUnit: {"problemId":"abc233-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc233-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-prefix-aggregate"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp","tag-prefix-difference"],"sourceRevisionIds":["source-abc233-editorial-3184-ab4b36adbfd0c3b627d15746dfe4d9457e05f0c83e47e5e8554f2b06686d0f9d","source-abc233-g-problem-3b941d80cb692b12d25a1776c90c2c690d4c1f32cd5e2ff6fadcadb670749baf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"一辺s=max(height,width)の正方形を置けば部分長方形の全ブロックを消せる。盤面端では正方形を内側へずらせばよい。これより安い最適な操作列の正方形辺長をs_1,…,s_tとするとΣs_i<sである。長い方が高さなら、各正方形が覆う行の総数は高々Σs_iなので、部分長方形内にどの操作も触れない行が存在する。その行は全ブロックが消される以上もともと空で、どの正方形もその行を跨がない。上下を独立に解いた費用和が元の最適値以下になる。幅が長い場合は同様に空列で分ける。従って一括消去と全水平・垂直分割を調べれば最適解を必ず含み、空領域を0とした小さい長方形からの帰納法でdpが正しい。","sourceRevisionIds":["source-abc233-editorial-3184-ab4b36adbfd0c3b627d15746dfe4d9457e05f0c83e47e5e8554f2b06686d0f9d","source-abc233-g-problem-3b941d80cb692b12d25a1776c90c2c690d4c1f32cd5e2ff6fadcadb670749baf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md) — 一次元累積和を土台に、包除で矩形和へ拡張し、静的区間量を接頭辞や端点の差へ変換する。

## 考察

正方形操作の位置を直接選ぶより、残るブロックを含む長方形を状態にする。高さh、幅wの範囲は一辺max(h,w)の正方形でまとめて消せるため、まずこの費用を上界にする。

この上界より安く済む操作列では、辺長の合計が長い辺より小さい。各正方形の行または列への射影を考えると、長い辺の方向に操作が一度も触れない空行・空列がある。その線を跨ぐ操作もないため、上下または左右の二問題へ分割できる。これが区間DPを使える根拠である。

dp[top,bottom,left,right]を範囲の最小体力とする。空範囲・ブロックがない範囲は0。それ以外はmax(height,width)で初期化し、全水平cutと垂直cutで二範囲のdp和を最小化する。小さい高さ・幅から順に計算する。切線自体が空であるかを前計算して絞ってもよいが、全cutを試す実装でも状態O(N⁴)×cut O(N)のO(N⁵)である。

## 典型の発動条件

### 二次元区間 DP

発動条件: 長方形領域の対象を一括処理するか、一本の水平・垂直線で二領域へ分ける再帰が成立するとき。

四つの境界を状態にし、全 cut 位置で二つの部分長方形の答えを加える。

## 問題固有の要素

費用が長方形の長辺長 C 未満なら各操作正方形の辺長も C 未満であり、全ブロック行列を横断できないことから空の分離線が現れる。

別の問題へ持ち帰る視点: 一括処理コストより良い解の各操作サイズが制限されるとき、対象配置に必ずセパレータが生じるかを調べる。

## 正当性

一辺s=max(height,width)の正方形を置けば部分長方形の全ブロックを消せる。盤面端では正方形を内側へずらせばよい。これより安い最適な操作列の正方形辺長をs_1,…,s_tとするとΣs_i<sである。長い方が高さなら、各正方形が覆う行の総数は高々Σs_iなので、部分長方形内にどの操作も触れない行が存在する。その行は全ブロックが消される以上もともと空で、どの正方形もその行を跨がない。上下を独立に解いた費用和が元の最適値以下になる。幅が長い場合は同様に空列で分ける。従って一括消去と全水平・垂直分割を調べれば最適解を必ず含み、空領域を0とした小さい長方形からの帰納法でdpが正しい。

## 実装上の注意

- ブロックが一つもない長方形の値は 0 とし、単純な max(height,width) 初期値のままにしない。
- 半開区間など境界表現を統一し、水平・垂直 cut の両側が真に小さい長方形となる順序で更新する。

## 復習の核

- 範囲操作の選び方を列挙せず、任意領域を一回で処理する自明上界と、それを下回る解に必要な分離構造を探す。
- 四次元 DP の正当性は、最適解が一括処理か、どこか一線で独立に分けられるかという網羅性で説明する。

## 計算量と制約

### 時間

N×N。長方形O(N⁴)、切線O(N)で O(N⁵)。

### 空間

長方形DP O(N⁴)、盤面O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1 \le N \le 50; S_i consists of # and ..; |S_i|=N

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc233/editorial/3184) — source-abc233-editorial-3184-ab4b36adbfd0c3b627d15746dfe4d9457e05f0c83e47e5e8554f2b06686d0f9d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc233/tasks/abc233_g) — source-abc233-g-problem-3b941d80cb692b12d25a1776c90c2c690d4c1f32cd5e2ff6fadcadb670749baf
