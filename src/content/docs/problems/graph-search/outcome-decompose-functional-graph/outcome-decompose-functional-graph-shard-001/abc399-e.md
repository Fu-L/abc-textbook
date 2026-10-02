---
title: "ABC399-E — Replace"
draft: true
authoringUnit: {"problemId":"abc399-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc399-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc399-e-problem-1d4ea03ba95452a9e586d2815b0d5f1cd2e42e692a526f490d5ea576b453bab2","source-abc399-editorial-12564-6e1510563de5279b95e284c4e0c13c4772bcba726ff97494a39c00e3e1e5b0f4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"元同字はglobal replaceで分離不能なので対応矛盾は不可能。非identity sourceには少なくとも一回操作が要り、純非自明cycleには退避一回が追加で必要。tree部分はtarget側から一回ずつ安全に処理でき、空き文字を使ったcycle回転も下界を達成する。全26字の非identity置換で空きがないと最初のmergeが異目的字を不可逆に混ぜるため不可能。","sourceRevisionIds":["source-abc399-e-problem-1d4ea03ba95452a9e586d2815b0d5f1cd2e42e692a526f490d5ea576b453bab2","source-abc399-editorial-12564-6e1510563de5279b95e284c4e0c13c4772bcba726ff97494a39c00e3e1e5b0f4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-functional-graph"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=ab,T=ba、文字cは空き。","procedure":["a→cでcb。","b→aでca。","c→bでba。"],"executionTarget":null,"expectedResult":"最小3操作","verificationStatus":"not_applicable","learningUnitIds":["unit-functional-graph-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-functional-graph"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"S=aa,T=abなら空き字があれば可能か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可能。元の二つのaは常に同字なので別targetに分離できない。"},"answer":{"reasoningOrVerification":"不可能。元の二つのaは常に同字なので別targetに分離できない。","procedure":["具体例の各状態・寄与を再計算する。","不可能。元の二つのaは常に同字なので別targetに分離できない。"],"expectedResult":"不可能。元の二つのaは常に同字なので別targetに分離できない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

同じsource文字がTで二種類へ対応するなら、global replace後も元々同じ文字を分離できないため即不可能である。対応が一意なら26文字のfunctional digraph x→target(x)で操作を考えられる。 異なるtargetを持つ文字群を一度mergeすると二度と分離できない。非自明な純cycleはそのまま回せず一時退避文字が一つ必要で、退避先が全26文字の置換cycleで埋まっていれば不可能になる。 最小下界としてx≠f(x)の各source文字は少なくとも一回操作される。長さ≥2の純cycleはこれに加えてcycle外へ一回逃がす必要がある。 mappingが26文字全体のpermutationかつS≠Tなら空き文字がなく、最初の操作で異目的tokenをmergeしてしまうため不可能である。

採用する候補: 文字対応graphをcomponent/cycle分類し、非identity edge数と純非自明cycle数から最小操作数を求める

tree部分はtarget側から安全な順に各edge一回で処理でき、純cycleだけ一回の退避が追加で必要という下界を具体操作で達成できる。

棄却する候補: S全体をstateとしてBFSでreplace操作を探索する

文字列長2×10^5でstate数が膨大であり、操作効果は26文字の対応だけで決まる。

最小下界としてx≠f(x)の各source文字は少なくとも一回操作される。長さ≥2の純cycleはこれに加えてcycle外へ一回逃がす必要がある。

mappingが26文字全体のpermutationかつS≠Tなら空き文字がなく、最初の操作で異目的tokenをmergeしてしまうため不可能である。

Sを走査して各sourceのtargetを確定し矛盾なら-1。26頂点graphの非identity source数を数え、undirected componentごとにsize≥2かつ全頂点indegree=outdegree=1の純cycle数を数える。空きがない不可能caseを除き両者の和を出す。

## 典型の発動条件

### global置換のfunctional graph化

発動条件: 同じsymbol全出現を一括変換しtargetが固定されるとき。

symbol間mappingだけを26頂点graphとして扱う。

### cycle breaking with temporary symbol

発動条件: in-place rename dependencyにcycleがあり、値を失わず回したいとき。

未使用symbolへ一要素を退避してcycleを開く。

## 問題固有の要素

cycleにtreeが付くcomponentではtree処理が空き位置を生むため追加退避が不要で、追加costが必要なのは全頂点がcycle tokenで塞がる純cycleだけである。

別の問題へ持ち帰る視点: 一括rename問題は依存graphのDAG部分とcycle部分を分け、temporary labelの有無を調べる。

## 正当性

元同字はglobal replaceで分離不能なので対応矛盾は不可能。非identity sourceには少なくとも一回操作が要り、純非自明cycleには退避一回が追加で必要。tree部分はtarget側から一回ずつ安全に処理でき、空き文字を使ったcycle回転も下界を達成する。全26字の非identity置換で空きがないと最初のmergeが異目的字を不可逆に混ぜるため不可能。

## 実装上の注意

- self-loop x→xは操作不要かつ追加cycle costなし。Sに現れない文字も空き候補で、mapping conflict判定を先に行う。

## 復習の核

- alphabetを3～5文字へ縮め全操作BFSし、chain、純2/3-cycle、cycleへtreeが入るcase、全alphabet permutationを式と比較する。

## 計算量と制約

### 時間

文字列長 N、文字種数 C=26。対応確認O(N)、cycle検出O(C)。

### 空間

対応・次数・visitedで O(C)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; N is an integer.; Each of S and T is a string of length N, consisting of lowercase English letters.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=ab,T=ba、文字cは空き。

1. a→cでcb。
2. b→aでca。
3. c→bでba。

期待される結果: 最小3操作

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=aa,T=abなら空き字があれば可能か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可能。元の二つのaは常に同字なので別targetに分離できない。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/tasks/abc399_e) — source-abc399-e-problem-1d4ea03ba95452a9e586d2815b0d5f1cd2e42e692a526f490d5ea576b453bab2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/editorial/12564) — source-abc399-editorial-12564-6e1510563de5279b95e284c4e0c13c4772bcba726ff97494a39c00e3e1e5b0f4
