---
title: "ABC359-G — Sum of Tree Distance"
draft: true
authoringUnit: {"problemId":"abc359-g","docPath":"src/content/docs/problems/graph-search/outcome-build-balanced-separator-decomposition/outcome-build-balanced-separator-decomposition-shard-001/abc359-g.md","learningOutcomeIds":["outcome-build-balanced-separator-decomposition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-contribution-reordering"],"excludedTopics":["LCA・HLDによる固定木上パスの区間分解。"],"tagIds":["tag-tree-balanced-separator","tag-contribution-reordering"],"sourceRevisionIds":["source-abc359-editorial-10255-fa04795b52dc53305443c6a4e796293ae03ceecf0d2aae499b55cdd328735db6","source-abc359-g-problem-8807cff19735b7bad644485d89225be83901ac5aa78ee97ba0357f51da0c4dbc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各同色対は重心分解で初めて異なる子成分へ分かれる段、または重心が一端になる段に一度だけ属する。その段では距離が両端深さの和で、同子成分を引く集計はまさに重心経由の対だけを残す。残る同子対を再帰で数えれば全対の距離を重複なく合計できる。","sourceRevisionIds":["source-abc359-editorial-10255-fa04795b52dc53305443c6a4e796293ae03ceecf0d2aae499b55cdd328735db6","source-abc359-g-problem-8807cff19735b7bad644485d89225be83901ac5aa78ee97ba0357f51da0c4dbc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-build-balanced-separator-decomposition"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3、ラベル(8,1,8)。","procedure":["重心2で色8の頂点1,3は別方向。","深さ1+1で寄与2。","他に同色対はない。"],"executionTarget":null,"expectedResult":"2","verificationStatus":"not_applicable","learningUnitIds":["unit-tree-balanced-separators"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-build-balanced-separator-decomposition"],"prerequisiteIds":["unit-contribution-reordering"],"attainmentCondition":"全段でラベル値域全体を初期化すると線形集計になるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ならない。値域 U を毎成分走査すると成分数分の O(NU) が生じ得る。訪れたラベルだけ消去する。"},"answer":{"reasoningOrVerification":"ならない。値域 U を毎成分走査すると成分数分の O(NU) が生じ得る。訪れたラベルだけ消去する。","procedure":["具体例の各状態・寄与を再計算する。","ならない。値域 U を毎成分走査すると成分数分の O(NU) が生じ得る。訪れたラベルだけ消去する。"],"expectedResult":"ならない。値域 U を毎成分走査すると成分数分の O(NU) が生じ得る。訪れたラベルだけ消去する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [木の均衡分離点から重心分解へ進む](src/content/docs/learn/tree/tree-balanced-separators.md)

- 各連結成分の重心を選び、除去後の成分サイズが半分以下になる再帰分解木を構成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

対象外:

- LCA・HLDによる固定木上パスの区間分解。

## 考察

求めるのは同じラベルAを持つ頂点pairの距離総和である。各pathを辺ごとの寄与へ分ければ、ある分離をまたぐ同色pair数を数える問題になる。 重心を通るpairに限定すると、頂点vから重心までのpathは、同色頂点の全個数からvと同じ重心子部分木内の個数を引いた回数だけ使われる。 重心自身を端点とするpairは、同色頂点の重心からの深さの和として直接加える。 非重心頂点vの重心向き辺は、同色の全頂点数−同じ子部分木内の同色数だけ同色pathに含まれ、各辺単位の加算で距離になる。

採用する候補: 重心分解し、各段でラベル別の全体個数と子部分木別個数から重心を通る同色pairの距離寄与を数える。

各pairは、その両端が初めて別部分木へ分かれる重心段で一度だけ集計される。

棄却する候補: ラベルごとに頂点を列挙し、全pairへLCA距離を足す。

一つのラベルが全頂点に付く場合にpair数自体が巨大で、距離照会を高速化しても列挙できない。

重心自身を端点とするpairは、同色頂点の重心からの深さの和として直接加える。

非重心頂点vの重心向き辺は、同色の全頂点数−同じ子部分木内の同色数だけ同色pathに含まれ、各辺単位の加算で距離になる。

現在成分の重心cを求め、DFSで各頂点のラベル、深さ、所属するcの子部分木を集める。ラベル別全数・深さ和からcを端点とする寄与と異なる子部分木間の寄与を加え、子部分木内だけの寄与を差し引く。cを除いた各成分へ再帰する。

## 典型の発動条件

### 重心分解

発動条件: 木上の多数のpair量を、ある中心を通るpathごとに分割して数えるとき。

各段で重心を通るpairのみを集計し、残りを独立な子成分へ送る。

### 全体集計から同一groupを除く

発動条件: 異なる部分木に属する同属性pairを数えたいとき。

ラベル別全体count・sumから、処理中の子部分木の同ラベル集計を差し引く。

## 問題固有の要素

距離をpairごとに測る代わりに、重心へ向かう各path segmentが何組に使われるかを数えると積の集計へ落ちる。

別の問題へ持ち帰る視点: pair距離総和では「pairを列挙」ではなく「辺または中心への距離の利用回数」を数える。

## 正当性

各同色対は重心分解で初めて異なる子成分へ分かれる段、または重心が一端になる段に一度だけ属する。その段では距離が両端深さの和で、同子成分を引く集計はまさに重心経由の対だけを残す。残る同子対を再帰で数えれば全対の距離を重複なく合計できる。

## 実装上の注意

- 同じ重心子部分木内のpairをこの段で混ぜない。ラベル配列を毎段全初期化せず、訪れたラベルだけ消去するなど総作業量を守る。

## 復習の核

- 各pairがどの重心段で一度だけ数えられるかを先に説明する。実装では全体寄与と子部分木内の除外寄与を別関数にすると二重計上を追いやすい。

## 計算量と制約

### 時間

N 頂点。各重心段の DFS 集計が線形なら O(N log N)。ラベルを balanced map で集計する場合 O(N log²N)。

### 空間

木、重心情報、現在成分のラベル集計で O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq u_i, v_i \leq N; 1 \leq A_i \leq N; The input graph is a tree.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3、ラベル(8,1,8)。

1. 重心2で色8の頂点1,3は別方向。
2. 深さ1+1で寄与2。
3. 他に同色対はない。

期待される結果: 2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

全段でラベル値域全体を初期化すると線形集計になるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ならない。値域 U を毎成分走査すると成分数分の O(NU) が生じ得る。訪れたラベルだけ消去する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/editorial/10255) — source-abc359-editorial-10255-fa04795b52dc53305443c6a4e796293ae03ceecf0d2aae499b55cdd328735db6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc359/tasks/abc359_g) — source-abc359-g-problem-8807cff19735b7bad644485d89225be83901ac5aa78ee97ba0357f51da0c4dbc
