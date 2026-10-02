---
title: "ABC465-E — Digit Circus"
draft: true
authoringUnit: {"problemId":"abc465-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-count-prefix-constrained-objects/outcome-count-prefix-constrained-objects-shard-001/abc465-e.md","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-digit-dp"],"sourceRevisionIds":["source-abc465-e-problem-945513a43d3360f73d206b2d03ede33780e53f0435eb9811015021223411d6f5","source-abc465-editorial-22563-ba14b921b94c95a8d42cf05aac191fb6724ff984035c08f519b55b7a0b3a782d"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"maskはleading zeroを除いた実数字集合、剰余は元整数mod3、tightは上限一致を記録する。次digit追加でこの三情報を正しく更新すれば、今後の合法digitと三条件判定に必要な履歴は全て保存される。各整数には長さLのzero埋め表現が一意で、mask0の先頭0だけを集合へ加えないので十進表記条件も一致する。末尾で(mod3=0)+(bit3あり)+(popcount(mask)=3)=1かつmask≠0を合計すれば、三条件のちょうど一つを満たす正整数を一度ずつ数える。","sourceRevisionIds":["source-abc465-e-problem-945513a43d3360f73d206b2d03ede33780e53f0435eb9811015021223411d6f5","source-abc465-editorial-22563-ba14b921b94c95a8d42cf05aac191fb6724ff984035c08f519b55b7a0b3a782d"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"N=20。","procedure":["3の倍数だけの数は6,9,12,15,18。","digit3を含むだけの数は13。","三種類の数字を使う数は二桁以下に存在しない。","3は倍数かつ3含有で除く。"],"executionTarget":null,"expectedResult":"6","verificationStatus":"not_applicable","learningUnitIds":["unit-digit-dp"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-count-prefix-constrained-objects"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"数003のleading zeroをdigit集合へ含めるか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"含めない。整数3の実表記は一種類{3}。一方100では途中・末尾の0は実digitで、集合は{1,0}。"},"answer":{"reasoningOrVerification":"含めない。整数3の実表記は一種類{3}。一方100では途中・末尾の0は実digitで、集合は{1,0}。","procedure":["具体例の各状態・寄与を再計算する。","含めない。整数3の実表記は一種類{3}。一方100では途中・末尾の0は実digitで、集合は{1,0}。"],"expectedResult":"含めない。整数3の実表記は一種類{3}。一方100では途中・末尾の0は実digitで、集合は{1,0}。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [上限制約付き桁DP](src/content/docs/learn/dynamic-programming/digit-dp.md)

- 数値上限とのtight・先頭ゼロ・剰余・digit maskなどを接頭辞ごとに更新し、条件を満たす数の個数または値の総和を求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 上限制約付き桁DPの発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

上限N以下の整数をleading zero付き同桁列として読むと、条件判定に必要なのは実際に使ったdigit集合、値mod3、既にNより小さいかの三情報だけである。 leading zeroは桁合わせのpaddingであってdigit 0を使用したことにはならないため、まだ実桁が始まっていない状態をmask=0として扱う。 次剰余は (10m+d) mod3 だが10≡1 mod3なので通常式でも定数stateのまま更新できる。

採用する候補: 桁位置i・digit mask b・mod3 m・tight/lower flag l のdigit DPを行い、次digit0..9を置いて集合・剰余・上限制約を更新する。

将来の許容digitと最終条件は過去の並び順には依存せず使用集合とmod3だけで決まり、上限比較もequalかsmallerの一bitで十分である。

棄却する候補: 1からNまで全整数を列挙し、decimal digit集合と3の倍数条件を検査する。

Nの桁数に対して値域が指数的に広く、Nそのものまでの走査はできない。

leading zeroは桁合わせのpaddingであってdigit 0を使用したことにはならないため、まだ実桁が始まっていない状態をmask=0として扱う。

次剰余は (10m+d) mod3 だが10≡1 mod3なので通常式でも定数stateのまま更新できる。

Nのdecimal文字列を左から走査し、各stateから上限digit以下を遷移する。mask=0でd=0ならmaskを増やさず、他はbit dを立てる。最終mask・mod3が問題条件を満たすstateを合計し、数0の扱いを調整する。

## 典型の発動条件

### digit DP

発動条件: 巨大上限以下の整数をdigit集合や剰余条件で数えたいとき。

prefixのtight flagと有限なdigit統計をstateにする。

### 使用digit集合のbitmask

発動条件: 数字の出現有無だけが最終条件に必要なとき。

10 bit maskへ次digitをORして集合を追跡する。

## 問題固有の要素

整数列挙条件はdecimal prefixを一桁ずつ構築し、将来に影響する有限統計だけをstateへ残す。

別の問題へ持ち帰る視点: leading zeroは値表現外なので、通常digit 0の出現と区別する遷移規約が必要になる。

## 正当性

maskはleading zeroを除いた実数字集合、剰余は元整数mod3、tightは上限一致を記録する。次digit追加でこの三情報を正しく更新すれば、今後の合法digitと三条件判定に必要な履歴は全て保存される。各整数には長さLのzero埋め表現が一意で、mask0の先頭0だけを集合へ加えないので十進表記条件も一致する。末尾で(mod3=0)+(bit3あり)+(popcount(mask)=3)=1かつmask≠0を合計すれば、三条件のちょうど一つを満たす正整数を一度ずつ数える。

## 実装上の注意

- all-leading-zeroで表す0を数えるか問題定義に合わせ、tight flagの比較とmask更新順を統一する。答えmodulusを各加算で取る。

## 復習の核

- Nより小さいflagが一度立つと自由digitになることと、padding zeroでmask bit0を立てない例を確認する。

## 計算量と制約

### 時間

十進桁数 L≤500、digit集合2^10、剰余3、tight2、一桁候補10。O(L·2^10·3·2·10)。

### 空間

rolling二層でO(2^10·3·2)、上限文字列O(L)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: N is an integer.; 1 \leq N < 10^{500}

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

N=20。

1. 3の倍数だけの数は6,9,12,15,18。
2. digit3を含むだけの数は13。
3. 三種類の数字を使う数は二桁以下に存在しない。
4. 3は倍数かつ3含有で除く。

期待される結果: 6

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

数003のleading zeroをdigit集合へ含めるか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

含めない。整数3の実表記は一種類{3}。一方100では途中・末尾の0は実digitで、集合は{1,0}。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/tasks/abc465_e) — source-abc465-e-problem-945513a43d3360f73d206b2d03ede33780e53f0435eb9811015021223411d6f5
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/editorial/22563) — source-abc465-editorial-22563-ba14b921b94c95a8d42cf05aac191fb6724ff984035c08f519b55b7a0b3a782d
