---
title: "ABC415-E — Hungry Takahashi"
draft: true
authoringUnit: {"problemId":"abc415-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-grid-table-dp/outcome-design-grid-table-dp-shard-001/abc415-e.md","learningOutcomeIds":["outcome-design-grid-table-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。"],"tagIds":["tag-grid-table-dp"],"sourceRevisionIds":["source-abc415-e-problem-ac9fbcfc3aebee7e6adfdf8886e99b63ddbf454c4b9282d59d31a939f224b19b","source-abc415-editorial-13490-96982ae40cca5adfa7bb395c36335f4a42ef94bb25174d65daa86aec96c0dbcc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"dpはそのマスへ入る前に必要な最小所持金。後続へ必要額はdown/rightの小さい方で、その額から現在純増Bを引く。所持金非負条件を加えてmax(0,need−B)。どの額もこの最小以上なら同じ将来pathが可能なので局所最小が十分。","sourceRevisionIds":["source-abc415-e-problem-ac9fbcfc3aebee7e6adfdf8886e99b63ddbf454c4b9282d59d31a939f224b19b","source-abc415-editorial-13490-96982ae40cca5adfa7bb395c36335f4a42ef94bb25174d65daa86aec96c0dbcc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-grid-table-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"1×2、純増B=(−3,5)。","procedure":["goalではmax(0,−5)=0。","左ではmax(0,0−(−3))=3。","初期3なら左後0、右後5。"],"executionTarget":null,"expectedResult":"必要初期金3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-grid-table"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-grid-table-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"純増の全path総和が正なら初期0でよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。上例は総和2だが最初の支払3に足りない。全prefix非負が必要。"},"answer":{"reasoningOrVerification":"不可。上例は総和2だが最初の支払3に足りない。全prefix非負が必要。","procedure":["具体例の各状態・寄与を再計算する。","不可。上例は総和2だが最初の支払3に足りない。全prefix非負が必要。"],"expectedResult":"不可。上例は総和2だが最初の支払3に足りない。全prefix非負が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)

- グリッドまたは多次元表の依存方向と境界状態を定め、計算済みの局所近傍からDAG順に全状態を更新できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 一次元の初歩的なDP、部分集合・資源DP、および区間の分割点を列挙する区間DP。

## 考察

右／下へ一歩進むたびi+jが1増えるため、cell(i,j)を訪れる日はpathによらずi+j-1日目に固定される。 B_{i,j}=A_{i,j}-P_{i+j-1} とすれば各cell到着時の所持金変化になり、必要なのは全prefix所持金を非負にできるright/down pathと最小初期額である。 dpは現在cellでcoinsを回収・食費を払う前の額なので、現在のnet Bを得た後に次cellの必要額を満たす条件はcash≥nextNeed-Bである。 必要額は非負に制限されるためBが十分正なら0でよい。grid外の遷移を∞とすればedge/cornerも同じ式で処理できる。

採用する候補: dp[i][j]をcell到着直前に必要な最小所持金としてgoalから逆向きに計算する

次cellへ必要な額の小さい方を選び、現在の純増Bを差し引いて0未満をclampすれば dp=max(0,min(down,right)-B)。局所最適が将来必要額を完全に表す。

棄却する候補: 初期額xをbinary searchし、各xについて到達可能cellと最大残金をforward DPする

判定一回O(HW)にさらにlog answerが掛かり、必要資金を逆算すれば一回のDPで厳密値が得られる。

dpは現在cellでcoinsを回収・食費を払う前の額なので、現在のnet Bを得た後に次cellの必要額を満たす条件はcash≥nextNeed-Bである。

必要額は非負に制限されるためBが十分正なら0でよい。grid外の遷移を∞とすればedge/cornerも同じ式で処理できる。

各cellのB=A-P_{i+j-1}を計算する。i=H..1,j=W..1の逆順で、goalはmax(0,-B)、他はmax(0,min(dp[i+1][j],dp[i][j+1])-B)とする。dp[1][1]を出力し、rolling rowでもO(W) memoryにできる。

## 典型の発動条件

### 必要資源の逆向きDP

発動条件: 各地点で資源が増減し、終点までprefix非負にする最小開始資源を求めるとき。

後続の必要額から現在の純増を引き、0でclampして逆算する。

### 時刻の座標不変量

発動条件: monotone grid pathでevent costがstep番号に依存するとき。

i+j-1が訪問日と固定されることからcell weightへ日別costを埋め込む。

## 問題固有の要素

日ごとの食費をpath状態として持たず、monotone移動の対角線番号へ吸収すると、通常のweighted grid DPになる。

別の問題へ持ち帰る視点: step依存costがある格子路では、全pathが同じ座標へ同じstepで着くrank関数がないか先に調べる。

## 正当性

dpはそのマスへ入る前に必要な最小所持金。後続へ必要額はdown/rightの小さい方で、その額から現在純増Bを引く。所持金非負条件を加えてmax(0,need−B)。どの額もこの最小以上なら同じ将来pathが可能なので局所最小が十分。

## 実装上の注意

- goalでもその日の回収後にPを払うためmax(0,-B_goal)が必要。差と累積必要額は64 bitを使い、H=1またはW=1の唯一pathも扱う。

## 復習の核

- 1×1、全B正、最初に大赤字後で黒字、二pathで最終利益とprefix不足が逆転する例を全pathのprefix和と比較する。

## 計算量と制約

### 時間

H×Wマス。逆順DP O(HW)。

### 空間

rolling row O(W)、入力A保持なら O(HW)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: H,W\geq 1; H\times W \leq 2\times 10^5; 1\leq A_{i,j}\leq 10^9; 1\leq P_k\leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

1×2、純増B=(−3,5)。

1. goalではmax(0,−5)=0。
2. 左ではmax(0,0−(−3))=3。
3. 初期3なら左後0、右後5。

期待される結果: 必要初期金3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

純増の全path総和が正なら初期0でよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。上例は総和2だが最初の支払3に足りない。全prefix非負が必要。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc415/tasks/abc415_e) — source-abc415-e-problem-ac9fbcfc3aebee7e6adfdf8886e99b63ddbf454c4b9282d59d31a939f224b19b
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc415/editorial/13490) — source-abc415-editorial-13490-96982ae40cca5adfa7bb395c36335f4a42ef94bb25174d65daa86aec96c0dbcc
