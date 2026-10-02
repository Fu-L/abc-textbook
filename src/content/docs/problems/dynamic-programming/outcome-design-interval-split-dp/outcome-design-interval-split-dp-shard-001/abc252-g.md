---
title: "ABC252-G — Pre-Order"
draft: true
authoringUnit: {"problemId":"abc252-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc252-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc252-editorial-3999-5b2717dd1df94942cb59daa50c900cd1837cc938ecd38742b5a848ceacf25e6b","source-abc252-g-problem-228c5b0b2f3d0d7de2e819e38eedfdb28c3778d3434903e386bc3b0ec241e3ad"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"先行順で部分木の頂点は必ず連続区間になる。森の最初の根、その子の区間、続く兄弟の区間を切り出す位置は、実際の木から一意に決まる。逆に各区間が巡回条件を満たし、連続する兄弟の根番号が増加していれば、結合して同じ先行順の木を復元できる。各分割の左右の個数を掛けて全終端位置を足す区間DPはこの対応を数えている。空の森を1通りとすることで葉と最後の兄弟も含まれ、区間長に関する帰納法で正しい。","sourceRevisionIds":["source-abc252-editorial-3999-5b2717dd1df94942cb59daa50c900cd1837cc938ecd38742b5a848ceacf25e6b","source-abc252-g-problem-228c5b0b2f3d0d7de2e819e38eedfdb28c3778d3434903e386bc3b0ec241e3ad"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-interval-split-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"先行順P=(1,2)、頂点1を根とする木。","procedure":["残り頂点2は1の唯一の子。","子区間[2]と残り空区間を分ける。"],"executionTarget":null,"expectedResult":"可能木1個。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-interval-composition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-interval-split-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"空区間DPを0にしてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"子がない森は一通りなので1。0だと葉や最後の子の積も全て消える。"},"answer":{"reasoningOrVerification":"子がない森は一通りなので1。0だと葉や最後の子の積も全て消える。","procedure":["具体例の各状態・寄与を再計算する。","子がない森は一通りなので1。0だと葉や最後の子の積も全て消える。"],"expectedResult":"子がない森は一通りなので1。0だと葉や最後の子の積も全て消える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

先行順巡回では各部分木の頂点が連続区間になり、子を頂点番号昇順で訪れる条件は、次の子部分木の根番号に大小制約を与える。

採用する候補: 部分木区間を分割する区間DP

先行順列の連続区間を一つの部分木として数え、最初の子部分木の終端を列挙すれば、根番号条件を確認しながら二つの独立な区間へ分解できる。

棄却する候補: 各頂点の親を独立に選んで木を列挙

親候補の組合せが指数的なうえ、連結性と巡回順の整合を後から判定する必要がある。

先行順の先頭要素が区間部分木の根であり、その直後から各子部分木が途切れず並ぶ。

仮想根や空区間を用意すると、最初の子を取らない場合と一つの子部分木を切り出す場合を同じ漸化式で数えられる。

先行順列に仮想根を加え、dp[l][r]を区間[l,r)から条件を満たす森・部分木を作る数として定義する。最初の子部分木の終端kを列挙し、根番号の大小条件を満たすとき左右区間の積を加え、法998244353で答えを得る。

## 典型の発動条件

### 先行順の区間性

発動条件: 木の巡回列から部分木の境界を復元・数え上げたい。

各部分木を先行順上の連続区間として区間DPの状態にする。

### 区間分割DP

発動条件: 列の先頭を含む構造と残りが境界位置で独立になる。

子部分木の終端を列挙し、部分問題の積を加算する。

## 問題固有の要素

子を番号昇順で訪れる規則は、巡回列そのものの単調性ではなく、連続する子部分木の根同士の条件として区間分割時に検査する。

別の問題へ持ち帰る視点: 巡回順制約付き木の数え上げでは、部分木の連続性と兄弟順の局所条件を組み合わせて区間DPへ落とす。

## 正当性

先行順で部分木の頂点は必ず連続区間になる。森の最初の根、その子の区間、続く兄弟の区間を切り出す位置は、実際の木から一意に決まる。逆に各区間が巡回条件を満たし、連続する兄弟の根番号が増加していれば、結合して同じ先行順の木を復元できる。各分割の左右の個数を掛けて全終端位置を足す区間DPはこの対応を数えている。空の森を1通りとすることで葉と最後の兄弟も含まれ、区間長に関する帰納法で正しい。

## 実装上の注意

- 区間を半開区間で統一し、空部分の値を1とする。仮想根の添字、根番号比較の向き、答えに使う区間を小ケースで確認し、全加算を法998244353で行う。

## 復習の核

- N≤8で全親配列を列挙した答えと比較し、単調な順列、根直下に複数子がある木、深い一本鎖、分割端が空になる場合を確認する。

## 計算量と制約

### 時間

O(N³)、区間数N²×最初の子の終端N。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 500; 1 \leq P_i\leq N; P_1=1; All P_i are distinct.; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

先行順P=(1,2)、頂点1を根とする木。

1. 残り頂点2は1の唯一の子。
2. 子区間[2]と残り空区間を分ける。

期待される結果: 可能木1個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

空区間DPを0にしてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

子がない森は一通りなので1。0だと葉や最後の子の積も全て消える。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/editorial/3999) — source-abc252-editorial-3999-5b2717dd1df94942cb59daa50c900cd1837cc938ecd38742b5a848ceacf25e6b
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc252/tasks/abc252_g) — source-abc252-g-problem-228c5b0b2f3d0d7de2e819e38eedfdb28c3778d3434903e386bc3b0ec241e3ad
