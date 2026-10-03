---
title: "ABC451-G — Minimum XOR Walk"
draft: true
authoringUnit: {"problemId":"abc451-g","docPath":"src/content/docs/problems/mathematics/outcome-minimize-xor-coset-representative/outcome-minimize-xor-coset-representative-shard-001/abc451-g.md","learningOutcomeIds":["outcome-minimize-xor-coset-representative"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-binary-trie","unit-cycle-space-basis"],"excludedTopics":["XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-xor-linear-basis","tag-binary-trie","tag-cycle-space-basis"],"sourceRevisionIds":["source-abc451-editorial-18047-62bc417f992179f3df75def0b0c1f308181d42c6211616762d86cf48a3f0ae9f","source-abc451-g-problem-5dd2c13ea56b4998c7775e3e4437ad346e68834e1e7cacfa8f4d632c67287a23"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"辺ラベルをW_e=W'_e XOR A_u XOR A_vと展開すると、任意のs→t walkのXORはA_s XOR A_tにW'_eの線形結合を足した値となる。各基本閉路を木経路の往復で接続した寄り道により任意の線形結合も実現できるから、可能集合はそのcoset全体である。\n\n高位pivotの消去は各段が線形写像で、全pivotを0にした代表は非零のspan要素を足すと最上位pivotが1になり増える。従ってfは線形な最小代表写像であり、最小walk XOR=f(A_s) XOR f(A_t)。trieのK=1のbitで加える枝はそこで初めてK未満になる値、追う枝はprefix一致の値を数える。最後の一致も加えて≤Kを正確に判定する。queryを挿入前に行えば相異なるunordered pairだけを一度数える。","sourceRevisionIds":["source-abc451-editorial-18047-62bc417f992179f3df75def0b0c1f308181d42c6211616762d86cf48a3f0ae9f","source-abc451-g-problem-5dd2c13ea56b4998c7775e3e4437ad346e68834e1e7cacfa8f4d632c67287a23"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [XOR線形基底](src/content/docs/learn/combinatorics-algebra/xor-linear-basis.md)

- XOR部分空間の基底をpivot bitごとにreduced formへ整え、高位bitから基底を加減してaffine cosetの最小整数代表を一意に得る。正規化写像の線形性を示し、二値のXOR最小化を各値の正規化へ分離できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [bit列をTrieで索引化する](src/content/docs/learn/query/binary-trie.md)
- [cycle space・fundamental cycle basis](src/content/docs/learn/graph/cycle-space-basis.md)

対象外:

- XOR線形基底の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

無向連結graphの全域木を一つ選び、根からvまでの辺ラベルXORをA_vとする。辺e=(u,v)についてW'_e=W_e XOR A_u XOR A_vを作る。木辺なら0、非木辺なら基本閉路のラベルXORとなる。

任意のs→t walkでは、各辺W_e=W'_e XOR A_u XOR A_vと展開すると、中間頂点のAが二回ずつ消え、walk XOR=A_s XOR A_t XOR（通ったW'_eのXOR）となる。従って可能値はA_s XOR A_tのcycleラベルspan Vによるcosetへ含まれる。逆に任意の非木辺eの基本閉路へsから木経路で往復すると、接続部分は二回通ってXORが消え、W'_eだけを加えられる。この閉じた寄り道を必要な辺ごとに挿入してからs→tの木経路を進めば、span Vの任意要素を実現できる。walkが無限個あることと、ラベルの可能値が有限のspanであることを区別する。

Vの最高bit基底でcosetの最小代表f(x)を求める。bit bが1ならpivot行basis[b]をXORして0にする、高bit順の消去を用いる。一段はx→x XOR (x_b·basis[b])というF₂線形写像なので、その合成fも線形である。消去後の非零なV要素は最上位pivotで0→1を作るから、f(x)がcosetの最小となる。よって二点の最小walk XORはf(A_s XOR A_t)=f(A_s) XOR f(A_t)となり、各頂点をB_v=f(A_v)へ一回だけ正規化すればよい。既約基底を作って全pivot列を消す方法でも同じ最小代表を得る。

Bを一つずつbinary trieへ挿入し、それ以前のyでB XOR y≤Kとなる個数を数える。問い合わせ時に同じprefixのnodeを高bitから追い、x=Bのbitとする。Kのbitが0ならyのbitをxと同じにして継続。Kのbitが1ならyのbitがxと同じ子の全個数を加え（このbitでK未満になる）、逆の子へ継続して一致を保つ。全bitを処理した後は一致nodeの個数も加えて等号を含める。必要な子がなければ継続を終了する。

queryしてからBを挿入するので、相異なるunordered頂点pairを一度ずつ数え、自己pairを入れない。同じBを持つ異なる頂点はそれぞれ頻度として残す。

## 典型の発動条件

### cycle xor の線形基底

発動条件: graph walk に cycle を挿入して xor 重みを最小化・可否判定するとき。

spanning tree potential で辺を cycle xorへ変換し span を作る。

### binary trie の xor pair 数え上げ

発動条件: 多数の値 pair で xor が閾値以下となる個数を求めたいとき。

K のbitに従い枝ごとの個数を一括加算する。

## 問題固有の要素

graph の xor walk は tree potential で端点依存部分と cycle span に分離できる。

別の問題へ持ち帰る視点: pair ごとの coset 最小化が各値の canonical 化へ分離できるかは、正規化写像の xor 線形性を証明して判断する。

## 正当性

辺ラベルをW_e=W'_e XOR A_u XOR A_vと展開すると、任意のs→t walkのXORはA_s XOR A_tにW'_eの線形結合を足した値となる。各基本閉路を木経路の往復で接続した寄り道により任意の線形結合も実現できるから、可能集合はそのcoset全体である。

高位pivotの消去は各段が線形写像で、全pivotを0にした代表は非零のspan要素を足すと最上位pivotが1になり増える。従ってfは線形な最小代表写像であり、最小walk XOR=f(A_s) XOR f(A_t)。trieのK=1のbitで加える枝はそこで初めてK未満になる値、追う枝はprefix一致の値を数える。最後の一致も加えて≤Kを正確に判定する。queryを挿入前に行えば相異なるunordered pairだけを一度数える。

## 実装上の注意

- 全域木とcycleラベルspanはこの連結graph内で作る。高bitからpivot bitを0にする一定の消去順で全A_vを正規化する。最小代表には既約化は必須ではなく、単なる最高bit基底でもこの順序なら同じ写像になる。
- trieはnodeごとの通過頻度を持ち、query後に挿入する。K=0や同じ正規化値の複数頂点も含める。pair総数は64bitで扱う。

## 復習の核

- W'_e の telescoping 式、span の任意組合せを実現する walk、f(x⊕y) の線形性の三段を順に再構成する。

## 計算量と制約

### 時間

O((N+M)B+B²)、B=30。cycle基底とbinary trie。

### 空間

O(NB+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 10^5; 2 \leq N \leq 2 \times 10^5; N-1 \leq M \leq 2 \times 10^5; 0 \leq K \lt 2^{30}; 1 \leq U_i \lt V_i \leq N; 0 \leq W_i \lt 2^{30}; The given graph is simple and connected.; All input values are integers.; The sum of N over all test cases in a single input is at most 2 \times 10^5.; The sum of M over all test cases in a single input is at most 2 \times 10^5.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/editorial/18047) — source-abc451-editorial-18047-62bc417f992179f3df75def0b0c1f308181d42c6211616762d86cf48a3f0ae9f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc451/tasks/abc451_g) — source-abc451-g-problem-5dd2c13ea56b4998c7775e3e4437ad346e68834e1e7cacfa8f4d632c67287a23
