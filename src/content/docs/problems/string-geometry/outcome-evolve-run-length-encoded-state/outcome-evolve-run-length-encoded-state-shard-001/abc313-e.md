---
title: "ABC313-E — Duplicate"
draft: true
authoringUnit: {"problemId":"abc313-e","docPath":"src/content/docs/problems/string-geometry/outcome-evolve-run-length-encoded-state/outcome-evolve-run-length-encoded-state-shard-001/abc313-e.md","learningOutcomeIds":["outcome-evolve-run-length-encoded-state"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-run-length-dynamics"],"sourceRevisionIds":["source-abc313-e-problem-3a03247007965db504c9b92bf17a4d2d3a2bd83c0fa99e737a74e209f8eb5bd0","source-abc313-editorial-6911-132005a653dc06fe5dd61179f748826fd3bb3655aea08bb83fab69235e2052d5"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"隣接非1pairは操作後も残るので長さ1へ到達しない。これがなければ非1の間は1runで、その右側が消えるまでの各stepで増える1の数は直後digit−1。suffixの消滅回数を右から確定し左runの増加をまとめて加えると、一文字ずつ展開した操作の回数と一致する。実列は巨大でも回数の加算乗算だけをmod管理できる。","sourceRevisionIds":["source-abc313-e-problem-3a03247007965db504c9b92bf17a4d2d3a2bd83c0fa99e737a74e209f8eb5bd0","source-abc313-editorial-6911-132005a653dc06fe5dd61179f748826fd3bb3655aea08bb83fab69235e2052d5"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-evolve-run-length-encoded-state"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=12。","procedure":["一回目に1を2個に複製して11。","二回目に1が一個になり停止。"],"executionTarget":null,"expectedResult":"2回。","verificationStatus":"not_applicable","learningUnitIds":["unit-run-length-dynamics"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-evolve-run-length-encoded-state"],"prerequisiteIds":[],"attainmentCondition":"S=22は何回で終わるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"−1。"},"answer":{"reasoningOrVerification":"次も22の形が残り長さ1にならない。法上の回数を先に進めず局所無限条件で止める。","procedure":["具体例の各状態・寄与を再計算する。","次も22の形が残り長さ1にならない。法上の回数を先に進めず局所無限条件で止める。"],"expectedResult":"−1。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [run-length状態の動的遷移](src/content/docs/learn/string/run-length-dynamics.md)

- 同値な連続要素をrunへ圧縮し、局所操作で変わるrunのsplit/mergeと長さだけを更新する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- run-length状態の動的遷移の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

2 以上の数字が隣接すると、その左側の数字が次操作でも複数複製されて 2 以上同士の隣接が残り、長さを 1 まで減らせない。まずこの局所条件で無限を判定できる。

それ以外では 2..9 の間に必ず 1 の run があり、末尾 run だけが一操作ごとに一文字減る一方、非末尾の 1-run は直後の数字 x によって毎回 x−1 ずつ増える。

採用する候補: 文字列を run length encode し、末尾 run が消えるまでに手前の 1-run が増える量を数式で更新しながら後ろから除く。

実文字列を展開せず、変化する run 長と累積操作回数だけを法上で持てば各入力文字を定数回処理できる。

棄却する候補: f(S) を実際に構築し、長さ 1 になるまで反復する。

有限な場合でも中間の 1-run が指数的な長さになり得て、文字列の生成も操作回数の反復も不可能である。

末尾から一文字消える各時刻に、直前の非1数字 x はその左の 1 を x 倍へ写すため、左 run の増分を (x−1)×残り時刻としてまとめられる。

求める回数だけを 998244353 で持ってよいが、無限判定は元文字列の隣接関係で先に確定させる。

隣接する二文字がともに 2..9 なら −1。そうでなければ RLE または同値な右からの DP で、現在の suffix が消える操作回数を保持し、非1数字 x を越えるたび左側 1-run の存続長を (x−1) 倍分増やす。各 run の消滅回数を法上で加えて答える。

## 典型の発動条件

### run length dynamics

発動条件: 文字列操作が同じ文字の連続区間を一様に伸縮し、展開後長が巨大になるとき。

run の文字と長さだけを持ち、消滅時刻と増分をまとめて更新する。

### 発散条件の局所不変量

発動条件: 反復操作の終了性が問われ、ある局所パターンが操作後も必ず残るとき。

2以上の隣接が再生産されることを示し、数値計算の前に無限を除外する。

## 問題固有の要素

各操作を模倣するのでなく、「末尾からいつ消えるか」という時間軸を後ろ向きに伝えると巨大な run を式で処理できる。

別の問題へ持ち帰る視点: 反復文字列操作では、文字列の時系列より各ブロックの寿命を逆算すると閉じた遷移が得られることがある。

## 正当性

隣接非1pairは操作後も残るので長さ1へ到達しない。これがなければ非1の間は1runで、その右側が消えるまでの各stepで増える1の数は直後digit−1。suffixの消滅回数を右から確定し左runの増加をまとめて加えると、一文字ずつ展開した操作の回数と一致する。実列は巨大でも回数の加算乗算だけをmod管理できる。

## 実装上の注意

- run の実長を保持すると overflow するため、答えに必要な量は常に法で正規化する。一方、文字が1か否かの判定は法値で代用しない。

## 復習の核

- 小例を何段か書き、変化するのが「末尾 run」と「非末尾の 1-run」だけだと見抜く。公式の run 不変量を保った式かを 2・1 の境界で検算する。

## 計算量と制約

### 時間

O(N)。隣接無限判定と右からの回数DP。

### 空間

O(1)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 10^6; S is a length-N string consisting of 1, 2, 3, 4, 5, 6, 7, 8, and 9.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=12。

1. 一回目に1を2個に複製して11。
2. 二回目に1が一個になり停止。

期待される結果: 2回。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

S=22は何回で終わるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

次も22の形が残り長さ1にならない。法上の回数を先に進めず局所無限条件で止める。

確認結果: −1。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/tasks/abc313_e) — source-abc313-e-problem-3a03247007965db504c9b92bf17a4d2d3a2bd83c0fa99e737a74e209f8eb5bd0
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc313/editorial/6911) — source-abc313-editorial-6911-132005a653dc06fe5dd61179f748826fd3bb3655aea08bb83fab69235e2052d5
