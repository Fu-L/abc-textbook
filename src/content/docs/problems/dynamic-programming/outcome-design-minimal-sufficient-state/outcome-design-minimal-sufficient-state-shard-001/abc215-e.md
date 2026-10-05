---
title: "ABC215-E — Chain Contestant"
draft: true
authoringUnit: {"problemId":"abc215-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-001/abc215-e.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc215-e-problem-96f062cfec5946b78dd41ee4c2681e26e1476389181caf11f5d188001673c846","source-abc215-editorial-2483-c429bea82317400c8c7e593c7250a9b04e85f398216f3065c5677b299a812f2f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"既使用文字集合と末尾block文字が将来合法性を決める。同じ末尾は継続可、未使用字は新block可、使用済み別字は再登場禁止。選ぶ/選ばない分岐で各位置部分列を一意に生成しsingletonで空から開始するため全合法非空部分列を数える。","sourceRevisionIds":["source-abc215-e-problem-96f062cfec5946b78dd41ee4c2681e26e1476389181caf11f5d188001673c846","source-abc215-editorial-2483-c429bea82317400c8c7e593c7250a9b04e85f398216f3065c5677b299a812f2f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md) — DPの最小十分状態で得た考え方と実装を再利用し、部分集合・bitmask状態DPの発動条件・正当化・境界を重複なく学ぶ。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

文字の種類は A..J の 10 種類だけである。選ぶ部分列では各文字が高々一つの連続区間に現れるため、過去の並び全体ではなく使用済み文字集合と現在の末尾文字が次の選択可否を決める。同じ文字を続ける遷移だけは使用済みでも許し、別文字へ移った後の再登場を mask で禁止する。

採用する候補: 使用済み文字の bitmask と末尾文字を状態にし、選ばない・同じ文字を続ける・未使用文字へ移る遷移を数える。

この二情報が「一度離れた文字へ戻れない」という条件を必要十分に表す。

棄却する候補: 使用済み文字の bitmask だけを状態にして部分列を数える。

同じ mask でも末尾が現在の文字かどうかで、使用済み文字を続けられるかが変わるため、将来の遷移を決定できない。

棄却する候補: 各位置を選ぶか選ばないかで全ての部分列を列挙する。

2^N 通りとなり、同じ使用済み集合と末尾を持つ履歴をまとめられない。

文字列を左から走査し、各位置の文字 x について current から next へ、選ばない・last=x なら同じブロックを続ける・bit x が未使用なら新ブロックを始める遷移を行う。さらにその位置だけを選ぶ singleton を next[1<<x][x] へ加え、最後に全ての非空状態を合計する。

## 典型の発動条件

### bitmask DP

発動条件: 種類数が小さく、各種類を使ったかどうかが将来の可否を決めるとき。

使用済み文字集合を bitmask で保持する。

### 末尾状態による履歴圧縮

発動条件: 直前と同種かどうかだけが継続条件を変えるとき。

現在の連続区間の文字を末尾状態として持つ。

## 問題固有の要素

「各文字が高々一ブロック」という全体条件を、再登場禁止と同種継続という局所遷移へ言い換える。

別の問題へ持ち帰る視点: 部分列の履歴条件を、使用済み集合と現在開いている区間の種類へ分解できないか調べる。

## 正当性

既使用文字集合と末尾block文字が将来合法性を決める。同じ末尾は継続可、未使用字は新block可、使用済み別字は再登場禁止。選ぶ/選ばない分岐で各位置部分列を一意に生成しsingletonで空から開始するため全合法非空部分列を数える。

## 実装上の注意

- 各位置ごとに next を別配列として作り、更新途中の状態から同じ位置の文字を再利用しない。選ばない遷移も current から next へ移す。
- 新ブロック開始は bit x が未使用の場合だけ許し、singleton の初期化を忘れない。全加算を mod 998244353 で行い、空部分列は答えに含めない。

## 復習の核

- AAB と ABA で許される部分列を列挙し、mask だけでは同種継続と再登場を区別できない理由、二層配列で同じ位置の再利用を防ぐ理由を説明する。

## 計算量と制約

### 時間

列長N、文字種C=10。O(NC2^C)。

### 空間

rolling mask×last O(C2^C)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 1000; |S|=N; S consists of uppercase English letters from A through J.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/tasks/abc215_e) — source-abc215-e-problem-96f062cfec5946b78dd41ee4c2681e26e1476389181caf11f5d188001673c846
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc215/editorial/2483) — source-abc215-editorial-2483-c429bea82317400c8c7e593c7250a9b04e85f398216f3065c5677b299a812f2f
