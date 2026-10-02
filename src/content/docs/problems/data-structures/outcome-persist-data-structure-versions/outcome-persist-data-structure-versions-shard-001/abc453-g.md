---
title: "ABC453-G — Copy Query"
draft: true
authoringUnit: {"problemId":"abc453-g","docPath":"src/content/docs/problems/data-structures/outcome-persist-data-structure-versions/outcome-persist-data-structure-versions-shard-001/abc453-g.md","learningOutcomeIds":["outcome-persist-data-structure-versions"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-range-monoid-aggregation"],"excludedTopics":["永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-persistence","tag-range-monoid-aggregation"],"sourceRevisionIds":["source-abc453-editorial-18526-99abc3e6c77c57725ffe9beb0d4040d7ea09e2940816f348844a2a020961876a","source-abc453-g-problem-5676b21220a116d2220557784e8ac4f0313dc2d19e5d9495e935c686aac6f1dc"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"R_X=R_Y は同じ版の共有であり、その後 X を更新してもpath copyingにより Y のroot以下は変更されない。 一点更新で新規作成するnodeは root-to-leaf の O(log N) 個だけで、他の子pointerは旧版を再利用する。 segment tree node を不変にすると異なる版が未変更subtreeを安全に共有でき、copy O(1)、update/query O(log N) に抑えられる。","sourceRevisionIds":["source-abc453-editorial-18526-99abc3e6c77c57725ffe9beb0d4040d7ea09e2940816f348844a2a020961876a","source-abc453-g-problem-5676b21220a116d2220557784e8ac4f0313dc2d19e5d9495e935c686aac6f1dc"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-persist-data-structure-versions"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"配列X=(1,2)、Yへcopy、Xの位置1を9へ更新。","procedure":["copy時X,Yは同root。","更新はXの経路だけcopyして新rootへ変える。"],"executionTarget":null,"expectedResult":"X=(9,2)、Y=(1,2)。","verificationStatus":"not_applicable","learningUnitIds":["unit-persistence"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-persist-data-structure-versions"],"prerequisiteIds":["unit-range-monoid-aggregation"],"attainmentCondition":"copyした後に既存nodeを破壊的更新してよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"共有子を通じてYまで9へ変わるため不可。変更経路の全nodeを新規作成する。"},"answer":{"reasoningOrVerification":"共有子を通じてYまで9へ変わるため不可。変更経路の全nodeを新規作成する。","procedure":["具体例の各状態・寄与を再計算する。","共有子を通じてYまで9へ変わるため不可。変更経路の全nodeを新規作成する。"],"expectedResult":"共有子を通じてYまで9へ変わるため不可。変更経路の全nodeを新規作成する。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [永続data structure・structural sharing](src/content/docs/learn/query/persistence.md)

- 変更pathだけを複製して未変更部分を共有し、各versionのrootから過去状態へアクセスする。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

対象外:

- 永続data structure・structural sharingの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

copy query は配列の全要素を複製する必要がなく、その配列が参照する immutable segment tree の root pointer を共有すればよい。一点更新だけ新しいpathを作れば過去版を保てる。

採用する候補: 各配列 A_i に対応する永続 segment tree root R_i を保持し、copy は root代入、一点更新はpath copying、区間queryは対応rootから取得する。

segment tree node を不変にすると異なる版が未変更subtreeを安全に共有でき、copy O(1)、update/query O(log N) に抑えられる。

棄却する候補: type1 query のたびにコピー元配列の N 要素をコピー先へ複製する。

copy が多数あると O(NQ) の時間・メモリ移動になり、Q の制約を超える。

R_X=R_Y は同じ版の共有であり、その後 X を更新してもpath copyingにより Y のroot以下は変更されない。

一点更新で新規作成するnodeは root-to-leaf の O(log N) 個だけで、他の子pointerは旧版を再利用する。

初期配列からrootを構築する。type1で roots[X]=roots[Y]、type2で persistent pointUpdate(roots[X],p,v) の新rootを代入、type3で rangeQuery(roots[X],l,r) を返す。node poolを配列で確保する。

## 典型の発動条件

### 永続 segment tree

発動条件: 配列版のcopy・一点更新・区間集約を混在させ、copy後の独立更新が必要なとき。

root共有とpath copyingで各版を保持する。

## 問題固有の要素

copy対象を値列ではなくversion rootとして持つと、copy-on-writeが木の構造共有だけで実現できる。

別の問題へ持ち帰る視点: 更新箇所までのpath以外が不変なdata structureは、永続化で履歴・分岐版を安価に扱える。

## 正当性

R_X=R_Y は同じ版の共有であり、その後 X を更新してもpath copyingにより Y のroot以下は変更されない。 一点更新で新規作成するnodeは root-to-leaf の O(log N) 個だけで、他の子pointerは旧版を再利用する。 segment tree node を不変にすると異なる版が未変更subtreeを安全に共有でき、copy O(1)、update/query O(log N) に抑えられる。

## 実装上の注意

- nodeを破壊的更新せず、copy後のroot別名参照を保つ。最大node数を初期構築+更新回数×logNで事前確保する。

## 復習の核

- 一つのrootを二配列で共有した直後に片方だけ更新する例で、新旧pathと共有subtreeを図示してalias破壊がないか確認する。

## 計算量と制約

### 時間

初期構築O(N)、copy O(1)、更新・区間query各O(log N)。

### 空間

O(N+U log N+V)、U一点更新数、V配列version/root数。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \le N,M \le 2 \times 10^5; 1 \le Q \le 2 \times 10^5; Type 1 queries satisfy the following constraints: 1 \le X_i,Y_i \le N; 1 \le X_i,Y_i \le N; Type 2 queries satisfy the following constraints: 1 \le X_i \le N 1 \le Y_i \le M 0 \le Z_i \le 10^9; 1 \le X_i \le N; 1 \le Y_i \le M; 0 \le Z_i \le 10^9; Type 3 queries satisfy the following constraints: 1 \le X_i \le N 1 \le L_i \le R_i \le M; 1 \le X_i \le N; 1 \le L_i \le R_i \le M; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

配列X=(1,2)、Yへcopy、Xの位置1を9へ更新。

1. copy時X,Yは同root。
2. 更新はXの経路だけcopyして新rootへ変える。

期待される結果: X=(9,2)、Y=(1,2)。

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

copyした後に既存nodeを破壊的更新してよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

共有子を通じてYまで9へ変わるため不可。変更経路の全nodeを新規作成する。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc453/editorial/18526) — source-abc453-editorial-18526-99abc3e6c77c57725ffe9beb0d4040d7ea09e2940816f348844a2a020961876a
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc453/tasks/abc453_g) — source-abc453-g-problem-5676b21220a116d2220557784e8ac4f0313dc2d19e5d9495e935c686aac6f1dc
