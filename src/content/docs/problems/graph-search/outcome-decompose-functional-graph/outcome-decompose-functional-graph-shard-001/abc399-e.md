---
title: "ABC399-E — Replace"
draft: true
authoringUnit: {"problemId":"abc399-e","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc399-e.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition"],"sourceRevisionIds":["source-abc399-e-problem-1d4ea03ba95452a9e586d2815b0d5f1cd2e42e692a526f490d5ea576b453bab2","source-abc399-editorial-12564-6e1510563de5279b95e284c4e0c13c4772bcba726ff97494a39c00e3e1e5b0f4"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"元の同字tokenは操作で分離できないため目的地の矛盾は不可能である。非identity sourceのtokenは元の位置から一度以上出る必要があり、異なる元位置からの最初の移動は別の操作なので、m回が下界。純cycleの各目的地には異なる目的地のtokenがあり、cycle外にも同じ目的地を持つtokenは存在しない。従って最初にcycleから動くtokenは目的地以外へ退避し、後でもう一回動く必要がある。純cycleごとに一回追加が必要で、m+純cycle数が下界となる。\n\n出辺なしの根または自己loopへ入る木は目的地に近い順に処理し、各非identity tokenを一回だけ動かせる。流入木付きの非自明cycleはv_{ℓ−1}→u、cycleの空きへ逆順に回すℓ−1操作、u→v_0の計ℓ+1操作で、ℓ個のcycle tokenとuを各一回動かし、残木も各一回で確定する。純cycleは空きzへ退避して回転し最後に戻すℓ+1操作で直る。全置換以外では最初から空きがあるか木付き成分の処理で空きが生まれ、純cycle処理後もその空きは保たれる。これらの構成が下界を達成する。全26文字の非identity置換の場合はどの初手も異目的tokenを不可逆に合流させるので不可能。","sourceRevisionIds":["source-abc399-e-problem-1d4ea03ba95452a9e586d2815b0d5f1cd2e42e692a526f490d5ea576b453bab2","source-abc399-editorial-12564-6e1510563de5279b95e284c4e0c13c4772bcba726ff97494a39c00e3e1e5b0f4"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

先に読む単元:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md) — 暗黙状態と重みなし合法遷移を頂点・辺へ写し、探索目的・訪問条件・frontierに応じてBFS・DFS・backtrackingを選ぶ。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

## 考察

同じsource文字がTで二種類へ対応するなら、全置換を繰り返しても元々同じ文字を分離できないため不可能である。対応が一意なら、Sに現れる文字xから目的地f(x)への辺を持つ26頂点のfunctional graphへ圧縮する。各文字に「元の文字の群」を一つのtokenとして置けば、操作x→yはxにある全tokenをyへ動かすことになる。目的地が違うtokenを一度合流させると二度と分離できない。

少なくとも一回動かす必要があるtokenはx≠f(x)のsourceごとに一個ある。その数をmとする。非自明cycleのうち、成分全体がcycleだけのものを純cycleと呼ぶ。各純cycleは最初の移動を目的地へ行えず、一時退避が追加で一回必要になる。流入木が付くcycleは、同じ目的地を持つcycle内外のtokenを合流させて解くため追加費用は要らない。この違いを操作列で確認する。

根の出辺がない木では根が最初から空で、自己loopの木では根に目的地が既に正しいtokenがある。どちらも根に近い順に各子u→f(u)を行えば、行先は空か同じ目的地のtokenだけなので合法であり、各非identity sourceを一回ずつ動かせる。

流入木付きの長さℓ≥2のcycleをv_0→v_1→…→v_{ℓ−1}→v_0とし、木から直接u→v_0が入るとする。最初にv_{ℓ−1}→uで同じ目的地v_0のtokenを合流させる。空いたv_{ℓ−1}へv_{ℓ−2}を動かし、順にv_{ℓ−3},…,v_0をそれぞれのcycle上の目的地へ動かす。最後にu→v_0で合流tokenを確定する。合計ℓ+1操作で、cycleのℓ tokenと木のuを各一回動かした。残る木は目的地から近い順に同様に処理する。

例としてS=abc,T=baaではa→b,b→aのcycleにc→aが流入する。b→c、a→b、c→aと動かすとabc→acc→bcc→baaとなる。3個の非identity sourceを3回で直せ、cycleに一律1を加える式では過大になる。

純cycleでは空き文字zを使う。v_{ℓ−1}→z、v_{ℓ−2}→v_{ℓ−1},…,v_0→v_1、z→v_0のℓ+1回で直し、zは再び空になる。同じ空き文字を他の純cycleにも使える。Sにない文字は最初から空。全26字がSにある場合でも、対応が置換でなければ流入木付きcycle（自己loopを含む）があり、それを処理すれば木の葉の文字が空く。

全26文字の対応が非identity置換である場合だけ、全ての文字に目的地が異なるtokenがあり、最初のどの操作も不合法な合流となって不可能。S=Tなら操作0回でよい。これ以外はm+純cycle数が答えである。

S,Tを走査してfを作り、矛盾を検出する。非identity source数を数え、無向成分ごとにサイズ≥2かつ全頂点の入次数・出次数が1のものだけを純cycleとして加える。操作列は式の証明用で、実装では26頂点の集計だけでよい。

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

元の同字tokenは操作で分離できないため目的地の矛盾は不可能である。非identity sourceのtokenは元の位置から一度以上出る必要があり、異なる元位置からの最初の移動は別の操作なので、m回が下界。純cycleの各目的地には異なる目的地のtokenがあり、cycle外にも同じ目的地を持つtokenは存在しない。従って最初にcycleから動くtokenは目的地以外へ退避し、後でもう一回動く必要がある。純cycleごとに一回追加が必要で、m+純cycle数が下界となる。

出辺なしの根または自己loopへ入る木は目的地に近い順に処理し、各非identity tokenを一回だけ動かせる。流入木付きの非自明cycleはv_{ℓ−1}→u、cycleの空きへ逆順に回すℓ−1操作、u→v_0の計ℓ+1操作で、ℓ個のcycle tokenとuを各一回動かし、残木も各一回で確定する。純cycleは空きzへ退避して回転し最後に戻すℓ+1操作で直る。全置換以外では最初から空きがあるか木付き成分の処理で空きが生まれ、純cycle処理後もその空きは保たれる。これらの構成が下界を達成する。全26文字の非identity置換の場合はどの初手も異目的tokenを不可逆に合流させるので不可能。

## 実装上の注意

- self-loop x→xは操作不要で、純非自明cycleにも数えない。
- cycleへの流入木が一つでもあれば純cycleではない。成分の全頂点の入次数・出次数を確認する。
- 空き文字は最初のSに存在しない文字だけでなく、他成分の処理後に生まれる場合もある。対応が全26字の置換かで不可能を判定し、S=Tは0とする。

## 復習の核

- 同一視したtokenを合流させる前に、最終目的地が同じか確かめる。
- cycleの存在だけで退避費用を加えない。外部に同じ目的地のtokenがあるなら、その合流で空きを作れる。
- 操作数の下界を達成する処理順と、使う空き資源が次の成分にも残ることまで示す。

## 計算量と制約

### 時間

文字列長 N、文字種数 C=26。対応確認O(N)、cycle検出O(C)。

### 空間

対応・次数・visitedで O(C)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; N is an integer.; Each of S and T is a string of length N, consisting of lowercase English letters.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/tasks/abc399_e) — source-abc399-e-problem-1d4ea03ba95452a9e586d2815b0d5f1cd2e42e692a526f490d5ea576b453bab2
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc399/editorial/12564) — source-abc399-editorial-12564-6e1510563de5279b95e284c4e0c13c4772bcba726ff97494a39c00e3e1e5b0f4
