---
title: "ABC249-E — RLE"
draft: true
authoringUnit: {"problemId":"abc249-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-factor-and-accelerate-transitions/outcome-factor-and-accelerate-transitions-shard-001/abc249-e.md","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["固定線形遷移の巨大回累乗。"],"tagIds":["tag-dp-transition-acceleration"],"sourceRevisionIds":["source-abc249-e-problem-cfe689aa85acd815da2acaa222c471dc6da66e90e7448790bc6f36389707ae6d","source-abc249-editorial-3840-84d04b3fc3ea14ea3dddfaa54d60218ec60fc0ed9c4e16245236bbea6d1d334b"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"文字列の最大同文字run分解は一意である。長さrのrunはRLE長を1+digits(r)増やし、初runの色は26通り、以後は直前と異なる25通りである。この分解順に元長と符号長を増やすDPは全ての文字列を一回だけ数える。digits(r)が一定の区間では符号長の増分が同じであり、元長方向の累積和でその全rの寄与をまとめても和は変わらない。最後に元長N・符号長N未満の状態だけを合算する。","sourceRevisionIds":["source-abc249-e-problem-cfe689aa85acd815da2acaa222c471dc6da66e90e7448790bc6f36389707ae6d","source-abc249-editorial-3840-84d04b3fc3ea14ea3dddfaa54d60218ec60fc0ed9c4e16245236bbea6d1d334b"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=3、三文字AAAのRLE表記A3。","procedure":["一run長3なら符号長2<3。","二run以上なら少なくとも4文字で短くならない。"],"executionTarget":null,"expectedResult":"短く圧縮できる三文字列26個。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-transition-optimization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-factor-and-accelerate-transitions"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"隣接runに同じ文字を選べるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"同じなら一runへ統合されRLEの分解が一意でなくなる。初run26、以後25の係数を使う。"},"answer":{"reasoningOrVerification":"同じなら一runへ統合されRLEの分解が一意でなくなる。初run26、以後25の係数を使う。","procedure":["具体例の各状態・寄与を再計算する。","同じなら一runへ統合されRLEの分解が一意でなくなる。初run26、以後25の係数を使う。"],"expectedResult":"同じなら一runへ統合されRLEの分解が一意でなくなる。初run26、以後25の係数を使う。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)

- 素朴な遷移元の列挙をprefix・suffix・区間の和や極値へ書き換え、依存順と問い合わせ範囲を保って高速化できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 固定線形遷移の巨大回累乗。

## 考察

同じ文字が連続する長さkのランは、圧縮後には文字1個とkの十進桁数だけを追加し、次のランの文字は直前と異なる25通りから選ぶ。

採用する候補: ラン長の桁数ごとに遷移をまとめる二次元DP

元の長さと圧縮後の長さを状態にし、同じ桁数を持つラン長区間の寄与を累積和で一括計算すれば、全ての候補を数えられる。

棄却する候補: 各状態から全てのラン長を個別に試すDP

状態数が二次で各状態の遷移も線形になり、N=3000では三次時間になる。

ラン長を直接列挙せず、1桁・2桁・3桁という少数の区間へ分けると、遷移先の圧縮長増分が区間内で一定になる。

最初のランは26通り、2個目以降は直前と異なる25通りなので、開始状態だけ係数を分ければよい。

dp[i][j]を元文字列長i、RLE後の長さjとなる個数として、各十進桁数dのラン長区間からdpへの寄与を区間和で集約し、j<Nの状態を合計する。

## 典型の発動条件

### 長さDP

発動条件: 構成要素を順に追加したとき、元の長さと出力長の両方を追う必要がある。

ランを1個追加する遷移として文字列を数え、圧縮長がN未満の状態だけを答えに含める。

### 遷移の区間和

発動条件: 遷移量が入力値そのものではなく、その桁数など少数の区分だけで決まる。

ラン長を10の冪で区切り、同じ圧縮長増分を持つ遷移元の和をまとめて取得する。

## 問題固有の要素

RLE長に影響するラン長の情報は十進桁数だけなので、N通りのラン長遷移が高々log N個の区間遷移へ縮約される。

別の問題へ持ち帰る視点: 遷移のパラメータが区分的に一定なら、その区切りを状態遷移の集約単位にする。

## 正当性

文字列の最大同文字run分解は一意である。長さrのrunはRLE長を1+digits(r)増やし、初runの色は26通り、以後は直前と異なる25通りである。この分解順に元長と符号長を増やすDPは全ての文字列を一回だけ数える。digits(r)が一定の区間では符号長の増分が同じであり、元長方向の累積和でその全rの寄与をまとめても和は変わらない。最後に元長N・符号長N未満の状態だけを合算する。

## 実装上の注意

- 法Pは入力で与えられるため全ての加減算をPで正規化し、最初のランの26倍と後続ランの25倍、圧縮長j<Nという境界を分けて扱う。

## 復習の核

- 小さいNで全ラン長を列挙する三次DPと照合し、桁数が変わる9/10、99/100付近と最初のランの係数を重点的に確認する。

## 計算量と制約

### 時間

O(N² log N)、ラン長の桁区間数O(log N)を累積和で処理。

### 空間

O(N²)。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 3000; 10^8 \le P \le 10^9; N and P are integers.; P is a prime.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=3、三文字AAAのRLE表記A3。

1. 一run長3なら符号長2<3。
2. 二run以上なら少なくとも4文字で短くならない。

期待される結果: 短く圧縮できる三文字列26個。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

隣接runに同じ文字を選べるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

同じなら一runへ統合されRLEの分解が一意でなくなる。初run26、以後25の係数を使う。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/tasks/abc249_e) — source-abc249-e-problem-cfe689aa85acd815da2acaa222c471dc6da66e90e7448790bc6f36389707ae6d
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc249/editorial/3840) — source-abc249-editorial-3840-84d04b3fc3ea14ea3dddfaa54d60218ec60fc0ed9c4e16245236bbea6d1d334b
