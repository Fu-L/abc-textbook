---
title: "ABC313-F — Flip Machines"
draft: true
authoringUnit: {"problemId":"abc313-f","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-001/abc313-f.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering","unit-dp-subset-state"],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration","tag-contribution-reordering","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc313-editorial-6902-6d3c247afee2f117aee815d0cbeb6a571934752c6bdc476c7d3c035f4d3178c6","source-abc313-f-problem-00388b1b978884ab084a0d18e374bfd1d5a20819c1e12e48215b2f8ccd687a60"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"P-P 辺は損だけなので不要、Q-Q 辺は利益だけなので採用してよい。P-Q 辺では触る P 集合を固定すれば、その P に隣接する全 Q を触るのが最適になる。 P が小さければその subset を直接評価し、Q が小さければ P を順に採否して現在覆われた Q-mask を持つ DP にする。 機械選択は「触れた頂点集合」の重み付き被覆へ帰着し、P∪Q=N より min(|P|,|Q|)≤20 を必ず利用できる。","sourceRevisionIds":["source-abc313-editorial-6902-6d3c247afee2f117aee815d0cbeb6a571934752c6bdc476c7d3c035f4d3178c6","source-abc313-f-problem-00388b1b978884ab084a0d18e374bfd1d5a20819c1e12e48215b2f8ccd687a60"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"利益重みDのP頂点p=2、Q頂点q=5、辺p-q。","procedure":["Pを触らなければ増分0。","Pを触ると−2+5=3。"],"executionTarget":null,"expectedResult":"最適増分3。","verificationStatus":"not_applicable","learningUnitIds":["unit-bounded-enumeration"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"prerequisiteIds":["unit-contribution-reordering","unit-dp-subset-state"],"attainmentCondition":"pに繋がるQを一部だけ触る意味はあるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"Pを触る費用は固定で、Qは触るほど利益なので繋がる全Qを触る方が最適。"},"answer":{"reasoningOrVerification":"Pを触る費用は固定で、Qは触るほど利益なので繋がる全Qを触る方が最適。","procedure":["具体例の各状態・寄与を再計算する。","Pを触る費用は固定で、Qは触るほど利益なので繋がる全Qを触る方が最適。"],"expectedResult":"Pを触る費用は固定で、Qは触るほど利益なので繋がる全Qを触る方が最適。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

X_j≠Y_j の機械を一度でもカード i に接続して選ぶと、最後に i に触る機械の二択対称性から、i の裏向き確率は過去によらず 1/2 になる。期待値はカードごとに独立に足せる。

確定反転 X=Y を有利な時だけ先に処理した後、機械で触ると得するカード Q と、|A−B|/2 だけ損するカード P に分かれる。N≤40 なので小さい側だけ指数探索できる。

採用する候補: |P| と |Q| の小さい側を選び、P の subset 全探索または Q-mask の bit DP を使い分ける meet-in-the-middle 型最適化を行う。

機械選択は「触れた頂点集合」の重み付き被覆へ帰着し、P∪Q=N より min(|P|,|Q|)≤20 を必ず利用できる。

棄却する候補: M 台それぞれを使う/使わないで全 subset を探索する。

M は 10^5 で 2^M は不可能であり、同じ端点ペアの機械が期待値上同じ効果を持つことも無視している。

P-P 辺は損だけなので不要、Q-Q 辺は利益だけなので採用してよい。P-Q 辺では触る P 集合を固定すれば、その P に隣接する全 Q を触るのが最適になる。

P が小さければその subset を直接評価し、Q が小さければ P を順に採否して現在覆われた Q-mask を持つ DP にする。

X=Y の機械による確定反転を有利なカードだけ適用し基準和を作る。D_i=|A_i−B_i|/2 と P,Q を定義し、Q-Q の隣接利益を確定する。|P|≤|Q| なら全 P subset に対し −ΣD_P+ΣD_{隣接Q} を評価し、逆なら Q-mask DP で各 P の選択とその隣接 mask の OR を遷移する。最大増分を基準へ足す。

## 典型の発動条件

### 最後の乱択による確率のリセット

発動条件: 独立な確率1/2の反転を同じ対象へ複数回適用するとき。

最後に対象へ触る試行で parity が一様になるため、回数でなく一度でも触るかだけを見る。

### 二分割の小さい側を指数化

発動条件: 要素が利得側と損失側へ分かれ、全体 N は40程度のとき。

min(|P|,|Q|) の側に応じて subset 列挙と mask DP を切り替える。

## 問題固有の要素

確率過程が最終的に weighted vertex coverage へ落ち、機械の順序・重複が消えることが最大の簡約である。

別の問題へ持ち帰る視点: 確率1/2の反転を見たら parity 分布が最終試行で一様化しないか調べ、選択問題へ分離する。

## 正当性

P-P 辺は損だけなので不要、Q-Q 辺は利益だけなので採用してよい。P-Q 辺では触る P 集合を固定すれば、その P に隣接する全 Q を触るのが最適になる。 P が小さければその subset を直接評価し、Q が小さければ P を順に採否して現在覆われた Q-mask を持つ DP にする。 機械選択は「触れた頂点集合」の重み付き被覆へ帰着し、P∪Q=N より min(|P|,|Q|)≤20 を必ず利用できる。

## 実装上の注意

- 期待値の 1/2 は double で扱うか全値を2倍して最後に割る。X=Y の確定反転を確率1/2扱いせず、処理後の表裏を基準に P,Q を作る。

## 復習の核

- まず固定した機械集合の期待値をカード単位で完全に解く。最適化へ進むのは、各カードが「未接触/一様」の二状態になることを証明してからにする。

## 計算量と制約

### 時間

O(N²2^min(P,Q))、P,Qは有利/不利カード集合の小さい側mask。

### 空間

O(N²+2^min(P,Q))。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 40; 1\leq M \leq 10^5; 1\leq A_i,B_i \leq 10^4; 1\leq X_j,Y_j \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

利益重みDのP頂点p=2、Q頂点q=5、辺p-q。

1. Pを触らなければ増分0。
2. Pを触ると−2+5=3。

期待される結果: 最適増分3。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

pに繋がるQを一部だけ触る意味はあるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

Pを触る費用は固定で、Qは触るほど利益なので繋がる全Qを触る方が最適。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/editorial/6902) — source-abc313-editorial-6902-6d3c247afee2f117aee815d0cbeb6a571934752c6bdc476c7d3c035f4d3178c6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/tasks/abc313_f) — source-abc313-f-problem-00388b1b978884ab084a0d18e374bfd1d5a20819c1e12e48215b2f8ccd687a60
