---
title: "ABC419-E — Subarray Sum Divisibility"
draft: true
authoringUnit: {"problemId":"abc419-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc419-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc419-e-problem-9745e23ca858252ce68f4b06c24710e6580f6033bbb7ecf3ee09ca6b8e9fa693","source-abc419-editorial-13669-ea28eb62bdc6407b05afcca3ca925a26b0d33500cf664daecef4d5e1abdacf53"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"隣接窓差は最終値A_i−A_{i+L}なので、全窓を0modMにするなら各index classのresidueが同じでなければならない。逆にこの一致と最初の窓residue0で全窓0が保証される。classの共通residue k固定時、各要素をそこへ増やす最小非負量は(k−A_i)modMで独立。classを一回ずつ処理するDPは全residue選択を網羅し、最初の窓は各class一要素ずつなので最終residue0が必要十分。","sourceRevisionIds":["source-abc419-e-problem-9745e23ca858252ce68f4b06c24710e6580f6033bbb7ecf3ee09ca6b8e9fa693","source-abc419-editorial-13669-ea28eb62bdc6407b05afcca3ca925a26b0d33500cf664daecef4d5e1abdacf53"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-resource-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3,L=2,M=3,A=(0,1,2)。","procedure":["class1は0,2で、residue0費用1、1費用3、2費用2。","class2は1で、residue0費用2、1費用0、2費用1。","和0mod3候補は(0,0):3,(1,2):4,(2,1):2。"],"executionTarget":null,"expectedResult":"2（最終列2,1,2）","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-resource"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-resource-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"同classを同じ整数値まで増やす必要があるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ない。窓和の条件はmodMだけなので同residueで十分。M倍の余分な増加を避ける。"},"answer":{"reasoningOrVerification":"ない。窓和の条件はmodMだけなので同residueで十分。M倍の余分な増加を避ける。","procedure":["具体例の各状態・寄与を再計算する。","ない。窓和の条件はmodMだけなので同residueで十分。M倍の余分な増加を避ける。"],"expectedResult":"ない。窓和の条件はmodMだけなので同residueで十分。M倍の余分な増加を避ける。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

全length-L window sumがmod Mで等しい条件は、隣り合うwindow差A_i-A_{i+L}≡0と同値である。さらに最初のwindow sum≡0なら全windowが0になる。 よって同じindex mod Lの列A_i,A_{i+L},...は最終的に共通residueを持つ必要があり、residueを決めれば各要素の最小incrementは独立に決まる。 同じclassの各値をkへ合わせるには余りを一周以上増やす利点がなく、incrementは一意に(k-A_p+M) mod Mの最小非負値でよい。 class iの代表residue kは最初のwindowにちょうど一回現れるため、全classのk和≡0が最初のwindow divisibilityそのものになる。

採用する候補: 各residue class iと目標値kのcost f[i][k]を前計算し、最初のL要素のresidue和を0にするmod M knapsack DP

fはΣ((k-A_p) mod M)。L個のclassについて選んだkの和mod Mを状態にすればO(NM+LM^2)で最小総incrementを得られる。

棄却する候補: 各A_iへのincrement 0..M-1を全列挙し、全window条件を検査する

M^N候補があり、window差からindex mod Lごとに同じresidueになる強制構造を使っていない。

同じclassの各値をkへ合わせるには余りを一周以上増やす利点がなく、incrementは一意に(k-A_p+M) mod Mの最小非負値でよい。

class iの代表residue kは最初のwindowにちょうど一回現れるため、全classのk和≡0が最初のwindow divisibilityそのものになる。

i=1..L,k=0..M-1についてf[i][k]=Σ_{p=i,i+L,...}((k-A_p+M)%M)を計算する。dp[0]=0から各class iを処理し、next[(r+k)%M]=min(next,dp[r]+f[i][k])と更新する。L class後のdp[0]を出力する。

## 典型の発動条件

### sliding-window差分

発動条件: 同じ長さの隣接window制約を要素間関係へ変えるとき。

window sum差からA_i≡A_{i+L}を導く。

### 剰余class分解

発動条件: indexがL離れた要素に同じmod条件が連鎖するとき。

index mod Lごとに目標residueと合わせるcostを独立前計算する。

### mod knapsack DP

発動条件: 複数groupからresidueを一つずつ選び、総和mod Mを指定したいとき。

classごとのcostを用いて累積residue0の最小値を求める。

## 問題固有の要素

全windowを直接制約にせず、隣接差でL本のresidue chainと代表和一条件だけに分解する。

別の問題へ持ち帰る視点: 重なる固定長window制約は、隣接windowの差を取って離れた要素の周期関係を抽出する。

## 正当性

隣接窓差は最終値A_i−A_{i+L}なので、全窓を0modMにするなら各index classのresidueが同じでなければならない。逆にこの一致と最初の窓residue0で全窓0が保証される。classの共通residue k固定時、各要素をそこへ増やす最小非負量は(k−A_i)modMで独立。classを一回ずつ処理するDPは全residue選択を網羅し、最初の窓は各class一要素ずつなので最終residue0が必要十分。

## 実装上の注意

- incrementは負方向にできないのでmod差の最小非負代表を使う。cost最大はN(M-1)でint範囲内でもINF加算を安全にし、L=Nのclass長1も扱う。

## 復習の核

- L=1、L=N、既に全window divisible、同classでwrapが必要な例をincrement全探索と比較する。

## 計算量と制約

### 時間

N 要素、法 M、窓長 L。class費用化 O(NM)、residue合成 O(LM²)、全体 O(NM+LM²)。

### 空間

class費用O(LM)、rollingDP O(M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M \leq 500; 1 \leq L \leq N; 0 \leq A_i < M; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3,L=2,M=3,A=(0,1,2)。

1. class1は0,2で、residue0費用1、1費用3、2費用2。
2. class2は1で、residue0費用2、1費用0、2費用1。
3. 和0mod3候補は(0,0):3,(1,2):4,(2,1):2。

期待される結果: 2（最終列2,1,2）

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同classを同じ整数値まで増やす必要があるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ない。窓和の条件はmodMだけなので同residueで十分。M倍の余分な増加を避ける。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/tasks/abc419_e) — source-abc419-e-problem-9745e23ca858252ce68f4b06c24710e6580f6033bbb7ecf3ee09ca6b8e9fa693
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc419/editorial/13669) — source-abc419-editorial-13669-ea28eb62bdc6407b05afcca3ca925a26b0d33500cf664daecef4d5e1abdacf53
