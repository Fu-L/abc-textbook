---
title: "ABC222-H — Beautiful Binary Tree"
draft: true
authoringUnit: {"problemId":"abc222-h","docPath":"src/content/docs/problems/mathematics/outcome-invert-generating-function-equation/outcome-invert-generating-function-equation-shard-001/abc222-h.md","learningOutcomeIds":["outcome-invert-generating-function-equation","outcome-derive-coefficient-recurrence-by-differentiation"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-generating-functions","unit-modular-arithmetic"],"excludedTopics":["母関数方程式・高度な係数抽出の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-generating-function-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc222-editorial-2742-0b52abf47c9dca1917f852a87070e8ceee676eabae8d37b24d7f809b38b22c86","source-abc222-h-problem-9a1dc4483c90ca4be68ee5b105475bf715ab96843f2fe15ad901578002e62147"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"総和保存から初期1はN個必要で、正頂点数Nから1への減少にはN−1操作必要である。回数上限から毎回正の頂点同士を合流させるので初期0は受け手になれず、根は1でなければならない。隣接0の下の部分木から値を根側へ渡すには距離3以上の移送が必要になり不可能。逆に隣接0がなければ、初期1を深い順に距離1または2の最も近い初期1の祖先へ移してN−1回で成功する。従って局所条件を満たす木と元の到達可能な木は一致する。1の個数を次数とする根別分解はB=2A+A²、A=x(1+A+B)²を与える。Lagrange反転で答えは(1/N) · [x^(N−1)] (1+3x+x²)^(2N)。微分の係数比較による漸化式はu_0=1、負添字0から同じ係数を一意に生成する。","sourceRevisionIds":["source-abc222-editorial-2742-0b52abf47c9dca1917f852a87070e8ceee676eabae8d37b24d7f809b38b22c86","source-abc222-h-problem-9a1dc4483c90ca4be68ee5b105475bf715ab96843f2fe15ad901578002e62147"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [母関数方程式・高度な係数抽出](src/content/docs/learn/combinatorics-algebra/generating-function-coefficients.md)

- F=xΦ(F)からLagrange反転 [x^n]F=[t^(n−1)]Φ(t)^n/nを導き、形式的条件と法上の除算可能性を確認して係数問題へ変換できる。
- 母関数の微分恒等式を作り、次数ごとの係数比較から初期値・分母条件を持つ漸化式を導ける。

先に読む単元:

- [組合せを生成関数へ符号化する](src/content/docs/learn/combinatorics-algebra/generating-functions.md) — 高速畳み込みを前提にせず、係数の意味を定義して和・積・sequence・set・cycleが表す組合せ構造を欲しい係数へ翻訳する。
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md) — 剰余を正規化して加減乗算し、二分累乗と逆元の存在条件を使って法上の除算や確率を計算する。

## 考察

操作列を数える前に、操作回数の上限がどれほど厳しいかを見る。操作は数の総和を保存するので、最終的に根へNを集めるには初期の1がちょうどN個必要である。正の値を持つ頂点数は初期N、終状態1。一操作で減らせる数は高々1だから、最低でもN−1回かかる。

許される回数を全て使い切るので、毎回「正の頂点から正の祖先へ合流」して正の頂点数を一つ減らさなければならない。0の頂点へ移す操作は個数を減らさず、一度空になった頂点も受け手には戻せない。従って初期0の頂点は最後まで0のままで、根は初期から1である必要がある。

親uと子vがともに0なら、vの部分木には葉条件によって少なくとも一つの1がある。その値をuより上へ出すには、0のu,vを飛び越えて正の頂点同士を合流する必要があるが、vより下からuより上への距離は最低3。子・孫からしか移せないため、この部分木の値は根へ届かない。よって隣接する0は禁止される。

逆に、根・葉が1で1の総数がN、かつ0が隣接しない木を考える。初期1の非根頂点を深い順に処理し、最も近い初期1の祖先へ値を全て移す。間にある0は高々一頂点なので距離は1または2。受け手はまだ処理されておらず正のままだから毎回一つの正頂点を消せる。N−1回で根だけにNが残る。これで操作可能性と静的な局所条件の必要十分性が示せた。

採用する候補: 根が1の木と根が0の部分木を母関数で分け、関数方程式をラグランジュ反転して必要な一係数を漸化式で求める。

N=10^7 では木のサイズごとの畳み込みを直接計算できず、反転公式で答えを低次数多項式の冪の一係数へ落とす必要がある。

棄却する候補: 左右部分木の1の総数を分配する通常の木DPで a_i,b_i を順に計算する。

漸化式に全ての分割 j+(i-j) の畳み込みが現れて二乗時間となり、N=10^7 の制約に届かない。

xの次数は頂点総数ではなく1の個数とする。根が1の非空木の母関数をA、根が0の非空許容部分木をBとする。0の根は葉になれず、子は全て1の根なので、子一つの左右二通りと子二つからB=2A+A²。1の根の各子は空・A・Bを独立に選べ、根自身の1でxを掛けるからA=x(1+A+B)²=x(1+3A+A²)²となる。

ラグランジュ反転により答えは (1/N)\[x^(N-1)](1+3x+x^2)^(2N) となり、低次数多項式の冪は微分恒等式から二項漸化式で係数を順に出せる。

m=2N、u_k=\[x^k](1+3x+x^2)^m として u_0=1 から u_k={3(m+1-k)u_(k-1)+(2m+2-k)u_(k-2)}/k を進め、u_(N-1)/N を出力する。

## 典型の発動条件

### 根付き木の母関数分解

発動条件: 木を根の型と左右の独立な部分木へ分解でき、サイズ別個数の畳み込みが現れるとき。

根ラベル0・1の二種類を A,B に分け、空の子を含む左右の選択を積として関数方程式へ写す。

### ラグランジュの反転公式

発動条件: 求める母関数が F=xφ(F) の形で暗黙に定義され、特定次数の係数だけが必要なとき。

[x^N]F を (1/N)[x^(N-1)]φ(x)^N に変え、暗黙方程式を直接解かずに係数を取り出す。

### 微分恒等式による係数漸化式

発動条件: 固定次数の多項式 T の大きな冪 U=T^m の係数を先頭から多数求めるとき。

TU'=mT'U の係数を比較し、直前の少数係数だけを見るP-recursiveな漸化式を作る。

## 問題固有の要素

最大 N-1 回の加算操作による到達可能性が、『根・葉は1、1の総数はN、隣接する0はない』という局所条件へ完全に置き換わる。

別の問題へ持ち帰る視点: 操作列を数える前に、最終状態へ到達できる入力の不変量と局所禁止パターンを必要十分条件として探す。

## 正当性

総和保存から初期1はN個必要で、正頂点数Nから1への減少にはN−1操作必要である。回数上限から毎回正の頂点同士を合流させるので初期0は受け手になれず、根は1でなければならない。隣接0の下の部分木から値を根側へ渡すには距離3以上の移送が必要になり不可能。逆に隣接0がなければ、初期1を深い順に距離1または2の最も近い初期1の祖先へ移してN−1回で成功する。従って局所条件を満たす木と元の到達可能な木は一致する。1の個数を次数とする根別分解はB=2A+A²、A=x(1+A+B)²を与える。Lagrange反転で答えは(1/N) · [x^(N−1)] (1+3x+x²)^(2N)。微分の係数比較による漸化式はu_0=1、負添字0から同じ係数を一意に生成する。

## 実装上の注意

- u_(k-2) を使う漸化式の初期境界を分け、k と N の逆元を正しく掛ける。N<998244353 なので必要な除数は全て可逆である。

## 復習の核

- 操作回数の下限が上限と一致したら、毎回の操作が下限達成に必要な形へ強制される。そこから受け手の制限と禁止パターンを導く。
- 母関数を作る前に、数える局所条件が元の操作可能性と両方向に対応することを示す。
- 巨大NではF=xφ(F)の形と「欲しいのは一係数だけ」という構造を探す。

## 計算量と制約

### 時間

O(N)。係数の二項漸化式と逆元表を計算する。

### 空間

O(N)。逆元表inv[1..N]を保持するためであり、係数uは直前2項だけでよい。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^7; All values in input are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/editorial/2742) — source-abc222-editorial-2742-0b52abf47c9dca1917f852a87070e8ceee676eabae8d37b24d7f809b38b22c86
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc222/tasks/abc222_h) — source-abc222-h-problem-9a1dc4483c90ca4be68ee5b105475bf715ab96843f2fe15ad901578002e62147
