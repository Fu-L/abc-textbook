---
title: "ABC439-E — Kite"
draft: true
authoringUnit: {"problemId":"abc439-e","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-lis-frontier/outcome-design-lis-frontier-shard-001/abc439-e.md","learningOutcomeIds":["outcome-design-lis-frontier"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-sequence"],"excludedTopics":["LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-lis-state"],"sourceRevisionIds":["source-abc439-e-problem-4779296ea5b700e723a4285e3be52c7d0203add2ac5b08989183e25701c8245e","source-abc439-editorial-14994-4af3df3a312c2cec75552b4b1787ee40c8dfff30a1e19b01670a207732fd272e"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"同時可行pairはAとBが共に狭義で同じ向きへ増えることと同値。選択集合をA昇順に並べると全pair可行はBの狭義増加に等価。A同値群内をB降順に置けば、strict LISは同群から二つを採れず、同値禁止を自動的に満たす。異A群間の順序は維持されるので可行集合とLISの相互変換が成立する。","sourceRevisionIds":["source-abc439-e-problem-4779296ea5b700e723a4285e3be52c7d0203add2ac5b08989183e25701c8245e","source-abc439-editorial-14994-4af3df3a312c2cec75552b4b1787ee40c8dfff30a1e19b01670a207732fd272e"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-lis-frontier"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"(A,B)=(1,1),(1,2),(2,2),(3,3)。","procedure":["sort後のB列は2,1,2,3。","strict LISは1,2,3の長さ3。","対応人物は(1,1),(2,2),(3,3)。"],"executionTarget":null,"expectedResult":"3","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-lis"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-lis-frontier"],"prerequisiteIds":["unit-dp-sequence"],"attainmentCondition":"A同値でB昇順にsortすると。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"B列1,2,2,3となり、この例の長さは同じでも同A二人を選ぶ不正経路が生じる。二人だけ(1,1),(1,2)なら正答1を2と誤る。"},"answer":{"reasoningOrVerification":"B列1,2,2,3となり、この例の長さは同じでも同A二人を選ぶ不正経路が生じる。二人だけ(1,1),(1,2)なら正答1を2と誤る。","procedure":["具体例の各状態・寄与を再計算する。","B列1,2,2,3となり、この例の長さは同じでも同A二人を選ぶ不正経路が生じる。二人だけ(1,1),(1,2)なら正答1を2と誤る。"],"expectedResult":"B列1,2,2,3となり、この例の長さは同じでも同A二人を選ぶ不正経路が生じる。二人だけ(1,1),(1,2)なら正答1を2と誤る。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [LIS・末尾の支配関係](src/content/docs/learn/dynamic-programming/dp-lis.md)

- 同じ長さなら小さい末尾が延長可能性を支配することを示し、長さ別最小末尾を二分探索で更新してLIS・非減少部分列を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [列・subsequence DP](src/content/docs/learn/dynamic-programming/dp-sequence.md)

対象外:

- LIS・末尾の支配関係の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

二人 i,j が同時に凧を揚げられるのは (A_i-A_j)(B_i-B_j)>0、つまり A と B の大小順が一致するときである。全員を A 順に並べれば、選べる集合では B も狭義増加する必要がある。 A が異なる選択点はソート後の添字順と A の狭義順が一致するため、残る条件は B の狭義増加だけである。 同じ A を B 降順に置けば、狭義増加 LIS は同じ A の点を高々一つしか選べない。

採用する候補: 組 (A_i,B_i) を A 昇順・同値時 B 降順でソートし、B 列の狭義 LIS 長を求める。

A が等しい組を同じ LIS に取れない tie-break を保証し、二次元の chain 最大化を O(N log N) にできる。

棄却する候補: A 昇順だけでソートして B の LIS を求める。

同じ A の点で B が増加していると、本来同時選択不能な複数人を LIS が選んでしまう。

A が異なる選択点はソート後の添字順と A の狭義順が一致するため、残る条件は B の狭義増加だけである。

同じ A を B 降順に置けば、狭義増加 LIS は同じ A の点を高々一つしか選べない。

全組を key (A asc,B desc) でソートする。tails[len] を長さ len+1 の増加部分列の最小末尾として持ち、各 B に lower_bound を行って置換し、tails の長さを答える。

## 典型の発動条件

### 二次元 LIS

発動条件: 二つの属性がともに狭義増加する最大 chain を求めるとき。

一軸でソートし、もう一軸の LIS へ帰着する。

### 同値軸の逆順 tie-break

発動条件: 一軸が等しい要素を狭義二次元 chain に同時採用させたくないとき。

第1軸同値群を第2軸降順に並べ、狭義 LIS 内の重複採用を防ぐ。

## 問題固有の要素

二属性の全対比較条件は、一属性を順序に固定することで一次元部分列問題になる。

別の問題へ持ち帰る視点: 狭義/非狭義の二次元 LIS では、同値 group の並べ方と lower_bound/upper_bound の組合せが正しさを決める。

## 正当性

同時可行pairはAとBが共に狭義で同じ向きへ増えることと同値。選択集合をA昇順に並べると全pair可行はBの狭義増加に等価。A同値群内をB降順に置けば、strict LISは同群から二つを採れず、同値禁止を自動的に満たす。異A群間の順序は維持されるので可行集合とLISの相互変換が成立する。

## 実装上の注意

- B の LIS は strict なので lower_bound(≥B) を置換する。A 同値時の B を降順にし、入力番号は不要なら比較 key に入れない。

## 復習の核

- A 同値の小例で二人が同時に LIS へ入らないことと、B 同値も strict LIS で排除されることを確認する。

## 計算量と制約

### 時間

人数 N。pair sortとBのLISで O(Nlog N)。

### 空間

pairとtailsで O(N)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: 1 \leq N \leq 2\times 10^5; 0 \leq A_i \leq 10^9; 0 \leq B_i \leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

(A,B)=(1,1),(1,2),(2,2),(3,3)。

1. sort後のB列は2,1,2,3。
2. strict LISは1,2,3の長さ3。
3. 対応人物は(1,1),(2,2),(3,3)。

期待される結果: 3

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

A同値でB昇順にsortすると。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

B列1,2,2,3となり、この例の長さは同じでも同A二人を選ぶ不正経路が生じる。二人だけ(1,1),(1,2)なら正答1を2と誤る。

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/tasks/abc439_e) — source-abc439-e-problem-4779296ea5b700e723a4285e3be52c7d0203add2ac5b08989183e25701c8245e
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc439/editorial/14994) — source-abc439-editorial-14994-4af3df3a312c2cec75552b4b1787ee40c8dfff30a1e19b01670a207732fd272e
