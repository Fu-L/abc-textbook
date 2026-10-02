---
title: "ABC337-G — Tree Inversion"
draft: true
authoringUnit: {"problemId":"abc337-g","docPath":"src/content/docs/problems/graph-search/outcome-flatten-tree-by-euler-order/outcome-flatten-tree-by-euler-order-shard-001/abc337-g.md","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-event-sweep","unit-weighted-prefix-fenwick"],"excludedTopics":["Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-tree-euler-flattening","tag-event-sweep","tag-fenwick-weighted-prefix"],"sourceRevisionIds":["source-abc337-editorial-9128-cbe0bd941506e286fb57dadf72d10bcbdf8ee413c5cf00a8d08e9186e3731f52","source-abc337-g-problem-c93d5e000c3d22efaf05c107e0398fe3076143c17dd8518cc30a3383278210cd"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"pair(v,w),v<wが寄与するroot uは、u=wなら必ず寄与し、u≠wならw削除後にvと異なる成分にいることが必要十分。各wの自己root寄与w−1を先に入れる。残りは固定rootのchild subtreeかその補集合への範囲加算となり、各方向の小label数をoffline BITで数えられる。木imosでこれら領域の全寄与を合算すると元の全pairを正確に数える。","sourceRevisionIds":["source-abc337-editorial-9128-cbe0bd941506e286fb57dadf72d10bcbdf8ee413c5cf00a8d08e9186e3731f52","source-abc337-g-problem-c93d5e000c3d22efaf05c107e0398fe3076143c17dd8518cc30a3383278210cd"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"道1–2–3。root2で各頂点から根へのpathを考える。","procedure":["path1→2はlabel増加でpair(1,2)が一寄与。","path3→2は増加pairなし。","root2自身は空path。"],"executionTarget":null,"expectedResult":"root2のf=1","verificationStatus":"not_applicable","learningUnitIds":["unit-tree-euler-flattening"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-flatten-tree-by-euler-order"],"prerequisiteIds":["unit-event-sweep","unit-weighted-prefix-fenwick"],"attainmentCondition":"u=wの場合、w削除後の異成分条件へそのまま入れられるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"root wの自己endpoint寄与はw−1。"},"answer":{"reasoningOrVerification":"そのままではuが消えて分類できない。公式ではendpoint w=uもpath上に含むので、root wにはv<wの全w−1個を別途加える必要がある。","procedure":["具体例の各状態・寄与を再計算する。","そのままではuが消えて分類できない。公式ではendpoint w=uもpath上に含むので、root wにはv<wの全w−1個を別途加える必要がある。"],"expectedResult":"root wの自己endpoint寄与はw−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Euler順による部分木区間化](src/content/docs/learn/tree/tree-euler-flattening.md)

- Euler tourのin/out時刻を構成し、部分木または根からのpath寄与を配列の区間へ写せる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [event順にactive集合を更新する](src/content/docs/learn/modeling/event-sweep.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- Euler順による部分木区間化の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

pair(v,w),v<wを固定する。root u=wではendpoint条件で常に寄与する。u≠wでは、wを消したときuとvが別成分なら元u–v pathにwが載る。よって各wの自己rootにw−1を置き、各方向成分の外側rootへその方向内のv<wの数を範囲加算する。固定根のEuler区間と補集合へ分解し、label昇順BITで必要個数を求め木imosで全rootへ届ける。

## 典型の発動条件

### Euler tourによるsubtree区間化

発動条件: 寄与先がsubtreeまたはその補集合で、範囲加算したい。

subtreeを連続区間へ写し、区間addと全体add-minus-subtreeで表す。

### offline二次元counting

発動条件: subtree区間内でvertex labelがthreshold未満の個数をO(N)回求めたい。

threshold順に頂点をBITへ追加し、Euler区間sumで矩形countを得る。

## 問題固有の要素

pair(v,w)をuごとに数える代わりに、wを切った時のv側componentを特定し、その補集合に属する全uへ一括加算する。

別の問題へ持ち帰る視点: path包含条件はcut vertexでcomponentを分け、寄与先集合へのrange updateへ主客転倒できる。

## 正当性

pair(v,w),v<wが寄与するroot uは、u=wなら必ず寄与し、u≠wならw削除後にvと異なる成分にいることが必要十分。各wの自己root寄与w−1を先に入れる。残りは固定rootのchild subtreeかその補集合への範囲加算となり、各方向の小label数をoffline BITで数えられる。木imosでこれら領域の全寄与を合算すると元の全pairを正確に数える。

## 実装上の注意

u=wのendpoint寄与を忘れずans[w]へw−1を足す。BITへ当前label wを登録する前にlabel<w個数をqueryする。Euler区間と補集合をrange差分へ正しく変換し、全値は64bit。

## 復習の核

- path、star、rootを跨ぐpairでN小の三重loop真値と比較し、subtree境界の半開区間とv=w除外を確認する。

## 計算量と制約

### 時間

N頂点。Euler、O(N)集約queryのBITと木imosで O(N log N)。

### 空間

木、Euler順、BIT、range差分 O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2\leq N\leq2\times10^5; 1\leq u_i\leq N\ (1\leq i\leq N); 1\leq v_i\leq N\ (1\leq i\leq N); The given graph is a tree.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

道1–2–3。root2で各頂点から根へのpathを考える。

1. path1→2はlabel増加でpair(1,2)が一寄与。
2. path3→2は増加pairなし。
3. root2自身は空path。

期待される結果: root2のf=1

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

u=wの場合、w削除後の異成分条件へそのまま入れられるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

そのままではuが消えて分類できない。公式ではendpoint w=uもpath上に含むので、root wにはv<wの全w−1個を別途加える必要がある。

確認結果: root wの自己endpoint寄与はw−1。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/editorial/9128) — source-abc337-editorial-9128-cbe0bd941506e286fb57dadf72d10bcbdf8ee413c5cf00a8d08e9186e3731f52
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc337/tasks/abc337_g) — source-abc337-g-problem-c93d5e000c3d22efaf05c107e0398fe3076143c17dd8518cc30a3383278210cd
