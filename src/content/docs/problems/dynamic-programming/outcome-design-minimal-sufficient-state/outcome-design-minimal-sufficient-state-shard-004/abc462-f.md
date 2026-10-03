---
title: "ABC462-F — More ABC"
draft: true
authoringUnit: {"problemId":"abc462-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-004/abc462-f.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc462-editorial-16164-52cbbb3827b91c096a486d13c992362aea139b8b1e716475326183aac32a6c62","source-abc462-f-problem-31b1d1c4439105d0f203b91f1d5f4a8da45b6be631e272f544ac6728d4ec70a0"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"ABCは自分と重ならないため、末尾の新ABCを採ると直前三文字を一blockとして前prefixと分離できる。元prefixがその三文字間で失う既存ABCはX_i個、block作成はY_i変更なのでdp[i−3,j−1+X_i]+Y_i。末尾ABCを作らない最適では末尾字を元へ戻してもABC数は減らず変更数が減るから、skipはdp[i−1,j+Z_i]。この論法は「少なくともj増加」の状態で成立し、j=0の基底0を用いる。最終に過剰増加があっても変更字を一字ずつ元へ戻すと、一字でABC数は高々1だけ変わるので目標ちょうどKを必ず通り、費用は増えない。よって最小の少なくともK解とちょうどK解の費用は等しい。","sourceRevisionIds":["source-abc462-editorial-16164-52cbbb3827b91c096a486d13c992362aea139b8b1e716475326183aac32a6c62","source-abc462-f-problem-31b1d1c4439105d0f203b91f1d5f4a8da45b6be631e272f544ac6728d4ec70a0"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

f_iを元文字列S[1..i]のABC出現数とする。ABCは自分自身と重ならないので、f_iは末尾三文字がABCならf_{i−1}+1、そうでなければf_{i−1}。dp[i,j]は元prefixよりABCを少なくともj個増やす最小変更数とする。dp[i,0]=0を全iへ置き、dp[0,j>0]=∞とする。

最後にABCを作る場合と、末尾に新しいABCを要求しない場合へ分ける。i≥3で

```text
Z_i = [S[i−2..i]="ABC"] （i<3では0）
X_i = f_i−f_{i−3}=Z_{i−2}+Z_{i−1}+Z_i
Y_i = [S_{i−2}≠A]+[S_{i−1}≠B]+[S_i≠C]
```

と定義する。X_iは切り捨てる三文字の範囲で元prefixが持っていたABC数で、ABCが重ならないため0または1である。新末尾三文字をABCにすると前prefixとまたぐABCはなく、新しい一個だけが増える。従って前prefixにはj−1+X_i個の増加が必要で、費用はdp[i−3,j−1+X_i]+Y_i。

末尾ABCを作らない解では、最後の文字を元のS_iへ戻しても既存のABCは壊れず、変更数は減る。元prefix基準では最後の元ABCの分Z_iを補う必要があるので、dp[i−1,j+Z_i]を候補にする。この候補が偶然末尾ABCも作った場合は増加数がさらに大きくなるだけで、少なくともjという条件を守る。

```text
dp[i,j] = min(dp[i−3,j−1+X_i]+Y_i, dp[i−1,j+Z_i]), 1≤j≤K
```

i<3ではblock候補を使わない。j≤0の参照は0と考えるが、この式でblockの添字はj−1+X_i≥0。j>Kのskip候補は省ける。必要なのはj=K,Z_i=1の場合だけで、このとき元末尾はABC、X_i=1,Y_i=0。超過prefixの解の末尾二文字を除くとABCは高々一個減るので、その解以上の費用を要さずblock候補dp[i−3,K]でK増加を達成できる。従って超過stateを持つ必要はない。

最後にdp[N,K]を出す（∞なら−1）。元問題はちょうどK増加を求めるが、少なくともKの最適解から変更文字を一字ずつ元へ戻すと、ABC数は一度に高々1しか変わらない。元文字列の増加数0まで進む間に必ずKを通り、費用は増えない。従って二つの最小費用は一致する。この下限制約への変換が末尾文字を戻す優越性の根拠である。

S=ABCABCなら末尾をblockとして分離したi=6でX_6=1,Y_6=0。既存ABCを再び作るだけでは増加しないので、前prefixへj個を要求する。S=BBBではX_3=0,Y_3=2で、新しい一個のABCを2変更で作る。全i,jに定数個の遷移を行いO(NK)。

## 典型の発動条件

### 短pattern末尾分解DP

発動条件: 文字置換で特定長pattern出現数を所定量増やしたいとき。

末尾patternを採用するblock遷移と採用しない一文字遷移に分ける。

## 問題固有の要素

置換文字そのものをstateにせず、最適解で変更が意味を持つのは新しいtarget patternを完成させる場合だけと示して遷移を削る。

別の問題へ持ち帰る視点: 元文字列にも既存patternがあるため、増加数stateでは新旧prefixのpattern差を遷移indexへ補正する。

## 正当性

ABCは自分と重ならないため、末尾の新ABCを採ると直前三文字を一blockとして前prefixと分離できる。元prefixがその三文字間で失う既存ABCはX_i個、block作成はY_i変更なのでdp[i−3,j−1+X_i]+Y_i。末尾ABCを作らない最適では末尾字を元へ戻してもABC数は減らず変更数が減るから、skipはdp[i−1,j+Z_i]。この論法は「少なくともj増加」の状態で成立し、j=0の基底0を用いる。最終に過剰増加があっても変更字を一字ずつ元へ戻すと、一字でABC数は高々1だけ変わるので目標ちょうどKを必ず通り、費用は増えない。よって最小の少なくともK解とちょうどK解の費用は等しい。

## 実装上の注意

- Z_iはiで終わる元ABCの指示値、X_iは直近三つのZの和、Y_iは三文字のHamming距離。i<3ではZ_i=0。
- dp[i,0]=0、dp[0,j>0]=∞。j>Kのskipは使わず、i<3ではblockを使わない。∞へ費用を足してoverflowしない値を選ぶ。
- 更新はprefix長iの昇順。i−1,i−3だけ参照するので四層の循環配列でも実装できる。

## 復習の核

- 末尾をABCにしない場合にS_i変更が不要なdominance証明と、末尾近くに既存ABCがある場合のX_i/Z_i補正を確認する。

## 計算量と制約

### 時間

文字列長 N、増加目標K≤10。三文字block遷移と一文字skipの O(NK)。全caseでは O(ΣNK)。

### 空間

全文DPはO(NK)、i−1/i−3だけ参照するrollingならO(K)、文字列入力O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq T\leq 10^5; S is a string of length between 3 and 3\times 10^5, inclusive, consisting of uppercase English letters.; 1\leq K \leq 10; In each input, the total length of S over all test cases is at most 3\times 10^5.; T and K are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/editorial/16164) — source-abc462-editorial-16164-52cbbb3827b91c096a486d13c992362aea139b8b1e716475326183aac32a6c62
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc462/tasks/abc462_f) — source-abc462-f-problem-31b1d1c4439105d0f203b91f1d5f4a8da45b6be631e272f544ac6728d4ec70a0
