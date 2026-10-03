---
title: "ABC418-F — We're teapots"
draft: true
authoringUnit: {"problemId":"abc418-f","docPath":"src/content/docs/problems/data-structures/outcome-design-associative-range-summary/outcome-design-associative-range-summary-shard-002/abc418-f.md","learningOutcomeIds":["outcome-design-associative-range-summary"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-ordered-set-multiset"],"excludedTopics":["区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-range-monoid-aggregation","tag-ordered-set-multiset"],"sourceRevisionIds":["source-abc418-editorial-13626-7b22a94fd013f7f050961852897a733c49ad51c660ebfcd71d272c56a57fd8b6","source-abc418-f-problem-0dd69620bcc18403d81b76c9df85aa3b6d929eacf105e40fb1bc9060f727e07a"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"active間のcoffee個数差は元のprefix条件と同値であり、各位置をちょうど一つの区間へ所属させる。端点のtea/coffeeを固定すると、隣接禁止で自由位置を除いた残りをHで一度数えられる。n=1,2では強制位置の重複を別扱いするので境界でも正しい。row vectorと行列の積で境界状態の全接続を足し合わせ、最後の自由suffixをfibで合成した回答式が全合法配置数になる。activeの挿入・削除ではxと直後の区間だけが変わるので、この二葉の再計算で積の不変量を維持できる。","sourceRevisionIds":["source-abc418-editorial-13626-7b22a94fd013f7f050961852897a733c49ad51c660ebfcd71d272c56a57fd8b6","source-abc418-f-problem-0dd69620bcc18403d81b76c9df85aa3b6d929eacf105e40fb1bc9060f727e07a"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [区間monoid要約](src/content/docs/learn/query/range-monoid-aggregation.md)

- 要約する値・単位元・結合的な合成規則を定義し、prefix fold・Segment Tree・SWAGで答えを求められる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)

対象外:

- 区間monoid要約の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

prefixのcoffee数が指定されている位置だけをactiveとする。隣接active p<iの間では位置p+1,…,iのcoffee数r=a_i−a_pが固定される。区間同士は境界のtea/coffeeだけで依存するので、二状態の行列へまとめられる。coffeeが隣接しないn位置へr個置く数をH(n,r)=C(n−r+1,r)とする。n≥0、0≤r≤ceil(n/2)以外は0、H(0,0)=1。選択位置から2件目以降の前の余白を一つずつ除く全単射がこの式を与える。

F(n,r)[s,t]は前端位置pがs（tea=0,coffee=1）、後端iがtで、間のn=i−p位置へr個coffeeを置く数。n≥3なら

F00=H(n−1,r)、F01=H(n−2,r−1)、F10=H(n−2,r)、F11=H(n−3,r−1)。

後端coffeeならrから一つ引き、その左隣をteaに固定する。前端coffeeなら区間先頭をteaにするので、それぞれ自由な位置が減る。短い区間ではこれらの強制teaが重なるため別に定義する。

```text
n=1: F=[[ [r=0], [r=1] ], [ [r=0], 0 ]]
n=2: F=[[H(1,r), H(0,r−1)], [H(0,r), H(0,r−1)]]
```

特にn=1のF11は隣接coffeeになるので0。r<0など不可能な差なら全成分0となる。

a_0=0をsentinelとし、active iの葉へ、直前active pに対応するF(i−p,a_i−a_p)を置く。inactiveの葉は単位行列。row vectorを左から掛ける規約で、初期(1,0)へactive順の行列積Mを掛ける。最後のactiveをk（なければ0）、残り長m=N−kとする。制約なしsuffixの非隣接選択数をfib[0]=1,fib[1]=2,fib[m]=fib[m−1]+fib[m−2]とすれば、回答は

M00·fib[m]+M01·fib[max(m−1,0)]。

前端teaならm位置が自由で、coffeeなら次の一位置をteaにする。m=0ではどちらの終端状態も一通りである。

更新a_x←yでは、現在のactive xをいったん削除して葉を単位行列に戻し、次のactiveの葉を新しい前端から再計算する。y≠−1ならxを挿入して、その葉と次activeの葉を再計算する。前後activeはordered setから得る。影響はxと直後だけなのでO(log N)。毎回全prefixを再DPするO(NQ)以上の方法を、この区間依存の局所性で避けられる。

## 典型の発動条件

### 境界状態のtransfer matrix

発動条件: 列を区間分割したとき、隣接禁止の依存が左右endpointの有限状態だけに残るとき。

各制約間をtea/coffeeの2×2matrixにし、順序積で全prefixを合成する。

### 動的非可換積segment tree

発動条件: 列中の少数matrixが点更新され、全順序積を毎回求めたいとき。

identityをinactive位置に置き、mergeをleftMatrix×rightMatrixとする。

### ordered setの前後制約

発動条件: active indexの追加削除で隣接区間分割だけが変化するとき。

predecessor/successorを探し、該当二matrixを張り替える。

## 問題固有の要素

prefix count制約を差分区間のexact coffee数へ変え、隣接禁止の跨ぎ情報をendpoint二bitだけに圧縮する。

別の問題へ持ち帰る視点: 動的prefix制約ではactive制約間のtransferを辺とみなし、頂点挿入削除が隣接辺だけを変更する構造を使う。

## 正当性

active間のcoffee個数差は元のprefix条件と同値であり、各位置をちょうど一つの区間へ所属させる。端点のtea/coffeeを固定すると、隣接禁止で自由位置を除いた残りをHで一度数えられる。n=1,2では強制位置の重複を別扱いするので境界でも正しい。row vectorと行列の積で境界状態の全接続を足し合わせ、最後の自由suffixをfibで合成した回答式が全合法配置数になる。activeの挿入・削除ではxと直後の区間だけが変わるので、この二葉の再計算で積の不変量を維持できる。

## 実装上の注意

- H(0,0)=1、不可能なcoffee数は0。n=1,2を別扱いし、負の長さをbinomialへ渡さない。
- row vector規約なので木の結合は左行列×右行列。sentinel位置0はteaでcoffee数0。
- 最後のactiveがなくてもk=0、全行列が単位元となりfib[N]を返す。削除後と挿入後のsuccessorを再計算する。

## 復習の核

- active制約なし、一点制約、矛盾するcount差、隣接二indexをともにcoffee指定、制約解除で区間が再結合する例を全bit列挙と比較する。

## 計算量と制約

### 時間

前計算O(N)、Q更新O(Q log N)、固定2×2行列。

### 空間

O(N)、階乗・逆階乗・fib・制約木。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 2 \leq N \leq 2 \times 10^5; 1 \leq Q \leq 2 \times 10^5; 1 \leq X_j \leq N (1 \leq j \leq Q); -1 \leq Y_j \leq X_j (1 \leq j \leq Q); All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/editorial/13626) — source-abc418-editorial-13626-7b22a94fd013f7f050961852897a733c49ad51c660ebfcd71d272c56a57fd8b6
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc418/tasks/abc418_f) — source-abc418-f-problem-0dd69620bcc18403d81b76c9df85aa3b6d929eacf105e40fb1bc9060f727e07a
