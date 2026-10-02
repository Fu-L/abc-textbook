---
title: "ABC288-E — Wish List"
draft: true
authoringUnit: {"problemId":"abc288-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-001/abc288-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc288-e-problem-15cf566edfd9f31b80f5ca5d322329f4a4a29a6521bdd4cf87915262817ef427","source-abc288-editorial-5659-5ba9ee2cd7f0cc7cd4a06ec5bdcc18492d47530691265e993c706e1a745a0a74"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"i番までにj個買うと次itemの取り得る付加費用範囲が選択数だけで決まる。その最小はsuffix minで得られ、採用公式構成で同時達成できる。欲しいitemは必ず購入、任意itemは両択として全subsetを列挙し、同(i,j)最小costが将来に優越する。","sourceRevisionIds":["source-abc288-e-problem-15cf566edfd9f31b80f5ca5d322329f4a4a29a6521bdd4cf87915262817ef427","source-abc288-editorial-5659-5ba9ee2cd7f0cc7cd4a06ec5bdcc18492d47530691265e993c706e1a745a0a74"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-resource-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、A=(5,7),C=(3,1)、欲しいitemは2だけ。","procedure":["2だけ買うと付加cost C2=1、合計8。","両方買うと1に5+3、2に7+min(3,1)=8、合計16。","余分購入は不要。"],"executionTarget":null,"expectedResult":"8","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-resource"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-resource-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"欲しいitemにskip遷移を残してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。必要itemを買わない解が安くなり問題条件を破る。"},"answer":{"reasoningOrVerification":"不可。必要itemを買わない解が安くなり問題条件を破る。","procedure":["具体例の各状態・寄与を再計算する。","不可。必要itemを買わない解が安くなり問題条件を破る。"],"expectedResult":"不可。必要itemを買わない解が安くなり問題条件を破る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

最終的に買うitem集合を昇順B_1<…<B_Kと固定すると、B_i購入時に先行するB_1..B_{i-1}のうち既購入の個数xだけ、売れ残り中のrankがB_i-xへ下がる。 xは0..i-1を取り得るため、B_iの追加費用はA_{B_i}+min(C_{B_i},C_{B_i-1},…,C_{B_i-i+1})以上で、この下界は購入順を選べば同時に達成できる。 したがって購入順自体を状態にせず、買う集合を番号順に選ぶ最適化へ帰着できる。 固定集合で各itemが得られる最小Cは、そのitemより小さい購入予定item数だけで決まり、具体的な購入時刻は消去できる。 cost(i,j)=min(cost(i,j-1),C_{i-j})なので、全i,jの区間最小を二次時間で前計算できる。

採用する候補: cost(i,j)=min C_{i-j..i}を前計算し、先頭i itemからj個買った最小費用をDPする。

欲しいitemの強制選択と任意itemの追加購入を同じ遷移で扱い、固定集合に対する達成可能な最小費用を加算できる。

棄却する候補: その時点で最も安い購入価格のitemをgreedyに選ぶ。

任意itemを先に買うことで将来のrankとCが変わるため、現在価格だけの局所選択は後続費用を評価できない。

棄却する候補: 欲しいM itemだけを買う前提で順番を最適化する。

安い追加itemを買ってrankをずらす方が、合計で得になる場合を除外してしまう。

固定集合で各itemが得られる最小Cは、そのitemより小さい購入予定item数だけで決まり、具体的な購入時刻は消去できる。

cost(i,j)=min(cost(i,j-1),C_{i-j})なので、全i,jの区間最小を二次時間で前計算できる。

各iについてcost(i,0)=C_iからjを増やしてsuffix minimumを作る。dp[i][j]をitem 1..iの選択を決め、そのうちj個を買う最小費用とし、dp[0][0]=0。item i+1を買うならdp[i+1][j+1]へA_{i+1}+cost(i+1,j)を加え、不要itemなら買わない遷移も行う。wishlist itemでは買わない遷移を禁止し、min_j dp[N][j]を答える。

## 典型の発動条件

### 操作順の集合コスト化

発動条件: 選んだ対象集合を固定すると、最適な操作順の費用が各要素のrankだけで表せるとき。

購入順を消去し、昇順集合B_iごとの下界兼達成値へ置き換える。

### 選択個数DP

発動条件: 番号順に必須・任意要素を選び、次のcostが過去の選択数に依存するとき。

prefixで買った個数jを状態にする。

### 区間minの漸化前計算

発動条件: 左端を1つずつ伸ばす区間最小を全長について使うとき。

直前のminimumと新要素のminで更新する。

## 問題固有の要素

item B_iを買う瞬間のrank候補はB_i,B_i-1,…,B_i-i+1に限られ、その中の最安Cを全itemで同時達成できる購入順がある。

別の問題へ持ち帰る視点: 順序依存操作では、固定した最終集合に対する各要素の可能rank範囲と、個別下界が同時達成可能かを分けて証明する。

## 正当性

i番までにj個買うと次itemの取り得る付加費用範囲が選択数だけで決まる。その最小はsuffix minで得られ、採用公式構成で同時達成できる。欲しいitemは必ず購入、任意itemは両択として全subsetを列挙し、同(i,j)最小costが将来に優越する。

## 実装上の注意

- cost(i,j)のC indexはi-j以上1であり、jはiより前に買えるitem数までに制限する。
- 費用総和は32bitを超えるので64bit整数と十分大きいINFを使う。
- wishlist判定をboolean arrayにし、必須itemでskip遷移を入れない。

## 復習の核

- 3 item程度で追加itemを買うcaseを固定し、各B_iのrank候補とcost下界を達成する購入順、DPのjが一致するかを確認する。

## 計算量と制約

### 時間

N item。j選択数のsuffix min前計算とDPで O(N²)。

### 空間

cost全表とDP全表なら O(N²)、DPはrolling O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq M \leq N \leq 5000; 1 \leq A_i \leq 10^9; 1 \leq C_i \leq 10^9; 1 \leq X_1 \lt X_2 \lt \cdots \lt X_M \leq N; All values in the input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、A=(5,7),C=(3,1)、欲しいitemは2だけ。

1. 2だけ買うと付加cost C2=1、合計8。
2. 両方買うと1に5+3、2に7+min(3,1)=8、合計16。
3. 余分購入は不要。

期待される結果: 8

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

欲しいitemにskip遷移を残してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。必要itemを買わない解が安くなり問題条件を破る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/tasks/abc288_e) — source-abc288-e-problem-15cf566edfd9f31b80f5ca5d322329f4a4a29a6521bdd4cf87915262817ef427
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc288/editorial/5659) — source-abc288-editorial-5659-5ba9ee2cd7f0cc7cd4a06ec5bdcc18492d47530691265e993c706e1a745a0a74
