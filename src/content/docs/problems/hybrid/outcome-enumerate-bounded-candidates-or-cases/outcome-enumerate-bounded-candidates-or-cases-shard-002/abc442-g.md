---
title: "ABC442-G — Lightweight Knapsack"
draft: true
authoringUnit: {"problemId":"abc442-g","docPath":"src/content/docs/problems/hybrid/outcome-enumerate-bounded-candidates-or-cases/outcome-enumerate-bounded-candidates-or-cases-shard-002/abc442-g.md","learningOutcomeIds":["outcome-enumerate-bounded-candidates-or-cases"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。"],"tagIds":["tag-bounded-enumeration"],"sourceRevisionIds":["source-abc442-editorial-15137-f9062b3b9b33f08c57c2c63af857ea694d32c7f63bab8f599644261528074d25","source-abc442-g-problem-786c4b7e64b2b3683fa610e7c89bbca283ff887a211e5bcba2c472babb3f0e46"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"同じ重さでは価値の低い品物を高い未採用品物へ交換しても重量を変えず利得を減らさないので、最適解は重さ別のprefixとして選べる。F_wの剰余R_wは36枝の一つに一意に属する。固定枝では先頭R_w個と、以後の完全な重量6groupを各重さからprefixで選ぶ問題になる。\n\n連続groupの利得は非増加なので、三列の上位Q個を選ぶと、同じ列の後のgroupより前のgroupが先に選ばれ、prefix制約を保つ。同利得では列内の先頭を優先すればよい。全groupが同じ重量だからこの選択が枝の最大である。run処理は展開した列をg個ずつ切る処理と同じで、境界をまたぐ一組と同値の完全groupを個数付きで保存する。従ってK_iの大きさに依らず同じ最適値を得て、全剰余枝の最大が答え。","sourceRevisionIds":["source-abc442-editorial-15137-f9062b3b9b33f08c57c2c63af857ea694d32c7f63bab8f599644261528074d25","source-abc442-g-problem-786c4b7e64b2b3683fa610e7c89bbca283ff887a211e5bcba2c472babb3f0e46"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [候補数を界して全列挙・有限case分解する](src/content/docs/learn/modeling/bounded-enumeration.md)

- 制約・生成パラメータ・固定選択数・有限caseから候補総数を界し、漏れなく全候補を生成・評価できる。

この解説で扱わないこと:

- 探索空間を二つへ分けて照合するmeet-in-the-middle、および再帰部分問題へ分ける分割統治。

## 考察

Nは品物の種類数であり、各種類がK_i個ずつある。K_i≤10^9なので個々の品物や重量6の組を展開してはいけない。各重さw=1,2,3について、(価値v,個数k)のrunを価値降順に並べる。同じ重さなら上位から選ぶのが最適で、選ぶ総個数F_wだけで利得が決まる。

F_w=R_w+(6/w)Q_wと分ける。R_1=0,…,5、R_2=0,…,2、R_3=0,…,1の36通りを固定すると、先頭R_w個は必ず選び、残りの採用単位は重量6となる。R_wが所持総数を超える枝、先頭分の総重量ΣwR_w>Cの枝は捨てる。

各枝では、先頭R_w個をrunの個数から引き、その利得をbaseに足す。残りはg=6/w個ずつの連続groupへまとめる。展開せず、未完成groupの個数cnt<gと価値和sumを持ち、各run(v,k)を次の順で処理する。

```text
cnt>0なら:
  t=min(k,g−cnt)個を消費し、cnt+=t,sum+=v*t,k-=t
  cnt<gなら次の元runへ進む
  cnt=gなら価値sum,個数1のgroupを出し、cnt=sum=0
残るkから:
  floor(k/g)>0なら価値g*v,個数floor(k/g)のgroup runを出す
  cnt=k mod g、sum=v*cntを次のrunへ持ち越す
```

未完成groupがまだ埋まらない場合は次のrunへ進む。末尾のcnt<gだけは捨てる。一つの元runから出るgroup runは高々二つで、巨大なkでも処理は定数回である。

元の価値が非増加だから、連続するg個の和も非増加。このため三つのgroup列を価値降順にmergeし、残り容量の個数上限Q=floor((C−ΣwR_w)/6)個を上位から取れば、各重さのgroupも必ずprefixとして選ばれる。run価値v、個数kに対してt=min(Q,k)だけbaseへv*tを加え、Qをt減らす。group runを全てsortしてから同じ処理をしてもO(N log N)でよい。価値は全て正なので容量内で取れるgroupを取る。

例えば一種類(W,V,K)=(1,7,10^9)、C=8なら、R_1=2の枝で先頭利得14、残りは価値42のgroup runが166666666個となる。そのrunから一個だけ取って答え56。他のrunを実体化する必要はない。36枝の最大を答える。

## 典型の発動条件

### 共通重量への剰余分解

発動条件: 重量が少数の小さい整数で、容量が巨大である。

重量のLCMで選択個数を剰余と商へ分ける。少数の剰余を固定すると、商の単位を共通重量へそろえられる。価値非増加のgroup列なら上位からの選択がprefix制約も守る。

### 多重度を保った圧縮走査

発動条件: 同じ価値がK_i個あり、K_iを展開できない。

未完成groupだけを端数として持ち、同値の完全groupは(価値,個数)でまとめる。選択も個数単位で消費する。

## 問題固有の要素

容量 DP を回す代わりに、少数重量の lcm を一単位として個数の端数だけ全探索する。

別の問題へ持ち帰る視点: 同重量の選択では、各個数に対する最適集合が価値降順 prefix になる性質を徹底して使う。

## 正当性

同じ重さでは価値の低い品物を高い未採用品物へ交換しても重量を変えず利得を減らさないので、最適解は重さ別のprefixとして選べる。F_wの剰余R_wは36枝の一つに一意に属する。固定枝では先頭R_w個と、以後の完全な重量6groupを各重さからprefixで選ぶ問題になる。

連続groupの利得は非増加なので、三列の上位Q個を選ぶと、同じ列の後のgroupより前のgroupが先に選ばれ、prefix制約を保つ。同利得では列内の先頭を優先すればよい。全groupが同じ重量だからこの選択が枝の最大である。run処理は展開した列をg個ずつ切る処理と同じで、境界をまたぐ一組と同値の完全groupを個数付きで保存する。従ってK_iの大きさに依らず同じ最適値を得て、全剰余枝の最大が答え。

## 実装上の注意

- 元runとgroup runは個数付きで保持し、K_i回のループを作らない。先頭R_w個の除去ではrunをまたいでも高々5個だけを消費する。
- R_wが所持総数を超える枝と残容量が負の枝は無効。末尾の不完全groupは採用しない。各枝の作業列は元のrunのコピーから作る。
- ΣK_i≤2×10^14は個数用64bitに収まる。選択重量はC≤2×10^9で、採用価値はC·10^9≤2×10^18。全所持品の価値総和を先に計算すると64bitを超え得るので、採用分だけ加える。

## 復習の核

- F_i の商・剰余分解を書き、各 group の重量が本当に6で、価値上位 group の prefix が最適になることを示す。

## 計算量と制約

### 時間

O(N log N)。重さ別runのsort後、36枝ごとにO(N)個の圧縮group runを作り、三列mergeと個数単位の消費をO(N)で行う。group runの全sort版でも36は定数なのでO(N log N)。ΣK_iやCに比例する走査は行わない。

### 空間

O(N)。元の価値・個数runと、一枝分の高々O(N)group runを保持する。

### 制約との対応

公式制約の確認範囲: Time limit: 4 sec; Memory limit: 1024 MiB; Constraints: 1\leq N \leq 2\times 10^5; 1\leq C \leq 2\times 10^9; 1\leq W_i \leq 3; 1\leq V_i \leq 10^9; 1\leq K_i \leq 10^9; All input values are integers.

## 出典

- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc442/editorial/15137) — source-abc442-editorial-15137-f9062b3b9b33f08c57c2c63af857ea694d32c7f63bab8f599644261528074d25
- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc442/tasks/abc442_g) — source-abc442-g-problem-786c4b7e64b2b3683fa610e7c89bbca283ff887a211e5bcba2c472babb3f0e46
