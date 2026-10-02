---
title: "ABC441-F — Must Buy"
draft: true
authoringUnit: {"problemId":"abc441-f","docPath":"src/content/docs/problems/dynamic-programming/outcome-design-resource-dp/outcome-design-resource-dp-shard-003/abc441-f.md","learningOutcomeIds":["outcome-design-resource-dp"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-dp-state-design"],"excludedTopics":["使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。"],"tagIds":["tag-knapsack-resource"],"sourceRevisionIds":["source-abc441-editorial-15102-28425896fd55d61050cc6aeb46de7a52d0c3116cc9e1b0ef47eadf62bf6742e9","source-abc441-f-problem-21139505370faa67bd29ae3b8aa686d4231b529a3e5b1a6341ca7f1e21f6a850"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":1,"claims":[{"key":"correctness","text":"iを除く集合はprefix側とsuffix側へ一意に分かれ、容量の分割を全探索すればexclude最大を得る。iを必ず含む場合は残容量M−P_iを同様に分け、V_iを足してinclude最大を得る。全体最適Xに対し、include<Xなら全最適で不使用、exclude<Xなら全最適で必須、両方Xなら包含と不包含の最適が各一つ存在し任意となる。両方がX未満は全解の二分に反するため生じない。","sourceRevisionIds":["source-abc441-editorial-15102-28425896fd55d61050cc6aeb46de7a52d0c3116cc9e1b0ef47eadf62bf6742e9","source-abc441-f-problem-21139505370faa67bd29ae3b8aa686d4231b529a3e5b1a6341ca7f1e21f6a850"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[{"key":"worked","learningOutcomeIds":["outcome-design-resource-dp"],"kind":"illustrative","language":"日本語・数式","omissions":["実行プログラムは省略。小例の手計算を示す。"],"environment":"紙と筆記具、または数式を評価できる計算機","input":"M=3、商品(P,V)=(1,5),(2,4),(2,4),(3,2)。","procedure":["最適X=9で集合{1,2}か{1,3}。","商品1なし最大4なので必須。","2と3はどちらを含む最適も含まない最適もある。","4を含む最大2で不使用。"],"executionTarget":null,"expectedResult":"ABBC","verificationStatus":"not_applicable","learningUnitIds":["unit-dp-subset-resource"]}],"exercises":[{"key":"transfer","learningOutcomeIds":["outcome-design-resource-dp"],"prerequisiteIds":["unit-dp-state-design"],"attainmentCondition":"同価値の商品2と3を一商品へまとめてよいか。","assessment":{"method":"理由・境界・反例を言葉や式で説明する。","successCondition":"不可。商品は個別に分類される。同値でも最適選択で交換できる別商品であり各Bを出す。"},"answer":{"reasoningOrVerification":"不可。商品は個別に分類される。同値でも最適選択で交換できる別商品であり各Bを出す。","procedure":["具体例の各状態・寄与を再計算する。","不可。商品は個別に分類される。同値でも最適選択で交換できる別商品であり各Bを出す。"],"expectedResult":"不可。商品は個別に分類される。同値でも最適選択で交換できる別商品であり各Bを出す。","verificationStatus":"passed"}}],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [資源・容量DP](src/content/docs/learn/dynamic-programming/dp-subset-resource.md)

- 資源軸の上限と更新順を選び、選択の重複を避けられる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [最小十分状態からDPを設計する](src/content/docs/learn/dynamic-programming/dp-state-design.md)

対象外:

- 使用済み要素集合そのものを状態とし、容量・個数の値軸を持たないDP。

## 考察

全商品の最適価値 X を得る選び方について、商品 i が必須か任意か不使用かは、i を除く prefix と suffix から X を作れるか、および X-V_i を容量 M-P_i で作れるかの二つで判定できる。 i を使わない場合は max_j pre[i-1][j]+suf[i+1][M-j]=X かどうかで存在が分かる。 i を使う場合は容量を M-P_i、目標価値を X-V_i に変えた同じ結合判定になり、二つの真偽が A/B/C を一意に決める。

採用する候補: 商品順・逆順の 0/1 knapsack DP を用意し、各 i で prefix と suffix の容量分割を全探索して、i を使わない最適解と使う最適解の存在を判定する。

i 以外の商品集合は prefix と suffix に分離でき、容量 j と残り容量の最適値の和を最大化すれば除外時の最適値を O(M) で復元できる。

棄却する候補: 商品を一つ除くたびに残り N-1 個で knapsack を最初から計算する。

一回 O(NM) の計算を N 回繰り返して O(N^2M) となり、N=1000、M=5×10^4 の上限では間に合わない。

i を使わない場合は max_j pre[i-1][j]+suf[i+1][M-j]=X かどうかで存在が分かる。

i を使う場合は容量を M-P_i、目標価値を X-V_i に変えた同じ結合判定になり、二つの真偽が A/B/C を一意に決める。

pre と suf に各側の商品だけで容量以下に得られる最大価値を保存する。X=pre[N][M] を求め、各 i について容量分割を走査して exclude と include の最大値を計算し、その X への一致から分類を出力する。

## 典型の発動条件

### prefix・suffix DP

発動条件: 各要素を一つ除いた最適化結果を全要素について求めたいとき。

除外位置の左右を独立に前計算し、境界で容量を分配して結合する。

### 0/1 knapsack の存在分類

発動条件: 最適値だけでなく特定要素が全最適解・一部・どれにも含まれないかを問うとき。

要素を含む場合と含まない場合の最適値を別々に再構成する。

## 問題固有の要素

最適解集合そのものを列挙せず、要素を固定して含む・除く二つの最適値だけで三分類できる。

別の問題へ持ち帰る視点: 全要素除外 query では、前後 DP を作って除外点で半群的に結合する設計を検討する。

## 正当性

iを除く集合はprefix側とsuffix側へ一意に分かれ、容量の分割を全探索すればexclude最大を得る。iを必ず含む場合は残容量M−P_iを同様に分け、V_iを足してinclude最大を得る。全体最適Xに対し、include<Xなら全最適で不使用、exclude<Xなら全最適で必須、両方Xなら包含と不包含の最適が各一つ存在し任意となる。両方がX未満は全解の二分に反するため生じない。

## 実装上の注意

- DP は価格ちょうどではなく容量以下の最大値として定義を統一する。配列二枚は大容量になるため整数幅とメモリ上限も見積もる。

## 復習の核

- include 判定で P_i,V_i を先に差し引く理由と、二つの存在判定から三分類が得られる真理値表を再現する。

## 計算量と制約

### 時間

商品 N、容量 M。pre/suf作成と各商品除外・包含の全容量分割走査で O(NM)。

### 空間

二表で O(NM)。64bit価値を二表とも持つと約16(N+1)(M+1) bytes。

### 制約との対応

公式制約の確認範囲: Time limit: 2.5 sec; Memory limit: 1024 MiB; Constraints: 1\leq N\leq 1000; 1\leq M\leq 5\times 10^4; 1\leq P_i\leq M; 1\leq V_i\leq 10^9; All input values are integers.

時間・空間の見積もりは、上記の採用手法全体（前処理と問い合わせを含む）についてのもの。入力規模を各パラメータへ代入して確認する。

## 具体例

M=3、商品(P,V)=(1,5),(2,4),(2,4),(3,2)。

1. 最適X=9で集合{1,2}か{1,3}。
2. 商品1なし最大4なので必須。
3. 2と3はどちらを含む最適も含まない最適もある。
4. 4を含む最大2で不使用。

期待される結果: ABBC

実行形式: 手計算による図示・追跡。プログラムの実行例ではない。

## 確認問題

同価値の商品2と3を一商品へまとめてよいか。

### 確認する観点

理由・境界・反例を言葉や式で説明する。

### 解答と理由

不可。商品は個別に分類される。同値でも最適選択で交換できる別商品であり各Bを出す。

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/editorial/15102) — source-abc441-editorial-15102-28425896fd55d61050cc6aeb46de7a52d0c3116cc9e1b0ef47eadf62bf6742e9
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc441/tasks/abc441_f) — source-abc441-f-problem-21139505370faa67bd29ae3b8aa686d4231b529a3e5b1a6341ca7f1e21f6a850
