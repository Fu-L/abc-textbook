---
title: "ABC235-F — Variety of Digits"
draft: true
authoringUnit: {"problemId":"abc235-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc235-f.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp"],"sourceRevisionIds":["source-abc235-editorial-3247-40b42877dc2f3f4848b32cad6e7590119a465d0b0a1811e07fe9c61be1106227","source-abc235-f-problem-672edfd549b078e96c6eeb187037ac67478679bf4e5888b426893cfabe8e065e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同じtight・started・出現maskのprefixは、後続で選べる数字と必要条件が同じだから合流できる。個数と数値和を保持し、数字dの追加で新しい総和は10sum+d countとなるので各値を列挙する必要はない。未開始の0は位取りのpaddingでありmaskに加えず、開始後の0は通常数字として加える。最後にstartedかつ必要maskを包含する全状態を足すと1..Nの条件を満たす整数の和になる。","sourceRevisionIds":["source-abc235-editorial-3247-40b42877dc2f3f4848b32cad6e7590119a465d0b0a1811e07fe9c61be1106227","source-abc235-f-problem-672edfd549b078e96c6eeb187037ac67478679bf4e5888b426893cfabe8e065e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=20、必要数字は0。","procedure":["正整数1..20のうち0を含むのは10,20。","一桁値の前に付いたpaddingの0は出現扱いしない。"],"executionTarget":null,"expectedResult":"和30。","verificationStatus":"not_applicable","learningUnitIds":["unit-digit-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"必要数字が1だけならN=20の和はいくつか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"1と10..19が該当するので1+(10+19)·10/2=146。上限自身を含むtight状態も必要mask次第で集計する。"},"answer":{"reasoningOrVerification":"1と10..19が該当するので1+(10+19)·10/2=146。上限自身を含むtight状態も必要mask次第で集計する。","procedure":["具体例の各状態・寄与を再計算する。","1と10..19が該当するので1+(10+19)·10/2=146。上限自身を含むtight状態も必要mask次第で集計する。"],"expectedResult":"1と10..19が該当するので1+(10+19)·10/2=146。上限自身を含むtight状態も必要mask次第で集計する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

N は最大 1 万桁なので数値として列挙できないが、上位から同じ prefix を選ぶ間だけ次桁上限が N の対応桁に制限される。

条件は各数字が少なくとも一度出たかだけなので、prefix の履歴は出現数字集合の 10 bit mask に圧縮できる。

棄却する候補: 1 から N までの各整数を生成し、必要数字を全て含むか調べて総和へ加える。

N が 1 万桁に達し、整数の個数も値も列挙不可能である。

採用する候補: 桁位置、出現数字 mask、N 未満確定か、数が開始済みかを状態とする digit DP で、個数と値の総和を同時に更新する。

上限と leading zero を正しく扱いながら、各 prefix の将来に必要な情報を定数個の mask 状態へまとめられる。

新しい数字 d を末尾へ付けると、総和は旧総和×10＋旧個数×d で更新できるため、完成数を個別に保持しなくてよい。

巨大上限の十進 prefix automaton 上で、tight・started・digit mask ごとの個数と数値和を伝播し、必要 mask を包含する終了状態の和を集計する。

## 典型の発動条件

### 出現集合付き digit DP

発動条件: 上限 N 以下の整数について、十進表記に特定数字が現れる条件を数え上げるとき。

使用済み数字を bitmask、上限との大小を tight、leading zero を started で管理する。

### 桁 DP での値の総和

発動条件: 条件を満たす整数の個数だけでなく、整数値そのものの合計を求めるとき。

各状態に count と sum を持ち、桁追加で sum' に 10×sum＋d×count を足す。

## 問題固有の要素

数字 0 が必須でも、数が始まる前の leading zero は十進表記に含まれないため mask へ追加してはいけない。

別の問題へ持ち帰る視点: 桁条件に 0 が関わる digit DP では、padding の 0 と実際の表記中の 0 を started 状態で分離する。

## 正当性

同じtight・started・出現maskのprefixは、後続で選べる数字と必要条件が同じだから合流できる。個数と数値和を保持し、数字dの追加で新しい総和は10sum+d countとなるので各値を列挙する必要はない。未開始の0は位取りのpaddingでありmaskに加えず、開始後の0は通常数字として加える。最後にstartedかつ必要maskを包含する全状態を足すと1..Nの条件を満たす整数の和になる。

## 実装上の注意

- 未開始のまま全桁 0 を選んだ状態は整数 0 に対応するので最終集計から除外する。
- 必要数字 mask req に対し (mask＆req)＝req の全 started 状態を集計し、N 自身を含む tight 状態も落とさない。

## 復習の核

- 桁 DP で総和を求めるときは、同じ prefix 状態の値を列挙せず count と sum の二統計を持つ。
- 必須数字に 0 が含まれる小例で、leading zero が出現扱いになっていないことを確認する。

## 計算量と制約

### 時間

D=桁数としてO(D·2^10·10)。

### 空間

O(2^10)。桁ごとにrollingする。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N < 10^{10^4}; 1 \leq M \leq 10; 0 \leq C_1 < \ldots < C_M \leq 9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=20、必要数字は0。

1. 正整数1..20のうち0を含むのは10,20。
2. 一桁値の前に付いたpaddingの0は出現扱いしない。

期待される結果: 和30。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

必要数字が1だけならN=20の和はいくつか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

1と10..19が該当するので1+(10+19)·10/2=146。上限自身を含むtight状態も必要mask次第で集計する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/editorial/3247) — source-abc235-editorial-3247-40b42877dc2f3f4848b32cad6e7590119a465d0b0a1811e07fe9c61be1106227
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc235/tasks/abc235_f) — source-abc235-f-problem-672edfd549b078e96c6eeb187037ac67478679bf4e5888b426893cfabe8e065e
