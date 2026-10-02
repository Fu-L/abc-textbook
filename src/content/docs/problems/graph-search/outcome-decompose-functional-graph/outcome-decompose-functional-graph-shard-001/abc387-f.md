---
title: "ABC387-F — Count Arrays"
draft: true
authoringUnit: {"problemId":"abc387-f","docPath":"src/content/docs/problems/graph-search/outcome-decompose-functional-graph/outcome-decompose-functional-graph-shard-001/abc387-f.md","learningOutcomeIds":["outcome-decompose-functional-graph"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-transition-optimization","unit-rooted-tree-aggregation","unit-state-graph-search"],"excludedTopics":["関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-functional-graph-decomposition","tag-dp-transition-acceleration","tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc387-editorial-11834-86e47cdfbb55d84752bd9b893e3702857efbcfb3dfa7d6c99cfe7f66dac7e971","source-abc387-f-problem-d8df2e613ad268786b4f640f24a45e1357a5898c07726be951026680a2666c16"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"cycle上の一周の不等式は全値等号を強制するため一頂点へ縮約してよい。親値jを固定すると各子は1..jから独立に選べ、子DP prefix和の積が厳密な部分木数。葉からの帰納法で各rootの和が成分数となり、成分は独立なので積が全答え。","sourceRevisionIds":["source-abc387-editorial-11834-86e47cdfbb55d84752bd9b893e3702857efbcfb3dfa7d6c99cfe7f66dac7e971","source-abc387-f-problem-d8df2e613ad268786b4f640f24a45e1357a5898c07726be951026680a2666c16"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-decompose-functional-graph"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"A=(2,1,1)、M=2。1と2はcycle、3の親制約はx3≤x1。","procedure":["cycle値1ならx3=1の1通り。","cycle値2ならx3=1,2の2通り。","成分の和を取る。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-functional-graph-decomposition"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-decompose-functional-graph"],"prerequisiteIds":["unit-dp-transition-optimization","unit-rooted-tree-aggregation","unit-state-graph-search"],"attainmentCondition":"cycleに1≤2≤1を満たす異なる値を置けるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"置けない。大小関係を一周すると全て等しい必要がある。"},"answer":{"reasoningOrVerification":"置けない。大小関係を一周すると全て等しい必要がある。","procedure":["具体例の各状態・寄与を再計算する。","置けない。大小関係を一周すると全て等しい必要がある。"],"expectedResult":"置けない。大小関係を一周すると全て等しい必要がある。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [関数グラフのcycle・tree分解](src/content/docs/learn/graph/functional-graph-decomposition.md)

- 後続が一意なグラフをcycleと流入木へ分け、各頂点が属する構造を特定できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [DP遷移を因数分解・集約して加速する](src/content/docs/learn/dynamic-programming/dp-transition-optimization.md)
- [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)
- [状態グラフのモデリングと探索](src/content/docs/learn/graph/state-graph-search.md)

対象外:

- 関数グラフのcycle・tree分解の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

辺A_i→iを張ると各頂点の入次数が1のfunctional graphになり、各連結成分は一つのcycleとそこへ流れ込む木からなる。 cycle上では不等式が一周してx_1≤x_2≤…≤x_1となるため全値が等しく、cycle全体を一つのrootへ縮約できる。 root値jを固定した部分木通り数dp[v][j]は、各childの許容値1..jの通り数の積になる。 子ごとにdpのprefix sumを一度作れば、各辺について全jの寄与をO(M)でmergeできる。

採用する候補: cycleを縮約した各rooted treeで、root値別の木DPを累積和高速化する

親値以上/以下という辺制約を子部分木のprefix sumで合成でき、全成分の通り数をO(NM)で求めて積にできる。

棄却する候補: 各x_iを1..Mで全探索し不等式を検査する

M^N通りであり、functional graphのcycle強制等値と木構造を利用していない。

root値jを固定した部分木通り数dp[v][j]は、各childの許容値1..jの通り数の積になる。

子ごとにdpのprefix sumを一度作れば、各辺について全jの寄与をO(M)でmergeできる。

functional graphの各cycleを検出・縮約し、逆向き辺を持つforestを作る。postorderでdp[v][j]=∏child Σ_{k≤j}dp[child][k]を計算し、各component rootのΣ_j dp[root][j]を掛ける。

## 典型の発動条件

### functional graphのcycle縮約

発動条件: 各頂点が一つの親を持ち、cycle上の制約が全頂点を同値化するとき。

cycleを一頂点としてrooted treeへ変える。

### tree DPの累積和高速化

発動条件: 親値に応じて子値のprefix/suffix範囲を合計するとき。

子dpのprefix sumを全jへ使い回す。

## 問題固有の要素

循環不等式は矛盾でなくcycle全体の等値を強制するので、cycle長を状態へ持つ必要がない。

別の問題へ持ち帰る視点: 有向cycle上に単調な順序制約が閉じている場合、全辺が等号になり縮約できる。

## 正当性

cycle上の一周の不等式は全値等号を強制するため一頂点へ縮約してよい。親値jを固定すると各子は1..jから独立に選べ、子DP prefix和の積が厳密な部分木数。葉からの帰納法で各rootの和が成分数となり、成分は独立なので積が全答え。

## 実装上の注意

- 自己loopもcycleとして一rootにする。縮約後のchild重複を避け、mod積とprefix sumを各mergeで正規化する。

## 復習の核

- 自己loop、長いcycle、cycle頂点ごとに木が付くN≤8例を全M^N列挙し、縮約前後の条件とcomponent積を照合する。

## 計算量と制約

### 時間

N 頂点、選択値上限 M。cycle縮約 O(N)、prefix和DP O(NM)。

### 空間

全縮約頂点DPを保存するなら O(NM)、グラフO(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N, M \leq 2025; 1 \leq A_i \leq N; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

A=(2,1,1)、M=2。1と2はcycle、3の親制約はx3≤x1。

1. cycle値1ならx3=1の1通り。
2. cycle値2ならx3=1,2の2通り。
3. 成分の和を取る。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

cycleに1≤2≤1を満たす異なる値を置けるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

置けない。大小関係を一周すると全て等しい必要がある。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/editorial/11834) — source-abc387-editorial-11834-86e47cdfbb55d84752bd9b893e3702857efbcfb3dfa7d6c99cfe7f66dac7e971
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc387/tasks/abc387_f) — source-abc387-f-problem-d8df2e613ad268786b4f640f24a45e1357a5898c07726be951026680a2666c16
