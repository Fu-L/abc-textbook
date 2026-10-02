---
title: "ABC304-EX — Constrained Topological Sort"
draft: true
authoringUnit: {"problemId":"abc304-ex","docPath":"src/content/docs/problems/hybrid/outcome-prove-greedy-order/outcome-prove-greedy-order-shard-002/abc304-ex.md","learningOutcomeIds":["outcome-prove-greedy-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dag-topological-processing"],"excludedTopics":["対称操作による状態の正規化。"],"tagIds":["tag-greedy-exchange-order","tag-dag-topological-processing"],"sourceRevisionIds":["source-abc304-editorial-6500-329ed419aaa87d2073ba6e9f3aa951ed2b89c2ab042b9ebbe37b752da919c244","source-abc304-ex-problem-88a1b5dcec9cca88a888a187d670ad04f5cc1f9733774bff9af0e3dd3127f935"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"全辺(s,t)についてR_s←min(R_s,R_t-1)を逆topological順に伝播しても実行可能解は失われず、その後はR_s<R_tとなる。配置可能な頂点のうち最小Rを選ぶ解へ任意の実行可能解を交換変形できるので、earliest-deadline-firstが安全である。 辺順序を壊さず各positionで最もdeadlineの早い頂点を処理するexchange argumentが成り立ち、priority queueで構成できる。","sourceRevisionIds":["source-abc304-editorial-6500-329ed419aaa87d2073ba6e9f3aa951ed2b89c2ab042b9ebbe37b752da919c244","source-abc304-ex-problem-88a1b5dcec9cca88a888a187d670ad04f5cc1f9733774bff9af0e3dd3127f935"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-prove-greedy-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"辺1→2、許容順位1:[1,2],2:[1,2]。","procedure":["逆伝播でR1=min(2,2−1)=1。","位置1へ1、位置2へ2を置く。"],"executionTarget":null,"expectedResult":"P=(1,2)。","verificationStatus":"not_applicable","learningUnitIds":["unit-greedy-exchange"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-prove-greedy-order"],"prerequisiteIds":["unit-dag-topological-processing"],"attainmentCondition":"R伝播をせず後続の締切だけ見ると安全か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"先行制約が要求する残り位置を見落とす。R_s≤R_t−1を逆topologicalに伝播してEDFの交換条件を作る。"},"answer":{"reasoningOrVerification":"先行制約が要求する残り位置を見落とす。R_s≤R_t−1を逆topologicalに伝播してEDFの交換条件を作る。","procedure":["具体例の各状態・寄与を再計算する。","先行制約が要求する残り位置を見落とす。R_s≤R_t−1を逆topologicalに伝播してEDFの交換条件を作る。"],"expectedResult":"先行制約が要求する残り位置を見落とす。R_s≤R_t−1を逆topologicalに伝播してEDFの交換条件を作る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

全辺(s,t)についてR_s←min(R_s,R_t-1)を逆topological順に伝播しても実行可能解は失われず、その後はR_s<R_tとなる。配置可能な頂点のうち最小Rを選ぶ解へ任意の実行可能解を交換変形できるので、earliest-deadline-firstが安全である。 辺順序を壊さず各positionで最もdeadlineの早い頂点を処理するexchange argumentが成り立ち、priority queueで構成できる。

## 実装上の注意

- indegreeが0でもL_v>iなら待機させ、iがL_vへ達した時にheapへ入れる。R伝播で1未満になる場合、heapが空の場合、取り出したR_v<iの場合を失敗として扱う。

## 復習の核

- Nの小さいDAGで全順列を総当たりし、cycle、伝播後L>R、release待ちでheapが一時的に空、同じRの候補が複数ある例と照合する。

## 計算量と制約

### 時間

O((N+M)log N)、topological逆伝播と配置heap。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 0 \leq M \leq \min\lbrace 4 \times 10^5, N(N-1) \rbrace; 1 \leq s_i, t_i \leq N; s_i \neq t_i; i \neq j \implies (s_i, t_i) \neq (s_j, t_j); 1 \leq L_i \leq R_i \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

辺1→2、許容順位1:[1,2],2:[1,2]。

1. 逆伝播でR1=min(2,2−1)=1。
2. 位置1へ1、位置2へ2を置く。

期待される結果: P=(1,2)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

R伝播をせず後続の締切だけ見ると安全か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

先行制約が要求する残り位置を見落とす。R_s≤R_t−1を逆topologicalに伝播してEDFの交換条件を作る。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/editorial/6500) — source-abc304-editorial-6500-329ed419aaa87d2073ba6e9f3aa951ed2b89c2ab042b9ebbe37b752da919c244
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc304/tasks/abc304_h) — source-abc304-ex-problem-88a1b5dcec9cca88a888a187d670ad04f5cc1f9733774bff9af0e3dd3127f935
