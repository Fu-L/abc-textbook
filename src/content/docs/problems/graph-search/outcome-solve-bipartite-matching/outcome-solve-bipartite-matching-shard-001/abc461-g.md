---
title: "ABC461-G — Graph Problem 2026"
draft: true
authoringUnit: {"problemId":"abc461-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc461-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall"],"sourceRevisionIds":["source-abc461-editorial-21377-bbe98f1e54d9c585f40389632ac677594e1da1c10d52b8a5b2a5da2003b296d7","source-abc461-g-problem-f09b23c77850cb0ca1d774e0b16ef71739d269ecadb9a8cad130373c532e2a94"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"copy独立集合からW_i=1013(f(A_i)+f(B_i))を作ると各元辺の二cross不等式の和がW_u+W_v≤2026を保証する。元LPのedge制約は半整数最適点を持ち、scale2026で0,1013,2026解へ丸められるため逆にcopy独立選択へ対応する上界も成立する。Königで2N−μを求める。","sourceRevisionIds":["source-abc461-editorial-21377-bbe98f1e54d9c585f40389632ac677594e1da1c10d52b8a5b2a5da2003b296d7","source-abc461-g-problem-f09b23c77850cb0ca1d774e0b16ef71739d269ecadb9a8cad130373c532e2a94"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-solve-bipartite-matching"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"元graph三角形。","procedure":["各辺和≤2026を三つ足すと2ΣW≤6078、ΣW≤3039。","全W=1013で達成。","二層graphは6cycle、matching3、MIS3。"],"executionTarget":null,"expectedResult":"3039","verificationStatus":"not_applicable","learningUnitIds":["unit-bipartite-matching"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-solve-bipartite-matching"],"prerequisiteIds":["unit-bipartite-structure"],"attainmentCondition":"元graphが非二部だからmatching帰着も非二部か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"違う。A/B copyのcross辺だけを張ることで必ず二部graphになる。"},"answer":{"reasoningOrVerification":"違う。A/B copyのcross辺だけを張ることで必ず二部graphになる。","procedure":["具体例の各状態・寄与を再計算する。","違う。A/B copyのcross辺だけを張ることで必ず二部graphになる。"],"expectedResult":"違う。A/B copyのcross辺だけを張ることで必ず二部graphになる。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md)

対象外:

- 二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各元頂点vをA_v,B_vの二頂点に複製し、元辺(u,v)ごとにA_u-B_vとA_v-B_uを結ぶと明らかな二部graphになる。元の重み最適化はこのgraphの最大独立集合sizeに一致する。 A側とB側のcross edgeは元辺の両向きを表し、独立集合なら f(A_u)+f(B_v) と f(A_v)+f(B_u) が各1以下になる。 二部graphの最大独立集合は頂点数-最小頂点被覆=頂点数-最大matchingで求められる。

採用する候補: 構成した2N頂点二部graphで最大matchingを求め、|MIS|=2N-|matching| を用いて答えを1013×|MIS|とする。

MIS indicatorから W_i=1013(f(A_i)+f(B_i)) と置けば全辺制約を満たす下界が構成でき、最小辺被覆またはLP半整数性からそれ以上の総和は不可能と示せる。

棄却する候補: 各W_iを0..2026で探索し、全辺のW_u+W_v≤2026を検査する。

2027^N通りの割当があり、線形制約だけを直接整数探索できない。

A側とB側のcross edgeは元辺の両向きを表し、独立集合なら f(A_u)+f(B_v) と f(A_v)+f(B_u) が各1以下になる。

二部graphの最大独立集合は頂点数-最小頂点被覆=頂点数-最大matchingで求められる。

A_vを左部、B_vを右部として2N頂点を作り、各元辺に二本のcross edgeを追加する。Hopcroft-Karpまたはunit-capacity max-flowで最大matching μを求め、1013×(2N-μ)を出力する。

## 典型の発動条件

### 変数の二層複製による二部化

発動条件: 各元辺に対称な二つの組合せ制約がある重み割当問題のとき。

各変数をA/B copyに分けcross制約をedgeとして表す。

### 二部graphの最大独立集合

発動条件: 0/1選択でedge両端同時選択を禁止し総数を最大化するとき。

Königの定理で最大matchingの補数として求める。

## 問題固有の要素

連続に見えるvertex weight最適化も半整数性を示すと0/1 copy選択へ変換できる。

別の問題へ持ち帰る視点: 対称なedge制約は変数を二copyにしてcross edgeを張ると二部MISとして現れることがある。

## 正当性

copy独立集合からW_i=1013(f(A_i)+f(B_i))を作ると各元辺の二cross不等式の和がW_u+W_v≤2026を保証する。元LPのedge制約は半整数最適点を持ち、scale2026で0,1013,2026解へ丸められるため逆にcopy独立選択へ対応する上界も成立する。Königで2N−μを求める。

## 実装上の注意

- 元無向辺ごとにcross edgeを二方向分とも追加し、同じ元頂点のA_v-B_v辺は不要である。答え係数1013とMIS頂点数を混同しない。

## 復習の核

- MISからW割当を作る下界と、なぜ上界も1013|MIS|になるかをedge coverまたはhalf-integralityのどちらかで再証明する。

## 計算量と制約

### 時間

元N頂点M辺。二層2N頂点2M辺、Hopcroft–Karp O(M√N+N)。

### 空間

二層adjacencyとmatching O(N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 5 \times 10^4; 0 \leq M \leq 5 \times 10^4; 1 \leq u_i \lt v_i \leq N; (u_1,v_1),(u_2,v_2),\dots,(u_M,v_M) are pairwise distinct.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

元graph三角形。

1. 各辺和≤2026を三つ足すと2ΣW≤6078、ΣW≤3039。
2. 全W=1013で達成。
3. 二層graphは6cycle、matching3、MIS3。

期待される結果: 3039

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

元graphが非二部だからmatching帰着も非二部か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

違う。A/B copyのcross辺だけを張ることで必ず二部graphになる。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/editorial/21377) — source-abc461-editorial-21377-bbe98f1e54d9c585f40389632ac677594e1da1c10d52b8a5b2a5da2003b296d7
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc461/tasks/abc461_g) — source-abc461-g-problem-f09b23c77850cb0ca1d774e0b16ef71739d269ecadb9a8cad130373c532e2a94
