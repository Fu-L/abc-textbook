---
title: "LIS・末尾の支配関係"
description: "「LIS・末尾の支配関係」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 65
---

# LIS・末尾の支配関係

習得対象の目安: **水色（1200–1599）**。末尾の支配関係で状態を圧縮し、二分探索の境界と復元方法を理解する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### LIS・末尾の支配関係

同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。

LISは「末尾が小さいほど次を延長しやすい」という支配関係を使う。長さごとの最小末尾tailsを保てば、狭義増加はlower_bound、非減少はupper_boundで更新できる。ABC393 Fのprefix・値上限query、ABC369 Fの二次元順序と復元へ進む。

ABC369 Fでは同じ列も通れるため非減少を扱う。長さごとの末尾に加えて代表位置と直前位置を記録すれば経路を復元できる。値域に制約が付く発展問題は値域集約による部分列DPの節で扱う。

ABC237 Fは、LISの長さを求める算法そのものを数え上げDPの遷移器にする。長さ1,2,3の最小末尾の組を状態とし、次の値で最初の「その値以上の末尾」を置き換える。どこにも入らない遷移は長さ4を作るので捨て、最後に長さ3が存在する状態を足す。末尾の支配関係を理解してから、同じ末尾配列を持つprefixの個数を集約する。

### 習得する技能

- 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

同じ長さの増加部分列では、末尾が小さい方が次の値を追加しやすい。そのため長さごとの最小末尾だけを残し、値xを入れる最初の末尾位置を二分探索できる。


tailsは初め空とし、値xごとに狭義増加では最初のtails[p]≥xを探す。pが末尾ならxをappend、他ならtails[p]=xへ置換する。tails[p]は長さp+1の部分列の最小末尾。前のtails[p−1]<xだから長さp+1を作れ、tails[p]≥xの位置より先には延長できないため不変量を保つ。非減少なら最初のtails[p]>xへ替える。

一本を復元するには各tails位置の元配列indexも保存し、位置iがpへ入るときparent[i]を更新前のtailsIndex[p−1]へ記録する（p=0は無し）。最後のtailsIndexからparentをたどって逆順にすれば、値とindex順の両方を満たす列を得る。途中でtails自体を書き替えても、過去のparentは変えない。

個数の計数では小さい末尾の列が大きい末尾の列を支配しても、後者を捨てると異なる列の個数を失う。最小末尾一個に個数を足すだけでは不足する。ここでは選ぶindex列が違えば別の部分列として数える。値別に(最大長,その個数)を保持し、長さが大きい方を採用、同長なら個数を加算する集約を作る。

まだ非空の部分列がない葉と集約の単位元は(0,0)で初期化する。値xの処理ではx未満のprefixから(l,c)を取得し、l=0なら一要素の列を一つだけ作って(1,1)、他なら(l+1,c)を値xの葉へ集約する。非減少ならx以下を取得し、いずれもqueryを終えてからそのindexの更新を行う。同値の葉は上書きせず既存値と集約する。全葉を集約した個数がLISの個数で、空配列では空部分列を数える規約なら答え1と別に扱う。この値軸DPはO(N log N)。空の各葉を(0,1)にすると空部分列を葉数だけ重複計数するので、空からの開始と集約の単位元を分ける。

## 成立条件と計算量

O(N log N)時間・O(N)空間。狭義増加はlower_bound、非減少はupper_bound。個数を数える場合は末尾値ごとの最大長と個数を残し、値軸集約で遷移する。tails自体は実際の一本の部分列とは限らない。

概念上の親: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。

このUnitを直接前提とする単元: なし。

列・subsequence DPで得た考え方と実装を再利用し、LIS・末尾の支配関係の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC439 E「Kite」](https://atcoder.jp/contests/abc439/tasks/abc439_e) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [event順にactive集合を更新する](/learn/modeling/event-sweep/)（値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。）。 問い合わせのoffline処理を前提に、LISの末尾最小値を右端Rまでだけ更新したtailsとして使い、値X以下で終わる最長長さを二分探索する。位置の制約を走査時刻、値の制約をtailsの境界へ分担させる。
- [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [成立証明から構成解を復元する](/learn/modeling/constructive-witness/)（成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 関連問題

以下はこのUnitのOutcomeを追加で学ぶ技能または既習技能として参照する、別のUnitを主題とする問題です。

- [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。
- [ABC457 G「Catch All Apples」](https://atcoder.jp/contests/abc457/tasks/abc457_g) — 主題: [半順序・Dilworth・最大反鎖](/learn/combinatorics-algebra/poset-dilworth-antichain/)（対象を半順序へ写し、Dilworth型のchain/antichain双対をLDS・matching・min-cutの適切な形で解ける。）。既習技能: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)（同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。） / [幾何の基本判定と座標変換](/learn/geometry-optimization/geometry-primitives/)（幾何条件を外積・距離式・端点順・格子占有・変換後座標の局所判定へ落とし込める。）。

## 根拠

- [ABC237 F 公式解説](https://atcoder.jp/contests/abc237/editorial/3320)
- [ABC237 F 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_f)
- [ABC369 F 公式解説](https://atcoder.jp/contests/abc369/editorial/10835)
- [ABC369 F 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_f)
- [ABC393 F 公式解説](https://atcoder.jp/contests/abc393/editorial/12252)
- [ABC393 F 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-dp-lis`
