---
title: "ABC322-E — Product Development"
draft: true
authoringUnit: {"problemId":"abc322-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-002/abc322-e.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc322-e-problem-1bed777da02da0d0fb2cd0ffc183daef2bab75c1085e50520ea13f3d19842abb","source-abc322-editorial-7305-a1eb089617d41a3e23c589f3f11562591487672b8c226f6dd460c7253bf68101"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"各parameterはP以上で将来区別不要なのでcapが安全。同じcapvectorへの到達はcost小が常に有利。各planで不採用・採用一回を旧行から生成する帰納法により全subset最小costを得る。","sourceRevisionIds":["source-abc322-e-problem-1bed777da02da0d0fb2cd0ffc183daef2bab75c1085e50520ea13f3d19842abb","source-abc322-editorial-7305-a1eb089617d41a3e23c589f3f11562591487672b8c226f6dd460c7253bf68101"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-resource-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"K=2,P=2、plan1 cost3効果(2,0)、plan2 cost4効果(0,2)、plan3 cost10効果(2,2)。","procedure":["1,2採用で状態(2,2)、cost7。","3単独もgoalだがcost10。","同goalに最小7だけ残す。"],"executionTarget":null,"expectedResult":"7","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-resource"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-resource-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"同じ行へin-place昇順更新してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。一planを何度も採る可能性がある。nextを旧dpから作る。"},"answer":{"reasoningOrVerification":"不可。一planを何度も採る可能性がある。nextを旧dpから作る。","procedure":["具体例の各状態・寄与を再計算する。","不可。一planを何度も採る可能性がある。nextを旧dpから作る。"],"expectedResult":"不可。一planを何度も採る可能性がある。nextを旧dpから作る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

各parameterは目標Pを超えた量が以後の達成可否やcostへ影響しないため、値をmin(value,P)へcapできる。 K,P≤5なので、cap後のparameter vectorは各成分0..Pの(P+1)^K通りしかない。 各planは一度だけ使えるので、planを順に見てskip/takeする0/1 DPにできる。 状態aからplan iを取った先は各jでa'_j=min(P,a_j+A_{i,j})となり、将来に必要な情報を完全に保持する。 vectorをbase P+1の整数へencodeすれば、固定長array上で全状態を走査できる。

採用する候補: capしたK次元parameter vectorを状態とし、各planの不採用・採用をrolling DPで更新する。

2^Nのsubsetを同じ到達parameterへ集約し、各状態には最小costだけを残せる。

棄却する候補: 全plan subsetを列挙してparameterとcostを計算する。

N≤100で2^N通りは扱えない。

棄却する候補: costあたりparameter増加が大きいplanからgreedyに選ぶ。

K個の不足方向が異なり、1つの比率では相補的なplan組合せの最小costを決められない。

状態aからplan iを取った先は各jでa'_j=min(P,a_j+A_{i,j})となり、将来に必要な情報を完全に保持する。

vectorをbase P+1の整数へencodeすれば、固定長array上で全状態を走査できる。

state数D=(P+1)^K、dp[0-vector]=0、他INFで始める。各planについてnext=dpを作り、全stateをdecodeして各成分をPでcapしながらA_iを加えたtoをencodeし、next[to]=min(next[to],dp[state]+C_i)とする。dp=nextを繰り返し、全digit PのgoalがINFなら-1、否则そのcostを出力する。

## 典型の発動条件

### 達成thresholdでの状態cap

発動条件: 値が目標以上かだけが重要で、増加操作しかないとき。

各parameterをPで打ち切り有限状態化する。

### 多次元状態のmixed-radix encode

発動条件: 各成分が小さい固定範囲のvector DP。

base P+1の1整数へ写してdense arrayを使う。

### 0/1 item DP

発動条件: 各planを高々一度だけ選ぶ最小cost問題。

前layerからskip/takeの2遷移を行う。

## 問題固有の要素

parameterの実値は最大ΣAまで伸びるが、全成分について「P未満の正確値」または「達成済みP」のK桁だけが選択の将来効果を決める。

別の問題へ持ち帰る視点: 単調resourceを複数持つ最適化では、各目標thresholdで同値状態をまとめてstate productを小さくする。

## 正当性

各parameterはP以上で将来区別不要なのでcapが安全。同じcapvectorへの到達はcost小が常に有利。各planで不採用・採用一回を旧行から生成する帰納法により全subset最小costを得る。

## 実装上の注意

- 同じplanを複数回使わないよう、更新先を別arrayにするか、元dp snapshotからのみ遷移する。
- 最小costは最大100×10^9なので64bit整数と十分大きいINFを使う。

## 復習の核

- Pを超える増加を含む2-parameter例をencodeし、異なる実値が同じcap状態へmergeされても将来の最小costを失わないか確認する。

## 計算量と制約

### 時間

N plan、K parameter、目標P、状態D=(P+1)^K。decode/update O(K)で O(NKD)。

### 空間

rolling dp O(D)、入力 O(NK)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 100; 1 \le K,P \le 5; 0 \le A_{i,j} \le P(1 \le i \le N,1 \le j \le K); 1 \le C_i \le 10^9(1 \le i \le N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

K=2,P=2、plan1 cost3効果(2,0)、plan2 cost4効果(0,2)、plan3 cost10効果(2,2)。

1. 1,2採用で状態(2,2)、cost7。
2. 3単独もgoalだがcost10。
3. 同goalに最小7だけ残す。

期待される結果: 7

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同じ行へin-place昇順更新してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。一planを何度も採る可能性がある。nextを旧dpから作る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc322/tasks/abc322_e) — source-abc322-e-problem-1bed777da02da0d0fb2cd0ffc183daef2bab75c1085e50520ea13f3d19842abb
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc322/editorial/7305) — source-abc322-editorial-7305-a1eb089617d41a3e23c589f3f11562591487672b8c226f6dd460c7253bf68101
