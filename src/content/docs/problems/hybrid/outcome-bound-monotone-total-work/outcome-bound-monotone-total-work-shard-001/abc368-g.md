---
title: "ABC368-G — Add and Multiply Queries"
draft: true
authoringUnit: {"problemId":"abc368-g","docPath":"src/content/docs/problems/hybrid/outcome-bound-monotone-total-work/outcome-bound-monotone-total-work-shard-001/abc368-g.md","learningOutcomeIds":["outcome-bound-monotone-total-work"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset","unit-weighted-prefix-fenwick"],"excludedTopics":["単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-amortized-monotone-progress","tag-fenwick-weighted-prefix","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc368-editorial-10764-9b45a08a22ce98f11311581d85dcdca1fd865b97e679d67b801719ea69204c1d","source-abc368-g-problem-6972426d6decd4bedceb4613cca81bf4610fbab9f3dcefe37256139e096fea76"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"AはFenwick treeまたはsegment treeで区間和を持ち、B_i>1のindexはordered setで次位置をlower_bound取得する。 開始v=0では乗算が0なので最初の要素は加算する。以後、処理する特殊indexごとにvが倍増し10^18保証がiteration上限を与える。 長いB=1区間をまとめ、値が倍増する特殊点は一queryでごく少数しか訪れない。","sourceRevisionIds":["source-abc368-editorial-10764-9b45a08a22ce98f11311581d85dcdca1fd865b97e679d67b801719ea69204c1d","source-abc368-g-problem-6972426d6decd4bedceb4613cca81bf4610fbab9f3dcefe37256139e096fea76"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-bound-monotone-total-work"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,1,3),B=(1,2,1)、初期v=0。","procedure":["位置1はmax(0+2,0)=2。","位置2はmax(3,4)=4、位置3は加算で7。"],"executionTarget":null,"expectedResult":"照会値7。","verificationStatus":"not_applicable","learningUnitIds":["unit-amortized-monotone-progress"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-bound-monotone-total-work"],"prerequisiteIds":["unit-ordered-set-multiset","unit-weighted-prefix-fenwick"],"attainmentCondition":"初期v=0でもB>1なら倍増回数へ数えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"0の乗算は増えないので最初は加算する。その後の正値で特殊位置ごとにvが少なくとも倍増する。"},"answer":{"reasoningOrVerification":"0の乗算は増えないので最初は加算する。その後の正値で特殊位置ごとにvが少なくとも倍増する。","procedure":["具体例の各状態・寄与を再計算する。","0の乗算は増えないので最初は加算する。その後の正値で特殊位置ごとにvが少なくとも倍増する。"],"expectedResult":"0の乗算は増えないので最初は加算する。その後の正値で特殊位置ごとにvが少なくとも倍増する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [単調進行による償却解析](src/content/docs/learn/modeling/amortized-monotone-progress.md)

- 要素の一方向移動・一度だけの削除・軽辺へ進むたびの部分問題サイズ半減など、単調に減るpotentialから操作列全体の仕事量を抑えられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [反転数・重み付き接頭辞統計をFenwick Treeで保つ](src/content/docs/learn/query/weighted-prefix-fenwick.md)

対象外:

- 単調進行による償却解析の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

位置iでの最適更新はv=max(v+A_i,v·B_i)である。B_i=1なら必ず加算なので、判断が必要なのはB_i>1の位置だけである。

v>0になった後、B_i>1の位置では乗算を選べば少なくとも2倍、加算を選ぶ場合もA_i>v(B_i−1)≥vなので結果は2倍超になる。答え上限から判断回数は少ない。

採用する候補: Aのrange sumとB>1のindex集合を動的管理し、queryでは特殊index間を一括加算して各特殊点だけ比較する。

長いB=1区間をまとめ、値が倍増する特殊点は一queryでごく少数しか訪れない。

棄却する候補: type 3ごとにl..rの全位置でmax(v+A_i,vB_i)を計算する。

式自体は正しいが、長いrange queryが多数ある場合に更新の局所性を活かせない。

AはFenwick treeまたはsegment treeで区間和を持ち、B_i>1のindexはordered setで次位置をlower_bound取得する。

開始v=0では乗算が0なので最初の要素は加算する。以後、処理する特殊indexごとにvが倍増し10^18保証がiteration上限を与える。

type 1ではAのrange-sum構造を一点更新し、type 2ではB_i>1かに応じてordered setを挿入・削除する。type 3ではpos=lから次の特殊index jまでのA和をvへ足し、j≤rならv=max(v+A_j,vB_j)として先へ進む。残りA和を加えて出力する。

## 典型の発動条件

### 例外位置だけの区間simulation

発動条件: 大多数の位置が加法などまとめられる遷移で、少数位置だけ個別判断が要るとき。

例外indexをordered setで列挙し、通常区間をrange aggregateする。

### 値倍増による反復回数上界

発動条件: 訪れる例外ごとに値が一定倍率以上増え、答えに上限があるとき。

例外数自体が多くても一queryで実処理する数を数値上限で抑える。

## 問題固有の要素

「乗算を選ばなかった」特殊点でも、選ばない条件がA_i>v(B_i−1)を意味して加算後に倍増する。

別の問題へ持ち帰る視点: 分岐algorithmのiteration boundは、どちらのbranchでも同じprogress measureが増えるか確認する。

## 正当性

AはFenwick treeまたはsegment treeで区間和を持ち、B_i>1のindexはordered setで次位置をlower_bound取得する。 開始v=0では乗算が0なので最初の要素は加算する。以後、処理する特殊indexごとにvが倍増し10^18保証がiteration上限を与える。 長いB=1区間をまとめ、値が倍増する特殊点は一queryでごく少数しか訪れない。

## 実装上の注意

- 特殊index jのA_jを手前の区間和へ重複させず、[pos,j)とjを分ける。B更新で1との境界を正しくsetへ反映する。

## 復習の核

- B=1のみ、l=r、特殊点が連続する例で区間境界を追う。倍増証明はvが正になる最初の加算後から適用する。

## 計算量と制約

### 時間

各照会O(log N·log V)、V≤10¹⁸は照会途中値上限。更新O(log N)。

### 空間

O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 10^5; 1 \leq A_i \leq 10^9; 1 \leq B_i \leq 10^9; 1 \leq Q \leq 10^5; For type 1 and 2 queries, 1 \leq i \leq N.; For type 1 and 2 queries, 1 \leq x \leq 10^9.; For type 3 queries, 1 \leq l \leq r \leq N.; For type 3 queries, the value to be printed is at most 10^{18}.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,1,3),B=(1,2,1)、初期v=0。

1. 位置1はmax(0+2,0)=2。
2. 位置2はmax(3,4)=4、位置3は加算で7。

期待される結果: 照会値7。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

初期v=0でもB>1なら倍増回数へ数えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

0の乗算は増えないので最初は加算する。その後の正値で特殊位置ごとにvが少なくとも倍増する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc368/editorial/10764) — source-abc368-editorial-10764-9b45a08a22ce98f11311581d85dcdca1fd865b97e679d67b801719ea69204c1d
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc368/tasks/abc368_g) — source-abc368-g-problem-6972426d6decd4bedceb4613cca81bf4610fbab9f3dcefe37256139e096fea76
