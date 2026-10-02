---
title: "ABC400-F — Happy Birthday! 3"
draft: true
authoringUnit: {"problemId":"abc400-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-002/abc400-f.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc400-editorial-12625-0aebf97f723a76a0781e1ed9313a600be3b28cebc52c35a97eb9b75015211e58","source-abc400-f-problem-f05c34f1b8e095a282536aee51bb76a0783529f28ada451225a15a3fb7126e5a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"逆向きでは、色 c の塗り操作を、既に消えた0または c のみを含む区間の消去へ置換する。最終消去の両端の不要な0を縮めても費用は増えないため端は c とできる。その内部の異色部分は先に独立消去されており、ep が c を残し他を消す最小費用を表す。区間全体を最後に消す候補と二部分への分割を網羅すれば、任意の消去列を分解できる。円では最終消去区間の境界を cut とすれば線形区間解で表せ、全 cut 最小が円の最適値と一致する。","sourceRevisionIds":["source-abc400-editorial-12625-0aebf97f723a76a0781e1ed9313a600be3b28cebc52c35a97eb9b75015211e58","source-abc400-f-problem-f05c34f1b8e095a282536aee51bb76a0783529f28ada451225a15a3fb7126e5a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-interval-split-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、C=(1,2,1)、X=(4,1,2)。","procedure":["円では隣接する両端の色1を長さ2の区間で塗り、費用2+4=6。","中央色2を長さ1で塗り、費用1+1=2。","各色を最低一回使い固定費5、三点への塗布が最低3なので下界8を達成。"],"executionTarget":null,"expectedResult":"8","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-interval-composition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-interval-split-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"一本道で1,2,1を全部色1に塗ってから中央2を上書きすると費用は。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"3+4+1+1=9。円の cut を固定して両端隣接を逃すと、最適8を失う。"},"answer":{"reasoningOrVerification":"3+4+1+1=9。円の cut を固定して両端隣接を逃すと、最適8を失う。","procedure":["具体例の各状態・寄与を再計算する。","3+4+1+1=9。円の cut を固定して両端隣接を逃すと、最適8を失う。"],"expectedResult":"3+4+1+1=9。円の cut を固定して両端隣接を逃すと、最適8を失う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
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

forwardの塗上書き順は複雑だが逆順では、最後に色cで塗られた区間を「現在0またはcだけの区間を0へ消す」操作として扱える。 最後の消去区間の両端はcのままとしてよく、その区間内外を跨ぐ過去操作は存在しないため、intervalを独立な小問題へ分割できる。 全区間[l,r)を最後に色C_lで消すcostはep[l][r]+(r-l)+X_{C_l}である。 epは同色の右端を残す遷移と、異色部分をdpで完全消去して分割する遷移から作れる。

採用する候補: 円を全cutで二重列へ開き、区間消去cost dpと指定色を残す補助epをO(N³)で計算する

最後の操作が全区間か途中分割かを網羅し、epで0または端色へする前処理を正確に表せる。N≤400なので立方時間が許容される。

棄却する候補: 現在一致しない最大連続区間をgreedyに塗る

後の上書きで異色区間を跨いでまとめる方がX_c固定費を節約でき、局所区間選択は最適性を持たない。

全区間[l,r)を最後に色C_lで消すcostはep[l][r]+(r-l)+X_{C_l}である。

epは同色の右端を残す遷移と、異色部分をdpで完全消去して分割する遷移から作れる。

Cを二周へ複製する。長さ昇順にdp[l][r]=min_m dp[l][m]+dp[m][r]を計算し、ep[l][r]を端色C_lを残す/部分消去する遷移で更新して全区間消去候補も取る。min_i dp[i][i+N]を出す。

## 典型の発動条件

### 操作の逆転とinterval DP

発動条件: 上書き操作の最後の作用範囲がsubproblemを分離するとき。

逆向きの消去として最後のintervalで分割する。

### circular interval DP

発動条件: 円環のcut位置が最適解に依存するとき。

列を二倍して全長N interval開始を試す。

## 問題固有の要素

固定費X_cのため異色部分を先に0へ消せば、最後のc操作でそれらを跨いで一括消去できることをepが表す。

別の問題へ持ち帰る視点: range overwrite最小costは逆操作でwildcard/emptyを許すinterval grammarへ変換する。

## 正当性

逆向きでは、色 c の塗り操作を、既に消えた0または c のみを含む区間の消去へ置換する。最終消去の両端の不要な0を縮めても費用は増えないため端は c とできる。その内部の異色部分は先に独立消去されており、ep が c を残し他を消す最小費用を表す。区間全体を最後に消す候補と二部分への分割を網羅すれば、任意の消去列を分解できる。円では最終消去区間の境界を cut とすれば線形区間解で表せ、全 cut 最小が円の最適値と一致する。

## 実装上の注意

- 半開区間と長さcost b=r-lを統一する。epの基底は左端色を残す条件を壊さず、二重列では長さNを超える区間を計算不要にできる。

## 復習の核

- N≤7で操作区間・色をbounded BFSし、同色が離れて現れるcase、全同色、cutを跨ぐ最適操作をDPと比較する。

## 計算量と制約

### 時間

円周 N 点。二重列の長さ≤N区間は O(N²)、各区間に O(N) 分割を試すため O(N³)。

### 空間

dp と補助 ep の区間表で O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 400; 1 \leq C_i \leq N; 1 \leq X_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、C=(1,2,1)、X=(4,1,2)。

1. 円では隣接する両端の色1を長さ2の区間で塗り、費用2+4=6。
2. 中央色2を長さ1で塗り、費用1+1=2。
3. 各色を最低一回使い固定費5、三点への塗布が最低3なので下界8を達成。

期待される結果: 8

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

一本道で1,2,1を全部色1に塗ってから中央2を上書きすると費用は。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

3+4+1+1=9。円の cut を固定して両端隣接を逃すと、最適8を失う。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/editorial/12625) — source-abc400-editorial-12625-0aebf97f723a76a0781e1ed9313a600be3b28cebc52c35a97eb9b75015211e58
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc400/tasks/abc400_f) — source-abc400-f-problem-f05c34f1b8e095a282536aee51bb76a0783529f28ada451225a15a3fb7126e5a
