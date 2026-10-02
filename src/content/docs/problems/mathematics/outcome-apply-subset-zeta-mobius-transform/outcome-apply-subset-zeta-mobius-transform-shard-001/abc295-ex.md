---
title: "ABC295-EX — E or m"
draft: true
authoringUnit: {"problemId":"abc295-ex","docPath":"src/content/docs/problems/mathematics/outcome-apply-subset-zeta-mobius-transform/outcome-apply-subset-zeta-mobius-transform-shard-001/abc295-ex.md","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-subset-state","unit-frontier-profile-dp","unit-inclusion-exclusion"],"excludedTopics":["subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-subset-zeta-mobius-transform","tag-frontier-profile-dp"],"sourceRevisionIds":["source-abc295-editorial-6036-796acfed90d09b51faae4e6fb21564dcfd98f1d475ceae13a724275092f738f2","source-abc295-ex-problem-1e02e848a5cc4635ee1bd026e721a0fb41b6403946064c5547c988a507010f2f"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"将来へ伝える情報はfrontierの各列最下端bitで十分である。次行の候補は最初に連結が止まる0の位置で分類すればprefix全1と残りfrontier部分集合へ分かれ、caseは互いに重ならない。zeta変換はその部分集合からの遷移重みをまとめた和なので素朴遷移と一致する。最後に固定0/1と矛盾するmaskを除くことで入力制約を保つ。","sourceRevisionIds":["source-abc295-editorial-6036-796acfed90d09b51faae4e6fb21564dcfd98f1d475ceae13a724275092f738f2","source-abc295-ex-problem-1e02e848a5cc4635ee1bd026e721a0fb41b6403946064c5547c988a507010f2f"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"M=2のfrontier重みdp[00,01,10,11]=(1,2,3,4)。","procedure":["bit0 sweepで(1,3,3,7)、bit1 sweepで(1,3,4,10)。","各値はそのmaskの全submask重み和になっている。"],"executionTarget":null,"expectedResult":"zeta後は(1,3,4,10)。","verificationStatus":"not_applicable","learningUnitIds":["unit-subset-transforms"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-apply-subset-zeta-mobius-transform"],"prerequisiteIds":["unit-dp-subset-state","unit-frontier-profile-dp","unit-inclusion-exclusion"],"attainmentCondition":"次行で左bit=1固定、右bit=0固定ならどのmaskを残すか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"10のみ。"},"answer":{"reasoningOrVerification":"bit表記を左からbit1,bit0とすると10だけ。固定値に反するmaskは部分集合和に混ぜてから再利用しないよう処理時点を揃える。","procedure":["具体例の各状態・寄与を再計算する。","bit表記を左からbit1,bit0とすると10だけ。固定値に反するmaskは部分集合和に混ぜてから再利用しないよう処理時点を揃える。"],"expectedResult":"10のみ。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [subset zeta・Möbius変換](src/content/docs/learn/combinatorics-algebra/subset-transforms.md)

- Boolean lattice上のsubset/superset和とexact値をzeta変換・Möbius反転で相互変換する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [部分集合・bitmask状態DP](src/content/docs/learn/dynamic-programming/dp-subset-state.md)
- [frontier/profile DP・境界状態圧縮](src/content/docs/learn/dynamic-programming/frontier-profile-dp.md)
- [包除・Möbius反転で重複を補正する](src/content/docs/learn/combinatorics-algebra/inclusion-exclusion.md)

対象外:

- subset zeta・Möbius変換の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

行を上から処理すると将来との接続可能性は各列の最下端bitだけで表せ、許される次行はfrontier maskの部分集合とprefixを1で埋める形に分類できる。

採用する候補: frontier mask DPとsubset zeta型遷移

幅M≤18なので2^M状態を持ち、次行候補の部分集合和を高速ゼータ変換の要領でまとめられる。

棄却する候補: 全?マスを列挙

最大324マスで指数が大きすぎる。

左から最初に新しい連結が止まる0を境界にすると、prefix全1＋残りfrontier部分集合という互いに重ならない遷移分類になる。

各行でdp[mask]を入力0/1/?制約に合わせて変換し、部分集合和を一回のzeta sweepで計算しつつ各prefix全1ケースを次maskへ加える。

## 典型の発動条件

### bitmask frontier DP

発動条件: 幅が小さい格子を行単位で処理し、将来に影響する境界だけを保持する。

各列が上から伸長可能かをmaskにする。

### subset zeta transform

発動条件: 全maskからその部分集合への和が必要。

行遷移の多数の部分集合和をO(M2^M)で求める。

## 問題固有の要素

遷移をprefixの最初の0で一意分類することで、複数回の部分集合和を一回のzeta変換へ畳める。

別の問題へ持ち帰る視点: frontier遷移は重複しない境界イベントで分類する。

## 正当性

将来へ伝える情報はfrontierの各列最下端bitで十分である。次行の候補は最初に連結が止まる0の位置で分類すればprefix全1と残りfrontier部分集合へ分かれ、caseは互いに重ならない。zeta変換はその部分集合からの遷移重みをまとめた和なので素朴遷移と一致する。最後に固定0/1と矛盾するmaskを除くことで入力制約を保つ。

## 実装上の注意

- 固定0/1に反するmaskを除外し、prefix全1ケースの追加タイミングと法998244353を統一する。

## 復習の核

- 小格子の全?埋めと比較し、全0・全1、固定値が遷移を遮る行、M=1を確認する。

## 計算量と制約

### 時間

O(NM2^M)。各行でsubset zeta sweepとprefix別遷移を行う。

### 空間

O(2^M)。行DPをrollingする。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: N and M are integers.; 1 \le N,M \le 18; X is a grid with N rows and M columns consisting of 0, 1, and ?.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

M=2のfrontier重みdp[00,01,10,11]=(1,2,3,4)。

1. bit0 sweepで(1,3,3,7)、bit1 sweepで(1,3,4,10)。
2. 各値はそのmaskの全submask重み和になっている。

期待される結果: zeta後は(1,3,4,10)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

次行で左bit=1固定、右bit=0固定ならどのmaskを残すか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

bit表記を左からbit1,bit0とすると10だけ。固定値に反するmaskは部分集合和に混ぜてから再利用しないよう処理時点を揃える。

確認結果: 10のみ。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/editorial/6036) — source-abc295-editorial-6036-796acfed90d09b51faae4e6fb21564dcfd98f1d475ceae13a724275092f738f2
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc295/tasks/abc295_h) — source-abc295-ex-problem-1e02e848a5cc4635ee1bd026e721a0fb41b6403946064c5547c988a507010f2f
