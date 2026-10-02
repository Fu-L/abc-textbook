---
title: "ABC455-G — Balanced Subarrays"
draft: true
authoringUnit: {"problemId":"abc455-g","docPath":"src/content/docs/problems/hybrid/outcome-compare-algebraic-objects-by-random-fingerprint/outcome-compare-algebraic-objects-by-random-fingerprint-shard-001/abc455-g.md","learningOutcomeIds":["outcome-compare-algebraic-objects-by-random-fingerprint"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-randomized-algorithms","unit-two-pointers-window"],"excludedTopics":["乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-randomized-algebraic-fingerprint","tag-randomized-algorithm","tag-two-pointers-window"],"sourceRevisionIds":["source-abc455-editorial-19242-16be212d8a47e174a761d504e94ff9061056414ab00385d78fe9255b5a47e33e","source-abc455-g-problem-589c9d726c2fed90e273ef6782a6fe73f9d7c81870a2855eb09d2d2b4c519a03"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"一値がB_k+1回以上出ない左端下限を越えた範囲では、全count≡0 mod B_kが『各値0回またはB_k回』と同値になる。 distinct集合が固定の区間ではそのhash H も固定で、等頻度条件は S_rB_k-Hr=S_lB_k-Hl というscalar key一致になる。 各値B_k回条件は回数mod B_kが全0というhash一致へ、B_k種類同頻度条件は B_k S_i-H i のprefix同値へ高確率で変換でき、左端範囲内だけを頻度表で数えられる。","sourceRevisionIds":["source-abc455-editorial-19242-16be212d8a47e174a761d504e94ff9061056414ab00385d78fe9255b5a47e33e","source-abc455-g-problem-589c9d726c2fed90e273ef6782a6fe73f9d7c81870a2855eb09d2d2b4c519a03"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compare-algebraic-objects-by-random-fingerprint"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"B=2、列(1,1,2,2)。","procedure":["全域は各値2回で等頻度。","区間(1,1,2)は頻度2,1で不適。"],"executionTarget":null,"expectedResult":"全域は条件成立、三要素区間は不成立。","verificationStatus":"not_applicable","learningUnitIds":["unit-randomized-algebraic-fingerprint"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compare-algebraic-objects-by-random-fingerprint"],"prerequisiteIds":["unit-randomized-algorithms","unit-two-pointers-window"],"attainmentCondition":"hashだけで『各値0回またはB回』と判定できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"周期hashが示すのはcount≡0 modB。上限count≤Bを保証するwindow境界と組み合わせて必要十分条件にする。"},"answer":{"reasoningOrVerification":"周期hashが示すのはcount≡0 modB。上限count≤Bを保証するwindow境界と組み合わせて必要十分条件にする。","procedure":["具体例の各状態・寄与を再計算する。","周期hashが示すのはcount≡0 modB。上限count≤Bを保証するwindow境界と組み合わせて必要十分条件にする。"],"expectedResult":"周期hashが示すのはcount≡0 modB。上限count≤Bを保証するwindow境界と組み合わせて必要十分条件にする。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [乱択代数fingerprint](src/content/docs/learn/modeling/randomized-algebraic-fingerprint.md)

- multiset・素因数指数vector・巨大整数式をランダムな体元やXOR和へ写し、非同値対象が衝突する確率を評価する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [乱択の成功条件と誤り確率を設計する](src/content/docs/learn/modeling/randomized-algorithms.md)
- [尺取り法・sliding windowで連続区間を走査する](src/content/docs/learn/modeling/two-pointers-window.md)

対象外:

- 乱択代数fingerprintの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

balanced条件は、各値がB_k回ずつ現れる場合と、ちょうどB_k種類が同回数現れる場合の二方向から数えられる。右端固定で左端候補は頻度上限・distinct数により区間へ絞れる。

採用する候補: 十分大きなmodulus上のrandom hashで値ごとの出現回数剰余または集合hashを表し、sliding windowでvalid左端範囲を保ちながら、変形したprefix hashの同値頻度をmapで数える。

各値B_k回条件は回数mod B_kが全0というhash一致へ、B_k種類同頻度条件は B_k S_i-H i のprefix同値へ高確率で変換でき、左端範囲内だけを頻度表で数えられる。

棄却する候補: 各部分配列で全値のfrequency mapを作り、正の頻度が全て等しいか検査する。

部分配列が二乗個あり、map構築を使い回しても全左端・右端pairの列挙を避けられない。

一値がB_k+1回以上出ない左端下限を越えた範囲では、全count≡0 mod B_kが『各値0回またはB_k回』と同値になる。

distinct集合が固定の区間ではそのhash H も固定で、等頻度条件は S_rB_k-Hr=S_lB_k-Hl というscalar key一致になる。

二つの数え上げを別scanする。第一は値ごとに周期B_kで総和0となるrandom weightを割当てprefix hash一致をwindow mapで数える。第二はrightごとのちょうどB_k distinctとなるleft区間を更新し、集合Hが変わるsegmentごとに key=S_iB_k-Hi の頻度を追加して一致数を得る。

## 典型の発動条件

### randomized multiset hash

発動条件: 多数のwindowで全frequencyが指定剰余または等値かを軽量判定したいとき。

値・回数状態へrandom weightを割り当てscalar signatureに圧縮する。

### window集合が固定な区間の再利用

発動条件: 右端更新時にdistinct集合が変わる左端境界が単調なとき。

同じ集合hash H の区間だけprefix key頻度を継続管理する。

## 問題固有の要素

正確な高次元frequency vector比較を、衝突確率を評価したrandom linear fingerprintへ落とすとwindow数え上げに載せられる。

別の問題へ持ち帰る視点: 右端固定で集合が一意になるleft区間を見つけると、等頻度条件をprefix scalarの一致へ代数変形できる。

## 正当性

一値がB_k+1回以上出ない左端下限を越えた範囲では、全count≡0 mod B_kが『各値0回またはB_k回』と同値になる。 distinct集合が固定の区間ではそのhash H も固定で、等頻度条件は S_rB_k-Hr=S_lB_k-Hl というscalar key一致になる。 各値B_k回条件は回数mod B_kが全0というhash一致へ、B_k種類同頻度条件は B_k S_i-H i のprefix同値へ高確率で変換でき、左端範囲内だけを頻度表で数えられる。

## 実装上の注意

- hash衝突確率を十分小さくするmodulus・独立乱数を使い、負剰余を正規化する。二つの数え上げの重複・対象定義を問題式通りに合成する。

## 復習の核

- 第一scanで頻度上限が必要な理由、第二scanで H が固定ならprefix key一致になる式をそれぞれ独立に導出する。

## 計算量と制約

### 時間

O(KN log N)の保守的上界、K≤10は指定B_k数。各B_kについて二scanのwindow頻度mapを平衡木で更新する。hash map採用時は期待O(KN)。

### 空間

O(N)、prefixと頻度window。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1 \leq T \leq 2 \times 10^5; 1 \leq N \leq 2 \times 10^5; 1 \leq K \leq \min(N,10); 1 \leq A_i \leq N; 1 \leq B_k \leq N; B_1,B_2,\dots,B_K are pairwise distinct.; The sum of N over all test cases is at most 2 \times 10^5.; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

B=2、列(1,1,2,2)。

1. 全域は各値2回で等頻度。
2. 区間(1,1,2)は頻度2,1で不適。

期待される結果: 全域は条件成立、三要素区間は不成立。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

hashだけで『各値0回またはB回』と判定できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

周期hashが示すのはcount≡0 modB。上限count≤Bを保証するwindow境界と組み合わせて必要十分条件にする。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc455/editorial/19242) — source-abc455-editorial-19242-16be212d8a47e174a761d504e94ff9061056414ab00385d78fe9255b5a47e33e
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc455/tasks/abc455_g) — source-abc455-g-problem-589c9d726c2fed90e273ef6782a6fe73f9d7c81870a2855eb09d2d2b4c519a03
