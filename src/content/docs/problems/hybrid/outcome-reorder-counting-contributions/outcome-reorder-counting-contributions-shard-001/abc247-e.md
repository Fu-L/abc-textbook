---
title: "ABC247-E — Max Min"
draft: true
authoringUnit: {"problemId":"abc247-e","docPath":"src/content/docs/problems/hybrid/outcome-reorder-counting-contributions/outcome-reorder-counting-contributions-shard-001/abc247-e.md","learningOutcomeIds":["outcome-reorder-counting-contributions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。"],"tagIds":["tag-contribution-reordering"],"sourceRevisionIds":["source-abc247-e-problem-53e415f6d3d83bc8a82bd8a4cf4d2653566ae05d5ecc0a66e70d6e84b6849fbb","source-abc247-editorial-3736-974927d584c54ce2af9c7e02ec62854811379031ca77cc8ee90694be0db78020"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"固定した R で L>lastBad なら全要素は範囲内であり、X と Y の両方を含む条件は L≤min(lastX,lastY) になる。 したがって右端 R の寄与は max(0,min(lastX,lastY)-lastBad) で、全 R の寄与を足せば各区間をちょうど一度数える。 各右端に対する全条件を 3 個の index で表せ、X=Y も同じ式で線形に数えられる。","sourceRevisionIds":["source-abc247-e-problem-53e415f6d3d83bc8a82bd8a4cf4d2653566ae05d5ecc0a66e70d6e84b6849fbb","source-abc247-editorial-3736-974927d584c54ce2af9c7e02ec62854811379031ca77cc8ee90694be0db78020"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-reorder-counting-contributions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,3,2),X=3,Y=1。","procedure":["右端1はX未出なので0。","右端2,3は開始1だけが条件を満たし各1。"],"executionTarget":null,"expectedResult":"総数2。","verificationStatus":"not_applicable","learningUnitIds":["unit-contribution-reordering"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-reorder-counting-contributions"],"prerequisiteIds":[],"attainmentCondition":"X=Y=2の場合もlastX,lastYを別々に更新してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同じ位置で両方更新すれば式は有効。範囲内は2だけなので2の連続run内全区間を数える。"},"answer":{"reasoningOrVerification":"同じ位置で両方更新すれば式は有効。範囲内は2だけなので2の連続run内全区間を数える。","procedure":["具体例の各状態・寄与を再計算する。","同じ位置で両方更新すれば式は有効。範囲内は2だけなので2の連続run内全区間を数える。"],"expectedResult":"同じ位置で両方更新すれば式は有効。範囲内は2だけなので2の連続run内全区間を数える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [局所寄与へ分解して集計順を交換する](src/content/docs/learn/modeling/contribution-reordering.md)

- 数える対象を要素・組・値・区間のいずれかで一意に固定し、各対象が含まれる回数または指示変数の期待値を先に求めて総和できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- active集合を時刻・座標順に更新するevent sweep、更新列を逆から読むだけの処理、および成分ごとの解を単に掛け合わせる構造判定。

## 考察

最大値が X、最小値が Y なら、区間内の全要素は Y≤A_i≤X であり、さらに X と Y を少なくとも 1 回ずつ含む必要がある。

Y 未満または X 超の要素はどの有効区間にも含められず、列を独立な区間へ分断する境界になる。

採用する候補: 右端 R を左から動かし、直近の X、直近の Y、直近の範囲外要素の位置を持って、有効な左端数を加算する。

各右端に対する全条件を 3 個の index で表せ、X=Y も同じ式で線形に数えられる。

棄却する候補: 全 L,R を列挙し、各区間の最大値・最小値を更新または query して条件を判定する。

区間が二次個あり、N≤2×10^5 では最大最小を高速化しても列挙自体が間に合わない。

固定した R で L>lastBad なら全要素は範囲内であり、X と Y の両方を含む条件は L≤min(lastX,lastY) になる。

したがって右端 R の寄与は max(0,min(lastX,lastY)-lastBad) で、全 R の寄与を足せば各区間をちょうど一度数える。

lastX,lastY,lastBad を未出現値で初期化する。A_R が X,Y なら対応位置を R に更新し、範囲外なら lastBad=R とする。その後 max(0,min(lastX,lastY)-lastBad) を 64 bit の答えへ加える。

## 典型の発動条件

### 右端固定の区間数え上げ

発動条件: 区間条件を満たす左端が、右端ごとに連続した index 範囲になるとき。

必要値の直近出現位置と禁止境界から、有効な L の個数を差で求める。

### 直近位置の tracking

発動条件: 区間が特定要素を含む条件と、含んではならない要素の境界を同時に管理したいとき。

lastX,lastY で包含条件、lastBad で全要素が [Y,X] 内という条件を表す。

## 問題固有の要素

最大・最小の等号条件は、範囲外要素を境界として除いた後なら『X と Y を含む』だけになる。

別の問題へ持ち帰る視点: 区間の extremum 条件では、許容範囲外を separator にしてから境界値の出現条件へ変換する。

## 正当性

固定した R で L>lastBad なら全要素は範囲内であり、X と Y の両方を含む条件は L≤min(lastX,lastY) になる。 したがって右端 R の寄与は max(0,min(lastX,lastY)-lastBad) で、全 R の寄与を足せば各区間をちょうど一度数える。 各右端に対する全条件を 3 個の index で表せ、X=Y も同じ式で線形に数えられる。

## 実装上の注意

- X=Y のときは同じ A_R で lastX と lastY の両方を更新すれば式を変えずに使える。
- 区間数は N(N+1)/2 まで達するため、答えは 64 bit 整数で保持する。

## 復習の核

- X=Y の全要素一致例と、範囲外要素をまたげない例について、ある R の有効な L の範囲を実際に書かせる。

## 計算量と制約

### 時間

O(N)、三last位置。

### 空間

O(1)補助、入力保存時O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2 \times 10^5; 1 \leq A_i \leq 2 \times 10^5; 1 \leq Y \leq X \leq 2 \times 10^5; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,3,2),X=3,Y=1。

1. 右端1はX未出なので0。
2. 右端2,3は開始1だけが条件を満たし各1。

期待される結果: 総数2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

X=Y=2の場合もlastX,lastYを別々に更新してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じ位置で両方更新すれば式は有効。範囲内は2だけなので2の連続run内全区間を数える。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/tasks/abc247_e) — source-abc247-e-problem-53e415f6d3d83bc8a82bd8a4cf4d2653566ae05d5ecc0a66e70d6e84b6849fbb
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc247/editorial/3736) — source-abc247-editorial-3736-974927d584c54ce2af9c7e02ec62854811379031ca77cc8ee90694be0db78020
