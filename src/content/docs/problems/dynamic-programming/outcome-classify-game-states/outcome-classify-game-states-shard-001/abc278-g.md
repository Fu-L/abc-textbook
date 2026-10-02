---
title: "ABC278-G — Generalized Subtraction Game"
draft: true
authoringUnit: {"problemId":"abc278-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc278-g.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-interactive-protocol","unit-normalization"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp","tag-interactive-protocol","tag-state-normalization"],"sourceRevisionIds":["source-abc278-editorial-5237-ac31c97ad00111ee5b5cf4db267b3ca24195bd7a9483e542bc2bb6ba7d33497a","source-abc278-g-problem-07282b4beb8ce5efa2f662d474e296266315d4bfdd42145df14336f17f49edd6"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"Nと同parityの除去長を[L,R]から選べれば、中央を除いて左右を同長にできる。相手が片側で除去した区間の反転像は、まだ除去されておらず合法長なので、常にそこを返せる。応答後の対称性が保たれ、最後の除去も対にできるため初手側が勝つ。中央初手が存在しない場合は各残存区間が独立な不偏ゲームであり、長さnの合法除去が二つの短い区間へ分けるのでg[n]=mex{g[left] xor g[right]}が成立する。xorを0へする手を毎回選ぶGrundy戦略が勝利を保つ。","sourceRevisionIds":["source-abc278-editorial-5237-ac31c97ad00111ee5b5cf4db267b3ca24195bd7a9483e542bc2bb6ba7d33497a","source-abc278-g-problem-07282b4beb8ce5efa2f662d474e296266315d4bfdd42145df14336f17f49edd6"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [対話protocolを守って情報を取得する](src/content/docs/learn/modeling/interactive-protocol.md)
- [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

対象外:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

一手で連続区間を消すと、残存gameは左右の独立な区間gameの和になる。一般にはGrundy数が使えるが、まず対称配置を作れるかを見る。

[L,R]にNと同parityの長さyがあれば、中央y枚を初手で消して左右を同長にでき、以後は相手の手を中心反転した位置へ返せる。

採用する候補: 通常caseは中央を消す先手mirror戦略を使い、parityの合う長さがない固定長caseだけinterval Grundy数を前計算してxorを0に保つ。

ほとんどを構成的不変量で処理し、唯一の例外もN≤2000の部分game DPで完全に解ける。

棄却する候補: 全caseで各区間長のGrundy数を、全削除長L…Rと位置から愚直計算する。

そのままでは長さ・位置・削除長の三重走査が重く、問題の対称性を活かしていない。

L<Rなら区間内に両parityが必ずあり、mirror初手が不可能なのはL=RかつNとLのparityが異なる場合だけである。

中央を除いた状態は反転対称で、相手の合法区間のmirror像は必ず残っているため、pairで手を返す側が最後に動ける。

例外caseではg[n]=mex{g[left] xor g[right]}を計算し、現在の全残存intervalのxorを0へする手を選べばよい。

parity一致yを選べるならFirstを宣言し、中央y枚を除いた後、judgeの(a,b)へstart=N-a-b+2のmirror手を返す。例外ではg[0…N]を計算し、初期xorで先後を選び、毎turn全intervalのxorを0にする固定長Lの手を探索する。

## 典型の発動条件

### mirror strategy

発動条件: 盤面と合法手がinvolution対称で、相手の手と重ならない対応手を常に返せるとき。

初手で中央を除き、左右等長区間間で反転した手を返す。

### Sprague-Grundy theorem

発動条件: normal-play impartial gameが独立な部分gameへ分割されるとき。

interval削除後の左右をxor合成し、mexで区間長別Grundy数を求める。

## 問題固有の要素

選べる削除長のparityだけで左右等分初手の可否が決まり、区間が2長以上なら必ずmirror戦略へ入れる。

別の問題へ持ち帰る視点: 区間gameでは中央操作で同型な左右を作れないかを、操作長と全長のparityから最初に調べる。

## 正当性

Nと同parityの除去長を[L,R]から選べれば、中央を除いて左右を同長にできる。相手が片側で除去した区間の反転像は、まだ除去されておらず合法長なので、常にそこを返せる。応答後の対称性が保たれ、最後の除去も対にできるため初手側が勝つ。中央初手が存在しない場合は各残存区間が独立な不偏ゲームであり、長さnの合法除去が二つの短い区間へ分けるのでg[n]=mex{g[left] xor g[right]}が成立する。xorを0へする手を毎回選ぶGrundy戦略が勝利を保つ。

## 実装上の注意

- mirror startは1-indexedでN-a-b+2となり、中央の既削除区間をまたがず合法であることを保つ。
- 各出力後にflushし、judgeが(0,0)または(-1,-1)を返したら即終了する。Grundy caseでは残存intervalを正確にsplitする。

## 復習の核

- 中央削除後の左右を紙上で反転対応させ、固定長・parity不一致時だけ中央を整数位置に置けないことを確認する。

## 計算量と制約

### 時間

mirror枝O(N)総操作。例外枝Grundy前計算と合法手探索O(N²)。

### 空間

O(N)、intervalとGrundy。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2000; 1 \leq L \leq R \leq N; N, L, and R are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/editorial/5237) — source-abc278-editorial-5237-ac31c97ad00111ee5b5cf4db267b3ca24195bd7a9483e542bc2bb6ba7d33497a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc278/tasks/abc278_g) — source-abc278-g-problem-07282b4beb8ce5efa2f662d474e296266315d4bfdd42145df14336f17f49edd6
