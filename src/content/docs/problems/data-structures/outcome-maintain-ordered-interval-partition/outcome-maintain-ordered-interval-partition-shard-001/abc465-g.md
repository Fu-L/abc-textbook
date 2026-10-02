---
title: "ABC465-G — Sum of Mex of Mod of Linear"
draft: true
authoringUnit: {"problemId":"abc465-g","docPath":"src/content/docs/problems/data-structures/outcome-maintain-ordered-interval-partition/outcome-maintain-ordered-interval-partition-shard-001/abc465-g.md","learningOutcomeIds":["outcome-maintain-ordered-interval-partition"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":["unit-coordinate-compression","unit-ordered-set-multiset","unit-prefix-aggregate"],"excludedTopics":["端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。"],"tagIds":["tag-ordered-interval-partition","tag-coordinate-compression","tag-prefix-difference"],"sourceRevisionIds":["source-abc465-editorial-22419-6f16f7f7fa142fb44e1fb7d89af7011ae47ba54d3a47bd611a97a3cadced6d0f","source-abc465-g-problem-c6ddec64bca1758e34afa0ef7fcf471fc418429836f6db580b326fc8c5c58601"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"mexはstart xから連続して存在する剰余の個数であり、同じstartになるkをc_xでまとめるとΣc_xd_xとなる。c_xの合同式はgで割った法m上の一意な解の周期を数えている。出現座標Pは全操作中のSを包含するので、runの区間和をP上のprefixから得ても値を落とさない。挿入前の左runのstartはxで止まり、挿入後はr+1で止まるため距離の増加が一様で、差分式が成立する。削除は逆操作。全周では全てのkのmex=Mなので別式KMが必要である。","sourceRevisionIds":["source-abc465-editorial-22419-6f16f7f7fa142fb44e1fb7d89af7011ae47ba54d3a47bd611a97a3cadced6d0f","source-abc465-g-problem-c6ddec64bca1758e34afa0ef7fcf471fc418429836f6db580b326fc8c5c58601"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [端点更新型のrun分割管理](src/content/docs/learn/query/ordered-interval-partition.md)

- 互いに素な同値区間を左端順setで持ち、境界split・局所merge・range eraseでrun構造を動的管理する。その発動条件、正当性、計算量を説明し、未知問へ実装できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

- [疎なkeyの順序を保ってdense indexへ圧縮する](src/content/docs/learn/modeling/coordinate-compression.md)
- [ordered set・multisetの動的順序管理](src/content/docs/learn/query/ordered-set-multiset.md)
- [一次元・二次元累積和と差分で区間情報を線形化する](src/content/docs/learn/query/prefix-aggregate.md)

対象外:

- 端点更新型のrun分割管理の発動条件・不変量を使わず、実装部品だけを偶然共有する解法。

## 考察

値の出現回数freq[x]を管理し、S={x:freq[x]>0}を円環上の連続run集合として持つ。query A_i→Xは、旧値のfreqが1→0のときだけ削除、新値が0→1のときだけ挿入を行う。重複値の変更を毎回toggleするのは誤りである。

c_xを0≤k<KかつCk+x≡0 mod Mを満たすkの個数とする。start x=−Ck mod Mから円環上でSに入り続ける長さd_xがmexに等しい。ただし全周Sではmex=M。非全周では欠ける値で止まり、答えはΣ_x c_x d_xとなる。

c_xは固定で、初期値と全queryの新値を集めた座標集合P（サイズJ=O(N+Q)）上だけ計算すればよい。g=gcd(C,M), m=M/gとする。g∤xならc_x=0、そうでなければ(C/g)k≡−x/g mod mの最小非負解k0を逆元で求め、k0<Kならc_x=1+⌊(K−1−k0)/m⌋、他は0。m=1（C=0を含む）では逆元を使わずk0=0。sortしたPにc_xとx c_xのprefixを作る。P外の値は一度も出現しないため、それを含むrunは作られない。

非全周run [l,r]の寄与は(r+1)Σ_{x=l}^r c_x−Σ_{x=l}^r x c_x。0を跨ぐrunは二倍座標でx+Mを使い、cは周期Mで複製する。run端はordered setで管理する。

欠けていたxを挿入し左右のrunを[l,x−1]と[x+1,r]とすると、start t∈[l,x]のd_tだけがr−x+1増えるため、差分は(r−x+1)Σ_{t=l}^x c_t。片側runが空でも同式を使える。削除は削除後の左右runでこの差分を引く。差分を求める区間端はxや現在run端であり、P内なのでprefixの添字も保持できる。

全周になったときの答えはKM。一つだけzが欠ける状態なら、d_x=(z−x mod M)であるためΣc_x d_xをprefixのΣcとΣxcから計算する。全周との出入りはこの式で直接処理し、通常の左右runが同一になるケースへmerge式を適用しない。M=1でも空集合の答え0と全周KMで処理できる。

## 典型の発動条件

### 円環runの動的merge・split

発動条件: subset toggleで連続区間長由来の総和を維持したいとき。

前後neighborから局所runだけを削除・追加する。

### 固定weightの区間moment

発動条件: run内で距離に一次なweight総和を繰り返し求めるとき。

query座標と必要境界をsort-uniqueしてdense indexへ写し、Σc_xとΣxc_xのprefixから閉形式寄与を得る。

## 問題固有の要素

mexの各queryを直接追わず、start剰余ごとの連続被覆長d_xへ二重和を交換する。

別の問題へ持ち帰る視点: dynamic binary circleのglobal統計は、run寄与関数が区間momentで計算できれば局所merge/splitだけで維持できる。

## 正当性

mexはstart xから連続して存在する剰余の個数であり、同じstartになるkをc_xでまとめるとΣc_xd_xとなる。c_xの合同式はgで割った法m上の一意な解の周期を数えている。出現座標Pは全操作中のSを包含するので、runの区間和をP上のprefixから得ても値を落とさない。挿入前の左runのstartはxで止まり、挿入後はr+1で止まるため距離の増加が一様で、差分式が成立する。削除は逆操作。全周では全てのkのmex=Mなので別式KMが必要である。

## 実装上の注意

- 出現回数を持ち、0↔1の境界だけで集合を変える。全周・一欠け・M=1を通常run式から分ける。合同式はC=0と法m=1を分岐する。Σxcの中間値は答え以上に大きくなるので128bit等で計算する。

## 復習の核

- 一runが各startのd_xへ作る寄与を式にし、点toggleの四つの左右在否caseで旧新run差を確認する。

## 計算量と制約

### 時間

前処理O((N+Q)log(N+Q)+(N+Q)log M)、全Q更新O(Q log(N+Q))。同じ(C,M)のgcdと逆元は一度求め、各座標のcを求める。run端の探索はordered set、区間のprefix添字は圧縮座標から取得する。

### 空間

O(N+Q)。出現回数、全出現座標、二種類のprefix、円環run集合。

### 制約との対応

公式制約の確認範囲: Time limit: 3 sec; Memory limit: 1024 MiB; Constraints: 1\le N\le 2\times 10^5; 0\le C < M \le 10^9; 1\le K\le 10^9; 0\le A_i < M; 1\le Q\le 2\times 10^5; 1\le i_q \le N; 0\le X_q < M; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/editorial/22419) — source-abc465-editorial-22419-6f16f7f7fa142fb44e1fb7d89af7011ae47ba54d3a47bd611a97a3cadced6d0f
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc465/tasks/abc465_g) — source-abc465-g-problem-c6ddec64bca1758e34afa0ef7fcf471fc418429836f6db580b326fc8c5c58601
