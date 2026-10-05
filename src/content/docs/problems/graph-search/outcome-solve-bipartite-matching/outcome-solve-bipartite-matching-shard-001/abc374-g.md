---
title: "ABC374-G — Only One Product Name"
draft: true
authoringUnit: {"problemId":"abc374-g","docPath":"src/content/docs/problems/graph-search/outcome-solve-bipartite-matching/outcome-solve-bipartite-matching-shard-001/abc374-g.md","learningOutcomeIds":["outcome-solve-bipartite-matching"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-bipartite-structure","unit-scc-condensation","unit-transitive-closure"],"excludedTopics":["二部matching・Hall・Kőnigの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-bipartite-matching-hall","tag-scc-condensation","tag-transitive-closure"],"sourceRevisionIds":["source-abc374-editorial-11099-08ffa618d6266b4f574965ba7db128d0fd6d4897a29e321b44770b9f29b48990","source-abc374-g-problem-ef990b1fe81062fb5fa496062ddb53c9751bba11b379a7113f4381ffff2dda7b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"商品名walkとNG文字列は相互変換できる。SCC内では任意の入口・出口の間で全商品を訪ねられる。縮約DAGの鎖の隣接成分を元の道でつなげば、途中成分の重複を許したwalkになる。逆に全成分を覆うwalk族から各成分を一つのwalkだけへ割り当て、割当成分を出現順に抜き出すと到達関係の鎖分解になる。従って最少walk数は最少鎖分解数。到達対の二部matchingは各成分に入出辺高々一本の非循環な連結を選び、C−|M|鎖を作る。逆に鎖の隣接対はmatchingになるので、最大matchingが最少鎖数を与える。元の辺による頂点素なpath分割とは区別する。","sourceRevisionIds":["source-abc374-editorial-11099-08ffa618d6266b4f574965ba7db128d0fd6d4897a29e321b44770b9f29b48990","source-abc374-g-problem-ef990b1fe81062fb5fa496062ddb53c9751bba11b379a7113f4381ffff2dda7b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [二部matching・Hall・Kőnig](src/content/docs/learn/graph/bipartite-matching.md)

- 左右の一対一割当をaugmenting pathまたは単位容量flowで解き、Hall条件・Kőnigの定理・path coverへ接続する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [二部彩色と成分構造を扱う](src/content/docs/learn/graph/bipartite-structure.md) — 無向グラフを探索できることを前提に二部性と部の交換対称性を扱い、連結二部グラフの彩色重複も補正する。
- [SCC・縮約DAG・トポロジカル順序](src/content/docs/learn/graph/scc-condensation.md) — DAGのtopological processingで得た考え方と実装を再利用し、SCC・縮約DAG・トポロジカル順序の発動条件・正当化・境界を重複なく学ぶ。
- [推移閉包](src/content/docs/learn/graph/transitive-closure.md) — 各始点探索またはWarshallの段階不変条件により全頂点対の到達関係を計算する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

使用済み二文字名を頂点とし、後字と前字が一致する商品名間に辺を張る。NG文字列の隣接二文字はこのgraphのwalkになり、逆に商品名walkの最初の二文字と以後の後字を並べればNG文字列へ戻せる。必要なのは全商品名頂点を少なくとも一度覆うwalkの最少本数である。商品名の再使用は許されるので、辺を一度ずつ通るEuler路分解ではない。

SCC内は任意の入口から全商品を順に訪ね、任意の出口へ進むwalkを作れる。そこでSCCを一頂点へ縮約したDAG Dを考える。walkが訪ねる相異なる成分は到達順に並ぶ。最終目的は「元DAGの頂点素なpath分割」ではない。複数walkが途中成分を共有してもよいので、到達可能なら二成分を同じ列へまとめられる。

### 元の辺と到達関係を区別する

一般DAGを頂点素な有向pathへ分けるなら、二部matchingに使うのは元の辺だけである。一方、u≺vを「uからvへ到達する」と定めた半順序の鎖は、並びの隣接要素に直接辺を要求しない。各成分をちょうど一つの鎖へ割り当てる最小鎖分解は、推移閉包の全ての相異なる到達対に二部辺を張って求める。本問で使うのは後者である。

例えばa→c,b→c,c→d,c→eでは、元の辺の最大matchingは2で、頂点素なpath分割は3本。到達関係の鎖は(a,c,d),(b,e)の2本で足りるが、後者を元のwalkへ戻すとb→c→eになり、cを二つのwalkが通る。この重複が許されるかが帰着を選ぶ条件になる。

### 鎖とwalkを両方向に対応させる

鎖を一つ取る。隣接成分は到達可能なので元DAGの道で結び、各成分内では必要な全商品を訪ねるwalkを挟む。接続の途中で別の鎖の成分へ寄り道してもよい。従ってk本の鎖分解から全商品を覆うk本のwalkを作れる。

逆にk本のwalkがあるとき、各SCCを、そのSCCを訪れるwalkのどれか一つへ割り当てる。各walkに割り当てられた成分だけを出現順に抜き出すと、間を飛ばしても前から後へ到達可能なので鎖である。DAGでは一成分を離れてから戻れず、各SCCは一度だけ割り当てるため、空の列を除けば高々k本の鎖分解になる。この両方向から最少walk数=最少鎖数を得る。

SCC数をCとする。各成分を左右へ複製し、異なる到達対u≺vにu_L→v_Rを張る。最大matching Mの選択辺を成分上へ戻すと各頂点の入出辺は高々一本で、DAGなのでcycleはない。C−|M|本の鎖になる。逆に鎖内の隣接対はmatchingを作るので、答えはC−最大matching数。

商品名graphを作り、SCC分解、各成分からの探索による到達行列、二部最大matchingの順に処理する。matchingの計算は[主単元](src/content/docs/learn/graph/bipartite-matching.md)のHopcroft–Karpまたは単位容量flowを使える。

## 典型の発動条件

### walk coverのSCC縮約

発動条件: 全頂点を少なくとも一度覆うwalkの本数を最小化し、walk間の重複訪問を許すとき。

強連結内部は入口・出口を自由につなげる。縮約後は到達関係の鎖を作り、途中成分の重複を許して元のwalkへ展開する。

### 二部matchingによる二種類の分解

発動条件: DAGの各頂点に前後の接続を高々一つずつ選び、列の本数を最小化するとき。

元の辺だけなら頂点素なpath分割、推移閉包の辺なら到達半順序の鎖分解を求める。どちらも頂点数−最大matching数だが、張る辺と元graphへ戻した時の重複許可が異なる。

## 問題固有の要素

文字列の隣接二文字列を、辺ではなく「使用済み商品名という頂点」の walk としてモデル化する。

別の問題へ持ち帰る視点: walk は再訪可能なので SCC の内部順序を忘れ、成分間の到達可能性だけを残せる。

## 正当性

商品名walkとNG文字列は相互変換できる。SCC内では任意の入口・出口の間で全商品を訪ねられる。縮約DAGの鎖の隣接成分を元の道でつなげば、途中成分の重複を許したwalkになる。逆に全成分を覆うwalk族から各成分を一つのwalkだけへ割り当て、割当成分を出現順に抜き出すと到達関係の鎖分解になる。従って最少walk数は最少鎖分解数。到達対の二部matchingは各成分に入出辺高々一本の非循環な連結を選び、C−|M|鎖を作る。逆に鎖の隣接対はmatchingになるので、最大matchingが最少鎖数を与える。元の辺による頂点素なpath分割とは区別する。

## 実装上の注意

- 到達行列で自分自身をtrueにして探索しても、二部辺はu≠vに限る。自己辺を含めると全C成分をmatchingできてしまう。
- SCC内部の辺を縮約DAGへ残さず、成分間の重複辺は除いてよい。本問のwalk用matchingでは直接辺だけでなく全到達対を使う。

## 復習の核

- 頂点を一度ずつ使うpath分割か、途中の再訪が許されるwalk coverかを先に確認する。
- 推移閉包へ加えた辺を元の道へ展開し、ほかの列と共有する頂点が合法かを点検する。

## 計算量と制約

### 時間

V商品名、E遷移辺、C SCC、E_D縮約辺。全商品名対からgraphを作るO(V²)、SCC O(V+E)、C始点の探索O(C(C+E_D))、Hopcroft–Karp O((C+C²)√C)。V≤676で、matchingには主単元の単位容量flowも使用できる。

### 空間

元graph、closureとmatching O(V+E+C²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 26^2; N is an integer.; Each S_i is a string of length 2 consisting of uppercase English letters.; All S_1,S_2,\ldots,S_N are distinct.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/editorial/11099) — source-abc374-editorial-11099-08ffa618d6266b4f574965ba7db128d0fd6d4897a29e321b44770b9f29b48990
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc374/tasks/abc374_g) — source-abc374-g-problem-ef990b1fe81062fb5fa496062ddb53c9751bba11b379a7113f4381ffff2dda7b
