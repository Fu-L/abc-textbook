---
title: "ABC244-G — Construct Good Path"
draft: true
authoringUnit: {"problemId":"abc244-g","docPath":"src/content/docs/problems/hybrid/outcome-recover-valid-witness/outcome-recover-valid-witness-shard-001/abc244-g.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。"],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc244-editorial-3600-c4c8d81e3b5842d82e680dd4c6364ee09a0ac396e283caed8d528569ac61d02e","source-abc244-g-problem-88ea6771faa07fcb57593f83a18d31b44e9d79bb30ee509a3cc692c531bd4427"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"子の補正は、その子の訪問回数だけを奇数回増やし、親は偶数回増やす。すでに合わせた子孫には触れないので、部分木ごとに要求を確定できる。最後の根の補正も隣接点を二回訪れるだけであり、他頂点の偶奇を変えない。","sourceRevisionIds":["source-abc244-editorial-3600-c4c8d81e3b5842d82e680dd4c6364ee09a0ac396e283caed8d528569ac61d02e","source-abc244-g-problem-88ea6771faa07fcb57593f83a18d31b44e9d79bb30ee509a3cc692c531bd4427"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

この解説で扱わないこと:

- 存在判定・個数計算だけで、具体的な解や操作列を復元しない問題。

## 考察

元 graph の余分な辺は使わなくてもよく、連結性から任意の spanning tree 上だけで path を構成できる。木なら子部分木を往復する DFS walk により、部分木内の parity を bottom-up に確定できる。

子 c の構成列が c で始まり c で終われば、親 v からその列へ入り v へ戻れる。c の parity が不足した場合に (v,c) を余分に挟むと c だけを1回、vを後の帰還と合わせて2回追加して補正できる。

採用する候補: spanning tree を根付け、各子の閉じた walk を連結しながら子根 parity を局所 gadget で直し、最後に根だけを補正する。

処理済み子孫の parity を壊さず親へ戻る不変条件を保ち、各 tree edge を定数回使う長さ上限付き構成になる。

棄却する候補: s_i=1 の頂点を個別に訪れる path を連結していく。

二つの目的地を結ぶ途中頂点の訪問 parity も変わり、独立な要求として処理すると既に合わせた頂点を壊す。

子 c の parity が不一致なら A_c の後に v,c を置き、その後の通常の v 帰還まで含めると、c は奇数回、v は偶数回だけ追加される。

根以外を全て確定した後、根だけ不一致なら neighbor u,r,u を末尾へ足すと u は2回、根は1回増えて根だけを反転できる。

全0 target なら空 path を出してよい。それ以外は spanning tree を作り、各 v で v を置いて子の列を再帰連結し、子 parity が target と違えば v,c を追加して v へ戻る。root 列完成後に必要なら u,root,u を追加し、長さと列を出力する。

## 典型の発動条件

### spanning tree 上の構成

発動条件: 連結 graph で任意の辺を使えるが、構成の正当性を階層的に管理したいとき。

余分な辺を捨てて tree にし、部分木ごとの不変条件を帰納的に保つ。

### 局所 parity 補正 gadget

発動条件: walk の連結性を保ちながら特定頂点の訪問 parity だけを直したいとき。

tree edge の往復回数を組み合わせ、他頂点への追加を偶数回にする短い列を設計する。

## 問題固有の要素

子補正 v,c と次の v への帰還を一まとまりで見ると、親への影響が偶数に相殺され、子だけを確定できる。

別の問題へ持ち帰る視点: parity 構成では操作列を単発で見ず、局所 gadget 全体の各要素出現 vector mod 2 を計算する。

## 正当性

子の補正は、その子の訪問回数だけを奇数回増やし、親は偶数回増やす。すでに合わせた子孫には触れないので、部分木ごとに要求を確定できる。最後の根の補正も隣接点を二回訪れるだけであり、他頂点の偶奇を変えない。

## 実装上の注意

- 連結列の隣接頂点が必ず tree edge になる順序を守り、実際に append するたび parity 配列を XOR すると判定が安全になる。最後に長さ≤4Nと全 bit一致を検査する。

## 復習の核

- leaf c の target が0/1の二場合で出力列中の v,c の追加回数を mod 2 で数え、親 parityを途中で確定しない理由を理解する。

## 計算量と制約

### 時間

O(N+M)、spanning tree DFSと定数回parity補正。

### 空間

O(N+M)、出力walk長O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^5; N-1 \leq M \leq \min\lbrace 2 \times 10^5, \frac{N(N-1)}{2}\rbrace; 1 \leq u_i, v_i \leq N; The given graph is simple and connected.; N, M, u_i, and v_i are integers.; S is a string of length N consisting of 0 and 1.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/editorial/3600) — source-abc244-editorial-3600-c4c8d81e3b5842d82e680dd4c6364ee09a0ac396e283caed8d528569ac61d02e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc244/tasks/abc244_g) — source-abc244-g-problem-88ea6771faa07fcb57593f83a18d31b44e9d79bb30ee509a3cc692c531bd4427
