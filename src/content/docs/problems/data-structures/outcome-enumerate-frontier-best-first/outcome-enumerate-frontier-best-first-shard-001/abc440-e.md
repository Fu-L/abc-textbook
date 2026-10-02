---
title: "ABC440-E — Cookies"
draft: true
authoringUnit: {"problemId":"abc440-e","docPath":"src/content/docs/problems/data-structures/outcome-enumerate-frontier-best-first/outcome-enumerate-frontier-best-first-shard-001/abc440-e.md","learningOutcomeIds":["outcome-enumerate-frontier-best-first"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-priority-queue-best-first"],"sourceRevisionIds":["source-abc440-e-problem-f89833a96662127092b91631b0acdc65154d16ee3b87c9932c2feed24ed1db29","source-abc440-editorial-15015-bb7a452f0626cf265d8db0e660d4c12d4b42c6c2c082d611debd70795e99722c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"各枚数vectorは一意な親を持ち、その添字和が減るので全状態は根から到達できる。親を逆にした子は最大添字を一つ進めるか、現在の最大添字へ直前種類を移すかの二形に限られ、列挙した二子が全てである。辺を下ると金額が非増加なので、heapにまだ現れていない状態の祖先は、それ以上の金額でheap内に残っている。従ってheap最大の取り出しは未出力状態全体の最大と一致する。一意な親により同一vectorは一度だけ生成され、同額の別vectorは残る。","sourceRevisionIds":["source-abc440-e-problem-f89833a96662127092b91631b0acdc65154d16ee3b87c9932c2feed24ed1db29","source-abc440-editorial-15015-bb7a452f0626cf265d8db0e660d4c12d4b42c6c2c082d611debd70795e99722c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [priority queue・best-first列挙](src/content/docs/learn/query/priority-queue-best-first.md)

- 現在のfrontierの極値をheapで確定し、新しく解禁された候補だけを追加して上位K個や最良状態を列挙する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- priority queue・best-first列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

Aを降順に並べ、各種類の枚数C=(C_1,…,C_N)を状態にする。和が最大なのは(K,0,…,0)。種類iの一枚をi+1へ移すと、和はA_i−A_{i+1}だけ減るので、最大heapで妥協を小さい順に辿れば上位X個を列挙できる。

全種類への移動を毎回生成すると、一状態あたりN個の子と、その重複検査が必要になる。ここでは各状態に親を一意に定めて、子を高々二個へ減らす。根以外の状態で、枚数が正の最大添字をrとすると、「種類rの一枚をr−1へ戻す」状態を親とする。枚数の添字和が減るので、この親を辿れば必ず根へ戻る。

この親規約に対応する子は次の二つだけ。

- r<Nなら、現在最も右の種類rから一枚をr+1へ移す。
- r>1かつC_{r−1}>0なら、種類r−1から一枚をrへ移す。

後者では現在の種類rの枚数が既に正であることが必要。根ではr=1なので最初の子だけである。例えばK=2,N=3では(2,0,0)→(1,1,0)、そこから(1,0,1)と(0,2,0)の二子が生じる。(0,1,1)の親は(0,2,0)だけなので、別の移動順から重複生成しない。

各子の和は親の和以下。この木の未出力最大状態をheapから取り出し、二子を挿入する操作をX回行う。visitedは不要で、同じ金額でも枚数vectorが異なる状態は別々に出力する。heapには和、r、長さNの枚数vectorを持つ。

## 典型の発動条件

### 単調な状態グラフの best-first 列挙

発動条件: 最大状態から全候補へ到達でき、遷移のたびに評価値が悪化する上位 K 個列挙であるとき。

選び方をヒープで管理し、現在最大の状態から一段階の妥協だけを生成する。

### 重複状態を持つ暗黙グラフ探索

発動条件: 同じ組合せ状態へ異なる操作順で到達し得るとき。

枚数ベクトルを visited set に保存して、同じ選び方を一度だけヒープへ入れる。

## 問題固有の要素

「妥協」を一枚だけ右隣へ移す操作に限定しても、弱合成 C の任意状態へ到達でき、A の降順性により評価値の単調性も同時に得られる。

別の問題へ持ち帰る視点: 上位解列挙では、最良解から全解を生成できる局所変形と、その変形で目的値が単調になる順序を探す。

## 正当性

各枚数vectorは一意な親を持ち、その添字和が減るので全状態は根から到達できる。親を逆にした子は最大添字を一つ進めるか、現在の最大添字へ直前種類を移すかの二形に限られ、列挙した二子が全てである。辺を下ると金額が非増加なので、heapにまだ現れていない状態の祖先は、それ以上の金額でheap内に残っている。従ってheap最大の取り出しは未出力状態全体の最大と一致する。一意な親により同一vectorは一度だけ生成され、同額の別vectorは残る。

## 実装上の注意

- 同額のvectorを一つにまとめない。親規約でvectorの重複だけを防ぐ。
- 最大の正枚数添字rを状態とともに保持し、rとr−1からの高々二遷移だけを生成する。
- 金額和は負値も含み、K|A_i|は10^14に達するため64 bitを使う。

## 復習の核

- 上位列挙へ進む前に、局所変形の到達可能性と評価値の単調性を別々に証明する。同じ和を持つ別状態が出力から消えないことも小例で確かめる。

## 計算量と制約

### 時間

O(N log N+X(N+log(X+1)))。一出力につき高々二子を生成し、vectorのコピーはO(N)、heap操作は和の比較でO(log(X+1))。全種類へのN個の遷移やvectorをキーとするvisited比較は行わない。

### 空間

O(NX+N)。生成状態は高々2X+1個で各vectorはN整数。N=50,X=10^5でも枚数保存はO(5×10^6)整数規模。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 50; 1 \leq K \leq 10^5; 1 \leq X \leq \min\left(10^5, \binom{N+K-1}{K}\right); -10^9 \leq A_i \leq 10^9; All input values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/tasks/abc440_e) — source-abc440-e-problem-f89833a96662127092b91631b0acdc65154d16ee3b87c9932c2feed24ed1db29
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc440/editorial/15015) — source-abc440-editorial-15015-bb7a452f0626cf265d8db0e660d4c12d4b42c6c2c082d611debd70795e99722c
