---
title: "ABC326-F — Robot Rotation"
draft: true
authoringUnit: {"problemId":"abc326-f","docPath":"src/content/docs/problems/hybrid/outcome-split-enumeration-space/outcome-split-enumeration-space-shard-001/abc326-f.md","learningOutcomeIds":["outcome-split-enumeration-space"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-constructive-witness"],"excludedTopics":["meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-meet-in-the-middle","tag-constructive-witness"],"sourceRevisionIds":["source-abc326-editorial-7476-4d01976a865d3d9e446a33bade6b5ab30d1152561f955bffb10654bbdeeaa975","source-abc326-f-problem-fee8d914a1899607dcd5cb88eb247c39542e80191159d1a5c500390bbeededb9"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"signed sum B_iの前半全maskをsum→mask辞書へ入れ、後半sum tに対してtarget-tが辞書にあれば符号列を復元できる。 odd/evenで得た符号は実際の絶対方向を指定し、現在方向からその方向へ+90度ならL、−90度ならRと一意に変換できる。 座標依存を2本の1次元問題へ分離し、判定だけでなく各stepの符号maskも復元できる。","sourceRevisionIds":["source-abc326-editorial-7476-4d01976a865d3d9e446a33bade6b5ab30d1152561f955bffb10654bbdeeaa975","source-abc326-f-problem-fee8d914a1899607dcd5cb88eb247c39542e80191159d1a5c500390bbeededb9"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-split-enumeration-space"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(1,2)、目標(X,Y)=(2,1)。","procedure":["oddは+1y、evenは+2xとする。","初期+xからLで+y、次Rで+x。"],"executionTarget":null,"expectedResult":"回転列LRで到達(2,1)。","verificationStatus":"not_applicable","learningUnitIds":["unit-meet-in-the-middle"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-split-enumeration-space"],"prerequisiteIds":["unit-constructive-witness"],"attainmentCondition":"二軸のsignを選んだら元向きへの復元は曖昧か。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"各stepは現向きから±90°だけで、必要絶対方向は前stepと直交するのでL/Rは一意。"},"answer":{"reasoningOrVerification":"各stepは現向きから±90°だけで、必要絶対方向は前stepと直交するのでL/Rは一意。","procedure":["具体例の各状態・寄与を再計算する。","各stepは現向きから±90°だけで、必要絶対方向は前stepと直交するのでL/Rは一意。"],"expectedResult":"各stepは現向きから±90°だけで、必要絶対方向は前stepと直交するのでL/Rは一意。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [meet-in-the-middle・半分全列挙](src/content/docs/learn/modeling/meet-in-the-middle.md)

- 探索空間を独立に列挙できる二集合へ分け、両側の結果を照合・合成できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [成立証明から構成解を復元する](src/content/docs/learn/modeling/constructive-witness.md)

対象外:

- meet-in-the-middle・半分全列挙の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

初期向きが+xで毎回90度回転するため、1,3,5,…回目は必ずy軸、2,4,6,…回目は必ずx軸の正負どちらかへ進む。

各step直前の向きに関係なく次axisの正負はL/Rの選択で自由に選べるので、odd stepのsigned sum=Yとeven stepのsigned sum=Xを独立に解ける。

各axisの項数は最大40で、符号2^40全列挙は大きいが半分ずつなら各2^20に収まる。

採用する候補: odd/evenの2つのsigned-sum問題をmeet-in-the-middleで復元し、desired方向列をL/Rへ変換する。

座標依存を2本の1次元問題へ分離し、判定だけでなく各stepの符号maskも復元できる。

棄却する候補: N回のL/R列2^N通りをsimulationする。

N≤80で指数が大きすぎる。

棄却する候補: 到達可能座標をsum幅のboolean DPで管理する。

A_i総和が最大8×10^8で、座標幅に比例する配列を持てない。

signed sum B_iの前半全maskをsum→mask辞書へ入れ、後半sum tに対してtarget-tが辞書にあれば符号列を復元できる。

odd/evenで得た符号は実際の絶対方向を指定し、現在方向からその方向へ+90度ならL、−90度ならRと一意に変換できる。

odd indexのA列をtarget Y、even index列をtarget Xとしてsolveする。solveは列を半分に分け、各halfの全maskで+/- sumを列挙し、一方をhash mapへ保存して補数pairを探し、各項のsignを返す。どちらか失敗ならNo。成功時、各iのtarget directionをoddなら±y、evenなら±xに設定し、初期direction +xから左回転で一致すればL、否则Rを出してdirectionを更新する。

## 典型の発動条件

### meet-in-the-middle

発動条件: 40項程度のbinary選択で値域が大きく通常DPを使えないとき。

前後半の候補sumを列挙して補数を辞書検索する。

### 直交axisの独立化

発動条件: 90度turnを毎step行い、移動axisがparityで固定されるとき。

odd stepをy、even stepをxのsigned sumへ分ける。

### 抽象解から操作列への復元

発動条件: DPで絶対方向を決めた後に相対turnを出力するとき。

current directionとの差±1からL/Rを選ぶ。

## 問題固有の要素

rotation列は前stepの向きへ依存して見えるが、axisが交互なので各stepの正負方向は独立に選べ、依存は最後のL/R復号だけに残る。

別の問題へ持ち帰る視点: 相対操作が絡む構成問題では、まず絶対状態列を独立に設計し、隣接差から操作へ戻せないか考える。

## 正当性

signed sum B_iの前半全maskをsum→mask辞書へ入れ、後半sum tに対してtarget-tが辞書にあれば符号列を復元できる。 odd/evenで得た符号は実際の絶対方向を指定し、現在方向からその方向へ+90度ならL、−90度ならRと一意に変換できる。 座標依存を2本の1次元問題へ分離し、判定だけでなく各stepの符号maskも復元できる。

## 実装上の注意

- 入力の1-index odd/evenと0-index array parityを取り違えず、最初のstepはy方向である。
- sumは最大8×10^8程度で符号付き64bitを使い、hash mapには同じsumのmaskを1つ保持すればよい。
- 方向を0:+x,1:+y,2:-x,3:-y等で持ち、mod 4の負値を正規化する。

## 復習の核

- 最初のL/Rが±yを選ぶことと、次の±x signが現在向きから必ずどちらか一回転で得られることを4方向tableで確認する。

## 計算量と制約

### 時間

期待O(2^{ceil(N/4)}+N)、odd/evenそれぞれを半分に分けhash join。平衡mapなら追加log列挙数。

### 空間

O(2^{ceil(N/4)}+N)。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 80; 1 \leq A_i \leq 10^7; -10^9\leq X,Y \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(1,2)、目標(X,Y)=(2,1)。

1. oddは+1y、evenは+2xとする。
2. 初期+xからLで+y、次Rで+x。

期待される結果: 回転列LRで到達(2,1)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

二軸のsignを選んだら元向きへの復元は曖昧か。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各stepは現向きから±90°だけで、必要絶対方向は前stepと直交するのでL/Rは一意。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc326/editorial/7476) — source-abc326-editorial-7476-4d01976a865d3d9e446a33bade6b5ab30d1152561f955bffb10654bbdeeaa975
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc326/tasks/abc326_f) — source-abc326-f-problem-fee8d914a1899607dcd5cb88eb247c39542e80191159d1a5c500390bbeededb9
