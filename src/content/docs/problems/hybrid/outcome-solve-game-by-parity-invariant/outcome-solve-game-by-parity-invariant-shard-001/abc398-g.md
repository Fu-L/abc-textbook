---
title: "ABC398-G — Not Only Tree Game"
draft: true
authoringUnit: {"problemId":"abc398-g","docPath":"src/content/docs/problems/hybrid/outcome-solve-game-by-parity-invariant/outcome-solve-game-by-parity-invariant-shard-001/abc398-g.md","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。"],"tagIds":["tag-bipartite-structure","tag-game-parity-invariant"],"sourceRevisionIds":["source-abc398-editorial-12480-8003d1b46f2ff6c39f41ce5531a9f0c5e3fbac8643c13eb674fb68d9b50bea86","source-abc398-g-problem-c9d2f0a8e8b595fd43c0a9850a40dfb21e3ed14ea05848869b4786b802cf3e4d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"xは各component内で現在追加可能なcross-part未edge数Σ(a_cb_c-m_c)である。 N奇数なら最終part積は常にevenでoo+x parityが勝敗を決める。N偶数ではeo=1,2が先手勝ち、eo=0はiso/2+x、eo≥3はoo+xのparityへ帰着する。 巨大なgame stateを探索せず、N parity、x、ee/oo/eo/isoの有限分類に対する戦略証明でO(N+M)判定できる。","sourceRevisionIds":["source-abc398-editorial-12480-8003d1b46f2ff6c39f41ce5531a9f0c5e3fbac8643c13eb674fb68d9b50bea86","source-abc398-g-problem-c9d2f0a8e8b595fd43c0a9850a40dfb21e3ed14ea05848869b4786b802cf3e4d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、初期辺なし。","procedure":["iso=3,oo=0,x=0、N奇数でoo+xは偶数。","一手目の辺後、二手目で第三頂点を繋ぎ、三手目はtriangleで違法。"],"executionTarget":null,"expectedResult":"後手Takahashi勝ち（先手はAoki）。","verificationStatus":"not_applicable","learningUnitIds":["unit-game-parity-invariant"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-game-by-parity-invariant","outcome-color-and-classify-bipartite-components"],"prerequisiteIds":[],"attainmentCondition":"同じ空graphでN=2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"iso/2+x=1は奇数なので先手Aoki勝ち。一辺を追加して相手に合法手がない。"},"answer":{"reasoningOrVerification":"iso/2+x=1は奇数なので先手Aoki勝ち。一辺を追加して相手に合法手がない。","procedure":["具体例の各状態・寄与を再計算する。","iso/2+x=1は奇数なので先手Aoki勝ち。一辺を追加して相手に合法手がない。"],"expectedResult":"iso/2+x=1は奇数なので先手Aoki勝ち。一辺を追加して相手に合法手がない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [偶奇不変量からゲームの勝敗を決める](src/content/docs/learn/modeling/game-parity-invariant.md)

- 合法手が独立な固定候補の消費に限られる場合や、成分分類から残手数の偶奇を求められる場合に、勝敗を決める偶奇量と応答戦略を証明し、局面ごとのDPなしで勝者を判定できる。
- 各連結成分を二色に塗って矛盾を検出し、二つの部の大きさと色反転の自由度を成分ごとに集約できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 後続状態の勝敗を再帰計算するGrundy DP、局面値を評価するminimax、およびグラフの二部彩色そのもの。

## 考察

各connected componentはbipartiteだが、component同士を初めて結ぶ際は片方の彩色を反転できる。最終complete bipartite graphのpart size parityが、総手数のparityを左右する。

component内部で追加できる残edge数xと、part size parity type ee,oo,eo,isolatedだけを残せば、以後のmerge gameの勝敗分類に十分である。

採用する候補: 各componentを二部分彩色して公式のparity invariantとeo個数による場合分けで勝者を判定する

巨大なgame stateを探索せず、N parity、x、ee/oo/eo/isoの有限分類に対する戦略証明でO(N+M)判定できる。

棄却する候補: componentの結び方と追加edge順をminimax探索する

合法edge数がΘ(N²)でgame treeは指数的だが、勝敗はcomponent size parityだけへ圧縮できる。

xは各component内で現在追加可能なcross-part未edge数Σ(a_cb_c-m_c)である。

N奇数なら最終part積は常にevenでoo+x parityが勝敗を決める。N偶数ではeo=1,2が先手勝ち、eo=0はiso/2+x、eo≥3はoo+xのparityへ帰着する。

全componentをBFS二色塗りしpart sizes(a,b)、size、edge数を集計してx,ee,oo,eo,isoを求める。公式の四caseを適用し、奇数ならAoki、偶数ならTakahashiを出力する。

## 典型の発動条件

### game stateのparity invariant

発動条件: 毎手edgeが一つ増え、terminal graphのedge parityが少数特徴量で決まるとき。

勝敗を残手数parityへ落とす。

### bipartite component type classification

発動条件: component mergeで彩色反転自由度があり、part size parityだけが重要なとき。

(even,even),(odd,odd),(even,odd),isolatedへ分類する。

## 問題固有の要素

disconnectedでは二部分彩色がcomponentごとに反転可能なので、単純な全体part積でなく、merge後parityを操作できるeo/isolated componentがgameの戦略自由度になる。

別の問題へ持ち帰る視点: component merge gameでは、各componentのorientation自由度と、mergeで変わるsize parity classを抽象stateにする。

## 正当性

xは各component内で現在追加可能なcross-part未edge数Σ(a_cb_c-m_c)である。 N奇数なら最終part積は常にevenでoo+x parityが勝敗を決める。N偶数ではeo=1,2が先手勝ち、eo=0はiso/2+x、eo≥3はoo+xのparityへ帰着する。 巨大なgame stateを探索せず、N parity、x、ee/oo/eo/isoの有限分類に対する戦略証明でO(N+M)判定できる。

## 実装上の注意

- isolated(size1)を一般eoへ混ぜず別countする。xは64 bitでΣa·b-Mとしても計算でき、勝者名は先手Aokiに対応させる。

## 復習の核

- N≤8の全bipartite graphについて合法手minimaxをmemo化し、四case境界eo=0,1,2,3とisolated数で分類式を照合する。

## 計算量と制約

### 時間

O(N+M)、成分二色塗りと五集約量。

### 空間

O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq M \leq 2\times 10^5; 1 \leq U_i < V_i \leq N; The given graph does not contain an odd cycle.; The given graph does not contain multi-edges.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、初期辺なし。

1. iso=3,oo=0,x=0、N奇数でoo+xは偶数。
2. 一手目の辺後、二手目で第三頂点を繋ぎ、三手目はtriangleで違法。

期待される結果: 後手Takahashi勝ち（先手はAoki）。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ空graphでN=2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

iso/2+x=1は奇数なので先手Aoki勝ち。一辺を追加して相手に合法手がない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/editorial/12480) — source-abc398-editorial-12480-8003d1b46f2ff6c39f41ce5531a9f0c5e3fbac8643c13eb674fb68d9b50bea86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc398/tasks/abc398_g) — source-abc398-g-problem-c9d2f0a8e8b595fd43c0a9850a40dfb21e3ed14ea05848869b4786b802cf3e4d
