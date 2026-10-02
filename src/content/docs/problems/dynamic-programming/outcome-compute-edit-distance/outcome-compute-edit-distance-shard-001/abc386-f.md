---
title: "ABC386-F — Operate K"
draft: true
authoringUnit: {"problemId":"abc386-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-compute-edit-distance/outcome-compute-edit-distance-shard-001/abc386-f.md","learningOutcomeIds":["outcome-compute-edit-distance"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-edit-distance-dp","tag-dp-state-equivalence"],"sourceRevisionIds":["source-abc386-editorial-11695-65707968a759b7bb8094dabfdbfdd6ba4dbfcf53684d68d29bcb6ef6cb7c7e39","source-abc386-f-problem-25e7b3bda090132d80b6833e5c285d0b8145d6681279354502a1011ed13a00c3"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"prefix長差|i−j|は挿入削除の最低回数なのでKを超えるcellは最終距離K以内pathに現れない。帯内の標準三遷移は全許容編集列を網羅する。K+1でcapしても≤K判定は変わらない。","sourceRevisionIds":["source-abc386-editorial-11695-65707968a759b7bb8094dabfdbfdd6ba4dbfcf53684d68d29bcb6ef6cb7c7e39","source-abc386-f-problem-25e7b3bda090132d80b6833e5c285d0b8145d6681279354502a1011ed13a00c3"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-compute-edit-distance"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"S=abc,T=axc,K=1。","procedure":["先頭aは一致で0。","b→x置換で1。","末尾c一致で合計1。"],"executionTarget":null,"expectedResult":"Yes","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-sequence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-compute-edit-distance"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"長さ差がKを超えても置換で補えるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"補えない。置換は長さを変えず少なくとも長さ差分の挿入削除が必要。"},"answer":{"reasoningOrVerification":"補えない。置換は長さを変えず少なくとも長さ差分の挿入削除が必要。","procedure":["具体例の各状態・寄与を再計算する。","補えない。置換は長さを変えず少なくとも長さ差分の挿入削除が必要。"],"expectedResult":"補えない。置換は長さを変えず少なくとも長さ差分の挿入削除が必要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

- 二つの列prefixを状態にし、一致・挿入・削除・置換の編集費用を最小化できる。閾値Kの判定では長さ差の下界から|i-j|≤Kの対角帯だけを計算できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 列・subsequence DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

通常の編集距離DPは|S||T|だが、dp[i][j]≥|i-j|である。判定閾値K≤20を超える|i-j|のcellは最終的なYes経路へ参加できない。 挿入・削除・置換の各遷移は距離を減らさないので、対角線から幅Kのbandだけ正確に計算すれば判定結果を保てる。 長さ差がKを超えるなら編集距離も必ずK超なので即Noにできる。 band外をINF=K+1として扱えば、境界から誤って安い遷移が入ることを防げる。

採用する候補: Levenshtein DPを|i-j|≤Kの帯状領域だけで計算する

各rowの有効cellがO(K)個になり、標準遷移をそのままO((|S|+|T|)K)へ削減できる。

棄却する候補: 全(|S|+1)(|T|+1) cellの編集距離DP

文字列長が5×10^5で二次時間・メモリとも不可能である。

長さ差がKを超えるなら編集距離も必ずK超なので即Noにできる。

band外をINF=K+1として扱えば、境界から誤って安い遷移が入ることを防げる。

まず長さ差を判定する。rolling arrayでiを進め、jを[max(0,i-K),min(|T|,i+K)]だけ走査し、削除・挿入・一致/置換の標準三遷移をK+1でcapする。最後がK以下か答える。

## 典型の発動条件

### banded edit-distance DP

発動条件: 編集距離が小さいかだけを、小さい閾値Kで判定するとき。

下界|i-j|で不要cellを除き対角帯だけ計算する。

### 閾値DPのcap

発動条件: K以下かだけが必要で値が単調非減少するとき。

K+1以上を同じINFへ丸めて状態を安全に制限する。

## 問題固有の要素

入力長は巨大でもYesとなり得るalignmentは主対角からK以上ずれられず、制約KがDPの幾何的な幅を決める。

別の問題へ持ち帰る視点: 二次元DPで目的値に簡単な下界があるなら、閾値判定では下界が閾値を超える領域を切り落とす。

## 正当性

prefix長差|i−j|は挿入削除の最低回数なのでKを超えるcellは最終距離K以内pathに現れない。帯内の標準三遷移は全許容編集列を網羅する。K+1でcapしても≤K判定は変わらない。

## 実装上の注意

- rowごとにj範囲がずれるためrolling index対応を明示し、空prefixの初期値をband内だけ設定する。|S|-|T|の絶対値を先に確認する。

## 復習の核

- 空prefix境界、長さ差がKちょうど/K+1、全一致、挿入と削除が交互に必要な短列をfull DPとrandom比較する。

## 計算量と制約

### 時間

文字列長n,m、許容編集K。帯内 O((n+m)(K+1))。

### 空間

rolling band O(K+1)、入力O(n+m)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: Each of S and T is a string of length between 1 and 500000, inclusive, consisting of lowercase English letters.; K is an integer satisfying \color{red}{1 \le K \le 20}.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

S=abc,T=axc,K=1。

1. 先頭aは一致で0。
2. b→x置換で1。
3. 末尾c一致で合計1。

期待される結果: Yes

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

長さ差がKを超えても置換で補えるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

補えない。置換は長さを変えず少なくとも長さ差分の挿入削除が必要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/editorial/11695) — source-abc386-editorial-11695-65707968a759b7bb8094dabfdbfdd6ba4dbfcf53684d68d29bcb6ef6cb7c7e39
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc386/tasks/abc386_f) — source-abc386-f-problem-25e7b3bda090132d80b6833e5c285d0b8145d6681279354502a1011ed13a00c3
