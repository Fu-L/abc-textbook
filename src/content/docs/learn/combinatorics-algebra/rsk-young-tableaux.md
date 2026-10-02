---
title: "Robinson–Schensted対応・Young tableau"
description: "「Robinson–Schensted対応・Young tableau」で学ぶ概念と、基礎から応用へ進む問題一覧。"
draft: true
sidebar:
  order: 213
---

# Robinson–Schensted対応・Young tableau

習得対象の目安: **赤色（2800以上）**。挿入対応とYoung図形を理解し、LIS・LDS条件をshapeの計数へ移す。

対象色の読み方は[本書の読み方](/learn/modeling/)を参照してください。

## 概要

### Robinson–Schensted対応・Young tableau

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。

### 習得する技能

- 順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考え方

まず異なる値1,…,nからなる順列を扱う。Young図形λは、非増加の行長 `λ_1≥λ_2≥…>0` を左揃えに並べたn個のcellである。標準Young盤は、そのcellへ1,…,nを一度ずつ置き、各行を左から右へ、各列を上から下へ狭義増加にしたものをいう。

### 挿入盤Pと記録盤Qを作る

順列を左から読み、値aをPの第一行へ挿入する。行内のaより大きい最左の値bがあれば、そのcellをaに置き換え、bを次の行へ送る。なければ行末へaを追加して終了する。送られた値にも同じ操作を繰り返す。

一回の挿入で図形にcellが一つ増える。そのcellと同じ位置のQへ、今回の入力時刻tを記録する。Pは値の配置、Qはcellの増加順であり、両者は同じ図形の標準盤になる。置換した値は必ず大きく、置換位置の列も上下の増加条件を保つ。Qでは追加cellの左・上は既に存在しているため、時刻が増加する。

例えば順列(3,1,2)では、3を入れた後、1が3を第二行へ送り、2が第一行末へ追加される。最終的なPの行は(1,2),(3)、Qの行は(1,3),(2)である。PとQが記録する情報の違いを確認できる。

### 逆操作と全単射

Qの最大値nのcellは右にも下にもcellのない角なので、Qから取り除き、同じPのcellの値をaとして取り出す。上の行へ戻るたび、その行のaより小さい最右の値bをaで置き換え、bをさらに上へ送る。第一行から押し出された値が順列の最後の値である。

これをn,n-1,…の順で繰り返すと順列が一意に復元される。行挿入の「最左の大きい値」と逆挿入の「最右の小さい値」が互いを戻すため、順列と同じ図形の標準盤対(P,Q)は全単射になる。

### 部分列条件を図形と盤の計数へ移す

第一行は、長さごとの増加部分列の最小末尾を更新するLIS算法の配列と一致するので、`LIS=λ_1` となる。また行挿入の降下経路を追うSchenstedの定理により `LDS=行数=第一列長` である。したがってLIS≤a,LDS≤bなら、図形は幅a・高さbの長方形に入る。

図形λの標準盤の個数をf^λと定義する。cell (i,j)のhookは、そのcell自身と右側・下側に続くcellで、長さは `h_{i,j}=λ_i-j+λ'_j-i+1`。hook-length公式は `f^λ=n!/Π_{(i,j)∈λ}h_{i,j}` を与える。盤対を独立に選べるので、同じ図形の順列数は `(f^λ)²`。許す図形についてこれを合計する。例えばλ=(2,1)ならhook長は3,1,1なのでf^λ=2、順列は4個になる。

追加条件がある場合は、盤の構築をDPで数える。値1,…,tを置いたcell集合Iは左・上へ閉じたidealになる。`dp[∅]=1` とし、まだ空のcell zで左・上のcellがすべてIに含まれるものについて `dp[I∪{z}]+=dp[I]` と更新する。zにはt+1を置く。値や位置の条件はこの更新時に検査する。P側の値条件とQ側の追加時刻条件を混同せず、両盤にまたがる制約なら独立な二つの個数の積にしない。

## 成立条件と計算量

素朴な行挿入・逆挿入はO(n²)時間、盤の空間O(n)。固定図形のhook積はO(n)で求まるが、図形の列挙数も別に掛かる。ideal DPは、ideal数をJとすれば各状態の追加候補が高々行数なのでO(J·行数)時間・O(J)空間。一般にはJが大きく、幅・高さなどの制約を使って状態数を評価する。

hook-length公式の整数商は常に存在するが、法上で分母を逆元にするには可逆性が必要。重複値を持つ列ではPは通常半標準盤となり、狭義・非狭義の挿入規則でLIS/LDSの対応が変わる。順列の `(f^λ)²` をそのまま一般の文字列へ適用しない。

概念上の親: [組合せ・多項式・線形代数](/learn/combinatorics-algebra/)。問題へ進む前に、下記の直接前提のうち未習得の単元を確認する。

## 前提と範囲

共通前提: prereq-abc-advanced-v1 (1.0.0)。

直接の前提単元: なし。

このUnitを直接前提とする単元: なし。

順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

### このUnitでは扱わないもの

- Robinson–Schensted対応・Young tableauの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 問題一覧

- [ABC378 G「Everlasting LIDS」](https://atcoder.jp/contests/abc378/tasks/abc378_g) — 主題: [Robinson–Schensted対応・Young tableau](/learn/combinatorics-algebra/rsk-young-tableaux/)（順列をYoung図形と二つの標準盤へ全単射し、LIS/LDS制約をshape制約とideal DPへ変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。）。既習技能: [最小十分状態からDPを設計する](/learn/dynamic-programming/dp-state-design/)（採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。）。

各問題の解説は問題ごとの本文として執筆します。各項目には主題・追加で学ぶ技能・既習技能の役割を示します。

## 根拠

- [ABC378 G 公式解説](https://atcoder.jp/contests/abc378/editorial/11283)
- [ABC378 G 公式問題文](https://atcoder.jp/contests/abc378/tasks/abc378_g)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `b1c5eef8e8146547bd47783d8ef584ffcc7a4fa4a698b623b4c72c12862827d5` / LearningUnit `unit-rsk-young-tableaux`
