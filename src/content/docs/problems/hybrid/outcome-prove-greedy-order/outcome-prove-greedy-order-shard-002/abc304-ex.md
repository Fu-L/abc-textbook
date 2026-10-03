---
title: "ABC304-EX — Constrained Topological Sort"
draft: true
authoringUnit: {"problemId":"abc304-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc304-ex.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dag-topological-processing"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-dag-topological-processing"],"sourceRevisionIds":["source-abc304-editorial-6500-329ed419aaa87d2073ba6e9f3aa951ed2b89c2ab042b9ebbe37b752da919c244","source-abc304-ex-problem-88a1b5dcec9cca88a888a187d670ad04f5cc1f9733774bff9af0e3dd3127f935"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"実行可能な順列では各辺 s→t に対し P_s≤P_t−1≤R_t−1 なので、逆 topological 順の R_s←min(R_s,R_t−1) は解を失わない。伝播後は全辺で R_s<R_t となる。cycle または L_v>R_v があれば解はない。\n\n貪欲 prefix が実行可能解へ延長できると仮定し、位置 i で選ぶ最小 deadline の頂点を v とする。延長解で v の位置を j とする。v は全 predecessor が prefix にいるので i へ前倒しでき、release 条件も L_v≤i で満たす。ただし区間 [i,j) を一律に右へずらすと、途中の頂点の deadline を超え得るので、次の successor chain を使う。\n\n元の位置 i の頂点 u を動かす。u の直接 successor が元の位置 j より前にあるなら、その中で最も早い位置 k の頂点へ u を移し、そこにいた successor を次の u とする。なければ u を位置 j へ移して終了する。移す位置は厳密に増え、v は未配置 predecessor を持たないのでこの chain に現れない。\n\n最初の u は位置 i で配置可能だから R_u≥R_v≥j。chain では辺をたどるので deadline は厳密に増え、全頂点を j 以下へ遅らせても deadline を守る。遅らせるため L も守る。各移動頂点の predecessor は元の位置より前に残るか chain 上で前へ配置される。successor のうち最も早いものは次にさらに遅い位置へ移り、ほかの successor は移動先より後ろにある。したがって辺順序も守る。v の successor は元々 j より後ろなので前倒しの影響を受けない。\n\nこれで同じ prefix に v を追加した実行可能解を作れる。帰納的に貪欲選択は安全。候補がなければ位置 i を埋められず、最小 R が i 未満ならその頂点を今後置けないため No は必要である。全配置できれば構成した順列が全条件を満たす。","sourceRevisionIds":["source-abc304-editorial-6500-329ed419aaa87d2073ba6e9f3aa951ed2b89c2ab042b9ebbe37b752da919c244","source-abc304-ex-problem-88a1b5dcec9cca88a888a187d670ad04f5cc1f9733774bff9af0e3dd3127f935"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [交換論から選択順を導く](src/content/docs/learn/modeling/greedy-exchange.md)

- 局所選択の交換または候補の支配関係を示し、安全な順序・候補・caseを確定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DAGのtopological processing](src/content/docs/learn/graph/dag-topological-processing.md)

対象外:

- 対称操作による状態の正規化。

## 考察

順列Pで辺(s,t)を満たす条件はP_s<P_tであり、これはtopological orderの構成である。さらに各頂点vを位置区間[L_v,R_v]へ配置する、release timeとdeadline付きのscheduleと見なせる。

採用する候補: Rを辺に沿って逆伝播し、配置可能頂点から最小Rを貪欲に選ぶ

辺順序を壊さず各positionで最もdeadlineの早い頂点を処理するexchange argumentが成り立ち、priority queueで構成できる。

棄却する候補: 任意のtopological orderを作ってから区間制約だけ検査する

topological orderは多数あり、任意に選ぶと存在する解を逃し得るため、deadlineを考慮して同時に順序を決める必要がある。

全辺(s,t)についてR_s←min(R_s,R_t-1)を逆topological順に伝播しても実行可能解は失われず、その後はR_s<R_tとなる。配置可能な頂点のうち最小Rを選ぶ解へ任意の実行可能解を交換変形できるので、earliest-deadline-firstが安全である。

まずtopological sortし、cycleならNoとする。逆順に各辺のR上界を伝播し、L_v≤R_vを確認する。position iを1から進め、全predecessor配置済みかつL_v≤iの頂点をmin-heapへ入れ、R最小を取り出してP_v=iとする。候補なしまたはi>R_vならNo、全配置できればYesとPを出力する。

## 典型の発動条件

### 制約伝播付きtopological sort

発動条件: DAGの先行制約に加えて各頂点の配置上限がある。

successorのdeadlineからpredecessorのdeadlineをR_s≤R_t-1として逆向きに伝播する。

### earliest-deadline-first

発動条件: 各時刻にrelease済みかつ先行条件を満たすjobから一つ選び、全deadlineを守りたい。

配置可能集合をR最小のpriority queueで管理し、交換可能性により局所選択を正当化する。

## 問題固有の要素

Rを先に伝播して辺ごとに厳密増加させることで、未配置の頂点を前へ交換したときにもsuccessor側のdeadline余裕を証明でき、単純なEDFが成立する。

別の問題へ持ち帰る視点: 複数種類の順序制約がある構成問題では、上界を依存辺に沿って閉包してからdeadline貪欲へ渡すと証明しやすい。

## 正当性

実行可能な順列では各辺 s→t に対し P_s≤P_t−1≤R_t−1 なので、逆 topological 順の R_s←min(R_s,R_t−1) は解を失わない。伝播後は全辺で R_s<R_t となる。cycle または L_v>R_v があれば解はない。

貪欲 prefix が実行可能解へ延長できると仮定し、位置 i で選ぶ最小 deadline の頂点を v とする。延長解で v の位置を j とする。v は全 predecessor が prefix にいるので i へ前倒しでき、release 条件も L_v≤i で満たす。ただし区間 [i,j) を一律に右へずらすと、途中の頂点の deadline を超え得るので、次の successor chain を使う。

元の位置 i の頂点 u を動かす。u の直接 successor が元の位置 j より前にあるなら、その中で最も早い位置 k の頂点へ u を移し、そこにいた successor を次の u とする。なければ u を位置 j へ移して終了する。移す位置は厳密に増え、v は未配置 predecessor を持たないのでこの chain に現れない。

最初の u は位置 i で配置可能だから R_u≥R_v≥j。chain では辺をたどるので deadline は厳密に増え、全頂点を j 以下へ遅らせても deadline を守る。遅らせるため L も守る。各移動頂点の predecessor は元の位置より前に残るか chain 上で前へ配置される。successor のうち最も早いものは次にさらに遅い位置へ移り、ほかの successor は移動先より後ろにある。したがって辺順序も守る。v の successor は元々 j より後ろなので前倒しの影響を受けない。

これで同じ prefix に v を追加した実行可能解を作れる。帰納的に貪欲選択は安全。候補がなければ位置 i を埋められず、最小 R が i 未満ならその頂点を今後置けないため No は必要である。全配置できれば構成した順列が全条件を満たす。

## 実装上の注意

- indegree が 0 かつ L_v≤i の頂点だけを min-heap に入れる。L ごとの bucket を用意し、時刻到達時と indegree が 0 になった時の両方で追加条件を確認する。まだ release 前の頂点は bucket で待たせる。
- heap の最小 R が i 未満なら No。位置を飛ばすと順列を作れないため、候補が空でも次の release まで時刻を飛ばさない。
- R の伝播は逆 topological 順で行う。順序が逆だと遠い successor の制約を取り込めない。

## 復習の核

- deadline の逆伝播が解を失わないことと、successor chain による交換で release・deadline・辺順序を同時に守ることを分けて証明する。

## 計算量と制約

### 時間

O((N+M)log N)、topological逆伝播と配置heap。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min\lbrace 4 \times 10^5, N(N-1) \rbrace; 1 \leq s_i, t_i \leq N; s_i \neq t_i; i \neq j \implies (s_i, t_i) \neq (s_j, t_j); 1 \leq L_i \leq R_i \leq N; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/editorial/6500) — source-abc304-editorial-6500-329ed419aaa87d2073ba6e9f3aa951ed2b89c2ab042b9ebbe37b752da919c244
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/tasks/abc304_h) — source-abc304-ex-problem-88a1b5dcec9cca88a888a187d670ad04f5cc1f9733774bff9af0e3dd3127f935
