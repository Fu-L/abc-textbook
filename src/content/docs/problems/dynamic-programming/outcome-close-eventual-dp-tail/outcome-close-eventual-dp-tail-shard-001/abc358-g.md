---
title: "ABC358-G — AtCoder Tour"
draft: true
authoringUnit: {"problemId":"abc358-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-close-eventual-dp-tail/outcome-close-eventual-dp-tail-shard-001/abc358-g.md","learningOutcomeIds":["outcome-close-eventual-dp-tail"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-grid-table","unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration","tag-grid-table-dp"],"sourceRevisionIds":["source-abc358-editorial-10226-f6d3c2facce334fb9f9530e1cfa4602e88cc5246b8149af4753580df88723d30","source-abc358-g-problem-7460a123500722b3ba747ab59d9bfa02371e73d65f5caf209edcbafa42d689ee"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"移動列で最大報酬マスmを初めて訪れるまでのcycleを除くと到達pathはV−1辺以内へ短くできる。削った時間をm滞在に換えると報酬は減らない。その後もm滞在が最善。したがってVまでのprefixの最適値と残り(K−t)A_mを列挙すれば最適を覆う。","sourceRevisionIds":["source-abc358-editorial-10226-f6d3c2facce334fb9f9530e1cfa4602e88cc5246b8149af4753580df88723d30","source-abc358-g-problem-7460a123500722b3ba747ab59d9bfa02371e73d65f5caf209edcbafa42d689ee"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-close-eventual-dp-tail"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"1×2、報酬(2,5)、左開始、K=4。","procedure":["一手右へ行き5を得る。","残り3手その場にいて各5。","合計5+3×5。"],"executionTarget":null,"expectedResult":"20","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-transition-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-close-eventual-dp-tail"],"prerequisiteIds":["unit-dp-grid-table","unit-dp-state-design"],"attainmentCondition":"高報酬点に到達後さらに低報酬点へ戻る必要はあるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"ない。終点指定がないため高報酬点へ滞在し続けると報酬が減らない。"},"answer":{"reasoningOrVerification":"ない。終点指定がないため高報酬点へ滞在し続けると報酬が減らない。","procedure":["具体例の各状態・寄与を再計算する。","ない。終点指定がないため高報酬点へ滞在し続けると報酬が減らない。"],"expectedResult":"ない。終点指定がないため高報酬点へ滞在し続けると報酬が減らない。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 余分な歩行を訪問済みの最良状態での反復へ移す交換論を示し、有限prefix DPと閉形式のtailへ分離できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [グリッド・多次元表の局所DPを設計する](src/content/docs/learn/dynamic-programming/dp-grid-table.md)
- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

Kは10^9だがcell数V=HW≤2500。最適walkで同じcellへ戻るcycleがあれば、そのcycleを削り、代わりに最終的に使う最大Aの訪問cellで同回数stayしても価値は悪化しない。 従って最初に最終stay先へ至る移動部分はsimple pathとして長さV以下にでき、それ以降の巨大残り時間はそのcellのAを掛けるだけでよい。 cycle除去で失う各stepの値は、通ったcell中最大Aの最終cellでstayする同step数の利得以下なので交換が安全である。 t回行動後のdpには各行動後にいるcellのAを加え、残りK−t回stayの寄与とoff-by-oneなく接続する。

採用する候補: t=0..min(K,HW)の通常grid DPを行い、各時点・cellを最終stay先とした dp[t][v]+(K−t)A_v の最大を取る。

巨大時間軸をcell数まで切り、各layerは四近傍＋stayの O(HW) 遷移なので O((HW)²) で済む。

棄却する候補: K回すべてについてcell別最大価値DPを更新する。

一層O(HW)でもK=10^9では反復できず、長期部分が一cellstayへ正規化できることを使っていない。

cycle除去で失う各stepの値は、通ったcell中最大Aの最終cellでstayする同step数の利得以下なので交換が安全である。

t回行動後のdpには各行動後にいるcellのAを加え、残りK−t回stayの寄与とoff-by-oneなく接続する。

T=min(K,HW) とし dp[0][start]=0。t=1..Tで各cellへ前layerの自分と四neighborの最大＋A_cellを計算する。各 t（0も含む）とcellで dp[t][cell]+(K−t)A_cell を答え候補にする。

## 典型の発動条件

### cycle除去＋最良状態での滞在

発動条件: 巨大歩数walkでstayが許され、報酬が現在頂点だけに依存するとき。

prefixをsimple pathへし、余剰時間を訪問最大報酬頂点のself-loopへ移す。

### 有限prefix DPと閉形式tail

発動条件: 長い時系列の後半が一定action反復に正規化できるとき。

短いprefixだけDPし、各終了状態からtail価値を式で足す。

## 問題固有の要素

max-plus matrix exponentiationを使わず、正報酬とstay可能性が最適walkの形を「短いsimple prefix＋定常tail」に限定する。

別の問題へ持ち帰る視点: 巨大Kでは一般高速化の前に、cycleをより良いself-loopへ交換できるか検討する。

## 正当性

移動列で最大報酬マスmを初めて訪れるまでのcycleを除くと到達pathはV−1辺以内へ短くできる。削った時間をm滞在に換えると報酬は減らない。その後もm滞在が最善。したがってVまでのprefixの最適値と残り(K−t)A_mを列挙すれば最適を覆う。

## 実装上の注意

- K<HWならT=Kで負の残り回数を作らない。dp未到達sentinelへAを加えず、値は最大10^18なので64 bitを使う。

## 復習の核

- cycleを削ったぶんの報酬をどのcellのstayへ移すかまで交換証明を書く。dpのstepは「行動後の加点回数」と一致させる。

## 計算量と制約

### 時間

盤面頂点数V=HW、T=min(K,V)。O(VT)⊆O(V²)、初期読込O(V)。

### 空間

rolling DPと値盤面で O(V)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq H, W \leq 50; 1 \leq K \leq 10^9; 1 \leq S_i \leq H; 1 \leq S_j \leq W; 1 \leq A_{i, j} \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

1×2、報酬(2,5)、左開始、K=4。

1. 一手右へ行き5を得る。
2. 残り3手その場にいて各5。
3. 合計5+3×5。

期待される結果: 20

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

高報酬点に到達後さらに低報酬点へ戻る必要はあるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

ない。終点指定がないため高報酬点へ滞在し続けると報酬が減らない。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc358/editorial/10226) — source-abc358-editorial-10226-f6d3c2facce334fb9f9530e1cfa4602e88cc5246b8149af4753580df88723d30
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc358/tasks/abc358_g) — source-abc358-g-problem-7460a123500722b3ba747ab59d9bfa02371e73d65f5caf209edcbafa42d689ee
