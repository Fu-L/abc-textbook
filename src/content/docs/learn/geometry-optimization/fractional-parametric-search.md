---
title: "fractional programming・比率parametric search"
description: "前提からfractional programming・比率parametric searchを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 96
---

# fractional programming・比率parametric search

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 単調境界を証明して探索する
- この位置で学ぶ理由: 単調境界探索で得た考え方と実装を再利用し、fractional programming・比率parametric searchの発動条件・正当化・境界を重複なく学ぶ。

### この単元では扱わない範囲

- fractional programming・比率parametric searchの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 発動条件と見分け方

### fractional programming・比率parametric search

比率目標xに対して各寄与をbenefit-x·costへ変換し、和が非負かという単調な加法最適化へ帰着する。

検索語: fractional programming、parametric search for ratio、比率二分探索

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる

題材: [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)

選定理由: cost総和は正なのでratio不等式を掛け算しても向きが変わらず、変換後weight和の符号だけを見ればよい。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。正の分母を持つpath上の総和比を最大化するとき。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 1→N pathのbeauty総和/cost総和の最大値を、parametric searchとDAG DPで高精度に求められる。

#### 観察

- pathのbeauty/cost比がX以上という条件は、Σ(b_i-c_iX)≥0へ分母を払って加法的なpath weight条件にできる。
- 全edgeでu_i<v_iなので頂点番号順がtopological orderであり、固定Xでの最大path weightは1回のDAG DPで求められる。
- Xを大きくすると全edgeの変換weightが減るため、達成可能性はtrueからfalseへ単調に変わる。

#### 候補を比較する

- **採用**: 候補比Xでedge weightをb-cXへ変換し、DAG最大path DPの可否を実数binary searchする。 — ratio目的を線形和へ変換し、各判定を全edgeの一走査で行える。
- **棄却**: beauty最大pathとcost最小pathを別々に求め、その比を取る。 — 2つの最適値を達成するpathが同じとは限らず、ratio最適化にならない。
- **棄却**: 各edgeのb_i/c_iが最大のものを優先してpathを作る。 — graphの接続制約と複数edgeの加重平均があり、局所ratioだけでは有効な1→N pathを選べない。

#### 鍵となる着眼

- cost総和は正なのでratio不等式を掛け算しても向きが変わらず、変換後weight和の符号だけを見ればよい。
- dp[v]=1からvへの最大変換weightとし、到達不能を−∞にすれば、全incoming edge u→vからdp[u]+b-cXをmax更新できる。

#### アルゴリズムへ接続する

predicate(X)ではdp[1]=0、他−∞とし、u=1..Nの番号順に全outgoing edge(u,v,b,c)でdp[v]=max(dp[v],dp[u]+b-cX)を更新し、dp[N]≥0を返す。lower=0、upperを最大b_i/c_i以上に取り、十分な回数binary searchしてtrueならlower=mid、falseならupper=midとしlowerを出力する。


## 転用するときの確認

- **fractional programmingのparametric search**: 正の分母を持つpath上の総和比を最大化するとき。 適用: b-cXへ変換してratio≥Xを加法的可否にする。
- **DAG longest path DP**: 負weightも含む有向acyclic graphで最大path和を求めるとき。 適用: topological orderで−∞状態をrelaxする。
- **実数binary search**: 連続値Xに対するpredicateが単調で誤差許容出力のとき。 適用: 固定回数反復してtrue領域の上端へ収束させる。
- 平均・比率の最適化は、候補値を引いたweighted sumの正負へ変換できないか試す。
- 異なるratioを持つ2本のpathでmidを挟み、変換weight和の符号とbinary search更新方向が元ratio比較に一致するか確認する。

## 到達確認

### 到達確認 1 — 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる

境界検証の元題材: [ABC324 F「Beautiful Path」](https://atcoder.jp/contests/abc324/tasks/abc324_f)

**課題**: ABC324 F「Beautiful Path」で使った発動条件を一つ選んで否定した変形問題を作り、元の方針が最初に破綻する箇所、最小反例、代替方針の要否を説明する。

**合格条件**: 手法名の列挙に留まらず、学習成果「比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められる</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

単例しかない技能を暗記問題にしないため、発動条件の否定が証明・不変量・計算量のどこを壊すかを検証する。以下は自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 1→N pathのbeauty総和/cost総和の最大値を、parametric searchとDAG DPで高精度に求められる。

- 元の方針が必要とする対象・操作・不変量・目標を分けて書く。
- 発動条件を一つだけ否定し、他条件を保つ最小の変形または反例を構成する。
- 元の正当化のうち最初に成立しなくなる命題を指摘する。
- 計算量だけが悪化するのか、正しさ自体が失われるのかを区別する。
- 条件を戻す以外の代替方針があるなら、その追加前提と計算量を述べる。

期待する到達点: 比率候補xをbenefit-x·costの加法目的へ変換し、単調な判定問題を解いて最適比率を求められるの適用可能範囲と破綻条件を反例付きで説明できる。

</details>


## 根拠

- [ABC324 F 公式解説](https://atcoder.jp/contests/abc324/editorial/7405)
- [ABC324 F 公式問題文](https://atcoder.jp/contests/abc324/tasks/abc324_f)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-fractional-parametric-search`
