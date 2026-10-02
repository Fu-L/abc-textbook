---
title: "ABC433-G — Substring Game"
draft: true
authoringUnit: {"problemId":"abc433-g","docPath":"src/content/docs/problems/string-geometry/outcome-build-suffix-automaton/outcome-build-suffix-automaton-shard-001/abc433-g.md","learningOutcomeIds":["outcome-build-suffix-automaton"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-game","unit-finite-pattern-automaton"],"excludedTopics":["接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。"],"tagIds":["tag-suffix-automaton","tag-game-grundy-dp"],"sourceRevisionIds":["source-abc433-editorial-14604-dc4c7ff9c502d4e6f093918f8d3f4fe32c97ba0d442486658598234b34044eaf","source-abc433-g-problem-56991ad609c06493e3f50699aa57d6046d113f95a100f431f220b0430bef96a4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"SAMのstateは同じ右拡張languageを持つsubstringをまとめるのでゲームの合法次手集合も同じになる。遷移はlenを増やしcycleがない。出辺なしは負け、負けへ一手で行けるなら勝ち、全行先勝ちなら負けという有限DAGの帰納判定が最適playを表す。初期stateは空列からの全最初手を持つのでその値が全gameの勝敗。","sourceRevisionIds":["source-abc433-editorial-14604-dc4c7ff9c502d4e6f093918f8d3f4fe32c97ba0d442486658598234b34044eaf","source-abc433-g-problem-56991ad609c06493e3f50699aa57d6046d113f95a100f431f220b0430bef96a4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Suffix Automatonで部分文字列集合を表す](src/content/docs/learn/string/suffix-automaton.md)

- endpos同値類を状態にし、suffix linkと必要なcloneを正しく作って全部分文字列の遷移を線形状態数で表せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ゲーム状態の勝敗とGrundy数](src/content/docs/learn/dynamic-programming/dp-game.md)
- [有限状態automatonの構成](src/content/docs/learn/string/finite-pattern-automaton.md)

対象外:

- 接尾辞を辞書順に並べるSuffix Array、および複数patternの辞書照合だけを行うAho–Corasick。

## 考察

ゲーム中に作られる文字列は S の部分文字列であり、手番では末尾へ一文字追加してなお部分文字列である遷移を選ぶ。これは Suffix Automaton の初期状態からの遷移グラフそのものである。

採用する候補: S の Suffix Automaton を構築し、各状態をゲーム局面として DAG 上の勝敗を後退解析する。

状態・遷移数がともに O(|S|) で、同じ右文脈を持つ多数の部分文字列を一状態へ圧縮できる。

棄却する候補: 現在文字列そのものを set に持って全ての相異なる部分文字列を列挙する。

相異なる部分文字列は Θ(N^2) 個になり得る。

Suffix Automaton の各遷移は表す部分文字列へ一文字追加する操作に対応し、len が増えるため遷移グラフは DAG である。

出辺のない状態は手番プレイヤーの負け、負け状態へ移れる状態は勝ち、全遷移先が勝ちなら負けとなる。

S を一文字ずつ追加して Suffix Automaton を構築する。状態を len の降順に処理し、出辺先に losing が一つでもあれば winning、なければ losing とする。空文字列を表す初期状態の勝敗から Alice/Bob を答える。

## 典型の発動条件

### Suffix Automaton

発動条件: 文字列の全相異なる部分文字列を、末尾への文字追加遷移を保った線形個の状態へ圧縮したいとき。

ゲーム局面の同値な right context を automaton の状態として共有する。

### DAG ゲームの後退解析

発動条件: 各手で非巡回グラフの辺を進み、動けない側が負ける impartial game の勝敗を求めるとき。

長さ降順に、遷移先の勝敗から現在状態を決める。

## 問題固有の要素

部分文字列ゲームの将来の合法手は文字列の右文脈だけで決まり、Suffix Automaton がその Myhill–Nerode 型同値類を表す。

別の問題へ持ち帰る視点: 局面数が多い文字列ゲームは、合法な一文字拡張を受理する automaton 上のゲームへ圧縮できる。

## 正当性

SAMのstateは同じ右拡張languageを持つsubstringをまとめるのでゲームの合法次手集合も同じになる。遷移はlenを増やしcycleがない。出辺なしは負け、負けへ一手で行けるなら勝ち、全行先勝ちなら負けという有限DAGの帰納判定が最適playを表す。初期stateは空列からの全最初手を持つのでその値が全gameの勝敗。

## 実装上の注意

- clone 状態を含む全状態を len 降順に処理する。terminal フラグではなく出辺の有無がゲーム終了条件である。

## 復習の核

- automaton が suffix だけでなく全 substring の一文字拡張を表すこと、初期状態を空文字列局面として評価することを確認する。

## 計算量と制約

### 時間

O(|S|)の固定alphabet suffix automaton構築とlen順勝敗DP。

### 空間

O(|S|)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 10^5; T is an integer.; S is a string consisting of lowercase English letters with length between 1 and 2\times 10^5, inclusive.; The sum of the lengths of S over all test cases is at most 4\times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc433/editorial/14604) — source-abc433-editorial-14604-dc4c7ff9c502d4e6f093918f8d3f4fe32c97ba0d442486658598234b34044eaf
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc433/tasks/abc433_g) — source-abc433-g-problem-56991ad609c06493e3f50699aa57d6046d113f95a100f431f220b0430bef96a4
