---
title: "ABC463-F — Senshuraku"
draft: true
authoringUnit: {"problemId":"abc463-f","docPath":"src/content/docs/problems/hybrid/outcome-normalize-equivalent-states/outcome-normalize-equivalent-states-shard-002/abc463-f.md","learningOutcomeIds":["outcome-normalize-equivalent-states"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"excludedTopics":["交換論による貪欲順の証明。"],"tagIds":["tag-state-normalization","tag-combinatorial-coefficients","tag-modular-arithmetic"],"sourceRevisionIds":["source-abc463-editorial-21939-26e1a13f3658448a171da4673027ddd725353abf1088ea3ea4b2a4efd008b71f","source-abc463-f-problem-343004a4d30ce016eb3f93c1835e2c9c7d71f67e5334acf08a7861f15901ce01"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"優勝者勝数はWまたはW+1だけで、各caseで六試合classがtype1/type2のどちらになるかが固定される。 type1がx試合なら候補者数の可変部分はbinomial係数 C(x,t)/2^x で、type2の整合確率積Pと確定人数Kを掛ければよい。 各試合はcase固定後、候補者を確率1/2で一人作るtype1か、整合確率pと確定候補数kを持つtype2に独立化され、type1成功数だけがbinomial分布になる。","sourceRevisionIds":["source-abc463-editorial-21939-26e1a13f3658448a171da4673027ddd725353abf1088ea3ea4b2a4efd008b71f","source-abc463-f-problem-343004a4d30ce016eb3f93c1835e2c9c7d71f67e5334acf08a7861f15901ce01"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-normalize-equivalent-states"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=2、対戦pairの初期勝数は(1,1),(0,0)。","procedure":["第一試合の勝者だけが2勝、敗者は1勝。第二試合の勝者も1勝まで。","第一試合の二選手が各確率1/2で単独優勝し、残り二選手は優勝できない。"],"executionTarget":null,"expectedResult":"優勝確率は(1/2,1/2,0,0)。","verificationStatus":"not_applicable","learningUnitIds":["unit-normalization"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-normalize-equivalent-states"],"prerequisiteIds":["unit-combinatorial-coefficients","unit-modular-arithmetic"],"attainmentCondition":"W+2のcaseも数える必要があるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"各選手に追加一試合しかなく初期最大Wから二勝増えないので不要。"},"answer":{"reasoningOrVerification":"各選手に追加一試合しかなく初期最大Wから二勝増えないので不要。","procedure":["具体例の各状態・寄与を再計算する。","各選手に追加一試合しかなく初期最大Wから二勝増えないので不要。"],"expectedResult":"各選手に追加一試合しかなく初期最大Wから二勝増えないので不要。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [同値な状態を正規化する](src/content/docs/learn/modeling/normalization.md)

- 対称操作で同値な状態の標準形と不変量を選べる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [組合せ係数と対称性で数える](src/content/docs/learn/combinatorics-algebra/combinatorial-coefficients.md)
- [法上の四則演算・高速累乗・逆元](src/content/docs/learn/number-theory/modular-arithmetic.md)

対象外:

- 交換論による貪欲順の証明。

## 考察

最後のN試合前の最多勝数をWとすると、W-2以下の選手は最終優勝できない。各試合は両者の初期勝数class W,W-1,other の組で六種類に分類できる。

採用する候補: 六種類の試合数m_0..m_5を数え、最終最多勝数がW+1またはWの二caseで、優勝候補人数分布と各選手が候補に入る確率を二項係数の閉形式で総和する。

各試合はcase固定後、候補者を確率1/2で一人作るtype1か、整合確率pと確定候補数kを持つtype2に独立化され、type1成功数だけがbinomial分布になる。

棄却する候補: 最後のN試合の勝敗2^N通りを列挙し、各結果で優勝者を数える。

Nが大きく指数列挙できず、同class試合の交換対称性を使えていない。

優勝者勝数はWまたはW+1だけで、各caseで六試合classがtype1/type2のどちらになるかが固定される。

type1がx試合なら候補者数の可変部分はbinomial係数 C(x,t)/2^x で、type2の整合確率積Pと確定人数Kを掛ければよい。

各選手初期勝数と対戦pairから六mを集計し、factorial・inverse・2冪を前計算する。W+1caseとWcaseで公式のP,K,xを設定し、候補人数wについて各試合class由来選手の優勝確率/人数をbinomial項で加算する。

## 典型の発動条件

### 結果classの対称圧縮

発動条件: 独立二択試合が多数あり、参加者の初期状態が少数classに限られるとき。

試合をclass数へまとめ、個別勝敗をbinomial分布で数える。

### 候補人数での期待値分解

発動条件: 同率首位から一様に優勝者が選ばれる確率を求めたいとき。

候補に含まれる確率を候補総数ごとに求めて1/wを掛ける。

## 問題固有の要素

指数個の勝敗列も、最終threshold周辺の状態classだけ残すと独立なtypeとbinomial成功数へ縮約できる。

別の問題へ持ち帰る視点: tie-break期待値は候補集合を列挙せず、特定選手を含む候補人数分布を数える。

## 正当性

優勝者勝数はWまたはW+1だけで、各caseで六試合classがtype1/type2のどちらになるかが固定される。 type1がx試合なら候補者数の可変部分はbinomial係数 C(x,t)/2^x で、type2の整合確率積Pと確定人数Kを掛ければよい。 各試合はcase固定後、候補者を確率1/2で一人作るtype1か、整合確率pと確定候補数kを持つtype2に独立化され、type1成功数だけがbinomial分布になる。

## 実装上の注意

- m_0..m_5のclass対応とW/W+1caseのtype表を実装前に固定し、binomial範囲外を0として扱う。mod確率の2逆元・w逆元を使う。

## 復習の核

- W-2以下を捨てられる理由を確認し、各六classが二つの最多勝caseで候補者を何人作るか表にしてから公式へ落とす。

## 計算量と制約

### 時間

O(N)、六試合classごとの確率を候補人数w=0..Nで一度ずつ集計して同classの全選手へ共有する。

### 空間

O(N)、階乗・逆元・2冪。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le2\times10 ^ 5; 0\le A _ i\lt2N\ (1\le i\le 2N); All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=2、対戦pairの初期勝数は(1,1),(0,0)。

1. 第一試合の勝者だけが2勝、敗者は1勝。第二試合の勝者も1勝まで。
2. 第一試合の二選手が各確率1/2で単独優勝し、残り二選手は優勝できない。

期待される結果: 優勝確率は(1/2,1/2,0,0)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

W+2のcaseも数える必要があるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

各選手に追加一試合しかなく初期最大Wから二勝増えないので不要。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/editorial/21939) — source-abc463-editorial-21939-26e1a13f3658448a171da4673027ddd725353abf1088ea3ea4b2a4efd008b71f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc463/tasks/abc463_f) — source-abc463-f-problem-343004a4d30ce016eb3f93c1835e2c9c7d71f67e5334acf08a7861f15901ce01
