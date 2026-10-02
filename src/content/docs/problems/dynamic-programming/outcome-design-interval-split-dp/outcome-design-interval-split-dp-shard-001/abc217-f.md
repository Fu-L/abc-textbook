---
title: "ABC217-F — Make Pair"
draft: true
authoringUnit: {"problemId":"abc217-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc217-f.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp","tag-combinatorial-coefficients"],"sourceRevisionIds":["source-abc217-editorial-2584-8b09223995860d1173156e579e5a3393e1a9a7dae0cd254195e0983a3f36ff57","source-abc217-f-problem-b52dba85a66465d286aa18201efb35ca00d135494c7ba865c3b40408a541133e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"左端の相手を固定すると二人を隣接させるため内側を先に全除去する必要がある。内側完了＋当該pairのk操作と右側N−k操作は互いに独立で相対順を保つshuffleがC(N,k)通り。相手選択で分類は排他的、区間帰納法で全除去列を数える。","sourceRevisionIds":["source-abc217-editorial-2584-8b09223995860d1173156e579e5a3393e1a9a7dae0cd254195e0983a3f36ff57","source-abc217-f-problem-b52dba85a66465d286aa18201efb35ca00d135494c7ba865c3b40408a541133e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-interval-split-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"4人、許可pair(1,2),(3,4)のみ。","procedure":["左pairと右pairは初期から隣接。","除去順は12→34または34→12。","C(2,1)=2。"],"executionTarget":null,"expectedResult":"2","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-interval-composition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-interval-split-dp"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-dp-state-design"],"attainmentCondition":"許可pairが(1,4),(2,3)のみなら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"先に内側23、その後14が強制され1通り。"},"answer":{"reasoningOrVerification":"先に内側23、その後14が強制され1通り。","procedure":["具体例の各状態・寄与を再計算する。","先に内側23、その後14が強制され1通り。"],"expectedResult":"先に内側23、その後14が強制され1通り。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

二人が選ばれる時点では隣接しているため、最初の並びに弧を描くと最終的なペアは交差しない。特に区間の左端の生徒が位置 2k の生徒と組むなら、その二人の間にいる 2k-2 人は先に区間内だけで消えていなければならない。 サンプル2では同じ二組を作っても取り除く順番が違えば別解として数えるため、非交差なペア分割の個数だけでなく、独立な区間の操作列を混ぜる順番も数える必要がある。 左端と位置 2k の生徒が仲良しなら、内側 k-1 組の処理後にその二人を消す k 操作と、右側 j-k 操作を二項係数 C(j,k) 通りに interleave できる。

採用する候補: 偶数長区間を全員取り除く方法数とし、左端の相手で分割する区間 DP に、左右の操作を混ぜる二項係数を掛ける。

左端の相手を固定すると内側と右側が独立な偶数長区間になり、仲の良さ、ペア構造、操作順の三要素を過不足なく積に分解できる。

棄却する候補: 各時点で隣接する仲の良い組を列挙し、削除列を再帰的に全探索する。

同じ残存区間構造へ至る多数の順番を個別に探索するため指数的に分岐し、2N=400 では扱えない。

左端と位置 2k の生徒が仲良しなら、内側 k-1 組の処理後にその二人を消す k 操作と、右側 j-k 操作を二項係数 C(j,k) 通りに interleave できる。

dp[i][j] を生徒 i+1 から i+2j を全て消す方法数とし、左端の相手 i+2k を全て試す。仲良しの場合に dp[i+1][k-1]、dp[i+2k][j-k]、C(j,k) を掛けて加算し、空区間を 1 とする。

## 典型の発動条件

### 端点固定の区間 DP

発動条件: 隣接要素の削除によって元の列の区間が独立に閉じ、最終的な対応が非交差になるとき。

左端の相手を固定して内側と残りの右区間へ分割し、短い偶数長区間から計算する。

### 独立な操作列の interleave

発動条件: 独立な二部分の完成方法に加え、両部分の操作を行う時系列も区別して数えるとき。

一方から k 回、他方から j-k 回を選ぶ位置を二項係数 C(j,k) で数える。

## 問題固有の要素

外側の一組は内側を全て消した後で初めて隣接するため、その組自身の削除を内側ブロックの最後の一操作として数える。

別の問題へ持ち帰る視点: 削除過程を数える問題では、完成した組合せだけでなく各依存関係が作る操作順の自由度を別因子として確認する。

## 正当性

左端の相手を固定すると二人を隣接させるため内側を先に全除去する必要がある。内側完了＋当該pairのk操作と右側N−k操作は互いに独立で相対順を保つshuffleがC(N,k)通り。相手選択で分類は排他的、区間帰納法で全除去列を数える。

## 実装上の注意

- 区間長は人数ではなく組数 j で管理し、左端の相手は偶奇から i+2k だけを試す。全 i について dp[i][0]=1 とし、添字と法 998244353 の積を崩さない。

## 復習の核

- N=2 で離れた二組が独立に消える例を作り、二項係数を掛けない数え方が操作順を落とすことを確認する。

## 計算量と制約

### 時間

生徒2N人、友好辺M。区間と左端相手列挙で O(N³)、二項係数前計算O(N²)。

### 空間

区間DPと二項係数 O(N²)、友好表 O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 200; 0 \leq M \leq N(2N-1); 1 \leq A_i < B_i \leq 2N; All pairs (A_i, B_i) are distinct.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

4人、許可pair(1,2),(3,4)のみ。

1. 左pairと右pairは初期から隣接。
2. 除去順は12→34または34→12。
3. C(2,1)=2。

期待される結果: 2

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

許可pairが(1,4),(2,3)のみなら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

先に内側23、その後14が強制され1通り。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/editorial/2584) — source-abc217-editorial-2584-8b09223995860d1173156e579e5a3393e1a9a7dae0cd254195e0983a3f36ff57
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc217/tasks/abc217_f) — source-abc217-f-problem-b52dba85a66465d286aa18201efb35ca00d135494c7ba865c3b40408a541133e
