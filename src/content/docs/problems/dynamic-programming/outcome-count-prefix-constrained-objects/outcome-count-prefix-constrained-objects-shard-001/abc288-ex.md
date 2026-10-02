---
title: "ABC288-EX — A Nameless Counting Problem"
draft: true
authoringUnit: {"problemId":"abc288-ex","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc288-ex.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-state-design","unit-inclusion-exclusion"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp","tag-combinatorial-coefficients","tag-inclusion-exclusion"],"sourceRevisionIds":["source-abc288-editorial-5663-0e59e0a47ff7c846b431cd85eb6f5669dc38c4243c36f811296d18c5514da0b9","source-abc288-ex-problem-6f21ea4475a77f8e377b32b767a6c52e5b5bb43155a45d4a23887fd82fa1664c"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"非減少列は各値の出現回数で一意に決まり、xorへ寄与するのは奇数回の値だけである。まず順序自由の列数f(L)を、Mとの比較確定数とxorの各bitのparityで数える。同値位置のblock分割により、相異なる値を使う項g(L)以外は、少ない奇数block数の既知gと偶数blockへの値割当へ分解できるため、Lの昇順に差し引いてgを求められる。最終列は奇数出現値を一回ずつ置いた集合と、残りi個の同値pairの配分に一意に分かれる。g(N−2i)/(N−2i)!とC(M+i,i)の積を全iで足すと全列を一回ずつ数える。","sourceRevisionIds":["source-abc288-editorial-5663-0e59e0a47ff7c846b431cd85eb6f5669dc38c4243c36f811296d18c5514da0b9","source-abc288-ex-problem-6f21ea4475a77f8e377b32b767a6c52e5b5bb43155a45d4a23887fd82fa1664c"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2,M=1,X=0、非減少列の要素域0,1。","procedure":["候補は(0,0),(0,1),(1,1)。","xor0は等値の最初と最後だけ。"],"executionTarget":null,"expectedResult":"2列。","verificationStatus":"not_applicable","learningUnitIds":["unit-digit-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-dp-state-design","unit-inclusion-exclusion"],"attainmentCondition":"X=1へ変更すると何列か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"相異なるodd頻度値0,1を各一回使う(0,1)だけで1列。等値pairはxorを変えない。"},"answer":{"reasoningOrVerification":"相異なるodd頻度値0,1を各一回使う(0,1)だけで1列。等値pairはxorを変えない。","procedure":["具体例の各状態・寄与を再計算する。","相異なるodd頻度値0,1を各一回使う(0,1)だけで1列。等値pairはxorを変えない。"],"expectedResult":"相異なるodd頻度値0,1を各一回使う(0,1)だけで1列。等値pairはxorを変えない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

対象外:

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

非減少列は各値のmultiplicityで一意に決まり、XORへ寄与するのは奇数回現れる値だけである。

まず順序制約を外した長さLの列で各要素0..M・総XOR Xとなる個数f(L)をbit digit DPで求め、その後multiplicity partitionを使ってdistinct値の個数g(L)へ変換できる。

最終列は、奇数multiplicityを持つ相異なる値を1個ずつ置いたstrictly increasing列に、任意の値のpairを追加して得られる。

採用する候補: bit DPでf(L)、奇偶block分割でdistinct ordered列g(L)、最後にpair追加の組合せを行う三段階の数え上げ。

値域M+1を列挙せず、XORのbit独立性・multiplicity parity・非減少順の一意性を順に分離できる。

棄却する候補: A_1≤…≤A_Nを保ちながら各要素をbit DPで同時構築する。

上位bitが同じ要素groupごとの順序状態が複雑になり、N個のtight状態だけでは圧縮できない。

棄却する候補: 0..Mの各値についてmultiplicityを0..Nから選ぶDP。

Mは最大2^30近く、値を1つずつ走査できない。

f(L)のbit DPでは、上位bitで既にM未満と確定した要素数jだけを状態にし、未確定要素の当該bit選択数とXのbit parityを二項係数で数える。

同じ値の出現位置を奇数size blockと偶数size blockへ分けると、XOR条件を担うのは奇数blockに割り当てる相異なる値だけになり、その個数を既計算のg(j)で表せる。

長さN-2iのdistinct odd値集合を選んだ後、追加するi個のpairはM+1種類への重複組合せC(M+i,i)で分配できる。

L=0..Nごとに上位bitからdigit DPし、既にM未満の要素数を状態として総XOR bitがXと一致する遷移を二項係数で加えf(L)を得る。odd(i,j),even(i,j)を、指定位置を奇数size/偶数sizeのj blockへ分割する個数として前計算し、h(x,y)=Σ_k even(x,k)·(M+1-y)_kも作る。Lを昇順に、f(L)からΣ_i C(L,i)Σ_{j≤min(L-1,i)}odd(i,j)g(j)h(L-i,j)を引いてdistinct ordered列数g(L)を得る。答えはΣ_{i=0..floor(N/2)} g(N-2i)/(N-2i)!·C(M+i,i)。

## 典型の発動条件

### 対称な複数要素のbit DP

発動条件: 複数のlabel付き値を同じ上限以下にし、XORだけを制約するとき。

上限未満確定要素の個数と当該bitの1のparityを二項係数で数える。

### multiplicity parity分解

発動条件: 同値要素が相殺する演算としてXORを持つ列を数えるとき。

奇数回の値だけをcoreとし、偶数回分をpairとして分離する。

### set partitionによる重複除去

発動条件: ordered列の値重複を、等値位置blockのsize条件ごとに分類するとき。

odd/even size block数とfalling factorialで割当を数え、distinct項を漸化的に抽出する。

### 重複組合せ

発動条件: 選んだ各種類へ合計i個の同一単位pairを追加するとき。

M+1 bucketへのpair分配をC(M+i,i)で数える。

## 問題固有の要素

順序制約は最後にmultisetを1通りの非減少列へ並べる段階で処理し、それ以前はlabel付き列としてXORと重複構造を数える方が対称性を使いやすい。

別の問題へ持ち帰る視点: 順序・値域・演算制約が絡む数え上げでは、いったんlabel付き対象を数え、distinct coreとmultiplicityを経由してcanonical順序へ戻す分解を検討する。

## 正当性

非減少列は各値の出現回数で一意に決まり、xorへ寄与するのは奇数回の値だけである。まず順序自由の列数f(L)を、Mとの比較確定数とxorの各bitのparityで数える。同値位置のblock分割により、相異なる値を使う項g(L)以外は、少ない奇数block数の既知gと偶数blockへの値割当へ分解できるため、Lの昇順に差し引いてgを求められる。最終列は奇数出現値を一回ずつ置いた集合と、残りi個の同値pairの配分に一意に分かれる。g(N−2i)/(N−2i)!とC(M+i,i)の積を全iで足すと全列を一回ずつ数える。

## 実装上の注意

- f(L)のbit DPでは、既にM未満の要素の当該bit割当はXOR parity別の通り数を使い、未確定要素はMのbitを超えない選択だけ許す。
- g(L)は右辺にg(j),j<Lだけが現れる順序で計算し、mod減算を正規化する。
- factorial inverseはL≤200なので存在し、C(M+i,i)はi!の逆元と連続するM+1..M+iの積でmod計算する。

## 復習の核

- 小さいM,Nで列を全列挙し、各列を奇数multiplicityのdistinct coreと追加pairへ分解して、g(L)/L!とC(M+i,i)の役割を照合する。

## 計算量と制約

### 時間

O(BN³)、B=30。各長さのdigit DPとodd/even partition補正を全次数で前計算。

### 空間

O(N²)、組合せ・分割係数と一桁DP。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 200; 0 \leq M \lt 2^{30}; 0 \leq X \lt 2^{30}; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2,M=1,X=0、非減少列の要素域0,1。

1. 候補は(0,0),(0,1),(1,1)。
2. xor0は等値の最初と最後だけ。

期待される結果: 2列。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

X=1へ変更すると何列か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

相異なるodd頻度値0,1を各一回使う(0,1)だけで1列。等値pairはxorを変えない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/editorial/5663) — source-abc288-editorial-5663-0e59e0a47ff7c846b431cd85eb6f5669dc38c4243c36f811296d18c5514da0b9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/tasks/abc288_h) — source-abc288-ex-problem-6f21ea4475a77f8e377b32b767a6c52e5b5bb43155a45d4a23887fd82fa1664c
