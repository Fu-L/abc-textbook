---
title: "ABC450-E — Fibonacci String"
draft: true
authoringUnit: {"problemId":"abc450-e","docPath":"src/content/docs/problems/string-geometry/outcome-query-recursively-defined-string/outcome-query-recursively-defined-string-shard-001/abc450-e.md","learningOutcomeIds":["outcome-query-recursively-defined-string"],"baselineId":"prereq-abc-advanced-v1","baselineVersion":"1.0.0","additionalPrerequisiteUnitIds":[],"excludedTopics":["明示された文字列への接尾辞索引の構築。"],"tagIds":["tag-recursive-compressed-string"],"sourceRevisionIds":["source-abc450-e-problem-efc22d39ed734230017484cb7e87124414d20103212076eec2b5e102f889b523","source-abc450-editorial-17731-ba8f7af7a46ad94dd872c9507b5fa717441d510369ba60f4c58ebe189cfb4f11"],"skill":{"name":"abc-explanation-author","version":"1.1.1","digest":"6bd0cedbc6c90633f956c417ce3444db244ddea7555e936896075a507a3349fa"},"revision":2,"claims":[{"key":"correctness","text":"S_2はS_3のprefix、以後もS_{k−1}を先頭に連結するので、K≥2の代表列はS_{10^18}のprefixである。S_1についてはこの関係を仮定しない。Fの二分岐はn文字を左列内だけ、または左全体と右prefixへ一意に分ける。後者では左長<R_maxで飽和せずtotalもexactだから、飽和表でも同じ個数を得る。基底X,Yのprefix表からの帰納法でFは正しく、RとL−1の差が区間個数になる。","sourceRevisionIds":["source-abc450-e-problem-efc22d39ed734230017484cb7e87124414d20103212076eec2b5e102f889b523","source-abc450-editorial-17731-ba8f7af7a46ad94dd872c9507b5fa717441d510369ba60f4c58ebe189cfb4f11"],"authorId":"person-codex","verificationStatus":"verified"}],"examples":[],"exercises":[],"kind":"full","primaryProblemId":null,"differenceSummary":null}
---

## 学習の位置

体系上の位置: [圧縮・反復・再帰文字列へ問い合わせる](src/content/docs/learn/string/recursive-compressed-string.md)

- 圧縮・反復・再帰または入れ子で定義された文字列を展開せず、block長・対応区切り・作用から照会・変換・評価できる。

共通前提: prereq-abc-advanced-v1 1.0.0。

追加前提:

共通前提と本節で説明する内容。

対象外:

- 明示された文字列への接尾辞索引の構築。

## 考察

S_1=X,S_2=Y、k≥3でS_k=S_{k−1}+S_{k−2}である。S_2=YはS_3のprefixで、以後の列にも同じprefixが残る。S_1=XがS_2のprefixである保証はないので、query範囲を覆う代表列は必ずK≥2から選ぶ。

R_maxを全queryの最大右端とする。K=2から始め、len[K]≥R_maxとなるまでk≥3の長さを作る。各lenはmin(R_max,len[k−1]+len[k−2])にしてよい。例えばX=a,Y=b,R_max=1ならK=2であり、巨大添字の先頭はbである。K=1を選ぶとaを返してしまう。

X,Yそれぞれの26文字別prefix頻度を作り、total[k][c]=total[k−1][c]+total[k−2][c]もR_maxで飽和して保持する。F(k,n,c)をS_kの最初n文字にあるcの個数とし、F(k,0,c)=0、k=1,2では入力列のprefix表を返す。k≥3では

```text
n≤len[k−1]: F(k,n,c)=F(k−1,n,c)
それ以外:  F(k,n,c)=total[k−1][c]+F(k−2,n−len[k−1],c)
```

とする。後者に入るときlen[k−1]<n≤R_maxだから、その左列の長さも文字数も飽和していない。従って完全な左列を加える値はexactである。長さがR_maxへ達した列ではその後の連結を作る必要はない。代表列KのprefixはS_{10^18}と一致するので、各queryの答えはF(K,R,c)−F(K,L−1,c)。

一queryでは一つの文字cだけをたどればよい。再帰の各段はkを一つ以上減らし、長さはFibonacci的に増えるためK=O(log R_max)、前計算O(|X|+|Y|+log R_max)、query O(log R_max)となる。

## 典型の発動条件

### 再帰的連結文字列の prefix query

発動条件: 文字列が過去二項の連結で巨大化し、短い prefix の統計だけ必要なとき。

長さと全体統計を持ち、所属する連結片へ再帰する。

### 長さの飽和前計算

発動条件: 再帰列の長さが整数上限を越えるが query 上限だけ比較に使うとき。

必要最大値で cap して overflow を避ける。

## 問題固有の要素

巨大再帰 object も、query 位置を含むまでの浅い構築木と完全 subtree の集約値だけで探索できる。

別の問題へ持ち帰る視点: 区間 query を prefix 差へ統一すると、連結境界をまたぐ場合分けが一方向になる。

## 正当性

S_2はS_3のprefix、以後もS_{k−1}を先頭に連結するので、K≥2の代表列はS_{10^18}のprefixである。S_1についてはこの関係を仮定しない。Fの二分岐はn文字を左列内だけ、または左全体と右prefixへ一意に分ける。後者では左長<R_maxで飽和せずtotalもexactだから、飽和表でも同じ個数を得る。基底X,Yのprefix表からの帰納法でFは正しく、RとL−1の差が区間個数になる。

## 実装上の注意

- Kは必ず2から探す。XとYが異なる一文字、query [1,1]で代表列の誤りを確認できる。
- prefix n=0は0。lenとtotalをR_maxで飽和するが、完全左列を足す分岐で必要な値は未飽和である。
- 長さの加算と全出力は64bit整数で扱う。一queryは要求文字cのscalarだけで計算する。

## 復習の核

- prefix が前半内・前半を全て含み後半へ入る二ケースを実際の S_3,S_4 で追い、query 上限までの K で十分な理由を説明する。

## 計算量と制約

### 時間

O(|X|+|Y|+Q log Rmax)。Fibonacci長さのため再帰深さO(log Rmax)。

### 空間

O(|X|+|Y|+26 log Rmax)。

### 制約との対応

公式制約の確認範囲: Time limit: 2 sec; Memory limit: 1024 MiB; Constraints: X and Y are strings of lowercase English letters of length between 1 and 10^4, inclusive.; 1 \leq Q \leq 10^5; 1 \leq L_i \leq R_i \leq 10^{18}; C_i is a lowercase English letter.; All given numerical values are integers.

## 出典

- [公式問題（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/tasks/abc450_e) — source-abc450-e-problem-efc22d39ed734230017484cb7e87124414d20103212076eec2b5e102f889b523
- [個別公式解説（2026-07-24T23:59:30+09:00確認）](https://atcoder.jp/contests/abc450/editorial/17731) — source-abc450-editorial-17731-ba8f7af7a46ad94dd872c9507b5fa717441d510369ba60f4c58ebe189cfb4f11
