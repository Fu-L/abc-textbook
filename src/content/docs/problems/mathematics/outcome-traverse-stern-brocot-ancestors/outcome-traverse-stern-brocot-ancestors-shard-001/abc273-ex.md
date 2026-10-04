---
title: "ABC273-EX — Inv(0,1)ving Insert(1,0)n"
draft: true
authoringUnit: {"problemId":"abc273-ex","docPath":"src/content/docs/problems/mathematics/outcome-traverse-stern-brocot-ancestors/outcome-traverse-stern-brocot-ancestors-shard-001/abc273-ex.md","learningOutcomeIds":["outcome-traverse-stern-brocot-ancestors"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-gcd-structure","unit-ordered-set-multiset","unit-recursive-divide-and-conquer","unit-small-to-large"],"excludedTopics":["分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。"],"tagIds":["tag-stern-brocot-ancestry","tag-ordered-set-multiset","tag-recursive-divide-and-conquer","tag-small-to-large"],"sourceRevisionIds":["source-abc273-ex-problem-93198a1b6850bd94a16aeea7cfeb76b7975a6238de7d77b71cb512114ab770ba","source-abc273-editorial-5032-bc0318e516e79abcb7e6f917516307bfad40b3d3d8298f2167fdcdf49ab74598"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"原始pairのfractionはStern–Brocot木に一意に現れ、生成に必要な操作はその祖先node集合である。各nodeが区間Tに必要かはT内targetの存在だけで決まる。位置集合Pを含まないsubarrayはP間のgap内に限るので、全subarray数から各gapの三角数を引けばそのnodeの寄与になる。片側しかtargetを持たない連続祖先は位置集合が同じため長さを掛けて圧縮できる。","sourceRevisionIds":["source-abc273-ex-problem-93198a1b6850bd94a16aeea7cfeb76b7975a6238de7d77b71cb512114ab770ba","source-abc273-editorial-5032-bc0318e516e79abcb7e6f917516307bfad40b3d3d8298f2167fdcdf49ab74598"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [Stern–Brocot木の経路と祖先](src/content/docs/learn/number-theory/stern-brocot-ancestry.md)

- 隣接分数の行列式が1であることを保ち、mediantとEuclidの商列からStern–Brocot木の経路を同方向の連続回数へ圧縮する。経路の共通prefixで祖先関係と必要な祖先集合を求める。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

先に読む単元:

- [gcd不変量・差分構造](src/content/docs/learn/number-theory/gcd-structure.md) — 差・周期・range条件に共通するgcd不変量を抽出し、共通因子や剰余classを分離する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md) — 比較順を保つ集合でpredecessor/successor・極値・重複・二集合のk-smallest aggregateを更新する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [再帰分割・分割統治](src/content/docs/learn/modeling/recursive-divide-and-conquer.md) — pivot・bit・時刻区間・積木で部分問題へ再帰分割し、部分結果を重複なく合成する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。
- [small-to-large・DSU on Tree](src/content/docs/learn/modeling/small-to-large.md) — 小さいcontainerを大きいcontainerへ併合する。要素を保持する場合は所属サイズの倍増、重複を消すsetでは生存要素のサイズ増大と消滅要素への課金、分割では小さい側の半減を用いて総仕事量を証明する。その発動条件と正当化原理を比較可能な独立教材として学ぶ。

この解説で扱わないこと:

- 分母制約の下で最良近似を選ぶ問題は「連分数・Stern–Brocotで有理近似する」で扱う。本Unitでは同じ分数の境界表現を、木上の経路と祖先関係へ利用する。

## 考察

隣接pairsの和を挿入する操作はStern–Brocot treeのinterval nodeでmediantを生成する操作そのもので、追加可能な(p,q)はprimitive pair gcd(p,q)=1である。

あるStern–Brocot interval nodeの操作がsubarray Tに必要なのは、そのopen interval内にTのtarget fractionが一つ以上存在するときである。

棄却する候補: 各subarrayについて必要なfractionsを一つずつStern–Brocot tree上で辿り、操作集合のunion sizeを求める。

subarrayがΘ(N^2)個あり、単一fractionのdepthも座標値に比例し得る。

採用する候補: 全targetsをfraction順にStern–Brocot intervalへ再帰分割し、各nodeを必要とするposition集合からsubarray数を数え、unary descentはまとめてskipする。

必要なtree部分だけを圧縮構築し、position setsをsmall-to-large mergeすることで全nodesの寄与を集約できる。

node interval内targetのoriginal indicesをsorted set Pとすると、そのnodeが必要なsubarraysは全subarraysからPを一つも含まないindex-gap内subarraysを引いて求められる。

片側にしか目標がない間は、端の目標との厳密比較から最大run長を直接商計算し、同じposition集合の寄与をその長さ倍して一括加算する。

mediant insertion costをcompressed Stern–Brocot trie上のancestor-union countへ写し、ordered-position set mergingで全consecutive subarraysへのnode寄与を合計する。

### 一方向runの止め方と操作数

現在の境界をa/b<c/d、目標をその開区間内に持つ。右へk回進めると左境界は(a+kc)/(b+kd)になる。全目標を子へ残すには、この新境界が最小目標p/qより厳密に小さいことが必要である。目標を正の残余座標で(p,q)=P(a,b)+Q(c,d)と表す。境界の行列式bc−ad=1からP=cq−dp、Q=bp−aqであり、右runはP一定・Q←Q−kPとなるため最大k=floor((Q−1)/P)。左runは最大目標を使いk=floor((P−1)/Q)。端点と目標の交差積から直接商を得れば、各runで二分探索は要らない。

k回の移動で飛ばすのは、その各移動前のinterval nodeの生成操作k個である。移動後のmediantに等しい目標があれば、そのnodeの操作を別に一回数え、等しい目標を子へ送らず取り除く。例えば(1,1),(3,1)では、根で1/1を生成し、残る3/1のため右へ移る。次に2/1の生成を一回飛ばし、3/1を生成する一回を数える。3/1を作る操作は3回で、根からの右移動2回とは一つ違う。

0/1と1/0は初めから存在するため操作を要しない。ただしgcd=1の有効位置としてrun内に残し、他の目標を含む部分配列がその位置まで伸びる場合も集計する。木へは正の有限目標だけを送る。

## 典型の発動条件

### Stern–Brocot treeと連分数的skip

発動条件: coprime positive pairsがmediant operationsで生成され、naive tree depthが座標値まで伸びるとき。

各nodeでtargetsを左右へ再帰分割し、全targetsが同じ側にある最大連続step数はinterval boundsからまとめて進める。

### position集合のsmall-to-large merge

発動条件: 再帰tree各nodeでdescendant itemsのoriginal positions集合に依存する統計を求めたいとき。

小さいordered setを大きいsetへ挿入し、隣接gapの変化からnodeのsubarray coverageを維持する。

## 問題固有の要素

非primitive pairを含むsubarrayは実現不能でf=0なので、primitive targetsだけからなる連続区間を独立に処理し、invalid positionを境界にする。

別の問題へ持ち帰る視点: 定義がimpossible caseを0にする集計では、invalid elementを含むrangesを単に除外し、valid runsへ分割する。

## 正当性

原始pairのfractionはStern–Brocot木に一意に現れ、生成に必要な操作はその祖先node集合である。各nodeが区間Tに必要かはT内targetの存在だけで決まる。位置集合Pを含まないsubarrayはP間のgap内に限るので、全subarray数から各gapの三角数を引けばそのnodeの寄与になる。片側しかtargetを持たない連続祖先は位置集合が同じため長さを掛けて圧縮できる。

## 実装上の注意

- fraction比較とbound更新のcross productsは10^18級となるため十分な整数幅を使い、q=0のinfinite endpointを別扱いする。
- position追加時は所属valid runの両端をsentinelとしてgap contributionを更新し、subarrayをrun外へ広げて数えない。

## 復習の核

- 生成操作がmediantなら、各targetまでの共通操作列をStern–Brocot treeのancestor setsとして共有する。
- implicit treeの長いunary chainは、一方へ分岐し続ける最大stepを数論式でまとめて進める。

## 計算量と制約

### 時間

V=max(a_i,b_i)+1。各目標の方向runはEuclidの商列でO(log V)個なので、直接商計算による圧縮木構築はO(N log V)。分岐でのsmall-to-large併合は各位置O(log N)回、ordered set挿入O(log N)からO(N log²N)。unary部分は同じ集合を使い回し、全体O(N log V+N log²N)。

### 空間

O(N log V)。圧縮nodeと位置集合。

### 制約との対応

公式制約の確認範囲: Time limit: 6 sec; Memory limit: 1024 MiB; Constraints: 1 \le N \le 10^5; 0 \le a_i,b_i \le 10^9; a_i \neq a_j or b_i \neq b_j, if i \neq j.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/tasks/abc273_h) — source-abc273-ex-problem-93198a1b6850bd94a16aeea7cfeb76b7975a6238de7d77b71cb512114ab770ba
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc273/editorial/5032) — source-abc273-editorial-5032-bc0318e516e79abcb7e6f917516307bfad40b3d3d8298f2167fdcdf49ab74598
