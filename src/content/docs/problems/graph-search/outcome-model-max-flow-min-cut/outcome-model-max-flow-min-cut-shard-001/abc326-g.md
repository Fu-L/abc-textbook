---
title: "ABC326-G — Unlock Achievement"
draft: true
authoringUnit: {"problemId":"abc326-g","docPath":"src/content/docs/problems/graph-search/outcome-model-max-flow-min-cut/outcome-model-max-flow-min-cut-shard-001/abc326-g.md","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-state-graph-search"],"excludedTopics":["最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-max-flow-min-cut"],"sourceRevisionIds":["source-abc326-editorial-7475-481f4308542830c11a42ae501727f532a2f6d6c2cafbfa5b3bb7657f003d72eb","source-abc326-g-problem-36dce71c2755d07b4df06c1211e409569c339d4776d5146c639f7ce28ba7f74f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"skill threshold選択は高→低INF辺でprefixとなり各上昇costを一回払う。achievement採用は必要thresholdへのINF辺で条件を強制し、未採用はsource辺Aを切り取り逃し利益を払う。全利益−cutは利益−共有skill costに一致し最小cutが最適。","sourceRevisionIds":["source-abc326-editorial-7475-481f4308542830c11a42ae501727f532a2f6d6c2cafbfa5b3bb7657f003d72eb","source-abc326-g-problem-36dce71c2755d07b4df06c1211e409569c339d4776d5146c639f7ce28ba7f74f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"一skill、上昇一段cost3、一achievement利益8、要求level2。","procedure":["採用ならthreshold2を選びcost3。","不採用なら利益8を取り逃す。","mincut3。"],"executionTarget":null,"expectedResult":"最大純利益5","verificationStatus":"not_applicable","learningUnitIds":["unit-max-flow-min-cut"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-model-max-flow-min-cut"],"prerequisiteIds":["unit-state-graph-search"],"attainmentCondition":"二achievementが同skill level2を要求すると費用を二回払うか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"払わない。threshold辺は一つなので共有取得費用は一回だけ。"},"answer":{"reasoningOrVerification":"払わない。threshold辺は一つなので共有取得費用は一回だけ。","procedure":["具体例の各状態・寄与を再計算する。","払わない。threshold辺は一つなので共有取得費用は一回だけ。"],"expectedResult":"払わない。threshold辺は一つなので共有取得費用は一回だけ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [最大流・最小カット](src/content/docs/learn/graph/max-flow-min-cut.md)

- 選択・排反・closure・頂点容量をcapacity networkへ写し、残余グラフとmax-flow min-cut定理から最適値とcut側を復元する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 最大流・最小カットの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

全achievement rewardを先に受け取ったと考えると、最大化は「skill level-up cost＋未達achievementの失うreward」を最小化して総rewardから引く問題になる。 条件「skill iがlevel x以上」とachievement達成をboolean頂点にすると、levelの包含関係とachievementの必要条件はimplicationになる。 boolean選択のunary costとimplication違反禁止はsource/sink edgeとINF edgeで表せるためminimum cutへ帰着できる。 source側を達成済みとすると、threshold S_{i,x}をsource側へ置くcost C_iはS_{i,x}→sinkの容量C_iで課せる。 achievement T_jをsink側へ置く失効cost A_jはsource→T_jの容量A_jで課せる。 T_j達成なら全required threshold達成、level x+1達成ならlevel x達成というimplicationは、前者から後者へのINF edgeで強制できる。

採用する候補: skill threshold頂点とachievement頂点のmaximum-closure型networkを作り、min cutを総rewardから引く。

最大level 5の少数thresholdと最大50 achievementを1回のmax flowで同時最適化し、共有skill costを正確に扱える。

棄却する候補: 各skillのlevel 1..5を全組列挙して得られるachievementを評価する。

最大5^50通りになり列挙不能である。

棄却する候補: rewardがlevel-up追加costを上回るachievementを個別に採用する。

複数achievementが同じskill upgradeを共有し、個別採算の和では共同便益を評価できない。

source側を達成済みとすると、threshold S_{i,x}をsource側へ置くcost C_iはS_{i,x}→sinkの容量C_iで課せる。

achievement T_jをsink側へ置く失効cost A_jはsource→T_jの容量A_jで課せる。

T_j達成なら全required threshold達成、level x+1達成ならlevel x達成というimplicationは、前者から後者へのINF edgeで強制できる。

source,sink、各skill iのthreshold x=2..5、各achievement jのnodeを作る。threshold→sinkへC_i、source→achievementへA_jを張る。higher threshold→lower threshold、achievement j→S_{i,L_{j,i}}へINF edgeを張り、level 1 requirementは常に満たすとして省略する。max flow=min cutを求め、Σ_j A_j−mincutを出力する。

## 典型の発動条件

### 最大closure・minimum cut

発動条件: 選択利益と選択costがあり、選択間にimplication依存があるとき。

baseline利益からcutで払うcostを引くnetworkへする。

### level thresholdのboolean展開

発動条件: 小さい整数levelを上げるたび同じincrement costがかかるとき。

level≥xを各nodeにし、隣接threshold implicationを張る。

### INF edgeによる論理含意

発動条件: uを選ぶならvも必須というhard constraint。

u→vに全有限cost和より大きいcapacityを張る。

## 問題固有の要素

achievement未達のpenaltyとskill threshold達成のcostを同じcut costへ載せると、reward共有とupgrade共有の両方がnetworkのcut位置として自動調整される。

別の問題へ持ち帰る視点: 利益最大化を全利益baseline−違反/実行costへ変えると、dependency付き選択がmin cutになる場合がある。

## 正当性

skill threshold選択は高→低INF辺でprefixとなり各上昇costを一回払う。achievement採用は必要thresholdへのINF辺で条件を強制し、未採用はsource辺Aを切り取り逃し利益を払う。全利益−cutは利益−共有skill costに一致し最小cutが最適。

## 実装上の注意

- INFはΣA_j+4ΣC_iより大きい64bit値にし、有限cutがINF edgeを切らないことを保証する。
- L_{j,i}=1なら対応threshold node・edgeは不要で、level 5より上へ上げる利益もない。
- level chain edgeの向きはhigher achieved→lower achievedとし、逆にしない。

## 復習の核

- 2つのachievementが同じlevel-2 upgradeを共有する例でcutを描き、個別には赤字でも同時達成が黒字になる選択をnetworkが取れるか確認する。

## 計算量と制約

### 時間

skill数N、achievement数M。V=4N+M+2,E=O(NM+N+M)。一般Dinic O(V²E)。

### 空間

network O(NM+N+M)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N,M \leq 50; 1 \leq L_{i,j} \leq 5; 1 \leq A_i,C_i \leq 10^6; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

一skill、上昇一段cost3、一achievement利益8、要求level2。

1. 採用ならthreshold2を選びcost3。
2. 不採用なら利益8を取り逃す。
3. mincut3。

期待される結果: 最大純利益5

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

二achievementが同skill level2を要求すると費用を二回払うか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

払わない。threshold辺は一つなので共有取得費用は一回だけ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc326/editorial/7475) — source-abc326-editorial-7475-481f4308542830c11a42ae501727f532a2f6d6c2cafbfa5b3bb7657f003d72eb
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc326/tasks/abc326_g) — source-abc326-g-problem-36dce71c2755d07b4df06c1211e409569c339d4776d5146c639f7ce28ba7f74f
