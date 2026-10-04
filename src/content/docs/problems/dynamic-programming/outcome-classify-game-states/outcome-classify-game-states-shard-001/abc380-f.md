---
title: "ABC380-F — Exchange Game"
draft: true
authoringUnit: {"problemId":"abc380-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-classify-game-states/outcome-classify-game-states-shard-001/abc380-f.md","learningOutcomeIds":["outcome-classify-game-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。"],"tagIds":["tag-game-grundy-dp"],"sourceRevisionIds":["source-abc380-editorial-11351-466103312076f33bd3c483117d2d043c7a11a8b8b73e450614696190c6e1dfbe","source-abc380-f-problem-7fb17205b066a873aa585d6cd8a1d97e733edec3a7c8f796f2f9e4f7007d48be"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一手で出した値より小さい札しか受け取れず、取らないこともできるため、両者の手札値総和は真に減る。したがって局面に閉路はない。所属と手番が全合法手を決めるので memo が履歴を忘れてよい。合法手なしを負け、相手負けへ移れる状態を勝ちとする DAG 帰納法で最適勝敗を決定する。","sourceRevisionIds":["source-abc380-editorial-11351-466103312076f33bd3c483117d2d043c7a11a8b8b73e450614696190c6e1dfbe","source-abc380-f-problem-7fb17205b066a873aa585d6cd8a1d97e733edec3a7c8f796f2f9e4f7007d48be"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)

- 後続状態から勝敗またはGrundy数を導き、ゲームの初期状態を分類できる。

先に読む単元:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md) — 初歩的な一次元DPを土台に、未来を決める情報だけを残す最小十分状態の設計原則を学ぶ。

この解説で扱わないこと:

- 有限DAGの得点差minimax、循環ゲームの距離評価、独立な数ゲームの加算。

## 考察

カード総数 S=N+M+L≤12 なので、各カードの所属を高橋手札・青木手札・場の3値で表すと状態数は3^Sである。手札の値総和は手番ごとに真に減るため局面 graph は非巡回になる。 カードは識別して3か所のいずれかにあるため base-3 mask が完全な局面表現で、手番は遷移深さまたは別bitで分かる。 局面が勝ちである必要十分条件は、合法手の中に相手を負け局面へ送るものが一つでも存在することである。

採用する候補: 3進数でカード所属を符号化し、現手番から相手の必敗状態へ移れるかをメモ化再帰で判定する。

有限状態数 O(3^S) と各局面 O(S^2) の合法手列挙で全ゲーム木を共有でき、循環判定も不要である。

棄却する候補: ゲーム木を手順ごとに展開し、同じカード配置へ至る異なる履歴も別々に探索する。

分岐が多く同一局面が繰り返し現れるため、深さが有限でも指数より大きい重複探索になる。

カードは識別して3か所のいずれかにあるため base-3 mask が完全な局面表現で、手番は遷移深さまたは別bitで分かる。

局面が勝ちである必要十分条件は、合法手の中に相手を負け局面へ送るものが一つでも存在することである。

solve(mask,turn) を memoize し、手札から一枚出し、必要ならそれより小さい場札を一枚取る全合法手を生成する。子が一つでも losing なら winning、合法手がないか全子 winning なら losing とする。

## 典型の発動条件

### 有限 impartial-like game のメモ化

発動条件: 小さな要素集合が有限個の場所を移り、完全情報二人ゲームを判定するとき。

局面を多進数 mask にし win/lose 漸化式を共有する。

## 問題固有の要素

値そのものではなく各カードの所在だけで未来が決まり、合計12という制約が3進状態圧縮を示す。

別の問題へ持ち帰る視点: 手札総和の単調減少を確認すると再帰に cycle がないことを保証できる。

## 正当性

一手で出した値より小さい札しか受け取れず、取らないこともできるため、両者の手札値総和は真に減る。したがって局面に閉路はない。所属と手番が全合法手を決めるので memo が履歴を忘れてよい。合法手なしを負け、相手負けへ移れる状態を勝ちとする DAG 帰納法で最適勝敗を決定する。

## 実装上の注意

- 同じ値でもカードは別 index として扱う。場から取らない選択も含め、取り得るのは出した値より小さいカードだけである。

## 復習の核

- 再帰の返値を「手番側が勝てる」に統一し、1手後の false が存在するかという否定関係を小局面で検証する。

## 計算量と制約

### 時間

カード総数 S≤12。状態は所属3^S×手番2、各状態 O(S²) 合法手を作るため O(S²3^S)。

### 空間

所属state×手番のmemo O(3^S)、再帰stack O(S²)。値を大小順位へ置き換えると両手札の順位和が各手で1以上減り初期和は高々S(S+1)/2なので深さO(S²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M, L; N + M + L \leq 12; 1 \leq A_i, B_i, C_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc380/editorial/11351) — source-abc380-editorial-11351-466103312076f33bd3c483117d2d043c7a11a8b8b73e450614696190c6e1dfbe
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc380/tasks/abc380_f) — source-abc380-f-problem-7fb17205b066a873aa585d6cd8a1d97e733edec3a7c8f796f2f9e4f7007d48be
