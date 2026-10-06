---
title: "ABC474 G — LRUD Moving 2"
draft: true
authoringUnit: {"problemId":"abc474-g","docPath":"src/content/docs/problems/updates/abc474-g.md","learningOutcomeIds":["outcome-recover-valid-witness"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":[],"tagIds":["tag-constructive-witness"],"sourceRevisionIds":["source-abc474-g-problem-4807fa6da40cdea3224e468b23de6a4916bfe64047762055ff2fc522448056cc","source-abc474-editorial-25439-07425691ca644cc1872536248507a7591951754f6486c797db69712366ee6024","source-abc474-editorial-25467-3849704de58b8512d870103dfb05000de64809df6d4f2c8d470a8774718cc20c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"必要な偶奇条件は公式の一つおきの辺のmatchingによる論証を根拠にする。構成では非増加tの各行対が左側の長方形を占め、各列対の未訪問部分は下端から連続した偶数高さとなる。二段目の蛇行はそれを一度ずつ埋め、二段階で全N²マスを覆う。右移動の総数は2s+2M=Kであり、他の条件も成立する。","sourceRevisionIds":["source-abc474-g-problem-4807fa6da40cdea3224e468b23de6a4916bfe64047762055ff2fc522448056cc","source-abc474-editorial-25439-07425691ca644cc1872536248507a7591951754f6486c797db69712366ee6024","source-abc474-editorial-25467-3849704de58b8512d870103dfb05000de64809df6d4f2c8d470a8774718cc20c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

[成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

- 成立証明に対応する親・局所操作・選択を記録し、要件を満たす構成を出力できる。

## 考察

全マス一度の道は長さN²−1で、始点と終点の市松色が同じなのでNは奇数が必要。移動回数はR−L=D−U=N−1だから N−1≤K≤(N²−1)/2。さらにHamilton道の一つおきの辺をdomino matchingとして見た偶奇条件によりKは偶数となる。ここは端点差だけからK偶数を結論しない。必要性の証明は次のmatchingの偶奇を使う。

奇数番の辺のmatching Mは右下以外を、偶数番のmatching M′は左上以外を覆う。市松色の白・黒をそれぞれ行優先順に番号付けし、matchingが白番号から黒番号へ与える置換の反転偶奇をf、黒から白へ右向きの辺数をgとする。同じ欠損端点のdomino敷詰めで、2×2部分の二辺を回すflipはfとgの両方の偶奇を反転するためf+gの偶奇を保つ。これらの敷詰めはflipで連結できる（dominoのheight functionによる標準補題）。行対を縦dominoで埋め、残る最下行を横dominoで埋める代表配置から、Mではf+g≡(N−1)/2、M′ではf+g≡0となる。Hamilton順の黒・白番号を用いて二matchingの置換を比べるとf(M)=f(M′)。黒頂点数−1=(N²−1)/2が偶数だからである。M′の横辺総数Xは奇数行・偶数行の未対応マス数差からX≡(N−1)/2。従って右移動数K=g(M)+X−g(M′)は偶数となる。この標準補題を含む必要性の詳細は出典の公式補足解説を参照できる。

M=(N−1)/2、s=(K−N+1)/2と置く。M×Mの箱にs個を詰めるFerrers形として、M≥t_1≥…≥t_M≥0、Σt_i=sを作る。具体的にはsをMで割って商h・余りrを得て、先頭r個をh+1、残りをhにすればよい。

上から二行ずつ、Rを2t_i回、D一回、Lを2t_i回、D一回と動き、左端の下隅へ到達する。次に列を二本ずつ処理する。j=1,…,Mで h_j=2(M−#{i:t_i≥j}) とし、R一回、Uをh_j回、R一回、Dをh_j回と進む。これは前半が埋めなかった右側の列対を下から蛇行して埋める。t_iが非増加なので、既訪問領域との境界は階段形になり、各列対で未訪問の高さがちょうどh_jになる。

前半の右移動は2Σt_i=2s、後半は2M=N−1なので合計K。列対と行対が互いに補集合を埋め、右下で終わる。出力長自体がΘ(N²)なので、これ以上の漸近高速化は要らない。

## 典型の発動条件

実現条件を偶奇・移動差で絞り、自由パラメータを階段形へ符号化して構成する。行側の形と列側の補集合を対応させる。

## 問題固有の要素

二行の折返しは右移動を2単位で増やし、後段の二列蛇行が残領域を埋める。

## 正当性

必要な偶奇条件は公式の一つおきの辺のmatchingによる論証を根拠にする。構成では非増加tの各行対が左側の長方形を占め、各列対の未訪問部分は下端から連続した偶数高さとなる。二段目の蛇行はそれを一度ずつ埋め、二段階で全N²マスを覆う。右移動の総数は2s+2M=Kであり、他の条件も成立する。

## 実装上の注意

条件判定前にsを計算しない。tの端が0,Mでも空往復を正しく扱う。出力を独立シミュレーションし重複・範囲外・Kを検査する。

## 復習の核

必要条件と十分な構成を分ける。可変量を階段形にすると、その補集合も単調に走査できる。

## 計算量と制約

### 時間

出力と訪問確認を含め O(N²)。全テストのΣN²≤10^6。

### 空間

出力文字列 O(N²)、tと高さ O(N)。

### 制約との対応

Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le T\le 5\times 10^3; 2\le N\le 10^3; 0\le K\le N^2-1; The sum of N^2 over all test cases is at most 10^6.; All input values are integers.

## 出典

- [公式問題](https://atcoder.jp/contests/abc474/tasks/abc474_g)
- [公式解説](https://atcoder.jp/contests/abc474/editorial/25439)
- [公式解説](https://atcoder.jp/contests/abc474/editorial/25467)
