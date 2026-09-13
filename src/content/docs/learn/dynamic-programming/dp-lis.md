---
title: "LIS・末尾の支配関係"
description: "LIS・末尾の支配関係の概念と、基礎から応用へ読む問題一覧。"
draft: true
sidebar:
  order: 76
---

# LIS・末尾の支配関係

## 概要

### LIS・末尾の支配関係

同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。

LISは「末尾が小さいほど次を延長しやすい」という支配関係を使う。長さごとの最小末尾tailsを保てば、狭義増加はlower_bound、非減少はupper_boundで更新できる。ABC393 Fのprefix・値上限query、ABC369 Fの二次元順序と復元へ進む。

ABC369 Fでは同じ列も通れるため非減少を扱う。長さごとの末尾に加えて代表位置と直前位置を記録すれば経路を復元できる。値域に制約が付く発展問題は値域集約による部分列DPの節で扱う。

ABC237 Fは、LISの長さを求める算法そのものを数え上げDPの遷移器にする。長さ1,2,3の最小末尾の組を状態とし、次の値で最初の「その値以上の末尾」を置き換える。どこにも入らない遷移は長さ4を作るので捨て、最後に長さ3が存在する状態を足す。末尾の支配関係を理解してから、同じ末尾配列を持つprefixの個数を集約する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

追加前提: 列・subsequence DP。

列・subsequence DPで得た考え方と実装を再利用し、LIS・末尾の支配関係の発動条件・正当化・境界を重複なく学ぶ。

- LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

必要な前提と解法の基本性を優先し、複数の技能を組み合わせる問題へ進む順に並べています。

1. [ABC439 E「Kite」](https://atcoder.jp/contests/abc439/tasks/abc439_e)
2. [ABC237 F「|LIS| = 3」](https://atcoder.jp/contests/abc237/tasks/abc237_f)
3. [ABC393 F「Prefix LIS Query」](https://atcoder.jp/contests/abc393/tasks/abc393_f)
4. [ABC369 F「Gather Coins」](https://atcoder.jp/contests/abc369/tasks/abc369_f)

各問題の解説は問題ごとの本文として執筆します。この一覧は主配置と読む順序を固定したものです。

## 根拠

- [ABC237 F 公式解説](https://atcoder.jp/contests/abc237/editorial/3320)
- [ABC237 F 公式問題文](https://atcoder.jp/contests/abc237/tasks/abc237_f)
- [ABC369 F 公式解説](https://atcoder.jp/contests/abc369/editorial/10835)
- [ABC369 F 公式問題文](https://atcoder.jp/contests/abc369/tasks/abc369_f)
- [ABC393 F 公式解説](https://atcoder.jp/contests/abc393/editorial/12252)
- [ABC393 F 公式問題文](https://atcoder.jp/contests/abc393/tasks/abc393_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `6936d6a80b1bc64a837a7d03073a998d83dbc4d54f73f88f3a84f68287a574e8` / LearningUnit `unit-dp-lis`
