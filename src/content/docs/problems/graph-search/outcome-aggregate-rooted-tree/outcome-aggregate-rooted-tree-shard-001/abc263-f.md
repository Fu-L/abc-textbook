---
title: "ABC263-F — Tournament"
draft: true
authoringUnit: {"problemId":"abc263-f","docPath":"src/content/docs/problems/graph-search/outcome-aggregate-rooted-tree/outcome-aggregate-rooted-tree-shard-001/abc263-f.md","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-rooted-tree-aggregation"],"sourceRevisionIds":["source-abc263-f-problem-29c43defca98c2a963108037041bb5b6dcc5966f30ac660724107a28ed5d9274","source-abc263-editorial-4550-b6e2922d0d6dd7c13db4dd4ddb7bb9d9b79ac9e390f694ef5317da5f15264315"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"部分木の勝者 j を固定し、j の未確定賞金以外の最適合計を持つ。反対側勝者 k はその段で敗退するので賞金を確定し、max_k(dp[k]+C[k][h]) を加える。これは j に依存せず全結果を網羅する。根だけ優勝者賞金を最後に加えると各賞金を一度だけ数える。","sourceRevisionIds":["source-abc263-f-problem-29c43defca98c2a963108037041bb5b6dcc5966f30ac660724107a28ed5d9274","source-abc263-editorial-4550-b6e2922d0d6dd7c13db4dd4ddb7bb9d9b79ac9e390f694ef5317da5f15264315"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=1、優勝賞金 C[1][1]=4,C[2][1]=7、敗者賞金0。","procedure":["両葉DPは0。","1優勝の合計4、2優勝の合計7。","優勝賞金を最後に足して最大を取る。"],"executionTarget":null,"expectedResult":"7","verificationStatus":"not_applicable","learningUnitIds":["unit-rooted-tree-aggregation"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-aggregate-rooted-tree"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"優勝賞金を葉の初期値へ入れてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。その人が敗退した場合にも優勝賞金を数えてしまう。段数が確定してから加える。"},"answer":{"reasoningOrVerification":"不可。その人が敗退した場合にも優勝賞金を数えてしまう。段数が確定してから加える。","procedure":["具体例の各状態・寄与を再計算する。","不可。その人が敗退した場合にも優勝賞金を数えてしまう。段数が確定してから加える。"],"expectedResult":"不可。その人が敗退した場合にも優勝賞金を数えてしまう。段数が確定してから加える。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [根付き木DP・部分木集約](src/content/docs/learn/tree/rooted-tree-aggregation.md)

- 根付き木で子側の状態を合成し、部分木または木全体の値を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 根付き木DP・部分木集約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

固定された対戦表は参加者を葉とする深さ N の完全二分木で、各内部ノードでは左右部分木の勝者だけが対戦する。 部分木から誰が勝ち上がるかを固定すれば、その人以外で部分木内に確定する賞金の最大値を状態にできる。 左の j が親で勝つ場合、左 dp[j] に max_k(right dp[k]+C[k][h]) を足せばよい。h は k が敗れるまでに勝った試合数である。 根まで勝ち残ったchampionだけは敗退時に賞金が確定しないので、最後に C[champion][N] を加えて最大を取る。

棄却する候補: 各試合の勝者を全内部ノードについて二択で列挙し、総賞金を計算する。

試合数は2^N−1で、勝敗列挙は二重指数的になる。

採用する候補: dp[node][person] を person がその部分木を勝ち上がるとき、既に敗退した人の賞金最大値として木の下からマージする。

勝つ側を固定したとき相手部分木の最適敗者は勝者本人に依存せず、相手側の最大値を前計算して二重全探索を避けられる。

左の j が親で勝つ場合、左 dp[j] に max_k(right dp[k]+C[k][h]) を足せばよい。h は k が敗れるまでに勝った試合数である。

根まで勝ち残ったchampionだけは敗退時に賞金が確定しないので、最後に C[champion][N] を加えて最大を取る。

fixed bracket tournament を complete binary tree DP とし、merge の片側全探索を winner-independent maximum へ畳み込む。

## 典型の発動条件

### 勝ち上がり者を状態にするトーナメント木DP

発動条件: 固定トーナメント表で勝敗を選び、各参加者の到達roundに応じた利得を最大化するとき。

各部分木について勝者候補ごとの最適値を持ち、左右勝者の対戦で親へ遷移する。

### 遷移相手の最大値前計算

発動条件: 二群の状態をマージする際、一方を固定した評価が相手の識別子に依存せず最大値だけ必要なとき。

相手部分木で敗者賞金込みの最大値を一度計算し、全勝者候補へ共通加算する。

## 問題固有の要素

同じ深さの全ノードで勝者候補集合は葉を分割しており、dp状態総数は各深さ2^N個、全体でN×2^N個に収まる。

別の問題へ持ち帰る視点: 木DPの状態数はノード数×全候補数で粗く見ず、同じ層で候補集合が分割されるかを数える。

## 正当性

部分木の勝者 j を固定し、j の未確定賞金以外の最適合計を持つ。反対側勝者 k はその段で敗退するので賞金を確定し、max_k(dp[k]+C[k][h]) を加える。これは j に依存せず全結果を網羅する。根だけ優勝者賞金を最後に加えると各賞金を一度だけ数える。

## 実装上の注意

- 葉では本人が勝ち上がり、まだ誰も賞金確定していない値0を初期状態にする。
- 賞金合計は大きくなるため64 bit整数を使い、round添字 h と入力 C_{i,j} の1始まりを合わせる。

## 復習の核

- トーナメント問題は列の反復処理ではなく、葉区間が固定された完全二分木として描く。
- 左右候補の二重ループが見えたら、勝者を固定した評価が敗者側の最大値だけで決まらないか確認する。

## 計算量と制約

### 時間

大会深さ N、参加者 P=2^N。各段で全参加者を一回評価して O(PN)。

### 空間

賞金入力表込み O(PN)。DP 作業配列は O(P)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 16; 1 \leq C_{i,j} \leq 10^9; All values in input are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=1、優勝賞金 C[1][1]=4,C[2][1]=7、敗者賞金0。

1. 両葉DPは0。
2. 1優勝の合計4、2優勝の合計7。
3. 優勝賞金を最後に足して最大を取る。

期待される結果: 7

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

優勝賞金を葉の初期値へ入れてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。その人が敗退した場合にも優勝賞金を数えてしまう。段数が確定してから加える。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/tasks/abc263_f) — source-abc263-f-problem-29c43defca98c2a963108037041bb5b6dcc5966f30ac660724107a28ed5d9274
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc263/editorial/4550) — source-abc263-editorial-4550-b6e2922d0d6dd7c13db4dd4ddb7bb9d9b79ac9e390f694ef5317da5f15264315
