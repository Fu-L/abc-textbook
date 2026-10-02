---
title: "ABC262-G — LIS with Stack"
draft: true
authoringUnit: {"problemId":"abc262-g","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-interval-split-dp/outcome-design-interval-split-dp-shard-001/abc262-g.md","learningOutcomeIds":["outcome-design-interval-split-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-interval-partition-dp"],"sourceRevisionIds":["source-abc262-g-problem-19d170e12d0d8ec942a444cbab69fb0889a4accb5ff35fbc1d9270a4357e9534","source-abc262-editorial-4505-85be15665e24276967509cb409dcdfc402c9afa8e38ac52f41e1df1cc3c7e7dc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"使わない要素を先に捨て、使う最大値lを最初にpushする位置mを固定する。それまでのstackに小さい値が残ると、底の小さい値はlより後にpopされて広義増加を壊すので、m直前のstackは空でなければならない。左側で出力した最大値をnとすると、その最適長はdp[i][m−1][k][n]、以後の値はn以上でなければならず、右側の最適長はdp[m+1][j][n][l]になる。右側の操作をlの上で再現し最後にlをpopすれば、この二構成を合法に結合できる。lを使わない候補dp[i][j][k][l−1]と全m,nの結合1+左右長の最大を取るため、任意の最適構成を含み、逆に全候補が合法である。区間長・値幅の帰納法で全域の最大長が得られる。","sourceRevisionIds":["source-abc262-g-problem-19d170e12d0d8ec942a444cbab69fb0889a4accb5ff35fbc1d9270a4357e9534","source-abc262-editorial-4505-85be15665e24276967509cb409dcdfc402c9afa8e38ac52f41e1df1cc3c7e7dc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-interval-split-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,1)。","procedure":["2をpush、1をpush、1をpop、2をpop。","出力(1,2)は非減少。"],"executionTarget":null,"expectedResult":"二個全て選べる。","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-interval-composition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-interval-split-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"A=(2,3,1)の全三個を非減少出力できるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"1を先に出すまで2,3をstackに残すと次は3、2となり違反。最大選択は二個。"},"answer":{"reasoningOrVerification":"1を先に出すまで2,3をstackに残すと次は3、2となり違反。最大選択は二個。","procedure":["具体例の各状態・寄与を再計算する。","1を先に出すまで2,3をstackに残すと次は3、2となり違反。最大選択は二個。"],"expectedResult":"1を先に出すまで2,3をstackに残すと次は3、2となり違反。最大選択は二個。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間合成・領域分割DP](src/content/docs/learn/dynamic-programming/dp-interval-composition.md)

- 区間や長方形の分割点を列挙し、独立な小領域の答えを合成して領域サイズ順に計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 区間合成・領域分割DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

最終 X に使わない値は最初から捨ててよく、使う値だけを考えれば最後に stack は空で X は広義単調増加になる。

採用値の最大値 l を初めて stack に積む瞬間、stack に古い値が残っていると l より後にそれが pop されて単調性を壊すため、stack は空でなければならない。

棄却する候補: 入力を順に処理し、stack の全内容と X の末尾値を状態にする DP を行う。

stack の長さと内容が指数的に分岐し、通常のprefix DPでは圧縮できない。

採用する候補: dp[i][j][k][l] を位置区間 [i,j] と許可値域 [k,l] から作れる最大長とし、最大値 l を使わない場合と、最初に積む位置 m で左右へ分ける場合を遷移する。

最大値を積む時の stack 空条件が位置区間を分離し、左側の最終値 n を境界として右側の許可値域も独立に定められる。

l を使わない候補は dp[i][j][k][l−1]、a_m=l を採用する候補は max_n(1+dp[i][m−1][k][n]+dp[m+1][j][n][l]) になる。

左側で既に出力した最大値を n とすれば、m より後から出力する値は n 以上でなければならず、最後に底の l を pop しても単調性を保てる。

LIFO 制約を最大選択値の push 時点で切る separator property に変え、位置区間と値区間を同時に分割する四次元 interval DP を作る。

## 典型の発動条件

### stack過程のpivot分割DP

発動条件: 特定の極値を stack に入れる瞬間に stack が空である必要があり、その時点で前後が分離できるとき。

極値の位置を pivot として左右区間を独立な部分問題へ分ける。

### 位置区間×値域の DP

発動条件: 部分列の順序制約が位置だけでなく採用可能値の上下界にも依存するとき。

dp[i][j][k][l] に位置範囲と値範囲を持たせ、値境界を一つずつ広げて計算する。

## 問題固有の要素

最大値 l は stack の底に置かれて最後に出力されるため、l の出現位置より後の選択も l より先に pop される部分問題として扱える。

別の問題へ持ち帰る視点: stack の底へ置く極値は処理時刻と出力時刻が離れるので、入力前後ではなく pop 順を基準に分割の意味を確認する。

## 正当性

使わない要素を先に捨て、使う最大値lを最初にpushする位置mを固定する。それまでのstackに小さい値が残ると、底の小さい値はlより後にpopされて広義増加を壊すので、m直前のstackは空でなければならない。左側で出力した最大値をnとすると、その最適長はdp[i][m−1][k][n]、以後の値はn以上でなければならず、右側の最適長はdp[m+1][j][n][l]になる。右側の操作をlの上で再現し最後にlをpopすれば、この二構成を合法に結合できる。lを使わない候補dp[i][j][k][l−1]と全m,nの結合1+左右長の最大を取るため、任意の最適構成を含み、逆に全候補が合法である。区間長・値幅の帰納法で全域の最大長が得られる。

## 実装上の注意

- 値域1…50をそのままDP添字に使い、空の位置区間の値を0として境界 m=i,j も統一する。入力値は最初から小さなdense値域なので座標圧縮は不要である。
- a_m=l の位置だけを分割候補にし、k≤n≤l の境界を走査して添字外の値域を作らない。

## 復習の核

- stack 操作の最適化では、最終出力の極値がいつ push/pop され、その瞬間に stack がどうなっているかを調べる。
- 前後を独立化する pivot が見つかったら、接続に必要な情報を一つの値境界として状態へ残す。

## 計算量と制約

### 時間

O(N³V²)、V≤50。最大値lごとの位置m列挙は全lでN個なので、位置区間N²×下限k V×境界n V×該当位置総数N。

### 空間

O(N²V²)、四次元DP。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 50; 1 \leq a_i \leq 50; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,1)。

1. 2をpush、1をpush、1をpop、2をpop。
2. 出力(1,2)は非減少。

期待される結果: 二個全て選べる。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A=(2,3,1)の全三個を非減少出力できるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

1を先に出すまで2,3をstackに残すと次は3、2となり違反。最大選択は二個。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/tasks/abc262_g) — source-abc262-g-problem-19d170e12d0d8ec942a444cbab69fb0889a4accb5ff35fbc1d9270a4357e9534
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc262/editorial/4505) — source-abc262-editorial-4505-85be15665e24276967509cb409dcdfc402c9afa8e38ac52f41e1df1cc3c7e7dc
