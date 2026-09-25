---
title: "LIS・末尾の支配関係"
description: "「LIS・末尾の支配関係」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 63
---

# LIS・末尾の支配関係

習得対象の目安: **水色（1200–1599）**。末尾の支配関係で状態を圧縮し、二分探索の境界と復元方法を理解する。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 標準履修順

第32単元。技能の説明を学んでから問題一覧へ進んでください。

前: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/) ／ 次: [prefix分割DP](/learn/dynamic-programming/dp-prefix-partition/)

## 概要

### LIS・末尾の支配関係

同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。

LISは「末尾が小さいほど次を延長しやすい」という支配関係を使う。長さごとの最小末尾tailsを保てば、狭義増加はlower_bound、非減少はupper_boundで更新できる。ABC393 Fのprefix・値上限query、ABC369 Fの二次元順序と復元へ進む。

ABC369 Fでは同じ列も通れるため非減少を扱う。長さごとの末尾に加えて代表位置と直前位置を記録すれば経路を復元できる。値域に制約が付く発展問題は値域集約による部分列DPの節で扱う。

ABC237 Fは、LISの長さを求める算法そのものを数え上げDPの遷移器にする。長さ1,2,3の最小末尾の組を状態とし、次の値で最初の「その値以上の末尾」を置き換える。どこにも入らない遷移は長さ4を作るので捨て、最後に長さ3が存在する状態を足す。末尾の支配関係を理解してから、同じ末尾配列を持つprefixの個数を集約する。

### 習得する技能

- 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: [列・subsequence DP](/learn/dynamic-programming/dp-sequence/)。

列・subsequence DPで得た考え方と実装を再利用し、LIS・末尾の支配関係の発動条件・正当化・境界を重複なく学ぶ。

### このUnitでは扱わないもの

- LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

1. [ABC439 E「Kite」](https://atcoder.jp/contests/abc439/tasks/abc439_e) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。
2. [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。既習技能: 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。
3. [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f) — 主題: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)。既習技能: 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

各問題の解説は問題ごとの本文として執筆します。この一覧は前提習得後の提示先と読む順序を固定したものです。主題となる技能の所属単元は各項目に示します。

## 関連問題

以下はこの技能を用い、解説本文を別の単元に配置する問題です。

- [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f) — 主題: [LIS・末尾の支配関係](/learn/dynamic-programming/dp-lis/)。既習技能: 値・時刻・座標順にeventを並べ、同値eventの処理順とactive集合の増分更新を設計できる。 LISの末尾最小値と問い合わせのoffline処理を既習として、右端Rまでだけ更新したtailsから、値X以下で終わる最長長さを二分探索する。位置の制約を走査時刻、値の制約をtailsの境界へ分担させる。

## 根拠

- [ABC237 F 公式解説](https://atcoder.jp/contests/abc237/editorial/3320)
- [ABC237 F 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_f)
- [ABC369 F 公式解説](https://atcoder.jp/contests/abc369/editorial/10835)
- [ABC369 F 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_f)
- [ABC393 F 公式解説](https://atcoder.jp/contests/abc393/editorial/12252)
- [ABC393 F 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `651187394fa0abc2fd2158fba0f0994d472251361a107dc83825f9c08234ded7` / LearningUnit `unit-dp-lis`
