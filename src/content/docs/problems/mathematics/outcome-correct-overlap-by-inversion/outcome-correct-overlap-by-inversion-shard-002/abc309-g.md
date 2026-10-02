---
title: "ABC309-G — Ban Permutation"
draft: true
authoringUnit: {"problemId":"abc309-g","docPath":"src/content/docs/problems/mathematics/outcome-correct-overlap-by-inversion/outcome-correct-overlap-by-inversion-shard-002/abc309-g.md","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-dp-subset-state","unit-frontier-profile-dp"],"excludedTopics":["選択順を二項係数だけで式化する数え上げ。"],"tagIds":["tag-inclusion-exclusion","tag-combinatorial-coefficients","tag-frontier-profile-dp","tag-subset-bitmask-dp"],"sourceRevisionIds":["source-abc309-editorial-6745-aaa99caff75cb1a246058f851c6c5a1de3f91b8eac72a75526bcf7377af1afaa","source-abc309-g-problem-c1e6822f34d592e0edb0f90f28cc68a4cb1ddb7f18418e139e888a06c4e3d055"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"禁止pairを指定する包除項では、指定位置に相異なる禁止値を割り当てたpartial matchingを選び残りを(N−k)!で埋める。窓maskは将来の禁止近傍へ残る使用値だけを保持し、外へ出た値は今後のpartial matchingと競合しないため捨てられる。全kを符号付きで足すと禁止pairを一つでも持つ順列が相殺される。","sourceRevisionIds":["source-abc309-editorial-6745-aaa99caff75cb1a246058f851c6c5a1de3f91b8eac72a75526bcf7377af1afaa","source-abc309-g-problem-c1e6822f34d592e0edb0f90f28cc68a4cb1ddb7f18418e139e888a06c4e3d055"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、X=1。","procedure":["禁止はP_i=i。許される順列は(2,3,1),(3,1,2)。"],"executionTarget":null,"expectedResult":"2。","verificationStatus":"not_applicable","learningUnitIds":["unit-inclusion-exclusion"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-correct-overlap-by-inversion"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-dp-subset-state","unit-frontier-profile-dp"],"attainmentCondition":"N=3,X=2なら。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0。"},"answer":{"reasoningOrVerification":"位置2から距離2以上の値が存在しないので許される順列はない。窓の範囲外値を誤って候補に入れない。","procedure":["具体例の各状態・寄与を再計算する。","位置2から距離2以上の値が存在しないので許される順列はない。窓の範囲外値を誤って候補に入れない。"],"expectedResult":"0。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

- 条件集合の重なり構造を特定し、包除またはMöbius反転の符号と範囲を正しく設定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)
- [frontier/profile DP・境界状態圧縮](src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)

対象外:

- 選択順を二項係数だけで式化する数え上げ。

## 考察

禁止条件 |P_i−i|<X は位置 i の近傍 2X−1 個の値にしか関係せず、X≤5 なので局所的な使用済み集合を bitmask にできる。

禁止条件を一つも満たさない順列は直接数えにくいが、満たす位置を先に固定する包除原理なら、残りは単に (N−k)! 通りで埋められる。

採用する候補: 包除原理で先に固定する bad 位置を選び、その部分マッチング数を位置走査と幅 2X−1 の bitmask DP で数える。

帯状の許可辺だけを持つ部分マッチングなので、遠く過ぎた値の使用状況を捨てて O(N²4^X X) に抑えられる。

棄却する候補: 各順列を列挙し、すべての i で |P_i−i|≥X かを検査する。

N=100 の N! は扱えず、禁止辺が対角近傍に限られるという X の小ささを利用していない。

k 個の位置だけ禁止条件を満たすよう先に値を割り当てた各部分マッチングは、符号 (−1)^k と自由な残り (N−k)! を寄与する。

位置 i を越えるたび候補値の窓も一つずれるため、mask を shift すれば将来再利用できない古い値を状態から落とせる。

dp[i][k][mask] を位置 1..i までで k 組を固定し、i−X より大きく i+X より小さい使用値を mask で表す個数とする。位置 i+1 を固定しない遷移と、未使用の近傍値 l を割り当てる遷移を行う。最後に全状態へ (N−k)!(−1)^k を掛けて総和する。

## 典型の発動条件

### 包除原理と部分マッチング

発動条件: 「どの局所禁止条件も起きない」配置を数え、条件を満たす場所を固定すると残りが簡単になるとき。

選んだ位置と値の injective な対応を数え、未固定部分を階乗で補う。

### 帯幅が小さい matching DP

発動条件: 二部マッチングの許可辺が対角から定数幅以内に限られるとき。

走査境界をまたぐ値の占有だけを bitmask にし、窓を shift する。

## 問題固有の要素

N は大きくても、禁止辺グラフの bandwidth は X≤5 なので permanent 型の計数を局所状態へ圧縮できる。

別の問題へ持ち帰る視点: 順列条件では N だけで諦めず、許可・禁止行列の帯幅や疎性を探すと bitmask DP が現れる。

## 正当性

禁止pairを指定する包除項では、指定位置に相異なる禁止値を割り当てたpartial matchingを選び残りを(N−k)!で埋める。窓maskは将来の禁止近傍へ残る使用値だけを保持し、外へ出た値は今後のpartial matchingと競合しないため捨てられる。全kを符号付きで足すと禁止pairを一つでも持つ順列が相殺される。

## 実装上の注意

- 窓外へ出る bit の扱いと実在する値 1..N の範囲を分け、負の添字や N 超過の候補を遷移に入れない。符号は k の parity で加減算する。

## 復習の核

- 包除の式を書いた直後に「交差を数える部分問題のグラフ構造」を見る。対角帯なら、走査線をまたぐ使用済み値だけが必要だと再現できる。

## 計算量と制約

### 時間

O(N²X2^{2X−1})。固定pair数kと近傍maskを持つDP。

### 空間

O(N2^{2X−1})。位置軸をrollingする。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 100; 1 \le X \le 5; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、X=1。

1. 禁止はP_i=i。許される順列は(2,3,1),(3,1,2)。

期待される結果: 2。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

N=3,X=2なら。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

位置2から距離2以上の値が存在しないので許される順列はない。窓の範囲外値を誤って候補に入れない。

確認結果: 0。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/editorial/6745) — source-abc309-editorial-6745-aaa99caff75cb1a246058f851c6c5a1de3f91b8eac72a75526bcf7377af1afaa
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc309/tasks/abc309_g) — source-abc309-g-problem-c1e6822f34d592e0edb0f90f28cc68a4cb1ddb7f18418e139e888a06c4e3d055
