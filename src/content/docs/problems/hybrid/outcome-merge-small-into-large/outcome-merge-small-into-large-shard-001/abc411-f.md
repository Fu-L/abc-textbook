---
title: "ABC411-F — Contraction"
draft: true
authoringUnit: {"problemId":"abc411-f","docPath":"src/content/docs/problems/hybrid/outcome-merge-small-into-large/outcome-merge-small-into-large-shard-001/abc411-f.md","learningOutcomeIds":["outcome-merge-small-into-large"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-small-to-large"],"sourceRevisionIds":["source-abc411-editorial-13352-24414b95e191333600ef218f42e431b030f1889e668266e9d9aa1cd5427fadfd","source-abc411-f-problem-38a6798404784b29dd54b04580ef69603ae80d15fd424efd9b3051dce89dfecf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"頂点rの重みを「所属する駒数+現在次数」とし、軽い側sを重い側bへ移す。自己loop・重複辺を削除しない仮想過程では移動後の所属重みが少なくとも2倍になり、各駒・辺の移動はO(log(N+M))回である。実際の単純化は走査対象を減らすだけで、残す端点が変わっても縮約後状態は同じなので、この上界を超えない。 s-x辺は必ず消えるので辺数を1減らし、x=bなら自己loopとして終了し、x≠bかつb-xが未存在のときだけ新しい辺を追加して1戻す。この局所更新で多重辺の単純化を正確に反映できる。 移す駒と隣接辺だけを走査し、隣接setで自己loop・多重辺を除ける。小さい側を選ぶことで各対象の所属規模が倍増し、全更新量を対数回へ償却できる。","sourceRevisionIds":["source-abc411-editorial-13352-24414b95e191333600ef218f42e431b030f1889e668266e9d9aa1cd5427fadfd","source-abc411-f-problem-38a6798404784b29dd54b04580ef69603ae80d15fd424efd9b3051dce89dfecf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-merge-small-into-large"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"triangle1-2-3-1で頂点1,2を縮約。","procedure":["辺12はloopとして消える。","辺13と23は重複するので一本になる。"],"executionTarget":null,"expectedResult":"縮約後の辺数1。","verificationStatus":"not_applicable","learningUnitIds":["unit-small-to-large"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-merge-small-into-large"],"prerequisiteIds":[],"attainmentCondition":"所属駒数だけで移動側を選んでよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"次数が大きい側を繰り返し走査し得る。駒数と隣接数の両方を課金可能な重みに含める。"},"answer":{"reasoningOrVerification":"次数が大きい側を繰り返し走査し得る。駒数と隣接数の両方を課金可能な重みに含める。","procedure":["具体例の各状態・寄与を再計算する。","次数が大きい側を繰り返し走査し得る。駒数と隣接数の両方を課金可能な重みに含める。"],"expectedResult":"次数が大きい側を繰り返し走査し得る。駒数と隣接数の両方を課金可能な重みに含める。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

queryが指す元の辺(u,v)は、駒u,vが別の縮約頂点にある限り、その辺の像として現在も両頂点を結ぶ。したがって縮約可否は駒u,vの所属頂点が同じかだけで判定でき、難所は単純化後の隣接集合と辺数の更新である。

採用する候補: 駒数と次数の和が小さい縮約頂点を大きい側へsmall-to-large mergeする

移す駒と隣接辺だけを走査し、隣接setで自己loop・多重辺を除ける。小さい側を選ぶことで各対象の所属規模が倍増し、全更新量を対数回へ償却できる。

棄却する候補: DSUだけで縮約成分を管理する

駒の同一成分判定はできるが、縮約で重複する辺を数えて現在の単純グラフの辺数を更新するには、成分ごとの隣接集合も必要になる。

棄却する候補: 縮約のたびに全頂点・全辺から現在グラフを再構築する

一回O(N+M)、全体O(Q(N+M))となり、N,M,Q≤3×10^5では不可能である。

頂点rの重みを「所属する駒数+現在次数」とし、軽い側sを重い側bへ移す。自己loop・重複辺を削除しない仮想過程では移動後の所属重みが少なくとも2倍になり、各駒・辺の移動はO(log(N+M))回である。実際の単純化は走査対象を減らすだけで、残す端点が変わっても縮約後状態は同じなので、この上界を超えない。

s-x辺は必ず消えるので辺数を1減らし、x=bなら自己loopとして終了し、x≠bかつb-xが未存在のときだけ新しい辺を追加して1戻す。この局所更新で多重辺の単純化を正確に反映できる。

各現在頂点に駒一覧と順序付き隣接setを持ち、各駒から所属頂点への写像も持つ。query端点の所属が異なれば重みの小さい側を選び、その全駒の写像を更新し、全隣接先から旧辺を削除して必要な新辺だけ大側との間へ挿入する。辺数を各削除・挿入に同期させて出力する。

## 典型の発動条件

### small-to-large merge

発動条件: 集合を破壊的に併合し、要素一個の移動・挿入を対数時間で処理できる。

駒数と次数の合計が小さい縮約頂点だけを走査し、移動回数を所属規模の倍増へ課金する。

### 隣接setによる動的単純グラフ

発動条件: 頂点併合時に自己loopを捨て、多重辺の存在判定をしながら単純辺数を保ちたい。

両端のsetを同期して旧辺を消し、未存在の新辺だけを挿入する。

## 問題固有の要素

query対象が元グラフの辺に限定されるため、その端点の駒が別成分なら現在グラフでも必ず隣接し、動的な辺存在判定を縮約可否に使う必要がない。

別の問題へ持ち帰る視点: 縮約後の構造を追う問題では、元の辺や関係が商構造へどう写るかを先に確認し、判定用状態と更新用状態を分離する。

## 正当性

頂点rの重みを「所属する駒数+現在次数」とし、軽い側sを重い側bへ移す。自己loop・重複辺を削除しない仮想過程では移動後の所属重みが少なくとも2倍になり、各駒・辺の移動はO(log(N+M))回である。実際の単純化は走査対象を減らすだけで、残す端点が変わっても縮約後状態は同じなので、この上界を超えない。 s-x辺は必ず消えるので辺数を1減らし、x=bなら自己loopとして終了し、x≠bかつb-xが未存在のときだけ新しい辺を追加して1戻す。この局所更新で多重辺の単純化を正確に反映できる。 移す駒と隣接辺だけを走査し、隣接setで自己loop・多重辺を除ける。小さい側を選ぶことで各対象の所属規模が倍増し、全更新量を対数回へ償却できる。

## 実装上の注意

- 隣接setは両端で必ず同期し、走査中のsmall側setを直接壊さない。small-big辺を自己loopとして除き、共通隣接先では新辺を二重加算しない。駒写像の更新完了後にsmall側の容器を空にする。

## 復習の核

- 小グラフの愚直な縮約シミュレータと比較し、同じ辺queryの反復、一本辺、三角形で共通隣接辺が重複する場合、星と鎖、small側がqueryごとに入れ替わる場合を検査する。

## 計算量と制約

### 時間

O((N+M)log²(N+M)+Q)、駒数+次数の小さい側を平衡隣接setで縮約。

### 空間

O(N+M+Q)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq 3\times 10^5; 1\leq M\leq 3\times 10^5; 1\leq U_i<V_i\leq N; (U_i,V_i)\neq (U_j,V_j) if i\neq j.; 1\leq Q\leq 3\times 10^5; 1\leq X_i\leq M; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

triangle1-2-3-1で頂点1,2を縮約。

1. 辺12はloopとして消える。
2. 辺13と23は重複するので一本になる。

期待される結果: 縮約後の辺数1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

所属駒数だけで移動側を選んでよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

次数が大きい側を繰り返し走査し得る。駒数と隣接数の両方を課金可能な重みに含める。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/editorial/13352) — source-abc411-editorial-13352-24414b95e191333600ef218f42e431b030f1889e668266e9d9aa1cd5427fadfd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/tasks/abc411_f) — source-abc411-f-problem-38a6798404784b29dd54b04580ef69603ae80d15fd424efd9b3051dce89dfecf
