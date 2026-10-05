---
title: "ABC411-F — Contraction"
draft: true
authoringUnit: {"problemId":"abc411-f","docPath":"src/content/docs/problems/hybrid/outcome-merge-small-into-large/outcome-merge-small-into-large-shard-001/abc411-f.md","learningOutcomeIds":["outcome-merge-small-into-large"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["small-to-large・DSU on Treeの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-small-to-large"],"sourceRevisionIds":["source-abc411-editorial-13352-24414b95e191333600ef218f42e431b030f1889e668266e9d9aa1cd5427fadfd","source-abc411-f-problem-38a6798404784b29dd54b04580ef69603ae80d15fd424efd9b3051dce89dfecf"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"共通隣接数をcとすると、併合で消えるのはs-b辺と共通隣接先への重複辺の計c+1本で、併合後の重みは `W_b+W_s−(c+2)` である。`c+2≤W_s/2` ならこれは少なくとも `1.5W_s`。走査した小側の要素のうち残るものは重みが1.5倍以上の頂点へ移るので、O(W_s)の走査をその対数重みの増加へ課金できる。逆に `c+2>W_s/2` かつ `W_s≥4` なら `c+1>W_s/4` となり、走査を永久に消える辺へ課金できる。`W_s<4` の走査は定数時間で、成功する併合は高々N−1回。\n\n低削除の場合の課金は、駒または生きた辺ごとに `log(所属頂点の重み)` を持たせて考える。小側から残る要素は重みが1.5倍以上になるので、移動ごとにこの値が定数増える。辺削除で次数が1下がると、端点に残る全要素の値も下がるが、その総減少は1辺あたりO(log(N+M))。辺は一度しか削除されず、全要素の値も常にO(log(N+M))以下なので、次数減少が大小選択を変える影響まで含めた走査総量はO((N+M)log(N+M))に収まる。","sourceRevisionIds":["source-abc411-editorial-13352-24414b95e191333600ef218f42e431b030f1889e668266e9d9aa1cd5427fadfd","source-abc411-f-problem-38a6798404784b29dd54b04580ef69603ae80d15fd424efd9b3051dce89dfecf"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md)

- 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

## 考察

各queryの元辺(u,v)は、二つの端点が別の縮約頂点にある限りその像が残るので、縮約できるかは所属頂点だけで判定できる。難所は単純グラフ化で消える辺も含めた全体仕事量である。

軽い側sの重みを `W_s=駒数+次数`、重い側をbとし、共通隣接数をcとする。走査はO(W_s)。自己loop・重複として消える辺が多いmergeはその削除へ、少ないmergeは併合後に重みが増える移動へ走査を課金する。

各mergeで実際に走査する量をこの二種類に分ける。次数の減少で後の大小選択が変わる分も、削除辺に伴う重みの減少として償却に含める。

採用する候補: 駒数+現在次数で軽い側を選び、削除辺と重み増加に分けて償却する。

各queryで現在グラフを作り直さず、所属一覧と隣接集合だけ更新する。

棄却する候補: 削除を無視した仮想過程だけで倍増を証明する。

実際の大小選択は現在次数に依存し、重複辺削除で順位が変わる。

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

共通隣接数をcとすると、併合で消えるのはs-b辺と共通隣接先への重複辺の計c+1本で、併合後の重みは `W_b+W_s−(c+2)` である。`c+2≤W_s/2` ならこれは少なくとも `1.5W_s`。走査した小側の要素のうち残るものは重みが1.5倍以上の頂点へ移るので、O(W_s)の走査をその対数重みの増加へ課金できる。逆に `c+2>W_s/2` かつ `W_s≥4` なら `c+1>W_s/4` となり、走査を永久に消える辺へ課金できる。`W_s<4` の走査は定数時間で、成功する併合は高々N−1回。

低削除の場合の課金は、駒または生きた辺ごとに `log(所属頂点の重み)` を持たせて考える。小側から残る要素は重みが1.5倍以上になるので、移動ごとにこの値が定数増える。辺削除で次数が1下がると、端点に残る全要素の値も下がるが、その総減少は1辺あたりO(log(N+M))。辺は一度しか削除されず、全要素の値も常にO(log(N+M))以下なので、次数減少が大小選択を変える影響まで含めた走査総量はO((N+M)log(N+M))に収まる。

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

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/editorial/13352) — source-abc411-editorial-13352-24414b95e191333600ef218f42e431b030f1889e668266e9d9aa1cd5427fadfd
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc411/tasks/abc411_f) — source-abc411-f-problem-38a6798404784b29dd54b04580ef69603ae80d15fd424efd9b3051dce89dfecf
