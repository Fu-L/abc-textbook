---
title: "minimax・得点差・局面値を評価するゲームDP"
description: "前提からminimax・得点差・局面値を評価するゲームDPを見抜き、方針へ接続して検証するための学習単位。"
draft: true
sidebar:
  order: 57
---

# minimax・得点差・局面値を評価するゲームDP

このページは **節** です。一つの原子的な技能について、発動条件から正当化・計算量・実装上の境界条件までを再現できる状態を作ります。

読み終えたら、手法名を覚えたかではなく、未知問から発動条件を抽出し、候補を比較し、正当化と計算量を説明できるかで自己評価します。

## この単元でできるようになること

- 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。

## 前提・学習順・対象外

- 共通前提: `prereq-abc-advanced-v1` version `1.0.0`
- 追加前提: 最小十分状態からDPを設計する
- この位置で学ぶ理由: 状態遷移を設計できることを前提に、双方の最適行動を最大化・最小化として評価する。

### この単元では扱わない範囲

- 勝敗だけを分類する通常の後退解析・Grundy数。

## 発動条件と見分け方

### 有限局面DAGのminimax

必ず終了するゲームの局面DAGで、終端利得と各手番の最大化・最小化から局面値を求める。

検索語: minimax、ミニマックス、得点差ゲームDP

未知問では、対象・操作・保つべき量・求める量を言葉にし、上の定義をすべて満たすかを確認します。名称の一致だけでは採用しません。

## ガイド例

### 例 1 — 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う

題材: [ABC349 E「Weighted Tic-Tac-Toe」](https://atcoder.jp/contests/abc349/tasks/abc349_e)

選定理由: terminalで同色三目があればその色のplayerが勝ち、全埋まりならred取得weight和とblue取得weight和を比較する。非terminalでは一つでもcurrent player勝利となるchildがあれば勝ち、全childが相手勝利なら負ける。

この例で扱う範囲: ここでは次の局所的な観察から対象技能を導く。運要素がなく、双方が勝利を目的に最適行動し、state遷移がacyclicである。 問題全体への接続は併用技能を学んだ後に読む。

#### このOutcomeを支える根拠

- 両者が勝利のため最適に指す時、TakahashiとAokiのどちらが勝つか判定できる。

#### 観察

- 盤面は各cellがwhite/red/blueの3状態で高々3^9通りしかない。手番は塗られたcell数のparityで決まり、終了していなければ現在playerは「一手先に自分が勝つstateがあるか」だけを選べばよい。

#### 候補を比較する

- **採用**: 盤面stateをmemo化したminimax再帰で勝者を判定する — 全game treeの同一盤面を共有し、有限DAG上の勝敗を高々3^9×9遷移で解ける。
- **棄却**: 局所的に最高weightのcellをgreedyに取る — 三目完成による即勝利がscoreより優先され、相手のthreatもあるためweightだけの局所選択は最適でない。

#### 鍵となる着眼

- terminalで同色三目があればその色のplayerが勝ち、全埋まりならred取得weight和とblue取得weight和を比較する。非terminalでは一つでもcurrent player勝利となるchildがあれば勝ち、全childが相手勝利なら負ける。

#### アルゴリズムへ接続する

redMask,blueMaskまたはternary codeをstate keyにする。8本のwinning maskを検査し、full boardならmask別weight sumを比較する。未終了ではmove数偶数ならTakahashi、奇数ならAokiとして各empty cellを自色へ追加し再帰し、自分勝ちchildを見つけたらtrueをmemoする。初期stateのwinnerを出力する。


## 転用するときの確認

- **有限完全情報gameのminimax**: 運要素がなく、双方が勝利を目的に最適行動し、state遷移がacyclicである。 適用: terminal winnerをbaseに、存在/全称でcurrent playerの勝敗を後ろ向きに決める。
- **bitmask盤面表現**: 3×3盤面の占有とwinning line包含を高速に検査したい。 適用: playerごとの9-bit maskを持ち、(mask&line)==lineで三目を判定する。
- 複数終了規則のgame DPではrule priorityをterminal evaluatorにそのまま反映する。
- 即勝ちを取る局面、相手三目をblockする局面、三目なしで負weightを含むscore決着を手作業minimaxと比較する。

## 到達確認

### 到達確認 1 — 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う

転移題材: [ABC303 G「Bags Game」](https://atcoder.jp/contests/abc303/tasks/abc303_g)

**課題**: ABC303 G「Bags Game」を初見の転移題材とする。問題全体で併用する別技能は既知として、学習成果が担う部分に絞り、ガイド例の手順を写さず「観察→候補比較→鍵→アルゴリズム」の順で方針を再構成する。

**合格条件**: 手法名の列挙に留まらず、学習成果「有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う」について、発動条件、不変量または正当化、計算量、境界条件を説明できる。


## 解答と自己評価基準

<details><summary>到達確認 1 の解答基準 — 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う</summary>

**検証状態**: `pending` — これは T058 の実行・査読前に使う自己評価基準であり、正解済みとは扱いません。

別題材では次の直接根拠を対象技能として切り出す: 両者が最適に行動したときのTakahashiの利益XとAokiの利益Yの差X-Yを求められる。以下は転移を照合する自己評価用の観点であり、T058 での実行・査読は未完了である。

根拠として照合する観点:

- 両者が最適に行動したときのTakahashiの利益XとAokiの利益Yの差X-Yを求められる。

- 対象技能が担う箇所: 両者が最適に行動したときのTakahashiの利益XとAokiの利益Yの差X-Yを求められる。
- 転移題材の解法接続: dp[i][j]を残存区間[j,j+i)から手番の人が得る最適得点差とする。三行動に対応する(k,Z)=(i-1,0),(max(i-B,0),A),(max(i-D,0),C)ごとに、配列S(k,l)+dp[k,l]の幅i-k+1のsliding minimumをdequeで求め、S(i,j)-Z-minを候補として最大を取る。答えはdp[N][0]。
- 転移題材の対象・操作・保つ量・求める量を分離し、ガイド例との共通構造を対応付ける。
- 対象技能を外側の解法枠組みから切り分け、その入力・出力と更新前後で保つ不変量を述べる。
- 不変量から各操作後の値が正しいことを示し、初期化・空状態・重複・端点などの境界を確認する。
- 対象技能が問題全体の計算量へ加える操作回数と一回あたりの費用を評価する。

期待する到達点: 有限DAGの局面で手番ごとの最大化・最小化と終端値を定義し、得点差や利得を後続状態から評価できる。循環時の無限継続と独立な数ゲームの加算は別の技能として扱う。

</details>


## 根拠

- [ABC218 G 公式解説](https://atcoder.jp/contests/abc218/editorial/2607)
- [ABC218 G 公式問題文](https://atcoder.jp/contests/abc218/tasks/abc218_g)
- [ABC303 G 公式解説](https://atcoder.jp/contests/abc303/editorial/6444)
- [ABC303 G 公式問題文](https://atcoder.jp/contests/abc303/tasks/abc303_g)
- [ABC349 E 公式問題文](https://atcoder.jp/contests/abc349/tasks/abc349_e)
- [ABC349 E 公式解説](https://atcoder.jp/contests/abc349/editorial/9780)

Canonical taxonomy: FinalTaxonomyBuild `final-taxonomy-build-initial` digest `242ab0527fb4e5ccaf6440d6b44b7c02b44e576665069f3e39a88f996eb1bd50` / LearningUnit `unit-dp-game-value`
