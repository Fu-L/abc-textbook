---
title: "ABC261-G — Replace"
draft: true
authoringUnit: {"problemId":"abc261-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc261-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design","unit-weighted-shortest-path"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp","tag-shortest-path"],"sourceRevisionIds":["source-abc261-g-problem-0e5d0c930bef53a488260b0e2bb3c4f1c2968f47cc67199c76db0817dba4c1c6","source-abc261-editorial-4485-4cefe1ace6da40af088fda7c27b22f6e03cb33ebdaa3a218c83ec7695afd13aa"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"単一文字から目標区間を導く最小費用を状態とする。長さ2以上の右辺を使う最後の規則を固定すると、右辺各文字の導く区間は左からの非空分割になり、各区間の最適費用を足すことができる。一文字規則だけは区間長を変えないので、文字間の最短路閉包を先に取る。これにより長さが減る部分問題と閉包済みの同長変換だけになり、区間長の帰納法で全導出を覆える。最後に開始文字列側の区間分割を行えば、各開始文字の独立な導出を結合できる。","sourceRevisionIds":["source-abc261-g-problem-0e5d0c930bef53a488260b0e2bb3c4f1c2968f47cc67199c76db0817dba4c1c6","source-abc261-editorial-4485-4cefe1ace6da40af088fda7c27b22f6e03cb33ebdaa3a218c83ec7695afd13aa"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-interval-split-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=a,T=bc、規則a→bc。","procedure":["b,cはそれぞれ目標一文字に一致する基底cost0。","規則一回で二子区間を結びaからbcへ。"],"executionTarget":null,"expectedResult":"最小置換回数1。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-interval-composition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-interval-split-dp"],"prerequisiteIds":["unit-dp-state-design","unit-weighted-shortest-path"],"attainmentCondition":"a→d,d→aという循環規則を長さ順だけで解けるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同長区間内で循環するのでunit-production最短路閉包へ分離する。multichar規則だけが短い区間に依存する。"},"answer":{"reasoningOrVerification":"同長区間内で循環するのでunit-production最短路閉包へ分離する。multichar規則だけが短い区間に依存する。","procedure":["具体例の各状態・寄与を再計算する。","同長区間内で循環するのでunit-production最短路閉包へ分離する。multichar規則だけが短い区間に依存する。"],"expectedResult":"同長区間内で循環するのでunit-production最短路閉包へ分離する。multichar規則だけが短い区間に依存する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [最短路モデル](src/content/docs/learn/graph/weighted-shortest-path.md)

対象外:

- 区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

各操作は一文字を空でない文字列へ置換するため、一つの元文字から最終的に生じる文字は T の連続部分文字列を占める。

右辺 A_k の各文字が作る部分文字列を順に連結すれば、規則 C_k→A_k 一回と各部分の導出コストから C_k の導出コストを作れる。

棄却する候補: 現在文字列を頂点として BFS し、全置換位置・規則を辺として T までの最短路を探す。

途中文字列の種類が爆発し、長さ50でも状態空間を列挙できない。

採用する候補: dp[l][r][c] を文字 c から T[l..r] を作る最小費用とし、各規則右辺を区間分割 DP で合成し、同じ区間内の一文字規則閉包を Dijkstra 法で解く。

長さ二以上の右辺は厳密に短い部分区間へ分かれ、循環し得る一文字置換だけを26文字の最短路として分離できる。

A_k の先頭 h 文字から T[l..r] を作る補助 DP は、最後の文字が作る suffix の切れ目 m を全探索して prefix と dp[m+1][r][A_k[h]] を足す。

一文字規則 c→d は dp[d] から dp[c] への重み1の辺なので、多文字規則候補と一致基底を仮想始点距離にして逆向き文字グラフを走れば閉包が得られる。

single-symbol rewriting を weighted context-free derivation とみなし、CYK 型 interval parsing に unit-production closure の shortest paths を組み込む。

## 典型の発動条件

### 文字列導出の区間 DP

発動条件: 元の各記号が目標文字列の連続区間を生成し、生成列の連結順序が保存されるとき。

記号と目標区間を状態にし、規則右辺の各記号へ区間を非空分割して費用を合成する。

### unit production の最短路閉包

発動条件: 同じサイズの DP 状態間を単項規則が循環させる一方、他の規則候補は既に計算済みのとき。

単項規則を有向重み辺、既知候補を多点始点距離として Dijkstra 法を行う。

## 問題固有の要素

置換右辺は空でないため、長さ二以上の右辺を使う導出では各文字が T の非空部分を担当し、依存区間が必ず短くなる。

別の問題へ持ち帰る視点: 文法的 DP の計算順は、再帰規則が状態サイズを厳密に減らす部分と同サイズ循環を作る部分を分離して決める。

## 正当性

単一文字から目標区間を導く最小費用を状態とする。長さ2以上の右辺を使う最後の規則を固定すると、右辺各文字の導く区間は左からの非空分割になり、各区間の最適費用を足すことができる。一文字規則だけは区間長を変えないので、文字間の最短路閉包を先に取る。これにより長さが減る部分問題と閉包済みの同長変換だけになり、区間長の帰納法で全導出を覆える。最後に開始文字列側の区間分割を行えば、各開始文字の独立な導出を結合できる。

## 実装上の注意

- 基底は l=r かつ T_l=c のとき費用0であり、規則を一回使う候補には必ず +1 する。
- 区間長の短い順に、多文字右辺の分割候補、文字グラフの閉包、右辺prefix補助状態の順で依存を満たして更新する。
- 最後は S を右辺とする費用0の仮想規則、または同じ連結分割 DP で T 全体への費用を求め、INF なら −1 を出す。

## 復習の核

- 文字列書換えを状態探索する前に、各元記号が最終文字列のどの連続区間を生成するかという導出木へ視点を移す。
- DP内の循環依存が単項遷移だけに閉じているなら、その層を最短路閉包として別処理する。

## 計算量と制約

### 時間

O(KAT³+26³T²+ST²)、T=目標長、S=元長、A=最大規則右辺長。補助prefix分割とunit閉包の上界。

### 空間

O((26+KA)T²)、区間導出表と規則補助DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq |S|\leq |T|\leq 50; 1\leq K\leq 50; C_i is a, b,\ldots, or z.; 1\leq |A_i|\leq 50; S, T, and A_i are strings consisting of lowercase English letters.; C_i\neq A_i, regarding C_i as a string of length 1.; All pairs (C_i,A_i) are distinct.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=a,T=bc、規則a→bc。

1. b,cはそれぞれ目標一文字に一致する基底cost0。
2. 規則一回で二子区間を結びaからbcへ。

期待される結果: 最小置換回数1。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

a→d,d→aという循環規則を長さ順だけで解けるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同長区間内で循環するのでunit-production最短路閉包へ分離する。multichar規則だけが短い区間に依存する。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/tasks/abc261_g) — source-abc261-g-problem-0e5d0c930bef53a488260b0e2bb3c4f1c2968f47cc67199c76db0817dba4c1c6
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc261/editorial/4485) — source-abc261-editorial-4485-4cefe1ace6da40af088fda7c27b22f6e03cb33ebdaa3a218c83ec7695afd13aa
