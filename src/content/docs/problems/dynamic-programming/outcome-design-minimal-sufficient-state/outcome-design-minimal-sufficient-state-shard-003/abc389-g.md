---
title: "ABC389-G — Odd Even Graph"
draft: true
authoringUnit: {"problemId":"abc389-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-minimal-sufficient-state/outcome-design-minimal-sufficient-state-shard-003/abc389-g.md","learningOutcomeIds":["outcome-design-minimal-sufficient-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-generating-functions"],"excludedTopics":["状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。"],"tagIds":["tag-dp-state-equivalence","tag-combinatorial-coefficients","tag-generating-functions"],"sourceRevisionIds":["source-abc389-editorial-11929-f9fe21efa00fe689b598c3b8fa861a7f0f477d812f06e83e7567cde9bcbbae0b","source-abc389-g-problem-b82f036922a0daf1c33b346b56d5501063d655887bb21100bd2ad06619ca3647"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":3,"claims":[{"key":"correctness","text":"距離 i の頂点は前層に一本以上接続し、辺の距離差は高々1という条件が必要。逆に全頂点が前層へ接続すれば root への長さ i の道があり、距離差2以上の辺がないので i 未満の道はなく十分である。距離層は graph から一意に復元される。各新層の label 選択と、前層への非空接続・層内自由辺の係数を掛ける DP は各 graph を一度だけ数える。","sourceRevisionIds":["source-abc389-editorial-11929-f9fe21efa00fe689b598c3b8fa861a7f0f477d812f06e83e7567cde9bcbbae0b","source-abc389-g-problem-b82f036922a0daf1c33b346b56d5501063d655887bb21100bd2ad06619ca3647"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

- 採用解法の未来を決める最小十分状態と、捨てられる履歴を説明できる。

先に読む単元:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md) — 選び方を通常・Gaussian二項係数で整理し、必要ならStirling変換でrank別計数を基底変換する。
- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md) — 高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。

この解説で扱わないこと:

- 状態の再利用をせず、頂点を一度ずつ訪問する到達可能性探索。

## 考察

頂点1からの距離layerを固定すると、edgeは同layer内または隣接layer間だけに張れ、各layer i>0の頂点は直前layerへ少なくとも一本edgeを持つ必要がある。この二条件は距離割当の必要十分条件である。要求は偶数距離vertex数と奇数距離vertex数がN/2ずつなので、layerを順に追加し、parity別累積頂点数・総edge数・直前layer sizeだけを状態にできる。prev size s、新layer size xの層間edge生成関数は((1+t)^s-1)^xで各新頂点の少なくとも一本を保証し、層内は(1+t)^{x choose 2}を掛ける。具体的なlayer番号は遷移に不要で、次に加わる頂点がeven/oddのどちらへ入るかというparityだけを交互に持てばよい。

採用する候補: BFS layer sizeを順に選ぶDPを、層間/層内edge数生成多項式f(prev,next,z)で遷移する

label選択、各新頂点が前layerへ接続する非空edge集合、同layer内任意edgeを前計算し、N≤30の多項式状態で全Mの係数を同時に数えられる。

棄却する候補: N頂点の全simple graphを列挙してBFSする

2^{N choose 2}個でありN=30でも不可能で、距離layerごとの局所edge条件を利用していない。

binomialとf(s,x,z)をmod Pで前計算する。rootだけのlayer0から、残labelからx頂点を選ぶ係数を掛け、edge数z・even/odd累積・last sizeを更新する。全頂点使用かつ両parity=N/2の状態をedge数別に出力する。

dp[p][k][l][s][j]を、最終層の偶奇p、使用済み偶数距離k頂点・奇数距離l頂点、最終層s頂点、辺j本の個数とする。初期値はdp[0][1][0][1][0]=1、その他0。次層の人数x≥1を、未使用数N−k−lと次の偶奇の残枠N/2の双方で制限する。p=0ならl'=l+x,k'=k、p=1ならk'=k+x,l'=l。辺追加数zについて

dp[1−p][k'][l'][x][j+z]+=dp[p][k][l][s][j]·C(N−k−l,x)·f(s,x,z)

を法Pで加える。k+lの昇順に処理すれば層番号を省いても未確定状態へしか遷移しない。終状態はk=l=N/2で、両pと全sを辺数jごとに足す。

f(s,x,z)は次の再帰で前計算できる。b_s[t]=C(s,t)（1≤t≤s）、b_s[0]=0、h_0[0]=1、h_x=h_{x−1}*b_sと置くと、h_xがx個の新頂点の前層接続を表す。その後f(s,x,z)=Σ_t h_x[t]C(x(x−1)/2,z−t)。新頂点の順序は選んだラベルの昇順など固定しており、x!を別に掛けない。任意素数Pについて二項係数はPascalの加算で作れば階乗逆元の条件を増やさずに済む。

## 典型の発動条件

### BFS layer decomposition

発動条件: rootからの距離条件付きgraphを数えるとき。

同層・隣接層edgeと前層への非空接続で必要十分に記述する。

### edge数生成関数

発動条件: 多数の独立edge選択を本数別に数えるとき。

(1+t)^cと非空subset多項式を積んで遷移係数を作る。

### layer parity DP

発動条件: 距離の値でなく偶奇別個数だけを問うとき。

layer追加ごとにeven/odd bucketを交互に更新する。

## 問題固有の要素

connected性を別途包除せず、各非root layerが直前layerへ接続する条件だけでrootへのpathと指定距離を同時に保証できる。

別の問題へ持ち帰る視点: 距離制約graphは頂点ごとの距離をlayerとして固定するとedgeの許容範囲が局所化し、生成関数DPにしやすい。

## 正当性

距離 i の頂点は前層に一本以上接続し、辺の距離差は高々1という条件が必要。逆に全頂点が前層へ接続すれば root への長さ i の道があり、距離差2以上の辺がないので i 未満の道はなく十分である。距離層は graph から一意に復元される。各新層の label 選択と、前層への非空接続・層内自由辺の係数を掛ける DP は各 graph を一度だけ数える。

## 実装上の注意

- Pは998244353固定でなく入力primeなので全演算をPで行う。layer size x=0は全頂点を使う終了時以外に挟まず、edge出力rangeN-1..N(N-1)/2を合わせる。

## 復習の核

- N≤6で全graphを列挙してBFS parity・connected性・edge数を数え、DPのlayer割当が同じgraphを一意に数えることを照合する。

## 計算量と制約

### 時間

頂点 N、辺数次元 O(N²)、偶奇累積各 O(N)、直前層サイズ O(N) で状態 O(N^5)。新層サイズ O(N) と追加辺数 O(N²) を列挙し O(N^8)。係数前計算はこの上界以内。

### 空間

DP O(N^5)、層間係数 f(s,x,z) は O(N^4)、出力 O(N²)。

### 制約との対応

O(N^8)は状態数と遷移範囲を独立に掛けた粗い上界で、N=30の5秒適合をこの式だけから断言しない。偶数層人数kと奇数層人数lは各N/2以下、直前層size sはそのparityの既使用人数以下で、k+l≤N。新層xも残り人数と次parityの残枠を超えない。使用頂点n=k+lの部分graphは前層接続により連結なので辺数j≥n−1、上限は各層内および隣接層pairに許された辺数以下。係数f(s,x,z)の支持域は少なくとも一接続を新頂点ごとに必要とするz≥x、上限z≤sx+x(x−1)/2で、0係数をskipする。dpが0の状態も全遷移をskipし、残人数0以外でx=0を挟まない。これら実際の添字・非零支持域で定数を抑えるが、漸近上界自体はO(N^8)を維持する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc389/editorial/11929) — source-abc389-editorial-11929-f9fe21efa00fe689b598c3b8fa861a7f0f477d812f06e83e7567cde9bcbbae0b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc389/tasks/abc389_g) — source-abc389-g-problem-b82f036922a0daf1c33b346b56d5501063d655887bb21100bd2ad06619ca3647
