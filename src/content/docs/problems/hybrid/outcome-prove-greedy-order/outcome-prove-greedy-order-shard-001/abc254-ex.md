---
title: "ABC254-EX — Multiply or Divide by 2"
draft: true
authoringUnit: {"problemId":"abc254-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-001/abc254-ex.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-trie"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-binary-trie"],"sourceRevisionIds":["source-abc254-editorial-4053-9f7aacfde939525dde4cc480e4bd0f24b599dc75a8c1aa04ccda2ffa485a7a52","source-abc254-ex-problem-5438f1770b7e9bd0fd963bfa2d187dcc3fa87438470a7da1f7fcb681b9e15cea"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"倍増の直後の除算は恒等操作なので、任意の最短操作列を除算の後に倍増だけを置く形へ正規化できる。従って各Aと対応Bは、Aが任意辺で上りBが0辺だけ逆向きに上る共通祖先で照合できる。必要なLCAと0辺の経路は、入力文字列のtrie内にある。\n\n部分木vの元の個数差δ_vは、その親辺を外向きに通るAから内向きに通るAを引いた値に等しい。任意の対応は少なくとも|δ_v|回その辺を通る。1辺は内向きに通れないのでδ_v<0は不可能。postorderで内部の一致を全て確定すると、親へ渡す残りはδ_vの符号側だけとなり、合法な辺ではちょうど|δ_v|の費用で運べる。0辺で相反する流れを相殺しても、必要な対応を失わない。根の総差は0なので全てを照合でき、各辺下界の総和を達成して最小となる。","sourceRevisionIds":["source-abc254-editorial-4053-9f7aacfde939525dde4cc480e4bd0f24b599dc75a8c1aa04ccda2ffa485a7a52","source-abc254-ex-problem-5438f1770b7e9bd0fd963bfa2d187dcc3fa87438470a7da1f7fcb681b9e15cea"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

先に読む単元:

- [bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md) — 整数を上位bitから分岐する列として格納し、XOR・大小・最小距離の候補を貪欲に選ぶ。

この解説で扱わないこと:

- 対称操作による状態の正規化。

## 考察

整数を二進trieの節点とみなす。floor(A/2)は末尾bitを削って親へ上る操作、Aを2倍する操作は0の子へ下る操作である。0は空文字列の根とし、0の倍増は変化しないので省く。倍増直後の除算は元の値へ戻るため、最短操作列からこの二手を消せる。繰り返すと各要素の操作は「親へ上る、その後0辺だけを下る」順にできる。

後半の下りを逆向きに見てBを0辺だけ親へ上げれば、AとBを共通祖先で一致させる問題になる。Aはどの末尾bitでも削れるが、Bは末尾0の場合しか削れない。値の大小で対応させるのではなく、この木の有向移動制約を見る。

各trie節点vの部分木に元からあるA,Bの個数差をδ_vとする。境界の親辺を最終的に越える流れは、δ_v>0ならAがδ_v個外へ、δ_v<0なら外からBへ−δ_v個入る必要がある。従って少なくとも|δ_v|回の操作が必要で、1辺の子でδ_v<0ならB側へ入れず不可能である。0辺は両向きに通れる。

葉からA,Bの個数をまとめ、同じ節点でmin(A,B)組を一致させる。残ったAは個数分の費用を加えて親へ、残ったBも0辺なら個数分を加えて親へ移す。1辺にBだけが残れば−1。この処理は各辺で差の絶対値だけを一方向に運び、上の下界を達成する。

A=(3),B=(2)なら二進11と10のLCAは1。Aを一回割って1、次に倍増して2とし、操作数2。A=(2),B=(3)なら1辺の節点11にB余剰があり、0を付ける下りでは入れないので不可能。全要素数が等しいため、全辺を合法に処理できれば根で残数も相殺される。trieをO(NB)節点で作り、postorderの総移動数を答える。

## 典型の発動条件

### 二進trie上の祖先マッチング

発動条件: 整数操作が二進表記の末尾追加・削除として表せる。

同じ接頭辞を節点にまとめ、葉から根へ余剰個数を流す。

### 最深優先の貪欲法

発動条件: 深い位置の一致は浅い位置でも一致できるが、その逆はできない。

各節点で可能なA,Bを先に相殺し、未対応分だけを親へ送る。

## 問題固有の要素

二倍と切り捨て半分という操作を片側ずつ正方向で追う代わりに、一方を逆向きにすると、両者がtrieの根方向へ動くマッチングになる。

別の問題へ持ち帰る視点: 異なる向きの変換を共通中間状態で合わせる問題では、一方の操作を逆転して同じ半順序上の祖先移動へ揃える。

## 正当性

倍増の直後の除算は恒等操作なので、任意の最短操作列を除算の後に倍増だけを置く形へ正規化できる。従って各Aと対応Bは、Aが任意辺で上りBが0辺だけ逆向きに上る共通祖先で照合できる。必要なLCAと0辺の経路は、入力文字列のtrie内にある。

部分木vの元の個数差δ_vは、その親辺を外向きに通るAから内向きに通るAを引いた値に等しい。任意の対応は少なくとも|δ_v|回その辺を通る。1辺は内向きに通れないのでδ_v<0は不可能。postorderで内部の一致を全て確定すると、親へ渡す残りはδ_vの符号側だけとなり、合法な辺ではちょうど|δ_v|の費用で運べる。0辺で相反する流れを相殺しても、必要な対応を失わない。根の総差は0なので全てを照合でき、各辺下界の総和を達成して最小となる。

## 実装上の注意

- 0は根の空文字列。1から根へのAの移動は一回の除算だが、根から1へ向かう移動は許されない。
- 個数はまとめて加減し、残数だけを操作数へ加える。各子を処理した後で節点に元からある個数も含めて相殺する。
- trieの枝が1でB余剰が出た時点で不可能。根では親へ移動せず、A,Bの総数が同じなので余剰0を確認する。

## 復習の核

- 小さい値と個数で全対応を探索し、0、同じ値の重複、B側が1ビットで止まる例、深い節点で一部だけ相殺される例を確認する。

## 計算量と制約

### 時間

O(NB)、B=max値のbit長、trie node総数O(NB)。

### 空間

O(NB)。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 0 \leq a_1 \leq \ldots \leq a_N \leq 10^9; 0 \leq b_1 \leq \ldots \leq b_N \leq 10^9; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/editorial/4053) — source-abc254-editorial-4053-9f7aacfde939525dde4cc480e4bd0f24b599dc75a8c1aa04ccda2ffa485a7a52
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc254/tasks/abc254_h) — source-abc254-ex-problem-5438f1770b7e9bd0fd963bfa2d187dcc3fa87438470a7da1f7fcb681b9e15cea
