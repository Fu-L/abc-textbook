---
title: "ABC264-E — Blackout 2"
draft: true
authoringUnit: {"problemId":"abc264-e","docPath":"src/content/docs/problems/hybrid/outcome-reverse-update-time/outcome-reverse-update-time-shard-001/abc264-e.md","learningOutcomeIds":["outcome-reverse-update-time"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dsu-components"],"excludedTopics":["値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。"],"tagIds":["tag-reverse-offline","tag-dsu-components"],"sourceRevisionIds":["source-abc264-e-problem-bd843af830bff7ef0c524fcdd2d01548dbbdd2a8c6b3f48f0d31e08a6777bae3","source-abc264-editorial-4583-9802bae9f540b5a9e97e57fdbeea97e2919d30cda39ff2f9ce5fcedc243a47e8"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"併合する二成分の片方だけが発電所を含む場合、発電所を含まない側の都市数がそのまま新しく通電する都市数になる。 DSU は追加による成分併合を高速に処理でき、発電所成分と非発電所成分が結合する瞬間だけ新規通電都市が増える。","sourceRevisionIds":["source-abc264-e-problem-bd843af830bff7ef0c524fcdd2d01548dbbdd2a8c6b3f48f0d31e08a6777bae3","source-abc264-editorial-4583-9802bae9f540b5a9e97e57fdbeea97e2919d30cda39ff2f9ce5fcedc243a47e8"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reverse-update-time"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"都市1,2、発電所3、辺12,23、23を削除。","procedure":["削除後は都市二つが発電所なし成分。","reverseで23追加すると都市成分数2が通電する。"],"executionTarget":null,"expectedResult":"削除後通電0。","verificationStatus":"not_applicable","learningUnitIds":["unit-reverse-offline"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reverse-update-time"],"prerequisiteIds":["unit-dsu-components"],"attainmentCondition":"発電所を含む成分同士をmergeしたら都市数を再加算するか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"既に全都市通電済みなので増分0。片方だけ電源ありの場合に非電源側都市数を足す。"},"answer":{"reasoningOrVerification":"既に全都市通電済みなので増分0。片方だけ電源ありの場合に非電源側都市数を足す。","procedure":["具体例の各状態・寄与を再計算する。","既に全都市通電済みなので増分0。片方だけ電源ありの場合に非電源側都市数を足す。"],"expectedResult":"既に全都市通電済みなので増分0。片方だけ電源ありの場合に非電源側都市数を足す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [時間を逆向きにして未来依存を消す](src/content/docs/learn/modeling/reverse-offline.md)

- 時間依存を逆走査・逆操作・last-write時刻で単調または静的にし、元の時点へ答えを戻せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DSUによる連結成分管理・縮約](src/content/docs/learn/graph/dsu-components.md)

対象外:

- 値順eventを前から処理するsweep、時刻を反転せずに行う通常のonline更新、および答えの局所寄与だけを集計する順序交換。

## 考察

辺削除後の連結性をオンラインに保つのは難しいが、全イベントを逆順に見れば削除辺を一つずつ追加する問題になる。

都市が通電しているかは、その連結成分が少なくとも一つ発電所を含むかだけで決まる。

棄却する候補: 各電線破断後に発電所から BFS/DFS をやり直して到達都市数を数える。

最大50万回のイベントごとにグラフ全体を探索できない。

採用する候補: 最後まで残る辺で DSU を初期化し、削除イベントを逆順に辺追加として処理しながら通電都市総数を更新する。

DSU は追加による成分併合を高速に処理でき、発電所成分と非発電所成分が結合する瞬間だけ新規通電都市が増える。

併合する二成分の片方だけが発電所を含む場合、発電所を含まない側の都市数がそのまま新しく通電する都市数になる。

offline dynamic connectivity の削除列を time reversal で追加列へ変換し、component aggregate 付き Union-Find で問い合わせ値を保つ。

## 典型の発動条件

### 辺削除クエリの逆順処理

発動条件: 削除される辺が事前に全て分かり、途中で同じ辺が再削除されないオフライン問題。

最終グラフから始め、イベントを逆順に辺追加として答えを復元する。

### 成分属性付き Union-Find

発動条件: 辺追加で成分を併合し、成分内の特別頂点有無や重み和を追跡するとき。

各根に発電所有無と都市数を持たせ、union 時に属性を合成する。

## 問題固有の要素

全発電所を一つの仮想頂点へまとめ、都市だけ重み1・発電所は重み0としても、通電都市数を仮想成分の重みとして管理できる。

別の問題へ持ち帰る視点: 複数の同等なsourceへの到達性はsuper-sourceへ縮約し、対象だけを成分重みに数える。

## 正当性

併合する二成分の片方だけが発電所を含む場合、発電所を含まない側の都市数がそのまま新しく通電する都市数になる。 DSU は追加による成分併合を高速に処理でき、発電所成分と非発電所成分が結合する瞬間だけ新規通電都市が増える。

## 実装上の注意

- 削除対象辺をmarkし、それ以外の全辺を先にunionして最終イベント後の状態を作る。
- 逆順では辺を戻す前の通電都市数が元の該当イベント直後の答えなので、記録とunionの順を取り違えない。

## 復習の核

- 削除だけの動的連結性は、全削除が既知なら時間を反転して追加だけにできるか最初に確認する。
- 特別頂点への到達数は、成分同士が結合した瞬間にどちら側の重みが新しく有効になるかで差分更新する。

## 計算量と制約

### 時間

O((N+M+E+Q)α(N+M))、都市N発電所M辺E削除Q。

### 空間

O(N+M+E+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: All values in input are integers.; 1 \le N,M; N+M \le 2 \times 10^5; 1 \le Q \le E \le 5 \times 10^5; 1 \le U_i < V_i \le N+M; If i \neq j, then U_i \neq U_j or V_i \neq V_j.; 1 \le X_i \le E; X_i are distinct.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

都市1,2、発電所3、辺12,23、23を削除。

1. 削除後は都市二つが発電所なし成分。
2. reverseで23追加すると都市成分数2が通電する。

期待される結果: 削除後通電0。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

発電所を含む成分同士をmergeしたら都市数を再加算するか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

既に全都市通電済みなので増分0。片方だけ電源ありの場合に非電源側都市数を足す。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/tasks/abc264_e) — source-abc264-e-problem-bd843af830bff7ef0c524fcdd2d01548dbbdd2a8c6b3f48f0d31e08a6777bae3
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc264/editorial/4583) — source-abc264-editorial-4583-9802bae9f540b5a9e97e57fdbeea97e2919d30cda39ff2f9ce5fcedc243a47e8
