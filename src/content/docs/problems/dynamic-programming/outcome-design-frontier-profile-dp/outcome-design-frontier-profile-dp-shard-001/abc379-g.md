---
title: "ABC379-G — Count Grid 3-coloring"
draft: true
authoringUnit: {"problemId":"abc379-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-frontier-profile-dp/outcome-design-frontier-profile-dp-shard-001/abc379-g.md","learningOutcomeIds":["outcome-design-frontier-profile-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-dp-state-design","unit-dp-subset-state"],"excludedTopics":["frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-frontier-profile-dp","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc379-editorial-11331-99b02bd194eebd23fc74338f23a4b867b546520ef2054f2379c2928e96c8c909","source-abc379-g-problem-0ebd4c1ce63bb44b9c683ba8f86d9c1d50ec610a667da82dd4f88c0c8c4f8171"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"row-major の未処理セルと処理済みセルの辺は直近 W セルの frontier にしか当たらない。左・上との色違いを満たす色を追加すれば、それ以前の制約は変わらず今生じる制約を全て満たす。逆に任意の合法完成 coloring はこの一意な色追加経路を持つ。固定色で候補を制限するため、数え上げは漏れ・重複なく正しい。","sourceRevisionIds":["source-abc379-editorial-11331-99b02bd194eebd23fc74338f23a4b867b546520ef2054f2379c2928e96c8c909","source-abc379-g-problem-0ebd4c1ce63bb44b9c683ba8f86d9c1d50ec610a667da82dd4f88c0c8c4f8171"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-frontier-profile-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"H=2,W=2、全セル ?。","procedure":["左上を3通り、右上と左下は各2通り。","右上と左下が同色なら右下2通り、異色なら1通り。","3×(2×2+2×1)=18。"],"executionTarget":null,"expectedResult":"18","verificationStatus":"not_applicable","learningUnitIds":["unit-frontier-profile-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-frontier-profile-dp"],"prerequisiteIds":["unit-dp-grid-table","unit-dp-state-design","unit-dp-subset-state"],"attainmentCondition":"行頭でも直前セルとの色違いを課してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。直前は上の行の右端で、通常隣接していない。W=2の数え上げを減らしてしまう。"},"answer":{"reasoningOrVerification":"不可。直前は上の行の右端で、通常隣接していない。W=2の数え上げを減らしてしまう。","procedure":["具体例の各状態・寄与を再計算する。","不可。直前は上の行の右端で、通常隣接していない。W=2の数え上げを減らしてしまう。"],"expectedResult":"不可。直前は上の行の右端で、通常隣接していない。W=2の数え上げを減らしてしまう。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [frontier/profile DP・境界状態圧縮](src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)

- 未処理領域へ影響する境界上の色・使用済みフラグ・接続partitionだけを残し、窓外の情報を忘れられることを証明して幅指数のprofile DPを設計できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)
- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)

対象外:

- frontier/profile DP・境界状態圧縮の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

行列を転置して W≤H とでき、HW≤200 から W≤14 である。row-major に色を決めると、新セルと制約を持つのは左と上だけで、直近 W セルの色で未来が決まる。 走査済み領域と未走査領域をまたぐ辺は frontier の W 個だけなので、それより上の行の色は忘れられる。 隣接色が異なる制約を満たす状態だけを生成すれば、見かけの3^Wから定数倍×2^Wへ削減できる。

採用する候補: 横隣接条件を満たす幅 W の色状態だけを列挙し、各セルの指定色と上・左との差を確認する frontier DP を行う。

有効な一行状態は 3·2^{W-1} 程度で、min(H,W)≤14 の指数だけに抑えられる。

棄却する候補: 各 ? セルの3色を全探索して完成盤面を検査する。

? が最大200個あり 3^{HW} 通りで到底列挙できない。

走査済み領域と未走査領域をまたぐ辺は frontier の W 個だけなので、それより上の行の色は忘れられる。

隣接色が異なる制約を満たす状態だけを生成すれば、見かけの3^Wから定数倍×2^Wへ削減できる。

W が小さい向きへ転置し、最後の W 色を3進または有効状態IDで持つ DP をセル順に更新する。入力が固定色なら一色、?なら三色を試し、左端以外は左、2行目以降は上と異なる場合だけ遷移する。

## 典型の発動条件

### grid frontier DP

発動条件: 片方の辺長が小さく、局所隣接制約を満たす盤面を数えるとき。

走査境界上の一行分だけを状態にする。

## 問題固有の要素

面積制約 HW≤200 は転置と組み合わせると短辺≤14という指数 DP の合図になる。

別の問題へ持ち帰る視点: 全状態を持つ前に、行内制約を満たす frontier だけを列挙して状態数を削る。

## 正当性

row-major の未処理セルと処理済みセルの辺は直近 W セルの frontier にしか当たらない。左・上との色違いを満たす色を追加すれば、それ以前の制約は変わらず今生じる制約を全て満たす。逆に任意の合法完成 coloring はこの一意な色追加経路を持つ。固定色で候補を制限するため、数え上げは漏れ・重複なく正しい。

## 実装上の注意

- 行頭では左隣制約を切り、上隣は W 手前の色を見る。固定文字1,2,3との符号化と法998244353を統一する。

## 復習の核

- 走査途中の切断線を描き、未来の判定に必要な過去セルが直近 W 個だけであることを説明する。

## 計算量と制約

### 時間

H×WをW≤Hへ転置しW≤14。各cellで有効frontier状態Sのみ列挙して O(HWS)。frontierは同一行の一本または行境界を挟む二本の水平pathなので、W≥2なら S≤9·2^(W−2)、W=1ならS≤3。全3進状態を毎cell走査する単純実装は O(HW3^W)。

### 空間

有効frontierを疎に保持する二層で O(S)、入力O(HW)。全3進index配列実装はO(3^W)。

### 制約との対応

HW≤200を小さい方の幅Wへ向けてW≤14とする。行境界ではfrontierの水平隣接が一本切れるため、状態を3·2^(W−1)と過小評価しない。有効frontierのみ処理し、各cellで固定色なら一候補、?なら三候補を定数時間で試す。全3進空状態の走査を時間適合の根拠にしない。

## 具体例

H=2,W=2、全セル ?。

1. 左上を3通り、右上と左下は各2通り。
2. 右上と左下が同色なら右下2通り、異色なら1通り。
3. 3×(2×2+2×1)=18。

期待される結果: 18

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

行頭でも直前セルとの色違いを課してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。直前は上の行の右端で、通常隣接していない。W=2の数え上げを減らしてしまう。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc379/editorial/11331) — source-abc379-editorial-11331-99b02bd194eebd23fc74338f23a4b867b546520ef2054f2379c2928e96c8c909
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc379/tasks/abc379_g) — source-abc379-g-problem-0ebd4c1ce63bb44b9c683ba8f86d9c1d50ec610a667da82dd4f88c0c8c4f8171
